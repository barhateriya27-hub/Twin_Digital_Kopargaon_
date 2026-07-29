import React, { useState } from 'react';
import {
  Layers,
  Activity,
  CloudSun,
  Flame,
  Radio,
  Camera,
  Zap,
  Droplet,
  AlertTriangle,
  Globe,
  Mountain,
  Bus,
  Box,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';

/**
 * Official Government GIS Command Center Floating Control Panel
 * PM Gati Shakti & ISRO Bhuvan Inspired Controls
 */
export const DigitalTwinControls = ({ activeLayers = {}, onToggleLayer, activeHeatmap, onSelectHeatmap }) => {
  const [isOpen, setIsOpen] = useState(true);

  const layerItems = [
    { id: 'satellite', label: 'Satellite View', icon: Globe, color: '#0B1F3A' },
    { id: 'terrain', label: 'Terrain View', icon: Mountain, color: '#138808' },
    { id: 'buildings3d', label: '3D Building Extrusions', icon: Box, color: '#FF9933' },
    { id: 'traffic', label: 'Live Traffic Flow', icon: Activity, color: '#FF9933' },
    { id: 'weather', label: 'Weather Radar Layer', icon: CloudSun, color: '#0284C7' },
    { id: 'heatmap', label: 'GIS Heatmap Overlay', icon: Flame, color: '#C62828' },
    { id: 'complaints', label: 'Citizen Grievances', icon: AlertTriangle, color: '#C62828' },
    { id: 'waterGrid', label: 'Water Pipeline Network', icon: Droplet, color: '#0284C7' },
    { id: 'electricGrid', label: 'Electrical Power Grid', icon: Zap, color: '#EAB308' },
    { id: 'cctv', label: 'CCTV Surveillance', icon: Camera, color: '#0B1F3A' },
    { id: 'busRoutes', label: 'MSRTC Bus Routes', icon: Bus, color: '#FF9933' },
    { id: 'sensors', label: 'IoT Sensor Nodes', icon: Radio, color: '#138808' }
  ];

  const heatmapModes = [
    { id: 'complaint', label: 'Complaints' },
    { id: 'traffic', label: 'Traffic' },
    { id: 'aqi', label: 'Air Quality (AQI)' },
    { id: 'flood', label: 'Flood Risk' },
    { id: 'population', label: 'Population' }
  ];

  return (
    <div className="absolute top-4 left-4 z-[1000] max-w-[310px] sm:max-w-[340px]">
      {/* Header Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2.5 bg-[#0B1F3A] text-white rounded-xl shadow-lg hover:bg-[#071426] transition-all text-xs font-bold uppercase tracking-wider border border-[#0B1F3A]"
      >
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF9933]"></div>
          <span>PM GATI SHAKTI GIS LAYERS</span>
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4 text-[#FF9933]" /> : <ChevronDown className="w-4 h-4 text-[#FF9933]" />}
      </button>

      {/* Panel Body */}
      {isOpen && (
        <div className="mt-2 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl p-3.5 shadow-2xl text-slate-800 transition-all max-h-[390px] overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Government GIS Layers ({layerItems.length})
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1">
            {layerItems.map(item => {
              const Icon = item.icon;
              const isEnabled = !!activeLayers[item.id];

              return (
                <div key={item.id} className="flex flex-col">
                  <button
                    onClick={() => onToggleLayer(item.id)}
                    className={`flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition-all border ${
                      isEnabled
                        ? 'bg-[#0B1F3A]/5 border-[#0B1F3A]/30 text-[#0B1F3A]'
                        : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4" style={{ color: isEnabled ? item.color : '#64748B' }} />
                      <span>{item.label}</span>
                    </div>

                    <div
                      className={`w-7 h-4 rounded-full transition-colors relative p-0.5 ${
                        isEnabled ? 'bg-[#0B1F3A]' : 'bg-slate-300'
                      }`}
                    >
                      <div
                        className={`w-3 h-3 rounded-full bg-white transition-transform ${
                          isEnabled ? 'translate-x-3' : 'translate-x-0'
                        }`}
                      />
                    </div>
                  </button>

                  {/* Heatmap sub-options */}
                  {item.id === 'heatmap' && isEnabled && (
                    <div className="mt-1.5 ml-6 grid grid-cols-2 gap-1 p-1.5 bg-slate-100 rounded-xl border border-slate-200 text-[10px]">
                      {heatmapModes.map(mode => (
                        <button
                          key={mode.id}
                          onClick={() => onSelectHeatmap(mode.id)}
                          className={`px-2 py-1 rounded-lg font-bold transition-all text-left ${
                            activeHeatmap === mode.id
                              ? 'bg-[#0B1F3A] text-white shadow-sm'
                              : 'text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {mode.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DigitalTwinControls;
