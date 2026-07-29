import React from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, AlertTriangle, CheckCircle2, AlertCircle } from 'lucide-react';
import { getSLAStatus } from '../utils/governanceUtils';

export const SLAIndicator = ({ submittedAt, dueDate, currentStatus, compact = false }) => {
  const { t } = useTranslation();
  const sla = getSLAStatus(submittedAt, dueDate, currentStatus);

  if (currentStatus === 'Completed' || currentStatus === 'Resolved') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800`}>
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>{t('citizenDashboard.resolved', 'Resolved')}</span>
      </div>
    );
  }

  if (sla.isOverdue) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800 animate-pulse`}>
        <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
        <span>SLA: {sla.statusText}</span>
      </div>
    );
  }

  if (sla.badgeColor === 'yellow') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800`}>
        <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        <span>SLA: {sla.statusText}</span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700`}>
      <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
      <span>SLA: {sla.statusText}</span>
    </div>
  );
};
