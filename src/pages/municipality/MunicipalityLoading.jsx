import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Building2, Cpu, CheckCircle2, Shield } from 'lucide-react';

export const MunicipalityLoading = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const loadingMessages = [
    "Connecting to Smart City Network...",
    "Loading Digital Twin...",
    "Synchronizing AI Engine...",
    "Loading City Map...",
    "Connecting GIS Services...",
    "Fetching City Analytics...",
    "Preparing AI Prediction Engine...",
    "Establishing Secure Connection...",
    "✔ Connected Successfully"
  ];

  useEffect(() => {
    // Total duration ~ 3 seconds
    const intervalTime = 300; // 300ms * 9 = 2700ms (~3 seconds)

    const timer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < loadingMessages.length - 1) {
          const next = prev + 1;
          setProgress(((next + 1) / loadingMessages.length) * 100);
          return next;
        } else {
          clearInterval(timer);
          // Redirect to WOW screen after completion
          setTimeout(() => {
            navigate('/municipality/wow');
          }, 400);
          return prev;
        }
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center relative overflow-hidden px-4 selection:bg-cyan-500 selection:text-slate-950">
      {/* Dark Cyberpunk Radar Background */}
      <div className="absolute inset-0 bg-grid-cyber opacity-30 pointer-events-none"></div>
      <div className="absolute w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow"></div>
      <div className="absolute w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl w-full text-center relative z-10 glass-panel p-10 rounded-3xl border border-cyan-500/40 shadow-2xl shadow-cyan-500/10"
      >
        {/* Large Glowing Logo */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 rounded-2xl bg-cyan-500/20 blur-xl animate-pulse"></div>
          <div className="w-full h-full rounded-2xl bg-slate-900 border-2 border-cyan-400 flex items-center justify-center text-cyan-400 shadow-xl shadow-cyan-500/30">
            <Building2 className="w-12 h-12 animate-pulse" />
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100 mb-1">
          AI DIGITAL TWIN OF KOPARGAON
        </h1>
        <p className="text-xs font-mono text-cyan-400 tracking-widest uppercase mb-8">
          SMART CITY DECISION SUPPORT SYSTEM
        </p>

        {/* Animated Progress Bar */}
        <div className="w-full bg-slate-900 h-3 rounded-full border border-cyan-500/30 p-0.5 mb-6 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "easeInOut", duration: 0.3 }}
          />
        </div>

        {/* Sequential Loading Message Fade */}
        <div className="h-12 flex items-center justify-center font-mono text-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={`flex items-center gap-2 ${
                currentStep === loadingMessages.length - 1 
                  ? 'text-emerald-400 font-bold text-base' 
                  : 'text-cyan-300'
              }`}
            >
              {currentStep === loadingMessages.length - 1 ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 animate-bounce" />
              ) : (
                <Cpu className="w-4 h-4 text-cyan-400 animate-spin" />
              )}
              {loadingMessages[currentStep]}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 text-[11px] font-mono text-slate-500 flex items-center justify-between">
          <span>SECURITY PROTOCOL: AES-256</span>
          <span className="flex items-center gap-1.5 text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span> KPG-NODE-ONLINE
          </span>
        </div>
      </motion.div>
    </div>
  );
};
