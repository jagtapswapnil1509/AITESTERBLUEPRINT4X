export type ApplicationStatus =
  | 'WISHLIST'
  | 'APPLIED'
  | 'FOLLOW_UP'
  | 'INTERVIEW'
  | 'OFFER'
  | 'REJECTED'
  // Legacy backward-compatible statuses
  | 'SCREENING'
  | 'ASSESSMENT'
  | 'WITHDRAWN';

export type PriorityLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export type WorkModel = 'REMOTE' | 'HYBRID' | 'ONSITE';

export type JobType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';

export interface InterviewRound {
  id: string;
  roundNumber: number;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string;
  interviewers?: string;
  meetingLink?: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  keyQuestions?: string;
}

export interface Contact {
  id: string;
  name: string;
  role?: string;
  email?: string;
  phone?: string;
  linkedinUrl?: string;
  notes?: string;
}

export interface ActivityItem {
  id: string;
  timestamp: string;
  title: string;
  description?: string;
}

export interface JobApplication {
  id: string;
  company: string; // Required
  role: string; // Required
  status: ApplicationStatus; // Maps to Kanban column
  jobUrl?: string; // LinkedIn / Job URL (clickable)
  resumeVersion?: string; // Resume used (e.g. "SDE_Resume_v3", "QA_Lead_Resume")
  dateApplied: string; // YYYY-MM-DD (auto-set, editable)
  salary?: string; // Optional (e.g. "₹25-30 LPA" or "$150-180K")
  currency?: string; // 'INR' | 'USD' | 'EUR' | 'GBP' | etc.
  notes?: string; // Optional textarea for recruiter name, referral info, notes
  
  // Optional extra metadata
  priority?: PriorityLevel;
  workModel?: WorkModel;
  jobType?: JobType;
  location?: string;
  lastUpdated?: string;
  referralName?: string;
  coverLetterUsed?: boolean;
  
  // Follow-up info
  followUpDate?: string;
  followUpCompleted?: boolean;
  followUpNotes?: string;
  
  // Attached files/resumes
  resumeFileName?: string;
  resumeFileData?: string;
  resumeFileSize?: number;
  resumeFileType?: string;
  resumeUploadedAt?: string;
  resumeUrl?: string;
  tags?: string[];
  
  // Sub-entities
  interviews?: InterviewRound[];
  contacts?: Contact[];
  activityHistory?: ActivityItem[];
}

export interface StatusConfig {
  key: ApplicationStatus;
  label: string;
  shortLabel?: string;
  color: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  accentBorder: string; // e.g. border-l-amber-500
  description: string;
}

export interface FilterState {
  search: string;
  status: ApplicationStatus | 'ALL';
  priority: PriorityLevel | 'ALL';
  resumeVersion: string | 'ALL';
  sortBy: 'dateApplied' | 'company' | 'role' | 'salary' | 'lastUpdated';
  sortOrder: 'asc' | 'desc';
  workModel?: string;
  tag?: string;
  followUpOnly?: boolean;
}

export type ViewMode = 'board' | 'table' | 'schedule' | 'analytics';
export type ThemeMode = 'dark' | 'light' | 'system';
