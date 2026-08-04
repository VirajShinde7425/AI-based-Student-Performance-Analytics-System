import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { useApp } from '../../context/AppContext';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export const PerformanceRadarChart = ({ skills }) => {
  const { darkMode } = useApp();

  const skillData = skills || {
    coding: 88,
    theory: 82,
    lab: 90,
    aptitude: 85,
    projects: 91,
    softSkills: 84
  };

  const data = {
    labels: ['Coding & Algorithmic', 'Theoretical Mastery', 'Laboratory / Practical', 'Logical Aptitude', 'Project Implementation', 'Soft Skills & Leadership'],
    datasets: [
      {
        label: 'Current Batch Average',
        data: [skillData.coding, skillData.theory, skillData.lab, skillData.aptitude, skillData.projects, skillData.softSkills],
        backgroundColor: darkMode ? 'rgba(37, 99, 235, 0.25)' : 'rgba(37, 99, 235, 0.15)',
        borderColor: '#2563EB',
        borderWidth: 2,
        pointBackgroundColor: '#2563EB',
        pointBorderColor: '#fff',
        pointHoverRadius: 6,
      },
      {
        label: 'Institutional Target Benchmark',
        data: [85, 80, 85, 80, 85, 80],
        backgroundColor: darkMode ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.1)',
        borderColor: '#10B981',
        borderWidth: 1.5,
        borderDash: [4, 4],
        pointRadius: 0,
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
          font: { family: 'Inter', size: 11, weight: '500' }
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
      r: {
        min: 40,
        max: 100,
        angleLines: { color: darkMode ? 'rgba(51, 65, 85, 0.5)' : 'rgba(226, 232, 240, 0.8)' },
        grid: { color: darkMode ? 'rgba(51, 65, 85, 0.5)' : 'rgba(226, 232, 240, 0.8)' },
        pointLabels: {
          color: darkMode ? '#CBD5E1' : '#475569',
          font: { family: 'Inter', size: 10, weight: '600' }
        },
        ticks: { display: false }
      }
    }
  };

  return (
    <div className="w-full h-72">
      <Radar data={data} options={options} />
    </div>
  );
};
