import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import AuthShell from "../components/AuthShell.jsx";
import { Alert, FieldError } from "../components/FormFeedback.jsx";
import { getApiError, hasErrors, validateAuthFields } from "../utils/formHelpers";

const inputClass = "w-full rounded-md border border-slate-300 px-3 py-3 text-slate-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100";

const ResetPassword = () => {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: location.state?.email || "", otp: "", password: "", confirmPassword: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const update = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
    setFieldErrors((prev) => ({ ...prev, [key]: "" }));
    setError("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    const nextErrors = validateAuthFields({ email: form.email, otp: form.otp, password: form.password, confirmPassword: form.confirmPassword, requireOtp: true });
    setFieldErrors(nextErrors);
    if (hasErrors(nextErrors)) return;

    setLoading(true);
    try {
      await resetPassword(form.email.trim(), form.otp.trim(), form.password);
      setSuccess("Password reset ho gaya. Ab login kar sakte hain.");
      setTimeout(() => navigate("/login"), 900);
    } catch (err) {
      setError(getApiError(err, "Password reset failed."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell eyebrow="New password" title="Reset password" subtitle="Email par aaye OTP ke saath strong password set karein.">
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
          <input id="otp" className={inputClass} placeholder="Enter reset code" value={form.otp} onChange={update("otp")} />
          <FieldError message={fieldErrors.otp} />
        </div>
        <div>
          <label className="text-sm font-bold text-slate-700" htmlFor="password">New password</label>
          <input id="password" className={inputClass} placeholder="Minimum 8 characters" type="password" value={form.password} onChange={update("password")} />
          <FieldError message={fieldErrors.password} />
        </div>
        <div>
          <label className="text-sm font-bold text-slate-700" htmlFor="confirmPassword">Confirm password</label>
          <input id="confirmPassword" className={inputClass} placeholder="Repeat password" type="password" value={form.confirmPassword} onChange={update("confirmPassword")} />
          <FieldError message={fieldErrors.confirmPassword} />
        </div>
        <button disabled={loading} className="w-full rounded-md bg-slate-950 px-4 py-3 text-sm font-bold text-white hover:bg-teal-600" type="submit">
          {loading ? "Resetting..." : "Reset password"}
        </button>
      </form>
      <p className="mt-5 text-center text-sm text-slate-600">
        Code nahi mila? <Link to="/forgot" className="font-bold text-slate-950 hover:text-teal-700">Send again</Link>
      </p>
    </AuthShell>
  );
};

export default ResetPassword;
