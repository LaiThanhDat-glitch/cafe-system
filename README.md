# ☕ Cafe System — Hệ thống Quản lý Quán Cà Phê Đa Kênh

Hệ thống quản lý quán cà phê đầy đủ tính năng: POS, KDS, Dashboard, Kho, Nhân sự, Realtime.

---

## Cấu trúc dự án

```
cafe-system/
├── backend/               # Node.js + Express + Prisma
│   ├── prisma/
│   │   ├── schema.prisma  # Toàn bộ database schema (30+ bảng)
│   │   └── seed.js        # Dữ liệu mẫu
│   └── src/
│       ├── index.js       # Entry point + Socket.IO
│       ├── controllers/   # Business logic
│       ├── routes/        # API routes
│       ├── middlewares/   # JWT auth + RBAC
│       ├── socket/        # Socket.IO manager
│       └── prisma/        # Prisma client
│
└── frontend/              # React + Vite + TailwindCSS
    └── src/
        ├── pages/
        │   ├── LoginPage.jsx      # Đăng nhập
        │   ├── MenuPage.jsx       # Thực đơn công khai
        │   ├── POSPage.jsx        # POS thu ngân
        │   ├── KDSPage.jsx        # KDS pha chế (realtime)
        │   ├── DashboardPage.jsx  # Dashboard quản lý
        │   ├── TablePage.jsx      # Quản lý bàn
        │   ├── InventoryPage.jsx  # Kho nguyên liệu
        │   ├── StaffPage.jsx      # Nhân sự
        │   ├── OrdersPage.jsx     # Danh sách đơn
        │   └── CustomerPage.jsx   # Tài khoản khách
        ├── services/api.js        # Axios + Socket.IO client
        ├── hooks/useAuth.jsx      # Auth context
        └── App.jsx                # Router + protected routes
```

---

HƯỚNG DẪN CÀI ĐẶT DỰ ÁN
### 1. Yêu cầu môi trường

## Cài đặt trước:

Node.js 18+
MySQL 8.0 hoặc XAMPP
Git

## Kiểm tra:

node -v
npm -v
git --version
### 2. Clone dự án
git clone <repository-url>
cd cafe-management-system

## Hoặc nếu đã được thêm vào GitHub Repository:

git clone https://github.com/<owner>/<repo>.git
### 3. Cài đặt Backend

## Di chuyển vào thư mục backend:

cd backend

## Cài đặt thư viện:

npm install

## Nếu dự án sử dụng VNPAY:

npm install vnpay
### 4. Cấu hình môi trường

Tạo file .env:

cp .env.example .env

## Mở file .env và cập nhật:

DATABASE_URL="mysql://root:@localhost:3306/cafe_db"
JWT_SECRET=your_secret_key
PORT=3001
### 5. Tạo Database

## Tạo database rỗng:

CREATE DATABASE cafe_db;

## Có 2 cách khởi tạo dữ liệu:

### Cách 1: Dùng Prisma (Khuyến nghị)
npx prisma generate
npx prisma db push
npm run db:seed
### Cách 2: Import database có sẵn

## Import file:

backend/database/cafe_db.sql

## Sau đó chạy:

npx prisma generate

## Không cần chạy:

npx prisma db push

## nếu database đã được import đầy đủ.

### 6. Chạy Backend
npm run dev

## Backend chạy tại:

http://localhost:3001
### 7. Cài đặt Frontend

## Mở terminal mới:

cd frontend
npm install

## Tạo file .env nếu dự án yêu cầu:

VITE_API_URL=http://localhost:3001/api

## Chạy frontend:

npm run dev

Frontend chạy tại:

http://localhost:5173

## Tài khoản demo

| Email | Mật khẩu | Giao diện |
|-------|----------|-----------|
|customer@cafe.vn | 123456 | Khách hàng thành viên, mua hàng ONL |
| manager@cafe.vn | 123456 | Dashboard, tất cả |
| cashier@cafe.vn | 123456 | POS, Đơn hàng, Bàn |
| barista@cafe.vn | 123456 | KDS pha chế |

---

## API Endpoints

### Auth
- `POST /api/auth/register` — Đăng ký
- `POST /api/auth/login` — Đăng nhập
- `GET  /api/auth/me` — Thông tin user

### Menu
- `GET  /api/menu/categories` — Danh mục món
- `GET  /api/menu/items` — Danh sách món (filter, search, page)
- `GET  /api/menu/items/:id` — Chi tiết món
- `POST /api/menu/items` — Thêm món (Quản lý)
- `PUT  /api/menu/items/:id` — Sửa món
- `POST /api/menu/items/:id/review` — Đánh giá

### Orders
- `POST /api/orders` — Tạo đơn (tự động trừ kho + Socket emit)
- `GET  /api/orders` — Danh sách (filter trangThai, loai, date)
- `GET  /api/orders/:id` — Chi tiết đơn
- `PATCH /api/orders/:id/status` — Cập nhật trạng thái

### KDS
- `GET  /api/kds/orders` — Đơn đang xử lý
- `PATCH /api/kds/orders/:id/accept` — Bắt đầu pha chế
- `PATCH /api/kds/orders/:id/complete` — Hoàn thành

### Tables
- `GET  /api/tables` — Danh sách bàn
- `POST /api/tables` — Thêm bàn
- `PUT  /api/tables/:id` — Cập nhật bàn

### Inventory
- `GET  /api/inventory/ingredients` — Nguyên liệu
- `POST /api/inventory/vouchers` — Tạo phiếu nhập/xuất/hủy

### Reports
- `GET  /api/reports/revenue?type=today|month` — Doanh thu + KPIs
- `GET  /api/reports/daily?days=30` — Biểu đồ doanh thu ngày

### Webhooks
- `POST /api/webhooks/grab` — Nhận đơn GrabFood
- `POST /api/webhooks/shopee` — Nhận đơn ShopeeFood

---

## Socket.IO Events

| Event | Direction | Mô tả |
|-------|-----------|-------|
| `order:new` | Server → KDS, POS | Đơn mới được tạo |
| `order:updated` | Server → All | Trạng thái đơn thay đổi |
| `order:complete` | Server → All | Đơn hoàn thành (gọi thẻ rung) |
| `table:updated` | Server → All | Bàn thay đổi trạng thái |
| `inventory:low` | Server → Admin | Nguyên liệu sắp hết |

---

## Công nghệ

**Backend:** Node.js · Express · Prisma ORM · MySQL · Socket.IO · JWT · bcrypt  
**Frontend:** React 18 · Vite · TailwindCSS · React Router · Axios · Recharts · Socket.IO client  
**Database:** MySQL với 30+ bảng, fully relational  
**Auth:** JWT (8h) + Refresh token (30d) · RBAC (Quản lý / Thu ngân / Pha chế)  
**Realtime:** Socket.IO với room-based broadcasting

---

## Tính năng nổi bật

- ✅ **Omni-channel**: Tại quán, mang về, online, GrabFood, ShopeeFood
- ✅ **POS**: Giao diện bán hàng đầy đủ, áp mã giảm giá, đa phương thức thanh toán
- ✅ **KDS**: Màn hình pha chế realtime với 3 cột (Chờ / Đang làm / Xong)
- ✅ **Auto inventory**: Tự động trừ kho khi tạo đơn theo định mức
- ✅ **Dashboard**: Biểu đồ doanh thu, top món bán chạy, KPIs
- ✅ **RBAC**: Phân quyền chặt chẽ theo vai trò
- ✅ **Webhook ready**: Nhận đơn từ GrabFood / ShopeeFood
