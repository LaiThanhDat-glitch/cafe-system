const prisma = require("../prisma/client");
const { asyncHandler } = require("../middlewares/error.middleware");
const {
  isLowStock,
  createWarehouseVoucher,
  getStockReport,
  getInventorySummary,
  getMovementHistory,
} = require("../services/inventory.service");

// ─── Nguyên liệu ───────────────────────────────────────────

const getIngredients = asyncHandler(async (req, res) => {
  const { search, lowStock } = req.query;
  const where = { daXoa: false };
  if (search) where.tenNL = { contains: search };
  if (lowStock === "true") {
    const all = await prisma.nguyenLieu.findMany({ where: { daXoa: false } });
    return res.json(all.filter(isLowStock));
  }

  const items = await prisma.nguyenLieu.findMany({
    where,
    include: { nhaCungCap: true },
    orderBy: { tenNL: "asc" },
  });
  res.json(items);
});

const createIngredient = asyncHandler(async (req, res) => {
  const { tenNL, tonKho, donVi, tonKhoToiThieu, giaNhap, maNCC, moTa } = req.body;
  const item = await prisma.nguyenLieu.create({
    data: {
      tenNL,
      tonKho: Number(tonKho) || 0,
      donVi,
      tonKhoToiThieu: tonKhoToiThieu != null ? Number(tonKhoToiThieu) : 10,
      giaNhap: giaNhap != null ? Number(giaNhap) : null,
      maNCC: maNCC || null,
      moTa,
    },
    include: { nhaCungCap: true },
  });
  res.status(201).json(item);
});

const updateIngredient = asyncHandler(async (req, res) => {
  const { tenNL, tonKho, donVi, tonKhoToiThieu, giaNhap, maNCC, moTa } = req.body;
  const data = {};
  if (tenNL != null) data.tenNL = tenNL;
  if (tonKho != null) data.tonKho = Number(tonKho);
  if (donVi != null) data.donVi = donVi;
  if (tonKhoToiThieu != null) data.tonKhoToiThieu = Number(tonKhoToiThieu);
  if (giaNhap != null) data.giaNhap = Number(giaNhap);
  if (maNCC !== undefined) data.maNCC = maNCC || null;
  if (moTa !== undefined) data.moTa = moTa;

  const item = await prisma.nguyenLieu.update({
    where: { maNguyenLieu: req.params.id },
    data,
    include: { nhaCungCap: true },
  });
  res.json(item);
});

const deleteIngredient = asyncHandler(async (req, res) => {
  await prisma.nguyenLieu.update({
    where: { maNguyenLieu: req.params.id },
    data: { daXoa: true },
  });
  res.json({ message: "Đã xóa nguyên liệu" });
});

// ─── Nhà cung cấp ──────────────────────────────────────────

const getSuppliers = asyncHandler(async (req, res) => {
  const suppliers = await prisma.nhaCungCap.findMany({
    where: { daXoa: false },
    include: {
      _count: { select: { phieuKho: true, nguyenLieu: true } },
    },
    orderBy: { tenNCC: "asc" },
  });
  res.json(suppliers);
});

const createSupplier = asyncHandler(async (req, res) => {
  const { tenNCC, congNo, diaChi, soDienThoai, email, ghiChu } = req.body;
  const supplier = await prisma.nhaCungCap.create({
    data: {
      tenNCC,
      congNo: congNo != null ? Number(congNo) : 0,
      diaChi,
      soDienThoai,
      email,
      ghiChu,
    },
  });
  res.status(201).json(supplier);
});

const updateSupplier = asyncHandler(async (req, res) => {
  const supplier = await prisma.nhaCungCap.update({
    where: { maNCC: req.params.id },
    data: req.body,
  });
  res.json(supplier);
});

const deleteSupplier = asyncHandler(async (req, res) => {
  await prisma.nhaCungCap.update({
    where: { maNCC: req.params.id },
    data: { daXoa: true },
  });
  res.json({ message: "Đã xóa nhà cung cấp" });
});

// ─── Phiếu kho ─────────────────────────────────────────────

const getVouchers = asyncHandler(async (req, res) => {
  const { loaiPhieu, from, to, page = 1, limit = 50 } = req.query;
  const where = {};
  if (loaiPhieu) where.loaiPhieu = loaiPhieu;
  if (from || to) {
    where.thoiGianLap = {};
    if (from) where.thoiGianLap.gte = new Date(from);
    if (to) where.thoiGianLap.lte = new Date(to);
  }

  const [vouchers, total] = await Promise.all([
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

  res.json({ vouchers, total, page: +page, limit: +limit });
});

const getVoucherById = asyncHandler(async (req, res) => {
  const voucher = await prisma.phieuKho.findUnique({
    where: { maPhieu: req.params.id },
    include: {
      chiTiet: { include: { nguyenLieu: true } },
      nhaCungCap: true,
      nhanVien: { include: { nguoiDung: true } },
    },
  });
  if (!voucher) return res.status(404).json({ message: "Phiếu kho không tồn tại" });
  res.json(voucher);
});

const createVoucher = asyncHandler(async (req, res) => {
  const { loaiPhieu, maNCC, items, ghiChu } = req.body;
  const maNhanVien = req.user.maNguoiDung;

  const result = await prisma.$transaction((tx) =>
    createWarehouseVoucher(tx, {
      loaiPhieu,
      maNCC,
      maNhanVien,
      items,
      ghiChu,
    }),
  );

  res.status(201).json(result);
});

// ─── Định mức (công thức) ──────────────────────────────────

const getRecipes = asyncHandler(async (req, res) => {
  const { maMon } = req.query;
  const where = maMon ? { maMon } : {};
  const recipes = await prisma.dinhMuc.findMany({
    where,
    include: {
      mon: { select: { maMon: true, tenMon: true } },
      nguyenLieu: true,
    },
    orderBy: { maMon: "asc" },
  });
  res.json(recipes);
});

const createRecipe = asyncHandler(async (req, res) => {
  const { maMon, maNguyenLieu, soLuongTieuHao } = req.body;
  const recipe = await prisma.dinhMuc.create({
    data: {
      maMon,
      maNguyenLieu,
      soLuongTieuHao: Number(soLuongTieuHao),
    },
    include: {
      mon: { select: { tenMon: true } },
      nguyenLieu: true,
    },
  });
  res.status(201).json(recipe);
});

const updateRecipe = asyncHandler(async (req, res) => {
  const recipe = await prisma.dinhMuc.update({
    where: { maDinhMuc: req.params.id },
    data: { soLuongTieuHao: Number(req.body.soLuongTieuHao) },
    include: { mon: true, nguyenLieu: true },
  });
  res.json(recipe);
});

const deleteRecipe = asyncHandler(async (req, res) => {
  await prisma.dinhMuc.delete({ where: { maDinhMuc: req.params.id } });
  res.json({ message: "Đã xóa định mức" });
});

// ─── Báo cáo & lịch sử ─────────────────────────────────────

const getStockReportHandler = asyncHandler(async (_req, res) => {
  const report = await getStockReport();
  res.json(report);
});

const getLowStock = asyncHandler(async (_req, res) => {
  const all = await prisma.nguyenLieu.findMany({
    where: { daXoa: false },
    include: { nhaCungCap: true },
  });
  res.json(all.filter(isLowStock));
});

const getSummary = asyncHandler(async (_req, res) => {
  const summary = await getInventorySummary();
  res.json(summary);
});

const getHistory = asyncHandler(async (req, res) => {
  const result = await getMovementHistory(req.query);
  res.json(result);
});

module.exports = {
  getIngredients,
  createIngredient,
  updateIngredient,
  deleteIngredient,
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  getVouchers,
  getVoucherById,
  createVoucher,
  getRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getStockReportHandler,
  getLowStock,
  getSummary,
  getHistory,
};
