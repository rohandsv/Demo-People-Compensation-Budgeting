import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../data/constants';
import Card from '../common/Card';
import './Phase2.css';

const SalaryBands = () => {
  const { salaryBandsState, setSalaryBandsState, addNotification } = useApp();
  const [bands, setBands] = useState(salaryBandsState.map((b, i) => ({ ...b, id: i + 1 })));
  const [editRow, setEditRow] = useState(null);

  const handleChange = (idx, field, value) => {
    setBands(prev => prev.map((b, i) =>
      i === idx ? { ...b, [field]: parseFloat(value) || 0 } : b
    ));
  };

  const handleSave = () => {
    setSalaryBandsState(bands);
    addNotification('success', 'Salary bands saved successfully.');
    setEditRow(null);
  };

  const addRow = () => {
    setBands(prev => [...prev, { id: Date.now(), grade: 'D', level: 'Entry', minSalary: 200000, midpointSalary: 350000, maxSalary: 500000 }]);
  };

  const deleteRow = (idx) => {
    setBands(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="phase2-section">
      <Card
        title="Salary Bands Configuration"
        subtitle="Define compensation ranges for each grade level"
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary btn-sm" onClick={addRow}>+ Add Grade</button>
            <button className="btn btn-primary btn-sm" onClick={handleSave}>Save Bands</button>
          </div>
        }
      >
        <table className="alloc-table">
          <thead>
            <tr>
              <th>Grade</th>
              <th>Level</th>
              <th className="text-right">Min Salary</th>
              <th className="text-right">Midpoint</th>
              <th className="text-right">Max Salary</th>
              <th className="text-right">Range Spread</th>
              <th>Range Visual</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {bands.map((band, idx) => {
              const spread = band.minSalary > 0 ? (((band.maxSalary - band.minSalary) / band.minSalary) * 100).toFixed(0) : 0;
              const isEditing = editRow === idx;
              return (
                <tr key={band.id}>
                  <td>
                    {isEditing ? (
                      <input className="inline-input" style={{ width: 50 }} value={band.grade}
                        onChange={e => handleChange(idx, 'grade', e.target.value)} />
                    ) : (
                      <span className="grade-badge">{band.grade}</span>
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input className="inline-input" style={{ width: 90 }} value={band.level}
                        onChange={e => handleChange(idx, 'level', e.target.value)} />
                    ) : band.level}
                  </td>
                  <td className="text-right">
                    {isEditing ? (
                      <input className="inline-input" type="number" value={band.minSalary}
                        onChange={e => handleChange(idx, 'minSalary', e.target.value)} />
                    ) : <span className="salary-cell">{formatINR(band.minSalary)}</span>}
                  </td>
                  <td className="text-right">
                    {isEditing ? (
                      <input className="inline-input" type="number" value={band.midpointSalary}
                        onChange={e => handleChange(idx, 'midpointSalary', e.target.value)} />
                    ) : <span className="salary-cell midpoint">{formatINR(band.midpointSalary)}</span>}
                  </td>
                  <td className="text-right">
                    {isEditing ? (
                      <input className="inline-input" type="number" value={band.maxSalary}
                        onChange={e => handleChange(idx, 'maxSalary', e.target.value)} />
                    ) : <span className="salary-cell">{formatINR(band.maxSalary)}</span>}
                  </td>
                  <td className="text-right">
                    <span className="spread-badge">{spread}%</span>
                  </td>
                  <td>
                    <div className="salary-range-bar">
                      <div className="salary-range-fill" style={{ width: '100%' }}>
                        <div
                          className="salary-midpoint-marker"
                          style={{
                            left: band.maxSalary > band.minSalary
                              ? `${((band.midpointSalary - band.minSalary) / (band.maxSalary - band.minSalary)) * 100}%`
                              : '50%'
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="salary-range-labels">
                      <span>{formatINR(band.minSalary)}</span>
                      <span style={{ color: '#1e3a8a', fontWeight: 700 }}>Mid: {formatINR(band.midpointSalary)}</span>
                      <span>{formatINR(band.maxSalary)}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="btn-icon" onClick={() => setEditRow(isEditing ? null : idx)}>
                        {isEditing ? (
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        ) : (
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        )}
                      </button>
                      {bands.length > 1 && (
                        <button className="btn-icon" onClick={() => deleteRow(idx)} style={{ color: '#ef4444' }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="compa-calculator">
          <div className="compa-title">Compa-Ratio Calculator</div>
          <p className="text-small text-muted">Compa-ratio = Actual Salary / Band Midpoint</p>
          <div className="compa-grid">
            {bands.map(band => (
              <div key={band.id} className="compa-card">
                <div className="compa-grade">{band.grade} — {band.level}</div>
                <div className="compa-row">
                  <span>0.80</span>
                  <div className="compa-bar">
                    <div className="compa-fill" style={{ width: '80%', background: '#3b82f6' }}></div>
                    <div className="compa-marker" style={{ left: '100%' }}></div>
                  </div>
                  <span>1.20</span>
                </div>
                <div className="compa-labels">
                  <span style={{ color: '#3b82f6' }}>Below mid</span>
                  <span style={{ color: '#166534' }}>At mid ({formatINR(band.midpointSalary)})</span>
                  <span style={{ color: '#92400e' }}>Above mid</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SalaryBands;
