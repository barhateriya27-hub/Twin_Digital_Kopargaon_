import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 bg-grid-cyber opacity-30 pointer-events-none"></div>
      <div className="absolute w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg w-full text-center relative z-10 glass-panel p-10 rounded-3xl border border-cyan-500/30 shadow-2xl"
      >
        <div className="w-20 h-20 mx-auto mb-6 bg-cyan-500/10 border border-cyan-400/40 rounded-2xl flex items-center justify-center text-cyan-400">
          <ShieldAlert className="w-10 h-10 animate-pulse" />
        </div>

        <h1 className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-2 tracking-tight">
          404
        </h1>
        <h2 className="text-2xl font-bold text-slate-100 mb-4">
          Digital Coordinates Not Found
        </h2>
        <p className="text-slate-400 text-sm mb-8 leading-relaxed">
          The requested Smart City GIS vector node or route does not exist in the Kopargaon Digital Twin neural network.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/25 transition-all duration-300"
          >
            <Home className="w-5 h-5" />
            Return to Home
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 text-xs text-slate-500 flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          Kopargaon Smart City GIS Node Diagnostic
        </div>
      </motion.div>
    </div>
  );
};
