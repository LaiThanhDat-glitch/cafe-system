import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Sidebar from '../components/common/Sidebar';
import { reportAPI, inventoryAPI } from '../services/api';
import { Link } from 'react-router-dom';

const formatVND = (n) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(0) + 'K';
  return Number(n).toLocaleString('vi-VN');
};

const COLORS = ['#8c4516', '#d4813a', '#f2c99a', '#4a2209', '#e8a465'];

export default function DashboardPage() {
  const [today, setToday] = useState(null);
  const [month, setMonth] = useState(null);
  const [daily, setDaily] = useState([]);
  const [inventory, setInventory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      reportAPI.getRevenue({ type: 'today' }),
      reportAPI.getRevenue({ type: 'month' }),
      reportAPI.getDaily({ days: 30 }),
      inventoryAPI.getSummary(),
    ]).then(([t, m, d, inv]) => {
      setToday(t.data);
      setMonth(m.data);
      setDaily(d.data);
      setInventory(inv.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex items-center justify-center">
        <p className="text-coffee-500 text-lg">Đang tải dữ liệu...</p>
      </div>
    </div>
  );

  const kpis = [
    { label: 'Doanh thu hôm nay', value: formatVND(today?.revenue || 0) + 'đ', icon: '💰', color: 'bg-amber-50 border-amber-200', textColor: 'text-amber-700' },
    { label: 'Doanh thu tháng', value: formatVND(month?.revenue || 0) + 'đ', icon: '📈', color: 'bg-coffee-50 border-coffee-200', textColor: 'text-coffee-700' },
    { label: 'Đơn hôm nay', value: today?.totalOrders || 0, icon: '📋', color: 'bg-blue-50 border-blue-200', textColor: 'text-blue-700' },
    { label: 'Hoàn thành', value: today?.completedOrders || 0, icon: '✅', color: 'bg-green-50 border-green-200', textColor: 'text-green-700' },
    { label: 'Đã hủy', value: today?.cancelledOrders || 0, icon: '❌', color: 'bg-red-50 border-red-200', textColor: 'text-red-700' },
    { label: 'Tỉ lệ hoàn thành', value: today?.totalOrders ? Math.round((today.completedOrders / today.totalOrders) * 100) + '%' : '—', icon: '🎯', color: 'bg-purple-50 border-purple-200', textColor: 'text-purple-700' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-cream-100">
      <Sidebar />

      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-white border-b border-cream-300 px-6 py-4">
          <h1 className="font-display text-2xl text-coffee-900">Dashboard</h1>
          <p className="text-coffee-500 text-sm">{new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        <div className="p-6 space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
            {kpis.map((kpi, i) => (
              <div key={i} className={`card border ${kpi.color} p-4`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{kpi.icon}</span>
                  <p className="text-xs text-coffee-500 leading-tight">{kpi.label}</p>
                </div>
                <p className={`font-display text-2xl font-bold ${kpi.textColor}`}>{kpi.value}</p>
              </div>
            ))}
          </div>

          {/* Inventory KPIs */}
          {inventory && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-display text-lg text-coffee-900">Kho nguyên liệu</h2>
                <Link to="/inventory" className="text-sm text-coffee-600 hover:text-coffee-800 underline">Quản lý kho →</Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Nguyên liệu', value: inventory.totalIngredients, icon: '📦', color: 'bg-cream-50 border-cream-200', textColor: 'text-coffee-700' },
                  { label: 'Sắp hết hàng', value: inventory.lowStockCount, icon: '⚠️', color: inventory.lowStockCount > 0 ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200', textColor: inventory.lowStockCount > 0 ? 'text-amber-700' : 'text-green-700' },
                  { label: 'Giá trị tồn kho', value: formatVND(inventory.totalStockValue) + 'đ', icon: '💎', color: 'bg-blue-50 border-blue-200', textColor: 'text-blue-700' },
                  { label: 'Nhập/Xuất tháng', value: `${inventory.monthImport.count}/${inventory.monthExport.count}`, icon: '🔄', color: 'bg-purple-50 border-purple-200', textColor: 'text-purple-700' },
                ].map((kpi, i) => (
                  <div key={i} className={`card border ${kpi.color} p-4`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{kpi.icon}</span>
                      <p className="text-xs text-coffee-500 leading-tight">{kpi.label}</p>
                    </div>
                    <p className={`font-display text-2xl font-bold ${kpi.textColor}`}>{kpi.value}</p>
                  </div>
                ))}
              </div>
              {inventory.lowStockItems?.length > 0 && (
                <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800">
                  <strong>Cảnh báo:</strong>{' '}
                  {inventory.lowStockItems.map(i => `${i.tenNL} (${i.tonKho}${i.donVi})`).join(' · ')}
                </div>
              )}
            </div>
          )}

          {/* Revenue chart */}
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 card p-5">
              <h2 className="font-display text-lg text-coffee-900 mb-4">Doanh thu 30 ngày gần nhất</h2>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChartFallback data={daily} />
              </ResponsiveContainer>
            </div>

            {/* Top items pie */}
            <div className="card p-5">
              <h2 className="font-display text-lg text-coffee-900 mb-4">Top món bán chạy</h2>
              {today?.topItems?.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie data={today.topItems.slice(0,5)} dataKey="_sum.soLuong" nameKey="tenMon" cx="50%" cy="50%" outerRadius={70}>
                        {today.topItems.slice(0,5).map((_, idx) => (
                          <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v) => [`${v} phần`, '']} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-1 mt-2">
                    {today.topItems.slice(0,5).map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <span className="w-3 h-3 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                        <span className="flex-1 truncate text-coffee-700">{item.tenMon}</span>
                        <span className="font-bold text-coffee-900">{item._sum?.soLuong}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-coffee-400 text-sm text-center py-8">Chưa có dữ liệu</p>
              )}
            </div>
          </div>

          {/* Daily bar chart */}
          <div className="card p-5">
            <h2 className="font-display text-lg text-coffee-900 mb-4">Biểu đồ doanh thu theo ngày</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={daily.slice(-14)} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0dfc0" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#8c4516' }}
                  tickFormatter={(d) => d.slice(5)} />
                <YAxis tick={{ fontSize: 11, fill: '#8c4516' }} tickFormatter={formatVND} width={50} />
                <Tooltip formatter={(v) => [Number(v).toLocaleString('vi-VN') + 'đ', 'Doanh thu']}
                  labelFormatter={(l) => `Ngày ${l}`} />
                <Bar dataKey="revenue" fill="#8c4516" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Quick stats table */}
          <div className="grid grid-cols-2 gap-6">
            <div className="card p-5">
              <h2 className="font-display text-lg text-coffee-900 mb-3">Thống kê tháng này</h2>
              <div className="space-y-3">
                {[
                  { label: 'Tổng đơn', value: month?.totalOrders },
                  { label: 'Đơn hoàn thành', value: month?.completedOrders },
                  { label: 'Đơn hủy', value: month?.cancelledOrders },
                  { label: 'Doanh thu', value: Number(month?.revenue || 0).toLocaleString('vi-VN') + 'đ' },
                ].map((s, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-cream-100 last:border-0">
                    <span className="text-coffee-600 text-sm">{s.label}</span>
                    <span className="font-bold text-coffee-900">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-5">
              <h2 className="font-display text-lg text-coffee-900 mb-3">Top món tháng này</h2>
              <div className="space-y-2">
                {month?.topItems?.slice(0, 6).map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-coffee-100 flex items-center justify-center text-xs font-bold text-coffee-700">
                      {i + 1}
                    </span>
                    <span className="flex-1 text-sm text-coffee-700 truncate">{item.tenMon}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 bg-coffee-400 rounded-full" style={{ width: `${Math.min(100, (item._sum?.soLuong / (month.topItems[0]?._sum?.soLuong || 1)) * 80)}px` }} />
                      <span className="text-xs font-bold text-coffee-700 w-8 text-right">{item._sum?.soLuong}</span>
                    </div>
                  </div>
                ))}
                {(!month?.topItems || month.topItems.length === 0) && (
                  <p className="text-coffee-400 text-sm text-center py-4">Chưa có dữ liệu</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple line chart with area fill
function AreaChartFallback({ data }) {
  return (
    <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#f0dfc0" vertical={false} />
      <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#8c4516' }} tickFormatter={(d) => d.slice(5)} />
      <YAxis tick={{ fontSize: 11, fill: '#8c4516' }} tickFormatter={formatVND} width={50} />
      <Tooltip formatter={(v) => [Number(v).toLocaleString('vi-VN') + 'đ', 'Doanh thu']}
        labelFormatter={(l) => `Ngày ${l}`} />
      <Line type="monotone" dataKey="revenue" stroke="#8c4516" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
    </LineChart>
  );
}
