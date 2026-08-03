import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';
import { DEPARTMENTS, SEMESTERS, DIVISIONS } from '../../mockData/studentData';
import { useApp } from '../../context/AppContext';

export const SearchFilterBar = ({ placeholder = "Search students by name, ID or roll number..." }) => {
  const { filters, setFilters } = useApp();

  const handleReset = () => {
    setFilters({
      department: 'All',
      semester: 'All',
      division: 'All',
      searchQuery: '',
      riskLevel: 'All'
    });
  };

  return (
    <div className="saas-card p-4 flex flex-col md:flex-row items-center gap-3">
      {/* Search Bar */}
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder={placeholder}
          value={filters.searchQuery}
          onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
          className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Filter Dropdowns */}
      <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium mr-1 hidden lg:flex">
          <Filter className="w-3.5 h-3.5" />
          <span>Filters:</span>
        </div>

        {/* Department Filter */}
        <select
          value={filters.department}
          onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
          className="px-3 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="All">All Departments</option>
          {DEPARTMENTS.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        {/* Semester Filter */}
        <select
          value={filters.semester}
          onChange={(e) => setFilters(prev => ({ ...prev, semester: e.target.value }))}
          className="px-3 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="All">All Semesters</option>
          {SEMESTERS.map(s => (
            <option key={s} value={s}>Semester {s}</option>
          ))}
        </select>

        {/* Division Filter */}
        <select
          value={filters.division}
          onChange={(e) => setFilters(prev => ({ ...prev, division: e.target.value }))}
          className="px-3 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="All">All Divisions</option>
          {DIVISIONS.map(d => (
            <option key={d} value={d}>Division {d}</option>
          ))}
        </select>

        {/* Reset Button */}
        <button
          onClick={handleReset}
          className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 rounded-xl transition-colors"
          title="Reset Filters"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
