import { Link, useLocation, Outlet, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiGrid, FiPackage, FiClipboard, FiUser, FiArrowLeft, FiLogOut, FiBriefcase } from 'react-icons/fi';
import TraderTopbar from './TraderTopbar';

export default function TraderLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user || user.role !== 'TRADER') {
    return <Navigate to="/" replace />;
  }

  const mainLinks = [
    { to: '/trader', icon: <FiGrid />, label: 'Overview', exact: true },
    { to: '/trader/products', icon: <FiPackage />, label: 'My Products' },
    { to: '/trader/orders', icon: <FiClipboard />, label: 'Orders' },
    { to: '/trader/profile', icon: <FiUser />, label: 'Profile' },
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
          <div className="admin-sidebar-logo-icon" style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}><FiBriefcase /></div>
          <div>
            <div className="admin-sidebar-logo-title">Kiramart</div>
            <div className="admin-sidebar-logo-sub">Trader Panel</div>
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
        <TraderTopbar />
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
