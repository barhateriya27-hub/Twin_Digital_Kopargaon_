import React from 'react';
import { AlertTriangle, AlertCircle, Info, CheckCircle2, MapPin, Clock, Shield, X } from 'lucide-react';
import { formatRelativeTime } from '../../hooks/useCityIntelligence';

const SEVERITY_CONFIG = {
  critical: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-300 dark:border-red-700',
    leftBorder: 'border-l-red-500',
    icon: AlertTriangle,
    iconColor: 'text-red-500',
    badge: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300',
    dot: 'bg-red-500',
    label: 'CRITICAL',
  },
  warning: {
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    border: 'border-amber-300 dark:border-amber-700',
    leftBorder: 'border-l-amber-500',
    icon: AlertCircle,
    iconColor: 'text-amber-500',
    badge: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
    dot: 'bg-amber-500',
    label: 'WARNING',
  },
  info: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-300 dark:border-blue-700',
    leftBorder: 'border-l-blue-500',
    icon: Info,
    iconColor: 'text-blue-500',
    badge: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
    dot: 'bg-blue-500',
    label: 'INFO',
  },
};

/**
 * SmartAlertsPanel — shows alerts derived from real data (SLA breaches, escalations, dense wards)
 */
export const SmartAlertsPanel = ({ alerts = [], onAcknowledge, compact = false }) => {
  const criticalCount = alerts.filter(a => a.severity === 'critical').length;
  const warningCount = alerts.filter(a => a.severity === 'warning').length;
  const infoCount = alerts.filter(a => a.severity === 'info').length;

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {criticalCount > 0 && (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 text-xs font-black">
            <AlertTriangle className="w-3 h-3" />
            {criticalCount} Critical
          </span>
        )}
        {warningCount > 0 && (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-xs font-black">
            <AlertCircle className="w-3 h-3" />
            {warningCount} Warning
          </span>
        )}
        {criticalCount === 0 && warningCount === 0 && (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-black">
            <CheckCircle2 className="w-3 h-3" />
            All Clear
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-red-500" />
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
            Smart Alerts
          </h3>
        </div>
        <div className="flex items-center gap-1.5">
          {criticalCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 animate-pulse">
              {criticalCount} CRITICAL
            </span>
          )}
          {warningCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
              {warningCount} WARNING
            </span>
          )}
          {infoCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
              {infoCount} INFO
            </span>
          )}
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="py-8 text-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
          <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">All Clear</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            No active alerts. All SLAs are within compliance.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => {
            const config = SEVERITY_CONFIG[alert.severity] || SEVERITY_CONFIG.info;
            const Icon = config.icon;

            return (
              <div
                key={alert.id}
                className={`p-4 rounded-xl border border-l-4 ${config.bg} ${config.border} ${config.leftBorder} relative`}
              >
                {/* Top row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${config.iconColor}`} />
                    <span className="text-xs font-black text-slate-900 dark:text-white leading-tight">
                      {alert.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${config.badge}`}>
                      {config.label}
                    </span>
                    {onAcknowledge && (
                      <button
                        onClick={() => onAcknowledge(alert.id)}
                        className="p-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                        title="Acknowledge"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                  {alert.description}
                </p>

                {/* Recommended Action */}
                <div className="mt-2 p-2 bg-white/60 dark:bg-slate-800/60 rounded-lg border border-slate-200/80 dark:border-slate-700/80">
                  <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">
                    Recommended Action
                  </p>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300 font-semibold">{alert.action}</p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-2 text-[10px]">
                  <span className="flex items-center gap-1 text-slate-400 dark:text-slate-500 font-mono">
                    <MapPin className="w-2.5 h-2.5" />
                    {alert.location}
                  </span>
                  <span className="flex items-center gap-1 text-slate-400 dark:text-slate-500 font-mono">
                    <Clock className="w-2.5 h-2.5" />
                    {formatRelativeTime(alert.timestamp)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono text-center pt-1 border-t border-slate-100 dark:border-slate-700">
        Alerts auto-generated from real SLA breaches, escalations & complaint density
      </p>
    </div>
  );
};
