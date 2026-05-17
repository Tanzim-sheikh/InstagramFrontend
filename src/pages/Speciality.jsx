import React from "react";

const items = [
  ["Secure auth", "Email OTP verification, JWT sessions, aur strong password validation."],
  ["Private graph", "Users pehle request bhejte hain, accept hone ke baad hi chat open hoti hai."],
  ["Realtime signals", "Online/offline, typing, unread count, sent aur seen labels conversation ko clear banate hain."],
  ["Professional UI", "Responsive dashboard, focused forms, aur clean empty/error states."],
];

const Speciality = () => (
  <div className="mx-auto max-w-6xl px-4 py-10">
    <header className="max-w-3xl">
      <p className="text-sm font-bold uppercase tracking-wide text-teal-700">Security and workflow</p>
      <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">A chat app shaped around trust.</h1>
      <p className="mt-4 leading-8 text-slate-600">Har screen ka kaam direct hai: account verify karo, people discover karo, requests accept karo, aur private chat start karo.</p>
    </header>
    <section className="mt-8 grid gap-4 md:grid-cols-2">
      {items.map(([title, desc]) => (
        <div key={title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-black text-slate-950">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{desc}</p>
        </div>
      ))}
    </section>
  </div>
);

export default Speciality;
