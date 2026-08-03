import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export const KpiCard = ({ title, value, subtext, icon: Icon, trend, trendValue, color = 'blue' }) => {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 border-blue-100 dark:border-blue-800/40',
    emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/40',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 border-amber-100 dark:border-amber-800/40',
    red: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 border-red-100 dark:border-red-800/40',
    indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800/40',
  };

  return (
    <div className="saas-card p-5 flex flex-col justify-between hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{title}</span>
        <div className={`p-2.5 rounded-xl border ${colorMap[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      
      <div className="mt-3">
        <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</div>
        <div className="flex items-center gap-1.5 mt-2">
          {trend === 'up' && (
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              {trendValue}
            </span>
          )}
          {trend === 'down' && (
            <span className="inline-flex items-center text-xs font-semibold text-red-600 dark:text-red-400">
              <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
              {trendValue}
            </span>
          )}
          {trend === 'neutral' && (
            <span className="inline-flex items-center text-xs font-semibold text-slate-500 dark:text-slate-400">
              <Minus className="w-3.5 h-3.5 mr-0.5" />
              {trendValue}
            </span>
          )}
          <span className="text-xs text-slate-500 dark:text-slate-400">{subtext}</span>
        </div>
      </div>
    </div>
  );
};
