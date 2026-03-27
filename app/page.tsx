import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-300 selection:bg-orange-500 selection:text-white overflow-x-hidden">
      
      {/* --- AMBIENT GLOW BACKGROUND --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-orange-600/10 blur-[150px] rounded-full mix-blend-screen animate-[pulse_8s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-600/10 blur-[150px] rounded-full mix-blend-screen animate-[pulse_10s_ease-in-out_infinite_reverse]"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
      </div>

      {/* --- GLASS NAV --- */}
      <nav className="fixed w-full z-50 top-0 transition-all border-b border-white/5 bg-slate-950/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3 font-bold text-xl tracking-tight text-white">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 text-white flex items-center justify-center rounded-xl shadow-[0_0_20px_rgba(249,115,22,0.4)]">G</div>
            Geek Logistics
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-bold">
            <a href="#shippers" className="text-slate-400 hover:text-white transition-colors">For Cargo Owners</a>
            <a href="#carriers" className="text-slate-400 hover:text-white transition-colors">For Transporters</a>
            <div className="w-px h-6 bg-white/10"></div>
            <Link href="/login" className="text-white hover:text-orange-400 transition-colors">
              Sign In
            </Link>
            <Link href="/login" className="bg-white/10 hover:bg-white/20 border border-white/10 text-white px-6 py-2.5 rounded-xl transition-all shadow-lg backdrop-blur-md">
              Join Network
            </Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-40 pb-20 md:pt-48 md:pb-32 flex flex-col md:flex-row items-center gap-16">
        <div className="w-full md:w-1/2">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-orange-400 text-xs font-bold uppercase tracking-widest mb-8 shadow-lg">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            East Africa's Live Freight Network
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-[1.1] text-white">
            Stop guessing. <br />
            Start <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">tracking.</span>
          </h1>
          <p className="text-lg text-slate-400 mb-10 font-medium leading-relaxed max-w-lg">
            The era of shady brokers and lost cargo is over. Connect directly with NIDA-verified carriers, track your freight in real-time, and guarantee secure payouts.
          </p>
          <div className="flex flex-col sm:flex-row gap-5">
            <Link href="/login" className="group relative bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-[0_0_30px_rgba(249,115,22,0.3)] transition-all text-center overflow-hidden hover:scale-105">
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <span className="relative z-10 flex items-center justify-center gap-2">
                Post Freight Now
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </span>
            </Link>
          </div>
        </div>
        
        {/* Hero Visual - Animated Glassmorphism Card */}
        <div className="w-full md:w-1/2 relative perspective-1000">
          <div className="bg-white/5 backdrop-blur-2xl p-8 rounded-[2rem] shadow-2xl border border-white/10 relative z-10 transform md:rotate-y-[-10deg] md:rotate-x-[5deg] hover:rotate-0 transition-all duration-700 hover:shadow-[0_0_50px_rgba(249,115,22,0.2)] hover:bg-white/10 group">
            
            {/* Fake Radar pulse inside the glass card */}
            <div className="absolute top-6 right-6 flex items-center gap-2 bg-slate-900/50 px-3 py-1.5 rounded-full border border-white/5">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">Live Sync</span>
            </div>

            <div className="w-16 h-16 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center mb-8 border border-white/5 shadow-inner group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
            </div>
            
            <h3 className="text-2xl font-black text-white mb-2">Shipment GL-9024</h3>
            <p className="text-slate-400 text-sm font-medium mb-8">Driver: Juma H. • T 482 BCD</p>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/50 border border-white/5 hover:bg-slate-900/80 transition-colors">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-slate-600"></div>
                  <div className="w-0.5 h-6 bg-slate-700 my-1"></div>
                  <div className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]"></div>
                </div>
                <div>
                  <p className="font-bold text-white">Dar es Salaam <span className="text-slate-500 text-xs ml-2">Departed</span></p>
                  <p className="font-bold text-orange-400 mt-2">Dodoma <span className="text-slate-500 text-xs ml-2">Approaching (ETA: 2h)</span></p>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-4 rounded-2xl bg-gradient-to-r from-orange-500/10 to-transparent border border-orange-500/20">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Locked Payout</p>
                  <p className="text-xl font-black text-white mt-1">TZS 1,850,000</p>
                </div>
                <div className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-lg text-xs font-bold border border-orange-500/30">
                  Secured
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* --- THE PITCH TO CARGO OWNERS --- */}
      <section id="shippers" className="relative z-10 py-24 border-t border-white/5 bg-slate-900/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">For Cargo Owners</h2>
            <p className="text-slate-400 font-medium max-w-2xl mx-auto text-lg">Stop calling ten different brokers just to move one container. Broadcast your load to our entire network and get matched in minutes.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-14 h-14 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/30">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              </div>
              <h3 className="text-2xl font-black text-white mb-3">Military-Grade Vetting</h3>
              <p className="text-slate-400 leading-relaxed">Every truck owner must upload their physical NIDA ID and Vehicle Registration. We manually verify every carrier before they see your cargo.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-14 h-14 bg-orange-500/20 text-orange-400 rounded-2xl flex items-center justify-center mb-6 border border-orange-500/30">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              </div>
              <h3 className="text-2xl font-black text-white mb-3">Live Telemetry</h3>
              <p className="text-slate-400 leading-relaxed">No more "I am 10 minutes away" lies. Watch your cargo move across the map in real-time through your luxurious command center.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-14 h-14 bg-green-500/20 text-green-400 rounded-2xl flex items-center justify-center mb-6 border border-green-500/30">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h3 className="text-2xl font-black text-white mb-3">Transparent Pricing</h3>
              <p className="text-slate-400 leading-relaxed">You set the rate in TZS. Carriers accept it. No hidden broker fees padding the margins and burning your logistics budget.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- THE PITCH TO DRIVERS --- */}
      <section id="carriers" className="relative z-10 py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row-reverse items-center gap-16">
          <div className="w-full md:w-1/2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold uppercase tracking-widest mb-6">
              For Transporters
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              Keep your trucks moving. <br/> <span className="text-orange-500">Keep 100% of the money.</span>
            </h2>
            <p className="text-lg text-slate-400 mb-8 font-medium leading-relaxed">
              Brokers take a massive cut of your hard work just for making a phone call. Geek Logistics connects you directly to the biggest enterprise shippers in East Africa.
            </p>
            <ul className="space-y-4 mb-10">
              <li className="flex items-center gap-3 text-slate-300 font-bold">
                <div className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center border border-orange-500/30">✓</div>
                Access the live load board instantly.
              </li>
              <li className="flex items-center gap-3 text-slate-300 font-bold">
                <div className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center border border-orange-500/30">✓</div>
                Set your preferred corridors (e.g., Dar → Kigali).
              </li>
              <li className="flex items-center gap-3 text-slate-300 font-bold">
                <div className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center border border-orange-500/30">✓</div>
                Get paid fast, direct from the shipper.
              </li>
            </ul>
            <Link href="/login" className="bg-white text-slate-950 hover:bg-slate-200 px-8 py-4 rounded-xl font-bold text-lg transition-all inline-block hover:-translate-y-1">
              Verify Your Truck Today
            </Link>
          </div>
          
          {/* Driver UI Glass Teaser */}
          <div className="w-full md:w-1/2">
            <div className="bg-white/5 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 shadow-2xl relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 blur-2xl rounded-full"></div>
              <h4 className="text-white font-black text-xl mb-4 border-b border-white/10 pb-4">Available Loads near Dar es Salaam</h4>
              
              <div className="space-y-4">
                <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5 flex justify-between items-center group cursor-pointer hover:border-orange-500/50 transition-colors">
                  <div>
                    <p className="font-black text-white group-hover:text-orange-400 transition-colors">Dar → Arusha</p>
                    <p className="text-xs text-slate-400 mt-1">30 Tons • Flatbed Required</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-white text-lg">TZS 2.4M</p>
                    <p className="text-[10px] font-bold text-green-400 uppercase tracking-widest mt-1">Ready Now</p>
                  </div>
                </div>
                
                <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5 flex justify-between items-center group cursor-pointer hover:border-orange-500/50 transition-colors">
                  <div>
                    <p className="font-black text-white group-hover:text-orange-400 transition-colors">Dar → Kampala, UG</p>
                    <p className="text-xs text-slate-400 mt-1">15 Tons • Box Truck</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-white text-lg">TZS 4.1M</p>
                    <p className="text-[10px] font-bold text-green-400 uppercase tracking-widest mt-1">Ready Now</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER & TRUST BADGES --- */}
      <footer className="relative z-10 border-t border-white/10 bg-slate-950 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-black text-white mb-8">Trusted by fleets across the region.</h3>
          
          {/* Fake Trust Badges */}
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-40 grayscale mb-16">
            <div className="text-2xl font-black tracking-tighter">NIDA<span className="text-xs align-top">®</span></div>
            <div className="text-2xl font-black tracking-tighter">LATRA</div>
            <div className="text-2xl font-black tracking-tighter border-2 border-current px-2 py-1 rounded">TRA</div>
            <div className="flex items-center gap-2"><div className="w-6 h-6 bg-current rounded-full"></div><span className="text-xl font-black">TPA</span></div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 font-bold text-white">
              <div className="w-6 h-6 bg-orange-500 text-white flex items-center justify-center rounded-md text-xs">G</div>
              Geek Logistics
            </div>
            <p className="text-slate-600 font-medium text-sm">© 2026 Geek Studio. Built in Arusha, Tanzania.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}