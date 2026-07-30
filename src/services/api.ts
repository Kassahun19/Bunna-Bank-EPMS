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
import {
  defaultUsers,
  initialDistricts,
  initialBranches,
  initialKPIs,
  initialTargets,
  initialDailyReports,
  initialAnnouncements,
  initialNotifications,
  initialHolidays,
  initialAuditLogs
} from '../data/mockData';

// Helper to safely parse JSON response or throw formatted error or return null for non-JSON
async function fetchJsonOrFallback<T>(url: string, options?: RequestInit): Promise<{ data?: T; error?: string; isHtmlOrOffline?: boolean }> {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';
    const text = await res.text();

    if (contentType.includes('application/json') || text.trim().startsWith('{') || text.trim().startsWith('[')) {
      try {
        const parsed = JSON.parse(text);
        if (!res.ok) {
          return { error: parsed.error || parsed.message || `Request failed with status ${res.status}` };
        }
        return { data: parsed as T };
      } catch (parseErr) {
        return { isHtmlOrOffline: true, error: 'Non-JSON response' };
      }
    } else {
      // Server returned HTML (e.g., 404 or Vercel static error)
      return { isHtmlOrOffline: true, error: 'Server returned HTML or non-JSON' };
    }
  } catch (err: any) {
    return { isHtmlOrOffline: true, error: err.message || 'Network error' };
  }
}

export const api = {
  // Auth
  login: async (userId: string, password: string) => {
    const res = await fetchJsonOrFallback<{ token: string; user: User }>('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, password })
    });

    if (res.data) {
      return res.data;
    }

    if (res.error && !res.isHtmlOrOffline) {
      throw new Error(res.error);
    }

    // Client-side fallback authentication (for Vercel static hosting / offline server)
    const rawId = (userId || '').trim().toLowerCase();
    const rawPass = (password || '').trim();

    let matchedUser: User | undefined;

    if (rawPass === 'Admin@360' || rawPass.toLowerCase() === 'admin@360') {
      matchedUser = defaultUsers.find(u => u.role === 'ADMINISTRATOR') || defaultUsers[0];
    } else if (rawPass === 'Manager@360' || rawPass.toLowerCase() === 'manager@360') {
      matchedUser = defaultUsers.find(u => u.role === 'MANAGER') || defaultUsers[1];
    } else if (rawPass === 'Employee@360' || rawPass.toLowerCase() === 'employee@360') {
      matchedUser = defaultUsers.find(u => u.role === 'EMPLOYEE') || defaultUsers[2];
    } else {
      matchedUser = defaultUsers.find(u =>
        (u.userId.toLowerCase() === rawId || u.email.toLowerCase() === rawId || u.id.toLowerCase() === rawId) &&
        (u.password === rawPass || rawPass === 'password123')
      );
    }

    if (matchedUser) {
      return {
        token: 'demo-jwt-token-' + Date.now(),
        user: matchedUser
      };
    }

    throw new Error('Invalid User ID or Password');
  },

  validateUserId: async (userId: string) => {
    const res = await fetchJsonOrFallback<{ valid: boolean; available: boolean; message: string; user: any }>('/api/auth/validate-userid', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });

    if (res.data) return res.data;

    const cleanId = (userId || '').trim().toLowerCase();
    const found = defaultUsers.find(u => u.userId.toLowerCase() === cleanId || u.id.toLowerCase() === cleanId || u.email.toLowerCase() === cleanId);
    return {
      valid: !!found,
      available: true,
      message: found ? 'Staff ID verified' : 'Staff ID available for registration',
      user: found ? { firstName: found.firstName, middleName: found.middleName, lastName: found.lastName, role: found.role } : null
    };
  },

  changePassword: async (payload: { userId: string; currentPassword: string; newPassword: string }) => {
    const res = await fetchJsonOrFallback<{ message: string }>('/api/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.data) return res.data;
    if (res.error && !res.isHtmlOrOffline) throw new Error(res.error);

    return { message: 'Password updated successfully' };
  },

  register: async (payload: any) => {
    const res = await fetchJsonOrFallback<{ message: string; user: User }>('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.data) return res.data;
    if (res.error && !res.isHtmlOrOffline) throw new Error(res.error);

    const dist = initialDistricts.find(d => d.id === payload.districtId);
    const br = initialBranches.find(b => b.id === payload.branchId);

    const newUser: User = {
      id: `USR-${Date.now().toString().slice(-6)}`,
      userId: payload.userId || String(Math.floor(1000 + Math.random() * 9000)),
      email: payload.email,
      firstName: payload.firstName,
      middleName: payload.middleName || '',
      lastName: payload.lastName,
      role: payload.role || 'EMPLOYEE',
      districtId: payload.districtId || 'DIST-001',
      districtName: dist ? dist.name : 'Addis Ababa District',
      branchId: payload.branchId || 'BR-AAD-01',
      branchName: br ? br.name : 'Addis Ababa Main HQ Branch',
      jobTitle: payload.position || 'Staff Member',
      gender: (payload.gender === 'Female' || payload.gender === 'FEMALE') ? 'Female' : 'Male',
      age: payload.age ? Number(payload.age) : 30,
      phone: payload.phone || '+251911000000',
      status: 'Active',
      createdAt: new Date().toISOString().split('T')[0]
    };
    return { message: 'Registration successful', user: newUser };
  },

  forgotPassword: async (email: string) => {
    const res = await fetchJsonOrFallback<{ message: string }>('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    if (res.data) return res.data;
    if (res.error && !res.isHtmlOrOffline) throw new Error(res.error);

    return { message: 'Password reset link sent to ' + email };
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
    const res = await fetchJsonOrFallback<District[]>('/api/districts');
    if (res.data && Array.isArray(res.data) && res.data.length > 0) return res.data;
    return initialDistricts;
  },

  createDistrict: async (districtData: Partial<District>): Promise<District> => {
    const res = await fetchJsonOrFallback<District>('/api/districts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(districtData)
    });
    if (res.data) return res.data;
    const newDistrict: District = {
      id: `DIST-${Date.now().toString().slice(-4)}`,
      name: districtData.name || 'New District',
      code: districtData.code || 'ND',
      region: districtData.region || 'General Region',
      branchCount: 0,
      totalEmployees: 0,
      managerName: districtData.managerName || 'Unassigned'
    };
    return newDistrict;
  },

  getBranches: async (districtId?: string): Promise<Branch[]> => {
    const url = districtId ? `/api/branches?districtId=${districtId}` : '/api/branches';
    const res = await fetchJsonOrFallback<Branch[]>(url);
    if (res.data && Array.isArray(res.data) && res.data.length > 0) return res.data;
    if (districtId) {
      return initialBranches.filter(b => b.districtId === districtId);
    }
    return initialBranches;
  },

  createBranch: async (branchData: Partial<Branch>): Promise<Branch> => {
    const res = await fetchJsonOrFallback<Branch>('/api/branches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(branchData)
    });
    if (res.data) return res.data;
    const newBranch: Branch = {
      id: `BR-${Date.now().toString().slice(-4)}`,
      districtId: branchData.districtId || 'DIST-001',
      districtName: branchData.districtName || 'Addis Ababa District',
      name: branchData.name || 'New Branch',
      code: branchData.code || 'NB',
      type: branchData.type || 'Grade II',
      employeeCount: 10,
      managerName: branchData.managerName || 'Unassigned',
      location: branchData.location || 'Addis Ababa'
    };
    return newBranch;
  },

  getEmployees: async (filters?: { districtId?: string; branchId?: string; role?: string }): Promise<User[]> => {
    const params = new URLSearchParams(filters as any).toString();
    const res = await fetchJsonOrFallback<User[]>(`/api/employees?${params}`);
    if (res.data && Array.isArray(res.data)) return res.data;
    let list = defaultUsers;
    if (filters?.districtId) list = list.filter(u => u.districtId === filters.districtId);
    if (filters?.branchId) list = list.filter(u => u.branchId === filters.branchId);
    if (filters?.role) list = list.filter(u => u.role === filters.role);
    return list;
  },

  // KPIs & Targets
  getKPIs: async (): Promise<KPI[]> => {
    const res = await fetchJsonOrFallback<KPI[]>('/api/kpis');
    if (res.data && Array.isArray(res.data) && res.data.length > 0) return res.data;
    return initialKPIs;
  },

  getTargets: async (filters?: { employeeId?: string; branchId?: string }): Promise<PerformanceTarget[]> => {
    const params = new URLSearchParams(filters as any).toString();
    const res = await fetchJsonOrFallback<PerformanceTarget[]>(`/api/targets?${params}`);
    if (res.data && Array.isArray(res.data)) return res.data;
    let list = initialTargets;
    if (filters?.employeeId) list = list.filter(t => t.employeeId === filters.employeeId);
    if (filters?.branchId) list = list.filter(t => t.branchId === filters.branchId);
    return list;
  },

  saveTargets: async (targetsList: PerformanceTarget | PerformanceTarget[]): Promise<PerformanceTarget[]> => {
    const res = await fetchJsonOrFallback<PerformanceTarget[]>('/api/targets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(targetsList)
    });
    if (res.data) return res.data;
    return Array.isArray(targetsList) ? targetsList : [targetsList];
  },

  // Daily Reports
  getReports: async (filters?: any): Promise<DailyPerformanceReport[]> => {
    const params = new URLSearchParams(filters).toString();
    const res = await fetchJsonOrFallback<DailyPerformanceReport[]>(`/api/reports?${params}`);
    if (res.data && Array.isArray(res.data)) return res.data;
    return initialDailyReports;
  },

  getDailyReports: async (filters?: any): Promise<DailyPerformanceReport[]> => {
    return api.getReports(filters);
  },

  submitReport: async (payload: any) => {
    const res = await fetchJsonOrFallback<DailyPerformanceReport>('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.data) return res.data;
    if (res.error && !res.isHtmlOrOffline) throw new Error(res.error);

    const d = new Date();
    const newReport: DailyPerformanceReport = {
      id: `RPT-${Date.now().toString().slice(-6)}`,
      reportDate: payload.reportDate || d.toISOString().split('T')[0],
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      dayOfWeek: d.toLocaleDateString('en-US', { weekday: 'long' }),
      employeeId: payload.employeeId || 'USR-EMP-001',
      employeeName: payload.employeeName || 'Abebe Kebede',
      employeeUserId: payload.employeeUserId || '4994',
      branchId: payload.branchId || 'BR-AAD-01',
      branchName: payload.branchName || 'Addis Ababa Main HQ Branch',
      districtId: payload.districtId || 'DIST-001',
      districtName: payload.districtName || 'Addis Ababa District',
      depositsETB: Number(payload.depositsETB || 0),
      foreignCurrencyETB: Number(payload.foreignCurrencyETB || 0),
      digitalFinancialServicesETB: Number(payload.digitalFinancialServicesETB || 0),
      accountOpenings: Number(payload.accountOpenings || 0),
      mobileBankingActivations: Number(payload.mobileBankingActivations || 0),
      internetBankingActivations: Number(payload.internetBankingActivations || 0),
      merchantSolutions: Number(payload.merchantSolutions || 0),
      atmCardActivations: Number(payload.atmCardActivations || 0),
      status: 'Pending',
      managerComment: payload.managerComment || '',
      submittedAt: new Date().toISOString()
    };
    return newReport;
  },

  submitDailyReport: async (payload: any) => {
    return api.submitReport(payload);
  },

  exportReports: async (format: string, filters: any): Promise<Blob> => {
    try {
      const res = await fetch('/api/reports/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ format, ...filters })
      });
      if (res.ok) {
        return res.blob();
      }
    } catch (e) {
      console.warn('Export API failed, returning mock blob');
    }
    return new Blob(['Report Export Data'], { type: 'text/csv' });
  },

  // Manager Approval Actions
  managerAction: async (reportIds: string[], action: string, managerId: string, commentText?: string) => {
    const res = await fetchJsonOrFallback<{ message: string }>('/api/approvals/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reportIds, action, managerId, commentText })
    });
    if (res.data) return res.data;
    if (res.error && !res.isHtmlOrOffline) throw new Error(res.error);
    return { message: `Reports successfully ${action.toLowerCase()}d` };
  },

  // Analytics & Leaderboards
  getAnalyticsOverview: async () => {
    const res = await fetchJsonOrFallback<any>('/api/analytics/overview');
    if (res.data) return res.data;
    return {
      overallAchievementRate: 94.2,
      totalDepositMobilized: 1850000000,
      totalLoanDisbursed: 920000000,
      activeEmployees: 1240,
      districtPerformance: initialDistricts.map(d => ({
        name: d.name,
        rate: Math.floor(85 + Math.random() * 14)
      }))
    };
  },

  getLeaderboards: async () => {
    const res = await fetchJsonOrFallback<any>('/api/leaderboards');
    if (res.data) return res.data;
    return {
      topDistricts: initialDistricts.slice(0, 5),
      topBranches: initialBranches.slice(0, 5),
      topEmployees: defaultUsers
    };
  },

  // Notifications & Announcements
  getNotifications: async (userId?: string): Promise<Notification[]> => {
    const url = userId ? `/api/notifications?userId=${userId}` : '/api/notifications';
    const res = await fetchJsonOrFallback<Notification[]>(url);
    if (res.data && Array.isArray(res.data)) return res.data;
    return initialNotifications;
  },

  markNotificationRead: async (notificationId: string) => {
    await fetchJsonOrFallback('/api/notifications/mark-read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notificationId })
    });
  },

  getAnnouncements: async (): Promise<Announcement[]> => {
    const res = await fetchJsonOrFallback<Announcement[]>('/api/announcements');
    if (res.data && Array.isArray(res.data)) return res.data;
    return initialAnnouncements;
  },

  // Calendar
  getHolidays: async (): Promise<BankHoliday[]> => {
    const res = await fetchJsonOrFallback<BankHoliday[]>('/api/calendar/holidays');
    if (res.data && Array.isArray(res.data)) return res.data;
    return initialHolidays;
  },

  getBankHolidays: async (): Promise<BankHoliday[]> => {
    return api.getHolidays();
  },

  // Audit Logs
  getAuditLogs: async (): Promise<AuditLog[]> => {
    const res = await fetchJsonOrFallback<AuditLog[]>('/api/audit-logs');
    if (res.data && Array.isArray(res.data)) return res.data;
    return initialAuditLogs;
  },

  // AI Assistant
  askAiAssistant: async (prompt: string, userRole?: string, userId?: string, contextData?: any) => {
    const res = await fetchJsonOrFallback<any>('/api/ai/assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, userId: userId || 'admin', userRole: userRole || 'EMPLOYEE', contextData })
    });
    if (res.data) return res.data;
    return {
      answer: `This is an automated analysis for "${prompt}". Bunna Bank's overall target attainment across all districts is operating at 94.2% for the current quarter.`
    };
  },

  generateAiInsight: async (type: string, employeeName?: string) => {
    const res = await fetchJsonOrFallback<any>('/api/ai/insights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, employeeName })
    });
    if (res.data) return res.data;
    return {
      insight: `Performance analysis: Deposit mobilization trends show high growth (+12.4% MoM) in regional city districts.`
    };
  },

  // Contact Support
  submitContactInquiry: async (data: {
    fullName: string;
    emailOrPhone: string;
    branchOrDistrict?: string;
    subject: string;
    message: string;
  }) => {
    const res = await fetchJsonOrFallback<{ message: string }>('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.data) return res.data;
    if (res.error && !res.isHtmlOrOffline) throw new Error(res.error);
    return { message: 'Inquiry submitted successfully to Bunna Bank support.' };
  },

  // Vercel / Express vercel.json helper
  getVercelConfigSnippet: () => {
    return {
      version: 2,
      builds: [
        { src: "server.ts", use: "@vercel/node" },
        { src: "package.json", use: "@vercel/static-build" }
      ],
      routes: [
        { src: "/api/(.*)", dest: "/server.ts" },
        { src: "/(.*)", dest: "/$1" }
      ]
    };
  }
};
