import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../contexts/AuthContext.jsx";
import { getApiError } from "../utils/formHelpers";
import { getSocket, registerSocketUser } from "../lib/socket";

const Avatar = ({ user, online }) => (
  <div className="relative">
    {user?.profilePhoto?.url ? (
      <img src={user.profilePhoto.url} alt={user.name} className="h-12 w-12 rounded-full object-cover" />
    ) : (
      <span className="grid h-12 w-12 place-items-center rounded-full bg-slate-200 text-sm font-black text-slate-700">
        {(user?.name || user?.email || "?").slice(0, 1).toUpperCase()}
      </span>
    )}
    <span className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white ${online ? "bg-teal-500" : "bg-slate-300"}`} />
  </div>
);

const Chat = () => {
  const { user: me } = useAuth();
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [online, setOnline] = useState(new Set());
  const [unreadByFriend, setUnreadByFriend] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get("/user/friends");
        if (mounted) setFriends(Array.isArray(data.friends) ? data.friends : []);
      } catch (e) {
        if (mounted) setError(getApiError(e, "Friends load nahi ho pa rahe."));
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!me?.id && !me?._id) return;
    registerSocketUser(me.id || me._id);
    const s = getSocket();
    const onOnline = (list) => setOnline(new Set((list || []).map(String)));
    const refreshUnread = async () => {
      try {
        const { data } = await api.get("/unread-summary");
        setUnreadByFriend(data?.byFriend || {});
      } catch {
        setUnreadByFriend({});
      }
    };
    s?.on("onlineUsers", onOnline);
    s?.on("unreadIncrement", refreshUnread);
    window.addEventListener("conversationRead", refreshUnread);
    refreshUnread();
    return () => {
      s?.off("onlineUsers", onOnline);
      s?.off("unreadIncrement", refreshUnread);
      window.removeEventListener("conversationRead", refreshUnread);
    };
  }, [me]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return friends;
    return friends.filter((u) => (u.name || "").toLowerCase().includes(q) || (u.email || "").toLowerCase().includes(q));
  }, [friends, query]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-teal-700">Dashboard</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-950">Chats</h1>
          <p className="mt-2 text-slate-600">Accepted friends ke saath realtime private conversations.</p>
        </div>
        <Link to="/find-friends" className="rounded-md bg-slate-950 px-4 py-3 text-center text-sm font-bold text-white hover:bg-teal-600">
          Find friends
        </Link>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-4">
          <input
            className="w-full rounded-md border border-slate-300 px-3 py-3 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            placeholder="Search friends..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {error && <div className="m-4 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">{error}</div>}
        {loading && <div className="p-6 text-slate-600">Loading friends...</div>}

        {!loading && (
          <div className="divide-y divide-slate-100">
            {filtered.map((u) => {
              const id = String(u._id || u.id);
              const unread = unreadByFriend[id] || 0;
              const isOnline = online.has(id);
              return (
                <button
                  key={id}
                  onClick={() => navigate(`/chat/${id}`, { state: { friend: u } })}
                  className="flex w-full items-center justify-between gap-4 p-4 text-left hover:bg-slate-50"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar user={u} online={isOnline} />
                    <div className="min-w-0">
                      <div className="truncate font-bold text-slate-950">{u.name || "Unnamed"}</div>
                      <div className="truncate text-sm text-slate-500">{isOnline ? "Online now" : u.email}</div>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    {unread > 0 && <span className="rounded-full bg-teal-500 px-2 py-1 text-xs font-black text-white">{unread}</span>}
                    <span className="rounded-md border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700">Message</span>
                  </div>
                </button>
              );
            })}
            {filtered.length === 0 && (
              <div className="p-8 text-center">
                <div className="text-lg font-bold text-slate-950">No friends found</div>
                <p className="mt-2 text-sm text-slate-600">Friend request accept hone ke baad chat list yahan dikhegi.</p>
                <Link to="/find-friends" className="mt-4 inline-flex rounded-md bg-slate-950 px-4 py-2 text-sm font-bold text-white hover:bg-teal-600">Discover people</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
