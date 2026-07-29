import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { PhoneCall, HeartPulse, ShieldCheck, Flame, Landmark, Copy, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const EmergencyQuickContacts = () => {
  const { t } = useTranslation();
  const { showToast } = useApp();
  const [copiedNum, setCopiedNum] = React.useState(null);

  const contacts = [
    { name: t('emergencyPortal.nearestHospital', 'Ambulance'), num: '108', icon: HeartPulse, bg: 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300', btn: 'bg-rose-600 hover:bg-rose-700' },
    { name: t('emergencyPortal.nearestPolice', 'Police'), num: '112', icon: ShieldCheck, bg: 'bg-sky-50 border-sky-200 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300', btn: 'bg-sky-600 hover:bg-sky-700' },
    { name: t('emergencyPortal.nearestFire', 'Fire Brigade'), num: '101', icon: Flame, bg: 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300', btn: 'bg-amber-600 hover:bg-amber-700' },
    { name: t('sidebar.title', 'Municipal HQ'), num: '1800-233-1042', icon: Landmark, bg: 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300', btn: 'bg-[#0A2540] hover:bg-slate-800' }
  ];

  const handleCopy = (num) => {
    navigator.clipboard.writeText(num);
    setCopiedNum(num);
    showToast(`Copied ${num} to clipboard!`, 'success');
    setTimeout(() => setCopiedNum(null), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
    >
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center font-bold">
            <PhoneCall className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
              {t('dashboardWidgets.emergencyHelplines', 'One-Touch Emergency Helpline')}
            </h3>
            <span className="text-[10px] text-slate-400 font-mono block">
              {t('dashboardWidgets.directDispatch', 'Direct 24/7 Citizen Dispatch')}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {contacts.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.num}
              className={`p-3 rounded-2xl border ${c.bg} flex flex-col justify-between space-y-2`}
            >
              <div className="flex items-center justify-between">
                <Icon className="w-4 h-4" />
                <span className="text-xs font-black font-mono tracking-wide">{c.num}</span>
              </div>

              <div>
                <span className="font-extrabold text-xs block leading-tight">{c.name}</span>
              </div>

              <div className="grid grid-cols-2 gap-1 pt-1">
                <a
                  href={`tel:${c.num}`}
                  className={`py-1.5 px-2 ${c.btn} text-white rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 shadow-xs`}
                >
                  <PhoneCall className="w-3 h-3" /> {t('emergencyPortal.call', 'Call')}
                </a>

                <button
                  onClick={() => handleCopy(c.num)}
                  className="py-1.5 px-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 border border-slate-200 dark:border-slate-700"
                >
                  {copiedNum === c.num ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  {copiedNum === c.num ? t('emergencyPortal.copied', 'Copied') : t('emergencyPortal.copy', 'Copy')}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
