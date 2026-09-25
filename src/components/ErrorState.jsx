import React from 'react';
import { AlertCircle, RefreshCw, Compass, ArrowRight } from 'lucide-react';
import { POPULAR_LOCATIONS } from '../utils/geo';

export default function ErrorState({ error, onRetry, onSelectPreset }) {
  const isPermissionDenied =
    error?.code === 1 ||
    error?.message?.toLowerCase().includes('denied') ||
    error?.message?.toLowerCase().includes('permission');

  return (
    <div className="w-full max-w-lg mx-auto py-10 px-6 card-harbor text-center animate-fade-in shadow-harbor-card">
      {/* Icon Badge */}
      <div className="w-11 h-11 rounded-2xl bg-[#8B5E3C]/20 border border-[#8B5E3C]/40 flex items-center justify-center mx-auto mb-4 text-[#F3E4C9]">
        <AlertCircle className="w-5 h-5 text-[#F3E4C9]" />
      </div>

      <h3 className="text-lg font-semibold text-[#F3E4C9] mb-1.5 tracking-tight">
        {isPermissionDenied ? 'Location Permission Denied' : 'Unable to Query Overpass Protocol'}
      </h3>

      <p className="text-xs text-[#D3D4C0] max-w-sm mx-auto mb-6 leading-relaxed">
        {isPermissionDenied
          ? 'Your browser blocked geolocation. Grant access or search by city name to view nearby roasteries.'
          : error?.message || 'A network error occurred while querying OpenStreetMap servers. Please try again.'}
      </p>

      {/* Permission helper */}
      {isPermissionDenied && (
        <div className="text-left bg-[#0A2947] rounded-xl p-3.5 mb-6 border border-[#D3D4C0]/20 text-xs text-[#D3D4C0] space-y-1.5">
          <p className="font-medium text-[#F3E4C9] flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-[#8B5E3C]" />
            <span>How to re-enable location:</span>
          </p>
          <ol className="list-decimal list-inside space-y-1 text-[#D3D4C0]/80 text-[11px]">
            <li>Click the lock or site settings icon in your address bar.</li>
            <li>Change Location permission to <strong className="text-[#F3E4C9]">Allow</strong>.</li>
            <li>Click Retry Location Scan below.</li>
          </ol>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-center mb-6">
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-[#8B5E3C] hover:bg-[#734c2f] text-[#F3E4C9] font-medium text-xs transition-all active:scale-[0.98] shadow-sm border border-[#F3E4C9]/25"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Location Scan</span>
        </button>
      </div>

      {/* Instant Presets */}
      <div className="pt-5 border-t border-[#D3D4C0]/15">
        <span className="text-[10px] font-mono uppercase tracking-wider text-[#D3D4C0]/80 block mb-2.5">
          Or explore live telemetry in demo cities:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {POPULAR_LOCATIONS.map((loc) => (
            <button
              key={loc.name}
              onClick={() => onSelectPreset(loc)}
              className="p-2.5 rounded-xl bg-[#0A2947] hover:bg-[#113c66] border border-[#D3D4C0]/15 hover:border-[#F3E4C9]/35 text-left transition-all flex items-center justify-between group"
            >
              <div className="truncate pr-1">
                <div className="text-xs font-medium text-[#F3E4C9] truncate">{loc.label}</div>
                <div className="text-[10px] font-mono text-[#D3D4C0]/70 truncate">{loc.name}</div>
              </div>
              <ArrowRight className="w-3 h-3 text-[#D3D4C0]/60 group-hover:text-[#F3E4C9] shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
