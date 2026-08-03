import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useApp } from '../../context/AppContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const AttendanceTrendChart = () => {
  const { darkMode, dashboardData } = useApp();

  const data = {
    labels:
    dashboardData?.attendanceTrend?.map(x => x.week) ?? [],
    datasets: [
      {
        fill: true,
        label: 'Overall Attendance (%)',
        data:
            dashboardData?.attendanceTrend?.map(x => x.attendance) ?? [],
        borderColor: '#2563EB',
        backgroundColor: darkMode ? 'rgba(37, 99, 235, 0.15)' : 'rgba(37, 99, 235, 0.08)',
        tension: 0.4,
        pointBackgroundColor: '#2563EB',
        pointBorderColor: '#fff',
        pointHoverRadius: 6,
      },
      {
        fill: false,
        label: 'Benchmark (85%)',
        data:
            dashboardData?.attendanceTrend?.map(() => 85) ?? [],
        borderColor: '#EF4444',
        borderDash: [5, 5],
        pointRadius: 0,
      }
    ],
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
        padding: 10,
        boxPadding: 4,
        usePointStyle: true,
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: darkMode ? '#94A3B8' : '#64748B', font: { family: 'Inter', size: 11 } }
      },
      y: {
        min: 60,
        max: 100,
        grid: { color: darkMode ? 'rgba(51, 65, 85, 0.5)' : 'rgba(226, 232, 240, 0.6)' },
        ticks: { color: darkMode ? '#94A3B8' : '#64748B', font: { family: 'Inter', size: 11 } }
      }
    }
  };

  return (
    <div className="w-full h-64">
      <Line data={data} options={options} />
    </div>
  );
};
