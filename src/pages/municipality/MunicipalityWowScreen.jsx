import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, Cpu, Activity, Database, Sparkles } from 'lucide-react';

export const MunicipalityWowScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 2-second screen duration before redirecting to login
    const timer = setTimeout(() => {
      navigate('/municipality/login');
    }, 2200);

    return () => clearTimeout(timer);
  }, [navigate]);

  const statusCards = [
    { title: "AI Engine Online", icon: <Cpu className="w-5 h-5 text-emerald-400" /> },
    { title: "GIS Map Connected", icon: <Database className="w-5 h-5 text-emerald-400" /> },
    { title: "Live Analytics Ready", icon: <Activity className="w-5 h-5 text-emerald-400" /> },
    { title: "Prediction Module Active", icon: <Sparkles className="w-5 h-5 text-emerald-400" /> },
    { title: "Simulation Engine Ready", icon: <ShieldCheck className="w-5 h-5 text-emerald-400" /> },
    { title: "Secure Connection Established", icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" /> }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center relative overflow-hidden px-4 selection:bg-orange-500 selection:text-white">
      {/* Background Cyber Glow */}
      <div className="absolute inset-0 bg-grid-cyber opacity-35 pointer-events-none"></div>
      <div className="absolute w-[700px] h-[700px] bg-orange-500/15 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute w-[500px] h-[500px] bg-purple-500/15 rounded-full blur-3xl pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.4 }}
        className="max-w-3xl w-full text-center relative z-10 p-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 text-xs font-mono mb-6"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> SYSTEM DIAGNOSTICS CLEARED
        </motion.div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-sky-300 to-purple-400">
          AI DIGITAL TWIN OF KOPARGAON
        </h1>
        <p className="text-sm sm:text-base font-mono text-orange-400 tracking-widest uppercase mb-10">
          SMART CITY CONTROL CENTER
        </p>

        {/* 6 ANIMATED STATUS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {statusCards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="glass-panel p-4 rounded-2xl border border-emerald-500/30 flex items-center gap-3 bg-slate-900/80 shadow-lg shadow-emerald-950/20"
            >
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                {card.icon}
              </div>
              <span className="text-xs font-bold text-slate-100 tracking-wide text-left">
                ✔ {card.title}
              </span>
            </motion.div>
          ))}
        </div>

        {/* BOTTOM GLOWING WELCOME MESSAGE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="p-6 rounded-2xl bg-gradient-to-r from-orange-950/90 via-slate-900 to-purple-950/90 border border-orange-400/50 shadow-2xl shadow-orange-500/20"
        >
          <span className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-purple-300 tracking-wide uppercase">
            Welcome, Municipal Officer
          </span>
          <p className="text-xs font-mono text-slate-400 mt-1">Initializing Officer Authentication Protocol...</p>
        </motion.div>
      </motion.div>
    </div>
  );
};
