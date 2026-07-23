import React from 'react';

export const IncidentMarker = ({ incident, x, y, isSelected, onClick, onMouseEnter, onMouseLeave }) => {
  // Determine color based on priority & status
  let color = '#2563eb'; // Default Medium (Blue)
  if (incident.status === 'Resolved') {
    color = '#10b981'; // Green
  } else if (incident.status === 'In Progress') {
    color = '#0284c7'; // Sky
  } else if (incident.priority === 'Critical') {
    color = '#ef4444'; // Red
  } else if (incident.priority === 'High') {
    color = '#f97316'; // Orange
  }

  return (
    <g
      className="cursor-pointer group"
      onClick={() => onClick(incident)}
      onMouseEnter={() => onMouseEnter(incident)}
      onMouseLeave={onMouseLeave}
    >
      {/* Outer Pulse Ring for Critical & High Pending Issues */}
      {(incident.priority === 'Critical' || incident.priority === 'High') && incident.status === 'Pending' && (
        <circle
          cx={x}
          cy={y}
          r="12"
          fill={color}
          opacity="0.25"
          className="animate-ping"
        />
      )}

      {/* Main Incident Pin Base */}
      <circle
        cx={x}
        cy={y}
        r={isSelected ? '8' : '6'}
        fill={color}
        stroke="#ffffff"
        strokeWidth={isSelected ? '2' : '1.5'}
        className="transition-all duration-150 group-hover:scale-125"
      />

      {/* Center Symbol Dot */}
      <circle
        cx={x}
        cy={y}
        r="2"
        fill="#ffffff"
      />
    </g>
  );
};
