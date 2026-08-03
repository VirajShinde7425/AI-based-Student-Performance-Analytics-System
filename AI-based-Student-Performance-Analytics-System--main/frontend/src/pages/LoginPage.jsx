import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { BrainCircuit, Lock, Mail, ShieldCheck, Sparkles, ArrowRight, UserCheck } from 'lucide-react';

export const LoginPage = () => {
  const { loginUser } = useApp();
  const { addToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Teacher");
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!email) {
    addToast(
      "Validation Error",
      "Please enter your institutional email address.",
      "warning"
    );
    return;
  }

  if (!password) {
    addToast(
      "Validation Error",
      "Please enter your password.",
      "warning"
    );
    return;
  }

  try {

    await loginUser(email, password, role);

    addToast(
        "Welcome Back",
        `Logged in successfully as ${role}.`,
        "success"
    );

  } catch (err) {

    addToast(
      "Login Failed",
      err.response?.data?.message || "Unable to login.",
      "error"
    );

  }
};

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        
        {/* Left Side: Educational Analytics Illustration Banner */}
        <div className="lg:col-span-6 bg-gradient-to-br from-primary-700 via-primary-600 to-blue-600 p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Background Decorative Pattern */}
          <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute -left-16 -top-16 w-80 h-80 bg-blue-400/20 rounded-full blur-2xl pointer-events-none"></div>

          {/* Top Logo */}
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg">
              <BrainCircuit className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="font-extrabold text-xl tracking-tight">EduMetrics AI</h1>
              <p className="text-xs font-medium text-blue-100">Institutional Analytics & Prediction System</p>
            </div>
          </div>

          {/* Center Visual Mock Card */}
          <div className="my-8 relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold">
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>AI Machine Learning Engine v2.4</span>
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight leading-tight">
              Transforming Student Success with Predictive Intelligence
            </h2>

            <p className="text-sm text-blue-100/90 leading-relaxed">
              Empower faculty and academic deans with real-time performance analytics, attendance heatmaps, and ML-driven early risk interventions.
            </p>

            {/* Feature Badges */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-xs">
                <span className="text-xs text-blue-200 block font-semibold">Model Confidence</span>
                <span className="text-xl font-black">94.8%</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-xs">
                <span className="text-xs text-blue-200 block font-semibold">Active Monitoring</span>
                <span className="text-xl font-black">1,280 Students</span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="relative z-10 text-xs text-blue-200/80 font-medium">
            © 2026 EduMetrics AI Platform. St. Xavier Institute of Technology.
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between bg-white dark:bg-slate-900">
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome Back</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Please sign in to access your EduMetrics AI dashboard.
              </p>
            </div>

            {/* Role Switcher */}
            <div className="mb-6 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center">
              <button
                type="button"
                onClick={() => {
                  setRole('Teacher');
                  setEmail('sarah.jenkins@institution.edu');
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  role === 'Teacher'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                }`}
              >
                Teacher Portal
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole('Student');
                  setEmail('lol@gmail.com');
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  role === 'Admin'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                }`}
              >
                Student Portal
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Institutional Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-primary-600 focus:ring-primary-500"
                  />
                  <span>Remember session</span>
                </label>
                <a href="#" onClick={(e) => { e.preventDefault(); addToast('Reset Link Sent', 'Password reset instructions mailed to your inbox.', 'info'); }} className="font-semibold text-primary-600 dark:text-primary-400 hover:underline">
                  Forgot Password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-primary-600/25 flex items-center justify-center gap-2 transition-all mt-2"
              >
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Quick Demo Bypass */}
          <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <button
              onClick={() => loginUser('sarah.jenkins@institution.edu', 'pass', 'Teacher')}
              className="text-xs font-semibold text-slate-500 hover:text-primary-600 dark:text-slate-400 flex items-center justify-center gap-1.5 mx-auto"
            >
              <UserCheck className="w-4 h-4 text-emerald-500" />
              <span>Quick Demo Access (Skip Credentials)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
