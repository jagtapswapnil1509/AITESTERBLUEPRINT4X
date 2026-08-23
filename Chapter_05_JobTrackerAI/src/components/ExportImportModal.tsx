import React, { useRef, useState } from 'react';
import {
  X,
  HardDriveDownload,
  Upload,
  FileSpreadsheet,
  RefreshCw,
  Trash2,
  Check,
  AlertCircle,
  FileJson,
  ShieldCheck,
} from 'lucide-react';
import { JobApplication } from '../types/job';
import {
  exportApplicationsJSON,
  exportApplicationsCSV,
  parseApplicationsJSON,
  INITIAL_SAMPLE_APPLICATIONS,
} from '../utils/storage';

interface ExportImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  applications: JobApplication[];
  onImportApplications: (newApps: JobApplication[]) => void;
  onResetToSampleData: () => void;
  onClearAllData: () => void;
}

export const ExportImportModal: React.FC<ExportImportModalProps> = ({
  isOpen,
  onClose,
  applications,
  onImportApplications,
  onResetToSampleData,
  onClearAllData,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [confirmAction, setConfirmAction] = useState<'none' | 'reload-sample' | 'clear-all'>('none');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const content = evt.target?.result as string;
        const parsed = parseApplicationsJSON(content);
        onImportApplications(parsed);
        setConfirmAction('none');
        setImportStatus({
          type: 'success',
          message: `Successfully restored ${parsed.length} applications from backup!`,
        });
      } catch (err: any) {
        setImportStatus({
          type: 'error',
          message: `Failed to import JSON: ${err.message || 'Invalid format'}`,
        });
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        id="export-import-modal"
        className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col text-slate-900 dark:text-slate-200 animate-fadeIn"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs">
              <HardDriveDownload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Backup, Export & JSON Data
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                100% local persistence in IndexedDB. Export anytime to save a JSON backup.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Status feedback */}
          {importStatus.type && (
            <div
              className={`p-3 rounded-xl flex items-center gap-2 text-xs ${
                importStatus.type === 'success'
                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20'
              }`}
            >
              {importStatus.type === 'success' ? (
                <Check className="w-4 h-4 text-emerald-500" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-500" />
              )}
              <span className="font-medium">{importStatus.message}</span>
            </div>
          )}

          {/* Export section */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Export & Backup
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                id="btn-export-json"
                onClick={() => exportApplicationsJSON(applications)}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:border-indigo-500 dark:hover:border-indigo-500 text-left transition-all group shadow-xs"
              >
                <div className="flex items-center gap-2 font-bold text-xs text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                  <FileJson className="w-4 h-4 text-indigo-500" />
                  <span>Download Backup (JSON)</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                  Full backup including resume versions, dates, notes, and compensation.
                </p>
              </button>

              <button
                type="button"
                id="btn-export-csv"
                onClick={() => exportApplicationsCSV(applications)}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:border-emerald-500 dark:hover:border-emerald-500 text-left transition-all group shadow-xs"
              >
                <div className="flex items-center gap-2 font-bold text-xs text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                  <span>Export to Excel / CSV</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                  Spreadsheet format for Google Sheets or Microsoft Excel.
                </p>
              </button>
            </div>
          </div>

          {/* Import section */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Restore / Import
            </h4>
            <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 text-center bg-slate-50/50 dark:bg-slate-950">
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload-json"
              />
              <label
                htmlFor="file-upload-json"
                className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors shadow-xs"
              >
                <Upload className="w-4 h-4 text-indigo-500" />
                Select Backup JSON File
              </label>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                Restores job records directly into IndexedDB.
              </p>
            </div>
          </div>

          {/* Data Management: Reset / Sample */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Template Demo Data & Reset
            </h4>

            {confirmAction === 'none' && (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  id="btn-reload-sample-data"
                  onClick={() => {
                    setConfirmAction('reload-sample');
                    setImportStatus({ type: null, message: '' });
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-750 hover:border-indigo-500 transition-colors shadow-2xs"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Reload Sample Template Jobs</span>
                </button>

                <button
                  type="button"
                  id="btn-clear-all-data"
                  onClick={() => {
                    setConfirmAction('clear-all');
                    setImportStatus({ type: null, message: '' });
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/40 transition-colors shadow-2xs"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  <span>Clear All Data</span>
                </button>
              </div>
            )}

            {confirmAction === 'reload-sample' && (
              <div className="p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-800/80 bg-indigo-50/60 dark:bg-indigo-950/40 space-y-3 animate-fadeIn">
                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5">
                    <RefreshCw className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                      Reload Starter Template Applications?
                    </h5>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-snug">
                      This will replace your current pipeline ({applications.length} application{applications.length !== 1 ? 's' : ''}) with the curated demo applications across Stripe, Google, Figma, Notion, etc.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1 border-t border-indigo-200/50 dark:border-indigo-800/40">
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => setConfirmAction('none')}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isProcessing}
                    id="btn-confirm-reload-sample"
                    onClick={async () => {
                      setIsProcessing(true);
                      try {
                        await onResetToSampleData();
                        setConfirmAction('none');
                        setImportStatus({
                          type: 'success',
                          message: 'Loaded sample demo applications successfully!',
                        });
                      } catch (err: any) {
                        setImportStatus({
                          type: 'error',
                          message: `Failed to reload sample data: ${err?.message || 'Unknown error'}`,
                        });
                      } finally {
                        setIsProcessing(false);
                      }
                    }}
                    className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs flex items-center gap-1.5 transition-all"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{isProcessing ? 'Loading...' : 'Yes, Load Template Jobs'}</span>
                  </button>
                </div>
              </div>
            )}

            {confirmAction === 'clear-all' && (
              <div className="p-3.5 rounded-xl border border-rose-200 dark:border-rose-900/80 bg-rose-50/70 dark:bg-rose-950/40 space-y-3 animate-fadeIn">
                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5">
                    <Trash2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-rose-900 dark:text-rose-200">
                      Are you sure you want to clear all data?
                    </h5>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-snug">
                      This will permanently delete all {applications.length} application record{applications.length !== 1 ? 's' : ''} from your IndexedDB database. You will start with a fresh, empty tracker.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1 border-t border-rose-200/50 dark:border-rose-900/40">
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => setConfirmAction('none')}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isProcessing}
                    id="btn-confirm-clear-all"
                    onClick={async () => {
                      setIsProcessing(true);
                      try {
                        await onClearAllData();
                        setConfirmAction('none');
                        setImportStatus({
                          type: 'success',
                          message: 'All application records cleared. Tracker is now clean and empty.',
                        });
                      } catch (err: any) {
                        setImportStatus({
                          type: 'error',
                          message: `Failed to clear data: ${err?.message || 'Unknown error'}`,
                        });
                      } finally {
                        setIsProcessing(false);
                      }
                    }}
                    className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-xs flex items-center gap-1.5 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{isProcessing ? 'Clearing...' : 'Yes, Delete Everything'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>100% Client-Side Privacy: IndexedDB local persistence.</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
