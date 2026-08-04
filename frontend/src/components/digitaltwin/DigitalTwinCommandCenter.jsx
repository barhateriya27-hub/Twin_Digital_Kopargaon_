import React, { useState } from 'react';
import {
  Activity, BarChart3, Map, AlertTriangle, CheckCircle2, ChevronRight,
  MapPin, Users, FileText, Clock, TrendingUp, Eye
} from 'lucide-react';
import { useCityIntelligence, formatRelativeTime } from '../../hooks/useCityIntelligence';
import { CityHealthScore } from '../digitaltwin/CityHealthScore';
import { LiveActivityFeed } from '../digitaltwin/LiveActivityFeed';
import { SmartAlertsPanel } from '../digitaltwin/SmartAlertsPanel';
import { DigitalTwinKPICards } from '../digitaltwin/DigitalTwinKPICards';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

/**
 * DigitalTwinCommandCenter — the central intelligence view for Municipality Dashboard
 * Shows real data only: city health, activity feed, alerts, KPIs, analytics
 */
export const DigitalTwinCommandCenter = ({
  complaints = [],
  notifications = [],
  announcements = [],
  auditLogs = [],
  onTabChange,
  onSelectComplaint,
}) => {
  const intel = useCityIntelligence({ complaints, notifications, announcements, auditLogs });
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState(new Set());

  const handleAcknowledge = (alertId) => {
    setAcknowledgedAlerts(prev => new Set([...prev, alertId]));
  };

  const activeAlerts = intel.alerts.filter(a => !acknowledgedAlerts.has(a.id));

  // Ward comparison chart data (from real data)
  const wardChartData = Object.entries(intel.metrics.byWard)
    .map(([ward, data]) => ({
      ward: `W${ward}`,
      open: data.open,
      resolved: data.resolved,
      total: data.total,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 8);

  // Category breakdown (from real data)
  const categoryData = intel.metrics.topCategories.slice(0, 5).map(c => ({
    name: c.category.length > 12 ? c.category.slice(0, 12) + '…' : c.category,
    open: c.open,
    resolved: c.resolved,
  }));

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-5 rounded-2xl border border-slate-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500 rounded-full translate-y-24 -translate-x-24" />
        </div>
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500 text-white">
                DIGITAL TWIN
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Kopargaon Municipal Council
              </span>
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">
              City Intelligence Command Center
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              All metrics derived from real operational data. No simulated values.
            </p>
          </div>

          {/* Live health score compact */}
          <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700 shrink-0">
            <CityHealthScore cityHealth={intel.cityHealth} compact />
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <DigitalTwinKPICards
        metrics={intel.metrics}
        cityHealth={intel.cityHealth}
        onTabChange={onTabChange}
      />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Left: City Health + Ward Analysis */}
        <div className="lg:col-span-4 space-y-6">
          <CityHealthScore cityHealth={intel.cityHealth} />

          {/* Ward Hotspot Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-500" />
                Ward Analysis
              </h3>
              <button
                onClick={() => onTabChange && onTabChange('complaints')}
                className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-0.5"
              >
                View All <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {wardChartData.length === 0 ? (
              <div className="py-6 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <p className="text-xs text-slate-400 dark:text-slate-500">No complaints in the system yet.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {wardChartData.map(ward => (
                  <div key={ward.ward} className="flex items-center gap-3">
                    <span className="text-xs font-black text-slate-700 dark:text-slate-300 w-8 shrink-0">{ward.ward}</span>
                    <div className="flex-1 flex items-center gap-1">
                      {ward.open > 0 && (
                        <div
                          className="h-5 bg-red-200 dark:bg-red-900/60 rounded flex items-center justify-center"
                          style={{ width: `${Math.min(80, (ward.open / (wardChartData[0]?.total || 1)) * 80)}%`, minWidth: ward.open > 0 ? '20px' : '0' }}
                        >
                          <span className="text-[9px] font-black text-red-700 dark:text-red-300 px-1">{ward.open}</span>
                        </div>
                      )}
                      {ward.resolved > 0 && (
                        <div
                          className="h-5 bg-emerald-200 dark:bg-emerald-900/60 rounded flex items-center justify-center"
                          style={{ width: `${Math.min(80, (ward.resolved / (wardChartData[0]?.total || 1)) * 80)}%`, minWidth: ward.resolved > 0 ? '20px' : '0' }}
                        >
                          <span className="text-[9px] font-black text-emerald-700 dark:text-emerald-300 px-1">{ward.resolved}</span>
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono w-12 shrink-0 text-right">
                      {ward.total} total
                    </span>
                  </div>
                ))}
                <div className="flex items-center gap-3 pt-1 text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-red-300 dark:bg-red-700 inline-block" /> Open</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-emerald-300 dark:bg-emerald-700 inline-block" /> Resolved</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center: Live Activity Feed */}
        <div className="lg:col-span-4">
          <LiveActivityFeed
            feed={intel.activityFeed}
            maxItems={12}
            onComplaintClick={(cmpId) => {
              const complaint = complaints.find(c => c.id === cmpId);
              if (complaint && onSelectComplaint) onSelectComplaint(complaint);
            }}
          />
        </div>

        {/* Right: Smart Alerts */}
        <div className="lg:col-span-4">
          <SmartAlertsPanel alerts={activeAlerts} onAcknowledge={handleAcknowledge} />
        </div>
      </div>

      {/* Bottom: Category Analytics + AI Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Category Chart */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-500" />
              Complaints by Category
            </h3>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">REAL DATA</span>
          </div>

          {categoryData.length === 0 ? (
            <div className="py-8 text-center">
              <BarChart3 className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-400 dark:text-slate-500">No complaint data to chart yet.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={categoryData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-slate-700" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    fontSize: 11,
                    borderRadius: 8,
                    border: '1px solid #e2e8f0',
                    backgroundColor: 'white',
                  }}
                />
                <Bar dataKey="open" name="Open" radius={[4, 4, 0, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`open-${index}`} fill="#ef4444" />
                  ))}
                </Bar>
                <Bar dataKey="resolved" name="Resolved" radius={[4, 4, 0, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`resolved-${index}`} fill="#10b981" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}

          {categoryData.length > 0 && (
            <div className="flex items-center gap-4 text-[10px] text-slate-400 dark:text-slate-500 font-mono pt-1">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-red-400 inline-block" /> Open</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-emerald-400 inline-block" /> Resolved</span>
            </div>
          )}
        </div>

        {/* AI Context Summary */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-500" />
              Data-Aware Situation Summary
            </h3>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">COMPUTED</span>
          </div>

          <div className="space-y-3 text-xs">
            {/* Overall Status */}
            <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600 space-y-1">
              <p className="font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider text-[10px]">Overall Status</p>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                City health is <span className={`font-black ${intel.cityHealth.gradeColor}`}>{intel.cityHealth.grade}</span> at{' '}
                <span className="font-black">{intel.cityHealth.overall}/100</span>.{' '}
                {intel.metrics.open > 0
                  ? `There are ${intel.metrics.open} open complaints requiring resolution.`
                  : 'All filed complaints have been resolved.'}
              </p>
            </div>

            {/* Hotspot Ward */}
            {intel.metrics.hotspotWard && intel.metrics.hotspotWardOpen > 0 && (
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-700 space-y-1">
                <p className="font-black text-amber-700 dark:text-amber-300 uppercase tracking-wider text-[10px]">⚠ Hotspot Ward</p>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Ward {intel.metrics.hotspotWard} has the highest concentration with{' '}
                  <span className="font-black">{intel.metrics.hotspotWardOpen} open complaints</span>.
                  Priority dispatch recommended.
                </p>
              </div>
            )}

            {/* SLA Status */}
            {intel.metrics.slaBreached > 0 && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-700 space-y-1">
                <p className="font-black text-red-700 dark:text-red-300 uppercase tracking-wider text-[10px]">🔴 SLA Breach</p>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  <span className="font-black text-red-600 dark:text-red-400">{intel.metrics.slaBreached} ticket(s)</span> have exceeded the 72-hour SLA.
                  Immediate officer assignment or Higher Authority escalation required.
                </p>
              </div>
            )}

            {/* Resolution Performance */}
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-700 space-y-1">
              <p className="font-black text-emerald-700 dark:text-emerald-300 uppercase tracking-wider text-[10px]">✅ Resolution Performance</p>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                <span className="font-black">{intel.metrics.resolved}</span> of{' '}
                <span className="font-black">{intel.metrics.total}</span> complaints resolved
                ({intel.metrics.resolutionRate}% rate).
                {intel.metrics.resolutionRate >= 80 ? ' Performance is above target.' : ' Improvement needed.'}
              </p>
            </div>

            {/* Top category */}
            {intel.metrics.topCategories.length > 0 && intel.metrics.topCategories[0].open > 0 && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-700 space-y-1">
                <p className="font-black text-blue-700 dark:text-blue-300 uppercase tracking-wider text-[10px]">📋 Top Issue Category</p>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  <span className="font-black">{intel.metrics.topCategories[0].category}</span> has the most open complaints
                  ({intel.metrics.topCategories[0].open} open).
                  {' '}{intel.metrics.topCategories[0].category === 'Water Supply' || intel.metrics.topCategories[0].category === 'Water Leakage'
                    ? 'Water Supply department should prioritize these.'
                    : intel.metrics.topCategories[0].category === 'Garbage' || intel.metrics.topCategories[0].category === 'Sanitation'
                    ? 'Sanitation fleet should be redirected.'
                    : 'Relevant department should increase capacity.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
