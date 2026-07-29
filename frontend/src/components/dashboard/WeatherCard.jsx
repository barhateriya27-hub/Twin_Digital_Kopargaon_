import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Sun,
  CloudSun,
  CloudRain,
  Zap,
  CloudFog,
  Wind,
  Droplets,
  Gauge,
  Eye,
  SunMedium,
  Sunrise,
  Sunset,
  RefreshCw,
  AlertTriangle,
  MapPin,
  Clock,
  Radio
} from 'lucide-react';
import { fetchKopargaonWeather } from '../../services/weatherService';

export const WeatherCard = () => {
  const { t } = useTranslation();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshedManually, setIsRefreshedManually] = useState(false);

  const loadWeatherData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await fetchKopargaonWeather();

    if (result && result.success) {
      setWeather(result);
      setError(null);
    } else {
      setError(result?.error || 'Live weather data is temporarily unavailable.');
    }
    setLoading(false);
  }, []);

  // Initial load and 5-minute (300,000ms) automatic background refresh
  useEffect(() => {
    loadWeatherData();

    const FIVE_MINUTES_MS = 5 * 60 * 1000; // 300,000ms
    const intervalId = setInterval(() => {
      loadWeatherData();
    }, FIVE_MINUTES_MS);

    return () => clearInterval(intervalId);
  }, [loadWeatherData]);

  const handleManualRefresh = () => {
    setIsRefreshedManually(true);
    loadWeatherData();
    setTimeout(() => setIsRefreshedManually(false), 1000);
  };

  // Render condition icon with Framer Motion animations
  const renderAnimatedIcon = (iconType) => {
    switch (iconType) {
      case 'sun':
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 sm:w-20 sm:h-20 text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]"
          >
            <Sun className="w-full h-full" />
          </motion.div>
        );
      case 'cloud-sun':
        return (
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 text-sky-400">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              className="absolute -top-1 -right-1 w-10 h-10 text-amber-400"
            >
              <Sun className="w-full h-full" />
            </motion.div>
            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 text-sky-300"
            >
              <CloudSun className="w-full h-full" />
            </motion.div>
          </div>
        );
      case 'rain':
        return (
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 text-blue-400">
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <CloudRain className="w-full h-full" />
            </motion.div>
          </div>
        );
      case 'thunder':
        return (
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 text-purple-400">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Zap className="w-full h-full text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]" />
            </motion.div>
          </div>
        );
      case 'fog':
        return (
          <motion.div
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-16 h-16 sm:w-20 sm:h-20 text-slate-300"
          >
            <CloudFog className="w-full h-full" />
          </motion.div>
        );
      default:
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 sm:w-20 sm:h-20 text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.4)]"
          >
            <Sun className="w-full h-full" />
          </motion.div>
        );
    }
  };

  return (
    <div className="bg-[#0A2540] dark:bg-slate-900 border border-slate-700/60 dark:border-slate-800 rounded-3xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden">
      {/* Background Subtle Ambient Glow */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Card Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700/50 dark:border-slate-800 pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
            <Radio className="w-5 h-5 animate-pulse text-sky-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>Kopargaon, Maharashtra</span>
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                LIVE METEOROLOGY
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium">
              {t('dashboardWidgets.spatialTelemetry', 'Spatial Corridor Telemetry')} • Godavari Valley Sensor Grid
            </p>
          </div>
        </div>

        {/* Refresh button & last updated timestamp */}
        <div className="flex items-center gap-3 self-end sm:self-center">
          {weather?.updatedAt && (
            <div className="text-right hidden xs:block">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">
                {t('dashboardWidgets.lastUpdated', 'Last Updated')}
              </span>
              <span className="text-xs font-mono font-bold text-sky-300 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {weather.updatedAt}
              </span>
            </div>
          )}

          <button
            onClick={handleManualRefresh}
            disabled={loading}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors shadow-sm disabled:opacity-50"
            title="Refresh Live Weather"
          >
            <RefreshCw className={`w-4 h-4 ${loading || isRefreshedManually ? 'animate-spin text-sky-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Body */}
      {loading && !weather ? (
        /* LOADING SKELETON */
        <div className="space-y-5 animate-pulse">
          <div className="flex items-center justify-between py-4">
            <div className="space-y-3">
              <div className="h-12 bg-slate-800 rounded-xl w-36" />
              <div className="h-4 bg-slate-800 rounded w-48" />
              <div className="h-4 bg-slate-800 rounded w-28" />
            </div>
            <div className="w-20 h-20 bg-slate-800 rounded-full" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800">
            {[1, 2, 3, 4, 5, 6, 7].map((n) => (
              <div key={n} className="h-16 bg-slate-800/70 rounded-xl" />
            ))}
          </div>
        </div>
      ) : error ? (
        /* ERROR FALLBACK */
        <div className="p-6 text-center bg-rose-950/30 border border-rose-800/50 rounded-2xl space-y-3">
          <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto" />
          <h3 className="text-sm font-bold text-rose-200">
            {error}
          </h3>
          <p className="text-xs text-slate-400">
            Please check network connectivity or try refreshing live telemetry data.
          </p>
          <button
            onClick={loadWeatherData}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs rounded-xl shadow-md transition-colors inline-flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Live Connection</span>
          </button>
        </div>
      ) : weather ? (
        /* LIVE WEATHER TELEMETRY CONTENT */
        <div className="space-y-6">
          {/* Temperature & Condition Main Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-800/40 p-4 sm:p-5 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white">
                  {weather.temperature}°C
                </span>
                <span className="text-sm font-medium text-slate-300">
                  (Feels like <span className="font-bold font-mono text-amber-300">{weather.feelsLike}°C</span>)
                </span>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <span className="px-3 py-1 rounded-lg text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  {weather.conditionText}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Updated: {weather.updatedAt}
                </span>
              </div>
            </div>

            {/* Animated Condition Icon */}
            <div className="self-center">
              {renderAnimatedIcon(weather.conditionIcon)}
            </div>
          </div>

          {/* Grid of Weather Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {/* Humidity */}
            <div className="bg-slate-800/50 border border-slate-700/60 p-3 rounded-2xl flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase mb-1">
                <span>{t('dashboardWidgets.humidity', 'Humidity')}</span>
                <Droplets className="w-4 h-4 text-sky-400" />
              </div>
              <div className="text-lg sm:text-xl font-extrabold font-mono text-white">
                {weather.humidity}%
              </div>
            </div>

            {/* Wind Speed */}
            <div className="bg-slate-800/50 border border-slate-700/60 p-3 rounded-2xl flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase mb-1">
                <span>{t('dashboardWidgets.wind', 'Wind')}</span>
                <Wind className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-lg sm:text-xl font-extrabold font-mono text-white">
                {weather.windSpeed} <span className="text-xs font-normal text-slate-400">km/h</span>
              </div>
            </div>

            {/* Rain Probability */}
            <div className="bg-slate-800/50 border border-slate-700/60 p-3 rounded-2xl flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase mb-1">
                <span>{t('dashboardWidgets.rainProb', 'Rain Prob.')}</span>
                <CloudRain className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-lg sm:text-xl font-extrabold font-mono text-white">
                {weather.rainProbability}%
              </div>
            </div>

            {/* Atmospheric Pressure */}
            <div className="bg-slate-800/50 border border-slate-700/60 p-3 rounded-2xl flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase mb-1">
                <span>Pressure</span>
                <Gauge className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-lg sm:text-xl font-extrabold font-mono text-white">
                {weather.pressure} <span className="text-xs font-normal text-slate-400">hPa</span>
              </div>
            </div>

            {/* Visibility */}
            <div className="bg-slate-800/50 border border-slate-700/60 p-3 rounded-2xl flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase mb-1">
                <span>Visibility</span>
                <Eye className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-lg sm:text-xl font-extrabold font-mono text-white">
                {weather.visibility} <span className="text-xs font-normal text-slate-400">km</span>
              </div>
            </div>

            {/* UV Index */}
            <div className="bg-slate-800/50 border border-slate-700/60 p-3 rounded-2xl flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase mb-1">
                <span>UV Index</span>
                <SunMedium className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-lg sm:text-xl font-extrabold font-mono text-white">
                {weather.uvIndex}
              </div>
            </div>

            {/* Sunrise */}
            <div className="bg-slate-800/50 border border-slate-700/60 p-3 rounded-2xl flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase mb-1">
                <span>Sunrise</span>
                <Sunrise className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-xs sm:text-sm font-bold font-mono text-amber-200 truncate">
                {weather.sunrise}
              </div>
            </div>

            {/* Sunset */}
            <div className="bg-slate-800/50 border border-slate-700/60 p-3 rounded-2xl flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase mb-1">
                <span>Sunset</span>
                <Sunset className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-xs sm:text-sm font-bold font-mono text-rose-200 truncate">
                {weather.sunset}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
