const express = require("express");
const r = express.Router();
const ctrl = require("../controllers/order.controller");
const {
  authenticate,
  optionalAuth,
  requireRole,
} = require("../middlewares/auth.middleware");
r.post("/", optionalAuth, ctrl.createOrder);
r.post("/track", ctrl.trackOrderPublic);
r.get("/", authenticate, ctrl.getOrders);
r.get("/my", authenticate, ctrl.getMyOrders);
r.get("/:id", optionalAuth, ctrl.getOrderById);
r.patch("/:id/status", authenticate, ctrl.updateStatus);
module.exports = r;
