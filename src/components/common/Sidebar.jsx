import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ROLE_LABELS, PHASES } from '../../data/constants';
import './Sidebar.css';

const navItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
    roles: ['cfo', 'hr_admin', 'manager', 'approver', 'employee'],
    phase: null,
  },
  {
    id: 'phase1',
    label: 'Phase 1: Budget Setup',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
    roles: ['cfo', 'hr_admin'],
    phase: 1,
  },
  {
    id: 'phase2',
    label: 'Phase 2: Cycle Config',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
      </svg>
    ),
    roles: ['cfo', 'hr_admin'],
    phase: 2,
  },
  {
    id: 'phase3',
    label: 'Phase 3: Mgr Planning',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    roles: ['cfo', 'hr_admin', 'manager'],
    phase: 3,
  },
  {
    id: 'phase4',
    label: 'Phase 4: Approvals',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
    ),
    roles: ['cfo', 'hr_admin', 'approver'],
    phase: 4,
  },
  {
    id: 'phase5',
    label: 'Phase 5: Payroll',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="5" width="20" height="14" rx="2"/>
        <line x1="2" y1="10" x2="22" y2="10"/>
      </svg>
    ),
    roles: ['cfo', 'hr_admin'],
    phase: 5,
  },
];

const Sidebar = ({ onCollapse }) => {
  const { currentUser, currentPage, navigate, phaseStatus } = useApp();
  const [collapsed, setCollapsed] = useState(false);

  const handleToggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    if (onCollapse) onCollapse(next);
  };

  const visibleItems = navItems.filter(item =>
    item.roles.includes(currentUser?.role)
  );

  const getPhaseStatusIcon = (phase) => {
    if (!phase) return null;
    const status = phaseStatus[phase];
    if (status === 'completed') {
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="phase-check">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      );
    }
    if (status === 'in_progress') {
      return <span className="phase-dot active"></span>;
    }
    return <span className="phase-dot"></span>;
  };

  const getPhaseColor = (phase) => {
    const colors = { 1: 'phase1', 2: 'phase2', 3: 'phase3', 4: 'phase4', 5: 'phase5' };
    return colors[phase] || '';
  };

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">CB</div>
          {!collapsed && (
            <div className="sidebar-brand-text">
              <span className="sidebar-brand-name">CompBudget</span>
              <span className="sidebar-brand-sub">FY2025-26</span>
            </div>
          )}
        </div>
        <button className="sidebar-toggle" onClick={handleToggle} aria-label="Toggle sidebar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            {collapsed ? <polyline points="9 18 15 12 9 6"/> : <polyline points="15 18 9 12 15 6"/>}
          </svg>
        </button>
      </div>

      {!collapsed && currentUser && (
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">{currentUser.avatar}</div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{currentUser.name}</span>
            <span className="sidebar-user-role">{ROLE_LABELS[currentUser.role]}</span>
          </div>
        </div>
      )}

      <nav className="sidebar-nav">
        {!collapsed && <div className="sidebar-nav-label">Navigation</div>}
        <ul className="sidebar-nav-list">
          {visibleItems.map(item => (
            <li key={item.id}>
              <button
                className={`sidebar-nav-item ${currentPage === item.id ? 'active' : ''} ${item.phase ? getPhaseColor(item.phase) : ''}`}
                onClick={() => navigate(item.id, item.phase)}
                title={collapsed ? item.label : ''}
              >
                <span className="sidebar-nav-icon">{item.icon}</span>
                {!collapsed && (
                  <>
                    <span className="sidebar-nav-text">{item.label}</span>
                    {item.phase && getPhaseStatusIcon(item.phase)}
                  </>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {!collapsed && (
        <div className="sidebar-footer">
          <div className="sidebar-cycle-info">
            <div className="sidebar-cycle-label">Active Cycle</div>
            <div className="sidebar-cycle-name">FY2026 Annual Increment</div>
            <div className="sidebar-cycle-deadline">Deadline: Apr 15, 2026</div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
