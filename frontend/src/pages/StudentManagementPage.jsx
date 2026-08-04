import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { Badge } from '../components/common/Badge';
import { SearchFilterBar } from '../components/common/SearchFilterBar';
import {
  UserPlus,
  Upload,
  Download,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';

export const StudentManagementPage = () => {
  const {
    students,
    deleteStudent,
    filters,
    setActiveModal,
    setSelectedStudent
  } = useApp();

  const { addToast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter logic
  // Filter logic
  const filteredStudents = students.filter((s) => {
  const search = filters.searchQuery.toLowerCase();

  const matchesSearch =
    s.fullName.toLowerCase().includes(search) ||
    s.rollNumber.toLowerCase().includes(search) ||
    s.registrationId.toLowerCase().includes(search);

  const matchesDept =
    filters.department === "All" ||
    s.departmentName === filters.department;

  const matchesSem =
    filters.semester === "All" ||
    s.semester === Number(filters.semester);

  const matchesDiv =
    filters.division === "All" ||
    s.division === filters.division;

  return matchesSearch && matchesDept && matchesSem && matchesDiv;
});

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage) || 1;
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name} from the roster?`)) {
      await deleteStudent(id);
      addToast('Student Removed', `${name} record has been removed.`, 'info');
    }
  };

  const handleExportCSV = () => {
    addToast('Export Started', 'Student database exported to Student_Roster_2026.csv', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Student Management Cell
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage student registrations, academic profiles, guardian details, and risk flags.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveModal('addStudent')}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-md shadow-primary-600/20 flex items-center gap-1.5 transition-all"
          >
            <UserPlus className="w-4 h-4" /> Enroll Student
          </button>
          {/* <button
            onClick={() => setActiveModal('uploadAttendance')}
            className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Upload className="w-4 h-4" /> Import CSV
          </button>
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4" /> Export Excel
          </button> */}
        </div>
      </div>

      {/* Advanced Filter Component */}
      <SearchFilterBar />

      {/* Student Roster Table */}
      <div className="saas-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100/80 dark:bg-slate-800/80 uppercase font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200/80 dark:border-slate-700">
              <tr>
                <th className="p-3.5 pl-5">Photo / ID</th>
                <th className="p-3.5">Roll No</th>
                <th className="p-3.5">Full Name</th>
                <th className="p-3.5">Department</th>
                <th className="p-3.5">Semester</th>
                <th className="p-3.5">Attendance</th>
                <th className="p-3.5">Avg Marks</th>
                <th className="p-3.5">Risk Status</th>
                <th className="p-3.5 text-right pr-5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginatedStudents.length > 0 ? (
                paginatedStudents.map((s) => (
                  <tr key={s.id} className="table-hover-row">
                    <td className="p-3.5 pl-5 flex items-center gap-3">
                      <img
                        src={s.avatarUrl}
                        alt={s.fullName}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                      />
                      <div>
                          <div className="font-semibold text-slate-200">
                              {s.registrationId}
                          </div>

                          <div className="text-[11px] text-slate-400">
                              {s.rollNumber}
                          </div>
                      </div>
                    </td>
                    <td className="p-3.5 font-bold font-mono text-primary-600 dark:text-primary-400">{s.rollNumber}</td>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">{s.fullName}</td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-300">{s.departmentName}</td>
                    <div>
                        <div className="font-medium">
                            Semester {s.semester}
                        </div>

                        <div className="text-xs text-slate-400">
                            Division {s.division}
                        </div>
                    </div>
                    <td className="p-3.5">
                      <span className={`font-bold ${s.attendancePercentage < 75 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                        {s.attendancePercentage}%
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-slate-800 dark:text-slate-200">{s.averageMarks}%</td>
                    <td className="p-3.5">
                      <Badge variant={s.riskLevel}>{s.riskLevel}</Badge>
                    </td>
                    <td className="p-3.5 text-right pr-5">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setSelectedStudent(s);
                            setActiveModal('viewProfile');
                          }}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors"
                          title="View Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedStudent(s);
                            setActiveModal('editStudent');
                          }}
                          className="p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                          title="Edit Student"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(s.id, s.fullName)}
                          className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="p-8 text-center text-slate-400">
                    No students match your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {paginatedStudents.length} of {filteredStudents.length} Students</span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-slate-700 dark:text-slate-300">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
