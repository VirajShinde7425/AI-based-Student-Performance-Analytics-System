import React from 'react';

export const AttendanceHeatmap = () => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const slots = ['Slot 1 (9 AM)', 'Slot 2 (10 AM)', 'Slot 3 (11 AM)', 'Slot 4 (1 PM)', 'Slot 5 (2 PM)', 'Slot 6 (3 PM)'];

  // Matrix data (Attendance % for day vs slot)
  const heatmapData = [
    [95, 96, 92, 88, 85, 82],
    [94, 98, 95, 90, 88, 86],
    [92, 94, 91, 86, 84, 79],
    [96, 95, 93, 89, 87, 85],
    [90, 91, 88, 82, 75, 68], // Low attendance on Friday afternoon
    [88, 85, 80, 72, 65, 58], // Saturday afternoons low
  ];

  const getColor = (val) => {
    if (val >= 90) return 'bg-emerald-500 text-white';
    if (val >= 80) return 'bg-emerald-400/80 text-white';
    if (val >= 75) return 'bg-amber-400 text-slate-900';
    if (val >= 65) return 'bg-orange-400 text-white';
    return 'bg-red-500 text-white font-bold';
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-xs text-center border-collapse">
        <thead>
          <tr>
            <th className="p-2 text-left text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">Day / Time</th>
            {slots.map((s, idx) => (
              <th key={idx} className="p-2 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">{s}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {days.map((day, dIdx) => (
            <tr key={day}>
              <td className="p-2 font-medium text-slate-700 dark:text-slate-300 text-left border-b border-slate-100 dark:border-slate-800">{day}</td>
              {heatmapData[dIdx].map((val, sIdx) => (
                <td key={sIdx} className="p-1 border-b border-slate-100 dark:border-slate-800">
                  <div 
                    className={`py-2 px-1 rounded-lg ${getColor(val)} transition-all transform hover:scale-105 shadow-xs cursor-pointer`}
                    title={`${day} ${slots[sIdx]}: ${val}% Attendance`}
                  >
                    {val}%
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Legend */}
      <div className="flex items-center justify-end gap-3 mt-4 text-xs text-slate-500 dark:text-slate-400">
        <span className="font-semibold">Attendance Level:</span>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-emerald-500 inline-block"></span>
          <span>&gt;90% (Optimal)</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-amber-400 inline-block"></span>
          <span>75-80% (Moderate)</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-red-500 inline-block"></span>
          <span>&lt;65% (Critical)</span>
        </div>
      </div>
    </div>
  );
};
