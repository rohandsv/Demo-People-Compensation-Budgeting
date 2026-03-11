import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../data/constants';
import Card from '../common/Card';
import './Phase1.css';

const CompTypeSplit = () => {
  const { orgBudget, updateOrgBudget, addNotification } = useApp();
  const [splits, setSplits] = useState({
    merit: orgBudget.meritSplit,
    variable: orgBudget.variableSplit,
    benefits: orgBudget.benefitsSplit,
  });

  const total = splits.merit + splits.variable + splits.benefits;
  const isValid = total === 100;

  const handleChange = (key, val) => {
    const num = Math.max(0, Math.min(100, parseInt(val) || 0));
    setSplits(p => ({ ...p, [key]: num }));
  };

  const handleSave = () => {
    if (!isValid) return;
    updateOrgBudget({ meritSplit: splits.merit, variableSplit: splits.variable, benefitsSplit: splits.benefits });
    addNotification('success', 'Compensation type split saved.');
  };

  const items = [
    { key: 'merit', label: 'Merit / Annual Hike', color: '#3b82f6', desc: 'Base salary increment based on performance and market' },
    { key: 'variable', label: 'Variable Bonus', color: '#10b981', desc: 'Performance-linked variable pay, STI, commissions' },
    { key: 'benefits', label: 'Benefits & Perks', color: '#f59e0b', desc: 'Health insurance, allowances, ESOP, retention bonus' },
  ];

  const totalBudget = orgBudget.totalBudget;

  // Donut chart via CSS
  const donutSegments = (() => {
    let offset = 0;
    return items.map(item => {
      const pct = splits[item.key];
      const seg = { pct, offset, color: item.color };
      offset += pct;
      return seg;
    });
  })();

  return (
    <div className="phase1-section">
      <div className="two-col">
        <Card title="Compensation Type Split" subtitle="Define how budget is distributed across compensation types">
          {!isValid && (
            <div className="budget-alert">
              Total must equal 100%. Currently: {total}%
            </div>
          )}
          {isValid && (
            <div className="budget-success">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Split is balanced at 100%.
            </div>
          )}

          {items.map(item => (
            <div key={item.key} className="split-item">
              <div className="split-item-header">
                <div className="split-color-dot" style={{ background: item.color }}></div>
                <div className="split-item-info">
                  <div className="split-item-label">{item.label}</div>
                  <div className="split-item-desc text-muted text-small">{item.desc}</div>
                </div>
                <div className="split-item-values">
                  <input
                    className="split-pct-input"
                    type="number"
                    min="0"
                    max="100"
                    value={splits[item.key]}
                    onChange={e => handleChange(item.key, e.target.value)}
                  />
                  <span className="split-pct-sym">%</span>
                </div>
              </div>
              <input
                className="split-slider"
                type="range"
                min="0"
                max="100"
                value={splits[item.key]}
                style={{ '--color': item.color }}
                onChange={e => handleChange(item.key, e.target.value)}
              />
              <div className="split-amount">{formatINR(totalBudget * splits[item.key] / 100)}</div>
            </div>
          ))}

          <div className="split-total-row">
            <span>Total</span>
            <span className={isValid ? 'text-success font-bold' : 'text-danger font-bold'}>{total}%</span>
          </div>

          <button className="btn btn-primary" onClick={handleSave} disabled={!isValid} style={{ marginTop: 16 }}>
            Save Split Configuration
          </button>
        </Card>

        <Card title="Visual Distribution" subtitle="Budget allocation chart">
          <div className="donut-chart-wrap">
            <div className="donut-chart">
              <svg viewBox="0 0 200 200" className="donut-svg">
                {donutSegments.map((seg, i) => {
                  const r = 80;
                  const cx = 100, cy = 100;
                  const circumference = 2 * Math.PI * r;
                  const dashArray = (seg.pct / 100) * circumference;
                  const dashOffset = -(seg.offset / 100) * circumference;
                  return (
                    <circle
                      key={i}
                      cx={cx}
                      cy={cy}
                      r={r}
                      fill="none"
                      stroke={seg.color}
                      strokeWidth="40"
                      strokeDasharray={`${dashArray} ${circumference}`}
                      strokeDashoffset={dashOffset}
                      transform="rotate(-90 100 100)"
                    />
                  );
                })}
                <circle cx="100" cy="100" r="55" fill="white"/>
                <text x="100" y="96" textAnchor="middle" fontSize="12" fill="#334155" fontWeight="700">
                  {formatINR(totalBudget).replace('₹', '')}
                </text>
                <text x="100" y="112" textAnchor="middle" fontSize="10" fill="#64748b">
                  Total Budget
                </text>
              </svg>
            </div>
            <div className="donut-legend">
              {items.map(item => (
                <div key={item.key} className="donut-legend-item">
                  <div className="donut-legend-dot" style={{ background: item.color }}></div>
                  <div className="donut-legend-text">
                    <div className="donut-legend-label">{item.label}</div>
                    <div className="donut-legend-values">
                      <span className="donut-legend-pct">{splits[item.key]}%</span>
                      <span className="donut-legend-amt">{formatINR(totalBudget * splits[item.key] / 100)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CompTypeSplit;
