import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiMail, FiPhone, FiShield, FiClock, FiLock, FiEye, FiEyeOff, FiCheck, FiX } from 'react-icons/fi';

export default function ManagerProfile() {
  const { user, updateProfile, changePassword } = useAuth();

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
      setProfileSuccess('Profile updated successfully');
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
      setPasswordError('New passwords do not match');
      return;
    }
    setPasswordSaving(true);
    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordSuccess('Password updated successfully');
      setChangingPassword(false);
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to update password');
    } finally {
      setPasswordSaving(false);
    }
  };

  if (!user) return null;

  const initial = (user.name || 'A').trim().charAt(0).toUpperCase();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 mt-1">Manage your manager account details</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div
              className="w-16 h-16 rounded-full text-white flex items-center justify-center text-xl font-bold flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #059669, #047857)' }}
            >
              {initial}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{user.name}</h2>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                Manager
              </span>
            </div>
          </div>
          {!editing && (
            <button onClick={openEdit} className="admin-btn admin-btn-outline">
              Edit Profile
            </button>
          )}
        </div>

        {editing && (
          <form onSubmit={handleProfileSave} className="mt-6 space-y-4 border-t border-gray-100 pt-6">
            {profileError && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{profileError}</div>}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="admin-input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                className="admin-input"
                placeholder="+250 788 000 000"
              />
            </div>
            <div className="flex space-x-3">
              <button type="submit" disabled={profileSaving} className="admin-btn admin-btn-primary">
                <FiCheck size={16} /><span>{profileSaving ? 'Saving...' : 'Save Changes'}</span>
              </button>
              <button type="button" onClick={() => setEditing(false)} className="admin-btn admin-btn-outline">
                <FiX size={16} /><span>Cancel</span>
              </button>
            </div>
          </form>
        )}

        {profileSuccess && !editing && (
          <div className="mt-4 bg-emerald-50 text-emerald-700 px-4 py-3 rounded-lg text-sm">{profileSuccess}</div>
        )}

        <div className="mt-6 space-y-3 border-t border-gray-100 pt-6">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <FiMail className="text-emerald-500" />
            <div><p className="text-xs text-gray-500 uppercase tracking-wide">Email</p><p className="font-medium text-gray-900">{user.email}</p></div>
          </div>
          {user.phone && (
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <FiPhone className="text-emerald-500" />
              <div><p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p><p className="font-medium text-gray-900">{user.phone}</p></div>
            </div>
          )}
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <FiShield className="text-emerald-500" />
            <div><p className="text-xs text-gray-500 uppercase tracking-wide">Role</p><p className="font-medium text-gray-900">Manager</p></div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <FiClock className="text-emerald-500" />
            <div><p className="text-xs text-gray-500 uppercase tracking-wide">Member Since</p><p className="font-medium text-gray-900">{new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p></div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900 flex items-center space-x-2">
              <FiLock className="text-emerald-500" /><span>Change Password</span>
            </h2>
            {!changingPassword && (
              <button onClick={openPasswordForm} className="text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:underline">
                Change Password
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input
                  type={showPasswords ? 'text' : 'password'}
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="admin-input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type={showPasswords ? 'text' : 'password'}
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="admin-input"
                  placeholder="Min 6 characters"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showPasswords ? 'text' : 'password'}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="admin-input"
                    style={{ paddingRight: '2.5rem' }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(!showPasswords)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
              </div>
              <div className="flex space-x-3">
                <button type="submit" disabled={passwordSaving} className="admin-btn admin-btn-primary">
                  <FiCheck size={16} /><span>{passwordSaving ? 'Updating...' : 'Update Password'}</span>
                </button>
                <button type="button" onClick={() => setChangingPassword(false)} className="admin-btn admin-btn-outline">
                  <FiX size={16} /><span>Cancel</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
