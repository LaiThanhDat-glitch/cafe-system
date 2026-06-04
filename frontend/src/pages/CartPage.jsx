import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cartAPI, orderAPI, paymentAPI } from "../services/api";
import { useAuth } from "../hooks/useAuth";

const formatVND = (n) => Number(n).toLocaleString("vi-VN") + "đ";

const getSessionId = () => {
  let s = localStorage.getItem("sessionId");
  if (!s) {
    s = `sess_${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem("sessionId", s);
  }
  return s;
};

export default function CartPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [guest, setGuest] = useState({ hoTen: "", soDienThoai: "" });
  const [diaChi, setDiaChi] = useState("");
  const [useProfileAddress, setUseProfileAddress] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [tienKhachDua, setTienKhachDua] = useState("");
  const [notes, setNotes] = useState({});

  const sessionId = getSessionId();

  const load = async () => {
    try {
      const res = await cartAPI.get({ sessionId });
      setCart(res.data);
    } catch (err) {
      setCart(null);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    // Load provinces from public API; load districts/wards on demand
    (async () => {
      try {
        const res = await fetch("https://provinces.open-api.vn/api/p");
        const data = await res.json();
        setProvinces(data || []);
      } catch (e) {
        console.warn("Failed to load provinces from open-api.vn", e);
      }
    })();
  }, []);

  useEffect(() => {
    if (!selectedProvince) return;
    (async () => {
      try {
        const res = await fetch(
          `https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`,
        );
        const data = await res.json();
        setDistricts(data.districts || []);
      } catch (e) {
        console.warn("Failed to load districts", e);
      }
    })();
  }, [selectedProvince]);

  useEffect(() => {
    if (!selectedDistrict) return;
    (async () => {
      try {
        const res = await fetch(
          `https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`,
        );
        const data = await res.json();
        setWards(data.wards || []);
      } catch (e) {
        console.warn("Failed to load wards", e);
      }
    })();
  }, [selectedDistrict]);

  useEffect(() => {
    // when province changes, reset district/ward
    setSelectedDistrict("");
    setSelectedWard("");
  }, [selectedProvince]);

  useEffect(() => {
    // when district changes, reset ward
    setSelectedWard("");
  }, [selectedDistrict]);

  const updateQty = async (item, qty) => {
    if (qty <= 0) return remove(item.maChiTietGio);
    await cartAPI.addItem({ maMon: item.maMon, soLuong: qty, sessionId });
    await load();
  };

  const remove = async (id) => {
    await cartAPI.removeItem(id);
    await load();
  };

  const checkout = async () => {
    if (!cart || !cart.chiTietGio || cart.chiTietGio.length === 0) return;
    // Validation: require address (either street or structured selection)
    const hasStructuredAddress =
      selectedWard || (selectedDistrict && selectedProvince);
    if (!user) {
      if (
        !guest.hoTen ||
        !guest.soDienThoai ||
        (!diaChi && !hasStructuredAddress)
      ) {
        alert(
          "Khách vãng lai phải nhập họ tên, số điện thoại và địa chỉ giao hàng (hoặc chọn Tỉnh/Huyện/Xã).",
        );
        return;
      }
    } else {
      if (
        !useProfileAddress &&
        !diaChi &&
        !user.diaChi &&
        !hasStructuredAddress
      ) {
        alert("Vui lòng nhập địa chỉ giao hàng hoặc dùng địa chỉ trong hồ sơ.");
        return;
      }
    }

    setLoading(true);
    const buildGhiChu = (note) => {
      if (!note) return undefined;
      const parts = [];
      if (note.da) parts.push(`Đá: ${note.da}`);
      if (note.duong) parts.push(`Đường: ${note.duong}`);
      if (note.size) parts.push(`Size: ${note.size}`);
      if (note.text) parts.push(note.text);
      return parts.length > 0 ? parts.join("; ") : undefined;
    };

    const items = cart.chiTietGio.map((c) => {
      const note = notes[c.maChiTietGio];
      const ghiChu = buildGhiChu(note);
      const it = { maMon: c.maMon, soLuong: c.soLuong };
      if (ghiChu) it.ghiChu = ghiChu;
      return it;
    });
    const finalAddress = useProfileAddress ? user?.diaChi : diaChi;
    const findName = (list, code) => {
      if (!code || !list) return null;
      const item = list.find(
        (x) => String(x.code || x.id || x.Ma) === String(code),
      );
      return item ? item.name || item.ten || item.Ten || null : null;
    };
    const provinceName = findName(provinces, selectedProvince);
    const districtName = findName(districts, selectedDistrict);
    const wardName = findName(wards, selectedWard);

    const thongTinGuest = JSON.stringify({
      hoTen: user ? user.hoTen : guest.hoTen || "Khách vãng lai",
      soDienThoai: user ? user.soDienThoai : guest.soDienThoai || "",
      diaChi: finalAddress || null,
      tinh: provinceName || null,
      huyen: districtName || null,
      xa: wardName || null,
      sessionId,
    });

    const payload = {
      items,
      loaiDonHang: "MANG_VE",
      thongTinGuest,
    };
    try {
      const orderRes = await orderAPI.create(payload);
      const maDonHang = orderRes.data.maDonHang || orderRes.data.maDonHang;

      // create payment
      const payRes = await paymentAPI.create({
        maDonHang,
        phuongThuc: paymentMethod,
        tienKhachDua: tienKhachDua ? Number(tienKhachDua) : undefined,
      });

      // handle VNPAY redirect
      if (payRes.data?.paymentUrl) {
        window.location.href = payRes.data.paymentUrl;
        return;
      }

      // clear cart
      await cartAPI.clear({ sessionId });
      navigate("/account");
      alert(`Tạo đơn thành công: ${maDonHang}`);
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi khi tạo đơn");
    } finally {
      setLoading(false);
    }
  };

  const clear = async () => {
    await cartAPI.clear({ sessionId });
    await load();
  };

  const total = (cart?.chiTietGio || []).reduce(
    (s, c) => s + Number(c.mon?.giaBan || 0) * c.soLuong,
    0,
  );

  const ICE_OPTIONS = ["Không đá", "Ít đá", "Đá vừa", "Nhiều đá"];
  const SUGAR_OPTIONS = [
    "Không đường",
    "Ít đường",
    "Bình thường",
    "Nhiều đường",
  ];
  const SIZE_OPTIONS = ["S", "M", "L"];

  const setItemNoteField = (id, field, value) => {
    setNotes((prev) => {
      const item = prev[id] || { da: "", duong: "", size: "", text: "" };
      const next = { ...item, [field]: value };
      return { ...prev, [id]: next };
    });
  };

  return (
    <div className="min-h-screen bg-cream-100">
      <header className="bg-coffee-900 text-cream-100 px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate("/")} className="text-cream-300">
          ← Quay về menu
        </button>
        <h1 className="font-display text-lg font-bold">Giỏ hàng</h1>
        <div />
      </header>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {(cart?.chiTietGio || []).length === 0 ? (
          <div className="text-center py-12 text-coffee-400">
            <p className="text-4xl mb-3">🧺</p>
            <p>Giỏ hàng trống</p>
            <button onClick={() => navigate("/")} className="mt-4 btn-primary">
              Xem thực đơn
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.chiTietGio.map((item) => (
              <div
                key={item.maChiTietGio}
                className="card p-4 flex items-center gap-4"
              >
                <div className="w-16 h-16 bg-cream-100 rounded overflow-hidden flex items-center justify-center">
                  {item.mon?.hinhAnh?.[0] ? (
                    <img
                      src={item.mon.hinhAnh[0].urlAnh}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    "☕"
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-coffee-900">
                        {item.mon?.tenMon}
                      </p>
                      <p className="text-xs text-coffee-500">
                        {formatVND(item.mon?.giaBan || 0)}
                      </p>
                    </div>
                    <button
                      onClick={() => remove(item.maChiTietGio)}
                      className="text-sm text-red-500"
                    >
                      Xóa
                    </button>
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <button
                      onClick={() => updateQty(item, item.soLuong - 1)}
                      className="px-3 py-1 bg-white border rounded"
                    >
                      −
                    </button>
                    <div className="px-3">{item.soLuong}</div>
                    <button
                      onClick={() => updateQty(item, item.soLuong + 1)}
                      className="px-3 py-1 bg-white border rounded"
                    >
                      +
                    </button>
                  </div>
                  {item.mon?.doUong && (
                    <div className="mt-3">
                      <div className="grid grid-cols-3 gap-2">
                        <select
                          className="input-field"
                          value={
                            (notes[item.maChiTietGio] &&
                              notes[item.maChiTietGio].da) ||
                            item.mon.doUong?.mucDoDa ||
                            ""
                          }
                          onChange={(e) =>
                            setItemNoteField(
                              item.maChiTietGio,
                              "da",
                              e.target.value,
                            )
                          }
                        >
                          <option value="">Đá</option>
                          {ICE_OPTIONS.map((o) => (
                            <option key={o} value={o}>
                              {o}
                            </option>
                          ))}
                        </select>

                        <select
                          className="input-field"
                          value={
                            (notes[item.maChiTietGio] &&
                              notes[item.maChiTietGio].duong) ||
                            item.mon.doUong?.mucDoDuong ||
                            ""
                          }
                          onChange={(e) =>
                            setItemNoteField(
                              item.maChiTietGio,
                              "duong",
                              e.target.value,
                            )
                          }
                        >
                          <option value="">Đường</option>
                          {SUGAR_OPTIONS.map((o) => (
                            <option key={o} value={o}>
                              {o}
                            </option>
                          ))}
                        </select>

                        <select
                          className="input-field"
                          value={
                            (notes[item.maChiTietGio] &&
                              notes[item.maChiTietGio].size) ||
                            item.mon.doUong?.mucSize ||
                            ""
                          }
                          onChange={(e) =>
                            setItemNoteField(
                              item.maChiTietGio,
                              "size",
                              e.target.value,
                            )
                          }
                        >
                          <option value="">Size</option>
                          {SIZE_OPTIONS.map((o) => (
                            <option key={o} value={o}>
                              {o}
                            </option>
                          ))}
                        </select>
                      </div>

                      <textarea
                        className="input-field mt-2"
                        placeholder="Ghi chú thêm (ví dụ: bỏ đá, thêm topping...)"
                        value={
                          (notes[item.maChiTietGio] &&
                            notes[item.maChiTietGio].text) ||
                          ""
                        }
                        onChange={(e) =>
                          setItemNoteField(
                            item.maChiTietGio,
                            "text",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}

            <div className="card p-4">
              <h3 className="font-medium mb-2">Thông tin khách</h3>
              <div className="grid grid-cols-1 gap-3">
                <input
                  className="input-field"
                  placeholder="Họ tên (tuỳ chọn)"
                  value={guest.hoTen}
                  onChange={(e) =>
                    setGuest({ ...guest, hoTen: e.target.value })
                  }
                />
                <input
                  className="input-field"
                  placeholder="Số điện thoại (tuỳ chọn)"
                  value={guest.soDienThoai}
                  onChange={(e) =>
                    setGuest({ ...guest, soDienThoai: e.target.value })
                  }
                />
                <div>
                  {user ? (
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={useProfileAddress}
                        onChange={(e) => {
                          setUseProfileAddress(e.target.checked);
                          if (e.target.checked) setDiaChi(user.diaChi || "");
                        }}
                      />
                      <span> Dùng địa chỉ trong hồ sơ</span>
                    </label>
                  ) : null}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <select
                    className="input-field"
                    value={selectedProvince}
                    onChange={(e) => setSelectedProvince(e.target.value)}
                  >
                    <option value="">Tỉnh / Thành</option>
                    {provinces.map((p) => (
                      <option
                        key={p.code || p.id || p.Ma}
                        value={p.code || p.id || p.Ma}
                      >
                        {p.name || p.ten || p.Ten}
                      </option>
                    ))}
                  </select>

                  <select
                    className="input-field"
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    disabled={!selectedProvince}
                  >
                    <option value="">Quận / Huyện</option>
                    {districts
                      .filter((d) => {
                        const parent =
                          d.province_code ||
                          d.tinh_code ||
                          d.parent_code ||
                          d.MaTinh;
                        return (
                          selectedProvince &&
                          String(parent) === String(selectedProvince)
                        );
                      })
                      .map((d) => (
                        <option
                          key={d.code || d.id || d.Ma}
                          value={d.code || d.id || d.Ma}
                        >
                          {d.name || d.ten || d.Ten}
                        </option>
                      ))}
                  </select>

                  <select
                    className="input-field"
                    value={selectedWard}
                    onChange={(e) => setSelectedWard(e.target.value)}
                    disabled={!selectedDistrict}
                  >
                    <option value="">Phường / Xã</option>
                    {wards
                      .filter((w) => {
                        const parent =
                          w.district_code ||
                          w.huyen_code ||
                          w.parent_code ||
                          w.MaHuyen;
                        return (
                          selectedDistrict &&
                          String(parent) === String(selectedDistrict)
                        );
                      })
                      .map((w) => (
                        <option
                          key={w.code || w.id || w.Ma}
                          value={w.code || w.id || w.Ma}
                        >
                          {w.name || w.ten || w.Ten}
                        </option>
                      ))}
                  </select>
                </div>

                <input
                  className="input-field mt-2"
                  placeholder="Số nhà, đường, tên tổ/khối (ví dụ: 123 Đường A)"
                  value={diaChi}
                  onChange={(e) => setDiaChi(e.target.value)}
                />
              </div>
            </div>

            <div className="card p-4">
              <h3 className="font-medium mb-2">Phương thức thanh toán</h3>
              <div className="flex flex-col space-y-2">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name="pay"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")}
                  />
                  <span>Tiền mặt khi nhận (COD)</span>
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name="pay"
                    value="VNPAY"
                    checked={paymentMethod === "VNPAY"}
                    onChange={() => setPaymentMethod("VNPAY")}
                  />
                  <span>VNPAY (thanh toán trực tuyến)</span>
                </label>

                {(paymentMethod === "TIEN_MAT" || paymentMethod === "COD") && (
                  <input
                    className="input-field"
                    placeholder="Tiền khách đưa (tuỳ chọn)"
                    value={tienKhachDua}
                    onChange={(e) => setTienKhachDua(e.target.value)}
                  />
                )}
              </div>
            </div>

            <div className="card p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-coffee-500">Tổng</p>
                <p className="font-bold text-lg">{formatVND(total)}</p>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={checkout}
                  className="btn-primary px-6 py-3"
                  disabled={loading}
                >
                  {loading ? "Đang xử lý..." : "Thanh toán"}
                </button>
                <button
                  onClick={clear}
                  className="px-4 py-2 bg-white border rounded"
                >
                  Xóa giỏ hàng
                </button>
                <div className="flex gap-2 mt-2">
                  <a
                    href="https://shopeefood.vn"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 bg-orange-500 text-white rounded"
                  >
                    Đặt qua ShopeeFood
                  </a>
                  <a
                    href="https://www.grab.com/vn/"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 bg-green-600 text-white rounded"
                  >
                    Đặt qua Grab
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
