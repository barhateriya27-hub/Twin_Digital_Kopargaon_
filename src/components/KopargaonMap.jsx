import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, AlertTriangle, CheckCircle2, Shield, Info, Radio, Layers, Navigation } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const KopargaonMap = ({ onSelectComplaint }) => {
  const { complaints } = useApp();
  const [selectedWard, setSelectedWard] = useState(null);
  const [hoveredPin, setHoveredPin] = useState(null);

  // Kopargaon 28 Ward SVG Grid Coordinates simulation
  const wardNodes = [
    { id: 1, name: 'Ward 1 - Sai Baba Temple Corridor', x: 220, y: 110, health: 96 },
    { id: 2, name: 'Ward 2 - MSRTC Central Bus Stand', x: 340, y: 130, health: 88 },
    { id: 3, name: 'Ward 3 - Market Yard & Ganj Bazaar', x: 440, y: 150, health: 85 },
    { id: 4, name: 'Ward 4 - Station Road & High School', x: 180, y: 220, health: 74 },
    { id: 5, name: 'Ward 5 - Sai Nagar Residential', x: 280, y: 240, health: 92 },
    { id: 6, name: 'Ward 6 - Subhash Road Commercial', x: 380, y: 260, health: 89 },
    { id: 7, name: 'Ward 7 - Subhash Market South', x: 480, y: 280, health: 78 },
    { id: 8, name: 'Ward 8 - Tilak Nagar', x: 140, y: 320, health: 94 },
    { id: 9, name: 'Ward 9 - Godavari North Bank', x: 260, y: 340, health: 91 },
    { id: 10, name: 'Ward 10 - Civil Hospital Zone', x: 360, y: 360, health: 95 },
    { id: 11, name: 'Ward 11 - Godavari South Bank', x: 460, y: 380, health: 82 },
    { id: 12, name: 'Ward 12 - Godavari Bridge Sector', x: 560, y: 400, health: 70 },
    { id: 13, name: 'Ward 13 - Industrial Estate West', x: 120, y: 440, health: 90 },
    { id: 14, name: 'Ward 14 - Industrial Estate East', x: 220, y: 460, health: 87 },
    { id: 15, name: 'Ward 15 - Sugar Factory Corridor', x: 320, y: 480, health: 93 },
    { id: 16, name: 'Ward 16 - Shirdi Highway Intersection', x: 420, y: 500, health: 88 },
    { id: 17, name: 'Ward 17 - Rural Outskirts North', x: 520, y: 520, health: 96 },
    { id: 18, name: 'Ward 18 - Bypass Highway Belt', x: 620, y: 540, health: 84 }
  ];

  // Map complaints to map coordinates
  const pins = complaints.map((c, i) => {
    const wardNode = wardNodes.find(w => w.id === c.ward) || wardNodes[i % wardNodes.length];
    return {
      ...c,
      x: wardNode.x + (i % 2 === 0 ? 15 : -15),
      y: wardNode.y + (i % 3 === 0 ? 10 : -10)
    };
  });

  return (
    <div className="bg-slate-900/90 rounded-3xl border border-cyan-500/30 p-6 relative overflow-hidden flex flex-col justify-between shadow-2xl">
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 bg-grid-cyber opacity-40 pointer-events-none"></div>

      {/* Map Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 relative z-10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <Radio className="w-4 h-4 animate-pulse text-cyan-400" /> KOPARGAON SPATIAL DIGITAL TWIN GIS MAP
          </div>
          <p className="text-xs text-slate-400">Live IoT sensor overlays, ward boundary vectors & complaint markers</p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Normal
          </span>
          <span className="flex items-center gap-1 text-amber-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Medium
          </span>
          <span className="flex items-center gap-1 text-rose-400">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span> Critical
          </span>
        </div>
      </div>

      {/* SVG Map Container */}
      <div className="relative w-full h-[420px] bg-slate-950/90 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center">
        {/* Animated Radar Line */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="w-full h-full border border-cyan-500/20 rounded-full animate-ping"></div>
        </div>

        <svg viewBox="0 0 750 600" className="w-full h-full cursor-grab">
          {/* Godavari River SVG Path */}
          <path
            d="M 50 320 Q 200 370, 380 340 T 700 420"
            fill="none"
            stroke="#0284c7"
            strokeWidth="24"
            opacity="0.3"
          />
          <path
            d="M 50 320 Q 200 370, 380 340 T 700 420"
            fill="none"
            stroke="#00f0ff"
            strokeWidth="3"
            strokeDasharray="8,6"
            opacity="0.8"
          />
          <text x="540" y="440" fill="#00f0ff" fontSize="12" fontFamily="monospace" opacity="0.7">
            ~ GODAVARI RIVER ~
          </text>

          {/* Ward Polygon Boundaries */}
          {wardNodes.map((w) => (
            <g key={w.id} className="cursor-pointer" onClick={() => setSelectedWard(w)}>
              <circle
                cx={w.x}
                cy={w.y}
                r="35"
                fill={selectedWard?.id === w.id ? 'rgba(0, 240, 255, 0.15)' : 'rgba(15, 23, 42, 0.6)'}
                stroke={w.health < 80 ? '#f43f5e' : w.health < 90 ? '#f59e0b' : '#10b981'}
                strokeWidth="1.5"
                strokeDasharray={w.health < 80 ? '3,3' : 'none'}
              />
              <text
                x={w.x}
                y={w.y + 4}
                textAnchor="middle"
                fill="#94a3b8"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
              >
                W{w.id}
              </text>
            </g>
          ))}

          {/* Interactive Incident Pins */}
          {pins.map((pin) => {
            const isSelected = hoveredPin?.id === pin.id;
            const pinColor = pin.priority === 'Critical' ? '#f43f5e' : pin.priority === 'High' ? '#f97316' : '#3b82f6';
            return (
              <g
                key={pin.id}
                className="cursor-pointer transition-transform duration-300"
                onMouseEnter={() => setHoveredPin(pin)}
                onMouseLeave={() => setHoveredPin(null)}
                onClick={() => onSelectComplaint && onSelectComplaint(pin)}
              >
                {/* Pulsing ring for critical/high */}
                {(pin.priority === 'Critical' || pin.priority === 'High') && (
                  <circle cx={pin.x} cy={pin.y} r="14" fill={pinColor} opacity="0.3">
                    <animate attributeName="r" values="8;20;8" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
                  </circle>
                )}
                <circle cx={pin.x} cy={pin.y} r="8" fill={pinColor} stroke="#ffffff" strokeWidth="2" />
              </g>
            );
          })}
        </svg>

        {/* Hovered Pin Card Popup */}
        {hoveredPin && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-4 left-4 right-4 sm:right-auto max-w-sm glass-panel p-4 rounded-2xl border border-cyan-400/60 text-xs shadow-2xl z-20"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono font-bold text-cyan-400">{hoveredPin.id}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                hoveredPin.priority === 'Critical' ? 'bg-rose-500/20 text-rose-300' : 'bg-blue-500/20 text-blue-300'
              }`}>
                {hoveredPin.priority} Priority
              </span>
            </div>
            <h4 className="font-bold text-slate-100 mb-1">{hoveredPin.title}</h4>
            <p className="text-slate-400 text-[11px] line-clamp-1 mb-2">{hoveredPin.locationName}</p>
            <div className="flex items-center justify-between text-[10px] text-cyan-300 pt-2 border-t border-slate-800 font-mono">
              <span>Status: {hoveredPin.status}</span>
              <span>Dept: {hoveredPin.department}</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Selected Ward Info Bar */}
      <div className="mt-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        <div>
          <span className="text-slate-400">Selected Sector: </span>
          <span className="font-bold text-cyan-400">{selectedWard ? selectedWard.name : 'Kopargaon Metropolitan District'}</span>
        </div>
        <div className="flex items-center gap-4 text-slate-300">
          <span>Health Score: <strong className="text-emerald-400">{selectedWard ? selectedWard.health : 94}/100</strong></span>
          <span>Telemetry: <strong className="text-cyan-400">Active (42ms)</strong></span>
        </div>
      </div>
    </div>
  );
};
