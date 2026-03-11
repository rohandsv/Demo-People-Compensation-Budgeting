import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../data/constants';
import StatusBadge from '../common/StatusBadge';
import Card from '../common/Card';
import Pagination from '../common/Pagination';
import './Phase5.css';

const PayrollSyncStatus = () => {
const { employees, hikeProposals, syncPayroll, addNotification } = useApp();
const [syncing, setSyncing] = useState(false);
const [syncProgress, setSyncProgress] = useState(0);
const [effectiveDate, setEffectiveDate] = useState('2025-05-01');
const [page, setPage] = useState(1);
const PER_PAGE = 10;

const eligibleEmps = employees.filter(e => hikeProposals[e.id]?.eligible);
const syncedEmps = eligibleEmps.filter(e => hikeProposals[e.id]?.payrollSynced);
const pendingEmps = eligibleEmps.filter(e => !hikeProposals[e.id]?.payrollSynced);

const handleSyncAll = () => {
setSyncing(true);
setSyncProgress(0);


const interval = setInterval(() => {
  setSyncProgress(prev => {
    if (prev >= 100) {
      clearInterval(interval);

      eligibleEmps.forEach(e => syncPayroll(e.id));

      setSyncing(false);
      addNotification(
        'success',
        `${eligibleEmps.length} employees synced to payroll successfully.`
      );

      return 100;
    }

    return prev + 10;
  });
}, 120);

};

return ( <div className="phase5-section">

```
  <div className="stats-grid">

    <div className="stat-card stat-card-primary">
      <div className="stat-card-top">
        <div className="stat-card-info">
          <span className="stat-card-label">Approved Hikes</span>
          <span className="stat-card-value">{eligibleEmps.length}</span>
          <span className="stat-card-sub">Ready for payroll</span>
        </div>
      </div>
    </div>

    <div className="stat-card stat-card-success">
      <div className="stat-card-top">
        <div className="stat-card-info">
          <span className="stat-card-label">Synced</span>
          <span className="stat-card-value">{syncedEmps.length}</span>
          <span className="stat-card-sub">In payroll system</span>
        </div>
      </div>
    </div>

    <div className="stat-card stat-card-warning">
      <div className="stat-card-top">
        <div className="stat-card-info">
          <span className="stat-card-label">Pending Sync</span>
          <span className="stat-card-value">{pendingEmps.length}</span>
          <span className="stat-card-sub">Awaiting sync</span>
        </div>
      </div>
    </div>

    <div className="stat-card">
      <div className="stat-card-top">
        <div className="stat-card-info">
          <span className="stat-card-label">Errors</span>
          <span className="stat-card-value">0</span>
          <span className="stat-card-sub">No errors</span>
        </div>
      </div>
    </div>

  </div>


  <Card title="Payroll Sync Configuration">

    <div className="payroll-config">

      <div className="form-group" style={{ maxWidth: 220 }}>
        <label className="form-label">Effective Date</label>

        <input
          className="form-input"
          type="date"
          value={effectiveDate}
          onChange={e => setEffectiveDate(e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
        <button
          className="btn btn-primary btn-lg"
          onClick={handleSyncAll}
          disabled={syncing || pendingEmps.length === 0}
        >
          {syncing ? 'Syncing...' : 'Sync All to Payroll'}
        </button>
      </div>

    </div>


    {syncing && (
      <div className="sync-progress">

        <div className="sync-progress-bar">
          <div
            className="sync-progress-fill"
            style={{ width: `${syncProgress}%` }}
          ></div>
        </div>

        <div className="sync-progress-label">
          Syncing... {syncProgress}%
        </div>

      </div>
    )}

  </Card>


  <Card
    title="Employee Sync Status"
    subtitle="Real-time payroll synchronization status"
  >

    <div style={{ overflowX: 'auto' }}>

      <table className="phase5-table">

        <thead>
          <tr>
            <th>Employee</th>
            <th>Department</th>
            <th className="text-right">Current CTC</th>
            <th className="text-right">New CTC</th>
            <th className="text-right">Hike %</th>
            <th>Effective Date</th>
            <th>Sync Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {eligibleEmps
            .slice((page - 1) * PER_PAGE, page * PER_PAGE)
            .map(emp => {

              const proposal = hikeProposals[emp.id];
              const newCTC =
                emp.currentCTC *
                (1 + (proposal?.proposedHike || 0) / 100);

              const synced = proposal?.payrollSynced;

              return (
                <tr key={emp.id} className={synced ? 'row-success' : ''}>

                  <td>
                    <div className="emp-name-cell-p5">

                      <div className="emp-avatar-sm-p5">
                        {emp.name.charAt(0)}
                      </div>

                      <div>
                        <div style={{ fontWeight: 600 }}>
                          {emp.name}
                        </div>

                        <div className="text-small text-muted">
                          {emp.empId}
                        </div>
                      </div>

                    </div>
                  </td>

                  <td>{emp.dept}</td>

                  <td className="text-right">
                    {formatINR(emp.currentCTC)}
                  </td>

                  <td className="text-right font-bold">
                    {formatINR(newCTC)}
                  </td>

                  <td className="text-right">
                    <span
                      style={{
                        fontWeight: 700,
                        color: 'var(--success)'
                      }}
                    >
                      {(proposal?.proposedHike || 0).toFixed(1)}%
                    </span>
                  </td>

                  <td>{effectiveDate}</td>

                  <td>
                    <StatusBadge
                      status={synced ? 'synced' : 'pending'}
                      size="sm"
                    />
                  </td>

                  <td>

                    {!synced && (
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => syncPayroll(emp.id)}
                      >
                        Sync
                      </button>
                    )}

                    {synced && (
                      <span className="text-success text-small">
                        ✓ Synced
                      </span>
                    )}

                  </td>

                </tr>
              );

            })}

        </tbody>

      </table>

    </div>

    <Pagination
      totalItems={eligibleEmps.length}
      itemsPerPage={PER_PAGE}
      currentPage={page}
      onPageChange={setPage}
    />

  </Card>

</div>
);
};

export default PayrollSyncStatus;
