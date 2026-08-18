import React from 'react';

const STATUS_CONFIG = {
  Applied: {
    label: 'Applied',
    bg: 'bg-muted text-foreground border-border',
    dot: 'bg-muted-foreground',
  },
  'Under Review': {
    label: 'Under Review',
    bg: 'bg-muted text-foreground border-border',
    dot: 'bg-primary animate-pulse',
  },
  Shortlisted: {
    label: 'Shortlisted',
    bg: 'bg-primary/10 text-primary border-primary/20',
    dot: 'bg-primary',
  },
  'Interview Scheduled': {
    label: 'Interview Scheduled',
    bg: 'bg-primary/10 text-primary border-primary/20',
    dot: 'bg-primary',
  },
  'Interview Accepted': {
    label: 'Interview Confirmed',
    bg: 'bg-primary/15 text-primary border-primary/30 font-semibold',
    dot: 'bg-primary',
  },
  'Interview Rejected': {
    label: 'Interview Declined',
    bg: 'bg-destructive/10 text-destructive border-destructive/20',
    dot: 'bg-destructive',
  },
  'Interview Completed': {
    label: 'Interview Completed',
    bg: 'bg-muted text-foreground border-border',
    dot: 'bg-muted-foreground',
  },
  Selected: {
    label: 'Selected / Passed',
    bg: 'bg-primary/15 text-primary border-primary/30 font-semibold',
    dot: 'bg-primary',
  },
  'Offer Sent': {
    label: 'Offer Issued',
    bg: 'bg-primary text-primary-foreground border-primary font-semibold shadow-xs',
    dot: 'bg-white',
  },
  'Offer Accepted': {
    label: 'Offer Accepted (Hired 🎉)',
    bg: 'bg-primary/20 text-primary border-primary/40 font-bold tracking-tight',
    dot: 'bg-primary animate-ping',
  },
  'Offer Rejected': {
    label: 'Offer Declined',
    bg: 'bg-destructive/10 text-destructive border-destructive/20',
    dot: 'bg-destructive',
  },
  Rejected: {
    label: 'Rejected',
    bg: 'bg-destructive/10 text-destructive border-destructive/20',
    dot: 'bg-destructive',
  },
};

const StatusBadge = ({ status = 'Applied', className = '', size = 'md' }) => {
  const config = STATUS_CONFIG[status] || {
    label: status,
    bg: 'bg-muted text-muted-foreground border-border',
    dot: 'bg-muted-foreground',
  };

  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-[11px]'
      : size === 'lg'
      ? 'px-3.5 py-1.5 text-sm font-semibold'
      : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium transition-colors ${config.bg} ${sizeClasses} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${config.dot}`} />
      {config.label}
    </span>
  );
};

export default StatusBadge;
