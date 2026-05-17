import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import AuthShell from "../components/AuthShell.jsx";
import { Alert, FieldError } from "../components/FormFeedback.jsx";
import { getApiError, hasErrors, isValidEmail } from "../utils/formHelpers";

const inputClass = "w-full rounded-md border border-slate-300 px-3 py-3 text-slate-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
    setFieldErrors((prev) => ({ ...prev, [key]: "" }));
    setError("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = {};
    if (!isValidEmail(form.email)) nextErrors.email = "Valid email address enter karein.";
    if (!form.password) nextErrors.password = "Password required hai.";
    setFieldErrors(nextErrors);
    if (hasErrors(nextErrors)) return;

    setLoading(true);
    try {
      await login(form.email.trim(), form.password);
      navigate("/");
    } catch (err) {
      setError(getApiError(err, "Login failed. Email/password check karein."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell eyebrow="Login" title="Welcome back" subtitle="Apne verified account se secure chat dashboard open karein.">
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <Alert>{error}</Alert>
        <div>
          <label className="text-sm font-bold text-slate-700" htmlFor="email">Email</label>
          <input id="email" className={inputClass} placeholder="you@example.com" type="email" value={form.email} onChange={update("email")} />
          <FieldError message={fieldErrors.email} />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-slate-700" htmlFor="password">Password</label>
            <Link to="/forgot" className="text-sm font-semibold text-teal-700 hover:text-teal-900">Forgot?</Link>
          </div>
          <input id="password" className={inputClass} placeholder="Enter password" type="password" value={form.password} onChange={update("password")} />
          <FieldError message={fieldErrors.password} />
        </div>
        <button disabled={loading} className="w-full rounded-md bg-slate-950 px-4 py-3 text-sm font-bold text-white hover:bg-teal-600" type="submit">
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
      <p className="mt-5 text-center text-sm text-slate-600">
        Account nahi hai? <Link to="/signup" className="font-bold text-slate-950 hover:text-teal-700">Create account</Link>
      </p>
    </AuthShell>
  );
};

export default Login;
