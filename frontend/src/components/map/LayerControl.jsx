import React, { useState } from 'react';
import { CITY_ASSET_CATEGORIES, CATEGORY_GROUPS } from '../../services/poiService';
import { SlidersHorizontal, Search, X, Eye, EyeOff } from 'lucide-react';

/**
 * LayerControl Component
 * Interactive layer toggle panel for Smart City Command Center GIS map.
 */
export const LayerControl = ({ activeCategories, onToggleCategory, onSelectAll, onDeselectAll, onSelectGroup }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('All');

  const filteredCategories = CITY_ASSET_CATEGORIES.filter(cat => {
    const matchesGroup = selectedGroup === 'All' || cat.group === selectedGroup;
    const matchesSearch = !searchQuery || cat.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGroup && matchesSearch;
  });

  return (
    <div className="absolute top-4 right-4 z-[1000]">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3.5 py-2 bg-slate-900/90 backdrop-blur-md text-white rounded-xl shadow-xl hover:bg-slate-800 transition-all border border-slate-700/50 text-xs font-semibold"
      >
        <SlidersHorizontal className="w-4 h-4 text-sky-400" />
        <span className="hidden sm:inline">Layer Controls</span>
        {activeCategories && activeCategories.length < CITY_ASSET_CATEGORIES.length && (
          <span className="bg-sky-500 text-white font-bold text-[10px] px-1.5 py-0.5 rounded-full">
            {activeCategories.length}/{CITY_ASSET_CATEGORIES.length}
          </span>
        )}
      </button>

      {/* Control Drawer Overlay */}
      {isOpen && (
        <div className="mt-2 w-[280px] sm:w-[320px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-2xl transition-all">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-sky-500" /> GIS Layer Controls
            </h4>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-2.5">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search GIS layers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 dark:text-white"
            />
          </div>

          {/* Group Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-2 custom-scrollbar text-[10px]">
            {CATEGORY_GROUPS.map(group => (
              <button
                key={group}
                onClick={() => {
                  setSelectedGroup(group);
                  if (onSelectGroup) onSelectGroup(group);
                }}
                className={`px-2 py-1 rounded-lg font-medium whitespace-nowrap transition-all ${
                  selectedGroup === group
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {group}
              </button>
            ))}
          </div>

          {/* Quick Enable/Disable */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800/60 text-[11px]">
            <button
              onClick={onSelectAll}
              className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1"
            >
              <Eye className="w-3 h-3" /> Enable All
            </button>
            <button
              onClick={onDeselectAll}
              className="text-rose-500 dark:text-rose-400 font-bold hover:underline flex items-center gap-1"
            >
              <EyeOff className="w-3 h-3" /> Disable All
            </button>
          </div>

          {/* Layer List */}
          <div className="max-h-[220px] overflow-y-auto custom-scrollbar space-y-1">
            {filteredCategories.map(cat => {
              const isChecked = !activeCategories || activeCategories.includes(cat.id);

              return (
                <label
                  key={cat.id}
                  className={`flex items-center justify-between p-1.5 rounded-lg cursor-pointer transition-all text-xs ${
                    isChecked
                      ? 'bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white font-medium'
                      : 'opacity-50 text-slate-400 hover:opacity-80'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] text-white shrink-0 shadow-sm"
                      style={{ backgroundColor: cat.color }}
                    >
                      {cat.icon}
                    </span>
                    <span>{cat.name}</span>
                  </div>

                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onToggleCategory(cat.id)}
                    className="w-3.5 h-3.5 accent-sky-600 rounded cursor-pointer"
                  />
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default LayerControl;
