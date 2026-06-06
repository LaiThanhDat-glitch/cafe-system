const prisma = require("../prisma/client");
const { emitLowStock } = require("../socket/socketManager");

const INTERNAL_SUPPLIER_ID = "NCC_NOI_BO";

const isLowStock = (ingredient) =>
  ingredient.tonKho <= (ingredient.tonKhoToiThieu ?? 10);

const checkAndEmitLowStock = async (ingredient) => {
  if (isLowStock(ingredient)) emitLowStock(ingredient);
};

const aggregateConsumption = (orderItems) => {
  const map = new Map();
  for (const line of orderItems) {
    for (const dm of line.mon?.dinhMuc || []) {
      const needed = dm.soLuongTieuHao * line.soLuong;
      const prev = map.get(dm.maNguyenLieu) || {
        maNguyenLieu: dm.maNguyenLieu,
        soLuong: 0,
        donGia: Number(dm.nguyenLieu?.giaNhap || 0),
        tenNL: dm.nguyenLieu?.tenNL,
      };
      prev.soLuong += needed;
      map.set(dm.maNguyenLieu, prev);
    }
  }
  return [...map.values()].filter((i) => i.soLuong > 0);
};

/**
 * Trừ kho tự động theo định mức khi đơn hàng thanh toán thành công.
 */
const deductInventoryForOrder = async (tx, { maDonHang, maNhanVien }) => {
  const order = await tx.donHang.findUnique({
    where: { maDonHang },
    include: {
      chiTiet: {
        include: {
          mon: {
            include: {
              dinhMuc: { include: { nguyenLieu: true } },
            },
          },
        },
      },
    },
  });

  if (!order || order.daTruKho) return null;

  const items = aggregateConsumption(order.chiTiet);
  if (items.length === 0) {
    await tx.donHang.update({
      where: { maDonHang },
      data: { daTruKho: true },
    });
    return null;
  }

  const existing = await tx.phieuKho.findFirst({
    where: { maDonHang, loaiPhieu: "BAN_HANG" },
  });
  if (existing) return existing;

  const tongGiaTri = items.reduce(
    (s, i) => s + i.soLuong * i.donGia,
    0,
  );

  const phieu = await tx.phieuKho.create({
    data: {
      thoiGianLap: new Date(),
      tongGiaTri,
      loaiPhieu: "BAN_HANG",
      maNhanVien: maNhanVien || order.maNhanVien || "NV_MANAGER01",
      maDonHang,
      ghiChu: `Tự động trừ kho theo đơn hàng ${maDonHang}`,
      chiTiet: {
        create: items.map((i) => ({
          maNguyenLieu: i.maNguyenLieu,
          soLuongThucTe: i.soLuong,
          donGia: i.donGia,
        })),
      },
    },
    include: { chiTiet: true },
  });

  for (const item of items) {
    const nl = await tx.nguyenLieu.update({
      where: { maNguyenLieu: item.maNguyenLieu },
      data: { tonKho: { decrement: item.soLuong } },
    });
    await checkAndEmitLowStock(nl);
  }

  await tx.donHang.update({
    where: { maDonHang },
    data: { daTruKho: true },
  });

  return phieu;
};

/**
 * Hoàn kho khi hủy đơn đã trừ nguyên liệu.
 */
const restoreInventoryForOrder = async (tx, { maDonHang, maNhanVien }) => {
  const order = await tx.donHang.findUnique({ where: { maDonHang } });
  if (!order?.daTruKho) return null;

  const phieuBan = await tx.phieuKho.findFirst({
    where: { maDonHang, loaiPhieu: "BAN_HANG" },
    include: { chiTiet: true },
  });
  if (!phieuBan) {
    await tx.donHang.update({
      where: { maDonHang },
      data: { daTruKho: false },
    });
    return null;
  }

  const tongGiaTri = phieuBan.chiTiet.reduce(
    (s, i) => s + i.soLuongThucTe * Number(i.donGia),
    0,
  );

  const phieu = await tx.phieuKho.create({
    data: {
      thoiGianLap: new Date(),
      tongGiaTri,
      loaiPhieu: "NHAP",
      maNhanVien: maNhanVien || order.maNhanVien || "NV_MANAGER01",
      maDonHang,
      ghiChu: `Hoàn kho do hủy đơn ${maDonHang}`,
      chiTiet: {
        create: phieuBan.chiTiet.map((i) => ({
          maNguyenLieu: i.maNguyenLieu,
          soLuongThucTe: i.soLuongThucTe,
          donGia: i.donGia,
        })),
      },
    },
  });

  for (const item of phieuBan.chiTiet) {
    await tx.nguyenLieu.update({
      where: { maNguyenLieu: item.maNguyenLieu },
      data: { tonKho: { increment: item.soLuongThucTe } },
    });
  }

  await tx.donHang.update({
    where: { maDonHang },
    data: { daTruKho: false },
  });

  return phieu;
};

const createWarehouseVoucher = async (tx, { loaiPhieu, maNCC, maNhanVien, items, ghiChu }) => {
  if (!items?.length) throw { statusCode: 400, message: "Danh sách nguyên liệu trống" };

  const tongGiaTri = items.reduce(
    (s, i) => s + Number(i.soLuongThucTe) * Number(i.donGia),
    0,
  );

  const phieu = await tx.phieuKho.create({
    data: {
      thoiGianLap: new Date(),
      tongGiaTri,
      loaiPhieu,
      maNCC: maNCC || null,
      maNhanVien,
      ghiChu,
      chiTiet: { create: items },
    },
    include: {
      chiTiet: { include: { nguyenLieu: true } },
      nhaCungCap: true,
      nhanVien: { include: { nguoiDung: true } },
    },
  });

  for (const item of items) {
    let delta = 0;
    if (loaiPhieu === "NHAP") {
      delta = Number(item.soLuongThucTe);
    } else if (["XUAT", "BAN_HANG", "HUY"].includes(loaiPhieu)) {
      delta = -Number(item.soLuongThucTe);
    }

    const nl = await tx.nguyenLieu.findUnique({
      where: { maNguyenLieu: item.maNguyenLieu },
    });
    if (!nl || nl.daXoa) {
      throw { statusCode: 400, message: `Nguyên liệu ${item.maNguyenLieu} không hợp lệ` };
    }
    if (delta < 0 && nl.tonKho + delta < 0) {
      throw {
        statusCode: 400,
        message: `Tồn kho ${nl.tenNL} không đủ (còn ${nl.tonKho}${nl.donVi})`,
      };
    }

    const updated = await tx.nguyenLieu.update({
      where: { maNguyenLieu: item.maNguyenLieu },
      data: { tonKho: { increment: delta } },
    });
    await checkAndEmitLowStock(updated);
  }

  if (loaiPhieu === "NHAP" && maNCC) {
    await tx.nhaCungCap.update({
      where: { maNCC },
      data: { congNo: { increment: tongGiaTri } },
    });
  }

  return phieu;
};

const getStockReport = async () => {
  const ingredients = await prisma.nguyenLieu.findMany({
    where: { daXoa: false },
    include: { nhaCungCap: true },
    orderBy: { tenNL: "asc" },
  });

  return ingredients.map((ing) => {
    const giaTriTon = Number(ing.giaNhap || 0) * ing.tonKho;
    const threshold = ing.tonKhoToiThieu ?? 10;
    let trangThai = "DU_HANG";
    if (ing.tonKho <= threshold) trangThai = "SAP_HET";
    else if (ing.tonKho <= threshold * 3) trangThai = "VUA_DU";

    return {
      ...ing,
      giaTriTon,
      trangThai,
    };
  });
};

const getInventorySummary = async () => {
  const [ingredients, suppliers, vouchersToday] = await Promise.all([
    prisma.nguyenLieu.findMany({ where: { daXoa: false } }),
    prisma.nhaCungCap.count({ where: { daXoa: false } }),
    prisma.phieuKho.count({
      where: {
        thoiGianLap: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
  ]);

  const lowStockItems = ingredients.filter((i) => isLowStock(i));
  const totalValue = ingredients.reduce(
    (s, i) => s + i.tonKho * Number(i.giaNhap || 0),
    0,
  );

  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const [nhapThang, xuatThang] = await Promise.all([
    prisma.phieuKho.aggregate({
      where: { loaiPhieu: "NHAP", thoiGianLap: { gte: startOfMonth } },
      _sum: { tongGiaTri: true },
      _count: true,
    }),
    prisma.phieuKho.aggregate({
      where: {
        loaiPhieu: { in: ["XUAT", "BAN_HANG"] },
        thoiGianLap: { gte: startOfMonth },
      },
      _sum: { tongGiaTri: true },
      _count: true,
    }),
  ]);

  return {
    totalIngredients: ingredients.length,
    totalSuppliers: suppliers,
    lowStockCount: lowStockItems.length,
    lowStockItems,
    totalStockValue: totalValue,
    vouchersToday,
    monthImport: {
      count: nhapThang._count,
      value: Number(nhapThang._sum.tongGiaTri || 0),
    },
    monthExport: {
      count: xuatThang._count,
      value: Number(xuatThang._sum.tongGiaTri || 0),
    },
  };
};

const getMovementHistory = async ({ from, to, maNguyenLieu, loaiPhieu, page = 1, limit = 50 }) => {
  const where = {};
  if (loaiPhieu) where.loaiPhieu = loaiPhieu;
  if (from || to) {
    where.thoiGianLap = {};
    if (from) where.thoiGianLap.gte = new Date(from);
    if (to) where.thoiGianLap.lte = new Date(to);
  }
  if (maNguyenLieu) {
    where.chiTiet = { some: { maNguyenLieu } };
  }

  const [records, total] = await Promise.all([
    prisma.phieuKho.findMany({
      where,
      skip: (page - 1) * limit,
      take: +limit,
      include: {
        chiTiet: { include: { nguyenLieu: true } },
        nhaCungCap: true,
        nhanVien: { include: { nguoiDung: { select: { hoTen: true } } } },
      },
      orderBy: { thoiGianLap: "desc" },
    }),
    prisma.phieuKho.count({ where }),
  ]);

  return { records, total, page: +page, limit: +limit };
};

module.exports = {
  INTERNAL_SUPPLIER_ID,
  isLowStock,
  deductInventoryForOrder,
  restoreInventoryForOrder,
  createWarehouseVoucher,
  getStockReport,
  getInventorySummary,
  getMovementHistory,
};
