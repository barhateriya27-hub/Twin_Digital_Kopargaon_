import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone, Plus, Calendar, AlertTriangle, CheckCircle2, ShieldAlert, Archive, Edit, Trash2, Eye, Filter, Send } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AnnouncementManager = () => {
  const { announcements = [], addAnnouncement, updateAnnouncement, archiveAnnouncement, showToast } = useApp();

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filterCategory, setFilterCategory] = useState('All');

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Water Supply Shutdown');
  const [priority, setPriority] = useState('Normal');
  const [targetWards, setTargetWards] = useState('All'); // 'All' or comma separated e.g. '1, 2, 4'
  const [expiryDays, setExpiryDays] = useState('3');

  const categories = [
    'Water Supply Shutdown',
    'Road Closure',
    'Garbage Collection Schedule',
    'Health Advisory',
    'Emergency Notice',
    'Festival Arrangements',
    'Weather Warning',
    'Infrastructure Work',
    'Public Meeting'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      showToast('Title and description are required', 'warning');
      return;
    }

    let wardsArray = [1, 2, 3, 4, 5, 6, 7, 8];
    if (targetWards !== 'All') {
      wardsArray = targetWards.split(',').map(w => parseInt(w.trim())).filter(n => !isNaN(n));
      if (wardsArray.length === 0) wardsArray = [1, 2, 3, 4, 5, 6, 7, 8];
    }

    const expDate = new Date(Date.now() + parseInt(expiryDays) * 24 * 3600 * 1000).toISOString();

    if (editingId) {
      updateAnnouncement(editingId, {
        title,
        description,
        category,
        priority,
        targetWards: wardsArray,
        expiryDate: expDate
      });
      showToast('Announcement updated successfully!');
    } else {
      addAnnouncement({
        title,
        description,
        category,
        priority,
        targetWards: wardsArray,
        publishedBy: 'Municipal Administration',
        expiryDate: expDate
      });
      showToast('Public Announcement published & distributed to citizens!');
    }

    // Reset Form
    setTitle('');
    setDescription('');
    setIsCreating(false);
    setEditingId(null);
  };

  const handleEditClick = (ann) => {
    setTitle(ann.title);
    setDescription(ann.description);
    setCategory(ann.category);
    setPriority(ann.priority);
    setTargetWards(ann.targetWards?.length === 8 ? 'All' : ann.targetWards?.join(', '));
    setEditingId(ann.id);
    setIsCreating(true);
  };

  const filteredAnnouncements = announcements.filter(a => {
    if (filterCategory === 'All') return true;
    return a.category === filterCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#0A2540] dark:bg-sky-950 text-amber-400 flex items-center justify-center font-bold">
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              Public Announcement Management
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Broadcast municipal advisories, road closures, water shutdowns, and emergency alerts
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setEditingId(null);
            setTitle('');
            setDescription('');
            setIsCreating(!isCreating);
          }}
          className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-lg shadow-md transition-colors flex items-center gap-2 shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{isCreating ? 'Close Form' : 'Publish New Announcement'}</span>
        </button>
      </div>

      {/* Creation / Edit Form Modal/Card */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Send className="w-4 h-4 text-sky-500" />
                <span>{editingId ? 'Edit Announcement' : 'Compose Public Announcement'}</span>
              </h3>
              <button
                onClick={() => setIsCreating(false)}
                className="text-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Announcement Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Scheduled Water Supply Shutdown - Ward 2 & Ward 4"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Advisory Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detail the timings, affected locations, alternative routes, safety instructions, or contact helplines..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Priority Level
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                  >
                    <option value="Normal">Normal (Standard Bulletin)</option>
                    <option value="High">High (High Priority Notice)</option>
                    <option value="Urgent/Emergency">Urgent/Emergency (Dashboard Red Banner)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target Wards
                  </label>
                  <input
                    type="text"
                    value={targetWards}
                    onChange={(e) => setTargetWards(e.target.value)}
                    placeholder="'All' or comma separated e.g. 1, 2, 4"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Expiry Duration
                  </label>
                  <select
                    value={expiryDays}
                    onChange={(e) => setExpiryDays(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="1">1 Day</option>
                    <option value="3">3 Days</option>
                    <option value="7">7 Days</option>
                    <option value="30">30 Days</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-lg shadow-md transition-colors flex items-center gap-2"
                >
                  <Megaphone className="w-4 h-4" />
                  <span>{editingId ? 'Update Announcement' : 'Publish Announcement Now'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setFilterCategory('All')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors ${filterCategory === 'All' ? 'bg-[#0A2540] text-white dark:bg-sky-600' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'}`}
        >
          All Announcements ({announcements.length})
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors ${filterCategory === cat ? 'bg-[#0A2540] text-white dark:bg-sky-600' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Announcements List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAnnouncements.length === 0 ? (
          <div className="md:col-span-2 p-12 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400">
            <Megaphone className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-xs font-medium">No published announcements in this category</p>
          </div>
        ) : (
          filteredAnnouncements.map((item) => {
            const isUrgent = item.priority === 'Urgent/Emergency';
            const isHigh = item.priority === 'High';
            const isArchived = item.status === 'Archived';

            return (
              <div
                key={item.id}
                className={`bg-white dark:bg-slate-900 p-5 rounded-xl border transition-all relative flex flex-col justify-between ${isUrgent ? 'border-rose-300 dark:border-rose-900/60 shadow-rose-500/5 shadow-md' : 'border-slate-200 dark:border-slate-800'} ${isArchived ? 'opacity-60' : ''}`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${isUrgent ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-300' : isHigh ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
                        {item.priority}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                        {item.category}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono text-slate-400">
                      {new Date(item.publishDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    Wards: <span className="font-semibold text-slate-700 dark:text-slate-300">{item.targetWards?.length === 8 ? 'All Wards' : item.targetWards?.join(', ')}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditClick(item)}
                      className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-slate-800 rounded transition-colors"
                      title="Edit Notice"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    {!isArchived && (
                      <button
                        onClick={() => {
                          archiveAnnouncement(item.id);
                          showToast(`Announcement ${item.id} moved to archive`);
                        }}
                        className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-slate-800 rounded transition-colors"
                        title="Archive Notice"
                      >
                        <Archive className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
