import React, { useEffect, useState } from "react";
import api from "../services/api"; // adjust the path if your api.js is elsewhere

export const StudentDashboardPage = () => {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await api.get("/my/dashboard");
        setDashboard(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    loadDashboard();
  }, []);

  if (!dashboard) {
    return (
      <div className="text-center mt-10 text-slate-500">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <h1 className="text-3xl font-bold">
        Welcome, {dashboard.fullName}
      </h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="saas-card p-5">
          <h3>Attendance</h3>
          <p className="text-2xl font-bold">
            {dashboard.attendancePercentage}%
          </p>
        </div>

        <div className="saas-card p-5">
          <h3>Average Marks</h3>
          <p className="text-2xl font-bold">
            {dashboard.averageMarks}
          </p>
        </div>

        <div className="saas-card p-5">
          <h3>Current GPA</h3>
          <p className="text-2xl font-bold">
            {dashboard.currentGpa}
          </p>
        </div>

        <div className="saas-card p-5">
          <h3>Predicted Grade</h3>
          <p className="text-2xl font-bold">
            {dashboard.predictedGrade}
          </p>
        </div>

      </div>

      <div className="saas-card p-5">
        <h2 className="font-bold mb-2">
          AI Recommendation
        </h2>

        <p>{dashboard.aiRecommendation}</p>
      </div>

    </div>
  );
};