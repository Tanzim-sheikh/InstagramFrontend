import React from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';

const Profile = () => {
  const { user, loadUser } = useAuth();

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800">My Profile</h2>
          <p className="text-gray-500 mt-1">Your account information</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <div className="text-5xl mb-3">👤</div>
          <p className="text-gray-600 mb-4">No profile loaded. Please login, or refresh your session.</p>
          <button
            onClick={loadUser}
            className="px-5 py-2 rounded-lg font-medium transition-all duration-200 bg-black text-white hover:bg-gray-800 shadow-sm"
          >
            Reload Profile
          </button>
        </div>
      </div>
    );
  }

  const userId = user.id || user._id || '—';
  const displayName = user.name || 'Unnamed';
  const userEmail = user.email || 'No email';
  const isVerified = user.isVerified ?? true;
  const profilePhoto = user?.profilePhoto?.url;
  const initial = (displayName || '?').slice(0, 1).toUpperCase();

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">My Profile</h2>
        <p className="text-gray-500 mt-1">Your account information</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center md:items-start border-b border-gray-100">
          {/* Avatar */}
          {profilePhoto ? (
            <img
              src={profilePhoto}
              alt="avatar"
              className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-gray-100 shadow-md"
            />
          ) : (
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-3xl font-bold text-gray-600 border-4 border-gray-100 shadow-md">
              {initial}
            </div>
          )}
          <div className="text-center md:text-left">
            <div className="text-2xl md:text-3xl font-bold text-gray-800">{displayName}</div>
            <div className="text-gray-500 mt-1">{userEmail}</div>
            <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded-full">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500"></span>
              {isVerified ? 'Verified Account' : 'Not Verified'}
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="p-6 md:p-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <div className="text-xs text-gray-500 uppercase tracking-wide">User ID</div>
              <div className="mt-1 font-mono text-sm text-gray-800 break-all">{userId}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <div className="text-xs text-gray-500 uppercase tracking-wide">Email</div>
              <div className="mt-1 text-gray-800">{userEmail}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <div className="text-xs text-gray-500 uppercase tracking-wide">Verification Status</div>
              <div className="mt-1">
                {isVerified ? (
                  <span className="text-green-600 flex items-center gap-1">✅ Verified</span>
                ) : (
                  <span className="text-yellow-600 flex items-center gap-1">⚠️ Not Verified</span>
                )}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <div className="text-xs text-gray-500 uppercase tracking-wide">Member Since</div>
              <div className="mt-1 text-gray-800">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions Card */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 md:p-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Actions</h3>
          <div className="flex flex-wrap gap-3">
            <button
              disabled
              className="px-5 py-2 rounded-lg font-medium transition-all duration-200 bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
            >
              Edit Profile
            </button>
            <button
              disabled
              className="px-5 py-2 rounded-lg font-medium transition-all duration-200 bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
            >
              Change Password
            </button>
            <button
              onClick={loadUser}
              className="px-5 py-2 rounded-lg font-medium transition-all duration-200 bg-white text-black border-2 border-gray-300 hover:bg-black hover:text-white hover:border-black shadow-sm"
            >
              Refresh Profile
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-4">* Edit profile and change password coming soon</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;