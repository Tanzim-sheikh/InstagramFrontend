import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../contexts/AuthContext.jsx';
import { getSocket, registerSocketUser } from '../lib/socket';

const Chat = () => {
  const { me } = useAuth();
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [online, setOnline] = useState(new Set());
  const [unreadByFriend, setUnreadByFriend] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
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
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!me?.id && !me?._id) return;
    registerSocketUser(me.id || me._id);
    const s = getSocket();
    const onOnline = (list) => setOnline(new Set((list || []).map(String)));
    const refreshUnread = async () => {
      try {
        const { data } = await api.get('/unread-summary');
        setUnreadByFriend(data?.byFriend || {});
      } catch (_) {}
    };
    s.on('onlineUsers', onOnline);
    s.on('unreadIncrement', refreshUnread);
    window.addEventListener('conversationRead', refreshUnread);
    // initial unread fetch
    refreshUnread();
    return () => {
      s.off('onlineUsers', onOnline);
      s.off('unreadIncrement', refreshUnread);
      window.removeEventListener('conversationRead', refreshUnread);
    };
  }, [me]);

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
      <h2 className="text-2xl font-semibold">Chat</h2>

      <input
        className="w-full border p-2 rounded"
        placeholder="Search friends..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {error && <div className="text-red-600">{error}</div>}
      {loading && <div className="text-gray-600">Loading friends...</div>}

      {!loading && (
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
              {(unreadByFriend[String(u._id || u.id)] || 0) > 0 && (
                <span className="ml-2 inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
              )}
              <button
                onClick={() => navigate(`/chat/${u._id || u.id}`, { state: { friend: u } })}
                className="px-3 py-1 rounded border hover:bg-black hover:text-white transition-colors hover:border-black border-2 rounded-lg"
              >
                Message
              </button>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="p-4 text-gray-600">No friends found.</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default Chat;
