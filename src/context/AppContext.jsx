import React, { createContext, useContext, useState, useCallback } from 'react';
import { employees as initialEmployees, departments as initialDepts, cycle as initialCycle, getSuggestedHike, isEligible } from '../data/mockData';
import { DEMO_USERS } from '../data/constants';

const AppContext = createContext(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

const initHikeProposals = () => {
  const proposals = {};
  initialEmployees.forEach(emp => {
    const { eligible, reason } = isEligible(emp);
    const suggested = getSuggestedHike(emp);
    proposals[emp.id] = {
      empId: emp.id,
      suggestedHike: suggested,
      proposedHike: eligible ? suggested : 0,
      justification: '',
      status: 'pending', // pending, submitted, approved, rejected, modified
      eligible,
      ineligibleReason: reason,
      approvalLevel: 0,
      approvalHistory: [],
      payrollSynced: false,
      letterGenerated: false,
      notificationSent: false,
      notificationAck: false,
    };
  });
  return proposals;
};

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [currentPhase, setCurrentPhase] = useState(1);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'info', message: 'FY2025 compensation cycle has been activated.', time: '2 hours ago', read: false },
    { id: 2, type: 'warning', message: 'IT department budget at 85% utilization.', time: '4 hours ago', read: false },
    { id: 3, type: 'success', message: 'Phase 1 budget setup completed successfully.', time: '1 day ago', read: true },
  ]);
  const [hikeProposals, setHikeProposals] = useState(initHikeProposals);
  const [employees, setEmployees] = useState(initialEmployees);
  const [departments, setDepartments] = useState(initialDepts);
  const [cycle, setCycle] = useState(initialCycle);
  const [orgBudget, setOrgBudget] = useState({
    fy: 'FY2025-26',
    totalBudget: 50000000,
    description: 'Annual compensation budget for FY2025-26',
    status: 'approved', // draft, submitted, approved
    meritSplit: 60,
    variableSplit: 25,
    benefitsSplit: 15,
  });
  const [phaseStatus, setPhaseStatus] = useState({
    1: 'completed',
    2: 'completed',
    3: 'in_progress',
    4: 'pending',
    5: 'pending',
  });
  const [approvalConfig, setApprovalConfig] = useState({
    levels: ['Manager', 'HR BP', 'Finance', 'CHRO'],
    boardThreshold: 8,
    warningThreshold: 90,
    hardBlock: true,
  });
  const [eligibilityRules, setEligibilityRules] = useState({
    minTenure: 6,
    includeStatuses: ['Active'],
    excludePIP: true,
    excludedEmployees: [8],
  });
  const [salaryBandsState, setSalaryBandsState] = useState([
    { grade: "A", level: "Senior", minSalary: 800000, midpointSalary: 1300000, maxSalary: 1800000 },
    { grade: "B", level: "Mid-Level", minSalary: 500000, midpointSalary: 900000, maxSalary: 1300000 },
    { grade: "C", level: "Junior", minSalary: 300000, midpointSalary: 550000, maxSalary: 800000 },
  ]);

  const login = useCallback((role) => {
    const user = DEMO_USERS.find(u => u.role === role) || DEMO_USERS[0];
    setCurrentUser(user);
    setCurrentPage('dashboard');
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setCurrentPage('dashboard');
  }, []);

  const navigate = useCallback((page, phase = null) => {
    setCurrentPage(page);
    if (phase) setCurrentPhase(phase);
  }, []);

  const updateHike = useCallback((empId, hikePercent, justification) => {
    setHikeProposals(prev => ({
      ...prev,
      [empId]: {
        ...prev[empId],
        proposedHike: parseFloat(hikePercent) || 0,
        justification: justification || prev[empId].justification,
      }
    }));
    // Update cycle budget consumed
    const emp = initialEmployees.find(e => e.id === empId);
    if (emp) {
      const oldHike = hikeProposals[empId]?.proposedHike || 0;
      const newHike = parseFloat(hikePercent) || 0;
      const diff = (newHike - oldHike) / 100 * emp.currentCTC;
      setCycle(prev => ({ ...prev, budgetConsumed: Math.max(0, prev.budgetConsumed + diff) }));
    }
  }, [hikeProposals]);

  const submitProposal = useCallback((empIds, comment) => {
    setHikeProposals(prev => {
      const updated = { ...prev };
      empIds.forEach(id => {
        updated[id] = { ...updated[id], status: 'submitted', submittedAt: new Date().toISOString(), managerComment: comment };
      });
      return updated;
    });
    addNotification('success', `${empIds.length} hike proposals submitted for approval.`);
  }, []);

  const approveHike = useCallback((empId, comment, modifiedHike = null) => {
    setHikeProposals(prev => {
      const current = prev[empId];
      const newLevel = current.approvalLevel + 1;
      return {
        ...prev,
        [empId]: {
          ...current,
          approvalLevel: newLevel,
          status: newLevel >= 3 ? 'approved' : 'submitted',
          proposedHike: modifiedHike !== null ? modifiedHike : current.proposedHike,
          approvalHistory: [...current.approvalHistory, {
            level: newLevel,
            action: 'approved',
            comment,
            timestamp: new Date().toISOString(),
            approver: 'HR BP'
          }]
        }
      };
    });
    addNotification('success', `Hike approved for employee.`);
  }, []);

  const rejectHike = useCallback((empId, comment) => {
    setHikeProposals(prev => ({
      ...prev,
      [empId]: {
        ...prev[empId],
        status: 'rejected',
        approvalHistory: [...prev[empId].approvalHistory, {
          level: prev[empId].approvalLevel + 1,
          action: 'rejected',
          comment,
          timestamp: new Date().toISOString(),
          approver: 'HR BP'
        }]
      }
    }));
    addNotification('warning', `Hike proposal rejected.`);
  }, []);

  const sendBackHike = useCallback((empId, comment) => {
    setHikeProposals(prev => ({
      ...prev,
      [empId]: {
        ...prev[empId],
        status: 'sent_back',
        approvalHistory: [...prev[empId].approvalHistory, {
          level: prev[empId].approvalLevel,
          action: 'sent_back',
          comment,
          timestamp: new Date().toISOString(),
          approver: 'HR BP'
        }]
      }
    }));
  }, []);

  const syncPayroll = useCallback((empId) => {
    setHikeProposals(prev => ({
      ...prev,
      [empId]: { ...prev[empId], payrollSynced: true }
    }));
  }, []);

  const generateLetter = useCallback((empId) => {
    setHikeProposals(prev => ({
      ...prev,
      [empId]: { ...prev[empId], letterGenerated: true }
    }));
  }, []);

  const sendNotification = useCallback((empId) => {
    setHikeProposals(prev => ({
      ...prev,
      [empId]: { ...prev[empId], notificationSent: true }
    }));
  }, []);

  const addNotification = useCallback((type, message) => {
    setNotifications(prev => [{
      id: Date.now(),
      type,
      message,
      time: 'Just now',
      read: false,
    }, ...prev]);
  }, []);

  const markNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const updateOrgBudget = useCallback((data) => {
    setOrgBudget(prev => ({ ...prev, ...data }));
  }, []);

  const updateDeptAllocation = useCallback((deptId, amount) => {
    setDepartments(prev => prev.map(d => d.id === deptId ? { ...d, budgetAllocated: amount } : d));
  }, []);

  const getDeptBudgetUsed = useCallback((deptId) => {
    return employees
      .filter(e => e.dept === deptId)
      .reduce((sum, emp) => {
        const prop = hikeProposals[emp.id];
        return sum + (prop ? (prop.proposedHike / 100) * emp.currentCTC : 0);
      }, 0);
  }, [employees, hikeProposals]);

  const getTotalBudgetUsed = useCallback(() => {
    return employees.reduce((sum, emp) => {
      const prop = hikeProposals[emp.id];
      return sum + (prop && prop.eligible ? (prop.proposedHike / 100) * emp.currentCTC : 0);
    }, 0);
  }, [employees, hikeProposals]);

  const getAvgHike = useCallback(() => {
    const eligible = employees.filter(e => hikeProposals[e.id]?.eligible);
    if (!eligible.length) return 0;
    const total = eligible.reduce((sum, e) => sum + (hikeProposals[e.id]?.proposedHike || 0), 0);
    return total / eligible.length;
  }, [employees, hikeProposals]);

  return (
    <AppContext.Provider value={{
      currentUser, currentPage, currentPhase,
      notifications, hikeProposals, employees, departments, cycle, orgBudget,
      phaseStatus, approvalConfig, eligibilityRules, salaryBandsState,
      login, logout, navigate,
      updateHike, submitProposal, approveHike, rejectHike, sendBackHike,
      syncPayroll, generateLetter, sendNotification,
      addNotification, markNotificationsRead,
      updateOrgBudget, updateDeptAllocation,
      getDeptBudgetUsed, getTotalBudgetUsed, getAvgHike,
      setApprovalConfig, setEligibilityRules, setSalaryBandsState, setCycle, setPhaseStatus,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
