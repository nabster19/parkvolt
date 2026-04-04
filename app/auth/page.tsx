"use client";

import { useState } from "react";
import { Zap, Car, Shield, User, Mail, Lock, ArrowRight, Globe } from "lucide-react";
import Link from "next/link";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<"driver" | "host">("driver");

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-electric-blue/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-green/10 rounded-full blur-[120px] animate-pulse"></div>

      <div className="w-full max-w-[1100px] grid md:grid-cols-2 bg-dark-surface/40 backdrop-blur-2xl border border-white/10 rounded-[32px] overflow-hidden shadow-2xl z-10 transition-all duration-500">
        
        {/* Branding Side */}
        <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-electric-blue/20 to-transparent relative overflow-hidden group">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1593941707882-a5bba14936c7?q=80&w=2672&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-20 group-hover:scale-105 transition-transform duration-700"></div>
          
          <div className="relative z-10">
            <Link href="/" className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 bg-electric-blue rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.4)]">
                <Zap className="w-6 h-6 text-black" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-white">PARKVOLT</span>
            </Link>

            <h1 className="text-5xl font-extrabold text-white leading-tight mb-6">
              Empowering the <br />
              <span className="text-electric-blue">EV Future.</span>
            </h1>
            <p className="text-lg text-white/60 max-w-sm mb-8 leading-relaxed">
              Join the smartest peer-to-peer EV charging ecosystem. Seamless, secure, and sustainable.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-white/50">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                  <Shield className="w-4 h-4 text-neon-green" />
                </div>
                <span className="text-sm">Bank-grade security</span>
              </div>
              <div className="flex items-center gap-3 text-white/50">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                  <Car className="w-4 h-4 text-electric-blue" />
                </div>
                <span className="text-sm">Real-time availability</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-12 text-sm text-white/30">
            © 2026 ParVolt Technologies Inc.
          </div>
        </div>

        {/* Form Side */}
        <div className="p-8 md:p-16 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">{isLogin ? "Welcome Back" : "Create Account"}</h2>
            <p className="text-white/50">{isLogin ? "Enter your details to access your dashboard" : "Start your journey with us today"}</p>
          </div>

          {/* Role Switcher */}
          <div className="flex bg-white/5 p-1 rounded-2xl mb-8 border border-white/10 overflow-hidden">
            <button 
              onClick={() => setRole("driver")}
              className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-all ${role === 'driver' ? 'bg-electric-blue text-black shadow-lg' : 'text-white/50 hover:text-white'}`}
            >
              <Car className="w-4 h-4" /> Driver
            </button>
            <button 
              onClick={() => setRole("host")}
              className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-all ${role === 'host' ? 'bg-neon-green text-black shadow-lg' : 'text-white/50 hover:text-white'}`}
            >
              <User className="w-4 h-4" /> Host
            </button>
          </div>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            {!isLogin && (
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-electric-blue transition-colors" />
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue/50 transition-all"
                />
              </div>
            )}
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-electric-blue transition-colors" />
              <input 
                type="email" 
                placeholder="Email Address" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue/50 transition-all"
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-electric-blue transition-colors" />
              <input 
                type="password" 
                placeholder="Password" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue/50 transition-all"
              />
            </div>

            {isLogin && (
              <div className="text-right">
                <button className="text-sm text-electric-blue hover:text-electric-blue/80 transition-colors">Forgot Password?</button>
              </div>
            )}

            <button className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] mt-4 shadow-xl ${role === 'driver' ? 'bg-electric-blue text-black shadow-electric-blue/20' : 'bg-neon-green text-black shadow-neon-green/20'}`}>
              {isLogin ? "Sign In" : "Get Started"}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-8 flex flex-col gap-4">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-full h-[1px] bg-white/10"></div>
              <span className="relative px-4 bg-transparent backdrop-blur-2xl text-white/30 text-xs font-semibold uppercase tracking-widest">Or continue with</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm font-medium">
                <Shield className="w-5 h-5 text-white" /> Platform
              </button>
              <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm font-medium">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="white" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="white" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="white" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="white" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
            </div>

            <p className="mt-8 text-center text-white/40 text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-electric-blue font-bold hover:underline transition-all"
              >
                {isLogin ? "Sign Up" : "Log In"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
