import React, { useEffect, useMemo, useRef, useState } from "react";
import { getSocket } from "../lib/socket";
import api from "../api/client";
import { useAuth } from "../contexts/AuthContext.jsx";

const ChatDashboard = ({ friend }) => {
  const { user: me } = useAuth();
  const myId = me?.id || me?._id;
  const friendId = friend?._id || friend?.id;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [isFriendTyping, setIsFriendTyping] = useState(false);
  const bottomRef = useRef(null);
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Socket URL is managed in src/lib/socket.js via VITE_SOCKET_URL (prod) or localhost in dev

  useEffect(() => {
    let mounted = true;

    const fetchHistory = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/messages`, {
          params: { senderId: myId, receiverId: friendId },
        });
        if (mounted) setMessages(Array.isArray(data.messages) ? data.messages : []);
      } catch (_) {
        // silent
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchHistory();

    // Mark messages from this friend as read when opening the chat
    (async () => {
      try {
        await api.post('/mark-read', { senderId: friendId });
        // Notify header to refresh unread badge
        window.dispatchEvent(new Event('conversationRead'));
      } catch (_) {}
    })();

    const s = getSocket();
    if (s) {
      socketRef.current = s;
    }
    socketRef.current.emit("joinRoom", { senderId: myId, receiverId: friendId });

    socketRef.current.on("receiveMessage", (msg) => {
      const sameRoom =
        (msg.senderId === String(myId) && msg.receiverId === String(friendId)) ||
        (msg.senderId === String(friendId) && msg.receiverId === String(myId));
      if (sameRoom) setMessages((prev) => [...prev, msg]);
    });

    socketRef.current.on("typing", ({ from }) => {
      if (String(from) === String(friendId)) {
        setIsFriendTyping(true);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => setIsFriendTyping(false), 1500);
      }
    });

    return () => {
      mounted = false;
      socketRef.current?.disconnect();
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [myId, friendId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onSend = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    socketRef.current?.emit("sendMessage", {
      senderId: myId,
      receiverId: friendId,
      message: text,
    });
    setInput("");
  };

  const onInputChange = (e) => {
    const val = e.target.value;
    setInput(val);
    // Emit typing notification (lightweight)
    if (val) {
      socketRef.current?.emit('typing', { senderId: myId, receiverId: friendId });
    }
  };

  const name = friend?.name || "Unknown";
  const email = friend?.email || "";

  return (
    <div className="flex flex-col h-full max-h-[72vh] border rounded-xl overflow-hidden bg-white">
      <div className="flex items-center justify-between border-b p-3">
        <div className="flex items-center gap-3">
          {friend?.profilePhoto?.url ? (
            <img src={friend.profilePhoto.url} alt={name} className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
              {(name || email || "?").slice(0, 1).toUpperCase()}
            </div>
          )}
          <div>
            <div className="font-semibold">{name}</div>
            <div className="text-sm text-gray-600">{email}</div>
            {isFriendTyping && (
              <div className="text-xs text-green-600">Typing...</div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
        {loading && <div className="text-gray-600">Loading messages...</div>}
        {!loading &&
          messages.map((m) => {
            const mine = String(m.senderId) === String(myId);
            return (
              <div key={m._id || `${m.senderId}-${m.createdAt}-${m.message}`} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] px-3 py-2 rounded-lg ${mine ? "bg-black text-white" : "bg-white border"}`}>
                  <div className="whitespace-pre-wrap break-words">{m.message}</div>
                  <div className={`text-[10px] mt-1 ${mine ? "text-gray-200" : "text-gray-500"}`}>
                    {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            );
          })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={onSend} className="border-t p-2 flex gap-2 bg-white">
        <input
          value={input}
          onChange={onInputChange}
          placeholder="Type a message..."
          className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
        />
        <button type="submit" className="px-4 py-2 rounded-lg border hover:bg-black hover:text-white transition-colors">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatDashboard;
