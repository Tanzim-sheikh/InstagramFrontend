import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import api from '../api/client';
import InstaLogo from '../assets/instagram.png';
import { getSocket, registerSocketUser } from '../lib/socket';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unreadTotal, setUnreadTotal] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  const onLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    let mounted = true;
    const fetchUnread = async () => {
      try {
        const { data } = await api.get('/unread-summary');
        if (mounted) setUnreadTotal(Number(data?.total || 0));
      } catch (_) {}
    };
    if (user?.id || user?._id) {
      registerSocketUser(user.id || user._id);
      fetchUnread();
      const s = getSocket();
      const onInc = () => fetchUnread();
      const onRead = () => fetchUnread();
      s.on('unreadIncrement', onInc);
      window.addEventListener('conversationRead', onRead);
      return () => {
        s.off('unreadIncrement', onInc);
        window.removeEventListener('conversationRead', onRead);
      };
    }
  }, [user]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 py-2.5 grid grid-cols-3 items-center gap-4">
        {/* Left: Brand (aligned start) */}
        <div className="flex items-center justify-start">
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img src={InstaLogo} alt="Instagram" className="w-10 h-10" />
            <span className="text-xl font-semibold">Instagram</span>
          </Link>
        </div>

        {/* Center: Primary nav (centered) */}
        <div className="flex items-center justify-center">
          <nav className="hidden md:flex items-center gap-2 text-sm text-gray-700">
            <Link to="/" className="px-3 py-1.5 rounded-md hover:bg-gray-100 hover:text-black transition">Home</Link>
            <Link to="/about" className="px-3 py-1.5 rounded-md hover:bg-gray-100 hover:text-black transition">About</Link>
            <Link to="/speciality" className="px-3 py-1.5 rounded-md hover:bg-gray-100 hover:text-black transition">Speciality</Link>
          </nav>
        </div>

        {/* Right: User actions (aligned end) */}
        <div className="flex items-center justify-end">
          {!user ? (
            <nav className="hidden md:flex gap-2 shrink-0">
              <Link to="/login" className="px-3 py-1.5 rounded-md bg-black text-white">Login</Link>
              <Link to="/signup" className="px-3 py-1.5 rounded-md border">Signup</Link>
            </nav>
          ) : (
            <div className="hidden md:flex items-center gap-4 shrink-0">
              <nav className="flex items-center gap-2 text-sm text-gray-700">
                <div className="relative">
                  <Link to="/chat" className="px-3 py-1.5 rounded-md hover:bg-gray-100 hover:text-black transition">Chat</Link>
                  {unreadTotal > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
                  )}
                </div>
                <Link to="/friends" className="px-3 py-1.5 rounded-md hover:bg-gray-100 hover:text-black transition">Friends</Link>
              </nav>
              <Link to="/profile" title="My Profile" className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-gray-100 transition">
                {user?.profilePhoto?.url ? (
                  <img src={user.profilePhoto.url} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-200" />
                )}
                <span className="hidden sm:inline text-sm font-medium truncate max-w-[120px]">{user.name}</span>
              </Link>
              <button onClick={onLogout} className="px-3 py-1.5 rounded-md border hover:bg-gray-100 transition">Logout</button>
            </div>
          )}
          <button
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-md border"
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Toggle menu"
          >
            <span className="block w-5 h-0.5 bg-black" />
            <span className="block w-5 h-0.5 bg-black mt-1.5" />
            <span className="block w-5 h-0.5 bg-black mt-1.5" />
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-2">
            <nav className="flex flex-col text-sm text-gray-700">
              <Link to="/" className="px-3 py-2 rounded-md hover:bg-gray-100" onClick={() => setMobileOpen(false)}>Home</Link>
              <Link to="/about" className="px-3 py-2 rounded-md hover:bg-gray-100" onClick={() => setMobileOpen(false)}>About</Link>
              <Link to="/speciality" className="px-3 py-2 rounded-md hover:bg-gray-100" onClick={() => setMobileOpen(false)}>Speciality</Link>
            </nav>
            {!user ? (
              <div className="flex gap-2">
                <Link to="/login" className="flex-1 px-3 py-2 rounded-md bg-black text-white text-center" onClick={() => setMobileOpen(false)}>Login</Link>
                <Link to="/signup" className="flex-1 px-3 py-2 rounded-md border text-center" onClick={() => setMobileOpen(false)}>Signup</Link>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  {user?.profilePhoto?.url ? (
                    <img src={user.profilePhoto.url} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200" />
                  )}
                  <span className="text-sm font-medium">{user.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Link to="/chat" className="relative px-3 py-2 rounded-md border flex-1 text-center" onClick={() => setMobileOpen(false)}>
                    Chat
                    {unreadTotal > 0 && (
                      <span className="absolute top-2 right-2 inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
                    )}
                  </Link>
                  <Link to="/friends" className="px-3 py-2 rounded-md border flex-1 text-center" onClick={() => setMobileOpen(false)}>Friends</Link>
                </div>
                <button onClick={() => { setMobileOpen(false); onLogout(); }} className="px-3 py-2 rounded-md border">Logout</button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
