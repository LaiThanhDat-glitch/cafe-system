require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const morgan = require("morgan");
const { Server } = require("socket.io");

const { initSocket } = require("./socket/socketManager");
const authRoutes = require("./routes/auth.routes");
const menuRoutes = require("./routes/menu.routes");
const orderRoutes = require("./routes/order.routes");
const tableRoutes = require("./routes/table.routes");
const kdsRoutes = require("./routes/kds.routes");
const inventoryRoutes = require("./routes/inventory.routes");
const staffRoutes = require("./routes/staff.routes");
const reportRoutes = require("./routes/report.routes");
const promoRoutes = require("./routes/promo.routes");
const paymentRoutes = require("./routes/payment.routes");
const webhookRoutes = require("./routes/webhook.routes");
const cartRoutes = require("./routes/cart.routes");
const customerRoutes = require("./routes/customer.routes");
const incidentRoutes = require("./routes/incident.routes");
const { errorHandler } = require("./middlewares/error.middleware");

const app = express();
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});
initSocket(io);
app.set("io", io);

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/kds", kdsRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/promotions", promoRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/webhooks", webhookRoutes);
app.use("/api/incidents", incidentRoutes);
app.use("/api/customer", customerRoutes);

app.get("/api/health", (req, res) =>
  res.json({ status: "ok", timestamp: new Date() }),
);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`\n🚀 Cafe System API running on port ${PORT}`);
  console.log(`📡 Socket.IO ready`);
  console.log(
    `🗄️  Database: ${process.env.DATABASE_URL?.split("@")[1] || "localhost"}\n`,
  );
});
