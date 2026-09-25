import React, { useState } from 'react';
import { 
  Heart, 
  Dices, 
  MapPin, 
  Search, 
  X, 
  Compass, 
  User, 
  LogIn, 
  LogOut, 
  ChevronDown 
} from 'lucide-react';

export default function Header({ 
  userCoords, 
  locationName,
  favoritesCount, 
  showFavoritesOnly, 
  onToggleFavoritesFilter,
  currentUser,
  onOpenAuthModal,
  onLogout,
  onOpenRoulette,
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
  filterCounts = {},
  onFindNearMe,
  isLoading
}) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const filters = [
    { id: 'all', label: 'All', count: filterCounts.all },
    { id: 'work', label: '💻 Work & Wifi', count: filterCounts.work },
    { id: 'outdoor', label: '🌿 Outdoor', count: filterCounts.outdoor },
    { id: 'pet', label: '🐾 Pet Friendly', count: filterCounts.pet },
    { id: 'saved', label: '❤️ Saved', count: filterCounts.saved },
  ];

  return (
    <header className="w-full max-w-2xl mx-auto px-3 sm:px-4 pt-3 sm:pt-4 pointer-events-auto">
      {/* Floating Boutique Glass Capsule Container */}
      <div className="bg-[#F3E4C9]/95 backdrop-blur-xl border border-[#D3D4C0]/50 rounded-2xl p-4 shadow-xl shadow-[#0A2947]/10 space-y-3">
        
        {/* Top Row: Brand mark "VibeCafe ☕", live GPS status indicator, "Surprise Me 🎲", and "Saved ❤️" buttons */}
        <div className="flex items-center justify-between gap-2.5">
          
          {/* Brand mark & Live GPS Status Indicator */}
          <div className="flex items-center gap-2 min-w-0">
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-[#0A2947] flex items-center gap-1.5 shrink-0">
              <span>VibeCafe</span>
              <span>☕</span>
            </h1>

            {/* Live GPS Status Indicator */}
            <button
              type="button"
              onClick={onFindNearMe}
              disabled={isLoading}
              title="Click to refresh current GPS location"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0A2947]/08 hover:bg-[#0A2947]/12 border border-[#D3D4C0]/60 text-[11px] font-mono font-medium text-[#0A2947] transition-all max-w-[130px] sm:max-w-[190px] truncate active:scale-95"
            >
              <span className={`w-2 h-2 rounded-full shrink-0 ${isLoading ? 'bg-amber-500 animate-ping' : userCoords ? 'bg-emerald-600' : 'bg-rose-500'}`} />
              <span className="truncate">
                {isLoading ? 'Locating...' : locationName || 'GPS Active'}
              </span>
            </button>
          </div>

          {/* Action Buttons: Surprise Me 🎲, Saved ❤️, Profile */}
          <div className="flex items-center gap-2 shrink-0">
            {/* "Surprise Me" Roulette Floating Button */}
            <button
              type="button"
              onClick={onOpenRoulette}
              className="h-8 px-2.5 sm:px-3 rounded-full bg-[#0A2947] hover:bg-[#113c66] text-[#F3E4C9] text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 active:scale-95 shadow-sm"
              title="Roll cafe roulette"
            >
              <Dices className="w-3.5 h-3.5 text-[#8B5E3C]" />
              <span className="hidden sm:inline">Surprise Me</span>
            </button>

            {/* Floating Saved ❤️ Button */}
            <button
              type="button"
              onClick={onToggleFavoritesFilter}
              className={`h-8 px-2.5 rounded-full border transition-all duration-200 active:scale-95 relative flex items-center gap-1 text-xs font-medium ${
                showFavoritesOnly
                  ? 'bg-[#8B5E3C] text-[#F3E4C9] border-[#8B5E3C] shadow-sm'
                  : 'bg-[#0A2947]/08 hover:bg-[#0A2947]/15 text-[#0A2947] border-[#D3D4C0]/60'
              }`}
              title="Saved wishlist"
            >
              <Heart className={`w-3.5 h-3.5 transition-colors ${showFavoritesOnly ? 'fill-[#F3E4C9]' : ''}`} />
              {favoritesCount > 0 && (
                <span className="text-[11px] font-mono font-bold">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* User Profile or Sign In */}
            {currentUser ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="w-8 h-8 rounded-full overflow-hidden bg-[#8B5E3C] flex items-center justify-center text-xs text-[#F3E4C9] font-mono font-bold shadow-sm"
                  title={currentUser.name}
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
                    <div className="absolute right-0 mt-2 w-44 bg-[#FAF7EE] rounded-2xl border border-[#D3D4C0] p-1.5 shadow-2xl z-40 text-xs text-[#0A2947]">
                      <div className="px-3 py-2 border-b border-[#D3D4C0]/60 mb-1">
                        <p className="font-bold truncate">{currentUser.name}</p>
                        <p className="text-[10px] font-mono text-[#0A2947]/60 truncate">{currentUser.email}</p>
                      </div>
                      <button
                        type="button"
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
                type="button"
                onClick={onOpenAuthModal}
                className="h-8 px-2.5 rounded-full text-xs font-semibold text-[#0A2947] hover:bg-[#0A2947]/08 transition-all"
              >
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* Search Input: Crisp pill shape with a search icon and smooth focus ring */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0A2947]/45 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cafe by name, vibe, street..."
            className="w-full h-9 pl-9 pr-8 bg-[#FAF7EE] border border-[#D3D4C0]/70 focus:border-[#8B5E3C] focus:bg-white rounded-full text-xs sm:text-sm text-[#0A2947] placeholder-[#0A2947]/45 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/20 transition-all duration-200"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-[#0A2947]/40 hover:text-[#0A2947]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Row: Understated pill badges (#0A2947 active, transparent with #D3D4C0/40 border inactive) with count numbers */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar scroll-smooth">
          {filters.map((filter) => {
            const isActive = activeFilter === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => setActiveFilter(filter.id)}
                className={`inline-flex items-center gap-1.5 h-7 px-3 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 shrink-0 active:scale-95 ${
                  isActive
                    ? 'bg-[#0A2947] text-[#FAF7EE] shadow-sm'
                    : 'bg-transparent text-[#0A2947]/80 border border-[#D3D4C0]/40 hover:bg-[#0A2947]/06'
                }`}
              >
                <span>{filter.label}</span>
                {filter.count !== undefined && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-[#FAF7EE]/20 text-[#FAF7EE]' : 'bg-[#0A2947]/08 text-[#0A2947]/70'
                  }`}>
                    {filter.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
