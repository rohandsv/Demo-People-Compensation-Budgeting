import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../data/constants';
import { employees } from '../../data/mockData';
import Card from '../common/Card';
import StatusBadge from '../common/StatusBadge';
import Modal from '../common/Modal';
import './Phase2.css';

const ActivateCycle = () => {
  const { cycle, setCycle, orgBudget, eligibilityRules, setPhaseStatus, addNotification } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [activating, setActivating] = useState(false);
  const [activated, setActivated] = useState(cycle.status === 'active');

  const eligibleCount = employees.filter(e => {
    if (eligibilityRules.excludedEmployees.includes(e.id)) return false;
    if (eligibilityRules.excludePIP && e.onPIP) return false;
    if (e.tenure < eligibilityRules.minTenure) return false;
    return eligibilityRules.includeStatuses.includes(e.status);
  }).length;

  const checks = [
    { label: 'Compensation cycle created', done: !!cycle.name },
    { label: 'Eligibility rules defined', done: eligibilityRules.minTenure >= 0 },
    { label: 'Salary bands configured', done: true },
    { label: 'Merit matrix set', done: true },
    { label: 'Budget guardrails configured', done: true },
    { label: 'Organisation budget approved', done: orgBudget.status === 'approved' || orgBudget.status === 'locked' },
  ];

  const allReady = checks.every(c => c.done);

  const handleActivate = () => {
    setActivating(true);
    setTimeout(() => {
      setCycle(p => ({ ...p, status: 'active' }));
      setPhaseStatus(p => ({ ...p, 2: 'completed', 3: 'in_progress' }));
      setActivated(true);
      setActivating(false);
      setShowModal(false);
      addNotification('success', `FY2025 cycle activated! ${eligibleCount} managers notified to begin planning.`);
    }, 1500);
  };

  return (
    <div className="phase2-section">
      <div className="two-col">
        <Card title="Activation Checklist" subtitle="All items must be complete to activate the cycle">
          <div className="approval-checklist">
            {checks.map((check, i) => (
              <div key={i} className="checklist-item">
                <div className={`checklist-dot ${check.done ? 'done' : ''}`}>
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

          {activated ? (
            <div className="locked-state" style={{ marginTop: 20 }}>
              <div className="lock-icon-wrap">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
              </div>
              <h3>Cycle Activated!</h3>
              <p>Managers have been notified to begin planning their team hikes.</p>
            </div>
          ) : (
            <button
              className="btn btn-success btn-lg"
              onClick={() => setShowModal(true)}
              disabled={!allReady || activating}
              style={{ width: '100%', justifyContent: 'center', marginTop: 20 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              Activate Cycle &amp; Notify Managers
            </button>
          )}
        </Card>

        <Card title="Cycle Summary" subtitle="Configuration preview before activation">
          <div className="cycle-status-display">
            <div className="cycle-status-row">
              <span>Cycle Name</span>
              <strong>{cycle.name}</strong>
            </div>
            <div className="cycle-status-row">
              <span>Type</span>
              <strong>{cycle.type}</strong>
            </div>
            <div className="cycle-status-row">
              <span>Status</span>
              <StatusBadge status={activated ? 'active' : cycle.status} />
            </div>
            <div className="cycle-status-row">
              <span>Total Budget</span>
              <strong>{formatINR(orgBudget.totalBudget)}</strong>
            </div>
            <div className="cycle-status-row">
              <span>Eligible Employees</span>
              <strong className="text-success">{eligibleCount} employees</strong>
            </div>
            <div className="cycle-status-row">
              <span>Submission Deadline</span>
              <strong className="text-warning">{cycle.submissionDeadline}</strong>
            </div>
            <div className="cycle-status-row">
              <span>Approval Levels</span>
              <strong>Manager → HR BP → Finance → CHRO</strong>
            </div>
          </div>
        </Card>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Activate Compensation Cycle"
        size="sm"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setShowModal(false)} disabled={activating}>Cancel</button>
            <button className="btn btn-success" onClick={handleActivate} disabled={activating}>
              {activating ? <span className="login-spinner"></span> : null}
              {activating ? 'Activating...' : 'Activate Now'}
            </button>
          </>
        }
      >
        <div className="confirm-modal-body">
          <div className="confirm-icon" style={{ background: '#dcfce7' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="2">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
          </div>
          <p>You are about to activate the <strong>{cycle.name}</strong> cycle.</p>
          <p><strong>{eligibleCount} managers</strong> will be notified to begin hike planning.</p>
          <p className="confirm-note">Deadline: {cycle.submissionDeadline}. Budget: {formatINR(orgBudget.totalBudget)}</p>
        </div>
      </Modal>
    </div>
  );
};

export default ActivateCycle;
