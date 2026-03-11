import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR, PERF_STARS } from '../../data/constants';
import StatusBadge from '../common/StatusBadge';
import Modal from '../common/Modal';
import Card from '../common/Card';
import Pagination from '../common/Pagination';
import './Phase4.css';

const TABS = [
  { id: 'hrbp', label: 'Level 1: HR BP Review' },
  { id: 'finance', label: 'Level 2: Finance Review' },
  { id: 'chro', label: 'Level 3: CHRO Sign-Off' },
  { id: 'board', label: 'Level 4: Board (Conditional)' },
];

const ApprovalDashboard = () => {
  const {
    employees, departments, hikeProposals, approvalConfig,
    approveHike, rejectHike, sendBackHike, addNotification,
    setPhaseStatus, orgBudget, getDeptBudgetUsed, getAvgHike
  } = useApp();

  const [activeTab, setActiveTab] = useState('hrbp');
  const [actionModal, setActionModal] = useState(null);
  const [actionComment, setActionComment] = useState('');
  const [modifiedHike, setModifiedHike] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [chroApproved, setChroApproved] = useState(false);
  const [financeApproved, setFinanceApproved] = useState(false);
  const [boardApproved, setBoardApproved] = useState(false);
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const allEmployees = employees.map(emp => ({
    ...emp,
    proposal: hikeProposals[emp.id],
    dept: departments.find(d => d.id === emp.dept),
  }));

  const avgHike = getAvgHike();
  const needsBoard = avgHike > approvalConfig.boardThreshold;

  // Filter
  const filtered = allEmployees.filter(e => {
    if (filterDept && e.dept?.id !== filterDept) return false;
    if (filterStatus && e.proposal?.status !== filterStatus) return false;
    return e.proposal?.eligible;
  });

  const handleAction = (emp, action) => {
    setActionModal({ emp, action });
    setActionComment('');
    setModifiedHike(emp.proposal?.proposedHike || '');
  };

  const confirmAction = () => {
    const { emp, action } = actionModal;
    if (action === 'approve') {
      approveHike(emp.id, actionComment);
    } else if (action === 'modify') {
      approveHike(emp.id, actionComment, parseFloat(modifiedHike));
    } else if (action === 'reject') {
      rejectHike(emp.id, actionComment);
    } else if (action === 'sendback') {
      sendBackHike(emp.id, actionComment);
    }
    setActionModal(null);
  };

  const handleBulkApprove = (deptId) => {
    const deptEmps = allEmployees.filter(e => e.dept?.id === deptId && e.proposal?.status === 'submitted');
    deptEmps.forEach(e => approveHike(e.id, 'Bulk approved by HR BP'));
    addNotification('success', `${deptEmps.length} employees from ${deptId} approved.`);
  };

  const handleFinanceApprove = (deptId) => {
    setFinanceApproved(true);
    addNotification('success', `Finance approved ${deptId} department cost impact.`);
  };

  const deptStats = departments.map(dept => {
    const deptEmps = allEmployees.filter(e => e.dept?.id === dept.id && e.proposal?.eligible);
    const currentPayroll = deptEmps.reduce((s, e) => s + e.currentCTC, 0);
    const proposedPayroll = deptEmps.reduce((s, e) => s + (e.currentCTC * (1 + (e.proposal?.proposedHike || 0) / 100)), 0);
    const increase = proposedPayroll - currentPayroll;
    const avgH = deptEmps.reduce((s, e) => s + (e.proposal?.proposedHike || 0), 0) / Math.max(deptEmps.length, 1);
    const approved = deptEmps.filter(e => e.proposal?.status === 'approved').length;
    const submitted = deptEmps.filter(e => e.proposal?.status === 'submitted').length;
    return { ...dept, deptEmps, currentPayroll, proposedPayroll, increase, avgHike: avgH, approved, submitted };
  });

  return (
    <div className="approval-dashboard">
      <div className="tabs">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            {tab.id === 'board' && !needsBoard && <span className="tab-skipped">Skipped</span>}
          </button>
        ))}
      </div>

      {/* Level 1: HR BP */}
      {activeTab === 'hrbp' && (
        <div>
          <div className="stats-grid">
            {deptStats.map(dept => (
              <div key={dept.id} className="approval-dept-card">
                <div className="approval-dept-header">
                  <span className="approval-dept-name">{dept.name}</span>
                  <button className="btn btn-success btn-sm" onClick={() => handleBulkApprove(dept.id)} disabled={dept.submitted === 0}>
                    Bulk Approve ({dept.submitted})
                  </button>
                </div>
                <div className="approval-dept-stats">
                  <span>HC: {dept.deptEmps.length}</span>
                  <span>Submitted: {dept.submitted}</span>
                  <span className="text-success">Approved: {dept.approved}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="filter-row">
            <select className="form-input" style={{ width: 160 }} value={filterDept} onChange={e => { setFilterDept(e.target.value); setPage(1); }}>
              <option value="">All Departments</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            <select className="form-input" style={{ width: 140 }} value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }}>
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="submitted">Submitted</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="approval-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Dept</th>
                  <th className="text-right">Current CTC</th>
                  <th className="text-right">Proposed Hike %</th>
                  <th className="text-right">New CTC</th>
                  <th>Band Check</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE).map(emp => {
                  const proposal = emp.proposal;
                  const proposedHike = proposal?.proposedHike || 0;
                  const newCTC = emp.currentCTC * (1 + proposedHike / 100);
                  const isSubmitted = proposal?.status === 'submitted';
                  return (
                    <tr key={emp.id} className={proposal?.status === 'approved' ? 'row-success' : ''}>
                      <td>
                        <div className="emp-name-cell">
                          <div className="emp-avatar-sm">{emp.name.charAt(0)}</div>
                          <div>
                            <div className="emp-name">{emp.name}</div>
                            <div className="emp-meta text-small text-muted">{emp.empId} · {emp.title}</div>
                          </div>
                        </div>
                      </td>
                      <td>{emp.dept?.name || emp.dept}</td>
                      <td className="text-right font-bold">{formatINR(emp.currentCTC)}</td>
                      <td className="text-right">
                        <span className={`hike-pct-display ${proposedHike > 20 ? 'high' : proposedHike > 10 ? 'med' : ''}`}>
                          {proposedHike.toFixed(1)}%
                        </span>
                      </td>
                      <td className="text-right">{formatINR(newCTC)}</td>
                      <td>
                        <StatusBadge status="within_band" size="sm" />
                      </td>
                      <td>
                        <StatusBadge status={proposal?.status || 'pending'} size="sm" />
                      </td>
                      <td>
                        {isSubmitted && (
                          <div className="action-btns">
                            <button className="btn btn-success btn-sm" onClick={() => handleAction(emp, 'approve')}>Approve</button>
                            <button className="btn btn-warning btn-sm" onClick={() => handleAction(emp, 'modify')}>Modify</button>
                            <button className="btn btn-secondary btn-sm" onClick={() => handleAction(emp, 'sendback')}>Send Back</button>
                          </div>
                        )}
                        {proposal?.status === 'approved' && (
                          <span className="text-success text-small font-bold">Approved ✓</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <Pagination
              totalItems={filtered.length}
              itemsPerPage={PER_PAGE}
              currentPage={page}
              onPageChange={setPage}
            />
          </div>
        </div>
      )}

      {/* Level 2: Finance */}
      {activeTab === 'finance' && (
        <div>
          <Card title="Department Cost Impact Analysis" subtitle="Finance review of total payroll impact">
            <div style={{ overflowX: 'auto' }}>
              <table className="approval-table">
                <thead>
                  <tr>
                    <th>Department</th>
                    <th className="text-right">Headcount</th>
                    <th className="text-right">Current Payroll</th>
                    <th className="text-right">Proposed Payroll</th>
                    <th className="text-right">Increase (₹)</th>
                    <th className="text-right">Increase (%)</th>
                    <th className="text-right">Budget Allocated</th>
                    <th className="text-right">Variance</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {deptStats.map(dept => {
                    const incrPct = dept.currentPayroll > 0 ? (dept.increase / dept.currentPayroll) * 100 : 0;
                    const variance = dept.budgetAllocated - dept.increase;
                    return (
                      <tr key={dept.id}>
                        <td><strong>{dept.name}</strong></td>
                        <td className="text-right">{dept.deptEmps.length}</td>
                        <td className="text-right">{formatINR(dept.currentPayroll)}</td>
                        <td className="text-right font-bold">{formatINR(dept.proposedPayroll)}</td>
                        <td className="text-right" style={{ color: 'var(--success)', fontWeight: 700 }}>+{formatINR(dept.increase)}</td>
                        <td className="text-right">
                          <span className={`hike-pct-display ${incrPct > 15 ? 'high' : incrPct > 8 ? 'med' : ''}`}>
                            {incrPct.toFixed(1)}%
                          </span>
                        </td>
                        <td className="text-right">{formatINR(dept.budgetAllocated)}</td>
                        <td className="text-right">
                          <span style={{ color: variance >= 0 ? 'var(--success)' : 'var(--danger)', fontWeight: 700 }}>
                            {variance >= 0 ? '+' : ''}{formatINR(variance)}
                          </span>
                        </td>
                        <td>
                          <button className="btn btn-success btn-sm" onClick={() => handleFinanceApprove(dept.id)}>
                            Approve
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr style={{ background: 'var(--gray-50)', fontWeight: 700 }}>
                    <td>Total</td>
                    <td className="text-right">{employees.length}</td>
                    <td className="text-right">{formatINR(deptStats.reduce((s, d) => s + d.currentPayroll, 0))}</td>
                    <td className="text-right">{formatINR(deptStats.reduce((s, d) => s + d.proposedPayroll, 0))}</td>
                    <td className="text-right" style={{ color: 'var(--success)' }}>+{formatINR(deptStats.reduce((s, d) => s + d.increase, 0))}</td>
                    <td className="text-right">{avgHike.toFixed(1)}%</td>
                    <td className="text-right">{formatINR(orgBudget.totalBudget)}</td>
                    <td className="text-right">{formatINR(orgBudget.totalBudget - deptStats.reduce((s, d) => s + d.increase, 0))}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
            {financeApproved && (
              <div className="budget-success" style={{ marginTop: 16 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Finance review completed. Forwarded to CHRO.
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Level 3: CHRO */}
      {activeTab === 'chro' && (
        <div>
          <div className="stats-grid">
            <div className="stat-card stat-card-primary">
              <div className="stat-card-top">
                <div className="stat-card-info">
                  <span className="stat-card-label">Avg Hike</span>
                  <span className="stat-card-value">{avgHike.toFixed(1)}%</span>
                  <span className="stat-card-sub">Across all departments</span>
                </div>
              </div>
            </div>
            <div className="stat-card stat-card-success">
              <div className="stat-card-top">
                <div className="stat-card-info">
                  <span className="stat-card-label">Approved</span>
                  <span className="stat-card-value">{allEmployees.filter(e => e.proposal?.status === 'approved').length}</span>
                  <span className="stat-card-sub">Employees</span>
                </div>
              </div>
            </div>
            <div className="stat-card stat-card-teal">
              <div className="stat-card-top">
                <div className="stat-card-info">
                  <span className="stat-card-label">Total Cost</span>
                  <span className="stat-card-value">{formatINR(deptStats.reduce((s, d) => s + d.increase, 0))}</span>
                  <span className="stat-card-sub">Annual increment cost</span>
                </div>
              </div>
            </div>
          </div>

          <Card title="CHRO Sign-Off" subtitle="Final approval before payroll integration">
            <div className="chro-summary">
              {deptStats.map(dept => (
                <div key={dept.id} className="chro-dept-row">
                  <span className="chro-dept-name">{dept.name}</span>
                  <div className="chro-dept-bar">
                    <div className="chro-dept-fill" style={{ width: `${Math.min((dept.increase / dept.budgetAllocated) * 100, 100)}%` }}></div>
                  </div>
                  <span className="chro-dept-pct">{dept.avgHike.toFixed(1)}% avg</span>
                  <StatusBadge status={dept.submitted === 0 ? 'approved' : 'submitted'} size="sm" />
                </div>
              ))}
            </div>
            {chroApproved ? (
              <div className="budget-success" style={{ marginTop: 16 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                CHRO has signed off. Ready for payroll integration.
              </div>
            ) : (
              <button className="btn btn-success btn-lg" onClick={() => { setChroApproved(true); setPhaseStatus(p => ({ ...p, 4: 'completed', 5: 'in_progress' })); addNotification('success', 'CHRO signed off. Phase 4 complete.'); }} style={{ marginTop: 16 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                CHRO Final Sign-Off
              </button>
            )}
          </Card>
        </div>
      )}

      {/* Level 4: Board */}
      {activeTab === 'board' && (
        <div>
          {!needsBoard ? (
            <Card title="Board Approval Not Required">
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>✓</div>
                <h3 style={{ color: 'var(--success)', marginBottom: 8 }}>Board Approval Skipped</h3>
                <p style={{ color: 'var(--gray-500)', fontSize: 13 }}>
                  Average increment of {avgHike.toFixed(1)}% is below the {approvalConfig.boardThreshold}% threshold.
                  Board approval is not required.
                </p>
              </div>
            </Card>
          ) : (
            <Card title="Board Approval Required" subtitle={`Total increase exceeds ${approvalConfig.boardThreshold}% threshold`}>
              <div className="board-threshold-alert">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                Average hike of {avgHike.toFixed(1)}% exceeds {approvalConfig.boardThreshold}% threshold. Board approval required.
              </div>
              <div className="form-group" style={{ marginTop: 16 }}>
                <label className="form-label">Board Minutes / Comments</label>
                <textarea className="form-input" rows={4} placeholder="Enter board meeting notes and approval rationale..." />
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                <button className="btn btn-success" onClick={() => { setBoardApproved(true); addNotification('success', 'Board approved the compensation cycle.'); }}>
                  Board Approve
                </button>
                <button className="btn btn-danger" onClick={() => addNotification('warning', 'Board rejected. Sent back for revision.')}>
                  Board Reject
                </button>
              </div>
              {boardApproved && (
                <div className="budget-success" style={{ marginTop: 12 }}>Board approved. Ready for payroll.</div>
              )}
            </Card>
          )}
        </div>
      )}

      {/* Action modal */}
      <Modal
        isOpen={!!actionModal}
        onClose={() => setActionModal(null)}
        title={actionModal ? `${actionModal.action.charAt(0).toUpperCase() + actionModal.action.slice(1)} — ${actionModal.emp?.name}` : ''}
        size="sm"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setActionModal(null)}>Cancel</button>
            <button
              className={`btn ${actionModal?.action === 'approve' || actionModal?.action === 'modify' ? 'btn-success' : actionModal?.action === 'reject' ? 'btn-danger' : 'btn-warning'}`}
              onClick={confirmAction}
              disabled={!actionComment.trim()}
            >
              Confirm {actionModal?.action}
            </button>
          </>
        }
      >
        {actionModal && (
          <div className="action-modal-body">
            <div className="action-emp-info">
              <div>
                <div className="emp-name">{actionModal.emp.name}</div>
                <div className="emp-meta text-small text-muted">{actionModal.emp.empId} · Current hike: {actionModal.emp.proposal?.proposedHike?.toFixed(1)}%</div>
              </div>
            </div>
            {actionModal.action === 'modify' && (
              <div className="form-group">
                <label className="form-label">Modified Hike %</label>
                <input
                  className="form-input"
                  type="number"
                  value={modifiedHike}
                  onChange={e => setModifiedHike(e.target.value)}
                  min="0"
                  max="50"
                  step="0.5"
                />
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Comment *</label>
              <textarea
                className="form-input"
                rows={3}
                value={actionComment}
                onChange={e => setActionComment(e.target.value)}
                placeholder="Enter reason or comment..."
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ApprovalDashboard;
