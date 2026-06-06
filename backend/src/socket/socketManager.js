let ioInstance = null;

const initSocket = (io) => {
  ioInstance = io;

  io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // Join room by role
    socket.on('join:room', (room) => {
      socket.join(room);
      console.log(`  → joined room: ${room}`);
    });

    // KDS joins the kitchen room
    socket.on('join:kds', () => {
      socket.join('kds');
    });

    // POS joins pos room
    socket.on('join:pos', () => {
      socket.join('pos');
    });

    // Table room
    socket.on('join:table', (tableId) => {
      socket.join(`table:${tableId}`);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });
};

// ─── Emit helpers ─────────────────────────────────────────

// New order → KDS
const emitNewOrder = (order) => {
  if (ioInstance) {
    ioInstance.to('kds').emit('order:new', order);
    ioInstance.to('pos').emit('order:created', order);
  }
};

// KDS status update → POS + customer
const emitOrderStatusUpdate = (order) => {
  if (ioInstance) {
    ioInstance.to('kds').emit('order:updated', order);
    ioInstance.to('pos').emit('order:updated', order);
    if (order.maBan) {
      ioInstance.to(`table:${order.maBan}`).emit('order:updated', order);
    }
    ioInstance.to(`order:${order.maDonHang}`).emit('order:updated', order);
  }
};

// Order complete → all clients (trigger pager/buzzer)
const emitOrderComplete = (order) => {
  if (ioInstance) {
    ioInstance.emit('order:complete', {
      maDonHang: order.maDonHang,
      soTheRung: order.soTheRung,
      maBan: order.maBan,
      items: order.chiTiet?.map(c => c.mon?.tenMon)
    });
    ioInstance.to(`order:${order.maDonHang}`).emit('order:updated', order);
  }
};

// Table status update
const emitTableUpdate = (table) => {
  if (ioInstance) {
    ioInstance.emit('table:updated', table);
  }
};

// Low stock alert
const emitLowStock = (ingredient) => {
  if (ioInstance) {
    ioInstance.to('admin').emit('inventory:low', ingredient);
  }
};

module.exports = {
  initSocket,
  emitNewOrder,
  emitOrderStatusUpdate,
  emitOrderComplete,
  emitTableUpdate,
  emitLowStock,
  getIO: () => ioInstance,
};
