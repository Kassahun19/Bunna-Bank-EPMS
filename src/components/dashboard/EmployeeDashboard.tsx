import React, { useState } from 'react';
import {
  Send,
  Save,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Award,
  TrendingUp,
  Award as Medal,
  Calendar,
  AlertCircle,
  Clock,
  Zap,
  DollarSign,
  Smartphone,
  Info,
  UserCheck,
  Download,
  FileSpreadsheet,
  FileText,
  File,
  Printer,
  ChevronDown
} from 'lucide-react';
import { User, DailyPerformanceReport, PerformanceTarget, BankHoliday, getUserFullName, Language } from '../../types';
import { api } from '../../services/api';
import { AllProductsOverview } from './AllProductsOverview';
import { BranchCampaignWidget } from './BranchCampaignWidget';
import { PersonalKpiProgressChart } from './PersonalKpiProgressChart';
import { SubmitReportSection } from '../reports/SubmitReportSection';
import { downloadReportCSV, downloadReportExcel, downloadReportWord, printOrDownloadPDF } from '../../utils/exportUtils';
import { translations } from '../../i18n/translations';

interface EmployeeDashboardProps {
  user: User;
  reports: DailyPerformanceReport[];
  targets: PerformanceTarget[];
  holidays: BankHoliday[];
  onRefreshData: () => void;
  onOpenAiAssistant: () => void;
  onOpenProfile?: () => void;
  language?: Language;
}

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({
  user,
  reports,
  targets,
  holidays,
  onRefreshData,
  onOpenAiAssistant,
  onOpenProfile,
  language = 'en'
}) => {
  const t = translations[language] || translations['en'];
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Employee's Personal Reports
  const myReports = reports.filter(r => r.employeeId === user.id || r.employeeName.toLowerCase().includes(user.firstName.toLowerCase()));
  const employeePerformanceReports = myReports.length > 0 ? myReports : reports;

  // Targets & Progress Calculations
  const depositTarget = 500000; // ETB 500k target
  const actualDeposits = employeePerformanceReports.reduce((acc, r) => acc + (r.depositsETB || 0), 0);
  const depositVariance = actualDeposits - depositTarget;
  const depositCompletionPct = Math.min(Math.round((actualDeposits / depositTarget) * 100), 100);
  const depositRemaining = Math.max(0, depositTarget - actualDeposits);

  const mobileTarget = 100;
  const actualMobile = reports.reduce((acc, r) => acc + (r.mobileBankingActivations || 0), 0);
  const mobileCompletionPct = Math.min(Math.round((actualMobile / mobileTarget) * 100), 100);

  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0B4228] via-[#08321E] to-[#051F13] border border-[#D4AF37]/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-white">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-[#D4AF37] text-[#0B4228] font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase">
              Employee Self-Service
            </span>
            <span className="text-xs text-gray-300">{user.jobTitle} • {user.branchName}</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-1">
            Welcome, {getUserFullName(user)}!
          </h2>
          <p className="text-xs text-gray-300 mt-0.5">
            Record daily performance metrics, track KPI completion & consult AI performance coach
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          
          {/* Download My Report Multi-Format Button */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-[#0B4228] border border-[#D4AF37]/50 text-white font-extrabold text-xs shadow-lg hover:brightness-110 flex items-center space-x-2 transition-all"
            >
              <Download className="w-4 h-4 text-[#D4AF37]" />
              <span>{t.downloadMyReport || 'Download My Report'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#D4AF37]" />
            </button>

            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#08321E] border border-[#D4AF37]/40 shadow-2xl z-30 p-2 space-y-1">
                <div className="px-3 py-1.5 border-b border-white/10">
                  <p className="text-[10px] font-bold text-[#D4AF37] uppercase">Export Personal Data</p>
                </div>
                
                <button
                  onClick={() => {
                    downloadReportExcel(employeePerformanceReports, getUserFullName(user), user);
                    setShowExportMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs text-white hover:bg-white/10 flex items-center space-x-2.5 transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <span>Excel Spreadsheet (.xlsx)</span>
                </button>

                <button
                  onClick={() => {
                    downloadReportCSV(employeePerformanceReports, getUserFullName(user));
                    setShowExportMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs text-white hover:bg-white/10 flex items-center space-x-2.5 transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
                  <span>CSV File (.csv)</span>
                </button>

                <button
                  onClick={() => {
                    downloadReportWord(employeePerformanceReports, getUserFullName(user), user);
                    setShowExportMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs text-white hover:bg-white/10 flex items-center space-x-2.5 transition-colors"
                >
                  <File className="w-4 h-4 text-blue-400" />
                  <span>Word Document (.docx)</span>
                </button>

                <button
                  onClick={() => {
                    printOrDownloadPDF(employeePerformanceReports, getUserFullName(user), user);
                    setShowExportMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs text-white hover:bg-white/10 flex items-center space-x-2.5 transition-colors"
                >
                  <Printer className="w-4 h-4 text-amber-400" />
                  <span>PDF Document / Print</span>
                </button>
              </div>
            )}
          </div>

          {onOpenProfile && (
            <button
              onClick={onOpenProfile}
              className="px-4 py-2.5 rounded-xl bg-[#08321E] hover:bg-white/10 border border-[#D4AF37]/40 text-xs font-bold flex items-center space-x-2 text-[#D4AF37]"
            >
              <UserCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>{t.myRoleProfile || 'My Role Profile'}</span>
            </button>
          )}

          <button
            onClick={onOpenAiAssistant}
            className="px-5 py-2.5 rounded-xl bg-[#D4AF37] text-[#0B4228] font-bold text-xs shadow-lg hover:bg-[#e0be4d] flex items-center space-x-2"
          >
            <Sparkles className="w-4 h-4 text-[#0B4228]" />
            <span>{t.askAiCoach || 'Ask AI Performance Coach'}</span>
          </button>
        </div>
      </div>

      {/* Branch Daily Campaign Analytics Engine */}
      <BranchCampaignWidget
        branchName={user.branchName || 'Headquarters Branch'}
        userRole={user.role}
        reports={employeePerformanceReports}
        onReportSubmitted={onRefreshData}
      />

      {/* Product Achievements & Reports Summary */}
      <AllProductsOverview
        reports={employeePerformanceReports}
        targets={targets}
        title={`My Individual Performance & Evaluation (${getUserFullName(user)})`}
        subtitle="Track personal achievements, percentage progress, variance, and periodic performance score out of 100%"
      />

      {/* 6-Month Personal KPI Progress Visualization (Recharts) */}
      <PersonalKpiProgressChart
        reports={employeePerformanceReports}
        targets={targets}
        employeeName={getUserFullName(user)}
      />

      {/* Speedometer & Target Gauge Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Deposit Target Progress Card */}
        <div className="p-6 rounded-3xl bg-[#08321E] border border-[#D4AF37]/30 shadow-xl text-white space-y-4 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-gray-400 font-semibold">Deposits Target Progress</p>
              <h3 className="text-xl font-extrabold text-white mt-0.5">
                ETB {actualDeposits.toLocaleString()}
              </h3>
              <p className="text-[11px] text-[#D4AF37] font-medium">Target: ETB {depositTarget.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center font-bold text-sm">
              {depositCompletionPct}%
            </div>
          </div>

          {/* Animated Progress Bar */}
          <div className="space-y-1">
            <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#D4AF37] to-[#10B981] h-full transition-all duration-500"
                style={{ width: `${depositCompletionPct}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-gray-400">
              <span>Variance: <strong className={depositVariance >= 0 ? 'text-emerald-400' : 'text-amber-400'}>{depositVariance >= 0 ? '+' : ''}ETB {depositVariance.toLocaleString()}</strong></span>
              <span>Remaining: <strong className="text-white">ETB {depositRemaining.toLocaleString()}</strong></span>
            </div>
          </div>
        </div>

        {/* Mobile Banking Target Gauge Card */}
        <div className="p-6 rounded-3xl bg-[#08321E] border border-[#D4AF37]/30 shadow-xl text-white space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-gray-400 font-semibold">Bunna Mobile Activations</p>
              <h3 className="text-xl font-extrabold text-white mt-0.5">
                {actualMobile} Users
              </h3>
              <p className="text-[11px] text-emerald-400 font-medium">Monthly Target: {mobileTarget} Users</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
              {mobileCompletionPct}%
            </div>
          </div>

          <div className="space-y-1">
            <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all duration-500"
                style={{ width: `${mobileCompletionPct}%` }}
              />
            </div>
            <p className="text-[11px] text-gray-400">
              Remaining: <strong className="text-white">{Math.max(0, mobileTarget - actualMobile)} Activations</strong>
            </p>
          </div>
        </div>

        {/* Achievement Badges Card */}
        <div className="p-6 rounded-3xl bg-[#08321E] border border-[#D4AF37]/30 shadow-xl text-white space-y-3">
          <h4 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider flex items-center space-x-1.5">
            <Medal className="w-4 h-4" />
            <span>Achievement Badges & Tier</span>
          </h4>

          <div className="space-y-2">
            <div className="p-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37]/20 to-amber-500/10 border border-[#D4AF37]/40 flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-[#D4AF37] text-[#0B4228] font-bold flex items-center justify-center text-xs">
                🥇
              </div>
              <div>
                <p className="font-bold text-xs text-white">Gold Mobilizer Champion</p>
                <p className="text-[10px] text-gray-300">Awarded for exceeding deposit targets 3 months in a row.</p>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs">
                ⚡
              </div>
              <div>
                <p className="font-bold text-xs text-white">Digital Trailblazer</p>
                <p className="text-[10px] text-gray-300">Top 5 Bunna Mobile activations in Finfinne District.</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* EYE-CATCHING, ELEGANT, ANIMATING REPORT SUBMISSION SECTION */}
      <SubmitReportSection
        user={user}
        reports={reports}
        holidays={holidays}
        onRefreshData={onRefreshData}
        language={language}
      />

      {/* MY HISTORICAL REPORTS TABLE */}
      <div className="p-6 rounded-3xl bg-[#08321E] border border-[#D4AF37]/30 shadow-xl text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-extrabold text-lg text-white">{t.mySubmittedReports || 'My Submitted Reports Log'}</h3>
            <p className="text-xs text-gray-300">Detailed historical record of daily performance submissions and manager approvals.</p>
          </div>

          <button
            onClick={() => downloadReportExcel(employeePerformanceReports, getUserFullName(user), user)}
            className="px-4 py-2 rounded-xl bg-[#D4AF37] text-[#0B4228] font-bold text-xs flex items-center space-x-1.5 shadow-md hover:bg-[#e0be4d] transition-all"
          >
            <Download className="w-3.5 h-3.5 text-[#0B4228]" />
            <span>{t.export || 'Export Report'}</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-[#0B4228] text-[#D4AF37] font-bold uppercase">
              <tr>
                <th className="p-3">Report Date</th>
                <th className="p-3">Day</th>
                <th className="p-3">Deposits (ETB)</th>
                <th className="p-3">FCY (ETB)</th>
                <th className="p-3">Mobile Banking</th>
                <th className="p-3">Status</th>
                <th className="p-3">Manager Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {reports.filter(r => r.employeeId === user.id).map(r => (
                <tr key={r.id} className="hover:bg-white/5">
                  <td className="p-3 font-bold text-[#D4AF37]">{r.reportDate}</td>
                  <td className="p-3">{r.dayOfWeek}</td>
                  <td className="p-3 font-bold text-emerald-400">ETB {r.depositsETB?.toLocaleString()}</td>
                  <td className="p-3 font-semibold">ETB {r.foreignCurrencyETB?.toLocaleString()}</td>
                  <td className="p-3 font-bold">{r.mobileBankingActivations}</td>
                  <td className="p-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      r.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-300' :
                      r.status === 'Pending' ? 'bg-amber-500/20 text-amber-300' :
                      r.status === 'Returned' ? 'bg-blue-500/20 text-blue-300' : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="p-3 text-gray-300 text-[11px]">{r.managerComment || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
