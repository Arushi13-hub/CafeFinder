import React, { useState, useEffect } from 'react';
import { Compass, Coffee, Footprints, Sparkles } from 'lucide-react';

/**
 * Top viewport indeterminate progress bar in brand #8B5E3C & #F3E4C9
 */
export function BrewingProgressBar({ loading }) {
  if (!loading) return null;

  return (
    <div className="fixed top-0 inset-x-0 z-50 h-1 bg-[#FAF7EE]/50 overflow-hidden pointer-events-none">
      <div className="h-full bg-gradient-to-r from-[#8B5E3C] via-[#F3E4C9] to-[#8B5E3C] animate-indeterminate-bar shadow-sm shadow-[#8B5E3C]/30" />
    </div>
  );
}

/**
 * Animated coffee cup and brewing hourglass glyph in #8B5E3C & #F3E4C9
 */
export function BrewingGlyph({ size = 'md' }) {
  const isLarge = size === 'lg';
  const width = isLarge ? 54 : 40;
  const height = isLarge ? 54 : 40;

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Soft warm aura */}
      <div className="absolute inset-0 rounded-full bg-[#8B5E3C]/10 blur-md animate-pulse" />

      {/* SVG Coffee Cup with Steam Trails & Espresso Drip */}
      <svg
        width={width}
        height={height}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10"
      >
        {/* Steam Wisp 1 */}
        <path
          d="M24 16C23 11 26 8 24 4"
          stroke="#8B5E3C"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="animate-steam-1"
          opacity="0.8"
        />
        {/* Steam Wisp 2 (Center) */}
        <path
          d="M32 15C31 10 34 7 32 3"
          stroke="#8B5E3C"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="animate-steam-2"
          opacity="0.9"
        />
        {/* Steam Wisp 3 */}
        <path
          d="M40 16C39 11 42 8 40 4"
          stroke="#8B5E3C"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="animate-steam-3"
          opacity="0.8"
        />

        {/* Falling Espresso Drip */}
        <circle
          cx="32"
          cy="20"
          r="2.2"
          fill="#8B5E3C"
          className="animate-coffee-drip"
        />

        {/* Ceramic Mug Body in #8B5E3C */}
        <path
          d="M16 26H48V42C48 49.732 41.732 56 34 56H30C22.268 56 16 49.732 16 42V26Z"
          fill="#8B5E3C"
        />

        {/* Cream Inner Rim Accent #F3E4C9 */}
        <ellipse
          cx="32"
          cy="26"
          rx="16"
          ry="3.5"
          fill="#F3E4C9"
          stroke="#8B5E3C"
          strokeWidth="1.5"
        />

        {/* Coffee Surface in Mug */}
        <ellipse
          cx="32"
          cy="27"
          rx="13"
          ry="2.5"
          fill="#0A2947"
          opacity="0.85"
        />

        {/* Mug Handle */}
        <path
          d="M48 30C52.4183 30 56 33.5817 56 38C56 42.4183 52.4183 46 48 46"
          stroke="#8B5E3C"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Saucer / Plate in #F3E4C9 */}
        <path
          d="M12 58H52C53.1046 58 54 58.8954 54 60C54 60.5523 53.5523 61 53 61H11C10.4477 61 10 60.5523 10 60C10 58.8954 10.8954 58 12 58Z"
          fill="#F3E4C9"
          stroke="#8B5E3C"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}

/**
 * Dynamic Step-by-Step Status Ticker Hook & Component
 * Steps:
 * 1. "Acquiring your precise coordinates..." (0s - 1.0s)
 * 2. "Scanning nearby artisan roasters & cafes..." (1.0s - 2.5s)
 * 3. "Calculating walk & drive commute times..." (2.5s+)
 */
export function useBrewingTicker(isLoading) {
  const [step, setStep] = useState(1);
  const [tickerMessage, setTickerMessage] = useState('Acquiring your precise coordinates...');
  const [progressPercent, setProgressPercent] = useState(25);

  useEffect(() => {
    if (!isLoading) {
      setProgressPercent(100);
      const resetTimer = setTimeout(() => {
        setStep(1);
        setTickerMessage('Acquiring your precise coordinates...');
        setProgressPercent(25);
      }, 400);
      return () => clearTimeout(resetTimer);
    }

    setStep(1);
    setTickerMessage('Acquiring your precise coordinates...');
    setProgressPercent(30);

    // Step 2 transition at 1.0s
    const timer1 = setTimeout(() => {
      setStep(2);
      setTickerMessage('Scanning nearby artisan roasters & cafes...');
      setProgressPercent(68);
    }, 1000);

    // Step 3 transition at 2.5s
    const timer2 = setTimeout(() => {
      setStep(3);
      setTickerMessage('Calculating walk & drive commute times...');
      setProgressPercent(92);
    }, 2500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isLoading]);

  return { step, tickerMessage, progressPercent };
}

/**
 * Aesthetic Brewing Loading Banner with Ticker & Glyph
 */
export function BrewingBanner({ step, tickerMessage, progressPercent }) {
  const icons = {
    1: <Compass className="w-4 h-4 text-[#8B5E3C] animate-spin" style={{ animationDuration: '4s' }} />,
    2: <Coffee className="w-4 h-4 text-[#8B5E3C] animate-pulse" />,
    3: <Footprints className="w-4 h-4 text-[#8B5E3C] animate-bounce" style={{ animationDuration: '1.2s' }} />,
  };

  return (
    <div className="rounded-2xl p-4 sm:p-5 bg-white border border-[#D3D4C0]/80 shadow-md shadow-[#0A2947]/05 flex items-center justify-between gap-4 transition-all duration-300 animate-fadeIn">
      <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
        <BrewingGlyph size="md" />

        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#8B5E3C]/10 text-[#8B5E3C] text-[10px] font-mono font-bold uppercase tracking-wider">
              {icons[step]}
              <span>Step {step} of 3</span>
            </span>
            <span className="text-[11px] font-mono text-[#0A2947]/50 font-medium hidden sm:inline">
              Brewing Live Discovery • {progressPercent}%
            </span>
          </div>

          <p className="text-xs sm:text-sm font-bold text-[#0A2947] tracking-tight truncate">
            {tickerMessage}
          </p>
        </div>
      </div>

      {/* Mini Progress Circle or Pill */}
      <div className="shrink-0 flex flex-col items-end gap-1">
        <div className="w-20 sm:w-28 h-2 rounded-full bg-[#FAF7EE] border border-[#D3D4C0]/80 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#8B5E3C] to-[#0A2947] transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className="text-[10px] font-mono font-bold text-[#8B5E3C]">
          {progressPercent}%
        </span>
      </div>
    </div>
  );
}

/**
 * Shimmering Card Skeleton grid for seamless layout continuity
 */
export function CafeGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={`skeleton-${i}`}
          className="bg-white rounded-2xl p-3 sm:p-4 border border-[#D3D4C0]/60 shadow-sm flex flex-col justify-between"
        >
          <div>
            {/* Image Placeholder */}
            <div className="w-full aspect-[4/3] rounded-xl skeleton-shimmer mb-3" />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="h-3 w-16 rounded-md skeleton-shimmer" />
                <div className="h-3 w-20 rounded-md skeleton-shimmer" />
              </div>
              <div className="h-4 w-3/4 rounded-md skeleton-shimmer" />
              <div className="h-3 w-1/2 rounded-md skeleton-shimmer" />

              {/* Commute badges placeholder */}
              <div className="flex items-center gap-1.5 pt-1">
                <div className="h-4 w-14 rounded-full skeleton-shimmer" />
                <div className="h-4 w-14 rounded-full skeleton-shimmer" />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-3.5 pt-2.5 border-t border-[#D3D4C0]/40 flex items-center justify-between">
            <div className="h-5 w-14 rounded-md skeleton-shimmer" />
            <div className="w-8 h-8 rounded-full skeleton-shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}
