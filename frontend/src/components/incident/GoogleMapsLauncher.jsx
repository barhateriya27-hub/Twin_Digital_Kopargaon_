import React from 'react';
import { ExternalLink, MapPin } from 'lucide-react';

export const GoogleMapsLauncher = ({ latitude, longitude, locationName, title, className = '' }) => {
  const handleOpenGoogleMaps = (e) => {
    e.stopPropagation();
    let mapsUrl = '';
    if (latitude && longitude) {
      mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    } else if (locationName) {
      mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationName + ', Kopargaon, Maharashtra')}`;
    } else {
      mapsUrl = `https://www.google.com/maps?q=19.8833,74.4833`;
    }
    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={handleOpenGoogleMaps}
      className={`px-3 py-1.5 bg-[#0A2540] hover:bg-slate-800 text-white rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs ${className}`}
      title="Open exact location in Google Maps"
    >
      <MapPin className="w-3.5 h-3.5 text-amber-300" />
      <span>Open in Google Maps</span>
      <ExternalLink className="w-3 h-3 text-slate-300" />
    </button>
  );
};
