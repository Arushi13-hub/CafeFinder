import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  MapPin, 
  RotateCw, 
  Footprints, 
  Car,
  Wifi, 
  Trees, 
  Dog, 
  ShoppingBag,
  Dices,
  Check,
  Navigation,
  Star
} from 'lucide-react';
import { estimateWalkTime, estimateDriveTime } from '../utils/geo';

export default function RouletteModal({ 
  isOpen, 
  onClose, 
  cafes = [], 
  userCoords,
  onSelectCafe 
}) {
  const [isSpinning, setIsSpinning] = useState(true);
  const [displayedCafe, setDisplayedCafe] = useState(null);
  const [winner, setWinner] = useState(null);
  const spinTimerRef = useRef(null);

  const startSpin = () => {
    if (!cafes || cafes.length === 0) return;

    setIsSpinning(true);
    setWinner(null);

    let counter = 0;
    const totalSteps = 18; // ~1.2s total duration
    let speed = 40;

    const rollStep = () => {
      counter++;
      const randomIndex = Math.floor(Math.random() * cafes.length);
      setDisplayedCafe(cafes[randomIndex]);

      if (counter < totalSteps) {
        if (counter > 12) speed += 35; // Smooth deceleration
        spinTimerRef.current = setTimeout(rollStep, speed);
      } else {
        const finalWinner = cafes[Math.floor(Math.random() * cafes.length)];
        setWinner(finalWinner);
        setDisplayedCafe(finalWinner);
        setIsSpinning(false);
      }
    };

    rollStep();
  };

  useEffect(() => {
    if (isOpen && cafes.length > 0) {
      startSpin();
    }
    return () => {
      if (spinTimerRef.current) clearTimeout(spinTimerRef.current);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const targetCafe = winner || displayedCafe;
  const isApple = typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent);
  const directionsUrl = targetCafe
    ? userCoords
      ? isApple
        ? `https://maps.apple.com/?saddr=${userCoords.lat},${userCoords.lon}&daddr=${targetCafe.lat},${targetCafe.lon}&dirflg=w`
        : `https://www.google.com/maps/dir/?api=1&origin=${userCoords.lat},${userCoords.lon}&destination=${targetCafe.lat},${targetCafe.lon}&travelmode=walking`
      : isApple
        ? `https://maps.apple.com/?daddr=${targetCafe.lat},${targetCafe.lon}&dirflg=w`
        : `https://www.google.com/maps/dir/?api=1&destination=${targetCafe.lat},${targetCafe.lon}&travelmode=walking`
    : '#';

  const walkEta = targetCafe ? (targetCafe.walkTime || estimateWalkTime(targetCafe.distanceKm)) : '--';
  const driveEta = targetCafe ? (targetCafe.driveTime || estimateDriveTime(targetCafe.distanceKm)) : '--';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A2947]/75 backdrop-blur-md animate-fade-in">
      {/* Background click to dismiss */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Dialog Card in Warm Cream #F3E4C9 */}
      <div 
        className="relative w-full max-w-md bg-[#F3E4C9] text-[#0A2947] border border-[#D3D4C0] rounded-3xl p-6 sm:p-7 shadow-2xl z-10 modal-sheet-enter max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full bg-[#0A2947]/08 hover:bg-[#0A2947]/15 text-[#0A2947] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="mb-5 pr-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0A2947]/08 text-[11px] font-mono tracking-widest text-[#0A2947] uppercase mb-2 font-bold">
            <Dices className="w-3.5 h-3.5 text-[#8B5E3C]" />
            <span>Curator's Cafe Roulette</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0A2947] tracking-tight">
            {isSpinning ? 'Cycling roasteries...' : 'Your Handpicked Corner ☕'}
          </h2>
          <p className="text-xs text-[#0A2947]/70 mt-0.5">
            {isSpinning 
              ? 'Analyzing acoustic foot traffic, distance vectors, and seating...' 
              : 'The roulette has picked your artisanal coffee spot.'}
          </p>
        </div>

        {/* Selected Cafe Card Viewport with Ambient Halo Pulse on Winner */}
        <div className={`p-5 rounded-2xl border transition-all duration-300 mb-5 ${
          isSpinning
            ? 'bg-[#0A2947]/06 border-[#0A2947]/15'
            : 'bg-white border-[#8B5E3C] shadow-xl roulette-halo-pulse'
        }`}>
          {/* Status Flag */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[10px] font-mono tracking-wider uppercase text-[#0A2947]/60 font-semibold">
              {isSpinning ? 'Rolling candidates...' : 'Confirmed Match'}
            </span>
            {!isSpinning && (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#F3E4C9] bg-[#8B5E3C] px-2.5 py-0.5 rounded-full font-bold">
                <Check className="w-3 h-3 text-[#F3E4C9]" /> Ready
              </span>
            )}
          </div>

          {/* Destination Name */}
          <h3 className={`text-xl sm:text-2xl font-bold text-[#0A2947] tracking-tight mb-2 transition-all ${
            isSpinning ? 'opacity-70 blur-[0.4px]' : 'opacity-100'
          }`}>
            {targetCafe ? targetCafe.name : 'Searching nearby...'}
          </h3>

          {/* Commute Tokens */}
          {targetCafe && (
            <div className="flex items-center gap-2 text-xs font-mono tabular-nums text-[#0A2947]/80 mb-3 flex-wrap">
              <span className="inline-flex items-center gap-1.5 font-bold text-[#8B5E3C] bg-[#0A2947]/06 px-2.5 py-1 rounded-lg">
                <Footprints className="w-3.5 h-3.5 text-[#8B5E3C]" />
                <span>{walkEta}</span>
              </span>
              <span>&bull;</span>
              <span className="inline-flex items-center gap-1 text-[#0A2947]/70">
                <Car className="w-3.5 h-3.5" />
                <span>{driveEta}</span>
              </span>
              <span>&bull;</span>
              <span className="font-semibold text-[#0A2947]">
                {targetCafe.formattedDistance}
              </span>
            </div>
          )}

          {/* Address */}
          {targetCafe && (
            <div className="flex items-start gap-1.5 text-xs text-[#0A2947]/75 mb-3">
              <MapPin className="w-3.5 h-3.5 text-[#8B5E3C] mt-0.5 shrink-0" />
              <p className="line-clamp-2">
                {targetCafe.address || `Coordinates: ${targetCafe.lat.toFixed(4)}, ${targetCafe.lon.toFixed(4)}`}
              </p>
            </div>
          )}

          {/* Amenities */}
          {targetCafe && !isSpinning && (
            <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-[#0A2947]/10">
              {targetCafe.workFriendly && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#0A2947]/08 text-[#0A2947]">
                  <Wifi className="w-2.5 h-2.5 text-[#8B5E3C]" /> WiFi
                </span>
              )}
              {targetCafe.outdoorSeating && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#0A2947]/08 text-[#0A2947]">
                  <Trees className="w-2.5 h-2.5 text-[#8B5E3C]" /> Patio
                </span>
              )}
              {targetCafe.petFriendly && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#0A2947]/08 text-[#0A2947]">
                  <Dog className="w-2.5 h-2.5 text-[#8B5E3C]" /> Pets OK
                </span>
              )}
              {targetCafe.takeaway && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#0A2947]/08 text-[#0A2947]">
                  <ShoppingBag className="w-2.5 h-2.5 text-[#8B5E3C]" /> Takeaway
                </span>
              )}
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              if (targetCafe && onSelectCafe) onSelectCafe(targetCafe);
            }}
            className="w-full sm:flex-1 h-12 rounded-full bg-[#8B5E3C] hover:bg-[#734c2f] text-[#F3E4C9] font-semibold text-xs flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 shadow-md"
          >
            <Navigation className="w-3.5 h-3.5 text-[#F3E4C9]" />
            <span>Open Route (Google / Apple Maps)</span>
          </a>

          <button
            type="button"
            onClick={startSpin}
            disabled={isSpinning}
            className="w-full sm:w-auto h-12 px-5 rounded-full bg-[#0A2947]/08 hover:bg-[#0A2947]/15 text-[#0A2947] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95 disabled:opacity-50"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isSpinning ? 'animate-spin' : ''}`} />
            <span>Roll Again</span>
          </button>
        </div>
      </div>
    </div>
  );
}
