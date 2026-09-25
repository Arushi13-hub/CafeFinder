import React, { useEffect, useState } from 'react';
import { 
  X, 
  MapPin, 
  Navigation, 
  ExternalLink, 
  Clock, 
  Phone, 
  Globe, 
  Wifi, 
  Trees, 
  ShoppingBag, 
  Accessibility, 
  Heart, 
  Copy, 
  Check, 
  Footprints,
  Car
} from 'lucide-react';
import { estimateWalkTime, estimateDriveTime } from '../utils/geo';

export default function CafeDetailModal({ 
  cafe, 
  onClose, 
  isFavorite, 
  onToggleFavorite,
  userCoords
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!cafe) return null;

  const isApple = typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent);
  const directionsUrl = userCoords
    ? isApple
      ? `https://maps.apple.com/?saddr=${userCoords.lat},${userCoords.lon}&daddr=${cafe.lat},${cafe.lon}&dirflg=w`
      : `https://www.google.com/maps/dir/?api=1&origin=${userCoords.lat},${userCoords.lon}&destination=${cafe.lat},${cafe.lon}&travelmode=walking`
    : isApple
      ? `https://maps.apple.com/?daddr=${cafe.lat},${cafe.lon}&dirflg=w`
      : `https://www.google.com/maps/dir/?api=1&destination=${cafe.lat},${cafe.lon}&travelmode=walking`;
  
  const osmUrl = `https://www.openstreetmap.org/${cafe.osmType}/${cafe.osmId}`;

  const copyAddressOrCoords = () => {
    const text = cafe.address || `${cafe.lat}, ${cafe.lon}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const walkEta = cafe.walkTime || estimateWalkTime(cafe.distanceKm);
  const driveEta = cafe.driveTime || estimateDriveTime(cafe.distanceKm);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A2947]/75 backdrop-blur-md animate-fade-in">
      {/* Click outside to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Dialog Card in Warm Cream #F3E4C9 */}
      <div 
        className="relative w-full max-w-lg bg-[#F3E4C9] text-[#0A2947] border border-[#D3D4C0] rounded-3xl p-6 sm:p-7 shadow-2xl z-10 max-h-[90vh] overflow-y-auto modal-sheet-enter"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full bg-[#0A2947]/08 hover:bg-[#0A2947]/15 text-[#0A2947] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Info */}
        <div className="mb-5 pr-8">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[10px] font-mono tracking-wider text-[#F3E4C9] bg-[#0A2947] px-2.5 py-0.5 rounded-full font-bold">
              Verified Roastery
            </span>
            {cafe.cuisine && (
              <span className="text-xs text-[#8B5E3C] font-semibold capitalize">
                {cafe.cuisine.replace(/;/g, ', ')}
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0A2947] tracking-tight leading-snug">
            {cafe.name}
          </h2>

          {/* Commute Tokens */}
          <div className="flex items-center gap-2 mt-2 text-xs font-mono tabular-nums text-[#0A2947]/80 flex-wrap">
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
            <span className="font-semibold text-[#0A2947]">{cafe.formattedDistance}</span>
          </div>
        </div>

        {/* Location & Address */}
        <div className="bg-white rounded-2xl p-4 mb-4 border border-[#D3D4C0] shadow-sm space-y-1">
          <div className="flex items-start gap-2.5 text-xs text-[#0A2947]">
            <MapPin className="w-4 h-4 text-[#8B5E3C] mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-[#0A2947]">
                {cafe.address || 'Address details not tagged in OpenStreetMap'}
              </p>
              <p className="font-mono text-[#0A2947]/60 text-[11px] mt-0.5">
                OSM Coordinates: {cafe.lat.toFixed(5)}° N, {cafe.lon.toFixed(5)}° E
              </p>
            </div>
            <button
              onClick={copyAddressOrCoords}
              className="p-1 rounded-md text-[#0A2947]/50 hover:text-[#0A2947] transition-colors shrink-0"
              title="Copy location"
            >
              {copied ? <Check className="w-4 h-4 text-[#8B5E3C]" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Amenities grid */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
          <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
            cafe.internetAccess 
              ? 'bg-white border-[#0A2947]/15 text-[#0A2947] font-medium shadow-sm' 
              : 'bg-[#0A2947]/04 border-[#0A2947]/08 text-[#0A2947]/50'
          }`}>
            <Wifi className="w-3.5 h-3.5 text-[#8B5E3C]" />
            <span>{cafe.internetAccess ? 'WiFi Available' : 'WiFi Not Tagged'}</span>
          </div>

          <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
            cafe.outdoorSeating 
              ? 'bg-white border-[#0A2947]/15 text-[#0A2947] font-medium shadow-sm' 
              : 'bg-[#0A2947]/04 border-[#0A2947]/08 text-[#0A2947]/50'
          }`}>
            <Trees className="w-3.5 h-3.5 text-[#8B5E3C]" />
            <span>{cafe.outdoorSeating ? 'Outdoor Patio' : 'Indoor Only'}</span>
          </div>

          <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
            cafe.takeaway 
              ? 'bg-white border-[#0A2947]/15 text-[#0A2947] font-medium shadow-sm' 
              : 'bg-[#0A2947]/04 border-[#0A2947]/08 text-[#0A2947]/50'
          }`}>
            <ShoppingBag className="w-3.5 h-3.5 text-[#8B5E3C]" />
            <span>{cafe.takeaway ? 'Takeaway Available' : 'Dine-in Only'}</span>
          </div>

          <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
            cafe.wheelchair 
              ? 'bg-white border-[#0A2947]/15 text-[#0A2947] font-medium shadow-sm' 
              : 'bg-[#0A2947]/04 border-[#0A2947]/08 text-[#0A2947]/50'
          }`}>
            <Accessibility className="w-3.5 h-3.5 text-[#8B5E3C]" />
            <span>{cafe.wheelchair ? 'Accessible' : 'Standard Access'}</span>
          </div>
        </div>

        {/* Practical info (Hours, Phone, Web) */}
        <div className="space-y-1.5 mb-5 text-xs text-[#0A2947]">
          {cafe.openingHours && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-[#D3D4C0]">
              <Clock className="w-3.5 h-3.5 text-[#8B5E3C] shrink-0" />
              <div className="truncate">
                <span className="font-bold text-[#0A2947] mr-1.5">Hours:</span>
                <span className="text-[#0A2947]/75">{cafe.openingHours}</span>
              </div>
            </div>
          )}

          {cafe.phone && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-[#D3D4C0]">
              <Phone className="w-3.5 h-3.5 text-[#8B5E3C] shrink-0" />
              <a href={`tel:${cafe.phone}`} className="text-[#0A2947] font-medium hover:underline">
                {cafe.phone}
              </a>
            </div>
          )}

          {cafe.website && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-[#D3D4C0]">
              <Globe className="w-3.5 h-3.5 text-[#8B5E3C] shrink-0" />
              <a 
                href={cafe.website} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[#0A2947] font-medium hover:underline truncate"
              >
                {cafe.website}
              </a>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-3 border-t border-[#D3D4C0]">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:flex-1 h-12 rounded-full bg-[#8B5E3C] hover:bg-[#734c2f] text-[#F3E4C9] font-semibold text-xs flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 shadow-md"
          >
            <Navigation className="w-3.5 h-3.5 text-[#F3E4C9]" />
            <span>Open Route ({isApple ? 'Apple Maps' : 'Google Maps'})</span>
          </a>

          <button
            onClick={() => onToggleFavorite(cafe.id)}
            className={`w-full sm:w-auto h-12 px-5 rounded-full border flex items-center justify-center gap-1.5 text-xs font-semibold transition-all active:scale-95 ${
              isFavorite
                ? 'bg-[#0A2947] text-[#F3E4C9] border-[#0A2947]'
                : 'bg-white border-[#D3D4C0] text-[#0A2947] hover:bg-[#0A2947]/06'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-[#F3E4C9] text-[#F3E4C9]' : 'text-[#8B5E3C]'}`} />
            <span>{isFavorite ? 'Saved' : 'Save'}</span>
          </button>

          <a
            href={osmUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto h-12 px-4 rounded-full bg-white border border-[#D3D4C0] text-[#0A2947]/70 hover:text-[#0A2947] flex items-center justify-center"
            title="Inspect raw OpenStreetMap node"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
