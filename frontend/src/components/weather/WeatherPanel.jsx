import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { fetchKopargaonWeather } from '../../services/weatherService';
import { CurrentWeather } from './CurrentWeather';
import { HourlyForecast } from './HourlyForecast';
import { WeeklyForecast } from './WeeklyForecast';
import { RainfallIntelligence } from './RainfallIntelligence';
import { WeatherRisk } from './WeatherRisk';
import { WeatherAlerts } from './WeatherAlerts';
import { WeatherAdvisory } from './WeatherAdvisory';
import { CityWeatherImpact } from './CityWeatherImpact';
import { WeatherTrend } from './WeatherTrend';
import { WeatherRefresh } from './WeatherRefresh';
import { AlertCircle } from 'lucide-react';

export const WeatherPanel = () => {
  const {
    weatherData,
    loadingWeather,
    weatherError,
    weatherRefreshStatus,
    refreshWeather
  } = useApp();

  const [fallbackWeather, setFallbackWeather] = useState(null);
  const [fallbackLoading, setFallbackLoading] = useState(false);

  // Fetch weather if missing in context
  useEffect(() => {
    if (!weatherData) {
      if (typeof refreshWeather === 'function') {
        refreshWeather(true);
      }
      setFallbackLoading(true);
      fetchKopargaonWeather().then(res => {
        if (res && res.success) {
          setFallbackWeather(res);
        }
        setFallbackLoading(false);
      });
    }
  }, [weatherData, refreshWeather]);

  if (loadingWeather && !weatherData) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 animate-pulse">
        {/* Alerts Skeleton */}
        <div className="h-16 bg-slate-100 rounded-3xl w-full"></div>
        
        {/* Main Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 space-y-6">
            <div className="h-[300px] bg-slate-100 rounded-3xl w-full"></div>
            <div className="h-[150px] bg-slate-100 rounded-3xl w-full"></div>
            <div className="h-[200px] bg-slate-100 rounded-3xl w-full"></div>
          </div>
          <div className="lg:col-span-6 space-y-6">
            <div className="h-[120px] bg-slate-100 rounded-3xl w-full"></div>
            <div className="h-[180px] bg-slate-100 rounded-3xl w-full"></div>
            <div className="h-[180px] bg-slate-100 rounded-3xl w-full"></div>
            <div className="h-[200px] bg-slate-100 rounded-3xl w-full"></div>
          </div>
        </div>

        {/* Bottom Refresh Skeleton */}
        <div className="h-16 bg-slate-100 rounded-3xl w-full"></div>
      </div>
    );
  }

  if (weatherError && !weatherData) {
    return (
      <div className="max-w-xl mx-auto p-8 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto border border-red-100 shadow-sm">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">Weather Telemetry Down</h3>
        <p className="text-sm text-slate-500 leading-relaxed">
          {weatherError}
        </p>
        <button
          onClick={() => refreshWeather(false)}
          className="px-5 py-2.5 bg-[#0B2545] hover:bg-[#1E3A5F] text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  // Double fallback if somehow weatherData is null despite guard
  const activeWeather = weatherData || fallbackWeather || {};

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-2 sm:p-4">
      {/* 1. Threshold alerts displayed at top of panel */}
      {activeWeather.success && <WeatherAlerts weather={activeWeather} />}

      {/* 2. Primary layout grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Current weather telemetry, hourly forecast, weekly forecast */}
        <div className="lg:col-span-7 space-y-6">
          {activeWeather.success && <CurrentWeather weather={activeWeather} />}
          {activeWeather.success && <HourlyForecast hourlyData={activeWeather.hourlyForecast} />}
          {activeWeather.success && <WeeklyForecast forecastData={activeWeather.forecast} />}
        </div>

        {/* Right Column: AI Advisory, Rainfall intelligence, Risk levels, Digital Twin impact grid, charts */}
        <div className="lg:col-span-5 space-y-6">
          {activeWeather.success && <WeatherAdvisory weather={activeWeather} />}
          {activeWeather.success && <RainfallIntelligence weather={activeWeather} />}
          {activeWeather.success && <WeatherRisk weather={activeWeather} />}
          {activeWeather.success && <CityWeatherImpact weather={activeWeather} />}
          {activeWeather.success && <WeatherTrend weather={activeWeather} />}
        </div>
      </div>

      {/* 3. Bottom controls */}
      <WeatherRefresh
        refreshStatus={weatherRefreshStatus}
        loading={loadingWeather}
        onRefresh={() => refreshWeather(false)}
      />
    </div>
  );
};

export default WeatherPanel;
