import React from 'react';
import { Activity, Shield, Trash2, Droplets, Car, Users, TrendingUp, TrendingDown } from 'lucide-react';

const DIMENSIONS = [
  { key: 'mobility', label: 'Mobility', icon: Car, color: 'bg-blue-500', lightColor: 'bg-blue-100 dark:bg-blue-900/30', textColor: 'text-blue-700 dark:text-blue-300' },
  { key: 'cleanliness', label: 'Cleanliness', icon: Trash2, color: 'bg-emerald-500', lightColor: 'bg-emerald-100 dark:bg-emerald-900/30', textColor: 'text-emerald-700 dark:text-emerald-300' },
  { key: 'infrastructure', label: 'Infrastructure', icon: Activity, color: 'bg-purple-500', lightColor: 'bg-purple-100 dark:bg-purple-900/30', textColor: 'text-purple-700 dark:text-purple-300' },
  { key: 'utilities', label: 'Utilities', icon: Droplets, color: 'bg-cyan-500', lightColor: 'bg-cyan-100 dark:bg-cyan-900/30', textColor: 'text-cyan-700 dark:text-cyan-300' },
  { key: 'citizenServices', label: 'Citizen Services', icon: Users, color: 'bg-amber-500', lightColor: 'bg-amber-100 dark:bg-amber-900/30', textColor: 'text-amber-700 dark:text-amber-300' },
  { key: 'safety', label: 'Safety', icon: Shield, color: 'bg-red-500', lightColor: 'bg-red-100 dark:bg-red-900/30', textColor: 'text-red-700 dark:text-red-300' },
];

function getScoreColor(score) {
  if (score >= 90) return 'text-emerald-600 dark:text-emerald-400';
  if (score >= 75) return 'text-blue-600 dark:text-blue-400';
  if (score >= 60) return 'text-amber-600 dark:text-amber-400';
  if (score >= 40) return 'text-orange-600 dark:text-orange-400';
  return 'text-red-600 dark:text-red-400';
}

function getBarColor(score) {
  if (score >= 90) return 'bg-emerald-500';
  if (score >= 75) return 'bg-blue-500';
  if (score >= 60) return 'bg-amber-500';
  if (score >= 40) return 'bg-orange-500';
  return 'bg-red-500';
}

function getRingColor(score) {
  if (score >= 90) return '#10b981';
  if (score >= 75) return '#3b82f6';
  if (score >= 60) return '#f59e0b';
  if (score >= 40) return '#f97316';
  return '#ef4444';
}

/**
 * CityHealthScore — displays overall city health derived from real complaint data
 */
export const CityHealthScore = ({ cityHealth, compact = false }) => {
  const { overall = 100, grade = 'Excellent', gradeColor = 'text-emerald-600', dimensionScores = {} } = cityHealth || {};

  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overall / 100) * circumference;
  const ringColor = getRingColor(overall);

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <div className="relative w-14 h-14 shrink-0">
          <svg width="56" height="56" viewBox="0 0 88 88" className="rotate-[-90deg]">
            <circle cx="44" cy="44" r={radius} stroke="#e2e8f0" strokeWidth="8" fill="none" className="dark:stroke-slate-700" />
            <circle
              cx="44" cy="44" r={radius}
              stroke={ringColor}
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-xs font-black ${getScoreColor(overall)}`}>{overall}</span>
          </div>
        </div>
        <div>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">City Health</p>
          <p className={`text-lg font-black ${getScoreColor(overall)}`}>{overall}/100</p>
          <p className={`text-xs font-bold ${gradeColor}`}>{grade}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-500" />
            City Health Score
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Computed from real complaint & service data</p>
        </div>
        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
          LIVE DATA
        </span>
      </div>

      {/* Main Score Ring */}
      <div className="flex items-center gap-6">
        <div className="relative w-24 h-24 shrink-0">
          <svg width="96" height="96" viewBox="0 0 88 88" className="rotate-[-90deg]">
            <circle cx="44" cy="44" r={radius} stroke="#e2e8f0" strokeWidth="8" fill="none" className="dark:stroke-slate-700" />
            <circle
              cx="44" cy="44" r={radius}
              stroke={ringColor}
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-2xl font-black leading-none ${getScoreColor(overall)}`}>{overall}</span>
            <span className="text-[9px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">/100</span>
          </div>
        </div>

        <div className="flex-1 space-y-1">
          <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">Overall Grade</p>
          <p className={`text-2xl font-black ${gradeColor}`}>{grade}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Based on {Object.values(dimensionScores).filter(s => s < 100).length > 0
              ? `${Object.values(dimensionScores).filter(s => s < 100).length} active service dimension(s) with issues`
              : 'all service dimensions performing well'}
          </p>
          {overall < 100 && (
            <p className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-semibold">
              <TrendingDown className="w-3 h-3" />
              Score reflects open complaints & SLA breaches
            </p>
          )}
          {overall === 100 && (
            <p className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              <TrendingUp className="w-3 h-3" />
              All services running smoothly
            </p>
          )}
        </div>
      </div>

      {/* Dimension Bars */}
      <div className="space-y-2.5">
        {DIMENSIONS.map(dim => {
          const score = dimensionScores[dim.key] ?? 100;
          const Icon = dim.icon;
          return (
            <div key={dim.key} className="flex items-center gap-3">
              <div className={`p-1.5 rounded-lg ${dim.lightColor} shrink-0`}>
                <Icon className={`w-3.5 h-3.5 ${dim.textColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{dim.label}</span>
                  <span className={`text-xs font-black ${getScoreColor(score)}`}>{score}</span>
                </div>
                <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${getBarColor(score)}`}
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono text-center pt-1 border-t border-slate-100 dark:border-slate-700">
        Scores decrease per open complaint • Escalations penalized more heavily
      </p>
    </div>
  );
};
