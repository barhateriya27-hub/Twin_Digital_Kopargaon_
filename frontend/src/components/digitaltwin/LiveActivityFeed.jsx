import React from 'react';
import { Activity, CheckCircle2, Clock, AlertTriangle, Megaphone, ChevronRight, ShieldCheck } from 'lucide-react';
import { formatRelativeTime } from '../../hooks/useCityIntelligence';

const TYPE_STYLES = {
  critical: {
    bg: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700',
    dot: 'bg-red-500',
    icon: AlertTriangle,
    iconColor: 'text-red-500',
    label: 'Critical',
    labelColor: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300',
  },
  warning: {
    bg: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700',
    dot: 'bg-amber-500',
    icon: Clock,
    iconColor: 'text-amber-500',
    label: 'Warning',
    labelColor: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
  },
  success: {
    bg: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700',
    dot: 'bg-emerald-500',
    icon: CheckCircle2,
    iconColor: 'text-emerald-500',
    label: 'Resolved',
    labelColor: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300',
  },
  info: {
    bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700',
    dot: 'bg-blue-500',
    icon: Activity,
    iconColor: 'text-blue-500',
    label: 'Update',
    labelColor: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
  },
};

/**
 * LiveActivityFeed — real events from complaint timelines, audit logs, announcements
 */
export const LiveActivityFeed = ({ feed = [], maxItems = 10, onComplaintClick }) => {
  const displayFeed = feed.slice(0, maxItems);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
            Live Activity Feed
          </h3>
        </div>
        <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded-full text-[10px] font-extrabold uppercase">
          Real Events
        </span>
      </div>

      {/* Feed Items */}
      {displayFeed.length === 0 ? (
        <div className="py-8 text-center">
          <Activity className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
          <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">
            No activity yet. Events will appear as complaints are submitted or updated.
          </p>
        </div>
      ) : (
        <div className="relative pl-5 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-slate-200 dark:before:bg-slate-700">
          {displayFeed.map((event, idx) => {
            const style = TYPE_STYLES[event.type] || TYPE_STYLES.info;
            const Icon = style.icon;

            return (
              <div key={event.id || idx} className="relative group">
                {/* Timeline Node */}
                <div className={`absolute -left-5 top-1 w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-800 ${style.dot}`}>
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>

                <div
                  className={`p-3 rounded-xl border transition-all ${style.bg} ${
                    event.complaintId && onComplaintClick ? 'cursor-pointer hover:shadow-sm' : ''
                  }`}
                  onClick={() => event.complaintId && onComplaintClick && onComplaintClick(event.complaintId)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                      <span className="text-sm">{event.icon || '📋'}</span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {event.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${style.labelColor}`}>
                        {style.label}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 whitespace-nowrap">
                        {formatRelativeTime(event.timestamp)}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">
                    {event.description}
                  </p>

                  <div className="flex items-center justify-between mt-1.5 text-[10px]">
                    <span className="font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">
                      {event.category || 'General'}{event.ward ? ` • Ward ${event.ward}` : ''}
                    </span>
                    <span className="flex items-center gap-0.5 text-slate-400 dark:text-slate-500">
                      <ShieldCheck className="w-2.5 h-2.5" />
                      {event.actor}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono text-center pt-1 border-t border-slate-100 dark:border-slate-700">
        Showing {displayFeed.length} most recent system events • All times in IST
      </p>
    </div>
  );
};
