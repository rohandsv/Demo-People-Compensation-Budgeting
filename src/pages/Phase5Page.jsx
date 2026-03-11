import React, { useState } from 'react';
import PhaseNav from '../components/common/PhaseNav';
import PayrollSyncStatus from '../components/phase5/PayrollSyncStatus';
import IncrementLetters from '../components/phase5/IncrementLetters';
import TotalRewards from '../components/phase5/TotalRewards';
import EmployeeNotify from '../components/phase5/EmployeeNotify';
import FinanceCostReport from '../components/phase5/FinanceCostReport';

const TABS = [
  { id: 'payroll', label: 'Payroll Sync' },
  { id: 'letters', label: 'Increment Letters' },
  { id: 'rewards', label: 'Total Rewards' },
  { id: 'notify', label: 'Employee Notifications' },
  { id: 'report', label: 'Finance Cost Report' },
];

const Phase5Page = () => {
  const [activeTab, setActiveTab] = useState('payroll');

  return (
    <div>
      <div className="page-header">
        <h1>Phase 5: Payroll &amp; Letters</h1>
        <p>Sync approved hikes to payroll, generate increment letters, and notify employees.</p>
      </div>
      <PhaseNav currentPhase={5} />
      <div className="phase-banner phase-5">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="5" width="20" height="14" rx="2"/>
          <line x1="2" y1="10" x2="22" y2="10"/>
        </svg>
        Payroll Integration — Finalize and execute compensation changes across all systems.
      </div>
      <div className="tabs">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {activeTab === 'payroll' && <PayrollSyncStatus />}
      {activeTab === 'letters' && <IncrementLetters />}
      {activeTab === 'rewards' && <TotalRewards />}
      {activeTab === 'notify' && <EmployeeNotify />}
      {activeTab === 'report' && <FinanceCostReport />}
    </div>
  );
};

export default Phase5Page;
