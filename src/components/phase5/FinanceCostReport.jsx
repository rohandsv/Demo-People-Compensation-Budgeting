import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../data/constants';
import Card from '../common/Card';
import './Phase5.css';

const FinanceCostReport = () => {
  const { employees, departments, hikeProposals, orgBudget, addNotification } = useApp();

  const deptReport = departments.map(dept => {
    const deptEmps = employees.filter(e => e.dept === dept.id && hikeProposals[e.id]?.eligible);
    const currentPayroll = deptEmps.reduce((s, e) => s + e.currentCTC, 0);
    const proposedPayroll = deptEmps.reduce((s, e) => s + e.currentCTC * (1 + (hikeProposals[e.id]?.proposedHike || 0) / 100), 0);
    const budgetConsumed = proposedPayroll - currentPayroll;
    const variance = dept.budgetAllocated - budgetConsumed;
    const avgHike = deptEmps.reduce((s, e) => s + (hikeProposals[e.id]?.proposedHike || 0), 0) / Math.max(deptEmps.length, 1);
    return { ...dept, deptEmps, currentPayroll, proposedPayroll, budgetConsumed, variance, avgHike, headcount: deptEmps.length };
  });

  const totalBudgetConsumed = deptReport.reduce((s, d) => s + d.budgetConsumed, 0);
  const totalAllocated = deptReport.reduce((s, d) => s + d.budgetAllocated, 0);
  const totalVariance = totalAllocated - totalBudgetConsumed;
  const overallAvg = deptReport.reduce((s, d) => s + d.avgHike * d.headcount, 0) / Math.max(deptReport.reduce((s, d) => s + d.headcount, 0), 1);

  const maxBarValue = Math.max(...deptReport.map(d => d.budgetConsumed));

  const handleDownload = () => {
    addNotification('success', 'Finance cost report downloaded as CSV.');
  };

  const handleArchive = () => {
    addNotification('success', 'Compensation cycle archived successfully.');
  };

  return (
    <div className="phase5-section">
      <Card
        title="Finance Cost Report"
        subtitle="Department-wise budget consumption analysis for FY2025-26"
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary btn-sm" onClick={handleDownload}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download CSV
            </button>
            <button className="btn btn-primary btn-sm" onClick={handleArchive}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/>
                <line x1="10" y1="12" x2="14" y2="12"/>
              </svg>
              Archive Cycle
            </button>
          </div>
        }
      >
        <div style={{ overflowX: 'auto', marginBottom: 24 }}>
          <table className="phase5-table">
            <thead>
              <tr>
                <th>Department</th>
                <th className="text-right">Headcount</th>
                <th className="text-right">Budget Allocated</th>
                <th className="text-right">Budget Consumed</th>
                <th className="text-right">Variance</th>
                <th className="text-right">Utilization %</th>
                <th className="text-right">Avg Hike %</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {deptReport.map(dept => {
                const utilizationPct = dept.budgetAllocated > 0 ? (dept.budgetConsumed / dept.budgetAllocated) * 100 : 0;
                return (
                  <tr key={dept.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{dept.name}</div>
                      <div className="text-small text-muted">{dept.costCenter}</div>
                    </td>
                    <td className="text-right">{dept.headcount}</td>
                    <td className="text-right">{formatINR(dept.budgetAllocated)}</td>
                    <td className="text-right font-bold">{formatINR(dept.budgetConsumed)}</td>
                    <td className="text-right">
                      <span style={{ color: dept.variance >= 0 ? 'var(--success)' : 'var(--danger)', fontWeight: 700 }}>
                        {dept.variance >= 0 ? '+' : ''}{formatINR(dept.variance)}
                      </span>
                    </td>
                    <td className="text-right">
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
                        <div className="mini-bar">
                          <div
                            className={`mini-bar-fill ${utilizationPct > 100 ? 'danger' : utilizationPct > 90 ? 'warning' : 'ok'}`}
                            style={{ width: `${Math.min(utilizationPct, 100)}%` }}
                          ></div>
                        </div>
                        <span style={{ fontWeight: 600 }}>{utilizationPct.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="text-right">
                      <span style={{ fontWeight: 700, color: 'var(--phase3)' }}>{dept.avgHike.toFixed(1)}%</span>
                    </td>
                    <td>
                      <span className={`util-status ${utilizationPct > 100 ? 'danger' : utilizationPct > 90 ? 'warning' : 'ok'}`}>
                        {utilizationPct > 100 ? 'Over Budget' : utilizationPct > 90 ? 'Near Limit' : 'On Track'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="report-total-row">
                <td><strong>Grand Total</strong></td>
                <td className="text-right"><strong>{deptReport.reduce((s, d) => s + d.headcount, 0)}</strong></td>
                <td className="text-right"><strong>{formatINR(totalAllocated)}</strong></td>
                <td className="text-right"><strong>{formatINR(totalBudgetConsumed)}</strong></td>
                <td className="text-right">
                  <strong style={{ color: totalVariance >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                    {totalVariance >= 0 ? '+' : ''}{formatINR(totalVariance)}
                  </strong>
                </td>
                <td className="text-right">
                  <strong>{((totalBudgetConsumed / totalAllocated) * 100).toFixed(1)}%</strong>
                </td>
                <td className="text-right">
                  <strong style={{ color: 'var(--phase3)' }}>{overallAvg.toFixed(1)}%</strong>
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* CSS Bar Chart */}
        <div className="cost-chart">
          <div className="cost-chart-title">Department Budget Consumption</div>
          <div className="cost-chart-bars">
            {deptReport.map(dept => {
              const heightPct = maxBarValue > 0 ? (dept.budgetConsumed / maxBarValue) * 100 : 0;
              const allocated = maxBarValue > 0 ? (dept.budgetAllocated / maxBarValue) * 100 : 0;
              return (
                <div key={dept.id} className="cost-chart-item">
                  <div className="cost-chart-col">
                    <div className="cost-chart-bar-wrap">
                      <div className="cost-chart-allocated" style={{ height: `${allocated}%` }}></div>
                      <div className="cost-chart-consumed" style={{ height: `${heightPct}%` }}></div>
                    </div>
                    <div className="cost-chart-label">{dept.id}</div>
                    <div className="cost-chart-value">{formatINR(dept.budgetConsumed)}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="cost-chart-legend">
            <div className="chart-legend-item">
              <div className="chart-legend-dot" style={{ background: '#cbd5e1' }}></div>
              <span>Budget Allocated</span>
            </div>
            <div className="chart-legend-item">
              <div className="chart-legend-dot" style={{ background: 'var(--primary-light)' }}></div>
              <span>Budget Consumed</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FinanceCostReport;
