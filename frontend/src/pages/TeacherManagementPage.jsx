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

export const TeacherManagementPage = () => {

  //console.log("TeacherManagementPage Rendered");

    const {
        teachers,
        deleteTeacher,
        resetTeacherPassword,
        setSelectedTeacher,
        setActiveModal
    } = useApp();

    //console.log("Teachers :", teachers);

    const { addToast } = useToast();

    const [currentPage, setCurrentPage] = useState(1);

    const [searchQuery, setSearchQuery] = useState("");

    const itemsPerPage = 6;

const filteredTeachers = teachers.filter((teacher) => {

    const query = searchQuery.toLowerCase();

    return (

        teacher.fullName.toLowerCase().includes(query) ||

        teacher.email.toLowerCase().includes(query) ||

        teacher.department.toLowerCase().includes(query)

    );

});

const totalPages =
    Math.ceil(filteredTeachers.length / itemsPerPage) || 1;

const paginatedTeachers =
    filteredTeachers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleDelete = async (id, name) => {

        if (
            window.confirm(
                `Delete ${name}?`
            )
        ) {

            await deleteTeacher(id);

            addToast(
                "Teacher Deleted",
                `${name} has been removed.`,
                "success"
            );

        }

    };

    const handleResetPassword = async (id) => {

        await resetTeacherPassword(id);

        addToast(
            "Password Reset",
            "Password reset to Teacher@123",
            "success"
        );

    };

    return (

        <div className="space-y-6">

            {/* Header */}

            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">

                        Teacher Management

                    </h1>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">

                        Manage faculty accounts, departments and login credentials.

                    </p>

                </div>

                <button

                    onClick={() => setActiveModal("addTeacher")}

                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-xs flex items-center gap-2"

                >

                    <UserPlus className="w-4 h-4" />

                    Add Teacher

                </button>

            </div>

            

            <div className="flex justify-between items-center">

                <input
                    type="text"
                    placeholder="Search by teacher name, email or department..."
                    value={searchQuery}
                    onChange={(e) => {

                        setSearchQuery(e.target.value);

                        setCurrentPage(1);

                    }}
                    className="w-96 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />

            </div>



            <div className="saas-card overflow-hidden">

                <div className="overflow-x-auto">

                    <table className="w-full text-xs text-left">

                        <thead className="bg-slate-100/80 dark:bg-slate-800/80 uppercase font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">

                            <tr>

                                <th className="p-3.5 pl-5">
                                    Photo
                                </th>

                                <th className="p-3.5">
                                    Teacher Name
                                </th>

                                <th className="p-3.5">
                                    Email
                                </th>

                                <th className="p-3.5">
                                    Department
                                </th>

                                <th className="p-3.5">
                                    Academic Title
                                </th>

                                <th className="p-3.5 text-right pr-5">
                                    Actions
                                </th>

                            </tr>

                        </thead>

                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">

    {paginatedTeachers.length > 0 ? (

        paginatedTeachers.map((teacher) => (

            <tr
                key={teacher.id}
                className="table-hover-row"
            >

                <td className="p-3.5 pl-5">

                    <img
                        src={teacher.avatarUrl}
                        alt={teacher.fullName}
                        className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700"
                    />

                </td>

                <td className="p-3.5">

                    <div className="font-bold text-slate-900 dark:text-white">

                        {teacher.fullName}

                    </div>

                </td>

                <td className="p-3.5">

                    {teacher.email}

                </td>

                <td className="p-3.5">

                    {teacher.department}

                </td>

                <td className="p-3.5">

                    {teacher.title}

                </td>

                <td className="p-3.5">

                    <div className="flex justify-end gap-2">

                        <button

                            onClick={() => {

                                setSelectedTeacher(teacher);

                                setActiveModal("editTeacher");

                            }}

                            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"

                            title="Edit Teacher"

                        >

                            <Edit className="w-4 h-4" />

                        </button>

                        <button

                            onClick={() =>
                                handleResetPassword(
                                    teacher.id
                                )
                            }

                            className="px-2 py-1 rounded-lg text-xs bg-yellow-500 hover:bg-yellow-600 text-white"

                        >

                            Reset

                        </button>

                        <button

                            onClick={() =>
                                handleDelete(
                                    teacher.id,
                                    teacher.fullName
                                )
                            }

                            className="p-2 rounded-lg text-red-600 hover:bg-red-100 dark:hover:bg-red-900"

                        >

                            <Trash2 className="w-4 h-4" />

                        </button>

                    </div>

                </td>

            </tr>

        ))

    ) : (

        <tr>

            <td
                colSpan="6"
                className="text-center py-10 text-slate-500"
            >

                No teachers found.

            </td>

        </tr>

    )}

</tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {paginatedTeachers.length} of {filteredTeachers.length} Teachers</span>

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
