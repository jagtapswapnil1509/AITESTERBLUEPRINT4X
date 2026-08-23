import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Building2,
  Briefcase,
  FileText,
  Calendar,
  DollarSign,
  Globe,
  ExternalLink,
  Plus,
  Check,
  AlertCircle,
  Upload,
  UploadCloud,
  Trash2,
  Eye,
  FileCheck,
  File,
} from 'lucide-react';
import { JobApplication, ApplicationStatus, PriorityLevel, WorkModel, JobType } from '../types/job';
import {
  STATUS_CONFIGS,
  ORDERED_STATUSES,
  PRIORITY_CONFIGS,
  WORK_MODEL_LABELS,
  JOB_TYPE_LABELS,
  getCurrencySymbol,
} from '../utils/constants';
import { getTodayDateString, addDaysToDate } from '../utils/dateUtils';
import { getUsedResumeNames, addCustomResumeName } from '../utils/indexedDb';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (app: JobApplication) => void;
  editingApp?: JobApplication | null;
  defaultStatus?: ApplicationStatus;
}

export const ApplicationModal: React.FC<ApplicationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingApp,
  defaultStatus = 'APPLIED',
}) => {
  // Form State
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState<ApplicationStatus>(defaultStatus);
  const [jobUrl, setJobUrl] = useState('');

  // Resume State (File upload + Version metadata)
  const [resumeMode, setResumeMode] = useState<'upload' | 'saved'>('upload');
  const [resumeFileData, setResumeFileData] = useState<string | undefined>(undefined);
  const [resumeFileName, setResumeFileName] = useState<string | undefined>(undefined);
  const [resumeFileSize, setResumeFileSize] = useState<number | undefined>(undefined);
  const [resumeFileType, setResumeFileType] = useState<string | undefined>(undefined);
  const [resumeUploadedAt, setResumeUploadedAt] = useState<string | undefined>(undefined);
  const [resumeVersion, setResumeVersion] = useState('My_Resume');
  const [customResumeInput, setCustomResumeInput] = useState('');
  const [isAddingCustomResume, setIsAddingCustomResume] = useState(false);
  const [availableResumes, setAvailableResumes] = useState<string[]>([]);
  const [fileUploadError, setFileUploadError] = useState<string | null>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [dateApplied, setDateApplied] = useState(getTodayDateString());
  const [salary, setSalary] = useState('');
  const [currency, setCurrency] = useState<string>('INR');
  const [notes, setNotes] = useState('');

  // Optional extra metadata
  const [priority, setPriority] = useState<PriorityLevel>('MEDIUM');
  const [workModel, setWorkModel] = useState<WorkModel>('REMOTE');
  const [jobType, setJobType] = useState<JobType>('FULL_TIME');
  const [location, setLocation] = useState('');

  // Validation errors
  const [errors, setErrors] = useState<{ company?: string; role?: string }>({});
  const [touched, setTouched] = useState<{ company?: boolean; role?: boolean }>({});

  // Load available resume names on mount / open
  useEffect(() => {
    if (isOpen) {
      getUsedResumeNames().then((names) => {
        setAvailableResumes(names);
      });
    }
  }, [isOpen]);

  // Reset or populate fields on modal open
  useEffect(() => {
    if (!isOpen) return;

    if (editingApp) {
      setCompany(editingApp.company || '');
      setRole(editingApp.role || '');
      setStatus(editingApp.status || 'APPLIED');
      setJobUrl(editingApp.jobUrl || '');
      
      // Resume data
      setResumeFileData(editingApp.resumeFileData);
      setResumeFileName(editingApp.resumeFileName);
      setResumeFileSize(editingApp.resumeFileSize);
      setResumeFileType(editingApp.resumeFileType);
      setResumeUploadedAt(editingApp.resumeUploadedAt);
      setResumeVersion(editingApp.resumeVersion || editingApp.resumeFileName || 'My_Resume');
      setResumeMode(editingApp.resumeFileData || editingApp.resumeFileName ? 'upload' : 'saved');

      setDateApplied(editingApp.dateApplied || getTodayDateString());
      setSalary(editingApp.salary || '');
      setCurrency(editingApp.currency || (editingApp.salary?.includes('$') ? 'USD' : 'INR'));
      setNotes(editingApp.notes || '');
      setPriority(editingApp.priority || 'MEDIUM');
      setWorkModel(editingApp.workModel || 'REMOTE');
      setJobType(editingApp.jobType || 'FULL_TIME');
      setLocation(editingApp.location || '');
    } else {
      setCompany('');
      setRole('');
      setStatus(defaultStatus);
      setJobUrl('');

      // New empty resume
      setResumeFileData(undefined);
      setResumeFileName(undefined);
      setResumeFileSize(undefined);
      setResumeFileType(undefined);
      setResumeUploadedAt(undefined);
      setResumeVersion('My_Resume');
      setResumeMode('upload');

      setDateApplied(getTodayDateString());
      setSalary('');
      setCurrency('INR');
      setNotes('');
      setPriority('MEDIUM');
      setWorkModel('REMOTE');
      setJobType('FULL_TIME');
      setLocation('');
    }
    setErrors({});
    setTouched({});
    setIsAddingCustomResume(false);
    setCustomResumeInput('');
    setFileUploadError(null);
    setIsDraggingFile(false);
  }, [isOpen, editingApp, defaultStatus]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: { company?: string; role?: string } = {};
    if (!company.trim()) {
      newErrors.company = 'Company name is required';
    }
    if (!role.trim()) {
      newErrors.role = 'Job title / role is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileProcess = (file: File) => {
    if (!file) return;

    const validExtensions = ['.pdf', '.docx', '.doc', '.txt'];
    const fileNameLower = file.name.toLowerCase();
    const hasValidExt = validExtensions.some((ext) => fileNameLower.endsWith(ext));

    if (!hasValidExt) {
      setFileUploadError('Please upload a PDF (.pdf) or Word (.docx, .doc) or text (.txt) document.');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setFileUploadError('File size exceeds 15MB limit. Please upload a smaller file.');
      return;
    }

    setFileUploadError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      setResumeFileData(base64String);
      setResumeFileName(file.name);
      setResumeFileSize(file.size);
      setResumeFileType(
        file.type ||
          (fileNameLower.endsWith('.pdf')
            ? 'application/pdf'
            : fileNameLower.endsWith('.docx')
            ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            : 'application/msword')
      );
      setResumeUploadedAt(new Date().toISOString());

      // Auto-set the version name based on the clean filename if not custom
      const baseName = file.name.replace(/\.[^/.]+$/, '');
      setResumeVersion(baseName);
    };
    reader.onerror = () => {
      setFileUploadError('Failed to read file from computer. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
    // reset input so the same file can be chosen again if needed
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleRemoveAttachedFile = () => {
    setResumeFileData(undefined);
    setResumeFileName(undefined);
    setResumeFileSize(undefined);
    setResumeFileType(undefined);
    setResumeUploadedAt(undefined);
  };

  const handleAddNewResume = async () => {
    if (customResumeInput.trim()) {
      const trimmed = customResumeInput.trim();
      const updated = await addCustomResumeName(trimmed);
      setAvailableResumes(updated);
      setResumeVersion(trimmed);
      setCustomResumeInput('');
      setIsAddingCustomResume(false);
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ company: true, role: true });

    if (!validate()) {
      return;
    }

    const finalResumeVersion =
      resumeMode === 'saved' && isAddingCustomResume && customResumeInput.trim()
        ? customResumeInput.trim()
        : resumeVersion || resumeFileName?.replace(/\.[^/.]+$/, '') || 'Standard_Resume';

    // Save custom resume name if new
    if (finalResumeVersion && !availableResumes.includes(finalResumeVersion)) {
      addCustomResumeName(finalResumeVersion);
    }

    const payload: JobApplication = {
      id: editingApp ? editingApp.id : `job-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      company: company.trim(),
      role: role.trim(),
      status,
      jobUrl: jobUrl.trim() || undefined,
      resumeVersion: finalResumeVersion,
      resumeFileData: resumeFileData,
      resumeFileName: resumeFileName,
      resumeFileSize: resumeFileSize,
      resumeFileType: resumeFileType,
      resumeUploadedAt: resumeUploadedAt,
      dateApplied: dateApplied || getTodayDateString(),
      salary: salary.trim() || undefined,
      currency,
      notes: notes.trim() || undefined,
      priority,
      workModel,
      jobType,
      location: location.trim() || undefined,
      lastUpdated: new Date().toISOString(),
      followUpDate: editingApp?.followUpDate || addDaysToDate(dateApplied || getTodayDateString(), 7),
      followUpCompleted: editingApp?.followUpCompleted || false,
      interviews: editingApp?.interviews || [],
      contacts: editingApp?.contacts || [],
      activityHistory: editingApp?.activityHistory || [
        {
          id: `act-${Date.now()}`,
          timestamp: new Date().toISOString(),
          title: editingApp ? 'Application details updated' : `Created application in ${STATUS_CONFIGS[status].label}`,
        },
      ],
    };

    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden my-8 animate-fadeIn flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/80 sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {editingApp ? 'Edit Job Application' : 'Add New Job Application'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {editingApp ? 'Update application progress and details' : 'Save and organize a new job into your Kanban pipeline'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Company & Role (Required) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Company Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Google, Stripe, Razorpay"
                  value={company}
                  onChange={(e) => {
                    setCompany(e.target.value);
                    if (touched.company && e.target.value.trim()) {
                      setErrors((prev) => ({ ...prev, company: undefined }));
                    }
                  }}
                  onBlur={() => setTouched((prev) => ({ ...prev, company: true }))}
                  className={`w-full pl-9 pr-3 py-2 text-sm rounded-xl border bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                    touched.company && errors.company
                      ? 'border-rose-500 focus:ring-rose-500/20'
                      : 'border-slate-300 dark:border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20'
                  }`}
                />
              </div>
              {touched.company && errors.company && (
                <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3 h-3" />
                  {errors.company}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Job Title / Role <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Frontend Engineer"
                  value={role}
                  onChange={(e) => {
                    setRole(e.target.value);
                    if (touched.role && e.target.value.trim()) {
                      setErrors((prev) => ({ ...prev, role: undefined }));
                    }
                  }}
                  onBlur={() => setTouched((prev) => ({ ...prev, role: true }))}
                  className={`w-full pl-9 pr-3 py-2 text-sm rounded-xl border bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                    touched.role && errors.role
                      ? 'border-rose-500 focus:ring-rose-500/20'
                      : 'border-slate-300 dark:border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20'
                  }`}
                />
              </div>
              {touched.role && errors.role && (
                <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3 h-3" />
                  {errors.role}
                </p>
              )}
            </div>
          </div>

          {/* Status Column Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Pipeline Stage / Column
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {ORDERED_STATUSES.map((statKey) => {
                const config = STATUS_CONFIGS[statKey];
                const isSelected = status === statKey;
                return (
                  <button
                    key={statKey}
                    type="button"
                    onClick={() => setStatus(statKey)}
                    className={`px-2.5 py-2 rounded-xl text-xs font-bold border flex flex-col items-center gap-1 transition-all ${
                      isSelected
                        ? `${config.badgeBg} ${config.badgeText} ${config.badgeBorder} ring-2 ring-indigo-500/40 shadow-sm`
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: config.color }}
                    />
                    <span>{config.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* LinkedIn Job URL */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              LinkedIn / Job Posting URL
            </label>
            <div className="relative">
              <span className="w-8 text-center text-xs font-bold text-indigo-500 dark:text-indigo-400 absolute left-1 top-1/2 -translate-y-1/2 select-none">
                in
              </span>
              <input
                type="url"
                placeholder="https://www.linkedin.com/jobs/view/..."
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          {/* Resume Upload & Selection Section */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <label className="text-xs font-bold text-slate-900 dark:text-white">
                  Resume for this Application
                </label>
              </div>

              {/* Mode Toggle Tabs */}
              <div className="flex items-center p-0.5 rounded-lg bg-slate-200/80 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-[11px] font-semibold">
                <button
                  type="button"
                  onClick={() => setResumeMode('upload')}
                  className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                    resumeMode === 'upload'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Upload className="w-3 h-3" />
                  <span>Upload from Computer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setResumeMode('saved')}
                  className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                    resumeMode === 'saved'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <FileCheck className="w-3 h-3" />
                  <span>Saved Version Tag</span>
                </button>
              </div>
            </div>

            {/* Upload from Computer Mode */}
            {resumeMode === 'upload' && (
              <div className="space-y-3">
                {resumeFileData || resumeFileName ? (
                  /* Attached File Card */
                  <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-indigo-200 dark:border-indigo-800/60 shadow-xs flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/40 flex items-center justify-center shrink-0">
                        {resumeFileName?.toLowerCase().endsWith('.pdf') ? (
                          <span className="text-[10px] font-black text-rose-600 dark:text-rose-400">PDF</span>
                        ) : resumeFileName?.toLowerCase().includes('.doc') ? (
                          <span className="text-[10px] font-black text-blue-600 dark:text-blue-400">DOC</span>
                        ) : (
                          <FileText className="w-5 h-5" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[220px] sm:max-w-[300px]">
                            {resumeFileName || resumeVersion}
                          </h4>
                          <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                            Attached
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {formatFileSize(resumeFileSize)} {resumeFileSize ? '•' : ''} Ready to save offline
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
                        title="Choose a different file"
                      >
                        Replace
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveAttachedFile}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                        title="Remove attached file"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* File Dropzone */
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                      isDraggingFile
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 scale-[1.01]'
                        : 'border-slate-300 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 bg-white dark:bg-slate-900/50 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/10'
                    }`}
                  >
                    <div className="w-10 h-10 mx-auto rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Click to choose resume from computer <span className="font-normal text-slate-500">or drag & drop</span>
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                      Supports <strong className="text-slate-600 dark:text-slate-300">PDF (.pdf)</strong> and <strong className="text-slate-600 dark:text-slate-300">Word (.doc, .docx)</strong> up to 15MB
                    </p>
                  </div>
                )}

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.doc,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFileInputChange}
                  className="hidden"
                />

                {fileUploadError && (
                  <p className="text-[11px] text-rose-500 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {fileUploadError}
                  </p>
                )}

                {/* Optional Resume Version Tag Label */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Resume Version Tag / Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. SDE_Resume_v3 or QA_Lead_2026"
                    value={resumeVersion}
                    onChange={(e) => setResumeVersion(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 font-medium"
                  />
                </div>
              </div>
            )}

            {/* Choose from Saved Versions Mode */}
            {resumeMode === 'saved' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                    Select a previously logged resume title:
                  </span>
                  {!isAddingCustomResume ? (
                    <button
                      type="button"
                      onClick={() => setIsAddingCustomResume(true)}
                      className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      Add custom tag
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsAddingCustomResume(false)}
                      className="text-[11px] font-semibold text-slate-500 hover:underline"
                    >
                      Pick existing
                    </button>
                  )}
                </div>

                {!isAddingCustomResume ? (
                  <div className="relative">
                    <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      value={resumeVersion}
                      onChange={(e) => setResumeVersion(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 cursor-pointer font-medium"
                    >
                      {availableResumes.map((r) => (
                        <option key={r} value={r}>
                          📄 {r}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="e.g. FullStack_Resume_v2"
                        value={customResumeInput}
                        onChange={(e) => setCustomResumeInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddNewResume();
                          }
                        }}
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-indigo-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
                        autoFocus
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddNewResume}
                      className="px-3 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Save
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Date Applied & Salary Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Date Applied
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  value={dateApplied}
                  onChange={(e) => setDateApplied(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Salary / Compensation
                </label>
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setCurrency('INR')}
                    className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                      currency === 'INR'
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    ₹ INR
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrency('USD')}
                    className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                      currency === 'USD'
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    $ USD
                  </button>
                </div>
              </div>
              <div className="relative">
                <span className="w-8 text-center text-xs font-bold text-emerald-600 dark:text-emerald-400 absolute left-0 top-1/2 -translate-y-1/2 select-none">
                  {getCurrencySymbol(currency)}
                </span>
                <input
                  type="text"
                  placeholder={
                    currency === 'INR'
                      ? 'e.g. ₹25-30 LPA or ₹20,00,000'
                      : 'e.g. $150-180K or $165,000'
                  }
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>
          </div>

          {/* Notes & Recruiter info */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Notes / Recruiter & Referral Info
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Recruiter: Priya Sharma (priya@company.com), Referred by Alex from Backend team. Round 1 prep: System design & distributed caching."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 text-xs rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 resize-none leading-relaxed"
            />
          </div>

          {/* Optional Meta: Priority & Work Model */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Priority Level
              </label>
              <div className="flex gap-2">
                {(['HIGH', 'MEDIUM', 'LOW'] as PriorityLevel[]).map((p) => {
                  const conf = PRIORITY_CONFIGS[p];
                  const active = priority === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-lg border transition-all ${
                        active
                          ? `${conf.badgeBg} ${conf.badgeText} ring-1 ring-indigo-500/40`
                          : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {conf.label.replace(' Priority', '')}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Work Model
              </label>
              <div className="flex gap-2">
                {(['REMOTE', 'HYBRID', 'ONSITE'] as WorkModel[]).map((wm) => {
                  const active = workModel === wm;
                  return (
                    <button
                      key={wm}
                      type="button"
                      onClick={() => setWorkModel(wm)}
                      className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-lg border transition-all ${
                        active
                          ? 'bg-indigo-500/10 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                          : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {WORK_MODEL_LABELS[wm]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md flex items-center gap-1.5 transition-all"
            >
              <Check className="w-4 h-4" />
              {editingApp ? 'Save Changes' : 'Create Job Card'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

