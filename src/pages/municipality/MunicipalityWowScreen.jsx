import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, Cpu, Activity, Database, Sparkles } from 'lucide-react';

export const MunicipalityWowScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/municipality/login');
    }, 2200);

    return () => clearTimeout(timer);
  }, [navigate]);

  const statusCards = [
    { title: "AI Engine Online", icon: <Cpu className="w-5 h-5 text-[#22C55E]" /> },
    { title: "GIS Map Connected", icon: <Database className="w-5 h-5 text-[#22C55E]" /> },
    { title: "Live Analytics Ready", icon: <Activity className="w-5 h-5 text-[#22C55E]" /> },
    { title: "Prediction Module Active", icon: <Sparkles className="w-5 h-5 text-[#22C55E]" /> },
    { title: "Simulation Engine Ready", icon: <ShieldCheck className="w-5 h-5 text-[#22C55E]" /> },
    { title: "Secure Connection Established", icon: <CheckCircle2 className="w-5 h-5 text-[#22C55E]" /> }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-900 dark:bg-slate-900 text-[#1E293B] dark:text-slate-200 flex flex-col items-center justify-center relative overflow-hidden px-4 selection:bg-[#F97316] selection:text-white">
      
      {/* Tricolor Ribbon */}
      <div className="h-[4px] w-full flex shrink-0 absolute top-0 left-0 right-0 z-50">
        <div className="h-full w-1/3 bg-[#FF9933]"></div>
        <div className="h-full w-1/3 bg-white dark:bg-slate-800"></div>
        <div className="h-full w-1/3 bg-[#138808]"></div>
      </div>

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
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#22C55E]/40 bg-[#22C55E]/10 text-[#22C55E] text-xs font-bold mb-6"
        >
          <CheckCircle2 className="w-4 h-4 text-[#22C55E]" /> SYSTEM DIAGNOSTICS CLEARED
        </motion.div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-2 text-[#0F172A] dark:text-slate-100">
          AI DIGITAL TWIN OF KOPARGAON
        </h1>
        <p className="text-sm sm:text-base font-bold text-[#F97316] tracking-widest uppercase mb-10">
          SMART CITY CONTROL CENTER
        </p>

        {/* 6 STATUS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {statusCards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-[#E2E8F0] dark:border-slate-700 shadow-sm hover:shadow transition-all flex items-center gap-3"
            >
              <div className="p-2 rounded-xl bg-green-50 border border-green-100 shrink-0">
                {card.icon}
              </div>
              <span className="text-xs font-bold text-[#1E293B] dark:text-slate-200 tracking-wide text-left">
                ✔ {card.title}
              </span>
            </motion.div>
          ))}
        </div>

        {/* BOTTOM WELCOME MESSAGE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="p-6 rounded-2xl bg-white dark:bg-slate-800 border-t-4 border-t-[#F97316] border-x border-b border-[#E2E8F0] dark:border-slate-700 shadow-xl shadow-slate-200/50"
        >
          <span className="text-xl sm:text-2xl font-black text-[#0F172A] dark:text-slate-100 tracking-wide uppercase">
            Welcome, Municipal Officer
          </span>
          <p className="text-xs font-semibold text-[#64748B] dark:text-slate-400 mt-1">Initializing Officer Authentication Protocol...</p>
        </motion.div>
      </motion.div>
    </div>
  );
};
