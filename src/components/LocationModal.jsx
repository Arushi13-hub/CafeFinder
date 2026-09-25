import React, { useState, useEffect } from 'react';
import { X, MapPin, Compass, Search, Check, Loader2, Globe } from 'lucide-react';
import { searchNominatimLocations } from '../utils/geo';

const EXTENDED_LOCATIONS = [
  { name: 'Raipur, Chhattisgarh', label: 'Raipur, India 📍', lat: 21.2514, lon: 81.6296 },
  { name: 'Mumbai, Maharashtra', label: 'Mumbai, India ☕', lat: 19.0760, lon: 72.8777 },
  { name: 'Bengaluru, Karnataka', label: 'Bengaluru, India 🌿', lat: 12.9716, lon: 77.5946 },
  { name: 'Delhi NCR', label: 'Delhi, India 🏛️', lat: 28.6139, lon: 77.2090 },
  { name: 'Shibuya, Tokyo', label: 'Tokyo, Japan 🌸', lat: 35.658, lon: 139.7016 },
  { name: 'Saint-Germain, Paris', label: 'Paris, France 🥐', lat: 48.8534, lon: 2.3333 },
  { name: 'Carlton, Melbourne', label: 'Melbourne, Australia 🦘', lat: -37.7997, lon: 144.9671 },
  { name: 'SoHo, New York', label: 'New York, USA 🗽', lat: 40.7233, lon: -74.003 },
];

export default function LocationModal({
  isOpen,
  onClose,
  currentLocationName,
  onSelectLocation,
  onUseGps,
  isLoading
}) {
  const [filterText, setFilterText] = useState('');
  const [nominatimResults, setNominatimResults] = useState([]);
  const [isSearchingGeocode, setIsSearchingGeocode] = useState(false);

  // Debounced Nominatim OSM Search
  useEffect(() => {
    if (!filterText || filterText.trim().length < 2) {
      setNominatimResults([]);
      setIsSearchingGeocode(false);
      return;
    }

    setIsSearchingGeocode(true);
    const timer = setTimeout(async () => {
      try {
        const results = await searchNominatimLocations(filterText);
        setNominatimResults(results);
      } catch (err) {
        console.warn('Geocoding search failed:', err);
      } finally {
        setIsSearchingGeocode(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [filterText]);

  if (!isOpen) return null;

  const filteredPresets = EXTENDED_LOCATIONS.filter((loc) =>
    loc.name.toLowerCase().includes(filterText.toLowerCase()) ||
    loc.label.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div 
        className="fixed inset-0 bg-[#0A2947]/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      <div className="relative w-full max-w-md bg-[#FAF7EE] rounded-t-[32px] sm:rounded-3xl shadow-2xl z-10 overflow-hidden border border-[#D3D4C0]/80 p-6 space-y-4 animate-modal-enter max-h-[88vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#D3D4C0]/70">
          <div>
            <h3 className="text-lg font-bold text-[#0A2947] tracking-tight">Search Any City or Area</h3>
            <p className="text-xs text-[#0A2947]/60 font-mono">Live OpenStreetMap Geocoding</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-[#FAF7EE] text-[#0A2947] flex items-center justify-center shadow-sm active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* GPS Trigger */}
        <button
          type="button"
          onClick={() => {
            onUseGps();
            onClose();
          }}
          disabled={isLoading}
          className="w-full py-3 px-4 rounded-2xl bg-[#0A2947] hover:bg-[#113c66] text-[#FAF7EE] text-xs font-semibold flex items-center justify-between shadow-md active:scale-95 transition-all"
        >
          <div className="flex items-center gap-2.5">
            <Compass className={`w-4 h-4 text-[#8B5E3C] ${isLoading ? 'animate-spin' : ''}`} />
            <span>Use Real-time GPS Location</span>
          </div>
          <span className="text-[10px] font-mono text-[#D3D4C0]">Detect &rarr;</span>
        </button>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0A2947]/45" />
          <input
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Type city, neighborhood, or landmark..."
            className="w-full h-11 pl-10 pr-9 bg-white border border-[#D3D4C0]/70 focus:border-[#8B5E3C] rounded-2xl text-xs sm:text-sm text-[#0A2947] placeholder-[#0A2947]/40 focus:outline-none shadow-sm"
          />
          {isSearchingGeocode ? (
            <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B5E3C] animate-spin" />
          ) : filterText ? (
            <button
              onClick={() => setFilterText('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5 text-[#0A2947]/40 hover:text-[#0A2947]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : null}
        </div>

        {/* Results Scroll Area */}
        <div className="overflow-y-auto space-y-3 max-h-72 no-scrollbar pt-1">
          
          {/* 1. Live Nominatim Results */}
          {nominatimResults.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8B5E3C] px-1 block">
                Found Locations (OSM)
              </span>
              {nominatimResults.map((item, idx) => (
                <button
                  key={`nom-${idx}-${item.lat}`}
                  type="button"
                  onClick={() => {
                    onSelectLocation(item);
                    onClose();
                  }}
                  className="w-full p-3 rounded-2xl flex items-center justify-between text-left bg-white hover:bg-[#F3E4C9]/40 border border-[#D3D4C0]/70 text-[#0A2947] transition-all shadow-xs group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Globe className="w-4 h-4 text-[#8B5E3C] shrink-0 group-hover:scale-110 transition-transform" />
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate text-[#0A2947]">{item.name}</div>
                      <div className="text-[10px] text-[#0A2947]/60 truncate font-mono">{item.subtitle}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-[#8B5E3C] font-semibold shrink-0 ml-2">Select &rarr;</span>
                </button>
              ))}
            </div>
          )}

          {/* 2. Preset Popular Roastery Capitals */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0A2947]/50 px-1 block">
              Popular Coffee Hubs
            </span>
            {filteredPresets.map((loc) => {
              const isSelected = currentLocationName?.toLowerCase().includes(loc.name.split(',')[0].toLowerCase());
              return (
                <button
                  key={loc.name}
                  type="button"
                  onClick={() => {
                    onSelectLocation(loc);
                    onClose();
                  }}
                  className={`w-full p-3 rounded-2xl flex items-center justify-between text-left transition-all ${
                    isSelected
                      ? 'bg-[#F3E4C9] border border-[#8B5E3C] font-bold text-[#0A2947]'
                      : 'bg-white hover:bg-white/80 border border-[#D3D4C0]/50 text-[#0A2947]/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin className={`w-4 h-4 ${isSelected ? 'text-[#8B5E3C]' : 'text-[#0A2947]/40'}`} />
                    <div>
                      <div className="text-xs font-semibold">{loc.label}</div>
                      <div className="text-[10px] text-[#0A2947]/60 font-mono">{loc.name}</div>
                    </div>
                  </div>

                  {isSelected && <Check className="w-4 h-4 text-[#8B5E3C]" />}
                </button>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
