import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { FiFileText, FiChevronLeft, FiChevronRight, FiFilter } from 'react-icons/fi';

export default function AdminLogs() {
  const { API } = useAuth();
  const { t } = useLanguage();
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [actionFilter, setActionFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchLogs = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const params = { page, limit: 20 };
        if (actionFilter) params.action = actionFilter;
        const { data } = await API.get('/admin/logs', { params });
        setLogs(data.logs);
        setPagination(data.pagination);
      } catch (err) {
        console.error('Failed to fetch logs', err);
      } finally {
        setLoading(false);
      }
    },
    [API, actionFilter]
  );

  useEffect(() => {
    fetchLogs(1);
  }, [fetchLogs]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('admin.auditLogs')}</h1>
        <p className="text-gray-500 mt-1">{t('admin.auditLogsDesc')}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <FiFilter className="text-gray-400" />
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">{t('admin.allActions')}</option>
              <option value="UPDATE_ROLE">UPDATE_ROLE</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        ) : logs.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            <FiFileText className="mx-auto text-4xl text-gray-300 mb-3" />
            {t('admin.noLogs')}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-4 py-3 font-medium text-gray-500">{t('admin.timestamp')}</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">{t('admin.adminUser')}</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">{t('admin.action')}</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">{t('admin.target')}</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">{t('admin.details')}</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                        {log.adminId?.slice(0, 8)}...
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                        {log.targetId?.slice(0, 8)}...
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pagination.pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Page {pagination.page} of {pagination.pages} ({pagination.total} {t('admin.totalEntries')})
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => fetchLogs(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-50"
              >
                <FiChevronLeft />
              </button>
              <span className="text-sm text-gray-600">
                {pagination.page} / {pagination.pages}
              </span>
              <button
                onClick={() => fetchLogs(pagination.page + 1)}
                disabled={pagination.page >= pagination.pages}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-50"
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
