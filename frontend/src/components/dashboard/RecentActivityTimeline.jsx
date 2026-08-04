import React from 'react';
import { 
  PlusCircle, 
  UserCheck, 
  CheckCircle2, 
  RefreshCw, 
  Receipt, 
  Clock,
  ShieldCheck,
  AlertTriangle,
  Megaphone
} from 'lucide-react';
import { formatRelativeTime } from '../../hooks/useCityIntelligence';
import { useApp } from '../../context/AppContext';

const ACTION_STYLES = {
  'Complaint Registered': { icon: PlusCircle, color: 'bg-blue-100 text-blue-700 ring-white' },
  'Complaint Submitted': { icon: PlusCircle, color: 'bg-blue-100 text-blue-700 ring-white' },
  'Officer Assigned': { icon: UserCheck, color: 'bg-amber-100 text-amber-700 ring-white' },
  'Status Updated to Resolved': { icon: CheckCircle2, color: 'bg-emerald-100 text-emerald-700 ring-white' },
  'Status Updated to Completed': { icon: CheckCircle2, color: 'bg-emerald-100 text-emerald-700 ring-white' },
  'Complaint Closed': { icon: CheckCircle2, color: 'bg-emerald-100 text-emerald-700 ring-white' },
  'SLA Auto-Escalation': { icon: AlertTriangle, color: 'bg-red-100 text-red-700 ring-white' },
  'Notice Published': { icon: Megaphone, color: 'bg-amber-100 text-amber-700 ring-white' },
};

const defaultStyle = { icon: RefreshCw, color: 'bg-slate-100 text-slate-600 ring-white' };

/**
 * RecentActivityTimeline — derives real events from complaint timelines and announcements.
 * Shows actual system history, not hardcoded entries.
 */
export const RecentActivityTimeline = ({ maxItems = 4 }) => {
  const { complaints = [], announcements = [] } = useApp();

  // Build events from real complaint timelines
  const events = [];

  complaints.forEach(complaint => {
    if (Array.isArray(complaint.timeline)) {
      complaint.timeline.forEach(event => {
        events.push({
          id: `${complaint.id}-${event.id}`,
          title: event.action,
          time: formatRelativeTime(event.timestamp),
          timestamp: event.timestamp,
          category: `${complaint.category || 'Complaint'} (${complaint.id})`,
          description: event.note || `${complaint.title} — Ward ${complaint.ward}`,
          actor: event.actor?.name || 'System',
          actionKey: event.action,
        });
      });
    }
  });

  // Also include announcements
  announcements.forEach(ann => {
    events.push({
      id: `ann-${ann.id}`,
      title: 'Notice Published',
      time: formatRelativeTime(ann.publishDate),
      timestamp: ann.publishDate,
      category: ann.category || 'Announcement',
      description: ann.title,
      actor: ann.publishedBy || 'Municipality',
      actionKey: 'Notice Published',
    });
  });

  // Sort newest first
  const sorted = events
    .filter(e => e.timestamp)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, maxItems);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
        <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
          Recent Activity Timeline
        </h3>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Real Municipal Dispatch Log</span>
      </div>

      {sorted.length === 0 ? (
        <div className="py-6 text-center">
          <Clock className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            No recent activity. Events will appear as complaints are submitted or updated.
          </p>
        </div>
      ) : (
        <div className="relative pl-6 space-y-5 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
          {sorted.map((item) => {
            const style = ACTION_STYLES[item.actionKey] || defaultStyle;
            const Icon = style.icon;
            return (
              <div key={item.id} className="relative group">
                <div className={`absolute -left-6 top-0.5 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ring-4 ring-white dark:ring-slate-800 ${style.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-slate-900 dark:text-white">{item.title}</span>
                    <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 font-semibold">{item.time}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500">
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300 uppercase">{item.category}</span>
                    <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold">
                      <ShieldCheck className="w-3 h-3" /> {item.actor}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
