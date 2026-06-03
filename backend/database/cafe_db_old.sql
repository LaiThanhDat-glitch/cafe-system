-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 01, 2026 at 03:53 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cafe_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `ban`
--

CREATE TABLE `ban` (
  `maBan` varchar(191) NOT NULL,
  `soBan` varchar(191) NOT NULL,
  `trangThai` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ban`
--

INSERT INTO `ban` (`maBan`, `soBan`, `trangThai`) VALUES
('BAN_A5', 'A5', 'TRONG'),
('BAN_B5', 'B5', 'TRONG'),
('BAN_C1', 'C1', 'CHO_DON'),
('BAN_C2', 'C2', 'TRONG'),
('BAN_NN', 'Ngoài trời 1', 'TRONG'),
('BAN_NN2', 'Ngoài trời 2', 'TRONG'),
('BAN_NN3', 'Ngoài trời 3', 'TRONG'),
('BAN_TQ', 'Tầng 2 - T1', 'TRONG'),
('BAN_TQ2', 'Tầng 2 - T2', 'TRONG'),
('BAN_VIP3', 'VIP3', 'TRONG'),
('cmpujia9s00009mapj48pgue6', 'A1', 'TRONG'),
('cmpujia9w00019mapbk4dzn6p', 'A2', 'TRONG'),
('cmpujiaa200029mapjg02qzan', 'A3', 'TRONG'),
('cmpujiaa700039map9wfccpc2', 'A4', 'TRONG'),
('cmpujiaaa00049mapw6c81bjz', 'B1', 'TRONG'),
('cmpujiaae00059map6ptms7ij', 'B2', 'TRONG'),
('cmpujiaai00069mapmjipkb39', 'B3', 'TRONG'),
('cmpujiaam00079mapyph2lqi4', 'B4', 'TRONG'),
('cmpujiaaq00089mapn1506mas', 'VIP1', 'TRONG'),
('cmpujiaau00099map9yxq4dw3', 'VIP2', 'TRONG');

-- --------------------------------------------------------

--
-- Table structure for table `banner_quang_cao`
--

CREATE TABLE `banner_quang_cao` (
  `id` int(11) NOT NULL,
  `tieuDe` varchar(191) NOT NULL,
  `hinhAnhDesktop` varchar(500) NOT NULL,
  `hinhAnhMobile` varchar(500) DEFAULT NULL,
  `linkDich` varchar(500) NOT NULL,
  `viTri` varchar(191) NOT NULL,
  `thuTu` int(11) NOT NULL DEFAULT 0,
  `ngayBatDau` datetime(3) DEFAULT NULL,
  `ngayKetThuc` datetime(3) DEFAULT NULL,
  `trangThai` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `bienbansuco`
--

CREATE TABLE `bienbansuco` (
  `maBienBan` varchar(191) NOT NULL,
  `moTaSuCo` varchar(500) NOT NULL,
  `tienThietHai` decimal(18,2) DEFAULT NULL,
  `thoiGianLap` datetime(3) NOT NULL,
  `maNhanVien` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `calamviec`
--

CREATE TABLE `calamviec` (
  `maCa` varchar(191) NOT NULL,
  `loaiCa` varchar(191) NOT NULL,
  `thoiGianVaoCa` datetime(3) NOT NULL,
  `thoiGianRaCa` datetime(3) DEFAULT NULL,
  `maNhanVien` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `chitietdonhang`
--

CREATE TABLE `chitietdonhang` (
  `maChiTiet` varchar(191) NOT NULL,
  `maDonHang` varchar(191) NOT NULL,
  `maMon` varchar(191) NOT NULL,
  `soLuong` int(11) NOT NULL,
  `donGiaThoiDiemBan` decimal(18,2) NOT NULL,
  `ghiChu` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `chitietdonhang`
--

INSERT INTO `chitietdonhang` (`maChiTiet`, `maDonHang`, `maMon`, `soLuong`, `donGiaThoiDiemBan`, `ghiChu`) VALUES
('CT_M01_1', 'DH_M01', 'MON_CF09', 2, 65000.00, NULL),
('CT_M01_2', 'DH_M01', 'MON_TR01', 1, 45000.00, NULL),
('CT_M04_1', 'DH_M04', 'MON_ML01', 3, 65000.00, NULL),
('CT_M04_2', 'DH_M04', 'MON_CK01', 2, 70000.00, NULL),
('CT_M08_1', 'DH_M08', 'MON_CF03', 3, 55000.00, NULL),
('CT_M08_2', 'DH_M08', 'MON_FD02', 2, 65000.00, NULL),
('CT_T03_1', 'DH_TODAY03', 'MON_CF05', 1, 55000.00, NULL),
('CT_W01_1', 'DH_W01', 'MON_CF02', 2, 35000.00, NULL),
('CT_W01_2', 'DH_W01', 'MON_FD01', 1, 40000.00, NULL),
('CT_W02_1', 'DH_W02', 'MON_TR03', 2, 55000.00, NULL),
('CT_W02_2', 'DH_W02', 'MON_SM01', 1, 50000.00, NULL),
('CT_W03_1', 'DH_W03', 'MON_CF03', 3, 55000.00, NULL),
('CT_W03_2', 'DH_W03', 'MON_FD05', 1, 55000.00, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `chitietdonhang_tuychonmon`
--

CREATE TABLE `chitietdonhang_tuychonmon` (
  `maChiTiet` varchar(191) NOT NULL,
  `maTuyChon` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `chitietgiohang`
--

CREATE TABLE `chitietgiohang` (
  `maChiTietGio` int(11) NOT NULL,
  `maGioHang` int(11) NOT NULL,
  `maMon` varchar(191) NOT NULL,
  `soLuong` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `chitietphieukho`
--

CREATE TABLE `chitietphieukho` (
  `maPhieu` varchar(191) NOT NULL,
  `maNguyenLieu` varchar(191) NOT NULL,
  `soLuongThucTe` double NOT NULL,
  `donGia` decimal(18,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `danhgia`
--

CREATE TABLE `danhgia` (
  `maDanhGia` int(11) NOT NULL,
  `maNguoiDung` varchar(191) NOT NULL,
  `maMon` varchar(191) NOT NULL,
  `soSao` int(11) DEFAULT NULL,
  `noiDung` text DEFAULT NULL,
  `ngayViet` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `danhmucmon`
--

CREATE TABLE `danhmucmon` (
  `maDanhMuc` varchar(191) NOT NULL,
  `tenDanhMuc` varchar(191) NOT NULL,
  `slug` varchar(191) DEFAULT NULL,
  `iconUrl` varchar(500) DEFAULT NULL,
  `thuTu` int(11) NOT NULL DEFAULT 0,
  `trangThai` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `danhmucmon`
--

INSERT INTO `danhmucmon` (`maDanhMuc`, `tenDanhMuc`, `slug`, `iconUrl`, `thuTu`, `trangThai`) VALUES
('cat-cake', 'Bánh ngọt', 'banh-ngot', NULL, 6, 1),
('cat-cf', 'Cà phê', 'ca-phe', NULL, 1, 1),
('cat-fd', 'Đồ ăn nhẹ', 'do-an-nhe', NULL, 4, 1),
('cat-ml', 'Milkshake', 'milkshake', NULL, 4, 1),
('cat-sm', 'Sinh tố', 'sinh-to', NULL, 3, 1),
('cat-tr', 'Trà', 'tra', NULL, 2, 1);

-- --------------------------------------------------------

--
-- Table structure for table `diachigiaohang`
--

CREATE TABLE `diachigiaohang` (
  `maDiaChi` int(11) NOT NULL,
  `maNguoiDung` varchar(191) NOT NULL,
  `tenNguoiNhan` varchar(191) DEFAULT NULL,
  `sdtNhan` varchar(20) DEFAULT NULL,
  `soNhaDuong` varchar(255) DEFAULT NULL,
  `phuongXa` varchar(100) DEFAULT NULL,
  `quanHuyen` varchar(100) DEFAULT NULL,
  `tinhThanh` varchar(100) DEFAULT NULL,
  `macDinh` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `dinhmuc`
--

CREATE TABLE `dinhmuc` (
  `maDinhMuc` varchar(191) NOT NULL,
  `soLuongTieuHao` double NOT NULL,
  `maMon` varchar(191) NOT NULL,
  `maNguyenLieu` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `dinhmuc`
--

INSERT INTO `dinhmuc` (`maDinhMuc`, `soLuongTieuHao`, `maMon`, `maNguyenLieu`) VALUES
('DM_CF01_CF', 18, 'MON_CF01', 'NL_CAFE'),
('DM_CF01_DA', 100, 'MON_CF01', 'NL_DA'),
('DM_CF02_CF', 18, 'MON_CF02', 'NL_CAFE'),
('DM_CF02_DA', 100, 'MON_CF02', 'NL_DA'),
('DM_CF02_SD', 50, 'MON_CF02', 'NL_SUA_DC'),
('DM_CF03_CF', 20, 'MON_CF03', 'NL_CAFE'),
('DM_CF03_SUA', 200, 'MON_CF03', 'NL_SUA'),
('DM_CF04_CF', 20, 'MON_CF04', 'NL_CAFE'),
('DM_CF04_SUA', 150, 'MON_CF04', 'NL_SUA_TT'),
('DM_CF05_CF', 30, 'MON_CF05', 'NL_CAFE'),
('DM_CF05_DA', 200, 'MON_CF05', 'NL_DA'),
('DM_CF10_CF', 10, 'MON_CF10', 'NL_CAFE'),
('DM_CF10_SD', 100, 'MON_CF10', 'NL_SUA_DC'),
('DM_FD02_MS', 30, 'MON_FD02', 'NL_MASCA'),
('DM_SM01_SUA', 50, 'MON_SM01', 'NL_SUA_TT'),
('DM_SM01_XM', 150, 'MON_SM01', 'NL_XOAI'),
('DM_SM02_BO', 120, 'MON_SM02', 'NL_BO'),
('DM_SM02_SUA', 100, 'MON_SM02', 'NL_SUA_TT'),
('DM_TR01_DA', 150, 'MON_TR01', 'NL_DA'),
('DM_TR01_TRA', 30, 'MON_TR01', 'NL_TRA_ĐAO'),
('DM_TR03_SUA', 150, 'MON_TR03', 'NL_SUA_TT'),
('DM_TR03_TC', 30, 'MON_TR03', 'NL_TC_DEN');

-- --------------------------------------------------------

--
-- Table structure for table `doan`
--

CREATE TABLE `doan` (
  `maMon` varchar(191) NOT NULL,
  `thoiGianNau` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `doan`
--

INSERT INTO `doan` (`maMon`, `thoiGianNau`) VALUES
('MON_CK01', 0),
('MON_CK02', 0),
('MON_CK03', 0),
('MON_CK04', 0),
('MON_FD01', 5),
('MON_FD02', 0),
('MON_FD03', 5),
('MON_FD04', 8),
('MON_FD05', 10);

-- --------------------------------------------------------

--
-- Table structure for table `donhang`
--

CREATE TABLE `donhang` (
  `maDonHang` varchar(191) NOT NULL,
  `tongTien` decimal(18,2) DEFAULT NULL,
  `trangThai` varchar(191) NOT NULL,
  `thoiGianTao` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `loaiDonHang` varchar(191) NOT NULL,
  `daDongBo` tinyint(1) NOT NULL DEFAULT 0,
  `maDonDoiTac` varchar(100) DEFAULT NULL,
  `soTheRung` varchar(191) DEFAULT NULL,
  `maBan` varchar(191) DEFAULT NULL,
  `maNhanVien` varchar(191) DEFAULT NULL,
  `maKhachHang` varchar(191) DEFAULT NULL,
  `maKM` varchar(191) DEFAULT NULL,
  `maMayKDS` varchar(191) DEFAULT NULL,
  `maMayPOS` varchar(191) DEFAULT NULL,
  `maDiaChi` int(11) DEFAULT NULL,
  `phiVanChuyen` decimal(18,2) NOT NULL DEFAULT 0.00,
  `tienGiamGia` decimal(18,2) NOT NULL DEFAULT 0.00,
  `tongThanhToan` decimal(18,2) DEFAULT NULL,
  `ghiChu` text DEFAULT NULL,
  `thongTinGuest` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `donhang`
--

INSERT INTO `donhang` (`maDonHang`, `tongTien`, `trangThai`, `thoiGianTao`, `loaiDonHang`, `daDongBo`, `maDonDoiTac`, `soTheRung`, `maBan`, `maNhanVien`, `maKhachHang`, `maKM`, `maMayKDS`, `maMayPOS`, `maDiaChi`, `phiVanChuyen`, `tienGiamGia`, `tongThanhToan`, `ghiChu`, `thongTinGuest`) VALUES
('DH_M01', 185000.00, 'HOAN_THANH', '2026-05-25 08:50:42.000', 'TAI_QUAN', 0, NULL, NULL, NULL, 'NV_CASHIER01', NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, 185000.00, NULL, NULL),
('DH_M02', 245000.00, 'HOAN_THANH', '2026-05-24 08:50:42.000', 'TAI_QUAN', 0, NULL, NULL, NULL, 'NV_CASHIER01', NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, 245000.00, NULL, NULL),
('DH_M03', 90000.00, 'HOAN_THANH', '2026-05-23 08:50:42.000', 'MANG_VE', 0, NULL, NULL, NULL, 'NV_CASHIER01', NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, 90000.00, NULL, NULL),
('DH_M04', 310000.00, 'HOAN_THANH', '2026-05-22 08:50:42.000', 'TAI_QUAN', 0, NULL, NULL, NULL, 'NV_CASHIER01', NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, 310000.00, NULL, NULL),
('DH_M05', 155000.00, 'HOAN_THANH', '2026-05-21 08:50:42.000', 'GRAB', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, 155000.00, NULL, NULL),
('DH_M06', 200000.00, 'HOAN_THANH', '2026-05-20 08:50:42.000', 'TAI_QUAN', 0, NULL, NULL, NULL, 'NV_CASHIER01', NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, 200000.00, NULL, NULL),
('DH_M07', 125000.00, 'HOAN_THANH', '2026-05-19 08:50:42.000', 'SHOPEE', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, 125000.00, NULL, NULL),
('DH_M08', 275000.00, 'HOAN_THANH', '2026-05-18 08:50:42.000', 'TAI_QUAN', 0, NULL, NULL, NULL, 'NV_CASHIER01', NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, 275000.00, NULL, NULL),
('DH_M09', 95000.00, 'HOAN_THANH', '2026-05-17 08:50:42.000', 'MANG_VE', 0, NULL, NULL, NULL, 'NV_CASHIER01', NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, 95000.00, NULL, NULL),
('DH_M10', 340000.00, 'HOAN_THANH', '2026-05-16 08:50:42.000', 'TAI_QUAN', 0, NULL, NULL, NULL, 'NV_CASHIER01', NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, 340000.00, NULL, NULL),
('DH_M11', 180000.00, 'HOAN_THANH', '2026-05-15 08:50:42.000', 'TAI_QUAN', 0, NULL, NULL, NULL, 'NV_CASHIER01', NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, 180000.00, NULL, NULL),
('DH_M12', 215000.00, 'HOAN_THANH', '2026-05-14 08:50:42.000', 'GRAB', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, 215000.00, NULL, NULL),
('DH_M13', 145000.00, 'HOAN_THANH', '2026-05-13 08:50:42.000', 'TAI_QUAN', 0, NULL, NULL, NULL, 'NV_CASHIER01', NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, 145000.00, NULL, NULL),
('DH_M14', 290000.00, 'HOAN_THANH', '2026-05-12 08:50:42.000', 'TAI_QUAN', 0, NULL, NULL, NULL, 'NV_CASHIER01', NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, 290000.00, NULL, NULL),
('DH_TODAY03', 55000.00, 'HOAN_THANH', '2026-06-01 05:50:42.000', 'MANG_VE', 0, NULL, NULL, NULL, 'NV_CASHIER01', NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, 55000.00, NULL, NULL),
('DH_TODAY05', 65000.00, 'HOAN_THANH', '2026-06-01 08:20:42.000', 'TAI_QUAN', 0, NULL, NULL, 'BAN_C1', 'NV_CASHIER01', NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, 65000.00, NULL, NULL),
('DH_TODAY06', 110000.00, 'HOAN_THANH', '2026-06-01 08:40:42.000', 'GRAB', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, 110000.00, NULL, NULL),
('DH_W01', 95000.00, 'HOAN_THANH', '2026-05-31 08:50:42.000', 'TAI_QUAN', 0, NULL, NULL, NULL, 'NV_CASHIER01', NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, 95000.00, NULL, NULL),
('DH_W02', 145000.00, 'HOAN_THANH', '2026-05-31 08:50:42.000', 'MANG_VE', 0, NULL, NULL, NULL, 'NV_CASHIER01', NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, 145000.00, NULL, NULL),
('DH_W03', 200000.00, 'HOAN_THANH', '2026-05-30 08:50:42.000', 'TAI_QUAN', 0, NULL, NULL, NULL, 'NV_CASHIER01', NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, 200000.00, NULL, NULL),
('DH_W04', 75000.00, 'HOAN_THANH', '2026-05-30 08:50:42.000', 'MANG_VE', 0, NULL, NULL, NULL, 'NV_CASHIER01', NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, 75000.00, NULL, NULL),
('DH_W05', 160000.00, 'HOAN_THANH', '2026-05-29 08:50:42.000', 'TAI_QUAN', 0, NULL, NULL, NULL, 'NV_CASHIER01', NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, 160000.00, NULL, NULL),
('DH_W06', 85000.00, 'HOAN_THANH', '2026-05-29 08:50:42.000', 'GRAB', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, 85000.00, NULL, NULL),
('DH_W07', 220000.00, 'HOAN_THANH', '2026-05-28 08:50:42.000', 'TAI_QUAN', 0, NULL, NULL, NULL, 'NV_CASHIER01', NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, 220000.00, NULL, NULL),
('DH_W08', 55000.00, 'HOAN_THANH', '2026-05-28 08:50:42.000', 'SHOPEE', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, 55000.00, NULL, NULL),
('DH_W09', 130000.00, 'HOAN_THANH', '2026-05-27 08:50:42.000', 'TAI_QUAN', 0, NULL, NULL, NULL, 'NV_CASHIER01', NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, 130000.00, NULL, NULL),
('DH_W10', 95000.00, 'HOAN_THANH', '2026-05-26 08:50:42.000', 'MANG_VE', 0, NULL, NULL, NULL, 'NV_CASHIER01', NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, 95000.00, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `douong`
--

CREATE TABLE `douong` (
  `maMon` varchar(191) NOT NULL,
  `mucDoDa` varchar(191) DEFAULT NULL,
  `mucDoDuong` varchar(191) DEFAULT NULL,
  `mucSize` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `douong`
--

INSERT INTO `douong` (`maMon`, `mucDoDa`, `mucDoDuong`, `mucSize`) VALUES
('MON_CF01', 'NHIEU', 'BINH_THUONG', 'M'),
('MON_CF02', 'NHIEU', 'BINH_THUONG', 'M'),
('MON_CF03', 'NHIEU', 'BINH_THUONG', 'M'),
('MON_CF04', 'NHIEU', 'BINH_THUONG', 'M'),
('MON_CF05', 'NHIEU', 'BINH_THUONG', 'M'),
('MON_CF06', 'NHIEU', 'KHONG', 'M'),
('MON_CF07', 'KHONG', 'KHONG', 'S'),
('MON_CF08', 'IT', 'IT', 'M'),
('MON_CF09', 'NHIEU', 'IT', 'M'),
('MON_CF10', 'NHIEU', 'NHIEU', 'M'),
('MON_ML01', 'NHIEU', 'BINH_THUONG', 'L'),
('MON_ML02', 'NHIEU', 'BINH_THUONG', 'L'),
('MON_ML03', 'NHIEU', 'BINH_THUONG', 'L'),
('MON_SM01', 'NHIEU', 'BINH_THUONG', 'M'),
('MON_SM02', 'NHIEU', 'BINH_THUONG', 'M'),
('MON_SM03', 'NHIEU', 'IT', 'L'),
('MON_SM04', 'NHIEU', 'IT', 'L'),
('MON_SM05', 'NHIEU', 'IT', 'L'),
('MON_TR01', 'NHIEU', 'BINH_THUONG', 'M'),
('MON_TR02', 'NHIEU', 'BINH_THUONG', 'M'),
('MON_TR03', 'NHIEU', 'BINH_THUONG', 'L'),
('MON_TR04', 'IT', 'IT', 'M'),
('MON_TR05', 'IT', 'IT', 'M'),
('MON_TR06', 'NHIEU', 'BINH_THUONG', 'M');

-- --------------------------------------------------------

--
-- Table structure for table `giohang`
--

CREATE TABLE `giohang` (
  `maGioHang` int(11) NOT NULL,
  `maNguoiDung` varchar(191) DEFAULT NULL,
  `sessionId` varchar(255) DEFAULT NULL,
  `ngayTao` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `hinhanhmon`
--

CREATE TABLE `hinhanhmon` (
  `maHinhAnh` int(11) NOT NULL,
  `maMon` varchar(191) NOT NULL,
  `urlAnh` varchar(500) NOT NULL,
  `laAnhChinh` tinyint(1) NOT NULL DEFAULT 0,
  `thuTu` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `khachhang`
--

CREATE TABLE `khachhang` (
  `maKhachHang` varchar(191) NOT NULL,
  `hoTen` varchar(191) NOT NULL,
  `soDienThoai` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `khachhang`
--

INSERT INTO `khachhang` (`maKhachHang`, `hoTen`, `soDienThoai`) VALUES
('KH_GUEST01', 'Khách lẻ 1', '0900000001'),
('KH_GUEST02', 'Khách lẻ 2', '0900000002'),
('KH_GUEST03', 'Nguyễn Văn An', '0901234567'),
('KH_GUEST04', 'Trần Thị Bình', '0907654321'),
('KH_GUEST05', 'Lê Minh Tuấn', '0912345678');

-- --------------------------------------------------------

--
-- Table structure for table `khachthanhvien`
--

CREATE TABLE `khachthanhvien` (
  `maKhachHang` varchar(191) NOT NULL,
  `hangThanhVien` varchar(191) DEFAULT NULL,
  `diemThuong` int(11) NOT NULL DEFAULT 0,
  `ngayDangKy` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `khachvanglai`
--

CREATE TABLE `khachvanglai` (
  `maKhachHang` varchar(191) NOT NULL,
  `thongTinTam` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `khuyenmai`
--

CREATE TABLE `khuyenmai` (
  `maKM` varchar(191) NOT NULL,
  `giaTriGiam` decimal(18,2) NOT NULL,
  `ngayBatDau` datetime(3) NOT NULL,
  `ngayKetThuc` datetime(3) NOT NULL,
  `soLuongToiDa` int(11) DEFAULT NULL,
  `trangThai` tinyint(1) NOT NULL DEFAULT 1,
  `loaiKhuyenMai` varchar(191) NOT NULL,
  `dieuKienDonToiThieu` decimal(18,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `khuyenmai`
--

INSERT INTO `khuyenmai` (`maKM`, `giaTriGiam`, `ngayBatDau`, `ngayKetThuc`, `soLuongToiDa`, `trangThai`, `loaiKhuyenMai`, `dieuKienDonToiThieu`) VALUES
('KM_BIRTHDAY', 30.00, '2024-01-01 00:00:00.000', '2026-12-31 00:00:00.000', 100, 1, 'PHAN_TRAM', 0.00),
('KM_FREESHIP', 30000.00, '2024-01-01 00:00:00.000', '2026-12-31 00:00:00.000', 300, 1, 'TIEN_MAT', 150000.00),
('KM_HAPPY', 15.00, '2024-06-01 00:00:00.000', '2024-06-30 00:00:00.000', 200, 1, 'PHAN_TRAM', 80000.00),
('KM_SALE50K', 50000.00, '2024-01-01 00:00:00.000', '2025-12-31 00:00:00.000', 500, 1, 'TIEN_MAT', 200000.00),
('KM_VIP10', 10.00, '2024-01-01 00:00:00.000', '2026-12-31 00:00:00.000', 9999, 1, 'PHAN_TRAM', 50000.00),
('KM_WELCOME', 20.00, '2024-01-01 00:00:00.000', '2025-12-31 00:00:00.000', 1000, 1, 'PHAN_TRAM', 100000.00);

-- --------------------------------------------------------

--
-- Table structure for table `mon`
--

CREATE TABLE `mon` (
  `maMon` varchar(191) NOT NULL,
  `tenMon` varchar(191) NOT NULL,
  `giaBan` decimal(18,2) NOT NULL,
  `maDanhMuc` varchar(191) NOT NULL,
  `daXoa` tinyint(1) NOT NULL DEFAULT 0,
  `slug` varchar(191) DEFAULT NULL,
  `moTa` text DEFAULT NULL,
  `diemDanhGia` double NOT NULL DEFAULT 0,
  `isNoiBat` tinyint(1) NOT NULL DEFAULT 0,
  `ngayTao` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mon`
--

INSERT INTO `mon` (`maMon`, `tenMon`, `giaBan`, `maDanhMuc`, `daXoa`, `slug`, `moTa`, `diemDanhGia`, `isNoiBat`, `ngayTao`) VALUES
('MON_CF01', 'Cà Phê Đen', 25000.00, 'cat-cf', 0, 'ca-phe-den', 'Cà phê đen đậm đà, pha phin truyền thống', 0, 1, '2026-06-01 01:38:39.566'),
('MON_CF02', 'Cà Phê Sữa', 35000.00, 'cat-cf', 0, 'ca-phe-sua', 'Cà phê sữa thơm ngon, béo ngậy', 0, 0, '2026-06-01 01:38:39.570'),
('MON_CF03', 'Cà Phê Latte', 55000.00, 'cat-cf', 0, 'ca-phe-latte', 'Latte với sữa hấp mịn và lớp bọt sữa', 0, 1, '2026-06-01 01:38:39.580'),
('MON_CF04', 'Cappuccino', 60000.00, 'cat-cf', 0, 'cappuccino', 'Cappuccino cân bằng espresso và sữa', 0, 0, '2026-06-01 01:38:39.584'),
('MON_CF05', 'Cold Brew', 65000.00, 'cat-cf', 0, 'cold-brew', 'Ủ lạnh 24 giờ, hương vị đậm đà, ít đắng', 0, 0, '2026-06-01 01:38:39.589'),
('MON_CF06', 'Americano', 45000.00, 'cat-cf', 0, 'americano', 'Espresso pha loãng với nước nóng', 4.3, 0, '2026-06-01 08:50:41.927'),
('MON_CF07', 'Espresso', 40000.00, 'cat-cf', 0, 'espresso', 'Espresso nguyên chất, đậm đặc', 4.4, 0, '2026-06-01 08:50:41.927'),
('MON_CF08', 'Flat White', 60000.00, 'cat-cf', 0, 'flat-white', 'Espresso đôi với sữa hấp mịn, ít bọt', 4.5, 0, '2026-06-01 08:50:41.927'),
('MON_CF09', 'Cà Phê Cốt Dừa', 65000.00, 'cat-cf', 0, 'ca-phe-cot-dua', 'Cà phê kết hợp nước cốt dừa béo ngậy', 4.8, 1, '2026-06-01 08:50:41.927'),
('MON_CF10', 'Bạc Xỉu', 38000.00, 'cat-cf', 0, 'bac-xiu', 'Cà phê sữa nhiều sữa ít cà phê, đặc trưng Sài Gòn', 4.6, 1, '2026-06-01 08:50:41.927'),
('MON_CK01', 'Cheesecake Dâu', 70000.00, 'cat-cake', 0, 'cheesecake-dau', 'Cheesecake New York với topping dâu tây tươi', 4.9, 1, '2026-06-01 08:50:41.927'),
('MON_CK02', 'Bánh Brownie', 50000.00, 'cat-cake', 0, 'banh-brownie', 'Brownie chocolate đậm đặc, fudgy', 4.7, 0, '2026-06-01 08:50:41.927'),
('MON_CK03', 'Macaron', 55000.00, 'cat-cake', 0, 'macaron', 'Macaron Pháp nhiều màu sắc, nhân kem mịn', 4.6, 0, '2026-06-01 08:50:41.927'),
('MON_CK04', 'Bánh Tart Trứng', 35000.00, 'cat-cake', 0, 'banh-tart-trung', 'Bánh tart trứng kiểu Bồ Đào Nha', 4.8, 1, '2026-06-01 08:50:41.927'),
('MON_FD01', 'Bánh Croissant', 40000.00, 'cat-fd', 0, 'banh-croissant', NULL, 0, 0, '2026-06-01 01:38:39.608'),
('MON_FD02', 'Tiramisu', 65000.00, 'cat-fd', 0, 'tiramisu', NULL, 0, 1, '2026-06-01 01:38:39.612'),
('MON_FD03', 'Bánh Mì Sandwich', 45000.00, 'cat-fd', 0, 'banh-mi-sandwich', 'Sandwich với rau tươi và sốt đặc biệt', 4.3, 0, '2026-06-01 08:50:41.927'),
('MON_FD04', 'Khoai Tây Chiên', 35000.00, 'cat-fd', 0, 'khoai-tay-chien', 'Khoai tây chiên giòn ăn kèm tương ớt', 4.2, 0, '2026-06-01 08:50:41.927'),
('MON_FD05', 'Bánh Waffle', 55000.00, 'cat-fd', 0, 'banh-waffle', 'Waffle giòn ăn kèm whipping cream và mứt dâu', 4.7, 1, '2026-06-01 08:50:41.927'),
('MON_ML01', 'Milkshake Chocolate', 65000.00, 'cat-ml', 0, 'milkshake-choco', 'Milkshake chocolate đậm đà, béo ngậy', 4.8, 1, '2026-06-01 08:50:41.927'),
('MON_ML02', 'Milkshake Dâu', 60000.00, 'cat-ml', 0, 'milkshake-dau', 'Milkshake dâu tây hồng đẹp mắt', 4.6, 0, '2026-06-01 08:50:41.927'),
('MON_ML03', 'Milkshake Vanilla', 60000.00, 'cat-ml', 0, 'milkshake-vanilla', 'Milkshake vanilla thơm dịu cổ điển', 4.5, 0, '2026-06-01 08:50:41.927'),
('MON_SM01', 'Sinh Tố Xoài', 50000.00, 'cat-sm', 0, 'sinh-to-xoai', NULL, 0, 1, '2026-06-01 01:38:39.601'),
('MON_SM02', 'Sinh Tố Bơ', 55000.00, 'cat-sm', 0, 'sinh-to-bo', NULL, 0, 0, '2026-06-01 01:38:39.604'),
('MON_SM03', 'Sinh Tố Dâu', 50000.00, 'cat-sm', 0, 'sinh-to-dau', 'Sinh tố dâu tây tươi chua ngọt', 4.5, 0, '2026-06-01 08:50:41.927'),
('MON_SM04', 'Sinh Tố Chuối', 45000.00, 'cat-sm', 0, 'sinh-to-chuoi', 'Sinh tố chuối mật mịn bổ dưỡng', 4.3, 0, '2026-06-01 08:50:41.927'),
('MON_SM05', 'Sinh Tố Mãng Cầu', 55000.00, 'cat-sm', 0, 'sinh-to-mang-cau', 'Sinh tố mãng cầu thơm ngon đặc biệt', 4.6, 0, '2026-06-01 08:50:41.927'),
('MON_TR01', 'Trà Đào', 45000.00, 'cat-tr', 0, 'tra-dao', 'Trà đào cam sả thơm mát', 0, 0, '2026-06-01 01:38:39.593'),
('MON_TR02', 'Trà Chanh', 30000.00, 'cat-tr', 0, 'tra-chanh', NULL, 0, 0, '2026-06-01 01:38:39.596'),
('MON_TR03', 'Trà Sữa Trân Châu', 55000.00, 'cat-tr', 0, 'tra-sua-tran-chau', 'Trà sữa đài loan với trân châu đen dẻo', 4.8, 1, '2026-06-01 08:50:41.927'),
('MON_TR04', 'Trà Ô Long', 50000.00, 'cat-tr', 0, 'tra-o-long', 'Trà ô long thơm dịu, tốt cho sức khỏe', 4.5, 0, '2026-06-01 08:50:41.927'),
('MON_TR05', 'Trà Xanh Latte', 55000.00, 'cat-tr', 0, 'tra-xanh-latte', 'Matcha latte mịn màng với sữa hấp', 4.6, 1, '2026-06-01 08:50:41.927'),
('MON_TR06', 'Trà Vải', 45000.00, 'cat-tr', 0, 'tra-vai', 'Trà vải hương thơm đặc trưng', 4.4, 0, '2026-06-01 08:50:41.927');

-- --------------------------------------------------------

--
-- Table structure for table `nguoidung`
--

CREATE TABLE `nguoidung` (
  `maNguoiDung` varchar(191) NOT NULL,
  `hoTen` varchar(191) NOT NULL,
  `diaChi` varchar(191) DEFAULT NULL,
  `soDienThoai` varchar(191) DEFAULT NULL,
  `matKhau` varchar(191) DEFAULT NULL,
  `email` varchar(191) DEFAULT NULL,
  `supabaseId` char(36) DEFAULT NULL,
  `authProvider` varchar(191) NOT NULL DEFAULT 'LOCAL',
  `avatarUrl` varchar(500) DEFAULT NULL,
  `ngaySinh` date DEFAULT NULL,
  `gioiTinh` varchar(191) DEFAULT NULL,
  `verificationToken` varchar(64) DEFAULT NULL,
  `forgetToken` varchar(64) DEFAULT NULL,
  `ngayTao` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `isDeleted` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `nguoidung`
--

INSERT INTO `nguoidung` (`maNguoiDung`, `hoTen`, `diaChi`, `soDienThoai`, `matKhau`, `email`, `supabaseId`, `authProvider`, `avatarUrl`, `ngaySinh`, `gioiTinh`, `verificationToken`, `forgetToken`, `ngayTao`, `isDeleted`) VALUES
('KH_GUEST01', 'Khách lẻ 1', NULL, '0900000001', NULL, NULL, NULL, 'LOCAL', NULL, NULL, NULL, NULL, NULL, '2026-06-01 08:50:42.000', 0),
('KH_GUEST02', 'Khách lẻ 2', NULL, '0900000002', NULL, NULL, NULL, 'LOCAL', NULL, NULL, NULL, NULL, NULL, '2026-06-01 08:50:42.000', 0),
('KH_GUEST03', 'Nguyễn Văn An', NULL, '0901234567', NULL, NULL, NULL, 'LOCAL', NULL, NULL, NULL, NULL, NULL, '2026-06-01 08:50:42.000', 0),
('KH_GUEST04', 'Trần Thị Bình', NULL, '0907654321', NULL, NULL, NULL, 'LOCAL', NULL, NULL, NULL, NULL, NULL, '2026-06-01 08:50:42.000', 0),
('KH_GUEST05', 'Lê Minh Tuấn', NULL, '0912345678', NULL, NULL, NULL, 'LOCAL', NULL, NULL, NULL, NULL, NULL, '2026-06-01 08:50:42.000', 0),
('NV_BARISTA01', 'Lê Pha Chế', NULL, NULL, '$2a$10$TH5fHRnuO7gtS.ZsB.Bz9etDXzlgnNAcJK3JFerLPjujphWYwiYNa', 'barista@cafe.vn', NULL, 'LOCAL', NULL, NULL, NULL, NULL, NULL, '2026-06-01 01:38:39.535', 0),
('NV_CASHIER01', 'Trần Thu Ngân', NULL, NULL, '$2a$10$TH5fHRnuO7gtS.ZsB.Bz9etDXzlgnNAcJK3JFerLPjujphWYwiYNa', 'cashier@cafe.vn', NULL, 'LOCAL', NULL, NULL, NULL, NULL, NULL, '2026-06-01 01:38:39.519', 0),
('NV_MANAGER01', 'Nguyễn Quản Lý', NULL, NULL, '$2a$10$TH5fHRnuO7gtS.ZsB.Bz9etDXzlgnNAcJK3JFerLPjujphWYwiYNa', 'manager@cafe.vn', NULL, 'LOCAL', NULL, NULL, NULL, NULL, NULL, '2026-06-01 01:38:39.499', 0);

-- --------------------------------------------------------

--
-- Table structure for table `nguyenlieu`
--

CREATE TABLE `nguyenlieu` (
  `maNguyenLieu` varchar(191) NOT NULL,
  `tenNL` varchar(191) NOT NULL,
  `tonKho` double NOT NULL,
  `donVi` varchar(191) NOT NULL,
  `daXoa` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `nguyenlieu`
--

INSERT INTO `nguyenlieu` (`maNguyenLieu`, `tenNL`, `tonKho`, `donVi`, `daXoa`) VALUES
('NL_BANH_MY', 'Bánh mì sandwich', 500, 'cái', 0),
('NL_BO', 'Quả bơ', 5000, 'g', 0),
('NL_BOT_MY', 'Bột mì', 10000, 'g', 0),
('NL_CAFE', 'Cà phê rang xay', 5000, 'g', 0),
('NL_CHOCO', 'Bột chocolate', 2000, 'g', 0),
('NL_CHUOI', 'Chuối', 6000, 'g', 0),
('NL_DA', 'Đá viên', 50000, 'g', 0),
('NL_DAU', 'Dâu tây', 4000, 'g', 0),
('NL_DUONG', 'Đường', 10000, 'g', 0),
('NL_KEM', 'Kem tươi whipping', 5000, 'ml', 0),
('NL_MASCA', 'Mascarpone cheese', 2000, 'g', 0),
('NL_SUA', 'Sữa tươi', 20000, 'ml', 0),
('NL_SUA_DC', 'Sữa đặc', 10000, 'ml', 0),
('NL_SUA_TT', 'Sữa tươi', 20000, 'ml', 0),
('NL_TC_DEN', 'Trân châu đen', 3000, 'g', 0),
('NL_TRA_ĐAO', 'Siro đào', 5000, 'ml', 0),
('NL_TRA_OL', 'Trà ô long', 3000, 'g', 0),
('NL_TRA_XH', 'Trà xanh (matcha)', 2000, 'g', 0),
('NL_TRANH', 'Trà xanh', 3000, 'g', 0),
('NL_TRUNG', 'Trứng gà', 1000, 'quả', 0),
('NL_XOAI', 'Xoài tươi', 8000, 'g', 0);

-- --------------------------------------------------------

--
-- Table structure for table `nhacungcap`
--

CREATE TABLE `nhacungcap` (
  `maNCC` varchar(191) NOT NULL,
  `tenNCC` varchar(191) NOT NULL,
  `congNo` decimal(18,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `nhacungcap`
--

INSERT INTO `nhacungcap` (`maNCC`, `tenNCC`, `congNo`) VALUES
('NCC_BANH01', 'Xưởng Bánh Ngọt Hương Vị', 0.00),
('NCC_CF01', 'Công ty Cà Phê Trung Nguyên', 0.00),
('NCC_RAU01', 'Chợ Đầu Mối Nông Sản Thủ Đức', 0.00),
('NCC_SUA01', 'Công ty Sữa Vinamilk', 0.00);

-- --------------------------------------------------------

--
-- Table structure for table `nhanvien`
--

CREATE TABLE `nhanvien` (
  `maNhanVien` varchar(191) NOT NULL,
  `hireDate` datetime(3) NOT NULL,
  `maVaiTro` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `nhanvien`
--

INSERT INTO `nhanvien` (`maNhanVien`, `hireDate`, `maVaiTro`) VALUES
('NV_BARISTA01', '2026-06-01 01:38:39.538', 'pha-che'),
('NV_CASHIER01', '2026-06-01 01:38:39.527', 'thu-ngan'),
('NV_MANAGER01', '2026-06-01 01:38:39.511', 'quan-ly');

-- --------------------------------------------------------

--
-- Table structure for table `phieukho`
--

CREATE TABLE `phieukho` (
  `maPhieu` varchar(191) NOT NULL,
  `thoiGianLap` datetime(3) NOT NULL,
  `tongGiaTri` decimal(18,2) NOT NULL,
  `loaiPhieu` varchar(191) NOT NULL,
  `maNCC` varchar(191) NOT NULL,
  `maNhanVien` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `refund`
--

CREATE TABLE `refund` (
  `maRefund` int(11) NOT NULL,
  `maThanhToan` varchar(191) NOT NULL,
  `gatewayRefundId` varchar(255) DEFAULT NULL,
  `amount` decimal(18,2) NOT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'PENDING',
  `reason` text DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `thanhtoan`
--

CREATE TABLE `thanhtoan` (
  `maThanhToan` varchar(191) NOT NULL,
  `maDonHang` varchar(191) NOT NULL,
  `soTienGiaoDich` decimal(18,2) DEFAULT NULL,
  `thoiGianThanhToan` datetime(3) NOT NULL,
  `trangThaiGiaoDich` varchar(191) NOT NULL,
  `maMayInBill` varchar(191) DEFAULT NULL,
  `maMayPOS` varchar(191) DEFAULT NULL,
  `phuongThuc` varchar(191) DEFAULT NULL,
  `gatewayTransactionId` varchar(255) DEFAULT NULL,
  `gatewayName` varchar(191) DEFAULT NULL,
  `expirationTime` datetime(3) DEFAULT NULL,
  `paymentUrl` text DEFAULT NULL,
  `errorCode` varchar(191) DEFAULT NULL,
  `errorMessage` text DEFAULT NULL,
  `anhBienLai` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `thanhtoan`
--

INSERT INTO `thanhtoan` (`maThanhToan`, `maDonHang`, `soTienGiaoDich`, `thoiGianThanhToan`, `trangThaiGiaoDich`, `maMayInBill`, `maMayPOS`, `phuongThuc`, `gatewayTransactionId`, `gatewayName`, `expirationTime`, `paymentUrl`, `errorCode`, `errorMessage`, `anhBienLai`) VALUES
('TT_M01', 'DH_M01', 185000.00, '2026-05-25 08:50:42.000', 'THANH_CONG', NULL, NULL, 'THE_NGAN_HANG', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('TT_M02', 'DH_M02', 245000.00, '2026-05-24 08:50:42.000', 'THANH_CONG', NULL, NULL, 'TIEN_MAT', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('TT_M03', 'DH_M03', 90000.00, '2026-05-23 08:50:42.000', 'THANH_CONG', NULL, NULL, 'QR', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('TT_M04', 'DH_M04', 310000.00, '2026-05-22 08:50:42.000', 'THANH_CONG', NULL, NULL, 'TIEN_MAT', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('TT_M05', 'DH_M05', 155000.00, '2026-05-21 08:50:42.000', 'THANH_CONG', NULL, NULL, 'QR', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('TT_M06', 'DH_M06', 200000.00, '2026-05-20 08:50:42.000', 'THANH_CONG', NULL, NULL, 'THE_NGAN_HANG', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('TT_M07', 'DH_M07', 125000.00, '2026-05-19 08:50:42.000', 'THANH_CONG', NULL, NULL, 'QR', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('TT_M08', 'DH_M08', 275000.00, '2026-05-18 08:50:42.000', 'THANH_CONG', NULL, NULL, 'TIEN_MAT', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('TT_M09', 'DH_M09', 95000.00, '2026-05-17 08:50:42.000', 'THANH_CONG', NULL, NULL, 'QR', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('TT_M10', 'DH_M10', 340000.00, '2026-05-16 08:50:42.000', 'THANH_CONG', NULL, NULL, 'THE_NGAN_HANG', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('TT_M11', 'DH_M11', 180000.00, '2026-05-15 08:50:42.000', 'THANH_CONG', NULL, NULL, 'TIEN_MAT', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('TT_M12', 'DH_M12', 215000.00, '2026-05-14 08:50:42.000', 'THANH_CONG', NULL, NULL, 'QR', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('TT_M13', 'DH_M13', 145000.00, '2026-05-13 08:50:42.000', 'THANH_CONG', NULL, NULL, 'TIEN_MAT', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('TT_M14', 'DH_M14', 290000.00, '2026-05-12 08:50:42.000', 'THANH_CONG', NULL, NULL, 'THE_NGAN_HANG', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('TT_TODAY03', 'DH_TODAY03', 55000.00, '2026-06-01 05:50:42.000', 'THANH_CONG', NULL, NULL, 'TIEN_MAT', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('TT_W01', 'DH_W01', 95000.00, '2026-05-31 08:50:42.000', 'THANH_CONG', NULL, NULL, 'TIEN_MAT', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('TT_W02', 'DH_W02', 145000.00, '2026-05-31 08:50:42.000', 'THANH_CONG', NULL, NULL, 'QR', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('TT_W03', 'DH_W03', 200000.00, '2026-05-30 08:50:42.000', 'THANH_CONG', NULL, NULL, 'TIEN_MAT', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('TT_W04', 'DH_W04', 75000.00, '2026-05-30 08:50:42.000', 'THANH_CONG', NULL, NULL, 'QR', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('TT_W05', 'DH_W05', 160000.00, '2026-05-29 08:50:42.000', 'THANH_CONG', NULL, NULL, 'THE_NGAN_HANG', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('TT_W06', 'DH_W06', 85000.00, '2026-05-29 08:50:42.000', 'THANH_CONG', NULL, NULL, 'QR', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('TT_W07', 'DH_W07', 220000.00, '2026-05-28 08:50:42.000', 'THANH_CONG', NULL, NULL, 'TIEN_MAT', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('TT_W08', 'DH_W08', 55000.00, '2026-05-28 08:50:42.000', 'THANH_CONG', NULL, NULL, 'QR', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('TT_W09', 'DH_W09', 130000.00, '2026-05-27 08:50:42.000', 'THANH_CONG', NULL, NULL, 'TIEN_MAT', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('TT_W10', 'DH_W10', 95000.00, '2026-05-26 08:50:42.000', 'THANH_CONG', NULL, NULL, 'QR', NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `thanhtoanqr`
--

CREATE TABLE `thanhtoanqr` (
  `maThanhToan` varchar(191) NOT NULL,
  `qrContent` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `thanhtoanthenganhang`
--

CREATE TABLE `thanhtoanthenganhang` (
  `maThanhToan` varchar(191) NOT NULL,
  `tenNganHang` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `thanhtoantienmat`
--

CREATE TABLE `thanhtoantienmat` (
  `maThanhToan` varchar(191) NOT NULL,
  `tienKhachDua` decimal(18,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `thietbingoaivi`
--

CREATE TABLE `thietbingoaivi` (
  `maThietBi` varchar(191) NOT NULL,
  `ipAddress` varchar(191) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `loai` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `transactionlog`
--

CREATE TABLE `transactionlog` (
  `maLog` int(11) NOT NULL,
  `maThanhToan` varchar(191) NOT NULL,
  `gatewayTransactionId` varchar(255) DEFAULT NULL,
  `gatewayName` varchar(191) DEFAULT NULL,
  `requestData` text DEFAULT NULL,
  `responseData` text DEFAULT NULL,
  `callbackData` text DEFAULT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'PENDING',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tuychonmon`
--

CREATE TABLE `tuychonmon` (
  `maTuyChon` varchar(191) NOT NULL,
  `tenTuyChon` varchar(191) NOT NULL,
  `loaiNhom` varchar(191) NOT NULL,
  `giaCongThem` decimal(18,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tuychonmon`
--

INSERT INTO `tuychonmon` (`maTuyChon`, `tenTuyChon`, `loaiNhom`, `giaCongThem`) VALUES
('TC_DA_IT', 'Ít đá', 'DA', 0.00),
('TC_DA_KG', 'Không đá', 'DA', 0.00),
('TC_DA_NHU', 'Đá nhuyễn', 'DA', 0.00),
('TC_DA_VF', 'Đá viên', 'DA', 0.00),
('TC_DG_100', '100% đường', 'DUONG', 0.00),
('TC_DG_30', '30% đường', 'DUONG', 0.00),
('TC_DG_50', '50% đường', 'DUONG', 0.00),
('TC_DG_70', '70% đường', 'DUONG', 0.00),
('TC_DG_KG', 'Không đường', 'DUONG', 0.00),
('TC_SHOT', 'Thêm espresso', 'EXTRA', 15000.00),
('TC_SIZE_L', 'Size L', 'SIZE', 10000.00),
('TC_SIZE_M', 'Size M', 'SIZE', 5000.00),
('TC_SIZE_S', 'Size S', 'SIZE', 0.00),
('TC_SIZE_XL', 'Size XL', 'SIZE', 15000.00),
('TC_SUA_DC', 'Sữa đặc', 'SUA', 5000.00),
('TC_SUA_OAT', 'Sữa yến mạch', 'SUA', 10000.00),
('TC_SUA_SOY', 'Sữa đậu nành', 'SUA', 8000.00),
('TC_SUA_TT', 'Sữa tươi', 'SUA', 0.00),
('TC_TOP_HH', 'Hạt trân châu', 'TOPPING', 8000.00),
('TC_TOP_JL', 'Thạch lá dứa', 'TOPPING', 8000.00),
('TC_TOP_KT', 'Kem tươi', 'TOPPING', 12000.00),
('TC_TOP_PS', 'Pudding sữa', 'TOPPING', 12000.00),
('TC_TOP_TC', 'Trân châu đen', 'TOPPING', 10000.00),
('TC_TOP_TT', 'Trân châu trắng', 'TOPPING', 10000.00);

-- --------------------------------------------------------

--
-- Table structure for table `vaitro`
--

CREATE TABLE `vaitro` (
  `maVaiTro` varchar(191) NOT NULL,
  `tenVaiTro` varchar(191) NOT NULL,
  `danhSachQuyen` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `vaitro`
--

INSERT INTO `vaitro` (`maVaiTro`, `tenVaiTro`, `danhSachQuyen`) VALUES
('pha-che', 'Pha chế', 'ORDER_READ,ORDER_UPDATE'),
('quan-ly', 'Quản lý', 'ALL'),
('thu-ngan', 'Thu ngân', 'ORDER_READ,ORDER_CREATE,PAYMENT_CREATE,TABLE_READ');

-- --------------------------------------------------------

--
-- Table structure for table `yeuthich`
--

CREATE TABLE `yeuthich` (
  `maNguoiDung` varchar(191) NOT NULL,
  `maMon` varchar(191) NOT NULL,
  `ngayThem` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `_montotuychonmon`
--

CREATE TABLE `_montotuychonmon` (
  `A` varchar(191) NOT NULL,
  `B` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ban`
--
ALTER TABLE `ban`
  ADD PRIMARY KEY (`maBan`),
  ADD UNIQUE KEY `Ban_soBan_key` (`soBan`);

--
-- Indexes for table `banner_quang_cao`
--
ALTER TABLE `banner_quang_cao`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `bienbansuco`
--
ALTER TABLE `bienbansuco`
  ADD PRIMARY KEY (`maBienBan`),
  ADD KEY `BienBanSuCo_maNhanVien_fkey` (`maNhanVien`);

--
-- Indexes for table `calamviec`
--
ALTER TABLE `calamviec`
  ADD PRIMARY KEY (`maCa`),
  ADD KEY `CaLamViec_maNhanVien_fkey` (`maNhanVien`);

--
-- Indexes for table `chitietdonhang`
--
ALTER TABLE `chitietdonhang`
  ADD PRIMARY KEY (`maChiTiet`),
  ADD KEY `ChiTietDonHang_maDonHang_fkey` (`maDonHang`),
  ADD KEY `ChiTietDonHang_maMon_fkey` (`maMon`);

--
-- Indexes for table `chitietdonhang_tuychonmon`
--
ALTER TABLE `chitietdonhang_tuychonmon`
  ADD PRIMARY KEY (`maChiTiet`,`maTuyChon`),
  ADD KEY `ChiTietDonHang_TuyChonMon_maTuyChon_fkey` (`maTuyChon`);

--
-- Indexes for table `chitietgiohang`
--
ALTER TABLE `chitietgiohang`
  ADD PRIMARY KEY (`maChiTietGio`),
  ADD KEY `ChiTietGioHang_maGioHang_fkey` (`maGioHang`),
  ADD KEY `ChiTietGioHang_maMon_fkey` (`maMon`);

--
-- Indexes for table `chitietphieukho`
--
ALTER TABLE `chitietphieukho`
  ADD PRIMARY KEY (`maPhieu`,`maNguyenLieu`),
  ADD KEY `ChiTietPhieuKho_maNguyenLieu_fkey` (`maNguyenLieu`);

--
-- Indexes for table `danhgia`
--
ALTER TABLE `danhgia`
  ADD PRIMARY KEY (`maDanhGia`),
  ADD KEY `DanhGia_maNguoiDung_fkey` (`maNguoiDung`),
  ADD KEY `DanhGia_maMon_fkey` (`maMon`);

--
-- Indexes for table `danhmucmon`
--
ALTER TABLE `danhmucmon`
  ADD PRIMARY KEY (`maDanhMuc`),
  ADD UNIQUE KEY `DanhMucMon_slug_key` (`slug`);

--
-- Indexes for table `diachigiaohang`
--
ALTER TABLE `diachigiaohang`
  ADD PRIMARY KEY (`maDiaChi`),
  ADD KEY `DiaChiGiaoHang_maNguoiDung_fkey` (`maNguoiDung`);

--
-- Indexes for table `dinhmuc`
--
ALTER TABLE `dinhmuc`
  ADD PRIMARY KEY (`maDinhMuc`),
  ADD KEY `DinhMuc_maMon_fkey` (`maMon`),
  ADD KEY `DinhMuc_maNguyenLieu_fkey` (`maNguyenLieu`);

--
-- Indexes for table `doan`
--
ALTER TABLE `doan`
  ADD PRIMARY KEY (`maMon`);

--
-- Indexes for table `donhang`
--
ALTER TABLE `donhang`
  ADD PRIMARY KEY (`maDonHang`),
  ADD KEY `DonHang_maBan_fkey` (`maBan`),
  ADD KEY `DonHang_maNhanVien_fkey` (`maNhanVien`),
  ADD KEY `DonHang_maKhachHang_fkey` (`maKhachHang`),
  ADD KEY `DonHang_maKM_fkey` (`maKM`),
  ADD KEY `DonHang_maDiaChi_fkey` (`maDiaChi`);

--
-- Indexes for table `douong`
--
ALTER TABLE `douong`
  ADD PRIMARY KEY (`maMon`);

--
-- Indexes for table `giohang`
--
ALTER TABLE `giohang`
  ADD PRIMARY KEY (`maGioHang`),
  ADD KEY `GioHang_maNguoiDung_fkey` (`maNguoiDung`);

--
-- Indexes for table `hinhanhmon`
--
ALTER TABLE `hinhanhmon`
  ADD PRIMARY KEY (`maHinhAnh`),
  ADD KEY `HinhAnhMon_maMon_fkey` (`maMon`);

--
-- Indexes for table `khachhang`
--
ALTER TABLE `khachhang`
  ADD PRIMARY KEY (`maKhachHang`);

--
-- Indexes for table `khachthanhvien`
--
ALTER TABLE `khachthanhvien`
  ADD PRIMARY KEY (`maKhachHang`);

--
-- Indexes for table `khachvanglai`
--
ALTER TABLE `khachvanglai`
  ADD PRIMARY KEY (`maKhachHang`);

--
-- Indexes for table `khuyenmai`
--
ALTER TABLE `khuyenmai`
  ADD PRIMARY KEY (`maKM`);

--
-- Indexes for table `mon`
--
ALTER TABLE `mon`
  ADD PRIMARY KEY (`maMon`),
  ADD UNIQUE KEY `Mon_slug_key` (`slug`),
  ADD KEY `Mon_maDanhMuc_fkey` (`maDanhMuc`);

--
-- Indexes for table `nguoidung`
--
ALTER TABLE `nguoidung`
  ADD PRIMARY KEY (`maNguoiDung`),
  ADD UNIQUE KEY `NguoiDung_soDienThoai_key` (`soDienThoai`),
  ADD UNIQUE KEY `NguoiDung_email_key` (`email`);

--
-- Indexes for table `nguyenlieu`
--
ALTER TABLE `nguyenlieu`
  ADD PRIMARY KEY (`maNguyenLieu`);

--
-- Indexes for table `nhacungcap`
--
ALTER TABLE `nhacungcap`
  ADD PRIMARY KEY (`maNCC`);

--
-- Indexes for table `nhanvien`
--
ALTER TABLE `nhanvien`
  ADD PRIMARY KEY (`maNhanVien`),
  ADD KEY `NhanVien_maVaiTro_fkey` (`maVaiTro`);

--
-- Indexes for table `phieukho`
--
ALTER TABLE `phieukho`
  ADD PRIMARY KEY (`maPhieu`),
  ADD KEY `PhieuKho_maNCC_fkey` (`maNCC`),
  ADD KEY `PhieuKho_maNhanVien_fkey` (`maNhanVien`);

--
-- Indexes for table `refund`
--
ALTER TABLE `refund`
  ADD PRIMARY KEY (`maRefund`),
  ADD KEY `Refund_maThanhToan_fkey` (`maThanhToan`);

--
-- Indexes for table `thanhtoan`
--
ALTER TABLE `thanhtoan`
  ADD PRIMARY KEY (`maThanhToan`),
  ADD UNIQUE KEY `ThanhToan_maDonHang_key` (`maDonHang`);

--
-- Indexes for table `thanhtoanqr`
--
ALTER TABLE `thanhtoanqr`
  ADD PRIMARY KEY (`maThanhToan`);

--
-- Indexes for table `thanhtoanthenganhang`
--
ALTER TABLE `thanhtoanthenganhang`
  ADD PRIMARY KEY (`maThanhToan`);

--
-- Indexes for table `thanhtoantienmat`
--
ALTER TABLE `thanhtoantienmat`
  ADD PRIMARY KEY (`maThanhToan`);

--
-- Indexes for table `thietbingoaivi`
--
ALTER TABLE `thietbingoaivi`
  ADD PRIMARY KEY (`maThietBi`);

--
-- Indexes for table `transactionlog`
--
ALTER TABLE `transactionlog`
  ADD PRIMARY KEY (`maLog`),
  ADD KEY `TransactionLog_maThanhToan_fkey` (`maThanhToan`);

--
-- Indexes for table `tuychonmon`
--
ALTER TABLE `tuychonmon`
  ADD PRIMARY KEY (`maTuyChon`);

--
-- Indexes for table `vaitro`
--
ALTER TABLE `vaitro`
  ADD PRIMARY KEY (`maVaiTro`);

--
-- Indexes for table `yeuthich`
--
ALTER TABLE `yeuthich`
  ADD PRIMARY KEY (`maNguoiDung`,`maMon`),
  ADD KEY `YeuThich_maMon_fkey` (`maMon`);

--
-- Indexes for table `_montotuychonmon`
--
ALTER TABLE `_montotuychonmon`
  ADD UNIQUE KEY `_MonToTuyChonMon_AB_unique` (`A`,`B`),
  ADD KEY `_MonToTuyChonMon_B_index` (`B`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `banner_quang_cao`
--
ALTER TABLE `banner_quang_cao`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `chitietgiohang`
--
ALTER TABLE `chitietgiohang`
  MODIFY `maChiTietGio` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `danhgia`
--
ALTER TABLE `danhgia`
  MODIFY `maDanhGia` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `diachigiaohang`
--
ALTER TABLE `diachigiaohang`
  MODIFY `maDiaChi` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `giohang`
--
ALTER TABLE `giohang`
  MODIFY `maGioHang` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `hinhanhmon`
--
ALTER TABLE `hinhanhmon`
  MODIFY `maHinhAnh` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `refund`
--
ALTER TABLE `refund`
  MODIFY `maRefund` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transactionlog`
--
ALTER TABLE `transactionlog`
  MODIFY `maLog` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bienbansuco`
--
ALTER TABLE `bienbansuco`
  ADD CONSTRAINT `BienBanSuCo_maNhanVien_fkey` FOREIGN KEY (`maNhanVien`) REFERENCES `nhanvien` (`maNhanVien`) ON UPDATE CASCADE;

--
-- Constraints for table `calamviec`
--
ALTER TABLE `calamviec`
  ADD CONSTRAINT `CaLamViec_maNhanVien_fkey` FOREIGN KEY (`maNhanVien`) REFERENCES `nhanvien` (`maNhanVien`) ON UPDATE CASCADE;

--
-- Constraints for table `chitietdonhang`
--
ALTER TABLE `chitietdonhang`
  ADD CONSTRAINT `ChiTietDonHang_maDonHang_fkey` FOREIGN KEY (`maDonHang`) REFERENCES `donhang` (`maDonHang`) ON UPDATE CASCADE,
  ADD CONSTRAINT `ChiTietDonHang_maMon_fkey` FOREIGN KEY (`maMon`) REFERENCES `mon` (`maMon`) ON UPDATE CASCADE;

--
-- Constraints for table `chitietdonhang_tuychonmon`
--
ALTER TABLE `chitietdonhang_tuychonmon`
  ADD CONSTRAINT `ChiTietDonHang_TuyChonMon_maChiTiet_fkey` FOREIGN KEY (`maChiTiet`) REFERENCES `chitietdonhang` (`maChiTiet`) ON UPDATE CASCADE,
  ADD CONSTRAINT `ChiTietDonHang_TuyChonMon_maTuyChon_fkey` FOREIGN KEY (`maTuyChon`) REFERENCES `tuychonmon` (`maTuyChon`) ON UPDATE CASCADE;

--
-- Constraints for table `chitietgiohang`
--
ALTER TABLE `chitietgiohang`
  ADD CONSTRAINT `ChiTietGioHang_maGioHang_fkey` FOREIGN KEY (`maGioHang`) REFERENCES `giohang` (`maGioHang`) ON UPDATE CASCADE,
  ADD CONSTRAINT `ChiTietGioHang_maMon_fkey` FOREIGN KEY (`maMon`) REFERENCES `mon` (`maMon`) ON UPDATE CASCADE;

--
-- Constraints for table `chitietphieukho`
--
ALTER TABLE `chitietphieukho`
  ADD CONSTRAINT `ChiTietPhieuKho_maNguyenLieu_fkey` FOREIGN KEY (`maNguyenLieu`) REFERENCES `nguyenlieu` (`maNguyenLieu`) ON UPDATE CASCADE,
  ADD CONSTRAINT `ChiTietPhieuKho_maPhieu_fkey` FOREIGN KEY (`maPhieu`) REFERENCES `phieukho` (`maPhieu`) ON UPDATE CASCADE;

--
-- Constraints for table `danhgia`
--
ALTER TABLE `danhgia`
  ADD CONSTRAINT `DanhGia_maMon_fkey` FOREIGN KEY (`maMon`) REFERENCES `mon` (`maMon`) ON UPDATE CASCADE,
  ADD CONSTRAINT `DanhGia_maNguoiDung_fkey` FOREIGN KEY (`maNguoiDung`) REFERENCES `nguoidung` (`maNguoiDung`) ON UPDATE CASCADE;

--
-- Constraints for table `diachigiaohang`
--
ALTER TABLE `diachigiaohang`
  ADD CONSTRAINT `DiaChiGiaoHang_maNguoiDung_fkey` FOREIGN KEY (`maNguoiDung`) REFERENCES `nguoidung` (`maNguoiDung`) ON UPDATE CASCADE;

--
-- Constraints for table `dinhmuc`
--
ALTER TABLE `dinhmuc`
  ADD CONSTRAINT `DinhMuc_maMon_fkey` FOREIGN KEY (`maMon`) REFERENCES `mon` (`maMon`) ON UPDATE CASCADE,
  ADD CONSTRAINT `DinhMuc_maNguyenLieu_fkey` FOREIGN KEY (`maNguyenLieu`) REFERENCES `nguyenlieu` (`maNguyenLieu`) ON UPDATE CASCADE;

--
-- Constraints for table `doan`
--
ALTER TABLE `doan`
  ADD CONSTRAINT `DoAn_maMon_fkey` FOREIGN KEY (`maMon`) REFERENCES `mon` (`maMon`) ON UPDATE CASCADE;

--
-- Constraints for table `donhang`
--
ALTER TABLE `donhang`
  ADD CONSTRAINT `DonHang_maBan_fkey` FOREIGN KEY (`maBan`) REFERENCES `ban` (`maBan`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `DonHang_maDiaChi_fkey` FOREIGN KEY (`maDiaChi`) REFERENCES `diachigiaohang` (`maDiaChi`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `DonHang_maKM_fkey` FOREIGN KEY (`maKM`) REFERENCES `khuyenmai` (`maKM`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `DonHang_maKhachHang_fkey` FOREIGN KEY (`maKhachHang`) REFERENCES `khachhang` (`maKhachHang`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `DonHang_maNhanVien_fkey` FOREIGN KEY (`maNhanVien`) REFERENCES `nhanvien` (`maNhanVien`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `douong`
--
ALTER TABLE `douong`
  ADD CONSTRAINT `DoUong_maMon_fkey` FOREIGN KEY (`maMon`) REFERENCES `mon` (`maMon`) ON UPDATE CASCADE;

--
-- Constraints for table `giohang`
--
ALTER TABLE `giohang`
  ADD CONSTRAINT `GioHang_maNguoiDung_fkey` FOREIGN KEY (`maNguoiDung`) REFERENCES `nguoidung` (`maNguoiDung`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `hinhanhmon`
--
ALTER TABLE `hinhanhmon`
  ADD CONSTRAINT `HinhAnhMon_maMon_fkey` FOREIGN KEY (`maMon`) REFERENCES `mon` (`maMon`) ON UPDATE CASCADE;

--
-- Constraints for table `khachhang`
--
ALTER TABLE `khachhang`
  ADD CONSTRAINT `KhachHang_maKhachHang_fkey` FOREIGN KEY (`maKhachHang`) REFERENCES `nguoidung` (`maNguoiDung`) ON UPDATE CASCADE;

--
-- Constraints for table `khachthanhvien`
--
ALTER TABLE `khachthanhvien`
  ADD CONSTRAINT `KhachThanhVien_maKhachHang_fkey` FOREIGN KEY (`maKhachHang`) REFERENCES `khachhang` (`maKhachHang`) ON UPDATE CASCADE;

--
-- Constraints for table `khachvanglai`
--
ALTER TABLE `khachvanglai`
  ADD CONSTRAINT `KhachVangLai_maKhachHang_fkey` FOREIGN KEY (`maKhachHang`) REFERENCES `khachhang` (`maKhachHang`) ON UPDATE CASCADE;

--
-- Constraints for table `mon`
--
ALTER TABLE `mon`
  ADD CONSTRAINT `Mon_maDanhMuc_fkey` FOREIGN KEY (`maDanhMuc`) REFERENCES `danhmucmon` (`maDanhMuc`) ON UPDATE CASCADE;

--
-- Constraints for table `nhanvien`
--
ALTER TABLE `nhanvien`
  ADD CONSTRAINT `NhanVien_maNhanVien_fkey` FOREIGN KEY (`maNhanVien`) REFERENCES `nguoidung` (`maNguoiDung`) ON UPDATE CASCADE,
  ADD CONSTRAINT `NhanVien_maVaiTro_fkey` FOREIGN KEY (`maVaiTro`) REFERENCES `vaitro` (`maVaiTro`) ON UPDATE CASCADE;

--
-- Constraints for table `phieukho`
--
ALTER TABLE `phieukho`
  ADD CONSTRAINT `PhieuKho_maNCC_fkey` FOREIGN KEY (`maNCC`) REFERENCES `nhacungcap` (`maNCC`) ON UPDATE CASCADE,
  ADD CONSTRAINT `PhieuKho_maNhanVien_fkey` FOREIGN KEY (`maNhanVien`) REFERENCES `nhanvien` (`maNhanVien`) ON UPDATE CASCADE;

--
-- Constraints for table `refund`
--
ALTER TABLE `refund`
  ADD CONSTRAINT `Refund_maThanhToan_fkey` FOREIGN KEY (`maThanhToan`) REFERENCES `thanhtoan` (`maThanhToan`) ON UPDATE CASCADE;

--
-- Constraints for table `thanhtoan`
--
ALTER TABLE `thanhtoan`
  ADD CONSTRAINT `ThanhToan_maDonHang_fkey` FOREIGN KEY (`maDonHang`) REFERENCES `donhang` (`maDonHang`) ON UPDATE CASCADE;

--
-- Constraints for table `thanhtoanqr`
--
ALTER TABLE `thanhtoanqr`
  ADD CONSTRAINT `ThanhToanQR_maThanhToan_fkey` FOREIGN KEY (`maThanhToan`) REFERENCES `thanhtoan` (`maThanhToan`) ON UPDATE CASCADE;

--
-- Constraints for table `thanhtoanthenganhang`
--
ALTER TABLE `thanhtoanthenganhang`
  ADD CONSTRAINT `ThanhToanTheNganHang_maThanhToan_fkey` FOREIGN KEY (`maThanhToan`) REFERENCES `thanhtoan` (`maThanhToan`) ON UPDATE CASCADE;

--
-- Constraints for table `thanhtoantienmat`
--
ALTER TABLE `thanhtoantienmat`
  ADD CONSTRAINT `ThanhToanTienMat_maThanhToan_fkey` FOREIGN KEY (`maThanhToan`) REFERENCES `thanhtoan` (`maThanhToan`) ON UPDATE CASCADE;

--
-- Constraints for table `transactionlog`
--
ALTER TABLE `transactionlog`
  ADD CONSTRAINT `TransactionLog_maThanhToan_fkey` FOREIGN KEY (`maThanhToan`) REFERENCES `thanhtoan` (`maThanhToan`) ON UPDATE CASCADE;

--
-- Constraints for table `yeuthich`
--
ALTER TABLE `yeuthich`
  ADD CONSTRAINT `YeuThich_maMon_fkey` FOREIGN KEY (`maMon`) REFERENCES `mon` (`maMon`) ON UPDATE CASCADE,
  ADD CONSTRAINT `YeuThich_maNguoiDung_fkey` FOREIGN KEY (`maNguoiDung`) REFERENCES `nguoidung` (`maNguoiDung`) ON UPDATE CASCADE;

--
-- Constraints for table `_montotuychonmon`
--
ALTER TABLE `_montotuychonmon`
  ADD CONSTRAINT `_MonToTuyChonMon_A_fkey` FOREIGN KEY (`A`) REFERENCES `mon` (`maMon`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `_MonToTuyChonMon_B_fkey` FOREIGN KEY (`B`) REFERENCES `tuychonmon` (`maTuyChon`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
