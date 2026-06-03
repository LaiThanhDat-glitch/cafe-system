const prisma = require("../prisma/client");
const { asyncHandler } = require("../middlewares/error.middleware");

// Helper to find or create cart by user or session
const findOrCreateCart = async (opts) => {
  const { maNguoiDung, sessionId } = opts;
  if (maNguoiDung) {
    let cart = await prisma.gioHang.findFirst({ where: { maNguoiDung } });
    if (!cart) cart = await prisma.gioHang.create({ data: { maNguoiDung } });
    return cart;
  }
  if (sessionId) {
    let cart = await prisma.gioHang.findFirst({ where: { sessionId } });
    if (!cart) cart = await prisma.gioHang.create({ data: { sessionId } });
    return cart;
  }
  // fallback create anonymous cart with generated sessionId
  const cart = await prisma.gioHang.create({ data: {} });
  return cart;
};

// GET /api/cart
const getCart = asyncHandler(async (req, res) => {
  const sessionId = req.query.sessionId;
  const maNguoiDung = req.user?.maNguoiDung;
  const cart = await findOrCreateCart({ maNguoiDung, sessionId });
  const full = await prisma.gioHang.findUnique({
    where: { maGioHang: cart.maGioHang },
    include: { chiTietGio: { include: { mon: true } } },
  });
  res.json(full);
});

// POST /api/cart/items — add or update item
const upsertCartItem = asyncHandler(async (req, res) => {
  const { maMon, soLuong = 1, sessionId } = req.body;
  const maNguoiDung = req.user?.maNguoiDung;
  if (!maMon) return res.status(400).json({ message: "maMon là bắt buộc" });

  const cart = await findOrCreateCart({ maNguoiDung, sessionId });

  // Check if item exists in cart
  const existing = await prisma.chiTietGioHang.findFirst({
    where: { maGioHang: cart.maGioHang, maMon },
  });
  if (existing) {
    const updated = await prisma.chiTietGioHang.update({
      where: { maChiTietGio: existing.maChiTietGio },
      data: { soLuong },
    });
    return res.json(updated);
  }

  const item = await prisma.chiTietGioHang.create({
    data: { maGioHang: cart.maGioHang, maMon, soLuong },
  });
  res.status(201).json(item);
});

// DELETE /api/cart/items/:id
const removeCartItem = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  await prisma.chiTietGioHang.delete({ where: { maChiTietGio: id } });
  res.json({ message: "Đã xóa mục khỏi giỏ hàng" });
});

// DELETE /api/cart — clear cart
const clearCart = asyncHandler(async (req, res) => {
  const sessionId = req.query.sessionId;
  const maNguoiDung = req.user?.maNguoiDung;
  const cart = await findOrCreateCart({ maNguoiDung, sessionId });
  await prisma.chiTietGioHang.deleteMany({
    where: { maGioHang: cart.maGioHang },
  });
  res.json({ message: "Giỏ hàng đã được làm mới" });
});

module.exports = { getCart, upsertCartItem, removeCartItem, clearCart };
