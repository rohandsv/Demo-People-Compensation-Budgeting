import React from 'react';
import { useApp } from '../../context/AppContext';
import { PHASES } from '../../data/constants';
import './PhaseNav.css';

const PhaseNav = ({ currentPhase }) => {
  const { navigate, phaseStatus } = useApp();

  const getStatus = (phaseId) => {
    return phaseStatus[phaseId] || 'pending';
  };

  const handleClick = (phaseId) => {
    navigate(`phase${phaseId}`, phaseId);
  };

  return (
    <div className="phase-nav">
      {PHASES.map((phase, index) => {
        const status = getStatus(phase.id);
        const isActive = phase.id === currentPhase;
        const isCompleted = status === 'completed';
        const isPending = status === 'pending';

        return (
          <React.Fragment key={phase.id}>
            <button
              className={`phase-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${isPending ? 'pending' : ''}`}
              onClick={() => handleClick(phase.id)}
              data-phase={phase.id}
            >
              <div className="phase-step-circle">
                {isCompleted ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ) : (
                  <span>{phase.id}</span>
                )}
              </div>
              <div className="phase-step-info">
                <span className="phase-step-label">Phase {phase.id}</span>
                <span className="phase-step-name">{phase.name}</span>
              </div>
            </button>
            {index < PHASES.length - 1 && (
              <div className={`phase-connector ${isCompleted ? 'completed' : ''}`}></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default PhaseNav;
