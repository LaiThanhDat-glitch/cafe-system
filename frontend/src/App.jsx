import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";

import LoginPage from "./pages/LoginPage";
import MenuPage from "./pages/MenuPage";
import CartPage from "./pages/CartPage";
import POSPage from "./pages/POSPage";
import KDSPage from "./pages/KDSPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import DashboardPage from "./pages/DashboardPage";
import TablePage from "./pages/TablePage";
import InventoryPage from "./pages/InventoryPage";
import AdminMenuPage from "./pages/AdminMenuPage";
import StaffPage from "./pages/StaffPage";
import OrdersPage from "./pages/OrdersPage";
import CustomerPage from "./pages/CustomerPage";
import IncidentReportsPage from "./pages/IncidentReportsPage";

const MANAGER = "Quản lý";
const CASHIER = "Thu ngân";
const BARISTA = "Pha chế";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, role } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-coffee-600 font-display text-2xl">
          Đang tải...
        </span>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(role))
    return <Navigate to="/" replace />;
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MenuPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/order/:id" element={<OrderDetailPage />} />

          <Route
            path="/pos"
            element={
              <ProtectedRoute allowedRoles={[MANAGER, CASHIER]}>
                <POSPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/kds"
            element={
              <ProtectedRoute allowedRoles={[MANAGER, BARISTA]}>
                <KDSPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={[MANAGER]}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/incidents"
            element={
              <ProtectedRoute allowedRoles={[MANAGER]}>
                <IncidentReportsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tables"
            element={
              <ProtectedRoute allowedRoles={[MANAGER, CASHIER]}>
                <TablePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/inventory"
            element={
              <ProtectedRoute allowedRoles={[MANAGER]}>
                <InventoryPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/menu"
            element={
              <ProtectedRoute allowedRoles={[MANAGER]}>
                <AdminMenuPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/staff"
            element={
              <ProtectedRoute allowedRoles={[MANAGER, CASHIER, BARISTA]}>
                <StaffPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <CustomerPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <CustomerPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
