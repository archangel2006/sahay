import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  ShieldCheck,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Compass,
  Layers,
  Sparkles,
  Home,
  Heart,
} from 'lucide-react';

interface SafeZoneMapProps {
  radius: number;
  onUpdateRadius: (r: number) => void;
  elderName?: string;
  showToast: (msg: string, icon?: string) => void;
  isCompanion?: boolean;
}

export const SafeZoneMap: React.FC<SafeZoneMapProps> = ({
  radius,
  onUpdateRadius,
  elderName = 'Bimala aita',
  showToast,
  isCompanion = false,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [mapStyle, setMapStyle] = useState<'streets' | 'satellite'>('streets');
  const [isSimulatingExcursion, setIsSimulatingExcursion] = useState(false);

  // Geographic anchor: Jorhat, Assam (26.7509° N, 94.2037° E)
  const homeCoords = { lat: '26.7509° N', lng: '94.2037° E', x: 250, y: 160 };

  // Elder position: 210m away normal (x: 290, y: 135), or 680m away when excursion simulated (x: 410, y: 70)
  const elderPos = isSimulatingExcursion
    ? { x: 395, y: 75, distMeters: 720, label: 'Outside Boundary (Near Tea Trail)' }
    : { x: 290, y: 135, distMeters: 210, label: 'Near Jorhat Namghar (Inside Zone)' };

  const isElderSafe = elderPos.distMeters <= radius;

  // Scale map radius to SVG coordinate space
  // Base SVG width 500, height 320. 500m corresponds to ~90px radius in SVG units
  const svgRadius = Math.max(35, Math.min(180, (radius / 1500) * 180));

  const landmarks = [
    { name: 'Jorhat Namghar', x: 295, y: 125, type: 'culture' },
    { name: 'Tarajan Market', x: 195, y: 220, type: 'market' },
    { name: 'PHC Dispensary', x: 170, y: 110, type: 'health' },
    { name: 'Tea Garden Trail', x: 385, y: 85, type: 'nature' },
  ];

  const handleZoomIn = () => setZoomLevel((z) => Math.min(1.5, Number((z + 0.2).toFixed(1))));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(0.8, Number((z - 0.2).toFixed(1))));
  const handleResetZoom = () => setZoomLevel(1);

  const toggleSimulate = () => {
    const next = !isSimulatingExcursion;
    setIsSimulatingExcursion(next);
    if (next) {
      showToast('Boundary Alert simulated: Elder stepped beyond 500m zone', 'alert');
    } else {
      showToast('Elder location updated: Returned safely within perimeter', 'check');
    }
  };

  return (
    <div className="bg-white border border-[#E6DAB9] rounded-2xl p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="font-baloo font-bold text-sm text-[#22403A] flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#BD5B3B]" />
            <span>Interactive Geofence &amp; Safe-Zone Map</span>
          </h3>
          <p className="text-xs text-[#665F51]">
            Jorhat, Assam ({homeCoords.lat}, {homeCoords.lng}) · Ambient GPS telemetry
          </p>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          {isElderSafe ? (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E4ECE7] text-[#3F7455] font-baloo font-bold text-xs border border-[#3F7455]/30">
              <ShieldCheck className="w-3.5 h-3.5 text-[#3F7455]" />
              <span>Within Safe Zone ({elderPos.distMeters}m from Home)</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5E1D6] text-[#BD5B3B] font-baloo font-bold text-xs border border-[#BD5B3B]/40 animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5 text-[#BD5B3B]" />
              <span>Outside Safe Boundary ({elderPos.distMeters}m from Home)</span>
            </span>
          )}
        </div>
      </div>

      {/* Map Container */}
      <div className="relative rounded-2xl overflow-hidden border border-[#E6DAB9] bg-[#EBF1ED]">
        {/* Map Top Controls Overlay */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-xl border border-[#E6DAB9] text-[11px] font-baloo font-bold text-[#22403A] shadow-xs">
          <MapPin className="w-3.5 h-3.5 text-[#BD5B3B]" />
          <span>Gar-Ali &amp; Tarajan Ward, Jorhat</span>
        </div>

        {/* View mode toggle & Zoom controls */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-white/90 backdrop-blur-md p-1 rounded-xl border border-[#E6DAB9] shadow-xs">
          <button
            type="button"
            onClick={() => setMapStyle((s) => (s === 'streets' ? 'satellite' : 'streets'))}
            className="p-1.5 rounded-lg hover:bg-[#F1E7CE] text-[#665F51] font-baloo font-bold text-[10px] flex items-center gap-1 cursor-pointer"
            title="Toggle Map Style"
          >
            <Layers className="w-3 h-3" />
            <span className="capitalize">{mapStyle}</span>
          </button>
          <div className="w-[1px] h-4 bg-[#E6DAB9] mx-0.5" />
          <button
            type="button"
            onClick={handleZoomIn}
            className="p-1.5 rounded-lg hover:bg-[#F1E7CE] text-[#22403A] cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-1.5 rounded-lg hover:bg-[#F1E7CE] text-[#22403A] cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleResetZoom}
            className="p-1.5 rounded-lg hover:bg-[#F1E7CE] text-[#665F51] cursor-pointer"
            title="Reset View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* SVG Interactive Canvas */}
        <svg
          viewBox="0 0 500 320"
          className="w-full h-72 sm:h-80 block transition-transform duration-300"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
        >
          <defs>
            <radialGradient id="safeZoneGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3F7455" stopOpacity="0.18" />
              <stop offset="85%" stopColor="#3F7455" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#3F7455" stopOpacity="0.25" />
            </radialGradient>
            <pattern id="streetGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#DCE5DF" strokeWidth="1" />
            </pattern>
          </defs>

          {/* Base Background: Streets or Satellite terrain */}
          <rect
            width="500"
            height="320"
            fill={mapStyle === 'streets' ? '#F7F6F0' : '#2A3C33'}
          />
          <rect width="500" height="320" fill="url(#streetGrid)" opacity={mapStyle === 'streets' ? 0.6 : 0.15} />

          {/* Bhogdoi River Bend (North) */}
          <path
            d="M 0 35 Q 120 70 240 30 T 500 45"
            fill="none"
            stroke={mapStyle === 'streets' ? '#B8D5E5' : '#1D3B47'}
            strokeWidth="14"
            opacity="0.8"
          />
          <text
            x="70"
            y="42"
            fill="#3E4F74"
            fontSize="8"
            fontFamily="Baloo 2"
            fontWeight="bold"
            letterSpacing="1"
            opacity="0.7"
          >
            BHOGDOI RIVER
          </text>

          {/* Road networks */}
          <path d="M 0 160 Q 250 170 500 150" fill="none" stroke="#E6DAB9" strokeWidth="8" />
          <path d="M 0 160 Q 250 170 500 150" fill="none" stroke="#FFFFFF" strokeWidth="5" />
          <path d="M 250 0 L 250 320" fill="none" stroke="#E6DAB9" strokeWidth="7" />
          <path d="M 250 0 L 250 320" fill="none" stroke="#FFFFFF" strokeWidth="4" />
          <path d="M 120 0 Q 180 180 190 320" fill="none" stroke="#E6DAB9" strokeWidth="5" />

          {/* Tea Garden Patch (East) */}
          <path
            d="M 340 50 Q 420 40 480 80 T 460 220 T 360 160 Z"
            fill={mapStyle === 'streets' ? '#E2ECE5' : '#203328'}
            stroke="#9FB4AC"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          <text
            x="410"
            y="130"
            fill="#3F7455"
            fontSize="9"
            fontFamily="Baloo 2"
            fontWeight="bold"
            opacity="0.7"
          >
            Tea Garden
          </text>

          {/* Safe-Zone Perimeter Circle */}
          <circle
            cx={homeCoords.x}
            cy={homeCoords.y}
            r={svgRadius}
            fill="url(#safeZoneGrad)"
            stroke="#3F7455"
            strokeWidth="2.5"
            strokeDasharray="6 4"
          />

          {/* Safe-Zone Perimeter Label */}
          <rect
            x={homeCoords.x - 38}
            y={homeCoords.y - svgRadius - 12}
            width="76"
            height="16"
            rx="8"
            fill="#22403A"
          />
          <text
            x={homeCoords.x}
            y={homeCoords.y - svgRadius - 1}
            fill="#FBF7EE"
            fontSize="8"
            fontFamily="Baloo 2"
            fontWeight="bold"
            textAnchor="middle"
          >
            {radius}m Radius
          </text>

          {/* Distance Indicator Line from Home to Elder */}
          <line
            x1={homeCoords.x}
            y1={homeCoords.y}
            x2={elderPos.x}
            y2={elderPos.y}
            stroke={isElderSafe ? '#3F7455' : '#BD5B3B'}
            strokeWidth="2"
            strokeDasharray="4 3"
          />

          {/* Landmarks */}
          {landmarks.map((lm, idx) => (
            <g key={idx}>
              <circle cx={lm.x} cy={lm.y} r="3" fill="#665F51" />
              <text
                x={lm.x + 6}
                y={lm.y + 3}
                fill="#665F51"
                fontSize="8"
                fontFamily="Baloo 2"
                fontWeight="bold"
              >
                {lm.name}
              </text>
            </g>
          ))}

          {/* Home Anchor Pin */}
          <g transform={`translate(${homeCoords.x}, ${homeCoords.y})`}>
            <circle cx="0" cy="0" r="14" fill="#22403A" opacity="0.15" />
            <circle cx="0" cy="0" r="8" fill="#22403A" stroke="#FFFFFF" strokeWidth="2" />
            <text x="0" y="18" fill="#22403A" fontSize="9" fontFamily="Baloo 2" fontWeight="bold" textAnchor="middle">
              HOME
            </text>
          </g>

          {/* Elder Live Location Pin & Radar Wave */}
          <g transform={`translate(${elderPos.x}, ${elderPos.y})`}>
            {/* Animated Radar Pulse Rings */}
            <circle cx="0" cy="0" r="18" fill="none" stroke={isElderSafe ? '#3F7455' : '#BD5B3B'} strokeWidth="1.5">
              <animate attributeName="r" values="8;24;8" dur="2.4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0;0.8" dur="2.4s" repeatCount="indefinite" />
            </circle>
            <circle cx="0" cy="0" r="8" fill={isElderSafe ? '#3F7455' : '#BD5B3B'} stroke="#FFFFFF" strokeWidth="2.5" />
            <text
              x="0"
              y="-12"
              fill={isElderSafe ? '#22403A' : '#BD5B3B'}
              fontSize="9"
              fontFamily="Baloo 2"
              fontWeight="bold"
              textAnchor="middle"
            >
              {elderName} ({elderPos.distMeters}m)
            </text>
          </g>
        </svg>

        {/* Legend Overlay at bottom */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[10px] font-baloo font-bold text-[#665F51] bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#E6DAB9]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#22403A]" />
              Home
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3F7455]" />
              Safe Perimeter
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#BD5B3B] animate-pulse" />
              Elder Live
            </span>
          </div>

          <button
            type="button"
            onClick={toggleSimulate}
            className="text-[10px] font-baloo font-bold text-[#BD5B3B] hover:underline cursor-pointer flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3" />
            <span>{isSimulatingExcursion ? 'Reset to Safe Location' : 'Simulate Excursion'}</span>
          </button>
        </div>
      </div>

      {/* Perimeter Controls & Presets */}
      <div className="mt-4 pt-4 border-t border-[#E6DAB9] space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-baloo font-bold text-[#22403A]">
            Configure Geofence Perimeter:
          </label>
          <div className="flex items-center gap-1.5">
            {[250, 500, 1000].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  onUpdateRadius(preset);
                  showToast(`Safe zone adjusted to ${preset} meters`, 'check');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-baloo font-bold transition-all cursor-pointer ${
                  radius === preset
                    ? 'bg-[#22403A] text-white shadow-xs'
                    : 'bg-[#FBF7EE] text-[#665F51] border border-[#E6DAB9] hover:border-[#22403A]'
                }`}
              >
                {preset}m
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 bg-[#FBF7EE] p-3 rounded-xl border border-[#E6DAB9]">
          <input
            type="range"
            min="200"
            max="1500"
            step="50"
            value={radius}
            onChange={(e) => onUpdateRadius(Number(e.target.value))}
            className="flex-1 accent-[#22403A] cursor-pointer"
          />
          <span className="font-baloo font-bold text-sm text-[#22403A] w-16 text-right font-mono">
            {radius} m
          </span>
        </div>
      </div>
    </div>
  );
};
