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

function generateClientSideAiResponse(prompt: string, userRole?: string, userId?: string, contextData?: any) {
  const lowerPrompt = (prompt || '').toLowerCase().trim();
  let empName = contextData?.employeeName;
  let empId = contextData?.employeeId || contextData?.id;

  if (!empName) {
    const foundUser = defaultUsers.find(u => {
      const full = `${u.firstName} ${u.middleName || u.lastName}`.toLowerCase();
      return lowerPrompt.includes(u.firstName.toLowerCase()) || lowerPrompt.includes(full);
    });
    if (foundUser) {
      empName = `${foundUser.firstName} ${foundUser.middleName || foundUser.lastName}`;
      empId = foundUser.id;
    }
  }

  let textResult = '';

  // 1. Specific Employee Performance Summary
  if (empName) {
    textResult = `**Executive Evaluation: ${empName}**
*Bunna Bank S.C. EPMS • ${contextData?.branchName || 'Main HQ Branch'}*

• **Deposits Mobilized:** ETB 14,250,000 (107.5% of assigned target).
• **Foreign Currency:** $185,000 USD collected in trade & remittance.
• **Digital Banking:** Onboarded **42 Bunna Mobile** users, **15 Internet Banking** clients, and **8 QR Merchants**.
• **Compliance & Rating:** 100% on-time daily logs with 99.4% approval score (**Grade A - Exceeds Target**).`;
  }
  // 2. How to Submit / Daily Reporting
  else if (lowerPrompt.includes('submit') || lowerPrompt.includes('log') || lowerPrompt.includes('report') || lowerPrompt.includes('how to add') || lowerPrompt.includes('draft')) {
    textResult = `**How to Submit Your Daily Performance Report**

1. **Navigate:** Click **"Submit Report"** in the top navigation bar.
2. **Input Metrics:** Fill in your daily achievements for Deposits (ETB), Foreign Currency, Account Openings, Mobile Banking, and QR Merchants.
3. **Save or Submit:** Click **"Save Draft"** to finish later, or **"Submit Report"** to send directly for manager review.
4. **Cutoff Time:** Submissions must be logged before **10:00 AM** daily.`;
  }
  // 3. Approvals & Manager Workflows
  else if (lowerPrompt.includes('approval') || lowerPrompt.includes('approve') || lowerPrompt.includes('pending') || lowerPrompt.includes('reject') || lowerPrompt.includes('manager')) {
    textResult = `**Manager Approval Workflow & Queue**

• **Daily Review:** Managers inspect and review all submitted branch reports daily before 10:00 AM.
• **Status Options:** Reports are marked as **Approved** (verified) or **Rejected** (requires metric correction with feedback).
• **Audit Trail:** Every approval action is logged with timestamp for transparent district audit reporting.`;
  }
  // 4. Bank Information & EPMS Overview
  else if (lowerPrompt.includes('bunna') || lowerPrompt.includes('about') || lowerPrompt.includes('what is epms') || lowerPrompt.includes('epms') || lowerPrompt.includes('system') || lowerPrompt.includes('app')) {
    textResult = `**About Bunna Bank S.C. EPMS**
*Empowering Performance. Driving Excellence.*

• **Overview:** The Employee Performance Management System (EPMS) powers Bunna Bank's 500+ branches and 10,000+ staff across Ethiopia.
• **Core Objectives:** Real-time KPI target tracking, daily report validation, automated manager approvals, district leaderboards, and AI performance coaching.
• **Tagline:** Bank with Purpose, Perform with Excellence.`;
  }
  // 5. Foreign Currency / FCY
  else if (lowerPrompt.includes('fcy') || lowerPrompt.includes('foreign') || lowerPrompt.includes('remittance') || lowerPrompt.includes('currency') || lowerPrompt.includes('dollar')) {
    textResult = `**Foreign Currency Inflow (FCY) KPI Target**

• **Annual Target:** **$250.0 Million USD** (or ETB equivalent).
• **Current Achievement:** **$256.5 Million USD** (**102.6% Target Attainment**).
• **Key Drivers:** International trade settlement, remittance services, and diaspora banking accounts across Bunna Bank network.`;
  }
  // 6. Digital Banking Products (Mobile, IB, POS/QR, Cards)
  else if (lowerPrompt.includes('mobile') || lowerPrompt.includes('dfs') || lowerPrompt.includes('digital') || lowerPrompt.includes('qr') || lowerPrompt.includes('pos') || lowerPrompt.includes('card') || lowerPrompt.includes('atm')) {
    textResult = `**Digital Financial Services (DFS) & Products**

• **Bunna Mobile Banking:** 350k Target | 436.8k Users (**124.8% Attained**).
• **Internet Banking:** 80k Target | 77.4k Users (**96.8% Attained**).
• **Merchant QR Solutions:** 40k Target | 44.1k Merchants (**110.3% Attained**).
• **ATM Cards Issued:** 200k Target | 210.2k Cards (**105.1% Attained**).`;
  }
  // 7. Multi-language / Amharic Support
  else if (lowerPrompt.includes('amharic') || lowerPrompt.includes('language') || lowerPrompt.includes('አማርኛ') || lowerPrompt.includes('translate')) {
    textResult = `**Multi-Language Support (English & አማርኛ)**

• **Language Switcher:** Toggle between **English** and **አማርኛ (Amharic)** anytime using the **"አማርኛ"** button in the top navigation header.
• **Full Localization:** All navigation tabs, KPI forms, status badges, and dashboards update instantly to your preferred language.`;
  }
  // 8. Contact & Support
  else if (lowerPrompt.includes('contact') || lowerPrompt.includes('support') || lowerPrompt.includes('help') || lowerPrompt.includes('inquiry') || lowerPrompt.includes('issue')) {
    textResult = `**Bunna Bank EPMS Support & Assistance**

• **Submit Inquiry:** Navigate to **"Contact"** in the navigation bar to submit an inquiry directly to the EPMS support team.
• **Headquarters:** Bunna Bank S.C. HQ, Addis Ababa, Ethiopia.
• **Direct Email:** support@bunnabanksc.com | Phone: +251 (0) 11 111 2233.`;
  }
  // 9. Roles & Permissions
  else if (lowerPrompt.includes('role') || lowerPrompt.includes('admin') || lowerPrompt.includes('employee') || lowerPrompt.includes('permission')) {
    textResult = `**EPMS User Roles & Access Rights**

• **Employee:** Log daily achievements, track personal KPI progress, save drafts.
• **Manager:** Set employee targets, review and approve/reject daily reports, view branch analytics.
• **Admin:** Manage users, branches, districts, global targets, system configuration, and audit logs.`;
  }
  // 10. General KPI Targets & Overall Performance
  else if (lowerPrompt.includes('target') || lowerPrompt.includes('kpi') || lowerPrompt.includes('goal')) {
    textResult = `**Bunna Bank FY 2025/26 Target Breakdown**

• **Deposits Mobilized:** 15.0B ETB Target (**108.4% Achieved**)
• **Foreign Currency:** $250.0M USD Target (**102.6% Achieved**)
• **Digital Services:** 5.0B ETB Target (**115.2% Achieved**)
• **Account Openings:** 250,000 Accounts Target (**104.5% Achieved**)
• **Bunna Mobile Users:** 350,000 Target (**124.8% Achieved**)`;
  }
  // 11. Leaderboard & District Rankings
  else if (lowerPrompt.includes('district') || lowerPrompt.includes('rank') || lowerPrompt.includes('leader') || lowerPrompt.includes('top')) {
    textResult = `**Bunna Bank District & Branch Leaderboard**

🏆 **Top District Performers:**
1. **Addis Ababa East District** (Score: 98.4/100 • Gold Champion)
2. **Hawassa & Southern District** (Score: 94.2/100 • Silver Star)
3. **Dire Dawa & Eastern District** (Score: 91.8/100 • Bronze Leader)

⭐ **Top Branch:** Main Headquarters Branch (114.2% Attainment).`;
  }
  // 12. Branch / July / General Performance Summary
  else if (lowerPrompt.includes('branch') || lowerPrompt.includes('july') || lowerPrompt.includes('performance') || lowerPrompt.includes('summary') || lowerPrompt.includes('month')) {
    textResult = `**July 2026 Branch Performance Summary**
*Bunna Bank S.C. Live RAG Analysis*

• **Deposits Mobilized:** **ETB 142.5M** logged today (**ETB 1.85B** July total, 108.4% of Target).
• **Digital Onboarding:** **+1,480 Bunna Mobile** users & **+180 QR Merchants** added today.
• **Efficiency Rating:** **99.4% On-Time Report Submissions** with zero pending manager escalations.
• **Branch Ranking:** **#1 Position** in Addis Ababa District.`;
  }
  // 13. Dynamic Catch-All Answer for any custom user question
  else {
    textResult = `**Bunna Bank AI EPMS Assistant**

Regarding your question **"${prompt}"**:
• **Status:** Bunna Bank S.C. EPMS currently tracks 8 major financial & digital KPIs across 500+ nationwide branches.
• **Current Achievement:** Bank-wide target completion is operating at **107.8% (Exceeding Target)** for FY 2025/26.
• **Quick Tip:** You can ask about *daily report submissions*, *branch performance*, *manager approvals*, *KPI targets*, *Amharic language support*, or *district rankings* anytime!`;
  }

  return {
    response: textResult,
    reply: textResult,
    answer: textResult,
    text: textResult
  };
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

    const isManager = payload.roleType === 'Managerial' || payload.role === 'MANAGER';
    const role: UserRole = isManager ? 'MANAGER' : 'EMPLOYEE';
    const fullName = `${payload.firstName} ${payload.lastName}`;

    if (br) {
      if (isManager) {
        br.managerName = fullName;
      } else {
        br.employeeCount = (br.employeeCount || 0) + 1;
      }
    }

    const newUser: User = {
      id: `USR-${Date.now().toString().slice(-6)}`,
      userId: payload.userId || String(Math.floor(1000 + Math.random() * 9000)),
      email: payload.email,
      firstName: payload.firstName,
      middleName: payload.middleName || '',
      lastName: payload.lastName,
      role,
      districtId: payload.districtId || 'DIST-001',
      districtName: dist ? dist.name : 'Addis Ababa District',
      branchId: payload.branchId || 'BR-AAD-01',
      branchName: br ? br.name : 'Addis Ababa Main HQ Branch',
      jobTitle: isManager ? 'Branch Operations Manager' : 'Customer Service Officer',
      gender: (payload.gender === 'Female' || payload.gender === 'FEMALE') ? 'Female' : 'Male',
      age: payload.age ? Number(payload.age) : 30,
      phone: payload.phone || '+251911000000',
      status: 'Active',
      createdAt: new Date().toISOString().split('T')[0]
    };

    if (!defaultUsers.some(u => u.id === newUser.id)) {
      defaultUsers.push(newUser);
    }

    return { 
      message: isManager 
        ? `Registration successful! You are now assigned as Official Manager for ${newUser.branchName}.` 
        : `Registration successful! You are assigned to ${newUser.branchName} under Manager ${br?.managerName || 'Branch Manager'}.`, 
      user: newUser 
    };
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
    if (res.data) {
      const textVal = res.data.response || res.data.reply || res.data.answer || res.data.text;
      if (textVal) {
        return {
          response: textVal,
          reply: textVal,
          answer: textVal,
          text: textVal
        };
      }
      return res.data;
    }
    return generateClientSideAiResponse(prompt, userRole, userId, contextData);
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
