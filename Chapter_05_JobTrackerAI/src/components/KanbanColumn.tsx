import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus, HelpCircle, ArrowUpDown } from 'lucide-react';
import { JobApplication, ApplicationStatus } from '../types/job';
import { STATUS_CONFIGS } from '../utils/constants';
import { KanbanCard } from './KanbanCard';

interface KanbanColumnProps {
  status: ApplicationStatus;
  apps: JobApplication[];
  onSelectApp: (app: JobApplication) => void;
  onEditApp: (app: JobApplication) => void;
  onDeleteApp: (app: JobApplication) => void;
  onStatusChange: (appId: string, nextStatus: ApplicationStatus) => void;
  onQuickAdd: (status: ApplicationStatus) => void;
  isOver?: boolean;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  status,
  apps,
  onSelectApp,
  onEditApp,
  onDeleteApp,
  onStatusChange,
  onQuickAdd,
  isOver = false,
}) => {
  const { setNodeRef, isOver: isNodeOver } = useDroppable({
    id: `column-${status}`,
    data: {
      type: 'Column',
      status,
    },
  });

  const config = STATUS_CONFIGS[status] || STATUS_CONFIGS.APPLIED;
  const appIds = apps.map((a) => a.id);
  const activeOver = isOver || isNodeOver;

  return (
    <div
      ref={setNodeRef}
      id={`column-${status.toLowerCase()}`}
      className={`flex-shrink-0 w-80 md:w-84 rounded-2xl border transition-all duration-150 flex flex-col min-h-[420px] max-h-[calc(100vh-210px)] shadow-xs ${
        activeOver
          ? 'bg-indigo-50/90 dark:bg-indigo-950/50 border-indigo-400 dark:border-indigo-500 ring-2 ring-indigo-500/30 scale-[1.01]'
          : 'bg-slate-100/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
      }`}
    >
      {/* Column Header */}
      <div className="p-3.5 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between bg-white/70 dark:bg-slate-900/80 backdrop-blur-xs rounded-t-2xl">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
            style={{ backgroundColor: config.color }}
          />
          <h3 className="font-bold text-xs text-slate-800 dark:text-slate-200 tracking-wide uppercase truncate">
            {config.label}
          </h3>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0">
            {apps.length}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onQuickAdd(status)}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          title={`Add job card to ${config.label}`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Subtitle / Description */}
      <div className="px-3.5 py-1.5 bg-slate-50/50 dark:bg-slate-950/30 border-b border-slate-200/40 dark:border-slate-800/40 text-[11px] text-slate-500 dark:text-slate-400 truncate">
        {config.description}
      </div>

      {/* Column Body with Independent Scrolling */}
      <div className="p-2.5 space-y-2.5 overflow-y-auto flex-1 scrollbar-thin">
        <SortableContext items={appIds} strategy={verticalListSortingStrategy}>
          {apps.length === 0 ? (
            <div
              onClick={() => onQuickAdd(status)}
              className={`py-12 px-4 text-center border-2 border-dashed rounded-xl cursor-pointer transition-all group flex flex-col items-center justify-center min-h-[160px] ${
                activeOver
                  ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300'
                  : 'border-slate-200 dark:border-slate-800/80 hover:border-indigo-400 dark:hover:border-indigo-600'
              }`}
            >
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {activeOver ? 'Drop application here' : `No jobs in ${config.label.toLowerCase()}`}
              </p>
              {!activeOver && (
                <p className="mt-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:underline flex items-center justify-center gap-1">
                  <Plus className="w-3 h-3" />
                  Add a job
                </p>
              )}
            </div>
          ) : (
            apps.map((app) => (
              <KanbanCard
                key={app.id}
                app={app}
                onSelect={onSelectApp}
                onEdit={onEditApp}
                onDelete={onDeleteApp}
                onStatusChange={onStatusChange}
              />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  );
};
