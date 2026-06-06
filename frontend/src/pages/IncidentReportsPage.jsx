import { useEffect, useState } from "react";
import Sidebar from "../components/common/Sidebar";
import { incidentAPI, staffAPI } from "../services/api";
import { useAuth } from "../hooks/useAuth";

const formatVND = (n) => (n ? Number(n).toLocaleString("vi-VN") + "đ" : "");

export default function IncidentReportsPage() {
  const { user } = useAuth();
  const [staff, setStaff] = useState([]);
  const [type, setType] = useState("Làm sai món");
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState("");
  const [involved, setInvolved] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    staffAPI
      .list()
      .then((r) => setStaff(r.data))
      .catch(() => setStaff([]));
    loadIncidents();
  }, []);

  const [incidents, setIncidents] = useState([]);

  const loadIncidents = async () => {
    try {
      const res = await incidentAPI.list();
      setIncidents(res.data);
    } catch (e) {
      setIncidents([]);
    }
  };

  const submit = async () => {
    if (!description || description.trim().length < 5)
      return alert("Mô tả là bắt buộc (ít nhất 5 ký tự)");
    setLoading(true);
    try {
      await incidentAPI.create({
        moTaSuCo: `${type}: ${description}`,
        tienThietHai: cost ? Number(cost) : undefined,
        maNhanVien: involved || undefined,
      });
      setSuccess("Đã tạo biên bản sự cố");
      setDescription("");
      setCost("");
      setInvolved("");
      await loadIncidents();
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi tạo biên bản");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-cream-100">
      <Sidebar />
      <div className="flex-1 overflow-y-auto p-6">
        <h1 className="font-display text-2xl text-coffee-900 mb-3">
          Lập biên bản sự cố
        </h1>
        <p className="text-coffee-500 mb-6">
          Người lập: {user?.hoTen || user?.email}
        </p>

        <div className="card p-6 max-w-2xl">
          <div className="mb-4">
            <label className="block text-sm text-coffee-600 mb-1">
              Loại sự cố
            </label>
            <select
              className="input-field"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option>Làm sai món</option>
              <option>Vỡ ly</option>
              <option>Khác</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm text-coffee-600 mb-1">Mô tả</label>
            <textarea
              className="input-field"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="mb-4 grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm text-coffee-600 mb-1">
                Thiệt hại (VND)
              </label>
              <input
                className="input-field"
                type="number"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm text-coffee-600 mb-1">
                Nhân viên liên quan (tuỳ chọn)
              </label>
              <select
                className="input-field"
                value={involved}
                onChange={(e) => setInvolved(e.target.value)}
              >
                <option value="">-- Chọn nhân viên --</option>
                {staff.map((s) => (
                  <option key={s.maNhanVien} value={s.maNhanVien}>
                    {s.nguoiDung?.hoTen} ({s.nguoiDung?.email})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={submit} disabled={loading} className="btn-primary">
              {loading ? "Đang gửi..." : "Ghi biên bản"}
            </button>
            <button
              onClick={() => {
                setDescription("");
                setCost("");
                setInvolved("");
              }}
              className="btn-secondary"
            >
              Xóa
            </button>
          </div>

          {success && <p className="text-green-600 mt-3">{success}</p>}
        </div>

        <div className="card p-6 max-w-3xl mt-6">
          <h2 className="font-display text-lg mb-3">Danh sách biên bản</h2>
          {incidents.length === 0 ? (
            <p className="text-coffee-400">Chưa có biên bản nào.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-coffee-600 text-xs text-left">
                  <tr>
                    <th className="px-3 py-2">Ngày</th>
                    <th className="px-3 py-2">Mô tả</th>
                    <th className="px-3 py-2">Thiệt hại</th>
                    <th className="px-3 py-2">Nhân viên liên quan</th>
                  </tr>
                </thead>
                <tbody>
                  {incidents.map((it) => (
                    <tr
                      key={it.maBienBan}
                      className="border-t border-cream-100"
                    >
                      <td className="px-3 py-2">
                        {new Date(it.thoiGianLap).toLocaleString("vi-VN")}
                      </td>
                      <td className="px-3 py-2">{it.moTaSuCo}</td>
                      <td className="px-3 py-2">
                        {it.tienThietHai
                          ? Number(it.tienThietHai).toLocaleString("vi-VN") +
                            "đ"
                          : "—"}
                      </td>
                      <td className="px-3 py-2">
                        {it.nhanVien?.nguoiDung?.hoTen || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
