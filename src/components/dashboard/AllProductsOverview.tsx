import React, { useState } from 'react';
import {
  TrendingUp,
  Coins,
  DollarSign,
  Smartphone,
  Globe,
  QrCode,
  CreditCard,
  UserPlus,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  FileSpreadsheet,
  ArrowUpRight,
  ShieldCheck,
  Building
} from 'lucide-react';
import { DailyPerformanceReport, PerformanceTarget, KPI } from '../../types';
import { PeriodicPerformanceAnalytics } from './PeriodicPerformanceAnalytics';

interface AllProductsOverviewProps {
  reports: DailyPerformanceReport[];
  targets: PerformanceTarget[];
  kpis?: KPI[];
  title?: string;
  subtitle?: string;
  showBranchDetails?: boolean;
}

export const AllProductsOverview: React.FC<AllProductsOverviewProps> = ({
  reports,
  targets,
  title = "All Products Performance Overview",
  subtitle = "Total achievements in numbers, percentages, remaining targets, and detailed product reports",
  showBranchDetails = true
}) => {
  const [selectedProductKey, setSelectedProductKey] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Approved' | 'Pending' | 'Rejected'>('ALL');

  // Product Configurations for Bunna Bank's 8 core products
  const products = [
    {
      key: 'depositsETB',
      code: 'DEP_ETB',
      name: 'Deposits Mobilized',
      category: 'Financial',
      unit: 'ETB',
      isCurrency: true,
      icon: Coins,
      gradient: 'from-amber-500/20 to-emerald-500/10',
      border: 'border-amber-500/30',
      textColor: 'text-amber-400',
      kpiId: 'KPI-001',
      defaultTarget: 0
    },
    {
      key: 'foreignCurrencyETB',
      code: 'FCY_ETB',
      name: 'Foreign Currency Inflow',
      category: 'Financial',
      unit: 'ETB',
      isCurrency: true,
      icon: DollarSign,
      gradient: 'from-emerald-500/20 to-teal-500/10',
      border: 'border-emerald-500/30',
      textColor: 'text-emerald-400',
      kpiId: 'KPI-002',
      defaultTarget: 0
    },
    {
      key: 'digitalFinancialServicesETB',
      code: 'DFS_ETB',
      name: 'Digital Financial Services',
      category: 'Financial',
      unit: 'ETB',
      isCurrency: true,
      icon: TrendingUp,
      gradient: 'from-blue-500/20 to-cyan-500/10',
      border: 'border-blue-500/30',
      textColor: 'text-blue-400',
      kpiId: 'KPI-003',
      defaultTarget: 0
    },
    {
      key: 'accountOpenings',
      code: 'ACC_OPEN',
      name: 'Account Openings',
      category: 'Customer Acquisition',
      unit: 'Accounts',
      isCurrency: false,
      icon: UserPlus,
      gradient: 'from-purple-500/20 to-pink-500/10',
      border: 'border-purple-500/30',
      textColor: 'text-purple-400',
      kpiId: 'KPI-004',
      defaultTarget: 0
    },
    {
      key: 'mobileBankingActivations',
      code: 'MB_ACT',
      name: 'Mobile Banking Activations',
      category: 'Digital Banking',
      unit: 'Users',
      isCurrency: false,
      icon: Smartphone,
      gradient: 'from-indigo-500/20 to-blue-500/10',
      border: 'border-indigo-500/30',
      textColor: 'text-indigo-400',
      kpiId: 'KPI-005',
      defaultTarget: 0
    },
    {
      key: 'internetBankingActivations',
      code: 'IB_ACT',
      name: 'Internet Banking Activations',
      category: 'Digital Banking',
      unit: 'Users',
      isCurrency: false,
      icon: Globe,
      gradient: 'from-cyan-500/20 to-teal-500/10',
      border: 'border-cyan-500/30',
      textColor: 'text-cyan-400',
      kpiId: 'KPI-006',
      defaultTarget: 0
    },
    {
      key: 'merchantSolutions',
      code: 'MERCH_SOL',
      name: 'Merchant Solutions & QR',
      category: 'Digital Banking',
      unit: 'Merchants',
      isCurrency: false,
      icon: QrCode,
      gradient: 'from-orange-500/20 to-amber-500/10',
      border: 'border-orange-500/30',
      textColor: 'text-orange-400',
      kpiId: 'KPI-007',
      defaultTarget: 0
    },
    {
      key: 'atmCardActivations',
      code: 'ATM_CARD',
      name: 'ATM Card Activations',
      category: 'Digital Banking',
      unit: 'Cards',
      isCurrency: false,
      icon: CreditCard,
      gradient: 'from-teal-500/20 to-emerald-500/10',
      border: 'border-teal-500/30',
      textColor: 'text-teal-400',
      kpiId: 'KPI-008',
      defaultTarget: 0
    }
  ];

  // Calculate Product Stats
  const productStats = products.map(prod => {
    // Total achieved across all submitted/approved reports
    const achieved = reports.reduce((sum, r) => sum + (Number((r as any)[prod.key]) || 0), 0);
    
    // Find matching target
    const targetObj = targets.find(t => t.kpiId === prod.kpiId || t.kpiName.toLowerCase().includes(prod.name.toLowerCase()));
    const target = targetObj ? targetObj.targetValue : prod.defaultTarget;

    const percentage = target > 0 ? (achieved / target) * 100 : 0;
    const remaining = Math.max(0, target - achieved);
    const excess = achieved > target ? achieved - target : 0;

    return {
      ...prod,
      target,
      achieved,
      percentage: Number(percentage.toFixed(1)),
      remaining,
      excess
    };
  });

  // Filter Reports for Table
  const filteredReports = reports.filter(report => {
    // Status Filter
    if (statusFilter !== 'ALL' && report.status !== statusFilter) return false;

    // Product Filter
    if (selectedProductKey !== 'all') {
      const val = Number((report as any)[selectedProductKey]);
      if (!val || val <= 0) return false;
    }

    // Search Term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchName = report.employeeName.toLowerCase().includes(term);
      const matchBranch = report.branchName.toLowerCase().includes(term);
      const matchDistrict = report.districtName.toLowerCase().includes(term);
      const matchDate = report.reportDate.includes(term);
      return matchName || matchBranch || matchDistrict || matchDate;
    }

    return true;
  });

  const formatValue = (value: number, isCurrency: boolean) => {
    if (isCurrency) {
      if (value >= 1_000_000) {
        return `ETB ${(value / 1_000_000).toFixed(2)}M`;
      } else if (value >= 1_000) {
        return `ETB ${(value / 1_000).toFixed(1)}k`;
      }
      return `ETB ${value.toLocaleString()}`;
    }
    return value.toLocaleString();
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Section Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#6B3F1D] via-[#4A2C17] to-[#362011] border border-[#C89A2B]/30 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="bg-[#C89A2B] text-[#6B3F1D] font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase">
                Bunna Bank EPMS Metrics
              </span>
              <span className="text-xs text-gray-300">All 8 Core Products</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-[#C89A2B]" />
              {title}
            </h3>
            <p className="text-xs text-gray-300 mt-0.5">{subtitle}</p>
          </div>

          <div className="flex items-center space-x-3 bg-black/20 p-2.5 rounded-2xl border border-white/10 text-xs">
            <div className="text-right">
              <p className="text-[10px] text-gray-400 uppercase font-bold">Total Reports Submitted</p>
              <p className="text-base font-extrabold text-[#C89A2B]">{reports.length}</p>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="text-right">
              <p className="text-[10px] text-gray-400 uppercase font-bold">Approved Reports</p>
              <p className="text-base font-extrabold text-emerald-400">
                {reports.filter(r => r.status === 'Approved').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Periodic Performance Evaluation Engine (100% Scale for Monthly, Quarterly, Semi-Annually, Annually) */}
      <PeriodicPerformanceAnalytics reports={reports} targets={targets} />

      {/* Grid of 8 Product Achievement Cards with Hanging & Hover Animations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {productStats.map(prod => {
          const Icon = prod.icon;
          const isTargetExceeded = prod.percentage >= 100;
          const diff = prod.achieved - prod.target;
          let signStr = '';
          if (diff > 0) signStr = '+';
          else if (diff < 0) signStr = '-';
          const absDiff = Math.abs(diff);

          return (
            <div
              key={prod.key}
              onClick={() => setSelectedProductKey(prod.key)}
              className={`p-5 rounded-2xl bg-[#4A2C17]/95 border ${prod.border} shadow-xl hover:-translate-y-2.5 hover:shadow-[0_25px_50px_rgba(200,154,43,0.22)] hover:border-[#C89A2B] transition-all duration-300 transform-gpu cursor-pointer relative overflow-hidden group ${
                selectedProductKey === prod.key ? 'ring-2 ring-[#C89A2B] scale-[1.02]' : ''
              }`}
            >
              <div className={`absolute top-0 right-0 w-24 h-24 rounded-full bg-gradient-to-br ${prod.gradient} blur-xl opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none`} />

              <div className="flex items-center justify-between mb-3 relative z-10">
                <div className={`p-2.5 rounded-xl bg-white/5 border border-white/10 ${prod.textColor}`}>
                  <Icon className="w-5 h-5" />
                </div>

                <div className={`px-2.5 py-1 rounded-full text-xs font-black flex items-center space-x-1 ${
                  isTargetExceeded 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                    : prod.percentage >= 80 
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' 
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                }`}>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>{prod.percentage}%</span>
                </div>
              </div>

              <h4 className="text-sm font-bold text-white group-hover:text-[#C89A2B] transition-colors">{prod.name}</h4>
              <p className="text-[10px] text-gray-400 uppercase font-semibold">{prod.category}</p>

              {/* Numbers Overview with strict +, -, or none for remaining variance */}
              <div className="mt-4 space-y-1.5 border-t border-white/10 pt-3">
                <div className="flex justify-between items-baseline text-xs">
                  <span className="text-gray-400">Achieved:</span>
                  <span className={`font-black text-sm ${prod.textColor}`}>
                    {formatValue(prod.achieved, prod.isCurrency)}
                  </span>
                </div>

                <div className="flex justify-between items-baseline text-xs">
                  <span className="text-gray-400">Target:</span>
                  <span className="font-semibold text-gray-200">
                    {formatValue(prod.target, prod.isCurrency)}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400">Remaining / Variance:</span>
                  <span className={`font-black text-xs px-2 py-0.5 rounded-md border ${
                    diff > 0 
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
                      : diff < 0 
                      ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' 
                      : 'bg-gray-500/20 text-gray-300 border-gray-500/30'
                  }`}>
                    {diff === 0 ? '0' : `${signStr}${formatValue(absDiff, prod.isCurrency)}`}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-3 relative pt-1">
                <div className="overflow-hidden h-2 text-xs flex rounded-full bg-black/40 border border-white/10">
                  <div
                    style={{ width: `${Math.min(prod.percentage, 100)}%` }}
                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-700 ${
                      isTargetExceeded
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                        : prod.percentage >= 80
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                        : 'bg-gradient-to-r from-rose-500 to-pink-500'
                    }`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Product Reports Table Section */}
      <div className="bg-[#4A2C17] border border-[#C89A2B]/30 rounded-3xl p-6 shadow-xl space-y-4">
        
        {/* Table Controls Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-[#C89A2B]" />
              Product Performance Reports Database
            </h4>
            <p className="text-xs text-gray-300">
              {selectedProductKey === 'all'
                ? 'Showing figures for all 8 Bunna Bank products across all submitted reports'
                : `Filtered view for: ${products.find(p => p.key === selectedProductKey)?.name}`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            {/* Product Selector Dropdown */}
            <select
              value={selectedProductKey}
              onChange={(e) => setSelectedProductKey(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:border-[#C89A2B] focus:outline-none font-semibold"
            >
              <option value="all" className="bg-[#6B3F1D]">All 8 Products</option>
              {products.map(p => (
                <option key={p.key} value={p.key} className="bg-[#6B3F1D]">{p.name}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:border-[#C89A2B] focus:outline-none font-semibold"
            >
              <option value="ALL" className="bg-[#6B3F1D]">All Statuses</option>
              <option value="Approved" className="bg-[#6B3F1D]">Approved Only</option>
              <option value="Pending" className="bg-[#6B3F1D]">Pending Review</option>
              <option value="Rejected" className="bg-[#6B3F1D]">Rejected</option>
            </select>

            {/* Search Input */}
            <div className="relative flex-1 sm:w-48">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search staff, branch..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-400 focus:border-[#C89A2B] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Reports Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-200">
            <thead className="bg-white/5 border-b border-white/10 text-[11px] uppercase tracking-wider text-[#C89A2B] font-bold">
              <tr>
                <th className="py-3 px-4">Date & ID</th>
                <th className="py-3 px-4">Staff & Branch</th>
                <th className="py-3 px-4">Deposits (ETB)</th>
                <th className="py-3 px-4">FCY (ETB)</th>
                <th className="py-3 px-4">DFS (ETB)</th>
                <th className="py-3 px-4 text-center">Accounts</th>
                <th className="py-3 px-4 text-center">Mobile Bank</th>
                <th className="py-3 px-4 text-center">Internet Bank</th>
                <th className="py-3 px-4 text-center">Merchant POS</th>
                <th className="py-3 px-4 text-center">ATM Cards</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-gray-400">
                    No performance reports match the selected filters or search terms.
                  </td>
                </tr>
              ) : (
                filteredReports.map(report => (
                  <tr key={report.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-mono">
                      <p className="font-bold text-white">{report.reportDate}</p>
                      <p className="text-[10px] text-gray-400">{report.id}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-bold text-white">{report.employeeName}</p>
                      <p className="text-[10px] text-[#C89A2B]">{report.branchName}</p>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-amber-300">
                      ETB {(report.depositsETB || 0).toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-emerald-300">
                      ETB {(report.foreignCurrencyETB || 0).toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-blue-300">
                      ETB {(report.digitalFinancialServicesETB || 0).toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-center font-bold text-purple-300">
                      {report.accountOpenings || 0}
                    </td>

                    <td className="py-3.5 px-4 text-center font-bold text-indigo-300">
                      {report.mobileBankingActivations || 0}
                    </td>

                    <td className="py-3.5 px-4 text-center font-bold text-cyan-300">
                      {report.internetBankingActivations || 0}
                    </td>

                    <td className="py-3.5 px-4 text-center font-bold text-orange-300">
                      {report.merchantSolutions || 0}
                    </td>

                    <td className="py-3.5 px-4 text-center font-bold text-teal-300">
                      {report.atmCardActivations || 0}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        report.status === 'Approved'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : report.status === 'Pending'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                      }`}>
                        {report.status === 'Approved' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                        <span>{report.status}</span>
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
