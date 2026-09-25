import React, { useState } from 'react';
import { 
  X, 
  Star, 
  Heart, 
  Footprints, 
  Navigation, 
  ShoppingBag, 
  Check, 
  Flame, 
  Coffee,
  Sparkles
} from 'lucide-react';

export default function ProductDetailModal({
  product,
  onClose,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
  userCoords
}) {
  const [selectedSize, setSelectedSize] = useState('M');
  const [sugarLevel, setSugarLevel] = useState('Normal');
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const sizeMultiplier = { S: 0.85, M: 1, L: 1.25 };
  const basePrice = product.priceNumber || 220;
  const currentPrice = Math.round(basePrice * sizeMultiplier[selectedSize]);

  const handleAdd = () => {
    setAdded(true);
    if (onAddToCart) {
      onAddToCart({
        ...product,
        selectedSize,
        sugarLevel,
        finalPrice: currentPrice
      });
    }
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 900);
  };

  const isApple = typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent);
  const directionsUrl = product.lat && product.lon
    ? userCoords
      ? isApple
        ? `https://maps.apple.com/?saddr=${userCoords.lat},${userCoords.lon}&daddr=${product.lat},${product.lon}&dirflg=w`
        : `https://www.google.com/maps/dir/?api=1&origin=${userCoords.lat},${userCoords.lon}&destination=${product.lat},${product.lon}&travelmode=walking`
      : isApple
        ? `https://maps.apple.com/?daddr=${product.lat},${product.lon}&dirflg=w`
        : `https://www.google.com/maps/dir/?api=1&destination=${product.lat},${product.lon}&travelmode=walking`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(product.cafeName || product.name)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#0A2947]/60 backdrop-blur-sm transition-opacity"
        onClick={onClose} 
      />

      {/* Sheet Container */}
      <div className="relative w-full max-w-lg bg-[#FAF7EE] rounded-t-[32px] sm:rounded-3xl shadow-2xl z-10 overflow-hidden border border-[#D3D4C0]/80 animate-modal-enter max-h-[92vh] flex flex-col">
        
        {/* Top Header Buttons */}
        <div className="absolute top-4 inset-x-4 z-20 flex items-center justify-between pointer-events-none">
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-md text-[#0A2947] hover:bg-white flex items-center justify-center pointer-events-auto transition-transform active:scale-90"
          >
            <X className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => onToggleFavorite(product.id)}
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-md text-[#0A2947] hover:text-[#8B5E3C] flex items-center justify-center pointer-events-auto transition-transform active:scale-90"
          >
            <Heart className={`w-5 h-5 transition-colors ${isFavorite ? 'fill-[#8B5E3C] text-[#8B5E3C]' : ''}`} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto no-scrollbar pb-24">
          {/* Hero Image */}
          <div className="relative w-full h-72 sm:h-80 bg-[#0A2947]/10">
            <img 
              src={product.image || product.photoUrl} 
              alt={product.name} 
              loading="lazy"
              decoding="async"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20200%20200%22%20fill%3D%22%23FAF7EE%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23FAF7EE%22%2F%3E%3Cpath%20d%3D%22M50%2075h70v40a35%2035%200%200%201-35%2035H85a35%2035%200%200%201-35-35V75zm70%2015h12a15%2015%200%200%201%200%2030h-12V90z%22%20fill%3D%22%238B5E3C%22%20opacity%3D%220.8%22%2F%3E%3Cpath%20d%3D%22M70%2055c0-8%206-12%206-20m18%2020c0-8%206-12%206-20m18%2020c0-8%206-12%206-20%22%20stroke%3D%22%238B5E3C%22%20stroke-width%3D%223%22%20stroke-linecap%3D%22round%22%20fill%3D%22none%22%20opacity%3D%220.6%22%2F%3E%3C%2Fsvg%3E";
              }}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7EE] via-transparent to-transparent opacity-80" />

            {/* Rating Tag */}
            <div className="absolute bottom-4 left-6 px-3 py-1 rounded-full bg-[#0A2947]/85 backdrop-blur-md text-[#FAF7EE] text-xs font-mono font-bold flex items-center gap-1.5 shadow-md">
              <Star className="w-3.5 h-3.5 fill-[#8B5E3C] text-[#8B5E3C]" />
              <span>{product.rating || '4.8'}</span>
              <span className="text-[#FAF7EE]/60 text-[10px] font-normal">(120+ reviews)</span>
            </div>
          </div>

          <div className="px-6 pt-2 space-y-5">
            {/* Title & Cafe Name */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono uppercase tracking-wider text-[#8B5E3C]">
                  {product.category || 'Specialty Coffee'}
                </span>
                <span className="text-xs font-semibold text-[#8B5E3C] flex items-center gap-1">
                  <Footprints className="w-3.5 h-3.5" />
                  <span>{product.walkTime || '6 min walk'}</span>
                </span>
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-[#0A2947] mt-0.5">
                {product.name}
              </h2>

              <p className="text-xs text-[#0A2947]/70 font-medium mt-0.5">
                Available fresh at <span className="text-[#0A2947] font-bold">{product.cafeName || 'Artisan Roasters Raipur'}</span>
              </p>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A2947]/60 font-mono">
                Description
              </h3>
              <p className="text-xs sm:text-sm text-[#0A2947]/80 leading-relaxed">
                {product.description || 'Crafted with sustainably sourced single-origin Arabica beans, slow-extracted to bring out rich caramel notes and velvet crema.'}
              </p>
            </div>

            {/* Size Selector (UIX-Maruf Reference) */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A2947]/60 font-mono">
                Select Cup Size
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { size: 'S', label: 'Small', vol: '240ml' },
                  { size: 'M', label: 'Medium', vol: '360ml' },
                  { size: 'L', label: 'Large', vol: '480ml' },
                ].map((item) => (
                  <button
                    key={item.size}
                    type="button"
                    onClick={() => setSelectedSize(item.size)}
                    className={`py-2.5 px-3 rounded-2xl border text-center transition-all active:scale-95 ${
                      selectedSize === item.size
                        ? 'bg-[#0A2947] text-[#FAF7EE] border-[#0A2947] shadow-md'
                        : 'bg-white text-[#0A2947] border-[#D3D4C0]/70 hover:border-[#8B5E3C]'
                    }`}
                  >
                    <div className="text-sm font-bold">{item.label}</div>
                    <div className={`text-[10px] font-mono ${selectedSize === item.size ? 'text-[#FAF7EE]/70' : 'text-[#0A2947]/60'}`}>
                      {item.vol}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Sweetness / Milk Customization */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A2947]/60 font-mono">
                Sweetness Level
              </h3>
              <div className="flex gap-2">
                {['No Sugar', 'Less Sugar', 'Normal', 'Extra Sweet'].map((sugar) => (
                  <button
                    key={sugar}
                    type="button"
                    onClick={() => setSugarLevel(sugar)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                      sugarLevel === sugar
                        ? 'bg-[#8B5E3C] text-white border-[#8B5E3C] shadow-sm'
                        : 'bg-white text-[#0A2947]/80 border-[#D3D4C0]/70 hover:bg-[#FAF7EE]'
                    }`}
                  >
                    {sugar}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Directions Link */}
            <div className="pt-2">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-2xl bg-white border border-[#D3D4C0]/80 hover:border-[#8B5E3C] text-xs font-semibold text-[#0A2947] flex items-center justify-between transition-colors shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-[#8B5E3C]" />
                  <span>Navigate to Roastery in Raipur</span>
                </div>
                <span className="text-[11px] font-mono text-[#8B5E3C]">Google Maps &rarr;</span>
              </a>
            </div>
          </div>
        </div>

        {/* Fixed Bottom Action Bar */}
        <div className="absolute bottom-0 inset-x-0 p-4 bg-[#FAF7EE]/95 backdrop-blur-xl border-t border-[#D3D4C0]/80 flex items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-mono uppercase text-[#0A2947]/60 font-bold">
              Total Price
            </div>
            <div className="text-2xl font-bold tracking-tight text-[#0A2947]">
              ₹{currentPrice}
            </div>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className={`flex-1 h-12 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 ${
              added
                ? 'bg-emerald-600 text-white'
                : 'bg-[#8B5E3C] hover:bg-[#724c30] text-white shadow-[#8B5E3C]/30'
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Added to Bag!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
