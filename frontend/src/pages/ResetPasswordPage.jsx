import React, { useMemo, useState } from "react";
import { ArrowLeft, BrainCircuit, CheckCircle2, Lock, ShieldCheck } from "lucide-react";
import api from "../services/api";

export const ResetPasswordPage = () => {
  const token = useMemo(() => {
    const hash = window.location.hash || "";
    const queryIndex = hash.indexOf("?");
    if (queryIndex === -1) return "";
    return new URLSearchParams(hash.slice(queryIndex + 1)).get("token") || "";
  }, []);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setStatus("error");
      setMessage("This password reset link is missing or invalid.");
      return;
    }

    if (newPassword.length < 8) {
      setStatus("error");
      setMessage(
        "Password must be at least 8 characters and contain uppercase, lowercase, number and special character."
      );
      return;
    }

    if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=])/.test(
        newPassword
      )
    ) {
      setStatus("error");
      setMessage(
        "Password must contain uppercase, lowercase, number and special character."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatus("error");
      setMessage("New password and confirmation password do not match.");
      return;
    }

    try {
      setStatus("loading");

      const response = await api.post("/api/Auth/reset-password", {
        token,
        newPassword,
        confirmPassword
      });

      setStatus("success");
      setMessage(
        response.data?.message ||
          "Password reset successfully. You can now log in."
      );
    } catch (err) {
      setStatus("error");
      setMessage(
        err.response?.data?.message ||
          "This reset link is invalid or expired. Please request a new one."
      );
    }
  };

  const goToLogin = () => {
    window.location.hash = "";
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8">
        <div className="flex justify-center mb-5">
          <div className="w-14 h-14 rounded-2xl bg-primary-600 flex items-center justify-center shadow-lg">
            <BrainCircuit className="w-8 h-8 text-white" />
          </div>
        </div>

        <div className="text-center mb-7">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Reset Password
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Create a new password for your EduMetrics AI account.
          </p>
        </div>

        {status === "success" ? (
          <div className="text-center">
            <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto mb-4" />
            <p className="text-sm text-slate-700 dark:text-slate-300 mb-6">
              {message}
            </p>
            <button
              type="button"
              onClick={goToLogin}
              className="w-full py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {!token && (
              <div className="rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 p-3 text-xs text-red-700 dark:text-red-300">
                This page must be opened from the password reset email.
              </div>
            )}

            {status === "error" && (
              <div className="rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 p-3 text-xs text-red-700 dark:text-red-300">
                {message}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={status === "loading" || !token}
              className="w-full py-3 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-bold text-sm"
            >
              {status === "loading" ? "Updating Password..." : "Update Password"}
            </button>

            <button
              type="button"
              onClick={goToLogin}
              className="w-full text-xs font-semibold text-slate-500 hover:text-primary-600 flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
