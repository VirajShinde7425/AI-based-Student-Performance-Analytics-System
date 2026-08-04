import React, { useState, useEffect } from "react";
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { useApp } from '../../context/AppContext';
import { PerformanceRadarChart } from '../charts/PerformanceRadarChart';
import { User, BookOpen, Calendar, ShieldCheck, Sparkles, BrainCircuit, Phone, Mail, Award } from 'lucide-react';
import api from "../../services/api";

export const StudentProfileModal = () => {
  const { activeModal, setActiveModal, selectedStudent } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const [marks, setMarks] = useState([]);

  useEffect(() => {

    if (!selectedStudent) return;

    api
        .get(`/Marks/student/${selectedStudent.id}`)
        .then(res => setMarks(res.data))
        .catch(console.error);

}, [selectedStudent]);

  if (!selectedStudent) return null;

  return (
    <Modal
      isOpen={activeModal === 'viewProfile'}
      onClose={() => setActiveModal(null)}
      title={`Student Profile: ${selectedStudent.fullName}`}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6">
        {/* Top Header Card */}
        <div className="flex flex-col sm:flex-row items-center gap-5 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/80 rounded-2xl border border-blue-100 dark:border-slate-700">
          <img
            src={selectedStudent.avatarUrl}
            alt={selectedStudent.fullName}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-white dark:border-slate-700 shadow-md"
          />
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{selectedStudent.fullName}</h2>
              <Badge variant={selectedStudent.riskLevel}>{selectedStudent.riskLevel} Risk</Badge>
              <Badge variant="primary">Sem {selectedStudent.semester} - Div {selectedStudent.division}</Badge>
            </div>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-1">
              Roll No: <span className="text-primary-600 dark:text-primary-400">{selectedStudent.rollNumber}</span> | ID: {selectedStudent.id}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{selectedStudent.departmentName} Department</p>
          </div>

          <div className="flex items-center gap-4 text-center sm:text-right border-t sm:border-t-0 sm:border-l border-blue-200 dark:border-slate-700 pt-3 sm:pt-0 sm:pl-5">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">GPA</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white">{selectedStudent.currentGpa}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Attendance</span>
              <span className={`text-2xl font-black ${selectedStudent.attendancePercentage < 75 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                {selectedStudent.attendancePercentage}%
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            <User className="w-4 h-4" /> Personal & Academic Info
          </button>

          <button
            onClick={() => setActiveTab('marks')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'marks'
                ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            <Award className="w-4 h-4" /> Subject Marks & GPA
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'analytics'
                ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            <BrainCircuit className="w-4 h-4" /> Skills & Radar Analysis
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary-600" /> Academic Details
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Department</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedStudent.departmentName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Semester & Division</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Sem {selectedStudent.semester} (Div {selectedStudent.division})</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Enrollment Email</span>
                  <span className="font-semibold text-primary-600">{selectedStudent.email}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Academic Status</span>
                  <Badge variant={selectedStudent.status}>{selectedStudent.status}</Badge>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Guardian Information
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Guardian Name</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedStudent.guardianName || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Contact Number</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedStudent.guardianPhone || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Emergency Alert Status</span>
                  <span className="text-emerald-600 font-bold">SMS Notifications Active</span>
                </div>
              </div>
            </div>

            {/* AI Summary Card */}
            <div className="md:col-span-2 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h4 className="text-xs font-bold uppercase text-emerald-800 dark:text-emerald-300">AI Diagnostic Summary</h4>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {selectedStudent.aiRecommendation}
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Subject Marks */}
{activeTab === "marks" && (
  <div className="space-y-4">
    <table className="w-full text-xs text-left">
      <thead className="bg-slate-100 dark:bg-slate-700/60 uppercase font-semibold text-slate-600 dark:text-slate-300">
        <tr>
          <th className="p-3 rounded-l-xl">Subject</th>
          <th className="p-3">Assignment (20)</th>
          <th className="p-3">Internal (30)</th>
          <th className="p-3">Practical (20)</th>
          <th className="p-3">Final Exam (100)</th>
          <th className="p-3">Total Score</th>
          <th className="p-3 rounded-r-xl">Grade</th>
        </tr>
      </thead>

      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
        {marks.length > 0 ? (
          marks.map((m) => (
            <tr
              key={`${m.subjectName}-${m.examTerm}`}
              className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
            >
              <td className="p-3 font-bold text-slate-800 dark:text-slate-200">
                {m.subjectName}
              </td>

              <td className="p-3">{m.assignmentMarks}</td>

              <td className="p-3">{m.internalMarks}</td>

              <td className="p-3">{m.practicalMarks}</td>

              <td className="p-3">{m.finalExamMarks}</td>

              <td className="p-3 font-bold text-primary-600">
                {m.totalScore}
              </td>

              <td className="p-3">
                <span className="px-2 py-0.5 rounded-full font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                  {m.grade}
                </span>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan="7"
              className="p-6 text-center text-slate-400"
            >
              No marks available for this student.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
)}

        {/* Tab 3: Radar Chart */}
        {activeTab === 'analytics' && (
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
            <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">Student Competency Skill Radar</h4>
            <PerformanceRadarChart skills={selectedStudent.skills} />
          </div>
        )}
      </div>
    </Modal>
  );
};
