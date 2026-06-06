const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ─── Roles ────────────────────────────────────────
  const roles = await Promise.all([
    prisma.vaiTro.upsert({ where: { maVaiTro: 'quan-ly' }, update: {}, create: { maVaiTro: 'quan-ly', tenVaiTro: 'Quản lý', danhSachQuyen: 'ALL' } }),
    prisma.vaiTro.upsert({ where: { maVaiTro: 'thu-ngan' }, update: {}, create: { maVaiTro: 'thu-ngan', tenVaiTro: 'Thu ngân', danhSachQuyen: 'ORDER_READ,ORDER_CREATE,PAYMENT_CREATE,TABLE_READ' } }),
    prisma.vaiTro.upsert({ where: { maVaiTro: 'pha-che' }, update: {}, create: { maVaiTro: 'pha-che', tenVaiTro: 'Pha chế', danhSachQuyen: 'ORDER_READ,ORDER_UPDATE' } }),
  ]);
  console.log('✓ Roles created');

  // ─── Staff users ──────────────────────────────────
  const hash = await bcrypt.hash('123456', 10);
  const staffData = [
    { id: 'NV_MANAGER01', email: 'manager@cafe.vn', hoTen: 'Nguyễn Quản Lý', roleId: 'quan-ly' },
    { id: 'NV_CASHIER01', email: 'cashier@cafe.vn', hoTen: 'Trần Thu Ngân', roleId: 'thu-ngan' },
    { id: 'NV_BARISTA01', email: 'barista@cafe.vn', hoTen: 'Lê Pha Chế', roleId: 'pha-che' },
  ];
  for (const s of staffData) {
    // Bước 1: tạo NguoiDung
    await prisma.nguoiDung.upsert({
      where: { maNguoiDung: s.id }, update: {},
      create: { maNguoiDung: s.id, hoTen: s.hoTen, email: s.email, matKhau: hash }
    });
    // Bước 2: tạo NhanVien (dùng cùng ID)
    await prisma.nhanVien.upsert({
      where: { maNhanVien: s.id }, update: {},
      create: { maNhanVien: s.id, hireDate: new Date(), maVaiTro: s.roleId }
    });
  }
  console.log('✓ Staff users created');

  // ─── Categories ───────────────────────────────────
  const catData = [
    { maDanhMuc: 'cat-cf', tenDanhMuc: 'Cà phê', slug: 'ca-phe', thuTu: 1 },
    { maDanhMuc: 'cat-tr', tenDanhMuc: 'Trà', slug: 'tra', thuTu: 2 },
    { maDanhMuc: 'cat-sm', tenDanhMuc: 'Sinh tố', slug: 'sinh-to', thuTu: 3 },
    { maDanhMuc: 'cat-fd', tenDanhMuc: 'Đồ ăn nhẹ', slug: 'do-an-nhe', thuTu: 4 },
  ];
  for (const c of catData) {
    await prisma.danhMucMon.upsert({ where: { maDanhMuc: c.maDanhMuc }, update: {}, create: c });
  }
  console.log('✓ Categories created');

  // ─── Menu items ───────────────────────────────────
  const menuItems = [
    { maMon: 'MON_CF01', tenMon: 'Cà Phê Đen', giaBan: 25000, maDanhMuc: 'cat-cf', slug: 'ca-phe-den', moTa: 'Cà phê đen đậm đà, pha phin truyền thống', isNoiBat: true },
    { maMon: 'MON_CF02', tenMon: 'Cà Phê Sữa', giaBan: 35000, maDanhMuc: 'cat-cf', slug: 'ca-phe-sua', moTa: 'Cà phê sữa thơm ngon, béo ngậy' },
    { maMon: 'MON_CF03', tenMon: 'Cà Phê Latte', giaBan: 55000, maDanhMuc: 'cat-cf', slug: 'ca-phe-latte', moTa: 'Latte với sữa hấp mịn và lớp bọt sữa', isNoiBat: true },
    { maMon: 'MON_CF04', tenMon: 'Cappuccino', giaBan: 60000, maDanhMuc: 'cat-cf', slug: 'cappuccino', moTa: 'Cappuccino cân bằng espresso và sữa' },
    { maMon: 'MON_CF05', tenMon: 'Cold Brew', giaBan: 65000, maDanhMuc: 'cat-cf', slug: 'cold-brew', moTa: 'Ủ lạnh 24 giờ, hương vị đậm đà, ít đắng' },
    { maMon: 'MON_TR01', tenMon: 'Trà Đào', giaBan: 45000, maDanhMuc: 'cat-tr', slug: 'tra-dao', moTa: 'Trà đào cam sả thơm mát' },
    { maMon: 'MON_TR02', tenMon: 'Trà Chanh', giaBan: 30000, maDanhMuc: 'cat-tr', slug: 'tra-chanh' },
    { maMon: 'MON_SM01', tenMon: 'Sinh Tố Xoài', giaBan: 50000, maDanhMuc: 'cat-sm', slug: 'sinh-to-xoai', isNoiBat: true },
    { maMon: 'MON_SM02', tenMon: 'Sinh Tố Bơ', giaBan: 55000, maDanhMuc: 'cat-sm', slug: 'sinh-to-bo' },
    { maMon: 'MON_FD01', tenMon: 'Bánh Croissant', giaBan: 40000, maDanhMuc: 'cat-fd', slug: 'banh-croissant' },
    { maMon: 'MON_FD02', tenMon: 'Tiramisu', giaBan: 65000, maDanhMuc: 'cat-fd', slug: 'tiramisu', isNoiBat: true },
  ];

  for (const item of menuItems) {
    await prisma.mon.upsert({
      where: { maMon: item.maMon }, update: {},
      create: { ...item,
        doUong: item.maDanhMuc !== 'cat-fd' ? { create: { mucDoDa: 'NHIEU', mucDoDuong: 'BINH_THUONG', mucSize: 'M' } } : undefined
      }
    });
  }
  console.log('✓ Menu items created');

  // ─── Tables ───────────────────────────────────────
  const tableNums = ['A1', 'A2', 'A3', 'A4', 'B1', 'B2', 'B3', 'B4', 'VIP1', 'VIP2'];
  for (const soBan of tableNums) {
    await prisma.ban.upsert({ where: { soBan }, update: {}, create: { soBan, trangThai: 'TRONG' } });
  }
  console.log('✓ Tables created');

  // ─── Promotions ───────────────────────────────────
  await prisma.khuyenMai.upsert({
    where: { maKM: 'KM_WELCOME' }, update: {},
    create: {
      maKM: 'KM_WELCOME', giaTriGiam: 20, loaiKhuyenMai: 'PHAN_TRAM',
      ngayBatDau: new Date('2024-01-01'), ngayKetThuc: new Date('2025-12-31'),
      dieuKienDonToiThieu: 100000, soLuongToiDa: 1000, trangThai: true
    }
  });
  await prisma.khuyenMai.upsert({
    where: { maKM: 'KM_SALE50K' }, update: {},
    create: {
      maKM: 'KM_SALE50K', giaTriGiam: 50000, loaiKhuyenMai: 'TIEN_MAT',
      ngayBatDau: new Date('2024-01-01'), ngayKetThuc: new Date('2025-12-31'),
      dieuKienDonToiThieu: 200000, soLuongToiDa: 500, trangThai: true
    }
  });
  console.log('✓ Promotions created');

  // ─── Suppliers ──────────────────────────────────
  const suppliers = [
    { maNCC: 'NCC_NOI_BO', tenNCC: 'Nội bộ / Bán hàng', congNo: 0, ghiChu: 'Nhà cung cấp mặc định cho xuất kho tự động' },
    { maNCC: 'NCC_CAFE01', tenNCC: 'Công ty Cà phê Trung Nguyên', congNo: 0, diaChi: 'TP.HCM', soDienThoai: '0281234567', email: 'contact@trungnguyen.com' },
    { maNCC: 'NCC_SUA01', tenNCC: 'Vinamilk', congNo: 2500000, diaChi: 'Bình Dương', soDienThoai: '0274123456' },
    { maNCC: 'NCC_TONG01', tenNCC: 'Metro Cash & Carry', congNo: 0, diaChi: 'TP.HCM', soDienThoai: '0289876543' },
  ];
  for (const s of suppliers) {
    await prisma.nhaCungCap.upsert({ where: { maNCC: s.maNCC }, update: {}, create: s });
  }
  console.log('✓ Suppliers created');

  // ─── Ingredients ─────────────────────────────────
  const ingredients = [
    { maNguyenLieu: 'NL_CAFE', tenNL: 'Cà phê rang xay', tonKho: 5000, donVi: 'g', tonKhoToiThieu: 500, giaNhap: 120, maNCC: 'NCC_CAFE01' },
    { maNguyenLieu: 'NL_SUA', tenNL: 'Sữa tươi', tonKho: 20000, donVi: 'ml', tonKhoToiThieu: 2000, giaNhap: 25, maNCC: 'NCC_SUA01' },
    { maNguyenLieu: 'NL_DUONG', tenNL: 'Đường', tonKho: 10000, donVi: 'g', tonKhoToiThieu: 1000, giaNhap: 15, maNCC: 'NCC_TONG01' },
    { maNguyenLieu: 'NL_DA', tenNL: 'Đá viên', tonKho: 50000, donVi: 'g', tonKhoToiThieu: 5000, giaNhap: 5, maNCC: 'NCC_NOI_BO' },
    { maNguyenLieu: 'NL_TRANH', tenNL: 'Trà xanh', tonKho: 3000, donVi: 'g', tonKhoToiThieu: 300, giaNhap: 80, maNCC: 'NCC_TONG01' },
  ];
  for (const ing of ingredients) {
    await prisma.nguyenLieu.upsert({ where: { maNguyenLieu: ing.maNguyenLieu }, update: {}, create: ing });
  }
  console.log('✓ Ingredients created');

  // ─── Recipe (DinhMuc) ─────────────────────────────
  const recipes = [
    { maDinhMuc: 'DM_CF01_CF', maMon: 'MON_CF01', maNguyenLieu: 'NL_CAFE', soLuongTieuHao: 18 },
    { maDinhMuc: 'DM_CF01_DA', maMon: 'MON_CF01', maNguyenLieu: 'NL_DA', soLuongTieuHao: 100 },
    { maDinhMuc: 'DM_CF03_CF', maMon: 'MON_CF03', maNguyenLieu: 'NL_CAFE', soLuongTieuHao: 20 },
    { maDinhMuc: 'DM_CF03_SUA', maMon: 'MON_CF03', maNguyenLieu: 'NL_SUA', soLuongTieuHao: 200 },
  ];
  for (const r of recipes) {
    await prisma.dinhMuc.upsert({ where: { maDinhMuc: r.maDinhMuc }, update: {}, create: r });
  }
  console.log('✓ Recipes (DinhMuc) created');

  console.log('\n✅ Seed complete! Login with:');
  console.log('   manager@cafe.vn / 123456  → Dashboard');
  console.log('   cashier@cafe.vn / 123456  → POS');
  console.log('   barista@cafe.vn / 123456  → KDS\n');
}

main().catch(console.error).finally(() => prisma.$disconnect());