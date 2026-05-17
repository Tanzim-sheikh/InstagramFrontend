export const APP_NAME = "NexaChat";

export const getApiError = (err, fallback = "Something went wrong. Please try again.") => {
  const data = err?.response?.data;
  if (typeof data?.message === "string" && data.message.trim()) return data.message;
  if (Array.isArray(data?.errors) && data.errors.length) return data.errors.join(" ");
  if (err?.code === "ERR_NETWORK") return "Server se connect nahi ho pa raha. Backend URL ya network check karein.";
  return fallback;
};

export const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());

export const validatePassword = (password) => {
  if (!password) return "Password required hai.";
  if (password.length < 8) return "Password kam se kam 8 characters ka hona chahiye.";
  if (!/[A-Z]/.test(password)) return "Password mein ek uppercase letter hona chahiye.";
  if (!/[a-z]/.test(password)) return "Password mein ek lowercase letter hona chahiye.";
  if (!/\d/.test(password)) return "Password mein ek number hona chahiye.";
  return "";
};

export const validateAuthFields = ({ name, email, password, confirmPassword, otp, requireName = false, requirePassword = true, requireOtp = false }) => {
  const errors = {};
  if (requireName && (!name || name.trim().length < 2)) {
    errors.name = "Name kam se kam 2 characters ka hona chahiye.";
  }
  if (!email || !isValidEmail(email)) {
    errors.email = "Valid email address enter karein.";
  }
  if (requirePassword) {
    const passwordError = validatePassword(password);
    if (passwordError) errors.password = passwordError;
  }
  if (confirmPassword !== undefined && password !== confirmPassword) {
    errors.confirmPassword = "Passwords match nahi kar rahe.";
  }
  if (requireOtp && (!otp || String(otp).trim().length < 4)) {
    errors.otp = "Valid OTP enter karein.";
  }
  return errors;
};

export const hasErrors = (errors) => Object.keys(errors).length > 0;
