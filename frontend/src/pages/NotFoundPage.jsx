import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ShieldAlert, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 flex flex-col justify-between selection:bg-[#F97316] selection:text-white">
      
      {/* Tricolor Ribbon */}
      <div className="h-[4px] w-full flex shrink-0">
        <div className="h-full w-1/3 bg-[#FF9933]"></div>
        <div className="h-full w-1/3 bg-white dark:bg-slate-800"></div>
        <div className="h-full w-1/3 bg-[#138808]"></div>
      </div>

      <main className="flex-1 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full text-center bg-white dark:bg-slate-800 rounded-3xl p-10 border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/50"
        >
          <div className="w-16 h-16 mx-auto mb-6 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 rounded-2xl flex items-center justify-center text-orange-600">
            <ShieldAlert className="w-9 h-9" />
          </div>

          <h1 className="text-5xl font-black text-gov-navy mb-2 tracking-tight">
            404
          </h1>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-3">
            {t('common.notFoundTitle', 'Page Not Found')}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mb-8 leading-relaxed">
            {t('common.notFoundTitle', 'The requested page or municipal service does not exist on the Kopargaon Municipal Council e-Portal.')}
          </p>

          <div className="flex justify-center">
            <Link
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold shadow-md shadow-orange-600/20 transition-all text-sm uppercase tracking-wide"
            >
              <Home className="w-4 h-4" />
              {t('common.returnHome', 'Return to Home Page')}
            </Link>
          </div>
        </motion.div>
      </main>

      <footer className="py-4 text-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shrink-0">
        {t('footer.disclaimer', 'Kopargaon Municipal Council • Helpline: 1800-233-1042 | support@kopargaon.gov.in')}
      </footer>
    </div>
  );
};
