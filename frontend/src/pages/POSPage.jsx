import { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/common/Sidebar';
import { menuAPI, orderAPI, tableAPI, promoAPI, paymentAPI } from '../services/api';

const formatVND = (n) => Number(n).toLocaleString('vi-VN') + 'đ';

export default function POSPage() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [tables, setTables] = useState([]);
  const [activeCat, setActiveCat] = useState('');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [promoCode, setPromoCode] = useState('');
  const [promoData, setPromoData] = useState(null);
  const [promoError, setPromoError] = useState('');
  const [orderType, setOrderType] = useState('TAI_QUAN');
  const [payMethod, setPayMethod] = useState('TIEN_MAT');
  const [cashGiven, setCashGiven] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);

  // For options modal
  const [editingCartIndex, setEditingCartIndex] = useState(null);
  const [addingItem, setAddingItem] = useState(null);
  const [detailOptions, setDetailOptions] = useState({ da: '', duong: '', size: '', text: '' });

  const ICE_OPTIONS = ["Không đá", "Ít đá", "Bình thường", "Nhiều đá"];
  const SUGAR_OPTIONS = ["Không đường", "Ít đường", "Bình thường", "Nhiều đường"];
  const SIZE_OPTIONS = ["S", "M", "L", "XL"];

  useEffect(() => {
    menuAPI.getCategories().then(r => {
      setCategories(r.data);
      if (r.data[0]) setActiveCat(r.data[0].maDanhMuc);
    });
    tableAPI.list().then(r => setTables(r.data));
  }, []);

  useEffect(() => {
    menuAPI.getItems({ category: activeCat, search, limit: 50, includeHidden: true })
      .then(r => setItems(r.data.items));
  }, [activeCat, search]);

  const handleGridClick = (item) => {
    if (item.daXoa) return;
    const isDoUong = item.doUong != null || item.danhMuc?.tenDanhMuc?.toLowerCase().includes('nước') || item.danhMuc?.tenDanhMuc?.toLowerCase().includes('trà') || item.danhMuc?.tenDanhMuc?.toLowerCase().includes('cà phê');
    if (isDoUong) {
      setAddingItem(item);
      setDetailOptions({
        da: item.doUong?.mucDoDa || "Bình thường",
        duong: item.doUong?.mucDoDuong || "Bình thường",
        size: item.doUong?.mucSize || "M",
        text: ""
      });
    } else {
      addToCart(item, "");
    }
  };

  const addToCart = (item, ghiChu = '') => {
    setCart(prev => {
      const existing = prev.find(c => c.maMon === item.maMon && c.ghiChu === ghiChu);
      if (existing) return prev.map(c => c.maMon === item.maMon && c.ghiChu === ghiChu ? { ...c, soLuong: c.soLuong + 1 } : c);
      return [...prev, { ...item, soLuong: 1, ghiChu }];
    });
  };

  const updateQty = (index, delta) => {
    setCart(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], soLuong: Math.max(0, updated[index].soLuong + delta) };
      return updated.filter(c => c.soLuong > 0);
    });
  };

  const openOptions = (index) => {
    const item = cart[index];
    setEditingCartIndex(index);
    
    // parse existing ghiChu or defaults
    const isDoUong = item.doUong != null || item.danhMuc?.tenDanhMuc?.toLowerCase().includes('nước') || item.danhMuc?.tenDanhMuc?.toLowerCase().includes('trà') || item.danhMuc?.tenDanhMuc?.toLowerCase().includes('cà phê');
    
    setDetailOptions({
      da: item.ghiChu?.match(/Đá: ([^|;]+)/)?.[1]?.trim() || (isDoUong ? "Bình thường" : ""),
      duong: item.ghiChu?.match(/Đường: ([^|;]+)/)?.[1]?.trim() || (isDoUong ? "Bình thường" : ""),
      size: item.ghiChu?.match(/Size: ([^|;]+)/)?.[1]?.trim() || (isDoUong ? "M" : ""),
      text: item.ghiChu?.split('|').pop().replace(/Size:.*|Đá:.*|Đường:.*/g, '').trim() || ""
    });
  };

  const saveOptions = () => {
    let parts = [];
    if (detailOptions.size) parts.push(`Size: ${detailOptions.size}`);
    if (detailOptions.da) parts.push(`Đá: ${detailOptions.da}`);
    if (detailOptions.duong) parts.push(`Đường: ${detailOptions.duong}`);
    if (detailOptions.text) parts.push(detailOptions.text);
    const ghiChu = parts.join(' | ');

    if (addingItem) {
      addToCart(addingItem, ghiChu);
      setAddingItem(null);
    } else if (editingCartIndex !== null) {
      setCart(prev => {
        const updated = [...prev];
        updated[editingCartIndex] = { ...updated[editingCartIndex], ghiChu };
        return updated;
      });
      setEditingCartIndex(null);
    }
  };

  const subtotal = cart.reduce((s, c) => s + Number(c.giaBan) * c.soLuong, 0);
  const discount = promoData?.discount || 0;
  const total = Math.max(0, subtotal - discount);
  const change = payMethod === 'TIEN_MAT' && cashGiven ? Number(cashGiven) - total : 0;

  const applyPromo = async () => {
    setPromoError('');
    try {
      const res = await promoAPI.validate({ maKM: promoCode, tongTien: subtotal });
      setPromoData(res.data);
    } catch (err) {
      setPromoError(err.response?.data?.message || 'Mã không hợp lệ');
      setPromoData(null);
    }
  };

  const placeOrder = async () => {
    if (cart.length === 0) return;
    setLoading(true);
    try {
      const orderRes = await orderAPI.create({
        items: cart.map(c => ({ maMon: c.maMon, soLuong: c.soLuong, ghiChu: c.ghiChu })),
        maBan: selectedTable?.maBan,
        maKM: promoData?.km?.maKM,
        loaiDonHang: orderType,
        ghiChu: note,
        customerPhone: customerPhone.trim() || undefined,
        thongTinGuest: customerPhone.trim()
          ? JSON.stringify({ soDienThoai: customerPhone.trim(), source: 'POS' })
          : undefined,
      });

      await paymentAPI.create({
        maDonHang: orderRes.data.maDonHang,
        phuongThuc: payMethod,
        tienKhachDua: cashGiven ? Number(cashGiven) : undefined,
      });

      setLastOrder({ ...orderRes.data, total, change });
      setCart([]);
      setPromoCode(''); setPromoData(null); setNote(''); setCashGiven(''); setCustomerPhone('');
      tableAPI.list().then(r => setTables(r.data));
    } catch (err) {
      alert(err.response?.data?.message || 'Tạo đơn thất bại');
    } finally { setLoading(false); }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-cream-100">
      <Sidebar />

      {/* Left: Menu */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-cream-300">
        {/* Search + order type */}
        <div className="p-4 border-b border-cream-300 bg-white space-y-3">
          <input className="input-field" placeholder="🔍 Tìm món..." value={search} onChange={e => setSearch(e.target.value)} />
          <div className="flex gap-2">
            {['TAI_QUAN','MANG_VE','ONLINE'].map(t => (
              <button key={t} onClick={() => setOrderType(t)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${orderType===t ? 'bg-coffee-600 text-white' : 'bg-cream-200 text-coffee-700 hover:bg-cream-300'}`}>
                {t === 'TAI_QUAN' ? '🪑 Tại quán' : t === 'MANG_VE' ? '🛍️ Mang về' : '📱 Online'}
              </button>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 px-4 py-2 overflow-x-auto border-b border-cream-300 bg-white shrink-0">
          {categories.map(cat => (
            <button key={cat.maDanhMuc} onClick={() => setActiveCat(cat.maDanhMuc)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeCat===cat.maDanhMuc ? 'bg-coffee-600 text-white' : 'bg-cream-100 text-coffee-700 hover:bg-cream-200'}`}>
              {cat.tenDanhMuc}
            </button>
          ))}
        </div>

        {/* Items grid */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 xl:grid-cols-3 gap-3 content-start">
          {items.map(item => {
            const isHidden = !!item.daXoa;
            return (
            <button key={item.maMon} onClick={() => handleGridClick(item)} disabled={isHidden}
              className={`card p-3 text-left transition-all group relative ${
                isHidden
                  ? 'opacity-45 grayscale cursor-not-allowed border-dashed border-cream-400'
                  : 'hover:shadow-md hover:border-coffee-300 active:scale-95'
              }`}>
              {isHidden && (
                <span className="absolute top-2 right-2 z-10 text-[10px] font-semibold bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full">
                  Đã ẩn
                </span>
              )}
              <div className="aspect-square bg-cream-100 rounded-lg mb-2 overflow-hidden">
                {item.hinhAnh?.[0] ? (
                  <img src={item.hinhAnh[0].urlAnh} alt={item.tenMon} className={`w-full h-full object-cover transition-transform ${isHidden ? '' : 'group-hover:scale-105'}`} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl">☕</div>
                )}
              </div>
              <p className="font-medium text-coffee-900 text-sm leading-tight line-clamp-2">{item.tenMon}</p>
              <p className="text-coffee-600 font-bold text-sm mt-1">{formatVND(item.giaBan)}</p>
              {item.danhMuc && <span className="text-xs text-coffee-400">{item.danhMuc.tenDanhMuc}</span>}
            </button>
            );
          })}
        </div>
      </div>

      {/* Right: Cart */}
      <div className="w-96 shrink-0 flex flex-col bg-white">
        <div className="px-4 py-3 border-b border-cream-200">
          <h2 className="font-display text-lg text-coffee-900">Đơn hàng</h2>
        </div>

        {/* Table select */}
        {orderType === 'TAI_QUAN' && (
          <div className="px-4 py-2 border-b border-cream-100">
            <p className="text-xs text-coffee-500 mb-1">Chọn bàn</p>
            <div className="flex flex-wrap gap-1">
              {tables.filter(t => t.trangThai !== 'DANG_PHUC_VU').map(t => (
                <button key={t.maBan} onClick={() => setSelectedTable(selectedTable?.maBan===t.maBan ? null : t)}
                  className={`px-3 py-1 rounded text-xs font-medium transition-all ${selectedTable?.maBan===t.maBan ? 'bg-coffee-600 text-white' : 'bg-cream-100 text-coffee-700 hover:bg-cream-200'}`}>
                  {t.soBan}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
          {cart.length === 0 && (
            <div className="text-center py-12 text-coffee-300">
              <p className="text-4xl mb-2">🛒</p>
              <p className="text-sm">Chọn món để thêm vào đơn</p>
            </div>
          )}
          {cart.map((item, index) => (
            <div key={`${item.maMon}-${index}`} className="flex items-center gap-2 py-2 border-b border-cream-100">
              <div className="flex-1 min-w-0 cursor-pointer group" onClick={() => openOptions(index)}>
                <p className="text-sm font-medium text-coffee-900 truncate group-hover:text-coffee-600 transition-colors">
                  {item.tenMon} <span className="text-xs opacity-50">✎</span>
                </p>
                <p className="text-xs text-coffee-500">{formatVND(item.giaBan)}</p>
                {item.ghiChu && <p className="text-xs text-amber-600 truncate">{item.ghiChu}</p>}
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => updateQty(index, -1)} className="w-6 h-6 rounded bg-cream-200 text-coffee-700 hover:bg-coffee-200 text-sm font-bold">−</button>
                <span className="w-6 text-center text-sm font-bold text-coffee-900">{item.soLuong}</span>
                <button onClick={() => updateQty(index, 1)} className="w-6 h-6 rounded bg-coffee-600 text-white hover:bg-coffee-700 text-sm font-bold">+</button>
              </div>
              <span className="text-sm font-bold text-coffee-700 w-20 text-right">{formatVND(Number(item.giaBan)*item.soLuong)}</span>
            </div>
          ))}
        </div>

        {/* Promo */}
        <div className="px-4 py-2 border-t border-cream-100">
          <div className="flex gap-2">
            <input className="input-field text-sm" placeholder="Mã khuyến mãi" value={promoCode} onChange={e => setPromoCode(e.target.value)} />
            <button onClick={applyPromo} className="btn-secondary text-sm shrink-0">Áp dụng</button>
          </div>
          {promoError && <p className="text-red-500 text-xs mt-1">{promoError}</p>}
          {promoData?.valid && <p className="text-green-600 text-xs mt-1">✓ Giảm {formatVND(promoData.discount)}</p>}
        </div>

        {/* Totals */}
        <div className="px-4 py-2 border-t border-cream-200 space-y-1 text-sm">
          <div className="flex justify-between text-coffee-600"><span>Tạm tính</span><span>{formatVND(subtotal)}</span></div>
          {discount > 0 && <div className="flex justify-between text-green-600"><span>Giảm giá</span><span>-{formatVND(discount)}</span></div>}
          <div className="flex justify-between font-bold text-coffee-900 text-base pt-1 border-t border-cream-200">
            <span>Tổng cộng</span><span>{formatVND(total)}</span>
          </div>
        </div>

        {/* Payment method */}
        <div className="px-4 py-2 border-t border-cream-100">
          <div className="mb-3">
            <p className="text-xs text-coffee-500 mb-1">SĐT khách hàng</p>
            <input
              className="input-field text-sm"
              type="tel"
              placeholder="Nhập SĐT để lưu lịch sử mua"
              value={customerPhone}
              onChange={e => setCustomerPhone(e.target.value)}
            />
          </div>
          <p className="text-xs text-coffee-500 mb-1">Thanh toán</p>
          <div className="flex gap-2">
            {['TIEN_MAT','QR','THE_NGAN_HANG'].map(m => (
              <button key={m} onClick={() => setPayMethod(m)}
                className={`flex-1 py-1.5 rounded text-xs font-medium transition-all ${payMethod===m ? 'bg-coffee-600 text-white' : 'bg-cream-100 text-coffee-700'}`}>
                {m==='TIEN_MAT'?'💵 Tiền mặt':m==='QR'?'📱 QR':'💳 Thẻ'}
              </button>
            ))}
          </div>
          {payMethod === 'TIEN_MAT' && (
            <div className="mt-2 flex gap-2 items-center">
              <input className="input-field text-sm" type="number" placeholder="Tiền khách đưa" value={cashGiven} onChange={e => setCashGiven(e.target.value)} />
              {change > 0 && <span className="text-green-600 text-sm font-bold shrink-0">Trả: {formatVND(change)}</span>}
            </div>
          )}
        </div>

        {/* Place order */}
        <div className="p-4 border-t border-cream-200">
          <textarea className="input-field text-sm mb-3 resize-none" rows={2} placeholder="Ghi chú đơn..." value={note} onChange={e => setNote(e.target.value)} />
          <button onClick={placeOrder} disabled={cart.length === 0 || loading} className="btn-primary w-full py-3 text-base disabled:opacity-50">
            {loading ? 'Đang tạo đơn...' : `✓ Xác nhận đơn — ${formatVND(total)}`}
          </button>
        </div>
      </div>

      {/* Success modal */}
      {lastOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card p-8 max-w-sm w-full mx-4 text-center shadow-2xl">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="font-display text-xl text-coffee-900 mb-2">Đơn hàng thành công!</h3>
            <p className="text-coffee-600 text-sm mb-1">Mã đơn: <strong>{lastOrder.maDonHang}</strong></p>
            <p className="text-coffee-600 text-sm mb-4">Tổng: <strong>{formatVND(lastOrder.total)}</strong></p>
            {lastOrder.change > 0 && <p className="text-green-600 font-bold mb-4">Tiền thối: {formatVND(lastOrder.change)}</p>}
            <button onClick={() => setLastOrder(null)} className="btn-primary w-full">Đơn mới</button>
          </div>
        </div>
      )}
      {/* Options Modal */}
      {(editingCartIndex !== null || addingItem !== null) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-display text-xl text-coffee-900">Tuỳ chỉnh món {addingItem?.tenMon || cart[editingCartIndex]?.tenMon}</h3>
              <button onClick={() => { setEditingCartIndex(null); setAddingItem(null); }} className="text-coffee-500 hover:text-coffee-900 text-xl">×</button>
            </div>
            
            <div className="space-y-4 mb-6">
              <div>
                <p className="text-sm font-medium text-coffee-800 mb-2">Size</p>
                <div className="flex flex-wrap gap-2">
                  {SIZE_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setDetailOptions({ ...detailOptions, size: opt })}
                      className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${detailOptions.size === opt ? "bg-coffee-600 text-white border-coffee-600" : "bg-white text-coffee-600 border-coffee-200 hover:border-coffee-400"}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-coffee-800 mb-2">Mức Đá</p>
                <div className="flex flex-wrap gap-2">
                  {ICE_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setDetailOptions({ ...detailOptions, da: opt })}
                      className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${detailOptions.da === opt ? "bg-coffee-600 text-white border-coffee-600" : "bg-white text-coffee-600 border-coffee-200 hover:border-coffee-400"}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-coffee-800 mb-2">Mức Đường</p>
                <div className="flex flex-wrap gap-2">
                  {SUGAR_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setDetailOptions({ ...detailOptions, duong: opt })}
                      className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${detailOptions.duong === opt ? "bg-coffee-600 text-white border-coffee-600" : "bg-white text-coffee-600 border-coffee-200 hover:border-coffee-400"}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-coffee-800 mb-2">Ghi chú thêm</p>
                <input
                  className="input-field w-full"
                  placeholder="Ví dụ: bỏ đá, thêm topping..."
                  value={detailOptions.text}
                  onChange={(e) => setDetailOptions({ ...detailOptions, text: e.target.value })}
                />
              </div>
            </div>

            <button onClick={saveOptions} className="btn-primary w-full py-2">
              Lưu tuỳ chỉnh
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
