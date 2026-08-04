import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { AttendanceTrendChart } from '../components/charts/AttendanceTrendChart';
import { DepartmentComparisonChart } from '../components/charts/DepartmentComparisonChart';
import { MarksDistributionChart } from '../components/charts/MarksDistributionChart';
import api from "../services/api";
import {
  Download,
  Printer,
  Eye,
  FileText,
  Building,
  CalendarCheck,
  Award,
  Sparkles
} from 'lucide-react';

export const ReportsPage = () => {
  const { setActiveModal } = useApp();
  const { addToast } = useToast();

  const [selectedReport, setSelectedReport] = useState('Performance');

  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
}, []);

const loadReports = async () => {
    try {
        const response = await api.get("/Reports/dashboard");
        setReportData(response.data);
    }
    catch (err) {
        console.error("Unable to load reports.", err);
    }
    finally {
        setLoading(false);
    }
};

  const reportCards = [
    {
      id: 'Performance',
      title: 'Institutional Academic Performance Report',
      desc: 'Overall GPA, subject grade curves, pass percentage metrics, and top scorer leaderboards.',
      icon: Award,
      color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30'
    },
    {
      id: 'Attendance',
      title: 'Attendance Comprehensive Audit Report',
      desc: 'Biometric attendance registers, daily slot heatmaps, and low-attendance alert roster.',
      icon: CalendarCheck,
      color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30'
    },
    {
      id: 'Department',
      title: 'Departmental Comparative Matrix',
      desc: 'Cross-departmental performance metrics across CS, IT, AI, DS, and Cyber Security.',
      icon: Building,
      color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30'
    },
    {
      id: 'AI Predictions',
      title: 'AI Early Warning & Risk Analysis',
      desc: 'ML predicted GPAs, model confidence interval, and automated intervention recommendations.',
      icon: Sparkles,
      color: 'bg-teal-50 text-teal-600 dark:bg-teal-900/30'
    }
  ];

  if (loading)
{
    return (
        <div className="text-center py-20">
            Loading Reports...
        </div>
    );
}

const downloadExcel = async () => {
    try {

        addToast(
            "Export Started",
            "Preparing Excel report...",
            "info"
        );

        const response = await api.get(
            "/Reports/export/excel",
            {
                responseType: "blob"
            }
        );

        const blob = new Blob([
            response.data
        ]);

        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;

        link.download = "StudentPerformanceReport.xlsx";

        document.body.appendChild(link);

        link.click();

        link.remove();

        window.URL.revokeObjectURL(url);

        addToast(
            "Success",
            "Excel report downloaded successfully.",
            "success"
        );
    }
    catch (err)
    {
        console.error(err);

        addToast(
            "Export Failed",
            "Unable to generate Excel report.",
            "error"
        );
    }
};

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Institutional Report Generator Cell
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Compile official academic audits, generate printable PDFs, and export Excel data sheets.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveModal('generateReport')}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-md shadow-primary-600/20 flex items-center gap-1.5 transition-all"
          >
            <FileText className="w-4 h-4" /> Open Report Builder Modal
          </button>
        </div>
      </div>

      {/* Selectable Report Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportCards.map((r) => {
          const Icon = r.icon;
          const isSelected = selectedReport === r.id;

          return (
            <div
              key={r.id}
              onClick={() => setSelectedReport(r.id)}
              className={`saas-card p-5 cursor-pointer transition-all ${
                isSelected
                  ? 'border-primary-600 ring-2 ring-primary-500/20 shadow-md'
                  : 'hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-3 rounded-2xl ${r.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                {isSelected && (
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-primary-600 text-white">
                    Selected
                  </span>
                )}
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{r.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{r.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

    <div className="saas-card p-5">
        <p className="text-xs text-slate-500">
            Average GPA
        </p>

        <h2 className="text-3xl font-bold mt-2">
            {reportData.performance.averageGpa}
        </h2>
    </div>

    <div className="saas-card p-5">
        <p className="text-xs text-slate-500">
            Pass Rate
        </p>

        <h2 className="text-3xl font-bold mt-2">
            {reportData.performance.passRate}%
        </h2>
    </div>

    <div className="saas-card p-5">
        <p className="text-xs text-slate-500">
            Students At Risk
        </p>

        <h2 className="text-3xl font-bold mt-2">
            {reportData.predictions.studentsAtRiskCount}
        </h2>
    </div>

    <div className="saas-card p-5">
        <p className="text-xs text-slate-500">
            Top Performer
        </p>

        <h2 className="text-xl font-bold mt-2">
            {reportData.performance.topPerformerName}
        </h2>

        <p className="text-xs text-primary-600">
            {reportData.performance.topPerformerScore}%
        </p>
    </div>

</div>

      {/* Report Controls & Live Charts Preview */}
      <div className="saas-card p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Report Live Analytics Preview: <span className="text-primary-600">{selectedReport}</span>
            </h3>
            <p className="text-xs text-slate-500">Includes data up to Academic Semester 6 (2026)</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveModal('generateReport')}
              className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Eye className="w-4 h-4" /> Live Document Preview
            </button>
            <button
                onClick={downloadExcel}
                className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
            >
                <Download className="w-4 h-4" /> Export Excel
            </button>
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4" /> Print Report
            </button>
          </div>
        </div>

        {/* Live Charts Preview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          <div className="lg:col-span-6">
              <AttendanceTrendChart />
          </div>

          <div className="lg:col-span-6">
              <DepartmentComparisonChart />
          </div>

          <div className="lg:col-span-12">
              <MarksDistributionChart />
          </div>

          <div className="lg:col-span-6 saas-card-flat p-4 border border-slate-200 dark:border-slate-700">
            <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">Attendance Summary Curve</h4>
            <AttendanceTrendChart />
          </div>

          <div className="lg:col-span-6 saas-card-flat p-4 border border-slate-200 dark:border-slate-700">
            <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">Departmental Academic Performance</h4>
            <DepartmentComparisonChart />
          </div>
        </div>
      </div>
    </div>
  );
};
