import { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/common/Sidebar';
import { inventoryAPI, menuAPI } from '../services/api';

const TABS = [
  { id: 'overview', label: 'Tổng quan', icon: '📊' },
  { id: 'ingredients', label: 'Nguyên liệu', icon: '📦' },
  { id: 'suppliers', label: 'Nhà cung cấp', icon: '🏭' },
  { id: 'import', label: 'Phiếu nhập', icon: '📥' },
  { id: 'export', label: 'Phiếu xuất', icon: '📤' },
  { id: 'recipes', label: 'Định mức', icon: '📝' },
  { id: 'history', label: 'Lịch sử', icon: '🕐' },
  { id: 'report', label: 'Báo cáo tồn', icon: '📋' },
];

const LOAI_LABEL = {
  NHAP: { text: 'Nhập kho', cls: 'bg-green-100 text-green-800' },
  XUAT: { text: 'Xuất kho', cls: 'bg-blue-100 text-blue-800' },
  HUY: { text: 'Hủy/Hoàn', cls: 'bg-red-100 text-red-800' },
  BAN_HANG: { text: 'Bán hàng', cls: 'bg-purple-100 text-purple-800' },
};

const STATUS_LABEL = {
  DU_HANG: { text: 'Đủ hàng', cls: 'badge-status-done' },
  VUA_DU: { text: 'Vừa đủ', cls: 'badge-status-making' },
  SAP_HET: { text: 'Sắp hết', cls: 'badge-status-wait' },
};

const fmt = (n) => Number(n || 0).toLocaleString('vi-VN');
const fmtDate = (d) => new Date(d).toLocaleString('vi-VN');

export default function InventoryPage() {
  const [tab, setTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [stockReport, setStockReport] = useState([]);
  const [history, setHistory] = useState({ records: [], total: 0 });
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [voucherForm, setVoucherForm] = useState({
    loaiPhieu: 'NHAP', maNCC: '', ghiChu: '',
    items: [{ maNguyenLieu: '', soLuongThucTe: '', donGia: '' }],
  });

  const fetchBase = useCallback(async () => {
    const [ing, sup, sum] = await Promise.all([
      inventoryAPI.getIngredients(),
      inventoryAPI.getSuppliers(),
      inventoryAPI.getSummary(),
    ]);
    setIngredients(ing.data);
    setSuppliers(sup.data);
    setSummary(sum.data);
  }, []);

  const fetchTab = useCallback(async () => {
    setLoading(true);
    try {
      await fetchBase();
      if (tab === 'import') {
        const v = await inventoryAPI.getVouchers({ loaiPhieu: 'NHAP', limit: 100 });
        setVouchers(v.data.vouchers || v.data);
      } else if (tab === 'export') {
        const [xuat, ban] = await Promise.all([
          inventoryAPI.getVouchers({ loaiPhieu: 'XUAT', limit: 50 }),
          inventoryAPI.getVouchers({ loaiPhieu: 'BAN_HANG', limit: 50 }),
        ]);
        const all = [...(xuat.data.vouchers || []), ...(ban.data.vouchers || [])];
        all.sort((a, b) => new Date(b.thoiGianLap) - new Date(a.thoiGianLap));
        setVouchers(all);
      } else if (tab === 'recipes') {
        const [r, m] = await Promise.all([
          inventoryAPI.getRecipes(),
          menuAPI.getItems(),
        ]);
        setRecipes(r.data);
        setMenuItems(m.data);
      } else if (tab === 'history') {
        const h = await inventoryAPI.getHistory({ limit: 50 });
        setHistory(h.data);
      } else if (tab === 'report') {
        const r = await inventoryAPI.getStockReport();
        setStockReport(r.data);
      }
    } finally {
      setLoading(false);
    }
  }, [tab, fetchBase]);

  useEffect(() => { fetchTab(); }, [fetchTab]);

  const lowStock = ingredients.filter(i => i.tonKho <= (i.tonKhoToiThieu ?? 10));

  const openIngredientModal = (ing = null) => {
    setForm(ing ? {
      tenNL: ing.tenNL, tonKho: ing.tonKho, donVi: ing.donVi,
      tonKhoToiThieu: ing.tonKhoToiThieu ?? 10, giaNhap: ing.giaNhap || '',
      maNCC: ing.maNCC || '', moTa: ing.moTa || '',
    } : { tenNL: '', tonKho: 0, donVi: 'g', tonKhoToiThieu: 10, giaNhap: '', maNCC: '', moTa: '' });
    setModal({ type: 'ingredient', ing });
  };

  const saveIngredient = async () => {
    const data = { ...form, tonKho: Number(form.tonKho), tonKhoToiThieu: Number(form.tonKhoToiThieu), giaNhap: form.giaNhap ? Number(form.giaNhap) : null };
    if (modal.ing) await inventoryAPI.updateIngredient(modal.ing.maNguyenLieu, data);
    else await inventoryAPI.createIngredient(data);
    setModal(null);
    fetchTab();
  };

  const openSupplierModal = (sup = null) => {
    setForm(sup ? { ...sup, congNo: sup.congNo || 0 } : { tenNCC: '', congNo: 0, diaChi: '', soDienThoai: '', email: '', ghiChu: '' });
    setModal({ type: 'supplier', sup });
  };

  const saveSupplier = async () => {
    const data = { ...form, congNo: Number(form.congNo || 0) };
    if (modal.sup) await inventoryAPI.updateSupplier(modal.sup.maNCC, data);
    else await inventoryAPI.createSupplier(data);
    setModal(null);
    fetchTab();
  };

  const openVoucherModal = (loaiPhieu = 'NHAP') => {
    setVoucherForm({
      loaiPhieu, maNCC: suppliers[0]?.maNCC || '', ghiChu: '',
      items: [{ maNguyenLieu: '', soLuongThucTe: '', donGia: '' }],
    });
    setModal({ type: 'voucher' });
  };

  const saveVoucher = async () => {
    await inventoryAPI.createVoucher({
      ...voucherForm,
      items: voucherForm.items.map(i => ({
        maNguyenLieu: i.maNguyenLieu,
        soLuongThucTe: Number(i.soLuongThucTe),
        donGia: Number(i.donGia),
      })),
    });
    setModal(null);
    fetchTab();
  };

  const openRecipeModal = (recipe = null) => {
    setForm(recipe ? { maMon: recipe.maMon, maNguyenLieu: recipe.maNguyenLieu, soLuongTieuHao: recipe.soLuongTieuHao } : { maMon: '', maNguyenLieu: '', soLuongTieuHao: '' });
    setModal({ type: 'recipe', recipe });
  };

  const saveRecipe = async () => {
    const data = { ...form, soLuongTieuHao: Number(form.soLuongTieuHao) };
    if (modal.recipe) await inventoryAPI.updateRecipe(modal.recipe.maDinhMuc, data);
    else await inventoryAPI.createRecipe(data);
    setModal(null);
    fetchTab();
  };

  const updateVoucherItem = (i, field, val) => {
    setVoucherForm(prev => {
      const items = [...prev.items];
      items[i] = { ...items[i], [field]: val };
      if (field === 'maNguyenLieu' && val) {
        const ing = ingredients.find(x => x.maNguyenLieu === val);
        if (ing?.giaNhap) items[i].donGia = ing.giaNhap;
      }
      return { ...prev, items };
    });
  };

  const VoucherList = ({ list }) => (
    <div className="space-y-3">
      {list.length === 0 && <p className="text-coffee-500 text-sm text-center py-8">Chưa có phiếu kho</p>}
      {list.map(v => {
        const lbl = LOAI_LABEL[v.loaiPhieu] || LOAI_LABEL.XUAT;
        return (
          <div key={v.maPhieu} className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${lbl.cls}`}>{lbl.text}</span>
                <span className="font-medium text-coffee-900 text-sm">#{v.maPhieu.slice(-8)}</span>
                {v.maDonHang && <span className="text-xs text-coffee-400">ĐH: {v.maDonHang}</span>}
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-coffee-900">{fmt(v.tongGiaTri)}đ</p>
                <p className="text-xs text-coffee-500">{fmtDate(v.thoiGianLap)}</p>
              </div>
            </div>
            <div className="text-xs text-coffee-500 mb-2">
              {v.nhaCungCap?.tenNCC && `NCC: ${v.nhaCungCap.tenNCC} · `}
              NV: {v.nhanVien?.nguoiDung?.hoTen || '—'} · {v.chiTiet?.length} mặt hàng
              {v.ghiChu && ` · ${v.ghiChu}`}
            </div>
            <div className="flex flex-wrap gap-2">
              {v.chiTiet?.map(c => (
                <span key={c.maNguyenLieu} className="text-xs bg-cream-100 px-2 py-1 rounded">
                  {c.nguyenLieu?.tenNL}: {c.soLuongThucTe}{c.nguyenLieu?.donVi}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-cream-100">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="bg-white border-b border-cream-300 px-6 py-4">
          <h1 className="font-display text-2xl text-coffee-900">Quản lý kho nguyên liệu</h1>
          <p className="text-coffee-500 text-sm">Quản lý tồn kho, nhập/xuất, định mức và cảnh báo hết hàng</p>
        </div>

        {lowStock.length > 0 && (
          <div className="mx-6 mt-4 bg-amber-50 border border-amber-300 rounded-xl p-4">
            <p className="font-medium text-amber-800 text-sm">⚠️ Cảnh báo sắp hết hàng ({lowStock.length} nguyên liệu)</p>
            <p className="text-amber-700 text-xs mt-1">
              {lowStock.map(i => `${i.tenNL} (${i.tonKho}/${i.tonKhoToiThieu ?? 10}${i.donVi})`).join(' · ')}
            </p>
          </div>
        )}

        <div className="px-6 pt-4 flex gap-2 flex-wrap">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.id ? 'bg-coffee-600 text-white' : 'bg-white text-coffee-700 border border-cream-300 hover:bg-cream-100'}`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {loading ? (
            <p className="text-coffee-500 text-center py-12">Đang tải...</p>
          ) : (
            <>
              {tab === 'overview' && summary && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Nguyên liệu', value: summary.totalIngredients, icon: '📦' },
                      { label: 'Nhà cung cấp', value: summary.totalSuppliers, icon: '🏭' },
                      { label: 'Sắp hết hàng', value: summary.lowStockCount, icon: '⚠️', warn: summary.lowStockCount > 0 },
                      { label: 'Giá trị tồn kho', value: `${fmt(summary.totalStockValue)}đ`, icon: '💰' },
                    ].map((k, i) => (
                      <div key={i} className={`card p-4 ${k.warn ? 'border-amber-300 bg-amber-50' : ''}`}>
                        <span className="text-2xl">{k.icon}</span>
                        <p className="text-xs text-coffee-500 mt-2">{k.label}</p>
                        <p className="font-display text-xl font-bold text-coffee-900">{k.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="card p-4">
                      <p className="text-sm text-coffee-500">Phiếu kho hôm nay</p>
                      <p className="text-2xl font-bold text-coffee-900">{summary.vouchersToday}</p>
                    </div>
                    <div className="card p-4">
                      <p className="text-sm text-coffee-500">Nhập kho tháng này</p>
                      <p className="text-2xl font-bold text-green-700">{summary.monthImport.count} phiếu</p>
                      <p className="text-xs text-coffee-400">{fmt(summary.monthImport.value)}đ</p>
                    </div>
                    <div className="card p-4">
                      <p className="text-sm text-coffee-500">Xuất kho tháng này</p>
                      <p className="text-2xl font-bold text-blue-700">{summary.monthExport.count} phiếu</p>
                      <p className="text-xs text-coffee-400">{fmt(summary.monthExport.value)}đ</p>
                    </div>
                  </div>
                </div>
              )}

              {tab === 'ingredients' && (
                <>
                  <div className="flex justify-end mb-4">
                    <button onClick={() => openIngredientModal()} className="btn-primary text-sm">+ Thêm nguyên liệu</button>
                  </div>
                  <div className="card overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-cream-100 border-b border-cream-300">
                        <tr>
                          {['Nguyên liệu', 'Tồn kho', 'Ngưỡng', 'Đơn vị', 'Giá nhập', 'NCC', 'Trạng thái', ''].map(h => (
                            <th key={h} className="text-left px-4 py-3 text-coffee-700 font-medium">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {ingredients.map(ing => {
                          const threshold = ing.tonKhoToiThieu ?? 10;
                          const isLow = ing.tonKho <= threshold;
                          return (
                            <tr key={ing.maNguyenLieu} className="border-b border-cream-100 hover:bg-cream-50">
                              <td className="px-4 py-3 font-medium text-coffee-900">{ing.tenNL}</td>
                              <td className={`px-4 py-3 font-bold ${isLow ? 'text-red-600' : 'text-green-600'}`}>{ing.tonKho}</td>
                              <td className="px-4 py-3 text-coffee-500">{threshold}</td>
                              <td className="px-4 py-3">{ing.donVi}</td>
                              <td className="px-4 py-3">{ing.giaNhap ? `${fmt(ing.giaNhap)}đ` : '—'}</td>
                              <td className="px-4 py-3 text-xs">{ing.nhaCungCap?.tenNCC || '—'}</td>
                              <td className="px-4 py-3">
                                {isLow ? <span className="badge-status-wait">Sắp hết</span> : <span className="badge-status-done">OK</span>}
                              </td>
                              <td className="px-4 py-3 space-x-2">
                                <button onClick={() => openIngredientModal(ing)} className="text-coffee-500 hover:text-coffee-800 text-xs underline">Sửa</button>
                                <button onClick={async () => { if (confirm('Xóa nguyên liệu?')) { await inventoryAPI.deleteIngredient(ing.maNguyenLieu); fetchTab(); } }} className="text-red-500 text-xs underline">Xóa</button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {tab === 'suppliers' && (
                <>
                  <div className="flex justify-end mb-4">
                    <button onClick={() => openSupplierModal()} className="btn-primary text-sm">+ Thêm NCC</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {suppliers.map(s => (
                      <div key={s.maNCC} className="card p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-coffee-900">{s.tenNCC}</h3>
                            <p className="text-xs text-coffee-500 mt-1">{s.diaChi || '—'}</p>
                            <p className="text-xs text-coffee-500">{s.soDienThoai} {s.email && `· ${s.email}`}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-coffee-900">Công nợ: {fmt(s.congNo)}đ</p>
                            <p className="text-xs text-coffee-400">{s._count?.nguyenLieu || 0} NL · {s._count?.phieuKho || 0} phiếu</p>
                          </div>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <button onClick={() => openSupplierModal(s)} className="btn-secondary text-xs">Sửa</button>
                          {s.maNCC !== 'NCC_NOI_BO' && (
                            <button onClick={async () => { if (confirm('Xóa NCC?')) { await inventoryAPI.deleteSupplier(s.maNCC); fetchTab(); } }} className="text-red-500 text-xs">Xóa</button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {(tab === 'import' || tab === 'export') && (
                <>
                  <div className="flex justify-end mb-4">
                    <button onClick={() => openVoucherModal(tab === 'import' ? 'NHAP' : 'XUAT')} className="btn-primary text-sm">
                      + Tạo phiếu {tab === 'import' ? 'nhập' : 'xuất'}
                    </button>
                  </div>
                  <VoucherList list={vouchers} />
                </>
              )}

              {tab === 'recipes' && (
                <>
                  <div className="flex justify-end mb-4">
                    <button onClick={() => openRecipeModal()} className="btn-primary text-sm">+ Thêm định mức</button>
                  </div>
                  <div className="card overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-cream-100 border-b">
                        <tr>
                          {['Món', 'Nguyên liệu', 'Tiêu hao/ly', ''].map(h => (
                            <th key={h} className="text-left px-4 py-3 text-coffee-700">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {recipes.map(r => (
                          <tr key={r.maDinhMuc} className="border-b hover:bg-cream-50">
                            <td className="px-4 py-3">{r.mon?.tenMon}</td>
                            <td className="px-4 py-3">{r.nguyenLieu?.tenNL}</td>
                            <td className="px-4 py-3 font-bold">{r.soLuongTieuHao} {r.nguyenLieu?.donVi}</td>
                            <td className="px-4 py-3">
                              <button onClick={() => openRecipeModal(r)} className="text-xs underline text-coffee-500 mr-2">Sửa</button>
                              <button onClick={async () => { if (confirm('Xóa?')) { await inventoryAPI.deleteRecipe(r.maDinhMuc); fetchTab(); } }} className="text-xs text-red-500">Xóa</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {tab === 'history' && <VoucherList list={history.records} />}

              {tab === 'report' && (
                <div className="card overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-cream-100 border-b">
                      <tr>
                        {['Nguyên liệu', 'Tồn kho', 'Đơn vị', 'Giá nhập', 'Giá trị tồn', 'NCC', 'Trạng thái'].map(h => (
                          <th key={h} className="text-left px-4 py-3 text-coffee-700">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {stockReport.map(row => {
                        const st = STATUS_LABEL[row.trangThai] || STATUS_LABEL.DU_HANG;
                        return (
                          <tr key={row.maNguyenLieu} className="border-b hover:bg-cream-50">
                            <td className="px-4 py-3 font-medium">{row.tenNL}</td>
                            <td className="px-4 py-3 font-bold">{row.tonKho}</td>
                            <td className="px-4 py-3">{row.donVi}</td>
                            <td className="px-4 py-3">{row.giaNhap ? `${fmt(row.giaNhap)}đ` : '—'}</td>
                            <td className="px-4 py-3 font-bold text-coffee-800">{fmt(row.giaTriTon)}đ</td>
                            <td className="px-4 py-3 text-xs">{row.nhaCungCap?.tenNCC || '—'}</td>
                            <td className="px-4 py-3"><span className={st.cls}>{st.text}</span></td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot className="bg-cream-50">
                      <tr>
                        <td colSpan={4} className="px-4 py-3 font-bold text-right">Tổng giá trị tồn kho:</td>
                        <td className="px-4 py-3 font-bold text-coffee-900">{fmt(stockReport.reduce((s, r) => s + r.giaTriTon, 0))}đ</td>
                        <td colSpan={2} />
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Ingredient modal */}
      {modal?.type === 'ingredient' && (
        <Modal title={modal.ing ? 'Sửa nguyên liệu' : 'Thêm nguyên liệu'} onClose={() => setModal(null)} onSave={saveIngredient}>
          <Field label="Tên" value={form.tenNL} onChange={v => setForm({ ...form, tenNL: v })} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Tồn kho" type="number" value={form.tonKho} onChange={v => setForm({ ...form, tonKho: v })} />
            <Field label="Ngưỡng cảnh báo" type="number" value={form.tonKhoToiThieu} onChange={v => setForm({ ...form, tonKhoToiThieu: v })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm text-coffee-700 mb-1">Đơn vị</label>
              <select className="input-field" value={form.donVi} onChange={e => setForm({ ...form, donVi: e.target.value })}>
                {['g', 'kg', 'ml', 'l', 'gói', 'hộp', 'chai'].map(u => <option key={u}>{u}</option>)}
              </select></div>
            <Field label="Giá nhập" type="number" value={form.giaNhap} onChange={v => setForm({ ...form, giaNhap: v })} />
          </div>
          <div><label className="block text-sm text-coffee-700 mb-1">Nhà cung cấp</label>
            <select className="input-field" value={form.maNCC} onChange={e => setForm({ ...form, maNCC: e.target.value })}>
              <option value="">— Chọn —</option>
              {suppliers.map(s => <option key={s.maNCC} value={s.maNCC}>{s.tenNCC}</option>)}
            </select></div>
          <Field label="Ghi chú" value={form.moTa} onChange={v => setForm({ ...form, moTa: v })} />
        </Modal>
      )}

      {/* Supplier modal */}
      {modal?.type === 'supplier' && (
        <Modal title={modal.sup ? 'Sửa NCC' : 'Thêm NCC'} onClose={() => setModal(null)} onSave={saveSupplier}>
          <Field label="Tên NCC" value={form.tenNCC} onChange={v => setForm({ ...form, tenNCC: v })} />
          <Field label="Địa chỉ" value={form.diaChi} onChange={v => setForm({ ...form, diaChi: v })} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="SĐT" value={form.soDienThoai} onChange={v => setForm({ ...form, soDienThoai: v })} />
            <Field label="Email" value={form.email} onChange={v => setForm({ ...form, email: v })} />
          </div>
          <Field label="Công nợ" type="number" value={form.congNo} onChange={v => setForm({ ...form, congNo: v })} />
          <Field label="Ghi chú" value={form.ghiChu} onChange={v => setForm({ ...form, ghiChu: v })} />
        </Modal>
      )}

      {/* Voucher modal */}
      {modal?.type === 'voucher' && (
        <Modal title="Tạo phiếu kho" onClose={() => setModal(null)} onSave={saveVoucher} wide>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div><label className="block text-sm text-coffee-700 mb-1">Loại phiếu</label>
              <select className="input-field" value={voucherForm.loaiPhieu} onChange={e => setVoucherForm({ ...voucherForm, loaiPhieu: e.target.value })}>
                <option value="NHAP">Nhập kho</option>
                <option value="XUAT">Xuất kho</option>
                <option value="HUY">Hủy hàng</option>
              </select></div>
            <div><label className="block text-sm text-coffee-700 mb-1">Nhà cung cấp</label>
              <select className="input-field" value={voucherForm.maNCC} onChange={e => setVoucherForm({ ...voucherForm, maNCC: e.target.value })}>
                <option value="">— Không —</option>
                {suppliers.map(s => <option key={s.maNCC} value={s.maNCC}>{s.tenNCC}</option>)}
              </select></div>
          </div>
          <Field label="Ghi chú" value={voucherForm.ghiChu} onChange={v => setVoucherForm({ ...voucherForm, ghiChu: v })} />
          <p className="text-sm font-medium text-coffee-700 mt-3 mb-2">Chi tiết nguyên liệu</p>
          {voucherForm.items.map((item, i) => (
            <div key={i} className="grid grid-cols-3 gap-2 mb-2">
              <select className="input-field text-xs" value={item.maNguyenLieu} onChange={e => updateVoucherItem(i, 'maNguyenLieu', e.target.value)}>
                <option value="">Chọn NL</option>
                {ingredients.map(ing => <option key={ing.maNguyenLieu} value={ing.maNguyenLieu}>{ing.tenNL}</option>)}
              </select>
              <input className="input-field text-xs" type="number" placeholder="SL" value={item.soLuongThucTe} onChange={e => updateVoucherItem(i, 'soLuongThucTe', e.target.value)} />
              <input className="input-field text-xs" type="number" placeholder="Đơn giá" value={item.donGia} onChange={e => updateVoucherItem(i, 'donGia', e.target.value)} />
            </div>
          ))}
          <button onClick={() => setVoucherForm(p => ({ ...p, items: [...p.items, { maNguyenLieu: '', soLuongThucTe: '', donGia: '' }] }))} className="btn-secondary text-xs w-full">+ Thêm dòng</button>
        </Modal>
      )}

      {/* Recipe modal */}
      {modal?.type === 'recipe' && (
        <Modal title={modal.recipe ? 'Sửa định mức' : 'Thêm định mức'} onClose={() => setModal(null)} onSave={saveRecipe}>
          <div><label className="block text-sm text-coffee-700 mb-1">Món</label>
            <select className="input-field" value={form.maMon} onChange={e => setForm({ ...form, maMon: e.target.value })} disabled={!!modal.recipe}>
              <option value="">Chọn món</option>
              {menuItems.map(m => <option key={m.maMon} value={m.maMon}>{m.tenMon}</option>)}
            </select></div>
          <div><label className="block text-sm text-coffee-700 mb-1">Nguyên liệu</label>
            <select className="input-field" value={form.maNguyenLieu} onChange={e => setForm({ ...form, maNguyenLieu: e.target.value })} disabled={!!modal.recipe}>
              <option value="">Chọn NL</option>
              {ingredients.map(ing => <option key={ing.maNguyenLieu} value={ing.maNguyenLieu}>{ing.tenNL} ({ing.donVi})</option>)}
            </select></div>
          <Field label="Số lượng tiêu hao / 1 phần" type="number" value={form.soLuongTieuHao} onChange={v => setForm({ ...form, soLuongTieuHao: v })} />
        </Modal>
      )}
    </div>
  );
}

function Modal({ title, children, onClose, onSave, wide }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`card p-6 shadow-2xl max-h-[90vh] overflow-y-auto ${wide ? 'w-full max-w-lg' : 'w-96'}`}>
        <h3 className="font-display text-lg text-coffee-900 mb-4">{title}</h3>
        <div className="space-y-3">{children}</div>
        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="btn-secondary flex-1">Hủy</button>
          <button onClick={onSave} className="btn-primary flex-1">Lưu</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text' }) {
  return (
    <div>
      <label className="block text-sm text-coffee-700 mb-1">{label}</label>
      <input className="input-field" type={type} value={value} onChange={e => onChange(e.target.value)} />
    </div>
  );
}
