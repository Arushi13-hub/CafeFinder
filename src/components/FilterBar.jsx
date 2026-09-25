import React from 'react';
import { Search, X, ArrowUpDown } from 'lucide-react';

export default function FilterBar({
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
  sortBy,
  setSortBy,
  totalCount,
  filteredCount,
  filterCounts = {}
}) {
  const filters = [
    { id: 'all', label: 'All Cafes', count: filterCounts.all ?? totalCount },
    { id: 'work', label: 'Work & WiFi', count: filterCounts.work ?? 0 },
    { id: 'outdoor', label: 'Outdoor Patio', count: filterCounts.outdoor ?? 0 },
    { id: 'pet', label: 'Pet Friendly', count: filterCounts.pet ?? 0 },
    { id: 'saved', label: 'Saved', count: filterCounts.saved ?? 0 },
  ];

  return (
    <div className="w-full mb-8 space-y-4">
      {/* Search Bar & Sort Selector */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D3D4C0]/70 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search roasteries, kissaten, street, or cuisine..."
            className="w-full h-11 pl-10 pr-9 bg-[#0d3257] border border-[#D3D4C0]/20 focus:border-[#F3E4C9]/40 rounded-xl text-xs sm:text-sm text-[#F3E4C9] placeholder-[#D3D4C0]/50 focus:outline-none transition-all duration-200 shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#D3D4C0] hover:text-[#F3E4C9] p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort Selector & Result Count */}
        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
          <div className="flex items-center gap-1.5 px-3.5 h-11 bg-[#0d3257] border border-[#D3D4C0]/20 rounded-xl text-xs text-[#D3D4C0]">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#8B5E3C]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-[#F3E4C9] text-xs font-medium focus:outline-none cursor-pointer pr-1"
            >
              <option value="distance" className="bg-[#0A2947] text-[#F3E4C9]">Closest First</option>
              <option value="name" className="bg-[#0A2947] text-[#F3E4C9]">Name (A-Z)</option>
              <option value="walk" className="bg-[#0A2947] text-[#F3E4C9]">Shortest Walk</option>
            </select>
          </div>

          <div className="px-3 py-1 text-xs font-mono tabular-nums text-[#D3D4C0] bg-[#0d3257]/60 rounded-xl border border-[#D3D4C0]/15 h-11 flex items-center">
            <span className="text-[#F3E4C9] font-semibold">{filteredCount}</span>
            <span className="text-[#D3D4C0]/60 text-[11px] ml-1">/ {totalCount} spots</span>
          </div>
        </div>
      </div>

      {/* Horizontal Category Strip with Smooth Pill Morph */}
      <div className="relative flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
        {filters.map((filter) => {
          const isActive = activeFilter === filter.id;
          const count = filter.count;

          return (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`relative inline-flex items-center gap-2 h-10 px-4 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 shrink-0 active:scale-[0.98] ${
                isActive
                  ? 'bg-[#8B5E3C] text-[#F3E4C9] border border-[#F3E4C9]/40 shadow-sm'
                  : 'bg-[#0d3257] text-[#D3D4C0] hover:text-[#F3E4C9] hover:bg-[#113c66] border border-[#D3D4C0]/15'
              }`}
            >
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#F3E4C9] animate-pulse" />
              )}
              <span>{filter.label}</span>
              <span className={`text-[10px] font-mono tabular-nums px-1.5 py-0.2 rounded-full ${
                isActive ? 'bg-[#0A2947]/60 text-[#F3E4C9]' : 'bg-[#0A2947]/40 text-[#D3D4C0]/70'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
