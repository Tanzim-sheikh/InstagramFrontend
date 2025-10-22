import React, { useEffect, useMemo, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../contexts/AuthContext.jsx';

const FindFriends = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [sent, setSent] = useState([]); // user objects
  const [received, setReceived] = useState([]); // user objects
  const [pendingSentIds, setPendingSentIds] = useState([]); // ids I've sent requests to
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const { user: me } = useAuth();

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError('');
      try {
        // Load all three in parallel
        const [allUsersRes, friendsRes, requestsRes] = await Promise.all([
          api.get('/user/AllUsers'),
          api.get('/user/friends'),
          api.get('/user/requests'),
        ]);
        if (!mounted) return;
        const all = Array.isArray(allUsersRes.data.users) ? allUsersRes.data.users : [];
        const fr = Array.isArray(friendsRes.data.friends) ? friendsRes.data.friends : [];
        const rec = Array.isArray(requestsRes.data.received) ? requestsRes.data.received : [];
        const snt = Array.isArray(requestsRes.data.sent) ? requestsRes.data.sent : [];
        setAllUsers(all);
        setFriends(fr);
        setReceived(rec);
        setSent(snt);
        setPendingSentIds(snt.map(u => u._id || u.id).filter(Boolean));
      } catch (e) {
        if (mounted) setError(e?.response?.data?.message || 'Failed to load users');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const idsSet = (arr) => new Set(arr.map(u => String(u._id || u.id)).filter(Boolean));

  const candidates = useMemo(() => {
    const myId = String(me?.id || me?._id || '');
    const friendIds = idsSet(friends);
    const sentIds = idsSet(sent);
    const receivedIds = idsSet(received);

    const base = allUsers.filter(u => String(u._id || u.id) !== myId);
    const notFriends = base.filter(u => !friendIds.has(String(u._id || u.id)));
    const notPendingEitherWay = notFriends.filter(u => !sentIds.has(String(u._id || u.id)) && !receivedIds.has(String(u._id || u.id)));

    const q = query.trim().toLowerCase();
    if (!q) return notPendingEitherWay;
    return notPendingEitherWay.filter(u =>
      (u.name || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q)
    );
  }, [allUsers, friends, sent, received, query, me]);

  const addFriend = async (userId) => {
    try {
      await api.post('/user/add-friend', { friendId: userId });
      setPendingSentIds(prev => prev.includes(userId) ? prev : [...prev, userId]);
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to add friend');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Find Friends</h2>
      </div>

      <input
        className="w-full border p-2 rounded"
        placeholder="Search by name or email..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {error && <div className="text-red-600">{error}</div>}
      {loading && <div className="text-gray-600">Loading users...</div>}

      {!loading && (
        <ul className="divide-y rounded-xl border bg-white">
          {candidates.map((u) => {
            const id = u._id || u.id;
            const isPending = pendingSentIds.includes(id);
            return (
              <li key={id} className="p-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {u?.profilePhoto?.url ? (
                    <img src={u.profilePhoto.url} alt={u.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium shrink-0">
                      {(u.name || u.email || '?').slice(0,1).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="font-medium truncate">{u.name || 'Unnamed'}</div>
                    <div className="text-sm text-gray-600 truncate">{u.email}</div>
                  </div>
                </div>
                <button
                  onClick={() => addFriend(id)}
                  disabled={isPending}
                  className={`px-4 py-2 rounded border shrink-0 transition-colors hover:border-black border-2 rounded-lg ${
                    isPending ? 'bg-gray-200 text-gray-600 cursor-not-allowed' : 'hover:bg-black hover:text-white'
                  }`}
                >
                  {isPending ? 'Pending' : 'Add Friend'}
                </button>
              </li>
            );
          })}
          {candidates.length === 0 && (
            <li className="p-4 text-gray-600">No users to show</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default FindFriends;
