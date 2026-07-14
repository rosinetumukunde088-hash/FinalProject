import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { FiSearch, FiShield, FiMail, FiPhone, FiClock, FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';

export default function AdminUsers() {
  const { API } = useAuth();
  const { t } = useLanguage();
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetail, setUserDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchUsers = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const params = { page, limit: 10 };
        if (search) params.search = search;
        if (roleFilter) params.role = roleFilter;
        if (categoryFilter) params.category = categoryFilter;
        const { data } = await API.get('/admin/users', { params });
        setUsers(data.users);
        setPagination(data.pagination);
      } catch (err) {
        console.error('Failed to fetch users', err);
      } finally {
        setLoading(false);
      }
    },
    [API, search, roleFilter, categoryFilter]
  );

  useEffect(() => {
    fetchUsers(1);
  }, [fetchUsers]);

  const fetchUserDetail = async (userId) => {
    setDetailLoading(true);
    try {
      const { data } = await API.get(`/admin/users/${userId}`);
      setUserDetail(data);
      setSelectedUser(userId);
    } catch (err) {
      console.error('Failed to fetch user detail', err);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await API.put(`/admin/users/${userId}/role`, { role: newRole });
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
      if (userDetail?.id === userId) {
        setUserDetail((prev) => ({ ...prev, role: newRole }));
      }
    } catch (err) {
      console.error('Failed to update role', err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(1);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('admin.userManagement')}</h1>
        <p className="text-gray-500 mt-1">{t('admin.userManagementDesc')}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="p-4 border-b border-gray-100">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={t('admin.searchUsers')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">{t('admin.allRoles')}</option>
              <option value="ADMIN">{t('auth.admin')}</option>
              <option value="USER">{t('auth.user')}</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">{t('admin.allCategories')}</option>
              <option value="BEGINNER">{t('admin.beginner')}</option>
              <option value="INTERMEDIATE">{t('admin.intermediate')}</option>
              <option value="ADVANCED">{t('admin.advanced')}</option>
            </select>
          </form>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="py-12 text-center text-gray-500">{t('admin.noUsers')}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-4 py-3 font-medium text-gray-500">{t('admin.name')}</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">{t('profile.email')}</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">{t('admin.role')}</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">{t('admin.category')}</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">{t('admin.events')}</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">{t('admin.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{u.name}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        u.category === 'BEGINNER' ? 'bg-amber-100 text-amber-700' :
                        u.category === 'INTERMEDIATE' ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {u.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{u._count?.behaviors ?? 0}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => fetchUserDetail(u.id)}
                          className="text-purple-600 hover:text-purple-700 text-xs font-medium"
                        >
                          {t('admin.viewDetail')}
                        </button>
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          className="text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-purple-500"
                        >
                          <option value="USER">USER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
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
              {t('admin.showing')} {users.length} {t('admin.of')} {pagination.total}
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => fetchUsers(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-50"
              >
                <FiChevronLeft />
              </button>
              <span className="text-sm text-gray-600">
                {pagination.page} / {pagination.pages}
              </span>
              <button
                onClick={() => fetchUsers(pagination.page + 1)}
                disabled={pagination.page >= pagination.pages}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-50"
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">{t('admin.userDetail')}</h2>
              <button onClick={() => { setSelectedUser(null); setUserDetail(null); }} className="p-2 hover:bg-gray-100 rounded-lg">
                <FiX />
              </button>
            </div>
            {detailLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            ) : userDetail ? (
              <div className="p-6 space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                    <FiShield className="text-2xl text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{userDetail.name}</h3>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                      userDetail.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {userDetail.role}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                    <FiMail className="text-gray-400" />
                    <span className="text-sm text-gray-600">{userDetail.email}</span>
                  </div>
                  {userDetail.phone && (
                    <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                      <FiPhone className="text-gray-400" />
                      <span className="text-sm text-gray-600">{userDetail.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                    <FiClock className="text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {new Date(userDetail.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {userDetail.recentBehaviors?.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{t('admin.recentBehavior')}</h4>
                    <div className="bg-gray-50 rounded-lg p-4 max-h-48 overflow-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left pb-2">{t('admin.page')}</th>
                            <th className="text-left pb-2">{t('admin.clickLatency')}</th>
                            <th className="text-left pb-2">{t('admin.wrongClicks')}</th>
                            <th className="text-left pb-2">{t('admin.timeSpent')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {userDetail.recentBehaviors.slice(0, 5).map((b) => (
                            <tr key={b.id} className="border-b border-gray-100">
                              <td className="py-2">{b.page || '-'}</td>
                              <td className="py-2">{b.clickLatency}ms</td>
                              <td className="py-2">{b.wrongClicks}</td>
                              <td className="py-2">{b.timeSpent}s</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {userDetail.predictions?.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{t('admin.aiPredictions')}</h4>
                    <div className="space-y-2">
                      {userDetail.predictions.slice(0, 5).map((p) => (
                        <div key={p.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-sm">
                          <span className="capitalize">{p.predictedCategory?.toLowerCase()}</span>
                          <span className="text-gray-500">{Math.round((p.confidence || 0) * 100)}% {t('admin.confidence')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
