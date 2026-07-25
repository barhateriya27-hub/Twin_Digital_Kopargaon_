import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, Filter, AlertTriangle, ShieldAlert, ArrowRight, CheckCheck, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const NotificationDrawer = ({ isOpen, onClose, userRole = 'officer', onSelectComplaint }) => {
  const { notifications = [], markNotificationRead, markAllNotificationsRead, clearNotifications } = useApp();
  const [filter, setFilter] = useState('all'); // 'all' | 'unread' | 'urgent'

  // Filter notifications for target role
  const userNotifications = notifications.filter(n => {
    if (userRole === 'higher_authority') return n.recipientRole === 'higher_authority' || n.recipientRole === 'officer';
    if (userRole === 'citizen') return n.recipientRole === 'citizen';
    return n.recipientRole === 'officer' || n.recipientRole === 'all';
  });

  const filtered = userNotifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'urgent') return n.priority === 'High' || n.priority === 'Emergency' || n.priority === 'Escalated';
    return true;
  });

  const unreadCount = userNotifications.filter(n => !n.read).length;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-screen max-w-full sm:max-w-md bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#0A2540] dark:bg-sky-950 flex items-center justify-center text-white">
                  <Bell className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    Governance Notifications
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-500 text-white rounded-full">
                        {unreadCount} New
                      </span>
                    )}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Real-time operational alerts & updates
                  </p>
                </div>
              </div>

              <button 
                onClick={onClose}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter controls & Actions */}
            <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 text-xs">
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-md">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-2.5 py-1 rounded font-medium transition-colors ${filter === 'all' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  All ({userNotifications.length})
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-2.5 py-1 rounded font-medium transition-colors ${filter === 'unread' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  Unread ({unreadCount})
                </button>
                <button
                  onClick={() => setFilter('urgent')}
                  className={`px-2.5 py-1 rounded font-medium transition-colors ${filter === 'urgent' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  Urgent
                </button>
              </div>

              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[11px] font-medium text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
                    title="Mark all as read"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Read All
                  </button>
                )}
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 p-2">
              {filtered.length === 0 ? (
                <div className="p-12 text-center text-slate-400 dark:text-slate-500">
                  <Bell className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-xs font-medium">No notifications matching criteria</p>
                </div>
              ) : (
                filtered.map((item) => {
                  const isUrgent = item.priority === 'High' || item.priority === 'Emergency' || item.priority === 'Escalated';
                  return (
                    <div 
                      key={item.id}
                      className={`p-3 rounded-lg transition-colors relative group ${item.read ? 'bg-white dark:bg-slate-900 opacity-80' : 'bg-slate-50/80 dark:bg-slate-800/40 border-l-2 border-sky-500'}`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-1.5">
                          {isUrgent ? (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                              {item.priority}
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                              {item.department || 'Notice'}
                            </span>
                          )}

                          {item.complaintId && (
                            <span className="font-mono text-[10px] text-slate-500 font-bold">
                              #{item.complaintId}
                            </span>
                          )}
                        </div>

                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mb-1">
                        {item.title}
                      </h4>

                      <p className="text-xs text-slate-600 dark:text-slate-300 mb-2 leading-relaxed">
                        {item.description}
                      </p>

                      <div className="flex items-center justify-between pt-1">
                        {!item.read && (
                          <button
                            onClick={() => markNotificationRead(item.id)}
                            className="text-[10px] text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" />
                            Mark read
                          </button>
                        )}

                        {item.complaintId && onSelectComplaint && (
                          <button
                            onClick={() => {
                              markNotificationRead(item.id);
                              onSelectComplaint(item.complaintId);
                              onClose();
                            }}
                            className="ml-auto text-[11px] font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                          >
                            <span>View Ticket</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-center">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                Municipal Governance Audit System Active
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
