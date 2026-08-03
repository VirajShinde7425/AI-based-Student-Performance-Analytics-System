import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { FileText, Download, Printer, Eye, CheckCircle2 } from 'lucide-react';
import { DEPARTMENTS, SEMESTERS } from '../../mockData/studentData';
import api from "../../services/api";

export const GenerateReportModal = () => {
  const { activeModal, setActiveModal, students } = useApp();
  const { addToast } = useToast();

  const [reportType, setReportType] = useState('Performance');
  const [department, setDepartment] = useState('All');
  const [semester, setSemester] = useState('6');
  const [showPreview, setShowPreview] = useState(false);

  const handleExportPDF = () => {
    addToast('Generating PDF', `Preparing ${reportType} Report PDF for download...`, 'info');
    setTimeout(() => {
      addToast('Download Started', `${reportType}_Report_2026.pdf generated!`, 'success');
      setActiveModal(null);
    }, 1000);
  };

  const handleExportExcel = async () => {
    try {

        addToast(
            "Generating Excel",
            "Preparing Excel report...",
            "info"
        );

        const response = await api.get(
            "/Reports/export/excel",
            {
                responseType: "blob"
            }
        );

        const blob = new Blob([response.data]);

        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;
        link.download = "StudentPerformanceReport.xlsx";

        document.body.appendChild(link);

        link.click();

        link.remove();

        window.URL.revokeObjectURL(url);

        addToast(
            "Download Complete",
            "Excel report downloaded successfully.",
            "success"
        );

        setActiveModal(null);

    } catch (err) {

        console.error(err);

        addToast(
            "Export Failed",
            "Unable to generate Excel report.",
            "error"
        );
    }
};

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={activeModal === 'generateReport'}
      onClose={() => {
        setActiveModal(null);
        setShowPreview(false);
      }}
      title="Institutional Report Generator"
      maxWidth={showPreview ? 'max-w-4xl' : 'max-w-xl'}
    >
      {!showPreview ? (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Report Category</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
            >
              <option value="Attendance">Attendance Comprehensive Audit</option>
              <option value="Student Academic">Individual Student Progress Card</option>
              <option value="Performance">Institutional Academic Performance Report</option>
              <option value="Department">Departmental Comparative Matrix</option>
              <option value="AI Predictions">AI Risk & Early Warning Assessment</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
              >
                <option value="All">All Departments</option>
                {DEPARTMENTS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Semester</label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
              >
                {SEMESTERS.map(s => (
                  <option key={s} value={s}>Semester {s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="px-4 py-2 text-xs font-semibold text-primary-600 bg-primary-50 dark:bg-primary-950/40 rounded-xl flex items-center gap-1.5 hover:bg-primary-100 transition-colors"
            >
              <Eye className="w-4 h-4" /> Live Document Preview
            </button>

            <div className="flex gap-2">
              <button
                onClick={handleExportExcel}
                className="px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center gap-1.5 hover:bg-slate-200 transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> Export Excel
              </button>
              <button
                onClick={handleExportPDF}
                className="px-4 py-2 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-md shadow-primary-600/20 flex items-center gap-1.5 transition-all"
              >
                <FileText className="w-3.5 h-3.5" /> Download PDF
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Printable Report Preview Document */
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-slate-100 dark:bg-slate-700/50 p-3 rounded-xl">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Official Institutional Report Document Preview</span>
            <div className="flex gap-2">
              <button
                onClick={() => setShowPreview(false)}
                className="px-3 py-1 text-xs font-medium text-slate-500 hover:text-slate-800"
              >
                Edit Options
              </button>
              <button
                onClick={handlePrint}
                className="px-3 py-1 text-xs font-bold bg-slate-800 text-white rounded-lg flex items-center gap-1 hover:bg-slate-900"
              >
                <Printer className="w-3.5 h-3.5" /> Print Report
              </button>
            </div>
          </div>

          <div className="p-8 bg-white text-slate-900 border border-slate-200 rounded-xl shadow-sm space-y-6 print-container">
            {/* Header Letterhead */}
            <div className="flex justify-between items-start border-b-2 border-primary-600 pb-4">
              <div>
                <h1 className="text-xl font-black tracking-tight text-slate-900 uppercase">St. Xavier Institute of Technology</h1>
                <p className="text-xs font-semibold text-slate-500">Autonomous Accreditation Grade A+ | Examination Cell</p>
                <p className="text-xs font-bold text-primary-600 mt-1">{reportType} Audit Report - Academic Year 2025-2026</p>
              </div>
              <div className="text-right text-xs text-slate-500 font-medium">
                <p>Date: {new Date().toLocaleDateString()}</p>
                <p>Ref: SXIT/EXAM/2026/0892</p>
                <p>Target: Dept of {department === 'All' ? 'Engineering' : department}</p>
              </div>
            </div>

            {/* Summary Metrics Grid */}
            <div className="grid grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Total Enrolled</p>
                <p className="text-lg font-bold text-slate-900">{students.length}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Avg Attendance</p>
                <p className="text-lg font-bold text-emerald-600">88.4%</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Avg Class GPA</p>
                <p className="text-lg font-bold text-blue-600">3.42 / 4.0</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Pass Rate</p>
                <p className="text-lg font-bold text-emerald-600">95.2%</p>
              </div>
            </div>

            {/* Tabular Snapshot */}
            <div>
              <h4 className="text-xs font-bold uppercase text-slate-700 mb-2">Student Performance Snapshot</h4>
              <table className="w-full text-xs text-left border-collapse border border-slate-200">
                <thead className="bg-slate-100 font-bold text-slate-700">
                  <tr>
                    <th className="p-2 border border-slate-200">Roll No</th>
                    <th className="p-2 border border-slate-200">Student Name</th>
                    <th className="p-2 border border-slate-200">Department</th>
                    <th className="p-2 border border-slate-200">Attendance</th>
                    <th className="p-2 border border-slate-200">Avg Marks</th>
                    <th className="p-2 border border-slate-200">Risk Level</th>
                  </tr>
                </thead>
                <tbody>
                  {students.slice(0, 6).map((s) => (
                    <tr key={s.id}>
                      <td className="p-2 border border-slate-200 font-mono font-semibold">{s.rollNo}</td>
                      <td className="p-2 border border-slate-200 font-bold">{s.name}</td>
                      <td className="p-2 border border-slate-200">{s.department}</td>
                      <td className="p-2 border border-slate-200 font-semibold">{s.attendance}%</td>
                      <td className="p-2 border border-slate-200 font-semibold">{s.avgMarks}%</td>
                      <td className="p-2 border border-slate-200 font-bold">{s.riskLevel}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Signature Block */}
            <div className="pt-8 flex justify-between items-end border-t border-slate-200 text-xs">
              <div>
                <p className="font-bold text-slate-900">Prof. Sarah Jenkins</p>
                <p className="text-slate-500">Head of Examination Cell</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-slate-900">Dr. Robert Vance</p>
                <p className="text-slate-500">Dean of Academic Affairs</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};
