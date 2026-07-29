import React from 'react';
import { getGoogleMapsDirectionsUrl } from '../../services/mapService';

/**
 * Official Government GIS Command Center Popup Card HTML
 */
export const createDigitalTwinPopupHTML = (poi) => {
  const directionsUrl = getGoogleMapsDirectionsUrl(poi.lat, poi.lng, poi.name);
  const color = poi.categoryColor || '#0B1F3A';

  const lat = typeof poi.lat === 'number' ? poi.lat.toFixed(4) : poi.lat;
  const lng = typeof poi.lng === 'number' ? poi.lng.toFixed(4) : poi.lng;

  const thumbnails = {
    Hospitals: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=400&q=80',
    'Fire Stations': 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&q=80',
    'Police Stations': 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&q=80',
    Schools: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&q=80',
    Colleges: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&q=80',
    'Bus Stops': 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&q=80',
    'Railway Station': 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=400&q=80',
    'Municipal Office': 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=400&q=80',
    'Parks & Gardens': 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=400&q=80'
  };

  const coverImg = thumbnails[poi.category] || 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=400&q=80';

  return `
    <div style="
      font-family: system-ui, -apple-system, sans-serif;
      padding: 0;
      width: 275px;
      border-radius: 14px;
      overflow: hidden;
      background: #FFFFFF;
      color: #0F172A;
      box-shadow: 0 10px 30px rgba(11, 31, 58, 0.25);
      border: 1px solid rgba(11, 31, 58, 0.2);
    ">
      <!-- Cover Banner -->
      <div style="position: relative; width: 100%; height: 100px; overflow: hidden;">
        <img src="${coverImg}" alt="${poi.name}" style="width: 100%; height: 100%; object-fit: cover;" />
        <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(11, 31, 58, 0.9) 10%, transparent 90%);"></div>

        <span style="
          position: absolute;
          top: 8px;
          left: 8px;
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          background: #0B1F3A;
          color: #FFFFFF;
          padding: 3px 8px;
          border-radius: 6px;
          border: 1px solid #FF9933;
        ">
          ${poi.categoryIcon || '📍'} ${poi.category}
        </span>
      </div>

      <!-- Popup Content -->
      <div style="padding: 12px;">
        <h4 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 800; color: #0B1F3A; line-height: 1.35;">
          ${poi.name}
        </h4>

        <p style="margin: 0 0 8px 0; font-size: 11px; color: #475569; line-height: 1.35;">
          📍 ${poi.address}
        </p>

        <!-- Status & GIS Grid -->
        <div style="display: flex; gap: 6px; margin-bottom: 8px; font-size: 10px;">
          <div style="flex: 1; background: #F8FAFC; padding: 5px 8px; border-radius: 6px; border: 1px solid #E2E8F0;">
            <span style="color: #64748B; font-weight: 700; display: block;">OPERATIONAL STATUS</span>
            <strong style="color: #138808;">● ${poi.status || 'Active Asset'}</strong>
          </div>

          <div style="flex: 1; background: #F8FAFC; padding: 5px 8px; border-radius: 6px; border: 1px solid #E2E8F0;">
            <span style="color: #64748B; font-weight: 700; display: block;">GIS COORDINATES</span>
            <strong style="color: #0B1F3A; font-family: monospace;">${lat}°, ${lng}°</strong>
          </div>
        </div>

        ${poi.distanceKm ? `
          <div style="font-size: 10px; font-weight: 700; color: #0B1F3A; margin-bottom: 10px; background: #FFF7ED; padding: 5px 8px; border-radius: 6px; border: 1px solid #FFEDD5;">
            ⏱ Distance: ${poi.distanceKm} km (${poi.estimatedTime || '~4 mins'})
          </div>
        ` : ''}

        <!-- Actions -->
        <div style="display: flex; gap: 6px;">
          <a href="${directionsUrl}" target="_blank" rel="noopener noreferrer" style="
            flex: 1;
            text-align: center;
            background: #0B1F3A;
            color: white;
            text-decoration: none;
            padding: 7px;
            border-radius: 8px;
            font-size: 11px;
            font-weight: 800;
            display: inline-block;
          ">
            🧭 Directions
          </a>

          <button onclick="alert('${poi.name}\\nCategory: ${poi.category}\\nAddress: ${poi.address}\\nStatus: ${poi.status || 'Active'}\\nKMC GIS Node: Kopargaon Ward Spatial Database')" style="
            flex: 1;
            text-align: center;
            background: #FFF7ED;
            color: #C2410C;
            border: 1px solid #FF9933;
            cursor: pointer;
            padding: 7px;
            border-radius: 8px;
            font-size: 11px;
            font-weight: 800;
          ">
            ℹ️ Asset Details
          </button>
        </div>
      </div>
    </div>
  `;
};

export const DigitalTwinPopup = ({ poi }) => {
  return (
    <div dangerouslySetInnerHTML={{ __html: createDigitalTwinPopupHTML(poi) }} />
  );
};

export default DigitalTwinPopup;
