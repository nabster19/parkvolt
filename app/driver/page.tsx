"use client";

import { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import { Zap, MapPin, Search, Star, Filter, CreditCard, ChevronRight, CheckCircle2, Clock, Camera, X, Shield, Navigation, AlertCircle, ExternalLink } from "lucide-react";
import { useSpots, Spot } from "@/hooks/useSpots";
import { useBookings, Booking } from "@/hooks/useBookings";
import { calculateDynamicPrice } from "@/utils/pricing";

interface MapProps {
  spots: any[];
  selectedSpot: any | null;
  onSelectSpot: (spot: any) => void;
  userLocation: [number, number];
  isNavigating: boolean;
  routeCoordinates?: [number, number][];
}

const MapComponent = dynamic<MapProps>(() => import("@/components/MapComponent"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-[#1E1E22] flex items-center justify-center text-white/20">Loading Map...</div>
});

const DEFAULT_USER_LOC: [number, number] = [12.3150, 76.6400];

export default function DriverDashboard() {
  const { spots, setSpotAvailability } = useSpots();
  const { createBooking, endBooking, getActiveBooking, bookings } = useBookings();
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
  
  const [vehicleType, setVehicleType] = useState<"EV" | "Non-EV">("EV");
  const [usageType, setUsageType] = useState<"parking" | "charging">("parking");

  const [isNavigating, setIsNavigating] = useState(false);
  const [userLoc, setUserLoc] = useState<[number, number]>(DEFAULT_USER_LOC);
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);
  const [routeInfo, setRouteInfo] = useState<{distance: string, duration: string} | null>(null);
  const [locError, setLocError] = useState<string | null>(null);

  const [activeSession, setActiveSession] = useState<Booking | null>(null);
  const [batteryLevel, setBatteryLevel] = useState(25);
  const [urgencyLevel, setUrgencyLevel] = useState<"low" | "medium" | "high">("medium");

  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("12:00");
  const [duration, setDuration] = useState(2);
  
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentState, setPaymentState] = useState<'idle' | 'scanning' | 'processing' | 'success'>('idle');

  // Session Re-hydration/Auto-Cleanup
  useEffect(() => {
    const active = getActiveBooking();
    if (active) {
       if (Date.now() > active.endTime) {
          endBooking(active.id);
          setSpotAvailability(active.slotId, true, undefined);
       } else {
          setActiveSession(active);
          setIsNavigating(true);
          const spot = spots.find(s => s.id === active.slotId);
          if (spot) fetchRealRoute(spot);
       }
    } else {
       setActiveSession(null);
       setIsNavigating(false);
       setRouteCoords([]);
    }
  }, [bookings.length, spots.length]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => setUserLoc([position.coords.latitude, position.coords.longitude]),
        () => setLocError("Location access denied.")
      );
    }
  }, []);

  const fetchRealRoute = async (dest: Spot) => {
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${userLoc[1]},${userLoc[0]};${dest.lng},${dest.lat}?overview=full&geometries=geojson`;
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.routes?.[0]) {
        const route = data.routes[0];
        setRouteCoords(route.geometry.coordinates.map((c: any) => [c[1], c[0]]));
        setRouteInfo({ 
           distance: (route.distance / 1000).toFixed(1), 
           duration: Math.ceil(route.duration / 60).toString() 
        });
        setLocError(null);
      }
    } catch (err) { console.error(err); }
  };

  // 2. Payment Lifecycle Management
  useEffect(() => {
    if (paymentState === 'processing') {
      const timer = setTimeout(() => {
        handleStartNavigation();
      }, 2000);
      return () => clearTimeout(timer);
    }
    if (paymentState === 'success') {
      const timer = setTimeout(() => {
        setShowCheckout(false);
        setPaymentState('idle');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [paymentState]);

  const handleStartNavigation = async () => {
    if (!selectedSpot || !priceBreakdown) return;
    try {
      // Finalize the booking before starting navigation
      const newBooking = createBooking(selectedSpot.id, duration, priceBreakdown.totalPrice);
      setSpotAvailability(selectedSpot.id, false, newBooking.id);
      
      await fetchRealRoute(selectedSpot);
      setActiveSession(newBooking);
      setIsNavigating(true);
      setPaymentState('success'); // Visual feedback
    } catch (err) {
      console.error("Booking sequence failed", err);
      setPaymentState('idle');
    }
  };

  const handleEndEarly = () => {
    if (!activeSession) return;
    endBooking(activeSession.id);
    setSpotAvailability(activeSession.slotId, true, undefined);
    setActiveSession(null);
    setIsNavigating(false);
    setRouteCoords([]);
    setSelectedSpot(null);
  };

  const priceBreakdown = useMemo(() => {
    if (!selectedSpot) return null;
    return calculateDynamicPrice(selectedSpot, usageType === 'charging', duration, startTime, spots);
  }, [selectedSpot, usageType, duration, startTime, spots]);

  const recommendedSpots = useMemo(() => {
    return spots.filter(spot => {
       if (!spot.isAvailable || spot.isDisabledByHost) return false;
       if (vehicleType === "Non-EV") return !spot.hasEvCharging;
       if (usageType === "charging") return spot.hasEvCharging;
       return true;
    }).map(spot => {
      let score = 0;
      const distanceWeight = urgencyLevel === "high" ? 100 : urgencyLevel === "medium" ? 40 : 15;
      score += (spot.distanceKm * distanceWeight);
      score -= (spot.rating * 20);
      return { ...spot, score };
    }).sort((a, b) => a.score - b.score);
  }, [spots, vehicleType, usageType, urgencyLevel]);

  return (
    <div className="flex h-[calc(100vh-4rem)] max-w-[1600px] mx-auto overflow-hidden text-white font-sans">
      <div className="w-full md:w-[380px] border-r border-white/10 bg-dark-bg flex flex-col h-full relative z-10 shadow-2xl">
        {activeSession ? (
          <div className="p-8 h-full flex flex-col bg-[#0A0A0B]/50 backdrop-blur-xl">
             <div className="flex items-center gap-4 mb-8">
                <div className="p-4 rounded-3xl bg-neon-green/10 border border-neon-green/20"><Clock className="w-8 h-8 text-neon-green animate-pulse" /></div>
                <div><h2 className="text-2xl font-black uppercase tracking-tighter">Monitoring</h2><span className="text-[10px] text-white/30 uppercase font-black tracking-widest leading-none">Session In-Progress</span></div>
             </div>
             <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 mb-6">
                <h3 className="text-xl font-bold truncate mb-1">{spots.find(s => s.id === activeSession.slotId)?.title}</h3>
                <p className="text-white/40 text-sm mb-6 flex items-center gap-2"><Navigation className="w-4 h-4 text-electric-blue" /> Optimal road route active.</p>
                <div className="grid grid-cols-1 gap-4">
                   <div className="bg-black/40 p-5 rounded-2xl border border-white/5"><span className="text-[10px] text-white/20 uppercase font-black block mb-1">Session ID</span><div className="text-xl font-black text-neon-green uppercase tracking-tighter">PRK-{activeSession.id.toUpperCase()}</div></div>
                </div>
             </div>
             <div className="flex-1"></div>
             <div className="space-y-3 mb-8">
                <button onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${spots.find(s => s.id === activeSession.slotId)?.lat},${spots.find(s => s.id === activeSession.slotId)?.lng}`, "_blank")} className="w-full bg-white/5 border border-white/10 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-all"><ExternalLink className="w-4 h-4" /> GOOGLE MAPS BRIDGE</button>
                <button onClick={handleEndEarly} className="w-full bg-red-500 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"><X className="w-4 h-4" /> TERMINATE PARKING</button>
             </div>
          </div>
        ) : (
          <>
            <div className="p-6 border-b border-white/10 shrink-0 space-y-5 bg-[#0D0D0E]/50 backdrop-blur-xl">
              <div className="flex items-center justify-between"><h2 className="text-xl font-black text-white flex items-center gap-2 tracking-tighter"><Zap className="w-5 h-5 text-neon-green fill-neon-green" /> PARKVOLT LIVE</h2><div className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-white/5 border border-white/10 text-white/40">Realtime Scan</div></div>
              <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                {(['EV', 'Non-EV'] as const).map(type => (
                  <button key={type} onClick={() => setVehicleType(type)} className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${vehicleType === type ? 'bg-white text-black shadow-lg' : 'text-white/20 hover:text-white/40'}`}>{type}</button>
                ))}
              </div>
              <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                {(['parking', 'charging'] as const).map(intent => (
                  <button key={intent} disabled={vehicleType === 'Non-EV' && intent === 'charging'} onClick={() => setUsageType(intent)} className={`flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-10 ${usageType === intent ? 'bg-electric-blue text-black shadow-lg shadow-electric-blue/20' : 'text-white/20 hover:text-white/40'}`}>{intent}</button>
                ))}
              </div>
              <div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" /><input type="text" placeholder="Search Mysuru Zones..." className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-xs outline-none focus:border-electric-blue transition-all" /></div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {recommendedSpots.map((spot) => (
                <div key={spot.id} onClick={() => setSelectedSpot(spot)} className={`relative p-5 rounded-2xl cursor-pointer border transition-all duration-300 ${selectedSpot?.id === spot.id ? 'bg-white/10 border-electric-blue shadow-[0_0_25px_rgba(0,240,255,0.1)] scale-[1.02]' : 'bg-white/[0.02] border-white/5 hover:border-white/20 hover:translate-x-1'}`}>
                  <div className="flex gap-4">
                    <div className="mt-1 text-3xl shrink-0 drop-shadow-lg">{spot.hasEvCharging ? "🔋" : "📍"}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1"><h3 className="font-bold text-base truncate pr-2">{spot.title}</h3><span className="text-[10px] font-black text-electric-blue shrink-0">₹{spot.basePrice}/hr</span></div>
                      <div className="flex items-center gap-4 text-[10px] text-white/40 font-black uppercase tracking-widest"><span>{spot.distanceKm} km</span><span>•</span><span><Star className="inline w-3 h-3 text-yellow-500 fill-yellow-500 mr-1 translate-y-[-1px]" />{spot.rating}</span></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="flex-1 relative bg-[#1E1E22]">
        <MapComponent spots={recommendedSpots} selectedSpot={selectedSpot} onSelectSpot={setSelectedSpot} userLocation={userLoc} isNavigating={isNavigating} routeCoordinates={routeCoords} />
        
        {selectedSpot && !showCheckout && (
          <div className="absolute bottom-8 left-8 right-8 bg-dark-bg/95 backdrop-blur-2xl border border-white/10 rounded-[40px] p-8 shadow-2xl z-20 animate-in slide-in-from-bottom-10">
            <div className="flex justify-between items-start mb-8">
              <div className="flex-1 min-w-0 pr-6">
                <h2 className="text-3xl font-black mb-2 uppercase tracking-tighter truncate">{selectedSpot.title}</h2>
                <div className="flex items-center gap-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]"><span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-electric-blue" /> Zone G3</span><span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-neon-green" /> Level 2 Fast</span></div>
              </div>
              <div className="text-right shrink-0">
                 <div className="text-[10px] font-black text-neon-green uppercase tracking-widest mb-1">Live Estimate</div>
                 <div className="text-4xl font-black tabular-nums tracking-tighter">₹{priceBreakdown?.totalPrice}</div>
              </div>
            </div>
            <button onClick={() => setShowCheckout(true)} className="w-full bg-white text-black py-6 rounded-3xl font-black text-xl hover:bg-neon-green transition-all shadow-xl shadow-white/10 uppercase tracking-tighter">INITIATE FINAL CHECKOUT</button>
          </div>
        )}

        {showCheckout && selectedSpot && (
           <div className="absolute inset-0 bg-black/90 backdrop-blur-3xl z-[100] flex items-center justify-center p-6">
              <div className="max-w-md w-full bg-dark-bg border border-white/10 rounded-[50px] p-12 relative overflow-hidden shadow-2xl">
                 <button 
                   onClick={() => { setShowCheckout(false); setPaymentState('idle'); }} 
                   className="absolute top-10 right-10 text-white/40 hover:text-white transition-colors duration-300"
                 >
                   <X className="w-8 h-8" />
                 </button>

                 {paymentState === 'idle' && (
                   <div className="animate-in fade-in duration-500">
                      <div className="mb-10 text-center">
                         <div className="w-20 h-20 bg-electric-blue/10 border border-electric-blue/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CreditCard className="w-10 h-10 text-electric-blue" />
                         </div>
                         <h2 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">Final Checkout</h2>
                         <p className="text-sm text-white/30 font-bold uppercase tracking-widest">Connect to Payment Gateway</p>
                      </div>
                      <div className="space-y-6 mb-12">
                         <div className="flex justify-between items-center text-xs py-5 border-b border-white/5"><span className="text-white/40 uppercase font-black tracking-widest">Selected Spot</span><span className="text-white font-bold text-sm">{selectedSpot.title}</span></div>
                         <div className="flex justify-between items-center text-xs py-5 border-b border-white/5"><span className="text-white/40 uppercase font-black tracking-widest">Duration</span><span className="text-white font-bold text-sm tracking-widest">{duration} Hours</span></div>
                         <div className="flex justify-between items-center text-4xl font-black uppercase tracking-tighter pt-4 text-white"><span>Total Due</span><span className="text-neon-green font-mono">₹{priceBreakdown?.totalPrice}</span></div>
                      </div>
                      <button 
                        onClick={() => setPaymentState('scanning')} 
                        className="w-full bg-electric-blue text-black py-6 rounded-[30px] font-black text-2xl hover:scale-[1.02] transition-all shadow-2xl shadow-electric-blue/20 uppercase tracking-tighter"
                      >
                        SCAN TO PAY
                      </button>
                   </div>
                 )}

                 {paymentState === 'scanning' && (
                   <div className="text-center py-10 animate-in zoom-in duration-500">
                      <div className="w-64 h-64 border-2 border-white/10 rounded-[40px] mx-auto mb-10 flex items-center justify-center relative overflow-hidden group">
                         <Camera className="w-16 h-16 text-white/20" />
                         <div className="absolute inset-0 border-[4px] border-neon-green/40 m-8 rounded-3xl"></div>
                         <div className="absolute top-0 left-0 w-full h-[4px] bg-neon-green shadow-[0_0_15px_#22c55e] animate-scan-line"></div>
                         <div className="absolute inset-0 bg-neon-green/5 animate-pulse"></div>
                      </div>
                      <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter">Scanning Gateway...</h3>
                      <p className="text-white/40 font-bold text-[10px] uppercase tracking-widest">Point your mobile lens at the terminal</p>
                      <button onClick={() => setPaymentState('processing')} className="mt-12 text-[10px] font-black text-electric-blue hover:text-white transition-colors underline uppercase tracking-widest">Manually confirm scan</button>
                   </div>
                 )}

                 {paymentState === 'processing' && (
                   <div className="text-center py-20 animate-in fade-in duration-500">
                      <div className="flex justify-center mb-10">
                         <div className="w-16 h-16 border-4 border-white/5 border-t-electric-blue rounded-full animate-spin"></div>
                      </div>
                      <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter">Securing Transaction...</h3>
                      <p className="text-white/40 font-bold text-[10px] uppercase tracking-widest leading-loose">Encrypting secure payment tunnel</p>
                   </div>
                 )}

                 {paymentState === 'success' && (
                   <div className="text-center py-10 animate-in slide-in-from-bottom-10 duration-700">
                      <div className="w-24 h-24 bg-neon-green border-[8px] border-neon-green/20 rounded-full flex items-center justify-center mx-auto mb-10 shadow-[0_0_40px_rgba(34,197,94,0.3)]">
                         <CheckCircle2 className="w-12 h-12 text-black" />
                      </div>
                      <h3 className="text-4xl font-black mb-4 text-neon-green uppercase tracking-tighter italic">Payment Secured!</h3>
                      <p className="text-white/60 font-bold text-xs uppercase tracking-widest mb-10">Initializing live road route</p>
                      <button className="text-white animate-bounce"><Navigation className="w-8 h-8 mx-auto" /></button>
                   </div>
                 )}
              </div>
           </div>
        )}
      </div>
    </div>
  );
}
