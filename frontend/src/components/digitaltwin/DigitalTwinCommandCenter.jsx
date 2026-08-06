import React, { useState } from 'react';
import {
  Activity, BarChart3, Map, AlertTriangle, CheckCircle2, ChevronRight,
  MapPin, Users, FileText, Clock, TrendingUp, Eye, Sparkles, AlertCircle, ShieldAlert, X
} from 'lucide-react';
import { useCityIntelligence } from '../../hooks/useCityIntelligence';
import { useAIEngine } from '../../hooks/useAIEngine';
import { CityHealthScore } from '../digitaltwin/CityHealthScore';
import { LiveActivityFeed } from '../digitaltwin/LiveActivityFeed';
import { SmartAlertsPanel } from '../digitaltwin/SmartAlertsPanel';
import { DigitalTwinKPICards } from '../digitaltwin/DigitalTwinKPICards';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

/**
 * Stage 6 Data-Driven Digital Twin Command Center
 * Grounded in single source of truth database with prediction & explainable risk intelligence.
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
  const aiEngine = useAIEngine(intel);

  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState(new Set());
  const [selectedRiskWard, setSelectedRiskWard] = useState(null);

  const handleAcknowledge = (alertId) => {
    setAcknowledgedAlerts(prev => new Set([...prev, alertId]));
  };

  const activeAlerts = intel.alerts.filter(a => !acknowledgedAlerts.has(a.id));

  // Compute Explainable Ward Risk Intelligence (0-100) from Real Database
  const wardRiskScores = Object.entries(intel.metrics.byWard).map(([ward, data]) => {
    const open = data.open || 0;
    const total = data.total || 0;
    
    // SLA Breaches in this ward
    const wardTickets = complaints.filter(c => (c.location?.ward || c.ward) === Number(ward));
    const slaBreaches = wardTickets.filter(c => c.dueDate && new Date(c.dueDate).getTime() < Date.now() && c.status !== 'Resolved' && c.status !== 'Completed').length;
    const emergencyCount = wardTickets.filter(c => c.priority === 'Emergency' || c.priority === 'High').length;

    // Calculate Explainable Risk Score
    let riskScore = Math.min(100, (open * 18) + (slaBreaches * 25) + (emergencyCount * 15));
    let riskLevel = 'Low';
    let riskColor = 'emerald';
    let riskBadge = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300';

    if (riskScore >= 60) {
      riskLevel = 'High';
      riskColor = 'red';
      riskBadge = 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300';
    } else if (riskScore >= 30) {
      riskLevel = 'Medium';
      riskColor = 'amber';
      riskBadge = 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300';
    }

    // Explainable Rationale ("WHY")
    let rationale = `Ward ${ward} is marked ${riskLevel.toUpperCase()} RISK (${riskScore}/100) because it contains ${open} unresolved ticket(s)`;
    if (slaBreaches > 0) rationale += `, ${slaBreaches} SLA breach(es)`;
    if (emergencyCount > 0) rationale += `, and ${emergencyCount} high/emergency priority incident(s)`;
    rationale += '.';

    return {
      ward: Number(ward),
      wardLabel: `Ward ${ward}`,
      open,
      total,
      slaBreaches,
      emergencyCount,
      riskScore,
      riskLevel,
      riskBadge,
      rationale,
      tickets: wardTickets
    };
  }).sort((a, b) => b.riskScore - a.riskScore);

  // Ward chart data
  const wardChartData = wardRiskScores.slice(0, 8).map(w => ({
    ward: `W${w.ward}`,
    open: w.open,
    resolved: w.total - w.open,
    total: w.total,
  }));

  // Category breakdown
  const categoryData = intel.metrics.topCategories.slice(0, 5).map(c => ({
    name: c.category.length > 12 ? c.category.slice(0, 12) + '…' : c.category,
    open: c.open,
    resolved: c.resolved,
  }));

  const activeDrilldownWard = selectedRiskWard ? wardRiskScores.find(w => w.ward === selectedRiskWard) : null;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0B2545] via-[#103459] to-[#0B2545] p-5 rounded-2xl border border-sky-900/50 shadow-lg relative overflow-hidden text-white">
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#138808] text-white">
                STAGE 6 DIGITAL TWIN
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-900/80 text-sky-200 border border-sky-700">
                Live DB Grounded
              </span>
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">
              Kopargaon Digital Twin & Risk Intelligence Platform
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Real-time spatial hotspot detection, explainable risk scoring, and predictive governance analytics.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/15 shrink-0">
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

      {/* STAGE 6 PREDICTION CARDS (WITH DATA AVAILABILITY & MODEL CONFIDENCE) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-wider text-[#0B2545] dark:text-sky-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Stage 6 Predictive Intelligence Forecasts
          </h3>
          <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-700 dark:text-amber-300 rounded-md text-[10px] font-mono font-bold border border-amber-500/30">
            SIMULATED MODEL ESTIMATE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {aiEngine.predictions.slice(0, 4).map((pred) => (
            <div
              key={pred.id}
              className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-xs space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-base">{pred.icon}</span>
                  <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-[10px] font-mono font-bold">
                    {pred.confidence}% Confidence
                  </span>
                </div>
                <h4 className="font-extrabold text-xs text-slate-900 dark:text-slate-100">{pred.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">{pred.summary}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Data Basis:</span>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate">{pred.basis}</p>
                <span className="inline-block px-1.5 py-0.5 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-[9px] font-bold rounded border border-amber-200 dark:border-amber-900/50">
                  ESTIMATED
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN GRID: EXPLAINABLE RISK INTELLIGENCE & WARD DRILLDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Left 6 Cols: Explainable Ward Risk Hotspot Detector */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-[#0B2545] dark:text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-500" />
                Explainable Spatial Risk Intelligence
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Calculated from complaint volume, SLA breaches & telemetry</p>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded">
              REAL DB DATA
            </span>
          </div>

          <div className="space-y-3 max-h-[420px] overflow-y-auto custom-scrollbar pr-1">
            {wardRiskScores.map((w) => (
              <div
                key={w.ward}
                onClick={() => setSelectedRiskWard(w.ward)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 ${
                  selectedRiskWard === w.ward
                    ? 'border-[#0B2545] bg-[#0B2545]/5 dark:bg-sky-950/40 ring-2 ring-[#0B2545]'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 bg-slate-50/50 dark:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-xs text-[#0B2545] dark:text-sky-300">{w.wardLabel}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${w.riskBadge}`}>
                      {w.riskLevel} RISK ({w.riskScore}/100)
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    {w.open} Open Ticket(s) <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>

                {/* Explainable Rationale ("WHY") */}
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                  <strong className="text-slate-900 dark:text-slate-100">WHY:</strong> {w.rationale}
                </p>

                <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400 pt-0.5">
                  <span>Total: {w.total}</span>
                  <span>SLA Breaches: {w.slaBreaches}</span>
                  <span>Emergency: {w.emergencyCount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 6 Cols: Interactive Risk Area Drilldown Panel */}
        <div className="lg:col-span-6 space-y-6">
          {activeDrilldownWard ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-slate-400">Risk Drilldown View</span>
                  <h3 className="text-base font-black text-[#0B2545] dark:text-white flex items-center gap-2">
                    {activeDrilldownWard.wardLabel} Underlying Incidents
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedRiskWard(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Rationale Banner */}
              <div className="p-3 bg-red-50 dark:bg-red-950/40 rounded-xl border border-red-200 dark:border-red-900/50 text-xs text-red-900 dark:text-red-300 space-y-1">
                <span className="font-bold block">Explainable Risk Rationale:</span>
                <p>{activeDrilldownWard.rationale}</p>
              </div>

              {/* Underlying Tickets List */}
              <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                {activeDrilldownWard.tickets.length > 0 ? (
                  activeDrilldownWard.tickets.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => onSelectComplaint && onSelectComplaint(t)}
                      className="p-3 bg-slate-50 dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 hover:border-[#0B2545] transition-all cursor-pointer"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-mono text-xs font-bold text-[#0B2545] dark:text-sky-400">#{t.id}</span>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{t.category}</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold line-clamp-1">{t.title}</p>
                        <span className="text-[10px] text-slate-400 block mt-0.5">Assigned: {t.assignedOfficer || 'Unassigned'}</span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          t.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {t.status}
                        </span>
                        <Eye className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 text-center py-4">No individual tickets in this ward.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 text-center space-y-3">
              <Map className="w-8 h-8 text-[#0B2545] dark:text-sky-400 mx-auto" />
              <h4 className="font-black text-sm text-slate-900 dark:text-white">Interactive Ward Risk Drilldown</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Click any Ward Risk card on the left to drill down into underlying complaint tickets, explainable risk rationale, and active squad assignments.
              </p>
            </div>
          )}

          {/* Live Activity Feed */}
          <LiveActivityFeed
            feed={intel.activityFeed}
            maxItems={8}
            onComplaintClick={(cmpId) => {
              const complaint = complaints.find(c => c.id === cmpId);
              if (complaint && onSelectComplaint) onSelectComplaint(complaint);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DigitalTwinCommandCenter;
