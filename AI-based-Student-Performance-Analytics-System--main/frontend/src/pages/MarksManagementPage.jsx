import React, { useState, useEffect } from "react";
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { MarksDistributionChart } from '../components/charts/MarksDistributionChart';
import { SubjectPerformanceChart } from '../components/charts/SubjectPerformanceChart';
import { validateMarks } from "../validation/marksValidation";
import {
  GraduationCap,
  Upload,
  Save,
  Calculator,
  Download,
  Award,
  TrendingUp,
  AlertCircle,
  Sparkles
} from 'lucide-react';


export const MarksManagementPage = () => {
  const {
    students,
    marks,
    dashboardData,
    saveMarks,
    autoCalculateGrades,
    setActiveModal
} = useApp();
  const { addToast } = useToast();

  const [selectedDept, setSelectedDept] = useState('Computer Science');
  const [selectedExam, setSelectedExam] = useState('Final Semester');
  const [selectedSubject, setSelectedSubject] = useState('Machine Learning');

  const departments = [
    "All",
    ...new Set(
        students.map(s => s.departmentName)
    )
];

  const [marksState, setMarksState] = useState({});

  const [markErrors, setMarkErrors] = useState({});

 useEffect(() => {

    const map = {};

    marks
        .filter(mark => mark.subjectName === selectedSubject)
        .forEach(mark => {

            map[mark.studentId] = {
                assignment: mark.assignmentMarks,
                internal: mark.internalMarks,
                practical: mark.practicalMarks,
                finalExam: mark.finalExamMarks
            };

        });

    setMarksState(map);

}, [marks, selectedSubject]);


  const calculateGrade = (total) => {
    if (total >= 90) return 'A+';
    if (total >= 80) return 'A';
    if (total >= 70) return 'B+';
    if (total >= 60) return 'B';
    if (total >= 50) return 'C';
    if (total >= 40) return 'D';
    return 'F';
  };

  const handleInputChange = (id, field, value) => {
    setMarksState(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: Number(value) || 0 }
    }));
  };

  const handleAutoCalculate = async () => {

    await autoCalculateGrades();

    addToast(
        "Grades Calculated",
        "Student grades were recalculated successfully.",
        "success"
    );

};

  const handleSaveMarks = async () => {

    const marksList = filteredStudents.map(student => ({

        studentId: student.id,

        subjectName: selectedSubject,

        examTerm: selectedExam,

        assignmentMarks: marksState[student.id]?.assignment || 0,

        internalMarks: marksState[student.id]?.internal || 0,

        practicalMarks: marksState[student.id]?.practical || 0,

        finalExamMarks: marksState[student.id]?.finalExam || 0

    }));

    const errors = {};

marksList.forEach(mark => {

    const validation = validateMarks({
        assignmentMarks: mark.assignmentMarks,
        internalMarks: mark.internalMarks,
        practicalMarks: mark.practicalMarks,
        finalExamMarks: mark.finalExamMarks
    });

    if (Object.keys(validation).length > 0)
    {
        errors[mark.studentId] = validation;
    }

});

if (Object.keys(errors).length > 0)
{
    setMarkErrors(errors);

    addToast(
        "Validation Error",
        "Please correct invalid marks before saving.",
        "warning"
    );

    return;
}

setMarkErrors({});

    await saveMarks(marksList);

    addToast(
        "Marks Saved",
        "Evaluation records committed successfully.",
        "success"
    );
};

  const handleExportMarks = () => {
    addToast('Export Generated', `Marksheet exported to ${selectedSubject}_FinalScores.xlsx`, 'info');
  };

  const filteredStudents =
    selectedDept === "All"
        ? students
        : students.filter(
              s => s.departmentName === selectedDept
          );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Marks Management & Grade Calculation Cell
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Input internal assessment scores, run automated grade weighting algorithms, and publish marksheets.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveModal('uploadMarks')}
            className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Upload className="w-4 h-4" /> Upload Excel
          </button>
          <button
            onClick={handleAutoCalculate}
            className="px-3.5 py-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold text-xs rounded-xl hover:bg-emerald-100 flex items-center gap-1.5 transition-colors"
          >
            <Calculator className="w-4 h-4" /> Auto-Calculate Grades
          </button>
          <button
            onClick={handleExportMarks}
            className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4" /> Export Marksheet
          </button>
          <button
            onClick={handleSaveMarks}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-md shadow-primary-600/20 flex items-center gap-1.5 transition-all"
          >
            <Save className="w-4 h-4" /> Save Evaluation
          </button>
        </div>
      </div>

      {/* Top 4 Exam Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="saas-card p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase text-slate-400 block">Highest Mark</span>
            <span className="text-2xl font-black text-emerald-600">{dashboardData?.highestMark?.toFixed(1) ?? "0"}%</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">{dashboardData?.highestStudent ?? "No Data"}</span>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-xl">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="saas-card p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase text-slate-400 block">Lowest Mark</span>
            <span className="text-2xl font-black text-red-600">{dashboardData?.lowestMark?.toFixed(1) ?? "0"}%</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">{dashboardData?.lowestStudent ?? "No Data"}</span>
          </div>
          <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 rounded-xl">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="saas-card p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase text-slate-400 block">Class Average</span>
            <span className="text-2xl font-black text-primary-600">{students.length
                                                                        ? (
                                                                            students.reduce(
                                                                                (sum, s) => sum + s.averageMarks,
                                                                                0
                                                                            ) / students.length
                                                                          ).toFixed(1)
                                                                        : "0.0"}%</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Target: 75.0%</span>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-primary-600 rounded-xl">
            <GraduationCap className="w-6 h-6" />
          </div>
        </div>

        <div className="saas-card p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase text-slate-400 block">Pass Rate</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white">{dashboardData?.passRate?.toFixed(1) ?? "0"}%</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">{students.filter(s => s.averageMarks < 40).length} Students Failed</span>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="saas-card p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Department</label>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full px-3 py-1.5 text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
          >
            <option value="All">All Departments</option>
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Subject</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full px-3 py-1.5 text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
          >
            <option value="Machine Learning">Machine Learning</option>
            <option value="Data Structures">Data Structures</option>
            <option value="Database Systems">Database Systems</option>
            <option value="Web Architecture">Web Architecture</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Exam Term</label>
          <select
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
            className="w-full px-3 py-1.5 text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
          >
            <option value="Final Semester">End Semester Final Exam</option>
            <option value="Mid Term 1">Mid Term Test 1</option>
            <option value="Mid Term 2">Mid Term Test 2</option>
            <option value="Practical Lab">Practical / Lab Viva</option>
          </select>
        </div>
      </div>

      {/* Main Student Marks Table */}
      <div className="saas-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 dark:bg-slate-800 uppercase font-semibold text-slate-500 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3 pl-5">Roll No</th>
                <th className="p-3">Student Name</th>
                <th className="p-3">Assignment (20)</th>
                <th className="p-3">Internal Test (30)</th>
                <th className="p-3">Practical Lab (20)</th>
                <th className="p-3">End Sem Exam (100)</th>
                <th className="p-3">Calculated Total</th>
                <th className="p-3 pr-5">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredStudents.map((s) => {
                const scores = marksState[s.id] || {
                    assignment: 0,
                    internal: 0,
                    practical: 0,
                    finalExam: 0
                };
                const total = Math.round((scores.assignment + scores.internal + scores.practical + scores.finalExam) / 1.7);
                const grade = calculateGrade(total);

                return (
                  <tr key={s.id} className="table-hover-row">
                    <td className="p-3 pl-5 font-mono font-bold text-primary-600">{s.rollNumber}</td>
                    <td className="p-3 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <img src={s.avatarUrl} alt={s.fullName} className="w-7 h-7 rounded-full object-cover" />
                      <span>{s.fullName}</span>
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={scores.assignment}
                        onChange={(e) => handleInputChange(s.id, 'assignment', e.target.value)}
                        className={`w-16 px-2 py-1 rounded-lg text-center font-bold ${
                          markErrors[s.id]?.assignmentMarks
                            ? "border border-red-500 bg-red-50 dark:bg-red-950"
                            : "border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                        }`}
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        min="0"
                        max="30"
                        value={scores.internal}
                        onChange={(e) => handleInputChange(s.id, 'internal', e.target.value)}
                        className={`w-16 px-2 py-1 rounded-lg text-center font-bold ${
                          markErrors[s.id]?.internalMarks
                            ? "border border-red-500 bg-red-50 dark:bg-red-950"
                            : "border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                        }`}
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={scores.practical}
                        onChange={(e) => handleInputChange(s.id, 'practical', e.target.value)}
                        className={`w-16 px-2 py-1 rounded-lg text-center font-bold ${
                          markErrors[s.id]?.practicalMarks
                            ? "border border-red-500 bg-red-50 dark:bg-red-950"
                            : "border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                        }`}
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={scores.finalExam}
                        onChange={(e) => handleInputChange(s.id, 'finalExam', e.target.value)}
                        className={`w-20 px-2 py-1 rounded-lg text-center font-bold ${
                          markErrors[s.id]?.finalExamMarks
                            ? "border border-red-500 bg-red-50 dark:bg-red-950"
                            : "border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                        }`}
                      />
                    </td>
                    <td className="p-3 font-black text-slate-900 dark:text-white text-sm">{total}%</td>
                    <td className="p-3 pr-5">
                      <span className={`px-2.5 py-1 rounded-full font-extrabold ${
                        grade.startsWith('A') 
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : grade.startsWith('B')
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                          : grade === 'F'
                          ? 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}>
                        {grade}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Marks Analytics Bottom Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 saas-card p-5">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Grade Distribution Curve</h3>
          <MarksDistributionChart />
        </div>
        <div className="lg:col-span-6 saas-card p-5">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Subject Performance Averages</h3>
          <SubjectPerformanceChart />
        </div>
      </div>
    </div>
  );
};
