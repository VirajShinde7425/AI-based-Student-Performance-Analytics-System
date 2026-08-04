import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useApp } from '../../context/AppContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const DepartmentComparisonChart = () => {
  const { darkMode, dashboardData } = useApp();

  const data = {
    labels:
      dashboardData?.departmentComparison?.map(d => d.department) ?? [],

  datasets: [
    {
      label: "Avg Marks (%)",

      data:
        dashboardData?.departmentComparison?.map(d => d.averageMarks) ?? [],

      backgroundColor: "#2563EB",

      borderRadius: 6,
    },

    {
      label: "Avg Attendance (%)",

      data:
        dashboardData?.departmentComparison?.map(d => d.attendance) ?? [],

      backgroundColor: "#10B981",

      borderRadius: 6,
    }
  ]
};

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: darkMode ? '#94A3B8' : '#475569',
          font: { family: 'Inter', size: 12, weight: '500' }
        }
      },
      tooltip: {
        backgroundColor: darkMode ? '#1E293B' : '#FFFFFF',
        titleColor: darkMode ? '#F8FAFC' : '#0F172A',
        bodyColor: darkMode ? '#CBD5E1' : '#334155',
        borderColor: darkMode ? '#334155' : '#E2E8F0',
        borderWidth: 1,
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: darkMode ? '#94A3B8' : '#64748B', font: { family: 'Inter', size: 10 } }
      },
      y: {
        min: 50,
        max: 100,
        grid: { color: darkMode ? 'rgba(51, 65, 85, 0.5)' : 'rgba(226, 232, 240, 0.6)' },
        ticks: { color: darkMode ? '#94A3B8' : '#64748B', font: { family: 'Inter', size: 11 } }
      }
    }
  };

  return (
    <div className="w-full h-64">
      <Bar data={data} options={options} />
    </div>
  );
};
