const express = require("express");
const r = express.Router();
const ctrl = require("../controllers/inventory.controller");
const { authenticate, requireRole } = require("../middlewares/auth.middleware");

const managerOnly = [authenticate, requireRole("Quản lý")];
const managerRead = [authenticate, requireRole("Quản lý")];

// Nguyên liệu
r.get("/ingredients", ...managerRead, ctrl.getIngredients);
r.post("/ingredients", ...managerOnly, ctrl.createIngredient);
r.put("/ingredients/:id", ...managerOnly, ctrl.updateIngredient);
r.delete("/ingredients/:id", ...managerOnly, ctrl.deleteIngredient);

// Nhà cung cấp
r.get("/suppliers", ...managerRead, ctrl.getSuppliers);
r.post("/suppliers", ...managerOnly, ctrl.createSupplier);
r.put("/suppliers/:id", ...managerOnly, ctrl.updateSupplier);
r.delete("/suppliers/:id", ...managerOnly, ctrl.deleteSupplier);

// Phiếu kho
r.get("/vouchers", ...managerRead, ctrl.getVouchers);
r.get("/vouchers/:id", ...managerRead, ctrl.getVoucherById);
r.post("/vouchers", ...managerOnly, ctrl.createVoucher);

// Định mức
r.get("/recipes", ...managerRead, ctrl.getRecipes);
r.post("/recipes", ...managerOnly, ctrl.createRecipe);
r.put("/recipes/:id", ...managerOnly, ctrl.updateRecipe);
r.delete("/recipes/:id", ...managerOnly, ctrl.deleteRecipe);

// Báo cáo & lịch sử
r.get("/reports/stock", ...managerRead, ctrl.getStockReportHandler);
r.get("/reports/low-stock", ...managerRead, ctrl.getLowStock);
r.get("/reports/summary", ...managerRead, ctrl.getSummary);
r.get("/history", ...managerRead, ctrl.getHistory);

module.exports = r;
