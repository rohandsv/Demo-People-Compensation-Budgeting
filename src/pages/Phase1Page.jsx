import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import PhaseNav from '../components/common/PhaseNav';
import OrgBudgetForm from '../components/phase1/OrgBudgetForm';
import DeptAllocationTable from '../components/phase1/DeptAllocationTable';
import CostCenterTable from '../components/phase1/CostCenterTable';
import CompTypeSplit from '../components/phase1/CompTypeSplit';
import BudgetLock from '../components/phase1/BudgetLock';

const TABS = [
  { id: 'org', label: 'Organisation Budget' },
  { id: 'dept', label: 'Department Allocation' },
  { id: 'cost', label: 'Cost Centers' },
  { id: 'comp', label: 'Compensation Split' },
  { id: 'lock', label: 'Lock & Publish' },
];

const Phase1Page = () => {
  const [activeTab, setActiveTab] = useState('org');

  return (
    <div>
      <div className="page-header">
        <h1>Phase 1: Budget Setup</h1>
        <p>Configure organisational budget, department allocations, and compensation type splits.</p>
      </div>
      <PhaseNav currentPhase={1} />
      <div className="phase-banner phase-1">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="1" x2="12" y2="23"/>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
        Budget Setup — Define your organisation's total compensation budget and allocate to departments.
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
      {activeTab === 'org' && <OrgBudgetForm />}
      {activeTab === 'dept' && <DeptAllocationTable />}
      {activeTab === 'cost' && <CostCenterTable />}
      {activeTab === 'comp' && <CompTypeSplit />}
      {activeTab === 'lock' && <BudgetLock />}
    </div>
  );
};

export default Phase1Page;
