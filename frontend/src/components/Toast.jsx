import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Toast = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400" />,
    error: <XCircle className="w-5 h-5 text-rose-400" />,
    info: <Info className="w-5 h-5 text-blue-400" />
  };

  const bgStyles = {
    success: 'bg-slate-900/90 border-emerald-500/40 text-emerald-100 shadow-emerald-950/50',
    warning: 'bg-slate-900/90 border-amber-500/40 text-amber-100 shadow-amber-950/50',
    error: 'bg-slate-900/90 border-rose-500/40 text-rose-100 shadow-rose-950/50',
    info: 'bg-slate-900/90 border-blue-500/40 text-blue-100 shadow-blue-950/50'
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-none">
      <AnimatePresence>
        <motion.div
          key={toastMessage.id}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className={`flex items-center gap-3 px-5 py-3.5 rounded-xl border backdrop-blur-md shadow-xl ${bgStyles[toastMessage.type] || bgStyles.info}`}
        >
          {icons[toastMessage.type] || icons.info}
          <span className="font-medium text-sm tracking-wide">{toastMessage.message}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
