import React from 'react';
import { Heart, Star, Footprints, Navigation, MapPin, ChevronRight, Compass, ArrowRight } from 'lucide-react';
import { estimateWalkTime } from '../utils/geo';

const SPECIALTY_IMAGES = [
  'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=700&q=80',
];

export default function SavedView({
  cafes = [],
  favorites = [],
  onToggleFavorite,
  onSelectCafe,
  onNavigateToExplore,
  userCoords
}) {
  const savedCafes = cafes.filter((c) => favorites.includes(c.id));

  return (
    <div className="w-full min-h-screen bg-[#FAF7EE] text-[#0A2947] pb-28 pt-4 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#D3D4C0]/70">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0A2947] flex items-center gap-2">
            <span>Saved Corners</span>
            <Heart className="w-5 h-5 fill-[#8B5E3C] text-[#8B5E3C]" />
          </h1>
          <p className="text-xs text-[#0A2947]/65 font-mono mt-0.5">
            {savedCafes.length} {savedCafes.length === 1 ? 'place' : 'places'} bookmarked in local collection
          </p>
        </div>

        <button
          onClick={onNavigateToExplore}
          className="text-xs font-semibold text-[#8B5E3C] hover:text-[#724c30] flex items-center gap-1 transition-colors"
        >
          <span>Find more</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Grid or Empty State */}
      {savedCafes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {savedCafes.map((cafe, index) => {
            const photoIndex = Math.abs(
              (cafe.name || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), index)
            ) % SPECIALTY_IMAGES.length;
            const photoUrl = SPECIALTY_IMAGES[photoIndex];
            const rating = (4.7 + (photoIndex % 3) * 0.1).toFixed(1);
            const walkEta = cafe.walkTime || estimateWalkTime(cafe.distanceKm);

            return (
              <div
                key={cafe.id}
                onClick={() => onSelectCafe(cafe)}
                className="bg-white rounded-3xl p-4 border border-[#D3D4C0]/60 shadow-md shadow-[#0A2947]/05 hover:shadow-xl hover:border-[#8B5E3C]/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between group active:scale-[0.98]"
              >
                <div>
                  <div className="relative w-full h-44 rounded-2xl overflow-hidden mb-3 bg-[#0A2947]/08">
                    <img
                      src={photoUrl}
                      alt={cafe.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    <div className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-[#0A2947]/85 backdrop-blur-sm text-[#FAF7EE] text-[11px] font-mono font-bold flex items-center gap-1 shadow-sm">
                      <Star className="w-3 h-3 fill-[#8B5E3C] text-[#8B5E3C]" />
                      <span>{rating}</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(cafe.id);
                      }}
                      className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 backdrop-blur-sm text-[#8B5E3C] shadow-md transition-transform active:scale-90"
                      title="Remove from saved"
                    >
                      <Heart className="w-4 h-4 fill-[#8B5E3C]" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-[#0A2947] tracking-tight truncate group-hover:text-[#8B5E3C] transition-colors">
                      {cafe.name}
                    </h4>

                    <div className="flex items-center gap-2 text-xs font-semibold text-[#8B5E3C]">
                      <span className="flex items-center gap-1">
                        <Footprints className="w-3.5 h-3.5" />
                        <span>{walkEta}</span>
                      </span>
                      <span className="text-[#0A2947]/30">•</span>
                      <span className="font-mono text-[11px] text-[#0A2947]/60 font-normal">
                        {cafe.formattedDistance}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#0A2947]/65 truncate">
                      {cafe.address || `${cafe.lat.toFixed(3)}, ${cafe.lon.toFixed(3)}`}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#D3D4C0]/50 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono text-[#0A2947]/60 truncate">
                    {cafe.cuisine ? cafe.cuisine.replace(/;/g, ', ') : 'Artisan Espresso'}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCafe(cafe);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#8B5E3C] hover:bg-[#724c30] text-white text-xs font-semibold flex items-center gap-1 transition-colors shadow-sm shrink-0 active:scale-95"
                  >
                    <span>View</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-10 text-center bg-white rounded-3xl border border-[#D3D4C0]/70 space-y-4 max-w-md mx-auto my-12 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-[#FAF7EE] border border-[#D3D4C0]/60 flex items-center justify-center mx-auto text-[#8B5E3C]">
            <Heart className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-[#0A2947]">No saved cafes yet</h3>
            <p className="text-xs text-[#0A2947]/70 leading-relaxed">
              Tap the heart icon on any cafe card on the Home discovery feed or Map to curate your private collection.
            </p>
          </div>
          <button
            onClick={onNavigateToExplore}
            className="px-5 py-2.5 rounded-full bg-[#0A2947] hover:bg-[#113c66] text-[#FAF7EE] text-xs font-semibold inline-flex items-center gap-2 shadow-md transition-all active:scale-95"
          >
            <span>Explore Cafes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
