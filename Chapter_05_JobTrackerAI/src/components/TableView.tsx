import React, { useState } from 'react';
import {
  ArrowUpDown,
  ExternalLink,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Eye,
  CheckSquare,
  Square,
  FileText,
} from 'lucide-react';
import { JobApplication, ApplicationStatus, FilterState } from '../types/job';
import { ORDERED_STATUSES, STATUS_CONFIGS, WORK_MODEL_LABELS, formatDisplaySalary } from '../utils/constants';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { formatDate, getFollowUpStatus } from '../utils/dateUtils';

interface TableViewProps {
  applications: JobApplication[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onSelectApp: (app: JobApplication) => void;
  onEditApp: (app: JobApplication) => void;
  onDeleteApp: (appId: string) => void;
  onStatusChange: (appId: string, status: ApplicationStatus) => void;
  onToggleFollowUpDone: (appId: string) => void;
  onPreviewResume?: (app: JobApplication) => void;
}

export const TableView: React.FC<TableViewProps> = ({
  applications,
  filters,
  onFilterChange,
  onSelectApp,
  onEditApp,
  onDeleteApp,
  onStatusChange,
  onToggleFollowUpDone,
  onPreviewResume,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSort = (field: FilterState['sortBy']) => {
    if (filters.sortBy === field) {
      onFilterChange({
        ...filters,
        sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc',
      });
    } else {
      onFilterChange({
        ...filters,
        sortBy: field,
        sortOrder: 'desc',
      });
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === applications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(applications.map((a) => a.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkStatusChange = (status: ApplicationStatus) => {
    selectedIds.forEach((id) => onStatusChange(id, status));
    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    selectedIds.forEach((id) => onDeleteApp(id));
    setSelectedIds([]);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden animate-fadeIn">
      {/* Bulk Action Bar if items selected */}
      {selectedIds.length > 0 && (
        <div className="bg-indigo-50 dark:bg-indigo-950/40 px-4 py-2.5 border-b border-indigo-200 dark:border-indigo-800/60 flex items-center justify-between gap-4">
          <div className="text-xs font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-2">
            <span>{selectedIds.length} application(s) selected</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-indigo-900 dark:text-indigo-300">
              <span>Change status to:</span>
              <select
                onChange={(e) => {
                  if (e.target.value) handleBulkStatusChange(e.target.value as ApplicationStatus);
                }}
                defaultValue=""
                className="text-xs py-1 px-2 rounded-lg border border-indigo-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-medium"
              >
                <option value="" disabled>
                  Select column...
                </option>
                {ORDERED_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_CONFIGS[s].label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleBulkDelete}
              className="text-xs font-bold text-rose-700 dark:text-rose-300 hover:text-rose-800 dark:hover:text-rose-200 px-2.5 py-1 rounded-lg bg-rose-100 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 transition-colors"
            >
              Delete Selected
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
          <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 text-[11px] uppercase tracking-wider font-bold">
            <tr>
              <th className="p-3.5 w-8 text-center">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {selectedIds.length > 0 && selectedIds.length === applications.length ? (
                    <CheckSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>
              </th>
              <th className="p-3.5 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" onClick={() => handleSort('company')}>
                <div className="flex items-center gap-1.5">
                  <span>Company & Role</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="p-3.5">Status Column</th>
              <th className="p-3.5 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" onClick={() => handleSort('dateApplied')}>
                <div className="flex items-center gap-1.5">
                  <span>Date Applied</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="p-3.5">Resume Used</th>
              <th className="p-3.5">Compensation</th>
              <th className="p-3.5">Notes Snippet</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {applications.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-slate-400">
                  No job applications found matching the current filters.
                </td>
              </tr>
            ) : (
              applications.map((app) => {
                const isSelected = selectedIds.includes(app.id);

                return (
                  <tr
                    key={app.id}
                    className={`hover:bg-slate-50/80 dark:hover:bg-slate-850/60 transition-colors ${
                      isSelected ? 'bg-indigo-50/60 dark:bg-indigo-500/10' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="p-3.5 text-center">
                      <button
                        type="button"
                        onClick={() => toggleSelectOne(app.id)}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </td>

                    {/* Company & Role */}
                    <td className="p-3.5">
                      <div className="flex items-start gap-2.5">
                        <div className="flex-1">
                          <button
                            type="button"
                            onClick={() => onSelectApp(app)}
                            className="font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 text-left transition-colors flex items-center gap-1.5"
                          >
                            <span>{app.company}</span>
                            {app.jobUrl && (
                              <a
                                href={app.jobUrl}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-300"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </button>
                          <div className="text-slate-500 dark:text-slate-400 font-medium line-clamp-1">
                            {app.role}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Status Dropdown */}
                    <td className="p-3.5">
                      <StatusBadge status={app.status} size="sm" />
                    </td>

                    {/* Date Applied */}
                    <td className="p-3.5 text-slate-600 dark:text-slate-300 font-medium">
                      {formatDate(app.dateApplied)}
                    </td>

                    {/* Resume Used */}
                    <td className="p-3.5">
                      {app.resumeVersion || app.resumeFileName ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-200 dark:border-indigo-800/40">
                          <FileText className="w-3 h-3 text-indigo-500 shrink-0" />
                          <span className="truncate max-w-[140px]">
                            {app.resumeVersion || app.resumeFileName}
                          </span>
                        </span>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">None</span>
                      )}
                    </td>

                    {/* Compensation */}
                    <td className="p-3.5">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {formatDisplaySalary(app.salary, app.currency) || '—'}
                      </span>
                    </td>

                    {/* Notes Snippet */}
                    <td className="p-3.5 max-w-[200px]">
                      {app.notes ? (
                        <p className="truncate text-slate-500 dark:text-slate-400 text-[11px]">
                          {app.notes}
                        </p>
                      ) : (
                        <span className="text-slate-300 dark:text-slate-600 text-[11px]">—</span>
                      )}
                    </td>

                    {/* Action buttons */}
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => onSelectApp(app)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onEditApp(app)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          title="Edit application"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteApp(app.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
