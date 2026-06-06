const prisma = require("../prisma/client");
const { asyncHandler } = require("../middlewares/error.middleware");

// POST /api/incidents
const createIncident = asyncHandler(async (req, res) => {
  const { moTaSuCo, tienThietHai, maNhanVien } = req.body;
  const authorId = req.user?.maNguoiDung;

  if (!moTaSuCo || String(moTaSuCo).trim().length < 5) {
    return res.status(400).json({ message: "Mô tả sự cố quá ngắn hoặc thiếu" });
  }
  if (tienThietHai && Number(tienThietHai) < 0) {
    return res.status(400).json({ message: "Thiệt hại phải là số dương" });
  }

  const incident = await prisma.bienBanSuCo.create({
    data: {
      moTaSuCo: String(moTaSuCo).trim(),
      tienThietHai: tienThietHai ? Number(tienThietHai) : undefined,
      thoiGianLap: new Date(),
      maNhanVien: maNhanVien || authorId,
    },
  });

  res.status(201).json(incident);
});

// GET /api/incidents
const listIncidents = asyncHandler(async (req, res) => {
  const incidents = await prisma.bienBanSuCo.findMany({
    include: {
      nhanVien: {
        include: { nguoiDung: { select: { hoTen: true, email: true } } },
      },
    },
    orderBy: { thoiGianLap: "desc" },
    take: 200,
  });
  res.json(incidents);
});

module.exports = { createIncident, listIncidents };
