import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  SlidersHorizontal, 
  Sparkles, 
  ArrowRight, 
  Star, 
  Heart, 
  Footprints, 
  Compass, 
  Navigation,
  Coffee,
  X,
  ChevronRight,
  User,
  LogOut,
  Bell
} from 'lucide-react';
import { estimateWalkTime, estimateDriveTime, POPULAR_LOCATIONS } from '../utils/geo';

// Curated specialty coffee images matching the boutique aesthetic
const SPECIALTY_IMAGES = [
  'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1509785307050-d4066910ec1e?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=700&q=80',
];

export default function HomeView({
  cafes = [],
  userCoords,
  locationName,
  onRefreshLocation,
  isLoading,
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
  favorites = [],
  onToggleFavorite,
  onSelectCafe,
  onNavigateToMap,
  onSelectPreset,
  currentUser,
  onOpenAuthModal,
  onLogout
}) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Time-aware greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const categoryChips = [
    { id: 'all', label: 'All Spots' },
    { id: 'artisan', label: '☕ Artisan Brews' },
    { id: 'work', label: '💻 Work & Wifi' },
    { id: 'outdoor', label: '🥐 Bakery & Patio' },
    { id: 'pet', label: '🌿 Quiet Corners' },
  ];

  return (
    <div className="w-full min-h-screen bg-[#FAF7EE] text-[#0A2947] pb-28 pt-4 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-6">
      
      {/* ===================================================================== */}
      {/* 1. TOP HEADER (UIX-Maruf Reference)                                   */}
      {/* ===================================================================== */}
      <div className="flex items-center justify-between gap-3 pt-2">
        {/* User Greeting & GPS Status */}
        <div>
          <div className="flex items-center gap-1.5 text-xs font-mono text-[#0A2947]/70">
            <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-amber-500 animate-ping' : userCoords ? 'bg-emerald-600' : 'bg-rose-500'}`} />
            <button
              onClick={onRefreshLocation}
              disabled={isLoading}
              className="hover:underline flex items-center gap-1 text-[11px] truncate max-w-[180px] sm:max-w-[280px]"
              title="Click to refresh GPS location"
            >
              <span>{locationName || 'Raipur, Chhattisgarh'}</span>
              <Compass className={`w-3 h-3 text-[#8B5E3C] shrink-0 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0A2947] mt-0.5">
            {getGreeting()} ☕
          </h1>
        </div>

        {/* Profile / Notification Action */}
        <div className="flex items-center gap-2">
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-9 h-9 rounded-full overflow-hidden bg-[#8B5E3C] flex items-center justify-center text-xs text-[#FAF7EE] font-mono font-bold shadow-md border-2 border-white transition-transform active:scale-95"
              >
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{currentUser.name?.charAt(0).toUpperCase()}</span>
                )}
              </button>

              {showProfileMenu && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowProfileMenu(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-[#FAF7EE] rounded-2xl border border-[#D3D4C0]/80 p-2 shadow-2xl z-40 text-xs text-[#0A2947]">
                    <div className="px-3 py-2 border-b border-[#D3D4C0]/60 mb-1">
                      <p className="font-bold truncate">{currentUser.name}</p>
                      <p className="text-[10px] font-mono text-[#0A2947]/60 truncate">{currentUser.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-700 hover:bg-rose-500/10 transition-colors font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="h-9 px-3.5 rounded-full bg-[#0A2947] hover:bg-[#113c66] text-[#FAF7EE] text-xs font-semibold shadow-md active:scale-95 transition-all"
            >
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. SEARCH & FILTER BAR                                                */}
      {/* ===================================================================== */}
      <div className="flex items-center gap-2.5">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0A2947]/45 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cafe name, roastery, street..."
            className="w-full h-11 pl-10 pr-9 bg-white border border-[#D3D4C0]/70 focus:border-[#8B5E3C] focus:ring-2 focus:ring-[#8B5E3C]/20 rounded-2xl text-xs sm:text-sm text-[#0A2947] placeholder-[#0A2947]/45 focus:outline-none transition-all shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#0A2947]/40 hover:text-[#0A2947]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Explore on Map shortcut */}
        <button
          onClick={onNavigateToMap}
          className="h-11 px-3.5 sm:px-4 rounded-2xl bg-[#0A2947] hover:bg-[#113c66] text-[#FAF7EE] text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md active:scale-95 shrink-0"
          title="Switch to Explore Map"
        >
          <SlidersHorizontal className="w-4 h-4 text-[#8B5E3C]" />
          <span className="hidden sm:inline">Map View</span>
        </button>
      </div>

      {/* ===================================================================== */}
      {/* 3. FEATURED HERO PROMO BANNER (UIX-Maruf Reference)                   */}
      {/* ===================================================================== */}
      <div className="relative overflow-hidden rounded-3xl bg-[#0A2947] text-[#FAF7EE] shadow-xl shadow-[#0A2947]/15">
        {/* Rich Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity scale-105 transition-transform duration-700 hover:scale-100"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80')`
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A2947] via-[#0A2947]/85 to-transparent" />

        {/* Content */}
        <div className="relative p-6 sm:p-8 space-y-3 max-w-lg">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8B5E3C]/30 border border-[#8B5E3C]/50 text-white text-[11px] font-semibold tracking-wide uppercase backdrop-blur-sm">
            <Sparkles className="w-3 h-3 text-[#F3E4C9]" />
            <span>Curated Specialty Selection</span>
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white leading-tight">
            Discover Handcrafted Roasts & Quiet Study Corners
          </h2>

          <p className="text-xs sm:text-sm text-[#D3D4C0] font-normal leading-relaxed line-clamp-2">
            Over {cafes.length} live specialty cafes mapped with real-time walking times, seating, and wifi info.
          </p>

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={onNavigateToMap}
              className="px-4 py-2.5 rounded-full bg-[#8B5E3C] hover:bg-[#724c30] text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-[#8B5E3C]/30 transition-all active:scale-95 group"
            >
              <span>Explore Nearby Map</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>

            <span className="text-xs font-mono text-[#D3D4C0]/75 hidden sm:inline">
              📍 3,000m radius active
            </span>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 4. CATEGORY CHIPS (Horizontal Scrollable Pills)                      */}
      {/* ===================================================================== */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A2947]/70 font-mono">
            Vibe & Mood Categories
          </h3>
          {activeFilter !== 'all' && (
            <button
              onClick={() => setActiveFilter('all')}
              className="text-xs text-[#8B5E3C] font-semibold hover:underline"
            >
              Clear Filter
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
          {categoryChips.map((chip) => {
            const isActive = activeFilter === chip.id;
            return (
              <button
                key={chip.id}
                onClick={() => setActiveFilter(chip.id)}
                className={`h-9 px-4 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 shrink-0 active:scale-95 ${
                  isActive
                    ? 'bg-[#0A2947] text-[#FAF7EE] shadow-md shadow-[#0A2947]/20'
                    : 'bg-white text-[#0A2947]/80 border border-[#D3D4C0]/70 hover:bg-[#FAF7EE]'
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 5. "POPULAR NEAR YOU" 2-COLUMN GRID (UIX-Maruf Reference)              */}
      {/* ===================================================================== */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[#0A2947]">
              Popular Near You
            </h3>
            <p className="text-xs text-[#0A2947]/65 font-mono">
              {cafes.length} places discovered near your current location
            </p>
          </div>

          <button
            onClick={onNavigateToMap}
            className="text-xs font-semibold text-[#8B5E3C] hover:text-[#724c30] flex items-center gap-1 transition-colors"
          >
            <span>View All on Map</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 2-Column Responsive Grid */}
        {cafes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {cafes.map((cafe, index) => {
              const photoIndex = Math.abs(
                (cafe.name || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), index)
              ) % SPECIALTY_IMAGES.length;
              const photoUrl = SPECIALTY_IMAGES[photoIndex];
              const rating = (4.6 + (photoIndex % 4) * 0.1).toFixed(1);
              const isFav = favorites.includes(cafe.id);
              const walkEta = cafe.walkTime || estimateWalkTime(cafe.distanceKm);

              return (
                <div
                  key={cafe.id}
                  onClick={() => onSelectCafe(cafe)}
                  className="bg-white rounded-3xl p-4 border border-[#D3D4C0]/60 shadow-md shadow-[#0A2947]/05 hover:shadow-xl hover:border-[#8B5E3C]/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between group active:scale-[0.98]"
                >
                  <div>
                    {/* Thumbnail with floating rating & favorite heart */}
                    <div className="relative w-full h-44 rounded-2xl overflow-hidden mb-3 bg-[#0A2947]/08">
                      <img
                        src={photoUrl}
                        alt={cafe.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Rating Badge */}
                      <div className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-[#0A2947]/85 backdrop-blur-sm text-[#FAF7EE] text-[11px] font-mono font-bold flex items-center gap-1 shadow-sm">
                        <Star className="w-3 h-3 fill-[#8B5E3C] text-[#8B5E3C]" />
                        <span>{rating}</span>
                      </div>

                      {/* Favorite Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(cafe.id);
                        }}
                        className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 backdrop-blur-sm text-[#0A2947] hover:text-[#8B5E3C] shadow-md transition-transform active:scale-90"
                        title={isFav ? 'Remove favorite' : 'Save cafe'}
                      >
                        <Heart className={`w-4 h-4 transition-colors ${isFav ? 'fill-[#8B5E3C] text-[#8B5E3C]' : ''}`} />
                      </button>
                    </div>

                    {/* Cafe Meta */}
                    <div className="space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-base font-bold text-[#0A2947] tracking-tight truncate group-hover:text-[#8B5E3C] transition-colors">
                          {cafe.name}
                        </h4>
                      </div>

                      {/* Commute and Distance badge */}
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
                        {cafe.cuisine ? cafe.cuisine.replace(/;/g, ', ') : 'Artisan Espresso & Pour-over'}
                      </p>
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="mt-4 pt-3 border-t border-[#D3D4C0]/50 flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono text-[#0A2947]/60 truncate">
                      {cafe.address || `${cafe.lat.toFixed(3)}, ${cafe.lon.toFixed(3)}`}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCafe(cafe);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#8B5E3C] hover:bg-[#724c30] text-white text-xs font-semibold flex items-center gap-1 transition-colors shadow-sm shrink-0 active:scale-95"
                    >
                      <span>Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : !isLoading ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-[#D3D4C0]/60 space-y-3">
            <Coffee className="w-10 h-10 text-[#8B5E3C] mx-auto" />
            <h4 className="text-base font-bold text-[#0A2947]">No cafes found nearby</h4>
            <p className="text-xs text-[#0A2947]/70 max-w-sm mx-auto">
              Try searching with another keyword or explore world coffee capitals.
            </p>
            <button
              onClick={() => {
                setActiveFilter('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-full bg-[#8B5E3C] text-white text-xs font-semibold shadow-md hover:bg-[#724c30]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* Shimmer skeletons */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-3xl p-4 border border-[#D3D4C0]/60 space-y-3">
                <div className="w-full h-44 rounded-2xl bg-[#0A2947]/08 skeleton-shimmer" />
                <div className="w-3/4 h-5 rounded bg-[#0A2947]/12 skeleton-shimmer" />
                <div className="w-1/2 h-3.5 rounded bg-[#0A2947]/08 skeleton-shimmer" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===================================================================== */}
      {/* 6. COFFEE CAPITALS PRESET FOOTER                                      */}
      {/* ===================================================================== */}
      <div className="pt-4 border-t border-[#D3D4C0]/60 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#0A2947]/70">
        <span className="font-semibold text-[#0A2947]">World Roastery Capitals:</span>
        <div className="flex flex-wrap items-center gap-1.5">
          {POPULAR_LOCATIONS.map((loc) => (
            <button
              key={loc.name}
              onClick={() => onSelectPreset(loc)}
              className="h-7 px-3 rounded-full bg-white hover:bg-[#0A2947] hover:text-[#FAF7EE] border border-[#D3D4C0]/70 text-xs font-mono transition-all shadow-sm active:scale-95"
            >
              {loc.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
