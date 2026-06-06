// ═══════════════════════════════════════════════════
// KDS CONTROLLER
// ═══════════════════════════════════════════════════
const prisma = require("../prisma/client");
const { createVnpayClient } = require("../config/vnpay");
const { clearCartByOwner } = require("./cart.controller");
const { deductInventoryForOrder } = require("../services/inventory.service");
const { asyncHandler } = require("../middlewares/error.middleware");
const {
  emitOrderStatusUpdate,
  emitOrderComplete,
} = require("../socket/socketManager");

// GET /api/kds/orders — live orders for kitchen display
const getKDSOrders = asyncHandler(async (req, res) => {
  const yesterday = new Date();
  yesterday.setHours(yesterday.getHours() - 24);

  const orders = await prisma.donHang.findMany({
    where: {
      OR: [
        { trangThai: { in: ["CHO_XAC_NHAN", "DANG_PHA_CHE"] } },
        { trangThai: "HOAN_THANH", thoiGianTao: { gte: yesterday } }
      ]
    },
    include: {
      chiTiet: { include: { mon: true, tuyChon: true } },
      ban: true,
    },
    orderBy: { thoiGianTao: "asc" },
  });
  res.json(orders);
});

// PATCH /api/kds/orders/:id/accept
const acceptOrder = asyncHandler(async (req, res) => {
  const order = await prisma.donHang.update({
    where: { maDonHang: req.params.id },
    data: { trangThai: "DANG_PHA_CHE" },
    include: { chiTiet: { include: { mon: true } }, ban: true },
  });
  emitOrderStatusUpdate(order);
  res.json(order);
});

// PATCH /api/kds/orders/:id/complete
const completeOrder = asyncHandler(async (req, res) => {
  const order = await prisma.donHang.update({
    where: { maDonHang: req.params.id },
    data: { trangThai: "HOAN_THANH" },
    include: { chiTiet: { include: { mon: true } }, ban: true },
  });
  if (order.maBan) {
    await prisma.ban.update({
      where: { maBan: order.maBan },
      data: { trangThai: "CHO_DON" },
    });
  }
  emitOrderComplete(order);
  res.json(order);
});

const kdsController = { getKDSOrders, acceptOrder, completeOrder };

// ═══════════════════════════════════════════════════
// TABLE CONTROLLER
// ═══════════════════════════════════════════════════
const { emitTableUpdate } = require("../socket/socketManager");

const getTables = asyncHandler(async (req, res) => {
  const tables = await prisma.ban.findMany({ orderBy: { soBan: "asc" } });
  res.json(tables);
});

const createTable = asyncHandler(async (req, res) => {
  const { soBan } = req.body;
  const table = await prisma.ban.create({
    data: { soBan, trangThai: "TRONG" },
  });
  emitTableUpdate(table);
  res.status(201).json(table);
});

const updateTable = asyncHandler(async (req, res) => {
  const { soBan, trangThai } = req.body;
  const table = await prisma.ban.update({
    where: { maBan: req.params.id },
    data: { soBan, trangThai },
  });
  emitTableUpdate(table);
  res.json(table);
});

const deleteTable = asyncHandler(async (req, res) => {
  await prisma.ban.delete({ where: { maBan: req.params.id } });
  res.json({ message: "Đã xóa bàn" });
});

const tableController = { getTables, createTable, updateTable, deleteTable };

// ═══════════════════════════════════════════════════
// STAFF CONTROLLER
// ═══════════════════════════════════════════════════
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

const getStaff = asyncHandler(async (req, res) => {
  const staff = await prisma.nhanVien.findMany({
    include: {
      nguoiDung: {
        select: {
          hoTen: true,
          email: true,
          soDienThoai: true,
          avatarUrl: true,
          isDeleted: true,
        },
      },
      vaiTro: true,
      caLamViec: {
        where: { thoiGianRaCa: null },
        orderBy: { thoiGianVaoCa: "desc" },
        take: 1,
      },
    },
  });
  res.json(staff);
});

const createStaff = asyncHandler(async (req, res) => {
  const { hoTen, email, soDienThoai, matKhau, maVaiTro } = req.body;
  const hash = await bcrypt.hash(matKhau, 10);
  const id = `NV_${uuidv4().substring(0, 8).toUpperCase()}`;
  const staff = await prisma.nguoiDung.create({
    data: {
      maNguoiDung: id,
      hoTen,
      email,
      soDienThoai,
      matKhau: hash,
      nhanVien: { create: { maNhanVien: id, hireDate: new Date(), maVaiTro } },
    },
    include: { nhanVien: { include: { vaiTro: true } } },
  });
  const { matKhau: _, ...safe } = staff;
  res.status(201).json(safe);
});

const getShifts = asyncHandler(async (req, res) => {
  const { maNhanVien, date } = req.query;
  const where = {};
  if (maNhanVien) where.maNhanVien = maNhanVien;
  if (date) {
    const d = new Date(date);
    where.thoiGianVaoCa = {
      gte: new Date(d.setHours(0, 0, 0, 0)),
      lte: new Date(d.setHours(23, 59, 59, 999)),
    };
  }
  const shifts = await prisma.caLamViec.findMany({
    where,
    include: {
      nhanVien: { include: { nguoiDung: { select: { hoTen: true } } } },
    },
    orderBy: { thoiGianVaoCa: "desc" },
  });
  res.json(shifts);
});

const getCurrentShift = asyncHandler(async (req, res) => {
  if (!req.user.nhanVien) {
    return res.status(403).json({ message: "Tài khoản không phải nhân viên" });
  }

  const shift = await prisma.caLamViec.findFirst({
    where: {
      maNhanVien: req.user.maNguoiDung,
      thoiGianRaCa: null,
    },
    include: {
      nhanVien: { include: { nguoiDung: { select: { hoTen: true } } } },
    },
    orderBy: { thoiGianVaoCa: "desc" },
  });

  res.json(shift);
});

const checkin = asyncHandler(async (req, res) => {
  if (!req.user.nhanVien) {
    return res.status(403).json({ message: "Tài khoản không phải nhân viên" });
  }

  const openShift = await prisma.caLamViec.findFirst({
    where: {
      maNhanVien: req.user.maNguoiDung,
      thoiGianRaCa: null,
    },
    orderBy: { thoiGianVaoCa: "desc" },
  });

  if (openShift) {
    return res.json(openShift);
  }

  const shift = await prisma.caLamViec.create({
    data: {
      loaiCa: req.body.loaiCa || "SANG",
      thoiGianVaoCa: new Date(),
      maNhanVien: req.user.maNguoiDung,
    },
  });
  res.status(201).json(shift);
});

const checkout = asyncHandler(async (req, res) => {
  if (!req.user.nhanVien) {
    return res.status(403).json({ message: "Tài khoản không phải nhân viên" });
  }

  const where = req.params.id
    ? { maCa: req.params.id }
    : { maNhanVien: req.user.maNguoiDung, thoiGianRaCa: null };

  const current = await prisma.caLamViec.findFirst({ where });
  if (!current) {
    return res.status(404).json({ message: "Không có ca đang mở" });
  }
  if (current.maNhanVien !== req.user.maNguoiDung) {
    const role = req.user.nhanVien?.vaiTro?.tenVaiTro;
    if (role !== "Quản lý") {
      return res.status(403).json({ message: "Không thể checkout ca của nhân viên khác" });
    }
  }
  if (current.thoiGianRaCa) {
    return res.json(current);
  }

  const shift = await prisma.caLamViec.update({
    where: { maCa: current.maCa },
    data: { thoiGianRaCa: new Date() },
  });
  res.json(shift);
});

const staffController = { getStaff, createStaff, getShifts, getCurrentShift, checkin, checkout };

// ═══════════════════════════════════════════════════
// REPORT CONTROLLER
// ═══════════════════════════════════════════════════
const getRevenueReport = asyncHandler(async (req, res) => {
  const { type = "today", from, to } = req.query;
  let start, end;
  const now = new Date();

  if (type === "today") {
    start = new Date(now.setHours(0, 0, 0, 0));
    end = new Date(now.setHours(23, 59, 59, 999));
  } else if (type === "month") {
    start = new Date(now.getFullYear(), now.getMonth(), 1);
    end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  } else {
    start = new Date(from);
    end = new Date(to);
  }

  const [totalOrders, completedOrders, cancelledOrders, revenue, topItems] =
    await Promise.all([
      prisma.donHang.count({
        where: { thoiGianTao: { gte: start, lte: end } },
      }),
      prisma.donHang.count({
        where: {
          trangThai: "HOAN_THANH",
          thoiGianTao: { gte: start, lte: end },
        },
      }),
      prisma.donHang.count({
        where: { trangThai: "HUY", thoiGianTao: { gte: start, lte: end } },
      }),
      prisma.donHang.aggregate({
        where: {
          trangThai: "HOAN_THANH",
          thoiGianTao: { gte: start, lte: end },
        },
        _sum: { tongThanhToan: true },
      }),
      prisma.chiTietDonHang.groupBy({
        by: ["maMon"],
        where: {
          donHang: {
            trangThai: "HOAN_THANH",
            thoiGianTao: { gte: start, lte: end },
          },
        },
        _sum: { soLuong: true },
        orderBy: { _sum: { soLuong: "desc" } },
        take: 10,
      }),
    ]);

  // Get top item names
  const topItemsWithName = await Promise.all(
    topItems.map(async (t) => {
      const mon = await prisma.mon.findUnique({
        where: { maMon: t.maMon },
        select: { tenMon: true },
      });
      return { ...t, tenMon: mon?.tenMon };
    }),
  );

  res.json({
    totalOrders,
    completedOrders,
    cancelledOrders,
    revenue: revenue._sum.tongThanhToan || 0,
    topItems: topItemsWithName,
    period: { start, end },
  });
});

const getDailyRevenue = asyncHandler(async (req, res) => {
  const { days = 30 } = req.query;
  const start = new Date();
  start.setDate(start.getDate() - days);

  const orders = await prisma.donHang.findMany({
    where: { trangThai: "HOAN_THANH", thoiGianTao: { gte: start } },
    select: { thoiGianTao: true, tongThanhToan: true },
  });

  const grouped = {};
  for (const o of orders) {
    const day = o.thoiGianTao.toISOString().split("T")[0];
    grouped[day] = (grouped[day] || 0) + Number(o.tongThanhToan);
  }

  res.json(
    Object.entries(grouped)
      .map(([date, revenue]) => ({ date, revenue }))
      .sort((a, b) => a.date.localeCompare(b.date)),
  );
});

const reportController = { getRevenueReport, getDailyRevenue };

// ═══════════════════════════════════════════════════
// PROMO CONTROLLER
// ═══════════════════════════════════════════════════
const getPromos = asyncHandler(async (req, res) => {
  const promos = await prisma.khuyenMai.findMany({
    orderBy: { ngayBatDau: "desc" },
  });
  res.json(promos);
});

const createPromo = asyncHandler(async (req, res) => {
  const promo = await prisma.khuyenMai.create({ data: req.body });
  res.status(201).json(promo);
});

const updatePromo = asyncHandler(async (req, res) => {
  const promo = await prisma.khuyenMai.update({
    where: { maKM: req.params.id },
    data: req.body,
  });
  res.json(promo);
});

const validatePromo = asyncHandler(async (req, res) => {
  const { maKM, tongTien } = req.body;
  const km = await prisma.khuyenMai.findUnique({ where: { maKM } });
  if (!km || !km.trangThai)
    return res.status(400).json({ valid: false, message: "Mã không hợp lệ" });
  if (new Date() < km.ngayBatDau || new Date() > km.ngayKetThuc) {
    return res.status(400).json({ valid: false, message: "Mã đã hết hạn" });
  }
  if (km.dieuKienDonToiThieu && tongTien < Number(km.dieuKienDonToiThieu)) {
    return res.status(400).json({
      valid: false,
      message: `Đơn tối thiểu ${km.dieuKienDonToiThieu.toLocaleString()}đ`,
    });
  }
  const discount =
    km.loaiKhuyenMai === "PHAN_TRAM"
      ? (tongTien * Number(km.giaTriGiam)) / 100
      : Number(km.giaTriGiam);
  res.json({ valid: true, discount, km });
});

const promoController = { getPromos, createPromo, updatePromo, validatePromo };

const parseGuestCartContext = (order) => {
  if (!order?.thongTinGuest) return {};
  try {
    const guest = JSON.parse(order.thongTinGuest);
    return {
      sessionId: guest.sessionId,
      hoTen: guest.hoTen,
      soDienThoai: guest.soDienThoai,
    };
  } catch {
    return {};
  }
};

// ═══════════════════════════════════════════════════
// PAYMENT CONTROLLER
// ═══════════════════════════════════════════════════
const createPayment = asyncHandler(async (req, res) => {
  const { maDonHang, phuongThuc, tienKhachDua } = req.body;
  const order = await prisma.donHang.findUnique({ where: { maDonHang } });
  if (!order) return res.status(404).json({ message: "Đơn không tồn tại" });

  // Support methods: TIEN_MAT, QR, THE_NGAN_HANG, COD, VNPAY
  const payment = await prisma.$transaction(async (tx) => {
    // For VNPAY we create a pending payment and return paymentUrl
    if (phuongThuc === "VNPAY") {
      const { ProductCode, VnpLocale, dateFormat } = require("vnpay");

      const thanh = await tx.thanhToan.create({
        data: {
          maDonHang,
          soTienGiaoDich: order.tongThanhToan,
          thoiGianThanhToan: new Date(),
          trangThaiGiaoDich: "PENDING",
          phuongThuc: "VNPAY",
        },
      });

      const vnpay = createVnpayClient();

      const returnUrl = `${process.env.BACKEND_URL || "http://localhost:5173"}/api/payments/vnpay/callback`;

      const multiplier = Number(process.env.VNPAY_AMOUNT_MULTIPLIER || "1");
      const orderType =
        ProductCode[process.env.VNPAY_ORDER_TYPE || "Other"] ||
        ProductCode.Other;
      const locale =
        VnpLocale[process.env.VNPAY_LOCALE || "VN"] || VnpLocale.VN;

      const vnpayResponse = await vnpay.buildPaymentUrl({
        vnp_Amount: Number(order.tongThanhToan) * multiplier,
        vnp_IpAddr: req.ip || req.headers["x-forwarded-for"] || "127.0.0.1",
        vnp_TxnRef: maDonHang,
        vnp_OrderInfo: `${maDonHang}`,
        vnp_OrderType: orderType,
        vnp_ReturnUrl: returnUrl,
        vnp_Locale: locale,
        vnp_CreateDate: dateFormat(new Date()),
      });

      const paymentUrl =
        vnpayResponse &&
        (vnpayResponse.url || vnpayResponse.paymentUrl || vnpayResponse);
      return { ...thanh, paymentUrl };
    }

    // For COD treat similarly to cash (TIEN_MAT) for now
    const trangThaiGiaoDich =
      phuongThuc === "TIEN_MAT" ||
      phuongThuc === "COD" ||
      phuongThuc === "THE_NGAN_HANG" ||
      phuongThuc === "QR"
        ? "THANH_CONG"
        : "PENDING";

    const thanh = await tx.thanhToan.create({
      data: {
        maDonHang,
        soTienGiaoDich: order.tongThanhToan,
        thoiGianThanhToan: new Date(),
        trangThaiGiaoDich,
        phuongThuc,
      },
    });

    if ((phuongThuc === "TIEN_MAT" || phuongThuc === "COD") && tienKhachDua) {
      await tx.thanhToanTienMat.create({
        data: { maThanhToan: thanh.maThanhToan, tienKhachDua },
      });
    } else if (phuongThuc === "QR") {
      await tx.thanhToanQR.create({
        data: { maThanhToan: thanh.maThanhToan, qrContent: `QR_${maDonHang}` },
      });
    }

    // Mark order as paid by updating its payment but DO NOT change order status to HOAN_THANH
    if (trangThaiGiaoDich === "THANH_CONG") {
      await deductInventoryForOrder(tx, {
        maDonHang,
        maNhanVien: req.user?.maNguoiDung,
      });
    }

    return thanh;
  });

  // If VNPAY returned a paymentUrl, respond accordingly
  if (payment.paymentUrl) {
    return res.status(201).json({
      paymentUrl: payment.paymentUrl,
      maThanhToan: payment.maThanhToan,
    });
  }

  if (
    payment &&
    payment.maThanhToan &&
    payment.trangThaiGiaoDich === "THANH_CONG"
  ) {
    const guestContext = parseGuestCartContext(order);
    await clearCartByOwner({
      maNguoiDung: order.maKhachHang || undefined,
      sessionId: guestContext.sessionId,
    });
  }

  res.status(201).json({
    ...payment,
    tienThoi:
      (phuongThuc === "TIEN_MAT" || phuongThuc === "COD") && tienKhachDua
        ? tienKhachDua - Number(order.tongThanhToan)
        : 0,
  });
});

const paymentController = { createPayment };

const handleVnpayCallback = asyncHandler(async (req, res) => {
  // VNPAY will redirect with query params
  const params = req.query || {};
  const maDonHang = params.vnp_TxnRef || params.vnp_TxnRef;
  const responseCode = params.vnp_ResponseCode;

  if (!maDonHang) return res.status(400).send("Missing transaction reference");

  const thanh = await prisma.thanhToan.findFirst({
    where: { maDonHang },
    orderBy: { thoiGianThanhToan: "desc" },
  });
  if (!thanh) return res.status(404).send("Payment not found");

  if (responseCode === "00") {
    await prisma.$transaction(async (tx) => {
      await tx.thanhToan.update({
        where: { maThanhToan: thanh.maThanhToan },
        data: { trangThaiGiaoDich: "THANH_CONG" },
      });
      await deductInventoryForOrder(tx, { maDonHang });
    });
    const order = await prisma.donHang.findUnique({ where: { maDonHang } });
    const guestContext = parseGuestCartContext(order);
    await clearCartByOwner({
      maNguoiDung: order.maKhachHang || undefined,
      sessionId: guestContext.sessionId,
    });
    // Redirect user to frontend order page
    const frontend = process.env.FRONTEND_URL || "http://localhost:5173";
    return res.redirect(`${frontend}/account`);
  }

  // failed or cancelled
  await prisma.thanhToan.update({
    where: { maThanhToan: thanh.maThanhToan },
    data: { trangThaiGiaoDich: "THAT_BAI" },
  });
  const frontend = process.env.FRONTEND_URL || "http://localhost:5173";
  return res.redirect(`${frontend}/payment-failed`);
});

// add to exports
paymentController.handleVnpayCallback = handleVnpayCallback;

// ═══════════════════════════════════════════════════
// WEBHOOK CONTROLLER (GrabFood / ShopeeFood)
// ═══════════════════════════════════════════════════
const { v4: uuid2 } = require("uuid");

const handleDeliveryWebhook = asyncHandler(async (req, res) => {
  const { platform } = req.params; // grab | shopee
  const payload = req.body;

  const maDonHang = `DH_${uuid2().substring(0, 8).toUpperCase()}`;
  const order = await prisma.donHang.create({
    data: {
      maDonHang,
      trangThai: "CHO_XAC_NHAN",
      loaiDonHang: platform === "grab" ? "GRAB" : "SHOPEE",
      maDonDoiTac: payload.order_id || payload.orderId,
      tongTien: payload.total_price || payload.totalAmount,
      tongThanhToan: payload.total_price || payload.totalAmount,
      thongTinGuest: JSON.stringify(payload.customer || {}),
      chiTiet: { create: [] }, // parse items from payload in production
    },
  });

  const { emitNewOrder } = require("../socket/socketManager");
  emitNewOrder(order);
  res.json({ received: true, maDonHang });
});

const webhookController = { handleDeliveryWebhook };

module.exports = {
  kdsController,
  tableController,
  staffController,
  reportController,
  promoController,
  paymentController,
  webhookController,
};
