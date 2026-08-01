export type UserRole = 'ADMINISTRATOR' | 'MANAGER' | 'EMPLOYEE';

export type Language = 'en' | 'am';

export type ApprovalStatus = 'Draft' | 'Submitted' | 'Pending' | 'Approved' | 'Rejected' | 'Returned' | 'Suspended';

export interface District {
  id: string;
  solId?: string;
  name: string;
  code: string;
  region: string;
  status?: 'Active' | 'Inactive';
  type?: 'District' | 'Area Office';
  branchCount: number;
  totalEmployees: number;
  managerName: string;
  phone?: string;
  email?: string;
  secEmail?: string;
  location?: string;
  operationManager?: string;
}

export interface Branch {
  id: string;
  solId?: string;
  districtId: string;
  districtName: string;
  name: string;
  code: string;
  phone?: string;
  type?: 'Main Branch' | 'Grade I' | 'Grade II' | 'Grade III' | 'Special Branch' | string;
  employeeCount: number;
  managerName: string;
  location: string;
  region?: string;
  status?: 'Active' | 'Inactive';
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
}

export interface User {
  id: string;
  userId: string;
  password?: string;
  email: string;
  firstName: string;
  middleName: string;
  lastName: string;
  role: UserRole;
  jobTitle: string;
  districtId: string;
  districtName: string;
  branchId: string;
  branchName: string;
  departmentId?: string;
  gender: 'Male' | 'Female';
  age: number;
  phone: string;
  avatarUrl?: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  createdAt: string;
}

export function getUserFullName(user?: { firstName?: string; middleName?: string; lastName?: string } | null): string {
  if (!user) return '';
  const first = user.firstName || '';
  const middle = user.middleName || user.lastName || '';
  return `${first} ${middle}`.trim();
}

export interface KPI {
  id: string;
  code: string;
  name: string;
  category: 'Financial' | 'Digital Banking' | 'Customer Acquisition' | 'Operational Excellence';
  unit: 'ETB' | 'Count' | 'Percentage';
  weight: number; // percentage weight in overall score
  description: string;
}

export interface PerformanceTarget {
  id: string;
  kpiId: string;
  kpiName: string;
  employeeId?: string;
  branchId?: string;
  period: 'Monthly' | 'Quarterly' | 'Semi-Annual' | 'Annual';
  year: number;
  month?: number;
  targetValue: number;
}

export interface DailyPerformanceReport {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeUserId: string;
  branchId: string;
  branchName: string;
  districtId: string;
  districtName: string;
  reportDate: string; // YYYY-MM-DD
  year: number;
  month: number;
  dayOfWeek: string;
  status: ApprovalStatus;
  
  // Financial Metrics (ETB)
  depositsETB: number;
  foreignCurrencyETB: number;
  digitalFinancialServicesETB: number;
  
  // Digital Banking Activations (Counts)
  accountOpenings: number;
  mobileBankingActivations: number;
  internetBankingActivations: number;
  merchantSolutions: number;
  merchantSolutionsActivations?: number;
  atmCardActivations: number;
  atmCardsIssued?: number;
  managerComment?: string;
  
  submittedAt?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  comments?: ReportComment[];
  auditHistory?: AuditHistoryEntry[];
}

export interface ReportComment {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  text: string;
  createdAt: string;
}

export interface AuditHistoryEntry {
  id: string;
  action: string;
  performedBy: string;
  performedByRole: string;
  timestamp: string;
  details: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'High' | 'Normal' | 'Urgent';
  targetRole: 'ALL' | 'MANAGER' | 'EMPLOYEE';
  publishedAt: string;
  author: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'approval' | 'rejection' | 'target' | 'announcement' | 'system';
  read: boolean;
  timestamp: string;
  link?: string;
}

export interface DirectMessage {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface BankHoliday {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
  description: string;
  recurring: boolean;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  module: string;
  ipAddress: string;
  timestamp: string;
  status: 'SUCCESS' | 'FAILED' | 'WARNING';
}

export interface PerformanceSummary {
  employeeId: string;
  period: string;
  totalDeposits: number;
  totalFCY: number;
  totalDFS: number;
  totalAccounts: number;
  totalMobileBanking: number;
  totalInternetBanking: number;
  totalMerchants: number;
  totalATMs: number;
  kpiAchievements: {
    kpiName: string;
    target: number;
    achieved: number;
    completionPercentage: number;
    remaining: number;
  }[];
  overallCompletionPercentage: number;
  grade: 'A+ (Outstanding)' | 'A (Exceeds Expectations)' | 'B (Meets Target)' | 'C (Needs Improvement)' | 'D (Unsatisfactory)';
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  roleOrUnit: string;
  branchName: string;
  districtName: string;
  score: number;
  depositsETB: number;
  digitalActivations: number;
  growthPercentage: number;
  badge: string;
}
