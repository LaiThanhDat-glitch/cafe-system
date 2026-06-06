import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const MANAGER = "Quản lý";
const CASHIER = "Thu ngân";
const BARISTA = "Pha chế";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: "📊", roles: [MANAGER] },
  { path: "/pos", label: "POS Bán hàng", icon: "🖥️", roles: [MANAGER, CASHIER] },
  { path: "/kds", label: "KDS Pha chế", icon: "👨‍🍳", roles: [MANAGER, BARISTA] },
  { path: "/tables", label: "Quản lý bàn", icon: "🪑", roles: [MANAGER, CASHIER] },
  { path: "/orders", label: "Đơn hàng", icon: "📋", roles: [MANAGER, CASHIER] },
  { path: "/inventory", label: "Kho nguyên liệu", icon: "📦", roles: [MANAGER] },
  { path: "/staff", label: "Chấm công", icon: "⏱️", roles: [MANAGER, CASHIER, BARISTA] },
  { path: "/admin/menu", label: "Quản lý món", icon: "🍵", roles: [MANAGER] },
  { path: "/menu", label: "Xem thực đơn", icon: "🧾", roles: [] },
];

export default function Sidebar() {
  const { user, logout, role } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const filtered = navItems.filter(
    (item) => item.roles.length === 0 || item.roles.includes(role),
  );

  return (
    <aside className="w-60 min-h-screen bg-coffee-900 flex flex-col text-cream-100 shrink-0">
      <div className="px-6 py-5 border-b border-coffee-700">
        <div className="flex items-center gap-3">
          <span className="text-3xl">☕</span>
          <div>
            <h1 className="font-display text-lg font-bold text-cream-100 leading-tight">
              Cafe System
            </h1>
            <p className="text-xs text-cream-400">{role || "Khách hàng"}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {filtered.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-coffee-600 text-white"
                  : "text-cream-300 hover:bg-coffee-800 hover:text-cream-100"
              }`
            }
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-coffee-700">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-coffee-800 mb-2">
          <div className="w-8 h-8 rounded-full bg-coffee-500 flex items-center justify-center text-sm font-bold text-white">
            {user?.hoTen?.[0] || "?"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-cream-100 truncate">{user?.hoTen}</p>
            <p className="text-xs text-cream-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full text-left px-3 py-2 text-sm text-cream-400 hover:text-cream-100 hover:bg-coffee-800 rounded-lg transition-all"
        >
          🚪 Đăng xuất
        </button>
      </div>
    </aside>
  );
}
