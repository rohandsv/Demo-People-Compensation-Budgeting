import React, { useState } from 'react';
import PhaseNav from '../components/common/PhaseNav';
import ApprovalDashboard from '../components/phase4/ApprovalDashboard';

const Phase4Page = () => {
  return (
    <div>
      <div className="page-header">
        <h1>Phase 4: Approval Workflow</h1>
        <p>Multi-level review and approval of hike proposals across all departments.</p>
      </div>
      <PhaseNav currentPhase={4} />
      <div className="phase-banner phase-4">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 11l3 3L22 4"/>
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
        </svg>
        Approval Workflow — HR BP, Finance, CHRO and Board approvals for compensation changes.
      </div>
      <ApprovalDashboard />
    </div>
  );
};

export default Phase4Page;
