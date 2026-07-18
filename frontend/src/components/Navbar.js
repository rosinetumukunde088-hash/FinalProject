import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { FiLogOut, FiUser, FiUserPlus, FiShoppingCart, FiPackage, FiHome, FiMenu, FiX, FiGrid, FiClipboard, FiBriefcase, FiBarChart2 } from 'react-icons/fi';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const isStaff = user?.role === 'ADMIN' || user?.role === 'TRADER' || user?.role === 'MANAGER';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-emerald-700 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold tracking-tight">
            <FiPackage className="text-2xl text-emerald-200" />
            <span>Kiramart Rwanda</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-1 hover:text-emerald-200 transition">
              <FiHome /><span>{t('nav.home')}</span>
            </Link>
            <Link to="/products" className="flex items-center space-x-1 hover:text-emerald-200 transition">
              <FiShoppingCart /><span>{t('nav.products')}</span>
            </Link>
            {!isStaff && (
              <Link to="/cart" className="flex items-center space-x-1 hover:text-emerald-200 transition">
                <span className="navbar-cart-icon-wrap">
                  <FiShoppingCart />
                  {totalItems > 0 && (
                    <span className="navbar-cart-badge">
                      {totalItems > 99 ? '99+' : totalItems}
                    </span>
                  )}
                </span>
                <span>{t('nav.cart')}</span>
              </Link>
            )}

            {user ? (
              <>
                {user.role === 'ADMIN' && (
                  <Link to="/admin" className="flex items-center space-x-1 hover:text-emerald-200 transition bg-purple-600/30 px-3 py-2 rounded-lg">
                    <FiGrid /><span>{t('nav.admin')}</span>
                  </Link>
                )}
                {user.role === 'TRADER' && (
                  <Link to="/trader" className="flex items-center space-x-1 hover:text-emerald-200 transition bg-blue-600/30 px-3 py-2 rounded-lg">
                    <FiBriefcase /><span>{t('nav.trader')}</span>
                  </Link>
                )}
                {user.role === 'MANAGER' && (
                  <Link to="/manager" className="flex items-center space-x-1 hover:text-emerald-200 transition bg-emerald-600/30 px-3 py-2 rounded-lg">
                    <FiBarChart2 /><span>{t('nav.manager')}</span>
                  </Link>
                )}
                {!isStaff && (
                  <Link to="/orders" className="flex items-center space-x-1 hover:text-emerald-200 transition">
                    <FiClipboard /><span>{t('nav.orders')}</span>
                  </Link>
                )}
                {!isStaff && (
                  <>
                    <Link to="/profile" className="flex items-center space-x-1 hover:text-emerald-200 transition">
                      <FiUser /><span>{user.name?.split(' ')[0]}</span>
                    </Link>
                    <button onClick={handleLogout} className="flex items-center space-x-1 bg-emerald-600 hover:bg-emerald-500 px-3 py-2 rounded-lg transition">
                      <FiLogOut /><span>{t('nav.logout')}</span>
                    </button>
                  </>
                )}
              </>
            ) : (
              <>
                <Link to="/register" className="flex items-center space-x-1 hover:text-emerald-200 transition px-3 py-2 rounded-lg border border-emerald-400/40">
                  <FiUserPlus /><span>{t('auth.register')}</span>
                </Link>
                <Link to="/login" className="flex items-center space-x-1 bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg transition">
                  <FiUser /><span>{t('nav.signIn')}</span>
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center space-x-2">
            {!isStaff && (
              <Link to="/cart" className="navbar-cart-icon-wrap p-2">
                <FiShoppingCart size={20} />
                {totalItems > 0 && (
                  <span className="navbar-cart-badge">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </Link>
            )}
            <button onClick={() => setOpen(!open)}>
              {open ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-emerald-800 px-4 pb-4 space-y-2 border-t border-emerald-600/30">
          <Link to="/" className="block py-2.5 hover:text-emerald-200 transition" onClick={() => setOpen(false)}><FiHome className="inline mr-2" />{t('nav.home')}</Link>
          <Link to="/products" className="block py-2.5 hover:text-emerald-200 transition" onClick={() => setOpen(false)}><FiShoppingCart className="inline mr-2" />{t('nav.products')}</Link>
          {!isStaff && (
            <Link to="/cart" className="block py-2.5 hover:text-emerald-200 transition" onClick={() => setOpen(false)}>
              <FiShoppingCart className="inline mr-2" />{t('nav.cart')}
              {totalItems > 0 && <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{totalItems}</span>}
            </Link>
          )}
          {user ? (
            <>
              {user.role === 'ADMIN' && (
                <Link to="/admin" className="block py-2.5 hover:text-emerald-200 transition" onClick={() => setOpen(false)}><FiGrid className="inline mr-2" />{t('nav.admin')}</Link>
              )}
              {user.role === 'TRADER' && (
                <Link to="/trader" className="block py-2.5 hover:text-emerald-200 transition" onClick={() => setOpen(false)}><FiBriefcase className="inline mr-2" />{t('nav.trader')}</Link>
              )}
              {user.role === 'MANAGER' && (
                <Link to="/manager" className="block py-2.5 hover:text-emerald-200 transition" onClick={() => setOpen(false)}><FiBarChart2 className="inline mr-2" />{t('nav.manager')}</Link>
              )}
              {!isStaff && (
                <Link to="/orders" className="block py-2.5 hover:text-emerald-200 transition" onClick={() => setOpen(false)}><FiClipboard className="inline mr-2" />{t('nav.orders')}</Link>
              )}
              {!isStaff && (
                <>
                  <Link to="/profile" className="block py-2.5 hover:text-emerald-200 transition" onClick={() => setOpen(false)}><FiUser className="inline mr-2" />{t('nav.profile')}</Link>
                  <button onClick={() => { handleLogout(); setOpen(false); }} className="block py-2.5 w-full text-left hover:text-emerald-200 transition"><FiLogOut className="inline mr-2" />{t('nav.logout')}</button>
                </>
              )}
            </>
          ) : (
            <>
              <Link to="/register" className="block py-2.5 hover:text-emerald-200 transition" onClick={() => setOpen(false)}><FiUserPlus className="inline mr-2" />{t('auth.register')}</Link>
              <Link to="/login" className="block py-2.5 hover:text-emerald-200 transition" onClick={() => setOpen(false)}><FiUser className="inline mr-2" />{t('nav.signIn')}</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
