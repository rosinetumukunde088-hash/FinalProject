import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiChevronDown, FiUser, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export default function ManagerTopbar() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initial = (user?.name || 'A').trim().charAt(0).toUpperCase();

  return (
    <div className="admin-topbar">
      <div className="admin-topbar-actions">
        <div className="admin-topbar-menu" ref={profileRef}>
          <button
            className="admin-topbar-btn admin-topbar-profile-btn"
            onClick={() => setProfileOpen((o) => !o)}
          >
            <span className="admin-topbar-avatar" style={{ background: 'linear-gradient(135deg, #059669, #047857)' }}>{initial}</span>
            <span className="admin-topbar-username">{user?.name}</span>
            <FiChevronDown size={14} />
          </button>
          {profileOpen && (
            <div className="admin-dropdown admin-dropdown-right">
              <Link to="/manager/profile" className="admin-dropdown-item" onClick={() => setProfileOpen(false)}>
                <FiUser size={15} />
                <span>{t('nav.profile')}</span>
              </Link>
              <button className="admin-dropdown-item danger" onClick={handleLogout}>
                <FiLogOut size={15} />
                <span>{t('nav.logout')}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
