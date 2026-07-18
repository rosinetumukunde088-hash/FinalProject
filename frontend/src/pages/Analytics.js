import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiDollarSign, FiShoppingBag, FiUsers, FiPackage } from 'react-icons/fi';
import BarChart from '../components/charts/BarChart';
import LineChart from '../components/charts/LineChart';

const DAY_OPTIONS = [
  { value: 7, label: 'Last 7 days' },
  { value: 30, label: 'Last 30 days' },
  { value: 90, label: 'Last 90 days' },
];

function formatShortDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function Analytics() {
  const { API } = useAuth();
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);
  const [sales, setSales] = useState(null);
  const [behavior, setBehavior] = useState(null);
  const [users, setUsers] = useState(null);
  const [products, setProducts] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [salesRes, behaviorRes, usersRes, productsRes] = await Promise.all([
        API.get('/reports/sales', { params: { days } }),
        API.get('/reports/behavior', { params: { days } }),
        API.get('/reports/users'),
        API.get('/reports/products'),
      ]);
      setSales(salesRes.data);
      setBehavior(behaviorRes.data);
      setUsers(usersRes.data);
      setProducts(productsRes.data);
    } catch (err) {
      console.error('Failed to load analytics', err);
    } finally {
      setLoading(false);
    }
  }, [API, days]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  if (loading && !sales) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const usersByCategoryData = (users?.usersByCategory || []).map((u) => ({
    label: u.category.charAt(0) + u.category.slice(1).toLowerCase(),
    value: u.count,
  }));
  const productsByCategoryData = (products?.productsByCategory || []).map((p) => ({
    label: p.category,
    value: p.count,
  }));
  const paymentMethodData = (sales?.byPaymentMethod || []).map((p) => ({
    label: p.method,
    value: p.count,
  }));
  const topProductsData = (sales?.topProducts || []).slice(0, 6).map((p) => ({
    label: p.name,
    value: p.quantity,
  }));
  const salesTrendData = (sales?.dailyTrend || []).map((d) => ({ label: d.date, value: d.total }));
  const behaviorTrendData = (behavior?.dailyTrend || []).map((d) => ({ label: d.date, value: d.count }));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500 mt-1">Sales, engagement, and catalog insights</p>
        </div>
        <div className="admin-select-wrap">
          <select value={days} onChange={(e) => setDays(Number(e.target.value))} className="admin-select">
            {DAY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
            <FiDollarSign size={18} />
          </div>
          <p className="text-2xl font-bold text-gray-900">{(sales?.totalRevenue ?? 0).toLocaleString()} RWF</p>
          <p className="text-sm text-gray-500">Revenue ({days}d)</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
            <FiShoppingBag size={18} />
          </div>
          <p className="text-2xl font-bold text-gray-900">{sales?.totalOrders ?? 0}</p>
          <p className="text-sm text-gray-500">Orders ({days}d)</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-3">
            <FiUsers size={18} />
          </div>
          <p className="text-2xl font-bold text-gray-900">{users?.totalUsers ?? 0}</p>
          <p className="text-sm text-gray-500">Total Users</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center mb-3">
            <FiPackage size={18} />
          </div>
          <p className="text-2xl font-bold text-gray-900">{products?.totalProducts ?? 0}</p>
          <p className="text-sm text-gray-500">Total Products</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Sales Trend</h3>
          <LineChart
            data={salesTrendData}
            valueFormatter={(v) => `${v.toLocaleString()} RWF`}
            labelFormatter={formatShortDate}
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Site Activity</h3>
          <LineChart data={behaviorTrendData} labelFormatter={formatShortDate} />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Users by Category</h3>
          <BarChart data={usersByCategoryData} />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Products by Category</h3>
          <BarChart data={productsByCategoryData} />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Orders by Payment Method</h3>
          <BarChart data={paymentMethodData} />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Top Selling Products</h3>
          <BarChart data={topProductsData} valueFormatter={(v) => `${v} sold`} />
        </div>
      </div>
    </div>
  );
}
