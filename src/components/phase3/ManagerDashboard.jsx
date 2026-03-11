import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR, PERF_STARS } from '../../data/constants';
import { isEligible } from '../../data/mockData';
import BudgetBar from '../common/BudgetBar';
import StatusBadge from '../common/StatusBadge';
import Modal from '../common/Modal';
import Pagination from '../common/Pagination';
import './Phase3.css';

const ManagerDashboard = () => {
  const {
    employees, hikeProposals, departments, orgBudget,
    updateHike, submitProposal, getDeptBudgetUsed, getTotalBudgetUsed,
    cycle, addNotification, currentUser
  } = useApp();

  const [selectedDept, setSelectedDept] = useState('IT');
  const [overallComment, setOverallComment] = useState('');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'name', dir: 'asc' });
  const [filterEligible, setFilterEligible] = useState(false);
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const deptEmployees = employees.filter(e => e.dept === selectedDept);
  const dept = departments.find(d => d.id === selectedDept);
  const deptBudgetUsed = getDeptBudgetUsed(selectedDept);
  const deptBudgetTotal = dept?.budgetAllocated || 0;
  const deptBudgetPct = deptBudgetTotal > 0 ? (deptBudgetUsed / deptBudgetTotal) * 100 : 0;

  const handleHikeChange = (empId, value, justification) => {
    updateHike(empId, value, justification);
  };

  const handleSubmit = () => {
    const eligibleIds = deptEmployees
      .filter(e => hikeProposals[e.id]?.eligible)
      .map(e => e.id);
    submitProposal(eligibleIds, overallComment);
    setSubmitted(true);
    setShowSubmitModal(false);
  };

  const displayedEmps = filterEligible
    ? deptEmployees.filter(e => hikeProposals[e.id]?.eligible)
    : deptEmployees;

  const sortedEmps = [...displayedEmps].sort((a, b) => {
    let aV = a[sortConfig.key], bV = b[sortConfig.key];
    if (sortConfig.key === 'proposedHike') { aV = hikeProposals[a.id]?.proposedHike || 0; bV = hikeProposals[b.id]?.proposedHike || 0; }
    if (sortConfig.key === 'newCTC') { aV = a.currentCTC * (1 + (hikeProposals[a.id]?.proposedHike || 0) / 100); bV = b.currentCTC * (1 + (hikeProposals[b.id]?.proposedHike || 0) / 100); }
    if (typeof aV === 'number') return sortConfig.dir === 'asc' ? aV - bV : bV - aV;
    return sortConfig.dir === 'asc' ? String(aV).localeCompare(String(bV)) : String(bV).localeCompare(String(aV));
  });

  const handleSort = (key) => {
    setSortConfig(p => ({ key, dir: p.key === key && p.dir === 'asc' ? 'desc' : 'asc' }));
    setPage(1);
  };

  const paginatedEmps = sortedEmps.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const submittedCount = deptEmployees.filter(e => ['submitted', 'approved'].includes(hikeProposals[e.id]?.status)).length;
  const eligibleCount = deptEmployees.filter(e => hikeProposals[e.id]?.eligible).length;

  // Countdown days
  const deadline = new Date(cycle.submissionDeadline);
  const today = new Date('2025-04-10');
  const daysLeft = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));

  return (
    <div className="phase3-dashboard">
      {/* Dept selector */}
      <div className="dept-selector">
        {departments.map(d => (
          <button
            key={d.id}
            className={`dept-btn ${selectedDept === d.id ? 'active' : ''}`}
            onClick={() => setSelectedDept(d.id)}
          >
            {d.id}
            <span className="dept-btn-count">{employees.filter(e => e.dept === d.id).length}</span>
          </button>
        ))}
      </div>

      {/* Budget tracker cards */}
      <div className="stats-grid" style={{ marginBottom: 16 }}>
        <div className="stat-card stat-card-primary">
          <div className="stat-card-top">
            <div className="stat-card-info">
              <span className="stat-card-label">Dept Budget</span>
              <span className="stat-card-value">{formatINR(deptBudgetTotal)}</span>
              <span className="stat-card-sub">{selectedDept} allocation</span>
            </div>
            <div className="stat-card-icon stat-icon-primary">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
          </div>
        </div>
        <div className="stat-card stat-card-warning">
          <div className="stat-card-top">
            <div className="stat-card-info">
              <span className="stat-card-label">Consumed</span>
              <span className="stat-card-value">{formatINR(deptBudgetUsed)}</span>
              <span className="stat-card-sub">{deptBudgetPct.toFixed(1)}% utilized</span>
            </div>
            <div className="stat-card-icon stat-icon-warning">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
              </svg>
            </div>
          </div>
        </div>
        <div className="stat-card stat-card-success">
          <div className="stat-card-top">
            <div className="stat-card-info">
              <span className="stat-card-label">Remaining</span>
              <span className="stat-card-value" style={{ color: deptBudgetUsed > deptBudgetTotal ? 'var(--danger)' : 'inherit' }}>
                {formatINR(Math.abs(deptBudgetTotal - deptBudgetUsed))}
              </span>
              <span className="stat-card-sub">{deptBudgetUsed > deptBudgetTotal ? 'over budget' : 'available'}</span>
            </div>
            <div className="stat-card-icon stat-icon-success">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
            </div>
          </div>
        </div>
        <div className={`stat-card ${daysLeft <= 3 ? 'stat-card-danger' : daysLeft <= 7 ? 'stat-card-warning' : 'stat-card-teal'}`}>
          <div className="stat-card-top">
            <div className="stat-card-info">
              <span className="stat-card-label">Days Left</span>
              <span className="stat-card-value">{daysLeft}</span>
              <span className="stat-card-sub">Deadline: {cycle.submissionDeadline}</span>
            </div>
            <div className={`stat-card-icon ${daysLeft <= 3 ? 'stat-icon-danger' : 'stat-icon-teal'}`}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="budget-bar-container" style={{ marginBottom: 20 }}>
        <BudgetBar consumed={deptBudgetUsed} total={deptBudgetTotal} label={`${dept?.name || selectedDept} Budget Utilization`} />
      </div>

      {/* Employee table */}
      <div className="employee-table-section">
        <div className="section-header">
          <div>
            <div className="section-title">Employee Hike Planning — {dept?.name}</div>
            <div className="section-subtitle">{eligibleCount} eligible · {submittedCount} submitted</div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <label className="checkbox-item" style={{ fontSize: 12, gap: 6 }}>
              <input type="checkbox" checked={filterEligible} onChange={e => setFilterEligible(e.target.checked)} />
              Eligible only
            </label>
          </div>
        </div>

        <div className="hike-table-wrap">
          <table className="hike-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('name')} className="sortable-th">Employee</th>
                <th>Grade</th>
                <th className="sortable-th text-right" onClick={() => handleSort('currentCTC')}>Current CTC</th>
                <th className="text-center">Performance</th>
                <th className="text-right">Compa-Ratio</th>
                <th className="sortable-th text-right" onClick={() => handleSort('proposedHike')}>Suggested %</th>
                <th className="text-right">Your Hike %</th>
                <th className="text-right sortable-th" onClick={() => handleSort('newCTC')}>New CTC</th>
                <th className="text-right">Cost Impact</th>
                <th>Justification</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEmps.map(emp => {
                const proposal = hikeProposals[emp.id];
                const eligible = proposal?.eligible;
                const proposedHike = proposal?.proposedHike || 0;
                const suggestedHike = proposal?.suggestedHike || 0;
                const newCTC = emp.currentCTC * (1 + proposedHike / 100);
                const costImpact = newCTC - emp.currentCTC;
                const isOverride = proposedHike > suggestedHike + 1;
                const isSubmitted = ['submitted', 'approved'].includes(proposal?.status);

                return (
                  <tr key={emp.id} className={`${!eligible ? 'row-disabled' : ''} ${isOverride && eligible ? 'row-warning' : ''}`}>
                    <td>
                      <div className="emp-name-cell">
                        <div className="emp-avatar-sm">{emp.name.charAt(0)}</div>
                        <div>
                          <div className="emp-name">{emp.name}</div>
                          <div className="emp-meta text-small text-muted">{emp.empId} · {emp.location}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="grade-badge-sm">{emp.grade}</span></td>
                    <td className="text-right font-bold">{formatINR(emp.currentCTC)}</td>
                    <td className="text-center">
                      <span className="perf-stars">{PERF_STARS[emp.performanceRating]}</span>
                    </td>
                    <td className="text-right">
                      <span className={`compa-ratio ${emp.compaRatio < 0.85 ? 'low' : emp.compaRatio > 1.0 ? 'high' : 'mid'}`}>
                        {emp.compaRatio.toFixed(2)}
                      </span>
                    </td>
                    <td className="text-right">
                      <span className="suggested-hike">{suggestedHike.toFixed(1)}%</span>
                    </td>
                    <td className="text-right">
                      {!eligible ? (
                        <span className="text-muted text-small">N/A — {proposal?.ineligibleReason}</span>
                      ) : (
                        <div className="hike-input-wrap">
                          <input
                            className={`hike-input ${isOverride ? 'override' : ''}`}
                            type="number"
                            min="0"
                            max="50"
                            step="0.5"
                            value={proposedHike}
                            disabled={isSubmitted}
                            onChange={e => handleHikeChange(emp.id, e.target.value)}
                          />
                          <span>%</span>
                          {isOverride && <span className="override-flag" title="Above suggested range">⚑</span>}
                        </div>
                      )}
                    </td>
                    <td className="text-right">
                      {eligible ? (
                        <span className="new-ctc">{formatINR(newCTC)}</span>
                      ) : <span className="text-muted">—</span>}
                    </td>
                    <td className="text-right">
                      {eligible ? (
                        <span className="cost-impact">+{formatINR(costImpact)}</span>
                      ) : <span className="text-muted">—</span>}
                    </td>
                    <td>
                      {eligible && (
                        <input
                          className="justification-input"
                          type="text"
                          placeholder={isOverride ? 'Required for override' : 'Optional note'}
                          value={proposal?.justification || ''}
                          disabled={isSubmitted}
                          onChange={e => handleHikeChange(emp.id, proposedHike, e.target.value)}
                        />
                      )}
                    </td>
                    <td>
                      <StatusBadge status={eligible ? (proposal?.status || 'pending') : 'ineligible'} size="sm" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <Pagination
          totalItems={sortedEmps.length}
          itemsPerPage={PER_PAGE}
          currentPage={page}
          onPageChange={setPage}
        />
      </div>

      {/* Submit panel */}
      <div className="submit-panel">
        <div className="submit-panel-left">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Overall Comments (optional)</label>
            <textarea
              className="form-input"
              rows={2}
              placeholder="Add context for HR/approver about this team's proposals..."
              value={overallComment}
              onChange={e => setOverallComment(e.target.value)}
            />
          </div>
        </div>
        <div className="submit-panel-right">
          <div className="budget-validation">
            {deptBudgetPct > 100 ? (
              <div className="budget-alert" style={{ marginBottom: 0 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                Budget exceeded! Reduce hikes before submitting.
              </div>
            ) : deptBudgetPct > 90 ? (
              <div className="budget-alert" style={{ marginBottom: 0, background: 'var(--warning-bg)', borderColor: '#fde68a', color: 'var(--warning)' }}>
                Budget at {deptBudgetPct.toFixed(1)}% — proceed with caution.
              </div>
            ) : (
              <div className="budget-success" style={{ marginBottom: 0 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Budget OK — {deptBudgetPct.toFixed(1)}% utilized
              </div>
            )}
          </div>
          {submitted ? (
            <div className="submit-success">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Proposals submitted for {dept?.name}!
            </div>
          ) : (
            <button
              className="btn btn-success btn-lg"
              onClick={() => setShowSubmitModal(true)}
              disabled={deptBudgetPct > 100 || eligibleCount === 0}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
              Submit {eligibleCount} Proposals
            </button>
          )}
        </div>
      </div>

      <Modal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        title="Submit Hike Proposals"
        size="sm"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setShowSubmitModal(false)}>Cancel</button>
            <button className="btn btn-success" onClick={handleSubmit}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
              Confirm Submit
            </button>
          </>
        }
      >
        <div className="confirm-modal-body">
          <div className="confirm-icon" style={{ background: '#dcfce7' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
          </div>
          <p>Submit <strong>{eligibleCount} hike proposals</strong> for <strong>{dept?.name}</strong>?</p>
          <p>Total cost impact: <strong>{formatINR(getDeptBudgetUsed(selectedDept))}</strong></p>
          <p className="confirm-note">Proposals will be sent to HR BP for review. You can still recall before approval.</p>
        </div>
      </Modal>
    </div>
  );
};

export default ManagerDashboard;
