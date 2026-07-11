import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiPhone, FiShield, FiClock } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500">Please log in to view your profile.</p>
        <Link to="/login" className="text-emerald-600 hover:underline mt-2 inline-block">Sign In</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-emerald-600 to-teal-500" />
        <div className="px-8 pb-8 -mt-16">
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
            <FiUser className="text-3xl text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-4">{user.name}</h1>
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
            user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'
          }`}>
            {user.role}
          </span>

          <div className="mt-8 space-y-4">
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
              <FiMail className="text-gray-400" />
              <div><p className="text-sm text-gray-500">Email</p><p className="font-medium text-gray-900">{user.email}</p></div>
            </div>
            {user.phone && (
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                <FiPhone className="text-gray-400" />
                <div><p className="text-sm text-gray-500">Phone</p><p className="font-medium text-gray-900">{user.phone}</p></div>
              </div>
            )}
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
              <FiShield className="text-gray-400" />
              <div><p className="text-sm text-gray-500">User Category</p><p className="font-medium text-gray-900 capitalize">{user.category?.toLowerCase()}</p></div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
              <FiClock className="text-gray-400" />
              <div><p className="text-sm text-gray-500">Member Since</p><p className="font-medium text-gray-900">{new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
