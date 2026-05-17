import React from "react";
import { APP_NAME } from "../utils/formHelpers";

const About = () => (
  <div className="mx-auto max-w-6xl px-4 py-10">
    <section className="max-w-3xl">
      <p className="text-sm font-bold uppercase tracking-wide text-teal-700">About</p>
      <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">{APP_NAME} is built for trusted private chat.</h1>
      <p className="mt-4 leading-8 text-slate-600">
        Yeh MERN stack app users ko verified account, friend request workflow, aur realtime one-to-one messaging provide karta hai. Goal simple hai: clean dashboard, secure auth, aur chat experience jo daily use ke liye professional feel kare.
      </p>
    </section>

    <section className="mt-8 grid gap-4 md:grid-cols-3">
      {[
        ["Verified identity", "Signup ke baad OTP email verification required hai."],
        ["Friend approval", "Chat sirf accepted friends ke beech available hoti hai."],
        ["Realtime messaging", "Socket.io se online, typing, unread aur sent/seen states support hote hain."],
      ].map(([title, text]) => (
        <div key={title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-black text-slate-950">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
        </div>
      ))}
    </section>
  </div>
);

export default About;
