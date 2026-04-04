import Link from "next/link";
import { ArrowRight, Zap, MapPin, ShieldCheck, Banknote } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="w-full py-20 lg:py-32 flex flex-col items-center text-center px-4 relative overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-electric-blue/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-neon-green/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-electric-blue mb-8 backdrop-blur-sm z-10">
          <Zap className="w-4 h-4 text-neon-green" />
          <span>The Future of Urban Mobility</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl z-10 text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/50 mb-6">
          Find your spot. <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-blue to-neon-green">
            Charge your drive.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-white/60 max-w-2xl mb-10 z-10">
          ParkVolt is the ultimate peer-to-peer marketplace connecting EV drivers with private parking spots. Experience a <strong className="text-white">Zero-Search</strong> parking reality.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 z-10">
          <Link href="/driver" className="px-8 py-4 rounded-xl bg-electric-blue text-black font-semibold hover:bg-electric-blue/90 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.3)]">
            Find Parking & Charge
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/host" className="px-8 py-4 rounded-xl bg-white/5 text-white border border-white/10 hover:bg-white/10 transition-all font-semibold flex items-center justify-center gap-2">
            Monetize Idle Assets
          </Link>
        </div>
      </section>

      {/* Value Props */}
      <section className="w-full max-w-6xl mx-auto px-4 py-20 grid grid-cols-1 md:grid-cols-3 gap-8 z-10">
        <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-neon-green/30 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-neon-green/10 flex items-center justify-center mb-6">
            <Zap className="w-6 h-6 text-neon-green" />
          </div>
          <h3 className="text-xl font-bold mb-3">Zero-Search Experience</h3>
          <p className="text-white/60">
            For EV Drivers. Our smart recommendation engine directs you straight to the perfect spot with the right charger. No circling the block.
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-electric-blue/30 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-electric-blue/10 flex items-center justify-center mb-6">
            <Banknote className="w-6 h-6 text-electric-blue" />
          </div>
          <h3 className="text-xl font-bold mb-3">Idle Asset Monetization</h3>
          <p className="text-white/60">
            For Hosts. Turn your empty driveway or unused EV charger into a passive income stream. List your spot in seconds and set your own price.
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-purple-500/30 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6">
            <ShieldCheck className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="text-xl font-bold mb-3">Trust & Verification</h3>
          <p className="text-white/60">
            A robust dual-rating system ensures spot quality and charger reliability. Built on trust for a seamless smart city mobility platform.
          </p>
        </div>
      </section>
    </div>
  );
}
