import React from "react";
import { APP_NAME } from "../utils/formHelpers";

const AuthShell = ({ eyebrow, title, subtitle, children }) => (
  <div className="mx-auto grid min-h-[calc(100vh-72px)] max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
    <section className="hidden lg:block">
      <div className="max-w-md">
        <div className="inline-flex rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-sm font-semibold text-teal-800">
          {APP_NAME} secure access
        </div>
        <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950">Private conversations start with a trusted identity.</h1>
        <p className="mt-4 leading-7 text-slate-600">
          OTP verification, friend-only messaging, and realtime chat states keep the app simple, professional, and safer for daily conversations.
        </p>
      </div>
    </section>

    <section className="mx-auto w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-bold uppercase tracking-wide text-teal-700">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{subtitle}</p>
      <div className="mt-6">{children}</div>
    </section>
  </div>
);

export default AuthShell;
