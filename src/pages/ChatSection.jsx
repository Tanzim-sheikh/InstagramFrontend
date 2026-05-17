import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../api/client";
import ChatDashboard from "../components/ChatDashboard.jsx";
import { getApiError } from "../utils/formHelpers";

const ChatSection = () => {
  const { friendId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [friend, setFriend] = useState(location.state?.friend || null);
  const [loading, setLoading] = useState(!location.state?.friend);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    if (friend) return undefined;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get("/user/friends");
        const list = Array.isArray(data.friends) ? data.friends : [];
        const found = list.find((u) => String(u._id || u.id) === String(friendId));
        if (mounted) setFriend(found || null);
        if (mounted && !found) setError("Friend not found. Pehle friend request accept honi chahiye.");
      } catch (e) {
        if (mounted) setError(getApiError(e, "Chat load nahi ho pa raha."));
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [friend, friendId]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-teal-700">Private chat</p>
          <h1 className="text-2xl font-black tracking-tight text-slate-950">{friend?.name || "Conversation"}</h1>
        </div>
        <button onClick={() => navigate("/chat")} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:border-slate-950">
          Back
        </button>
      </div>

      {error && <div className="mb-4 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">{error}</div>}
      {loading && <div className="rounded-lg border border-slate-200 bg-white p-6 text-slate-600">Loading chat...</div>}
      {!loading && friend && <ChatDashboard friend={friend} />}
    </div>
  );
};

export default ChatSection;
