import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderAPI, connectSocket } from '../services/api';

const STATUS_TEXT = {
  CHO_XAC_NHAN: 'Đang chờ pha chế',
  DANG_PHA_CHE: 'Đang pha chế',
  HOAN_THANH: 'Đã hoàn thành',
  DA_GIAO: 'Đã giao',
  HUY: 'Đã hủy',
};

const STATUS_COLOR = {
  CHO_XAC_NHAN: 'bg-amber-100 text-amber-800 border-amber-300',
  DANG_PHA_CHE: 'bg-blue-100 text-blue-800 border-blue-300',
  HOAN_THANH: 'bg-green-100 text-green-800 border-green-300',
  DA_GIAO: 'bg-purple-100 text-purple-800 border-purple-300',
  HUY: 'bg-red-100 text-red-800 border-red-300',
};

const formatVND = (n) => Number(n).toLocaleString('vi-VN') + 'đ';

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await orderAPI.get(id);
        setOrder(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Không thể tải thông tin đơn hàng');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();

    // Listen for realtime updates
    const socket = connectSocket([`order:${id}`]);
    socket.on('order:updated', (updatedOrder) => {
      if (updatedOrder.maDonHang === id) {
        setOrder(prev => ({ ...prev, ...updatedOrder }));
      }
    });

    return () => {
      socket.off('order:updated');
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center">
        <div className="animate-spin text-4xl text-coffee-600">☕</div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center p-4">
        <div className="card max-w-md w-full p-6 text-center">
          <div className="text-4xl mb-4">😢</div>
          <h2 className="text-xl font-display text-coffee-900 mb-2">Lỗi tải đơn hàng</h2>
          <p className="text-coffee-600 mb-6">{error}</p>
          <Link to="/" className="btn-primary inline-block">
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-100 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link to="/" className="text-coffee-600 hover:text-coffee-800 font-medium flex items-center gap-2 transition-colors">
            ← Quay lại
          </Link>
          <div className="text-coffee-500 text-sm">
            {new Date(order.thoiGianTao).toLocaleString('vi-VN')}
          </div>
        </div>

        {/* Status Card */}
        <div className="card p-6 md:p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-coffee-800 opacity-10"></div>
          
          <div className="inline-block mb-4 px-4 py-2 rounded-full border text-sm font-bold uppercase tracking-wider shadow-sm
            {STATUS_COLOR[order.trangThai] || 'bg-gray-100 text-gray-800'}">
            {STATUS_TEXT[order.trangThai] || order.trangThai}
          </div>

          <h1 className="font-display text-2xl md:text-3xl text-coffee-900 mb-2 font-bold">
            Chi tiết đơn hàng #{order.maDonHang.slice(-6)}
          </h1>
          
          <p className="text-coffee-600 text-sm mb-6">
            Cảm ơn bạn đã đặt hàng! Bạn có thể lưu lại đường dẫn này để theo dõi tiến trình.
          </p>

          {/* Progress Bar Visualizer */}
          <div className="flex justify-between items-center max-w-sm mx-auto relative px-4">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-cream-300 -z-10 -translate-y-1/2"></div>
            
            <div className="flex flex-col items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors
                ${['CHO_XAC_NHAN', 'DANG_PHA_CHE', 'HOAN_THANH', 'DA_GIAO'].includes(order.trangThai) ? 'bg-amber-400 text-white' : 'bg-cream-300 text-cream-600'}`}>
                1
              </div>
              <span className="text-[10px] uppercase font-bold text-coffee-600">Chờ pha</span>
            </div>

            <div className={`h-1 flex-1 transition-colors ${['DANG_PHA_CHE', 'HOAN_THANH', 'DA_GIAO'].includes(order.trangThai) ? 'bg-blue-400' : 'bg-cream-300'}`}></div>

            <div className="flex flex-col items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors
                ${['DANG_PHA_CHE', 'HOAN_THANH', 'DA_GIAO'].includes(order.trangThai) ? 'bg-blue-500 text-white' : 'bg-cream-300 text-cream-600'}`}>
                2
              </div>
              <span className="text-[10px] uppercase font-bold text-coffee-600">Đang làm</span>
            </div>

            <div className={`h-1 flex-1 transition-colors ${['HOAN_THANH', 'DA_GIAO'].includes(order.trangThai) ? 'bg-green-400' : 'bg-cream-300'}`}></div>

            <div className="flex flex-col items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors
                ${['HOAN_THANH', 'DA_GIAO'].includes(order.trangThai) ? 'bg-green-500 text-white' : 'bg-cream-300 text-cream-600'}`}>
                3
              </div>
              <span className="text-[10px] uppercase font-bold text-coffee-600">Xong</span>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="card p-6">
          <h3 className="font-display font-bold text-coffee-900 mb-4 border-b border-cream-200 pb-2">
            Món đã chọn
          </h3>
          <div className="space-y-4">
            {order.chiTiet?.map((item) => (
              <div key={item.maChiTiet} className="flex justify-between items-start border-b border-cream-100 pb-4 last:border-0 last:pb-0">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-coffee-900">{item.soLuong}x</span>
                    <span className="font-medium text-coffee-800">{item.mon?.tenMon}</span>
                  </div>
                  
                  {item.ghiChu && (
                    <div className="text-sm text-amber-700 bg-amber-50 rounded p-2 mt-1 ml-6 italic">
                      {item.ghiChu}
                    </div>
                  )}
                  
                  {item.tuyChon?.length > 0 && (
                    <div className="text-xs text-coffee-500 ml-6 mt-1 flex gap-2 flex-wrap">
                      {item.tuyChon.map((opt, idx) => (
                        <span key={idx} className="bg-cream-200 px-2 py-0.5 rounded-sm">
                          {opt.tenTuyChon}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-right ml-4 shrink-0">
                  <span className="font-medium text-coffee-900">
                    {formatVND(item.soLuong * Number(item.donGiaThoiDiemBan))}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t-2 border-cream-200 space-y-2">
            <div className="flex justify-between text-coffee-600">
              <span>Tạm tính</span>
              <span>{formatVND(order.tongTien)}</span>
            </div>
            {Number(order.tienGiamGia) > 0 && (
              <div className="flex justify-between text-green-600 font-medium">
                <span>Khuyến mãi</span>
                <span>-{formatVND(order.tienGiamGia)}</span>
              </div>
            )}
            <div className="flex justify-between font-display text-xl font-bold text-coffee-900 pt-2 border-t border-cream-200 mt-2">
              <span>Tổng cộng</span>
              <span>{formatVND(order.tongThanhToan)}</span>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        {(order.thongTinGuest || order.ban || order.loaiDonHang) && (
          <div className="card p-6">
            <h3 className="font-display font-bold text-coffee-900 mb-4 border-b border-cream-200 pb-2">
              Thông tin nhận hàng
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-coffee-500 block text-xs uppercase font-bold mb-1">Loại đơn</span>
                <span className="text-coffee-900 font-medium">
                  {order.loaiDonHang === 'TAI_QUAN' ? 'Ăn tại quán' : 
                   order.loaiDonHang === 'MANG_VE' ? 'Mang về' : 
                   order.loaiDonHang}
                </span>
              </div>

              {order.ban && (
                <div>
                  <span className="text-coffee-500 block text-xs uppercase font-bold mb-1">Bàn</span>
                  <span className="text-coffee-900 font-medium">Bàn {order.ban.soBan}</span>
                </div>
              )}

              {order.thongTinGuest && (
                <div className="md:col-span-2 mt-2">
                  <span className="text-coffee-500 block text-xs uppercase font-bold mb-1">Khách hàng</span>
                  <div className="bg-cream-50 p-3 rounded-lg text-coffee-800">
                    {(() => {
                      try {
                        const guest = JSON.parse(order.thongTinGuest);
                        return (
                          <div className="space-y-1">
                            {guest.hoTen && <p>👤 {guest.hoTen}</p>}
                            {guest.soDienThoai && <p>📞 {guest.soDienThoai}</p>}
                            {guest.diaChi && <p>📍 {guest.diaChi}, {guest.xa}, {guest.huyen}, {guest.tinh}</p>}
                          </div>
                        );
                      } catch {
                        return <p>{order.thongTinGuest}</p>;
                      }
                    })()}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
