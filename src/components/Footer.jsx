import React, { useState } from 'react';
import { 
  Coffee, 
  Send, 
  CheckCircle2, 
  MapPin, 
  ExternalLink, 
  Sparkles,
  Heart,
  Globe,
  Radio
} from 'lucide-react';

export default function Footer({ 
  onSurpriseMe, 
  onUseGps, 
  onOpenLocationModal, 
  onTabSwitch,
  onShowToast,
  compact = false 
}) {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setIsSubscribed(true);
    onShowToast?.("Welcome to the VibeCafe Coffee Club! Weekly roasts heading your way ☕");
    setTimeout(() => {
      setEmail('');
    }, 2500);
  };

  // If compact mode is requested (e.g., inside desktop Explore Map left sidebar scroll)
  if (compact) {
    return (
      <div className="pt-6 pb-4 border-t border-[#D3D4C0]/40 text-center space-y-2.5 bg-[#FAF7EE]/80 rounded-2xl p-4 mt-4">
        <div className="flex items-center justify-center gap-2">
          <div className="w-5 h-5 rounded-lg bg-[#0A2947] text-[#FAF7EE] flex items-center justify-center">
            <Coffee className="w-3 h-3 text-[#8B5E3C]" />
          </div>
          <span className="font-extrabold text-xs text-[#0A2947]">VibeCafe</span>
          <span className="text-[10px] font-mono text-[#8B5E3C]">• Live OSM Data</span>
        </div>
        <p className="text-[11px] text-[#0A2947]/65 max-w-xs mx-auto">
          Handcrafted pour-overs and specialty roasters updated live.
        </p>
        <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-[#0A2947]/70">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>OSM Network Online</span>
        </div>
      </div>
    );
  }

  return (
    <footer className="w-full bg-[#0A2947] text-[#FAF7EE] rounded-3xl mt-12 overflow-hidden border border-[#D3D4C0]/20 shadow-2xl relative">
      {/* Decorative Warm Ambient Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#8B5E3C]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#F3E4C9]/05 rounded-full blur-3xl pointer-events-none" />

      {/* Main Footer Container with responsive padding (pb-28 on mobile to avoid bottom dock overlap) */}
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-10 sm:pt-14 pb-28 md:pb-10 space-y-10 relative z-10">
        
        {/* =================================================================== */}
        {/* 1. TOP SECTION: BRAND & COFFEE CLUB NEWSLETTER                     */}
        {/* =================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-10 border-b border-[#D3D4C0]/15 items-start">
          
          {/* Brand Column (7 cols on lg) */}
          <div className="lg:col-span-6 space-y-3.5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#F3E4C9] text-[#0A2947] flex items-center justify-center shadow-md">
                <Coffee className="w-5 h-5 text-[#8B5E3C]" />
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black tracking-tight text-[#FAF7EE] leading-none block">
                  VibeCafe <span className="text-[#F3E4C9]">☕</span>
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8B5E3C] font-semibold">
                  Artisan Coffee Discovery
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#D3D4C0] font-normal leading-relaxed max-w-md">
              Curating artisan corners, quiet study nooks, and specialty pour-overs near you. Powered by real-time community contributions and open mapping data.
            </p>

            {/* OpenStreetMap Attribution Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/08 border border-white/10 text-[11px] font-mono text-[#D3D4C0]">
              <Globe className="w-3.5 h-3.5 text-[#F3E4C9]" />
              <span>Map data &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="text-[#F3E4C9] underline hover:text-white">OpenStreetMap</a> contributors</span>
            </div>
          </div>

          {/* Coffee Club Newsletter Signup (5 cols on lg) */}
          <div className="lg:col-span-6 bg-white/[0.04] border border-white/10 rounded-3xl p-5 sm:p-6 backdrop-blur-sm space-y-3">
            <div className="flex items-center gap-2 text-[#F3E4C9]">
              <Sparkles className="w-4 h-4 text-[#8B5E3C]" />
              <h4 className="text-sm sm:text-base font-bold text-white tracking-tight">
                Join the VibeCafe Coffee Club
              </h4>
            </div>

            <p className="text-xs text-[#D3D4C0]/90 leading-relaxed">
              Get weekly neighborhood roast recommendations, secret patio spots, and exclusive roaster promos directly in your inbox.
            </p>

            {isSubscribed ? (
              <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl flex items-center gap-2 text-xs font-semibold text-emerald-200 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>You're on the list! Welcome to the Coffee Club ☕</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 pt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="flex-1 h-11 px-4 rounded-xl bg-[#F3E4C9]/10 border border-[#D3D4C0]/30 focus:border-[#F3E4C9] focus:outline-none text-xs sm:text-sm text-[#FAF7EE] placeholder-[#D3D4C0]/50 transition-colors"
                />
                <button
                  type="submit"
                  className="h-11 px-5 rounded-xl bg-[#8B5E3C] hover:bg-[#724c30] text-white text-xs font-bold transition-all active:scale-95 shadow-md flex items-center justify-center gap-1.5 shrink-0"
                >
                  <span>Subscribe</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>

        </div>

        {/* =================================================================== */}
        {/* 2. NAVIGATION LINKS GRID (Multi-column Desktop, 2-col Mobile)       */}
        {/* =================================================================== */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 py-2">
          
          {/* Column 1: Explore */}
          <div className="space-y-3">
            <h5 className="text-[11px] font-mono uppercase tracking-widest text-[#F3E4C9] font-bold">
              Explore
            </h5>
            <ul className="space-y-2 text-xs text-[#D3D4C0]">
              <li>
                <button 
                  type="button" 
                  onClick={onUseGps} 
                  className="hover:text-[#F3E4C9] transition-colors flex items-center gap-1.5"
                >
                  <MapPin className="w-3 h-3 text-[#8B5E3C]" />
                  <span>Near Me (Live GPS)</span>
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => onTabSwitch?.('map')} 
                  className="hover:text-[#F3E4C9] transition-colors"
                >
                  Work &amp; Wifi Nooks
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => onTabSwitch?.('map')} 
                  className="hover:text-[#F3E4C9] transition-colors"
                >
                  Outdoor Patios &amp; Sun
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => onTabSwitch?.('map')} 
                  className="hover:text-[#F3E4C9] transition-colors"
                >
                  Pet-Friendly Roasteries
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={onSurpriseMe} 
                  className="hover:text-[#F3E4C9] transition-colors text-[#F3E4C9] font-medium flex items-center gap-1"
                >
                  <span>Surprise Me 🎲</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Community */}
          <div className="space-y-3">
            <h5 className="text-[11px] font-mono uppercase tracking-widest text-[#F3E4C9] font-bold">
              Community
            </h5>
            <ul className="space-y-2 text-xs text-[#D3D4C0]">
              <li>
                <button 
                  type="button" 
                  onClick={() => onShowToast?.("Submit a Cafe: Thank you! Community submissions are open via OpenStreetMap tags.")} 
                  className="hover:text-[#F3E4C9] transition-colors"
                >
                  Submit a Cafe
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => onShowToast?.("Vibe Ratings: Tap 'Vote' on any cafe card to rate its current noise level!")} 
                  className="hover:text-[#F3E4C9] transition-colors"
                >
                  Vibe &amp; Noise Ratings
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => onTabSwitch?.('map')} 
                  className="hover:text-[#F3E4C9] transition-colors"
                >
                  Coffee Walk Routes
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => onShowToast?.("Meetup Planner: Tap 'Meet Here 👥' on any cafe card to invite friends!")} 
                  className="hover:text-[#F3E4C9] transition-colors flex items-center gap-1"
                >
                  <span>Meetup Planner</span>
                  <span className="text-[9px] font-mono px-1 rounded bg-[#8B5E3C] text-white">NEW</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: About & Tech */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <h5 className="text-[11px] font-mono uppercase tracking-widest text-[#F3E4C9] font-bold">
              About &amp; Tech
            </h5>
            <ul className="space-y-2 text-xs text-[#D3D4C0]">
              <li>
                <a 
                  href="https://wiki.openstreetmap.org/wiki/Overpass_API" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-[#F3E4C9] transition-colors flex items-center gap-1"
                >
                  <span>OpenStreetMap Overpass API</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              </li>
              <li>
                <a 
                  href="https://nominatim.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-[#F3E4C9] transition-colors flex items-center gap-1"
                >
                  <span>Nominatim Geocoding</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              </li>
              <li>
                <a 
                  href="https://open-meteo.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-[#F3E4C9] transition-colors flex items-center gap-1"
                >
                  <span>Open-Meteo Free Weather API</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => onShowToast?.("Privacy Policy: VibeCafe never stores or tracks your personal location on remote servers.")} 
                  className="hover:text-[#F3E4C9] transition-colors"
                >
                  Privacy &amp; Data Ethics
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* =================================================================== */}
        {/* 3. BOTTOM BAR: COPYRIGHT, SOCIALS & LIVE STATUS                     */}
        {/* =================================================================== */}
        <div className="pt-8 border-t border-[#D3D4C0]/15 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Copyright notice */}
          <p className="text-xs text-[#D3D4C0]/75 text-center sm:text-left">
            &copy; 2026 VibeCafe. Handcrafted for coffee lovers everywhere.
          </p>

          {/* Social media icons (Instagram, Twitter/X, GitHub) */}
          <div className="flex items-center gap-4">
            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-[#D3D4C0] hover:text-[#F3E4C9] hover:scale-110 transition-all p-1"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>

            {/* Twitter / X */}
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X / Twitter"
              className="text-[#D3D4C0] hover:text-[#F3E4C9] hover:scale-110 transition-all p-1"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>

            {/* GitHub */}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-[#D3D4C0] hover:text-[#F3E4C9] hover:scale-110 transition-all p-1"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
            </a>
          </div>

          {/* Live system status pill: Green pulsing dot indicating "OSM Network Online" */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/08 border border-white/10 text-[11px] font-mono text-[#D3D4C0]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-white font-semibold">OSM Network Online</span>
          </div>

        </div>

      </div>
    </footer>
  );
}
