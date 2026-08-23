import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { JobApplication } from '../types/job';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  job: JobApplication | null;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  job,
}) => {
  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Delete Application?
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
            Are you sure you want to remove <span className="font-semibold text-slate-900 dark:text-white">{job.role}</span> at <span className="font-semibold text-slate-900 dark:text-white">{job.company}</span>? This action cannot be undone.
          </p>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800/80 text-xs space-y-1 text-slate-600 dark:text-slate-400">
          <div className="flex justify-between">
            <span>Company:</span>
            <span className="font-medium text-slate-800 dark:text-slate-200">{job.company}</span>
          </div>
          <div className="flex justify-between">
            <span>Role:</span>
            <span className="font-medium text-slate-800 dark:text-slate-200">{job.role}</span>
          </div>
          {job.resumeVersion && (
            <div className="flex justify-between">
              <span>Resume:</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">{job.resumeVersion}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete Application
          </button>
        </div>
      </div>
    </div>
  );
};
