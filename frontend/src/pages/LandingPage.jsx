import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Building2, 
  UserCheck, 
  Activity, 
  Cpu, 
  Layers, 
  Radio, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Database, 
  Zap, 
  Globe, 
  TrendingUp, 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  ChevronRight,
  Server,
  BarChart3,
  Bot,
  FileText,
  DollarSign,
  Droplet,
  HeartHandshake,
  ShieldAlert,
  Volume2,
  Sliders,
  BrainCircuit,
  Compass,
  Navigation,
  Clock,
  ArrowUpRight,
  Play,
  Check,
  Eye
} from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';
import { LanguageSelector } from '../components/LanguageSelector';
import { useApp } from '../context/AppContext';
import { useCityIntelligence, formatRelativeTime } from '../hooks/useCityIntelligence';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  const { complaints = [], notifications = [], announcements = [] } = useApp();
  const cityIntel = useCityIntelligence({ complaints, notifications, announcements });

  const [fontSize, setFontSize] = useState('normal');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activePreviewTab, setActivePreviewTab] = useState('health'); // 'health' | 'incidents' | 'traffic' | 'ai'

  // Counter stats derived from real data
  const { metrics, cityHealth, alerts } = cityIntel;

  // Animation variants respecting prefers-reduced-motion
  const fadeIn = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 }
    }
  };

  // Online Municipal Services list
  const services = [
    { icon: <DollarSign className="w-6 h-6 text-orange-600" />, title: t('services.pTax'), desc: t('services.pTaxDesc'), tag: "TAX-ONLINE" },
    { icon: <Droplet className="w-6 h-6 text-blue-600" />, title: t('services.wTax'), desc: t('services.wTaxDesc'), tag: "WATER-BILL" },
    { icon: <FileText className="w-6 h-6 text-emerald-600" />, title: t('services.birthCert'), desc: t('services.birthCertDesc'), tag: "CIVIL-REG" },
    { icon: <HeartHandshake className="w-6 h-6 text-purple-600" />, title: t('services.grievance'), desc: t('services.grievanceDesc'), tag: "GRIEVANCE", action: () => navigate('/citizen/login') },
    { icon: <Building2 className="w-6 h-6 text-indigo-600" />, title: t('services.tradeLicense'), desc: t('services.tradeLicenseDesc'), tag: "TRADE-LIC" },
    { icon: <Layers className="w-6 h-6 text-amber-600" />, title: t('services.buildingPlan'), desc: t('services.buildingPlanDesc'), tag: "TOWN-PLAN" }
  ];

  // Capabilities list
  const capabilities = [
    { icon: BrainCircuit, title: 'Spatial Digital Twin', desc: 'Real-time 3D vector GIS layer tracking all 28 municipal wards, Godavari riverbed, water pipelines & electrical grids.', color: 'from-blue-500 to-indigo-600' },
    { icon: Activity, title: 'Real-Time Telemetry', desc: 'Live monitoring of open grievances, SLA compliance status, and citizen service dispatches.', color: 'from-emerald-500 to-teal-600' },
    { icon: Bot, title: 'Governance AI Assistant', desc: 'Context-aware intelligence answering queries on weather, hospitals, traffic, property tax, and permits.', color: 'from-amber-500 to-orange-600' },
    { icon: TrendingUp, title: 'Predictive Forecasting', desc: 'AI estimations for traffic congestion, garbage route bottlenecking, and water supply pressure anomalies.', color: 'from-purple-500 to-pink-600' },
    { icon: Sliders, title: 'What-If Simulator', desc: 'Simulate executive actions (e.g. Add a Garbage Truck, Deploy Traffic Wardens) with before/after impact modeling.', color: 'from-[#0B2545] to-slate-800' },
    { icon: ShieldAlert, title: 'Smart SLA Alerts', desc: 'Automated 72-hour SLA daemon auto-escalates overdue tickets directly to Higher Authority Commissioner dashboard.', color: 'from-red-500 to-rose-600' }
  ];

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-sans selection:bg-[#FF9933] selection:text-white transition-opacity duration-300 ${isTransitioning ? 'opacity-90' : 'opacity-100'} ${fontSize === 'large' ? 'text-lg' : fontSize === 'small' ? 'text-sm' : ''}`}>
      
      {/* 1. TRICOLOR GOVT TOPBAR */}
      <div className="w-full bg-slate-950 text-slate-300 text-[11px] font-medium border-b border-slate-800/80 z-50 relative">
        <div className="h-[4px] w-full flex">
          <div className="h-full w-1/3 bg-[#FF9933]"></div>
          <div className="h-full w-1/3 bg-white dark:bg-slate-800"></div>
          <div className="h-full w-1/3 bg-[#138808]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline border-r border-slate-700 pr-3">{t('header.govtOfIndia')}</span>
            <span>{t('header.govtOfMaha')}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 border-l border-slate-700 pl-2 sm:pl-3">
              <button onClick={() => setFontSize('small')} className={`w-5 h-5 flex items-center justify-center rounded border text-[10px] ${fontSize === 'small' ? 'bg-[#FF9933] border-amber-500 text-white font-bold' : 'border-slate-700 hover:border-slate-500'}`}>A-</button>
              <button onClick={() => setFontSize('normal')} className={`w-5 h-5 flex items-center justify-center rounded border text-[10px] ${fontSize === 'normal' ? 'bg-[#FF9933] border-amber-500 text-white font-bold' : 'border-slate-700 hover:border-slate-500'}`}>A</button>
              <button onClick={() => setFontSize('large')} className={`w-5 h-5 flex items-center justify-center rounded border text-[10px] ${fontSize === 'large' ? 'bg-[#FF9933] border-amber-500 text-white font-bold' : 'border-slate-700 hover:border-slate-500'}`}>A+</button>
            </div>

            <div className="flex items-center gap-2 border-l border-slate-700 pl-2 sm:pl-3">
              <LanguageSelector variant="topbar" />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION HEADER */}
      <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 py-3.5 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#FF9933] via-amber-500 to-emerald-600 p-0.5 flex items-center justify-center shadow-md shrink-0">
              <div className="w-full h-full bg-[#0B2545] rounded-[13px] flex items-center justify-center">
                <BrainCircuit className="w-6 h-6 text-[#FF9933]" />
              </div>
            </div>
            <div>
              <h1 className="font-black text-lg sm:text-xl text-[#0B2545] dark:text-white tracking-tight leading-tight flex items-center gap-2">
                Digital Kopargaon
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-extrabold uppercase bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                  AI DIGITAL TWIN
                </span>
              </h1>
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Kopargaon Municipal Council • Govt. of Maharashtra
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/citizen/login')}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-extrabold rounded-xl text-xs transition-all border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              Citizen Portal
            </button>

            <button
              onClick={() => navigate('/municipality/login')}
              className="px-4 py-2 bg-[#0B2545] hover:bg-[#07172B] text-white font-extrabold rounded-xl text-xs shadow-md transition-all border border-[#0B2545] flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-[#FF9933]" />
              <span>Officer Portal</span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. SCROLLING ANNOUNCEMENT MARQUEE */}
      <div className="bg-[#FF9933]/10 dark:bg-[#FF9933]/5 border-b border-amber-200 dark:border-amber-900/30 text-[#0B2545] dark:text-slate-200 py-2 px-4 relative overflow-hidden z-30">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="bg-[#FF9933] text-[#0B2545] text-[10px] font-black px-2.5 py-1 rounded shrink-0 flex items-center gap-1 shadow-xs uppercase">
            <Volume2 className="w-3.5 h-3.5" />
            GAZETTE NOTICE
          </div>
          <div className="overflow-hidden relative w-full h-5 flex items-center">
            <div className="animate-marquee whitespace-nowrap text-xs font-semibold select-none flex gap-8">
              <span>{t('hero.marqueeText')}</span>
              <span>• Water pipeline inspection active in Ward 4 • Property tax rebate valid till 31 Aug 2026 •</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. HERO SECTION WITH AUTHENTIC KOPARGAON VISUAL BACKGROUND */}
      <section className="relative my-6 py-16 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto rounded-3xl bg-[#0B2545] text-white shadow-2xl overflow-hidden border border-sky-900/60">
        {/* Background Image Container with Overlay Gradients */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none z-0">
          <img
            src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=80"
            alt="Kopargaon Godavari River Surroundings"
            className="w-full h-full object-cover object-center filter brightness-[0.3] dark:brightness-[0.2] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B2545] via-[#0B2545]/90 to-slate-950/95" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,153,51,0.25),transparent_60%)]" />
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 max-w-4xl space-y-6 text-white p-2 sm:p-6"
        >
          <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF9933]/20 border border-[#FF9933]/40 text-[#FF9933] text-xs font-bold font-mono">
            <Sparkles className="w-4 h-4" /> PM GATI SHAKTI SMART CITY PLATFORM
          </motion.div>

          <motion.h1 variants={fadeIn} className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-white">
            Digital Kopargaon <br />
            <span className="bg-gradient-to-r from-[#FF9933] via-amber-300 to-emerald-400 bg-clip-text text-transparent">
              AI-Powered Digital Twin
            </span> <br />
            for Smarter City Decisions
          </motion.h1>

          <motion.p variants={fadeIn} className="text-slate-200 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl font-medium">
            Empowering Kopargaon Municipal Council with real-time 3D spatial telemetry, predictive AI decision support, 72-hour SLA tracking, and citizen grievance resolution across all 28 wards.
          </motion.p>

          <motion.div variants={fadeIn} className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={() => navigate('/municipality/loading')}
              className="px-6 py-3.5 bg-gradient-to-r from-[#FF9933] to-amber-500 hover:from-amber-400 hover:to-orange-500 text-[#0B2545] font-black rounded-2xl text-xs sm:text-sm uppercase tracking-wider shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <BrainCircuit className="w-5 h-5 text-[#0B2545]" />
              <span>Explore Digital Twin</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('/citizen/login')}
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-extrabold rounded-2xl text-xs sm:text-sm uppercase tracking-wider transition-all border border-white/20 flex items-center gap-2 backdrop-blur-md cursor-pointer"
            >
              <UserCheck className="w-5 h-5 text-emerald-400" />
              <span>Citizen Portal</span>
            </button>
          </motion.div>

          {/* Quick Stats Banner inside Hero */}
          <motion.div variants={fadeIn} className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-white/15">
            <div className="space-y-0.5">
              <span className="block text-2xl font-black font-mono text-[#FF9933]">{cityHealth.overall}/100</span>
              <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">City Health Score</span>
            </div>
            <div className="space-y-0.5">
              <span className="block text-2xl font-black font-mono text-emerald-400">{metrics.total}</span>
              <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">Registered Tickets</span>
            </div>
            <div className="space-y-0.5">
              <span className="block text-2xl font-black font-mono text-sky-400">28</span>
              <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">Connected Wards</span>
            </div>
            <div className="space-y-0.5">
              <span className="block text-2xl font-black font-mono text-amber-400">72 Hrs</span>
              <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">Guaranteed SLA</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* 5. WHY DIGITAL KOPARGAON */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 rounded-full text-xs font-mono font-bold uppercase border border-blue-300 dark:border-blue-800">
            NEXT-GEN MUNICIPAL GOVERNANCE
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#0B2545] dark:text-white">
            Why Digital Kopargaon?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Transitioning from reactive administration to predictive, data-driven smart municipal operations on the banks of Godavari.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-[#0B2545] dark:text-white">Single Source of Truth</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Connects Citizen Grievances, Town Planning Permits, Tax Records, and Field Inspections to one unified central data layer.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-[#0B2545] dark:text-white">Predictive AI Decision Support</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Forecast traffic bottlenecks, garbage collection strain, and water pressure anomalies with recommended executive actions.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-[#0B2545] dark:text-white">72-Hour SLA Auto-Escalation</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Automated daemon monitors complaint due dates. Overdue tickets automatically escalate to the Higher Authority Commissioner Portal.
            </p>
          </div>
        </div>
      </section>

      {/* 6. LIVE DIGITAL TWIN PREVIEW SECTION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase">REAL-TIME DIGITAL TWIN FEED</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-1">Live City Operations & Intelligence Preview</h3>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar">
              {[
                { id: 'health', label: 'City Health' },
                { id: 'incidents', label: 'Grievance Stream' },
                { id: 'traffic', label: 'Traffic & Services' },
                { id: 'ai', label: 'AI Alerts' },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActivePreviewTab(t.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    activePreviewTab === t.id
                      ? 'bg-[#FF9933] text-[#0B2545]'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Preview Tab Content */}
          <div className="min-h-[220px]">
            {activePreviewTab === 'health' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 text-center space-y-2">
                  <span className="text-4xl font-black text-[#FF9933] font-mono">{cityHealth.overall}/100</span>
                  <span className="text-xs font-bold text-emerald-400 block uppercase font-mono">{cityHealth.grade}</span>
                  <p className="text-xs text-slate-400">Calculated from {metrics.total} registered complaints & SLA metrics.</p>
                </div>

                <div className="md:col-span-2 space-y-3">
                  {Object.entries(cityHealth.dimensions || {}).map(([key, dim]) => (
                    <div key={key} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="capitalize text-slate-300">{key}</span>
                        <span className="font-mono text-emerald-400 font-bold">{dim.score}/100</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-[#FF9933] to-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: `${dim.score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activePreviewTab === 'incidents' && (
              <div className="space-y-3">
                {complaints.slice(0, 3).map(c => (
                  <div key={c.id} className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#FF9933]">{c.id}</span>
                        <span className="font-bold text-white">{c.title}</span>
                      </div>
                      <span className="text-slate-400 block text-[11px]">{c.category} • Ward {c.ward}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase shrink-0 ${
                      c.status === 'Resolved' || c.status === 'Completed'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}>
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {activePreviewTab === 'traffic' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[#FF9933] font-bold block text-xs">🚦 Station Road & Bus Stand Junction</span>
                  <span className="text-slate-300 block text-xs">Peak density monitoring active</span>
                  <span className="text-[10px] text-emerald-400 font-mono">Flow: Normal (18 km/h avg)</span>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[#FF9933] font-bold block text-xs">💧 Godavari Headworks Water Grid</span>
                  <span className="text-slate-300 block text-xs">Main pumping intake operating at 98.4%</span>
                  <span className="text-[10px] text-emerald-400 font-mono">Distribution Window: 06:00-09:30</span>
                </div>
              </div>
            )}

            {activePreviewTab === 'ai' && (
              <div className="space-y-3">
                {alerts.length === 0 ? (
                  <div className="p-4 text-center text-slate-400 text-xs font-medium">No critical alerts. All SLAs compliant.</div>
                ) : (
                  alerts.slice(0, 2).map(a => (
                    <div key={a.id} className="p-3.5 bg-slate-950 rounded-xl border border-l-4 border-red-500 border-slate-800 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{a.title}</span>
                        <span className="text-[9px] bg-red-950 text-red-300 font-black px-1.5 py-0.5 rounded border border-red-800 uppercase">{a.severity}</span>
                      </div>
                      <p className="text-slate-400 text-[11px]">{a.description}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 7. KEY CAPABILITIES */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded-full text-xs font-mono font-bold uppercase border border-emerald-300 dark:border-emerald-800">
            PLATFORM CAPABILITIES
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#0B2545] dark:text-white">
            Smart Decision Support Features
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((cap, idx) => {
            const Icon = cap.icon;
            return (
              <div key={idx} className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all space-y-3 group">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cap.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-base text-[#0B2545] dark:text-white">{cap.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{cap.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. KOPARGAON VISUAL GALLERY SECTION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <span className="px-3 py-1 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 rounded-full text-xs font-mono font-bold uppercase border border-amber-300 dark:border-amber-800">
            KOPARGAON MUNICIPALITY & SURROUNDINGS
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#0B2545] dark:text-white">
            Living Digital Twin of Kopargaon
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative rounded-2xl overflow-hidden shadow-lg group h-64 border border-slate-200 dark:border-slate-800">
            <img src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80" alt="Godavari River Bridge" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent p-4 flex flex-col justify-end text-white">
              <span className="text-[10px] font-mono text-[#FF9933] font-bold uppercase">GODAVARI WATERWAY</span>
              <h4 className="font-extrabold text-sm">Godavari River & Water Intake Grid</h4>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-lg group h-64 border border-slate-200 dark:border-slate-800">
            <img src="https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80" alt="Kopargaon Streets" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent p-4 flex flex-col justify-end text-white">
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">URBAN INFRASTRUCTURE</span>
              <h4 className="font-extrabold text-sm">Station Road & Commercial Hub</h4>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-lg group h-64 border border-slate-200 dark:border-slate-800">
            <img src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80" alt="Road Transit" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent p-4 flex flex-col justify-end text-white">
              <span className="text-[10px] font-mono text-sky-400 font-bold uppercase">CONNECTIVITY CORRIDOR</span>
              <h4 className="font-extrabold text-sm">NH-222 Highway Transit Arteries</h4>
            </div>
          </div>
        </div>
      </section>

      {/* 9. CALL TO ACTION BANNER */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-[#0B2545] via-[#103459] to-[#0B2545] text-white rounded-3xl p-8 sm:p-12 border border-sky-900/50 shadow-2xl text-center space-y-6 relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Ready to Experience Digital Kopargaon?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Explore the live AI Digital Twin platform or access citizen governance services online.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 relative z-10">
            <button
              onClick={() => navigate('/municipality/loading')}
              className="px-6 py-3.5 bg-[#FF9933] hover:bg-amber-400 text-[#0B2545] font-black rounded-2xl text-xs uppercase tracking-wider shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <BrainCircuit className="w-5 h-5 text-[#0B2545]" />
              <span>Launch Municipal Control Center</span>
            </button>

            <button
              onClick={() => navigate('/citizen/login')}
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-extrabold rounded-2xl text-xs uppercase tracking-wider transition-all border border-white/20 flex items-center gap-2 backdrop-blur-md cursor-pointer"
            >
              <UserCheck className="w-5 h-5 text-emerald-400" />
              <span>Citizen Portal Sign In</span>
            </button>
          </div>
        </div>
      </section>

      {/* 10. OFFICIAL FOOTER */}
      <footer className="bg-slate-950 text-slate-400 text-xs py-12 border-t-4 border-[#FF9933]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <span className="font-extrabold text-slate-200 block text-sm tracking-wide">
                Digital Kopargaon AI Platform
              </span>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Official Digital Twin & Smart Decision Support Platform of Kopargaon Municipal Council, Ahilyanagar District, Maharashtra.
              </p>
            </div>

            <div>
              <span className="font-bold text-slate-300 block mb-3 uppercase tracking-wider text-[11px]">Govt Portals</span>
              <ul className="space-y-1.5 text-[11px]">
                <li><a href="https://india.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF9933] transition-colors">National Portal of India</a></li>
                <li><a href="https://maharashtra.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF9933] transition-colors">Govt of Maharashtra</a></li>
                <li><a href="https://mygov.in" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF9933] transition-colors">MyGov Digital India</a></li>
              </ul>
            </div>

            <div>
              <span className="font-bold text-slate-300 block mb-3 uppercase tracking-wider text-[11px]">Governance</span>
              <ul className="space-y-1.5 text-[11px]">
                <li><span className="hover:text-[#FF9933] cursor-pointer">Privacy Policy</span></li>
                <li><span className="hover:text-[#FF9933] cursor-pointer">Terms of Service</span></li>
                <li><span className="hover:text-[#FF9933] cursor-pointer">Citizen Charter (SLA)</span></li>
              </ul>
            </div>

            <div>
              <span className="font-bold text-slate-300 block mb-3 uppercase tracking-wider text-[11px]">Headquarters Address</span>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Kopargaon Municipal Council, Municipal Administrative Building, Near Sub-Substation, Kopargaon - 423601, Maharashtra.
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-slate-500">
            <div>
              © 2026 Kopargaon Municipal Council. All rights reserved. Built for Smart City Hackathon.
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-slate-900 text-[9px] font-mono text-[#FF9933]">PM GATI SHAKTI APPROVED</span>
              <span>v4.2 AI Twin</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
