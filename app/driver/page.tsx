"use client";

import { useState, useMemo } from "react";
import { Zap, MapPin, Search, Star, Filter, CreditCard, ChevronRight, CheckCircle2 } from "lucide-react";

// Mock Data
const MOCK_SPOTS = [
  {
    id: "1",
    title: "Downtown Tech Hub Parking",
    pricePerHour: 4.5,
    distanceKm: 1.2,
    hasEvCharging: true,
    chargerType: "Level 3 (DC Fast)",
    chargingFee: 15,
    rating: 4.9,
    chargingRating: 4.8
  },
  {
    id: "2",
    title: "Main Street Driveway",
    pricePerHour: 2.0,
    distanceKm: 0.8,
    hasEvCharging: false,
    chargerType: null,
    chargingFee: 0,
    rating: 4.5,
    chargingRating: null
  },
  {
    id: "3",
    title: "Eco-Friendly Residence",
    pricePerHour: 3.5,
    distanceKm: 3.0,
    hasEvCharging: true,
    chargerType: "Level 2",
    chargingFee: 5,
    rating: 4.7,
    chargingRating: 4.9
  },
  {
    id: "4",
    title: "City Center Garage Spot 42",
    pricePerHour: 6.0,
    distanceKm: 0.5,
    hasEvCharging: true,
    chargerType: "Level 2",
    chargingFee: 8,
    rating: 4.2,
    chargingRating: 4.0
  },
  {
    id: "5",
    title: "Suburban Cheap Spot",
    pricePerHour: 1.5,
    distanceKm: 5.5,
    hasEvCharging: false,
    chargerType: null,
    chargingFee: 0,
    rating: 4.6,
    chargingRating: null
  }
];

export default function DriverDashboard() {
  const [needCharging, setNeedCharging] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState<typeof MOCK_SPOTS[0] | null>(null);
  const [bookingHours, setBookingHours] = useState(2);
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentState, setPaymentState] = useState<'idle' | 'processing' | 'success'>('idle');

  // Smart Recommendation Engine (The Logic)
  // Formula: Score = (Weight_dist * Distance) + (Weight_price * Price) - (EV_bonus)
  // Lower score is better.
  const recommendedSpots = useMemo(() => {
    let filtered = MOCK_SPOTS;
    
    // Toggle Logic: If on, hide all spots that don't have EV capabilities
    if (needCharging) {
      filtered = filtered.filter(spot => spot.hasEvCharging);
    }

    const WEIGHT_DIST = 2; // Priority to distance
    const WEIGHT_PRICE = 1;

    return filtered.map(spot => {
      let evBonus = 0;
      if (needCharging && spot.hasEvCharging) {
        // High EV bonus if user needs it
        evBonus = 10;
        // Even more bonus for faster chargers
        if (spot.chargerType?.includes("Level 3")) evBonus += 5;
      }

      const score = (WEIGHT_DIST * spot.distanceKm) + (WEIGHT_PRICE * spot.pricePerHour) - evBonus;
      return { ...spot, score };
    }).sort((a, b) => a.score - b.score);
  }, [needCharging]);

  const bestMatchId = recommendedSpots.length > 0 ? recommendedSpots[0].id : null;

  const calculateTotal = (spot: typeof MOCK_SPOTS[0]) => {
    const parkingTotal = spot.pricePerHour * bookingHours;
    let total = parkingTotal;
    if (spot.hasEvCharging && needCharging) {
      total += spot.chargingFee;
    }
    return { parkingTotal, chargingTotal: needCharging && spot.hasEvCharging ? spot.chargingFee : 0, total };
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] max-w-[1600px] mx-auto overflow-hidden">
      {/* Sidebar - Listings */}
      <div className="w-full md:w-1/3 border-r border-white/10 bg-dark-bg flex flex-col h-full relative z-10">
        
        {/* Search & Filters */}
        <div className="p-4 border-b border-white/10 shrink-0">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
            <input 
              type="text" 
              placeholder="Where are you going?" 
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue transition-all"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center cursor-pointer gap-3 group">
              <div className="relative">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={needCharging}
                  onChange={() => setNeedCharging(!needCharging)}
                />
                <div className={`block w-12 h-6 rounded-full transition-colors ${needCharging ? 'bg-neon-green' : 'bg-white/10 border border-white/20'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${needCharging ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </div>
              <span className={`text-sm font-medium flex items-center gap-1.5 transition-colors ${needCharging ? 'text-neon-green' : 'text-white/70 group-hover:text-white'}`}>
                <Zap className="w-4 h-4" />
                I need to charge
              </span>
            </label>
            <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Spot List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {recommendedSpots.length === 0 ? (
            <div className="text-center py-10 text-white/50">
              No spots found matching your criteria.
            </div>
          ) : (
            recommendedSpots.map(spot => (
              <div 
                key={spot.id} 
                onClick={() => setSelectedSpot(spot)}
                className={`relative p-4 rounded-xl cursor-pointer border transition-all ${
                  selectedSpot?.id === spot.id 
                    ? 'bg-white/10 border-electric-blue shadow-[0_0_15px_rgba(0,240,255,0.15)]' 
                    : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                }`}
              >
                {spot.id === bestMatchId && (
                  <div className="absolute -top-3 -right-2 bg-gradient-to-r from-electric-blue to-neon-green text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                    <Star className="w-3 h-3 fill-black" /> Best Match
                  </div>
                )}
                
                <h3 className="font-semibold text-[15px] mb-1">{spot.title}</h3>
                
                <div className="flex items-center gap-3 text-xs text-white/60 mb-3">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {spot.distanceKm} km away</span>
                  <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400 fill-yellow-400" /> {spot.rating}</span>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="font-bold text-lg">${spot.pricePerHour}<span className="text-xs text-white/50 font-normal">/hr</span></div>
                  {spot.hasEvCharging && (
                    <div className="flex items-center gap-1 text-xs text-neon-green bg-neon-green/10 px-2 py-1 rounded-md">
                      <Zap className="w-3 h-3" />
                      {spot.chargerType}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Content - Map & Booking */}
      <div className="hidden md:flex flex-1 flex-col relative bg-[#1E1E22] overflow-hidden">
        {/* Mock Map Background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle at center, #27272A 2px, transparent 2px)', backgroundSize: '40px 40px' }} />
        
        {/* Map UI Overlay placeholders */}
        <div className="absolute inset-0 flex items-center justify-center p-8 pointer-events-none">
           {selectedSpot ? (
              <div className="w-16 h-16 rounded-full bg-electric-blue/20 flex items-center justify-center shadow-[0_0_30px_rgba(0,240,255,0.4)] animate-pulse border border-electric-blue relative">
                 <MapPin className="w-8 h-8 text-electric-blue" />
              </div>
           ) : (
              <div className="text-white/20 font-bold text-2xl flex flex-col items-center gap-4">
                 <MapPin className="w-16 h-16" />
                 Select a spot on the left
              </div>
           )}
        </div>

        {/* Spot Details Panel (Appears at bottom when selected) */}
        {selectedSpot && !showCheckout && (
          <div className="absolute bottom-6 left-6 right-6 bg-dark-bg/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl z-20 animate-in slide-in-from-bottom-5">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">{selectedSpot.title}</h2>
                <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-electric-blue" /> {selectedSpot.distanceKm} km away</span>
                  <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> {selectedSpot.rating} Parking</span>
                  {selectedSpot.hasEvCharging && (
                     <span className="flex items-center gap-1"><Star className="w-4 h-4 text-neon-green fill-neon-green" /> {selectedSpot.chargingRating} Charging</span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-extrabold text-electric-blue">${selectedSpot.pricePerHour}<span className="text-base text-white/50 font-normal">/hr</span></div>
              </div>
            </div>

            {selectedSpot.hasEvCharging && (
              <div className="mb-6 p-4 rounded-xl border border-neon-green/20 bg-neon-green/5 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-neon-green flex items-center gap-2"><Zap className="w-4 h-4" /> EV Charging Unit</h4>
                  <p className="text-sm text-white/60 mt-1">{selectedSpot.chargerType}</p>
                </div>
                <div className="text-right">
                  <div className="font-bold">+${selectedSpot.chargingFee}</div>
                  <div className="text-xs text-white/60">flat fee</div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between border-t border-white/10 pt-6">
              <div className="flex items-center gap-3">
                <label className="text-sm text-white/70">Duration:</label>
                <select 
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-electric-blue"
                  value={bookingHours}
                  onChange={(e) => setBookingHours(Number(e.target.value))}
                >
                  <option value={1}>1 Hour</option>
                  <option value={2}>2 Hours</option>
                  <option value={4}>4 Hours</option>
                  <option value={8}>8 Hours</option>
                </select>
              </div>
              <button 
                onClick={() => {
                  setShowCheckout(true);
                  setPaymentState('idle');
                }}
                className="bg-electric-blue text-black font-semibold px-6 py-2.5 rounded-lg hover:bg-electric-blue/90 transition-colors flex items-center gap-2"
              >
                Reserve Spot <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Checkout Modal Overlay */}
        {selectedSpot && showCheckout && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-30 flex items-center justify-center p-6">
            <div className="bg-dark-surface border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            {paymentState === 'success' ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-16 h-16 text-neon-green mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Payment Successful!</h3>
                <p className="text-white/60 mb-6">Your spot is booked and ready.</p>
                <button 
                  onClick={() => { setShowCheckout(false); setPaymentState('idle'); }}
                  className="w-full bg-white text-black font-semibold py-3 rounded-xl hover:bg-white/90 transition-colors"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-6">Confirm Checkout</h2>
                
                <div className="bg-black/50 rounded-xl p-4 mb-6 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Spot</span>
                    <span>{selectedSpot.title}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Duration</span>
                    <span>{bookingHours} hours</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Parking Rate</span>
                    <span>${selectedSpot.pricePerHour}/hr</span>
                  </div>
                  {selectedSpot.hasEvCharging && needCharging && (
                    <div className="flex justify-between text-sm text-neon-green">
                      <span>Charging Add-on</span>
                      <span>+${selectedSpot.chargingFee}</span>
                    </div>
                  )}
                  
                  <div className="border-t border-white/10 pt-3 mt-3 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-electric-blue">${calculateTotal(selectedSpot).total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center mb-6">
                  <p className="text-white/50 text-sm mb-3">Scan to pay directly</p>
                  <div className="bg-white p-2 rounded-xl relative">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ParkVoltPaymentDemo" alt="Fake QR Code" width={120} height={120} className="rounded-lg" />
                    {paymentState === 'processing' && (
                      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-electric-blue border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <button 
                    onClick={() => {
                      setPaymentState('processing');
                      setTimeout(() => setPaymentState('success'), 2000);
                    }}
                    disabled={paymentState === 'processing'}
                    className="w-full bg-white text-black font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-white/90 transition-colors disabled:opacity-50"
                  >
                    {paymentState === 'processing' ? 'Processing Transaction...' : (
                      <><CreditCard className="w-5 h-5" /> Simulate Payment</>
                    )}
                  </button>
                  <button 
                    onClick={() => setShowCheckout(false)}
                    disabled={paymentState === 'processing'}
                    className="w-full bg-transparent text-white/70 py-3 rounded-xl hover:text-white transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
