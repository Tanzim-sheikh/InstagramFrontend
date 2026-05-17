import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import AuthShell from "../components/AuthShell.jsx";
import { Alert, FieldError } from "../components/FormFeedback.jsx";
import { getApiError, isValidEmail } from "../utils/formHelpers";

const inputClass = "w-full rounded-md border border-slate-300 px-3 py-3 text-slate-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100";

const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!isValidEmail(email)) {
      setEmailError("Valid email address enter karein.");
      return;
    }
    setLoading(true);
    try {
      await forgotPassword(email.trim());
      navigate("/reset", { state: { email: email.trim() } });
    } catch (err) {
      setError(getApiError(err, "Reset code send nahi ho paya."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell eyebrow="Password recovery" title="Reset code bhejein" subtitle="Apna registered email enter karein. Agar account exist karta hai toh OTP reset code milega.">
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <Alert>{error}</Alert>
        <div>
          <label className="text-sm font-bold text-slate-700" htmlFor="email">Email</label>
          <input id="email" className={inputClass} placeholder="you@example.com" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setEmailError(""); setError(""); }} />
          <FieldError message={emailError} />
        </div>
        <button disabled={loading} className="w-full rounded-md bg-slate-950 px-4 py-3 text-sm font-bold text-white hover:bg-teal-600" type="submit">
          {loading ? "Sending code..." : "Send reset code"}
        </button>
      </form>
      <p className="mt-5 text-center text-sm text-slate-600">
        Password yaad aa gaya? <Link to="/login" className="font-bold text-slate-950 hover:text-teal-700">Login</Link>
      </p>
    </AuthShell>
  );
};

export default ForgotPassword;
