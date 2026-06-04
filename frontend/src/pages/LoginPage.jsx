import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { authAPI } from "../services/api";

export default function LoginPage() {
  const { login, role } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("login"); // login | register
  const [form, setForm] = useState({
    email: "",
    matKhau: "",
    hoTen: "",
    soDienThoai: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (mode === "login") {
        const user = await login({ email: form.email, matKhau: form.matKhau });
        const r = user?.nhanVien?.vaiTro?.tenVaiTro;
        if (r === "Quản lý") navigate("/dashboard");
        else if (r === "Thu ngân") navigate("/pos");
        else if (r === "Pha chế") navigate("/kds");
        else navigate("/");
      } else {
        // register
        const res = await authAPI.register({
          hoTen: form.hoTen,
          email: form.email,
          soDienThoai: form.soDienThoai,
          matKhau: form.matKhau,
        });
        // store token and reload to initialize session
        localStorage.setItem("token", res.data.token || res.data.access || "");
        window.location.href = "/account";
      }
    } catch (err) {
      setError(err.response?.data?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background:
          "linear-gradient(135deg, #4a2209 0%, #8c4516 50%, #d4813a 100%)",
      }}
    >
      <div className="w-full max-w-md px-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-cream-100 mb-4 shadow-lg">
            <span className="text-4xl">☕</span>
          </div>
          <h1 className="font-display text-3xl text-cream-100 font-bold">
            Cafe System
          </h1>
          <p className="text-cream-300 mt-1 text-sm">
            Hệ thống quản lý quán cà phê
          </p>
        </div>

        <div className="card p-8 shadow-2xl">
          <div className="flex items-center justify-center gap-3 mb-6">
            <button
              onClick={() => setMode("login")}
              className={`px-4 py-2 rounded-full ${mode === "login" ? "bg-coffee-600 text-cream-100" : "bg-white text-coffee-700"}`}
            >
              Đăng nhập
            </button>
            <button
              onClick={() => setMode("register")}
              className={`px-4 py-2 rounded-full ${mode === "register" ? "bg-coffee-600 text-cream-100" : "bg-white text-coffee-700"}`}
            >
              Đăng ký
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="block text-sm font-medium text-coffee-700 mb-1">
                  Họ tên
                </label>
                <input
                  className="input-field"
                  type="text"
                  placeholder="Nguyễn Văn A"
                  value={form.hoTen}
                  onChange={(e) => setForm({ ...form, hoTen: e.target.value })}
                  required
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-coffee-700 mb-1">
                Email hoặc SĐT
              </label>
              <input
                className="input-field"
                type="text"
                placeholder="email@cafe.vn"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            {mode === "register" && (
              <div>
                <label className="block text-sm font-medium text-coffee-700 mb-1">
                  Số điện thoại
                </label>
                <input
                  className="input-field"
                  type="text"
                  placeholder="0901234567"
                  value={form.soDienThoai}
                  onChange={(e) =>
                    setForm({ ...form, soDienThoai: e.target.value })
                  }
                  required
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-coffee-700 mb-1">
                Mật khẩu
              </label>
              <input
                className="input-field"
                type="password"
                placeholder="••••••••"
                value={form.matKhau}
                onChange={(e) => setForm({ ...form, matKhau: e.target.value })}
                required
              />
            </div>
            <button
              type="submit"
              className="btn-primary w-full py-3 text-base"
              disabled={loading}
            >
              {loading
                ? mode === "login"
                  ? "Đang đăng nhập..."
                  : "Đang đăng ký..."
                : mode === "login"
                  ? "Đăng nhập"
                  : "Đăng ký"}
            </button>
          </form>

          <div className="mt-4 text-center flex flex-col gap-3">
            <a
              href="/"
              className="text-coffee-500 text-sm hover:text-coffee-700"
            >
              ← Về trang menu
            </a>
            <button
              onClick={() => {
                navigate("/");
              }}
              className="text-sm bg-white text-coffee-700 px-4 py-2 rounded-full"
            >
              Tiếp tục như khách vãng lai
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-cream-200">
            <p className="text-xs text-coffee-400 text-center">
              Demo accounts:
            </p>
            <div className="mt-2 space-y-1 text-xs text-coffee-500 text-center">
              <p>Khách hàng thành viên: customer@cafe.vn / 123456</p>
              <p>Quản lý: manager@cafe.vn / 123456</p>
              <p>Thu ngân: cashier@cafe.vn / 123456</p>
              <p>Pha chế: barista@cafe.vn / 123456</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
