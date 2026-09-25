import React, { useState } from 'react';
import { 
  Heart, 
  MapPin, 
  Footprints, 
  Car, 
  Navigation, 
  Star, 
  Wifi, 
  Trees, 
  Dog, 
  ShoppingBag,
  ArrowUpRight
} from 'lucide-react';
import { estimateWalkTime, estimateDriveTime } from '../utils/geo';

const BOUTIQUE_PHOTOS = [
  'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1509785307050-d4066910ec1e?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=600&q=80',
];

export default function CafeCard({ 
  cafe, 
  index, 
  isFavorite, 
  onToggleFavorite, 
  onSelect,
  userCoords
}) {
  const [popping, setPopping] = useState(false);

  const photoIndex = Math.abs(
    (cafe.name || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), index)
  ) % BOUTIQUE_PHOTOS.length;
  const photoUrl = BOUTIQUE_PHOTOS[photoIndex];
  const rating = (4.6 + (photoIndex % 4) * 0.1).toFixed(1);

  const isApple = typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent);
  const directionsUrl = userCoords
    ? isApple
      ? `https://maps.apple.com/?saddr=${userCoords.lat},${userCoords.lon}&daddr=${cafe.lat},${cafe.lon}&dirflg=w`
      : `https://www.google.com/maps/dir/?api=1&origin=${userCoords.lat},${userCoords.lon}&destination=${cafe.lat},${cafe.lon}&travelmode=walking`
    : isApple
      ? `https://maps.apple.com/?daddr=${cafe.lat},${cafe.lon}&dirflg=w`
      : `https://www.google.com/maps/dir/?api=1&destination=${cafe.lat},${cafe.lon}&travelmode=walking`;

  const walkEta = cafe.walkTime || estimateWalkTime(cafe.distanceKm);
  const driveEta = cafe.driveTime || estimateDriveTime(cafe.distanceKm);
  const animationDelay = `${Math.min(index * 60, 600)}ms`;

  const handleHeartClick = (e) => {
    e.stopPropagation();
    setPopping(true);
    setTimeout(() => setPopping(false), 380);
    onToggleFavorite(cafe.id);
  };

  return (
    <div
      style={{ animationDelay }}
      onClick={() => onSelect(cafe)}
      className="card-boutique-cream card-cascade-enter p-5 flex flex-col justify-between group cursor-pointer"
    >
      <div>
        {/* Photo Banner with Rating & Favorite Button */}
        <div className="relative w-full h-44 rounded-2xl overflow-hidden mb-4 bg-[#0A2947]/10 shadow-sm">
          <img
            src={photoUrl}
            alt={cafe.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Rating Badge */}
          <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-full bg-[#0A2947]/85 backdrop-blur-md text-[#F3E4C9] text-xs font-mono font-bold flex items-center gap-1 shadow-md">
            <Star className="w-3 h-3 fill-[#8B5E3C] text-[#8B5E3C]" />
            <span>{rating}</span>
          </div>

          {/* Heart Favorite Button */}
          <button
            type="button"
            onClick={handleHeartClick}
            className={`absolute top-2.5 right-2.5 p-2 rounded-full bg-[#F3E4C9]/90 backdrop-blur-md transition-transform duration-200 shadow-md ${
              popping ? 'animate-pop' : ''
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Save cafe'}
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isFavorite
                  ? 'fill-[#8B5E3C] text-[#8B5E3C]'
                  : 'text-[#0A2947]/60 hover:text-[#8B5E3C]'
              }`}
            />
          </button>
        </div>

        {/* Cafe Information */}
        <div className="mb-3">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="text-lg font-bold tracking-tight text-[#0A2947] truncate group-hover:text-[#8B5E3C] transition-colors">
              {cafe.name}
            </h3>
            <span className="text-xs font-mono text-[#0A2947]/70 font-semibold shrink-0">
              {cafe.formattedDistance}
            </span>
          </div>

          {/* Commute Tokens: Walk & Drive */}
          <div className="flex items-center gap-2 text-xs font-mono text-[#0A2947]/80 mb-2">
            <span className="font-bold text-[#8B5E3C] flex items-center gap-1">
              <Footprints className="w-3.5 h-3.5" />
              <span>{walkEta}</span>
            </span>
            <span>&bull;</span>
            <span className="text-[#0A2947]/60 flex items-center gap-1">
              <Car className="w-3.5 h-3.5" />
              <span>{driveEta}</span>
            </span>
          </div>

          {/* Address */}
          <div className="flex items-start gap-1.5 text-xs text-[#0A2947]/75 line-clamp-1 mb-3">
            <MapPin className="w-3.5 h-3.5 text-[#8B5E3C] mt-0.5 shrink-0" />
            <span className="truncate">
              {cafe.address || `${cafe.lat.toFixed(4)}, ${cafe.lon.toFixed(4)}`}
            </span>
          </div>

          {/* Vibe Badges Row */}
          <div className="flex flex-wrap items-center gap-1.5">
            {cafe.workFriendly && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-semibold bg-[#0A2947]/08 text-[#0A2947] border border-[#0A2947]/12">
                ⚡ Outlets
              </span>
            )}
            {cafe.outdoorSeating && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-semibold bg-[#0A2947]/08 text-[#0A2947] border border-[#0A2947]/12">
                🌿 Patio
              </span>
            )}
            {cafe.petFriendly && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-semibold bg-[#0A2947]/08 text-[#0A2947] border border-[#0A2947]/12">
                🐾 Pets
              </span>
            )}
            {cafe.takeaway && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-semibold bg-[#0A2947]/08 text-[#0A2947] border border-[#0A2947]/12">
                🥐 Bakery
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Action Row */}
      <div className="pt-3.5 border-t border-[#D3D4C0]/70 flex items-center justify-between gap-3 mt-auto">
        <span className="text-xs font-semibold text-[#0A2947]/80 group-hover:text-[#0A2947] flex items-center gap-1 transition-colors">
          <span>Details</span>
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>

        {/* Clean "Navigate" CTA Button in #8B5E3C */}
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="px-4 py-2 rounded-full bg-[#8B5E3C] hover:bg-[#734c2f] text-[#F3E4C9] text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 shadow-md active:scale-95"
        >
          <span>Navigate</span>
          <Navigation className="w-3 h-3 text-[#F3E4C9]" />
        </a>
      </div>
    </div>
  );
}
