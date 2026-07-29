import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
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
  Volume2
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { ThemeToggle } from '../components/ThemeToggle';
import { LanguageSelector } from '../components/LanguageSelector';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [stats, setStats] = useState({
    complaints: 0,
    healthScore: 0,
    wards: 0,
    latency: 0
  });

  const [fontSize, setFontSize] = useState('normal'); // 'small' | 'normal' | 'large'
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Animated counter effect
    const timer = setTimeout(() => {
      setStats({
        complaints: 1248,
        healthScore: 94,
        wards: 28,
        latency: 42
      });
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Smooth transition effect when language changes
  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 200);
    return () => clearTimeout(timer);
  }, [i18n.language]);

  // Online Municipal Services list configuration
  const services = [
    {
      icon: <DollarSign className="w-6 h-6 text-orange-600" />,
      title: t('services.pTax'),
      desc: t('services.pTaxDesc'),
      tag: "TAX-ONLINE"
    },
    {
      icon: <Droplet className="w-6 h-6 text-blue-600" />,
      title: t('services.wTax'),
      desc: t('services.wTaxDesc'),
      tag: "WATER-BILL"
    },
    {
      icon: <FileText className="w-6 h-6 text-emerald-600" />,
      title: t('services.birthCert'),
      desc: t('services.birthCertDesc'),
      tag: "CIVIL-REG"
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-purple-600" />,
      title: t('services.grievance'),
      desc: t('services.grievanceDesc'),
      tag: "GRIEVANCE",
      action: () => navigate('/citizen/login')
    },
    {
      icon: <Building2 className="w-6 h-6 text-indigo-600" />,
      title: t('services.tradeLicense'),
      desc: t('services.tradeLicenseDesc'),
      tag: "TRADE-LIC"
    },
    {
      icon: <Layers className="w-6 h-6 text-amber-600" />,
      title: t('services.buildingPlan'),
      desc: t('services.buildingPlanDesc'),
      tag: "TOWN-PLAN"
    }
  ];

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans selection:bg-[#F97316] selection:text-white transition-opacity duration-300 ${isTransitioning ? 'opacity-90' : 'opacity-100'} ${fontSize === 'large' ? 'text-lg' : fontSize === 'small' ? 'text-sm' : ''}`}>
      
      {/* 1. OFFICIAL GOVT TRICOLOR TOP BAR */}
      <div className="w-full bg-slate-900 text-slate-300 text-[11px] font-medium border-b border-slate-800 z-50 relative">
        {/* Tricolor Stripe */}
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
            {/* Screen Reader */}
            <a href="#accessibility" className="hidden md:inline hover:text-white transition-colors">{t('header.accessibility')}</a>
            
            {/* Font Resize controls */}
            <div className="flex items-center gap-1 border-l border-slate-700 pl-2 sm:pl-3">
              <button 
                onClick={() => setFontSize('small')} 
                className={`w-5 h-5 flex items-center justify-center rounded border transition-colors ${fontSize === 'small' ? 'bg-[#F97316] border-orange-500 text-white' : 'border-slate-700 hover:border-slate-500'}`}
                title="Decrease Font Size"
              >
                A-
              </button>
              <button 
                onClick={() => setFontSize('normal')} 
                className={`w-5 h-5 flex items-center justify-center rounded border transition-colors ${fontSize === 'normal' ? 'bg-[#F97316] border-orange-500 text-white' : 'border-slate-700 hover:border-slate-500'}`}
                title="Normal Font Size"
              >
                A
              </button>
              <button 
                onClick={() => setFontSize('large')} 
                className={`w-5 h-5 flex items-center justify-center rounded border transition-colors ${fontSize === 'large' ? 'bg-[#F97316] border-orange-500 text-white' : 'border-slate-700 hover:border-slate-500'}`}
                title="Increase Font Size"
              >
                A+
              </button>
            </div>

            {/* Multilingual 23-Language Selector Dropdown */}
            <div className="flex items-center gap-2 border-l border-slate-700 pl-2 sm:pl-3">
              <LanguageSelector variant="topbar" />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* 2. OFFICIAL MUNICIPAL HEADER */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm relative z-40 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 p-0.5 flex items-center justify-center shadow-md">
              <div className="w-full h-full bg-white dark:bg-slate-800 rounded-[14px] flex items-center justify-center">
                {/* State Emblem/Seal Stylized Silhouette */}
                <svg viewBox="0 0 100 100" className="w-12 h-12 text-orange-600">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="3" />
                  <path d="M 30 70 Q 50 20, 70 70 Z" fill="none" stroke="currentColor" strokeWidth="4" />
                  <circle cx="50" cy="45" r="10" fill="currentColor" />
                  <line x1="50" y1="55" x2="50" y2="80" stroke="currentColor" strokeWidth="4" />
                  <line x1="38" y1="75" x2="62" y2="75" stroke="currentColor" strokeWidth="3" />
                </svg>
              </div>
            </div>
            <div>
              <h1 className="font-black text-xl lg:text-2xl text-gov-navy dark:text-slate-100 tracking-tight leading-tight">
                {t('header.title')}
              </h1>
              <p className="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {t('header.subtitle')}
              </p>
              <div className="inline-block px-2.5 py-0.5 bg-orange-50 dark:bg-orange-950/20 text-[10px] text-orange-700 dark:text-orange-400 font-bold border border-orange-200 dark:border-orange-900/30 rounded-full mt-1">
                🌐 {t('header.tagline')}
              </div>
            </div>
          </div>

          {/* Central Government Partners & Digital India badges */}
          <div className="hidden lg:flex items-center gap-6">
            <div className="flex flex-col items-end border-r border-slate-200 dark:border-slate-700 pr-5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('header.digitalIndia')}</span>
              <span className="text-sm font-black text-blue-700 dark:text-blue-400">{t('header.digitalIndiaHindi')}</span>
            </div>
            <div className="flex flex-col items-end border-r border-slate-200 dark:border-slate-700 pr-5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('header.swachhBharat')}</span>
              <span className="text-sm font-black text-emerald-700 dark:text-emerald-400">{t('header.swachhBharatHindi')}</span>
            </div>
            <div className="text-right">
              <span className="block text-[10px] text-slate-400 font-bold">{t('header.helpline')}</span>
              <span className="block text-base font-extrabold text-gov-navy dark:text-slate-100">1800-233-1042</span>
            </div>
          </div>
        </div>
      </header>

      {/* 3. SCROLLING NOTICE MARQUEE */}
      <div className="bg-[#F97316]/10 dark:bg-[#F97316]/5 border-b border-orange-200 dark:border-orange-950/40 text-gov-navy dark:text-slate-200 py-2 px-4 relative overflow-hidden z-30">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="bg-orange-600 text-white text-[10px] font-bold px-2 py-1 rounded shrink-0 flex items-center gap-1 shadow-sm uppercase">
            <Volume2 className="w-3.5 h-3.5" />
            {t('hero.announcements')}
          </div>
          <div className="animate-marquee-container overflow-hidden relative w-full h-5 flex items-center">
            <div className="animate-marquee whitespace-nowrap text-xs font-semibold select-none flex gap-8">
              <span>{t('hero.marqueeText')}</span>
              <span>{t('hero.marqueeText')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. MAIN HERO BANNER & PORTAL SELECTIONS */}
      <main className="relative py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Welcome Section Banner */}
        <div className="bg-gradient-to-r from-[#002B49] via-slate-900 to-gov-navy rounded-3xl p-8 lg:p-12 text-white shadow-xl mb-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(249,115,22,0.12),transparent_60%)] pointer-events-none"></div>
          
          <div className="max-w-3xl relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F97316]/20 dark:bg-[#F97316]/10 border border-orange-500/40 text-orange-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> {t('hero.badge')}
            </div>
            
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {t('hero.titlePart1')}
              <span className="text-orange-400">{t('hero.titleHighlight')}</span>
              {t('hero.titlePart2')}
            </h2>
            
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {t('hero.description')}
            </p>
          </div>

          {/* TWO PRINCIPAL PORTALS ACCESSIBLE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 text-slate-800 dark:text-slate-200">
            
            {/* PORTAL A: CITIZEN GATEWAY */}
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-950/20 text-orange-600 flex items-center justify-center mb-5 border border-orange-100 dark:border-orange-900/30">
                  <UserCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-extrabold text-gov-navy dark:text-slate-100 flex items-center gap-2 mb-2">
                  👤 {t('portals.citizenTitle')}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed mb-6">
                  {t('portals.citizenDesc')}
                </p>
              </div>

              <button
                onClick={() => navigate('/citizen/login')}
                className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-md shadow-orange-600/20 transition-all flex items-center justify-center gap-2 text-sm"
              >
                {t('portals.citizenBtn')}
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>

            {/* PORTAL B: MUNICIPAL OFFICERS COMMAND CENTER */}
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 flex items-center justify-center mb-5 border border-slate-200 dark:border-slate-700">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-extrabold text-gov-navy dark:text-slate-100 flex items-center gap-2 mb-2">
                  🏛 {t('portals.municipalityTitle')}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed mb-6">
                  {t('portals.municipalityDesc')}
                </p>
              </div>

              <button
                onClick={() => navigate('/municipality/loading')}
                className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm border border-slate-800"
              >
                <ShieldCheck className="w-4 h-4 text-orange-400" />
                {t('portals.municipalityBtn')}
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>

          </div>
        </div>

        {/* 5. ONLINE SERVICES GRID */}
        <section className="py-8 mb-12">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h3 className="text-2xl font-extrabold text-gov-navy dark:text-slate-100">{t('services.title')}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">{t('services.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((srv, idx) => (
              <div 
                key={idx}
                onClick={srv.action}
                className={`p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group ${srv.action ? 'cursor-pointer border-orange-200 hover:border-orange-400' : ''}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl group-hover:bg-orange-50 dark:bg-orange-950/20 transition-colors">
                    {srv.icon}
                  </div>
                  <span className="text-[9px] font-mono font-bold text-slate-400 bg-slate-100 dark:bg-slate-900/50 px-2 py-0.5 rounded uppercase">
                    {srv.tag}
                  </span>
                </div>
                <h4 className="font-extrabold text-sm text-gov-navy dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
                  {srv.title}
                  {srv.action && <ChevronRight className="w-4 h-4 text-orange-500" />}
                </h4>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">{srv.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 6. SPATIAL DIGITAL TWIN COMMAND BOARD */}
        <section className="bg-slate-100 dark:bg-slate-900/50/80 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 relative overflow-hidden mb-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-orange-700 dark:text-orange-400 bg-orange-100 dark:bg-orange-950/40 px-3 py-1 rounded-full border border-orange-200 dark:border-orange-900/30">
                <Radio className="w-3.5 h-3.5 animate-pulse text-orange-600" />
                {t('digitalTwin.gisStream')}
              </span>
              <h3 className="text-2xl lg:text-3xl font-extrabold text-gov-navy dark:text-slate-100 leading-tight">
                {t('digitalTwin.title')}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                {t('digitalTwin.subtitle')}
              </p>

              {/* Counter Statistics */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-center">
                  <span className="block text-2xl font-black text-orange-600 font-mono">
                    {stats.complaints.toLocaleString()}+
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                    {t('digitalTwin.resolvedCount')}
                  </span>
                </div>
                
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-center">
                  <span className="block text-2xl font-black text-emerald-600 font-mono">
                    {stats.healthScore}/100
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                    {t('digitalTwin.healthIndex')}
                  </span>
                </div>

                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-center">
                  <span className="block text-2xl font-black text-blue-600 font-mono">
                    {stats.wards}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                    {t('digitalTwin.connectedWards')}
                  </span>
                </div>

                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-center">
                  <span className="block text-2xl font-black text-amber-600 font-mono">
                    {stats.latency} ms
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                    {t('digitalTwin.telemetryLatency')}
                  </span>
                </div>
              </div>
            </div>

            {/* Smart City Vector Map Overview Representation */}
            <div className="w-full lg:w-96 h-64 bg-slate-900 rounded-2xl border-2 border-slate-800 p-4 relative overflow-hidden flex flex-col justify-between text-white">
              <div className="absolute inset-0 bg-grid-cyber opacity-20"></div>
              
              <div className="flex items-center justify-between z-10 text-[10px] font-mono text-orange-400">
                <span>{t('digitalTwin.liveFeed')}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              </div>
              
              <div className="relative z-10 flex items-center justify-center my-auto">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border border-dashed border-orange-500/50 animate-spin-slow flex items-center justify-center"></div>
                  <Building2 className="w-8 h-8 text-orange-500 absolute inset-0 m-auto" />
                </div>
              </div>
              
              <div className="flex items-center justify-between z-10 text-[9px] text-slate-400 font-mono">
                <span>Lat: 19.89° N</span>
                <span>Long: 74.47° E</span>
              </div>
            </div>
          </div>
        </section>

        {/* 7. LEADERSHIP DESK SECTION */}
        <section className="py-8 border-t border-slate-200 dark:border-slate-700">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h3 className="text-2xl font-extrabold text-gov-navy dark:text-slate-100">{t('leadership.title')}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">{t('leadership.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* PM Card */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm text-center flex flex-col justify-between">
              <div>
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-900/50 border-2 border-orange-500 flex items-center justify-center text-orange-600 font-extrabold text-2xl shadow-inner">
                  NM
                </div>
                <h4 className="font-extrabold text-base text-slate-800 dark:text-slate-200">{t('leadership.pmName')}</h4>
                <p className="text-xs text-slate-400 font-semibold">{t('leadership.pmRole')}</p>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 italic mt-4 border-t border-slate-100 dark:border-slate-800 pt-3">
                {t('leadership.pmQuote')}
              </p>
            </div>

            {/* CM Card */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm text-center flex flex-col justify-between">
              <div>
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-900/50 border-2 border-orange-500 flex items-center justify-center text-orange-600 font-extrabold text-2xl shadow-inner">
                  ES
                </div>
                <h4 className="font-extrabold text-base text-slate-800 dark:text-slate-200">{t('leadership.cmName')}</h4>
                <p className="text-xs text-slate-400 font-semibold">{t('leadership.cmRole')}</p>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 italic mt-4 border-t border-slate-100 dark:border-slate-800 pt-3">
                {t('leadership.cmQuote')}
              </p>
            </div>

            {/* Chief Officer Card */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm text-center flex flex-col justify-between border-l-4 border-l-orange-500">
              <div>
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-900/50 border-2 border-orange-500 flex items-center justify-center text-orange-600 font-extrabold text-2xl shadow-inner">
                  CO
                </div>
                <h4 className="font-extrabold text-base text-slate-800 dark:text-slate-200">{t('leadership.coName')}</h4>
                <p className="text-xs text-slate-400 font-semibold">{t('leadership.coRole')}</p>
              </div>
              <p className="text-[11px] text-gov-navy dark:text-slate-200 font-semibold italic mt-4 border-t border-slate-100 dark:border-slate-800 pt-3 leading-relaxed">
                {t('leadership.coMessage')}
              </p>
            </div>

          </div>
        </section>

      </main>

      {/* 8. FOOTER */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-12 border-t-4 border-gov-saffron">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <span className="font-extrabold text-slate-200 block text-sm tracking-wide">
                {t('header.title')}
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                {t('footer.disclaimer')}
              </p>
            </div>

            <div>
              <span className="font-bold text-slate-300 block mb-3 uppercase tracking-wider text-[11px]">{t('footer.govtPortals')}</span>
              <ul className="space-y-1.5 text-[11px]">
                <li><a href="https://india.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">{t('footer.nationalPortal')}</a></li>
                <li><a href="https://maharashtra.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">{t('footer.govtMahaLink')}</a></li>
                <li><a href="https://mygov.in" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">{t('footer.myGovLink')}</a></li>
              </ul>
            </div>

            <div>
              <span className="font-bold text-slate-300 block mb-3 uppercase tracking-wider text-[11px]">{t('footer.quickLinks')}</span>
              <ul className="space-y-1.5 text-[11px]">
                <li><span className="hover:text-orange-400 cursor-pointer">{t('footer.privacy')}</span></li>
                <li><span className="hover:text-orange-400 cursor-pointer">{t('footer.terms')}</span></li>
                <li><span className="hover:text-orange-400 cursor-pointer">{t('footer.contact')}</span></li>
              </ul>
            </div>

            <div>
              <span className="font-bold text-slate-300 block mb-3 uppercase tracking-wider text-[11px]">{t('footer.contactAddress')}</span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                {t('footer.officeAddress')}
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-slate-500 dark:text-slate-400">
            <div>
              {t('footer.copyright')}
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-slate-800 text-[9px] font-mono text-orange-400">{t('footer.badge')}</span>
              <span>v4.2</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};
