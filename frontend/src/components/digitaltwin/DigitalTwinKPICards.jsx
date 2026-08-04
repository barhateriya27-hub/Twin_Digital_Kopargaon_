import React from 'react';
import {
  FileText, CheckCircle2, Clock, AlertTriangle, ShieldAlert,
  TrendingUp, TrendingDown, Minus
} from 'lucide-react';

/**
 * DigitalTwinKPICards — shows real KPIs derived from complaints and system state
 */
export const DigitalTwinKPICards = ({ metrics, cityHealth, onTabChange }) => {
  const {
    total = 0,
    pending = 0,
    inProgress = 0,
    resolved = 0,
    escalated = 0,
    open = 0,
    resolutionRate = 100,
    slaBreached = 0,
    unreadAlerts = 0,
  } = metrics || {};

  const score = cityHealth?.overall ?? 100;

  const cards = [
    {
      id: 'open',
      title: 'Open Complaints',
      value: open,
      sub: `${pending} pending · ${inProgress} in progress`,
      icon: FileText,
      iconBg: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300',
      valueColor: open > 0 ? 'text-slate-900 dark:text-white' : 'text-emerald-600 dark:text-emerald-400',
      trend: open > 5 ? 'down' : open > 0 ? 'neutral' : 'up',
      trendLabel: open === 0 ? 'All clear' : open > 5 ? 'High volume' : 'Manageable',
      tab: 'complaints',
    },
    {
      id: 'resolved',
      title: 'Resolved Tickets',
      value: resolved,
      sub: `${resolutionRate}% resolution rate`,
      icon: CheckCircle2,
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400',
      valueColor: 'text-emerald-600 dark:text-emerald-400',
      trend: resolutionRate >= 80 ? 'up' : resolutionRate >= 50 ? 'neutral' : 'down',
      trendLabel: `${resolutionRate}% rate`,
      tab: 'complaints',
    },
    {
      id: 'sla',
      title: 'SLA Breached',
      value: slaBreached,
      sub: escalated > 0 ? `${escalated} escalated to HA` : 'All tickets within SLA',
      icon: Clock,
      iconBg: slaBreached > 0
        ? 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400'
        : 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400',
      valueColor: slaBreached > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400',
      trend: slaBreached > 0 ? 'down' : 'up',
      trendLabel: slaBreached > 0 ? 'Action required' : 'SLA compliant',
      tab: 'complaints',
    },
    {
      id: 'alerts',
      title: 'Active Alerts',
      value: escalated + slaBreached,
      sub: `${unreadAlerts} unread officer notifications`,
      icon: ShieldAlert,
      iconBg: (escalated + slaBreached) > 0
        ? 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400'
        : 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400',
      valueColor: (escalated + slaBreached) > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400',
      trend: (escalated + slaBreached) > 0 ? 'down' : 'up',
      trendLabel: (escalated + slaBreached) === 0 ? 'No critical alerts' : 'Escalations pending',
      tab: 'complaints',
    },
  ];

  const TrendIcon = ({ trend }) => {
    if (trend === 'up') return <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />;
    if (trend === 'down') return <TrendingDown className="w-3.5 h-3.5 text-red-500" />;
    return <Minus className="w-3.5 h-3.5 text-slate-400" />;
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(card => {
        const Icon = card.icon;
        return (
          <button
            key={card.id}
            onClick={() => onTabChange && onTabChange(card.tab)}
            className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 transition-all text-left w-full space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {card.title}
              </span>
              <div className={`p-2 rounded-xl ${card.iconBg}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div>
              <p className={`text-3xl font-black leading-none ${card.valueColor}`}>
                {card.value}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                {card.sub}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700 text-[11px]">
              <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-semibold">
                <TrendIcon trend={card.trend} />
                {card.trendLabel}
              </span>
              <span className="text-slate-400 dark:text-slate-500 font-mono">LIVE</span>
            </div>
          </button>
        );
      })}
    </div>
  );
};
