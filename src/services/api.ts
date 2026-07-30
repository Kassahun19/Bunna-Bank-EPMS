import {
  User,
  District,
  Branch,
  KPI,
  PerformanceTarget,
  DailyPerformanceReport,
  Announcement,
  Notification,
  BankHoliday,
  AuditLog,
  UserRole
} from '../types';
import { defaultUsers, initialDistricts, initialBranches } from '../data/mockData';

export const api = {
  // Auth
  login: async (userId: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, password })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Login failed');
    }
    return res.json();
  },

  validateUserId: async (userId: string) => {
    const res = await fetch('/api/auth/validate-userid', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    return res.json();
  },

  changePassword: async (payload: { userId: string; currentPassword: string; newPassword: string }) => {
    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Password change failed');
    }
    return res.json();
  },

  register: async (payload: any) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Registration failed');
    }
    return res.json();
  },

  forgotPassword: async (email: string) => {
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Password reset failed');
    }
    return res.json();
  },

  quickSwitchUserRole: async (role: UserRole): Promise<User> => {
    const rolePresetMap: Record<UserRole, { userId: string; pass: string }> = {
      ADMINISTRATOR: { userId: '4994', pass: 'Admin@360' },
      MANAGER: { userId: '4994', pass: 'Manager@360' },
      EMPLOYEE: { userId: '4994', pass: 'Employee@360' }
    };

    const preset = rolePresetMap[role];
    try {
      const data = await api.login(preset.userId, preset.pass);
      return data.user;
    } catch (err) {
      const fallback = defaultUsers.find(u => u.role === role) || defaultUsers[0];
      return fallback;
    }
  },

  // Locations & Organization
  getDistricts: async (): Promise<District[]> => {
    try {
      const res = await fetch('/api/districts');
      if (!res.ok) throw new Error('Failed to fetch districts');
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
      return initialDistricts;
    } catch (err) {
      console.warn('API getDistricts failed, using initialDistricts fallback:', err);
      return initialDistricts;
    }
  },

  createDistrict: async (districtData: Partial<District>): Promise<District> => {
    const res = await fetch('/api/districts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(districtData)
    });
    if (!res.ok) throw new Error('Failed to create district');
    return res.json();
  },

  getBranches: async (districtId?: string): Promise<Branch[]> => {
    try {
      const url = districtId ? `/api/branches?districtId=${districtId}` : '/api/branches';
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch branches');
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
      if (districtId) {
        return initialBranches.filter(b => b.districtId === districtId);
      }
      return initialBranches;
    } catch (err) {
      console.warn('API getBranches failed, using initialBranches fallback:', err);
      if (districtId) {
        return initialBranches.filter(b => b.districtId === districtId);
      }
      return initialBranches;
    }
  },

  createBranch: async (branchData: Partial<Branch>): Promise<Branch> => {
    const res = await fetch('/api/branches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(branchData)
    });
    if (!res.ok) throw new Error('Failed to create branch');
    return res.json();
  },

  getEmployees: async (filters?: { districtId?: string; branchId?: string; role?: string }): Promise<User[]> => {
    const params = new URLSearchParams(filters as any).toString();
    const res = await fetch(`/api/employees?${params}`);
    return res.json();
  },

  // KPIs & Targets
  getKPIs: async (): Promise<KPI[]> => {
    const res = await fetch('/api/kpis');
    return res.json();
  },

  getTargets: async (filters?: { employeeId?: string; branchId?: string }): Promise<PerformanceTarget[]> => {
    const params = new URLSearchParams(filters as any).toString();
    const res = await fetch(`/api/targets?${params}`);
    return res.json();
  },

  saveTargets: async (targetsList: PerformanceTarget | PerformanceTarget[]): Promise<PerformanceTarget[]> => {
    const res = await fetch('/api/targets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(targetsList)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to save targets');
    }
    return res.json();
  },

  // Daily Reports
  getReports: async (filters?: any): Promise<DailyPerformanceReport[]> => {
    const params = new URLSearchParams(filters).toString();
    const res = await fetch(`/api/reports?${params}`);
    return res.json();
  },

  getDailyReports: async (filters?: any): Promise<DailyPerformanceReport[]> => {
    return api.getReports(filters);
  },

  submitReport: async (payload: any) => {
    const res = await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to submit report');
    }
    return res.json();
  },

  submitDailyReport: async (payload: any) => {
    return api.submitReport(payload);
  },

  exportReports: async (format: string, filters: any): Promise<Blob> => {
    const res = await fetch('/api/reports/export', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ format, ...filters })
    });
    return res.blob();
  },

  // Manager Approval Actions
  managerAction: async (reportIds: string[], action: string, managerId: string, commentText?: string) => {
    const res = await fetch('/api/approvals/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reportIds, action, managerId, commentText })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Approval action failed');
    }
    return res.json();
  },

  // Analytics & Leaderboards
  getAnalyticsOverview: async () => {
    const res = await fetch('/api/analytics/overview');
    return res.json();
  },

  getLeaderboards: async () => {
    const res = await fetch('/api/leaderboards');
    return res.json();
  },

  // Notifications & Announcements
  getNotifications: async (userId?: string): Promise<Notification[]> => {
    const url = userId ? `/api/notifications?userId=${userId}` : '/api/notifications';
    const res = await fetch(url);
    return res.json();
  },

  markNotificationRead: async (notificationId: string) => {
    await fetch('/api/notifications/mark-read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notificationId })
    });
  },

  getAnnouncements: async (): Promise<Announcement[]> => {
    const res = await fetch('/api/announcements');
    return res.json();
  },

  // Calendar
  getHolidays: async (): Promise<BankHoliday[]> => {
    const res = await fetch('/api/calendar/holidays');
    return res.json();
  },

  getBankHolidays: async (): Promise<BankHoliday[]> => {
    return api.getHolidays();
  },

  // Audit Logs
  getAuditLogs: async (): Promise<AuditLog[]> => {
    const res = await fetch('/api/audit-logs');
    return res.json();
  },

  // AI Assistant
  askAiAssistant: async (prompt: string, userRole?: string, userId?: string, contextData?: any) => {
    const res = await fetch('/api/ai/assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, userId: userId || 'admin', userRole: userRole || 'EMPLOYEE', contextData })
    });
    return res.json();
  },

  generateAiInsight: async (type: string, employeeName?: string) => {
    const res = await fetch('/api/ai/insights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, employeeName })
    });
    return res.json();
  },

  // Contact Support
  submitContactInquiry: async (data: {
    fullName: string;
    emailOrPhone: string;
    branchOrDistrict?: string;
    subject: string;
    message: string;
  }) => {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to submit contact inquiry');
    }
    return res.json();
  }
};
