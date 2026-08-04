import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useApp } from '../../context/AppContext';

ChartJS.register(ArcElement, Tooltip, Legend);

export const SubjectPerformanceChart = () => {
  const { darkMode, dashboardData } = useApp();

  const data = {
    labels:
      dashboardData?.subjectPerformance?.map(s => s.subject) ?? [],

  datasets: [
    {
      data:
        dashboardData?.subjectPerformance?.map(s => s.averageMarks) ?? [],

      backgroundColor: [
        "#2563EB",
        "#3B82F6",
        "#10B981",
        "#F59E0B",
        "#8B5CF6",
        "#EC4899",
        "#14B8A6",
        "#F97316"
      ],

      borderWidth: 2,

      borderColor: darkMode ? "#1E293B" : "#FFFFFF",
    }
  ]
};

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: darkMode ? '#94A3B8' : '#475569',
          font: { family: 'Inter', size: 11, weight: '500' },
          boxWidth: 12,
        }
      },
      tooltip: {
        backgroundColor: darkMode ? '#1E293B' : '#FFFFFF',
        titleColor: darkMode ? '#F8FAFC' : '#0F172A',
        bodyColor: darkMode ? '#CBD5E1' : '#334155',
        borderColor: darkMode ? '#334155' : '#E2E8F0',
        borderWidth: 1,
        callbacks: {
          label: (context) => ` ${context.label}: ${context.raw}% Average`
        }
      }
    },
    cutout: '70%',
  };

  return (
    <div className="w-full h-64 flex items-center justify-center">
      <Doughnut data={data} options={options} />
    </div>
  );
};
