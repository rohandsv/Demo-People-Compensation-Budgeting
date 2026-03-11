import React from 'react';
import { useApp } from '../context/AppContext';
import { StatCard } from '../components/common/Card';
import PhaseNav from '../components/common/PhaseNav';
import BudgetBar from '../components/common/BudgetBar';
import StatusBadge from '../components/common/StatusBadge';
import { formatINR, PHASES, PHASE_COLORS } from '../data/constants';
import './Dashboard.css';

const Dashboard = () => {
  const {
    currentUser, departments, employees, cycle, hikeProposals,
    getTotalBudgetUsed, getAvgHike, navigate, phaseStatus
  } = useApp();

  const totalBudgetUsed = getTotalBudgetUsed();
  const avgHike = getAvgHike();
  const eligibleCount = employees.filter(e => hikeProposals[e.id]?.eligible).length;
  const submittedCount = Object.values(hikeProposals).filter(p => ['submitted','approved'].includes(p.status)).length;
  const approvedCount = Object.values(hikeProposals).filter(p => p.status === 'approved').length;

  const deptStats = departments.map(dept => {
    const deptEmps = employees.filter(e => e.dept === dept.id);
    const used = deptEmps.reduce((sum, emp) => {
      const p = hikeProposals[emp.id];
      return sum + (p?.eligible ? (p.proposedHike / 100) * emp.currentCTC : 0);
    }, 0);
    const pct = dept.budgetAllocated > 0 ? (used / dept.budgetAllocated) * 100 : 0;
    const avgH = deptEmps.filter(e => hikeProposals[e.id]?.eligible)
      .reduce((s, e) => s + (hikeProposals[e.id]?.proposedHike || 0), 0) /
      Math.max(deptEmps.filter(e => hikeProposals[e.id]?.eligible).length, 1);
    return { ...dept, budgetUsed: used, utilizationPct: pct, avgHike: avgH };
  });

  const recentActivity = [
    { id: 1, action: 'FY2025 cycle activated', actor: 'HR Admin', time: '2 hours ago', type: 'success' },
    { id: 2, action: 'IT dept proposals submitted (4/4)', actor: 'Anita Desai', time: '3 hours ago', type: 'info' },
    { id: 3, action: 'HR BP approved EMP001, EMP002', actor: 'Meera Reddy', time: '5 hours ago', type: 'success' },
    { id: 4, action: 'Budget warning: Sales at 88%', actor: 'System', time: '6 hours ago', type: 'warning' },
    { id: 5, action: 'Phase 1 budget setup locked', actor: 'CFO', time: '1 day ago', type: 'success' },
  ];

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>FY2025 Annual Increment Cycle — Overview &amp; Status</p>
      </div>

      <PhaseNav currentPhase={null} />

      {/* Stats */}
      <div className="stats-grid">
        <StatCard
          label="Total Budget"
          value={formatINR(cycle.totalBudget)}
          subValue="FY2025 Compensation Budget"
          color="primary"
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
        />
        <StatCard
          label="Budget Utilized"
          value={`${((totalBudgetUsed / cycle.totalBudget) * 100).toFixed(1)}%`}
          subValue={formatINR(totalBudgetUsed) + ' consumed'}
          color="warning"
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>}
          trend={2.3}
        />
        <StatCard
          label="Active Employees"
          value={eligibleCount}
          subValue={`${employees.length} total, ${employees.length - eligibleCount} ineligible`}
          color="teal"
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
        />
        <StatCard
          label="Avg Hike %"
          value={`${avgHike.toFixed(1)}%`}
          subValue={`${submittedCount} submitted, ${approvedCount} approved`}
          color="success"
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>}
          trend={1.2}
        />
      </div>

      {/* Budget Overview */}
      <div className="dashboard-budget-section">
        <BudgetBar
          consumed={totalBudgetUsed}
          total={cycle.totalBudget}
          label="Overall Budget Utilization"
        />
      </div>

      {/* Dept table + Activity */}
      <div className="dashboard-bottom">
        <div className="dashboard-dept-section">
          <div className="section-header">
            <div>
              <div className="section-title">Department Budget Status</div>
              <div className="section-subtitle">Real-time allocation and utilization</div>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('phase1', 1)}>
              Manage Budgets
            </button>
          </div>
          <div className="dept-table-wrap">
            <table className="dept-table">
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Head</th>
                  <th className="text-right">HC</th>
                  <th className="text-right">Allocated</th>
                  <th className="text-right">Consumed</th>
                  <th>Utilization</th>
                  <th className="text-right">Avg Hike</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {deptStats.map(dept => (
                  <tr key={dept.id} className="dept-row">
                    <td>
                      <div className="dept-name">{dept.name}</div>
                      <div className="dept-cc text-muted text-small">{dept.costCenter}</div>
                    </td>
                    <td>{dept.head}</td>
                    <td className="text-right">{dept.headcount}</td>
                    <td className="text-right font-bold">{formatINR(dept.budgetAllocated)}</td>
                    <td className="text-right">{formatINR(dept.budgetUsed)}</td>
                    <td>
                      <div className="dept-util-bar">
                        <div
                          className={`dept-util-fill ${dept.utilizationPct >= 90 ? 'fill-danger' : dept.utilizationPct >= 70 ? 'fill-warning' : 'fill-ok'}`}
                          style={{ width: `${Math.min(dept.utilizationPct, 100)}%` }}
                        ></div>
                      </div>
                      <span className="dept-util-pct">{dept.utilizationPct.toFixed(0)}%</span>
                    </td>
                    <td className="text-right font-bold">{dept.avgHike.toFixed(1)}%</td>
                    <td>
                      <StatusBadge status={dept.utilizationPct >= 100 ? 'danger' : dept.utilizationPct >= 90 ? 'warning' : 'active'} label={dept.utilizationPct >= 100 ? 'Over Budget' : dept.utilizationPct >= 90 ? 'Near Limit' : 'On Track'} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="dashboard-activity">
          <div className="section-header">
            <div className="section-title">Recent Activity</div>
          </div>
          <div className="activity-list">
            {recentActivity.map(item => (
              <div key={item.id} className="activity-item">
                <div className={`activity-dot activity-dot-${item.type}`}></div>
                <div className="activity-content">
                  <p className="activity-action">{item.action}</p>
                  <div className="activity-meta">
                    <span className="activity-actor">{item.actor}</span>
                    <span className="activity-time">{item.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="dashboard-quick-actions">
            <div className="section-title" style={{marginBottom: '12px'}}>Quick Actions</div>
            {[
              { label: 'Review Pending Approvals', page: 'phase4', phase: 4, count: submittedCount },
              { label: 'Manager Planning', page: 'phase3', phase: 3 },
              { label: 'Configure Cycle', page: 'phase2', phase: 2 },
              { label: 'Generate Letters', page: 'phase5', phase: 5 },
            ].map(action => (
              <button
                key={action.page}
                className="quick-action-btn"
                onClick={() => navigate(action.page, action.phase)}
              >
                <span>{action.label}</span>
                {action.count > 0 && <span className="quick-action-count">{action.count}</span>}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Phase completion */}
      <div className="dashboard-phase-status">
        <div className="section-header">
          <div className="section-title">Cycle Phase Progress</div>
        </div>
        <div className="phase-status-grid">
          {PHASES.map(phase => {
            const status = phaseStatus[phase.id];
            return (
              <div
                key={phase.id}
                className={`phase-status-card ${status}`}
                onClick={() => navigate(`phase${phase.id}`, phase.id)}
                style={{ borderTop: `3px solid ${PHASE_COLORS[phase.id]}` }}
              >
                <div className="phase-status-num" style={{ color: PHASE_COLORS[phase.id] }}>
                  Phase {phase.id}
                </div>
                <div className="phase-status-name">{phase.name}</div>
                <div className="phase-status-desc">{phase.description}</div>
                <StatusBadge status={status} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
