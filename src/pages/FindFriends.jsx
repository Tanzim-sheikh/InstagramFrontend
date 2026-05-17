// import React, { useEffect, useMemo, useState } from 'react';
// import api from '../api/client';
// import { useAuth } from '../contexts/AuthContext.jsx';

// const FindFriends = () => {
//   const [allUsers, setAllUsers] = useState([]);
//   const [friends, setFriends] = useState([]);
//   const [sent, setSent] = useState([]); // user objects
//   const [received, setReceived] = useState([]); // user objects
//   const [pendingSentIds, setPendingSentIds] = useState([]); // ids I've sent requests to
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [query, setQuery] = useState('');
//   const { user: me } = useAuth();

//   useEffect(() => {
//     let mounted = true;
//     (async () => {
//       setLoading(true);
//       setError('');
//       try {
//         // Load all three in parallel
//         const [allUsersRes, friendsRes, requestsRes] = await Promise.all([
//           api.get('/user/AllUsers'),
//           api.get('/user/friends'),
//           api.get('/user/requests'),
//         ]);
//         if (!mounted) return;
//         const all = Array.isArray(allUsersRes.data.users) ? allUsersRes.data.users : [];
//         const fr = Array.isArray(friendsRes.data.friends) ? friendsRes.data.friends : [];
//         const rec = Array.isArray(requestsRes.data.received) ? requestsRes.data.received : [];
//         const snt = Array.isArray(requestsRes.data.sent) ? requestsRes.data.sent : [];
//         setAllUsers(all);
//         setFriends(fr);
//         setReceived(rec);
//         setSent(snt);
//         setPendingSentIds(snt.map(u => u._id || u.id).filter(Boolean));
//       } catch (e) {
//         if (mounted) setError(e?.response?.data?.message || 'Failed to load users');
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     })();
//     return () => { mounted = false; };
//   }, []);

//   const idsSet = (arr) => new Set(arr.map(u => String(u._id || u.id)).filter(Boolean));

//   const candidates = useMemo(() => {
//     const myId = String(me?.id || me?._id || '');
//     const friendIds = idsSet(friends);
//     const sentIds = idsSet(sent);
//     const receivedIds = idsSet(received);

//     const base = allUsers.filter(u => String(u._id || u.id) !== myId);
//     const notFriends = base.filter(u => !friendIds.has(String(u._id || u.id)));
//     const notPendingEitherWay = notFriends.filter(u => !sentIds.has(String(u._id || u.id)) && !receivedIds.has(String(u._id || u.id)));

//     const q = query.trim().toLowerCase();
//     if (!q) return notPendingEitherWay;
//     return notPendingEitherWay.filter(u =>
//       (u.name || '').toLowerCase().includes(q) ||
//       (u.email || '').toLowerCase().includes(q)
//     );
//   }, [allUsers, friends, sent, received, query, me]);

//   const addFriend = async (userId) => {
//     try {
//       await api.post('/user/add-friend', { friendId: userId });
//       setPendingSentIds(prev => prev.includes(userId) ? prev : [...prev, userId]);
//     } catch (e) {
//       setError(e?.response?.data?.message || 'Failed to add friend');
//     }
//   };

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center justify-between">
//         <h2 className="text-2xl font-semibold">Find Friends</h2>
//       </div>

//       <input
//         className="w-full border p-2 rounded"
//         placeholder="Search by name or email..."
//         value={query}
//         onChange={(e) => setQuery(e.target.value)}
//       />

//       {error && <div className="text-red-600">{error}</div>}
//       {loading && <div className="text-gray-600">Loading users...</div>}

//       {!loading && (
//         <ul className="divide-y rounded-xl border bg-white">
//           {candidates.map((u) => {
//             const id = u._id || u.id;
//             const isPending = pendingSentIds.includes(id);
//             return (
//               <li key={id} className="p-3 flex items-center justify-between gap-3">
//                 <div className="flex items-center gap-3 min-w-0">
//                   {u?.profilePhoto?.url ? (
//                     <img src={u.profilePhoto.url} alt={u.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
//                   ) : (
//                     <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium shrink-0">
//                       {(u.name || u.email || '?').slice(0,1).toUpperCase()}
//                     </div>
//                   )}
//                   <div className="min-w-0">
//                     <div className="font-medium truncate">{u.name || 'Unnamed'}</div>
//                     <div className="text-sm text-gray-600 truncate">{u.email}</div>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => addFriend(id)}
//                   disabled={isPending}
//                   className={`px-4 py-2 rounded border shrink-0 transition-colors hover:border-black border-2 rounded-lg ${
//                     isPending ? 'bg-gray-200 text-gray-600 cursor-not-allowed' : 'hover:bg-black hover:text-white'
//                   }`}
//                 >
//                   {isPending ? 'Pending' : 'Add Friend'}
//                 </button>
//               </li>
//             );
//           })}
//           {candidates.length === 0 && (
//             <li className="p-4 text-gray-600">No users to show</li>
//           )}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default FindFriends;

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import api from '../api/client';
import { useAuth } from '../contexts/AuthContext.jsx';

// Helper: extract IDs as Set
const getIdSet = (users) => new Set(users.map(u => String(u._id || u.id)).filter(Boolean));

// Custom hook for friends data
const useFriendsData = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [sent, setSent] = useState([]);
  const [received, setReceived] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [allUsersRes, friendsRes, requestsRes] = await Promise.all([
          api.get('/user/AllUsers'),
          api.get('/user/friends'),
          api.get('/user/requests'),
        ]);
        if (!mounted) return;
        setAllUsers(Array.isArray(allUsersRes.data.users) ? allUsersRes.data.users : []);
        setFriends(Array.isArray(friendsRes.data.friends) ? friendsRes.data.friends : []);
        setReceived(Array.isArray(requestsRes.data.received) ? requestsRes.data.received : []);
        setSent(Array.isArray(requestsRes.data.sent) ? requestsRes.data.sent : []);
      } catch (e) {
        if (mounted) setError(e?.response?.data?.message || 'Failed to load users');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchData();
    return () => { mounted = false; };
  }, []);

  return { allUsers, friends, sent, received, loading, error };
};

// Single user row component (with better spacing)
const UserListItem = ({ user, isPending, onAddFriend }) => {
  const id = user._id || user.id;
  const displayName = user.name || 'Unnamed';
  const initial = (displayName || user.email || '?').slice(0, 1).toUpperCase();

  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b last:border-b-0">
      <div className="flex items-center gap-4">
        {/* Avatar with border & shadow */}
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
        <div>
          <div className="font-semibold text-gray-800">{displayName}</div>
          <div className="text-sm text-gray-500">{user.email}</div>
        </div>
      </div>
      <button
        onClick={() => onAddFriend(id)}
        disabled={isPending}
        className={`px-5 py-2 rounded-lg font-medium transition-all duration-200 border-2 ${
          isPending
            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
            : 'bg-white text-black border-gray-300 hover:bg-black hover:text-white hover:border-black shadow-sm'
        }`}
      >
        {isPending ? '✓ Pending' : '+ Add Friend'}
      </button>
    </div>
  );
};

// Main Component
const FindFriends = () => {
  const { allUsers, friends, sent, received, loading, error: fetchError } = useFriendsData();
  const { user: me } = useAuth();
  const [query, setQuery] = useState('');
  const [pendingSentIds, setPendingSentIds] = useState([]);

  useEffect(() => {
    setPendingSentIds(sent.map(u => u._id || u.id).filter(Boolean));
  }, [sent]);

  const candidates = useMemo(() => {
    const myId = String(me?.id || me?._id || '');
    const friendIds = getIdSet(friends);
    const sentIds = getIdSet(sent);
    const receivedIds = getIdSet(received);

    const eligible = allUsers.filter(user => {
      const uid = String(user._id || user.id);
      return uid !== myId && !friendIds.has(uid) && !sentIds.has(uid) && !receivedIds.has(uid);
    });

    const search = query.trim().toLowerCase();
    if (!search) return eligible;
    return eligible.filter(u =>
      (u.name || '').toLowerCase().includes(search) ||
      (u.email || '').toLowerCase().includes(search)
    );
  }, [allUsers, friends, sent, received, query, me]);

  const handleAddFriend = useCallback(async (userId) => {
    try {
      await api.post('/user/add-friend', { friendId: userId });
      setPendingSentIds(prev => prev.includes(userId) ? prev : [...prev, userId]);
    } catch (e) {
      console.error(e);
      // You can show a toast here if you want
    }
  }, []);

  // Loading state with spinner
  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Find Friends</h2>
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-black"></div>
          <p className="text-gray-500 mt-3">Finding your people...</p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Find Friends</h2>
        <div className="bg-white rounded-xl shadow-md p-6 text-red-600 border-l-4 border-red-500">
          {fetchError}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Find Friends</h2>
        <p className="text-gray-500">Connect with people you know</p>
      </div>

      {/* Search input with icon feel */}
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
            placeholder="Search by name or email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* User list card */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {candidates.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="text-5xl mb-3">👋</div>
            <p className="text-gray-500 text-lg">
              {query ? 'No matching users found' : 'No new friends to add right now'}
            </p>
            <p className="text-gray-400 text-sm mt-1">
              {query ? 'Try a different name or email' : 'Check back later for suggestions'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {candidates.map((user) => (
              <UserListItem
                key={user._id || user.id}
                user={user}
                isPending={pendingSentIds.includes(user._id || user.id)}
                onAddFriend={handleAddFriend}
              />
            ))}
          </div>
        )}
      </div>

      {/* Optional: subtle footer */}
      <div className="mt-6 text-center text-xs text-gray-400">
        {candidates.length > 0 && `${candidates.length} people available`}
      </div>
    </div>
  );
};

export default FindFriends;