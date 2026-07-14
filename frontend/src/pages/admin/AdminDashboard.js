import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { FiUsers, FiPackage, FiActivity, FiBrain, FiBarChart2, FiClock } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { API } = useAuth();
  const { t } = useLanguage();
  const [stats, setStats] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
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
    };
    fetchStats();
  }, [API]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const statCards = [
    { label: t('admin.totalUsers'), value: stats?.totalUsers ?? 0, icon: <FiUsers />, color: 'bg-blue-500', link: '/admin/users' },
    { label: t('admin.totalProducts'), value: stats?.totalProducts ?? 0, icon: <FiPackage />, color: 'bg-emerald-500', link: '/admin/products' },
    { label: t('admin.totalEvents'), value: stats?.totalBehaviorEvents ?? 0, icon: <FiActivity />, color: 'bg-amber-500' },
    { label: t('admin.totalPredictions'), value: stats?.totalPredictions ?? 0, icon: <FiBrain />, color: 'bg-purple-500' },
  ];

  const userStats = dashboard?.userStats;
  const behaviorStats = dashboard?.behaviorStats;
  const productStats = dashboard?.productStats;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{t('admin.dashboard')}</h1>
        <p className="text-gray-500 mt-1">{t('admin.dashboardDesc')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
              </div>
              <div className={`${card.color} p-3 rounded-xl text-white text-xl`}>
                {card.icon}
              </div>
            </div>
            {card.link && (
              <Link to={card.link} className="text-sm text-purple-600 hover:text-purple-700 mt-3 inline-block">
                {t('admin.viewDetails')} &rarr;
              </Link>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <FiUsers className="text-blue-500" />
            <span>{t('admin.userBreakdown')}</span>
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
            <p className="text-gray-500 text-sm">{t('admin.noData')}</p>
          )}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              {t('admin.recentRegistrations')}: <span className="font-semibold text-gray-900">{userStats?.recentRegistrations ?? 0}</span> {t('admin.last7Days')}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <FiPackage className="text-emerald-500" />
            <span>{t('admin.productBreakdown')}</span>
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
            <p className="text-gray-500 text-sm">{t('admin.noData')}</p>
          )}
          {productStats?.priceRange && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                {t('admin.priceRange')}: ${productStats.priceRange.min} - ${productStats.priceRange.max}
              </p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <FiActivity className="text-amber-500" />
            <span>{t('admin.behaviorMetrics')}</span>
          </h3>
          {behaviorStats?.avgMetrics ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">{t('admin.avgClickLatency')}</p>
                <p className="text-lg font-bold text-gray-900">{behaviorStats.avgMetrics.avgClickLatency}ms</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">{t('admin.avgWrongClicks')}</p>
                <p className="text-lg font-bold text-gray-900">{behaviorStats.avgMetrics.avgWrongClicks}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">{t('admin.avgTimeSpent')}</p>
                <p className="text-lg font-bold text-gray-900">{behaviorStats.avgMetrics.avgTimeSpent}s</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">{t('admin.totalEvents')}</p>
                <p className="text-lg font-bold text-gray-900">{behaviorStats.totalEvents}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">{t('admin.noData')}</p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <FiBarChart2 className="text-purple-500" />
            <span>{t('admin.dailyActivity')}</span>
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
            <p className="text-gray-500 text-sm">{t('admin.noData')}</p>
          )}
        </div>
      </div>
    </div>
  );
}
