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
  Bot
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    complaints: 0,
    healthScore: 0,
    wards: 0,
    latency: 0
  });

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

  const features = [
    {
      icon: <Activity className="w-7 h-7 text-cyan-400" />,
      title: "Real-time Telemetry",
      description: "Continuous IoT sensor synchronization across all 28 wards monitoring water flow, grid loads, and road sensors."
    },
    {
      icon: <Bot className="w-7 h-7 text-purple-400" />,
      title: "AI Auto-Classification",
      description: "Machine learning triage engine automatically classifies citizen complaints, assigns severity ratings, and routes to departments."
    },
    {
      icon: <Layers className="w-7 h-7 text-emerald-400" />,
      title: "What-If Scenario Simulator",
      description: "Run spatial city simulations to predict traffic impact, garbage truck fleet efficiency, and emergency response times."
    },
    {
      icon: <Radio className="w-7 h-7 text-amber-400" />,
      title: "Instant Grievance Tracking",
      description: "End-to-end transparent resolution lifecycle tracking for citizens with automated notifications at every stage."
    },
    {
      icon: <MapPin className="w-7 h-7 text-rose-400" />,
      title: "GIS Vector Digital Twin",
      description: "High-precision 3D GIS spatial overlay of Kopargaon infrastructure, Godavari river basin, and municipal boundaries."
    },
    {
      icon: <Zap className="w-7 h-7 text-blue-400" />,
      title: "Predictive Maintenance",
      description: "Proactive infrastructure monitoring that predicts pipe leakages and road damage before public disruptions occur."
    }
  ];

  const techStack = [
    { name: "React 18", category: "Core UI", icon: "⚛️" },
    { name: "Tailwind CSS", category: "Styling System", icon: "🎨" },
    { name: "Framer Motion", category: "Animation", icon: "✨" },
    { name: "Lucide React", category: "Iconography", icon: "💎" },
    { name: "Recharts", category: "Data Analytics", icon: "📊" },
    { name: "AI Decision Engine", category: "Machine Learning", icon: "🧠" }
  ];

  const team = [
    { name: "Er. Rajesh Deshmukh", role: "Chief Smart City Architect", dept: "Public Works Department" },
    { name: "Dr. Ananya Kulkarni", role: "Lead AI Systems Engineer", dept: "Digital Twin Lab" },
    { name: "Vikram Patil", role: "GIS Data Operations Lead", dept: "Municipal Planning" }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-hidden relative">
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 bg-grid-cyber opacity-25 pointer-events-none"></div>
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* 1. STICKY NAVBAR */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Building2 className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-slate-100 block leading-tight">
                KOPARGAON <span className="text-cyan-400">DIGITAL TWIN</span>
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-500/80 block">
                Municipal Decision Support System
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-cyan-400 transition-colors">Features</a>
            <a href="#about" className="hover:text-cyan-400 transition-colors">About Twin</a>
            <a href="#tech" className="hover:text-cyan-400 transition-colors">Technology</a>
            <a href="#team" className="hover:text-cyan-400 transition-colors">Leadership</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/citizen/login')}
              className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg border border-slate-700 hover:border-cyan-500/50 bg-slate-900 text-slate-200 hover:text-cyan-400 transition-all"
            >
              Citizen Login
            </button>
            <button
              onClick={() => navigate('/municipality/loading')}
              className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 text-slate-950 hover:opacity-90 shadow-md shadow-cyan-500/20 transition-all flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              Officer Access
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-mono mb-6"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI-POWERED SMART CITY DECISION SUPPORT SYSTEM
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-4 text-slate-100"
          >
            AI Digital Twin of <span className="text-gradient-cyan">Kopargaon</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl font-mono text-cyan-400 tracking-widest uppercase mb-6"
          >
            Monitor • Predict • Simulate • Manage
          </motion.p>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-slate-300 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed mb-12"
          >
            A state-of-the-art municipal decision platform bridging citizens and Kopargaon Municipal Corporation. Real-time GIS monitoring, automated AI complaint classification, predictive maintenance, and what-if urban simulations in one unified engine.
          </motion.p>

          {/* TWO MAIN PORTAL SELECTION CARDS (CENTERED) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16 text-left">
            {/* CARD 1: CITIZEN PORTAL */}
            <motion.div
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="glass-panel p-8 rounded-3xl border border-sky-500/30 relative overflow-hidden group shadow-xl hover:shadow-sky-500/20"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl group-hover:bg-sky-500/25 transition-all"></div>
              
              <div className="w-14 h-14 rounded-2xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400 mb-6 group-hover:scale-110 transition-transform">
                <UserCheck className="w-7 h-7" />
              </div>

              <h3 className="text-2xl font-bold text-slate-100 mb-2 flex items-center gap-2">
                👤 Citizen Portal
              </h3>

              <p className="text-slate-300 text-sm leading-relaxed mb-8">
                Report city issues (Potholes, Garbage, Water Leakage, Traffic), track complaint resolution status live, and receive municipal city alerts in real-time.
              </p>

              <button
                onClick={() => navigate('/citizen/login')}
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-slate-950 font-bold flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 transition-all"
              >
                Enter Citizen Portal
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            {/* CARD 2: MUNICIPALITY PORTAL */}
            <motion.div
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="glass-panel p-8 rounded-3xl border border-purple-500/30 relative overflow-hidden group shadow-xl hover:shadow-purple-500/20"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/25 transition-all"></div>

              <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                <Building2 className="w-7 h-7" />
              </div>

              <h3 className="text-2xl font-bold text-slate-100 mb-2 flex items-center gap-2">
                🏛 Municipality Portal
              </h3>

              <p className="text-slate-300 text-sm leading-relaxed mb-8">
                Monitor city operations, manage citizen complaints, access AI predictive insights, interactive GIS map overlays, and run urban What-if simulations.
              </p>

              <button
                onClick={() => navigate('/municipality/loading')}
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-cyan-400 via-purple-500 to-indigo-600 hover:opacity-95 text-slate-950 font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 transition-all"
              >
                Enter Municipality Portal
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>

          {/* ANIMATED STATISTICS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border border-slate-800 rounded-2xl p-6 bg-slate-900/60 backdrop-blur-md">
            <div className="text-center p-3 border-r border-slate-800/80 last:border-r-0">
              <div className="text-3xl font-extrabold text-cyan-400 font-mono">
                {stats.complaints.toLocaleString()}+
              </div>
              <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Grievances Resolved</div>
            </div>
            <div className="text-center p-3 border-r border-slate-800/80 last:border-r-0">
              <div className="text-3xl font-extrabold text-emerald-400 font-mono">
                {stats.healthScore}/100
              </div>
              <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">City Health Index</div>
            </div>
            <div className="text-center p-3 border-r border-slate-800/80 last:border-r-0">
              <div className="text-3xl font-extrabold text-purple-400 font-mono">
                {stats.wards}
              </div>
              <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Wards Connected</div>
            </div>
            <div className="text-center p-3">
              <div className="text-3xl font-extrabold text-amber-400 font-mono">
                {stats.latency} ms
              </div>
              <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">IoT Telemetry Speed</div>
            </div>
          </div>
        </div>
      </section>

      {/* SMART CITY GRAPHIC / ILLUSTRATION */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-8 border border-cyan-500/20 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-500/30">
                <Radio className="w-3.5 h-3.5 animate-pulse" /> LIVE GIS STREAM
              </div>
              <h2 className="text-3xl font-bold text-slate-100">
                Kopargaon Spatial Digital Twin Network
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Integrating real-time spatial node telemetry from Sai Baba Temple corridor, Station Road, Godavari Riverbank, and Market Yard into a predictive AI neural network.
              </p>
              <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-300 pt-2">
                <span className="flex items-center gap-1.5 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 28 Wards Active
                </span>
                <span className="flex items-center gap-1.5 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 140+ Waste Sensors
                </span>
                <span className="flex items-center gap-1.5 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Godavari Flood Alert Grid
                </span>
              </div>
            </div>

            {/* Graphic representation */}
            <div className="w-full md:w-96 h-64 bg-slate-900/90 rounded-2xl border border-cyan-500/30 p-4 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute inset-0 bg-grid-cyber opacity-40"></div>
              <div className="flex items-center justify-between z-10 text-xs font-mono text-cyan-400">
                <span>GIS NODE // KPG-CENTRAL</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              </div>
              <div className="relative z-10 flex items-center justify-center my-auto">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full border-2 border-dashed border-cyan-500/50 animate-spin-slow flex items-center justify-center"></div>
                  <Building2 className="w-12 h-12 text-cyan-400 absolute inset-0 m-auto" />
                </div>
              </div>
              <div className="flex items-center justify-between z-10 text-[11px] text-slate-400 font-mono">
                <span>Lat: 19.8913° N</span>
                <span>Long: 74.4789° E</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-slate-100 mb-4">
            Next-Gen Smart City Capabilities
          </h2>
          <p className="text-slate-400 text-sm">
            Powered by modern cloud infrastructure, AI classification algorithms, and real-time citizen feedback loops.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-all"
            >
              <div className="mb-4 p-3 bg-slate-900/80 rounded-xl w-fit border border-slate-800">
                {f.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-100 mb-2">{f.title}</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-800 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-mono text-purple-400 uppercase tracking-widest block mb-2">ABOUT THE PLATFORM</span>
            <h2 className="text-3xl font-bold text-slate-100 mb-4">
              Digitizing Kopargaon Municipal Corporation
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Kopargaon is an essential urban center in Maharashtra along the Godavari river. The AI Digital Twin creates a virtual real-time replica of the city’s physical assets, civic grievances, and municipal resources to facilitate data-backed governance.
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <span>Automated triage reduces grievance resolution delay by over 60%.</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <span>Interactive what-if simulations help optimize waste truck routes and road repair budgets.</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <span>Transparent tracking empowers citizens with live progress status.</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 text-center">
              <Database className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-slate-100">28 Wards</div>
              <div className="text-xs text-slate-400 mt-1">Spatial Mapping</div>
            </div>
            <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 text-center">
              <Cpu className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-slate-100">98.4%</div>
              <div className="text-xs text-slate-400 mt-1">AI Classifier Accuracy</div>
            </div>
            <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 text-center">
              <Globe className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-slate-100">24/7</div>
              <div className="text-xs text-slate-400 mt-1">Grievance Desk</div>
            </div>
            <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 text-center">
              <ShieldCheck className="w-8 h-8 text-amber-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-slate-100">Encrypted</div>
              <div className="text-xs text-slate-400 mt-1">Government Security</div>
            </div>
          </div>
        </div>
      </section>

      {/* TECHNOLOGY SECTION */}
      <section id="tech" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-slate-100 mb-3">Enterprise Stack</h2>
          <p className="text-slate-400 text-sm">Built with industry standard high-performance technology components.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {techStack.map((t, idx) => (
            <div key={idx} className="bg-slate-900/70 p-5 rounded-2xl border border-slate-800 text-center hover:border-cyan-500/40 transition-colors">
              <div className="text-3xl mb-2">{t.icon}</div>
              <div className="font-bold text-sm text-slate-200">{t.name}</div>
              <div className="text-[11px] font-mono text-cyan-400 mt-1">{t.category}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TEAM SECTION */}
      <section id="team" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-slate-100 mb-3">Municipal Leadership & Development</h2>
          <p className="text-slate-400 text-sm">Driven by Kopargaon Municipal Corporation innovation cell.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {team.map((m, idx) => (
            <div key={idx} className="glass-panel p-6 rounded-2xl border border-slate-800 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 p-0.5">
                <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center text-cyan-400 font-bold text-xl">
                  {m.name.charAt(0)}
                </div>
              </div>
              <h3 className="font-bold text-base text-slate-100">{m.name}</h3>
              <p className="text-xs font-mono text-cyan-400 mt-1">{m.role}</p>
              <p className="text-xs text-slate-400 mt-2">{m.dept}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 bg-slate-950/90 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-slate-400 text-xs">
          <div className="flex items-center gap-3">
            <Building2 className="w-5 h-5 text-cyan-400" />
            <span className="font-semibold text-slate-200">Kopargaon Municipal Corporation - AI Digital Twin</span>
          </div>
          <div>
            © 2026 Kopargaon Smart City Decision Support System. All Rights Reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-200 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-200 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-200 cursor-pointer">Helpline: 1800-233-1042</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
