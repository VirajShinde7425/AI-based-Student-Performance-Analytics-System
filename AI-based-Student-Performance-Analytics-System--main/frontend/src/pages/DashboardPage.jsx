import React from 'react';
import { useApp } from '../context/AppContext';
import { KpiCard } from '../components/common/KpiCard';
import { Badge } from '../components/common/Badge';
import { SearchFilterBar } from '../components/common/SearchFilterBar';
import { AttendanceTrendChart } from '../components/charts/AttendanceTrendChart';
import { MarksDistributionChart } from '../components/charts/MarksDistributionChart';
import { DepartmentComparisonChart } from '../components/charts/DepartmentComparisonChart';
import { SubjectPerformanceChart } from '../components/charts/SubjectPerformanceChart';
import {
  Users,
  CalendarCheck,
  Award,
  TrendingUp,
  AlertTriangle,
  Trophy,
  UserPlus,
  Upload,
  FileSpreadsheet,
  BrainCircuit,
  Eye,
  ArrowRight,
  Bell,
  Sparkles
} from 'lucide-react';

export const DashboardPage = () => {
  const {
    currentUser,
    students,
    dashboardData,
    setActiveModal,
    setSelectedStudent,
    setActivePage,
    notifications
  } = useApp();

  const atRiskStudents = students.filter(s => s.riskLevel === 'High' || s.riskLevel === 'Critical');

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="saas-card p-6 bg-gradient-to-r from-primary-700 via-primary-600 to-blue-600 text-white border-0 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg shadow-blue-500/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-blue-100 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>Academic Year 2025 - 2026 | Semester 6</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">
            Welcome back, {currentUser.name}!
          </h1>
          <p className="text-xs text-blue-100/90 mt-1 max-w-xl">
            Here is your institutional overview for today. AI machine learning predictions are active with 94.8% model confidence score.
          </p>
        </div>

        {/* Quick Actions Header Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveModal('addStudent')}
            className="px-3.5 py-2 rounded-xl bg-white text-primary-700 hover:bg-blue-50 text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all"
          >
            <UserPlus className="w-4 h-4" /> Add Student
          </button>
          <button
            onClick={() => setActiveModal('uploadAttendance')}
            className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/20 text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <Upload className="w-4 h-4" /> Import Attendance
          </button>
          <button
            onClick={() => setActiveModal('uploadMarks')}
            className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/20 text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" /> Import Marks
          </button>
          <button
            onClick={() => setActiveModal('generateReport')}
            className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" /> Generate Report
          </button>
        </div>
      </div>

      {/* Global Quick Filter Bar */}
      <SearchFilterBar placeholder="Filter dashboard metrics by student or department..." />

      {/* Top 6 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KpiCard
          title="Total Students"
          value={students.length}
          subtext="Enrolled across 5 departments"
          icon={Users}
          //trend="up"
          //trendValue="+4.2%"
          color="blue"
        />
        <KpiCard
          title="Average Attendance"
          value={
              dashboardData
                  ? `${dashboardData.averageAttendance.toFixed(1)}%`
                  : "Loading..."
          }
          subtext="Target benchmark 85.0%"
          icon={CalendarCheck}
          //trend="up"
          //trendValue="+1.5%"
          color="emerald"
        />
        <KpiCard
          title="Average Marks"
          value={
              dashboardData
                  ? dashboardData.averageGpa.toFixed(2)
                  : "..."
          }
          subtext="Mid-term & assignments"
          icon={Award}
          //trend="up"
          //trendValue="+2.1%"
          color="indigo"
        />
        <KpiCard
          title="Pass Percentage"
          value={
              dashboardData
                  ? `${dashboardData.passRate.toFixed(1)}%`
                  : "..."
          }
          subtext="Pass grade threshold"
          icon={TrendingUp}
          //trend="neutral"
          //trendValue="0.0%"
          color="emerald"
        />
        <KpiCard
          title="Students At Risk"
          value={
              dashboardData
                  ? dashboardData.studentsAtRiskCount
                  : 0
          }
          subtext="Requires intervention"
          icon={AlertTriangle}
          //trend="down"
          //trendValue="-2"
          color="red"
        />
        <KpiCard
          title="Highest Scorer"
          value={
              dashboardData
                  ? `${dashboardData.topPerformerScore}%`
                  : "..."
          }

          subtext={
              dashboardData
                  ? dashboardData.topPerformerName
                  : ""
          }
          icon={Trophy}
          //trend="up"
          trendValue="Rank 1"
          color="amber"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Attendance Trend Chart */}
        <div className="lg:col-span-6 saas-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Attendance Weekly Trend</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Weekly aggregate class attendance vs 85% benchmark</p>
            </div>
            <button onClick={() => setActivePage('attendance')} className="text-xs font-semibold text-primary-600 hover:underline">View Details</button>
          </div>
          <AttendanceTrendChart />
        </div>

        {/* Marks Distribution Chart */}
        <div className="lg:col-span-6 saas-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Marks Distribution Breakdown</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Student grade curve across all active courses</p>
            </div>
            <button onClick={() => setActivePage('marks')} className="text-xs font-semibold text-primary-600 hover:underline">Manage Marks</button>
          </div>
          <MarksDistributionChart />
        </div>

        {/* Department Comparison */}
        <div className="lg:col-span-7 saas-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Department Comparative Performance</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Average marks vs attendance comparison by department</p>
            </div>
            <button onClick={() => setActivePage('analytics')} className="text-xs font-semibold text-primary-600 hover:underline">Power BI View</button>
          </div>
          <DepartmentComparisonChart />
        </div>

        {/* Subject Performance Doughnut */}
        <div className="lg:col-span-5 saas-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Core Subject Average Scores</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Semester 6 curriculum performance distribution</p>
            </div>
          </div>
          <SubjectPerformanceChart />
        </div>
      </div>

      {/* AI Insights Panel & Recent Students Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Students Table */}
        <div className="lg:col-span-8 saas-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Student Performance Records</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Live roster update with ML risk classification</p>
            </div>
            <button onClick={() => setActivePage('students')} className="text-xs font-bold text-primary-600 hover:underline flex items-center gap-1">
              <span>View All Students</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800 uppercase font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Attendance</th>
                  <th className="p-3">Avg Marks</th>
                  <th className="p-3">Risk Level</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {students.slice(0, 5).map((s) => (
                  <tr key={s.id} className="table-hover-row">
                    <td className="p-3 font-semibold text-slate-900 dark:text-white flex items-center gap-2.5">
                      <img src={s.avatarUrl} alt={s.fullName} className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                      <div>
                        <div>{s.fullName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{s.rollNumber}</div>
                      </div>
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">{s.departmentName}</td>
                    <td className="p-3">
                      <span className={`font-semibold ${s.attendancePercentage < 75 ? 'text-red-600 dark:text-red-400' : 'text-slate-800 dark:text-slate-200'}`}>
                        {s.attendancePercentage}%
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">{s.averageMarks}%</td>
                    <td className="p-3">
                      <Badge variant={s.riskLevel}>{s.riskLevel}</Badge>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedStudent(s);
                          setActiveModal('viewProfile');
                        }}
                        className="px-2.5 py-1 text-[11px] font-semibold text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950/40 rounded-lg transition-colors flex items-center gap-1 ml-auto"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Insights & Alerts Panel */}
        <div className="lg:col-span-4 space-y-4">
          <div className="saas-card p-5 border-l-4 border-l-emerald-500">
            <div className="flex items-center gap-2 mb-3">
              <BrainCircuit className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">AI Machine Learning Insights</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40">
                <span className="font-bold text-amber-800 dark:text-amber-300 block mb-0.5">{dashboardData?.aiInsight?.title}</span>
                <p className="text-slate-600 dark:text-slate-300">{dashboardData?.aiInsight?.message}</p>
                <button onClick={() => setActivePage('predictions')} className="text-[11px] font-bold text-amber-700 dark:text-amber-400 hover:underline mt-1 block">
                  {dashboardData?.aiInsight?.recommendation} →
                </button>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/40">
                <span className="font-bold text-blue-800 dark:text-blue-300 block mb-0.5">Top Academic Performer</span>
                <p className="text-slate-600 dark:text-slate-300">{dashboardData?.topPerformerName} currently leads the institution with an average score of {dashboardData?.topPerformerScore}%.</p>
              </div>
            </div>
          </div>

          {/* Quick Notifications Box */}
          <div className="saas-card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-primary-600" /> Recent System Activity
              </h3>
            </div>
            <div className="space-y-2.5 text-xs">
              {dashboardData?.recentActivities?.map((n, index) => (
                <div key={index} className="pb-2 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">{n.title}</span>
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px] mt-0.5">{n.description}</span>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">{n.timeAgo}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
