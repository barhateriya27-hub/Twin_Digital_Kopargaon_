/**
 * useCityIntelligence — Digital Kopargaon
 * Central intelligence hook that derives ALL KPIs, health scores,
 * activity feeds, and alerts from REAL application data.
 * Zero fake values. Everything is computed from the actual system state.
 */

import { useMemo } from 'react';

// Category → service dimension mapping
const CATEGORY_TO_DIMENSION = {
  'Water Supply': 'utilities',
  'Water Leakage': 'utilities',
  'Pothole': 'infrastructure',
  'Road Damage': 'infrastructure',
  'Garbage': 'cleanliness',
  'Sanitation': 'cleanliness',
  'Streetlight Maintenance': 'infrastructure',
  'Street Light': 'infrastructure',
  'Traffic': 'mobility',
  'Drainage': 'utilities',
  'Public Health': 'citizenServices',
  'Emergency': 'safety',
  'Fire': 'safety',
  'Law & Order': 'safety',
};

const CATEGORY_TO_ICON = {
  'Water Supply': '💧',
  'Water Leakage': '💧',
  'Pothole': '🚧',
  'Road Damage': '🚧',
  'Garbage': '🗑️',
  'Sanitation': '🗑️',
  'Streetlight Maintenance': '💡',
  'Street Light': '💡',
  'Traffic': '🚦',
  'Drainage': '🌊',
  'Public Health': '🏥',
  'Emergency': '🚨',
  'Fire': '🔥',
  'Law & Order': '👮',
};

const STATUS_COLORS = {
  Pending: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-800 dark:text-amber-300', dot: 'bg-amber-500' },
  'In Progress': { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-800 dark:text-blue-300', dot: 'bg-blue-500' },
  Resolved: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-800 dark:text-emerald-300', dot: 'bg-emerald-500' },
  Completed: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-800 dark:text-emerald-300', dot: 'bg-emerald-500' },
  Escalated: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-800 dark:text-red-300', dot: 'bg-red-500' },
};

/**
 * Format a relative time string from an ISO timestamp
 */
export function formatRelativeTime(isoString) {
  if (!isoString) return 'Unknown time';
  const now = Date.now();
  const then = new Date(isoString).getTime();
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

/**
 * Main hook — accepts complaints, notifications, announcements, auditLogs from AppContext
 */
export function useCityIntelligence({ complaints = [], notifications = [], announcements = [], auditLogs = [] }) {

  // ─── CORE COMPLAINT METRICS ───────────────────────────────────────────────
  const metrics = useMemo(() => {
    const total = complaints.length;
    const pending = complaints.filter(c => c.status === 'Pending').length;
    const inProgress = complaints.filter(c => c.status === 'In Progress').length;
    const resolved = complaints.filter(c => c.status === 'Completed' || c.status === 'Resolved').length;
    const escalated = complaints.filter(c => c.isEscalated || c.status === 'Escalated').length;
    const open = pending + inProgress;
    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 100;

    // SLA breach check
    const now = new Date();
    const slaBreached = complaints.filter(c => {
      if (c.status === 'Completed' || c.status === 'Resolved') return false;
      const due = new Date(c.dueDate);
      return now > due;
    }).length;

    // Unread officer notifications
    const unreadAlerts = notifications.filter(n => !n.read && (n.recipientRole === 'officer' || n.recipientRole === 'higher_authority')).length;

    // By ward
    const byWard = {};
    complaints.forEach(c => {
      const ward = c.ward || 'Unknown';
      if (!byWard[ward]) byWard[ward] = { total: 0, open: 0, resolved: 0 };
      byWard[ward].total++;
      if (c.status === 'Completed' || c.status === 'Resolved') byWard[ward].resolved++;
      else byWard[ward].open++;
    });

    // By category
    const byCategory = {};
    complaints.forEach(c => {
      const cat = c.category || 'Other';
      if (!byCategory[cat]) byCategory[cat] = { total: 0, open: 0, resolved: 0 };
      byCategory[cat].total++;
      if (c.status === 'Completed' || c.status === 'Resolved') byCategory[cat].resolved++;
      else byCategory[cat].open++;
    });

    // Ward with most open complaints
    let hotspotWard = null;
    let maxOpen = 0;
    Object.entries(byWard).forEach(([ward, data]) => {
      if (data.open > maxOpen) {
        maxOpen = data.open;
        hotspotWard = ward;
      }
    });

    // Top complaint categories (by open count)
    const topCategories = Object.entries(byCategory)
      .sort((a, b) => b[1].open - a[1].open)
      .slice(0, 5)
      .map(([cat, data]) => ({ category: cat, ...data, icon: CATEGORY_TO_ICON[cat] || '📋' }));

    return {
      total, pending, inProgress, resolved, escalated, open,
      resolutionRate, slaBreached, unreadAlerts,
      byWard, byCategory, hotspotWard, hotspotWardOpen: maxOpen,
      topCategories,
    };
  }, [complaints, notifications]);

  // ─── CITY HEALTH SCORE ────────────────────────────────────────────────────
  // Computed purely from real data. 100 = no issues. Each open complaint penalizes.
  const cityHealth = useMemo(() => {
    const total = complaints.length;
    const open = metrics.open;
    const escalated = metrics.escalated;
    const slaBreached = metrics.slaBreached;

    // Compute per-dimension scores based on open complaints in that dimension
    const dimensionOpenCounts = { mobility: 0, cleanliness: 0, infrastructure: 0, utilities: 0, citizenServices: 0, safety: 0 };
    complaints.forEach(c => {
      if (c.status === 'Completed' || c.status === 'Resolved') return;
      const dim = CATEGORY_TO_DIMENSION[c.category] || 'citizenServices';
      dimensionOpenCounts[dim]++;
    });

    // Penalty: each open complaint costs points. Escalated costs more.
    const penaltyPerOpen = 5;
    const penaltyPerEscalated = 10;
    const penaltyPerSLA = 8;

    const penalty = (open * penaltyPerOpen) + (escalated * penaltyPerEscalated) + (slaBreached * penaltyPerSLA);
    const overall = Math.max(0, Math.min(100, 100 - penalty));

    const dimensionScores = {
      mobility: Math.max(0, 100 - dimensionOpenCounts.mobility * penaltyPerOpen),
      cleanliness: Math.max(0, 100 - dimensionOpenCounts.cleanliness * penaltyPerOpen),
      infrastructure: Math.max(0, 100 - dimensionOpenCounts.infrastructure * penaltyPerOpen),
      utilities: Math.max(0, 100 - dimensionOpenCounts.utilities * penaltyPerOpen),
      citizenServices: Math.max(0, 100 - dimensionOpenCounts.citizenServices * penaltyPerOpen),
      safety: Math.max(0, 100 - dimensionOpenCounts.safety * penaltyPerOpen),
    };

    let grade = 'Excellent';
    let gradeColor = 'text-emerald-600 dark:text-emerald-400';
    if (overall < 40) { grade = 'Critical'; gradeColor = 'text-red-600 dark:text-red-400'; }
    else if (overall < 60) { grade = 'Poor'; gradeColor = 'text-orange-600 dark:text-orange-400'; }
    else if (overall < 75) { grade = 'Fair'; gradeColor = 'text-amber-600 dark:text-amber-400'; }
    else if (overall < 90) { grade = 'Good'; gradeColor = 'text-blue-600 dark:text-blue-400'; }

    return { overall, grade, gradeColor, dimensionScores };
  }, [complaints, metrics]);

  // ─── LIVE ACTIVITY FEED ───────────────────────────────────────────────────
  // Built from real complaint timeline events + audit logs + announcements
  const activityFeed = useMemo(() => {
    const events = [];

    // Complaint timeline events (most recent first)
    complaints.forEach(complaint => {
      if (Array.isArray(complaint.timeline)) {
        complaint.timeline.forEach(event => {
          events.push({
            id: `${complaint.id}-${event.id}`,
            title: event.action,
            description: event.note || `Complaint ${complaint.id} — ${complaint.title}`,
            category: complaint.category || 'General',
            ward: complaint.ward,
            timestamp: event.timestamp,
            actor: event.actor?.name || 'System',
            type: event.status === 'Escalated' ? 'critical' : event.status === 'Resolved' || event.status === 'Completed' ? 'success' : 'info',
            icon: CATEGORY_TO_ICON[complaint.category] || '📋',
            complaintId: complaint.id,
          });
        });
      }
    });

    // Announcements as events
    announcements.forEach(ann => {
      events.push({
        id: `ann-${ann.id}`,
        title: 'Notice Published',
        description: ann.title,
        category: ann.category || 'Announcement',
        timestamp: ann.publishDate,
        actor: ann.publishedBy || 'Municipality',
        type: ann.priority === 'High' ? 'warning' : 'info',
        icon: '📢',
      });
    });

    // Sort by most recent and take top 20
    return events
      .filter(e => e.timestamp)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 20);
  }, [complaints, announcements]);

  // ─── SMART ALERTS ─────────────────────────────────────────────────────────
  // Generated from real conditions
  const alerts = useMemo(() => {
    const result = [];
    const now = new Date();

    // SLA breached complaints → Critical alert
    complaints.forEach(c => {
      if (c.status === 'Completed' || c.status === 'Resolved') return;
      const due = c.dueDate ? new Date(c.dueDate) : null;
      if (due && now > due) {
        result.push({
          id: `sla-${c.id}`,
          severity: 'critical',
          title: `SLA Breached: ${c.id}`,
          description: `${c.title} (Ward ${c.ward}) has exceeded the 72-hour resolution SLA.`,
          location: `Ward ${c.ward}`,
          department: c.department,
          timestamp: c.dueDate,
          action: `Assign officer immediately or escalate to Higher Authority.`,
          category: c.category,
        });
      }
    });

    // Escalated complaints → Critical
    complaints.filter(c => c.isEscalated || c.status === 'Escalated').forEach(c => {
      if (!result.find(r => r.id === `sla-${c.id}`)) {
        result.push({
          id: `esc-${c.id}`,
          severity: 'critical',
          title: `Escalated Complaint: ${c.id}`,
          description: `${c.title} in Ward ${c.ward} has been escalated to Higher Authority.`,
          location: `Ward ${c.ward}`,
          department: c.department,
          timestamp: c.createdAt,
          action: `Review and assign senior officer for resolution.`,
          category: c.category,
        });
      }
    });

    // Multiple complaints in same ward → Warning
    Object.entries(metrics.byWard).forEach(([ward, data]) => {
      if (data.open >= 3) {
        result.push({
          id: `ward-${ward}`,
          severity: 'warning',
          title: `High Complaint Density: Ward ${ward}`,
          description: `Ward ${ward} has ${data.open} open complaints requiring attention.`,
          location: `Ward ${ward}`,
          department: 'Multiple Departments',
          timestamp: new Date().toISOString(),
          action: `Conduct field inspection and prioritize dispatch to Ward ${ward}.`,
          category: 'Multiple',
        });
      }
    });

    // High-priority pending complaints → Warning
    complaints
      .filter(c => c.priority === 'High' && c.status === 'Pending')
      .forEach(c => {
        result.push({
          id: `hp-${c.id}`,
          severity: 'warning',
          title: `High Priority Unassigned: ${c.id}`,
          description: `${c.title} (${c.category}) in Ward ${c.ward} is high priority but not yet assigned.`,
          location: `Ward ${c.ward}`,
          department: c.department,
          timestamp: c.createdAt,
          action: `Assign officer from ${c.department} immediately.`,
          category: c.category,
        });
      });

    // Unread high-priority notifications → Info
    notifications
      .filter(n => !n.read && n.priority === 'High')
      .slice(0, 3)
      .forEach(n => {
        result.push({
          id: `notif-${n.id}`,
          severity: 'info',
          title: n.title,
          description: n.description,
          location: 'System Notification',
          department: n.department,
          timestamp: n.timestamp,
          action: 'Review and acknowledge notification.',
          category: 'Notification',
        });
      });

    // Sort: critical first, then warning, then info
    const order = { critical: 0, warning: 1, info: 2 };
    return result.sort((a, b) => order[a.severity] - order[b.severity]).slice(0, 15);
  }, [complaints, notifications, metrics.byWard]);

  // ─── MAP MARKERS from real complaints ─────────────────────────────────────
  const mapMarkers = useMemo(() => {
    return complaints
      .filter(c => c.latitude && c.longitude)
      .map(c => ({
        id: c.id,
        lat: c.latitude,
        lng: c.longitude,
        title: c.title,
        category: c.category,
        status: c.status,
        ward: c.ward,
        priority: c.priority,
        isEscalated: c.isEscalated,
        icon: CATEGORY_TO_ICON[c.category] || '📋',
        statusColors: STATUS_COLORS[c.status] || STATUS_COLORS['Pending'],
        description: c.description,
        address: c.address,
        submittedBy: c.submittedBy,
        createdAt: c.createdAt,
        department: c.department,
      }));
  }, [complaints]);

  // ─── AI-READY CONTEXT SUMMARY ─────────────────────────────────────────────
  // Used by AI assistant to answer data-aware questions
  const aiContext = useMemo(() => {
    const sortedByOpen = Object.entries(metrics.byWard)
      .sort((a, b) => b[1].open - a[1].open);

    return {
      totalComplaints: metrics.total,
      openComplaints: metrics.open,
      resolvedComplaints: metrics.resolved,
      escalatedComplaints: metrics.escalated,
      slaBreached: metrics.slaBreached,
      resolutionRate: metrics.resolutionRate,
      cityHealthScore: cityHealth.overall,
      cityHealthGrade: cityHealth.grade,
      hotspotWard: metrics.hotspotWard,
      hotspotWardOpen: metrics.hotspotWardOpen,
      topCategories: metrics.topCategories,
      wardsSorted: sortedByOpen.map(([ward, data]) => ({ ward, ...data })),
      activeAlerts: alerts.filter(a => a.severity === 'critical').length,
      totalAlerts: alerts.length,
      announcementCount: announcements.length,
    };
  }, [metrics, cityHealth, alerts, announcements]);

  return {
    metrics,
    cityHealth,
    activityFeed,
    alerts,
    mapMarkers,
    aiContext,
    formatRelativeTime,
    STATUS_COLORS,
    CATEGORY_TO_ICON,
  };
}
