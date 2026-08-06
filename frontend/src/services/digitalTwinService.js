/**
 * Kopargaon AI Digital Twin Simulation & Spatial GIS Engine
 * WebGL vector layers, 3D building extrusions, moving vehicle simulation,
 * IoT sensor streams, and AI predictive risk models.
 */

// Kopargaon Spatial Anchor Coordinates
export const KOPARGAON_CENTER = { lng: 74.4784, lat: 19.8923 };

// Unified Single Source of Truth API Fetch Helpers
export const fetchInfrastructureAssets = async () => {
  try {
    const res = await fetch('/api/infrastructure/assets', { credentials: 'include' });
    const json = await res.json();
    return json.success ? json.data : [];
  } catch (e) {
    return [];
  }
};

export const fetchLiveSensors = async () => {
  try {
    const res = await fetch('/api/sensors/live', { credentials: 'include' });
    const json = await res.json();
    return json.success ? json.data : [];
  } catch (e) {
    return [];
  }
};

export const fetchMunicipalTeams = async () => {
  try {
    const res = await fetch('/api/teams', { credentials: 'include' });
    const json = await res.json();
    return json.success ? json.data : [];
  } catch (e) {
    return [];
  }
};

export const fetchCityOverview = async () => {
  try {
    const res = await fetch('/api/data/overview', { credentials: 'include' });
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (e) {
    return null;
  }
};

/**
 * GeoJSON Features Generator for Kopargaon City Wards
 */
export const KOPARGAON_WARDS_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { id: 'ward-1', name: 'Ward 1 - Godavari Riverfront', population: 14500, riskScore: 'Low' },
      geometry: {
        type: 'Polygon',
        coordinates: [[[74.471, 19.898], [74.482, 19.897], [74.484, 19.890], [74.473, 19.889], [74.471, 19.898]]]
      }
    },
    {
      type: 'Feature',
      properties: { id: 'ward-2', name: 'Ward 2 - Central Bazaar & Chowk', population: 22100, riskScore: 'Medium' },
      geometry: {
        type: 'Polygon',
        coordinates: [[[74.473, 19.897], [74.485, 19.896], [74.486, 19.891], [74.475, 19.892], [74.473, 19.897]]]
      }
    },
    {
      type: 'Feature',
      properties: { id: 'ward-3', name: 'Ward 3 - Station & Industrial Zone', population: 18900, riskScore: 'High' },
      geometry: {
        type: 'Polygon',
        coordinates: [[[74.465, 19.891], [74.474, 19.890], [74.475, 19.882], [74.466, 19.883], [74.465, 19.891]]]
      }
    },
    {
      type: 'Feature',
      properties: { id: 'ward-4', name: 'Ward 4 - Somaiya Educational Sector', population: 16400, riskScore: 'Low' },
      geometry: {
        type: 'Polygon',
        coordinates: [[[74.477, 19.905], [74.487, 19.903], [74.488, 19.897], [74.478, 19.898], [74.477, 19.905]]]
      }
    }
  ]
};

/**
 * 3D Building Extrusions Footprints
 */
export const KOPARGAON_BUILDINGS_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { height: 28, min_height: 0, name: 'KMC Municipal Council Headquarters' },
      geometry: {
        type: 'Polygon',
        coordinates: [[[74.4788, 19.8921], [74.4793, 19.8921], [74.4793, 19.8917], [74.4788, 19.8917], [74.4788, 19.8921]]]
      }
    },
    {
      type: 'Feature',
      properties: { height: 35, min_height: 0, name: 'Sub-District Civil Hospital Complex' },
      geometry: {
        type: 'Polygon',
        coordinates: [[[74.4790, 19.8947], [74.4796, 19.8947], [74.4796, 19.8942], [74.4790, 19.8942], [74.4790, 19.8947]]]
      }
    },
    {
      type: 'Feature',
      properties: { height: 42, min_height: 0, name: 'Somaiya Engineering & Science Tower' },
      geometry: {
        type: 'Polygon',
        coordinates: [[[74.4808, 19.8992], [74.4815, 19.8992], [74.4815, 19.8986], [74.4808, 19.8986], [74.4808, 19.8992]]]
      }
    },
    {
      type: 'Feature',
      properties: { height: 22, min_height: 0, name: 'MSRTC Central Bus Complex' },
      geometry: {
        type: 'Polygon',
        coordinates: [[[74.4752, 19.8927], [74.4759, 19.8927], [74.4759, 19.8922], [74.4752, 19.8922], [74.4752, 19.8927]]]
      }
    },
    {
      type: 'Feature',
      properties: { height: 25, min_height: 0, name: 'Kopargaon Railway Terminal Main Building' },
      geometry: {
        type: 'Polygon',
        coordinates: [[[74.4687, 19.8863], [74.4694, 19.8863], [74.4694, 19.8857], [74.4687, 19.8857], [74.4687, 19.8863]]]
      }
    }
  ]
};

/**
 * Glowing Godavari River Polygon
 */
export const GODAVARI_RIVER_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: 'Godavari River', flowRate: '420 m³/s', status: 'Normal Level' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [74.460, 19.899],
            [74.470, 19.897],
            [74.480, 19.895],
            [74.490, 19.894],
            [74.492, 19.892],
            [74.480, 19.893],
            [74.470, 19.895],
            [74.460, 19.897],
            [74.460, 19.899]
          ]
        ]
      }
    }
  ]
};

/**
 * Water Pipeline & Electrical Power Grid Spatial Lines
 */
export const WATER_GRID_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { id: 'pipe-main-1', label: 'Main Feeder 1500mm', pressure: '4.2 Bar', status: 'Active' },
      geometry: {
        type: 'LineString',
        coordinates: [[74.4840, 19.8950], [74.4790, 19.8920], [74.4755, 19.8925], [74.4690, 19.8860]]
      }
    }
  ]
};

export const ELECTRIC_GRID_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { id: 'grid-line-1', label: '33kV Feeder Line', voltage: '33,000 V', status: 'Nominal' },
      geometry: {
        type: 'LineString',
        coordinates: [[74.4730, 19.9010], [74.4760, 19.8962], [74.4792, 19.8945], [74.4811, 19.8938]]
      }
    }
  ]
};

/**
 * IoT Sensor Nodes Network
 */
export const IOT_SENSOR_NODES = [
  {
    id: 'iot-aqi-1',
    name: 'Godavari Ghat AQI & Noise Station',
    category: 'Environment',
    icon: '📡',
    lat: 19.8915,
    lng: 74.4752,
    metrics: { aqi: 42, temp: '28.4 °C', humidity: '64%', noise: '48 dB' },
    status: 'Operational'
  },
  {
    id: 'iot-water-1',
    name: 'Ward 5 Smart Water Flow Sensor',
    category: 'Water Grid',
    icon: '💧',
    lat: 19.8952,
    lng: 74.4838,
    metrics: { flow: '1200 L/min', pressure: '4.1 Bar', quality: 'Clean' },
    status: 'Operational'
  },
  {
    id: 'iot-power-1',
    name: 'Yeola Naka Energy Metering Grid Node',
    category: 'Energy',
    icon: '⚡',
    lat: 19.8972,
    lng: 74.4738,
    metrics: { load: '78%', voltage: '415 V', frequency: '50.0 Hz' },
    status: 'Operational'
  },
  {
    id: 'iot-cam-1',
    name: 'Station Chowk AI Traffic CCTV Node',
    category: 'CCTV & Traffic',
    icon: '📹',
    lat: 19.8912,
    lng: 74.4768,
    metrics: { vehiclesPerMin: 64, ANPR: 'Active', speedAvg: '32 km/h' },
    status: 'Operational'
  }
];

/**
 * AI Predictive Analytics Risk Models
 */
export const AI_PREDICTION_MODELS = [
  {
    id: 'ai-flood-1',
    title: 'Flood Risk Prediction (Godavari Bank)',
    type: 'Flood Risk',
    riskLevel: 'Moderate (24% Probability)',
    lat: 19.8960,
    lng: 74.4740,
    icon: '🌊',
    color: '#0284C7',
    details: 'AI Hydro Model predicts monsoon water elevation surge of +0.4m in 36 hours.'
  },
  {
    id: 'ai-acc-1',
    title: 'Accident Blackspot AI Warning',
    type: 'Traffic Safety',
    riskLevel: 'High Risk (Bypass Intersection)',
    lat: 19.8995,
    lng: 74.4715,
    icon: '🚨',
    color: '#EF4444',
    details: 'AI pattern recognition flagged high collision probability during evening dusk hours.'
  },
  {
    id: 'ai-garb-1',
    title: 'Garbage Container Overflow Forecast',
    type: 'Sanitation',
    riskLevel: 'Overflow Expected in 2 Hours',
    lat: 19.8895,
    lng: 74.4825,
    icon: '🗑',
    color: '#EAB308',
    details: 'Fill-rate sensors predict 98% volume reached by 16:00 PM. Truck route dispatched.'
  }
];

/**
 * Live Moving Vehicles Routes Simulation
 */
export const LIVE_VEHICLES_DATA = [
  {
    id: 'veh-bus-1',
    name: 'MSRTC Smart Bus #MH-17-BC-4412',
    type: 'Bus',
    icon: '🚌',
    color: '#F97316',
    status: 'In Transit (Route 4)',
    speed: '38 km/h',
    route: [
      { lat: 19.8860, lng: 74.4690 },
      { lat: 19.8912, lng: 74.4765 },
      { lat: 19.8925, lng: 74.4755 },
      { lat: 19.8970, lng: 74.4740 },
      { lat: 19.8990, lng: 74.4810 }
    ]
  },
  {
    id: 'veh-amb-1',
    name: 'Trauma ICU Ambulance #MH-17-AX-108',
    type: 'Ambulance',
    icon: '🚑',
    color: '#EF4444',
    status: 'Emergency Dispatch Active',
    speed: '62 km/h',
    route: [
      { lat: 19.8990, lng: 74.4810 },
      { lat: 19.8962, lng: 74.4760 },
      { lat: 19.8945, lng: 74.4792 }
    ]
  },
  {
    id: 'veh-pol-1',
    name: 'Kopargaon Police Patrol Squad #Patrol-02',
    type: 'Police',
    icon: '🚓',
    color: '#2563EB',
    status: 'Highway Patrol Active',
    speed: '45 km/h',
    route: [
      { lat: 19.8978, lng: 74.4712 },
      { lat: 19.8970, lng: 74.4740 },
      { lat: 19.8912, lng: 74.4765 },
      { lat: 19.8890, lng: 74.4840 }
    ]
  },
  {
    id: 'veh-garb-1',
    name: 'KMC Smart Waste Collector #Truck-05',
    type: 'Sanitation',
    icon: '🚛',
    color: '#10B981',
    status: 'On Collection Route',
    speed: '22 km/h',
    route: [
      { lat: 19.8935, lng: 74.4768 },
      { lat: 19.8928, lng: 74.4760 },
      { lat: 19.8895, lng: 74.4825 }
    ]
  }
];

/**
 * Interpolates vehicle position along coordinates over time
 */
export const calculateVehiclePosition = (route = [], progressRatio = 0) => {
  if (!route || route.length === 0) return { lat: 19.8923, lng: 74.4784 };
  if (route.length === 1) return route[0];

  const totalSegments = route.length - 1;
  const rawIndex = progressRatio * totalSegments;
  const index = Math.floor(rawIndex);
  const segmentProgress = rawIndex - index;

  if (index >= totalSegments) return route[totalSegments];

  const p1 = route[index];
  const p2 = route[index + 1];

  return {
    lat: p1.lat + (p2.lat - p1.lat) * segmentProgress,
    lng: p1.lng + (p2.lng - p1.lng) * segmentProgress
  };
};
