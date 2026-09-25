import React, { useEffect, useState } from 'react';
import { Compass, Radio, Activity, Waves } from 'lucide-react';

export default function RadarScanner({ coords, radius = 3000, statusMessage }) {
  const [telemetryStep, setTelemetryStep] = useState(0);

  const steps = [
    'Locking acoustic GPS frequency...',
    'Calibrating precision coordinate matrix...',
    `Querying OpenStreetMap Overpass protocol (${radius}m radius)...`,
    'Detecting independent roasteries & kissaten...',
    'Synthesizing walking commute vectors & amenity telemetry...',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTelemetryStep((prev) => (prev + 1) % steps.length);
    }, 1400);
    return () => clearInterval(timer);
  }, [steps.length]);

  // 16 waveform frequencies with staggered heights & durations
  const waveformFrequencies = [
    { delay: '0.05s', duration: '0.9s' },
    { delay: '0.2s', duration: '1.2s' },
    { delay: '0.35s', duration: '0.8s' },
    { delay: '0.1s', duration: '1.4s' },
    { delay: '0.4s', duration: '1.0s' },
    { delay: '0.15s', duration: '1.1s' },
    { delay: '0.3s', duration: '1.3s' },
    { delay: '0.0s', duration: '0.95s' },
    { delay: '0.25s', duration: '1.15s' },
    { delay: '0.45s', duration: '0.85s' },
    { delay: '0.1s', duration: '1.3s' },
    { delay: '0.35s', duration: '1.05s' },
    { delay: '0.2s', duration: '1.25s' },
    { delay: '0.05s', duration: '0.9s' },
    { delay: '0.4s', duration: '1.1s' },
    { delay: '0.15s', duration: '1.35s' },
  ];

  return (
    <div className="w-full space-y-8 animate-fade-in py-4">
      {/* ========================================================================= */}
      {/* ACOUSTIC SOUNDWAVE / RADAR SCANNER CENTERPIECE                            */}
      {/* ========================================================================= */}
      <div className="flex flex-col items-center justify-center">
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
          
          {/* Organic Soundwave Expansion Rings (Linen #F3E4C9 & Amber #8B5E3C) */}
          <div className="absolute inset-0 rounded-full border border-[#F3E4C9]/40 animate-soundwave-1 pointer-events-none" />
          <div className="absolute inset-0 rounded-full border border-[#8B5E3C]/50 animate-soundwave-2 pointer-events-none" />
          <div className="absolute inset-0 rounded-full border border-[#F3E4C9]/30 animate-soundwave-3 pointer-events-none" />

          {/* Concentric Reference Rings */}
          <div className="absolute inset-6 rounded-full border border-[#D3D4C0]/15" />
          <div className="absolute inset-16 rounded-full border border-[#D3D4C0]/20" />
          <div className="absolute inset-28 rounded-full border border-[#8B5E3C]/30" />

          {/* Distance Markers in Cream Linen */}
          <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] font-mono text-[#F3E4C9] tracking-widest font-semibold uppercase">
            {radius}M
          </span>
          <span className="absolute top-12 left-1/2 -translate-x-1/2 text-[9px] font-mono text-[#D3D4C0]/80 tracking-widest uppercase">
            {Math.round(radius * 0.6)}M
          </span>

          {/* Acoustic Frequency Waveform Bars */}
          <div className="absolute inset-x-12 inset-y-20 flex items-center justify-center gap-1 sm:gap-1.5 z-10 pointer-events-none">
            {waveformFrequencies.map((bar, i) => (
              <div
                key={i}
                className="w-1 sm:w-1.5 rounded-full bg-gradient-to-t from-[#8B5E3C] via-[#F3E4C9] to-[#8B5E3C] animate-waveform-bar"
                style={{
                  animationDelay: bar.delay,
                  animationDuration: bar.duration,
                  opacity: 0.75 + (i % 3) * 0.1,
                }}
              />
            ))}
          </div>

          {/* Central Breathing Acoustic Node */}
          <div className="relative z-20 w-14 h-14 rounded-2xl bg-[#0d3257] border border-[#F3E4C9]/40 shadow-harbor-card flex items-center justify-center">
            <div className="w-5 h-5 rounded-full bg-[#8B5E3C] flex items-center justify-center animate-pulse">
              <div className="w-2 h-2 rounded-full bg-[#F3E4C9]" />
            </div>
          </div>
        </div>

        {/* Acoustic Telemetry Card */}
        <div className="w-full max-w-lg card-harbor p-5 text-center mt-4">
          <div className="flex items-center justify-center gap-2 mb-1.5">
            <Waves className="w-4 h-4 text-[#8B5E3C] animate-pulse" />
            <span className="text-[11px] font-mono tracking-widest text-[#F3E4C9] uppercase font-semibold">
              Live Acoustic Waveform Telemetry
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#F3E4C9] animate-ping" />
          </div>

          <h3 className="text-base sm:text-lg font-semibold text-[#F3E4C9] tracking-tight">
            {statusMessage || steps[telemetryStep]}
          </h3>

          <div className="mt-3 pt-3 border-t border-[#D3D4C0]/15 flex items-center justify-between text-xs font-mono text-[#D3D4C0]">
            <div className="flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#F3E4C9]" />
              <span>
                {coords 
                  ? `${coords.lat.toFixed(4)}° N, ${coords.lon.toFixed(4)}° E` 
                  : 'Acquiring GPS fix...'}
              </span>
            </div>
            <div className="text-[#F3E4C9] font-medium">
              Radius: {radius}m
            </div>
          </div>
        </div>
      </div>

      {/* Shimmering Skeletal Place-Cards in Deep Harbor Palette */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pt-2">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="card-harbor p-5 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2 flex-1">
                <div className="w-16 h-3.5 rounded bg-[#D3D4C0]/10 skeleton-shimmer" />
                <div className="w-3/4 h-5 rounded-md bg-[#D3D4C0]/15 skeleton-shimmer" />
              </div>
              <div className="w-8 h-8 rounded-lg bg-[#D3D4C0]/10 skeleton-shimmer" />
            </div>

            <div className="w-1/2 h-3.5 rounded bg-[#D3D4C0]/10 skeleton-shimmer" />

            <div className="space-y-1.5 pt-1">
              <div className="w-full h-3 rounded bg-[#D3D4C0]/08 skeleton-shimmer" />
              <div className="w-4/5 h-3 rounded bg-[#D3D4C0]/08 skeleton-shimmer" />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <div className="w-16 h-5 rounded bg-[#D3D4C0]/10 skeleton-shimmer" />
              <div className="w-14 h-5 rounded bg-[#D3D4C0]/10 skeleton-shimmer" />
              <div className="w-20 h-5 rounded bg-[#D3D4C0]/10 skeleton-shimmer" />
            </div>

            <div className="pt-3 border-t border-[#D3D4C0]/10 flex items-center justify-between">
              <div className="w-16 h-3 rounded bg-[#D3D4C0]/10 skeleton-shimmer" />
              <div className="w-24 h-7 rounded-lg bg-[#8B5E3C]/30 skeleton-shimmer" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
