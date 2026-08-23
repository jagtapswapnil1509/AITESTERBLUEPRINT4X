/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  JobApplication,
  ApplicationStatus,
  FilterState,
  ViewMode,
  PriorityLevel,
} from './types/job';
import {
  getAllJobs,
  saveJob,
  deleteJob,
  saveJobsBatch,
  replaceAllJobs,
  clearAllJobs,
  getUsedResumeNames,
  getThemeSetting,
  setThemeSetting,
} from './utils/indexedDb';
import { INITIAL_SAMPLE_APPLICATIONS } from './utils/storage';
import { Header } from './components/Header';
import { FollowUpBanner } from './components/FollowUpBanner';
import { BoardView } from './components/BoardView';
import { TableView } from './components/TableView';
import { ScheduleView } from './components/ScheduleView';
import { AnalyticsView } from './components/AnalyticsView';
import { ApplicationModal } from './components/ApplicationModal';
import { ApplicationDetailDrawer } from './components/ApplicationDetailDrawer';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { EmailAssistantModal } from './components/EmailAssistantModal';
import { ExportImportModal } from './components/ExportImportModal';
import { ResumePreviewModal } from './components/ResumePreviewModal';
import { addDaysToDate, getTodayDateString, getFollowUpStatus } from './utils/dateUtils';
import { STATUS_CONFIGS, V2_KANBAN_COLUMNS } from './utils/constants';

export default function App() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const [viewMode, setViewMode] = useState<ViewMode>('board');
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: 'ALL',
    priority: 'ALL',
    resumeVersion: 'ALL',
    sortBy: 'dateApplied',
    sortOrder: 'desc',
  });

  // Resume Versions for dropdown
  const [allResumeVersions, setAllResumeVersions] = useState<string[]>([]);

  // Modals and Drawers
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [modalDefaultStatus, setModalDefaultStatus] = useState<ApplicationStatus>('APPLIED');
  const [editingApp, setEditingApp] = useState<JobApplication | null>(null);

  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);

  // Delete Confirm Modal
  const [deletingApp, setDeletingApp] = useState<JobApplication | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailModalApp, setEmailModalApp] = useState<Partial<JobApplication>>({});

  const [isExportImportOpen, setIsExportImportOpen] = useState(false);

  const [previewResumeApp, setPreviewResumeApp] = useState<JobApplication | null>(null);
  const [isPreviewResumeOpen, setIsPreviewResumeOpen] = useState(false);

  // 1. Initialize Theme from IndexedDB / Storage
  useEffect(() => {
    getThemeSetting().then((savedTheme) => {
      setTheme(savedTheme);
      const root = document.documentElement;
      if (savedTheme === 'dark') {
        root.classList.add('dark');
        root.setAttribute('data-theme', 'dark');
      } else {
        root.classList.remove('dark');
        root.setAttribute('data-theme', 'light');
      }
    });
  }, []);

  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    setThemeSetting(nextTheme);
    const root = document.documentElement;
    if (nextTheme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
  };

  // 2. Load Jobs & Resumes from IndexedDB on startup
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const jobs = await getAllJobs();
        setApplications(jobs);
        const resumes = await getUsedResumeNames();
        setAllResumeVersions(resumes);
      } catch (err) {
        console.error('Failed to load IndexedDB data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Update resume versions whenever applications change
  useEffect(() => {
    getUsedResumeNames().then(setAllResumeVersions);
  }, [applications]);

  // Keep selectedApp in sync if applications array updates
  useEffect(() => {
    if (selectedApp) {
      const updated = applications.find((a) => a.id === selectedApp.id);
      if (updated) setSelectedApp(updated);
    }
  }, [applications]);

  // Filtered & Sorted applications
  const filteredApplications = useMemo(() => {
    return applications
      .filter((app) => {
        // Search query filter (matches company, role, resumeVersion, notes, location)
        if (filters.search) {
          const q = filters.search.toLowerCase();
          const matchCompany = app.company.toLowerCase().includes(q);
          const matchRole = app.role.toLowerCase().includes(q);
          const matchResume = app.resumeVersion?.toLowerCase().includes(q) || false;
          const matchLocation = app.location?.toLowerCase().includes(q) || false;
          const matchNotes = app.notes?.toLowerCase().includes(q) || false;
          const matchRecruiter =
            app.contacts?.some(
              (c) => c.name.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q)
            ) || false;
          const matchTags = app.tags?.some((t) => t.toLowerCase().includes(q)) || false;

          if (
            !matchCompany &&
            !matchRole &&
            !matchResume &&
            !matchLocation &&
            !matchNotes &&
            !matchRecruiter &&
            !matchTags
          ) {
            return false;
          }
        }

        // Status filter
        if (filters.status !== 'ALL' && app.status !== filters.status) {
          return false;
        }

        // Priority filter
        if (filters.priority !== 'ALL' && app.priority !== filters.priority) {
          return false;
        }

        // Resume version filter
        if (
          filters.resumeVersion !== 'ALL' &&
          app.resumeVersion !== filters.resumeVersion &&
          app.resumeFileName !== filters.resumeVersion
        ) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const order = filters.sortOrder === 'asc' ? 1 : -1;
        if (filters.sortBy === 'company') {
          return a.company.localeCompare(b.company) * order;
        }
        if (filters.sortBy === 'role') {
          return a.role.localeCompare(b.role) * order;
        }
        if (filters.sortBy === 'lastUpdated') {
          return (a.lastUpdated || '').localeCompare(b.lastUpdated || '') * order;
        }
        // Default: dateApplied (Newest first)
        return (b.dateApplied || '').localeCompare(a.dateApplied || '');
      });
  }, [applications, filters]);

  // Overall metrics across V2 columns
  const totalCount = applications.length;
  const activePipelineCount = applications.filter(
    (a) => a.status !== 'REJECTED' && a.status !== 'WISHLIST'
  ).length;
  const interviewCount = applications.filter((a) => a.status === 'INTERVIEW').length;
  const offerCount = applications.filter((a) => a.status === 'OFFER').length;

  // CRUD Handlers with Instant IndexedDB persistence
  const handleSaveApplication = async (app: JobApplication) => {
    await saveJob(app);
    setApplications((prev) => {
      const exists = prev.some((a) => a.id === app.id);
      if (exists) {
        return prev.map((a) => (a.id === app.id ? app : a));
      }
      return [app, ...prev];
    });
  };

  const handleRequestDelete = (app: JobApplication) => {
    setDeletingApp(app);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingApp) return;
    await deleteJob(deletingApp.id);
    setApplications((prev) => prev.filter((a) => a.id !== deletingApp.id));
    if (selectedApp?.id === deletingApp.id) {
      setIsDetailDrawerOpen(false);
      setSelectedApp(null);
    }
    setDeletingApp(null);
  };

  const handleStatusChange = async (appId: string, nextStatus: ApplicationStatus) => {
    const targetApp = applications.find((a) => a.id === appId);
    if (!targetApp) return;

    const statusHistoryItem = {
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString(),
      title: `Moved to ${STATUS_CONFIGS[nextStatus]?.label || nextStatus}`,
    };

    const updatedApp: JobApplication = {
      ...targetApp,
      status: nextStatus,
      lastUpdated: new Date().toISOString(),
      activityHistory: [statusHistoryItem, ...(targetApp.activityHistory || [])],
    };

    await saveJob(updatedApp);
    setApplications((prev) => prev.map((a) => (a.id === appId ? updatedApp : a)));
  };

  const handleToggleFollowUpDone = async (appId: string) => {
    const targetApp = applications.find((a) => a.id === appId);
    if (!targetApp) return;

    const updatedApp: JobApplication = {
      ...targetApp,
      followUpCompleted: !targetApp.followUpCompleted,
      lastUpdated: new Date().toISOString(),
    };

    await saveJob(updatedApp);
    setApplications((prev) => prev.map((a) => (a.id === appId ? updatedApp : a)));
  };

  const handleSnoozeFollowUp = async (appId: string, days: number) => {
    const targetApp = applications.find((a) => a.id === appId);
    if (!targetApp) return;

    const nextDate = addDaysToDate(getTodayDateString(), days);
    const updatedApp: JobApplication = {
      ...targetApp,
      followUpDate: nextDate,
      followUpCompleted: false,
      lastUpdated: new Date().toISOString(),
    };

    await saveJob(updatedApp);
    setApplications((prev) => prev.map((a) => (a.id === appId ? updatedApp : a)));
  };

  const handleOpenDetail = (app: JobApplication) => {
    setSelectedApp(app);
    setIsDetailDrawerOpen(true);
  };

  const handleOpenEdit = (app: JobApplication) => {
    setEditingApp(app);
    setIsNewModalOpen(true);
  };

  const handleQuickAddInStatus = (status: ApplicationStatus) => {
    setEditingApp(null);
    setModalDefaultStatus(status);
    setIsNewModalOpen(true);
  };

  const handleOpenEmailAssistant = (app: Partial<JobApplication>) => {
    setEmailModalApp(app);
    setIsEmailModalOpen(true);
  };

  const handleOpenResumePreview = (app: JobApplication) => {
    setPreviewResumeApp(app);
    setIsPreviewResumeOpen(true);
  };

  const handleImportApplications = async (imported: JobApplication[]) => {
    await replaceAllJobs(imported);
    setApplications(imported);
    if (selectedApp) setSelectedApp(null);
    if (isDetailDrawerOpen) setIsDetailDrawerOpen(false);
  };

  const handleResetToSampleData = async () => {
    await replaceAllJobs(INITIAL_SAMPLE_APPLICATIONS);
    setApplications(INITIAL_SAMPLE_APPLICATIONS);
    if (selectedApp) setSelectedApp(null);
    if (isDetailDrawerOpen) setIsDetailDrawerOpen(false);
  };

  const handleClearAllData = async () => {
    await clearAllJobs();
    setApplications([]);
    if (selectedApp) setSelectedApp(null);
    if (isDetailDrawerOpen) setIsDetailDrawerOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 flex flex-col font-sans transition-colors duration-200 selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <Header
        totalCount={totalCount}
        activePipelineCount={activePipelineCount}
        interviewCount={interviewCount}
        offerCount={offerCount}
        viewMode={viewMode}
        onViewChange={setViewMode}
        filters={filters}
        onFilterChange={setFilters}
        onOpenNewModal={() => {
          setEditingApp(null);
          setModalDefaultStatus('APPLIED');
          setIsNewModalOpen(true);
        }}
        onOpenExportImport={() => setIsExportImportOpen(true)}
        allResumeVersions={allResumeVersions}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {/* Follow-up reminder alert banner */}
        <FollowUpBanner
          applications={applications}
          onSelectApp={handleOpenDetail}
          onQuickFollowUpDone={handleToggleFollowUpDone}
          onSnoozeFollowUp={handleSnoozeFollowUp}
        />

        {/* View Switcher Output */}
        {viewMode === 'board' && (
          <BoardView
            applications={filteredApplications}
            onSelectApp={handleOpenDetail}
            onEditApp={handleOpenEdit}
            onDeleteApp={handleRequestDelete}
            onStatusChange={handleStatusChange}
            onQuickAddInStatus={handleQuickAddInStatus}
          />
        )}

        {viewMode === 'table' && (
          <TableView
            applications={filteredApplications}
            filters={{
              ...filters,
              workModel: 'ALL',
              tag: 'ALL',
              followUpOnly: false,
            }}
            onFilterChange={(newFilters: any) => setFilters(newFilters)}
            onSelectApp={handleOpenDetail}
            onEditApp={handleOpenEdit}
            onDeleteApp={(id) => {
              const toDel = applications.find((a) => a.id === id);
              if (toDel) handleRequestDelete(toDel);
            }}
            onStatusChange={handleStatusChange}
            onToggleFollowUpDone={handleToggleFollowUpDone}
            onPreviewResume={handleOpenResumePreview}
          />
        )}

        {viewMode === 'schedule' && (
          <ScheduleView
            applications={filteredApplications}
            onSelectApp={handleOpenDetail}
            onEditApp={handleOpenEdit}
            onQuickFollowUpDone={handleToggleFollowUpDone}
          />
        )}

        {viewMode === 'analytics' && (
          <AnalyticsView applications={applications} />
        )}
      </main>

      {/* Modals & Slide-overs */}
      <ApplicationModal
        isOpen={isNewModalOpen}
        onClose={() => {
          setIsNewModalOpen(false);
          setEditingApp(null);
        }}
        onSave={handleSaveApplication}
        editingApp={editingApp}
        defaultStatus={modalDefaultStatus}
      />

      <ApplicationDetailDrawer
        app={selectedApp}
        isOpen={isDetailDrawerOpen}
        onClose={() => {
          setIsDetailDrawerOpen(false);
          setSelectedApp(null);
        }}
        onEdit={handleOpenEdit}
        onDelete={(id) => {
          const toDel = applications.find((a) => a.id === id);
          if (toDel) handleRequestDelete(toDel);
        }}
        onStatusChange={handleStatusChange}
        onUpdateApp={handleSaveApplication}
        onOpenEmailAssistant={handleOpenEmailAssistant}
        onOpenResumePreview={handleOpenResumePreview}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingApp(null);
        }}
        onConfirm={handleConfirmDelete}
        job={deletingApp}
      />

      <ResumePreviewModal
        isOpen={isPreviewResumeOpen}
        onClose={() => {
          setIsPreviewResumeOpen(false);
          setPreviewResumeApp(null);
        }}
        app={previewResumeApp}
        onUpdateApp={handleSaveApplication}
      />

      <EmailAssistantModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        application={emailModalApp}
      />

      <ExportImportModal
        isOpen={isExportImportOpen}
        onClose={() => setIsExportImportOpen(false)}
        applications={applications}
        onImportApplications={handleImportApplications}
        onResetToSampleData={handleResetToSampleData}
        onClearAllData={handleClearAllData}
      />
    </div>
  );
}
