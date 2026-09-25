import React from 'react';
import { Coffee, SearchX, RotateCcw, MapPin, Bookmark } from 'lucide-react';
import { POPULAR_LOCATIONS } from '../utils/geo';

export default function EmptyState({ 
  isSearchEmpty, 
  isFavoritesEmpty,
  onResetSearch, 
  onExpandRadius, 
  currentRadius, 
  onSelectPreset 
}) {
  return (
    <div className="w-full max-w-lg mx-auto py-12 px-6 card-harbor text-center animate-fade-in shadow-harbor-card">
      {/* Icon Badge */}
      <div className="w-12 h-12 rounded-2xl bg-[#0A2947] border border-[#D3D4C0]/25 flex items-center justify-center mx-auto mb-4 text-[#8B5E3C]">
        {isFavoritesEmpty ? (
          <Bookmark className="w-5 h-5 text-[#8B5E3C]" />
        ) : isSearchEmpty ? (
          <SearchX className="w-5 h-5 text-[#D3D4C0]" />
        ) : (
          <Coffee className="w-5 h-5 text-[#8B5E3C]" />
        )}
      </div>

      <h3 className="text-lg font-semibold text-[#F3E4C9] mb-1.5 tracking-tight">
        {isFavoritesEmpty 
          ? 'No saved cafes yet' 
          : isSearchEmpty 
            ? 'No matching roasteries found' 
            : `No cafes registered within ${currentRadius}m`}
      </h3>

      <p className="text-xs text-[#D3D4C0] max-w-sm mx-auto mb-6 leading-relaxed">
        {isFavoritesEmpty
          ? 'Bookmark independent roasteries, kissaten, and work spots by tapping the bookmark icon.'
          : isSearchEmpty
            ? 'Try broadening your search term, clearing amenity filters, or searching another neighborhood.'
            : 'OpenStreetMap does not report active amenity=cafe nodes within this radius. You can expand the acoustic scan to 5,000m.'}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8">
        {isFavoritesEmpty ? (
          <button
            onClick={onResetSearch}
            className="h-10 px-5 rounded-xl bg-[#8B5E3C] hover:bg-[#734c2f] text-[#F3E4C9] font-medium text-xs transition-all active:scale-[0.98] shadow-sm border border-[#F3E4C9]/25"
          >
            Show All Cafes
          </button>
        ) : isSearchEmpty ? (
          <button
            onClick={onResetSearch}
            className="inline-flex items-center gap-1.5 h-10 px-5 rounded-xl bg-[#8B5E3C] hover:bg-[#734c2f] text-[#F3E4C9] font-medium text-xs transition-all active:scale-[0.98] shadow-sm border border-[#F3E4C9]/25"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Search & Filters</span>
          </button>
        ) : (
          <button
            onClick={onExpandRadius}
            className="h-10 px-5 rounded-xl bg-[#8B5E3C] hover:bg-[#734c2f] text-[#F3E4C9] font-medium text-xs transition-all active:scale-[0.98] shadow-sm border border-[#F3E4C9]/25"
          >
            Expand Radius to 5,000m
          </button>
        )}
      </div>

      {/* Suggested Coffee Capitals */}
      <div className="pt-5 border-t border-[#D3D4C0]/15">
        <span className="text-[10px] font-mono uppercase tracking-wider text-[#D3D4C0]/80 block mb-2.5">
          Or explore famous coffee capitals:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {POPULAR_LOCATIONS.slice(0, 3).map((loc) => (
            <button
              key={loc.name}
              onClick={() => onSelectPreset(loc)}
              className="p-2.5 rounded-xl bg-[#0A2947] hover:bg-[#113c66] border border-[#D3D4C0]/15 hover:border-[#F3E4C9]/35 text-left transition-all"
            >
              <div className="flex items-center gap-1.5 text-xs font-medium text-[#F3E4C9]">
                <MapPin className="w-3 h-3 text-[#8B5E3C]" />
                <span className="truncate">{loc.label}</span>
              </div>
              <div className="text-[10px] font-mono text-[#D3D4C0]/70 truncate">{loc.name}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
