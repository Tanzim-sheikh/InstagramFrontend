import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import AuthShell from "../components/AuthShell.jsx";
import { Alert, FieldError } from "../components/FormFeedback.jsx";
import { getApiError, hasErrors, validateAuthFields } from "../utils/formHelpers";

const inputClass = "w-full rounded-md border border-slate-300 px-3 py-3 text-slate-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100";

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [formState, setFormState] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [file, setFile] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (key) => (e) => {
    setFormState((prev) => ({ ...prev, [key]: e.target.value }));
    setFieldErrors((prev) => ({ ...prev, [key]: "" }));
    setError("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = validateAuthFields({ ...formState, requireName: true });
    setFieldErrors(nextErrors);
    if (hasErrors(nextErrors)) return;

    setLoading(true);
    try {
      const form = new FormData();
      form.append("name", formState.name.trim());
      form.append("email", formState.email.trim());
      form.append("password", formState.password);
      if (file) form.append("profilePhoto", file);
      await signup(form);
      navigate("/verify-email", { state: { email: formState.email.trim() } });
    } catch (err) {
      setError(getApiError(err, "Signup failed. Details check karke dobara try karein."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell eyebrow="Create account" title="Start secure chatting" subtitle="Profile create karein, email verify karein, aur friends ke saath private chat start karein.">
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <Alert>{error}</Alert>
        <div>
          <label className="text-sm font-bold text-slate-700" htmlFor="name">Full name</label>
          <input id="name" className={inputClass} placeholder="Your name" value={formState.name} onChange={update("name")} />
          <FieldError message={fieldErrors.name} />
        </div>
        <div>
          <label className="text-sm font-bold text-slate-700" htmlFor="email">Email</label>
          <input id="email" className={inputClass} placeholder="you@example.com" type="email" value={formState.email} onChange={update("email")} />
          <FieldError message={fieldErrors.email} />
        </div>
        <div>
          <label className="text-sm font-bold text-slate-700" htmlFor="password">Password</label>
          <input id="password" className={inputClass} placeholder="Minimum 8 characters" type="password" value={formState.password} onChange={update("password")} />
          <FieldError message={fieldErrors.password} />
        </div>
        <div>
          <label className="text-sm font-bold text-slate-700" htmlFor="confirmPassword">Confirm password</label>
          <input id="confirmPassword" className={inputClass} placeholder="Repeat password" type="password" value={formState.confirmPassword} onChange={update("confirmPassword")} />
          <FieldError message={fieldErrors.confirmPassword} />
        </div>
        <div>
          <label className="text-sm font-bold text-slate-700" htmlFor="profilePhoto">Profile photo</label>
          <input id="profilePhoto" className="w-full rounded-md border border-dashed border-slate-300 px-3 py-3 text-sm text-slate-700" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </div>
        <button disabled={loading} className="w-full rounded-md bg-slate-950 px-4 py-3 text-sm font-bold text-white hover:bg-teal-600" type="submit">
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>
      <p className="mt-5 text-center text-sm text-slate-600">
        Already registered? <Link to="/login" className="font-bold text-slate-950 hover:text-teal-700">Login</Link>
      </p>
    </AuthShell>
  );
};

export default Signup;
