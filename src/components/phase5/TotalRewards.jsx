import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../data/constants';
import Card from '../common/Card';
import Pagination from '../common/Pagination';
import './Phase5.css';

const TotalRewards = () => {
const { employees, hikeProposals, orgBudget } = useApp();
const [expanded, setExpanded] = useState({});
const [page, setPage] = useState(1);
const PER_PAGE = 10;

const eligibleEmps = employees.filter(e => hikeProposals[e.id]?.eligible);

const getRewards = (emp) => {
const proposal = hikeProposals[emp.id];

```
const newBase =
  emp.currentCTC * (1 + (proposal?.proposedHike || 0) / 100);

const variable =
  newBase * (orgBudget.variableSplit / 100) * 0.3;

const benefits = newBase * 0.10;
const perks = 60000;

return {
  fixedPay: newBase * 0.85,
  variableBonus: variable * 0.05,
  benefits: benefits * 0.15,
  perks,
  total: newBase + variable * 0.05 + perks
};
```

};

const toggleExpand = (id) => {
setExpanded(p => ({ ...p, [id]: !p[id] }));
};

const handlePageChange = (newPage) => {
setPage(newPage);
setExpanded({});
};

return ( <div className="phase5-section">

```
  <Card
    title="Total Rewards Statement"
    subtitle="Complete compensation breakdown per employee"
  >

    <div style={{ overflowX: 'auto' }}>

      <table className="phase5-table">

        <thead>
          <tr>
            <th></th>
            <th>Employee</th>
            <th className="text-right">Fixed Pay</th>
            <th className="text-right">Variable Bonus</th>
            <th className="text-right">Benefits</th>
            <th className="text-right">Perks</th>
            <th className="text-right">Total CTC</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>

          {eligibleEmps
            .slice((page - 1) * PER_PAGE, page * PER_PAGE)
            .map(emp => {

              const rewards = getRewards(emp);
              const isExpanded = expanded[emp.id];

              return (
                <React.Fragment key={emp.id}>

                  <tr>

                    <td>
                      <button
                        className="btn-icon"
                        onClick={() => toggleExpand(emp.id)}
                      >
                        {isExpanded ? '−' : '+'}
                      </button>
                    </td>

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
                            {emp.empId} · {emp.grade}
                          </div>
                        </div>

                      </div>
                    </td>

                    <td className="text-right">
                      {formatINR(rewards.fixedPay)}
                    </td>

                    <td className="text-right">
                      {formatINR(rewards.variableBonus)}
                    </td>

                    <td className="text-right">
                      {formatINR(rewards.benefits)}
                    </td>

                    <td className="text-right">
                      {formatINR(rewards.perks)}
                    </td>

                    <td
                      className="text-right font-bold"
                      style={{ color: 'var(--primary)' }}
                    >
                      {formatINR(rewards.total)}
                    </td>

                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => toggleExpand(emp.id)}
                      >
                        {isExpanded ? 'Collapse' : 'Details'}
                      </button>
                    </td>

                  </tr>


                  {isExpanded && (
                    <tr className="expanded-rewards-row">

                      <td colSpan={8}>

                        <div className="rewards-breakdown">

                          <div className="rewards-section">
                            <div className="rewards-section-title">
                              Fixed Pay Breakdown
                            </div>

                            <div className="rewards-item">
                              <span>Basic Salary (40%)</span>
                              <span>{formatINR(rewards.fixedPay * 0.4)}</span>
                            </div>

                            <div className="rewards-item">
                              <span>HRA (20%)</span>
                              <span>{formatINR(rewards.fixedPay * 0.2)}</span>
                            </div>

                            <div className="rewards-item">
                              <span>Special Allowance</span>
                              <span>{formatINR(rewards.fixedPay * 0.3)}</span>
                            </div>

                            <div className="rewards-item">
                              <span>Other Allowances</span>
                              <span>{formatINR(rewards.fixedPay * 0.1)}</span>
                            </div>
                          </div>


                          <div className="rewards-section">

                            <div className="rewards-section-title">
                              Variable Pay
                            </div>

                            <div className="rewards-item">
                              <span>Performance Bonus</span>
                              <span>{formatINR(rewards.variableBonus * 0.7)}</span>
                            </div>

                            <div className="rewards-item">
                              <span>ESOP / Retention</span>
                              <span>{formatINR(rewards.variableBonus * 0.3)}</span>
                            </div>

                          </div>


                          <div className="rewards-section">

                            <div className="rewards-section-title">
                              Benefits
                            </div>

                            <div className="rewards-item">
                              <span>Health Insurance</span>
                              <span>{formatINR(rewards.benefits * 0.5)}</span>
                            </div>

                            <div className="rewards-item">
                              <span>PF Contribution</span>
                              <span>{formatINR(rewards.benefits * 0.35)}</span>
                            </div>

                            <div className="rewards-item">
                              <span>Gratuity</span>
                              <span>{formatINR(rewards.benefits * 0.15)}</span>
                            </div>

                          </div>


                          <div className="rewards-section">

                            <div className="rewards-section-title">
                              Perks
                            </div>

                            <div className="rewards-item">
                              <span>Fuel / Transport</span>
                              <span>{formatINR(rewards.perks * 0.5)}</span>
                            </div>

                            <div className="rewards-item">
                              <span>Mobile / Internet</span>
                              <span>{formatINR(rewards.perks * 0.2)}</span>
                            </div>

                            <div className="rewards-item">
                              <span>Meal Vouchers</span>
                              <span>{formatINR(rewards.perks * 0.3)}</span>
                            </div>

                          </div>

                        </div>

                      </td>

                    </tr>
                  )}

                </React.Fragment>
              );

            })}

        </tbody>

      </table>

    </div>

    <Pagination
      totalItems={eligibleEmps.length}
      itemsPerPage={PER_PAGE}
      currentPage={page}
      onPageChange={handlePageChange}
    />

  </Card>

</div>


);
};

export default TotalRewards;
