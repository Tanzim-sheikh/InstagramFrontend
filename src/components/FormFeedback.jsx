import React from "react";

export const FieldError = ({ message }) => (
  message ? <p className="mt-1 text-sm font-medium text-rose-600">{message}</p> : null
);

export const Alert = ({ type = "error", children }) => {
  if (!children) return null;
  const tone = type === "success"
    ? "border-teal-200 bg-teal-50 text-teal-800"
    : "border-rose-200 bg-rose-50 text-rose-700";
  return <div className={`rounded-md border px-3 py-2 text-sm font-medium ${tone}`}>{children}</div>;
};
