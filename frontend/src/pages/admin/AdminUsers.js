import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiSearch, FiShield, FiMail, FiPhone, FiClock, FiChevronLeft, FiChevronRight, FiX, FiChevronDown, FiPlus, FiUserCheck, FiUserX } from 'react-icons/fi';

const emptyNewUser = { name: '', email: '', password: '', phone: '', role: 'USER' };

const ROLE_BADGE_CLASS = {
  ADMIN: 'bg-purple-100 text-purple-700',
  TRADER: 'bg-blue-100 text-blue-700',
  MANAGER: 'bg-gray-100 text-gray-700',
  USER: 'bg-emerald-100 text-emerald-700',
};

export default function AdminUsers() {
  const { API } = useAuth();
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetail, setUserDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState(emptyNewUser);
  const [addError, setAddError] = useState('');
  const [adding, setAdding] = useState(false);

  const fetchUsers = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const params = { page, limit: 10 };
        if (search) params.search = search;
        if (roleFilter) params.role = roleFilter;
        if (categoryFilter) params.category = categoryFilter;
        if (statusFilter) params.isActive = statusFilter;
        const { data } = await API.get('/admin/users', { params });
        setUsers(data.users);
        setPagination(data.pagination);
      } catch (err) {
        console.error('Failed to fetch users', err);
      } finally {
        setLoading(false);
      }
    },
    [API, search, roleFilter, categoryFilter, statusFilter]
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

  const handleStatusToggle = async (userId, currentIsActive) => {
    try {
      await API.put(`/admin/users/${userId}/status`, { isActive: !currentIsActive });
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, isActive: !currentIsActive } : u)));
      if (userDetail?.id === userId) {
        setUserDetail((prev) => ({ ...prev, isActive: !currentIsActive }));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update account status');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(1);
  };

  const openAddUser = () => {
    setNewUser(emptyNewUser);
    setAddError('');
    setShowAddModal(true);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setAdding(true);
    setAddError('');
    try {
      await API.post('/admin/users', newUser);
      setShowAddModal(false);
      fetchUsers(1);
    } catch (err) {
      setAddError(err.response?.data?.message || 'Failed to create user');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500 mt-1">View and manage all registered users</p>
        </div>
        <button onClick={openAddUser} className="admin-btn admin-btn-primary">
          <FiPlus />
          <span>Add User</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="p-4 border-b border-gray-100">
          <form onSubmit={handleSearch} className="flex flex sm:flex-row gap-3">
            <div className="flex-1 admin-input-icon-wrap">
              <span className="admin-input-icon"><FiSearch size={16} /></span>
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="admin-input"
              />
            </div>
            <div className="admin-select-wrap">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="admin-select"
              >
                <option value="">All Roles</option>
                <option value="ADMIN">Admin</option>
                <option value="MANAGER">Manager</option>
                <option value="TRADER">Trader</option>
                <option value="USER">User</option>
              </select>
              <span className="admin-select-arrow"><FiChevronDown size={14} /></span>
            </div>
            <div className="admin-select-wrap">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="admin-select"
              >
                <option value="">All Categories</option>
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>
              <span className="admin-select-arrow"><FiChevronDown size={14} /></span>
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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="py-12 text-center text-gray-500">No users found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Role</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Category</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Events</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Actions</th>
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
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${ROLE_BADGE_CLASS[u.role] || ROLE_BADGE_CLASS.USER}`}>
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
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        u.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {u.isActive ? 'Active' : (u.role === 'TRADER' ? 'Pending' : 'Inactive')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{u._count?.behaviors ?? 0}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleStatusToggle(u.id, u.isActive)}
                          className={`admin-icon-btn ${u.isActive ? 'danger' : 'edit'}`}
                          title={u.isActive ? 'Deactivate account' : 'Activate account'}
                        >
                          {u.isActive ? <FiUserX size={16} /> : <FiUserCheck size={16} />}
                        </button>
                        <button
                          onClick={() => fetchUserDetail(u.id)}
                          className="text-purple-600 hover:text-purple-700 text-xs font-medium"
                        >
                          View Detail
                        </button>
                        <div className="admin-select-wrap">
                          <select
                            value={u.role}
                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                            className="admin-select"
                            style={{ padding: '0.35rem 1.75rem 0.35rem 0.6rem', fontSize: '0.75rem' }}
                          >
                            <option value="USER">USER</option>
                            <option value="TRADER">TRADER</option>
                            <option value="MANAGER">MANAGER</option>
                            <option value="ADMIN">ADMIN</option>
                          </select>
                          <span className="admin-select-arrow"><FiChevronDown size={12} /></span>
                        </div>
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
              Showing {users.length} of {pagination.total}
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
        <div className="admin-modal-overlay">
          <div className="admin-modal-card wide">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">User Detail</h2>
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                      <FiShield className="text-2xl text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{userDetail.name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${ROLE_BADGE_CLASS[userDetail.role] || ROLE_BADGE_CLASS.USER}`}>
                          {userDetail.role}
                        </span>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                          userDetail.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {userDetail.isActive ? 'Active' : (userDetail.role === 'TRADER' ? 'Pending' : 'Inactive')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleStatusToggle(userDetail.id, userDetail.isActive)}
                    className={`admin-btn ${userDetail.isActive ? 'admin-btn-outline' : 'admin-btn-primary'}`}
                  >
                    {userDetail.isActive ? <FiUserX size={16} /> : <FiUserCheck size={16} />}
                    <span>{userDetail.isActive ? 'Deactivate' : 'Activate'}</span>
                  </button>
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
                    <h4 className="font-semibold text-gray-900 mb-2">Recent Behavior</h4>
                    <div className="bg-gray-50 rounded-lg p-4 max-h-48 overflow-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left pb-2">Page</th>
                            <th className="text-left pb-2">Click Latency</th>
                            <th className="text-left pb-2">Wrong Clicks</th>
                            <th className="text-left pb-2">Time Spent</th>
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
                    <h4 className="font-semibold text-gray-900 mb-2">AI Predictions</h4>
                    <div className="space-y-2">
                      {userDetail.predictions.slice(0, 5).map((p) => (
                        <div key={p.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-sm">
                          <span className="capitalize">{p.predictedCategory?.toLowerCase()}</span>
                          <span className="text-gray-500">{Math.round((p.confidence || 0) * 100)}% confidence</span>
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

      {showAddModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-card">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Add User</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <FiX />
              </button>
            </div>
            <form onSubmit={handleAddUser} className="p-6 space-y-4">
              {addError && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{addError}</div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="admin-input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="admin-input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="admin-input"
                  placeholder="Min 6 characters"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone (optional)</label>
                <input
                  type="tel"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  className="admin-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <div className="admin-select-wrap w-full">
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="admin-select"
                  >
                    <option value="USER">User</option>
                    <option value="TRADER">Trader</option>
                    <option value="MANAGER">Manager</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                  <span className="admin-select-arrow"><FiChevronDown size={14} /></span>
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="admin-btn admin-btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adding}
                  className="admin-btn admin-btn-primary"
                >
                  {adding ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
