import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiPackage, FiAlertTriangle, FiClipboard, FiDollarSign, FiArrowRight } from 'react-icons/fi';

export default function TraderDashboard() {
  const { API, user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          API.get('/products/mine', { params: { limit: 100 } }),
          API.get('/orders/store', { params: { limit: 100 } }),
        ]);

        const products = productsRes.data.products || [];
        const productIds = new Set(products.map((p) => p.id));
        const orders = ordersRes.data.orders || [];

        const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
        const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
        const outOfStockCount = products.filter((p) => p.stock <= 0).length;

        const revenue = orders.reduce((sum, order) => {
          const ownItemsTotal = order.items
            .filter((item) => productIds.has(item.productId))
            .reduce((s, item) => s + item.price * item.quantity, 0);
          return sum + ownItemsTotal;
        }, 0);

        setStats({
          totalProducts: productsRes.data.pagination?.total ?? products.length,
          totalStock,
          lowStockCount,
          outOfStockCount,
          totalOrders: ordersRes.data.pagination?.total ?? orders.length,
          revenue,
        });
        setRecentOrders(orders.slice(0, 5));
      } catch (err) {
        console.error('Failed to load trader overview', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, [API]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name?.split(' ')[0]}</h1>
        <p className="text-gray-500 mt-1">Here's an overview of your store</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
            <FiPackage size={18} />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
          <p className="text-sm text-gray-500">My Products</p>
          <Link to="/trader/products" className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center mt-2">
            Manage <FiArrowRight size={12} className="ml-1" />
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center mb-3">
            <FiAlertTriangle size={18} />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.lowStockCount + stats.outOfStockCount}</p>
          <p className="text-sm text-gray-500">Low / Out of Stock</p>
          <p className="text-xs text-gray-400 mt-2">{stats.totalStock} units total in stock</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
            <FiClipboard size={18} />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
          <p className="text-sm text-gray-500">Orders with My Products</p>
          <Link to="/trader/orders" className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center mt-2">
            View Orders <FiArrowRight size={12} className="ml-1" />
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-3">
            <FiDollarSign size={18} />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.revenue.toLocaleString()} RWF</p>
          <p className="text-sm text-gray-500">Revenue (my items)</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Recent Orders</h2>
          <Link to="/trader/orders" className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="py-12 text-center text-gray-500 text-sm">No orders yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Customer</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Date</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Total</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50">
                    <td className="px-6 py-3 text-gray-900">{order.user?.name}</td>
                    <td className="px-6 py-3 text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-3 text-gray-900">{order.total.toLocaleString()} RWF</td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
