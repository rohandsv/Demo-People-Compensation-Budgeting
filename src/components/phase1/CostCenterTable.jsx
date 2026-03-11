import React, { useState } from 'react';
import { formatINR } from '../../data/constants';
import { locations, departments } from '../../data/mockData';
import Card from '../common/Card';
import './Phase1.css';

const CostCenterTable = () => {
  const [expanded, setExpanded] = useState({});

  const costData = [
    { location: 'Mumbai HQ', type: 'HQ', depts: ['IT', 'Sales', 'Operations', 'HR', 'Finance'], budget: 28000000 },
    { location: 'Pune Office', type: 'Branch', depts: ['IT'], budget: 5000000 },
    { location: 'Delhi Office', type: 'Branch', depts: ['Sales'], budget: 7000000 },
    { location: 'Bangalore Office', type: 'Branch', depts: ['Operations'], budget: 4000000 },
    { location: 'Hyderabad Office', type: 'Branch', depts: ['HR'], budget: 2500000 },
    { location: 'Chennai Office', type: 'Branch', depts: ['Sales'], budget: 3500000 },
  ];

  const toggleExpand = (loc) => {
    setExpanded(p => ({ ...p, [loc]: !p[loc] }));
  };

  return (
    <div className="phase1-section">
      <Card
        title="Cost Center Breakdown"
        subtitle="Location-wise budget allocation with department mapping"
      >
        <table className="alloc-table">
          <thead>
            <tr>
              <th>Location</th>
              <th>Type</th>
              <th>Departments</th>
              <th className="text-right">Budget Allocated</th>
              <th className="text-right">% of Total</th>
              <th>Cost Center ID</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {costData.map((row, i) => (
              <React.Fragment key={row.location}>
                <tr className={expanded[row.location] ? 'row-expanded' : ''}>
                  <td>
                    <div className="dept-cell-name">{row.location}</div>
                  </td>
                  <td>
                    <span className={`location-type-badge ${row.type === 'HQ' ? 'hq' : 'branch'}`}>
                      {row.type}
                    </span>
                  </td>
                  <td>
                    <div className="dept-tags">
                      {row.depts.map(d => (
                        <span key={d} className="dept-tag">{d}</span>
                      ))}
                    </div>
                  </td>
                  <td className="text-right font-bold">{formatINR(row.budget)}</td>
                  <td className="text-right">{((row.budget / 50000000) * 100).toFixed(1)}%</td>
                  <td>
                    <code className="cost-center-code">CC-{row.location.replace(/\s+/g, '-').toUpperCase().slice(0, 8)}</code>
                  </td>
                  <td>
                    <button className="btn-icon" onClick={() => toggleExpand(row.location)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        {expanded[row.location]
                          ? <polyline points="18 15 12 9 6 15"/>
                          : <polyline points="6 9 12 15 18 9"/>
                        }
                      </svg>
                    </button>
                  </td>
                </tr>
                {expanded[row.location] && (
                  <tr className="expanded-row">
                    <td colSpan={7}>
                      <div className="expanded-content">
                        <div className="expanded-title">Department Breakdown for {row.location}</div>
                        <div className="expanded-dept-grid">
                          {row.depts.map(deptId => {
                            const dept = departments.find(d => d.id === deptId);
                            const locBudget = row.budget / row.depts.length;
                            return (
                              <div key={deptId} className="expanded-dept-card">
                                <div className="expanded-dept-name">{dept?.name || deptId}</div>
                                <div className="expanded-dept-budget">{formatINR(locBudget)}</div>
                                <div className="expanded-dept-cc">{dept?.costCenter || 'N/A'}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
          <tfoot>
            <tr className="alloc-total-row">
              <td colSpan={3}><strong>Total</strong></td>
              <td className="text-right"><strong>{formatINR(costData.reduce((s, r) => s + r.budget, 0))}</strong></td>
              <td className="text-right"><strong>100%</strong></td>
              <td colSpan={2}></td>
            </tr>
          </tfoot>
        </table>
      </Card>
    </div>
  );
};

export default CostCenterTable;
