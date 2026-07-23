import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Building2, Cpu, CheckCircle2 } from 'lucide-react';

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
    const intervalTime = 300; 

    const timer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < loadingMessages.length - 1) {
          const next = prev + 1;
          setProgress(((next + 1) / loadingMessages.length) * 100);
          return next;
        } else {
          clearInterval(timer);
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
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-900 dark:bg-slate-900 text-[#1E293B] dark:text-slate-200 flex flex-col items-center justify-center relative overflow-hidden px-4 selection:bg-[#F97316] selection:text-white">
      
      {/* Tricolor Ribbon */}
      <div className="h-[4px] w-full flex shrink-0 absolute top-0 left-0 right-0 z-50">
        <div className="h-full w-1/3 bg-[#FF9933]"></div>
        <div className="h-full w-1/3 bg-white dark:bg-slate-800"></div>
        <div className="h-full w-1/3 bg-[#138808]"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl w-full text-center relative z-10 bg-white dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 p-10 rounded-3xl shadow-xl shadow-slate-200/50"
      >
        {/* Large Glowing Logo */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 rounded-2xl bg-orange-50 blur-xl animate-pulse"></div>
          <div className="w-full h-full rounded-2xl bg-white dark:bg-slate-800 border-2 border-[#F97316] flex items-center justify-center text-[#F97316] shadow-md shadow-[#F97316]/10">
            <Building2 className="w-12 h-12" />
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#0F172A] dark:text-slate-100 mb-1">
          AI DIGITAL TWIN OF KOPARGAON
        </h1>
        <p className="text-xs font-bold text-[#F97316] tracking-widest uppercase mb-8">
          SMART CITY DECISION SUPPORT SYSTEM
        </p>

        {/* Animated Progress Bar */}
        <div className="w-full bg-[#F8FAFC] dark:bg-slate-900 h-3 rounded-full border border-[#E2E8F0] dark:border-slate-700 p-0.5 mb-6 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#F97316] to-[#22C55E] rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "easeInOut", duration: 0.3 }}
          />
        </div>

        {/* Sequential Loading Message Fade */}
        <div className="h-12 flex items-center justify-center font-sans text-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={`flex items-center gap-2 font-bold ${
                currentStep === loadingMessages.length - 1 
                  ? 'text-[#22C55E] text-base' 
                  : 'text-[#F97316]'
              }`}
            >
              {currentStep === loadingMessages.length - 1 ? (
                <CheckCircle2 className="w-5 h-5 text-[#22C55E] animate-bounce" />
              ) : (
                <Cpu className="w-4 h-4 text-[#F97316] animate-spin" />
              )}
              {loadingMessages[currentStep]}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-8 pt-6 border-t border-[#E2E8F0] dark:border-slate-700 text-[11px] font-semibold text-[#64748B] dark:text-slate-400 flex items-center justify-between">
          <span>SECURITY PROTOCOL: AES-256</span>
          <span className="flex items-center gap-1.5 text-[#F97316]">
            <span className="w-2 h-2 rounded-full bg-[#F97316] animate-ping"></span> KPG-NODE-ONLINE
          </span>
        </div>
      </motion.div>
    </div>
  );
};
