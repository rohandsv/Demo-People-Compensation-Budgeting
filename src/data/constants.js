export const ROLES = {
  CFO: 'cfo',
  HR_ADMIN: 'hr_admin',
  MANAGER: 'manager',
  APPROVER: 'approver',
  EMPLOYEE: 'employee',
};

export const ROLE_LABELS = {
  cfo: 'CFO / Finance Head',
  hr_admin: 'HR Administrator',
  manager: 'Department Manager',
  approver: 'HR Business Partner',
  employee: 'Employee',
};

export const PHASES = [
  { id: 1, name: "Budget Setup", shortName: "Phase 1", description: "Organisation & Department Budget Allocation" },
  { id: 2, name: "Cycle Config", shortName: "Phase 2", description: "Compensation Cycle Configuration" },
  { id: 3, name: "Manager Planning", shortName: "Phase 3", description: "Manager Hike Planning" },
  { id: 4, name: "Approval Workflow", shortName: "Phase 4", description: "Multi-Level Approval Process" },
  { id: 5, name: "Payroll & Letters", shortName: "Phase 5", description: "Payroll Integration & Increment Letters" },
];

export const PHASE_COLORS = {
  1: '#1e3a8a',
  2: '#0e7490',
  3: '#065f46',
  4: '#92400e',
  5: '#991b1b',
};

export const PHASE_BG_COLORS = {
  1: '#dbeafe',
  2: '#cffafe',
  3: '#d1fae5',
  4: '#fef3c7',
  5: '#fee2e2',
};

export const DEMO_USERS = [
  { role: 'cfo', name: 'Rajesh Kapoor', username: 'rkapoor', avatar: 'RK', dept: 'Finance' },
  { role: 'hr_admin', name: 'Sanjay Gupta', username: 'sgupta', avatar: 'SG', dept: 'HR' },
  { role: 'manager', name: 'Anita Desai', username: 'adesai', avatar: 'AD', dept: 'IT' },
  { role: 'approver', name: 'Meera Reddy', username: 'mreddy', avatar: 'MR', dept: 'HR' },
  { role: 'employee', name: 'Priya Sharma', username: 'psharma', avatar: 'PS', dept: 'IT' },
];

export const formatINR = (amount) => {
  if (!amount && amount !== 0) return '—';
  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';
  if (abs >= 10000000) {
    return `${sign}₹${(abs / 10000000).toFixed(2)} Cr`;
  } else if (abs >= 100000) {
    return `${sign}₹${(abs / 100000).toFixed(2)} L`;
  } else if (abs >= 1000) {
    return `${sign}₹${(abs / 1000).toFixed(1)}K`;
  }
  return `${sign}₹${abs.toLocaleString('en-IN')}`;
};

export const formatPercent = (val) => {
  if (val === null || val === undefined) return '—';
  return `${parseFloat(val).toFixed(1)}%`;
};

export const PERF_STARS = {
  5: '★★★★★',
  4: '★★★★☆',
  3: '★★★☆☆',
  2: '★★☆☆☆',
  1: '★☆☆☆☆',
};
