import React from 'react';
import PhaseNav from '../components/common/PhaseNav';
import ManagerDashboard from '../components/phase3/ManagerDashboard';

const Phase3Page = () => {
  return (
    <div>
      <div className="page-header">
        <h1>Phase 3: Manager Planning</h1>
        <p>Review employee performance, assign hike percentages, and submit proposals within budget.</p>
      </div>
      <PhaseNav currentPhase={3} />
      <div className="phase-banner phase-3">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
        Manager Planning — Assign and justify hike percentages for your direct reports.
      </div>
      <ManagerDashboard />
    </div>
  );
};

export default Phase3Page;
