import { ApplicationStatus, PriorityLevel, StatusConfig, WorkModel, JobType } from '../types/job';

export const STATUS_CONFIGS: Record<ApplicationStatus, StatusConfig> = {
  WISHLIST: {
    key: 'WISHLIST',
    label: 'Wishlist',
    shortLabel: 'Wishlist',
    color: '#94a3b8',
    badgeBg: 'bg-slate-500/10 dark:bg-slate-500/15',
    badgeText: 'text-slate-700 dark:text-slate-300',
    badgeBorder: 'border-slate-300 dark:border-slate-700',
    accentBorder: 'border-l-slate-400 dark:border-l-slate-500',
    description: 'Saved jobs I haven\'t applied to yet',
  },
  APPLIED: {
    key: 'APPLIED',
    label: 'Applied',
    shortLabel: 'Applied',
    color: '#6366f1',
    badgeBg: 'bg-indigo-500/10 dark:bg-indigo-500/15',
    badgeText: 'text-indigo-700 dark:text-indigo-300',
    badgeBorder: 'border-indigo-300 dark:border-indigo-800',
    accentBorder: 'border-l-indigo-500 dark:border-l-indigo-400',
    description: 'Application submitted',
  },
  FOLLOW_UP: {
    key: 'FOLLOW_UP',
    label: 'Follow-up',
    shortLabel: 'Follow-up',
    color: '#06b6d4',
    badgeBg: 'bg-cyan-500/10 dark:bg-cyan-500/15',
    badgeText: 'text-cyan-700 dark:text-cyan-300',
    badgeBorder: 'border-cyan-300 dark:border-cyan-800',
    accentBorder: 'border-l-cyan-500 dark:border-l-cyan-400',
    description: 'Followed up with recruiter / referral',
  },
  INTERVIEW: {
    key: 'INTERVIEW',
    label: 'Interview',
    shortLabel: 'Interview',
    color: '#f59e0b',
    badgeBg: 'bg-amber-500/10 dark:bg-amber-500/15',
    badgeText: 'text-amber-700 dark:text-amber-300',
    badgeBorder: 'border-amber-300 dark:border-amber-800',
    accentBorder: 'border-l-amber-500 dark:border-l-amber-400',
    description: 'Currently in interview rounds',
  },
  OFFER: {
    key: 'OFFER',
    label: 'Offer',
    shortLabel: 'Offer',
    color: '#10b981',
    badgeBg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
    badgeBorder: 'border-emerald-300 dark:border-emerald-800',
    accentBorder: 'border-l-emerald-500 dark:border-l-emerald-400',
    description: 'Received an offer',
  },
  REJECTED: {
    key: 'REJECTED',
    label: 'Rejected',
    shortLabel: 'Rejected',
    color: '#f43f5e',
    badgeBg: 'bg-rose-500/10 dark:bg-rose-500/15',
    badgeText: 'text-rose-700 dark:text-rose-300',
    badgeBorder: 'border-rose-300 dark:border-rose-800',
    accentBorder: 'border-l-rose-500 dark:border-l-rose-400',
    description: 'Got a rejection',
  },
  // Legacy backward-compatibility mappings
  SCREENING: {
    key: 'SCREENING',
    label: 'Screening',
    shortLabel: 'Screening',
    color: '#a855f7',
    badgeBg: 'bg-purple-500/10 dark:bg-purple-500/15',
    badgeText: 'text-purple-700 dark:text-purple-300',
    badgeBorder: 'border-purple-300 dark:border-purple-800',
    accentBorder: 'border-l-purple-500 dark:border-l-purple-400',
    description: 'Recruiter screen',
  },
  ASSESSMENT: {
    key: 'ASSESSMENT',
    label: 'Assessment',
    shortLabel: 'Assessment',
    color: '#06b6d4',
    badgeBg: 'bg-cyan-500/10 dark:bg-cyan-500/15',
    badgeText: 'text-cyan-700 dark:text-cyan-300',
    badgeBorder: 'border-cyan-300 dark:border-cyan-800',
    accentBorder: 'border-l-cyan-500 dark:border-l-cyan-400',
    description: 'Assessment or take-home',
  },
  WITHDRAWN: {
    key: 'WITHDRAWN',
    label: 'Withdrawn',
    shortLabel: 'Withdrawn',
    color: '#64748b',
    badgeBg: 'bg-slate-500/10 dark:bg-slate-500/15',
    badgeText: 'text-slate-700 dark:text-slate-300',
    badgeBorder: 'border-slate-300 dark:border-slate-700',
    accentBorder: 'border-l-slate-400 dark:border-l-slate-500',
    description: 'Voluntarily withdrawn',
  },
};

/**
 * The 6 Core Kanban Columns for Version 2:
 * 1. Wishlist — Saved jobs I haven't applied to yet
 * 2. Applied — Application submitted
 * 3. Follow-up — Followed up with recruiter / referral
 * 4. Interview — Currently in interview rounds
 * 5. Offer — Received an offer
 * 6. Rejected — Got a rejection
 */
export const V2_KANBAN_COLUMNS: ApplicationStatus[] = [
  'WISHLIST',
  'APPLIED',
  'FOLLOW_UP',
  'INTERVIEW',
  'OFFER',
  'REJECTED',
];

export const ORDERED_STATUSES = V2_KANBAN_COLUMNS;

export const DEFAULT_RESUME_VERSIONS = [
  'SDE_Resume_v3',
  'Frontend_Lead_Resume_2026',
  'FullStack_Engineer_v2',
  'QA_Lead_Resume',
  'General_Tech_Resume_v1',
  'Backend_Distributed_Resume',
];

export const PRIORITY_CONFIGS: Record<PriorityLevel, { label: string; badgeBg: string; badgeText: string; dotColor: string }> = {
  HIGH: {
    label: 'High Priority',
    badgeBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800/40',
    badgeText: 'text-rose-600 dark:text-rose-400',
    dotColor: 'bg-rose-500',
  },
  MEDIUM: {
    label: 'Medium Priority',
    badgeBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/40',
    badgeText: 'text-amber-600 dark:text-amber-400',
    dotColor: 'bg-amber-500',
  },
  LOW: {
    label: 'Low Priority',
    badgeBg: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700',
    badgeText: 'text-slate-600 dark:text-slate-400',
    dotColor: 'bg-slate-400 dark:bg-slate-500',
  },
};

export const WORK_MODEL_LABELS: Record<WorkModel, string> = {
  REMOTE: 'Remote',
  HYBRID: 'Hybrid',
  ONSITE: 'On-site',
};

export const JOB_TYPE_LABELS: Record<JobType, string> = {
  FULL_TIME: 'Full-Time',
  PART_TIME: 'Part-Time',
  CONTRACT: 'Contract',
  INTERNSHIP: 'Internship',
};

export * from './currency';
