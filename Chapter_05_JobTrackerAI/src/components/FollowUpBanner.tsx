import React from 'react';
import { Bell, CheckCircle2, Clock, Calendar, AlertTriangle, ArrowRight } from 'lucide-react';
import { JobApplication } from '../types/job';
import { getFollowUpStatus, addDaysToDate, getTodayDateString } from '../utils/dateUtils';

interface FollowUpBannerProps {
  applications: JobApplication[];
  onSelectApp: (app: JobApplication) => void;
  onQuickFollowUpDone: (appId: string) => void;
  onSnoozeFollowUp: (appId: string, days: number) => void;
}

export const FollowUpBanner: React.FC<FollowUpBannerProps> = ({
  applications,
  onSelectApp,
  onQuickFollowUpDone,
  onSnoozeFollowUp,
}) => {
  // Find overdue and due today items
  const followUpItems = applications
    .filter((app) => app.followUpDate && !app.followUpCompleted && app.status !== 'REJECTED' && app.status !== 'WITHDRAWN')
    .map((app) => {
      const status = getFollowUpStatus(app.followUpDate, app.followUpCompleted);
      return { app, ...status };
    })
    .filter((item) => item.urgency === 'overdue' || item.urgency === 'today' || (item.urgency === 'upcoming' && item.daysDiff <= 2))
    .sort((a, b) => a.daysDiff - b.daysDiff);

  if (followUpItems.length === 0) {
    return null;
  }

  const overdueCount = followUpItems.filter((i) => i.urgency === 'overdue').length;
  const todayCount = followUpItems.filter((i) => i.urgency === 'today').length;

  return (
    <div
      id="followup-alert-banner"
      className="mb-6 rounded-xl border border-slate-800 bg-slate-900/90 p-4 shadow-sm"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
            <Bell className="w-4 h-4 animate-bounce" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              Follow-up Action Reminders
              {overdueCount > 0 && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20">
                  {overdueCount} overdue
                </span>
              )}
              {todayCount > 0 && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  {todayCount} due today
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400">
              Timely follow-ups boost interview callback rates by up to 30%. Check in on these pending applications:
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {followUpItems.slice(0, 6).map(({ app, urgency, label }) => (
          <div
            key={app.id}
            id={`followup-item-${app.id}`}
            className="flex flex-col justify-between bg-slate-950 p-3 rounded-lg border border-slate-800 shadow-xs hover:border-slate-700 transition-colors"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <button
                type="button"
                onClick={() => onSelectApp(app)}
                className="text-left group flex-1"
              >
                <div className="font-semibold text-xs text-slate-200 group-hover:text-indigo-400 flex items-center gap-1">
                  <span className="truncate">{app.company}</span>
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </div>
                <div className="text-xs text-slate-400 truncate">
                  {app.role}
                </div>
              </button>

              <span
                className={`text-[11px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 flex items-center gap-1 ${
                  urgency === 'overdue'
                    ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                    : urgency === 'today'
                    ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                    : 'bg-slate-800 text-slate-300 border border-slate-700'
                }`}
              >
                {urgency === 'overdue' && <AlertTriangle className="w-3 h-3" />}
                {urgency === 'today' && <Clock className="w-3 h-3" />}
                {urgency === 'upcoming' && <Calendar className="w-3 h-3" />}
                {label}
              </span>
            </div>

            {app.followUpNotes && (
              <p className="text-[11px] text-slate-300 line-clamp-1 italic mb-2.5">
                "{app.followUpNotes}"
              </p>
            )}

            <div className="flex items-center justify-between gap-1 pt-1.5 border-t border-slate-850">
              <button
                type="button"
                id={`btn-done-${app.id}`}
                onClick={() => onQuickFollowUpDone(app.id)}
                className="text-[11px] font-medium text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 py-1 px-1.5 rounded hover:bg-emerald-500/10 transition-colors"
                title="Mark this follow-up as done"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Done
              </button>

              <div className="flex items-center gap-1 text-[11px] text-slate-400">
                <span>Snooze:</span>
                <button
                  type="button"
                  onClick={() => onSnoozeFollowUp(app.id, 3)}
                  className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-750 text-slate-300 font-medium transition-colors border border-slate-700"
                  title="Snooze 3 days"
                >
                  +3d
                </button>
                <button
                  type="button"
                  onClick={() => onSnoozeFollowUp(app.id, 7)}
                  className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-750 text-slate-300 font-medium transition-colors border border-slate-700"
                  title="Snooze 7 days (1 week)"
                >
                  +1w
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
