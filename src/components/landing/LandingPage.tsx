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
  Send
} from 'lucide-react';
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

            {/* Hero Floating Enterprise Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Main Glassmorphism Card */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-[#D4AF37]/40 shadow-2xl relative z-10">
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] via-[#B38F24] to-[#0B4228] p-0.5 shadow-md flex items-center justify-center">
                        <div className="w-full h-full bg-[#0B4228] rounded-[10px] p-1 flex items-center justify-center">
                          <BunnaBankLogo className="w-6 h-6" variant="gold" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-white">Bunna Bank S.C. EPMS</h3>
                        <p className="text-[10px] text-[#D4AF37]">Addis Ababa HQ Live Performance</p>
                      </div>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  </div>

                  {/* Sample Floating Metric Items */}
                  <div className="py-4 space-y-3">
                    <div className="p-3 rounded-xl bg-[#0B4228]/80 border border-[#D4AF37]/30 flex justify-between items-center">
                      <div className="flex items-center space-x-2.5">
                        <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
                        <span className="text-xs font-semibold">Today Deposits Mobilized</span>
                      </div>
                      <span className="text-sm font-bold text-[#D4AF37]">ETB 142.5M</span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#0B4228]/80 border border-[#D4AF37]/30 flex justify-between items-center">
                      <div className="flex items-center space-x-2.5">
                        <Users className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-semibold">Bunna Mobile Activations</span>
                      </div>
                      <span className="text-sm font-bold text-emerald-400">+1,480 Today</span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#0B4228]/80 border border-[#D4AF37]/30 flex justify-between items-center">
                      <div className="flex items-center space-x-2.5">
                        <ShieldCheck className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-semibold">Manager Approvals Completed</span>
                      </div>
                      <span className="text-sm font-bold text-amber-400">99.4% On Time</span>
                    </div>
                  </div>

                  <div className="pt-2 text-center">
                    <span className="text-[11px] text-[#D4AF37] font-medium">
                      ✨ Powered by Gemini AI Insights & RAG Architecture
                    </span>
                  </div>
                </div>

                {/* Decorative floating badge */}
                <div className="absolute -bottom-6 -left-6 p-4 rounded-2xl bg-[#D4AF37] text-[#0B4228] shadow-2xl z-20 flex items-center space-x-3 hidden sm:flex">
                  <Award className="w-8 h-8" />
                  <div>
                    <p className="font-extrabold text-xs">Excellence Award 2026</p>
                    <p className="text-[10px] font-semibold opacity-90">Best Digital Banking EPMS</p>
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
