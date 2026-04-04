"use client";

import { useState } from "react";
import { Zap, MapPin, Banknote, CalendarDays, Plus, Activity, Settings, TrendingUp } from "lucide-react";

export default function HostDashboard() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [hasEvCharging, setHasEvCharging] = useState(false);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Host Dashboard</h1>
          <p className="text-white/60">Manage your spots and track your earnings.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-white text-black px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 hover:bg-white/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          List New Spot
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center gap-3 text-white/50 mb-2">
            <Banknote className="w-4 h-4" />
            <span className="text-sm">Monthly Earnings</span>
          </div>
          <div className="text-3xl font-bold text-electric-blue">$482.50</div>
          <div className="text-xs text-neon-green flex items-center gap-1 mt-2">
            <TrendingUp className="w-3 h-3" /> +14% from last month
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center gap-3 text-white/50 mb-2">
            <Activity className="w-4 h-4" />
            <span className="text-sm">Active Bookings</span>
          </div>
          <div className="text-3xl font-bold">3</div>
        </div>

        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center gap-3 text-white/50 mb-2">
            <CalendarDays className="w-4 h-4" />
            <span className="text-sm">Utilization Rate</span>
          </div>
          <div className="text-3xl font-bold">64%</div>
        </div>

        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center gap-3 text-white/50 mb-2">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">Total Spots</span>
          </div>
          <div className="text-3xl font-bold">2</div>
        </div>
      </div>

      {/* My Listings */}
      <h2 className="text-xl font-bold mb-4">My Listings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Listing 1 */}
        <div className="bg-[#121214] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all">
          <div className="h-32 bg-white/5 flex items-center justify-center border-b border-white/10">
            <MapPin className="w-8 h-8 text-white/20" />
            <div className="absolute top-4 right-4 bg-neon-green/20 text-neon-green px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
              <Activity className="w-3 h-3" /> LIVE
            </div>
          </div>
          <div className="p-5">
            <h3 className="font-bold text-lg mb-1">Downtown Tech Hub Parking</h3>
            <p className="text-sm text-white/50 mb-4">123 Innovation Drive</p>
            
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Base Rate</span>
                <span className="font-semibold">$4.50/hr</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60 flex items-center gap-1"><Zap className="w-3 h-3 text-neon-green" /> Charging Fee</span>
                <span className="font-semibold text-neon-green">+$15.00 flat</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 py-2 rounded-lg text-sm transition-colors">Edit</button>
              <button className="p-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors"><Settings className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Spot Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#121214] border border-white/10 rounded-2xl w-full max-w-2xl my-8">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-xl font-bold">List a New Parking Spot</h2>
              <button onClick={() => setShowAddModal(false)} className="text-white/50 hover:text-white">✕</button>
            </div>
            
            <div className="p-6 space-y-6 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-white/70 mb-2">Spot Title</label>
                  <input type="text" placeholder="e.g. Sunny Driveway near Metro" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 focus:border-electric-blue outline-none" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-white/70 mb-2">Location/Address</label>
                  <input type="text" placeholder="Full address" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 focus:border-electric-blue outline-none" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-white/70 mb-2">Price per Hour ($)</label>
                  <input type="number" placeholder="0.00" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 focus:border-electric-blue outline-none" />
                </div>
              </div>

              {/* EV toggle */}
              <div className="border border-white/10 rounded-xl p-5 bg-black/30">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-white flex items-center gap-2">
                      <Zap className={`w-4 h-4 ${hasEvCharging ? 'text-neon-green' : 'text-white/50'}`} />
                      EV Charging Available
                    </h3>
                    <p className="text-white/50 text-xs mt-1">Offer charging to attract EV drivers and earn more.</p>
                  </div>
                  <label className="relative cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={hasEvCharging}
                      onChange={() => setHasEvCharging(!hasEvCharging)}
                    />
                    <div className={`block w-12 h-6 rounded-full transition-colors ${hasEvCharging ? 'bg-neon-green' : 'bg-white/10 border border-white/20'}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${hasEvCharging ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </label>
                </div>

                {hasEvCharging && (
                  <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/10 animate-in fade-in slide-in-from-top-2">
                    <div>
                      <label className="block text-white/70 mb-2 text-xs">Charger Type</label>
                      <select className="w-full bg-black/50 border border-white/10 rounded-lg p-3 focus:border-neon-green outline-none">
                        <option>Level 1 (Standard 120V)</option>
                        <option>Level 2 (Fast 240V)</option>
                        <option>Level 3 (DC Fast)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-white/70 mb-2 text-xs">Additional Charging Fee ($)</label>
                      <input type="number" placeholder="Flat fee or per hour" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 focus:border-neon-green outline-none" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-white/10 flex justify-end gap-3">
              <button 
                onClick={() => setShowAddModal(false)}
                className="px-5 py-2.5 rounded-lg font-semibold hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button className="bg-electric-blue text-black px-5 py-2.5 rounded-lg font-semibold hover:bg-electric-blue/90 transition-colors">
                Publish Listing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
