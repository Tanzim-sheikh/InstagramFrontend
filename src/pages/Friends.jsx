import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../contexts/AuthContext.jsx';
import { getSocket } from '../lib/socket';

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const { user: me } = useAuth();
  const navigate = useNavigate();
  const [online, setOnline] = useState(new Set());

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get('/user/friends');
        if (mounted) setFriends(Array.isArray(data.friends) ? data.friends : []);
      } catch (e) {
        if (mounted) setError(e?.response?.data?.message || 'Failed to load users');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const s = getSocket();
    const onOnline = (list) => setOnline(new Set((list || []).map(String)));
    s.on('onlineUsers', onOnline);
    return () => s.off('onlineUsers', onOnline);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return friends;
    return friends.filter(u =>
      (u.name || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q)
    );
  }, [friends, query]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Friends</h2>
        <div className="flex gap-2">
          <button onClick={() => navigate('/find-friends')} className="text-md font-semibold bg-white text-black px-2 py-1 rounded hover:bg-black hover:text-white transition-colors hover:border-black border-2 rounded-lg">Find Friends</button>
          <button onClick={() => navigate('/requests')} className="text-md font-semibold bg-black text-white px-2 py-1 rounded hover:bg-white hover:text-black transition-colors hover:border-black border-2 rounded-lg">Requests</button>
        </div>
      </div>

      <input
        className="w-full border p-2 rounded"
        placeholder="Search by name or email..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {loading && <div className="text-gray-600">Loading users...</div>}
      {error && !loading && <div className="text-red-600">{error}</div>}

      {!loading && !error && (
        <ul className="divide-y rounded-xl border bg-white">
          {filtered.map((u) => (
            <li key={u._id || u.id} className="p-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative">
                  {u?.profilePhoto?.url ? (
                    <img src={u.profilePhoto.url} alt={u.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium shrink-0">
                      {(u.name || u.email || '?').slice(0,1).toUpperCase()}
                    </div>
                  )}
                  {online.has(String(u._id || u.id)) && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="font-medium truncate">{u.name || 'Unnamed'}</div>
                  <div className="text-sm text-gray-600 truncate">{u.email}</div>
                </div>
              </div>
              <div className="text-sm text-gray-600 shrink-0">Friend</div>
              {/* Placeholder for future actions: Follow/Message */}
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="p-4 text-gray-600">No users found.</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default Friends;
