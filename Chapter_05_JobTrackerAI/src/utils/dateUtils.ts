export function formatDate(dateString?: string): string {
  if (!dateString) return 'Not set';
  try {
    const [year, month, day] = dateString.split('-').map(Number);
    if (!year || !month || !day) return dateString;
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function formatDateTime(isoString?: string): string {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

export function getTodayDateString(): string {
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, '0');
  const d = String(today.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function addDaysToDate(dateStr: string, days: number): string {
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    date.setDate(date.getDate() + days);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  } catch {
    return getTodayDateString();
  }
}

export function getDaysSinceApplied(dateApplied: string): number {
  if (!dateApplied) return 0;
  const today = new Date(getTodayDateString()).getTime();
  const applied = new Date(dateApplied).getTime();
  const diffTime = today - applied;
  return Math.max(0, Math.round(diffTime / (1000 * 60 * 60 * 24)));
}

export function formatDaysSinceApplied(dateApplied?: string): string {
  if (!dateApplied) return 'Date unknown';
  const days = getDaysSinceApplied(dateApplied);
  if (days === 0) return 'Applied today';
  if (days === 1) return 'Applied yesterday';
  return `${days} days ago`;
}

export type FollowUpUrgency = 'overdue' | 'today' | 'upcoming' | 'completed' | 'none';

export function getFollowUpStatus(followUpDate?: string, completed?: boolean): {
  urgency: FollowUpUrgency;
  label: string;
  daysDiff: number;
} {
  if (!followUpDate) {
    return { urgency: 'none', label: 'No follow-up set', daysDiff: 0 };
  }
  if (completed) {
    return { urgency: 'completed', label: 'Followed up', daysDiff: 0 };
  }

  const todayStr = getTodayDateString();
  const today = new Date(todayStr).getTime();
  const target = new Date(followUpDate).getTime();
  const diffTime = target - today;
  const daysDiff = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (daysDiff < 0) {
    const absDays = Math.abs(daysDiff);
    return {
      urgency: 'overdue',
      label: `Overdue by ${absDays} ${absDays === 1 ? 'day' : 'days'}`,
      daysDiff,
    };
  } else if (daysDiff === 0) {
    return { urgency: 'today', label: 'Follow-up due today', daysDiff: 0 };
  } else if (daysDiff <= 3) {
    return {
      urgency: 'upcoming',
      label: `Due in ${daysDiff} ${daysDiff === 1 ? 'day' : 'days'}`,
      daysDiff,
    };
  } else {
    return {
      urgency: 'upcoming',
      label: `Follow-up in ${daysDiff} days`,
      daysDiff,
    };
  }
}
