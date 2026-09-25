import React from 'react';
import { Home, Map as MapIcon, Dices, Heart } from 'lucide-react';

export default function BottomNav({
  activeTab,
  onTabChange,
  savedCount = 0,
  onOpenRoulette
}) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'map', label: 'Explore', icon: MapIcon },
    { id: 'roulette', label: 'Surprise', icon: Dices, isAction: true },
    { id: 'saved', label: 'Saved', icon: Heart, count: savedCount },
  ];

  return (
    <div className="fixed bottom-4 inset-x-0 mx-auto w-fit z-40 px-3 pointer-events-auto">
      {/* Floating Rounded Bottom Tab Bar Dock */}
      <nav 
        aria-label="Main Navigation"
        className="bg-[#FAF7EE]/95 backdrop-blur-2xl border border-[#D3D4C0]/80 shadow-2xl shadow-[#0A2947]/20 rounded-full p-1.5 flex items-center gap-1 sm:gap-2 transition-all duration-300"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          const handleClick = () => {
            if (tab.isAction) {
              onOpenRoulette();
            } else {
              onTabChange(tab.id);
            }
          };

          return (
            <button
              key={tab.id}
              type="button"
              onClick={handleClick}
              className={`relative flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 active:scale-95 ${
                isActive
                  ? 'bg-[#0A2947] text-[#FAF7EE] shadow-md shadow-[#0A2947]/25'
                  : 'text-[#0A2947]/70 hover:text-[#0A2947] hover:bg-[#0A2947]/06'
              }`}
            >
              <Icon 
                className={`w-4 h-4 transition-transform duration-200 ${
                  isActive ? 'scale-110 text-[#8B5E3C]' : ''
                } ${tab.id === 'saved' && isActive ? 'fill-[#8B5E3C]' : ''}`} 
              />
              <span className="text-xs tracking-tight">{tab.label}</span>

              {/* Saved count badge */}
              {tab.id === 'saved' && tab.count > 0 && (
                <span
                  className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full transition-colors ${
                    isActive
                      ? 'bg-[#8B5E3C] text-white'
                      : 'bg-[#8B5E3C]/20 text-[#8B5E3C]'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
