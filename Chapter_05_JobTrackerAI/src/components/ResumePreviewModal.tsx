import React from 'react';
import {
  X,
  FileText,
  Download,
  ExternalLink,
  Calendar,
  HardDrive,
  Eye,
  CheckCircle,
  FileCode,
  Sparkles,
} from 'lucide-react';
import { JobApplication } from '../types/job';
import { formatDate } from '../utils/dateUtils';

interface ResumePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  app: JobApplication | null;
  onUpdateApp?: (app: JobApplication) => void;
}

export const ResumePreviewModal: React.FC<ResumePreviewModalProps> = ({
  isOpen,
  onClose,
  app,
  onUpdateApp,
}) => {
  if (!isOpen || !app) return null;

  const fileName = app.resumeFileName || app.resumeVersion || 'Resume.pdf';
  const fileData = app.resumeFileData;
  const isPdf =
    fileData?.startsWith('data:application/pdf') ||
    fileName.toLowerCase().endsWith('.pdf') ||
    app.resumeFileType === 'application/pdf';

  const isText =
    fileData?.startsWith('data:text/') ||
    fileName.toLowerCase().endsWith('.txt') ||
    fileName.toLowerCase().endsWith('.md');

  // Format file size
  const formatSize = (bytes?: number) => {
    if (!bytes) return null;
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleDownload = () => {
    if (fileData) {
      const a = document.createElement('a');
      a.href = fileData;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } else if (app.resumeUrl) {
      window.open(app.resumeUrl, '_blank', 'noopener,noreferrer');
    } else {
      // Create a text file summary if no binary was uploaded
      const textContent = `RESUME USED FOR JOB APPLICATION\n\nCompany: ${app.company}\nRole: ${app.role}\nDate Applied: ${app.dateApplied}\nResume Version: ${app.resumeVersion || 'Default'}\nSalary: ${app.salary || 'N/A'}\nNotes: ${app.notes || 'None'}`;
      const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${app.company.replace(/\s+/g, '_')}_Resume_Record.txt`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    }
  };

  const handleOpenNewTab = () => {
    if (fileData) {
      const win = window.open();
      if (win) {
        win.document.write(
          `<iframe src="${fileData}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`
        );
      }
    } else if (app.resumeUrl) {
      window.open(app.resumeUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Decode text file if text data url
  let decodedTextContent = '';
  if (isText && fileData?.startsWith('data:')) {
    try {
      const base64Index = fileData.indexOf(';base64,');
      if (base64Index !== -1) {
        decodedTextContent = atob(fileData.substring(base64Index + 8));
      } else {
        decodedTextContent = decodeURIComponent(fileData.split(',')[1] || '');
      }
    } catch {
      decodedTextContent = 'Unable to decode text preview.';
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div
        id="resume-preview-modal"
        className="w-full max-w-4xl bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-200 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-white leading-tight">
                  {fileName}
                </h3>
                {app.resumeVersion && (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {app.resumeVersion}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Applied to <strong className="text-slate-200">{app.company}</strong> ({app.role})
                {app.resumeFileSize && <span> • {formatSize(app.resumeFileSize)}</span>}
                {app.resumeUploadedAt && (
                  <span> • Uploaded {formatDate(app.resumeUploadedAt.split('T')[0])}</span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {fileData && (
              <button
                type="button"
                id="btn-resume-newtab"
                onClick={handleOpenNewTab}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-750 text-xs font-semibold text-slate-200 transition-colors"
                title="Open resume in full window"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Full Window</span>
              </button>
            )}

            <button
              type="button"
              id="btn-resume-download"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body / Viewer */}
        <div className="flex-1 bg-slate-950 p-4 sm:p-6 overflow-y-auto flex flex-col min-h-[420px] max-h-[70vh]">
          {fileData && isPdf ? (
            <div className="w-full h-full flex-1 rounded-xl overflow-hidden border border-slate-800 bg-slate-900 flex flex-col min-h-[500px]">
              <iframe
                src={fileData}
                className="w-full h-full flex-1 border-0 rounded-xl"
                title={`Resume for ${app.company}`}
              />
            </div>
          ) : fileData && isText ? (
            <div className="w-full h-full flex-1 p-4 rounded-xl border border-slate-800 bg-slate-900 font-mono text-xs text-slate-300 whitespace-pre-wrap overflow-y-auto">
              {decodedTextContent || 'No text content available.'}
            </div>
          ) : fileData ? (
            /* Non-PDF binary (like .docx) */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-900/50 rounded-xl border border-slate-800">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
                <FileText className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-white mb-1">{fileName}</h4>
              <p className="text-xs text-slate-400 max-w-md mb-6">
                This document is securely saved in your offline tracker. Click below to download and view in Microsoft Word, Pages, or your document editor.
              </p>
              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all"
              >
                <Download className="w-4 h-4" />
                Download {fileName}
              </button>
            </div>
          ) : app.resumeUrl ? (
            /* External link provided */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-900/50 rounded-xl border border-slate-800">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
                <ExternalLink className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-white mb-1">External Resume Link</h4>
              <p className="text-xs text-slate-400 max-w-md mb-2">
                This resume is linked from an external repository or cloud storage.
              </p>
              <p className="text-xs text-indigo-400 font-mono mb-6 max-w-md truncate">
                {app.resumeUrl}
              </p>
              <a
                href={app.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                Open Resume in New Tab
              </a>
            </div>
          ) : (
            /* Metadata only (e.g. version tag without attached base64 file) */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-900/50 rounded-xl border border-slate-800">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3">
                <FileText className="w-7 h-7" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1">
                {app.resumeVersion || 'Resume Record'}
              </h4>
              <p className="text-xs text-slate-400 max-w-md mb-5">
                Resume version <strong className="text-slate-200">{app.resumeVersion || 'Standard'}</strong> was logged for this application. You can upload the exact PDF or DOCX file anytime using the edit form.
              </p>
              <div className="grid grid-cols-2 gap-3 text-left w-full max-w-sm bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-500 block">Company:</span>
                  <span className="font-semibold text-slate-200">{app.company}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Role:</span>
                  <span className="font-semibold text-slate-200">{app.role}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Date Applied:</span>
                  <span className="font-semibold text-slate-200">{formatDate(app.dateApplied)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Cover Letter:</span>
                  <span className="font-semibold text-slate-200">{app.coverLetterUsed ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer / Context for Interviews */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Tip for interview: Keep this resume open side-by-side during your call to align your answers with the bullet points submitted!
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
