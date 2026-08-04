import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { KpiCard } from '../components/common/KpiCard';
import { Badge } from '../components/common/Badge';
import { AttendanceTrendChart } from '../components/charts/AttendanceTrendChart';
import { MarksDistributionChart } from '../components/charts/MarksDistributionChart';
import { DepartmentComparisonChart } from '../components/charts/DepartmentComparisonChart';
import { SubjectPerformanceChart } from '../components/charts/SubjectPerformanceChart';
import { PerformanceRadarChart } from '../components/charts/PerformanceRadarChart';
import { AttendanceHeatmap } from '../components/charts/AttendanceHeatmap';
import {
  LineChart,
  PieChart,
  BarChart3,
  Trophy,
  AlertTriangle,
  Award,
  TrendingUp,
  SlidersHorizontal,
  Maximize2,
  Download,
  BrainCircuit,
  Zap,
  Target
} from 'lucide-react';

export const AnalyticsPage = () => {
  const {
    students,
    dashboardData,
    setSelectedStudent,
    setActiveModal
} = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Sorted rankings
  const topPerformers = [...students].sort((a, b) => b.averageMarks - a.averageMarks).slice(0, 5);
  const bottomPerformers = [...students].sort((a, b) => a.averageMarks - b.averageMarks).slice(0, 5);


  return (
    <div className="space-y-6">
      {/* Power BI Power Bar Header */}
      <div className="saas-card p-5 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white border-0 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-primary-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <LineChart className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight">Institutional Performance Analytics</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary-500/30 border border-primary-400/40 text-primary-300">
                Power BI Suite
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Multi-dimensional academic evaluation grid, correlation scatter vectors, & skill radar matrix.
            </p>
          </div>
        </div>

        {/* <div className="flex items-center gap-2">
          <button className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors border border-slate-700">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Configure Slicers
          </button>
          <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-1.5 transition-all">
            <Download className="w-3.5 h-3.5" /> Export PBIX Data
          </button>
        </div> */}
      </div>

      {/* Top 5 Power BI KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard
            title="Average Class GPA"
            value={`${dashboardData?.averageGpa?.toFixed(2) ?? "0.00"} / 4.0`}
            subtext="Target standard: 3.25"
            icon={Award}
            trend="up"
            trendValue="+0.12"
            color="blue"
        />
        <KpiCard
          title="Avg Attendance"
          value={`${dashboardData?.averageAttendance?.toFixed(1) ?? "0.0"}%`}
          subtext="Biometric aggregate"
          icon={TrendingUp}
          trend="up"
          trendValue="+1.5%"
          color="emerald"
        />
        <KpiCard
          title="Institutional Pass Rate"
          value={`${dashboardData?.passRate?.toFixed(1) ?? "0.0"}%`}
          subtext="Semester 6 overall"
          icon={Target}
          trend="neutral"
          trendValue="0.0%"
          color="indigo"
        />
        <KpiCard
          title="Students At Risk"
          value={dashboardData?.studentsAtRiskCount ?? 0}
          subtext="ML high-risk flags"
          icon={AlertTriangle}
          trend="down"
          trendValue="-2"
          color="red"
        />
        <KpiCard
          title="Top Performer"
          value={`${dashboardData?.topPerformerScore?.toFixed(1) ?? "0.0"}%`}
          subtext={dashboardData?.topPerformerName ?? "No Data"}
          icon={Trophy}
          trend="up"
          trendValue="Rank 1"
          color="amber"
        />
      </div>

      {/* Performance Categories Breakdown Grid */}
      <div className="saas-card p-5 space-y-3">
        <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Academic Performance Tiers</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {dashboardData?.performanceCategories?.map((c) => (
            <div key={c.label} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{c.label}</p>
                <p className="text-lg font-black text-slate-900 dark:text-white mt-0.5">{c.count} <span className="text-xs text-slate-400 font-normal">Students</span></p>
              </div>
              <span className={`px-2.5 py-1 rounded-xl text-xs font-extrabold ${c.color}`}>
                {c.percentage}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main 4-Widget Analytical Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Radar Chart: Skill Competency Matrix */}
        <div className="lg:col-span-6 saas-card p-5">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Institutional Skill Competency Radar</h3>
              <p className="text-xs text-slate-500">6-axis evaluation: Coding, Theory, Lab, Aptitude, Projects, Soft Skills</p>
            </div>
          </div>
          <PerformanceRadarChart />
        </div>

        {/* Attendance Heatmap Grid */}
        <div className="lg:col-span-6 saas-card p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Slot-by-Slot Attendance Heatmap</h3>
              <p className="text-xs text-slate-500">Weekly period attendance density breakdown</p>
            </div>
          </div>
          <AttendanceHeatmap />
        </div>

        {/* Department Comparative Bar */}
        <div className="lg:col-span-7 saas-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Department Comparative Performance</h3>
              <p className="text-xs text-slate-500">Cross-departmental marks vs attendance correlation</p>
            </div>
          </div>
          <DepartmentComparisonChart />
        </div>

        {/* Grade Curve Doughnut */}
        <div className="lg:col-span-5 saas-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Curriculum Subject Performance</h3>
              <p className="text-xs text-slate-500">Distribution of average scores by course module</p>
            </div>
          </div>
          <SubjectPerformanceChart />
        </div>

      </div>

      {/* Leaderboard Rankings Grid: Top 5 High Performers vs Bottom 5 At Risk */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Top 5 Performers */}
        <div className="lg:col-span-6 saas-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Top 5 Academic Honor Roll</h3>
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              Dean's Honor List
            </span>
          </div>

          <div className="space-y-2.5">
            {topPerformers.map((s, idx) => (
              <div
                key={s.id}
                onClick={() => {
                  setSelectedStudent(s);
                  setActiveModal('viewProfile');
                }}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between hover:border-primary-400 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-extrabold text-xs flex items-center justify-center">
                    #{idx + 1}
                  </span>
                  <img src={s.avatarUrl} alt={s.fullName} className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{s.fullName}</p>
                    <p className="text-[10px] text-slate-500">{s.departmentName} ({s.rollNumber})</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">{s.averageMarks}%</span>
                  <span className="text-[10px] font-bold text-slate-400 block">GPA {s.currentGpa}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom 5 At Risk */}
        <div className="lg:col-span-6 saas-card p-5 border-l-4 border-l-red-500">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Bottom 5 Academic Intervention Flags</h3>
            </div>
            <span className="text-xs font-semibold text-red-600 bg-red-50 dark:bg-red-950/40 px-2.5 py-1 rounded-full border border-red-200 dark:border-red-800">
              Immediate Counseling
            </span>
          </div>

          <div className="space-y-2.5">
            {bottomPerformers.map((s, idx) => (
              <div
                key={s.id}
                onClick={() => {
                  setSelectedStudent(s);
                  setActiveModal('viewProfile');
                }}
                className="p-3 rounded-xl bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/40 flex items-center justify-between hover:border-red-400 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-red-100 text-red-800 font-extrabold text-xs flex items-center justify-center">
                    !
                  </span>
                  <img src={s.avatarUrl} alt={s.fullName} className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{s.fullName}</p>
                    <p className="text-[10px] text-slate-500">{s.departmentName} ({s.rollNumber})</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-black text-red-600 dark:text-red-400">{s.averageMarks}%</span>
                  <span className="text-[10px] font-bold text-slate-400 block">Attendance {s.attendancePercentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
