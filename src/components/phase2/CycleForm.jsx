import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../common/Card';
import StatusBadge from '../common/StatusBadge';
import './Phase2.css';

const CycleForm = () => {
  const { cycle, setCycle, addNotification } = useApp();
  const [form, setForm] = useState({
    name: cycle.name,
    type: cycle.type,
    fy: 'FY2025-26',
    startDate: cycle.startDate,
    endDate: cycle.endDate,
    submissionDeadline: cycle.submissionDeadline,
    description: 'Annual increment cycle for all eligible employees for FY2025-26.',
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Cycle name is required';
    if (!form.startDate) errs.startDate = 'Start date is required';
    if (!form.endDate) errs.endDate = 'End date is required';
    if (form.startDate && form.endDate && form.startDate >= form.endDate) errs.endDate = 'End date must be after start date';
    if (!form.submissionDeadline) errs.submissionDeadline = 'Submission deadline is required';
    return errs;
  };

  const handleSave = (status) => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSaving(true);
    setTimeout(() => {
      setCycle(p => ({ ...p, ...form, status }));
      addNotification('success', `Cycle ${status === 'draft' ? 'saved as draft' : 'created'} successfully.`);
      setSaving(false);
      setErrors({});
    }, 600);
  };

  return (
    <div className="phase2-section">
      <div className="two-col">
        <Card title="Create Compensation Cycle" subtitle="Define the parameters for this increment cycle">
          <div className="form-group">
            <label className="form-label">Cycle Name *</label>
            <input
              className={`form-input ${errors.name ? 'error' : ''}`}
              value={form.name}
              onChange={e => { setForm(p => ({ ...p, name: e.target.value })); setErrors(p => ({ ...p, name: '' })); }}
              placeholder="e.g. FY2025 Annual Increment"
            />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          <div className="two-col">
            <div className="form-group">
              <label className="form-label">Cycle Type *</label>
              <select className="form-input" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                <option value="Annual">Annual</option>
                <option value="Half-Yearly">Half-Yearly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Off-Cycle">Off-Cycle</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Financial Year</label>
              <select className="form-input" value={form.fy} onChange={e => setForm(p => ({ ...p, fy: e.target.value }))}>
                <option value="FY2025-26">FY2025-26</option>
                <option value="FY2024-25">FY2024-25</option>
              </select>
            </div>
          </div>

          <div className="two-col">
            <div className="form-group">
              <label className="form-label">Cycle Start Date *</label>
              <input
                className={`form-input ${errors.startDate ? 'error' : ''}`}
                type="date"
                value={form.startDate}
                onChange={e => { setForm(p => ({ ...p, startDate: e.target.value })); setErrors(p => ({ ...p, startDate: '' })); }}
              />
              {errors.startDate && <span className="form-error">{errors.startDate}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Cycle End Date *</label>
              <input
                className={`form-input ${errors.endDate ? 'error' : ''}`}
                type="date"
                value={form.endDate}
                onChange={e => { setForm(p => ({ ...p, endDate: e.target.value })); setErrors(p => ({ ...p, endDate: '' })); }}
              />
              {errors.endDate && <span className="form-error">{errors.endDate}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Manager Submission Deadline *</label>
            <input
              className={`form-input ${errors.submissionDeadline ? 'error' : ''}`}
              type="date"
              value={form.submissionDeadline}
              onChange={e => { setForm(p => ({ ...p, submissionDeadline: e.target.value })); setErrors(p => ({ ...p, submissionDeadline: '' })); }}
            />
            {errors.submissionDeadline && <span className="form-error">{errors.submissionDeadline}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-input"
              rows={3}
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              placeholder="Describe the purpose and scope of this cycle..."
            />
          </div>

          <div className="form-actions">
            <button className="btn btn-secondary" onClick={() => handleSave('draft')} disabled={saving}>
              Save Draft
            </button>
            <button className="btn btn-primary" onClick={() => handleSave('active')} disabled={saving}>
              {saving ? 'Creating...' : 'Create Cycle'}
            </button>
          </div>
        </Card>

        <div>
          <Card title="Cycle Status" subtitle="Current configuration state">
            <div className="cycle-status-display">
              <div className="cycle-status-row">
                <span>Cycle ID</span>
                <code>{cycle.id}</code>
              </div>
              <div className="cycle-status-row">
                <span>Status</span>
                <StatusBadge status={cycle.status} />
              </div>
              <div className="cycle-status-row">
                <span>Type</span>
                <strong>{cycle.type}</strong>
              </div>
              <div className="cycle-status-row">
                <span>Duration</span>
                <strong>{cycle.startDate} — {cycle.endDate}</strong>
              </div>
              <div className="cycle-status-row">
                <span>Deadline</span>
                <strong className="text-warning">{cycle.submissionDeadline}</strong>
              </div>
            </div>
          </Card>

          <Card title="Cycle Timeline" className="mt-16">
            <div className="cycle-timeline">
              {[
                { label: 'Cycle Created', date: cycle.startDate, done: true },
                { label: 'Managers Notified', date: cycle.startDate, done: true },
                { label: 'Submission Deadline', date: cycle.submissionDeadline, done: false, warning: true },
                { label: 'HR Review', date: cycle.endDate, done: false },
                { label: 'Final Approval', date: cycle.endDate, done: false },
                { label: 'Payroll Effective', date: '2025-05-01', done: false },
              ].map((item, i) => (
                <div key={i} className={`timeline-item ${item.done ? 'done' : ''} ${item.warning ? 'warning' : ''}`}>
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <div className="timeline-label">{item.label}</div>
                    <div className="timeline-date">{item.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CycleForm;
