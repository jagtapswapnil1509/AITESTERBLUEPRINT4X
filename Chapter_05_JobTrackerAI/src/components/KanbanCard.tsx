import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  ExternalLink,
  Calendar,
  FileText,
  DollarSign,
  GripVertical,
  Edit2,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Clock,
  Building2,
  Sparkles,
} from 'lucide-react';
import { JobApplication, ApplicationStatus } from '../types/job';
import { STATUS_CONFIGS, ORDERED_STATUSES, formatDisplaySalary } from '../utils/constants';
import { formatDaysSinceApplied, formatDate } from '../utils/dateUtils';

interface KanbanCardProps {
  app: JobApplication;
  onSelect: (app: JobApplication) => void;
  onEdit: (app: JobApplication) => void;
  onDelete: (app: JobApplication) => void;
  onStatusChange: (appId: string, nextStatus: ApplicationStatus) => void;
  isOverlay?: boolean;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({
  app,
  onSelect,
  onEdit,
  onDelete,
  onStatusChange,
  isOverlay = false,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: app.id,
    data: {
      type: 'JobCard',
      app,
    },
    disabled: isOverlay,
  });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    touchAction: 'none',
  };

  const statusConfig = STATUS_CONFIGS[app.status] || STATUS_CONFIGS.APPLIED;
  const daysText = formatDaysSinceApplied(app.dateApplied);
  const salaryText = formatDisplaySalary(app.salary, app.currency);

  const currentIndex = ORDERED_STATUSES.indexOf(app.status);
  const prevStatus = currentIndex > 0 ? ORDERED_STATUSES[currentIndex - 1] : null;
  const nextStatus = currentIndex < ORDERED_STATUSES.length - 1 ? ORDERED_STATUSES[currentIndex + 1] : null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      id={`card-${app.id}`}
      {...attributes}
      {...listeners}
      onClick={() => onSelect(app)}
      className={`group bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-xs hover:shadow-md transition-all duration-150 relative cursor-grab active:cursor-grabbing select-none flex flex-col gap-2.5 p-3.5 ${
        statusConfig.accentBorder || 'border-l-4 border-l-indigo-500'
      } border-l-4 ${
        isOverlay
          ? 'shadow-2xl ring-2 ring-indigo-500 scale-102 bg-white dark:bg-slate-850 cursor-grabbing'
          : 'hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/70 dark:hover:bg-slate-850/80'
      }`}
    >
      {/* Top Header: Drag Handle, Resume Tag & LinkedIn link */}
      <div className="flex items-center justify-between gap-1.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <div
            className="p-0.5 -ml-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded transition-colors"
            title="Drag to move card"
          >
            <GripVertical className="w-3.5 h-3.5" />
          </div>

          {/* Resume Tag Badge */}
          {app.resumeVersion && (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-md bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/40 truncate max-w-[150px]"
              title={`Resume used: ${app.resumeVersion}`}
            >
              <FileText className="w-2.5 h-2.5 shrink-0 text-indigo-500" />
              <span className="truncate">{app.resumeVersion}</span>
            </span>
          )}
        </div>

        {/* Action icons (LinkedIn, Edit, Delete) */}
        <div
          className="flex items-center gap-1 text-slate-400 shrink-0"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          {app.jobUrl && (
            <a
              href={app.jobUrl}
              target="_blank"
              rel="noopener noreferrer"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              className="p-1 rounded text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
              title="Open LinkedIn / Job URL"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(app);
            }}
            className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Edit Application"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(app);
            }}
            className="p-1 rounded text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            title="Delete Application"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Company Name & Role */}
      <div>
        <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
          {app.company}
        </h4>
        <p className="text-xs text-slate-600 dark:text-slate-300 font-medium line-clamp-1 mt-0.5">
          {app.role}
        </p>
      </div>

      {/* Salary & Location / Details */}
      {(salaryText || app.location) && (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {salaryText && (
            <span className="inline-flex items-center gap-1 font-bold text-emerald-700 dark:text-emerald-400 text-[11px] bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/40">
              <DollarSign className="w-3 h-3 text-emerald-500 shrink-0" />
              <span>{salaryText}</span>
            </span>
          )}
          {app.location && (
            <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[140px]">
              {app.location}
            </span>
          )}
        </div>
      )}

      {/* Notes preview if available */}
      {app.notes && (
        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 italic bg-slate-50 dark:bg-slate-950/50 p-1.5 rounded-lg border border-slate-100 dark:border-slate-800/60">
          "{app.notes}"
        </p>
      )}

      {/* Footer: Days since applied & Quick Move buttons */}
      <div
        className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-auto"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <span className="flex items-center gap-1 font-medium text-slate-500 dark:text-slate-400" title={`Date Applied: ${formatDate(app.dateApplied)}`}>
          <Clock className="w-3 h-3 text-slate-400" />
          <span>{daysText}</span>
        </span>

        {/* Quick status stepper arrows */}
        <div className="flex items-center gap-0.5">
          {prevStatus && (
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onStatusChange(app.id, prevStatus);
              }}
              className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={`Move back to ${STATUS_CONFIGS[prevStatus].label}`}
            >
              <ArrowLeft className="w-3 h-3" />
            </button>
          )}
          {nextStatus && (
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onStatusChange(app.id, nextStatus);
              }}
              className="p-1 px-1.5 rounded text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 font-semibold flex items-center gap-0.5 text-[10px] transition-colors"
              title={`Advance to ${STATUS_CONFIGS[nextStatus].label}`}
            >
              <span>Move</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
