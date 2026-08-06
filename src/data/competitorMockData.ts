import {
  CommercialBank,
  CompetitorBranch,
  CompetitorKpi,
  CompetitorMonthlyPerformance,
  AreaRanking,
  AiCompetitorInsight,
  CompetitorAlert
} from '../types/competitor';

// 1. Commercial Banks Operating in Ethiopia
export const initialCommercialBanks: CommercialBank[] = [];

// 2. Configurable Banking KPIs & BPI Default Weights
export const initialCompetitorKpis: CompetitorKpi[] = [];

// 3. Competitor Branches in Selected Ethiopian Areas
export const initialCompetitorBranches: CompetitorBranch[] = [];

// 4. Monthly Performance Metrics for Competitor Branches
export const initialCompetitorPerformance: CompetitorMonthlyPerformance[] = [
  // BAHIR DAR
  {
    id: 'PERF-BDR-CBE-2026-08',
    branchId: 'CBR-BDR-CBE',
    bankId: 'BNK-CBE',
    bankName: 'Commercial Bank of Ethiopia',
    bankCode: 'CBE',
    branchName: 'CBE Tana Branch',
    city: 'Bahir Dar',
    districtName: 'West A.A & North-West District',
    year: 2026,
    month: 8,
    period: '2026-08',
    metrics: {
      totalCustomers: 48500,
      newCustomers: 1250,
      depositsETB: 85000000,
      casaETB: 62000000,
      loanPortfolioETB: 45000000,
      mobileBankingUsers: 28000,
      internetBankingUsers: 4500,
      atmUsers: 19000,
      posUsers: 320,
      qrUsers: 850,
      revenueETB: 7200000,
      profitETB: 2800000,
      costToIncomeRatio: 42.5,
      customerSatisfactionScore: 88,
      complaintResolutionRate: 94,
      employeeProductivityScore: 92,
      branchGrowthRate: 14.2,
      marketSharePercentage: 38.5
    },
    bpiScore: 89.4
  },
  {
    id: 'PERF-BDR-DASHEN-2026-08',
    branchId: 'CBR-BDR-DASHEN',
    bankId: 'BNK-DASHEN',
    bankName: 'Dashen Bank S.C.',
    bankCode: 'DASHEN',
    branchName: 'Dashen Bank Abay Branch',
    city: 'Bahir Dar',
    districtName: 'West A.A & North-West District',
    year: 2026,
    month: 8,
    period: '2026-08',
    metrics: {
      totalCustomers: 26400,
      newCustomers: 820,
      depositsETB: 48000000,
      casaETB: 31000000,
      loanPortfolioETB: 28000000,
      mobileBankingUsers: 16500,
      internetBankingUsers: 2800,
      atmUsers: 11200,
      posUsers: 210,
      qrUsers: 620,
      revenueETB: 4100000,
      profitETB: 1650000,
      costToIncomeRatio: 46.0,
      customerSatisfactionScore: 86,
      complaintResolutionRate: 91,
      employeeProductivityScore: 88,
      branchGrowthRate: 12.8,
      marketSharePercentage: 22.0
    },
    bpiScore: 82.1
  },
  {
    id: 'PERF-BDR-AWASH-2026-08',
    branchId: 'CBR-BDR-AWASH',
    bankId: 'BNK-AWASH',
    bankName: 'Awash Bank S.C.',
    bankCode: 'AWASH',
    branchName: 'Awash Bank Ghion Branch',
    city: 'Bahir Dar',
    districtName: 'West A.A & North-West District',
    year: 2026,
    month: 8,
    period: '2026-08',
    metrics: {
      totalCustomers: 23100,
      newCustomers: 750,
      depositsETB: 42500000,
      casaETB: 27500000,
      loanPortfolioETB: 24000000,
      mobileBankingUsers: 14800,
      internetBankingUsers: 2300,
      atmUsers: 9800,
      posUsers: 180,
      qrUsers: 510,
      revenueETB: 3750000,
      profitETB: 1420000,
      costToIncomeRatio: 47.2,
      customerSatisfactionScore: 85,
      complaintResolutionRate: 90,
      employeeProductivityScore: 85,
      branchGrowthRate: 11.5,
      marketSharePercentage: 19.5
    },
    bpiScore: 78.6
  },
  {
    id: 'PERF-BDR-BUNNA-2026-08',
    branchId: 'CBR-BDR-BUNNA',
    bankId: 'BNK-BUNNA',
    bankName: 'Bunna Bank S.C.',
    bankCode: 'BUNNA',
    branchName: 'Bunna Bank Bahir Dar Main Branch',
    city: 'Bahir Dar',
    districtName: 'West A.A & North-West District',
    year: 2026,
    month: 8,
    period: '2026-08',
    metrics: {
      totalCustomers: 14800,
      newCustomers: 510,
      depositsETB: 28500000,
      casaETB: 18200000,
      loanPortfolioETB: 15500000,
      mobileBankingUsers: 9200,
      internetBankingUsers: 1100,
      atmUsers: 6400,
      posUsers: 95,
      qrUsers: 340,
      revenueETB: 2450000,
      profitETB: 920000,
      costToIncomeRatio: 51.0,
      customerSatisfactionScore: 84,
      complaintResolutionRate: 88,
      employeeProductivityScore: 82,
      branchGrowthRate: 10.2,
      marketSharePercentage: 13.0
    },
    bpiScore: 71.8
  },
  {
    id: 'PERF-BDR-COOP-2026-08',
    branchId: 'CBR-BDR-COOP',
    bankId: 'BNK-COOP',
    bankName: 'Cooperative Bank of Oromia S.C.',
    bankCode: 'COOP',
    branchName: 'Coop Bank Lake Tana Branch',
    city: 'Bahir Dar',
    districtName: 'West A.A & North-West District',
    year: 2026,
    month: 8,
    period: '2026-08',
    metrics: {
      totalCustomers: 9200,
      newCustomers: 380,
      depositsETB: 15200000,
      casaETB: 9800000,
      loanPortfolioETB: 9100000,
      mobileBankingUsers: 5400,
      internetBankingUsers: 620,
      atmUsers: 3800,
      posUsers: 45,
      qrUsers: 190,
      revenueETB: 1350000,
      profitETB: 480000,
      costToIncomeRatio: 55.4,
      customerSatisfactionScore: 81,
      complaintResolutionRate: 86,
      employeeProductivityScore: 78,
      branchGrowthRate: 8.9,
      marketSharePercentage: 7.0
    },
    bpiScore: 63.5
  }
];

// 5. Pre-Calculated Area Rankings & Gap Analysis
export const initialAreaRankings: AreaRanking[] = [];

// 6. Pre-Generated AI Insights & Recommendations
export const initialAiInsights: AiCompetitorInsight[] = [
  {
    id: 'AI-INS-BDR',
    areaName: 'Bahir Dar',
    bunnaRank: 4,
    totalCompetitors: 5,
    summary: 'Bunna Bank currently holds Rank #4 in the Bahir Dar commercial hub with a BPI Score of 71.8/100. Commercial Bank of Ethiopia (CBE) leads the market with ETB 85M in deposits, followed by Dashen Bank (#2) and Awash Bank (#3).',
    keyWeaknessKpi: 'Total Deposit Mobilization (-66.5% gap vs CBE) & Merchant QR Onboarding',
    fastestGrowingCompetitor: 'Dashen Bank (Abay Branch - +12.8% monthly digital expansion)',
    urgentAttentionBranch: 'Bunna Bank Bahir Dar Main Branch (Sol: BDR-101)',
    managerFirstStep: 'Launch targeted business merchant deposit drives with high-frequency traders around Kebele 04 market district.',
    bestPerformingDistrict: 'West A.A & North-West District',
    highestGrowthPotentialBranch: 'Bunna Bank Bahir Dar Main Branch',
    generatedAt: '2026-08-02 17:30',
    recommendations: [
      {
        id: 'REC-01',
        title: 'Kebele 04 Merchant Deposit Mobilization Drive',
        actionItem: 'Deploy 4 dedicated mobile sales officers to onboard Kebele 04 traders onto Bunna QR & interest-bearing savings accounts.',
        expectedRankImprovement: 'Rank #4 -> Rank #3 in 60 days',
        estimatedCustomerIncrease: 1200,
        estimatedDepositIncreaseETB: 12500000,
        expectedMarketShareGrowthPct: 4.8,
        confidenceScore: 94,
        businessImpact: 'CRITICAL'
      },
      {
        id: 'REC-02',
        title: 'Student & Academic Digital Onboarding (Bahir Dar Univ)',
        actionItem: 'Partner with local university campus kiosks for Bunna Mobile Banking instant app registration.',
        expectedRankImprovement: '+8.5 BPI points in Digital Banking KPI',
        estimatedCustomerIncrease: 2800,
        estimatedDepositIncreaseETB: 3500000,
        expectedMarketShareGrowthPct: 2.2,
        confidenceScore: 89,
        businessImpact: 'HIGH'
      },
      {
        id: 'REC-03',
        title: 'Agricultural Exporter Foreign Currency Credit Facility',
        actionItem: 'Offer tailored export trade finance lines to local sesame & oilseed exporters in West Gojjam.',
        expectedRankImprovement: 'Closes FCY gap vs Dashen Bank by 45%',
        estimatedCustomerIncrease: 85,
        estimatedDepositIncreaseETB: 18000000,
        expectedMarketShareGrowthPct: 6.1,
        confidenceScore: 91,
        businessImpact: 'CRITICAL'
      }
    ]
  }
];

// 7. Initial Competitor Alerts
export const initialCompetitorAlerts: CompetitorAlert[] = [
  {
    id: 'ALT-001',
    type: 'COMPETITOR_OVERTAKE',
    title: 'Competitor Overtake Risk in Hawassa Area',
    message: 'Dashen Bank Hawassa branch deposit growth (+14.2%) is projected to overtake Bunna Bank Hawassa branch in 30 days if current mobilization pace continues.',
    areaName: 'Hawassa',
    branchName: 'Bunna Bank Hawassa Branch',
    severity: 'HIGH',
    timestamp: '2026-08-02 10:15',
    read: false
  },
  {
    id: 'ALT-002',
    type: 'RANK_LOSS',
    title: 'Rank Difference Warning: Bahir Dar Hub',
    message: 'Bunna Bank Bahir Dar branch is currently ranked #4 behind Awash Bank by a gap of ETB 14.0M in deposits.',
    areaName: 'Bahir Dar',
    branchName: 'Bunna Bank Bahir Dar Main Branch',
    severity: 'CRITICAL',
    timestamp: '2026-08-01 14:00',
    read: false
  },
  {
    id: 'ALT-003',
    type: 'DIGITAL_DROP',
    title: 'Digital Banking Activations Slowdown',
    message: 'Merchant solution onboarding dropped 12% in East Addis district compared to competitor CBE Bole Medhanialem branch.',
    areaName: 'East Addis Ababa',
    branchName: 'Bunna Bank Main HQ Branch',
    severity: 'MEDIUM',
    timestamp: '2026-07-30 09:30',
    read: true
  }
];
