const express = require("express");
const r = express.Router();
const { staffController: ctrl } = require("../controllers/all.controllers");
const { authenticate, requireRole } = require("../middlewares/auth.middleware");

r.get("/", authenticate, requireRole("Quản lý"), ctrl.getStaff);
r.post("/", authenticate, requireRole("Quản lý"), ctrl.createStaff);
r.get("/shifts", authenticate, ctrl.getShifts);
r.get("/shifts/current", authenticate, ctrl.getCurrentShift);
r.post("/shifts/checkin", authenticate, ctrl.checkin);
r.patch("/shifts/:id/checkout", authenticate, ctrl.checkout);

module.exports = r;
