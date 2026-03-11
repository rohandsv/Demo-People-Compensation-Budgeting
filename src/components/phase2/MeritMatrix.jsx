import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { meritMatrix as defaultMatrix } from '../../data/mockData';
import Card from '../common/Card';
import './Phase2.css';

const RATINGS = [5, 4, 3, 2, 1];
const COMPA_RANGES = ['Below 0.85', '0.85 - 1.00', 'Above 1.00'];
const RATING_LABELS = { 5: 'Exceptional', 4: 'Exceeds', 3: 'Meets', 2: 'Below', 1: 'Poor' };

const MeritMatrix = () => {
  const { addNotification } = useApp();
  const [matrix, setMatrix] = useState(() => {
    const m = {};
    RATINGS.forEach(r => {
      COMPA_RANGES.forEach(c => {
        const entry = defaultMatrix.find(e => e.rating === r && e.compaRatioRange === c);
        const key = `${r}_${c}`;
        m[key] = entry ? { min: entry.minHike, max: entry.maxHike } : { min: 0, max: 0 };
      });
    });
    // Handle rating 1 with "All" range
    COMPA_RANGES.forEach(c => {
      const key = `1_${c}`;
      m[key] = { min: 0, max: 0 };
    });
    return m;
  });

  const handleChange = (rating, compaRange, field, val) => {
    const key = `${rating}_${compaRange}`;
    setMatrix(prev => ({
      ...prev,
      [key]: { ...prev[key], [field]: parseInt(val) || 0 }
    }));
  };

  const handleReset = () => {
    const m = {};
    RATINGS.forEach(r => {
      COMPA_RANGES.forEach(c => {
        const entry = defaultMatrix.find(e => e.rating === r && (e.compaRatioRange === c || (r === 1 && e.compaRatioRange === 'All')));
        const key = `${r}_${c}`;
        m[key] = entry ? { min: entry.minHike, max: entry.maxHike } : { min: 0, max: 0 };
      });
    });
    setMatrix(m);
    addNotification('info', 'Merit matrix reset to default values.');
  };

  const handleSave = () => {
    addNotification('success', 'Merit matrix saved successfully.');
  };

  const getCellColor = (min, max) => {
    const avg = (min + max) / 2;
    if (avg >= 16) return '#16a34a';
    if (avg >= 12) return '#22c55e';
    if (avg >= 8) return '#3b82f6';
    if (avg >= 4) return '#94a3b8';
    return '#e2e8f0';
  };

  const getCellTextColor = (min, max) => {
    const avg = (min + max) / 2;
    return avg >= 4 ? 'white' : '#64748b';
  };

  return (
    <div className="phase2-section">
      <Card
        title="Merit Increase Matrix"
        subtitle="Define hike % ranges based on performance rating and compa-ratio position"
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary btn-sm" onClick={handleReset}>Reset to Default</button>
            <button className="btn btn-primary btn-sm" onClick={handleSave}>Save Matrix</button>
          </div>
        }
      >
        <div className="merit-matrix-wrap">
          <table className="merit-table">
            <thead>
              <tr>
                <th className="rating-header">Performance Rating</th>
                {COMPA_RANGES.map(range => (
                  <th key={range} className="compa-header">
                    <div className="compa-range-label">Compa-Ratio</div>
                    <div className="compa-range-value">{range}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RATINGS.map(rating => (
                <tr key={rating}>
                  <td className="rating-cell">
                    <div className="rating-display">
                      <div className="rating-stars">
                        {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
                      </div>
                      <div className="rating-num">{rating} — {RATING_LABELS[rating]}</div>
                    </div>
                  </td>
                  {COMPA_RANGES.map(range => {
                    const key = `${rating}_${range}`;
                    const cell = matrix[key] || { min: 0, max: 0 };
                    const bgColor = getCellColor(cell.min, cell.max);
                    const textColor = getCellTextColor(cell.min, cell.max);
                    return (
                      <td key={range} className="merit-cell" style={{ background: bgColor }}>
                        <div className="merit-cell-inner">
                          <div className="merit-range-inputs">
                            <div className="merit-input-group">
                              <span style={{ color: textColor, opacity: 0.7, fontSize: 10 }}>Min</span>
                              <input
                                className="merit-input"
                                type="number"
                                min="0"
                                max="50"
                                value={cell.min}
                                style={{ color: textColor }}
                                onChange={e => handleChange(rating, range, 'min', e.target.value)}
                              />
                              <span style={{ color: textColor }}>%</span>
                            </div>
                            <div className="merit-input-group">
                              <span style={{ color: textColor, opacity: 0.7, fontSize: 10 }}>Max</span>
                              <input
                                className="merit-input"
                                type="number"
                                min="0"
                                max="50"
                                value={cell.max}
                                style={{ color: textColor }}
                                onChange={e => handleChange(rating, range, 'max', e.target.value)}
                              />
                              <span style={{ color: textColor }}>%</span>
                            </div>
                          </div>
                          <div className="merit-avg" style={{ color: textColor, opacity: 0.8 }}>
                            Avg: {((cell.min + cell.max) / 2).toFixed(0)}%
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="merit-legend">
          <div className="merit-legend-title">Color Guide</div>
          <div className="merit-legend-items">
            {[
              { color: '#16a34a', label: '16%+' },
              { color: '#22c55e', label: '12-16%' },
              { color: '#3b82f6', label: '8-12%' },
              { color: '#94a3b8', label: '4-8%' },
              { color: '#e2e8f0', label: '0-4%' },
            ].map(item => (
              <div key={item.label} className="merit-legend-item">
                <div className="merit-legend-dot" style={{ background: item.color }}></div>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MeritMatrix;
