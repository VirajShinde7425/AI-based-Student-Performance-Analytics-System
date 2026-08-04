import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import api from "../services/api";
import {
    validateProfile,
    validateInstitute,
} from "../validation/settingsValidation";
import { validatePassword } from "../validation/passwordValidation";

import {
  User,
  Building,
  Moon,
  Sun,
  Bell,
  Lock,
  Globe,
  Save,
  CheckCircle2,
  Sliders
} from 'lucide-react';

export const SettingsPage = () => {
  const { currentUser, darkMode, toggleDarkMode } = useApp();
  const { addToast } = useToast();

  const [profile, setProfile] = useState({
    name: currentUser.name,
    email: currentUser.email,
    title: currentUser.title || 'Senior Associate Professor',
    department: currentUser.department || 'Computer Science'
  });

  const [institute, setInstitute] = useState({
    name: "",
    accreditation: "",
    academicYear: "",
    attendanceThreshold: 75,
    flaskApiEndpoint: ""
});

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: true,
    aiRiskAlerts: true,
    weeklyDigest: false
  });

  const [passwords, setPasswords] = useState({
    current: '',
    newPass: '',
    confirmPass: ''
  });

  const [profileErrors, setProfileErrors] = useState({});

  const [instituteErrors, setInstituteErrors] = useState({});

  const [passwordErrors, setPasswordErrors] = useState({});

  const loadSettings = async () => {
    try {
        const response = await api.get("/Settings");

        const data = response.data;

        setInstitute({
            name: data.instituteName,
            accreditation: data.accreditationGrade,
            academicYear: data.academicYear,
            attendanceThreshold: data.lowAttendanceThreshold,
            flaskApiEndpoint: data.flaskApiEndpoint
        });

    } catch (err) {
        console.error("Unable to load settings.", err);
    }
};

useEffect(() => {
    loadSettings();
}, []);


  const handleSaveProfile = (e) => {

    e.preventDefault();

    const validationErrors = validateProfile(profile);

    if (Object.keys(validationErrors).length > 0)
    {
        setProfileErrors(validationErrors);

        addToast(
            "Validation Error",
            "Please correct the highlighted fields.",
            "warning"
        );

        return;
    }

    setProfileErrors({});

    addToast(
        "Profile Updated",
        "Your faculty profile settings have been saved.",
        "success"
    );
};

  const handleSaveInstitute = async (e) => {
    e.preventDefault();

    const validationErrors = validateInstitute(institute);

    if (Object.keys(validationErrors).length > 0)
    {
        setInstituteErrors(validationErrors);

        addToast(
            "Validation Error",
            "Please correct the highlighted fields.",
            "warning"
        );

        return;
    }

    setInstituteErrors({});

    try {

        await api.post("/Settings", {

            instituteName: institute.name,

            accreditationGrade: institute.accreditation,

            academicYear: institute.academicYear,

            lowAttendanceThreshold: institute.attendanceThreshold,

            flaskApiEndpoint: institute.flaskApiEndpoint

        });

        addToast(
            "Settings Saved",
            "Institutional configuration updated successfully.",
            "success"
        );

    } catch (err) {

        addToast(
            "Save Failed",
            "Unable to save settings.",
            "error"
        );

        console.error(err);
    }
};

 const handlePasswordReset = async (e) => {

    e.preventDefault();

    const validationErrors = validatePassword(passwords);

    if (Object.keys(validationErrors).length > 0)
    {
        setPasswordErrors(validationErrors);

        addToast(
            "Validation Error",
            "Please correct the highlighted fields.",
            "warning"
        );

        return;
    }

    setPasswordErrors({});

    try
    {
        const response = await api.post(
              "/Auth/change-password",
              {
                  currentPassword: passwords.current,
                  newPassword: passwords.newPass,
                  confirmPassword: passwords.confirmPass
              }
          );

        addToast(
            "Password Updated",
            response.data.message,
            "success"
        );

        setPasswords({
            current: "",
            newPass: "",
            confirmPass: ""
        });
    }
    catch (error)
    {
        addToast(
            "Password Update Failed",
            error.response?.data?.message ??
            "Unable to change password.",
            "error"
        );
    }
};

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Header */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          System & Faculty Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Configure profile details, institutional thresholds, theme preferences, and notification channels.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Column: Faculty Profile & Theme */}
        <div className="md:col-span-6 space-y-6">
          {/* Profile Form */}
          <div className="saas-card p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <User className="w-4 h-4 text-primary-600" /> Faculty Profile Details
            </h3>

            <form
                onSubmit={handleSaveProfile}
                noValidate
                className="space-y-3"
            >
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>

              <input
                type="text"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                className={`w-full px-3 py-2 text-xs rounded-xl ${
                  profileErrors.name
                    ? "border border-red-500 bg-red-50 dark:bg-red-950"
                    : "bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                }`}
              />

              {profileErrors.name && (
                <p className="mt-1 text-xs text-red-500">
                  {profileErrors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Institutional Email
              </label>

              <input
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
                className={`w-full px-3 py-2 text-xs rounded-xl ${
                  profileErrors.email
                    ? "border border-red-500 bg-red-50 dark:bg-red-950"
                    : "bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                }`}
              />

              {profileErrors.email && (
                <p className="mt-1 text-xs text-red-500">
                  {profileErrors.email}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Academic Title
                </label>

                <input
                  type="text"
                  value={profile.title}
                  onChange={(e) =>
                    setProfile({ ...profile, title: e.target.value })
                  }
                  className={`w-full px-3 py-2 text-xs rounded-xl ${
                    profileErrors.title
                      ? "border border-red-500 bg-red-50 dark:bg-red-950"
                      : "bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                  }`}
                />

                {profileErrors.title && (
                  <p className="mt-1 text-xs text-red-500">
                    {profileErrors.title}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Department
                </label>

                <input
                  type="text"
                  value={profile.department}
                  onChange={(e) =>
                    setProfile({ ...profile, department: e.target.value })
                  }
                  className={`w-full px-3 py-2 text-xs rounded-xl ${
                    profileErrors.department
                      ? "border border-red-500 bg-red-50 dark:bg-red-950"
                      : "bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                  }`}
                />

                {profileErrors.department && (
                  <p className="mt-1 text-xs text-red-500">
                    {profileErrors.department}
                  </p>
                )}
              </div>
            </div>

              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-md shadow-primary-600/20 flex items-center gap-1.5 transition-all mt-2"
              >
                <Save className="w-3.5 h-3.5" /> Save Profile Changes
              </button>
            </form>
          </div>

          {/* Theme & Visuals Card */}
          <div className="saas-card p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Sun className="w-4 h-4 text-amber-500" /> Interface Visual Theme
            </h3>

            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-white">Dark Mode Toggle</p>
                <p className="text-[11px] text-slate-500">Switch between light corporate theme and high-contrast dark theme</p>
              </div>

              <button
                onClick={toggleDarkMode}
                className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs"
              >
                {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Institute Info & Security */}
        <div className="md:col-span-6 space-y-6">
          {/* Institute Settings */}
          <div className="saas-card p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Building className="w-4 h-4 text-emerald-600" /> Institutional & Threshold Config
            </h3>

            <form
                onSubmit={handleSaveInstitute}
                noValidate
                className="space-y-3"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Institute Name
                </label>

                <input
                  type="text"
                  value={institute.name}
                  onChange={(e) =>
                    setInstitute({ ...institute, name: e.target.value })
                  }
                  className={`w-full px-3 py-2 text-xs rounded-xl font-bold ${
                    instituteErrors.name
                      ? "border border-red-500 bg-red-50 dark:bg-red-950"
                      : "bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                  }`}
                />

                {instituteErrors.name && (
                  <p className="mt-1 text-xs text-red-500">
                    {instituteErrors.name}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Accreditation
                  </label>

                  <input
                    type="text"
                    value={institute.accreditation}
                    onChange={(e) =>
                      setInstitute({
                        ...institute,
                        accreditation: e.target.value
                      })
                    }
                    className={`w-full px-3 py-2 text-xs rounded-xl ${
                      instituteErrors.accreditation
                        ? "border border-red-500 bg-red-50 dark:bg-red-950"
                        : "bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                    }`}
                  />

                  {instituteErrors.accreditation && (
                    <p className="mt-1 text-xs text-red-500">
                      {instituteErrors.accreditation}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Low Attendance Threshold (%)
                  </label>

                  <input
                    type="number"
                    value={institute.attendanceThreshold}
                    onChange={(e) =>
                      setInstitute({
                        ...institute,
                        attendanceThreshold: Number(e.target.value)
                      })
                    }
                    className={`w-full px-3 py-2 text-xs rounded-xl font-bold ${
                      instituteErrors.attendanceThreshold
                        ? "border border-red-500 bg-red-50 dark:bg-red-950 text-red-600"
                        : "bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-red-600"
                    }`}
                  />

                  {instituteErrors.attendanceThreshold && (
                    <p className="mt-1 text-xs text-red-500">
                      {instituteErrors.attendanceThreshold}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Academic Year
                </label>

                <input
                  type="text"
                  value={institute.academicYear}
                  onChange={(e) =>
                    setInstitute({
                      ...institute,
                      academicYear: e.target.value
                    })
                  }
                  className={`w-full px-3 py-2 text-xs rounded-xl ${
                    instituteErrors.academicYear
                      ? "border border-red-500 bg-red-50 dark:bg-red-950"
                      : "bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                  }`}
                />

                {instituteErrors.academicYear && (
                  <p className="mt-1 text-xs text-red-500">
                    {instituteErrors.academicYear}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Flask ML API Endpoint
                </label>

                <input
                  type="text"
                  value={institute.flaskApiEndpoint}
                  onChange={(e) =>
                    setInstitute({
                      ...institute,
                      flaskApiEndpoint: e.target.value
                    })
                  }
                  className={`w-full px-3 py-2 text-xs rounded-xl ${
                    instituteErrors.flaskApiEndpoint
                      ? "border border-red-500 bg-red-50 dark:bg-red-950"
                      : "bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                  }`}
                />

                {instituteErrors.flaskApiEndpoint && (
                  <p className="mt-1 text-xs text-red-500">
                    {instituteErrors.flaskApiEndpoint}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all mt-2"
              >
                <Save className="w-3.5 h-3.5" /> Save Institutional Config
              </button>
            </form>
          </div>

          {/* Password Change Card */}
          <div className="saas-card p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Lock className="w-4 h-4 text-red-500" /> Security & Password Update
            </h3>

            <form onSubmit={handlePasswordReset} noValidate className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Current Password
              </label>

              <input
                type="password"
                placeholder="••••••••"
                value={passwords.current}
                onChange={(e) =>
                  setPasswords({ ...passwords, current: e.target.value })
                }
                className={`w-full px-3 py-2 text-xs rounded-xl ${
                  passwordErrors.current
                    ? "border border-red-500 bg-red-50 dark:bg-red-950"
                    : "bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                }`}
              />

              {passwordErrors.current && (
                <p className="mt-1 text-xs text-red-500">
                  {passwordErrors.current}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  New Password
                </label>

                <input
                  type="password"
                  placeholder="••••••••"
                  value={passwords.newPass}
                  onChange={(e) =>
                    setPasswords({ ...passwords, newPass: e.target.value })
                  }
                  className={`w-full px-3 py-2 text-xs rounded-xl ${
                    passwordErrors.newPass
                      ? "border border-red-500 bg-red-50 dark:bg-red-950"
                      : "bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                  }`}
                />

                {passwordErrors.newPass && (
                  <p className="mt-1 text-xs text-red-500">
                    {passwordErrors.newPass}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Confirm New Password
                </label>

                <input
                  type="password"
                  placeholder="••••••••"
                  value={passwords.confirmPass}
                  onChange={(e) =>
                    setPasswords({ ...passwords, confirmPass: e.target.value })
                  }
                  className={`w-full px-3 py-2 text-xs rounded-xl ${
                    passwordErrors.confirmPass
                      ? "border border-red-500 bg-red-50 dark:bg-red-950"
                      : "bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                  }`}
                />

                {passwordErrors.confirmPass && (
                  <p className="mt-1 text-xs text-red-500">
                    {passwordErrors.confirmPass}
                  </p>
                )}
              </div>

            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md shadow-red-600/20 flex items-center gap-1.5 transition-all mt-2"
            >
              Update Password
            </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};
