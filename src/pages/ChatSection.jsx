import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import api from '../api/client';
import ChatDashboard from '../components/ChatDashboard.jsx';

const ChatSection = () => {
  const { friendId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [friend, setFriend] = useState(location.state?.friend || null);
  const [loading, setLoading] = useState(!location.state?.friend);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    if (friend) return; // already provided via navigation state
    (async () => {
      setLoading(true);
      setError('');
      try {
        // Fallback: load friends and pick by id
        const { data } = await api.get('/user/friends');
        const list = Array.isArray(data.friends) ? data.friends : [];
        const f = list.find(u => String(u._id || u.id) === String(friendId));
        if (mounted) setFriend(f || null);
        if (mounted && !f) setError('Friend not found');
      } catch (e) {
        if (mounted) setError(e?.response?.data?.message || 'Failed to load chat');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false };
  }, [friend, friendId]);

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {friend?.profilePhoto?.url ? (
            <img src={friend.profilePhoto.url} alt={friend.name} className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
              {(friend?.name || friend?.email || '?').slice(0,1).toUpperCase()}
            </div>
          )}
          <div>
            <div className="text-lg font-semibold">{friend?.name || 'Unknown'}</div>
            <div className="text-sm text-gray-600">{friend?.email || ''}</div>
          </div>
        </div>
        <button onClick={() => navigate(-1)} className="px-3 py-1 rounded border hover:bg-black hover:text-white transition-colors hover:border-black border-2 rounded-lg">Back</button>
      </div>

      {error && <div className="text-red-600">{error}</div>}
      {loading && <div className="text-gray-600">Loading chat...</div>}

      {!loading && friend && (
        <ChatDashboard friend={friend} />
      )}
    </div>
  );
};

export default ChatSection;

