import React, { useEffect, useState } from 'react';
import api from '../api/client';

const Requests = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get('/user/requests');
        if (!mounted) return;
        setReceived(Array.isArray(data.received) ? data.received : []);
        setSent(Array.isArray(data.sent) ? data.sent : []);
      } catch (e) {
        if (mounted) setError(e?.response?.data?.message || 'Failed to load requests');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false };
  }, []);

  const respond = async (requesterId, action) => {
    try {
      await api.post('/user/respond-friend', { requesterId, action });
      setReceived(prev => prev.filter(u => (u._id || u.id) !== requesterId));
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to respond');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Friend Requests</h2>
      </div>

      {error && <div className="text-red-600">{error}</div>}
      {loading && <div className="text-gray-600">Loading requests...</div>}

      {!loading && (
        <>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Received</h3>
            <ul className="divide-y rounded-xl border bg-white">
              {received.map((u) => (
                <li key={u._id || u.id} className="p-3 flex items-center justify-between gap-3">
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
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => respond(u._id || u.id, 'accept')} className="px-3 py-1 rounded border hover:bg-black hover:text-white transition-colors hover:border-black border-2 rounded-lg">Accept</button>
                    <button onClick={() => respond(u._id || u.id, 'decline')} className="px-3 py-1 rounded border hover:bg-black hover:text-white transition-colors hover:border-black border-2 rounded-lg">Decline</button>
                  </div>
                </li>
              ))}
              {received.length === 0 && (
                <li className="p-4 text-gray-600">No requests</li>
              )}
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Sent</h3>
            <ul className="divide-y rounded-xl border bg-white">
              {sent.map((u) => (
                <li key={u._id || u.id} className="p-3 flex items-center justify-between gap-3">
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
                  <div className="text-sm text-gray-600 shrink-0">Pending</div>
                </li>
              ))}
              {sent.length === 0 && (
                <li className="p-4 text-gray-600">No pending sent requests</li>
              )}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default Requests;
