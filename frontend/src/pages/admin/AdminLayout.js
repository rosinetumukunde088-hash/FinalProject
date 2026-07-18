import { Link, useLocation, Outlet, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiGrid, FiUsers, FiPackage, FiTag, FiFileText, FiArrowLeft, FiLogOut, FiBox, FiSettings, FiBarChart2, FiClipboard, FiPieChart } from 'react-icons/fi';
import AdminTopbar from './AdminTopbar';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  const mainLinks = [
    { to: '/admin', icon: <FiGrid />, label: 'Dashboard', exact: true },
    { to: '/admin/analytics', icon: <FiBarChart2 />, label: 'Analytics' },
    { to: '/admin/users', icon: <FiUsers />, label: 'Users' },
    { to: '/admin/products', icon: <FiPackage />, label: 'Products' },
    { to: '/admin/orders', icon: <FiClipboard />, label: 'Orders' },
    { to: '/admin/categories', icon: <FiTag />, label: 'Categories' },
    { to: '/admin/reports', icon: <FiPieChart />, label: 'Reports' },
  ];
  const otherLinks = [
    { to: '/admin/logs', icon: <FiFileText />, label: 'Audit Logs' },
    { to: '/admin/settings', icon: <FiSettings />, label: 'Settings' },
  ];
  const allLinks = [...mainLinks, ...otherLinks];

  const isActive = (link) =>
    link.exact ? location.pathname === link.to : location.pathname.startsWith(link.to);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initial = (user.name || 'A').trim().charAt(0).toUpperCase();

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <div className="admin-sidebar-logo-icon"><FiBox /></div>
          <div>
            <div className="admin-sidebar-logo-title">Kiramart</div>
            <div className="admin-sidebar-logo-sub">Admin Panel</div>
          </div>
        </div>

        <div className="admin-nav-group">
          <p className="admin-nav-label">Main Menu</p>
          <nav>
            {mainLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`admin-nav-item ${isActive(link) ? 'active' : ''}`}
              >
                <span className="admin-nav-icon">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="admin-nav-group">
          <p className="admin-nav-label">Other</p>
          <nav>
            {otherLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`admin-nav-item ${isActive(link) ? 'active' : ''}`}
              >
                <span className="admin-nav-icon">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="admin-sidebar-footer">
          <Link to="/" className="admin-nav-item">
            <span className="admin-nav-icon"><FiArrowLeft /></span>
            <span>Back to Store</span>
          </Link>
          <button onClick={handleLogout} className="admin-nav-item" style={{ width: '100%', textAlign: 'left' }}>
            <span className="admin-nav-icon"><FiLogOut /></span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="admin-content">
        <AdminTopbar />
        <div className="admin-mobile-nav">
          {allLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`admin-mobile-nav-item ${isActive(link) ? 'active' : ''}`}
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
