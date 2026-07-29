import React from 'react';
import { useTranslation } from 'react-i18next';
import { SERVICE_CATEGORIES } from '../../services/poiService';
import { Sparkles, Layers } from 'lucide-react';

export const QuickServiceCategories = ({ selectedCategory, setSelectedCategory }) => {
  const { t } = useTranslation();

  const categoryTranslationMap = {
    'Hospitals': t('poiCategories.hospitals', 'Hospitals'),
    'Schools': t('poiCategories.schools', 'Schools'),
    'Colleges': t('poiCategories.colleges', 'Colleges'),
    'Railway Station': t('poiCategories.railway', 'Railway Station'),
    'Bus Stops': t('poiCategories.busStops', 'Bus Stops'),
    'Police Stations': t('poiCategories.police', 'Police Stations'),
    'Fire Stations': t('poiCategories.fireStation', 'Fire Stations'),
    'Pharmacies': t('poiCategories.pharmacies', 'Pharmacies'),
    'Banks': t('poiCategories.banks', 'Banks'),
    'ATMs': t('poiCategories.atms', 'ATMs'),
    'Petrol Pumps': t('poiCategories.petrolPumps', 'Petrol Pumps'),
    'Restaurants': t('poiCategories.restaurants', 'Restaurants'),
    'Hotels': t('poiCategories.hotels', 'Hotels'),
    'Parks': t('poiCategories.parks', 'Parks')
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
          {t('dashboardWidgets.quickSearch', 'Kopargaon Quick Service Categories')}
        </h3>

        {selectedCategory !== 'All' && (
          <button
            onClick={() => setSelectedCategory('All')}
            className="text-[11px] font-bold text-sky-600 dark:text-sky-400 hover:underline"
          >
            {t('dashboardWidgets.allPlaces', 'Show All Places')}
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none no-scrollbar">
        {/* All Pill */}
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-1.5 shrink-0 ${
            selectedCategory === 'All'
              ? 'bg-[#0A2540] text-white border-[#0A2540] shadow-md scale-[1.02]'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4 text-emerald-400" />
          <span>{t('dashboardWidgets.allPlaces', 'All Places')}</span>
        </button>

        {/* 14 Category Cards */}
        {SERVICE_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const translatedName = categoryTranslationMap[cat.name] || cat.name;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all border flex items-center gap-2 shrink-0 ${
                isSelected
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md scale-[1.02]'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-sky-400 hover:text-sky-600'
              }`}
            >
              <span className="text-base leading-none">{cat.icon}</span>
              <span>{translatedName}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
