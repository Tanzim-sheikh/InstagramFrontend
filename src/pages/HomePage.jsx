import React from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Home</h2>
      {!user ? (
        <p>Welcome! Please login or signup to continue.</p>
      ) : (
        <div className="flex items-center gap-3">
          {user?.profilePhoto?.url ? (
            <img src={user.profilePhoto.url} alt="avatar" className="w-12 h-12 rounded-full object-cover" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-200" />
          )}
          <div>
            <div className="font-medium">{user.name}</div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
