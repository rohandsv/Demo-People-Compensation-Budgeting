import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../data/constants';
import Card from '../common/Card';
import StatusBadge from '../common/StatusBadge';
import Modal from '../common/Modal';
import './Phase1.css';

const BudgetLock = () => {
  const { orgBudget, departments, addNotification, setPhaseStatus, updateOrgBudget } = useApp();
  const [showLockModal, setShowLockModal] = useState(false);
  const [locked, setLocked] = useState(false);
  const [locking, setLocking] = useState(false);

  const checks = [
    { label: 'Organisation budget defined', done: orgBudget.totalBudget > 0 },
    { label: 'Board approval received', done: orgBudget.status === 'approved' },
    { label: 'All departments allocated', done: departments.every(d => d.budgetAllocated > 0) },
    { label: 'Allocation balanced (100%)', done: Math.abs(departments.reduce((s, d) => s + d.budgetAllocated, 0) - orgBudget.totalBudget) < 1000 },
    { label: 'Compensation type split defined', done: orgBudget.meritSplit + orgBudget.variableSplit + orgBudget.benefitsSplit === 100 },
  ];

  const allChecked = checks.every(c => c.done);
  const canLock = allChecked && !locked;

  const handleLock = () => {
    setLocking(true);
    setTimeout(() => {
      setLocked(true);
      setLocking(false);
      setShowLockModal(false);
      updateOrgBudget({ status: 'locked' });
      setPhaseStatus(p => ({ ...p, 1: 'completed', 2: 'in_progress' }));
      addNotification('success', 'Phase 1: Budget Setup locked and published to department managers.');
    }, 1200);
  };

  return (
    <div className="phase1-section">
      <div className="two-col">
        <Card title="Pre-Publish Checklist" subtitle="All items must be complete before locking">
          <div className="approval-checklist">
            {checks.map((check, i) => (
              <div key={i} className="checklist-item">
                <div className={`checklist-dot ${check.done ? 'done' : 'pending'}`}>
                  {check.done ? (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  ) : (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  )}
                </div>
                <span className={`checklist-label ${check.done ? 'done' : ''}`}>{check.label}</span>
                <StatusBadge status={check.done ? 'completed' : 'pending'} size="sm" />
              </div>
            ))}
          </div>

          <div className="lock-action-area">
            {locked ? (
              <div className="locked-state">
                <div className="lock-icon-wrap">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
                <h3>Budget Locked & Published</h3>
                <p>Phase 1 is complete. Department managers have been notified.</p>
              </div>
            ) : (
              <>
                {!allChecked && (
                  <div className="budget-alert">
                    Complete all checklist items before locking and publishing.
                  </div>
                )}
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => setShowLockModal(true)}
                  disabled={!canLock}
                  style={{ width: '100%', justifyContent: 'center', marginTop: 16 }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  Lock &amp; Publish Budget
                </button>
              </>
            )}
          </div>
        </Card>

        <Card title="Budget Summary" subtitle="Review before locking">
          <div className="lock-summary">
            <div className="summary-row">
              <span>Financial Year</span>
              <strong>{orgBudget.fy}</strong>
            </div>
            <div className="summary-row">
              <span>Total Budget</span>
              <strong>{formatINR(orgBudget.totalBudget)}</strong>
            </div>
            <div className="summary-row">
              <span>Status</span>
              <StatusBadge status={locked ? 'locked' : orgBudget.status} />
            </div>
            <div className="divider"></div>
            {departments.map(dept => (
              <div key={dept.id} className="summary-row">
                <span>{dept.name}</span>
                <strong>{formatINR(dept.budgetAllocated)}</strong>
              </div>
            ))}
            <div className="divider"></div>
            <div className="summary-row">
              <span>Merit/Hike ({orgBudget.meritSplit}%)</span>
              <strong>{formatINR(orgBudget.totalBudget * orgBudget.meritSplit / 100)}</strong>
            </div>
            <div className="summary-row">
              <span>Variable Bonus ({orgBudget.variableSplit}%)</span>
              <strong>{formatINR(orgBudget.totalBudget * orgBudget.variableSplit / 100)}</strong>
            </div>
            <div className="summary-row">
              <span>Benefits ({orgBudget.benefitsSplit}%)</span>
              <strong>{formatINR(orgBudget.totalBudget * orgBudget.benefitsSplit / 100)}</strong>
            </div>
          </div>
        </Card>
      </div>

      <Modal
        isOpen={showLockModal}
        onClose={() => setShowLockModal(false)}
        title="Lock & Publish Budget"
        size="sm"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setShowLockModal(false)} disabled={locking}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleLock} disabled={locking}>
              {locking ? (
                <span className="login-spinner"></span>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              )}
              {locking ? 'Locking...' : 'Confirm Lock & Publish'}
            </button>
          </>
        }
      >
        <div className="confirm-modal-body">
          <div className="confirm-icon warning">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#92400e" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <p>You are about to <strong>lock</strong> the {orgBudget.fy} budget of <strong>{formatINR(orgBudget.totalBudget)}</strong>.</p>
          <p className="confirm-note">Once locked, budget figures cannot be changed. Department managers will be notified to begin Phase 2.</p>
        </div>
      </Modal>
    </div>
  );
};

export default BudgetLock;
