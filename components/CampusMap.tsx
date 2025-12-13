import React from 'react';
import { LocationStatus } from '../types';

interface CampusMapProps {
  locations: LocationStatus[];
  activeId: string;
  onSelect: (id: string) => void;
}

const CampusMap: React.FC<CampusMapProps> = ({ locations, activeId, onSelect }) => {
  // Helper to generate isometric cube paths based on 2D coordinates
  // We treat x,y as the base center point
  const getCubePath = (x: number, y: number, height: number, width: number) => {
    // Top Face
    const top = `M ${x} ${y - height} L ${x + width} ${y - height - width * 0.5} L ${x} ${y - height - width} L ${x - width} ${y - height - width * 0.5} Z`;
    // Right Face
    const right = `M ${x} ${y - height} L ${x + width} ${y - height - width * 0.5} L ${x + width} ${y - width * 0.5} L ${x} ${y} Z`;
    // Left Face
    const left = `M ${x} ${y - height} L ${x - width} ${y - height - width * 0.5} L ${x - width} ${y - width * 0.5} L ${x} ${y} Z`;
    return { top, right, left };
  };

  return (
    <div className="relative w-full h-[400px] md:h-full bg-[#050505] rounded-xl overflow-hidden border border-gray-800 shadow-2xl group select-none">
      <style>
        {`
          @keyframes breathe-red {
            0%, 100% { transform: translateY(0) scale(1); filter: drop-shadow(0 0 5px rgba(220, 38, 38, 0.3)); }
            50% { transform: translateY(-2px) scale(1.02); filter: drop-shadow(0 0 20px rgba(220, 38, 38, 0.6)); }
          }
          @keyframes pulse-green {
            0%, 100% { filter: drop-shadow(0 0 5px rgba(5, 150, 105, 0.3)); }
            50% { filter: drop-shadow(0 0 15px rgba(5, 150, 105, 0.6)); }
          }
          @keyframes particle-in {
            0% { transform: translate(20px, 20px); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translate(0, 0); opacity: 0; }
          }
          .iso-hover:hover {
             transform: translateY(-10px);
          }
        `}
      </style>

      {/* Isometric Grid Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{ 
               backgroundImage: 'linear-gradient(30deg, #333 1px, transparent 1px), linear-gradient(150deg, #333 1px, transparent 1px)',
               backgroundSize: '40px 40px',
               transform: 'perspective(500px) rotateX(60deg) scale(2)',
               transformOrigin: 'top center'
           }} 
      />
      
      {/* Decorative Floor Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      <svg className="absolute inset-0 w-full h-full preserve-3d" viewBox="0 0 100 100" preserveAspectRatio="none">
        {locations.map((loc) => {
           // Dimensions
           const isActive = activeId === loc.id;
           const isBusy = loc.status === 'Busy' || loc.status === 'Closed' || loc.status === 'Maintenance';
           const baseSize = isActive ? 5 : 4; // Width of the block
           const height = isActive ? 8 : 6;   // Height of extrusion
           
           // Coordinates (Percentage to SVG units)
           const { x, y } = loc.coordinates;
           
           const { top, right, left } = getCubePath(x, y, height, baseSize);

           return (
             <g 
                key={loc.id} 
                onClick={(e) => { e.stopPropagation(); onSelect(loc.id); }}
                className="cursor-pointer transition-all duration-500 ease-out"
                style={{ 
                    animation: isBusy ? 'breathe-red 4s infinite ease-in-out' : 'pulse-green 4s infinite ease-in-out',
                    transformOrigin: `${x}px ${y}px`
                }}
             >
                {/* Flow Particles for Open Locations */}
                {!isBusy && isActive && (
                    <g>
                        <circle cx={x} cy={y} r="0.5" fill={loc.color} style={{ animation: 'particle-in 2s infinite linear' }} />
                        <circle cx={x} cy={y} r="0.5" fill={loc.color} style={{ animation: 'particle-in 2s infinite linear 0.5s', transform: 'rotate(90deg)' }} />
                        <circle cx={x} cy={y} r="0.5" fill={loc.color} style={{ animation: 'particle-in 2s infinite linear 1s', transform: 'rotate(180deg)' }} />
                    </g>
                )}

                {/* The Cube */}
                <path d={left} fill={loc.color} fillOpacity="0.6" stroke={isActive ? "white" : "none"} strokeWidth="0.2" />
                <path d={right} fill={loc.color} fillOpacity="0.4" stroke={isActive ? "white" : "none"} strokeWidth="0.2" />
                <path d={top} fill={loc.color} fillOpacity="0.9" stroke={isActive ? "white" : "none"} strokeWidth="0.2" />
                
                {/* Active Indicator (Top Highlight) */}
                {isActive && (
                    <path d={top} fill="white" fillOpacity="0.2" className="animate-pulse" />
                )}

                {/* Shadow */}
                <ellipse cx={x} cy={y} rx={baseSize} ry={baseSize/2} fill="black" fillOpacity="0.3" filter="blur(2px)" />

                {/* Label Tag */}
                <g transform={`translate(${x}, ${y - height - baseSize - 2})`}>
                    <rect 
                        x="-10" y="-3" width="20" height="4" 
                        fill={isActive ? "white" : "black"} 
                        fillOpacity={isActive ? 1 : 0.7}
                        rx="0.5"
                    />
                    <text 
                        x="0" y="0" 
                        fontSize="2" 
                        fill={isActive ? "black" : "white"} 
                        textAnchor="middle" 
                        dominantBaseline="middle" 
                        fontFamily="monospace"
                        fontWeight="bold"
                    >
                        {loc.name.substring(0, 8)}
                    </text>
                    {/* Status Dot on Label */}
                    <circle cx="-8" cy="0" r="0.8" fill={loc.color} />
                </g>
             </g>
           );
        })}
      </svg>

      <div className="absolute bottom-4 left-4 text-[10px] font-mono text-gray-600 uppercase tracking-widest pointer-events-none">
        <span className="text-emerald-500">●</span> Live Pulse 3.0
      </div>
      
      {/* Legend */}
      <div className="absolute top-4 right-4 flex flex-col gap-1 pointer-events-none">
         <div className="flex items-center gap-1">
             <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(220,38,38,0.5)]"></div>
             <span className="text-[8px] text-gray-500 font-mono uppercase">Busy</span>
         </div>
         <div className="flex items-center gap-1">
             <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
             <span className="text-[8px] text-gray-500 font-mono uppercase">Flowing</span>
         </div>
      </div>
    </div>
  );
};

export default CampusMap;