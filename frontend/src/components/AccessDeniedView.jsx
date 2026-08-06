import React from 'react';
import { motion } from 'framer-motion';
import { ShieldX, Lock, ArrowLeft, Home, KeyRound, AlertTriangle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const AccessDeniedView = ({ requiredRole = 'Authorized Personnel', attemptedPath = '' }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-red-500 selection:text-white">
      {/* Tricolor Government Ribbon */}
      <div className="h-1 w-full flex shrink-0">
        <div className="h-full w-1/3 bg-[#FF9933]"></div>
        <div className="h-full w-1/3 bg-white"></div>
        <div className="h-full w-1/3 bg-[#138808]"></div>
      </div>

      {/* Top Bar */}
      <header className="bg-slate-950/80 backdrop-blur-md border-b border-slate-800 py-3.5 px-6 shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400">
              <ShieldX className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm text-slate-100 block leading-tight">
                KOPARGAON MUNICIPAL SECURITY GATEWAY
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                Government of Maharashtra • Access Control Systems
              </span>
            </div>
          </div>

          <Link
            to="/"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <Home className="w-4 h-4" />
            Return Home
          </Link>
        </div>
      </header>

      {/* 403 Content Card */}
      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="max-w-lg w-full bg-slate-950/90 rounded-2xl p-8 border border-red-500/30 shadow-2xl shadow-red-950/50 text-center relative overflow-hidden"
        >
          {/* Subtle Red Warning Gradient */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="w-16 h-16 mx-auto mb-6 bg-red-950/40 border border-red-500/30 rounded-2xl flex items-center justify-center text-red-500 shadow-lg shadow-red-950/40">
            <Lock className="w-8 h-8" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-full text-red-400 font-mono text-xs font-semibold uppercase tracking-wider mb-4">
            <AlertTriangle className="w-3.5 h-3.5" />
            HTTP 403 Forbidden Access
          </span>

          <h1 className="text-2xl font-black text-slate-100 mb-2 tracking-tight">
            Restricted Government Resource
          </h1>

          <p className="text-xs text-slate-400 font-medium leading-relaxed mb-6 max-w-sm mx-auto">
            You do not have authorization to access this municipal operational module. Server-side security policies enforce role segregation.
          </p>

          <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl text-left text-xs space-y-2 mb-8 font-mono">
            <div className="flex items-center justify-between text-slate-400">
              <span>Required Clearance:</span>
              <span className="text-amber-400 font-semibold">{requiredRole}</span>
            </div>
            {attemptedPath && (
              <div className="flex items-center justify-between text-slate-400 pt-1 border-t border-slate-800/80">
                <span>Attempted Endpoint:</span>
                <span className="text-slate-300 font-semibold truncate max-w-[180px]">{attemptedPath}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-slate-400 pt-1 border-t border-slate-800/80">
              <span>Security Event:</span>
              <span className="text-red-400 font-semibold">Logged to Audit Trail</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate(-1)}
              className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors border border-slate-700"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>

            <button
              onClick={() => navigate('/municipality/login')}
              className="py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 transition-colors"
            >
              <KeyRound className="w-4 h-4" />
              Re-authenticate
            </button>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-500 border-t border-slate-800 bg-slate-950/80 shrink-0">
        Kopargaon Municipal Council • Cyber Security & Governance Protection Policy
      </footer>
    </div>
  );
};
