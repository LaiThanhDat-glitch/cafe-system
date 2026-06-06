const prisma = require("../prisma/client");
const { asyncHandler } = require("../middlewares/error.middleware");

const normalizeImageUrls = (value) => {
  if (!value) return [];
  if (Array.isArray(value))
    return value.map((item) => String(item).trim()).filter(Boolean);
  return String(value)
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const syncItemImages = async (tx, maMon, imageUrls, mainImageIndex = 0) => {
  await tx.hinhAnhMon.deleteMany({ where: { maMon } });
  if (!imageUrls.length) return;
  await tx.hinhAnhMon.createMany({
    data: imageUrls.map((urlAnh, index) => ({
      maMon,
      urlAnh,
      laAnhChinh: index === Number(mainImageIndex),
      thuTu: index,
    })),
  });
};

// GET /api/menu/categories
const getCategories = asyncHandler(async (req, res) => {
  const cats = await prisma.danhMucMon.findMany({
    where: { trangThai: true },
    orderBy: { thuTu: "asc" },
    include: { _count: { select: { mon: { where: { daXoa: false } } } } },
  });
  res.json(cats);
});

// GET /api/menu/items
// includeHidden=true → trả cả món ẩn (dùng cho POS / quản lý)
const getItems = asyncHandler(async (req, res) => {
  const { category, search, noiBat, page = 1, limit = 20, includeHidden } =
    req.query;
  const where = {};
  if (includeHidden !== "true") where.daXoa = false;
  if (category) where.maDanhMuc = category;
  if (search) where.tenMon = { contains: search };
  if (noiBat === "true") where.isNoiBat = true;

  const [items, total] = await Promise.all([
    prisma.mon.findMany({
      where,
      skip: (page - 1) * limit,
      take: +limit,
      include: {
        danhMuc: { select: { tenDanhMuc: true, slug: true } },
        hinhAnh: { where: { laAnhChinh: true }, take: 1 },
        tuyChon: true,
        doUong: true,
        doAn: true,
      },
      orderBy:
        includeHidden === "true"
          ? [{ daXoa: "asc" }, { ngayTao: "desc" }]
          : { ngayTao: "desc" },
    }),
    prisma.mon.count({ where }),
  ]);
  res.json({ items, total, page: +page, totalPages: Math.ceil(total / limit) });
});

// GET /api/menu/items/:id
const getItemById = asyncHandler(async (req, res) => {
  const item = await prisma.mon.findUnique({
    where: { maMon: req.params.id },
    include: {
      danhMuc: true,
      hinhAnh: true,
      tuyChon: true,
      doUong: true,
      doAn: true,
      danhGia: {
        include: { nguoiDung: { select: { hoTen: true, avatarUrl: true } } },
        orderBy: { ngayViet: "desc" },
        take: 10,
      },
      dinhMuc: { include: { nguyenLieu: true } },
    },
  });
  if (!item || item.daXoa)
    return res.status(404).json({ message: "Món không tồn tại" });
  res.json(item);
});

// POST /api/menu/items (admin)
const createItem = asyncHandler(async (req, res) => {
  const {
    tenMon,
    giaBan,
    maDanhMuc,
    moTa,
    slug,
    isNoiBat,
    doUong,
    doAn,
    hinhAnhUrls,
    mainImageIndex,
  } = req.body;
  const imageUrls = normalizeImageUrls(hinhAnhUrls);
  const item = await prisma.$transaction(async (tx) => {
    const created = await tx.mon.create({
      data: {
        tenMon,
        giaBan,
        maDanhMuc,
        moTa,
        slug,
        isNoiBat: isNoiBat || false,
        ...(doUong && { doUong: { create: doUong } }),
        ...(doAn && { doAn: { create: doAn } }),
      },
    });
    await syncItemImages(tx, created.maMon, imageUrls, mainImageIndex || 0);
    return tx.mon.findUnique({
      where: { maMon: created.maMon },
      include: {
        danhMuc: true,
        hinhAnh: true,
        tuyChon: true,
        doUong: true,
        doAn: true,
      },
    });
  });
  res.status(201).json(item);
});

// PUT /api/menu/items/:id
const updateItem = asyncHandler(async (req, res) => {
  const {
    tenMon,
    giaBan,
    maDanhMuc,
    moTa,
    isNoiBat,
    daXoa,
    hinhAnhUrls,
    mainImageIndex,
  } = req.body;
  const imageUrls = normalizeImageUrls(hinhAnhUrls);
  const item = await prisma.$transaction(async (tx) => {
    const updated = await tx.mon.update({
      where: { maMon: req.params.id },
      data: { tenMon, giaBan, maDanhMuc, moTa, isNoiBat, daXoa },
    });
    if (hinhAnhUrls !== undefined) {
      await syncItemImages(tx, updated.maMon, imageUrls, mainImageIndex || 0);
    }
    return tx.mon.findUnique({
      where: { maMon: updated.maMon },
      include: {
        danhMuc: true,
        hinhAnh: true,
        tuyChon: true,
        doUong: true,
        doAn: true,
      },
    });
  });
  res.json(item);
});

// DELETE /api/menu/items/:id (soft delete)
const deleteItem = asyncHandler(async (req, res) => {
  await prisma.mon.update({
    where: { maMon: req.params.id },
    data: { daXoa: true },
  });
  res.json({ message: "Đã xóa món" });
});

// POST /api/menu/items/:id/review
const addReview = asyncHandler(async (req, res) => {
  const { soSao, noiDung } = req.body;
  const review = await prisma.danhGia.create({
    data: {
      maNguoiDung: req.user.maNguoiDung,
      maMon: req.params.id,
      soSao,
      noiDung,
    },
  });
  // Update average rating
  const agg = await prisma.danhGia.aggregate({
    where: { maMon: req.params.id },
    _avg: { soSao: true },
  });
  await prisma.mon.update({
    where: { maMon: req.params.id },
    data: { diemDanhGia: agg._avg.soSao || 0 },
  });
  res.status(201).json(review);
});

// GET /api/menu/options
const getOptions = asyncHandler(async (req, res) => {
  const opts = await prisma.tuyChonMon.findMany({
    orderBy: { loaiNhom: "asc" },
  });
  res.json(opts);
});

module.exports = {
  getCategories,
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  addReview,
  getOptions,
};
