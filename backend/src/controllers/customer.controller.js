const prisma = require("../prisma/client");
const { asyncHandler } = require("../middlewares/error.middleware");

// GET /api/customer/points
const getPoints = asyncHandler(async (req, res) => {
  const userId = req.user.maNguoiDung;
  const kh = await prisma.khachHang.findFirst({
    where: { maKhachHang: userId },
    include: { khachThanhVien: true },
  });
  const points = kh?.khachThanhVien?.diemThuong || 0;
  res.json({ points });
});

// POST /api/customer/redeem — redeem points (simple decrement)
const redeemPoints = asyncHandler(async (req, res) => {
  const userId = req.user.maNguoiDung;
  const { points } = req.body;
  if (!points || points <= 0)
    return res.status(400).json({ message: "Số điểm không hợp lệ" });

  const kt = await prisma.khachThanhVien.findUnique({
    where: { maKhachHang: userId },
  });
  if (!kt)
    return res.status(404).json({ message: "Không phải khách thành viên" });
  if (kt.diemThuong < points)
    return res.status(400).json({ message: "Không đủ điểm" });

  const updated = await prisma.khachThanhVien.update({
    where: { maKhachHang: userId },
    data: { diemThuong: { decrement: points } },
  });
  res.json({ message: "Đổi điểm thành công", points: updated.diemThuong });
});

module.exports = { getPoints, redeemPoints };
