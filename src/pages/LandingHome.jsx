import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { APP_NAME } from "../utils/formHelpers";

const Metric = ({ value, label }) => (
  <div>
    <div className="text-2xl font-black text-slate-950">{value}</div>
    <div className="mt-1 text-sm text-slate-500">{label}</div>
  </div>
);

const DashboardHome = ({ user }) => (
  <div className="mx-auto max-w-6xl px-4 py-8">
    <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold text-teal-700">Welcome back</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Hi {user?.name || "there"}, conversations are ready.</h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Find friends, accept requests, and continue secure one-to-one chats with live online status, typing updates, and message read state.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/chat" className="rounded-md bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-teal-600">Open chats</Link>
          <Link to="/find-friends" className="rounded-md border border-slate-300 px-5 py-3 text-sm font-bold text-slate-800 hover:border-slate-950">Find friends</Link>
          <Link to="/requests" className="rounded-md border border-slate-300 px-5 py-3 text-sm font-bold text-slate-800 hover:border-slate-950">Requests</Link>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
        <div className="text-sm font-semibold text-teal-200">Account status</div>
        <div className="mt-5 flex items-center gap-3">
          {user?.profilePhoto?.url ? (
            <img src={user.profilePhoto.url} alt={user.name} className="h-14 w-14 rounded-full object-cover" />
          ) : (
            <span className="grid h-14 w-14 place-items-center rounded-full bg-teal-500 text-lg font-black">
              {(user?.name || "U").slice(0, 1).toUpperCase()}
            </span>
          )}
          <div className="min-w-0">
            <div className="truncate text-lg font-bold">{user?.name}</div>
            <div className="truncate text-sm text-slate-300">{user?.email}</div>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-4 border-t border-white/10 pt-5">
          <Metric value="Live" label="presence" />
          <Metric value="1:1" label="private chat" />
          <Metric value="OTP" label="secure auth" />
        </div>
      </div>
    </section>
  </div>
);

const LandingHome = () => {
  const { user } = useAuth();

  if (user) return <DashboardHome user={user} />;

  return (
    <div>
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <div className="inline-flex rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-sm font-semibold text-teal-800">
              Secure realtime chat for trusted friends
            </div>
            <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              {APP_NAME}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Ek professional messaging app jahan users friend request accept hone ke baad private chat kar sakte hain. Login secure hai, messages clean interface mein milte hain, aur realtime status se conversation natural feel hoti hai.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/signup" className="rounded-md bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-teal-600">Start chatting</Link>
              <Link to="/login" className="rounded-md border border-slate-300 px-5 py-3 text-sm font-bold text-slate-800 hover:border-slate-950">Login</Link>
            </div>
            <div className="mt-9 grid max-w-xl grid-cols-3 gap-5">
              <Metric value="OTP" label="email verification" />
              <Metric value="Live" label="typing and online" />
              <Metric value="Private" label="friend-only chats" />
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-950 p-4 shadow-xl">
            <div className="rounded-md bg-white p-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <div className="text-sm font-bold text-slate-950">Secure Room</div>
                  <div className="text-xs text-teal-700">Riya is typing...</div>
                </div>
                <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-bold text-teal-800">Online</span>
              </div>
              <div className="space-y-3 py-5">
                <div className="max-w-[78%] rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  Friend request accepted. Chat start karein?
                </div>
                <div className="ml-auto max-w-[78%] rounded-lg bg-slate-950 px-4 py-3 text-sm text-white">
                  Haan, secure room ready hai.
                  <div className="mt-1 text-right text-[11px] text-slate-300">Seen 10:42</div>
                </div>
                <div className="max-w-[70%] rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  Perfect. Flow clean lag raha hai.
                </div>
              </div>
              <div className="flex gap-2 border-t border-slate-100 pt-4">
                <div className="h-10 flex-1 rounded-md border border-slate-200 bg-slate-50" />
                <div className="h-10 w-20 rounded-md bg-teal-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-10 md:grid-cols-3">
        {[
          ["Verified access", "Signup ke baad OTP verification se fake access reduce hota hai."],
          ["Friend-first chat", "Chat sirf accepted friends ke beech open hoti hai."],
          ["Realtime workflow", "Online/offline, typing, unread aur seen state dashboard mein visible hai."],
        ].map(([title, text]) => (
          <div key={title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-black text-slate-950">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default LandingHome;
