export const employees = [
  { id: 1, name: "Priya Sharma", empId: "EMP001", dept: "IT", location: "Mumbai HQ", grade: "A", title: "Senior Engineer", currentCTC: 1800000, performanceRating: 5, compaRatio: 0.82, tenure: 36, status: "Active", onPIP: false, lastHikeDate: "2023-04-01", managerId: 101 },
  { id: 2, name: "Rahul Mehta", empId: "EMP002", dept: "IT", location: "Mumbai HQ", grade: "B", title: "Software Engineer", currentCTC: 950000, performanceRating: 4, compaRatio: 0.95, tenure: 18, status: "Active", onPIP: false, lastHikeDate: "2023-04-01", managerId: 101 },
  { id: 3, name: "Anita Desai", empId: "EMP003", dept: "IT", location: "Pune", grade: "A", title: "Tech Lead", currentCTC: 2200000, performanceRating: 4, compaRatio: 1.05, tenure: 60, status: "Active", onPIP: false, lastHikeDate: "2023-04-01", managerId: 101 },
  { id: 4, name: "Vikram Singh", empId: "EMP004", dept: "Sales", location: "Delhi", grade: "B", title: "Sales Manager", currentCTC: 1200000, performanceRating: 5, compaRatio: 0.78, tenure: 24, status: "Active", onPIP: false, lastHikeDate: "2023-04-01", managerId: 102 },
  { id: 5, name: "Sunita Patel", empId: "EMP005", dept: "Sales", location: "Delhi", grade: "C", title: "Sales Executive", currentCTC: 650000, performanceRating: 3, compaRatio: 1.02, tenure: 12, status: "Active", onPIP: false, lastHikeDate: "2023-04-01", managerId: 102 },
  { id: 6, name: "Amit Kumar", empId: "EMP006", dept: "Sales", location: "Mumbai HQ", grade: "B", title: "Account Manager", currentCTC: 1100000, performanceRating: 4, compaRatio: 0.92, tenure: 30, status: "Active", onPIP: false, lastHikeDate: "2023-04-01", managerId: 102 },
  { id: 7, name: "Deepa Nair", empId: "EMP007", dept: "Operations", location: "Bangalore", grade: "B", title: "Operations Manager", currentCTC: 900000, performanceRating: 4, compaRatio: 0.88, tenure: 42, status: "Active", onPIP: false, lastHikeDate: "2023-04-01", managerId: 103 },
  { id: 8, name: "Rajesh Iyer", empId: "EMP008", dept: "Operations", location: "Bangalore", grade: "C", title: "Operations Analyst", currentCTC: 550000, performanceRating: 2, compaRatio: 0.97, tenure: 8, status: "Active", onPIP: true, lastHikeDate: "2023-04-01", managerId: 103 },
  { id: 9, name: "Kavita Joshi", empId: "EMP009", dept: "Operations", location: "Mumbai HQ", grade: "A", title: "Operations Head", currentCTC: 2800000, performanceRating: 5, compaRatio: 0.90, tenure: 72, status: "Active", onPIP: false, lastHikeDate: "2023-04-01", managerId: 103 },
  { id: 10, name: "Sanjay Gupta", empId: "EMP010", dept: "HR", location: "Mumbai HQ", grade: "B", title: "HR Manager", currentCTC: 800000, performanceRating: 4, compaRatio: 0.94, tenure: 36, status: "Active", onPIP: false, lastHikeDate: "2023-04-01", managerId: 104 },
  { id: 11, name: "Meera Reddy", empId: "EMP011", dept: "HR", location: "Hyderabad", grade: "C", title: "HR Executive", currentCTC: 450000, performanceRating: 3, compaRatio: 1.05, tenure: 14, status: "Active", onPIP: false, lastHikeDate: "2023-04-01", managerId: 104 },
  { id: 12, name: "Arjun Kapoor", empId: "EMP012", dept: "Finance", location: "Mumbai HQ", grade: "A", title: "Finance Manager", currentCTC: 1600000, performanceRating: 5, compaRatio: 0.85, tenure: 48, status: "Active", onPIP: false, lastHikeDate: "2023-04-01", managerId: 105 },
  { id: 13, name: "Pooja Tiwari", empId: "EMP013", dept: "Finance", location: "Mumbai HQ", grade: "B", title: "Financial Analyst", currentCTC: 900000, performanceRating: 4, compaRatio: 0.91, tenure: 22, status: "Active", onPIP: false, lastHikeDate: "2023-04-01", managerId: 105 },
  { id: 14, name: "Nikhil Bose", empId: "EMP014", dept: "IT", location: "Pune", grade: "C", title: "Junior Developer", currentCTC: 600000, performanceRating: 3, compaRatio: 1.08, tenure: 6, status: "Active", onPIP: false, lastHikeDate: "2023-04-01", managerId: 101 },
  { id: 15, name: "Lakshmi Menon", empId: "EMP015", dept: "Sales", location: "Chennai", grade: "A", title: "Regional Sales Head", currentCTC: 2500000, performanceRating: 5, compaRatio: 0.80, tenure: 84, status: "Active", onPIP: false, lastHikeDate: "2023-04-01", managerId: 102 },
];

export const departments = [
  { id: "IT", name: "Information Technology", head: "Anita Desai", headcount: 4, budgetAllocated: 12000000, costCenter: "CC-IT-001" },
  { id: "Sales", name: "Sales & Business Development", head: "Lakshmi Menon", headcount: 4, budgetAllocated: 15000000, costCenter: "CC-SL-001" },
  { id: "Operations", name: "Operations", head: "Kavita Joshi", headcount: 3, budgetAllocated: 8000000, costCenter: "CC-OPS-001" },
  { id: "HR", name: "Human Resources", head: "Sanjay Gupta", headcount: 2, budgetAllocated: 5000000, costCenter: "CC-HR-001" },
  { id: "Finance", name: "Finance & Accounts", head: "Arjun Kapoor", headcount: 2, budgetAllocated: 10000000, costCenter: "CC-FIN-001" },
];

export const salaryBands = [
  { grade: "A", level: "Senior", minSalary: 800000, midpointSalary: 1300000, maxSalary: 1800000 },
  { grade: "B", level: "Mid-Level", minSalary: 500000, midpointSalary: 900000, maxSalary: 1300000 },
  { grade: "C", level: "Junior", minSalary: 300000, midpointSalary: 550000, maxSalary: 800000 },
];

export const meritMatrix = [
  { rating: 5, compaRatioRange: "Below 0.85", minHike: 18, maxHike: 22 },
  { rating: 5, compaRatioRange: "0.85 - 1.00", minHike: 14, maxHike: 18 },
  { rating: 5, compaRatioRange: "Above 1.00", minHike: 10, maxHike: 14 },
  { rating: 4, compaRatioRange: "Below 0.85", minHike: 14, maxHike: 18 },
  { rating: 4, compaRatioRange: "0.85 - 1.00", minHike: 10, maxHike: 14 },
  { rating: 4, compaRatioRange: "Above 1.00", minHike: 6, maxHike: 10 },
  { rating: 3, compaRatioRange: "Below 0.85", minHike: 8, maxHike: 12 },
  { rating: 3, compaRatioRange: "0.85 - 1.00", minHike: 5, maxHike: 8 },
  { rating: 3, compaRatioRange: "Above 1.00", minHike: 3, maxHike: 6 },
  { rating: 2, compaRatioRange: "Below 0.85", minHike: 3, maxHike: 6 },
  { rating: 2, compaRatioRange: "0.85 - 1.00", minHike: 0, maxHike: 3 },
  { rating: 2, compaRatioRange: "Above 1.00", minHike: 0, maxHike: 0 },
  { rating: 1, compaRatioRange: "All", minHike: 0, maxHike: 0 },
];

export const locations = [
  { id: "MUM-HQ", name: "Mumbai HQ", dept: "ALL", budget: 0 },
  { id: "PUNE", name: "Pune Office", dept: "IT", budget: 0 },
  { id: "DELHI", name: "Delhi Office", dept: "Sales", budget: 0 },
  { id: "BLORE", name: "Bangalore Office", dept: "Operations", budget: 0 },
  { id: "HYD", name: "Hyderabad Office", dept: "HR", budget: 0 },
  { id: "CHN", name: "Chennai Office", dept: "Sales", budget: 0 },
];

export const approvalHistory = [
  { id: 1, empId: "EMP001", approver: "HR BP", level: 1, status: "approved", comment: "Policy compliant. Approved.", timestamp: "2025-04-05 10:30" },
  { id: 2, empId: "EMP002", approver: "HR BP", level: 1, status: "approved", comment: "Within band. Approved.", timestamp: "2025-04-05 10:32" },
  { id: 3, empId: "EMP004", approver: "HR BP", level: 1, status: "modified", comment: "Reduced from 22% to 20% to stay within band.", timestamp: "2025-04-05 11:00" },
];

export const cycle = {
  id: "CYC-2025-01",
  name: "FY2025 Annual Increment",
  type: "Annual",
  startDate: "2025-04-01",
  endDate: "2025-04-30",
  submissionDeadline: "2025-04-15",
  status: "active",
  totalBudget: 50000000,
  budgetConsumed: 38500000,
};

export const getSuggestedHike = (employee) => {
  const { performanceRating, compaRatio } = employee;
  let range = "0.85 - 1.00";
  if (compaRatio < 0.85) range = "Below 0.85";
  else if (compaRatio > 1.00) range = "Above 1.00";

  const matrixEntry = meritMatrix.find(m => m.rating === performanceRating && m.compaRatioRange === range);
  if (!matrixEntry) return 0;
  return (matrixEntry.minHike + matrixEntry.maxHike) / 2;
};

export const isEligible = (employee) => {
  if (employee.status !== "Active") return { eligible: false, reason: "Not Active" };
  if (employee.onPIP) return { eligible: false, reason: "On PIP" };
  if (employee.tenure < 6) return { eligible: false, reason: "Tenure < 6 months" };
  return { eligible: true, reason: "" };
};
