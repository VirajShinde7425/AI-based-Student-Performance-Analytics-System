import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { Badge } from '../components/common/Badge';
import { AttendanceTrendChart } from '../components/charts/AttendanceTrendChart';
import { AttendanceHeatmap } from '../components/charts/AttendanceHeatmap';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Save,
  RotateCcw,
  AlertTriangle,
  Upload,
  CalendarCheck,
  TrendingDown
} from 'lucide-react';


export const AttendancePage = () => {
  const { students, markAttendance, setActiveModal } = useApp();
  const { addToast } = useToast();

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedDept, setSelectedDept] = useState('Computer Science');
  const [selectedSubject, setSelectedSubject] = useState('Machine Learning');

  const departments = [
    "All",
    ...new Set(
        students.map(s => s.departmentName)
    )
];
  
  // Local state for today's attendance statuses
  const [attendanceState, setAttendanceState] = useState(() => {
    const map = {};
    students.forEach(s => {
      map[s.id] = s.attendancePercentage < 75 ? 'Absent' : 'Present';
    });
    return map;
  });

  const [remarks, setRemarks] = useState({});

  const handleStatusToggle = (id, status) => {
    setAttendanceState(prev => ({ ...prev, [id]: status }));
  };

  const handleMarkAllPresent = () => {
    const updated = {};
    filteredStudents.forEach(s => { updated[s.id] = 'Present'; });
    setAttendanceState(updated);
    addToast('Attendance Updated', 'All students marked as Present.', 'info');
  };

  const handleSaveAttendance = async () => {

  const records = filteredStudents.map(student => ({
    studentId: student.id,
    status: attendanceState[student.id] || "Present",
    remarks: remarks[student.id] || ""
  }));

  await markAttendance(
    records,
    selectedDept,
    selectedSubject,
    date
  );

  addToast(
    "Attendance Saved",
    "Attendance stored successfully.",
    "success"
  );
};

  const handleReset = () => {

  const reset = {};

  filteredStudents.forEach((s) => {
    reset[s.id] =
      s.attendancePercentage < 75
        ? "Absent"
        : "Present";
  });

  setAttendanceState(reset);

  addToast(
    "Reset",
    "Attendance reset to original state.",
    "info"
  );
};

  const filteredStudents = students.filter((s) => {

  const departmentMatch =
    selectedDept === "All" ||
    s.departmentName === selectedDept;

  return departmentMatch;

});

  const lowAttendanceStudents = filteredStudents.filter(s => s.attendancePercentage < 75);

  const averageAttendance =
  filteredStudents.length > 0
    ? (
        filteredStudents.reduce(
          (sum, s) => sum + s.attendancePercentage,
          0
        ) / filteredStudents.length
      ).toFixed(1)
    : 0;

  const weeklyAttendance = Math.max(
    0,
    (parseFloat(averageAttendance) - 2).toFixed(1)
  );

  const monthlyAttendance = Math.max(
    0,
    (parseFloat(averageAttendance) - 4).toFixed(1)
    );

  const lowAttendanceCount = filteredStudents.filter(
    s => s.attendancePercentage < 75
  ).length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Attendance Tracking & Analytics Cell
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Record daily subject attendance, view low-attendance alerts, and examine slot heatmaps.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveModal('uploadAttendance')}
            className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Upload className="w-4 h-4" /> Upload Biometric CSV
          </button>
        </div>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="saas-card p-4 flex items-center gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-xl">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block uppercase">Today's Class Attendance</span>
            <span className="text-xl font-black text-slate-900 dark:text-white">{averageAttendance}%</span>
          </div>
        </div>

        <div className="saas-card p-4 flex items-center gap-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block uppercase">Weekly Aggregate</span>
            <span className="text-xl font-black text-emerald-600">{weeklyAttendance}%</span>
          </div>
        </div>

        <div className="saas-card p-4 flex items-center gap-4">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block uppercase">Monthly Cumulative</span>
            <span className="text-xl font-black text-slate-900 dark:text-white">{monthlyAttendance}%</span>
          </div>
        </div>

        <div className="saas-card p-4 flex items-center gap-4">
          <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block uppercase">Low Attendance Flag</span>
            <span className="text-xl font-black text-red-600">{lowAttendanceCount} Student{lowAttendanceCount !== 1 ? "s" : ""}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Attendance Marking & Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Attendance Marking Table */}
        <div className="lg:col-span-8 space-y-4">
          <div className="saas-card p-5 space-y-4">
            {/* Filter Bar for Attendance */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Select Department</label>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                >
                  {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                >
                  <option value="Machine Learning">Machine Learning</option>
                  <option value="Data Structures">Data Structures</option>
                  <option value="Database Systems">Database Systems</option>
                  <option value="Ethical Hacking">Ethical Hacking</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>
            </div>

            {/* Marking Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Live Attendance Roll Call</h3>
              <div className="flex gap-2">
                <button
                  onClick={handleMarkAllPresent}
                  className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold text-xs rounded-xl hover:bg-emerald-100 flex items-center gap-1 transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Mark All Present
                </button>
                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-xs rounded-xl hover:bg-slate-200 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset
                </button>
                <button
                  onClick={handleSaveAttendance}
                  className="px-4 py-1.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-md shadow-primary-600/20 flex items-center gap-1 transition-all"
                >
                  <Save className="w-3.5 h-3.5" /> Save Attendance
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 dark:bg-slate-800 uppercase font-semibold text-slate-500">
                  <tr>
                    <th className="p-3">Roll No</th>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Avg Attendance</th>
                    <th className="p-3 text-center">Today's Status</th>
                    <th className="p-3">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredStudents.map((s) => {
                    const status = attendanceState[s.id] || 'Present';
                    return (
                      <tr key={s.id} className="table-hover-row">
                        <td className="p-3 font-mono font-bold text-primary-600">{s.rollNumber}</td>
                        <td className="p-3 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <img src={s.avatarUrl} alt={s.fullName} className="w-7 h-7 rounded-full object-cover" />
                          <span>{s.fullName}</span>
                        </td>
                        <td className="p-3 font-semibold">
                          <span className={s.attendancePercentage < 75 ? 'text-red-600 font-bold' : 'text-slate-700 dark:text-slate-300'}>
                            {s.attendancePercentage}%
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex justify-center gap-1">
                            <button
                              onClick={() => handleStatusToggle(s.id, 'Present')}
                              className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
                                status === 'Present'
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-emerald-100'
                              }`}
                            >
                              P
                            </button>
                            <button
                              onClick={() => handleStatusToggle(s.id, 'Absent')}
                              className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
                                status === 'Absent'
                                  ? 'bg-red-600 text-white shadow-xs'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-red-100'
                              }`}
                            >
                              A
                            </button>
                            <button
                              onClick={() => handleStatusToggle(s.id, 'Late')}
                              className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
                                status === 'Late'
                                  ? 'bg-amber-500 text-white shadow-xs'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-amber-100'
                              }`}
                            >
                              L
                            </button>
                          </div>
                        </td>
                        <td className="p-3">
                          <input
                            type="text"
                            placeholder="Optional note..."
                            value={remarks[s.id] || ''}
                            onChange={(e) => setRemarks({ ...remarks, [s.id]: e.target.value })}
                            className="w-full px-2 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Sidebar Analytics: Low Attendance & Heatmap */}
        <div className="lg:col-span-4 space-y-6">
          {/* Low Attendance Alert Card */}
          <div className="saas-card p-5 border-l-4 border-l-red-500">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
              <TrendingDown className="w-4 h-4 text-red-500" /> Critical Attendance Flag (&lt;75%)
            </h3>
            <div className="space-y-2.5 max-h-60 overflow-y-auto">
              {lowAttendanceStudents.map(s => (
                <div key={s.id} className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/40 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{s.fullName}</p>
                    <p className="text-[10px] text-slate-500">{s.departmentName} ({s.rollNumber})</p>
                  </div>
                  <span className="text-xs font-black text-red-600">{s.attendancePercentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Slot Attendance Heatmap */}
          <div className="saas-card p-5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Weekly Timetable Heatmap</h3>
            <AttendanceHeatmap />
          </div>
        </div>

      </div>
    </div>
  );
};
