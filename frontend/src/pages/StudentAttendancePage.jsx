import React, { useEffect, useState } from "react";
import api from "../services/api";
import { CalendarCheck, CheckCircle2, XCircle, Clock } from "lucide-react";

export const StudentAttendancePage = () => {
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    const loadAttendance = async () => {
      try {
        const response = await api.get("/my/attendance");
        setAttendance(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    loadAttendance();
  }, []);

  const present = attendance.filter(a => a.status === "Present").length;
  const absent = attendance.filter(a => a.status === "Absent").length;
  const late = attendance.filter(a => a.status === "Late").length;

  const percentage =
    attendance.length === 0
      ? 0
      : ((present + late * 0.5) / attendance.length * 100).toFixed(1);

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          My Attendance
        </h1>

        <p className="text-sm text-slate-500">
          View your attendance history and attendance statistics.
        </p>
      </div>

      {/* KPI Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="saas-card p-5">
          <CalendarCheck className="w-7 h-7 text-blue-600 mb-2" />
          <p className="text-xs uppercase text-slate-500">
            Attendance
          </p>
          <h2 className="text-3xl font-bold">
            {percentage}%
          </h2>
        </div>

        <div className="saas-card p-5">
          <CheckCircle2 className="w-7 h-7 text-green-600 mb-2" />
          <p className="text-xs uppercase text-slate-500">
            Present
          </p>
          <h2 className="text-3xl font-bold">
            {present}
          </h2>
        </div>

        <div className="saas-card p-5">
          <XCircle className="w-7 h-7 text-red-600 mb-2" />
          <p className="text-xs uppercase text-slate-500">
            Absent
          </p>
          <h2 className="text-3xl font-bold">
            {absent}
          </h2>
        </div>

        <div className="saas-card p-5">
          <Clock className="w-7 h-7 text-yellow-600 mb-2" />
          <p className="text-xs uppercase text-slate-500">
            Late
          </p>
          <h2 className="text-3xl font-bold">
            {late}
          </h2>
        </div>

      </div>

      {/* Attendance Table */}

      <div className="saas-card overflow-hidden">

        <table className="w-full">

          <thead className="bg-slate-100 dark:bg-slate-800">

            <tr>

              <th className="text-left p-4">Date</th>

              <th className="text-left p-4">Subject</th>

              <th className="text-left p-4">Status</th>

            </tr>

          </thead>

          <tbody>

            {attendance.map((record, index) => (

              <tr
                key={index}
                className="border-t border-slate-200 dark:border-slate-700"
              >

                <td className="p-4">
                  {new Date(record.date).toLocaleDateString()}
                </td>

                <td className="p-4">
                  {record.subject}
                </td>

                <td className="p-4">

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${
                      record.status === "Present"
                        ? "bg-green-100 text-green-700"
                        : record.status === "Absent"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {record.status}
                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};