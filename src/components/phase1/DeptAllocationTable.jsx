import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../data/constants';
import Card from '../common/Card';
import StatusBadge from '../common/StatusBadge';
import './Phase1.css';

const DeptAllocationTable = () => {
  const { departments, orgBudget, updateDeptAllocation, addNotification } = useApp();
  const [editing, setEditing] = useState({});
  const [saved, setSaved] = useState(false);

  const totalAllocated = departments.reduce((s, d) => s + d.budgetAllocated, 0);
  const orgTotal = orgBudget.totalBudget;
  const variance = orgTotal - totalAllocated;
  const isBalanced = Math.abs(variance) < 1000;

  const handleChange = (deptId, value) => {
    const num = parseFloat(value) || 0;
    updateDeptAllocation(deptId, num * 100000);
    setEditing(p => ({ ...p, [deptId]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    addNotification('success', 'Department allocations saved successfully.');
    setSaved(true);
    setEditing({});
  };

  const pctOfTotal = (amt) => orgTotal > 0 ? ((amt / orgTotal) * 100).toFixed(1) : '0.0';

  return (
    <div className="phase1-section">
      <Card
        title="Department Budget Allocation"
        subtitle="Distribute the total compensation budget across departments"
        actions={
          <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={!isBalanced}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
              <polyline points="17 21 17 13 7 13 7 21"/>
            </svg>
            Save Allocations
          </button>
        }
      >
        {!isBalanced && (
          <div className="budget-alert">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            {variance > 0
              ? `${formatINR(variance)} unallocated. Total allocations must equal the organisation budget.`
              : `Allocations exceed budget by ${formatINR(Math.abs(variance))}.`
            }
          </div>
        )}
        {isBalanced && (
          <div className="budget-success">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            All allocations balance with organisation budget. {saved ? 'Saved.' : ''}
          </div>
        )}

        <div style={{ overflowX: 'auto' }}>
          <table className="alloc-table">
            <thead>
              <tr>
                <th>Department</th>
                <th>Head</th>
                <th className="text-center">Headcount</th>
                <th className="text-right">Allocated Budget (₹ Lakhs)</th>
                <th className="text-right">% of Total</th>
                <th>Cost Center</th>
                <th>Per Employee</th>
              </tr>
            </thead>
            <tbody>
              {departments.map(dept => {
                const valLakhs = editing[dept.id] !== undefined
                  ? editing[dept.id]
                  : (dept.budgetAllocated / 100000).toFixed(2);
                const amtNum = parseFloat(valLakhs || 0) * 100000;
                return (
                  <tr key={dept.id}>
                    <td>
                      <div className="dept-cell-name">{dept.name}</div>
                      <div className="dept-cell-id text-muted text-small">{dept.id}</div>
                    </td>
                    <td>{dept.head}</td>
                    <td className="text-center">{dept.headcount}</td>
                    <td className="text-right">
                      <input
                        className="inline-input"
                        type="number"
                        step="0.01"
                        min="0"
                        value={valLakhs}
                        onChange={e => handleChange(dept.id, e.target.value)}
                      />
                    </td>
                    <td className="text-right">
                      <span className="pct-badge">{pctOfTotal(amtNum)}%</span>
                    </td>
                    <td>
                      <code className="cost-center-code">{dept.costCenter}</code>
                    </td>
                    <td>
                      {formatINR(dept.headcount > 0 ? amtNum / dept.headcount : 0)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="alloc-total-row">
                <td colSpan={3}><strong>Total</strong></td>
                <td className="text-right"><strong>{formatINR(totalAllocated)}</strong></td>
                <td className="text-right">
                  <strong className={isBalanced ? 'text-success' : 'text-danger'}>
                    {pctOfTotal(totalAllocated)}%
                  </strong>
                </td>
                <td colSpan={2}>
                  <span className={`variance-label ${isBalanced ? 'balanced' : 'unbalanced'}`}>
                    {isBalanced ? 'Balanced' : `Variance: ${formatINR(Math.abs(variance))}`}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="org-budget-ref">
          <span>Organisation Budget: </span>
          <strong>{formatINR(orgTotal)}</strong>
          <span className="ml-12"> | Remaining to Allocate: </span>
          <strong className={variance > 0 ? 'text-primary' : variance < 0 ? 'text-danger' : 'text-success'}>
            {formatINR(Math.abs(variance))}{variance < 0 ? ' over' : ''}
          </strong>
        </div>
      </Card>

      <div className="dept-visual-bars">
        {departments.map(dept => {
          const pct = orgTotal > 0 ? (dept.budgetAllocated / orgTotal) * 100 : 0;
          return (
            <div key={dept.id} className="dept-bar-item">
              <div className="dept-bar-label">
                <span>{dept.id}</span>
                <span>{formatINR(dept.budgetAllocated)}</span>
              </div>
              <div className="dept-bar-track">
                <div className="dept-bar-fill" style={{ width: `${pct}%` }}></div>
              </div>
              <span className="dept-bar-pct">{pct.toFixed(1)}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DeptAllocationTable;
