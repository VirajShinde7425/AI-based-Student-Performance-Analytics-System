import React from 'react';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  GraduationCap,
  LineChart,
  BrainCircuit,
  FileSpreadsheet,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Sidebar = () => {
  const {
    activePage,
    setActivePage,
    sidebarCollapsed,
    setSidebarCollapsed,
    currentUser,
    logoutUser
  } = useApp();

  // const navItems = [
  //   { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  //   { id: 'students', label: 'Student Management', icon: Users, badge: '80+' },
  //   { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
  //   { id: 'marks', label: 'Marks Management', icon: GraduationCap },
  //   { id: 'analytics', label: 'Performance Analytics', icon: LineChart, highlight: true },
  //   { id: 'predictions', label: 'AI Predictions', icon: BrainCircuit, badge: 'ML', badgeColor: 'bg-emerald-500 text-white' },
  //   { id: 'reports', label: 'Reports', icon: FileSpreadsheet },
  //   { id: 'settings', label: 'Settings', icon: Settings },
  // ];

  const teacherNavItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "students", label: "Student Management", icon: Users, badge: "80+" },
  { id: "attendance", label: "Attendance", icon: CalendarCheck },
  { id: "marks", label: "Marks Management", icon: GraduationCap },
  { id: "analytics", label: "Performance Analytics", icon: LineChart, highlight: true },
  {
    id: "predictions",
    label: "AI Predictions",
    icon: BrainCircuit,
    badge: "ML",
    badgeColor: "bg-emerald-500 text-white"
  },
  { id: "reports", label: "Reports", icon: FileSpreadsheet },
  { id: "settings", label: "Settings", icon: Settings }
];

const adminNavItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },

  { id: "teachers", label: "Teacher Management", icon: Users },

  { id: "students", label: "Student Management", icon: GraduationCap },

  { id: "settings", label: "Settings", icon: Settings }
];

const studentNavItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },

  { id: "profile", label: "My Profile", icon: Users },

  { id: "attendance", label: "Attendance", icon: CalendarCheck },

  { id: "marks", label: "Marks", icon: GraduationCap },

  {
    id: "predictions",
    label: "AI Prediction",
    icon: BrainCircuit
  },

  { id: "settings", label: "Settings", icon: Settings }
];


let navItems = [];

if (currentUser?.role === "Admin") {
    navItems = adminNavItems;
}
else if (currentUser?.role === "Teacher") {
    navItems = teacherNavItems;
}
else {
    navItems = studentNavItems;
}
        
  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 transition-all duration-300 flex flex-col justify-between ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Brand Section */}
      <div>
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActivePage('dashboard')}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                  EduMetrics <span className="text-primary-600 dark:text-primary-400">AI</span>
                </h1>
                <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Academic Analytics</p>
              </div>
            </div>
          )}

          {sidebarCollapsed && (
            <div className="mx-auto w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-blue-500 flex items-center justify-center text-white shadow-md">
              <BrainCircuit className="w-6 h-6" />
            </div>
          )}

          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors hidden md:block"
            title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 group relative ${
                  isActive
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400 group-hover:text-primary-600 dark:group-hover:text-primary-400'}`} />

                {!sidebarCollapsed && (
                  <span className="flex-1 text-left truncate">{item.label}</span>
                )}

                {!sidebarCollapsed && item.badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor || (isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300')}`}>
                    {item.badge}
                  </span>
                )}

                {!sidebarCollapsed && item.highlight && (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Profile & Logout Bottom Section */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800">
        {!sidebarCollapsed ? (
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
              />
              <div className="truncate">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{currentUser.name}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{currentUser.role}</p>
              </div>
            </div>
            <button
              onClick={logoutUser}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={logoutUser}
            className="w-full flex justify-center p-2.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        )}
      </div>
    </aside>
  );
};
