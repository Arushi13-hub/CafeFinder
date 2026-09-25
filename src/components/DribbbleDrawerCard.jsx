import React, { useState } from 'react';
import { 
  Heart, 
  MapPin, 
  Footprints, 
  Navigation, 
  Star, 
  ExternalLink,
  Users,
  Check
} from 'lucide-react';
import { 
  estimateWalkTime, 
  getOpeningStatus, 
  getCafeVibeIndex, 
  getCafePriceTier 
} from '../utils/geo';

// Curated specialty coffee images matching Chloe Lim's aesthetic
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

// Lightweight SVG fallback for coffee imagery
const FALLBACK_COFFEE_SVG = "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20200%20200%22%20fill%3D%22%23FAF7EE%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23FAF7EE%22%2F%3E%3Cpath%20d%3D%22M50%2075h70v40a35%2035%200%200%201-35%2035H85a35%2035%200%200%201-35-35V75zm70%2015h12a15%2015%200%200%201%200%2030h-12V90z%22%20fill%3D%22%238B5E3C%22%20opacity%3D%220.8%22%2F%3E%3Cpath%20d%3D%22M70%2055c0-8%206-12%206-20m18%2020c0-8%206-12%206-20m18%2020c0-8%206-12%206-20%22%20stroke%3D%22%238B5E3C%22%20stroke-width%3D%223%22%20stroke-linecap%3D%22round%22%20fill%3D%22none%22%20opacity%3D%220.6%22%2F%3E%3C%2Fsvg%3E";

export default function DribbbleDrawerCard({
  cafe,
  index,
  isActive,
  isFavorite,
  onToggleFavorite,
  onSelect,
  onGetDirections,
  userCoords,
  weather,
  userVotes = {},
  onVoteVibe,
  onMeetHere,
}) {
  const [popping, setPopping] = useState(false);
  const [showVibeMenu, setShowVibeMenu] = useState(false);

  // Deterministic photo assignment based on cafe name / ID
  const photoIndex = Math.abs(
    (cafe.name || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), index)
  ) % BOUTIQUE_PHOTOS.length;
  const photoUrl = BOUTIQUE_PHOTOS[photoIndex];

  // Deterministic rating between 4.6 and 4.9
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

  // Feature 3: Live opening hours status
  const opening = getOpeningStatus(cafe.rawTags?.opening_hours || cafe.opening_hours, cafe.id);

  // Feature 4: Crowd & Noise Level Meter ("Vibe Index")
  const vibe = getCafeVibeIndex(cafe, userVotes);

  // Feature 5: Budget / Price Tier Indicator
  const priceTier = getCafePriceTier(cafe);

  // Feature 2: Patio Recommendation Badge
  const isPatioRec = weather?.isPatioWeather && cafe.outdoorSeating;

  const handleHeartClick = (e) => {
    e.stopPropagation();
    setPopping(true);
    setTimeout(() => setPopping(false), 380);
    onToggleFavorite(cafe.id);
  };

  return (
    <div
      onClick={() => onSelect(cafe)}
      className={`w-[325px] sm:w-[370px] shrink-0 snap-center rounded-3xl p-4 sm:p-4.5 transition-all duration-300 cursor-pointer relative ${
        isActive
          ? 'bg-[#FAF7EE] text-[#0A2947] border-2 border-[#8B5E3C] shadow-xl shadow-[#0A2947]/15 scale-[1.01]'
          : 'bg-[#FAF7EE] text-[#0A2947] border border-[#D3D4C0]/70 shadow-lg shadow-[#0A2947]/8 hover:border-[#8B5E3C]/60 hover:-translate-y-0.5'
      }`}
    >
      <div className="flex gap-3 sm:gap-3.5 items-start">
        
        {/* Square Aspect Ratio Image Thumbnail: w-24 h-24 rounded-2xl object-cover */}
        <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-[#0A2947]/08 shadow-sm">
          <img
            src={photoUrl}
            alt={cafe.name}
            loading="lazy"
            decoding="async"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = FALLBACK_COFFEE_SVG;
            }}
            className="w-24 h-24 rounded-2xl object-cover transition-transform duration-500 hover:scale-105"
          />

          {/* Star Rating Badge */}
          <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded-full bg-[#0A2947]/85 backdrop-blur-sm text-[#FAF7EE] text-[10px] font-mono font-bold flex items-center gap-0.5 shadow-sm">
            <Star className="w-2.5 h-2.5 fill-[#8B5E3C] text-[#8B5E3C]" />
            <span>{rating}</span>
          </div>

          {/* Price Tier Badge in Top Left */}
          <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-[#FAF7EE]/90 backdrop-blur-sm text-[#0A2947] text-[10px] font-mono font-extrabold shadow-sm border border-[#D3D4C0]/70">
            {priceTier}
          </div>
        </div>

        {/* Cafe Information */}
        <div className="flex-1 min-w-0 flex flex-col justify-between min-h-[96px] py-0.5">
          <div>
            {/* Header: Cafe Name & Favorite Button */}
            <div className="flex items-start justify-between gap-1.5">
              <h3 className="text-sm sm:text-base font-bold tracking-tight text-[#0A2947] truncate">
                {cafe.name}
              </h3>
              
              {/* Heart Favorite */}
              <button
                type="button"
                onClick={handleHeartClick}
                className={`p-1 rounded-full transition-transform duration-200 shrink-0 ${
                  popping ? 'animate-pop' : ''
                }`}
                title={isFavorite ? 'Remove from favorites' : 'Save cafe'}
              >
                <Heart
                  className={`w-4 h-4 transition-colors ${
                    isFavorite
                      ? 'fill-[#8B5E3C] text-[#8B5E3C]'
                      : 'text-[#0A2947]/35 hover:text-[#8B5E3C]'
                  }`}
                />
              </button>
            </div>

            {/* Commute Tag: 🚶 X min walk • Ym */}
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#8B5E3C] mt-0.5">
              <span className="flex items-center gap-1">
                <Footprints className="w-3.5 h-3.5" />
                <span>{walkEta}</span>
              </span>
              <span className="text-[#0A2947]/30">•</span>
              <span className="font-mono text-[11px] text-[#0A2947]/70 font-normal">
                {cafe.formattedDistance}
              </span>
            </div>

            {/* Live Open Status & Patio Badges */}
            <div className="flex flex-wrap items-center gap-1.5 mt-1">
              {/* Feature 3: Open Now Live Status */}
              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-white border border-[#D3D4C0]/80 text-[#0A2947]">
                <span className={`w-1.5 h-1.5 rounded-full ${opening.dotColor} ${opening.isOpen ? 'animate-pulse' : ''}`} />
                <span>{opening.text}</span>
              </span>

              {/* Feature 2: Patio Recommender Badge */}
              {isPatioRec && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  🌿 Patio Day
                </span>
              )}
            </div>
          </div>

          {/* Feature 4: Interactive Vibe Index Badge */}
          <div className="pt-1.5 relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowVibeMenu(!showVibeMenu);
              }}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-medium border transition-all ${vibe.badgeClass}`}
              title="Click to vote crowd & noise level"
            >
              <span>{vibe.label}</span>
              <span className="text-[9px] opacity-70 underline ml-0.5">Vote</span>
            </button>

            {/* Interactive Vibe Voting Popover */}
            {showVibeMenu && (
              <div 
                onClick={(e) => e.stopPropagation()} 
                className="absolute left-0 bottom-full mb-1 z-30 bg-[#0A2947] text-white p-2 rounded-xl shadow-xl border border-white/20 space-y-1 w-44 animate-pop"
              >
                <div className="text-[10px] font-mono text-[#F3E4C9] font-bold pb-1 border-b border-white/10">
                  Current Vibe?
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onVoteVibe?.(cafe.id, 'quiet');
                    setShowVibeMenu(false);
                  }}
                  className="w-full text-left px-2 py-1 rounded hover:bg-white/10 text-[11px] flex items-center justify-between"
                >
                  <span>🟢 Quiet & Focused</span>
                  {userVotes[cafe.id] === 'quiet' && <Check className="w-3 h-3 text-emerald-400" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onVoteVibe?.(cafe.id, 'buzz');
                    setShowVibeMenu(false);
                  }}
                  className="w-full text-left px-2 py-1 rounded hover:bg-white/10 text-[11px] flex items-center justify-between"
                >
                  <span>🟡 Medium Buzz</span>
                  {userVotes[cafe.id] === 'buzz' && <Check className="w-3 h-3 text-amber-400" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onVoteVibe?.(cafe.id, 'lively');
                    setShowVibeMenu(false);
                  }}
                  className="w-full text-left px-2 py-1 rounded hover:bg-white/10 text-[11px] flex items-center justify-between"
                >
                  <span>🟠 Lively & Social</span>
                  {userVotes[cafe.id] === 'lively' && <Check className="w-3 h-3 text-orange-400" />}
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Card Action Row */}
      <div className="mt-2.5 pt-2 border-t border-[#D3D4C0]/60 flex items-center justify-between gap-1.5">
        <div className="flex items-center gap-1 text-xs text-[#0A2947]/70 truncate max-w-[130px]">
          <MapPin className="w-3 h-3 text-[#8B5E3C] shrink-0" />
          <span className="truncate text-[11px]">
            {cafe.address || `${cafe.lat.toFixed(4)}, ${cafe.lon.toFixed(4)}`}
          </span>
        </div>

        {/* Action Button Group: Directions + Meet Here 👥 + External Map */}
        <div className="flex items-center gap-1.5 shrink-0">
          
          {/* Feature 6: Meet Here 👥 Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onMeetHere?.(cafe);
            }}
            className="px-2.5 py-1.5 rounded-xl bg-white border border-[#D3D4C0]/90 hover:border-[#8B5E3C] text-[#0A2947] hover:text-[#8B5E3C] text-xs font-bold flex items-center gap-1 shadow-sm active:scale-95 transition-all"
            title="Share meetup invite with friends"
          >
            <Users className="w-3 h-3 text-[#8B5E3C]" />
            <span>Meet 👥</span>
          </button>

          {/* In-App Directions CTA */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onGetDirections) {
                onGetDirections(cafe);
              } else {
                window.open(directionsUrl, '_blank', 'noopener,noreferrer');
              }
            }}
            className="px-2.5 py-1.5 rounded-xl bg-[#8B5E3C] hover:bg-[#724c30] text-white text-xs font-bold flex items-center gap-1 shadow-sm active:scale-95 transition-all"
            title="View in-app walking route"
          >
            <Navigation className="w-3 h-3 fill-current" />
            <span>Directions</span>
          </button>

          {/* External Map Icon */}
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            title="Open in Google / Apple Maps for turn-by-turn navigation"
            className="w-7 h-7 rounded-xl bg-white border border-[#D3D4C0]/80 hover:border-[#8B5E3C] hover:text-[#8B5E3C] text-[#0A2947] flex items-center justify-center transition-all shadow-sm active:scale-90"
          >
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
