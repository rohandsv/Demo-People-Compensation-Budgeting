import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { employees } from '../../data/mockData';
import { isEligible } from '../../data/mockData';
import Card from '../common/Card';
import StatusBadge from '../common/StatusBadge';
import './Phase2.css';

const EligibilityRules = () => {
  const { eligibilityRules, setEligibilityRules, addNotification } = useApp();
  const [rules, setRules] = useState({ ...eligibilityRules });
  const [search, setSearch] = useState('');

  const getEligibility = (emp) => {
    if (rules.excludedEmployees.includes(emp.id)) return { eligible: false, reason: 'Manually excluded' };
    if (rules.excludePIP && emp.onPIP) return { eligible: false, reason: 'On PIP' };
    if (emp.tenure < rules.minTenure) return { eligible: false, reason: `Tenure < ${rules.minTenure} months` };
    if (!rules.includeStatuses.includes(emp.status)) return { eligible: false, reason: `Status: ${emp.status}` };
    return { eligible: true, reason: '' };
  };

  const eligibleEmps = employees.filter(e => getEligibility(e).eligible);
  const ineligibleEmps = employees.filter(e => !getEligibility(e).eligible);

  const toggleExclude = (empId) => {
    setRules(p => ({
      ...p,
      excludedEmployees: p.excludedEmployees.includes(empId)
        ? p.excludedEmployees.filter(id => id !== empId)
        : [...p.excludedEmployees, empId]
    }));
  };

  const handleSave = () => {
    setEligibilityRules(rules);
    addNotification('success', `Eligibility rules saved. ${eligibleEmps.length} employees eligible.`);
  };

  const filteredEmps = search.trim()
    ? employees.filter(e => e.name.toLowerCase().includes(search.toLowerCase()) || e.empId.toLowerCase().includes(search.toLowerCase()))
    : employees;

  return (
    <div className="phase2-section">
      <div className="two-col">
        <Card title="Eligibility Configuration" subtitle="Define who is eligible for this compensation cycle">
          <div className="form-group">
            <label className="form-label">Minimum Tenure (months): {rules.minTenure}</label>
            <input
              type="range"
              className="split-slider"
              min="0"
              max="24"
              value={rules.minTenure}
              style={{ '--color': '#0e7490' }}
              onChange={e => setRules(p => ({ ...p, minTenure: parseInt(e.target.value) }))}
            />
            <div className="slider-labels">
              <span>0 months</span>
              <span style={{ fontWeight: 700, color: '#0e7490' }}>{rules.minTenure} months minimum</span>
              <span>24 months</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Eligible Employment Statuses</label>
            <div className="checkbox-group">
              {['Active', 'Notice Period', 'On Leave'].map(status => (
                <label key={status} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={rules.includeStatuses.includes(status)}
                    onChange={e => {
                      setRules(p => ({
                        ...p,
                        includeStatuses: e.target.checked
                          ? [...p.includeStatuses, status]
                          : p.includeStatuses.filter(s => s !== status)
                      }));
                    }}
                  />
                  <span>{status}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="checkbox-item toggle-item">
              <input
                type="checkbox"
                checked={rules.excludePIP}
                onChange={e => setRules(p => ({ ...p, excludePIP: e.target.checked }))}
              />
              <div>
                <div className="toggle-label">Exclude employees on PIP</div>
                <div className="toggle-desc text-muted text-small">Employees on Performance Improvement Plans will not be eligible</div>
              </div>
            </label>
          </div>

          <div className="eligibility-summary">
            <div className="elig-stat">
              <span className="elig-stat-value text-success">{eligibleEmps.length}</span>
              <span className="elig-stat-label">Eligible</span>
            </div>
            <div className="elig-divider"></div>
            <div className="elig-stat">
              <span className="elig-stat-value text-danger">{ineligibleEmps.length}</span>
              <span className="elig-stat-label">Ineligible</span>
            </div>
            <div className="elig-divider"></div>
            <div className="elig-stat">
              <span className="elig-stat-value">{employees.length}</span>
              <span className="elig-stat-label">Total</span>
            </div>
          </div>

          <button className="btn btn-primary" onClick={handleSave} style={{ marginTop: 16 }}>
            Save Eligibility Rules
          </button>
        </Card>

        <Card title="Employee Eligibility Preview" subtitle="Current eligibility status of all employees"
          actions={
            <input
              className="form-input"
              style={{ width: 180, padding: '6px 10px', fontSize: 12 }}
              placeholder="Search employees..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          }
        >
          <div className="eligibility-list">
            {filteredEmps.map(emp => {
              const { eligible, reason } = getEligibility(emp);
              const isExcluded = rules.excludedEmployees.includes(emp.id);
              return (
                <div key={emp.id} className={`elig-emp-row ${!eligible ? 'ineligible' : ''}`}>
                  <div className="elig-emp-info">
                    <div className="elig-emp-avatar" style={{ background: eligible ? '#0e7490' : '#94a3b8' }}>
                      {emp.name.charAt(0)}
                    </div>
                    <div>
                      <div className="elig-emp-name">{emp.name}</div>
                      <div className="text-small text-muted">{emp.empId} · {emp.dept} · {emp.tenure}m</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <StatusBadge status={eligible ? 'eligible' : 'ineligible'} size="sm" />
                    {!eligible && !isExcluded && (
                      <span className="inelig-reason">{reason}</span>
                    )}
                    <button
                      className={`btn btn-sm ${isExcluded ? 'btn-secondary' : 'btn-warning'}`}
                      onClick={() => toggleExclude(emp.id)}
                      style={{ fontSize: 11, padding: '3px 8px' }}
                    >
                      {isExcluded ? 'Include' : 'Exclude'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EligibilityRules;
