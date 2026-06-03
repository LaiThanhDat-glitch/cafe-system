const { v4: uuidv4 } = require("uuid");
const prisma = require("../prisma/client");
const { asyncHandler } = require("../middlewares/error.middleware");
const {
  emitNewOrder,
  emitOrderStatusUpdate,
  emitOrderComplete,
} = require("../socket/socketManager");

// POST /api/orders — create order (POS or web)
const createOrder = asyncHandler(async (req, res) => {
  const {
    items,
    maBan,
    maKM,
    loaiDonHang = "TAI_QUAN",
    ghiChu,
    soTheRung,
    thongTinGuest,
    maDiaChi,
  } = req.body;

  // Build order items + calculate total
  const itemDetails = await Promise.all(
    items.map(async (item) => {
      const mon = await prisma.mon.findUnique({ where: { maMon: item.maMon } });
      if (!mon)
        throw { statusCode: 400, message: `Món ${item.maMon} không tồn tại` };
      const tuyChon = item.maTuyChon
        ? await prisma.tuyChonMon.findMany({
            where: { maTuyChon: { in: item.maTuyChon } },
          })
        : [];
      const extraPrice = tuyChon.reduce(
        (sum, t) => sum + Number(t.giaCongThem),
        0,
      );
      return {
        maMon: mon.maMon,
        soLuong: item.soLuong,
        ghiChu: item.ghiChu,
        donGiaThoiDiemBan: Number(mon.giaBan) + extraPrice,
        tuyChon,
        tieuHao: await prisma.dinhMuc.findMany({
          where: { maMon: mon.maMon },
          include: { nguyenLieu: true },
        }),
      };
    }),
  );

  const tongTien = itemDetails.reduce(
    (s, i) => s + i.donGiaThoiDiemBan * i.soLuong,
    0,
  );

  // Apply promo
  let tienGiamGia = 0;
  if (maKM) {
    const km = await prisma.khuyenMai.findUnique({ where: { maKM } });
    if (
      km &&
      km.trangThai &&
      new Date() >= km.ngayBatDau &&
      new Date() <= km.ngayKetThuc
    ) {
      if (
        !km.dieuKienDonToiThieu ||
        tongTien >= Number(km.dieuKienDonToiThieu)
      ) {
        tienGiamGia =
          km.loaiKhuyenMai === "PHAN_TRAM"
            ? (tongTien * Number(km.giaTriGiam)) / 100
            : Number(km.giaTriGiam);
      }
    }
  }

  const maDonHang = `DH_${uuidv4().substring(0, 8).toUpperCase()}`;

  const order = await prisma.$transaction(async (tx) => {
    // Create order
    const don = await tx.donHang.create({
      data: {
        maDonHang,
        tongTien,
        trangThai: "CHO_XAC_NHAN",
        loaiDonHang,
        maBan,
        maKM,
        ghiChu,
        soTheRung,
        thongTinGuest,
        maDiaChi,
        tienGiamGia,
        tongThanhToan: Math.max(0, tongTien - tienGiamGia),
        maNhanVien: req.user?.nhanVien ? req.user.maNguoiDung : undefined,
        maKhachHang: req.user?.khachHang ? req.user.maNguoiDung : undefined,
        chiTiet: {
          create: itemDetails.map((item) => ({
            maChiTiet: `CT_${uuidv4().substring(0, 8).toUpperCase()}`,
            maMon: item.maMon,
            soLuong: item.soLuong,
            donGiaThoiDiemBan: item.donGiaThoiDiemBan,
            ghiChu: item.ghiChu,
            tuyChon:
              item.tuyChon.length > 0
                ? {
                    create: item.tuyChon.map((t) => ({
                      maTuyChon: t.maTuyChon,
                    })),
                  }
                : undefined,
          })),
        },
      },
      include: {
        chiTiet: { include: { mon: true, tuyChon: true } },
        ban: true,
      },
    });

    // Deduct inventory
    for (const item of itemDetails) {
      for (const dm of item.tieuHao) {
        const needed = dm.soLuongTieuHao * item.soLuong;
        await tx.nguyenLieu.update({
          where: { maNguyenLieu: dm.maNguyenLieu },
          data: { tonKho: { decrement: needed } },
        });
      }
    }

    // Update table status
    if (maBan) {
      await tx.ban.update({
        where: { maBan },
        data: { trangThai: "DANG_PHUC_VU" },
      });
    }

    return don;
  });

  emitNewOrder(order);
  res.status(201).json(order);
});

// GET /api/orders — list orders
const getOrders = asyncHandler(async (req, res) => {
  const { trangThai, loai, maBan, page = 1, limit = 20, date } = req.query;
  const where = {};
  if (trangThai) where.trangThai = trangThai;
  if (loai) where.loaiDonHang = loai;
  if (maBan) where.maBan = maBan;
  if (date) {
    const d = new Date(date);
    where.thoiGianTao = {
      gte: new Date(d.setHours(0, 0, 0, 0)),
      lte: new Date(d.setHours(23, 59, 59, 999)),
    };
  }

  const [orders, total] = await Promise.all([
    prisma.donHang.findMany({
      where,
      skip: (page - 1) * limit,
      take: +limit,
      include: {
        chiTiet: {
          include: {
            mon: {
              include: { hinhAnh: { where: { laAnhChinh: true }, take: 1 } },
            },
          },
        },
        ban: true,
        nhanVien: { include: { nguoiDung: { select: { hoTen: true } } } },
        thanhToan: true,
      },
      orderBy: { thoiGianTao: "desc" },
    }),
    prisma.donHang.count({ where }),
  ]);
  res.json({ orders, total, page: +page });
});

// GET /api/orders/:id
const getOrderById = asyncHandler(async (req, res) => {
  const order = await prisma.donHang.findUnique({
    where: { maDonHang: req.params.id },
    include: {
      chiTiet: {
        include: {
          mon: { include: { hinhAnh: true, doUong: true } },
          tuyChon: true,
        },
      },
      ban: true,
      khuyenMai: true,
      thanhToan: true,
      nhanVien: { include: { nguoiDung: { select: { hoTen: true } } } },
    },
  });
  if (!order) return res.status(404).json({ message: "Đơn không tồn tại" });
  res.json(order);
});

// PATCH /api/orders/:id/status — update order status (KDS)
const updateStatus = asyncHandler(async (req, res) => {
  const { trangThai } = req.body;
  const validStatuses = [
    "CHO_XAC_NHAN",
    "DANG_PHA_CHE",
    "HOAN_THANH",
    "DA_GIAO",
    "HUY",
  ];
  if (!validStatuses.includes(trangThai)) {
    return res.status(400).json({ message: "Trạng thái không hợp lệ" });
  }

  const order = await prisma.donHang.update({
    where: { maDonHang: req.params.id },
    data: { trangThai },
    include: { chiTiet: { include: { mon: true } }, ban: true },
  });

  // If complete, update table status to waiting for cleanup
  if (trangThai === "HOAN_THANH" && order.maBan) {
    await prisma.ban.update({
      where: { maBan: order.maBan },
      data: { trangThai: "CHO_DON" },
    });
    emitOrderComplete(order);
  } else {
    emitOrderStatusUpdate(order);
  }

  res.json(order);
});

// GET /api/orders/my — customer order history
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await prisma.donHang.findMany({
    where: { maKhachHang: req.user.maNguoiDung },
    include: { chiTiet: { include: { mon: true } }, thanhToan: true },
    orderBy: { thoiGianTao: "desc" },
  });
  res.json(orders);
});

// POST /api/orders/track — public order tracking by order id + phone
const trackOrderPublic = asyncHandler(async (req, res) => {
  const { maDonHang, soDienThoai } = req.body;
  if (!maDonHang)
    return res.status(400).json({ message: "maDonHang là bắt buộc" });

  const order = await prisma.donHang.findUnique({
    where: { maDonHang },
    include: {
      chiTiet: { include: { mon: true, tuyChon: true } },
      ban: true,
      khuyenMai: true,
      thanhToan: true,
    },
  });
  if (!order)
    return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

  // If order belongs to a registered customer, verify phone
  if (order.maKhachHang) {
    const user = await prisma.nguoiDung.findUnique({
      where: { maNguoiDung: order.maKhachHang },
    });
    if (user && soDienThoai && user.soDienThoai === soDienThoai)
      return res.json(order);
    return res.status(403).json({ message: "Thông tin không khớp để xem đơn" });
  }

  // For guest orders, try matching phone inside thongTinGuest text
  if (
    soDienThoai &&
    order.thongTinGuest &&
    order.thongTinGuest.includes(soDienThoai)
  ) {
    return res.json(order);
  }

  // If no phone provided, still allow minimal public lookup (read-only)
  if (!soDienThoai)
    return res.json({
      maDonHang: order.maDonHang,
      trangThai: order.trangThai,
      thoiGianTao: order.thoiGianTao,
    });

  return res.status(403).json({ message: "Không có quyền xem đơn này" });
});

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateStatus,
  getMyOrders,
  trackOrderPublic,
};
