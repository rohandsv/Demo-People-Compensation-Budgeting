import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../data/constants';
import Card from '../common/Card';
import './Phase2.css';

const GuardrailsConfig = () => {
  const { approvalConfig, setApprovalConfig, departments, cycle, addNotification } = useApp();
  const [config, setConfig] = useState({ ...approvalConfig });

  const handleSave = () => {
    setApprovalConfig(config);
    addNotification('success', 'Budget guardrails and approval chain saved.');
  };

  const moveLevel = (idx, dir) => {
    const levels = [...config.levels];
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= levels.length) return;
    [levels[idx], levels[newIdx]] = [levels[newIdx], levels[idx]];
    setConfig(p => ({ ...p, levels }));
  };

  return (
    <div className="phase2-section">
      <div className="two-col">
        <Card title="Budget Controls &amp; Guardrails" subtitle="Configure budget warning and hard-stop thresholds">
          <div className="form-group">
            <label className="form-label">Warning Threshold: {config.warningThreshold}%</label>
            <input
              type="range"
              className="split-slider"
              min="50"
              max="100"
              value={config.warningThreshold}
              style={{ '--color': '#d97706' }}
              onChange={e => setConfig(p => ({ ...p, warningThreshold: parseInt(e.target.value) }))}
            />
            <div className="slider-labels">
              <span>50%</span>
              <span style={{ color: '#d97706', fontWeight: 700 }}>{config.warningThreshold}% warning trigger</span>
              <span>100%</span>
            </div>
            <p className="text-small text-muted" style={{ marginTop: 6 }}>
              A warning will appear when budget utilization exceeds {config.warningThreshold}%.
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">Hard Block at 100%</label>
            <label className="checkbox-item toggle-item">
              <input
                type="checkbox"
                checked={config.hardBlock}
                onChange={e => setConfig(p => ({ ...p, hardBlock: e.target.checked }))}
              />
              <div>
                <div className="toggle-label">Enable hard block when budget is exceeded</div>
                <div className="toggle-desc text-muted text-small">
                  {config.hardBlock
                    ? 'Managers cannot submit proposals that exceed 100% of allocated budget.'
                    : 'Managers can exceed budget with mandatory justification.'}
                </div>
              </div>
            </label>
          </div>

          <div className="form-group">
            <label className="form-label">Board Approval Threshold (%)</label>
            <div className="input-prefix-wrap">
              <span className="input-prefix" style={{ left: 8 }}>%</span>
              <input
                className="form-input"
                type="number"
                style={{ paddingLeft: 28 }}
                value={config.boardThreshold}
                min="1"
                max="30"
                onChange={e => setConfig(p => ({ ...p, boardThreshold: parseInt(e.target.value) || 8 }))}
              />
            </div>
            <p className="text-small text-muted" style={{ marginTop: 4 }}>
              If total salary increase &gt; {config.boardThreshold}%, board approval is required.
            </p>
          </div>

          <div className="dept-budget-links">
            <div className="form-label" style={{ marginBottom: 10 }}>Department Budget Links</div>
            {departments.map(dept => (
              <div key={dept.id} className="dept-link-row">
                <span className="dept-link-name">{dept.name}</span>
                <span className="dept-link-budget">{formatINR(dept.budgetAllocated)}</span>
                <span className="dept-link-status linked">Linked</span>
              </div>
            ))}
          </div>

          <button className="btn btn-primary" onClick={handleSave} style={{ marginTop: 16 }}>
            Save Guardrails
          </button>
        </Card>

        <Card title="Approval Chain Configuration" subtitle="Define the approval workflow order">
          <p className="text-small text-muted" style={{ marginBottom: 16 }}>
            Drag or reorder the approval levels. Proposals flow through each level sequentially.
          </p>
          <div className="approval-chain">
            {config.levels.map((level, idx) => (
              <div key={level} className="approval-chain-item">
                <div className="chain-level-num">{idx + 1}</div>
                <div className="chain-level-name">{level}</div>
                <div className="chain-arrows">
                  <button className="btn-icon" onClick={() => moveLevel(idx, -1)} disabled={idx === 0}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="18 15 12 9 6 15"/>
                    </svg>
                  </button>
                  <button className="btn-icon" onClick={() => moveLevel(idx, 1)} disabled={idx === config.levels.length - 1}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
            <div className="approval-chain-item conditional">
              <div className="chain-level-num conditional">?</div>
              <div className="chain-level-name">
                Board Approval
                <span className="chain-conditional-label">if &gt;{config.boardThreshold}%</span>
              </div>
            </div>
          </div>

          <div className="guardrail-summary">
            <div className="guardrail-row">
              <span>Warning at</span>
              <strong className="text-warning">{config.warningThreshold}%</strong>
            </div>
            <div className="guardrail-row">
              <span>Hard Block</span>
              <strong className={config.hardBlock ? 'text-danger' : 'text-success'}>
                {config.hardBlock ? 'Enabled at 100%' : 'Disabled'}
              </strong>
            </div>
            <div className="guardrail-row">
              <span>Board Threshold</span>
              <strong>{config.boardThreshold}% increase</strong>
            </div>
            <div className="guardrail-row">
              <span>Approval Levels</span>
              <strong>{config.levels.length} + conditional</strong>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default GuardrailsConfig;
