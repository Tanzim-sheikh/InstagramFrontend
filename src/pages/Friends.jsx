// import React, { useEffect, useMemo, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import api from '../api/client';
// import { getSocket } from '../lib/socket';

// const Friends = () => {
//   const [friends, setFriends] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [query, setQuery] = useState('');
//   const navigate = useNavigate();
//   const [online, setOnline] = useState(new Set());

//   useEffect(() => {
//     let mounted = true;
//     (async () => {
//       setLoading(true);
//       setError('');
//       try {
//         const { data } = await api.get('/user/friends');
//         if (mounted) setFriends(Array.isArray(data.friends) ? data.friends : []);
//       } catch (e) {
//         if (mounted) setError(e?.response?.data?.message || 'Failed to load users');
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     })();
//     return () => {
//       mounted = false;
//     };
//   }, []);

//   useEffect(() => {
//     const s = getSocket();
//     const onOnline = (list) => setOnline(new Set((list || []).map(String)));
//     s?.on('onlineUsers', onOnline);
//     return () => s?.off('onlineUsers', onOnline);
//   }, []);

//   const filtered = useMemo(() => {
//     const q = query.trim().toLowerCase();
//     if (!q) return friends;
//     return friends.filter(u =>
//       (u.name || '').toLowerCase().includes(q) ||
//       (u.email || '').toLowerCase().includes(q)
//     );
//   }, [friends, query]);

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center justify-between">
//         <h2 className="text-2xl font-semibold">Friends</h2>
//         <div className="flex gap-2">
//           <button onClick={() => navigate('/find-friends')} className="text-md font-semibold bg-white text-black px-2 py-1 rounded hover:bg-black hover:text-white transition-colors hover:border-black border-2 rounded-lg">Find Friends</button>
//           <button onClick={() => navigate('/requests')} className="text-md font-semibold bg-black text-white px-2 py-1 rounded hover:bg-white hover:text-black transition-colors hover:border-black border-2 rounded-lg">Requests</button>
//         </div>
//       </div>

//       <input
//         className="w-full border p-2 rounded"
//         placeholder="Search by name or email..."
//         value={query}
//         onChange={(e) => setQuery(e.target.value)}
//       />

//       {loading && <div className="text-gray-600">Loading users...</div>}
//       {error && !loading && <div className="text-red-600">{error}</div>}

//       {!loading && !error && (
//         <ul className="divide-y rounded-xl border bg-white">
//           {filtered.map((u) => (
//             <li key={u._id || u.id} className="p-3 flex items-center justify-between gap-3">
//               <div className="flex items-center gap-3 min-w-0">
//                 <div className="relative">
//                   {u?.profilePhoto?.url ? (
//                     <img src={u.profilePhoto.url} alt={u.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
//                   ) : (
//                     <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium shrink-0">
//                       {(u.name || u.email || '?').slice(0,1).toUpperCase()}
//                     </div>
//                   )}
//                   {online.has(String(u._id || u.id)) && (
//                     <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
//                   )}
//                 </div>
//                 <div className="min-w-0">
//                   <div className="font-medium truncate">{u.name || 'Unnamed'}</div>
//                   <div className="text-sm text-gray-600 truncate">{u.email}</div>
//                 </div>
//               </div>
//               <div className="text-sm text-gray-600 shrink-0">Friend</div>
//               {/* Placeholder for future actions: Follow/Message */}
//             </li>
//           ))}
//           {filtered.length === 0 && (
//             <li className="p-4 text-gray-600">No users found.</li>
//           )}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default Friends;

import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { getSocket } from '../lib/socket';

// Single friend card component
const FriendCard = ({ user, isOnline }) => {
  const id = user._id || user.id;
  const displayName = user.name || 'Unnamed';
  const initial = (displayName || user.email || '?').slice(0, 1).toUpperCase();

  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b last:border-b-0">
      <div className="flex items-center gap-4">
        <div className="relative">
          {user?.profilePhoto?.url ? (
            <img
              src={user.profilePhoto.url}
              alt={displayName}
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 shadow-sm"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-lg font-semibold text-gray-600 border border-gray-200 shadow-sm">
              {initial}
            </div>
          )}
          {isOnline && (
            <span className="absolute bottom-0 right-0 block h-3.5 w-3.5 rounded-full bg-green-500 ring-2 ring-white" />
          )}
        </div>
        <div>
          <div className="font-semibold text-gray-800">{displayName}</div>
          <div className="text-sm text-gray-500">{user.email}</div>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full shadow-inner">
          Friend
        </span>
        {/* Future action buttons can go here */}
      </div>
    </div>
  );
};

// Main Component
const Friends = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [online, setOnline] = useState(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const fetchFriends = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get('/user/friends');
        if (mounted) setFriends(Array.isArray(data.friends) ? data.friends : []);
      } catch (e) {
        if (mounted) setError(e?.response?.data?.message || 'Failed to load friends');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchFriends();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const socket = getSocket();
    const handleOnline = (list) => setOnline(new Set((list || []).map(String)));
    socket?.on('onlineUsers', handleOnline);
    return () => socket?.off('onlineUsers', handleOnline);
  }, []);

  const filteredFriends = useMemo(() => {
    const searchTerm = query.trim().toLowerCase();
    if (!searchTerm) return friends;
    return friends.filter(user =>
      (user.name || '').toLowerCase().includes(searchTerm) ||
      (user.email || '').toLowerCase().includes(searchTerm)
    );
  }, [friends, query]);

  // Loading state
  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Friends</h2>
          <p className="text-gray-500 mt-1">Your connections</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-black"></div>
          <p className="text-gray-500 mt-3">Loading friends...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Friends</h2>
          <p className="text-gray-500 mt-1">Your connections</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 text-red-600 border-l-4 border-red-500">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header with buttons */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Friends</h2>
          <p className="text-gray-500 mt-1">Your connections</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/find-friends')}
            className="px-5 py-2 rounded-lg font-medium transition-all duration-200 bg-white text-black border-2 border-gray-300 hover:bg-black hover:text-white hover:border-black shadow-sm"
          >
            Find Friends
          </button>
          <button
            onClick={() => navigate('/requests')}
            className="px-5 py-2 rounded-lg font-medium transition-all duration-200 bg-black text-white border-2 border-black hover:bg-white hover:text-black shadow-sm"
          >
            Requests
          </button>
        </div>
      </div>

      {/* Search input with icon */}
      <div className="mb-6">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
            placeholder="Search friends by name or email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Friends list card */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {filteredFriends.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="text-5xl mb-3">👥</div>
            <p className="text-gray-500 text-lg">
              {query ? 'No matching friends found' : 'No friends yet'}
            </p>
            <p className="text-gray-400 text-sm mt-1">
              {query 
                ? 'Try a different name or email' 
                : 'Start adding friends to see them here'}
            </p>
            {!query && (
              <button
                onClick={() => navigate('/find-friends')}
                className="mt-4 px-5 py-2 rounded-lg font-medium bg-black text-white hover:bg-gray-800 transition shadow-sm"
              >
                Find Friends
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredFriends.map((user) => {
              const userId = String(user._id || user.id);
              const isOnline = online.has(userId);
              return (
                <FriendCard
                  key={userId}
                  user={user}
                  isOnline={isOnline}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Optional footer with count */}
      {filteredFriends.length > 0 && (
        <div className="mt-6 text-center text-xs text-gray-400">
          {filteredFriends.length} {filteredFriends.length === 1 ? 'friend' : 'friends'}
          {query && ` matching "${query}"`}
        </div>
      )}
    </div>
  );
};

export default Friends;