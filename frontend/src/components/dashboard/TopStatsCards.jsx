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
  Activity
} from 'lucide-react';

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

export const TopStatsCards = ({ complaints = [] }) => {
  const totalCount = complaints.length || 24;
  const resolvedCount = complaints.filter(c => c.status === 'Completed' || c.status === 'Resolved').length || 18;
  const pendingCount = complaints.filter(c => c.status !== 'Completed' && c.status !== 'Resolved').length || 6;
  
  const stats = [
    {
      id: 'today_complaints',
      title: "Today's Complaints",
      value: 8,
      suffix: '',
      change: '+2 vs yesterday',
      isPositive: false,
      icon: AlertCircle,
      iconBg: 'bg-[#0B2545]/10 text-[#0B2545]',
      sparklineColor: '#FF9933',
      points: [3, 5, 4, 7, 6, 8]
    },
    {
      id: 'resolved_complaints',
      title: 'Resolved Complaints',
      value: resolvedCount,
      suffix: '',
      change: '94% SLA rate',
      isPositive: true,
      icon: CheckCircle2,
      iconBg: 'bg-emerald-100 text-[#138808]',
      sparklineColor: '#138808',
      points: [10, 12, 14, 15, 16, resolvedCount]
    },
    {
      id: 'pending_complaints',
      title: 'Pending Complaints',
      value: pendingCount,
      suffix: '',
      change: '-12% vs last week',
      isPositive: true,
      icon: Clock,
      iconBg: 'bg-amber-100 text-[#FF9933]',
      sparklineColor: '#FF9933',
      points: [12, 10, 9, 8, 7, pendingCount]
    },
    {
      id: 'citizen_satisfaction',
      title: 'Citizen Satisfaction',
      value: 98,
      suffix: '%',
      change: '+1.4% rating',
      isPositive: true,
      icon: Smile,
      iconBg: 'bg-blue-100 text-blue-800',
      sparklineColor: '#138808',
      points: [92, 94, 95, 96, 97, 98]
    },
    {
      id: 'avg_resolution_time',
      title: 'Avg Resolution Time',
      value: 1.8,
      suffix: ' Days',
      change: 'SLA Limit 72 Hrs',
      isPositive: true,
      icon: Activity,
      iconBg: 'bg-slate-100 text-slate-800',
      sparklineColor: '#0B2545',
      points: [3.2, 2.8, 2.4, 2.1, 1.9, 1.8]
    },
    {
      id: 'water_status',
      title: 'Water Supply Status',
      value: 'Normal',
      change: '88% Reservoir',
      isPositive: true,
      icon: Droplets,
      iconBg: 'bg-cyan-100 text-cyan-800',
      sparklineColor: '#0077B6',
      points: [80, 82, 85, 84, 86, 88]
    },
    {
      id: 'electricity_status',
      title: 'Electricity Status',
      value: 'Grid Stable',
      change: '99.8% Uptime',
      isPositive: true,
      icon: Zap,
      iconBg: 'bg-amber-50 text-amber-600',
      sparklineColor: '#138808',
      points: [99, 99, 99.5, 99.6, 99.7, 99.8]
    },
    {
      id: 'weather_status',
      title: 'Weather',
      value: '29°C Clear',
      change: 'AQI 42 (Good)',
      isPositive: true,
      icon: CloudSun,
      iconBg: 'bg-orange-100 text-orange-700',
      sparklineColor: '#FF9933',
      points: [26, 27, 28, 29, 29, 29]
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-4 gap-4">
      {stats.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.id}
            className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-3"
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
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {item.title}
              </p>
              <h3 className="text-xl font-black text-[#0B2545] tracking-tight mt-0.5">
                <AnimatedCounter targetValue={item.value} suffix={item.suffix} />
              </h3>
            </div>

            {/* Bottom row: Today's change indicator */}
            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
              <span className={`font-bold flex items-center gap-1 ${item.isPositive ? 'text-[#138808]' : 'text-slate-600'}`}>
                {item.isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5 text-amber-600" />}
                {item.change}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">NIC TELEMETRY</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
