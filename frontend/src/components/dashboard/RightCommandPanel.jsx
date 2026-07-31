import React, { useState, useEffect } from 'react';
import { 
  CloudSun, 
  Wind, 
  Activity, 
  Droplets, 
  Zap, 
  Waves, 
  ShieldAlert, 
  AlertTriangle, 
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { fetchKopargaonWeather } from '../../services/weatherService';
import { fetchKopargaonAirQuality } from '../../services/airQualityService';
import { fetchKopargaonTraffic } from '../../services/trafficService';

export const RightCommandPanel = ({ 
  complaints = [], 
  announcements = [], 
  onSelectComplaint,
  onSelectTab 
}) => {
  // Live Telemetry States
  const [weather, setWeather] = useState(null);
  const [airQuality, setAirQuality] = useState(null);
  const [traffic, setTraffic] = useState(null);

  const [weatherError, setWeatherError] = useState(false);
  const [aqiError, setAqiError] = useState(false);
  const [trafficError, setTrafficError] = useState(false);

  // 1. Weather Fetch & 5-Minute Auto Refresh
  useEffect(() => {
    const loadWeather = () => {
      fetchKopargaonWeather().then(res => {
        if (res.success) {
          setWeather(res);
          setWeatherError(false);
        } else {
          setWeatherError(true);
        }
      });
    };

    loadWeather();
    const timer = setInterval(loadWeather, 5 * 60 * 1000); // 5 minutes
    return () => clearInterval(timer);
  }, []);

  // 2. Air Quality Fetch & 10-Minute Auto Refresh
  useEffect(() => {
    const loadAQI = () => {
      fetchKopargaonAirQuality().then(res => {
        if (res.success) {
          setAirQuality(res);
          setAqiError(false);
        } else {
          setAqiError(true);
        }
      });
    };

    loadAQI();
    const timer = setInterval(loadAQI, 10 * 60 * 1000); // 10 minutes
    return () => clearInterval(timer);
  }, []);

  // 3. Traffic Fetch & 1-Minute Auto Refresh
  useEffect(() => {
    const loadTraffic = () => {
      fetchKopargaonTraffic().then(res => {
        if (res.success) {
          setTraffic(res);
          setTrafficError(false);
        } else {
          setTrafficError(true);
        }
      });
    };

    loadTraffic();
    const timer = setInterval(loadTraffic, 60 * 1000); // 1 minute
    return () => clearInterval(timer);
  }, []);

  const latestComplaints = complaints.slice(0, 3);
  const emergencyAlert = announcements.find(a => a.priority === 'Urgent/Emergency' || a.priority === 'High');

  return (
    <div className="space-y-4">
      
      {/* 1. LIVE WEATHER & AIR QUALITY CARD */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <CloudSun className="w-4 h-4 text-[#FF9933]" />
            <h3 className="text-xs font-black uppercase tracking-wider text-[#0B2545]">
              Live Weather & Air Quality
            </h3>
          </div>
          
          {/* AQI Badge */}
          {aqiError ? (
            <span className="text-[9px] font-mono text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded border border-red-200">
              Live data currently unavailable
            </span>
          ) : airQuality ? (
            <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${airQuality.bgClass}`}>
              AQI {airQuality.aqi} ({airQuality.category})
            </span>
          ) : (
            <span className="text-[9px] font-mono text-slate-400">Loading AQI...</span>
          )}
        </div>

        {/* Live Weather Main Body */}
        {weatherError ? (
          <div className="p-3 bg-rose-50 border border-red-200 rounded-lg text-xs text-red-700 font-semibold text-center">
            Live data currently unavailable
          </div>
        ) : weather ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-black text-[#0B2545]">{weather.temperature}°C</div>
                <p className="text-[11px] font-medium text-slate-500">{weather.conditionText} • Humidity {weather.humidity}%</p>
              </div>
              <div className="text-right font-mono text-[11px] text-slate-600 space-y-0.5">
                <div className="flex items-center gap-1 justify-end font-semibold">
                  <Wind className="w-3.5 h-3.5 text-cyan-600" /> {weather.windSpeed} km/h
                </div>
                <span className="text-[10px] text-slate-400 block">UV Index: {weather.uvIndex}</span>
                <span className="text-[9px] text-emerald-700 font-bold block">Refreshed 5m</span>
              </div>
            </div>

            {/* Detailed Air Quality Breakdown */}
            {airQuality && (
              <div className="pt-2 border-t border-slate-100 grid grid-cols-3 gap-1.5 text-center text-[10px]">
                <div className="p-1 bg-slate-50 rounded border border-slate-200">
                  <span className="text-slate-400 block font-bold">PM2.5</span>
                  <span className="font-extrabold text-[#0B2545]">{airQuality.pm25 ?? '--'} µg/m³</span>
                </div>
                <div className="p-1 bg-slate-50 rounded border border-slate-200">
                  <span className="text-slate-400 block font-bold">PM10</span>
                  <span className="font-extrabold text-[#0B2545]">{airQuality.pm10 ?? '--'} µg/m³</span>
                </div>
                <div className="p-1 bg-slate-50 rounded border border-slate-200">
                  <span className="text-slate-400 block font-bold">NO2</span>
                  <span className="font-extrabold text-[#0B2545]">{airQuality.no2 ?? '--'} µg/m³</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-3 text-xs text-slate-400 text-center animate-pulse">Fetching live weather...</div>
        )}
      </div>

      {/* 2. TRAFFIC & RIVER LEVEL CARD */}
      <div className="grid grid-cols-2 gap-3">
        {/* Live Traffic */}
        <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-[#0B2545]">
            <span className="flex items-center gap-1"><Activity className="w-3.5 h-3.5 text-[#138808]" /> Traffic</span>
            <span className="text-[8px] font-mono text-slate-400">1m auto</span>
          </div>
          {trafficError ? (
            <p className="text-[10px] text-red-600 font-semibold">Live data currently unavailable</p>
          ) : traffic ? (
            <>
              <p className="text-xs font-extrabold" style={{ color: traffic.statusColor }}>{traffic.status}</p>
              <p className="text-[10px] text-slate-500">Speed: {traffic.avgSpeed}</p>
            </>
          ) : (
            <p className="text-[10px] text-slate-400">Loading traffic...</p>
          )}
        </div>

        {/* River Level */}
        <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#0B2545]">
            <Waves className="w-3.5 h-3.5 text-cyan-600" /> River Level
          </div>
          <p className="text-xs font-extrabold text-[#0B2545]">5.2m <span className="text-[9px] font-normal text-slate-500">(Normal)</span></p>
          <p className="text-[9px] text-slate-500">Danger: 12.0m</p>
        </div>
      </div>

      {/* 3. PUBLIC UTILITIES GRID */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-2.5">
        <h3 className="text-xs font-black uppercase tracking-wider text-[#0B2545] border-b border-slate-100 pb-1.5">
          Public Utilities Grid Status
        </h3>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-50 text-cyan-700">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-[#0B2545]">Water Supply Grid</p>
              <p className="text-[10px] text-slate-500">Reservoir: 88% Capacity</p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-[#138808] border border-emerald-200">
            24/7 ACTIVE
          </span>
        </div>

        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-[#0B2545]">Electricity Grid</p>
              <p className="text-[10px] text-slate-500">132kV Substation Feed</p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-[#138808] border border-emerald-200">
            STABLE
          </span>
        </div>
      </div>

      {/* 4. EMERGENCY ALERTS CARD */}
      <div className="bg-gradient-to-r from-[#B71C1C] to-[#880E4F] text-white rounded-xl p-3.5 shadow-md space-y-1.5">
        <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-wider">
          <span className="flex items-center gap-1.5 text-[#FF9933]">
            <ShieldAlert className="w-4 h-4 animate-pulse" /> Emergency Advisory
          </span>
          <span className="text-[9px] bg-white/20 px-2 py-0.5 rounded font-mono">DISASTER CELL</span>
        </div>
        <p className="text-xs font-semibold leading-snug text-white">
          {emergencyAlert ? emergencyAlert.title : 'Monsoon Advisory: Maintain caution near Godavari riverbanks. 24x7 control room active.'}
        </p>
      </div>

      {/* 5. LATEST COMPLAINTS FEED */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#FF9933]" />
            <h3 className="text-xs font-black uppercase tracking-wider text-[#0B2545]">
              Latest Complaints Feed
            </h3>
          </div>
          <button
            onClick={() => onSelectTab && onSelectTab('track_complaint')}
            className="text-[10px] font-bold text-[#0B2545] hover:underline flex items-center gap-0.5"
          >
            View All <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-2">
          {latestComplaints.map(item => (
            <div
              key={item.id}
              onClick={() => onSelectComplaint && onSelectComplaint(item)}
              className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 cursor-pointer transition-colors text-xs space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-[#0B2545]">{item.id}</span>
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                  item.status === 'Completed' || item.status === 'Resolved'
                    ? 'bg-emerald-100 text-[#138808]'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {item.status}
                </span>
              </div>
              <p className="font-bold text-[#0B2545] truncate">{item.title}</p>
              <p className="text-[10px] text-slate-500 truncate">{item.locationName || `Ward ${item.ward}, Kopargaon`}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
