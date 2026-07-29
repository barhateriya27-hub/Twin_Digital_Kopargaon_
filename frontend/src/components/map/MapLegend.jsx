import React, { useState } from 'react';
import { CITY_ASSET_CATEGORIES } from '../../services/poiService';
import { Layers, ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';

/**
 * MapLegend Component
 * Displays interactive map legend at bottom-right explaining all 23 category icons with counts.
 */
export const MapLegend = ({ pois = [], activeCategories = [], onToggleCategory, onSelectAll, onDeselectAll }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Compute category counts
  const categoryCounts = CITY_ASSET_CATEGORIES.reduce((acc, cat) => {
    acc[cat.id] = pois.filter(p => p.category === cat.id).length;
    return acc;
  }, {});

  return (
    <div className="absolute bottom-4 right-4 z-[1000] max-w-[300px] sm:max-w-[340px] flex flex-col items-end">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-slate-900/90 backdrop-blur-md text-white rounded-xl shadow-xl hover:bg-slate-800 transition-all border border-slate-700/50 font-medium text-xs"
      >
        <Layers className="w-4 h-4 text-emerald-400" />
        <span>GIS Map Legend ({pois.length})</span>
        {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
      </button>

      {/* Legend Drawer Container */}
      {isOpen && (
        <div className="mt-2 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-2xl max-h-[300px] overflow-y-auto custom-scrollbar transition-all">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Icon Legend ({CITY_ASSET_CATEGORIES.length})
            </span>
            <div className="flex gap-2">
              <button
                onClick={onSelectAll}
                className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1"
              >
                <Eye className="w-3 h-3" /> All
              </button>
              <button
                onClick={onDeselectAll}
                className="text-[10px] text-rose-500 dark:text-rose-400 font-bold hover:underline flex items-center gap-1"
              >
                <EyeOff className="w-3 h-3" /> None
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-1.5">
            {CITY_ASSET_CATEGORIES.map((cat) => {
              const isActive = !activeCategories || activeCategories.length === 0 || activeCategories.includes(cat.id);
              const count = categoryCounts[cat.id] || 0;

              return (
                <button
                  key={cat.id}
                  onClick={() => onToggleCategory && onToggleCategory(cat.id)}
                  className={`flex items-center justify-between p-1.5 rounded-lg text-left transition-all ${
                    isActive
                      ? 'bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-white'
                      : 'opacity-40 grayscale hover:opacity-75 text-slate-400 dark:text-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 shadow-sm"
                      style={{ backgroundColor: cat.color }}
                    >
                      {cat.icon}
                    </span>
                    <span className="text-[11px] font-semibold truncate leading-tight">
                      {cat.name}
                    </span>
                  </div>

                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                    count > 0 ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300' : 'text-slate-400'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MapLegend;
