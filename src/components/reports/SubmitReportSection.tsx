import React, { useState } from 'react';
import {
  Calendar,
  DollarSign,
  Smartphone,
  Save,
  Send,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Award,
  Zap,
  CreditCard,
  Building2,
  Flame,
  ChevronRight,
  Info,
  Plus,
  Minus
} from 'lucide-react';
import { User, BankHoliday, DailyPerformanceReport, getUserFullName, Language } from '../../types';
import { api } from '../../services/api';
import { translations } from '../../i18n/translations';

interface SubmitReportSectionProps {
  user: User;
  reports?: DailyPerformanceReport[];
  holidays?: BankHoliday[];
  onRefreshData?: () => void;
  language?: Language;
  className?: string;
  isInsideModal?: boolean;
}

export const SubmitReportSection: React.FC<SubmitReportSectionProps> = ({
  user,
  reports = [],
  holidays = [],
  onRefreshData,
  language = 'en',
  className = '',
  isInsideModal = false
}) => {
  const t = translations[language] || translations['en'];

  // Form State
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
  const [depositsETB, setDepositsETB] = useState<number | ''>('');
  const [foreignCurrencyETB, setForeignCurrencyETB] = useState<number | ''>('');
  const [digitalFinancialServicesETB, setDigitalFinancialServicesETB] = useState<number | ''>('');

  const [accountOpenings, setAccountOpenings] = useState<number | ''>('');
  const [mobileBankingActivations, setMobileBankingActivations] = useState<number | ''>('');
  const [internetBankingActivations, setInternetBankingActivations] = useState<number | ''>('');
  const [merchantSolutionsActivations, setMerchantSolutionsActivations] = useState<number | ''>('');
  const [atmCardsIssued, setAtmCardsIssued] = useState<number | ''>('');

  const [submitting, setSubmitting] = useState(false);
  const [formMsg, setFormMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Check if date is Sunday
  const isSundayDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.getDay() === 0;
  };

  // Check if date is Bank Holiday
  const getHolidayMatch = (dateStr: string) => {
    return holidays.find(h => h.date === dateStr);
  };

  const isSunday = isSundayDate(reportDate);
  const matchedHoliday = getHolidayMatch(reportDate);
  const isBlockedDate = isSunday || !!matchedHoliday;

  // Check if report already exists for selected date
  const existingReport = reports.find(r => r.reportDate === reportDate && r.employeeId === user.id);

  // Persuasive Live Calculations
  const totalValMobilized = Number(depositsETB || 0) + Number(foreignCurrencyETB || 0) + Number(digitalFinancialServicesETB || 0);
  const totalDigitalCount = Number(accountOpenings || 0) + Number(mobileBankingActivations || 0) + Number(internetBankingActivations || 0) + Number(merchantSolutionsActivations || 0) + Number(atmCardsIssued || 0);

  // Calculated Motivation Score out of 100%
  const targetVal = 0;
  const liveProgressPct = targetVal > 0 ? Math.min(Math.round((totalValMobilized / targetVal) * 100), 100) : 0;

  const handleSubmitReport = async (isDraft: boolean) => {
    if (isBlockedDate) {
      setFormMsg({
        type: 'error',
        text: isSunday
          ? (language === 'am' ? 'በእሁድ ቀናት ሪፖርት ማስገባት አይቻልም።' : 'Daily performance submission is disallowed on Sundays.')
          : (language === 'am' ? `በ ${matchedHoliday?.name} የባንክ በዓል ሪፖርት ማስገባት አይቻልም።` : `Daily performance submission is disallowed on ${matchedHoliday?.name}.`)
      });
      return;
    }

    setSubmitting(true);
    setFormMsg(null);

    try {
      await api.submitDailyReport({
        employeeId: user.id,
        employeeName: getUserFullName(user),
        branchId: user.branchId || 'b1',
        branchName: user.branchName || 'Finfinne Main Branch',
        reportDate,
        dayOfWeek: new Date(reportDate).toLocaleDateString('en-US', { weekday: 'long' }),
        depositsETB: Number(depositsETB || 0),
        foreignCurrencyETB: Number(foreignCurrencyETB || 0),
        digitalFinancialServicesETB: Number(digitalFinancialServicesETB || 0),
        accountOpenings: Number(accountOpenings || 0),
        mobileBankingActivations: Number(mobileBankingActivations || 0),
        internetBankingActivations: Number(internetBankingActivations || 0),
        merchantSolutionsActivations: Number(merchantSolutionsActivations || 0),
        atmCardsIssued: Number(atmCardsIssued || 0),
        status: isDraft ? 'Draft' : 'Pending'
      });

      setFormMsg({
        type: 'success',
        text: isDraft
          ? (language === 'am' ? 'የዕለቱ ሪፖርት ረቂቅ በስኬት ተቀምጧል።' : 'Daily performance report draft saved successfully.')
          : (language === 'am' ? 'የዕለቱ ሪፖርት ለቅርንጫፍ ሥራ አስኪያጅ በስኬት ተልኳል!' : 'Daily performance report submitted to Branch Manager successfully!')
      });

      if (onRefreshData) onRefreshData();
    } catch (err: any) {
      setFormMsg({ type: 'error', text: err.message || 'Failed to submit report.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      
      {/* Outer Glowing Glow Backdrop */}
      <div className="absolute -top-4 -left-4 -right-4 -bottom-4 bg-gradient-to-r from-[#C89A2B]/20 via-amber-500/10 to-[#C89A2B]/20 rounded-[38px] blur-xl opacity-80 pointer-events-none animate-pulse" />

      {/* Main Floating Container */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#6B3F1D] via-[#4A2C17] to-[#2E1B0E] border-2 border-[#C89A2B]/60 shadow-[0_20px_50px_rgba(200,154,43,0.25)] text-white space-y-6 overflow-hidden">
        
        {/* Top Decorative Floating Banner & Badges */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-[#C89A2B]/30">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="bg-gradient-to-r from-[#C89A2B] to-[#D8B45C] text-[#6B3F1D] font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-wider flex items-center space-x-1 shadow-md">
                <Sparkles className="w-3 h-3 text-[#6B3F1D] animate-spin" />
                <span>{t.dailyPerformance || 'Daily Performance Submission'}</span>
              </span>
              <span className="text-[11px] text-[#C89A2B] font-semibold bg-[#C89A2B]/10 px-2.5 py-0.5 rounded-full border border-[#C89A2B]/30">
                {t.workingDaysOnly || 'Working Days Only'}
              </span>
            </div>

            <h3 className="text-2xl font-black text-white flex items-center space-x-2 pt-1">
              <Calendar className="w-6 h-6 text-[#C89A2B]" />
              <span>{t.createReportMenu || 'Submit Daily Performance Report'}</span>
            </h3>
            <p className="text-xs text-gray-300">
              {language === 'am' 
                ? 'የዕለቱን የፋይናንስ ማሰባሰብ እና የዲጂታል ባንክ አፈፃፀም መረጃዎችን እዚህ ይመዝግቡ።' 
                : 'Log daily deposits, FCY remittances, and digital banking activations for branch manager approval.'}
            </p>
          </div>

          {/* Persuasive Live Progress Meter */}
          <div className="p-3 rounded-2xl bg-black/40 border border-[#C89A2B]/40 text-right min-w-[200px]">
            <div className="flex items-center justify-end space-x-1.5 text-xs text-[#C89A2B] font-bold">
              <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
              <span>Today's Impact Score</span>
            </div>
            <div className="text-xl font-black text-emerald-400">
              {liveProgressPct}% Target
            </div>
            <p className="text-[10px] text-gray-400">
              ETB {totalValMobilized.toLocaleString()} Mobilized Today
            </p>
          </div>
        </div>

        {/* Persuasive Motivation Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#C89A2B]/15 via-amber-500/10 to-[#C89A2B]/10 border border-[#C89A2B]/40 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#C89A2B] text-[#6B3F1D] font-bold flex items-center justify-center shrink-0 shadow-lg">
              🏆
            </div>
            <div>
              <p className="font-extrabold text-white text-xs">
                {liveProgressPct >= 80 ? '🌟 Outstanding Contribution!' : '🚀 Keep Pushing Excellence!'}
              </p>
              <p className="text-[11px] text-gray-300">
                {liveProgressPct >= 80 
                  ? 'Your entries place you in the Top Performance Bracket for Finfinne Branch today.'
                  : `Add your daily achievements below to climb up the Gold Mobilizer Leaderboard.`}
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-1 text-[11px] font-bold text-[#C89A2B]">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>+150 XP</span>
          </div>
        </div>

        {/* Date Selector & Sunday / Bank Holiday Validation Banner */}
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#C89A2B] mb-1">
                {t.selectDate || 'Select Report Date'}
              </label>
              <input
                type="date"
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/30 border border-[#C89A2B]/40 text-sm text-white focus:outline-none focus:border-[#C89A2B] shadow-inner font-bold"
              />
            </div>

            <div className="flex items-center text-xs text-gray-300 pt-5">
              <p>Day of Week: <strong className="text-[#C89A2B] font-bold text-sm ml-1">{new Date(reportDate).toLocaleDateString('en-US', { weekday: 'long' })}</strong></p>
            </div>
          </div>

          {/* Validation Banner if Sunday or Bank Holiday */}
          {isBlockedDate && (
            <div className="p-4 rounded-2xl bg-rose-500/20 border border-rose-500/50 text-rose-200 text-xs flex items-center space-x-3 shadow-lg">
              <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0" />
              <div>
                <p className="font-bold">Submission Disallowed for Selected Date</p>
                <p className="text-[11px] mt-0.5">
                  {isSunday
                    ? 'Sundays are official non-working days. Daily performance entry is disabled.'
                    : `Selected date is an official Bank Holiday (${matchedHoliday?.name}). Daily performance entry is disabled.`}
                </p>
              </div>
            </div>
          )}

          {/* Warning if report already exists for selected date */}
          {existingReport && !isBlockedDate && (
            <div className="p-3.5 rounded-xl bg-amber-500/20 border border-amber-500/50 text-amber-200 text-xs flex items-center space-x-2">
              <Info className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Note: A report already exists for this date with status "{existingReport.status}". Submitting again will update the record.</span>
            </div>
          )}
        </div>

        {/* Form Messages */}
        {formMsg && (
          <div className={`p-4 rounded-xl text-xs flex items-center space-x-2.5 shadow-lg ${
            formMsg.type === 'success' ? 'bg-emerald-500/20 border border-emerald-500 text-emerald-200' : 'bg-rose-500/20 border border-rose-500 text-rose-200'
          }`}>
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span className="font-bold text-xs">{formMsg.text}</span>
          </div>
        )}

        {/* Section 1: Financial Mobilization Metrics (ETB) */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-[#C89A2B] uppercase tracking-wider flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-[#C89A2B]" />
              <span>{t.financialMobilization || 'Financial Mobilization Metrics (ETB)'}</span>
            </h4>
            <span className="text-[11px] text-emerald-400 font-semibold">
              Subtotal: ETB {totalValMobilized.toLocaleString()}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Savings Deposits */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#C89A2B]/50 transition-all space-y-1.5">
              <label className="block text-[11px] font-bold text-gray-200">
                {t.deposits || 'Savings & Term Deposits (ETB)'}
              </label>
              <div className="relative">
                <input
                  type="number"
                  disabled={isBlockedDate}
                  value={depositsETB}
                  onChange={(e) => setDepositsETB(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="e.g. 150000"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/30 border border-white/20 text-xs text-white font-bold focus:outline-none focus:border-[#C89A2B]"
                />
              </div>
            </div>

            {/* Foreign Currency FCY */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#C89A2B]/50 transition-all space-y-1.5">
              <label className="block text-[11px] font-bold text-gray-200">
                {t.fcy || 'Foreign Currency / FCY Remittance (ETB)'}
              </label>
              <input
                type="number"
                disabled={isBlockedDate}
                value={foreignCurrencyETB}
                onChange={(e) => setForeignCurrencyETB(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="e.g. 5000"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/30 border border-white/20 text-xs text-white font-bold focus:outline-none focus:border-[#C89A2B]"
              />
            </div>

            {/* Digital Financial Services */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#C89A2B]/50 transition-all space-y-1.5">
              <label className="block text-[11px] font-bold text-gray-200">
                {t.dfs || 'Digital Financial Services Vol (ETB)'}
              </label>
              <input
                type="number"
                disabled={isBlockedDate}
                value={digitalFinancialServicesETB}
                onChange={(e) => setDigitalFinancialServicesETB(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="e.g. 25000"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/30 border border-white/20 text-xs text-white font-bold focus:outline-none focus:border-[#C89A2B]"
              />
            </div>

          </div>
        </div>

        {/* Section 2: Digital Banking & Customer Activations */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-[#C89A2B] uppercase tracking-wider flex items-center space-x-2">
              <Smartphone className="w-4 h-4 text-[#C89A2B]" />
              <span>{t.digitalActivations || 'Digital Banking & Customer Activations'}</span>
            </h4>
            <span className="text-[11px] text-cyan-400 font-semibold">
              Total Activations: {totalDigitalCount} Units
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            
            {/* New Accounts */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-400/50 transition-all space-y-1.5 text-center">
              <label className="block text-[11px] font-bold text-gray-200 truncate">{t.accountOpening || 'New Accounts'}</label>
              <div className="flex items-center justify-between space-x-1">
                <button
                  type="button"
                  disabled={isBlockedDate || Number(accountOpenings) <= 0}
                  onClick={() => setAccountOpenings(Math.max(0, Number(accountOpenings || 0) - 1))}
                  className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <input
                  type="number"
                  disabled={isBlockedDate}
                  value={accountOpenings}
                  onChange={(e) => setAccountOpenings(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-12 text-center py-1 rounded-lg bg-black/30 border border-white/20 text-xs text-white font-bold focus:outline-none"
                />
                <button
                  type="button"
                  disabled={isBlockedDate}
                  onClick={() => setAccountOpenings(Number(accountOpenings || 0) + 1)}
                  className="w-7 h-7 rounded-lg bg-[#C89A2B] hover:bg-[#D8B45C] flex items-center justify-center text-[#6B3F1D] font-bold"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Mobile Banking */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-400/50 transition-all space-y-1.5 text-center">
              <label className="block text-[11px] font-bold text-gray-200 truncate">{t.mobileBanking || 'Bunna Mobile'}</label>
              <div className="flex items-center justify-between space-x-1">
                <button
                  type="button"
                  disabled={isBlockedDate || Number(mobileBankingActivations) <= 0}
                  onClick={() => setMobileBankingActivations(Math.max(0, Number(mobileBankingActivations || 0) - 1))}
                  className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <input
                  type="number"
                  disabled={isBlockedDate}
                  value={mobileBankingActivations}
                  onChange={(e) => setMobileBankingActivations(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-12 text-center py-1 rounded-lg bg-black/30 border border-white/20 text-xs text-white font-bold focus:outline-none"
                />
                <button
                  type="button"
                  disabled={isBlockedDate}
                  onClick={() => setMobileBankingActivations(Number(mobileBankingActivations || 0) + 1)}
                  className="w-7 h-7 rounded-lg bg-[#C89A2B] hover:bg-[#D8B45C] flex items-center justify-center text-[#6B3F1D] font-bold"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Internet Banking */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-400/50 transition-all space-y-1.5 text-center">
              <label className="block text-[11px] font-bold text-gray-200 truncate">{t.internetBanking || 'Internet Banking'}</label>
              <div className="flex items-center justify-between space-x-1">
                <button
                  type="button"
                  disabled={isBlockedDate || Number(internetBankingActivations) <= 0}
                  onClick={() => setInternetBankingActivations(Math.max(0, Number(internetBankingActivations || 0) - 1))}
                  className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <input
                  type="number"
                  disabled={isBlockedDate}
                  value={internetBankingActivations}
                  onChange={(e) => setInternetBankingActivations(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-12 text-center py-1 rounded-lg bg-black/30 border border-white/20 text-xs text-white font-bold focus:outline-none"
                />
                <button
                  type="button"
                  disabled={isBlockedDate}
                  onClick={() => setInternetBankingActivations(Number(internetBankingActivations || 0) + 1)}
                  className="w-7 h-7 rounded-lg bg-[#C89A2B] hover:bg-[#D8B45C] flex items-center justify-center text-[#6B3F1D] font-bold"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Merchant POS */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-400/50 transition-all space-y-1.5 text-center">
              <label className="block text-[11px] font-bold text-gray-200 truncate">{t.merchantSolutions || 'Merchant POS'}</label>
              <div className="flex items-center justify-between space-x-1">
                <button
                  type="button"
                  disabled={isBlockedDate || Number(merchantSolutionsActivations) <= 0}
                  onClick={() => setMerchantSolutionsActivations(Math.max(0, Number(merchantSolutionsActivations || 0) - 1))}
                  className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <input
                  type="number"
                  disabled={isBlockedDate}
                  value={merchantSolutionsActivations}
                  onChange={(e) => setMerchantSolutionsActivations(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-12 text-center py-1 rounded-lg bg-black/30 border border-white/20 text-xs text-white font-bold focus:outline-none"
                />
                <button
                  type="button"
                  disabled={isBlockedDate}
                  onClick={() => setMerchantSolutionsActivations(Number(merchantSolutionsActivations || 0) + 1)}
                  className="w-7 h-7 rounded-lg bg-[#C89A2B] hover:bg-[#D8B45C] flex items-center justify-center text-[#6B3F1D] font-bold"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* ATM Cards */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-400/50 transition-all space-y-1.5 text-center">
              <label className="block text-[11px] font-bold text-gray-200 truncate">{t.atmCard || 'ATM Cards'}</label>
              <div className="flex items-center justify-between space-x-1">
                <button
                  type="button"
                  disabled={isBlockedDate || Number(atmCardsIssued) <= 0}
                  onClick={() => setAtmCardsIssued(Math.max(0, Number(atmCardsIssued || 0) - 1))}
                  className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <input
                  type="number"
                  disabled={isBlockedDate}
                  value={atmCardsIssued}
                  onChange={(e) => setAtmCardsIssued(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-12 text-center py-1 rounded-lg bg-black/30 border border-white/20 text-xs text-white font-bold focus:outline-none"
                />
                <button
                  type="button"
                  disabled={isBlockedDate}
                  onClick={() => setAtmCardsIssued(Number(atmCardsIssued || 0) + 1)}
                  className="w-7 h-7 rounded-lg bg-[#C89A2B] hover:bg-[#D8B45C] flex items-center justify-center text-[#6B3F1D] font-bold"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[#C89A2B]/30">
          <button
            type="button"
            disabled={isBlockedDate || submitting}
            onClick={() => handleSubmitReport(true)}
            className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-extrabold text-xs flex items-center space-x-2 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{t.saveDraft || 'Save Draft'}</span>
          </button>

          <button
            type="button"
            disabled={isBlockedDate || submitting}
            onClick={() => handleSubmitReport(false)}
            className="px-9 py-3 rounded-2xl bg-gradient-to-r from-[#C89A2B] via-[#D8B45C] to-[#A37B1E] text-[#6B3F1D] font-black text-xs shadow-[0_10px_30px_rgba(200,154,43,0.4)] hover:brightness-110 flex items-center space-x-2 transition-all transform hover:-translate-y-0.5"
          >
            <Send className="w-4 h-4 text-[#6B3F1D]" />
            <span>{submitting ? 'Submitting Report...' : (t.submitToManager || 'Submit To Branch Manager')}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
