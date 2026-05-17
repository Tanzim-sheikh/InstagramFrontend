import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import api from "../api/client";
import { APP_NAME } from "../utils/formHelpers";
import { getSocket, registerSocketUser } from "../lib/socket";

const navClass = ({ isActive }) =>
  `px-3 py-2 rounded-md text-sm font-medium ${
    isActive ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
  }`;

const Brand = () => (
  <Link to="/" className="flex items-center gap-3">
    <span className="grid h-10 w-10 place-items-center rounded-lg bg-teal-500 text-base font-black text-white shadow-sm">
      N
    </span>
    <span className="text-xl font-black tracking-tight text-slate-950">{APP_NAME}</span>
  </Link>
);

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unreadTotal, setUnreadTotal] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  const onLogout = () => {
    logout();
    setMobileOpen(false);
    navigate("/");
  };

  useEffect(() => {
    let mounted = true;
    const fetchUnread = async () => {
      try {
        const { data } = await api.get("/unread-summary");
        if (mounted) setUnreadTotal(Number(data?.total || 0));
      } catch {
        if (mounted) setUnreadTotal(0);
      }
    };

    if (user?.id || user?._id) {
      registerSocketUser(user.id || user._id);
      fetchUnread();
      const s = getSocket();
      const onInc = () => fetchUnread();
      const onRead = () => fetchUnread();
      s?.on("unreadIncrement", onInc);
      window.addEventListener("conversationRead", onRead);
      return () => {
        mounted = false;
        s?.off("unreadIncrement", onInc);
        window.removeEventListener("conversationRead", onRead);
      };
    }
    setUnreadTotal(0);
    return () => {
      mounted = false;
    };
  }, [user]);

  const authedLinks = (
    <>
      <NavLink to="/chat" className={navClass} onClick={() => setMobileOpen(false)}>
        <span className="relative inline-flex">
          Chats
          {unreadTotal > 0 && <span className="absolute -right-3 -top-1 h-2.5 w-2.5 rounded-full bg-teal-400" />}
        </span>
      </NavLink>
      <NavLink to="/friends" className={navClass} onClick={() => setMobileOpen(false)}>Friends</NavLink>
      <NavLink to="/find-friends" className={navClass} onClick={() => setMobileOpen(false)}>Discover</NavLink>
      <NavLink to="/requests" className={navClass} onClick={() => setMobileOpen(false)}>Requests</NavLink>
    </>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Brand />

        <nav className="hidden items-center gap-1 md:flex">
          <NavLink to="/" className={navClass}>Home</NavLink>
          {user ? authedLinks : (
            <>
              <NavLink to="/about" className={navClass}>About</NavLink>
              <NavLink to="/speciality" className={navClass}>Security</NavLink>
            </>
          )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {!user ? (
            <>
              <Link to="/login" className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:border-slate-900">
                Login
              </Link>
              <Link to="/signup" className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-600">
                Create account
              </Link>
            </>
          ) : (
            <>
              <Link to="/profile" className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-slate-100">
                {user?.profilePhoto?.url ? (
                  <img src={user.profilePhoto.url} alt={user.name} className="h-9 w-9 rounded-full object-cover" />
                ) : (
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-slate-200 text-sm font-bold text-slate-700">
                    {(user.name || "U").slice(0, 1).toUpperCase()}
                  </span>
                )}
                <span className="max-w-28 truncate text-sm font-semibold text-slate-800">{user.name}</span>
              </Link>
              <button onClick={onLogout} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700">
                Logout
              </button>
            </>
          )}
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-md border border-slate-300 md:hidden"
          onClick={() => setMobileOpen((value) => !value)}
          aria-label="Toggle navigation"
          aria-expanded={mobileOpen}
        >
          <span className="text-xl font-bold">{mobileOpen ? "x" : "="}</span>
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4">
            <NavLink to="/" className={navClass} onClick={() => setMobileOpen(false)}>Home</NavLink>
            {user ? authedLinks : (
              <>
                <NavLink to="/about" className={navClass} onClick={() => setMobileOpen(false)}>About</NavLink>
                <NavLink to="/speciality" className={navClass} onClick={() => setMobileOpen(false)}>Security</NavLink>
                <Link to="/login" className="rounded-md border border-slate-300 px-4 py-2 text-center text-sm font-semibold" onClick={() => setMobileOpen(false)}>Login</Link>
                <Link to="/signup" className="rounded-md bg-slate-950 px-4 py-2 text-center text-sm font-semibold text-white" onClick={() => setMobileOpen(false)}>Create account</Link>
              </>
            )}
            {user && <button onClick={onLogout} className="rounded-md border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700">Logout</button>}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
