const express = require("express");
const r = express.Router();
const ctrl = require("../controllers/cart.controller");
const {
  authenticate,
  optionalAuth,
} = require("../middlewares/auth.middleware");

r.get("/", optionalAuth, ctrl.getCart);
r.post("/items", optionalAuth, ctrl.upsertCartItem);
r.delete("/items/:id", optionalAuth, ctrl.removeCartItem);
r.delete("/", optionalAuth, ctrl.clearCart);

module.exports = r;
