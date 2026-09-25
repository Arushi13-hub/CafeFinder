import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Check, Sparkles } from 'lucide-react';

export default function CartModal({
  isOpen,
  onClose,
  cartItems = [],
  onRemoveItem,
  onClearCart,
  discountPercent = 0
}) {
  const [isOrdered, setIsOrdered] = useState(false);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + (item.finalPrice || item.priceNumber || 220), 0);
  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const deliveryFee = subtotal > 0 ? 30 : 0;
  const total = Math.max(0, subtotal - discountAmount + deliveryFee);

  const handleCheckout = () => {
    setIsOrdered(true);
    setTimeout(() => {
      setIsOrdered(false);
      if (onClearCart) onClearCart();
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div 
        className="fixed inset-0 bg-[#0A2947]/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      <div className="relative w-full max-w-lg bg-[#FAF7EE] rounded-t-[32px] sm:rounded-3xl shadow-2xl z-10 overflow-hidden border border-[#D3D4C0]/80 p-6 space-y-5 animate-modal-enter max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#D3D4C0]/70">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#8B5E3C]" />
            <h2 className="text-xl font-bold tracking-tight text-[#0A2947]">
              My Coffee Bag ({cartItems.length})
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white hover:bg-[#FAF7EE] text-[#0A2947] flex items-center justify-center shadow-sm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Items List */}
        <div className="overflow-y-auto space-y-3 max-h-60 no-scrollbar">
          {cartItems.length > 0 ? (
            cartItems.map((item, idx) => (
              <div 
                key={`${item.id}-${idx}`}
                className="p-3 bg-white rounded-2xl border border-[#D3D4C0]/60 flex items-center justify-between gap-3 shadow-sm"
              >
                <img 
                  src={item.image || item.photoUrl} 
                  alt={item.name} 
                  className="w-14 h-14 rounded-xl object-cover shrink-0 bg-[#0A2947]/10" 
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-[#0A2947] truncate">{item.name}</h4>
                  <p className="text-[11px] text-[#0A2947]/60 font-mono">
                    Size: {item.selectedSize || 'M'} • {item.sugarLevel || 'Normal'}
                  </p>
                  <p className="text-xs font-bold text-[#8B5E3C]">
                    ₹{item.finalPrice || item.priceNumber || 220}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onRemoveItem(idx)}
                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-[#0A2947]/60 space-y-2">
              <ShoppingBag className="w-10 h-10 text-[#8B5E3C] mx-auto opacity-40" />
              <p className="text-xs font-medium">Your coffee bag is currently empty.</p>
            </div>
          )}
        </div>

        {/* Bill Summary */}
        {cartItems.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-[#D3D4C0]/70 text-xs">
            <div className="flex justify-between text-[#0A2947]/70">
              <span>Subtotal</span>
              <span className="font-mono">₹{subtotal}</span>
            </div>
            {discountPercent > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Promo BOGO Discount ({discountPercent}%)</span>
                </span>
                <span className="font-mono">-₹{discountAmount}</span>
              </div>
            )}
            <div className="flex justify-between text-[#0A2947]/70">
              <span>Roastery Pickup / Packing</span>
              <span className="font-mono">₹{deliveryFee}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-[#0A2947] pt-2 border-t border-[#D3D4C0]/50">
              <span>Total Amount</span>
              <span className="font-mono text-[#8B5E3C]">₹{total}</span>
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          disabled={cartItems.length === 0 || isOrdered}
          onClick={handleCheckout}
          className={`w-full h-12 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 ${
            isOrdered
              ? 'bg-emerald-600 text-white'
              : cartItems.length === 0
              ? 'bg-[#0A2947]/20 text-[#0A2947]/40 cursor-not-allowed'
              : 'bg-[#8B5E3C] hover:bg-[#724c30] text-white shadow-[#8B5E3C]/30'
          }`}
        >
          {isOrdered ? (
            <>
              <Check className="w-5 h-5 stroke-[3]" />
              <span>Order Placed! Brewing now...</span>
            </>
          ) : (
            <>
              <span>Place Roastery Pickup Order</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
