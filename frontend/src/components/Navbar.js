import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { FiLogOut, FiUser, FiShoppingCart, FiPackage, FiHome, FiMenu, FiX, FiGlobe, FiGrid } from 'react-icons/fi';
import { useState, useRef, useEffect } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const { lang, switchLang, t, languages } = useLanguage();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const currentLang = languages.find((l) => l.code === lang);

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
            <Link to="/cart" className="flex items-center space-x-1 hover:text-emerald-200 transition relative">
              <div className="relative">
                <FiShoppingCart />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </div>
              <span>{t('nav.cart')}</span>
            </Link>

            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center space-x-1 hover:text-emerald-200 transition px-2 py-1 rounded-lg hover:bg-emerald-600/30"
              >
                <FiGlobe />
                <span className="text-sm">{currentLang?.flag} {currentLang?.label}</span>
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 py-1 w-44 z-50">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => { switchLang(l.code); setLangOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm flex items-center space-x-3 transition hover:bg-emerald-50 ${lang === l.code ? 'text-emerald-700 font-semibold bg-emerald-50' : 'text-gray-700'}`}
                    >
                      <span className="text-lg">{l.flag}</span>
                      <span>{l.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {user ? (
              <>
                {user.role === 'ADMIN' && (
                  <Link to="/admin" className="flex items-center space-x-1 hover:text-emerald-200 transition bg-purple-600/30 px-3 py-2 rounded-lg">
                    <FiGrid /><span>{t('nav.admin')}</span>
                  </Link>
                )}
                <Link to="/profile" className="flex items-center space-x-1 hover:text-emerald-200 transition">
                  <FiUser /><span>{user.name?.split(' ')[0]}</span>
                </Link>
                <button onClick={handleLogout} className="flex items-center space-x-1 bg-emerald-600 hover:bg-emerald-500 px-3 py-2 rounded-lg transition">
                  <FiLogOut /><span>{t('nav.logout')}</span>
                </button>
              </>
            ) : (
              <Link to="/login" className="flex items-center space-x-1 bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg transition">
                <FiUser /><span>{t('nav.signIn')}</span>
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center space-x-2">
            <div className="relative" ref={!langRef ? langRef : undefined}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="p-2 hover:bg-emerald-600/30 rounded-lg"
              >
                <FiGlobe size={18} />
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 py-1 w-40 z-50">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => { switchLang(l.code); setLangOpen(false); }}
                      className={`w-full text-left px-3 py-2 text-sm flex items-center space-x-2 transition hover:bg-emerald-50 ${lang === l.code ? 'text-emerald-700 font-semibold bg-emerald-50' : 'text-gray-700'}`}
                    >
                      <span>{l.flag}</span>
                      <span>{l.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Link to="/cart" className="relative p-2">
              <FiShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>
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
          <Link to="/cart" className="block py-2.5 hover:text-emerald-200 transition" onClick={() => setOpen(false)}>
            <FiShoppingCart className="inline mr-2" />{t('nav.cart')}
            {totalItems > 0 && <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{totalItems}</span>}
          </Link>
          {user ? (
            <>
              {user.role === 'ADMIN' && (
                <Link to="/admin" className="block py-2.5 hover:text-emerald-200 transition" onClick={() => setOpen(false)}><FiGrid className="inline mr-2" />{t('nav.admin')}</Link>
              )}
              <Link to="/profile" className="block py-2.5 hover:text-emerald-200 transition" onClick={() => setOpen(false)}><FiUser className="inline mr-2" />{t('nav.profile')}</Link>
              <button onClick={() => { handleLogout(); setOpen(false); }} className="block py-2.5 w-full text-left hover:text-emerald-200 transition"><FiLogOut className="inline mr-2" />{t('nav.logout')}</button>
            </>
          ) : (
            <Link to="/login" className="block py-2.5 hover:text-emerald-200 transition" onClick={() => setOpen(false)}><FiUser className="inline mr-2" />{t('nav.signIn')}</Link>
          )}
        </div>
      )}
    </nav>
  );
}
