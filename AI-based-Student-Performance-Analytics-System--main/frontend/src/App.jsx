import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';

// Layout
import { Sidebar } from './components/layout/Sidebar';
import { TopNav } from './components/layout/TopNav';

// Pages
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { StudentManagementPage } from './pages/StudentManagementPage';
import { AttendancePage } from './pages/AttendancePage';
import { MarksManagementPage } from './pages/MarksManagementPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AiPredictionsPage } from './pages/AiPredictionsPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { StudentDashboardPage } from "./pages/StudentDashboardPage";
import { MyProfilePage } from "./pages/MyProfilePage";
import { StudentAttendancePage } from "./pages/StudentAttendancePage";
import { StudentMarksPage } from "./pages/StudentMarksPage";
import { StudentPredictionsPage } from "./pages/StudentPredictionsPage";

// Modals
import { AddStudentModal } from './components/modals/AddStudentModal';
import { StudentProfileModal } from './components/modals/StudentProfileModal';
import { UploadAttendanceModal } from './components/modals/UploadAttendanceModal';
import { UploadMarksModal } from './components/modals/UploadMarksModal';
import { GenerateReportModal } from './components/modals/GenerateReportModal';
import { MlApiConfigModal } from './components/modals/MlApiConfigModal';
import { EditStudentModal } from './components/modals/EditStudentModal';

const AppContent = () => {
  const { isAuthenticated, activePage, sidebarCollapsed, currentUser } = useApp();

  if (!isAuthenticated || activePage === 'login') {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100 flex transition-colors duration-200">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Top Navigation Header */}
      <TopNav />

      {/* Main Content Area */}
      <main
        className={`flex-1 pt-20 px-4 sm:px-6 lg:px-8 pb-12 transition-all duration-300 ${
          sidebarCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          {activePage === "dashboard" &&
          (
              currentUser.role === "Teacher"
                  ? <DashboardPage />
                  : <StudentDashboardPage />
          )}
          {activePage === "profile" && <MyProfilePage />}
          {activePage === 'students' && <StudentManagementPage />}
          {activePage === "attendance" &&
          (
              currentUser?.role === "Teacher"
                  ? <AttendancePage />
                  : <StudentAttendancePage />
          )}
          {activePage === "marks" &&
          (
              currentUser?.role === "Teacher"
                  ? <MarksManagementPage />
                  : <StudentMarksPage />
          )}
          {activePage === 'analytics' && <AnalyticsPage />}
          {activePage === "predictions" &&
          (
              currentUser?.role === "Teacher"
                  ? <AiPredictionsPage />
                  : <StudentPredictionsPage />
          )}
          {activePage === 'reports' && <ReportsPage />}
          {activePage === 'settings' && <SettingsPage />}
        </div>
      </main>

      {/* Global Modals Container */}
      <AddStudentModal />
      <StudentProfileModal />
      <EditStudentModal />
      <UploadAttendanceModal />
      <UploadMarksModal />
      <GenerateReportModal />
      <MlApiConfigModal />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AppProvider>
  );
}

export default App;
