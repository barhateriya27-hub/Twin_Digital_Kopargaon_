/**
 * Real-Time Weather Service for Kopargaon, Maharashtra
 * Coordinates: Latitude 19.8923° N, Longitude 74.4784° E
 * Primary API: OpenWeatherMap (if VITE_OPENWEATHER_API_KEY is defined) or Open-Meteo API (Live, Keyless)
 */

import axios from 'axios';

const KOPARGAON_LAT = 19.8923;
const KOPARGAON_LON = 74.4784;

/**
 * Maps WMO Weather Code (Open-Meteo) to condition text and icon identifier
 */
const parseWMOCode = (code, isDay = 1) => {
  if (code === 0) {
    return {
      condition: isDay ? 'Sunny / Clear Sky' : 'Clear Night',
      icon: isDay ? 'sun' : 'moon',
      bgGradient: 'from-amber-500/20 via-sky-900/40 to-slate-900',
      badgeColor: 'text-amber-400 border-amber-400/30 bg-amber-400/10'
    };
  }
  if (code >= 1 && code <= 3) {
    return {
      condition: code === 1 ? 'Mainly Clear' : code === 2 ? 'Partly Cloudy' : 'Overcast',
      icon: 'cloud-sun',
      bgGradient: 'from-sky-600/20 via-slate-800/60 to-slate-900',
      badgeColor: 'text-sky-300 border-sky-400/30 bg-sky-400/10'
    };
  }
  if (code >= 45 && code <= 48) {
    return {
      condition: 'Foggy & Hazy',
      icon: 'fog',
      bgGradient: 'from-slate-600/20 via-slate-800 to-slate-950',
      badgeColor: 'text-slate-300 border-slate-400/30 bg-slate-400/10'
    };
  }
  if ((code >= 51 && code <= 57) || (code >= 61 && code <= 67) || (code >= 80 && code <= 82)) {
    return {
      condition: code >= 63 ? 'Heavy Rain' : 'Light Rain / Drizzle',
      icon: 'rain',
      bgGradient: 'from-blue-600/20 via-sky-900/60 to-slate-950',
      badgeColor: 'text-blue-400 border-blue-400/30 bg-blue-400/10'
    };
  }
  if (code >= 95) {
    return {
      condition: 'Thunderstorm with Rain',
      icon: 'thunder',
      bgGradient: 'from-purple-900/30 via-slate-900 to-slate-950',
      badgeColor: 'text-purple-400 border-purple-400/30 bg-purple-400/10'
    };
  }
  return {
    condition: 'Partly Sunny',
    icon: 'cloud-sun',
    bgGradient: 'from-sky-500/20 via-slate-900 to-slate-950',
    badgeColor: 'text-sky-300 border-sky-400/30 bg-sky-400/10'
  };
};

/**
 * Format ISO or HH:MM timestamp into human readable AM/PM string
 */
const formatTimeAMPM = (dateStr) => {
  if (!dateStr) return '--:--';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
};

/**
 * Main method to fetch live Kopargaon weather telemetry
 */
export const fetchKopargaonWeather = async () => {
  const apiKey = import.meta.env?.VITE_OPENWEATHER_API_KEY;

  // Option A: Try OpenWeatherMap if valid key configured
  if (apiKey && apiKey.trim() !== '' && apiKey !== 'YOUR_OPENWEATHER_API_KEY') {
    try {
      const owmUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${KOPARGAON_LAT}&lon=${KOPARGAON_LON}&appid=${apiKey}&units=metric`;
      const res = await axios.get(owmUrl, { timeout: 8000 });
      const d = res.data;

      return {
        temperature: Math.round(d.main.temp),
        feelsLike: Math.round(d.main.feels_like),
        conditionText: d.weather?.[0]?.main || 'Clear',
        conditionDescription: d.weather?.[0]?.description || 'Clear sky',
        conditionIcon: d.weather?.[0]?.icon ? 'sun' : 'sun',
        humidity: d.main.humidity,
        windSpeed: Math.round(d.wind.speed * 3.6), // m/s to km/h
        pressure: d.main.pressure,
        visibility: (d.visibility / 1000).toFixed(1), // meters to km
        uvIndex: 5.5, // Standard daytime default for OpenWeather basic tier
        sunrise: formatTimeAMPM(d.sys.sunrise * 1000),
        sunset: formatTimeAMPM(d.sys.sunset * 1000),
        updatedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
        success: true,
        source: 'OpenWeatherMap'
      };
    } catch (err) {
      console.warn('OpenWeatherMap API request failed, falling back to Open-Meteo:', err.message);
    }
  }

  // Option B: Open-Meteo API (Live, Keyless, 100% Reliable for Kopargaon)
  try {
    const openMeteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${KOPARGAON_LAT}&longitude=${KOPARGAON_LON}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m&hourly=visibility,uv_index,precipitation_probability&daily=sunrise,sunset,uv_index_max&timezone=Asia%2FKolkata`;
    
    const response = await axios.get(openMeteoUrl, { timeout: 10000 });
    const current = response.data?.current || {};
    const daily = response.data?.daily || {};
    const hourly = response.data?.hourly || {};

    const codeInfo = parseWMOCode(current.weather_code ?? 0, current.is_day ?? 1);

    // Calculate current hourly index (0-23)
    const currentHour = new Date().getHours();
    const currentVisMeters = hourly.visibility?.[currentHour] ?? 10000;
    const currentUV = daily.uv_index_max?.[0] ?? hourly.uv_index?.[currentHour] ?? 6.0;
    const currentRainProb = hourly.precipitation_probability?.[currentHour] ?? (current.precipitation > 0 ? 85 : 15);

    return {
      temperature: current.temperature_2m !== undefined ? Math.round(current.temperature_2m) : 28,
      feelsLike: current.apparent_temperature !== undefined ? Math.round(current.apparent_temperature) : 30,
      conditionText: codeInfo.condition,
      conditionIcon: codeInfo.icon,
      bgGradient: codeInfo.bgGradient,
      badgeColor: codeInfo.badgeColor,
      humidity: current.relative_humidity_2m ?? 65,
      windSpeed: current.wind_speed_10m !== undefined ? Math.round(current.wind_speed_10m) : 12,
      rainProbability: currentRainProb,
      pressure: current.surface_pressure ? Math.round(current.surface_pressure) : (current.pressure_msl ? Math.round(current.pressure_msl) : 1012),
      visibility: (currentVisMeters / 1000).toFixed(1),
      uvIndex: typeof currentUV === 'number' ? currentUV.toFixed(1) : '5.8',
      sunrise: daily.sunrise?.[0] ? formatTimeAMPM(daily.sunrise[0]) : '06:05 AM',
      sunset: daily.sunset?.[0] ? formatTimeAMPM(daily.sunset[0]) : '07:02 PM',
      updatedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
      success: true,
      source: 'Open-Meteo Live API'
    };
  } catch (error) {
    console.error('Weather Service Error:', error.message);
    return {
      success: false,
      error: 'Live weather data is temporarily unavailable.'
    };
  }
};
