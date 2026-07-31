import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  CloudSun, 
  Activity, 
  ShieldAlert, 
  AlertTriangle, 
  BrainCircuit, 
  Wind,
  Droplets,
  Zap,
  Waves
} from 'lucide-react';
import { MapLibreGisCommandCenter } from './MapLibreGisCommandCenter';
import { RightCommandPanel } from './RightCommandPanel';

export const CommandCenterMap = ({ 
  userLocation,
  complaints = [],
  onSelectComplaint
}) => {
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  return (
    <div className="relative w-full flex flex-col lg:flex-row gap-4 items-start">
      
      {/* MAPLIBRE GL JS GIS CANVAS ENGINE */}
      <div className={`transition-all duration-300 w-full ${isPanelOpen ? 'lg:w-[70%]' : 'lg:w-full'}`}>
        <div className="relative">
          <MapLibreGisCommandCenter
            userLocation={userLocation}
            complaints={complaints}
            onSelectComplaint={onSelectComplaint}
          />

          {/* Toggle Button for Collapsible Right Command Panel */}
          <button
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            className="absolute top-4 -right-3 z-30 bg-[#0B2545] text-[#FF9933] border-2 border-white rounded-full p-1.5 shadow-xl hover:scale-110 transition-transform hidden lg:flex items-center justify-center"
            title={isPanelOpen ? "Collapse Right Panel" : "Expand Command Panel"}
          >
            {isPanelOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* COLLAPSIBLE RIGHT COMMAND PANEL */}
      {isPanelOpen && (
        <div className="w-full lg:w-[30%] shrink-0 space-y-4">
          <RightCommandPanel
            complaints={complaints}
            onSelectComplaint={onSelectComplaint}
          />
        </div>
      )}

    </div>
  );
};
