import React from "react";
import { useApp } from "../context/AppContext";

export const AdminDashboardPage = () => {

    const { adminDashboard } = useApp();

    console.log(adminDashboard);

    return (
        <div className="space-y-6">

            <div>
                <h1 className="text-3xl font-bold">
                    Admin Dashboard
                </h1>

                <p className="text-slate-500 mt-1">
                    Manage teachers, students and institutional configuration.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow">
                    <p className="text-sm text-slate-500">
                        Total Teachers
                    </p>

                    <h2 className="text-3xl font-bold mt-2">
                        {adminDashboard?.totalTeachers ?? 0}
                    </h2>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow">
                    <p className="text-sm text-slate-500">
                        Total Students
                    </p>

                    <h2 className="text-3xl font-bold mt-2">
                        {adminDashboard?.totalStudents ?? 0}
                    </h2>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow">
                    <p className="text-sm text-slate-500">
                        Departments
                    </p>

                    <h2 className="text-3xl font-bold mt-2">
                        {adminDashboard?.totalDepartments ?? 0}
                    </h2>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow">
                    <p className="text-sm text-slate-500">
                        System Status
                    </p>

                    <h2 className="text-2xl font-bold mt-2 text-emerald-500">
                        {adminDashboard?.systemStatus ?? "Offline"}
                    </h2>
                </div>

            </div>

        </div>
    );
};

export default AdminDashboardPage;