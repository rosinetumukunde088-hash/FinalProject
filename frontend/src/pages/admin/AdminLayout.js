import { Link, useLocation, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { FiGrid, FiUsers, FiPackage, FiFileText, FiArrowLeft } from 'react-icons/fi';

export default function AdminLayout() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();

  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  const links = [
    { to: '/admin', icon: <FiGrid />, label: t('admin.dashboard'), exact: true },
    { to: '/admin/users', icon: <FiUsers />, label: t('admin.users') },
    { to: '/admin/products', icon: <FiPackage />, label: t('admin.products') },
    { to: '/admin/logs', icon: <FiFileText />, label: t('admin.logs') },
  ];

  const isActive = (link) =>
    link.exact ? location.pathname === link.to : location.pathname.startsWith(link.to);

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:block">
        <div className="p-6">
          <h2 className="text-lg font-bold text-gray-900">{t('admin.panel')}</h2>
          <p className="text-xs text-gray-500 mt-1">{t('admin.panelDesc')}</p>
        </div>
        <nav className="px-3 space-y-1">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive(link)
                  ? 'bg-purple-50 text-purple-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className="text-lg">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-3 mt-4 border-t border-gray-200">
          <Link
            to="/"
            className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition"
          >
            <FiArrowLeft />
            <span>{t('admin.backToStore')}</span>
          </Link>
        </div>
      </aside>

      <div className="flex-1 p-6 md:p-8 bg-gray-50 overflow-auto">
        <div className="md:hidden mb-6 flex space-x-2 overflow-x-auto pb-2">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                isActive(link)
                  ? 'bg-purple-50 text-purple-700'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </div>
        <Outlet />
      </div>
    </div>
  );
}
