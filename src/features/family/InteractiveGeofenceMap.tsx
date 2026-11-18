import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Layers, MapPin, Navigation, Home, Shield, RefreshCw } from 'lucide-react';

interface InteractiveGeofenceMapProps {
  safeZoneRadius: number;
  elderName?: string;
  onUpdateRadius?: (r: number) => void;
}

// Coordinate anchors for Jorhat / Dispur elder residence
const HOME_COORDS: [number, number] = [26.7509, 94.2037]; // Jorhat, Assam
const ELDER_COORDS: [number, number] = [26.7525, 94.2062]; // ~320m Northeast from home (Inside zone)

interface Landmark {
  id: string;
  name: string;
  type: string;
  coords: [number, number];
  desc: string;
}

const LANDMARKS: Landmark[] = [
  {
    id: 'namghar',
    name: 'Jorhat Namghar (Prayer Hall)',
    type: 'Cultural & Spiritual',
    coords: [26.7495, 94.2015],
    desc: 'Frequent morning walk destination. Quiet, shaded path.',
  },
  {
    id: 'dispensary',
    name: 'Local Care Dispensary & Pharmacy',
    type: 'Medical Assistance',
    coords: [26.7538, 94.2018],
    desc: 'Primary clinic & medicine pickup point within safe perimeter.',
  },
  {
    id: 'park',
    name: 'Tea Garden Walking Park',
    type: 'Recreation & Fresh Air',
    coords: [26.7482, 94.2075],
    desc: 'Scenic open ground where elder performs morning light stretching.',
  },
];

export const InteractiveGeofenceMap: React.FC<InteractiveGeofenceMapProps> = ({
  safeZoneRadius,
  elderName = 'Bimala aita',
  onUpdateRadius,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const circleRef = useRef<L.Circle | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const [mapTheme, setMapTheme] = useState<'warm' | 'dark' | 'standard'>('warm');
  const [selectedPin, setSelectedPin] = useState<string | null>('elder');

  // Tile layer URL sets
  const tileProviders = {
    warm: {
      url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
    },
    dark: {
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
    },
    standard: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Leaflet Map
    const map = L.map(mapContainerRef.current, {
      center: HOME_COORDS,
      zoom: 15,
      zoomControl: true,
      attributionControl: false,
    });
    mapInstanceRef.current = map;

    // Add Base Tile Layer
    const activeTiles = tileProviders[mapTheme];
    const tileLayer = L.tileLayer(activeTiles.url, {
      maxZoom: 19,
      attribution: activeTiles.attribution,
    }).addTo(map);
    tileLayerRef.current = tileLayer;

    // Geofence Circle Boundary
    const geofenceCircle = L.circle(HOME_COORDS, {
      radius: safeZoneRadius,
      color: '#3F7455',
      weight: 2,
      dashArray: '6, 6',
      fillColor: '#3F7455',
      fillOpacity: 0.12,
    }).addTo(map);
    circleRef.current = geofenceCircle;

    // Custom Home Marker
    const homeIcon = L.divIcon({
      className: 'custom-map-icon',
      html: `
        <div style="background:#22403A; color:#FBF7EE; width:34px; height:34px; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 3px 8px rgba(0,0,0,0.3); border:2px solid white; cursor:pointer;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17],
    });

    const homeMarker = L.marker(HOME_COORDS, { icon: homeIcon }).addTo(map);
    homeMarker.bindPopup(`
      <div style="font-family:'Baloo 2', sans-serif; font-size:12px; color:#221F1B;">
        <strong style="color:#22403A; font-size:13px;">Home Anchor</strong><br/>
        Central Geofence Residence Point
      </div>
    `);

    // Custom Elder Marker with Animated Pulse Ring
    const elderIcon = L.divIcon({
      className: 'custom-map-icon',
      html: `
        <div style="position:relative; width:40px; height:40px; display:flex; align-items:center; justify-content:center;">
          <div style="position:absolute; width:100%; height:100%; border-radius:50%; background:rgba(189,91,59,0.3); animation: leafletPulse 2s infinite ease-out;"></div>
          <div style="position:relative; background:#BD5B3B; color:white; width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 3px 10px rgba(189,91,59,0.45); border:2.5px solid white; z-index:2; cursor:pointer;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    const elderMarker = L.marker(ELDER_COORDS, { icon: elderIcon }).addTo(map);
    elderMarker.bindPopup(`
      <div style="font-family:'Baloo 2', sans-serif; font-size:12px; color:#221F1B;">
        <strong style="color:#BD5B3B; font-size:13px;">${elderName} (Active)</strong><br/>
        Distance from Home: <strong>~320m</strong><br/>
        Status: <span style="color:#3F7455; font-weight:bold;">Inside Safe Perimeter</span>
      </div>
    `);

    // Add Landmark Pins
    LANDMARKS.forEach((lm) => {
      const lmIcon = L.divIcon({
        className: 'custom-map-icon',
        html: `
          <div style="background:#E2A33D; color:#221F1B; width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 2px 6px rgba(0,0,0,0.25); border:2px solid white; cursor:pointer;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const lmMarker = L.marker(lm.coords, { icon: lmIcon }).addTo(map);
      lmMarker.bindPopup(`
        <div style="font-family:'Baloo 2', sans-serif; font-size:12px; color:#221F1B;">
          <strong style="color:#22403A; font-size:13px;">${lm.name}</strong><br/>
          <span style="color:#8C837B; font-size:11px;">${lm.type}</span><br/>
          <p style="margin-top:4px; font-size:11px; line-height:1.3;">${lm.desc}</p>
        </div>
      `);
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update dynamic geofence radius circle smoothly
  useEffect(() => {
    if (circleRef.current) {
      circleRef.current.setRadius(safeZoneRadius);
    }
  }, [safeZoneRadius]);

  // Update Tile Theme
  const handleThemeChange = (theme: 'warm' | 'dark' | 'standard') => {
    setMapTheme(theme);
    if (mapInstanceRef.current && tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
      const activeTiles = tileProviders[theme];
      const newLayer = L.tileLayer(activeTiles.url, {
        maxZoom: 19,
        attribution: activeTiles.attribution,
      }).addTo(mapInstanceRef.current);
      tileLayerRef.current = newLayer;
    }
  };

  const handleCenterElder = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(ELDER_COORDS, 16, { animate: true });
    }
  };

  const handleCenterHome = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(HOME_COORDS, 15, { animate: true });
    }
  };

  return (
    <div className="relative rounded-2xl overflow-hidden border border-[#E6DAB9] bg-white shadow-xs">
      {/* Map Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-[#FAF6EE] border-b border-[#E6DAB9] text-xs font-baloo">
        <div className="flex items-center gap-2 text-[#22403A] font-bold">
          <Navigation className="w-4 h-4 text-[#BD5B3B]" />
          <span>Interactive OpenStreetMap • Live Safe-Zone Geofence</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Tile Layer Selector */}
          <div className="flex items-center bg-white border border-[#E6DAB9] rounded-lg p-0.5">
            <button
              onClick={() => handleThemeChange('warm')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                mapTheme === 'warm' ? 'bg-[#22403A] text-white' : 'text-[#665F51] hover:text-[#221F1B]'
              }`}
            >
              Warm
            </button>
            <button
              onClick={() => handleThemeChange('dark')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                mapTheme === 'dark' ? 'bg-[#22403A] text-white' : 'text-[#665F51] hover:text-[#221F1B]'
              }`}
            >
              Dark
            </button>
            <button
              onClick={() => handleThemeChange('standard')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                mapTheme === 'standard' ? 'bg-[#22403A] text-white' : 'text-[#665F51] hover:text-[#221F1B]'
              }`}
            >
              OSM
            </button>
          </div>

          <button
            onClick={handleCenterElder}
            className="flex items-center gap-1 px-3 py-1 bg-white hover:bg-[#F1E7CE] border border-[#E6DAB9] rounded-lg text-[#BD5B3B] font-bold text-[11px] transition-colors cursor-pointer"
            title="Focus on Elder Live Location"
          >
            <span className="w-2 h-2 rounded-full bg-[#BD5B3B] animate-ping"></span>
            Locate {elderName.split(' ')[0]}
          </button>

          <button
            onClick={handleCenterHome}
            className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-[#F1E7CE] border border-[#E6DAB9] rounded-lg text-[#22403A] font-bold text-[11px] transition-colors cursor-pointer"
            title="Center on Home Anchor"
          >
            <Home className="w-3.5 h-3.5" />
            Home
          </button>
        </div>
      </div>

      {/* Map Leaflet Container */}
      <div className="relative w-full h-[360px] z-10">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Pulse Ring Keyframe Injector */}
        <style>{`
          @keyframes leafletPulse {
            0% { transform: scale(0.6); opacity: 0.8; }
            100% { transform: scale(1.6); opacity: 0; }
          }
          .custom-map-icon {
            background: none !important;
            border: none !important;
          }
        `}</style>

        {/* Floating Map Legend Overlay */}
        <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-xs border border-[#E6DAB9] rounded-xl p-2.5 shadow-md text-[11px] font-baloo text-[#221F1B] space-y-1.5 max-w-[220px]">
          <div className="font-bold text-[#22403A] text-xs flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-[#3F7455]" />
            Active Geofence Legend
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#BD5B3B] border border-white shrink-0"></span>
            <span>{elderName} (~320m from home)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#22403A] border border-white shrink-0"></span>
            <span>Residence (Home Anchor)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#E2A33D] border border-white shrink-0"></span>
            <span>Key Landmarks (Namghar, Clinic)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-1 border-t-2 border-dashed border-[#3F7455] shrink-0"></span>
            <span>{safeZoneRadius}m Boundary Perimeter</span>
          </div>
        </div>
      </div>
    </div>
  );
};
