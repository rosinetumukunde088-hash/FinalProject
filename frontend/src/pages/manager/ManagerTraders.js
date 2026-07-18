import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiSearch, FiShield, FiMail, FiPhone, FiClock, FiChevronLeft, FiChevronRight, FiX, FiChevronDown, FiUserCheck, FiUserX } from 'react-icons/fi';

export default function ManagerTraders() {
  const { API } = useAuth();
  const [traders, setTraders] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedTrader, setSelectedTrader] = useState(null);
  const [traderDetail, setTraderDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchTraders = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const params = { page, limit: 10 };
        if (search) params.search = search;
        if (statusFilter) params.isActive = statusFilter;
        const { data } = await API.get('/admin/users', { params });
        setTraders(data.users);
        setPagination(data.pagination);
      } catch (err) {
        console.error('Failed to fetch traders', err);
      } finally {
        setLoading(false);
      }
    },
    [API, search, statusFilter]
  );

  useEffect(() => {
    fetchTraders(1);
  }, [fetchTraders]);

  const fetchTraderDetail = async (traderId) => {
    setDetailLoading(true);
    try {
      const { data } = await API.get(`/admin/users/${traderId}`);
      setTraderDetail(data);
      setSelectedTrader(traderId);
    } catch (err) {
      console.error('Failed to fetch trader detail', err);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleStatusToggle = async (traderId, currentIsActive) => {
    try {
      await API.put(`/admin/users/${traderId}/status`, { isActive: !currentIsActive });
      setTraders((prev) => prev.map((t) => (t.id === traderId ? { ...t, isActive: !currentIsActive } : t)));
      if (traderDetail?.id === traderId) {
        setTraderDetail((prev) => ({ ...prev, isActive: !currentIsActive }));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update account status');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTraders(1);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Traders</h1>
        <p className="text-gray-500 mt-1">Review, approve, and manage trader accounts</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="p-4 border-b border-gray-100">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 admin-input-icon-wrap">
              <span className="admin-input-icon"><FiSearch size={16} /></span>
              <input
                type="text"
                placeholder="Search traders by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="admin-input"
              />
            </div>
            <div className="admin-select-wrap">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="admin-select"
              >
                <option value="">All Statuses</option>
                <option value="true">Active</option>
                <option value="false">Inactive / Pending</option>
              </select>
              <span className="admin-select-arrow"><FiChevronDown size={14} /></span>
            </div>
          </form>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
        ) : traders.length === 0 ? (
          <div className="py-12 text-center text-gray-500">No traders found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Joined</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {traders.map((t) => (
                  <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{t.name}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{t.email}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        t.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {t.isActive ? 'Active' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{new Date(t.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleStatusToggle(t.id, t.isActive)}
                          className={`admin-icon-btn ${t.isActive ? 'danger' : 'edit'}`}
                          title={t.isActive ? 'Deactivate account' : 'Activate account'}
                        >
                          {t.isActive ? <FiUserX size={16} /> : <FiUserCheck size={16} />}
                        </button>
                        <button
                          onClick={() => fetchTraderDetail(t.id)}
                          className="text-emerald-600 hover:text-emerald-700 text-xs font-medium"
                        >
                          View Detail
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pagination.pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Showing {traders.length} of {pagination.total}
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => fetchTraders(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-50"
              >
                <FiChevronLeft />
              </button>
              <span className="text-sm text-gray-600">
                {pagination.page} / {pagination.pages}
              </span>
              <button
                onClick={() => fetchTraders(pagination.page + 1)}
                disabled={pagination.page >= pagination.pages}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-50"
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedTrader && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-card wide">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Trader Detail</h2>
              <button onClick={() => { setSelectedTrader(null); setTraderDetail(null); }} className="p-2 hover:bg-gray-100 rounded-lg">
                <FiX />
              </button>
            </div>
            {detailLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              </div>
            ) : traderDetail ? (
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                      <FiShield className="text-2xl text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{traderDetail.name}</h3>
                      <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-semibold ${
                        traderDetail.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {traderDetail.isActive ? 'Active' : 'Pending'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleStatusToggle(traderDetail.id, traderDetail.isActive)}
                    className={`admin-btn ${traderDetail.isActive ? 'admin-btn-outline' : 'admin-btn-primary'}`}
                  >
                    {traderDetail.isActive ? <FiUserX size={16} /> : <FiUserCheck size={16} />}
                    <span>{traderDetail.isActive ? 'Deactivate' : 'Activate'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                    <FiMail className="text-gray-400" />
                    <span className="text-sm text-gray-600">{traderDetail.email}</span>
                  </div>
                  {traderDetail.phone && (
                    <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                      <FiPhone className="text-gray-400" />
                      <span className="text-sm text-gray-600">{traderDetail.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                    <FiClock className="text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Joined {new Date(traderDetail.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
