import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../data/constants';
import Card from '../common/Card';
import StatusBadge from '../common/StatusBadge';
import Modal from '../common/Modal';
import './Phase1.css';

const OrgBudgetForm = () => {
  const { orgBudget, updateOrgBudget, addNotification } = useApp();
  const [form, setForm] = useState({
    fy: orgBudget.fy,
    totalBudget: (orgBudget.totalBudget / 10000000).toFixed(2),
    description: orgBudget.description,
  });
  const [errors, setErrors] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const totalBudgetNum = parseFloat(form.totalBudget || 0) * 10000000;

  const validate = () => {
    const errs = {};
    if (!form.fy) errs.fy = 'Financial year is required';
    if (!form.totalBudget || isNaN(form.totalBudget) || parseFloat(form.totalBudget) <= 0) {
      errs.totalBudget = 'Enter a valid budget amount';
    }
    return errs;
  };

  const handleSave = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    updateOrgBudget({ fy: form.fy, totalBudget: totalBudgetNum, description: form.description, status: 'draft' });
    addNotification('success', 'Organisation budget saved as draft.');
    setErrors({});
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setShowConfirm(true);
  };

  const confirmSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      updateOrgBudget({ fy: form.fy, totalBudget: totalBudgetNum, description: form.description, status: 'submitted' });
      addNotification('info', 'Budget submitted for board review.');
      setSubmitting(false);
      setShowConfirm(false);
    }, 1000);
  };

  const handleApprove = () => {
    updateOrgBudget({ status: 'approved' });
    addNotification('success', 'Budget approved by board.');
  };

  const breakdowns = [
    { label: 'Merit/Hike', pct: orgBudget.meritSplit, amount: totalBudgetNum * orgBudget.meritSplit / 100, color: '#3b82f6' },
    { label: 'Variable Bonus', pct: orgBudget.variableSplit, amount: totalBudgetNum * orgBudget.variableSplit / 100, color: '#10b981' },
    { label: 'Benefits', pct: orgBudget.benefitsSplit, amount: totalBudgetNum * orgBudget.benefitsSplit / 100, color: '#f59e0b' },
  ];

  return (
    <div className="phase1-section">
      <div className="two-col">
        <Card title="Organisation Budget" subtitle="Set total compensation budget for the financial year">
          <div className="form-group">
            <label className="form-label">Financial Year *</label>
            <select
              className={`form-input ${errors.fy ? 'error' : ''}`}
              value={form.fy}
              onChange={e => { setForm(p => ({ ...p, fy: e.target.value })); setErrors(p => ({ ...p, fy: '' })); }}
            >
              <option value="FY2025-26">FY2025-26</option>
              <option value="FY2024-25">FY2024-25</option>
              <option value="FY2026-27">FY2026-27</option>
            </select>
            {errors.fy && <span className="form-error">{errors.fy}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Total Budget (in Crores INR) *</label>
            <div className="input-prefix-wrap">
              <span className="input-prefix">₹ Cr</span>
              <input
                className={`form-input with-prefix ${errors.totalBudget ? 'error' : ''}`}
                type="number"
                step="0.01"
                min="0"
                placeholder="e.g. 5.00"
                value={form.totalBudget}
                onChange={e => { setForm(p => ({ ...p, totalBudget: e.target.value })); setErrors(p => ({ ...p, totalBudget: '' })); }}
              />
            </div>
            {errors.totalBudget && <span className="form-error">{errors.totalBudget}</span>}
            {totalBudgetNum > 0 && (
              <p className="input-hint">= {formatINR(totalBudgetNum)}</p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Description / Notes</label>
            <textarea
              className="form-input"
              rows={3}
              placeholder="Budget purpose, scope, and notes..."
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            />
          </div>

          <div className="status-row">
            <div>
              <span className="form-label">Current Status: </span>
              <StatusBadge status={orgBudget.status} />
            </div>
          </div>

          <div className="form-actions">
            <button className="btn btn-secondary" onClick={handleSave}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
              </svg>
              Save Draft
            </button>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={orgBudget.status === 'approved'}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
              Submit for Board Review
            </button>
            {orgBudget.status === 'submitted' && (
              <button className="btn btn-success" onClick={handleApprove}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Mark as Board Approved
              </button>
            )}
          </div>
        </Card>

        <div>
          <Card title="Budget Preview" subtitle="Breakdown by compensation type">
            <div className="budget-preview">
              <div className="budget-total-display">
                <div className="budget-total-label">Total Budget</div>
                <div className="budget-total-value">{formatINR(totalBudgetNum)}</div>
                <div className="budget-total-fy">{form.fy}</div>
              </div>
              <div className="breakdown-list">
                {breakdowns.map((b, i) => (
                  <div key={i} className="breakdown-item">
                    <div className="breakdown-bar-row">
                      <span className="breakdown-label" style={{ color: b.color }}>{b.label}</span>
                      <span className="breakdown-pct">{b.pct}%</span>
                    </div>
                    <div className="breakdown-bar-bg">
                      <div className="breakdown-bar-fill" style={{ width: `${b.pct}%`, background: b.color }}></div>
                    </div>
                    <div className="breakdown-amount">{formatINR(b.amount)}</div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card title="Approval Status" className="mt-16">
            <div className="approval-checklist">
              {[
                { label: 'Budget Drafted', done: ['draft','submitted','approved'].includes(orgBudget.status) },
                { label: 'Submitted for Review', done: ['submitted','approved'].includes(orgBudget.status) },
                { label: 'Board Approved', done: orgBudget.status === 'approved' },
                { label: 'Published to Departments', done: orgBudget.status === 'approved' },
              ].map((item, i) => (
                <div key={i} className="checklist-item">
                  <div className={`checklist-dot ${item.done ? 'done' : ''}`}>
                    {item.done && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                  </div>
                  <span className={`checklist-label ${item.done ? 'done' : ''}`}>{item.label}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Modal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Submit Budget for Board Review"
        size="sm"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setShowConfirm(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={confirmSubmit} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Confirm Submit'}
            </button>
          </>
        }
      >
        <div className="confirm-modal-body">
          <div className="confirm-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
          </div>
          <p>You are about to submit the <strong>{form.fy}</strong> budget of <strong>{formatINR(totalBudgetNum)}</strong> for board review.</p>
          <p className="confirm-note">Once submitted, the budget will be reviewed by the board and locked upon approval.</p>
        </div>
      </Modal>
    </div>
  );
};

export default OrgBudgetForm;
