import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { FiUser, FiMail, FiPhone, FiShield, FiClock, FiEdit2, FiLock, FiX, FiEye, FiEyeOff, FiCheck } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { user, updateProfile, changePassword } = useAuth();
  const { t } = useLanguage();

  const [editing, setEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');

  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-600">{t('profile.notLoggedIn')}</p>
        <Link to="/login" className="text-emerald-600 hover:text-emerald-700 hover:underline mt-2 inline-block font-medium">{t('auth.signIn')}</Link>
      </div>
    );
  }

  const openEdit = () => {
    setProfileForm({ name: user.name || '', phone: user.phone || '' });
    setProfileError('');
    setProfileSuccess('');
    setEditing(true);
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileError('');
    try {
      await updateProfile(profileForm);
      setProfileSuccess(t('profile.updateSuccess'));
      setEditing(false);
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileSaving(false);
    }
  };

  const openPasswordForm = () => {
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setPasswordError('');
    setPasswordSuccess('');
    setChangingPassword(true);
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    setPasswordError('');
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError(t('profile.passwordMismatch'));
      return;
    }
    setPasswordSaving(true);
    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordSuccess(t('profile.passwordSuccess'));
      setChangingPassword(false);
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to update password');
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-700/20 to-transparent"></div>
        </div>
        <div className="px-8 pb-8 -mt-16 relative z-10">
          <div className="flex items-end justify-between">
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
              <FiUser className="text-3xl text-emerald-600" />
            </div>
            {!editing && (
              <button onClick={openEdit} className="flex items-center space-x-2 bg-white border border-gray-200 hover:border-emerald-300 hover:text-emerald-700 text-gray-600 font-medium px-4 py-2 rounded-xl transition shadow-sm">
                <FiEdit2 size={16} /><span>{t('profile.editProfile')}</span>
              </button>
            )}
          </div>

          {!editing ? (
            <>
              <h1 className="text-2xl font-bold text-gray-900 mt-4">{user.name}</h1>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'
              }`}>
                {user.role === 'ADMIN' ? t('auth.admin') : t('auth.user')}
              </span>
            </>
          ) : (
            <form onSubmit={handleProfileSave} className="mt-4 space-y-4">
              {profileError && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{profileError}</div>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.name')}</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-gray-900"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.phone')}</label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-gray-900"
                    placeholder="+250 788 000 000"
                  />
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={profileSaving}
                  className="flex-1 flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50"
                >
                  <FiCheck size={16} /><span>{profileSaving ? t('profile.saving') : t('profile.save')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="flex-1 flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-xl transition"
                >
                  <FiX size={16} /><span>{t('profile.cancel')}</span>
                </button>
              </div>
            </form>
          )}

          {profileSuccess && !editing && (
            <div className="mt-4 bg-emerald-50 text-emerald-700 px-4 py-3 rounded-lg text-sm">{profileSuccess}</div>
          )}

          <div className="mt-8 space-y-4">
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <FiMail className="text-emerald-500" />
              <div><p className="text-xs text-gray-500 uppercase tracking-wide">{t('profile.email')}</p><p className="font-medium text-gray-900">{user.email}</p></div>
            </div>
            {user.phone && (
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <FiPhone className="text-emerald-500" />
                <div><p className="text-xs text-gray-500 uppercase tracking-wide">{t('profile.phone')}</p><p className="font-medium text-gray-900">{user.phone}</p></div>
              </div>
            )}
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <FiShield className="text-emerald-500" />
              <div><p className="text-xs text-gray-500 uppercase tracking-wide">{t('profile.category')}</p><p className="font-medium text-gray-900 capitalize">{user.category?.toLowerCase()}</p></div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <FiClock className="text-emerald-500" />
              <div><p className="text-xs text-gray-500 uppercase tracking-wide">{t('profile.memberSince')}</p><p className="font-medium text-gray-900">{new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p></div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                <FiLock className="text-emerald-500" /><span>{t('profile.changePassword')}</span>
              </h2>
              {!changingPassword && (
                <button onClick={openPasswordForm} className="text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:underline">
                  {t('profile.changePassword')}
                </button>
              )}
            </div>

            {passwordSuccess && !changingPassword && (
              <div className="mt-4 bg-emerald-50 text-emerald-700 px-4 py-3 rounded-lg text-sm">{passwordSuccess}</div>
            )}

            {changingPassword && (
              <form onSubmit={handlePasswordSave} className="mt-4 space-y-4">
                {passwordError && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{passwordError}</div>}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.currentPassword')}</label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPasswords ? 'text' : 'password'}
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-gray-900"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.newPassword')}</label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPasswords ? 'text' : 'password'}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-gray-900"
                      placeholder="Min 6 characters"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.confirmPassword')}</label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPasswords ? 'text' : 'password'}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-gray-900"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(!showPasswords)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={passwordSaving}
                    className="flex-1 flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50"
                  >
                    <FiCheck size={16} /><span>{passwordSaving ? t('profile.changingPassword') : t('profile.updatePassword')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setChangingPassword(false)}
                    className="flex-1 flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-xl transition"
                  >
                    <FiX size={16} /><span>{t('profile.cancel')}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
