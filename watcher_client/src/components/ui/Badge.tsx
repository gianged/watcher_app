import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'open'
    | 'in-progress'
    | 'resolved'
    | 'closed'
    | 'rejected'
    | 'pending-review';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Badge({ children, variant = 'primary', size = 'md', className = '' }: BadgeProps) {
  const sizeClass = size !== 'md' ? `badge-${size}` : '';

  // Map status to badge variant
  const variantMap: Record<string, string> = {
    'OPEN': 'open',
    'IN_PROGRESS': 'in-progress',
    'PENDING_REVIEW': 'warning',
    'RESOLVED': 'resolved',
    'CLOSED': 'closed',
    'REJECTED': 'rejected',
    'LOW': 'info',
    'MEDIUM': 'warning',
    'HIGH': 'danger',
    'CRITICAL': 'rejected',
  };

  const mappedVariant = variantMap[variant as string] || variant;

  return (
    <span className={`badge badge-${mappedVariant} ${sizeClass} ${className}`}>
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const statusLabels: Record<string, string> = {
    OPEN: 'Open',
    IN_PROGRESS: 'In Progress',
    PENDING_REVIEW: 'Pending Review',
    RESOLVED: 'Resolved',
    CLOSED: 'Closed',
    REJECTED: 'Rejected',
  };

  return <Badge variant={status as any}>{statusLabels[status] || status}</Badge>;
}

export function PriorityBadge({ priority }: { priority: string }) {
  const priorityLabels: Record<string, string> = {
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: 'High',
    CRITICAL: 'Critical',
  };

  return <Badge variant={priority as any}>{priorityLabels[priority] || priority}</Badge>;
}
