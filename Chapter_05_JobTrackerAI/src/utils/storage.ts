import { JobApplication } from '../types/job';
import { addDaysToDate, getTodayDateString } from './dateUtils';

const STORAGE_KEY = 'offline_job_tracker_applications_v1';
const SETTINGS_KEY = 'offline_job_tracker_settings_v1';

export interface UserSettings {
  userName: string;
  userEmail?: string;
  userTitle?: string;
  defaultResumeName?: string;
  defaultFollowUpDays: number;
  currencySymbol: string;
  theme: 'light' | 'dark' | 'system';
}

export const DEFAULT_SETTINGS: UserSettings = {
  userName: 'Applicant',
  userEmail: '',
  userTitle: 'Software Engineer',
  defaultResumeName: 'Resume_2026_Standard.pdf',
  defaultFollowUpDays: 7,
  currencySymbol: '$',
  theme: 'system',
};

export const INITIAL_SAMPLE_APPLICATIONS: JobApplication[] = [
  {
    id: 'sample-1',
    company: 'Stripe',
    role: 'Senior Frontend Engineer',
    status: 'INTERVIEW',
    priority: 'HIGH',
    workModel: 'REMOTE',
    jobType: 'FULL_TIME',
    location: 'San Francisco, CA (Remote)',
    salary: '$165,000 - $190,000 + Equity',
    currency: 'USD',
    jobUrl: 'https://stripe.com/jobs',
    dateApplied: addDaysToDate(getTodayDateString(), -14),
    lastUpdated: new Date().toISOString(),
    followUpDate: addDaysToDate(getTodayDateString(), 1),
    followUpCompleted: false,
    followUpNotes: 'Prep questions about distributed UI caching and API idempotency.',
    resumeVersion: 'Resume_Frontend_V2.pdf',
    resumeFileName: 'Resume_Frontend_Staff_2026.pdf',
    resumeFileSize: 142800,
    resumeFileType: 'application/pdf',
    resumeUploadedAt: addDaysToDate(getTodayDateString(), -14),
    coverLetterUsed: true,
    referralName: 'Sarah Jenkins (ex-colleague)',
    tags: ['Dream Company', 'Fintech', 'Referral'],
    notes: 'Very excited about their modern Developer Experience team. Recruiter mentioned 4 stages total.',
    interviews: [
      {
        id: 'int-1',
        roundNumber: 1,
        title: 'Recruiter Screening Call',
        date: addDaysToDate(getTodayDateString(), -10),
        time: '14:00',
        interviewers: 'Alex Rivera (Talent Acquisition)',
        meetingLink: 'https://zoom.us/j/sample123',
        status: 'COMPLETED',
        notes: 'Discussed salary expectations ($175k base target), team fit, and past projects.',
        keyQuestions: 'Why Stripe? Experience leading large frontend migrations.',
      },
      {
        id: 'int-2',
        roundNumber: 2,
        title: 'Technical Architecture & Deep Dive',
        date: addDaysToDate(getTodayDateString(), 2),
        time: '11:00',
        interviewers: 'David Chen (Staff Tech Lead)',
        meetingLink: 'https://zoom.us/j/techcall456',
        status: 'SCHEDULED',
        notes: 'Prepare system design for a real-time analytics dashboard with offline queuing.',
        keyQuestions: 'State management at scale, bundle optimization, WebSockets vs SSE.',
      },
    ],
    contacts: [
      {
        id: 'c-1',
        name: 'Alex Rivera',
        role: 'Senior Tech Recruiter',
        email: 'alex.rivera@example.com',
        linkedinUrl: 'https://linkedin.com/in/alex-rivera-sample',
        notes: 'Very responsive. Prefers email communication.',
      },
    ],
    activityHistory: [
      {
        id: 'act-1',
        timestamp: new Date(Date.now() - 14 * 86400000).toISOString(),
        title: 'Application Submitted',
        description: 'Applied via employee referral from Sarah.',
      },
      {
        id: 'act-2',
        timestamp: new Date(Date.now() - 10 * 86400000).toISOString(),
        title: 'Screening Passed',
        description: 'Completed HR screen and moved to Technical Deep Dive round.',
      },
    ],
  },
  {
    id: 'sample-2',
    company: 'Linear',
    role: 'Product Engineer',
    status: 'ASSESSMENT',
    priority: 'HIGH',
    workModel: 'REMOTE',
    jobType: 'FULL_TIME',
    location: 'Worldwide Remote',
    salary: '$150,000 - $180,000',
    jobUrl: 'https://linear.app/careers',
    dateApplied: addDaysToDate(getTodayDateString(), -8),
    lastUpdated: new Date().toISOString(),
    followUpDate: addDaysToDate(getTodayDateString(), 0),
    followUpCompleted: false,
    followUpNotes: 'Submit the take-home design project before end of day.',
    resumeVersion: 'Resume_Product_Engineer.pdf',
    coverLetterUsed: true,
    tags: ['Startup', 'Dream Company', 'AI / ML'],
    notes: 'Obsessed with high-craft UI, keyboard shortcuts, and instantaneous interactions.',
    interviews: [
      {
        id: 'int-linear-1',
        roundNumber: 1,
        title: 'Async Coding & Design Exercise',
        date: addDaysToDate(getTodayDateString(), 0),
        status: 'SCHEDULED',
        notes: 'Implement custom optimistic UI synchronization with offline persistence.',
      },
    ],
    contacts: [
      {
        id: 'c-linear-1',
        name: 'Elena Rostova',
        role: 'Head of People',
        email: 'elena@linear-sample.com',
      },
    ],
    activityHistory: [
      {
        id: 'act-l1',
        timestamp: new Date(Date.now() - 8 * 86400000).toISOString(),
        title: 'Applied on Careers Page',
      },
    ],
  },
  {
    id: 'sample-3',
    company: 'Datadog',
    role: 'Full Stack Software Engineer',
    status: 'SCREENING',
    priority: 'MEDIUM',
    workModel: 'HYBRID',
    jobType: 'FULL_TIME',
    location: 'New York, NY',
    salary: '$140,000 - $165,000',
    jobUrl: 'https://datadoghq.com',
    dateApplied: addDaysToDate(getTodayDateString(), -5),
    lastUpdated: new Date().toISOString(),
    followUpDate: addDaysToDate(getTodayDateString(), 3),
    followUpCompleted: false,
    followUpNotes: 'Recruiter call scheduled for next Tuesday.',
    resumeVersion: 'Resume_2026_Standard.pdf',
    coverLetterUsed: false,
    tags: ['Enterprise', 'High Growth'],
    notes: 'Observability platform team. Hybrid 2 days in office.',
    interviews: [
      {
        id: 'int-dd-1',
        roundNumber: 1,
        title: 'Initial HR Screen',
        date: addDaysToDate(getTodayDateString(), 3),
        time: '15:30',
        interviewers: 'Marcus Vance',
        status: 'SCHEDULED',
        notes: 'Review past experience with TypeScript, Go, and telemetry data visualization.',
      },
    ],
    contacts: [
      {
        id: 'c-dd-1',
        name: 'Marcus Vance',
        role: 'Engineering Recruiter',
        email: 'marcus.v@datadog-sample.com',
      },
    ],
    activityHistory: [
      {
        id: 'act-dd1',
        timestamp: new Date(Date.now() - 5 * 86400000).toISOString(),
        title: 'Direct Application via LinkedIn',
      },
    ],
  },
  {
    id: 'sample-4',
    company: 'Spotify',
    role: 'Web Platform Engineer',
    status: 'APPLIED',
    priority: 'MEDIUM',
    workModel: 'REMOTE',
    jobType: 'FULL_TIME',
    location: 'Remote, US',
    salary: '$155,000 - $175,000',
    jobUrl: 'https://spotify.com/jobs',
    dateApplied: addDaysToDate(getTodayDateString(), -6),
    lastUpdated: new Date().toISOString(),
    followUpDate: addDaysToDate(getTodayDateString(), 2),
    followUpCompleted: false,
    resumeVersion: 'Resume_Frontend_V2.pdf',
    coverLetterUsed: true,
    tags: ['Tier 1', 'Media'],
    notes: 'Audio player web SDK team.',
    interviews: [],
    contacts: [],
    activityHistory: [
      {
        id: 'act-sp1',
        timestamp: new Date(Date.now() - 6 * 86400000).toISOString(),
        title: 'Application Submitted',
      },
    ],
  },
  {
    id: 'sample-5',
    company: 'Anthropic',
    role: 'UI Infrastructure Engineer',
    status: 'OFFER',
    priority: 'HIGH',
    workModel: 'HYBRID',
    jobType: 'FULL_TIME',
    location: 'San Francisco, CA',
    salary: '$190,000 + Equity',
    jobUrl: 'https://anthropic.com/careers',
    dateApplied: addDaysToDate(getTodayDateString(), -25),
    lastUpdated: new Date().toISOString(),
    followUpDate: addDaysToDate(getTodayDateString(), 2),
    followUpCompleted: false,
    followUpNotes: 'Decide by Friday on final package terms and start date.',
    resumeVersion: 'Resume_Frontend_V2.pdf',
    coverLetterUsed: true,
    referralName: 'Internal contact',
    tags: ['AI / ML', 'Dream Company', 'High Growth'],
    notes: 'Received written offer! Benefits include 401k match, full health, and generous education stipend.',
    interviews: [
      {
        id: 'int-ant-1',
        roundNumber: 1,
        title: 'Technical Screen',
        date: addDaysToDate(getTodayDateString(), -20),
        status: 'COMPLETED',
      },
      {
        id: 'int-ant-2',
        roundNumber: 2,
        title: 'Virtual Onsite (4 rounds)',
        date: addDaysToDate(getTodayDateString(), -10),
        status: 'COMPLETED',
      },
    ],
    contacts: [
      {
        id: 'c-ant-1',
        name: 'Jordan Lee',
        role: 'Lead Talent Partner',
        email: 'jordan@anthropic-sample.com',
      },
    ],
    activityHistory: [
      {
        id: 'act-ant1',
        timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
        title: 'Official Offer Letter Received!',
        description: 'Received initial offer package.',
      },
    ],
  },
  {
    id: 'sample-6',
    company: 'Vercel',
    role: 'Developer Experience Specialist',
    status: 'WISHLIST',
    priority: 'HIGH',
    workModel: 'REMOTE',
    jobType: 'FULL_TIME',
    location: 'Remote',
    salary: '$145,000 - $170,000',
    jobUrl: 'https://vercel.com/careers',
    dateApplied: getTodayDateString(),
    lastUpdated: new Date().toISOString(),
    followUpDate: addDaysToDate(getTodayDateString(), 4),
    tags: ['Startup', 'Dream Company'],
    notes: 'Drafting custom cover letter emphasizing Next.js and open source contributions.',
    interviews: [],
    contacts: [],
    activityHistory: [],
  },
  {
    id: 'sample-7',
    company: 'Fintech Hub',
    role: 'React Native Developer',
    status: 'REJECTED',
    priority: 'LOW',
    workModel: 'ONSITE',
    jobType: 'FULL_TIME',
    location: 'Austin, TX',
    salary: '$120,000',
    dateApplied: addDaysToDate(getTodayDateString(), -30),
    lastUpdated: new Date().toISOString(),
    tags: ['Fintech'],
    notes: 'Received automated rejection after 3 weeks. Position put on hold.',
    interviews: [],
    contacts: [],
    activityHistory: [
      {
        id: 'act-fh1',
        timestamp: new Date(Date.now() - 10 * 86400000).toISOString(),
        title: 'Application Rejected',
        description: 'Position filled or cancelled.',
      },
    ],
  },
  {
    id: 'sample-8',
    company: 'Razorpay',
    role: 'Lead Frontend Architect',
    status: 'INTERVIEW',
    priority: 'HIGH',
    workModel: 'HYBRID',
    jobType: 'FULL_TIME',
    location: 'Bengaluru / Pune, India',
    salary: '₹28,00,000 - ₹35,00,000 (32 LPA)',
    currency: 'INR',
    jobUrl: 'https://razorpay.com/jobs',
    dateApplied: addDaysToDate(getTodayDateString(), -7),
    lastUpdated: new Date().toISOString(),
    followUpDate: addDaysToDate(getTodayDateString(), 1),
    followUpCompleted: false,
    followUpNotes: 'Round 2 Technical Deep Dive on Payments UI & Webhooks.',
    resumeVersion: 'Resume_Frontend_Staff_2026.pdf',
    resumeFileName: 'Resume_Frontend_Staff_2026.pdf',
    resumeFileSize: 142800,
    resumeFileType: 'application/pdf',
    tags: ['Fintech', 'India', 'Dream Company'],
    notes: 'Top tier Indian payments unicorn. Interviewing for core Checkout Experience team.',
    interviews: [
      {
        id: 'int-rzp-1',
        roundNumber: 1,
        title: 'System Design & High-Concurrency UI',
        date: addDaysToDate(getTodayDateString(), 1),
        time: '16:00',
        interviewers: 'Vikram Sharma (Staff Engineer)',
        status: 'SCHEDULED',
        notes: 'Discuss micro-frontends, state synchronization, and offline payment recovery.',
      },
    ],
    contacts: [
      {
        id: 'c-rzp-1',
        name: 'Pooja Nair',
        role: 'Senior Tech Recruiter',
        email: 'pooja.nair@razorpay-sample.com',
      },
    ],
    activityHistory: [
      {
        id: 'act-rzp1',
        timestamp: new Date(Date.now() - 7 * 86400000).toISOString(),
        title: 'Applied on Razorpay Careers Portal',
      },
    ],
  },
];

export function loadStoredApplications(): JobApplication[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveStoredApplications(INITIAL_SAMPLE_APPLICATIONS);
      return INITIAL_SAMPLE_APPLICATIONS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return INITIAL_SAMPLE_APPLICATIONS;
  } catch (err) {
    console.error('Error loading applications from storage:', err);
    return INITIAL_SAMPLE_APPLICATIONS;
  }
}

export function saveStoredApplications(apps: JobApplication[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
  } catch (err) {
    console.error('Error saving applications to storage:', err);
  }
}

export function loadStoredSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveStoredSettings(settings: UserSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Error saving settings to storage:', err);
  }
}

export function exportApplicationsJSON(apps: JobApplication[]): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(apps, null, 2));
  const downloadAnchor = document.createElement('a');
  const filename = `job-tracker-backup-${getTodayDateString()}.json`;
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', filename);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function exportApplicationsCSV(apps: JobApplication[]): void {
  const headers = [
    'Company',
    'Role',
    'Status',
    'Priority',
    'Work Model',
    'Job Type',
    'Location',
    'Salary',
    'Date Applied',
    'Follow-up Date',
    'Follow-up Done',
    'Job URL',
    'Resume Version',
    'Resume File Name',
    'Resume Link URL',
    'Referral',
    'Tags',
    'Interviews Count',
    'Notes',
  ];

  const escapeCSV = (val: string | number | boolean | undefined | null) => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = apps.map((app) => [
    escapeCSV(app.company),
    escapeCSV(app.role),
    escapeCSV(app.status),
    escapeCSV(app.priority),
    escapeCSV(app.workModel),
    escapeCSV(app.jobType),
    escapeCSV(app.location),
    escapeCSV(app.salary),
    escapeCSV(app.dateApplied),
    escapeCSV(app.followUpDate),
    escapeCSV(app.followUpCompleted ? 'Yes' : 'No'),
    escapeCSV(app.jobUrl),
    escapeCSV(app.resumeVersion),
    escapeCSV(app.resumeFileName),
    escapeCSV(app.resumeUrl),
    escapeCSV(app.referralName),
    escapeCSV(app.tags.join(', ')),
    escapeCSV(app.interviews?.length || 0),
    escapeCSV(app.notes),
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const downloadAnchor = document.createElement('a');
  const filename = `job-applications-${getTodayDateString()}.csv`;
  downloadAnchor.setAttribute('href', url);
  downloadAnchor.setAttribute('download', filename);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  URL.revokeObjectURL(url);
}

export function parseApplicationsJSON(jsonString: string): JobApplication[] {
  const parsed = JSON.parse(jsonString);
  if (!Array.isArray(parsed)) {
    throw new Error('Imported JSON is not an array of applications.');
  }
  // Validate basic schema
  return parsed.map((item, idx) => ({
    id: item.id || `app-${Date.now()}-${idx}`,
    company: item.company || 'Unnamed Company',
    role: item.role || 'Job Role',
    status: item.status || 'APPLIED',
    priority: item.priority || 'MEDIUM',
    workModel: item.workModel || 'REMOTE',
    jobType: item.jobType || 'FULL_TIME',
    location: item.location || '',
    salary: item.salary || '',
    jobUrl: item.jobUrl || '',
    dateApplied: item.dateApplied || getTodayDateString(),
    lastUpdated: item.lastUpdated || new Date().toISOString(),
    followUpDate: item.followUpDate,
    followUpCompleted: Boolean(item.followUpCompleted),
    followUpNotes: item.followUpNotes || '',
    resumeVersion: item.resumeVersion || '',
    resumeFileName: item.resumeFileName || '',
    resumeFileData: item.resumeFileData || '',
    resumeFileSize: item.resumeFileSize,
    resumeFileType: item.resumeFileType || '',
    resumeUploadedAt: item.resumeUploadedAt,
    resumeUrl: item.resumeUrl || '',
    coverLetterUsed: Boolean(item.coverLetterUsed),
    referralName: item.referralName || '',
    tags: Array.isArray(item.tags) ? item.tags : [],
    notes: item.notes || '',
    interviews: Array.isArray(item.interviews) ? item.interviews : [],
    contacts: Array.isArray(item.contacts) ? item.contacts : [],
    activityHistory: Array.isArray(item.activityHistory) ? item.activityHistory : [],
  }));
}
