"use client";

import { useState, useMemo, useEffect } from "react";
import { Zap, MapPin, Banknote, CalendarDays, Plus, Activity, Settings, TrendingUp, X, Check, Search, Save, Trash2, Edit3, Power, PieChart, BarChart3, LineChart as LineChartIcon, ArrowUpRight, Star, CheckCircle2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useSpots, Spot } from "@/hooks/useSpots";
import { useBookings, Booking } from "@/hooks/useBookings";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart as RePie, Pie } from "recharts";

const MapComponent = dynamic<any>(() => import("@/components/MapComponent"), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-[#1E1E22] flex items-center justify-center text-white/20">Loading Map...</div>
});

const COLORS = ['#00f0ff', '#22c55e', '#a855f7', '#f59e0b', '#ef4444'];
const DEFAULT_USER_LOC: [number, number] = [12.3150, 76.6400];

export default function HostDashboard() {
  const { spots, addSpot, removeSpot, toggleSpotStatus, updateSpot } = useSpots();
  const { bookings } = useBookings();
  const [activeTab, setActiveTab] = useState<"listings" | "earnings" | "analytics">("listings");
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSpot, setEditingSpot] = useState<Spot | null>(null);
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);

  const [newSpot, setNewSpot] = useState({
    title: "",
    address: "",
    lat: 12.3052,
    lng: 76.6552,
    hasEvCharging: false,
    chargerType: "Level 2 AC"
  });

  const [isPickingLocation, setIsPickingLocation] = useState(false);

  // --- Analytics & Financial Logic ---
  const stats = useMemo(() => {
    const now = Date.now();
    const completed = bookings.filter(b => b.status === "completed").sort((a,b) => b.startTime - a.startTime);
    
    const totalEarnings = completed.reduce((sum, b) => sum + b.pricePaid, 0);
    const todayEarnings = completed.filter(b => now - b.startTime < 86400000).reduce((sum, b) => sum + b.pricePaid, 0);
    const activeCount = bookings.filter(b => b.status === "active").length;

    const slotUsage = spots.map(spot => {
      const spotBookings = bookings.filter(b => b.slotId === spot.id);
      const spotEarnings = spotBookings.filter(b => b.status === "completed").reduce((s, b) => s + b.pricePaid, 0);
      const totalBookedMinutes = spotBookings.reduce((sum, b) => {
        const end = b.actualEndTime || b.endTime;
        return sum + (end - b.startTime) / 60000;
      }, 0);
      
      const availableTime = 7 * 24 * 60; 
      const usagePercentage = Math.min(100, (totalBookedMinutes / availableTime) * 100);

      return {
        name: spot.title.split(' ')[0],
        usage: Math.round(usagePercentage),
        earnings: spotEarnings,
        fullName: spot.title,
        id: spot.id
      };
    });

    const topEarningSlot = [...slotUsage].sort((a,b) => b.earnings - a.earnings)[0];
    const overallUsage = slotUsage.length > 0 
      ? Math.round(slotUsage.reduce((s, u) => s + u.usage, 0) / slotUsage.length) 
      : 0;

    const baseIncome = totalEarnings / 7;
    const earningsTrend = [
      { day: "Mon", income: Math.round(baseIncome * 0.8) },
      { day: "Tue", income: Math.round(baseIncome * 1.2) },
      { day: "Wed", income: Math.round(baseIncome * 0.9) },
      { day: "Thu", income: Math.round(baseIncome * 1.5) },
      { day: "Fri", income: Math.round(baseIncome * 2.1) },
      { day: "Sat", income: Math.round(baseIncome * 1.1) },
      { day: "Sun", income: Math.round(totalEarnings > 0 ? baseIncome : 0) },
    ];

    return { totalEarnings, todayEarnings, activeCount, slotUsage, overallUsage, earningsTrend, completedCount: completed.length, completed, topEarningSlot };
  }, [bookings, spots]);

  const handlePublish = () => {
    if (!newSpot.title) return;
    addSpot(newSpot);
    setShowAddModal(false);
    setNewSpot({ title: "", address: "Mysuru", lat: 12.3052, lng: 76.6552, hasEvCharging: false, chargerType: "Level 2 AC" });
  };

  const handleSaveEdit = () => {
    if (editingSpot) {
      updateSpot(editingSpot);
      setEditingSpot(null);
    }
  };

  return (
    <div className="flex h-screen bg-[#0A0A0B] overflow-hidden text-white font-sans">
      <div className="w-20 md:w-64 border-r border-white/10 bg-[#0D0D0E]/80 backdrop-blur-xl flex flex-col">
         <div className="p-6 mb-8 border-b border-white/5">
            <h1 className="hidden md:block text-xl font-black tracking-tighter uppercase italic">PARK<span className="text-electric-blue">VOLT</span> HOST</h1>
            <Zap className="md:hidden w-8 h-8 text-electric-blue mx-auto" />
         </div>
         <nav className="flex-1 px-4 space-y-2">
            {(["listings", "earnings", "analytics"] as const).map((tab) => (
               <button 
                 key={tab} 
                 onClick={() => setActiveTab(tab)}
                 className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all font-bold uppercase text-[10px] tracking-widest ${activeTab === tab ? 'bg-electric-blue text-black shadow-lg shadow-electric-blue/10' : 'text-white/40 hover:bg-white/5'}`}
               >
                 {tab === 'listings' && <Settings className="w-5 h-5" />}
                 {tab === 'earnings' && <Banknote className="w-5 h-5" />}
                 {tab === 'analytics' && <TrendingUp className="w-5 h-5" />}
                 <span className="hidden md:inline">{tab}</span>
               </button>
            ))}
         </nav>
      </div>

      <div className="flex-1 overflow-y-auto p-8 relative flex flex-col h-full min-h-0">
        <div className="flex justify-between items-center mb-10 shrink-0">
           <div><h2 className="text-4xl font-black capitalize tracking-tight">{activeTab}</h2><p className="text-white/40 text-sm mt-1 uppercase tracking-widest text-[10px] font-black">Local Vault Node</p></div>
           {activeTab === 'listings' && (
              <button onClick={() => setShowAddModal(true)} className="bg-white text-black px-8 py-3 rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-neon-green transition-all shadow-xl shadow-white/5 uppercase tracking-widest"><Plus className="w-4 h-4" /> Add NEW Asset</button>
           )}
        </div>

        {activeTab === "listings" && (
           <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-2 min-h-0">
              <div className="flex flex-col min-h-0 space-y-4 h-full">
                 <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-20">
                    {spots.map((spot) => (
                        <div key={spot.id} className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 hover:border-white/20 transition-all group overflow-hidden mb-4">
                           <div className="flex justify-between items-start mb-6">
                              <div className="flex gap-4">
                                 <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-2xl">{spot.hasEvCharging ? "🔋" : "📍"}</div>
                                 <div>
                                    <h3 className="font-bold text-lg">{spot.title}</h3>
                                    <div className="text-[10px] font-black text-white/30 tracking-widest uppercase mt-1">ID: P{spot.id.slice(0,6)} • <span className={spot.isDisabledByHost ? "text-red-500" : "text-neon-green"}>{spot.isDisabledByHost ? "Deactivated" : "Live"}</span></div>
                                 </div>
                              </div>
                              <div className="flex gap-2 relative z-10">
                                 <button onClick={() => toggleSpotStatus(spot.id)} className={`p-2 rounded-xl border transition-all ${spot.isDisabledByHost ? 'border-red-500 bg-red-500/10 text-red-500' : 'border-white/10 bg-white/5 text-white/40 hover:text-white'}`}><Power className="w-4 h-4" /></button>
                                 <button onClick={() => setEditingSpot(spot)} className="p-2 rounded-xl bg-white/5 text-white/40 hover:text-white transition-all"><Edit3 className="w-4 h-4" /></button>
                                 <button onClick={() => removeSpot(spot.id)} className="p-2 rounded-xl bg-white/5 text-white/40 hover:text-red-500 transition-all"><Trash2 className="w-4 h-4" /></button>
                              </div>
                           </div>
                           <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
                              <div><span className="text-[9px] font-black text-white/20 uppercase block">Rate</span><span className="text-sm font-black">₹{spot.basePrice}/hr</span></div>
                              <div><span className="text-[9px] font-black text-white/20 uppercase block">Live State</span><span className={`text-sm font-black ${spot.isAvailable ? 'text-neon-green' : 'text-orange-400'}`}>{spot.isAvailable ? 'Ready' : 'Occupied'}</span></div>
                              <div><span className="text-[9px] font-black text-white/20 uppercase block">Zone</span><span className="text-sm font-black text-electric-blue uppercase">{spot.locationType}</span></div>
                           </div>
                        </div>
                    ))}
                 </div>
              </div>
              <div className="h-full min-h-[400px] rounded-[40px] overflow-hidden border border-white/10 relative shadow-2xl">
                 <MapComponent spots={spots} selectedSpot={selectedSpot} onSelectSpot={setSelectedSpot} userLocation={DEFAULT_USER_LOC} isNavigating={false} />
              </div>
           </div>
        )}

        {activeTab === "earnings" && (
           <div className="space-y-8 animate-in fade-in duration-500 overflow-y-auto custom-scrollbar pr-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                 {[
                   { label: "TOTAL PAYOUTS", val: `₹${stats.totalEarnings}`, color: "text-electric-blue", icon: Banknote },
                   { label: "REVENUE TODAY", val: `₹${stats.todayEarnings}`, color: "text-neon-green", icon: TrendingUp },
                   { label: "TOP PERFORMER", val: stats.topEarningSlot?.name || "N/A", color: "text-purple-400", icon: Star },
                   { label: "SESSIONS", val: stats.completedCount, color: "text-white/40", icon: CheckCircle2 }
                 ].map((c, i) => (
                    <div key={i} className="bg-white/[0.03] border border-white/5 p-6 rounded-[32px] hover:border-white/10 transition-colors">
                       <div className="flex justify-between items-start mb-4">
                          <div className="p-3 rounded-2xl bg-white/5"><c.icon className={`w-5 h-5 ${c.color}`} /></div>
                          <ArrowUpRight className="w-4 h-4 text-white/20" />
                       </div>
                       <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{c.label}</span>
                       <div className={`text-2xl font-black mt-2 truncate ${c.color}`}>{c.val}</div>
                    </div>
                 ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white/[0.02] border border-white/5 rounded-[40px] p-8 h-[400px]">
                   <h3 className="text-sm font-black uppercase tracking-widest mb-8 text-white/30">Earnings Projection</h3>
                   <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                         <LineChart data={stats.earningsTrend}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#ffffff', fontSize: 11, fontWeight: 900}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#ffffff', fontSize: 11, fontWeight: 900}} />
                            <Tooltip contentStyle={{backgroundColor: '#1a1a1e', border: '1px solid #ffffff20', borderRadius: '12px', fontSize: '11px', color: '#fff'}} itemStyle={{color: '#fff'}} />
                            <Line type="monotone" dataKey="income" stroke="#00f0ff" strokeWidth={5} dot={{fill: '#00f0ff', r: 5}} activeDot={{r: 7, stroke: '#000', strokeWidth: 2}} />
                         </LineChart>
                      </ResponsiveContainer>
                   </div>
                </div>
                <div className="bg-white/[0.03] border border-white/5 p-8 rounded-[40px] overflow-hidden flex flex-col">
                   <h3 className="text-sm font-black uppercase tracking-widest mb-6 text-white/30 leading-tight">Recent Activity</h3>
                   <div className="space-y-4 overflow-y-auto custom-scrollbar flex-1">
                      {stats.completed.length > 0 ? stats.completed.slice(0, 10).map((b: Booking) => {
                         const spot = spots.find(s => s.id === b.slotId);
                         return (
                            <div key={b.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 border-l-4 border-l-neon-green">
                               <div className="flex-1">
                                  <div className="text-[9px] font-bold text-white/20 uppercase mb-1">{new Date(b.startTime).toLocaleDateString()}</div>
                                  <div className="font-bold text-xs truncate max-w-[120px]">{spot?.title || "Removed Slot"}</div>
                               </div>
                               <div className="text-right">
                                  <div className="text-sm font-black text-white">₹{b.pricePaid}</div>
                                  <div className="text-[10px] text-white/30 truncate uppercase tracking-widest text-[8px]">Settled</div>
                               </div>
                            </div>
                         );
                      }) : <div className="h-full flex flex-col items-center justify-center opacity-20 text-center italic text-xs py-10">No sessions recorded locally.</div>}
                   </div>
                </div>
              </div>
           </div>
        )}

        {activeTab === "analytics" && (
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in h-full overflow-y-auto custom-scrollbar pr-4 pb-20">
              <div className="lg:col-span-2 space-y-8">
                 <div className="bg-white/[0.02] border border-white/5 rounded-[40px] p-8 min-h-[400px]">
                    <h3 className="text-sm font-black uppercase tracking-widest mb-8 text-white/30">Fleet Utilization %</h3>
                    <div className="h-[300px]">
                       <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={stats.slotUsage}>
                             <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#ffffff', fontSize: 11, fontWeight: 900}} />
                             <Tooltip cursor={{fill: '#ffffff05'}} contentStyle={{backgroundColor: '#1a1a1e', border: '1px solid #ffffff20', borderRadius: '12px', color: '#fff'}} itemStyle={{color: '#fff'}} />
                             <Bar dataKey="usage" radius={[12, 12, 0, 0]}>
                                {stats.slotUsage.map((entry, index) => (
                                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                             </Bar>
                          </BarChart>
                       </ResponsiveContainer>
                    </div>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white/[0.02] border border-white/5 rounded-[40px] p-8 text-center relative overflow-hidden group">
                       <div className="absolute inset-0 bg-neon-green/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                       <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] block mb-4">AVG. OCCUPANCY</span>
                       <div className="text-7xl font-black text-neon-green tracking-tighter">{stats.overallUsage}%</div>
                       <p className="text-[10px] text-white/20 mt-4 font-black uppercase tracking-widest">Across {spots.length} listing zones</p>
                    </div>
                    <div className="bg-white/[0.02] border border-white/5 rounded-[40px] p-8 text-center relative overflow-hidden group">
                       <div className="absolute inset-0 bg-electric-blue/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                       <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] block mb-4">LIVE LOAD</span>
                       <div className="text-7xl font-black text-electric-blue tracking-tighter">{stats.activeCount}</div>
                       <p className="text-[10px] text-white/20 mt-4 font-black uppercase tracking-widest">Active parking sessions</p>
                    </div>
                 </div>
              </div>
              <div className="bg-white/[0.03] border border-white/5 p-8 rounded-[40px] flex flex-col h-fit">
                 <h3 className="text-sm font-black uppercase tracking-widest mb-8 text-white/30">Yield Performers</h3>
                 <div className="space-y-4">
                    {[...stats.slotUsage].sort((a,b) => b.usage - a.usage).slice(0, 5).map((u, i) => (
                       <div key={u.id} className="flex items-center justify-between p-5 bg-white/5 rounded-3xl border border-white/5 hover:border-electric-blue/20 transition-all">
                          <div>
                             <div className="text-[10px] font-black text-electric-blue/50 mb-1 uppercase tracking-widest">RANK #{i+1}</div>
                             <div className="font-black text-sm text-white">{u.fullName}</div>
                          </div>
                          <div className="text-right">
                             <div className="text-xl font-black text-white">{u.usage}%</div>
                             <div className="text-[9px] uppercase font-bold text-white/20">Utility Score</div>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        )}
      </div>

      {/* --- ADD ASSET MODAL --- */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-3xl z-[100] flex items-center justify-center p-6">
           <div className="max-w-2xl w-full bg-[#0D0D0E] border border-white/10 rounded-[40px] p-10 relative shadow-2xl animate-in zoom-in-95 duration-300">
              <button onClick={() => setShowAddModal(false)} className="absolute top-8 right-8 text-white/20 hover:text-white"><X className="w-8 h-8" /></button>
              <h2 className="text-3xl font-black mb-8 italic tracking-tighter uppercase">Register NEW Asset</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                 <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-white/30 tracking-widest uppercase">Asset Title</label>
                       <input type="text" value={newSpot.title} onChange={(e)=>setNewSpot({...newSpot, title: e.target.value})} placeholder="e.g. West End Plaza G4" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-electric-blue transition-all" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-white/30 tracking-widest uppercase">Base Rate (₹/hr)</label>
                       <input type="number" placeholder="50" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-electric-blue transition-all" />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                       <span className="text-xs font-bold font-black tracking-widest uppercase">EV Integration</span>
                       <button onClick={()=>setNewSpot({...newSpot, hasEvCharging: !newSpot.hasEvCharging})} className={`w-14 h-8 rounded-full transition-all relative ${newSpot.hasEvCharging ? 'bg-neon-green' : 'bg-white/10'}`}>
                          <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${newSpot.hasEvCharging ? 'right-1' : 'left-1'}`}></div>
                       </button>
                    </div>
                 </div>
                 <div className="h-64 rounded-3xl overflow-hidden border border-white/10 relative">
                    <MapComponent spots={[]} selectedSpot={null} onSelectSpot={()=>{}} isPickMode={true} onPickLocation={(lat: number, lng: number) => setNewSpot({...newSpot, lat, lng})} userLocation={DEFAULT_USER_LOC} />
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-[8px] font-black text-neon-green uppercase border border-neon-green/20 z-10">Select Spot on Map</div>
                 </div>
              </div>
              <button onClick={handlePublish} className="w-full bg-white text-black py-5 rounded-3xl font-black text-xl hover:bg-neon-green transition-all uppercase tracking-tighter">Publish to ParkVolt Network</button>
           </div>
        </div>
      )}

      {/* --- EDIT ASSET MODAL --- */}
      {editingSpot && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-3xl z-[100] flex items-center justify-center p-6">
           <div className="max-w-md w-full bg-[#0D0D0E] border border-white/10 rounded-[40px] p-10 relative shadow-2xl animate-in fade-in duration-300">
              <button onClick={() => setEditingSpot(null)} className="absolute top-8 right-8 text-white/20 hover:text-white"><X className="w-8 h-8" /></button>
              <h2 className="text-2xl font-black mb-6 uppercase tracking-tighter">Edit Asset P{editingSpot.id.slice(0,6)}</h2>
              <div className="space-y-6 mb-8">
                 <div className="space-y-2"><label className="text-[10px] font-black text-white/30 uppercase">Title</label><input type="text" value={editingSpot.title} onChange={(e)=>setEditingSpot({...editingSpot, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-electric-blue transition-all" /></div>
                 <div className="space-y-2"><label className="text-[10px] font-black text-white/30 uppercase">Base Rate</label><input type="number" value={editingSpot.basePrice} onChange={(e)=>setEditingSpot({...editingSpot, basePrice: Number(e.target.value)})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-electric-blue transition-all" /></div>
              </div>
              <button onClick={handleSaveEdit} className="w-full bg-electric-blue text-black py-5 rounded-3xl font-black text-xl hover:scale-[1.02] transition-all uppercase">Commit Updates</button>
           </div>
        </div>
      )}
    </div>
  );
}
