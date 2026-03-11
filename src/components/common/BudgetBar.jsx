import React from 'react';
import { formatINR } from '../../data/constants';
import './BudgetBar.css';

const BudgetBar = ({ consumed, total, label = 'Budget Utilization', showWarning = true }) => {
  if (!total) return null;
  const pct = Math.min((consumed / total) * 100, 100);
  const remaining = total - consumed;

  let colorClass = 'budget-bar-fill-green';
  let statusLabel = 'Healthy';
  let statusClass = 'budget-status-ok';

  if (pct >= 90) {
    colorClass = 'budget-bar-fill-red';
    statusLabel = 'Critical';
    statusClass = 'budget-status-danger';
  } else if (pct >= 70) {
    colorClass = 'budget-bar-fill-yellow';
    statusLabel = 'Caution';
    statusClass = 'budget-status-warn';
  }

  return (
    <div className="budget-bar-wrap">
      <div className="budget-bar-header">
        <span className="budget-bar-label">{label}</span>
        <div className="budget-bar-header-right">
          <span className={`budget-status-chip ${statusClass}`}>{statusLabel}</span>
          <span className="budget-bar-pct">{pct.toFixed(1)}%</span>
        </div>
      </div>
      <div className="budget-bar-track">
        <div
          className={`budget-bar-fill ${colorClass}`}
          style={{ width: `${pct}%` }}
        >
          {pct > 12 && (
            <span className="budget-bar-pct-inner">{pct.toFixed(0)}%</span>
          )}
        </div>
      </div>
      <div className="budget-bar-footer">
        <div className="budget-bar-stat">
          <span className="budget-bar-stat-label">Consumed</span>
          <span className="budget-bar-stat-value consumed">{formatINR(consumed)}</span>
        </div>
        <div className="budget-bar-stat center">
          <span className="budget-bar-stat-label">Total Budget</span>
          <span className="budget-bar-stat-value">{formatINR(total)}</span>
        </div>
        <div className="budget-bar-stat right">
          <span className="budget-bar-stat-label">Remaining</span>
          <span className={`budget-bar-stat-value ${remaining < 0 ? 'danger' : 'remaining'}`}>
            {formatINR(Math.abs(remaining))}{remaining < 0 ? ' over' : ''}
          </span>
        </div>
      </div>
      {showWarning && pct >= 90 && (
        <div className="budget-bar-warning">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          {pct >= 100
            ? 'Budget exceeded! New proposals are blocked.'
            : 'Budget at 90%+ — additional proposals require approval.'}
        </div>
      )}
    </div>
  );
};

export default BudgetBar;
