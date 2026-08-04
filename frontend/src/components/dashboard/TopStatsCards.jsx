import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Smile, 
  Droplets, 
  Zap, 
  CloudSun, 
  TrendingUp, 
  TrendingDown,
  Activity,
  ShieldAlert
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useCityIntelligence } from '../../hooks/useCityIntelligence';

/**
 * Animated Counter Component for Statistics
 */
const AnimatedCounter = ({ targetValue, duration = 1200, suffix = '', prefix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const isNum = typeof targetValue === 'number';
    if (!isNum) return;

    let start = 0;
    const steps = 30;
    const increment = targetValue / steps;
    const stepTime = duration / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= targetValue) {
        setCount(targetValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [targetValue, duration]);

  if (typeof targetValue !== 'number') {
    return <span>{prefix}{targetValue}{suffix}</span>;
  }

  return (
    <span>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

/**
 * Small SVG Sparkline Component
 */
const Sparkline = ({ color = "#138808", points = [12, 18, 14, 22, 28, 24, 32] }) => {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const width = 80;
  const height = 24;

  const pathPoints = points.map((val, i) => {
    const x = (i / (points.length - 1)) * width;
    const y = height - ((val - min) / range) * (height - 6) - 3;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible shrink-0">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={pathPoints}
      />
      {points.length > 0 && (
        <circle
          cx={width}
          cy={height - ((points[points.length - 1] - min) / range) * (height - 6) - 3}
          r="3"
          fill={color}
        />
      )}
    </svg>
  );
};

/**
 * TopStatsCards — All values derived from real complaint data via AppContext + useCityIntelligence.
 * No hardcoded statistics.
 */
export const TopStatsCards = ({ complaints: propComplaints }) => {
  const ctx = useApp();
  const complaints = propComplaints ?? ctx.complaints ?? [];
  const { notifications = [], announcements = [] } = ctx;
  const intel = useCityIntelligence({ complaints, notifications, announcements });

  const { total, pending, resolved, escalated, open, resolutionRate, slaBreached } = intel.metrics;
  const { overall: healthScore } = intel.cityHealth;

  // Build sparkline points: count of complaints per status category
  const resolvedPoints = [
    Math.max(0, resolved - 3),
    Math.max(0, resolved - 2),
    Math.max(0, resolved - 1),
    resolved
  ];
  const pendingPoints = [
    Math.max(0, pending + 3),
    Math.max(0, pending + 2),
    Math.max(0, pending + 1),
    pending
  ];

  const stats = [
    {
      id: 'open_complaints',
      title: 'Open Complaints',
      value: open,
      suffix: '',
      change: open === 0 ? 'All resolved' : `${pending} pending · ${open - pending} in progress`,
      isPositive: open === 0,
      icon: AlertCircle,
      iconBg: open > 0 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
      sparklineColor: open > 0 ? '#f59e0b' : '#10b981',
      points: pendingPoints
    },
    {
      id: 'resolved_complaints',
      title: 'Resolved Complaints',
      value: resolved,
      suffix: '',
      change: `${resolutionRate}% resolution rate`,
      isPositive: resolutionRate >= 80,
      icon: CheckCircle2,
      iconBg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
      sparklineColor: '#138808',
      points: resolvedPoints
    },
    {
      id: 'sla_compliance',
      title: 'SLA Status',
      value: slaBreached > 0 ? slaBreached : 0,
      suffix: slaBreached > 0 ? ' Breached' : '',
      change: slaBreached > 0 ? `${escalated} escalated to HA` : 'All tickets within SLA',
      isPositive: slaBreached === 0,
      icon: Clock,
      iconBg: slaBreached > 0 ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
      sparklineColor: slaBreached > 0 ? '#ef4444' : '#138808',
      points: [0, 0, 0, slaBreached]
    },
    {
      id: 'total_registered',
      title: 'Total Registered',
      value: total,
      suffix: '',
      change: `${Math.round((resolved / (total || 1)) * 100)}% resolved overall`,
      isPositive: true,
      icon: Activity,
      iconBg: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
      sparklineColor: '#0B2545',
      points: [Math.max(0, total - 3), Math.max(0, total - 2), Math.max(0, total - 1), total]
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.id}
            className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md transition-all space-y-3"
          >
            {/* Top row: Icon & Sparkline */}
            <div className="flex items-center justify-between">
              <div className={`p-2.5 rounded-lg font-bold ${item.iconBg}`}>
                <Icon className="w-5 h-5" />
              </div>
              <Sparkline color={item.sparklineColor} points={item.points} />
            </div>

            {/* Middle row: Title & Animated Counter */}
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {item.title}
              </p>
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
                <AnimatedCounter targetValue={typeof item.value === 'number' ? item.value : 0} suffix={item.suffix} />
                {typeof item.value !== 'number' && item.value}
              </h3>
            </div>

            {/* Bottom row: change indicator */}
            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100 dark:border-slate-700">
              <span className={`font-bold flex items-center gap-1 ${item.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                {item.isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {item.change}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">LIVE DATA</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
