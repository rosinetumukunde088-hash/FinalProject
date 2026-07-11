import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiUser, FiShoppingCart, FiPackage, FiHome, FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-emerald-700 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold tracking-tight">
            <FiPackage className="text-2xl" />
            <span>KiKUU Rwanda</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-1 hover:text-emerald-200 transition">
              <FiHome /><span>Home</span>
            </Link>
            <Link to="/products" className="flex items-center space-x-1 hover:text-emerald-200 transition">
              <FiShoppingCart /><span>Products</span>
            </Link>
            {user ? (
              <>
                <Link to="/profile" className="flex items-center space-x-1 hover:text-emerald-200 transition">
                  <FiUser /><span>{user.name?.split(' ')[0]}</span>
                </Link>
                <button onClick={handleLogout} className="flex items-center space-x-1 bg-emerald-600 hover:bg-emerald-500 px-3 py-2 rounded-lg transition">
                  <FiLogOut /><span>Logout</span>
                </button>
              </>
            ) : (
              <Link to="/login" className="flex items-center space-x-1 bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg transition">
                <FiUser /><span>Sign In</span>
              </Link>
            )}
          </div>

          <button className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-emerald-800 px-4 pb-4 space-y-2">
          <Link to="/" className="block py-2" onClick={() => setOpen(false)}><FiHome className="inline mr-2" />Home</Link>
          <Link to="/products" className="block py-2" onClick={() => setOpen(false)}><FiShoppingCart className="inline mr-2" />Products</Link>
          {user ? (
            <>
              <Link to="/profile" className="block py-2" onClick={() => setOpen(false)}><FiUser className="inline mr-2" />Profile</Link>
              <button onClick={() => { handleLogout(); setOpen(false); }} className="block py-2 w-full text-left"><FiLogOut className="inline mr-2" />Logout</button>
            </>
          ) : (
            <Link to="/login" className="block py-2" onClick={() => setOpen(false)}><FiUser className="inline mr-2" />Sign In</Link>
          )}
        </div>
      )}
    </nav>
  );
}
