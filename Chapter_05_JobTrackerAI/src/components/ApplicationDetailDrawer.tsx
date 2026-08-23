import React, { useState, useRef } from 'react';
import {
  X,
  Edit,
  Trash2,
  ExternalLink,
  Calendar,
  Clock,
  CheckCircle2,
  Mail,
  User,
  Plus,
  Building2,
  MapPin,
  DollarSign,
  FileText,
  Video,
  Sparkles,
  ArrowRight,
  Download,
  Eye,
  Upload,
  Check,
} from 'lucide-react';
import { JobApplication, ApplicationStatus, InterviewRound, Contact } from '../types/job';
import { STATUS_CONFIGS, ORDERED_STATUSES, WORK_MODEL_LABELS, JOB_TYPE_LABELS, formatDisplaySalary } from '../utils/constants';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { formatDate, getFollowUpStatus, addDaysToDate, getTodayDateString } from '../utils/dateUtils';

interface ApplicationDetailDrawerProps {
  app: JobApplication | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (app: JobApplication) => void;
  onDelete: (appId: string) => void;
  onStatusChange: (appId: string, status: ApplicationStatus) => void;
  onUpdateApp: (updated: JobApplication) => void;
  onOpenEmailAssistant: (app: JobApplication) => void;
  onOpenResumePreview?: (app: JobApplication) => void;
}

export const ApplicationDetailDrawer: React.FC<ApplicationDetailDrawerProps> = ({
  app,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onStatusChange,
  onUpdateApp,
  onOpenEmailAssistant,
  onOpenResumePreview,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'interviews' | 'contacts' | 'notes'>('overview');
  const [newInterviewTitle, setNewInterviewTitle] = useState('');
  const [newInterviewDate, setNewInterviewDate] = useState(getTodayDateString());
  const [newInterviewTime, setNewInterviewTime] = useState('');
  const [isAddingInterview, setIsAddingInterview] = useState(false);

  const [newContactName, setNewContactName] = useState('');
  const [newContactRole, setNewContactRole] = useState('');
  const [newContactEmail, setNewContactEmail] = useState('');
  const [isAddingContact, setIsAddingContact] = useState(false);
  const drawerFileInputRef = useRef<HTMLInputElement>(null);

  const handleDrawerFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!app) return;
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      const updated: JobApplication = {
        ...app,
        resumeFileData: result,
        resumeFileName: file.name,
        resumeFileSize: file.size,
        resumeFileType: file.type || 'application/pdf',
        resumeUploadedAt: new Date().toISOString(),
        resumeVersion: app.resumeVersion || file.name.replace(/\.[^/.]+$/, ''),
        lastUpdated: new Date().toISOString(),
      };
      onUpdateApp(updated);
    };
    reader.readAsDataURL(file);
  };

  const handleDownloadResume = () => {
    if (!app) return;
    const fileName = app.resumeFileName || app.resumeVersion || `${app.company}_Resume.pdf`;
    if (app.resumeFileData) {
      const a = document.createElement('a');
      a.href = app.resumeFileData;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } else if (app.resumeUrl) {
      window.open(app.resumeUrl, '_blank', 'noopener,noreferrer');
    } else {
      const textContent = `RESUME DETAILS\nCompany: ${app.company}\nRole: ${app.role}\nVersion: ${app.resumeVersion || 'Standard'}\nApplied: ${app.dateApplied}`;
      const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${app.company}_Resume.txt`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (!isOpen || !app) return null;

  const followUp = getFollowUpStatus(app.followUpDate, app.followUpCompleted);

  const handleToggleFollowUpDone = () => {
    onUpdateApp({
      ...app,
      followUpCompleted: !app.followUpCompleted,
      lastUpdated: new Date().toISOString(),
    });
  };

  const handleSnoozeFollowUp = (days: number) => {
    const nextDate = addDaysToDate(getTodayDateString(), days);
    onUpdateApp({
      ...app,
      followUpDate: nextDate,
      followUpCompleted: false,
      lastUpdated: new Date().toISOString(),
    });
  };

  const handleAddInterview = () => {
    if (!newInterviewTitle.trim()) return;
    const newRound: InterviewRound = {
      id: `int-${Date.now()}`,
      roundNumber: (app.interviews?.length || 0) + 1,
      title: newInterviewTitle.trim(),
      date: newInterviewDate,
      time: newInterviewTime || undefined,
      status: 'SCHEDULED',
    };
    onUpdateApp({
      ...app,
      interviews: [...(app.interviews || []), newRound],
      lastUpdated: new Date().toISOString(),
    });
    setNewInterviewTitle('');
    setIsAddingInterview(false);
  };

  const handleToggleInterviewStatus = (intId: string) => {
    const updated = (app.interviews || []).map((i) => {
      if (i.id === intId) {
        const nextStatus = i.status === 'SCHEDULED' ? 'COMPLETED' : 'SCHEDULED';
        return { ...i, status: nextStatus as any };
      }
      return i;
    });
    onUpdateApp({
      ...app,
      interviews: updated,
      lastUpdated: new Date().toISOString(),
    });
  };

  const handleDeleteInterview = (intId: string) => {
    onUpdateApp({
      ...app,
      interviews: (app.interviews || []).filter((i) => i.id !== intId),
      lastUpdated: new Date().toISOString(),
    });
  };

  const handleAddContact = () => {
    if (!newContactName.trim()) return;
    const newContact: Contact = {
      id: `c-${Date.now()}`,
      name: newContactName.trim(),
      role: newContactRole.trim() || undefined,
      email: newContactEmail.trim() || undefined,
    };
    onUpdateApp({
      ...app,
      contacts: [...(app.contacts || []), newContact],
      lastUpdated: new Date().toISOString(),
    });
    setNewContactName('');
    setNewContactRole('');
    setNewContactEmail('');
    setIsAddingContact(false);
  };

  const handleDeleteContact = (contactId: string) => {
    onUpdateApp({
      ...app,
      contacts: (app.contacts || []).filter((c) => c.id !== contactId),
      lastUpdated: new Date().toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm flex justify-end animate-fadeIn">
      <div
        id="application-detail-drawer"
        className="w-full max-w-2xl bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-200"
      >
        {/* Top Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/70 flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <StatusBadge status={app.status} size="sm" />
              <PriorityBadge priority={app.priority} size="sm" />
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {WORK_MODEL_LABELS[app.workModel]} • {JOB_TYPE_LABELS[app.jobType]}
              </span>
            </div>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>{app.company}</span>
              {app.jobUrl && (
                <a
                  href={app.jobUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline"
                  title="Visit Job Listing"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </h2>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              {app.role}
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              id="btn-drawer-email-assist"
              onClick={() => onOpenEmailAssistant(app)}
              className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-500/20 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Generate Follow-up / Thank You Email"
            >
              <Mail className="w-4 h-4" />
              <span className="hidden sm:inline">Email Assistant</span>
            </button>

            <button
              type="button"
              id="btn-drawer-edit"
              onClick={() => onEdit(app)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Edit application details"
            >
              <Edit className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                onDelete(app.id);
              }}
              className="p-2 rounded-xl text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
              title="Delete application"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status Pipeline Quick Bar */}
        <div className="px-5 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-950/40 flex items-center gap-2 overflow-x-auto scrollbar-thin">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">Stage:</span>
          {ORDERED_STATUSES.map((st) => {
            const isCurrent = app.status === st;
            return (
              <button
                key={st}
                type="button"
                onClick={() => onStatusChange(app.id, st)}
                className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-all whitespace-nowrap ${
                  isCurrent
                    ? `${STATUS_CONFIGS[st].badgeBg} ${STATUS_CONFIGS[st].badgeText} border ${STATUS_CONFIGS[st].badgeBorder} ring-2 ring-indigo-500/30 shadow-xs`
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {STATUS_CONFIGS[st].label}
              </button>
            );
          })}
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-5 bg-slate-50/50 dark:bg-slate-950/30 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            Overview & Details
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('interviews')}
            className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'interviews'
                ? 'border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <span>Interviews & Rounds</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px]">
              {app.interviews?.length || 0}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('contacts')}
            className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'contacts'
                ? 'border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <span>Contacts & Recruiters</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px]">
              {app.contacts?.length || 0}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('notes')}
            className={`py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'notes'
                ? 'border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            Notes & Activity Log
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              {/* Resume for this Job Section */}
              <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/50 dark:bg-indigo-950/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-300">
                      Resume Used for this Job
                    </h4>
                  </div>
                  {app.resumeFileData || app.resumeFileName ? (
                    <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                      <Check className="w-3 h-3" /> File Attached
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      {app.resumeVersion || 'Version logged'}
                    </span>
                  )}
                </div>

                <div className="p-3 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-200 dark:border-indigo-800">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h5 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                        {app.resumeFileName || app.resumeVersion || 'Standard Resume'}
                      </h5>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 flex-wrap mt-0.5">
                        {app.resumeFileSize && <span>{formatFileSize(app.resumeFileSize)}</span>}
                        {app.resumeUploadedAt && (
                          <span>• Uploaded {formatDate(app.resumeUploadedAt.split('T')[0])}</span>
                        )}
                        {app.resumeVersion && app.resumeFileName && (
                          <span className="text-indigo-600 dark:text-indigo-400">({app.resumeVersion})</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      id="btn-drawer-preview-resume"
                      onClick={() => onOpenResumePreview?.(app)}
                      className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                      title="Preview Resume"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadResume}
                      className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
                      title="Download Resume file"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => drawerFileInputRef.current?.click()}
                      className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      title="Upload or Replace Resume file"
                    >
                      <Upload className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <input
                  ref={drawerFileInputRef}
                  type="file"
                  accept=".pdf,.docx,.doc,.txt"
                  onChange={handleDrawerFileUpload}
                  className="hidden"
                />
              </div>

              {/* General Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 font-medium block mb-1">Date Applied</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {formatDate(app.dateApplied)}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 font-medium block mb-1">Compensation</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {formatDisplaySalary(app.salary, app.currency) || 'Not specified'}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 font-medium block mb-1">Location</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {app.location || 'Not specified'}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 font-medium block mb-1">Priority Level</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {app.priority}
                  </span>
                </div>
              </div>

              {/* Notes Snippet */}
              {app.notes && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    Notes & Recruiter Details
                  </h4>
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                    {app.notes}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: INTERVIEWS */}
          {activeTab === 'interviews' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Interview Rounds
                </h4>
                <button
                  type="button"
                  onClick={() => setIsAddingInterview(true)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Round
                </button>
              </div>

              {/* Quick Add Form */}
              {isAddingInterview && (
                <div className="p-3.5 rounded-xl border border-indigo-500/30 bg-indigo-50/50 dark:bg-indigo-950/20 space-y-3">
                  <h5 className="font-bold text-xs text-indigo-700 dark:text-indigo-300">
                    Schedule New Round
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Technical Round 1"
                      value={newInterviewTitle}
                      onChange={(e) => setNewInterviewTitle(e.target.value)}
                      className="text-xs p-2 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 col-span-1 sm:col-span-3 font-medium focus:ring-1 focus:ring-indigo-500"
                    />
                    <input
                      type="date"
                      value={newInterviewDate}
                      onChange={(e) => setNewInterviewDate(e.target.value)}
                      className="text-xs p-2 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                    />
                    <input
                      type="time"
                      value={newInterviewTime}
                      onChange={(e) => setNewInterviewTime(e.target.value)}
                      className="text-xs p-2 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleAddInterview}
                        className="flex-1 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700"
                      >
                        Save Round
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAddingInterview(false)}
                        className="py-2 px-3 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* List of interviews */}
              {(!app.interviews || app.interviews.length === 0) && !isAddingInterview ? (
                <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 text-xs">
                  No interview rounds logged yet. Add your screening call or upcoming technical interview.
                </div>
              ) : (
                app.interviews?.map((round, idx) => (
                  <div
                    key={round.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xs space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-xs font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <div>
                          <h5 className="font-bold text-xs text-slate-900 dark:text-white">
                            {round.title}
                          </h5>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-indigo-500" />
                              {formatDate(round.date)} {round.time ? `at ${round.time}` : ''}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleInterviewStatus(round.id)}
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-full border transition-colors ${
                            round.status === 'COMPLETED'
                              ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20'
                              : 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20'
                          }`}
                        >
                          {round.status === 'COMPLETED' ? 'Completed' : 'Scheduled'}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteInterview(round.id)}
                          className="text-slate-400 hover:text-rose-500 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: CONTACTS */}
          {activeTab === 'contacts' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Recruiters & Contacts
                </h4>
                <button
                  type="button"
                  onClick={() => setIsAddingContact(true)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Contact
                </button>
              </div>

              {isAddingContact && (
                <div className="p-3.5 rounded-xl border border-indigo-500/30 bg-indigo-50/50 dark:bg-indigo-950/20 space-y-2.5">
                  <h5 className="font-bold text-xs text-indigo-700 dark:text-indigo-300">
                    Add Person
                  </h5>
                  <input
                    type="text"
                    placeholder="Full Name (e.g. Sarah Miller)"
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                  />
                  <input
                    type="text"
                    placeholder="Role (e.g. Technical Recruiter)"
                    value={newContactRole}
                    onChange={(e) => setNewContactRole(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                  />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={newContactEmail}
                    onChange={(e) => setNewContactEmail(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                  />
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleAddContact}
                      className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700"
                    >
                      Save Contact
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingContact(false)}
                      className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {(!app.contacts || app.contacts.length === 0) && !isAddingContact ? (
                <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 text-xs">
                  No direct contacts or recruiters listed yet.
                </div>
              ) : (
                app.contacts?.map((c) => (
                  <div
                    key={c.id}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 font-bold text-xs flex items-center justify-center border border-indigo-200 dark:border-indigo-800">
                        {c.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h5 className="font-bold text-xs text-slate-900 dark:text-white">
                          {c.name}
                        </h5>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">{c.role || 'Contact'}</p>
                        {c.email && (
                          <a
                            href={`mailto:${c.email}`}
                            className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 mt-0.5"
                          >
                            <Mail className="w-3 h-3" />
                            {c.email}
                          </a>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteContact(c.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 4: NOTES & ACTIVITY HISTORY */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Activity Timeline
                </h4>
                <div className="space-y-2 border-l-2 border-slate-200 dark:border-slate-800 ml-2 pl-3">
                  {app.activityHistory && app.activityHistory.length > 0 ? (
                    app.activityHistory.map((act) => (
                      <div key={act.id} className="text-xs space-y-0.5">
                        <div className="font-bold text-slate-800 dark:text-slate-200">
                          {act.title}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {formatDate(act.timestamp.split('T')[0])}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-400 italic">
                      Application created on {formatDate(app.dateApplied)}.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            Last updated: {formatDate(app.lastUpdated.split('T')[0])}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onEdit(app)}
              className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors"
            >
              Full Edit Form
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors shadow-sm"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
