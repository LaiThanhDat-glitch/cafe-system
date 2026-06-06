const express = require("express");
const r = express.Router();
const ctrl = require("../controllers/incident.controller");
const { authenticate, requireRole } = require("../middlewares/auth.middleware");

// Manager-only endpoints
r.post("/", authenticate, requireRole("Quản lý"), ctrl.createIncident);
r.get("/", authenticate, requireRole("Quản lý"), ctrl.listIncidents);

module.exports = r;
