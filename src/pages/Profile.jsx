import React from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';

const Profile = () => {
  const { user, loadUser } = useAuth();

  if (!user) {
    return (
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold">My Profile</h2>
        <p className="text-gray-600">No profile loaded. Please login, or refresh your session.</p>
        <button className="px-4 py-2 rounded border" onClick={loadUser}>Reload Profile</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-4">
        {user?.profilePhoto?.url ? (
          <img src={user.profilePhoto.url} alt="avatar" className="w-16 h-16 rounded-full object-cover" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-200" />
        )}
        <div>
          <div className="text-xl font-semibold">{user.name}</div>
          <div className="text-gray-600 text-sm">{user.email}</div>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border bg-white">
          <div className="text-sm text-gray-500">Account</div>
          <div className="mt-2 text-gray-800">Verified: {String(user.isVerified ?? true)}</div>
          <div className="mt-2 text-gray-800">User ID: <span className="font-mono text-xs">{user.id || user._id || '—'}</span></div>
        </div>
        <div className="p-4 rounded-xl border bg-white">
          <div className="text-sm text-gray-500">Actions</div>
          <button className="mt-2 px-3 py-1.5 rounded-md border">Edit Profile (coming soon)</button>
        </div>
      </section>
    </div>
  );
};

export default Profile;
