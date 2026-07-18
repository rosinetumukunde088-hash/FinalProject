import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiUsers, FiPackage, FiTag, FiCpu, FiActivity, FiBarChart2, FiArrowRight, FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const AVATAR_COLORS = ['c1', 'c2', 'c3', 'c4'];

export default function AdminDashboard() {
  const { API } = useAuth();
  const [stats, setStats] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [categoryCount, setCategoryCount] = useState(0);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [productSearch, setProductSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchRecentProducts = useCallback(
    async (search = '') => {
      try {
        const { data } = await API.get('/products', { params: { page: 1, limit: 5, search: search || undefined } });
        setRecentProducts(data.products || []);
      } catch (err) {
        console.error('Failed to load recent products', err);
      }
    },
    [API]
  );

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [settingsRes, dashboardRes] = await Promise.all([
          API.get('/admin/settings'),
          API.get('/reports/dashboard'),
        ]);
        setStats(settingsRes.data);
        setDashboard(dashboardRes.data);
      } catch (err) {
        console.error('Failed to load admin stats', err);
      } finally {
        setLoading(false);
      }

      try {
        const { data } = await API.get('/categories');
        setCategoryCount(Array.isArray(data) ? data.length : 0);
      } catch (err) {
        setCategoryCount(0);
      }

      try {
        const { data } = await API.get('/admin/users', { params: { page: 1, limit: 4 } });
        setRecentUsers(data.users || []);
      } catch (err) {
        console.error('Failed to load recent users', err);
      }

      fetchRecentProducts();
    };
    fetchAll();
  }, [API, fetchRecentProducts]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const userStats = dashboard?.userStats;
  const behaviorStats = dashboard?.behaviorStats;
  const productStats = dashboard?.productStats;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Overview of your platform statistics</p>
        </div>
      </div>

      <div className="admin-stat-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-card-top">
            <div className="admin-stat-card-icon" style={{ backgroundColor: '#6366f1' }}><FiUsers /></div>
          </div>
          <p className="admin-stat-card-value">{stats?.totalUsers ?? 0}</p>
          <p className="admin-stat-card-label">Total Users</p>
          <Link to="/admin/users" className="admin-stat-card-link">View Details <FiArrowRight size={13} /></Link>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-card-top">
            <div className="admin-stat-card-icon" style={{ backgroundColor: '#059669' }}><FiPackage /></div>
          </div>
          <p className="admin-stat-card-value">{stats?.totalProducts ?? 0}</p>
          <p className="admin-stat-card-label">Total Products</p>
          <Link to="/admin/products" className="admin-stat-card-link">View Details <FiArrowRight size={13} /></Link>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-card-top">
            <div className="admin-stat-card-icon" style={{ backgroundColor: '#f59e0b' }}><FiTag /></div>
          </div>
          <p className="admin-stat-card-value">{categoryCount}</p>
          <p className="admin-stat-card-label">Categories</p>
          <Link to="/admin/categories" className="admin-stat-card-link">View Details <FiArrowRight size={13} /></Link>
        </div>

        <div className="admin-stat-card highlight">
          <div className="admin-stat-card-top">
            <div className="admin-stat-card-icon" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}><FiCpu /></div>
          </div>
          <p className="admin-stat-card-value">{stats?.totalPredictions ?? 0}</p>
          <p className="admin-stat-card-label">AI Predictions</p>
          <Link to="/admin/logs" className="admin-stat-card-cta">View Activity</Link>
        </div>
      </div>

      <h2 className="admin-section-title">Recent Users</h2>
      <div className="admin-recent-grid">
        {recentUsers.length > 0 ? (
          recentUsers.map((u, i) => (
            <div key={u.id} className="admin-recent-card">
              <div className={`admin-recent-avatar ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                {(u.name || '?').trim().charAt(0).toUpperCase()}
              </div>
              <div className="admin-recent-info">
                <p className="admin-recent-name">{u.name}</p>
                <p className="admin-recent-meta">Joined {new Date(u.createdAt).toLocaleDateString()}</p>
              </div>
              <span className={`admin-recent-badge ${u.role === 'ADMIN' ? 'admin' : 'user'}`}>{u.role}</span>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No data available</p>
        )}
      </div>

      <div className="admin-table-card">
        <div className="admin-table-head">
          <h2 className="admin-table-title">Recent Products</h2>
          <div className="admin-input-icon-wrap w-full md:w-64">
            <span className="admin-input-icon"><FiSearch size={16} /></span>
            <input
              type="text"
              placeholder="Search products..."
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchRecentProducts(productSearch)}
              className="admin-input"
            />
          </div>
        </div>
        {recentProducts.length === 0 ? (
          <div className="py-10 text-center text-gray-500 text-sm">No products found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Product</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Category</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Price</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Stock</th>
                </tr>
              </thead>
              <tbody>
                {recentProducts.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">{p.category}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-900">{p.price.toLocaleString()} RWF</td>
                    <td className="px-4 py-3">
                      <span className={`font-medium ${p.stock > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {p.stock > 0 ? p.stock : 'Out of stock'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <h2 className="admin-section-title">Detailed Analytics</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <FiUsers className="text-blue-500" />
            <span>Users by Category</span>
          </h3>
          {userStats?.usersByCategory?.length > 0 ? (
            <div className="space-y-3">
              {userStats.usersByCategory.map((item) => (
                <div key={item.category} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 capitalize">{item.category.toLowerCase()}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: `${(item.count / userStats.totalUsers) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8 text-right">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No data available</p>
          )}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Recent registrations: <span className="font-semibold text-gray-900">{userStats?.recentRegistrations ?? 0}</span> in last 7 days
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <FiPackage className="text-emerald-500" />
            <span>Products by Category</span>
          </h3>
          {productStats?.productsByCategory?.length > 0 ? (
            <div className="space-y-3">
              {productStats.productsByCategory.map((item) => (
                <div key={item.category} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{item.category}</span>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs text-gray-400">Avg ${item.avgPrice}</span>
                    <span className="text-sm font-medium text-gray-900 w-8 text-right">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No data available</p>
          )}
          {productStats?.priceRange && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Price range: ${productStats.priceRange.min} - ${productStats.priceRange.max}
              </p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <FiActivity className="text-amber-500" />
            <span>Behavior Metrics (7 days)</span>
          </h3>
          {behaviorStats?.avgMetrics ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Avg Click Latency</p>
                <p className="text-lg font-bold text-gray-900">{behaviorStats.avgMetrics.avgClickLatency}ms</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Avg Wrong Clicks</p>
                <p className="text-lg font-bold text-gray-900">{behaviorStats.avgMetrics.avgWrongClicks}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Avg Time Spent</p>
                <p className="text-lg font-bold text-gray-900">{behaviorStats.avgMetrics.avgTimeSpent}s</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Behavior Events</p>
                <p className="text-lg font-bold text-gray-900">{behaviorStats.totalEvents}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No data available</p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <FiBarChart2 className="text-purple-500" />
            <span>Daily Activity (7 days)</span>
          </h3>
          {behaviorStats?.dailyTrend?.length > 0 ? (
            <div className="space-y-2">
              {behaviorStats.dailyTrend.slice(-7).map((day) => (
                <div key={day.date} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{day.date}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-amber-400 h-2 rounded-full"
                        style={{
                          width: `${(day.count / Math.max(...behaviorStats.dailyTrend.map((d) => d.count))) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8 text-right">{day.count}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No data available</p>
          )}
        </div>
      </div>
    </div>
  );
}
