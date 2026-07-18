import { Link, useLocation, Outlet, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiBarChart2, FiTag, FiClipboard, FiFileText, FiBriefcase, FiUser, FiArrowLeft, FiLogOut, FiBox } from 'react-icons/fi';
import ManagerTopbar from './ManagerTopbar';

export default function ManagerLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user || user.role !== 'MANAGER') {
    return <Navigate to="/" replace />;
  }

  const mainLinks = [
    { to: '/manager', icon: <FiBarChart2 />, label: 'Analytics', exact: true },
    { to: '/manager/categories', icon: <FiTag />, label: 'Categories' },
    { to: '/manager/orders', icon: <FiClipboard />, label: 'Orders' },
    { to: '/manager/reports', icon: <FiFileText />, label: 'Reports' },
    { to: '/manager/traders', icon: <FiBriefcase />, label: 'Traders' },
    { to: '/manager/profile', icon: <FiUser />, label: 'Profile' },
  ];

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
          <div className="admin-sidebar-logo-icon" style={{ background: 'linear-gradient(135deg, #059669, #047857)' }}><FiBox /></div>
          <div>
            <div className="admin-sidebar-logo-title">Kiramart</div>
            <div className="admin-sidebar-logo-sub">Manager Panel</div>
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

        <div className="admin-sidebar-footer">
          <div className="admin-sidebar-user">
            <div className="admin-sidebar-avatar">{initial}</div>
            <div>
              <div className="admin-sidebar-user-name">{user.name}</div>
              <div className="admin-sidebar-user-role">{user.role?.toLowerCase()}</div>
            </div>
          </div>
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
        <ManagerTopbar />
        <div className="admin-mobile-nav">
          {mainLinks.map((link) => (
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
