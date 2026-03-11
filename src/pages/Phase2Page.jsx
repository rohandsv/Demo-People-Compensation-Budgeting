import React, { useState } from 'react';
import PhaseNav from '../components/common/PhaseNav';
import CycleForm from '../components/phase2/CycleForm';
import EligibilityRules from '../components/phase2/EligibilityRules';
import SalaryBands from '../components/phase2/SalaryBands';
import MeritMatrix from '../components/phase2/MeritMatrix';
import GuardrailsConfig from '../components/phase2/GuardrailsConfig';
import ActivateCycle from '../components/phase2/ActivateCycle';

const TABS = [
  { id: 'cycle', label: 'Create Cycle' },
  { id: 'eligibility', label: 'Eligibility Rules' },
  { id: 'bands', label: 'Salary Bands' },
  { id: 'matrix', label: 'Merit Matrix' },
  { id: 'guardrails', label: 'Budget & Guardrails' },
  { id: 'activate', label: 'Activate Cycle' },
];

const Phase2Page = () => {
  const [activeTab, setActiveTab] = useState('cycle');

  return (
    <div>
      <div className="page-header">
        <h1>Phase 2: Cycle Configuration</h1>
        <p>Set up eligibility, salary bands, merit matrix, and guardrails for the compensation cycle.</p>
      </div>
      <PhaseNav currentPhase={2} />
      <div className="phase-banner phase-2">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
        </svg>
        Cycle Configuration — Define rules, policies, and parameters for this compensation cycle.
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
      {activeTab === 'cycle' && <CycleForm />}
      {activeTab === 'eligibility' && <EligibilityRules />}
      {activeTab === 'bands' && <SalaryBands />}
      {activeTab === 'matrix' && <MeritMatrix />}
      {activeTab === 'guardrails' && <GuardrailsConfig />}
      {activeTab === 'activate' && <ActivateCycle />}
    </div>
  );
};

export default Phase2Page;
