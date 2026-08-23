import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { JobApplication, ApplicationStatus } from '../types/job';
import { INITIAL_SAMPLE_APPLICATIONS } from './storage';
import { DEFAULT_RESUME_VERSIONS } from './constants';

const DB_NAME = 'JobTrackerV2_DB';
const DB_VERSION = 1;
const STORE_JOBS = 'applications';
const STORE_SETTINGS = 'settings';

interface JobTrackerDBSchema extends DBSchema {
  applications: {
    key: string;
    value: JobApplication;
    indexes: {
      'by-status': ApplicationStatus;
      'by-dateApplied': string;
      'by-company': string;
    };
  };
  settings: {
    key: string;
    value: any;
  };
}

let dbPromise: Promise<IDBPDatabase<JobTrackerDBSchema>> | null = null;

export async function getDB(): Promise<IDBPDatabase<JobTrackerDBSchema>> {
  if (!dbPromise) {
    dbPromise = openDB<JobTrackerDBSchema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_JOBS)) {
          const jobStore = db.createObjectStore(STORE_JOBS, { keyPath: 'id' });
          jobStore.createIndex('by-status', 'status');
          jobStore.createIndex('by-dateApplied', 'dateApplied');
          jobStore.createIndex('by-company', 'company');
        }
        if (!db.objectStoreNames.contains(STORE_SETTINGS)) {
          db.createObjectStore(STORE_SETTINGS);
        }
      },
    });
  }
  return dbPromise;
}

/**
 * Normalizes legacy status values (e.g. SCREENING, ASSESSMENT) into the 6 V2 statuses.
 */
export function normalizeStatus(status: string): ApplicationStatus {
  if (status === 'WISHLIST') return 'WISHLIST';
  if (status === 'APPLIED') return 'APPLIED';
  if (status === 'FOLLOW_UP') return 'FOLLOW_UP';
  if (status === 'INTERVIEW' || status === 'SCREENING' || status === 'ASSESSMENT') return 'INTERVIEW';
  if (status === 'OFFER') return 'OFFER';
  if (status === 'REJECTED' || status === 'WITHDRAWN') return 'REJECTED';
  return 'APPLIED';
}

/**
 * Loads all jobs from IndexedDB.
 * If empty on first run, attempts to migrate from localStorage or seed initial sample jobs.
 */
export async function getAllJobs(): Promise<JobApplication[]> {
  try {
    const db = await getDB();
    const jobs = await db.getAll(STORE_JOBS);

    if (jobs && jobs.length > 0) {
      // Normalize statuses if needed
      return jobs.map((job) => ({
        ...job,
        status: normalizeStatus(job.status),
      }));
    }

    // If user explicitly cleared data, keep it empty
    if (localStorage.getItem('job_tracker_cleared_v2') === 'true') {
      return [];
    }

    // Check if there are legacy localStorage jobs to migrate
    let migrated: JobApplication[] = [];
    try {
      const localData = localStorage.getItem('job_tracker_applications_v1');
      if (localData) {
        const parsed = JSON.parse(localData);
        if (Array.isArray(parsed) && parsed.length > 0) {
          migrated = parsed.map((item) => ({
            ...item,
            status: normalizeStatus(item.status),
            resumeVersion: item.resumeVersion || item.resumeFileName || 'SDE_Resume_v3',
          }));
        }
      }
    } catch {
      // ignore
    }

    const initial = migrated.length > 0 ? migrated : INITIAL_SAMPLE_APPLICATIONS.map((item) => ({
      ...item,
      status: normalizeStatus(item.status),
      resumeVersion: item.resumeVersion || 'SDE_Resume_v3',
    }));

    // Seed into IndexedDB
    const tx = db.transaction(STORE_JOBS, 'readwrite');
    for (const item of initial) {
      await tx.store.put(item);
    }
    await tx.done;

    return initial;
  } catch (error) {
    console.error('Error in getAllJobs from IndexedDB:', error);
    // Fallback to initial samples in memory if IndexedDB is blocked
    return INITIAL_SAMPLE_APPLICATIONS;
  }
}

/**
 * Saves or updates a single job in IndexedDB.
 */
export async function saveJob(job: JobApplication): Promise<void> {
  try {
    const db = await getDB();
    const cleanJob: JobApplication = {
      ...job,
      status: normalizeStatus(job.status),
      lastUpdated: new Date().toISOString(),
    };
    await db.put(STORE_JOBS, cleanJob);

    // Keep localStorage in sync as backup
    try {
      const all = await db.getAll(STORE_JOBS);
      localStorage.setItem('job_tracker_applications_v1', JSON.stringify(all));
    } catch {
      // ignore
    }
  } catch (error) {
    console.error('Error saving job to IndexedDB:', error);
  }
}

/**
 * Saves multiple jobs in a single batch transaction.
 */
export async function saveJobsBatch(jobs: JobApplication[]): Promise<void> {
  try {
    const db = await getDB();
    const tx = db.transaction(STORE_JOBS, 'readwrite');
    for (const job of jobs) {
      await tx.store.put({
        ...job,
        status: normalizeStatus(job.status),
      });
    }
    await tx.done;

    // Backup to localStorage
    try {
      localStorage.setItem('job_tracker_applications_v1', JSON.stringify(jobs));
    } catch {
      // ignore
    }
  } catch (error) {
    console.error('Error saving batch to IndexedDB:', error);
  }
}

/**
 * Deletes a single job by its ID.
 */
export async function deleteJob(id: string): Promise<void> {
  try {
    const db = await getDB();
    await db.delete(STORE_JOBS, id);

    try {
      const all = await db.getAll(STORE_JOBS);
      localStorage.setItem('job_tracker_applications_v1', JSON.stringify(all));
    } catch {
      // ignore
    }
  } catch (error) {
    console.error('Error deleting job from IndexedDB:', error);
  }
}

/**
 * Clears all jobs from IndexedDB and local storage.
 */
export async function clearAllJobs(): Promise<void> {
  try {
    const db = await getDB();
    await db.clear(STORE_JOBS);
    localStorage.setItem('job_tracker_cleared_v2', 'true');
    localStorage.removeItem('job_tracker_applications_v1');
    localStorage.removeItem('offline_job_tracker_applications_v1');
  } catch (error) {
    console.error('Error clearing jobs in IndexedDB:', error);
  }
}

/**
 * Replaces all jobs in IndexedDB with a new list (clearing old records first).
 */
export async function replaceAllJobs(jobs: JobApplication[]): Promise<void> {
  try {
    const db = await getDB();
    const tx = db.transaction(STORE_JOBS, 'readwrite');
    await tx.store.clear();
    for (const job of jobs) {
      await tx.store.put({
        ...job,
        status: normalizeStatus(job.status),
      });
    }
    await tx.done;

    localStorage.removeItem('job_tracker_cleared_v2');
    try {
      localStorage.setItem('job_tracker_applications_v1', JSON.stringify(jobs));
    } catch {
      // ignore
    }
  } catch (error) {
    console.error('Error replacing all jobs in IndexedDB:', error);
  }
}

/**
 * Gets all distinct resume names used across all jobs plus defaults and custom saved names.
 */
export async function getUsedResumeNames(): Promise<string[]> {
  try {
    const db = await getDB();
    const jobs = await db.getAll(STORE_JOBS);
    const customList = (await db.get(STORE_SETTINGS, 'custom_resumes')) || [];

    const names = new Set<string>([...DEFAULT_RESUME_VERSIONS, ...customList]);
    jobs.forEach((job) => {
      if (job.resumeVersion && job.resumeVersion.trim()) {
        names.add(job.resumeVersion.trim());
      }
      if (job.resumeFileName && job.resumeFileName.trim()) {
        names.add(job.resumeFileName.trim());
      }
    });

    return Array.from(names).filter(Boolean).sort();
  } catch {
    return DEFAULT_RESUME_VERSIONS;
  }
}

/**
 * Adds a new custom resume name to the persistent list.
 */
export async function addCustomResumeName(name: string): Promise<string[]> {
  const trimmed = name.trim();
  if (!trimmed) return getUsedResumeNames();

  try {
    const db = await getDB();
    const existing = (await db.get(STORE_SETTINGS, 'custom_resumes')) || [];
    if (!existing.includes(trimmed)) {
      const updated = [...existing, trimmed];
      await db.put(STORE_SETTINGS, updated, 'custom_resumes');
    }
  } catch (err) {
    console.error('Error adding custom resume name:', err);
  }
  return getUsedResumeNames();
}

/**
 * Theme persistence in IndexedDB / localStorage.
 */
export async function getThemeSetting(): Promise<'dark' | 'light'> {
  try {
    const db = await getDB();
    const theme = await db.get(STORE_SETTINGS, 'app_theme');
    if (theme === 'light' || theme === 'dark') return theme;
  } catch {
    // fallback
  }

  const localTheme = localStorage.getItem('job_tracker_theme');
  if (localTheme === 'light' || localTheme === 'dark') return localTheme;

  return 'dark'; // Default sleek dark mode
}

export async function setThemeSetting(theme: 'dark' | 'light'): Promise<void> {
  try {
    const db = await getDB();
    await db.put(STORE_SETTINGS, theme, 'app_theme');
    localStorage.setItem('job_tracker_theme', theme);
  } catch (err) {
    localStorage.setItem('job_tracker_theme', theme);
  }
}
