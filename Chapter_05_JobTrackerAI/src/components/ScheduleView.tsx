import React from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Building,
  User,
  ArrowRight,
  ExternalLink,
  Plus,
} from 'lucide-react';
import { JobApplication, InterviewRound } from '../types/job';
import { formatDate, formatDateTime, getFollowUpStatus } from '../utils/dateUtils';
import { StatusBadge } from './StatusBadge';

interface ScheduleViewProps {
  applications: JobApplication[];
  onSelectApp: (app: JobApplication) => void;
  onEditApp: (app: JobApplication) => void;
  onQuickFollowUpDone: (appId: string) => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  applications,
  onSelectApp,
  onEditApp,
  onQuickFollowUpDone,
}) => {
  // Aggregate all interview events
  const interviewEvents: Array<{
    app: JobApplication;
    interview: InterviewRound;
    date: string;
  }> = [];

  applications.forEach((app) => {
    app.interviews?.forEach((interview) => {
      interviewEvents.push({
        app,
        interview,
        date: interview.date,
      });
    });
  });

  // Sort upcoming interviews by date
  interviewEvents.sort((a, b) => (a.date > b.date ? 1 : -1));

  // Aggregate pending follow-ups
  const followUpEvents = applications
    .filter((a) => a.followUpDate && !a.followUpCompleted && a.status !== 'REJECTED' && a.status !== 'WITHDRAWN')
    .sort((a, b) => ((a.followUpDate || '') > (b.followUpDate || '') ? 1 : -1));

  return (
    <div className="space-y-6">
      {/* Top Banner / Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Scheduled Interviews Box */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">
                  Scheduled Interviews
                </h3>
                <p className="text-xs text-slate-400">
                  {interviewEvents.filter((i) => i.interview.status === 'SCHEDULED').length} upcoming rounds
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {interviewEvents.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">
                No interviews scheduled yet. As recruiters reach out, log interview dates in your application cards.
              </p>
            ) : (
              interviewEvents.map(({ app, interview }) => {
                const isScheduled = interview.status === 'SCHEDULED';
                return (
                  <div
                    key={interview.id}
                    className={`p-3.5 rounded-lg border transition-all ${
                      isScheduled
                        ? 'bg-slate-950 border-indigo-500/30 hover:border-indigo-500/50'
                        : 'bg-slate-950/60 border-slate-850 opacity-75'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-white">
                            {app.company}
                          </span>
                          <span className="text-xs text-slate-400">• {app.role}</span>
                        </div>
                        <h4 className="text-sm font-semibold text-indigo-400 mt-0.5">
                          {interview.title}
                        </h4>
                      </div>

                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          isScheduled
                            ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {interview.status}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                      <span className="flex items-center gap-1 font-medium text-slate-200">
                        <CalendarIcon className="w-3.5 h-3.5 text-indigo-400" />
                        {formatDate(interview.date)} {interview.time ? `at ${interview.time}` : ''}
                      </span>

                      {interview.interviewers && (
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-slate-500" />
                          {interview.interviewers}
                        </span>
                      )}

                      {interview.meetingLink && (
                        <a
                          href={interview.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-indigo-400 hover:underline"
                        >
                          <Video className="w-3.5 h-3.5" />
                          Meeting Link
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    {interview.notes && (
                      <div className="mt-2 text-xs bg-slate-900 p-2 rounded border border-slate-800 text-slate-300">
                        <strong className="text-slate-200">Prep / Notes:</strong> {interview.notes}
                      </div>
                    )}

                    <div className="mt-2.5 pt-2 border-t border-slate-800 flex justify-end">
                      <button
                        type="button"
                        onClick={() => onSelectApp(app)}
                        className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                      >
                        View Company Dossier <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Follow-up Reminders Timeline Box */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">
                  Follow-up Action Items
                </h3>
                <p className="text-xs text-slate-400">
                  {followUpEvents.length} pending application check-ins
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {followUpEvents.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">
                All caught up! No follow-up reminders pending.
              </p>
            ) : (
              followUpEvents.map((app) => {
                const followUp = getFollowUpStatus(app.followUpDate, app.followUpCompleted);
                return (
                  <div
                    key={app.id}
                    className="p-3.5 rounded-lg border border-slate-800 bg-slate-950 hover:border-slate-700 transition-all flex flex-col gap-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <button
                          type="button"
                          onClick={() => onSelectApp(app)}
                          className="font-bold text-sm text-white hover:text-indigo-400 text-left transition-colors"
                        >
                          {app.company}
                        </button>
                        <div className="text-xs text-slate-400 font-medium">
                          {app.role} • Applied {formatDate(app.dateApplied)}
                        </div>
                      </div>

                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          followUp.urgency === 'overdue'
                            ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                            : followUp.urgency === 'today'
                            ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {followUp.label}
                      </span>
                    </div>

                    {app.followUpNotes && (
                      <p className="text-xs text-slate-400 italic">
                        "{app.followUpNotes}"
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <CalendarIcon className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Due: {formatDate(app.followUpDate)}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onQuickFollowUpDone(app.id)}
                          className="font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 py-0.5 px-2 rounded hover:bg-emerald-500/10 transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Mark Done
                        </button>
                        <button
                          type="button"
                          onClick={() => onSelectApp(app)}
                          className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                          Open Draft
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
