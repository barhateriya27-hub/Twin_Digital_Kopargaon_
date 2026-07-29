import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Navigation, AlertTriangle } from 'lucide-react';
import { getKopargaonTrafficData } from '../../services/trafficService';

export const TrafficWidget = () => {
  const { t } = useTranslation();
  const trafficData = getKopargaonTrafficData();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
    >
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center font-bold">
            <Navigation className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
              {t('dashboardWidgets.liveTraffic', 'Kopargaon Live Traffic')}
            </h3>
            <span className="text-[10px] text-slate-400 font-mono block">
              {t('dashboardWidgets.spatialTelemetry', 'Spatial Corridor Telemetry')}
            </span>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          {trafficData.overallStatus} ({trafficData.overallSpeedAvg})
        </span>
      </div>

      {/* Corridors Status */}
      <div className="space-y-2 mb-3">
        {trafficData.corridors.slice(0, 3).map((corridor) => (
          <div
            key={corridor.id}
            className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex items-center justify-between text-xs"
          >
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${corridor.levelColor}`} />
              <span className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
                {corridor.name}
              </span>
            </div>

            <div className="text-right shrink-0">
              <span className={`font-mono font-bold ${corridor.textColor}`}>
                {corridor.avgSpeed}
              </span>
              <span className="text-[10px] text-slate-400 block font-mono">
                {corridor.delay} delay
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Active Road Closure Advisory */}
      {trafficData.roadClosures.length > 0 && (
        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40 rounded-xl text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-[11px]">Advisory: {trafficData.roadClosures[0].location}</span>
            <span className="text-[10px] opacity-90 block leading-tight mt-0.5">
              {trafficData.roadClosures[0].details}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
};
