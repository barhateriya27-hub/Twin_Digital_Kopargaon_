import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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

export const LandingPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    complaints: 0,
    healthScore: 0,
    wards: 0,
    latency: 0
  });

  const [language, setLanguage] = useState('en'); // 'en' | 'mr'
  const [fontSize, setFontSize] = useState('normal'); // 'small' | 'normal' | 'large'

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

  // Bilingual text dictionary
  const t = {
    en: {
      govtOfIndia: "Government of India",
      govtOfMaha: "Government of Maharashtra",
      accessibility: "Screen Reader Access",
      title: "KOPARGAON MUNICIPAL COUNCIL",
      subtitle: "कोपरगाव नगरपरिषद • DISTRICT AHMEDNAGAR",
      tagline: "Digital Smart City Governance Portal",
      announcements: "LATEST ANNOUNCEMENTS",
      marqueeText: "⚠️ Godavari River Basin monitoring level is NORMAL (22,000 cusecs discharge). | 📄 Pay Property Tax online before July 31st to claim 5% prompt payment discount. | 💡 Citizen Grievance Portal is fully active. All 28 wards connected.",
      portalTitle: "Select Portal to Proceed",
      citizenTitle: "Citizen Services / नागरी सेवा",
      citizenDesc: "Submit grievances (Potholes, Sanitation, Water rupture, streetlights), track resolution live, and obtain municipal status alerts.",
      citizenBtn: "Proceed to Citizen Portal",
      municipalityTitle: "Command Room / नियंत्रण कक्ष",
      municipalityDesc: "Authorized municipal personnel login to access GIS digital twin maps, AI complaint triage, and run spatial simulations.",
      municipalityBtn: "Access Security Command Center",
      servicesTitle: "Online Municipal Services",
      servicesSubtitle: "Direct citizen utilities & applications",
      pTax: "Property Tax",
      pTaxDesc: "Pay property tax bills & view outstanding demands.",
      wTax: "Water Charges",
      wTaxDesc: "Online water connection billing & billing calculator.",
      birthCert: "Birth & Death Registry",
      birthCertDesc: "Download forms or apply for civil registry records.",
      grievance: "Grievance Redressal (MahaGrievance)",
      grievanceDesc: "Report garbage, leaks, potholes & traffic issues.",
      tradeLicense: "Trade Licenses",
      tradeLicenseDesc: "Apply for new shop acts or renew business licenses.",
      buildingPlan: "Building Permit & NOC",
      buildingPlanDesc: "Submit building layouts for town planning approval.",
      digitalTwinTitle: "Kopargaon Spatial Digital Twin command room",
      digitalTwinSubtitle: "A real-time visual replica of city physical assets & telemetry",
      gisStream: "GIS SPATIAL NODES ACTIVE",
      resolvedCount: "Complaints Resolved",
      healthIndex: "City Health Index",
      connectedWards: "Wards Digitized",
      telemetryLatency: "IoT Sensor Latency",
      leadershipTitle: "Administrative & Public Leadership",
      leadershipSubtitle: "Guiding Kopargaon towards a digitized & clean tomorrow",
      pmName: "Shri Narendra Modi",
      pmRole: "Hon'ble Prime Minister of India",
      cmName: "Shri Eknath Shinde",
      cmRole: "Hon'ble Chief Minister of Maharashtra",
      coName: "Dr. Sameer Kulkarni (IAS)",
      coRole: "Chief Officer & Administrator, KMC",
      coMessage: "\"Our AI Digital Twin represents a major step forward in transparent, fast, and data-backed municipal governance, directly connecting residents to the municipal council.\"",
      footerDis: "Website designed, developed and hosted by Kopargaon Municipal Corporation. All content is monitored under Maharashtra Municipal Acts.",
      privacy: "Privacy Policy",
      terms: "Terms & Conditions",
      contact: "Helpline Contact"
    },
    mr: {
      govtOfIndia: "भारत सरकार",
      govtOfMaha: "महाराष्ट्र शासन",
      accessibility: "स्क्रीन रीडर प्रवेश",
      title: "कोपरगाव नगरपरिषद",
      subtitle: "KOPARGAON MUNICIPAL COUNCIL • जिल्हा अहमदनगर",
      tagline: "डिजिटल स्मार्ट सिटी गव्हर्नन्स पोर्टल",
      announcements: "नवीन घोषणा आणि सूचना",
      marqueeText: "⚠️ गोदावरी नदी पात्रातील पाणी पातळी सुरक्षित आहे. | 📄 मालमत्ता कर ३१ जुलै पूर्वी भरून ५% सवलत मिळवा. | 💡 नागरी तक्रार निवारण पोर्टल पूर्णपणे कार्यरत आहे. सर्व २८ वॉर्ड जोडले गेले आहेत.",
      portalTitle: "पुढील पोर्टल निवडा",
      citizenTitle: "नागरी सुविधा पोर्टल",
      citizenDesc: "कचरा समस्या, रस्त्यांवरील खड्डे, पाणी गळती आणि पथदिव्यांच्या तक्रारी नोंदवा व त्यांचे निवारण ट्रॅक करा.",
      citizenBtn: "नागरी पोर्टल प्रवेश",
      municipalityTitle: "नियंत्रण कक्ष (अधिकारी)",
      municipalityDesc: "अधिकृत नगरपरिषद अधिकारी लॉगीन - GIS नकाशा, AI वर्गीकरण आणि शहर सिम्युलेशन नियंत्रण.",
      municipalityBtn: "अधिकारी नियंत्रण कक्ष",
      servicesTitle: "ऑनलाइन नागरी सेवा",
      servicesSubtitle: "थेट नागरी सुविधा आणि अर्ज",
      pTax: "मालमत्ता कर",
      pTaxDesc: "मालमत्ता कर बिल भरा आणि मागील थकबाकी पहा.",
      wTax: "पाणी पट्टी",
      wTaxDesc: "नवीन नळ जोडणी व पाणी बिल ऑनलाइन भरणा.",
      birthCert: "जन्म आणि मृत्यू नोंदणी",
      birthCertDesc: "जन्म, मृत्यू किंवा विवाह दाखल्यासाठी अर्ज करा.",
      grievance: "तक्रार निवारण (महा-तक्रार)",
      grievanceDesc: "स्वच्छता, रस्ते, पाणी गळती आणि रहदारी संबंधित तक्रारी.",
      tradeLicense: "व्यवसाय परवाना (गुमास्ता)",
      tradeLicenseDesc: "नवीन व्यवसाय परवान्यासाठी किंवा नूतनीकरणासाठी अर्ज करा.",
      buildingPlan: "इमारत बांधकाम परवानगी",
      buildingPlanDesc: "नगररचना विभागाकडून इमारत आराखडा मंजुरी मिळवा.",
      digitalTwinTitle: "कोपरगाव डिजिटल ट्विन नियंत्रण कक्ष",
      digitalTwinSubtitle: "शहरातील भौतिक मालमत्ता आणि सेन्सर्सची रिअल-टाइम डिजिटल प्रतिकृती",
      gisStream: "थेट GIS सेन्सर प्रवाह सुरू",
      resolvedCount: "निवारण केलेल्या तक्रारी",
      healthIndex: "शहर आरोग्य निर्देशांक",
      connectedWards: "डिजिटलाइज्ड प्रभाग",
      telemetryLatency: "IoT सेन्सर गती",
      leadershipTitle: "प्रशासकीय आणि सार्वजनिक नेतृत्व",
      leadershipSubtitle: "कोपरगावला अधिक स्वच्छ आणि डिजिटल बनवण्यासाठी कटिबद्ध",
      pmName: "श्री नरेंद्र मोदी",
      pmRole: "माननीय पंतप्रधान, भारत सरकार",
      cmName: "श्री एकनाथ शिंदे",
      cmRole: "माननीय मुख्यमंत्री, महाराष्ट्र राज्य",
      coName: "डॉ. समीर कुलकर्णी (IAS)",
      coRole: "मुख्य अधिकारी आणि प्रशासक, कोपरगाव नगरपरिषद",
      coMessage: "\"डिजिटल ट्विन तंत्रज्ञान कोपरगावच्या नागरिकांना जलद आणि पारदर्शक सेवा पुरवण्यासाठी महत्त्वाचे पाऊल आहे. आम्ही नागरिकांच्या सोयीसाठी सदैव तत्पर आहोत.\"",
      footerDis: "हे कोपरगाव नगरपरिषदेचे अधिकृत संकेतस्थळ आहे. सर्व मजकूर व माहिती महाराष्ट्र नगरपरिषद अधिनियमांनुसार नियंत्रित आहे.",
      privacy: "गोपनीयता धोरण",
      terms: "नियम आणि अटी",
      contact: "हेल्पलाईन संपर्क"
    }
  };

  const currentT = t[language];

  // Services list mapping
  const services = [
    {
      icon: <DollarSign className="w-6 h-6 text-orange-600" />,
      title: currentT.pTax,
      desc: currentT.pTaxDesc,
      tag: "TAX-ONLINE"
    },
    {
      icon: <Droplet className="w-6 h-6 text-blue-600" />,
      title: currentT.wTax,
      desc: currentT.wTaxDesc,
      tag: "WATER-BILL"
    },
    {
      icon: <FileText className="w-6 h-6 text-emerald-600" />,
      title: currentT.birthCert,
      desc: currentT.birthCertDesc,
      tag: "CIVIL-REG"
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-purple-600" />,
      title: currentT.grievance,
      desc: currentT.grievanceDesc,
      tag: "GRIEVANCE",
      action: () => navigate('/citizen/login')
    },
    {
      icon: <Building2 className="w-6 h-6 text-indigo-600" />,
      title: currentT.tradeLicense,
      desc: currentT.tradeLicenseDesc,
      tag: "TRADE-LIC"
    },
    {
      icon: <Layers className="w-6 h-6 text-amber-600" />,
      title: currentT.buildingPlan,
      desc: currentT.buildingPlanDesc,
      tag: "TOWN-PLAN"
    }
  ];

  // Font sizing helper classes
  const fontClass = () => {
    if (fontSize === 'small') return 'text-xs';
    if (fontSize === 'large') return 'text-lg';
    return 'text-sm';
  };

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans selection:bg-[#F97316] selection:text-white ${fontSize === 'large' ? 'text-lg' : fontSize === 'small' ? 'text-sm' : ''}`}>
      
      {/* 1. OFFICIAL GOVT TRICOLOR TOP BAR */}
      <div className="w-full bg-slate-900 text-slate-300 text-[11px] font-medium border-b border-slate-800 z-50 relative">
        {/* Tricolor Stripe */}
        <div className="h-[4px] w-full flex">
          <div className="h-full w-1/3 bg-[#FF9933]"></div>
          <div className="h-full w-1/3 bg-white dark:bg-slate-800"></div>
          <div className="h-full w-1/3 bg-[#138808]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline border-r border-slate-700 pr-3">{currentT.govtOfIndia}</span>
            <span>{currentT.govtOfMaha}</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Screen Reader */}
            <a href="#accessibility" className="hover:text-white transition-colors">{currentT.accessibility}</a>
            
            {/* Font Resize controls */}
            <div className="flex items-center gap-1 border-l border-slate-700 pl-3">
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

            {/* Bilingual Switcher */}
            <div className="flex items-center gap-3">
              <div className="flex items-center rounded overflow-hidden border border-slate-700">
                <button 
                  onClick={() => setLanguage('en')} 
                  className={`px-2 py-0.5 font-bold transition-all ${language === 'en' ? 'bg-[#F97316] text-slate-900 dark:text-slate-100' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
                >
                  EN
                </button>
                <button 
                  onClick={() => setLanguage('mr')} 
                  className={`px-2 py-0.5 font-bold transition-all ${language === 'mr' ? 'bg-[#F97316] text-slate-900 dark:text-slate-100' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
                >
                  मराठी
                </button>
              </div>
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
                {currentT.title}
              </h1>
              <p className="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {currentT.subtitle}
              </p>
              <div className="inline-block px-2.5 py-0.5 bg-orange-50 dark:bg-orange-950/20 text-[10px] text-orange-700 font-bold border border-orange-200 rounded-full mt-1">
                🌐 {currentT.tagline}
              </div>
            </div>
          </div>

          {/* Central Government Partners & Digital India badges */}
          <div className="hidden lg:flex items-center gap-6">
            <div className="flex flex-col items-end border-r border-slate-200 dark:border-slate-700 pr-5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Digital India</span>
              <span className="text-sm font-black text-blue-700">डिजिटल इंडिया</span>
            </div>
            <div className="flex flex-col items-end border-r border-slate-200 dark:border-slate-700 pr-5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Swachh Bharat</span>
              <span className="text-sm font-black text-emerald-700">स्वच्छ भारत अभियान</span>
            </div>
            <div className="text-right">
              <span className="block text-[10px] text-slate-400 font-bold">HELPLINE TOLL-FREE</span>
              <span className="block text-base font-extrabold text-gov-navy dark:text-slate-100">1800-233-1042</span>
            </div>
          </div>
        </div>
      </header>

      {/* 3. SCROLLING NOTICE MARQUEE */}
      <div className="bg-[#F97316]/10 dark:bg-[#F97316]/5 border-b border-orange-200 text-gov-navy dark:text-slate-200 py-2 px-4 relative overflow-hidden z-30">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="bg-orange-600 text-white text-[10px] font-bold px-2 py-1 rounded shrink-0 flex items-center gap-1 shadow-sm uppercase">
            <Volume2 className="w-3.5 h-3.5" />
            {currentT.announcements}
          </div>
          <div className="animate-marquee-container overflow-hidden relative w-full h-5 flex items-center">
            <div className="animate-marquee whitespace-nowrap text-xs font-semibold select-none flex gap-8">
              <span>{currentT.marqueeText}</span>
              <span>{currentT.marqueeText}</span>
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
              <Sparkles className="w-3.5 h-3.5" /> Smart Governance e-Infrastructure
            </div>
            
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {language === 'en' ? (
                <>Smart Administration for <span className="text-orange-400">Kopargaon</span> Municipal Council</>
              ) : (
                <>कोपरगाव नगरपरिषदेचा <span className="text-orange-400">डिजिटल कारभार</span> - जलद आणि सुलभ</>
              )}
            </h2>
            
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {language === 'en' 
                ? "This is the unified administrative framework of Kopargaon Municipal Council. Residents can register grievances, review spatial water and waste sensor telemetry, and check direct utility connections in real time."
                : "कोपरगाव नगरपरिषदेच्या अधिकृत प्रणालीमध्ये आपले स्वागत आहे. नागरिक येथे त्यांच्या तक्रारी नोंदवू शकतात, कचरा व पाणी पुरवठ्याची रिअल-टाइम स्थिती पाहू शकतात आणि सर्व प्रकारच्या दाखल्यांसाठी अर्ज करू शकतात."
              }
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
                  👤 {currentT.citizenTitle}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed mb-6">
                  {currentT.citizenDesc}
                </p>
              </div>

              <button
                onClick={() => navigate('/citizen/login')}
                className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-md shadow-orange-600/20 transition-all flex items-center justify-center gap-2 text-sm"
              >
                {currentT.citizenBtn}
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
                  🏛 {currentT.municipalityTitle}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed mb-6">
                  {currentT.municipalityDesc}
                </p>
              </div>

              <button
                onClick={() => navigate('/municipality/loading')}
                className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm border border-slate-800"
              >
                <ShieldCheck className="w-4 h-4 text-orange-400" />
                {currentT.municipalityBtn}
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>

          </div>
        </div>

        {/* 5. ONLINE SERVICES GRID */}
        <section className="py-8 mb-12">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h3 className="text-2xl font-extrabold text-gov-navy dark:text-slate-100">{currentT.servicesTitle}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">{currentT.servicesSubtitle}</p>
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

        {/* 6. SPATIAL DIGITAL TWIN COMMAND BOARD (LIGHT ACCENT STYLE) */}
        <section className="bg-slate-100 dark:bg-slate-900/50/80 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 relative overflow-hidden mb-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-orange-700 bg-orange-100 px-3 py-1 rounded-full border border-orange-200">
                <Radio className="w-3.5 h-3.5 animate-pulse text-orange-600" />
                {currentT.gisStream}
              </span>
              <h3 className="text-2xl lg:text-3xl font-extrabold text-gov-navy dark:text-slate-100 leading-tight">
                {currentT.digitalTwinTitle}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                {currentT.digitalTwinSubtitle}
              </p>

              {/* Counter Statistics */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-center">
                  <span className="block text-2xl font-black text-orange-600 font-mono">
                    {stats.complaints.toLocaleString()}+
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                    {currentT.resolvedCount}
                  </span>
                </div>
                
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-center">
                  <span className="block text-2xl font-black text-emerald-600 font-mono">
                    {stats.healthScore}/100
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                    {currentT.healthIndex}
                  </span>
                </div>

                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-center">
                  <span className="block text-2xl font-black text-blue-600 font-mono">
                    {stats.wards}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                    {currentT.connectedWards}
                  </span>
                </div>

                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-center">
                  <span className="block text-2xl font-black text-amber-600 font-mono">
                    {stats.latency} ms
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                    {currentT.telemetryLatency}
                  </span>
                </div>
              </div>
            </div>

            {/* Smart City Vector Map Overview Representation */}
            <div className="w-full lg:w-96 h-64 bg-slate-900 rounded-2xl border-2 border-slate-800 p-4 relative overflow-hidden flex flex-col justify-between text-white">
              <div className="absolute inset-0 bg-grid-cyber opacity-20"></div>
              
              <div className="flex items-center justify-between z-10 text-[10px] font-mono text-orange-400">
                <span>SYSTEM LIVE FEED // KPG-MUNICIPAL</span>
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
            <h3 className="text-2xl font-extrabold text-gov-navy dark:text-slate-100">{currentT.leadershipTitle}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">{currentT.leadershipSubtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* PM Card */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm text-center flex flex-col justify-between">
              <div>
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-900/50 border-2 border-orange-500 flex items-center justify-center text-orange-600 font-extrabold text-2xl shadow-inner">
                  NM
                </div>
                <h4 className="font-extrabold text-base text-slate-800 dark:text-slate-200">{currentT.pmName}</h4>
                <p className="text-xs text-slate-400 font-semibold">{currentT.pmRole}</p>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 italic mt-4 border-t border-slate-100 dark:border-slate-800 pt-3">
                "Promoting Digital India across municipal administrations to build high-trust governance."
              </p>
            </div>

            {/* CM Card */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm text-center flex flex-col justify-between">
              <div>
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-900/50 border-2 border-orange-500 flex items-center justify-center text-orange-600 font-extrabold text-2xl shadow-inner">
                  ES
                </div>
                <h4 className="font-extrabold text-base text-slate-800 dark:text-slate-200">{currentT.cmName}</h4>
                <p className="text-xs text-slate-400 font-semibold">{currentT.cmRole}</p>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 italic mt-4 border-t border-slate-100 dark:border-slate-800 pt-3">
                "Bringing cutting edge digital infrastructure directly to the municipal levels in Maharashtra."
              </p>
            </div>

            {/* Chief Officer Card */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm text-center flex flex-col justify-between border-l-4 border-l-orange-500">
              <div>
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-900/50 border-2 border-orange-500 flex items-center justify-center text-orange-600 font-extrabold text-2xl shadow-inner">
                  CO
                </div>
                <h4 className="font-extrabold text-base text-slate-800 dark:text-slate-200">{currentT.coName}</h4>
                <p className="text-xs text-slate-400 font-semibold">{currentT.coRole}</p>
              </div>
              <p className="text-[11px] text-gov-navy dark:text-slate-200 font-semibold italic mt-4 border-t border-slate-100 dark:border-slate-800 pt-3 leading-relaxed">
                {currentT.coMessage}
              </p>
            </div>

          </div>
        </section>

      </main>

      {/* 8. FOOTER REDESIGN */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-12 border-t-4 border-gov-saffron">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <span className="font-extrabold text-slate-200 block text-sm tracking-wide">
                {currentT.title}
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                {currentT.footerDis}
              </p>
            </div>

            <div>
              <span className="font-bold text-slate-300 block mb-3 uppercase tracking-wider text-[11px]">Govt Portals</span>
              <ul className="space-y-1.5 text-[11px]">
                <li><a href="https://india.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">National Portal of India</a></li>
                <li><a href="https://maharashtra.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">Government of Maharashtra</a></li>
                <li><a href="https://mygov.in" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">MyGov Digital Hub</a></li>
              </ul>
            </div>

            <div>
              <span className="font-bold text-slate-300 block mb-3 uppercase tracking-wider text-[11px]">Quick Links</span>
              <ul className="space-y-1.5 text-[11px]">
                <li><span className="hover:text-orange-400 cursor-pointer">{currentT.privacy}</span></li>
                <li><span className="hover:text-orange-400 cursor-pointer">{currentT.terms}</span></li>
                <li><span className="hover:text-orange-400 cursor-pointer">{currentT.contact}</span></li>
              </ul>
            </div>

            <div>
              <span className="font-bold text-slate-300 block mb-3 uppercase tracking-wider text-[11px]">Contact Address</span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Kopargaon Municipal Council Office,<br />
                Station Road, Kopargaon,<br />
                District Ahmednagar, Maharashtra - 423601<br />
                📩 support@kopargaon.gov.in
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-slate-500 dark:text-slate-400">
            <div>
              © 2026 Kopargaon Municipal Council. All Rights Reserved.
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-slate-800 text-[9px] font-mono text-orange-400">NIC STYLED SECURE PORTAL</span>
              <span>v4.2</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};
