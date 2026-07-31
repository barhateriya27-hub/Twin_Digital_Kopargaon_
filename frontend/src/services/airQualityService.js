/**
 * Real-Time Air Quality (AQI) Telemetry Service for Kopargaon, Maharashtra
 * Coordinates: Latitude 19.8923° N, Longitude 74.4784° E
 * Primary API: Open-Meteo Air Quality API (Live, Keyless, 100% Reliable)
 */

import axios from 'axios';

const KOPARGAON_LAT = 19.8923;
const KOPARGAON_LON = 74.4784;

/**
 * Returns AQI Status Category & Color Code based on US AQI Scale
 */
export const getAQICategory = (aqi) => {
  if (aqi <= 50) return { category: 'Good', color: '#138808', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
  if (aqi <= 100) return { category: 'Moderate', color: '#D97706', bg: 'bg-amber-50 text-amber-800 border-amber-200' };
  if (aqi <= 150) return { category: 'Unhealthy for Sensitive Groups', color: '#EA580C', bg: 'bg-orange-50 text-orange-800 border-orange-200' };
  if (aqi <= 200) return { category: 'Unhealthy', color: '#B71C1C', bg: 'bg-red-50 text-red-800 border-red-200' };
  if (aqi <= 300) return { category: 'Very Unhealthy', color: '#7C3AED', bg: 'bg-purple-50 text-purple-800 border-purple-200' };
  return { category: 'Hazardous', color: '#881337', bg: 'bg-rose-100 text-rose-950 border-rose-300' };
};

/**
 * Main method to fetch live Kopargaon Air Quality telemetry
 */
export const fetchKopargaonAirQuality = async () => {
  try {
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${KOPARGAON_LAT}&longitude=${KOPARGAON_LON}&current=us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,ozone,sulphur_dioxide&timezone=Asia%2FKolkata`;

    const response = await axios.get(url, { timeout: 10000 });
    const current = response.data?.current || {};

    const usAqi = current.us_aqi !== undefined ? Math.round(current.us_aqi) : null;
    if (usAqi === null) {
      throw new Error('No AQI current data');
    }

    const aqiCategory = getAQICategory(usAqi);

    return {
      aqi: usAqi,
      category: aqiCategory.category,
      color: aqiCategory.color,
      bgClass: aqiCategory.bg,
      pm25: current.pm2_5 !== undefined ? Math.round(current.pm2_5) : null,
      pm10: current.pm10 !== undefined ? Math.round(current.pm10) : null,
      no2: current.nitrogen_dioxide !== undefined ? Math.round(current.nitrogen_dioxide) : null,
      co: current.carbon_monoxide !== undefined ? Math.round(current.carbon_monoxide) : null,
      ozone: current.ozone !== undefined ? Math.round(current.ozone) : null,
      so2: current.sulphur_dioxide !== undefined ? Math.round(current.sulphur_dioxide) : null,
      updatedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
      success: true,
      source: 'Open-Meteo Air Quality Live API'
    };
  } catch (error) {
    console.error('Air Quality API Error:', error.message);
    return {
      success: false,
      error: 'Live data currently unavailable'
    };
  }
};
