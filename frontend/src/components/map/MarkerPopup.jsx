import React from 'react';
import { getGoogleMapsDirectionsUrl } from '../../services/mapService';

/**
 * Modern Smart City GIS Popup HTML generator
 */
export const createMarkerPopupHTML = (poi) => {
  const directionsUrl = getGoogleMapsDirectionsUrl(poi.lat, poi.lng, poi.name);
  const color = poi.categoryColor || '#2563EB';

  const lat = typeof poi.lat === 'number' ? poi.lat.toFixed(4) : poi.lat;
  const lng = typeof poi.lng === 'number' ? poi.lng.toFixed(4) : poi.lng;

  const isOpen = poi.status?.includes('Active') || poi.status?.includes('24x7') || poi.status?.includes('Open') || poi.status?.includes('Operational');
  
  const statusBadgeStyle = isOpen
    ? 'background: #DCFCE7; color: #15803D; border: 1px solid #86EFAC;'
    : 'background: #FEF3C7; color: #B45309; border: 1px solid #FDE68A;';

  return `
    <div style="
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      padding: 12px;
      max-width: 270px;
      border-radius: 16px;
      color: #0F172A;
    ">
      <!-- Category Badge & Status Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; gap: 6px;">
        <span style="
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          background: ${color}15;
          color: ${color};
          padding: 3px 8px;
          border-radius: 6px;
          border: 1px solid ${color}33;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        ">
          ${poi.categoryIcon || '📍'} ${poi.category}
        </span>

        <span style="
          font-size: 10px;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 6px;
          ${statusBadgeStyle}
        ">
          ● ${poi.status || 'Active Asset'}
        </span>
      </div>

      <!-- Place Name -->
      <h4 style="
        margin: 4px 0 6px 0;
        font-size: 14px;
        font-weight: 800;
        color: #0F172A;
        line-height: 1.35;
      ">
        ${poi.name}
      </h4>

      <!-- Address -->
      <p style="
        margin: 0 0 8px 0;
        font-size: 11px;
        color: #64748B;
        line-height: 1.4;
      ">
        📍 ${poi.address}
      </p>

      <!-- Latitude & Longitude GIS coordinates -->
      <div style="
        font-size: 10px;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-weight: 700;
        color: #0369A1;
        background: #F0F9FF;
        padding: 5px 8px;
        border-radius: 6px;
        border: 1px solid #BAE6FD;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      ">
        <span>🌐 Coordinates:</span>
        <span>${lat}° N, ${lng}° E</span>
      </div>

      ${poi.distanceKm ? `
        <div style="font-size: 11px; font-weight: 700; color: #475569; margin-bottom: 10px;">
          ⏱ Distance: ${poi.distanceKm} km (${poi.estimatedTime || '~5 mins'})
        </div>
      ` : ''}

      <!-- Action Buttons Footer -->
      <div style="display: flex; gap: 6px; margin-top: 8px;">
        <a href="${directionsUrl}" target="_blank" rel="noopener noreferrer" style="
          flex: 1;
          text-align: center;
          background: linear-gradient(135deg, #0284C7 0%, #0369A1 100%);
          color: white;
          text-decoration: none;
          padding: 7px 10px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 800;
          box-shadow: 0 2px 6px rgba(2, 132, 199, 0.3);
          display: inline-block;
        ">
          🧭 Navigate
        </a>

        <button onclick="alert('${poi.name}\\nCategory: ${poi.category}\\nAddress: ${poi.address}\\nStatus: ${poi.status || 'Active'}\\nDetails: ${poi.details || 'Verified Kopargaon GIS Asset'}')" style="
          flex: 1;
          text-align: center;
          background: #0A2540;
          color: white;
          border: none;
          cursor: pointer;
          padding: 7px 10px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 800;
          box-shadow: 0 2px 6px rgba(10, 37, 64, 0.3);
          display: inline-block;
        ">
          ℹ️ More Details
        </button>
      </div>
    </div>
  `;
};

export const MarkerPopup = ({ poi }) => {
  return (
    <div dangerouslySetInnerHTML={{ __html: createMarkerPopupHTML(poi) }} />
  );
};

export default MarkerPopup;
