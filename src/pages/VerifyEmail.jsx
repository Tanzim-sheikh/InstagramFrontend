import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import AuthShell from "../components/AuthShell.jsx";
import { Alert, FieldError } from "../components/FormFeedback.jsx";
import { getApiError, hasErrors, validateAuthFields } from "../utils/formHelpers";

const inputClass = "w-full rounded-md border border-slate-300 px-3 py-3 text-slate-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyEmail, resendOtp } = useAuth();
  const [form, setForm] = useState({ email: location.state?.email || "", otp: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const update = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
    setFieldErrors((prev) => ({ ...prev, [key]: "" }));
    setError("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = validateAuthFields({ email: form.email, otp: form.otp, requirePassword: false, requireOtp: true });
    setFieldErrors(nextErrors);
    if (hasErrors(nextErrors)) return;

    setLoading(true);
    try {
      await verifyEmail(form.email.trim(), form.otp.trim());
      setSuccess("Email verified. Login page open ho raha hai.");
      setTimeout(() => navigate("/login"), 900);
    } catch (err) {
      setError(getApiError(err, "Verification failed."));
    } finally {
      setLoading(false);
    }
  };

  const onResend = async () => {
    const nextErrors = validateAuthFields({ email: form.email, requirePassword: false });
    setFieldErrors(nextErrors);
    if (hasErrors(nextErrors)) return;
    setResending(true);
    setError("");
    setSuccess("");
    try {
      await resendOtp(form.email.trim());
      setSuccess("Naya OTP email par bhej diya gaya hai.");
    } catch (err) {
      setError(getApiError(err, "OTP resend nahi ho paya."));
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthShell eyebrow="Email verification" title="Verify your account" subtitle="Signup ke baad email par bheja gaya OTP enter karein.">
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <Alert>{error}</Alert>
        <Alert type="success">{success}</Alert>
        <div>
          <label className="text-sm font-bold text-slate-700" htmlFor="email">Email</label>
          <input id="email" className={inputClass} placeholder="you@example.com" type="email" value={form.email} onChange={update("email")} />
          <FieldError message={fieldErrors.email} />
        </div>
        <div>
          <label className="text-sm font-bold text-slate-700" htmlFor="otp">OTP</label>
          <input id="otp" className={inputClass} placeholder="Enter verification code" value={form.otp} onChange={update("otp")} />
          <FieldError message={fieldErrors.otp} />
        </div>
        <button disabled={loading} className="w-full rounded-md bg-slate-950 px-4 py-3 text-sm font-bold text-white hover:bg-teal-600" type="submit">
          {loading ? "Verifying..." : "Verify email"}
        </button>
      </form>
      <div className="mt-5 flex items-center justify-between gap-3 text-sm">
        <button type="button" disabled={resending} onClick={onResend} className="font-bold text-teal-700 hover:text-teal-900">
          {resending ? "Sending..." : "Resend OTP"}
        </button>
        <Link to="/login" className="font-bold text-slate-950 hover:text-teal-700">Login</Link>
      </div>
    </AuthShell>
  );
};

export default VerifyEmail;
