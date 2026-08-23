import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Target,
  Award,
  Clock,
  Briefcase,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Percent,
  Layers,
  Sparkles,
} from 'lucide-react';
import { JobApplication } from '../types/job';
import { STATUS_CONFIGS, WORK_MODEL_LABELS } from '../utils/constants';
import { getDaysSinceApplied } from '../utils/dateUtils';

interface AnalyticsViewProps {
  applications: JobApplication[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ applications }) => {
  const total = applications.length;

  if (total === 0) {
    return (
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-12 text-center">
        <BarChart3 className="w-12 h-12 text-slate-700 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-200">
          No Application Data Yet
        </h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
          Add your job applications to see automatic conversion rates, response timelines, and search momentum metrics.
        </p>
      </div>
    );
  }

  // Pipeline Counts
  const wishlistCount = applications.filter((a) => a.status === 'WISHLIST').length;
  const appliedCount = applications.filter((a) => a.status !== 'WISHLIST').length; // Actually submitted
  const screeningCount = applications.filter(
    (a) => a.status === 'SCREENING' || a.status === 'ASSESSMENT' || a.status === 'INTERVIEW' || a.status === 'OFFER'
  ).length;
  const interviewCount = applications.filter(
    (a) => a.status === 'INTERVIEW' || a.status === 'OFFER'
  ).length;
  const offerCount = applications.filter((a) => a.status === 'OFFER').length;
  const rejectedCount = applications.filter((a) => a.status === 'REJECTED').length;
  const activeCount = applications.filter(
    (a) => a.status !== 'REJECTED' && a.status !== 'WITHDRAWN'
  ).length;

  // Conversion rates (safely calculated)
  const responseRate = appliedCount > 0 ? Math.round(((screeningCount + rejectedCount) / appliedCount) * 100) : 0;
  const interviewRate = appliedCount > 0 ? Math.round((screeningCount / appliedCount) * 100) : 0;
  const offerRate = screeningCount > 0 ? Math.round((offerCount / screeningCount) * 100) : 0;

  // Average days since applied
  const avgDays = Math.round(
    applications.reduce((acc, curr) => acc + getDaysSinceApplied(curr.dateApplied), 0) / total
  );

  // Work model counts
  const remoteCount = applications.filter((a) => a.workModel === 'REMOTE').length;
  const hybridCount = applications.filter((a) => a.workModel === 'HYBRID').length;
  const onsiteCount = applications.filter((a) => a.workModel === 'ONSITE').length;

  // Tag frequency
  const tagCounts: Record<string, number> = {};
  applications.forEach((app) => {
    app.tags?.forEach((t) => {
      tagCounts[t] = (tagCounts[t] || 0) + 1;
    });
  });
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const funnelStages = [
    { label: 'Applications Submitted', count: appliedCount, color: 'bg-indigo-500', pct: 100 },
    {
      label: 'Recruiter Screening / Assessment',
      count: screeningCount,
      color: 'bg-purple-500',
      pct: appliedCount > 0 ? Math.round((screeningCount / appliedCount) * 100) : 0,
    },
    {
      label: 'Technical / Panel Interviews',
      count: interviewCount,
      color: 'bg-amber-500',
      pct: appliedCount > 0 ? Math.round((interviewCount / appliedCount) * 100) : 0,
    },
    {
      label: 'Official Offers',
      count: offerCount,
      color: 'bg-emerald-500',
      pct: appliedCount > 0 ? Math.round((offerCount / appliedCount) * 100) : 0,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Key Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Total Logged</span>
            <Briefcase className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            {total}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {activeCount} active in current pipeline
          </div>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Interview Rate</span>
            <Target className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            {interviewRate}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {screeningCount} converted from {appliedCount} applied
          </div>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Offer Conversion</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">
            {offerCount} {offerCount === 1 ? 'Offer' : 'Offers'}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {offerRate}% of screens turned into offers
          </div>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Avg Application Age</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            {avgDays} <span className="text-sm font-normal text-slate-400">days</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Average time across all applications
          </div>
        </div>
      </div>

      {/* Conversion Funnel Breakdown */}
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              Application Pipeline Funnel
            </h3>
            <p className="text-xs text-slate-400">
              Visualizing how your applications progress through the hiring stages.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {funnelStages.map((stage) => (
            <div key={stage.label} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300">
                  {stage.label}
                </span>
                <span className="font-bold text-slate-100">
                  {stage.count} ({stage.pct}%)
                </span>
              </div>
              <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden flex">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${stage.color}`}
                  style={{ width: `${Math.max(stage.pct, stage.count > 0 ? 3 : 0)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Stats: Work Models & Top Tags */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Work Model Distribution */}
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-xs">
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">
            Work Preference Breakdown
          </h4>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1 text-slate-300">
                <span>Remote ({remoteCount})</span>
                <span>{total > 0 ? Math.round((remoteCount / total) * 100) : 0}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-500 h-full rounded-full"
                  style={{ width: `${total > 0 ? (remoteCount / total) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1 text-slate-300">
                <span>Hybrid ({hybridCount})</span>
                <span>{total > 0 ? Math.round((hybridCount / total) * 100) : 0}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-sky-500 h-full rounded-full"
                  style={{ width: `${total > 0 ? (hybridCount / total) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1 text-slate-300">
                <span>On-site ({onsiteCount})</span>
                <span>{total > 0 ? Math.round((onsiteCount / total) * 100) : 0}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-slate-600 h-full rounded-full"
                  style={{ width: `${total > 0 ? (onsiteCount / total) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Top Tags & Categories */}
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-xs">
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">
            Top Application Tags & Niches
          </h4>
          {topTags.length === 0 ? (
            <p className="text-xs text-slate-500 py-4">No custom tags added yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2 pt-1">
              {topTags.map(([tag, count]) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 text-xs font-medium text-slate-300 border border-slate-700"
                >
                  <span>#{tag}</span>
                  <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-bold">
                    {count}
                  </span>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
