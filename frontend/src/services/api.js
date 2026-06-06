import axios from "axios";
import { io } from "socket.io-client";

// ─── Axios instance ────────────────────────────────
const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  },
);

// ─── Socket.IO ────────────────────────────────────
let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io("/", { autoConnect: false });
  }
  return socket;
};

export const connectSocket = (rooms = []) => {
  const s = getSocket();
  s.connect();
  rooms.forEach((room) => s.emit(`join:${room}`));
  return s;
};

// ─── API helpers ──────────────────────────────────
export const authAPI = {
  login: (data) => api.post("/auth/login", data),
  register: (data) => api.post("/auth/register", data),
  me: () => api.get("/auth/me"),
  updateProfile: (data) => api.put("/auth/profile", data),
};

export const menuAPI = {
  getCategories: () => api.get("/menu/categories"),
  getItems: (params) => api.get("/menu/items", { params }),
  getItem: (id) => api.get(`/menu/items/${id}`),
  createItem: (data) => api.post("/menu/items", data),
  updateItem: (id, data) => api.put(`/menu/items/${id}`, data),
  deleteItem: (id) => api.delete(`/menu/items/${id}`),
  addReview: (id, data) => api.post(`/menu/items/${id}/review`, data),
  getOptions: () => api.get("/menu/options"),
};

export const orderAPI = {
  create: (data) => api.post("/orders", data),
  list: (params) => api.get("/orders", { params }),
  get: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, trangThai) =>
    api.patch(`/orders/${id}/status`, { trangThai }),
  track: (data) => api.post("/orders/track", data),
  myOrders: () => api.get("/orders/my"),
};

export const cartAPI = {
  get: (params) => api.get("/cart", { params }),
  addItem: (data) => api.post("/cart/items", data),
  removeItem: (id) => api.delete(`/cart/items/${id}`),
  clear: (params) => api.delete("/cart", { params }),
};

export const customerAPI = {
  getPoints: () => api.get("/customer/points"),
  redeem: (data) => api.post("/customer/redeem", data),
};

export const tableAPI = {
  list: () => api.get("/tables"),
  create: (data) => api.post("/tables", data),
  update: (id, data) => api.put(`/tables/${id}`, data),
  delete: (id) => api.delete(`/tables/${id}`),
};

export const kdsAPI = {
  getOrders: () => api.get("/kds/orders"),
  accept: (id) => api.patch(`/kds/orders/${id}/accept`),
  complete: (id) => api.patch(`/kds/orders/${id}/complete`),
};

export const inventoryAPI = {
  getIngredients: (params) => api.get("/inventory/ingredients", { params }),
  createIngredient: (data) => api.post("/inventory/ingredients", data),
  updateIngredient: (id, data) => api.put(`/inventory/ingredients/${id}`, data),
  deleteIngredient: (id) => api.delete(`/inventory/ingredients/${id}`),
  getSuppliers: () => api.get("/inventory/suppliers"),
  createSupplier: (data) => api.post("/inventory/suppliers", data),
  updateSupplier: (id, data) => api.put(`/inventory/suppliers/${id}`, data),
  deleteSupplier: (id) => api.delete(`/inventory/suppliers/${id}`),
  getVouchers: (params) => api.get("/inventory/vouchers", { params }),
  getVoucher: (id) => api.get(`/inventory/vouchers/${id}`),
  createVoucher: (data) => api.post("/inventory/vouchers", data),
  getRecipes: (params) => api.get("/inventory/recipes", { params }),
  createRecipe: (data) => api.post("/inventory/recipes", data),
  updateRecipe: (id, data) => api.put(`/inventory/recipes/${id}`, data),
  deleteRecipe: (id) => api.delete(`/inventory/recipes/${id}`),
  getStockReport: () => api.get("/inventory/reports/stock"),
  getLowStock: () => api.get("/inventory/reports/low-stock"),
  getSummary: () => api.get("/inventory/reports/summary"),
  getHistory: (params) => api.get("/inventory/history", { params }),
};

export const staffAPI = {
  list: () => api.get("/staff"),
  create: (data) => api.post("/staff", data),
  getShifts: (params) => api.get("/staff/shifts", { params }),
  getCurrentShift: () => api.get("/staff/shifts/current"),
  checkin: (data) => api.post("/staff/shifts/checkin", data),
  checkout: (id) => api.patch(`/staff/shifts/${id}/checkout`),
};

export const reportAPI = {
  getRevenue: (params) => api.get("/reports/revenue", { params }),
  getDaily: (params) => api.get("/reports/daily", { params }),
};

export const promoAPI = {
  list: () => api.get("/promotions"),
  create: (data) => api.post("/promotions", data),
  update: (id, data) => api.put(`/promotions/${id}`, data),
  validate: (data) => api.post("/promotions/validate", data),
};

export const paymentAPI = {
  create: (data) => api.post("/payments", data),
};

export default api;
