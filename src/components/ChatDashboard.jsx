import React, { useEffect, useRef, useState } from "react";
import { getSocket, registerSocketUser } from "../lib/socket";
import api from "../api/client";
import { useAuth } from "../contexts/AuthContext.jsx";

const ChatDashboard = ({ friend }) => {
  const { user: me } = useAuth();
  const myId = me?.id || me?._id;
  const friendId = friend?._id || friend?.id;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFriendTyping, setIsFriendTyping] = useState(false);
  const [friendOnline, setFriendOnline] = useState(false);
  const bottomRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (!myId || !friendId) return;
    let mounted = true;
    const s = getSocket();
    registerSocketUser(myId);

    const fetchHistory = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get("/messages", { params: { senderId: myId, receiverId: friendId } });
        if (mounted) setMessages(Array.isArray(data.messages) ? data.messages : []);
      } catch {
        if (mounted) setError("Messages load nahi ho pa rahe.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchHistory();
    api.post("/mark-read", { senderId: friendId }).then(() => window.dispatchEvent(new Event("conversationRead"))).catch(() => {});
    s?.emit("joinRoom", { senderId: myId, receiverId: friendId });

    const onReceive = (msg) => {
      const sameRoom =
        (String(msg.senderId) === String(myId) && String(msg.receiverId) === String(friendId)) ||
        (String(msg.senderId) === String(friendId) && String(msg.receiverId) === String(myId));
      if (sameRoom) setMessages((prev) => [...prev, msg]);
    };
    const onTyping = ({ from }) => {
      if (String(from) === String(friendId)) {
        setIsFriendTyping(true);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => setIsFriendTyping(false), 1400);
      }
    };
    const onOnline = (list) => setFriendOnline((list || []).map(String).includes(String(friendId)));

    s?.on("receiveMessage", onReceive);
    s?.on("typing", onTyping);
    s?.on("onlineUsers", onOnline);

    return () => {
      mounted = false;
      s?.off("receiveMessage", onReceive);
      s?.off("typing", onTyping);
      s?.off("onlineUsers", onOnline);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [myId, friendId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isFriendTyping]);

  const onSend = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || !myId || !friendId) return;
    getSocket()?.emit("sendMessage", { senderId: myId, receiverId: friendId, message: text });
    setInput("");
  };

  const onInputChange = (e) => {
    const val = e.target.value;
    setInput(val);
    if (val.trim()) getSocket()?.emit("typing", { senderId: myId, receiverId: friendId });
  };

  const name = friend?.name || "Unknown";

  return (
    <div className="flex h-[72vh] min-h-[520px] flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 p-4">
        <div className="flex min-w-0 items-center gap-3">
          {friend?.profilePhoto?.url ? (
            <img src={friend.profilePhoto.url} alt={name} className="h-11 w-11 rounded-full object-cover" />
          ) : (
            <span className="grid h-11 w-11 place-items-center rounded-full bg-slate-200 text-sm font-black text-slate-700">
              {(name || "?").slice(0, 1).toUpperCase()}
            </span>
          )}
          <div className="min-w-0">
            <div className="truncate font-black text-slate-950">{name}</div>
            <div className="text-sm font-medium text-slate-500">
              {isFriendTyping ? "Typing..." : friendOnline ? "Online" : "Offline"}
            </div>
          </div>
        </div>
        <span className={`h-3 w-3 rounded-full ${friendOnline ? "bg-teal-500" : "bg-slate-300"}`} />
      </div>

      <div className="flex-1 overflow-y-auto bg-slate-50 p-4">
        {error && <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>}
        {loading && <div className="text-slate-600">Loading messages...</div>}
        {!loading && messages.length === 0 && (
          <div className="grid h-full place-items-center text-center">
            <div>
              <div className="text-lg font-black text-slate-950">No messages yet</div>
              <p className="mt-2 text-sm text-slate-600">Pehla message bhej kar conversation start karein.</p>
            </div>
          </div>
        )}
        <div className="space-y-3">
          {messages.map((m) => {
            const mine = String(m.senderId) === String(myId);
            const status = mine ? (m.read ? "Seen" : "Sent") : "";
            return (
              <div key={m._id || `${m.senderId}-${m.createdAt}-${m.message}`} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[78%] rounded-lg px-4 py-2 shadow-sm ${mine ? "bg-slate-950 text-white" : "border border-slate-200 bg-white text-slate-800"}`}>
                  <div className="whitespace-pre-wrap break-words text-sm leading-6">{m.message}</div>
                  <div className={`mt-1 text-right text-[11px] ${mine ? "text-slate-300" : "text-slate-500"}`}>
                    {m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Now"}
                    {status ? ` - ${status}` : ""}
                  </div>
                </div>
              </div>
            );
          })}
          {isFriendTyping && <div className="text-sm font-semibold text-teal-700">{name} is typing...</div>}
          <div ref={bottomRef} />
        </div>
      </div>

      <form onSubmit={onSend} className="flex gap-2 border-t border-slate-200 bg-white p-3">
        <input
          value={input}
          onChange={onInputChange}
          placeholder="Type a secure message..."
          className="flex-1 rounded-md border border-slate-300 px-3 py-3 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
        />
        <button type="submit" disabled={!input.trim()} className="rounded-md bg-teal-500 px-5 py-3 text-sm font-black text-white hover:bg-slate-950">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatDashboard;
