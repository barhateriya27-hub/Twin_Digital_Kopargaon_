import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, KeyRound, LogOut, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SessionExpiredModal = ({ isOpen, onReAuthenticate, onLogout }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-6 border border-amber-500/30 shadow-2xl text-center relative overflow-hidden"
        >
          <div className="w-14 h-14 mx-auto mb-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 rounded-2xl flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-md">
            <Clock className="w-7 h-7 animate-pulse" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-full text-amber-800 dark:text-amber-300 font-semibold text-xs mb-3">
            <ShieldAlert className="w-3.5 h-3.5" />
            Security Session Expired
          </span>

          <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 mb-2">
            Your Session Has Timed Out
          </h3>

          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 font-medium leading-relaxed">
            For your digital security and data protection, your authentication token has expired. Please re-authenticate to continue your session safely.
          </p>

          <div className="flex flex-col gap-2.5">
            <button
              onClick={() => {
                if (onReAuthenticate) onReAuthenticate();
              }}
              className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs uppercase tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-amber-600/20 transition-all"
            >
              <KeyRound className="w-4 h-4" />
              Re-Authenticate Now
            </button>

            <button
              onClick={() => {
                if (onLogout) onLogout();
                navigate('/');
              }}
              className="w-full py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Logout & Return Home
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
