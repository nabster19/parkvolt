"use client";

import { useState, useEffect } from "react";
import { Zap, Car, User, ArrowRight, ShieldCheck, Banknote, MapPin } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const [role, setRole] = useState<"driver" | "host" | null>(null);
  const router = useRouter();

  const handleChoice = (selectedRole: "driver" | "host") => {
    setRole(selectedRole);
    // In a real app, we would handle session/auth here
    setTimeout(() => {
      router.push(`/${selectedRole}`);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-electric-blue/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-green/10 rounded-full blur-[120px] animate-pulse"></div>
      
      <div className="w-full max-w-5xl z-10">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-top-10 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-bold text-electric-blue mb-6 backdrop-blur-md">
            <Zap className="w-4 h-4 text-neon-green" />
            <span>THE FUTURE OF SMART PARKING</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-6">
            PARK<span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-blue to-neon-green">VOLT</span>
          </h1>
          <p className="text-xl text-white/40 max-w-2xl mx-auto font-medium">
            Join the peer-to-peer ecosystem transforming urban mobility. <br />
            Are you looking to charge or looking to earn?
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Driver Card */}
          <div 
            onClick={() => handleChoice("driver")}
            className={`group relative p-8 rounded-[32px] border transition-all duration-500 cursor-pointer overflow-hidden ${
              role === 'driver' 
                ? 'bg-electric-blue border-electric-blue scale-105' 
                : 'bg-white/[0.03] border-white/10 hover:border-electric-blue/50 hover:bg-white/[0.05]'
            }`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br from-electric-blue/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
            
            <div className="relative z-10 flex flex-col h-full min-h-[300px]">
              <div className={`w-16 h-16 rounded-2xl mb-8 flex items-center justify-center transition-all duration-500 ${role === 'driver' ? 'bg-black text-electric-blue' : 'bg-electric-blue/10 text-electric-blue group-hover:scale-110'}`}>
                <Car className="w-8 h-8" />
              </div>
              
              <h2 className={`text-4xl font-black mb-4 transition-colors duration-500 ${role === 'driver' ? 'text-black' : 'text-white'}`}>I am a Driver</h2>
              <p className={`text-lg mb-8 leading-relaxed transition-colors duration-500 ${role === 'driver' ? 'text-black/70' : 'text-white/40'}`}>
                Find the perfect parking spot with high-speed charging. Save time, reduce range anxiety, and pay seamlessly via UPS.
              </p>
              
              <div className="mt-auto flex items-center gap-2 font-bold group-hover:translate-x-2 transition-transform duration-300">
                <span className={role === 'driver' ? 'text-black' : 'text-electric-blue'}>Enter Marketplace</span>
                <ArrowRight className={`w-5 h-5 ${role === 'driver' ? 'text-black' : 'text-electric-blue'}`} />
              </div>
            </div>
          </div>

          {/* Host Card */}
          <div 
            onClick={() => handleChoice("host")}
            className={`group relative p-8 rounded-[32px] border transition-all duration-500 cursor-pointer overflow-hidden ${
              role === 'host' 
                ? 'bg-neon-green border-neon-green scale-105' 
                : 'bg-white/[0.03] border-white/10 hover:border-neon-green/50 hover:bg-white/[0.05]'
            }`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br from-neon-green/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
            
            <div className="relative z-10 flex flex-col h-full min-h-[300px]">
              <div className={`w-16 h-16 rounded-2xl mb-8 flex items-center justify-center transition-all duration-500 ${role === 'host' ? 'bg-black text-neon-green' : 'bg-neon-green/10 text-neon-green group-hover:scale-110'}`}>
                <User className="w-8 h-8" />
              </div>
              
              <h2 className={`text-4xl font-black mb-4 transition-colors duration-500 ${role === 'host' ? 'text-black' : 'text-white'}`}>I am a Host</h2>
              <p className={`text-lg mb-8 leading-relaxed transition-colors duration-500 ${role === 'host' ? 'text-black/70' : 'text-white/40'}`}>
                Monetize your empty driveway or charger. Set your own availability and start earning passive income today.
              </p>
              
              <div className="mt-auto flex items-center gap-2 font-bold group-hover:translate-x-2 transition-transform duration-300">
                <span className={role === 'host' ? 'text-black' : 'text-neon-green'}>Access Dashboard</span>
                <ArrowRight className={`w-5 h-5 ${role === 'host' ? 'text-black' : 'text-neon-green'}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Features */}
        <div className="mt-20 grid grid-cols-3 gap-8">
           <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-full bg-white/5 border border-white/10">
                <ShieldCheck className="w-5 h-5 text-electric-blue" />
              </div>
              <span className="text-white/30 text-xs font-bold uppercase tracking-widest">Verified Safety</span>
           </div>
           <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-full bg-white/5 border border-white/10">
                <MapPin className="w-5 h-5 text-neon-green" />
              </div>
              <span className="text-white/30 text-xs font-bold uppercase tracking-widest">Live Integration</span>
           </div>
           <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-full bg-white/5 border border-white/10">
                <Banknote className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-white/30 text-xs font-bold uppercase tracking-widest">Instant Payouts</span>
           </div>
        </div>
      </div>
    </div>
  );
}
