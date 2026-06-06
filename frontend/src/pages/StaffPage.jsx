import { useEffect, useMemo, useState } from 'react';
import Sidebar from '../components/common/Sidebar';
import { staffAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const SHIFT_TYPES = [
  { value: 'SANG', label: 'Ca sáng' },
  { value: 'CHIEU', label: 'Ca chiều' },
  { value: 'TOI', label: 'Ca tối' },
];

const SHIFT_LABEL = {
  SANG: 'Ca sáng',
  CHIEU: 'Ca chiều',
  TOI: 'Ca tối',
};

export default function StaffPage() {
  const { isManager } = useAuth();
  const [staff, setStaff] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [currentShift, setCurrentShift] = useState(null);
  const [tab, setTab] = useState(isManager ? 'staff' : 'shifts');
  const [modal, setModal] = useState(false);
  const [shiftType, setShiftType] = useState('SANG');
  const [loadingShift, setLoadingShift] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ hoTen: '', email: '', soDienThoai: '', matKhau: '', maVaiTro: '' });

  const loadData = async () => {
    const [staffRes, shiftsRes, currentRes] = await Promise.all([
      isManager ? staffAPI.list() : Promise.resolve({ data: [] }),
      staffAPI.getShifts(),
      staffAPI.getCurrentShift(),
    ]);
    setStaff(staffRes.data);
    setShifts(shiftsRes.data);
    setCurrentShift(currentRes.data);
  };

  useEffect(() => {
    loadData().catch((err) => setError(err.response?.data?.message || 'Không tải được dữ liệu nhân sự'));
  }, [isManager]);

  const openShiftCount = useMemo(
    () => staff.filter((nv) => nv.caLamViec?.length > 0).length,
    [staff],
  );

  const handleCreate = async () => {
    await staffAPI.create(form);
    setModal(false);
    setForm({ hoTen: '', email: '', soDienThoai: '', matKhau: '', maVaiTro: '' });
    await loadData();
  };

  const handleCheckin = async () => {
    setLoadingShift(true);
    setError('');
    try {
      await staffAPI.checkin({ loaiCa: shiftType });
      setTab('shifts');
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể check-in');
    } finally {
      setLoadingShift(false);
    }
  };

  const handleCheckout = async () => {
    if (!currentShift) return;
    setLoadingShift(true);
    setError('');
    try {
      await staffAPI.checkout(currentShift.maCa);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể check-out');
    } finally {
      setLoadingShift(false);
    }
  };

  const formatShiftTime = (t) => (
    t ? new Date(t).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '-'
  );

  const calcHours = (start, end) => {
    if (!end) return 'Đang làm';
    const diff = (new Date(end) - new Date(start)) / 3600000;
    return `${diff.toFixed(1)}h`;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-cream-100">
      <Sidebar />

      <div className="flex-1 overflow-y-auto">
        <div className="bg-white border-b border-cream-300 px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl text-coffee-900">Quản lý nhân sự</h1>
            <p className="text-sm text-coffee-500">
              {isManager ? `${openShiftCount} nhân viên đang trong ca` : 'Check-in/check-out ca làm việc'}
            </p>
          </div>
          {isManager && tab === 'staff' && (
            <button onClick={() => setModal(true)} className="btn-primary">+ Thêm nhân viên</button>
          )}
        </div>

        <div className="px-6 pt-4">
          <div className="card p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-coffee-500">Ca hiện tại</p>
              <p className="font-bold text-coffee-900">
                {currentShift
                  ? `${SHIFT_LABEL[currentShift.loaiCa] || currentShift.loaiCa} - vào lúc ${formatShiftTime(currentShift.thoiGianVaoCa)}`
                  : 'Chưa check-in'}
              </p>
              {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {!currentShift && (
                <select
                  className="input-field sm:w-40"
                  value={shiftType}
                  onChange={(e) => setShiftType(e.target.value)}
                  disabled={loadingShift}
                >
                  {SHIFT_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              )}
              {currentShift ? (
                <button onClick={handleCheckout} disabled={loadingShift} className="btn-primary disabled:opacity-50">
                  Check-out
                </button>
              ) : (
                <button onClick={handleCheckin} disabled={loadingShift} className="btn-primary disabled:opacity-50">
                  Check-in
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 pt-4 flex gap-3">
          {(isManager ? ['staff', 'shifts'] : ['shifts']).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t ? 'bg-coffee-600 text-white' : 'bg-white text-coffee-700 border border-cream-300 hover:bg-cream-100'}`}
            >
              {t === 'staff' ? 'Nhân viên' : 'Ca làm việc'}
            </button>
          ))}
        </div>

        {isManager && tab === 'staff' && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {staff.map((nv) => {
                const isWorking = nv.caLamViec?.length > 0;
                return (
                  <div key={nv.maNhanVien} className="card p-4 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-coffee-100 flex items-center justify-center text-xl font-bold text-coffee-700 shrink-0">
                      {nv.nguoiDung?.hoTen?.[0] || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-bold text-coffee-900 truncate">{nv.nguoiDung?.hoTen}</p>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${isWorking ? 'bg-green-100 text-green-700' : 'bg-cream-200 text-coffee-600'}`}>
                          {isWorking ? 'Đang làm' : 'Ngoài ca'}
                        </span>
                      </div>
                      <p className="text-sm text-coffee-500 truncate">{nv.nguoiDung?.email}</p>
                      <p className="text-sm text-coffee-500">{nv.nguoiDung?.soDienThoai}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                          {nv.vaiTro?.tenVaiTro}
                        </span>
                        <span className="text-xs text-coffee-400">
                          Từ {new Date(nv.hireDate).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === 'shifts' && (
          <div className="p-6">
            <div className="card overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-cream-100 border-b border-cream-300">
                  <tr>
                    {['Nhân viên', 'Ca', 'Vào ca', 'Ra ca', 'Số giờ', 'Ngày', 'Trạng thái'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-coffee-700 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {shifts.map((s) => (
                    <tr key={s.maCa} className="border-b border-cream-100 hover:bg-cream-50">
                      <td className="px-4 py-3 font-medium text-coffee-900">{s.nhanVien?.nguoiDung?.hoTen}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          s.loaiCa === 'SANG' ? 'bg-amber-100 text-amber-700'
                            : s.loaiCa === 'CHIEU' ? 'bg-blue-100 text-blue-700'
                              : 'bg-purple-100 text-purple-700'
                        }`}
                        >
                          {SHIFT_LABEL[s.loaiCa] || s.loaiCa}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-coffee-600">{formatShiftTime(s.thoiGianVaoCa)}</td>
                      <td className="px-4 py-3 text-coffee-600">{formatShiftTime(s.thoiGianRaCa)}</td>
                      <td className="px-4 py-3 font-medium">{calcHours(s.thoiGianVaoCa, s.thoiGianRaCa)}</td>
                      <td className="px-4 py-3 text-coffee-500 text-xs">{new Date(s.thoiGianVaoCa).toLocaleDateString('vi-VN')}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.thoiGianRaCa ? 'bg-cream-200 text-coffee-600' : 'bg-green-100 text-green-700'}`}>
                          {s.thoiGianRaCa ? 'Đã kết thúc' : 'Đang mở'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {shifts.length === 0 && (
                    <tr><td colSpan={7} className="text-center py-8 text-coffee-400">Không có dữ liệu</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card p-6 w-96 shadow-2xl">
            <h3 className="font-display text-lg text-coffee-900 mb-4">Thêm nhân viên</h3>
            <div className="space-y-3">
              {[
                { label: 'Họ tên', key: 'hoTen', type: 'text' },
                { label: 'Email', key: 'email', type: 'email' },
                { label: 'Số điện thoại', key: 'soDienThoai', type: 'tel' },
                { label: 'Mật khẩu', key: 'matKhau', type: 'password' },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="block text-sm text-coffee-700 mb-1">{label}</label>
                  <input className="input-field" type={type} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
                </div>
              ))}
              <div>
                <label className="block text-sm text-coffee-700 mb-1">Vai trò</label>
                <select className="input-field" value={form.maVaiTro} onChange={(e) => setForm({ ...form, maVaiTro: e.target.value })}>
                  <option value="">Chọn vai trò</option>
                  <option value="quan-ly">Quản lý</option>
                  <option value="thu-ngan">Thu ngân</option>
                  <option value="pha-che">Pha chế</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setModal(false)} className="btn-secondary flex-1">Hủy</button>
              <button onClick={handleCreate} className="btn-primary flex-1">Tạo tài khoản</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
