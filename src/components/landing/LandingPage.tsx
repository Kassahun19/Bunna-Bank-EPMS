import React, { useState, useEffect } from 'react';
import {
  Building2,
  TrendingUp,
  ShieldCheck,
  Zap,
  Users,
  Award,
  ChevronRight,
  Sparkles,
  BarChart3,
  Globe2,
  CheckCircle2,
  HelpCircle,
  Mail,
  Send,
  Coins,
  DollarSign,
  Smartphone,
  Globe,
  QrCode,
  CreditCard,
  UserPlus,
  Target,
  Trophy,
  Percent,
  Filter,
  ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language } from '../../types';
import { translations } from '../../i18n/translations';
import { BunnaBankLogo } from '../common/BunnaBankLogo';

interface LandingPageProps {
  language: Language;
  onGetStarted: () => void;
  onOpenLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  language,
  onGetStarted,
  onOpenLogin
}) => {
  const t = translations[language];

  // CountUp Counters Animation
  const [districtsCount, setDistrictsCount] = useState(0);
  const [branchesCount, setBranchesCount] = useState(0);
  const [employeesCount, setEmployeesCount] = useState(0);
  const [efficiencyCount, setEfficiencyCount] = useState(0);

  // Category Filter for Hanging Card Performance KPIs
  const [kpiCategory, setKpiCategory] = useState<'ALL' | 'FINANCIAL' | 'DIGITAL'>('ALL');

  useEffect(() => {
    const duration = 2000;
    const steps = 50;
    const intervalTime = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setDistrictsCount(Math.floor(25 * progress));
      setBranchesCount(Math.floor(500 * progress));
      setEmployeesCount(Math.floor(10000 * progress));
      setEfficiencyCount(Number((99.8 * progress).toFixed(1)));

      if (step >= steps) {
        clearInterval(timer);
        setDistrictsCount(25);
        setBranchesCount(500);
        setEmployeesCount(10000);
        setEfficiencyCount(99.8);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  // FAQ State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "What is Bunna Bank EPMS?",
      a: "The Employee Performance Management System (EPMS) is an enterprise AI-powered platform designed for Bunna Bank S.C. to track daily financial mobilization, digital banking activations, and multi-tier approvals across 500+ branches."
    },
    {
      q: "When can employees submit their daily performance reports?",
      a: "Employees can submit daily performance reports on all official working days except Sundays and configured bank holidays (such as Enkutatash, Genna, Timkat, and Adwa)."
    },
    {
      q: "How does the AI Performance Assistant work?",
      a: "The embedded Gemini AI assistant answers questions regarding KPIs, district targets, manager approval queues, policy rules, and provides automated performance summaries with natural language querying."
    },
    {
      q: "How are manager report approvals structured?",
      a: "Branch managers can Approve, Reject, Return for Correction with comments, Suspend, or Delete daily reports. Employees receive instant notification alerts and audit logs update automatically."
    }
  ];

  // Overall Bunna Bank S.C. Fiscal Year Performance Across All KPIs
  const bankKpisPerformance = [
    {
      id: 'KPI-001',
      name: 'Deposits Mobilized',
      code: 'DEP_ETB',
      category: 'FINANCIAL',
      unit: 'ETB',
      target: '15.00 Billion ETB',
      achieved: '16.26 Billion ETB',
      percentage: 108.4,
      status: 'Exceeded',
      icon: Coins,
      gradient: 'from-[#D4AF37] to-amber-500',
      textColor: 'text-[#D4AF37]',
      bgBadge: 'bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/40'
    },
    {
      id: 'KPI-002',
      name: 'Foreign Currency Inflow',
      code: 'FCY_ETB',
      category: 'FINANCIAL',
      unit: 'USD',
      target: '$250.0 Million USD',
      achieved: '$256.5 Million USD',
      percentage: 102.6,
      status: 'Achieved',
      icon: DollarSign,
      gradient: 'from-emerald-400 to-teal-500',
      textColor: 'text-emerald-400',
      bgBadge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
    },
    {
      id: 'KPI-003',
      name: 'Digital Financial Services',
      code: 'DFS_ETB',
      category: 'FINANCIAL',
      unit: 'ETB',
      target: '5.00 Billion ETB',
      achieved: '5.76 Billion ETB',
      percentage: 115.2,
      status: 'Exceeded',
      icon: TrendingUp,
      gradient: 'from-blue-400 to-cyan-500',
      textColor: 'text-blue-400',
      bgBadge: 'bg-blue-500/20 text-blue-300 border-blue-500/40'
    },
    {
      id: 'KPI-004',
      name: 'Account Openings',
      code: 'ACC_OPEN',
      category: 'DIGITAL',
      unit: 'Accounts',
      target: '250,000 Accounts',
      achieved: '261,250 Accounts',
      percentage: 104.5,
      status: 'Achieved',
      icon: UserPlus,
      gradient: 'from-purple-400 to-pink-500',
      textColor: 'text-purple-400',
      bgBadge: 'bg-purple-500/20 text-purple-300 border-purple-500/40'
    },
    {
      id: 'KPI-005',
      name: 'Bunna Mobile Activations',
      code: 'MB_ACT',
      category: 'DIGITAL',
      unit: 'Users',
      target: '350,000 Users',
      achieved: '436,800 Users',
      percentage: 124.8,
      status: 'Exceeded',
      icon: Smartphone,
      gradient: 'from-indigo-400 to-purple-500',
      textColor: 'text-indigo-400',
      bgBadge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
    },
    {
      id: 'KPI-006',
      name: 'Internet Banking',
      code: 'IB_ACT',
      category: 'DIGITAL',
      unit: 'Users',
      target: '80,000 Users',
      achieved: '77,440 Users',
      percentage: 96.8,
      status: 'Near Target',
      icon: Globe,
      gradient: 'from-cyan-400 to-blue-500',
      textColor: 'text-cyan-400',
      bgBadge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
    },
    {
      id: 'KPI-007',
      name: 'Merchant QR Solutions',
      code: 'MERCH_SOL',
      category: 'DIGITAL',
      unit: 'Merchants',
      target: '40,000 Merchants',
      achieved: '44,120 Merchants',
      percentage: 110.3,
      status: 'Exceeded',
      icon: QrCode,
      gradient: 'from-orange-400 to-amber-500',
      textColor: 'text-orange-400',
      bgBadge: 'bg-orange-500/20 text-orange-300 border-orange-500/40'
    },
    {
      id: 'KPI-008',
      name: 'ATM Card Activations',
      code: 'ATM_CARD',
      category: 'DIGITAL',
      unit: 'Cards',
      target: '200,000 Cards',
      achieved: '210,200 Cards',
      percentage: 105.1,
      status: 'Achieved',
      icon: CreditCard,
      gradient: 'from-teal-400 to-emerald-500',
      textColor: 'text-teal-400',
      bgBadge: 'bg-teal-500/20 text-teal-300 border-teal-500/40'
    }
  ];

  const filteredKpis = bankKpisPerformance.filter(
    k => kpiCategory === 'ALL' || k.category === kpiCategory
  );

  return (
    <div className="min-h-screen bg-[#051F13] text-white">
      
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-[#0B4228] via-[#08321E] to-[#051F13]">
        {/* Glow & Grid Accents */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4AF37]/10 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold tracking-wide">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span>Bunna Bank S.C. Official EPMS Portal</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-none">
                {t.heroTitle}
              </h1>

              <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                {t.heroSubtitle}
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={onGetStarted}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#0B4228] font-extrabold text-sm shadow-2xl hover:opacity-95 transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
                >
                  <span>{t.getStarted}</span>
                  <ChevronRight className="w-5 h-5" />
                </button>

                <button
                  onClick={onOpenLogin}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-[#D4AF37]/40 text-white font-bold text-sm transition-all"
                >
                  <span>{t.login}</span>
                </button>
              </div>

              {/* Live CountUp Animated Stats Bar */}
              <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-white/10">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <p className="text-2xl sm:text-3xl font-extrabold text-[#D4AF37]">{districtsCount}+</p>
                  <p className="text-[11px] text-gray-300 font-medium mt-0.5">{t.statsDistricts}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <p className="text-2xl sm:text-3xl font-extrabold text-[#D4AF37]">{branchesCount}+</p>
                  <p className="text-[11px] text-gray-300 font-medium mt-0.5">{t.statsBranches}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <p className="text-2xl sm:text-3xl font-extrabold text-[#D4AF37]">{employeesCount.toLocaleString()}+</p>
                  <p className="text-[11px] text-gray-300 font-medium mt-0.5">{t.statsEmployees}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <p className="text-2xl sm:text-3xl font-extrabold text-[#D4AF37]">{efficiencyCount}%</p>
                  <p className="text-[11px] text-gray-300 font-medium mt-0.5">Approval Efficiency</p>
                </div>
              </div>

            </div>

            {/* Hero Hanging Enterprise Performance Plaque/Card */}
            <div className="lg:col-span-5 relative pt-10 sm:pt-12">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Hanging Cables / Golden Suspenders with Top Mounting Pins */}
                <div className="absolute -top-12 left-1/4 w-0.5 h-12 bg-gradient-to-b from-[#D4AF37]/10 via-[#D4AF37]/80 to-[#D4AF37] z-20">
                  <div className="w-3 h-3 rounded-full bg-[#D4AF37] border-2 border-[#0B4228] -translate-x-[5px] -translate-y-1.5 shadow-[0_0_10px_#D4AF37]" />
                </div>
                <div className="absolute -top-12 right-1/4 w-0.5 h-12 bg-gradient-to-b from-[#D4AF37]/10 via-[#D4AF37]/80 to-[#D4AF37] z-20">
                  <div className="w-3 h-3 rounded-full bg-[#D4AF37] border-2 border-[#0B4228] -translate-x-[5px] -translate-y-1.5 shadow-[0_0_10px_#D4AF37]" />
                </div>

                {/* Animated Hanging Main Glass Card */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative z-10 p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#0B4228]/95 via-[#08321E]/95 to-[#051F13]/95 backdrop-blur-2xl border-2 border-[#D4AF37]/70 shadow-[0_20px_50px_rgba(212,175,55,0.25)] hover:shadow-[0_25px_60px_rgba(212,175,55,0.4)] transition-all duration-500 overflow-hidden"
                >
                  {/* Subtle Light-Sweep Ambient Glow */}
                  <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#D4AF37]/20 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

                  {/* Header Section */}
                  <div className="pb-4 border-b border-[#D4AF37]/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#D4AF37] via-[#B38F24] to-[#0B4228] p-0.5 shadow-lg flex items-center justify-center">
                          <div className="w-full h-full bg-[#0B4228] rounded-[14px] p-1.5 flex items-center justify-center">
                            <BunnaBankLogo className="w-7 h-7" variant="gold" />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-extrabold text-sm text-white tracking-wide">Bunna Bank S.C.</h3>
                            <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] text-[10px] font-bold">
                              FY 2025/26
                            </span>
                          </div>
                          <p className="text-[11px] text-[#D4AF37] font-semibold mt-0.5">Overall Bank KPI Performance</p>
                        </div>
                      </div>

                      {/* Overall Attainment Badge */}
                      <div className="flex flex-col items-end">
                        <div className="flex items-center space-x-1 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-[#D4AF37]/20 border border-emerald-400/50 text-emerald-300 shadow-md">
                          <Trophy className="w-4 h-4 text-[#D4AF37] animate-bounce" />
                          <span className="text-sm font-extrabold tracking-tight text-white">107.8%</span>
                        </div>
                        <span className="text-[9px] font-bold text-emerald-400 tracking-wider uppercase mt-1">Exceeding Target</span>
                      </div>
                    </div>

                    {/* KPI Category Navigation Tabs */}
                    <div className="pt-1 flex items-center justify-between gap-1 bg-black/30 p-1 rounded-xl border border-white/10">
                      <button
                        onClick={() => setKpiCategory('ALL')}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all ${
                          kpiCategory === 'ALL'
                            ? 'bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#0B4228] shadow-md'
                            : 'text-gray-300 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        All KPIs (8)
                      </button>
                      <button
                        onClick={() => setKpiCategory('FINANCIAL')}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all ${
                          kpiCategory === 'FINANCIAL'
                            ? 'bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#0B4228] shadow-md'
                            : 'text-gray-300 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        Financial
                      </button>
                      <button
                        onClick={() => setKpiCategory('DIGITAL')}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all ${
                          kpiCategory === 'DIGITAL'
                            ? 'bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#0B4228] shadow-md'
                            : 'text-gray-300 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        Digital Banking
                      </button>
                    </div>
                  </div>

                  {/* Scrollable KPI Progress List */}
                  <div className="py-3 max-h-[290px] overflow-y-auto space-y-2.5 pr-1 custom-scrollbar">
                    <AnimatePresence mode="popLayout">
                      {filteredKpis.map((kpi, idx) => {
                        const Icon = kpi.icon;
                        const fillWidth = Math.min(kpi.percentage, 100);
                        return (
                          <motion.div
                            key={kpi.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2, delay: idx * 0.04 }}
                            className="p-3 rounded-2xl bg-black/40 border border-[#D4AF37]/25 hover:border-[#D4AF37]/60 transition-all group"
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <div className="flex items-center space-x-2.5 min-w-0">
                                <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${kpi.gradient} p-0.5 flex-shrink-0 shadow-sm`}>
                                  <div className="w-full h-full bg-[#0B4228] rounded-[10px] flex items-center justify-center">
                                    <Icon className={`w-4 h-4 ${kpi.textColor}`} />
                                  </div>
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs font-bold text-white truncate group-hover:text-[#D4AF37] transition-colors">
                                    {kpi.name}
                                  </p>
                                  <p className="text-[10px] text-gray-400 font-medium truncate">
                                    Target: {kpi.target}
                                  </p>
                                </div>
                              </div>

                              {/* Percentage Pill */}
                              <div className="flex flex-col items-end flex-shrink-0">
                                <span className={`px-2 py-0.5 rounded-full border text-xs font-black tracking-tight ${kpi.bgBadge}`}>
                                  {kpi.percentage.toFixed(1)}%
                                </span>
                                <span className="text-[9px] text-emerald-400 font-semibold mt-0.5">
                                  {kpi.achieved}
                                </span>
                              </div>
                            </div>

                            {/* Animated Glowing Progress Bar */}
                            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden relative p-0.5">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${fillWidth}%` }}
                                transition={{ duration: 1.2, ease: 'easeOut' }}
                                className={`h-full rounded-full bg-gradient-to-r ${kpi.gradient} shadow-[0_0_12px_rgba(212,175,55,0.6)] relative`}
                              >
                                {kpi.percentage >= 100 && (
                                  <div className="absolute inset-0 bg-white/30 animate-pulse rounded-full" />
                                )}
                              </motion.div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px]">
                    <div className="flex items-center space-x-1.5 text-emerald-400 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Audit Verified • 500+ Branches</span>
                    </div>
                    <span className="text-[#D4AF37] font-bold flex items-center space-x-1">
                      <span>Live EPMS Core</span>
                      <Sparkles className="w-3 h-3 text-[#D4AF37] animate-spin" />
                    </span>
                  </div>
                </motion.div>

                {/* Decorative floating badge */}
                <div className="absolute -bottom-6 -left-6 p-3.5 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#0B4228] shadow-2xl z-20 flex items-center space-x-3 hidden sm:flex border border-white/30">
                  <Award className="w-7 h-7" />
                  <div>
                    <p className="font-black text-xs tracking-tight">Grade A+ Bank Achievement</p>
                    <p className="text-[10px] font-bold opacity-90">Fiscal Year 2025/26 Target: 107.8%</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ABOUT EPMS SECTION */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#08321E] border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#D4AF37] font-bold text-xs uppercase tracking-widest">About EPMS</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              Transforming Human Capital Across Bunna Bank S.C.
            </h2>
            <p className="text-gray-300 text-sm mt-3 leading-relaxed">
              EPMS bridges everyday branch operations with executive strategic goals. By digitizing deposit tracking, FCY inflow, and digital banking activations, Bunna Bank empowers every employee to excel.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#D4AF37] transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white mb-2">Real-Time Performance Tracking</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Employees record financial metrics and digital banking activations daily, feeding live dashboards for managers and district directors.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#D4AF37] transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white mb-2">AI-Powered Performance Insights</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Gemini LLM assistant provides personalized target gap analysis, manager comment drafting, and predictive trend forecasts.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#D4AF37] transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white mb-2">Multi-Tier Approval Governance</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Full governance cycle with draft, submission, manager approval, rejection, and correction workflows backed by audit logs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CORE FEATURES SECTION */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#051F13]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#D4AF37] font-bold text-xs uppercase tracking-widest">System Capabilities</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              Designed for Enterprise Banking Excellence
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Financial Mobilization", desc: "Track ETB savings deposits, Foreign Currency (FCY) remittance, and Digital Financial Services." },
              { title: "Digital Banking Activations", desc: "Monitor account openings, Bunna Mobile, Internet Banking, Merchant POS, and ATM cards." },
              { title: "District & Branch Leaderboards", desc: "Compare district rankings, top branch benchmarks, and monthly employee champions." },
              { title: "Multi-Format Exporting", desc: "Generate formatted performance reports in Excel, PDF, Word, CSV, and printable views." }
            ].map((f, i) => (
              <div key={i} className="p-5 rounded-2xl bg-[#0B4228] border border-[#D4AF37]/20 hover:border-[#D4AF37] transition-all">
                <CheckCircle2 className="w-6 h-6 text-[#D4AF37] mb-3" />
                <h4 className="font-bold text-base text-white mb-1.5">{f.title}</h4>
                <p className="text-xs text-gray-300 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#08321E]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#D4AF37] font-bold text-xs uppercase tracking-widest">Questions & Answers</span>
            <h2 className="text-3xl font-extrabold text-white mt-1">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((f, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left font-bold text-sm text-white flex justify-between items-center"
                >
                  <span>{f.q}</span>
                  <ChevronRight className={`w-5 h-5 text-[#D4AF37] transition-transform ${openFaq === idx ? 'rotate-90' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs text-gray-300 leading-relaxed border-t border-white/5 pt-3">
                    {f.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#051F13]">
        <div className="max-w-4xl mx-auto bg-[#0B4228] border border-[#D4AF37]/30 rounded-3xl p-8 sm:p-12 shadow-2xl text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#D4AF37] text-[#0B4228] font-bold flex items-center justify-center mx-auto mb-4">
            <Mail className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Contact Bunna Bank EPMS Desk</h2>
          <p className="text-xs text-gray-300 mt-2 max-w-xl mx-auto">
            Have questions regarding EPMS account provisioning, branch district mapping, or system capabilities? Get in touch with our team.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Your Full Name"
              className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37]"
            />
            <input
              type="email"
              placeholder="Your Bunna Bank Email"
              className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>
          <textarea
            rows={3}
            placeholder="How can we assist your branch or district?"
            className="w-full mt-4 max-w-xl px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37]"
          />
          <button
            onClick={() => alert("Thank you! Your inquiry has been sent to Bunna Bank EPMS Support Desk.")}
            className="mt-4 px-8 py-3 rounded-xl bg-[#D4AF37] text-[#0B4228] font-bold text-xs hover:bg-[#e0be4d] transition-all"
          >
            Send Inquiry
          </button>
        </div>
      </section>

    </div>
  );
};
