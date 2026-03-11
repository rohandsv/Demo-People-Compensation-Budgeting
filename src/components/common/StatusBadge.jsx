import React from 'react';
import './StatusBadge.css';

const statusConfig = {
  approved: { label: 'Approved', class: 'badge-success' },
  pending: { label: 'Pending', class: 'badge-pending' },
  submitted: { label: 'Submitted', class: 'badge-info' },
  rejected: { label: 'Rejected', class: 'badge-danger' },
  modified: { label: 'Modified', class: 'badge-warning' },
  sent_back: { label: 'Sent Back', class: 'badge-warning' },
  draft: { label: 'Draft', class: 'badge-gray' },
  active: { label: 'Active', class: 'badge-success' },
  inactive: { label: 'Inactive', class: 'badge-gray' },
  completed: { label: 'Completed', class: 'badge-success' },
  in_progress: { label: 'In Progress', class: 'badge-info' },
  locked: { label: 'Locked', class: 'badge-primary' },
  synced: { label: 'Synced', class: 'badge-success' },
  error: { label: 'Error', class: 'badge-danger' },
  generated: { label: 'Generated', class: 'badge-success' },
  sent: { label: 'Sent', class: 'badge-info' },
  acknowledged: { label: 'Acknowledged', class: 'badge-success' },
  eligible: { label: 'Eligible', class: 'badge-success' },
  ineligible: { label: 'Ineligible', class: 'badge-gray' },
  board_approved: { label: 'Board Approved', class: 'badge-primary' },
  within_band: { label: 'Within Band', class: 'badge-success' },
  above_band: { label: 'Above Band', class: 'badge-warning' },
  below_band: { label: 'Below Band', class: 'badge-danger' },
};

const StatusBadge = ({ status, label, size = 'md' }) => {
  const config = statusConfig[status] || { label: label || status, class: 'badge-gray' };
  const displayLabel = label || config.label;

  return (
    <span className={`status-badge ${config.class} badge-${size}`}>
      {displayLabel}
    </span>
  );
};

export default StatusBadge;
