import React from 'react';
import { PriorityLevel } from '../types/job';
import { PRIORITY_CONFIGS } from '../utils/constants';

interface PriorityBadgeProps {
  priority: PriorityLevel;
  size?: 'sm' | 'md';
  className?: string;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  size = 'md',
  className = '',
}) => {
  const config = PRIORITY_CONFIGS[priority] || PRIORITY_CONFIGS.MEDIUM;
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-0.5';

  return (
    <span
      id={`priority-badge-${priority.toLowerCase()}`}
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${config.badgeBg} ${sizeClasses} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
      <span>{config.label.replace(' Priority', '')}</span>
    </span>
  );
};
