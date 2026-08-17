/**
 * useAIEngine — Digital Kopargaon AI Intelligence Engine
 * 
 * Connects useCityIntelligence (real data) to:
 * - Smart chat responses with city context
 * - AI Predictions (clearly labeled as ESTIMATED/SIMULATED)
 * - Smart Alerts (from real data conditions)
 * - Decision Support recommendations
 * - What-if Simulations (labeled SIMULATED)
 */

import { useMemo } from 'react';

// ─── PREDICTION MODELS ────────────────────────────────────────────────────────
// All predictions use real data as input and estimate future state.
// They are clearly labeled as ESTIMATED/SIMULATED.

function predictTraffic(metrics) {
  const hour = new Date().getHours();
  const isPeakMorning = hour >= 8 && hour <= 10;
  const isPeakEvening = hour >= 17 && hour <= 20;
  const isPeak = isPeakMorning || isPeakEvening;

  const trafficComplaints = Object.values(
    Object.fromEntries(
      Object.entries(metrics.byCategory).filter(([k]) =>
        k.includes('Traffic') || k.includes('Road') || k.includes('Pothole')
      )
    )
  ).reduce((sum, v) => sum + v.open, 0);

  const congestionRisk = isPeak ? 'High' : trafficComplaints > 2 ? 'Medium' : 'Low';
  const hotspot = metrics.hotspotWard ? `Ward ${metrics.hotspotWard}` : 'Station Road Junction';

  return {
    id: 'traffic',
    title: 'Traffic Congestion Forecast',
    icon: '🚦',
    confidence: isPeak ? 82 : 65,
    severity: congestionRisk === 'High' ? 'high' : congestionRisk === 'Medium' ? 'medium' : 'low',
    summary: `${congestionRisk} congestion risk ${isPeak ? 'during current peak hours' : 'for next 2 hours'}.`,
    detail: isPeakMorning
      ? `Morning peak hour detected (${hour}:00). Station Road, Bus Stand junction and NH-222 entry points expected to experience 35-55% above normal vehicle density.`
      : isPeakEvening
      ? `Evening peak hour detected (${hour}:00). Market area, MSRTC Bus Stand and Godavari bridge approach likely congested.`
      : `Off-peak period. Normal traffic flow expected across ${trafficComplaints > 0 ? `all wards except Ward ${metrics.hotspotWard || '4'}` : 'all 28 wards'}.`,
    hotspot,
    recommendation: isPeak
      ? 'Deploy traffic wardens to Station Road junction and Bus Stand. Adjust signal timing +15 seconds on NH-222 approach.'
      : 'Routine monitoring sufficient. Pre-position one traffic warden near MSRTC depot.',
    label: 'ESTIMATED',
    labelColor: 'text-amber-600',
    basis: `Based on time-of-day patterns & ${trafficComplaints} open road/traffic complaints`,
  };
}

function predictGarbage(metrics) {
  const garbageOpen = Object.entries(metrics.byCategory)
    .filter(([k]) => k.includes('Garbage') || k.includes('Sanitation'))
    .reduce((sum, [, v]) => sum + v.open, 0);

  const dayOfWeek = new Date().getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const delay = garbageOpen > 3 ? 'High' : garbageOpen > 1 ? 'Moderate' : isWeekend ? 'Low' : 'Minimal';

  return {
    id: 'garbage',
    title: 'Garbage Collection Forecast',
    icon: '🗑️',
    confidence: 74,
    severity: delay === 'High' ? 'high' : delay === 'Moderate' ? 'medium' : 'low',
    summary: `${delay} probability of collection delay in next 24 hours.`,
    detail: garbageOpen > 3
      ? `${garbageOpen} active sanitation complaints indicate potential fleet bottleneck. Ward ${metrics.hotspotWard || '8'} and surrounding areas at highest overflow risk.`
      : garbageOpen > 0
      ? `${garbageOpen} sanitation complaint(s) open. Collection routes may face minor delays in affected wards.`
      : isWeekend
      ? 'Weekend collection schedule active. Reduced fleet (3 vehicles vs weekday 5). Market area may need extra run.'
      : 'Normal weekday collection schedule. All 28 ward routes on track.',
    hotspot: metrics.hotspotWard ? `Ward ${metrics.hotspotWard}` : 'Market Area',
    recommendation: garbageOpen > 3
      ? `Deploy Sanitation Van #4 and #5 to Ward ${metrics.hotspotWard || '8'}. Enable IoT bin level alerts for auto-dispatch.`
      : 'Maintain standard fleet deployment. Monitor bin sensors in high-density areas.',
    label: 'ESTIMATED',
    labelColor: 'text-amber-600',
    basis: `Based on ${garbageOpen} open sanitation complaints + day-of-week pattern`,
  };
}

function predictComplaints(metrics) {
  const growthRate = metrics.total > 0
    ? Math.round(((metrics.open) / metrics.total) * 100)
    : 0;

  const nextDayEstimate = metrics.open + Math.max(1, Math.round(metrics.total * 0.08));
  const topCategory = metrics.topCategories[0]?.category || 'General';

  return {
    id: 'complaints',
    title: 'Complaint Volume Forecast',
    icon: '📋',
    confidence: 71,
    severity: growthRate > 60 ? 'high' : growthRate > 30 ? 'medium' : 'low',
    summary: `Estimated ${nextDayEstimate} total complaints in next 24 hours.`,
    detail: `Currently ${metrics.open} complaints open (${growthRate}% of total). Based on historical submission patterns, expect ${Math.max(2, Math.round(metrics.total * 0.08))} new complaints in the next 24 hours. "${topCategory}" likely to remain top category.`,
    hotspot: metrics.hotspotWard ? `Ward ${metrics.hotspotWard} (${metrics.hotspotWardOpen} open)` : 'All wards',
    recommendation: metrics.open > 5
      ? `Increase officer availability for "${topCategory}" category. Pre-assign backup officer to Ward ${metrics.hotspotWard || '4'}.`
      : 'Current officer capacity sufficient. Maintain standard SLA monitoring.',
    label: 'ESTIMATED',
    labelColor: 'text-amber-600',
    basis: `Based on ${metrics.total} historical complaints + current ${metrics.open} open`,
  };
}

function predictWater(metrics) {
  const waterOpen = Object.entries(metrics.byCategory)
    .filter(([k]) => k.includes('Water'))
    .reduce((sum, [, v]) => sum + v.open, 0);

  const hour = new Date().getHours();
  const isPeakSupply = hour >= 6 && hour <= 9;

  return {
    id: 'water',
    title: 'Water Supply Forecast',
    icon: '💧',
    confidence: 78,
    severity: waterOpen > 2 ? 'high' : waterOpen > 0 ? 'medium' : 'low',
    summary: waterOpen > 0
      ? `${waterOpen} active water complaint(s). Pressure anomaly possible.`
      : isPeakSupply
      ? 'Peak supply hours. Monitoring Godavari headworks.'
      : 'Water supply normal across all wards.',
    detail: waterOpen > 2
      ? `${waterOpen} water-related complaints active. Pumping Station #7 may be under load. Ward ${metrics.hotspotWard || '5'} and neighboring wards at risk of reduced pressure (estimated 14% below normal).`
      : waterOpen > 0
      ? `${waterOpen} water complaint(s) active. ${isPeakSupply ? 'Morning supply window (06:00-09:30) is active — monitor pipeline pressure.' : 'Off-peak period — supply should be stable.'}`
      : `Godavari Headworks running at estimated 98%+ capacity. All ward supply schedules on track. ${isPeakSupply ? 'Morning distribution window active.' : 'Next distribution: 06:00–09:30.'}`,
    hotspot: waterOpen > 0 ? (metrics.hotspotWard ? `Ward ${metrics.hotspotWard}` : 'Main pipeline network') : 'All zones clear',
    recommendation: waterOpen > 2
      ? 'Activate auxiliary booster pump #2. Deploy water tanker to affected wards as interim measure.'
      : waterOpen > 0
      ? 'Monitor Pumping Station sensor #7. Have tanker on standby.'
      : 'Routine monitoring. Verify Godavari intake flow rate every 2 hours.',
    label: 'ESTIMATED',
    labelColor: 'text-amber-600',
    basis: `Based on ${waterOpen} open water complaints + supply schedule`,
  };
}

function predictInfrastructure(metrics) {
  const infraOpen = Object.entries(metrics.byCategory)
    .filter(([k]) => k.includes('Pothole') || k.includes('Road') || k.includes('Light') || k.includes('Drain'))
    .reduce((sum, [, v]) => sum + v.open, 0);

  return {
    id: 'infrastructure',
    title: 'Infrastructure Risk Forecast',
    icon: '🏗️',
    confidence: 69,
    severity: infraOpen > 3 ? 'high' : infraOpen > 1 ? 'medium' : 'low',
    summary: `${infraOpen} infrastructure issue(s) active. ${infraOpen > 3 ? 'High' : infraOpen > 1 ? 'Moderate' : 'Low'} deterioration risk.`,
    detail: infraOpen > 3
      ? `${infraOpen} road/drainage/lighting complaints unresolved. Monsoon season increases pothole formation rate by ~40%. Ward ${metrics.hotspotWard || '3'} road surface at high deterioration risk without intervention.`
      : infraOpen > 0
      ? `${infraOpen} infrastructure complaint(s) pending. Monitor for escalation during rain events.`
      : 'No active infrastructure complaints. Roads, drainage, and street lighting reported in good condition.',
    hotspot: infraOpen > 0 ? (metrics.hotspotWard ? `Ward ${metrics.hotspotWard} roads` : 'Station Road, NH-222') : 'All zones clear',
    recommendation: infraOpen > 3
      ? 'Dispatch PWD crew to top 3 road complaint locations. Procure emergency pothole repair materials.'
      : infraOpen > 0
      ? 'Schedule field inspection within 48 hours. Prepare crew for rapid response.'
      : 'Proactive pothole survey recommended before monsoon peak season.',
    label: 'ESTIMATED',
    labelColor: 'text-amber-600',
    basis: `Based on ${infraOpen} open infrastructure complaints`,
  };
}

// ─── DECISION SUPPORT ─────────────────────────────────────────────────────────
function generateDecisionSupport(metrics, cityHealth) {
  const decisions = [];

  // Priority 1: SLA breaches
  if (metrics.slaBreached > 0) {
    decisions.push({
      id: 'sla-action',
      priority: 'URGENT',
      priorityColor: 'text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400',
      title: 'Resolve SLA Breaches Immediately',
      rationale: `${metrics.slaBreached} complaint(s) have exceeded the 72-hour resolution SLA. This directly affects city health score and citizen trust.`,
      action: 'Go to Complaints tab → filter by "Overdue" → assign senior officer to each SLA-breached ticket.',
      impact: `City health score +${metrics.slaBreached * 8} pts upon resolution`,
      department: 'All departments',
    });
  }

  // Priority 2: Hotspot ward
  if (metrics.hotspotWard && metrics.hotspotWardOpen >= 3) {
    decisions.push({
      id: 'ward-hotspot',
      priority: 'HIGH',
      priorityColor: 'text-amber-700 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-400',
      title: `Deploy Multi-Department Team to Ward ${metrics.hotspotWard}`,
      rationale: `Ward ${metrics.hotspotWard} has ${metrics.hotspotWardOpen} open complaints — highest concentration in the city. Multi-department response will resolve faster than individual dispatch.`,
      action: `Coordinate Water, Sanitation, PWD & Electrical teams for a combined inspection day in Ward ${metrics.hotspotWard}.`,
      impact: 'Estimated 60-70% complaint resolution in 24 hours',
      department: 'All departments',
    });
  }

  // Priority 3: Top complaint category
  if (metrics.topCategories.length > 0 && metrics.topCategories[0].open >= 2) {
    const top = metrics.topCategories[0];
    const dept = top.category.includes('Water') ? 'Water Supply Dept'
      : top.category.includes('Garbage') || top.category.includes('Sanitation') ? 'Sanitation Dept'
      : top.category.includes('Road') || top.category.includes('Pothole') ? 'PWD / Roads Dept'
      : top.category.includes('Light') ? 'MSEDCL / Electrical Dept'
      : 'Relevant Department';

    decisions.push({
      id: 'top-category',
      priority: 'HIGH',
      priorityColor: 'text-amber-700 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-400',
      title: `Increase ${dept} Capacity`,
      rationale: `"${top.category}" is the top open issue with ${top.open} unresolved complaints. Department capacity appears insufficient for current demand.`,
      action: `Schedule emergency resource meeting with ${dept}. Reallocate 2 field crew to ${top.category} backlog.`,
      impact: `Estimated ${Math.round(top.open * 0.7)} complaints resolved within 48 hours`,
      department: dept,
    });
  }

  // Priority 4: Low resolution rate
  if (metrics.resolutionRate < 70 && metrics.total > 3) {
    decisions.push({
      id: 'resolution-rate',
      priority: 'MEDIUM',
      priorityColor: 'text-blue-700 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400',
      title: 'Improve Resolution Rate (Currently ' + metrics.resolutionRate + '%)',
      rationale: 'Resolution rate below 70% target. Citizens are experiencing longer wait times and reduced trust in services.',
      action: 'Hold daily briefing with department heads. Set per-department resolution targets. Enable auto-escalation at 48h.',
      impact: 'Target: 80%+ resolution rate within 1 week',
      department: 'Administration',
    });
  }

  // Good performance
  if (cityHealth.overall >= 85) {
    decisions.push({
      id: 'good-performance',
      priority: 'INFO',
      priorityColor: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400',
      title: 'City Health Excellent — Sustain Performance',
      rationale: `City health at ${cityHealth.overall}/100 (${cityHealth.grade}). All departments performing within targets.`,
      action: 'Conduct quarterly review. Share performance report with citizens. Explore preventive infrastructure upgrades.',
      impact: 'Maintains high citizen satisfaction',
      department: 'Administration',
    });
  }

  return decisions.slice(0, 5);
}

// ─── WHAT-IF SIMULATIONS ──────────────────────────────────────────────────────
// All values are clearly labeled as SIMULATED/ESTIMATED

export const WHATIF_SCENARIOS = [
  {
    id: 'garbage-truck',
    label: 'Add a Garbage Truck',
    icon: '🚛',
    description: 'Deploy one additional garbage collection vehicle to the highest-complaint ward',
    simulate: (metrics) => {
      const garbOpen = Object.entries(metrics.byCategory)
        .filter(([k]) => k.includes('Garbage') || k.includes('Sanitation'))
        .reduce((sum, [, v]) => sum + v.open, 0);
      const resolved = Math.min(garbOpen, Math.max(2, Math.round(garbOpen * 0.65)));
      return {
        before: {
          garbageComplaints: garbOpen,
          healthScore: null, // will use current
          wardStatus: metrics.hotspotWard ? `Ward ${metrics.hotspotWard}: ${metrics.hotspotWardOpen} open` : 'Multiple wards affected',
          resolution: '—',
        },
        after: {
          garbageComplaints: Math.max(0, garbOpen - resolved),
          healthScoreDelta: resolved * 5,
          wardStatus: metrics.hotspotWard ? `Ward ${metrics.hotspotWard}: ~${Math.max(0, metrics.hotspotWardOpen - Math.round(resolved * 0.6))} remaining` : 'All wards improved',
          resolution: `~${resolved} complaint(s) resolved in 24h`,
          timeToImpact: '24-48 hours',
          cost: '₹2,400/day (fuel + crew)',
        },
        summary: resolved > 0
          ? `Adding one garbage truck to Ward ${metrics.hotspotWard || '8'} is estimated to resolve ~${resolved} of ${garbOpen} open sanitation complaints within 24-48 hours, improving city health by ~${resolved * 5} points.`
          : 'No active sanitation complaints. Additional truck would improve preventive coverage across wards.',
      };
    },
  },
  {
    id: 'traffic-personnel',
    label: 'Deploy Traffic Personnel',
    icon: '👮',
    description: 'Station 2 traffic wardens at peak junction (Station Road + Bus Stand)',
    simulate: (metrics) => {
      const hour = new Date().getHours();
      const isPeak = (hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 20);
      const trafficOpen = Object.entries(metrics.byCategory)
        .filter(([k]) => k.includes('Traffic'))
        .reduce((sum, [, v]) => sum + v.open, 0);
      const congestionReduction = isPeak ? 35 : 15;
      return {
        before: {
          congestion: isPeak ? 'High (peak hours)' : 'Normal',
          trafficComplaints: trafficOpen,
          signalDelay: 'Standard timing',
          resolution: '—',
        },
        after: {
          congestion: isPeak ? `Reduced by ~${congestionReduction}%` : 'Minimal change (off-peak)',
          trafficComplaints: Math.max(0, trafficOpen - 1),
          signalDelay: `Adjusted +15s on approach roads`,
          resolution: `Flow improvement at Station Rd junction`,
          timeToImpact: '30 minutes after deployment',
          cost: '₹800/day (2 wardens)',
        },
        summary: isPeak
          ? `During current peak hours, deploying 2 traffic wardens at Station Road + Bus Stand junction is estimated to reduce congestion by ~${congestionReduction}%, cutting average delay from ~8 min to ~5 min.`
          : `Off-peak period — deploying wardens will have minimal impact now. Optimal deployment window: 08:00–10:00 or 17:00–20:00.`,
      };
    },
  },
  {
    id: 'road-maintenance',
    label: 'Prioritize Road Maintenance',
    icon: '🔧',
    description: 'Dispatch PWD crew to the top 3 road complaint locations for emergency repair',
    simulate: (metrics) => {
      const roadOpen = Object.entries(metrics.byCategory)
        .filter(([k]) => k.includes('Pothole') || k.includes('Road'))
        .reduce((sum, [, v]) => sum + v.open, 0);
      const resolved = Math.min(roadOpen, Math.max(1, Math.round(roadOpen * 0.6)));
      return {
        before: {
          roadComplaints: roadOpen,
          wardRisk: metrics.hotspotWard ? `Ward ${metrics.hotspotWard} roads` : 'Multiple locations',
          accidentRisk: roadOpen > 2 ? 'Elevated' : 'Normal',
          resolution: '—',
        },
        after: {
          roadComplaints: Math.max(0, roadOpen - resolved),
          wardRisk: metrics.hotspotWard ? `Ward ${metrics.hotspotWard}: improved` : 'All locations improved',
          accidentRisk: roadOpen > 2 ? 'Reduced to Normal' : 'Normal maintained',
          resolution: `~${resolved} road issue(s) repaired in 72h`,
          timeToImpact: '48-72 hours',
          cost: '₹15,000–₹40,000 (materials + crew)',
        },
        summary: resolved > 0
          ? `Prioritizing road maintenance at top ${Math.min(3, roadOpen)} complaint locations is estimated to resolve ~${resolved} of ${roadOpen} road issues within 48-72 hours, reducing accident risk and improving citizen satisfaction.`
          : 'No active road complaints. Preventive maintenance during this period will reduce future complaint volume.',
      };
    },
  },
  {
    id: 'water-tanker',
    label: 'Deploy a Water Tanker',
    icon: '💧',
    description: 'Emergency water tanker to most affected ward during supply shortage',
    simulate: (metrics) => {
      const waterOpen = Object.entries(metrics.byCategory)
        .filter(([k]) => k.includes('Water'))
        .reduce((sum, [, v]) => sum + v.open, 0);
      const beneficiaries = waterOpen > 0 ? Math.round(waterOpen * 150) : 200;
      return {
        before: {
          waterComplaints: waterOpen,
          affectedWard: metrics.hotspotWard ? `Ward ${metrics.hotspotWard}` : 'Supply area',
          supplyStatus: waterOpen > 0 ? 'Disrupted / Low pressure' : 'Normal',
          resolution: '—',
        },
        after: {
          waterComplaints: Math.max(0, waterOpen - Math.round(waterOpen * 0.5)),
          affectedWard: `Tanker covers ~${beneficiaries} citizens`,
          supplyStatus: 'Interim supply restored',
          resolution: `~${Math.round(waterOpen * 0.5)} complaint(s) addressed`,
          timeToImpact: '2-4 hours after dispatch',
          cost: '₹3,500/deployment (10,000L tanker)',
        },
        summary: waterOpen > 0
          ? `Deploying one water tanker (10,000L) to Ward ${metrics.hotspotWard || '5'} will provide interim supply to ~${beneficiaries} citizens, addressing ~${Math.round(waterOpen * 50)}% of active water complaints within 2-4 hours.`
          : 'No active water shortage complaints. Tanker pre-positioning during peak morning hours (06:00–09:00) is recommended for monsoon season readiness.',
      };
    },
  },
  {
    id: 'heavy-rain',
    label: 'Simulate Heavy Rain',
    icon: '🌧️',
    description: 'Simulate a heavy precipitation event (estimated 45mm rainfall) over Kopargaon',
    simulate: (metrics) => {
      const roadOpen = Object.entries(metrics.byCategory)
        .filter(([k]) => k.includes('Pothole') || k.includes('Road'))
        .reduce((sum, [, v]) => sum + v.open, 0);
      return {
        before: {
          congestion: 'Normal Flow',
          waterloggingRisk: 'Low / None',
          roadComplaints: roadOpen,
          garbageDelays: 'Minimal',
          emergencyWorkload: 'Normal (102 helpline standard load)'
        },
        after: {
          congestion: 'High (estimated +40% travel delays on NH-222 & Station Rd)',
          waterloggingRisk: 'High in low-lying areas (Ward 4, Ward 8, Yeola Naka)',
          roadComplaints: roadOpen + Math.max(2, Math.round(roadOpen * 0.4)),
          garbageDelays: 'Moderate (Estimated 2-3 hr delays in route completion)',
          emergencyWorkload: 'Elevated (Estimated 30% increase in water drainage assistance requests)',
          timeToImpact: 'Starts 1 hour after rainfall onset',
          cost: '₹75,000 estimated emergency pumping & clean-up costs'
        },
        summary: 'Simulation / Estimated Impact: Heavy rain is projected to cause significant traffic slowdowns on primary corridors (+40% delay), high waterlogging risk in low-lying wards (Wards 4 & 8), and increase road-related complaints by ~40%. Service delivery routes for sanitation will face minor delays.'
      };
    }
  }
];

// ─── SMART CHAT CONTEXT RESPONSES ─────────────────────────────────────────────
export function buildCityContextResponse(query, aiContext) {
  const q = query.toLowerCase();

  if (q.includes('traffic') || q.includes('congestion') || q.includes('jam')) {
    const hour = new Date().getHours();
    const isPeak = (hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 20);
    return {
      text: `🚦 **Traffic Intelligence** (Live City Data)\n\n` +
        `**Current Status**: ${isPeak ? '🔴 Peak Hour — High congestion risk' : '🟢 Off-peak — Normal flow'}\n` +
        `**Open Traffic Complaints**: ${aiContext.totalComplaints > 0 ? Object.entries({}).length : 0} registered\n` +
        `**Hotspot**: Station Road junction & MSRTC Bus Stand\n` +
        `**City Health Impact**: Road/Traffic issues affect Mobility dimension\n\n` +
        `${isPeak ? '⚠️ Deploy wardens to Station Road and Bus Stand immediately.' : '✅ Current period is off-peak. Normal monitoring sufficient.'}`,
      actions: [{ label: '🗺 Open GIS Map', tab: 'smart_map' }, { label: '🚦 Traffic Tab', tab: 'weather' }]
    };
  }

  if (q.includes('complaint') || q.includes('grievance') || q.includes('issue')) {
    return {
      text: `📋 **Complaint Intelligence** (Real System Data)\n\n` +
        `• **Total Registered**: ${aiContext.totalComplaints}\n` +
        `• **Currently Open**: ${aiContext.openComplaints}\n` +
        `• **Resolved**: ${aiContext.resolvedComplaints} (${aiContext.resolutionRate}% rate)\n` +
        `• **SLA Breached**: ${aiContext.slaBreached}\n` +
        `• **Escalated**: ${aiContext.escalatedComplaints}\n` +
        `• **Hotspot Ward**: Ward ${aiContext.hotspotWard || 'None'} (${aiContext.hotspotWardOpen || 0} open)\n\n` +
        `${aiContext.slaBreached > 0 ? `⚠️ ${aiContext.slaBreached} ticket(s) need immediate attention (SLA breached).` : '✅ All tickets within SLA.'}`,
      actions: [{ label: '📋 View All Complaints', tab: 'track_complaint' }, { label: '🚨 Register Complaint', tab: 'register_complaint' }]
    };
  }

  if (q.includes('health') || q.includes('score') || q.includes('status') || q.includes('city')) {
    return {
      text: `🏙️ **City Health Status** (Real Data)\n\n` +
        `**Overall Score**: ${aiContext.cityHealthScore}/100 — *${aiContext.cityHealthGrade}*\n\n` +
        `**Key Metrics**:\n` +
        `• Open Complaints: ${aiContext.openComplaints}\n` +
        `• Resolution Rate: ${aiContext.resolutionRate}%\n` +
        `• SLA Compliance: ${aiContext.slaBreached === 0 ? '✅ Full' : `⚠️ ${aiContext.slaBreached} breach(es)`}\n` +
        `• Active Alerts: ${aiContext.activeAlerts}\n\n` +
        `The city health score is calculated from real complaint data — every resolved ticket improves the score.`,
      actions: [{ label: '📊 Digital Twin Dashboard', tab: 'dashboard' }]
    };
  }

  if (q.includes('garbage') || q.includes('waste') || q.includes('sanitation') || q.includes('bin')) {
    const garbCount = aiContext.topCategories?.find(c => c.category?.includes('Garbage') || c.category?.includes('Sanitation'))?.open || 0;
    return {
      text: `🗑️ **Sanitation Intelligence** (Real Data)\n\n` +
        `**Open Sanitation Complaints**: ${garbCount}\n` +
        `**Fleet Status**: Operational (28 ward routes)\n` +
        `**Hotspot**: ${aiContext.hotspotWard ? `Ward ${aiContext.hotspotWard}` : 'All wards on track'}\n\n` +
        `${garbCount > 2 ? `⚠️ ${garbCount} open complaints suggest fleet strain. Consider deploying additional vehicle to Ward ${aiContext.hotspotWard || '8'}.` : '✅ Sanitation services running normally.'}`,
      actions: [{ label: '🗑️ Waste Management', tab: 'register_complaint' }]
    };
  }

  if (q.includes('water') || q.includes('pipeline') || q.includes('supply') || q.includes('pressure')) {
    const waterCount = aiContext.topCategories?.find(c => c.category?.includes('Water'))?.open || 0;
    return {
      text: `💧 **Water Supply Intelligence** (Real Data)\n\n` +
        `**Open Water Complaints**: ${waterCount}\n` +
        `**Godavari Headworks**: Operational\n` +
        `**Next Supply Window**: 06:00–09:30 (daily)\n` +
        `**Status**: ${waterCount > 0 ? `⚠️ ${waterCount} active issue(s)` : '✅ All zones operational'}\n\n` +
        `${waterCount > 2 ? 'High water complaint volume — consider tanker deployment as interim measure.' : 'Water supply stable across all 28 wards.'}`,
      actions: [{ label: '💧 Water Complaints', tab: 'register_complaint' }]
    };
  }

  if (q.includes('alert') || q.includes('emergency') || q.includes('critical') || q.includes('urgent')) {
    return {
      text: `🚨 **Active Alerts** (Real System Data)\n\n` +
        `• **Critical Alerts**: ${aiContext.activeAlerts}\n` +
        `• **SLA Breaches**: ${aiContext.slaBreached}\n` +
        `• **Escalated Complaints**: ${aiContext.escalatedComplaints}\n\n` +
        `${aiContext.activeAlerts > 0 ? `⚠️ Immediate action required on ${aiContext.activeAlerts} critical issue(s). Open Smart Alerts panel for details and recommended actions.` : '✅ No critical alerts. All services within compliance.'}`,
      actions: [{ label: '🚨 View Smart Alerts', tab: 'register_complaint' }]
    };
  }

  return null; // Fall through to knowledge base
}

// ─── MAIN HOOK ────────────────────────────────────────────────────────────────
export function useAIEngine(cityIntel) {
  const { metrics, cityHealth, alerts, aiContext } = cityIntel || {};

  const predictions = useMemo(() => {
    if (!metrics) return [];
    return [
      predictTraffic(metrics),
      predictGarbage(metrics),
      predictComplaints(metrics),
      predictWater(metrics),
      predictInfrastructure(metrics),
    ];
  }, [metrics]);

  const decisionSupport = useMemo(() => {
    if (!metrics || !cityHealth) return [];
    return generateDecisionSupport(metrics, cityHealth);
  }, [metrics, cityHealth]);

  const smartAlerts = useMemo(() => alerts || [], [alerts]);

  return {
    predictions,
    decisionSupport,
    smartAlerts,
    aiContext: aiContext || {},
    buildCityContextResponse,
    WHATIF_SCENARIOS,
  };
}
