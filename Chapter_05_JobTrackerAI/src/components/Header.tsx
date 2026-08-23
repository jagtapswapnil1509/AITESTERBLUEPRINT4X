import React from 'react';
import {
  LayoutGrid,
  List,
  Calendar,
  BarChart3,
  Plus,
  Search,
  HardDriveDownload,
  WifiOff,
  Sun,
  Moon,
  ArrowUpDown,
  FileText,
  Briefcase,
} from 'lucide-react';
import { ViewMode, ApplicationStatus, FilterState, ThemeMode } from '../types/job';
import { V2_KANBAN_COLUMNS, STATUS_CONFIGS } from '../utils/constants';

interface HeaderProps {
  totalCount: number;
  activePipelineCount: number;
  interviewCount: number;
  offerCount: number;
  viewMode: ViewMode;
  onViewChange: (mode: ViewMode) => void;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onOpenNewModal: () => void;
  onOpenExportImport: () => void;
  allResumeVersions: string[];
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalCount,
  activePipelineCount,
  interviewCount,
  offerCount,
  viewMode,
  onViewChange,
  filters,
  onFilterChange,
  onOpenNewModal,
  onOpenExportImport,
  allResumeVersions,
  theme,
  onToggleTheme,
}) => {
  return (
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md sticky top-0 z-30 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 space-y-3">
        {/* Top bar: Brand, Status Stats & Action Buttons */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Brand & Metrics */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-base shadow-md shadow-indigo-600/20 tracking-tight">
                JT
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                    Job Tracker
                  </h1>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    v2.0
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800/60">
                    <WifiOff className="w-3 h-3" />
                    IndexedDB Local
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  <span><strong>{totalCount}</strong> jobs</span>
                  <span>•</span>
                  <span><strong>{activePipelineCount}</strong> active</span>
                  <span>•</span>
                  <span className="text-amber-600 dark:text-amber-400 font-semibold">{interviewCount} interviewing</span>
                  <span>•</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{offerCount} offers</span>
                </div>
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="flex md:hidden items-center gap-1.5">
              <button
                type="button"
                onClick={onToggleTheme}
                className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
              </button>
              <button
                type="button"
                onClick={onOpenNewModal}
                className="p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/20"
                aria-label="Add Job"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* View Switcher Tabs */}
            <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
              <button
                type="button"
                id="nav-view-board"
                onClick={() => onViewChange('board')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'board'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                Kanban
              </button>

              <button
                type="button"
                id="nav-view-table"
                onClick={() => onViewChange('table')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                Table
              </button>

              <button
                type="button"
                id="nav-view-schedule"
                onClick={() => onViewChange('schedule')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'schedule'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                Schedule
              </button>

              <button
                type="button"
                id="nav-view-analytics"
                onClick={() => onViewChange('analytics')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'analytics'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                Insights
              </button>
            </div>

            {/* Theme Toggle Button */}
            <button
              type="button"
              id="btn-toggle-theme"
              onClick={onToggleTheme}
              className="hidden md:inline-flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-2xs"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>

            {/* Backup / Export / Import Button */}
            <button
              type="button"
              id="btn-open-backup-export"
              onClick={onOpenExportImport}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-2xs"
              title="Backup, export or import JSON data"
            >
              <HardDriveDownload className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span className="hidden sm:inline">Backup & JSON</span>
            </button>

            {/* Add Job Application Primary Button */}
            <button
              type="button"
              id="btn-new-application-header"
              onClick={onOpenNewModal}
              className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white shadow-md shadow-indigo-600/20 transition-all hover:scale-102"
            >
              <Plus className="w-4 h-4" />
              <span>Add Job</span>
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          <div className="flex-1 flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative min-w-[220px] max-w-sm flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="search-input-field"
                type="text"
                value={filters.search}
                onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
                placeholder="Search company, role, resume, notes..."
                className="w-full pl-9 pr-7 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
              {filters.search && (
                <button
                  type="button"
                  onClick={() => onFilterChange({ ...filters, search: '' })}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Status Filter */}
            <select
              id="filter-status-select"
              value={filters.status}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  status: e.target.value as ApplicationStatus | 'ALL',
                })
              }
              className="py-1.5 px-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-500 font-medium cursor-pointer"
            >
              <option value="ALL">All Columns</option>
              {V2_KANBAN_COLUMNS.map((st) => (
                <option key={st} value={st}>
                  {STATUS_CONFIGS[st].label}
                </option>
              ))}
            </select>

            {/* Resume Filter */}
            {allResumeVersions.length > 0 && (
              <select
                id="filter-resume-select"
                value={filters.resumeVersion}
                onChange={(e) =>
                  onFilterChange({
                    ...filters,
                    resumeVersion: e.target.value,
                  })
                }
                className="py-1.5 px-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-500 font-medium cursor-pointer max-w-[180px] truncate"
              >
                <option value="ALL">All Resumes</option>
                {allResumeVersions.map((res) => (
                  <option key={res} value={res}>
                    📄 {res}
                  </option>
                ))}
              </select>
            )}

            {/* Sort within columns */}
            <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-2 py-1 rounded-xl text-xs text-slate-600 dark:text-slate-400">
              <ArrowUpDown className="w-3 h-3 text-slate-400" />
              <span className="text-[11px] font-semibold">Sort:</span>
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  onFilterChange({
                    ...filters,
                    sortBy: e.target.value as any,
                  })
                }
                className="bg-transparent text-xs text-slate-800 dark:text-slate-200 font-bold focus:outline-none cursor-pointer"
              >
                <option value="dateApplied">Date Applied (Newest)</option>
                <option value="company">Company (A-Z)</option>
                <option value="role">Role (A-Z)</option>
                <option value="lastUpdated">Last Updated</option>
              </select>
            </div>
          </div>

          {/* Clear Filters reset link */}
          {(filters.search || filters.status !== 'ALL' || filters.resumeVersion !== 'ALL') && (
            <button
              type="button"
              id="btn-clear-all-filters"
              onClick={() =>
                onFilterChange({
                  ...filters,
                  search: '',
                  status: 'ALL',
                  priority: 'ALL',
                  resumeVersion: 'ALL',
                  sortBy: 'dateApplied',
                  sortOrder: 'desc',
                })
              }
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold self-end md:self-center"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
