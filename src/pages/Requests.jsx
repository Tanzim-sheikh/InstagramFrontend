// import React, { useEffect, useState } from 'react';
// import api from '../api/client';

// const Requests = () => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [received, setReceived] = useState([]);
//   const [sent, setSent] = useState([]);

//   useEffect(() => {
//     let mounted = true;
//     (async () => {
//       setLoading(true);
//       setError('');
//       try {
//         const { data } = await api.get('/user/requests');
//         if (!mounted) return;
//         setReceived(Array.isArray(data.received) ? data.received : []);
//         setSent(Array.isArray(data.sent) ? data.sent : []);
//       } catch (e) {
//         if (mounted) setError(e?.response?.data?.message || 'Failed to load requests');
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     })();
//     return () => { mounted = false };
//   }, []);

//   const respond = async (requesterId, action) => {
//     try {
//       await api.post('/user/respond-friend', { requesterId, action });
//       setReceived(prev => prev.filter(u => (u._id || u.id) !== requesterId));
//     } catch (e) {
//       setError(e?.response?.data?.message || 'Failed to respond');
//     }
//   };

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center justify-between">
//         <h2 className="text-2xl font-semibold">Friend Requests</h2>
//       </div>

//       {error && <div className="text-red-600">{error}</div>}
//       {loading && <div className="text-gray-600">Loading requests...</div>}

//       {!loading && (
//         <>
//           <div className="space-y-2">
//             <h3 className="text-lg font-semibold">Received</h3>
//             <ul className="divide-y rounded-xl border bg-white">
//               {received.map((u) => (
//                 <li key={u._id || u.id} className="p-3 flex items-center justify-between gap-3">
//                   <div className="flex items-center gap-3 min-w-0">
//                     {u?.profilePhoto?.url ? (
//                       <img src={u.profilePhoto.url} alt={u.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
//                     ) : (
//                       <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium shrink-0">
//                         {(u.name || u.email || '?').slice(0,1).toUpperCase()}
//                       </div>
//                     )}
//                     <div className="min-w-0">
//                       <div className="font-medium truncate">{u.name || 'Unnamed'}</div>
//                       <div className="text-sm text-gray-600 truncate">{u.email}</div>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-2 shrink-0">
//                     <button onClick={() => respond(u._id || u.id, 'accept')} className="px-3 py-1 rounded border hover:bg-black hover:text-white transition-colors hover:border-black border-2 rounded-lg">Accept</button>
//                     <button onClick={() => respond(u._id || u.id, 'decline')} className="px-3 py-1 rounded border hover:bg-black hover:text-white transition-colors hover:border-black border-2 rounded-lg">Decline</button>
//                   </div>
//                 </li>
//               ))}
//               {received.length === 0 && (
//                 <li className="p-4 text-gray-600">No requests</li>
//               )}
//             </ul>
//           </div>

//           <div className="space-y-2">
//             <h3 className="text-lg font-semibold">Sent</h3>
//             <ul className="divide-y rounded-xl border bg-white">
//               {sent.map((u) => (
//                 <li key={u._id || u.id} className="p-3 flex items-center justify-between gap-3">
//                   <div className="flex items-center gap-3 min-w-0">
//                     {u?.profilePhoto?.url ? (
//                       <img src={u.profilePhoto.url} alt={u.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
//                     ) : (
//                       <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium shrink-0">
//                         {(u.name || u.email || '?').slice(0,1).toUpperCase()}
//                       </div>
//                     )}
//                     <div className="min-w-0">
//                       <div className="font-medium truncate">{u.name || 'Unnamed'}</div>
//                       <div className="text-sm text-gray-600 truncate">{u.email}</div>
//                     </div>
//                   </div>
//                   <div className="text-sm text-gray-600 shrink-0">Pending</div>
//                 </li>
//               ))}
//               {sent.length === 0 && (
//                 <li className="p-4 text-gray-600">No pending sent requests</li>
//               )}
//             </ul>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default Requests;

import React, { useEffect, useState, useCallback } from 'react';
import api from '../api/client';

// Single request card component (reused for both received/sent)
const RequestCard = ({ user, type, onRespond }) => {
  const id = user._id || user.id;
  const displayName = user.name || 'Unnamed';
  const initial = (displayName || user.email || '?').slice(0, 1).toUpperCase();

  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b last:border-b-0">
      <div className="flex items-center gap-4">
        {/* Avatar with border */}
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

      {type === 'received' ? (
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => onRespond(id, 'accept')}
            className="px-4 py-2 rounded-lg font-medium transition-all duration-200 bg-white text-black border-2 border-gray-300 hover:bg-black hover:text-white hover:border-black shadow-sm"
          >
            Accept
          </button>
          <button
            onClick={() => onRespond(id, 'decline')}
            className="px-4 py-2 rounded-lg font-medium transition-all duration-200 bg-white text-black border-2 border-gray-300 hover:bg-black hover:text-white hover:border-black shadow-sm"
          >
            Decline
          </button>
        </div>
      ) : (
        <div className="px-4 py-2 rounded-lg bg-gray-100 text-gray-500 text-sm font-medium shadow-inner shrink-0">
          Pending
        </div>
      )}
    </div>
  );
};

// Main Component
const Requests = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);

  useEffect(() => {
    let mounted = true;
    const fetchRequests = async () => {
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
    };
    fetchRequests();
    return () => { mounted = false };
  }, []);

  const handleRespond = useCallback(async (requesterId, action) => {
    try {
      await api.post('/user/respond-friend', { requesterId, action });
      setReceived(prev => prev.filter(u => (u._id || u.id) !== requesterId));
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to respond');
      // Auto-clear error after 3 seconds
      setTimeout(() => setError(''), 3000);
    }
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Friend Requests</h2>
          <p className="text-gray-500 mt-1">Manage your pending requests</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-black"></div>
          <p className="text-gray-500 mt-3">Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Friend Requests</h2>
        <p className="text-gray-500 mt-1">Manage your pending requests</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-sm">
          {error}
        </div>
      )}

      {/* Received Requests Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-semibold text-gray-800">Received</h3>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {received.length}
          </span>
        </div>
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {received.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-gray-500">No pending requests</p>
              <p className="text-gray-400 text-sm mt-1">When someone adds you, it will show here</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {received.map((user) => (
                <RequestCard
                  key={user._id || user.id}
                  user={user}
                  type="received"
                  onRespond={handleRespond}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sent Requests Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-semibold text-gray-800">Sent</h3>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {sent.length}
          </span>
        </div>
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {sent.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="text-4xl mb-3">📤</div>
              <p className="text-gray-500">No sent requests</p>
              <p className="text-gray-400 text-sm mt-1">Requests you send will appear here</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {sent.map((user) => (
                <RequestCard
                  key={user._id || user.id}
                  user={user}
                  type="sent"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Requests;