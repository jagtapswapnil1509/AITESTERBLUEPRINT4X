import React from 'react';
import { ApplicationStatus } from '../types/job';
import { STATUS_CONFIGS } from '../utils/constants';

interface StatusBadgeProps {
  status: ApplicationStatus;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
  className?: string;
  onClick?: () => void;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showDot = true,
  className = '',
  onClick,
}) => {
  const config = STATUS_CONFIGS[status] || STATUS_CONFIGS.APPLIED;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-medium',
    lg: 'text-sm px-3 py-1.5 font-semibold',
  }[size];

  return (
    <span
      id={`status-badge-${status.toLowerCase()}`}
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border transition-colors ${config.badgeBg} ${config.badgeText} ${config.badgeBorder} ${sizeClasses} ${
        onClick ? 'cursor-pointer hover:opacity-85' : ''
      } ${className}`}
      title={config.description}
    >
      {showDot && (
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ backgroundColor: config.color }}
        />
      )}
      <span className="truncate whitespace-nowrap">{config.label}</span>
    </span>
  );
};
