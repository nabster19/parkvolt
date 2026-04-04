import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ParkVolt | Smart City Parking & EV Charging",
  description: "Peer-to-peer Marketplace Platform for urban mobility and EV charging.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background font-sans antialiased text-foreground selection:bg-primary/30">
        <nav className="fixed top-0 w-full border-b border-white/10 bg-background/80 backdrop-blur-md z-50">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-electric-blue to-neon-green flex items-center justify-center font-bold text-black">
                PV
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Park<span className="text-electric-blue">Volt</span>
              </span>
            </div>
            <div className="flex gap-4">
              <a href="/driver" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Find Parking</a>
              <a href="/host" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Become a Host</a>
            </div>
          </div>
        </nav>
        <main className="pt-16">
          {children}
        </main>
        <Analytics />
      </body>
    </html>
  );
}
