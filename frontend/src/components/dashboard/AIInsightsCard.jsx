import React from 'react';
import { Sparkles, BrainCircuit, ArrowRight, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useCityIntelligence } from '../../hooks/useCityIntelligence';

/**
 * AIInsightsCard — generates real actionable insights from actual complaint and system data.
 * No hardcoded fictional insights.
 */
export const AIInsightsCard = ({ onActionClick }) => {
  const { complaints = [], notifications = [], announcements = [] } = useApp();
  const intel = useCityIntelligence({ complaints, notifications, announcements });

  const { metrics, cityHealth, alerts } = intel;

  // Generate insights from real data
  const insights = [];

  // Insight 1: Top category if any open complaints
  if (metrics.topCategories.length > 0 && metrics.topCategories[0].open > 0) {
    const top = metrics.topCategories[0];
    insights.push({
      id: 'top-category',
      title: `${top.open} Open ${top.category} Complaint${top.open > 1 ? 's' : ''}`,
      category: `${top.category} Analytics`,
      description: `"${top.category}" has the highest number of open complaints (${top.open}) in the current system.`,
      recommendation: top.category.includes('Water')
        ? 'Dispatch water supply maintenance team and check pipeline status in affected wards.'
        : top.category.includes('Garbage') || top.category.includes('Sanitation')
        ? 'Increase sanitation fleet frequency in affected wards to reduce open backlog.'
        : top.category.includes('Pothole') || top.category.includes('Road')
        ? 'Assign PWD crew to inspect and repair road conditions in flagged areas.'
        : top.category.includes('Light') || top.category.includes('Electrical')
        ? 'Dispatch electrical maintenance team to inspect and repair streetlights.'
        : `Assign ${top.category} department resources to address open tickets.`,
      tag: 'Action Required',
      tagColor: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700',
    });
  }

  // Insight 2: SLA breach alert
  if (metrics.slaBreached > 0) {
    insights.push({
      id: 'sla-breach',
      title: `${metrics.slaBreached} SLA Breach${metrics.slaBreached > 1 ? 'es' : ''} Detected`,
      category: 'SLA Compliance',
      description: `${metrics.slaBreached} complaint${metrics.slaBreached > 1 ? 's have' : ' has'} exceeded the 72-hour resolution SLA limit.`,
      recommendation: 'Assign senior officers immediately or escalate to Higher Authority to prevent further SLA violations.',
      tag: 'Critical',
      tagColor: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/40 dark:text-red-300 dark:border-red-700',
    });
  }

  // Insight 3: Hotspot ward
  if (metrics.hotspotWard && metrics.hotspotWardOpen >= 2) {
    insights.push({
      id: 'hotspot-ward',
      title: `Ward ${metrics.hotspotWard} — Complaint Hotspot`,
      category: 'Ward Spatial Analysis',
      description: `Ward ${metrics.hotspotWard} has the highest concentration with ${metrics.hotspotWardOpen} open complaints requiring attention.`,
      recommendation: `Conduct priority field inspection in Ward ${metrics.hotspotWard} and deploy multi-department response team.`,
      tag: 'High Priority',
      tagColor: 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/40 dark:text-orange-300 dark:border-orange-700',
    });
  }

  // Insight 4: Good resolution rate or city health
  if (metrics.resolutionRate >= 80 || cityHealth.overall >= 80) {
    insights.push({
      id: 'performance',
      title: `Resolution Rate: ${metrics.resolutionRate}% — ${cityHealth.grade}`,
      category: 'Municipal Performance',
      description: `${metrics.resolved} of ${metrics.total} complaints have been resolved. City health score is ${cityHealth.overall}/100.`,
      recommendation: metrics.resolutionRate >= 90
        ? 'Excellent performance. Continue current dispatch workflows and maintain SLA compliance.'
        : 'Good progress. Focus on reducing pending complaints to improve city health further.',
      tag: cityHealth.overall >= 80 ? 'Performing Well' : 'On Track',
      tagColor: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-700',
    });
  } else if (cityHealth.overall < 60) {
    insights.push({
      id: 'health-critical',
      title: `City Health: ${cityHealth.overall}/100 — ${cityHealth.grade}`,
      category: 'City Health Index',
      description: `Multiple open service issues are impacting city health. Immediate action required across departments.`,
      recommendation: 'Convene emergency coordination meeting with department heads. Prioritize escalated and SLA-breached tickets.',
      tag: 'Urgent',
      tagColor: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/40 dark:text-red-300 dark:border-red-700',
    });
  }

  // Fallback: no complaints at all
  if (insights.length === 0) {
    insights.push({
      id: 'all-clear',
      title: 'All Systems Operational',
      category: 'System Status',
      description: 'No open complaints or service issues currently registered in the system.',
      recommendation: 'Conduct routine maintenance checks and encourage citizens to register any service requests through the Citizen Portal.',
      tag: 'All Clear',
      tagColor: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-700',
    });
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
      {/* Card Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-slate-900 dark:bg-slate-700 text-amber-400">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              AI Data Insights
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                REAL DATA
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Insights computed from actual system state
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((item) => (
          <div
            key={item.id}
            className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 transition-all space-y-2.5 relative group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-extrabold uppercase text-slate-700 dark:text-slate-300">
                {item.category}
              </span>
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${item.tagColor}`}>
                {item.tag}
              </span>
            </div>

            <h4 className="font-extrabold text-xs text-slate-900 dark:text-white leading-tight">
              {item.title}
            </h4>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {item.description}
            </p>

            <div className="p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 text-xs space-y-1">
              <span className="font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 text-[10px] uppercase">
                <CheckCircle2 className="w-3.5 h-3.5" /> Recommended Action:
              </span>
              <p className="text-[11px] text-slate-700 dark:text-slate-300 font-semibold">
                {item.recommendation}
              </p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono text-center pt-1 border-t border-slate-100 dark:border-slate-700">
        All insights derived from real complaint, SLA, and resolution data
      </p>
    </div>
  );
};
