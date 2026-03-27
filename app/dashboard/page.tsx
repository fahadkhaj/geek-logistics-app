"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [sessionUser, setSessionUser] = useState<any>(null);
  
  const [liveLoads, setLiveLoads] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]); // For Admin Overseer
  const [isOnline, setIsOnline] = useState(true);
  const [activeTab, setActiveTab] = useState('marketplace');
  
  const [showLoadForm, setShowLoadForm] = useState(false);
  const [formOrigin, setFormOrigin] = useState('');
  const [formDest, setFormDest] = useState('');
  const [formWeight, setFormWeight] = useState('');
  const [formCommodity, setFormCommodity] = useState('');
  const [formShipperPrice, setFormShipperPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [router]);

  const fetchData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { router.push('/login'); return; }
    setSessionUser(session.user);

    const { data: profile } = await supabase.from('users').select('*').eq('id', session.user.id).single();
    if (profile) setUserProfile(profile);

    const { data: loadsData } = await supabase.from('loads').select('*').order('created_at', { ascending: false });
    if (loadsData) setLiveLoads(loadsData);

    // Admin sees all drivers for approval
    if (profile?.role === 'admin') {
      const { data: drivers } = await supabase.from('users').select('*').eq('role', 'truck_owner');
      setAllUsers(drivers || []);
    }
    setLoading(false);
  };

  const handlePostLoad = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const price = parseInt(formShipperPrice);
    const margin = Math.round(price * 0.15); // Auto 15% Broker Margin
    const driverPayout = price - margin;

    const { data, error } = await supabase.from('loads').insert([{
      cargo_owner_id: sessionUser.id,
      origin: formOrigin,
      destination: formDest,
      weight: formWeight,
      commodity: formCommodity,
      shipper_price: price,
      driver_price: driverPayout,
      broker_margin: margin,
      status: 'Active'
    }]).select();

    if (!error && data) {
      setLiveLoads([data[0], ...liveLoads]);
      setShowLoadForm(false);
      setFormOrigin(''); setFormDest(''); setFormWeight(''); setFormCommodity(''); setFormShipperPrice('');
    }
    setIsSubmitting(false);
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const role = userProfile?.role; // 'admin', 'cargo_owner', 'truck_owner'
  const firstName = userProfile?.full_name?.split(' ')[0] || 'Partner';
  const isDriver = role === 'truck_owner';
  const isAdmin = role === 'admin';

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      
      {/* NAV */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3 font-bold text-xl tracking-tight">
            <div className="w-10 h-10 bg-orange-500 text-white flex items-center justify-center rounded-xl shadow-md">G</div>
            Geek Logistics <span className="text-[10px] bg-slate-100 px-2 py-1 rounded ml-2 uppercase opacity-50">{role}</span>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => { supabase.auth.signOut(); router.push('/login'); }} className="text-xs font-bold uppercase text-slate-400 hover:text-red-500">Sign Out</button>
            <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center uppercase">{firstName.charAt(0)}</div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        
        {/* GREETING & TELEMETRY SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-4xl font-black tracking-tight">Hello, {firstName}.</h1>
              {isDriver && (
                <div onClick={() => setIsOnline(!isOnline)} className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-slate-200 cursor-pointer">
                  <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></div>
                  <span className="text-[10px] font-black uppercase tracking-widest">{isOnline ? 'Online' : 'Offline'}</span>
                </div>
              )}
            </div>
            <p className="text-slate-500 font-medium">
              {isAdmin ? "Monitoring Global Corridor Intelligence" : "East Africa's most trusted freight marketplace."}
            </p>
          </div>

          {/* LUXURY TELEMETRY PREVIEW (Demo Data) */}
          <div className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden shadow-2xl">
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase text-orange-500 tracking-widest mb-4">Live Telemetry: GL-9024</p>
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-xs text-slate-400">Current Location</p>
                        <p className="font-bold">Dodoma, TZ</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-slate-400">Destination</p>
                        <p className="font-bold">Kigali, RW</p>
                    </div>
                </div>
                {/* Simulated Progress Bar */}
                <div className="w-full h-1 bg-slate-700 rounded-full mt-4 relative">
                    <div className="absolute top-0 left-0 h-full w-1/2 bg-orange-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,1)]"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full animate-ping"></div>
                </div>
              </div>
          </div>
        </div>

        {/* ADMIN OVERSEER SECTION */}
        {isAdmin && (
            <div className="mb-12">
                <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Security & Verification Queue</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {allUsers.filter(u => u.account_status !== 'active').map(driver => (
                        <div key={driver.id} className="bg-white border border-slate-200 p-6 rounded-2xl flex justify-between items-center">
                            <div>
                                <p className="font-bold">{driver.full_name}</p>
                                <div className="flex gap-4 mt-2">
                                    <a href={driver.nida_image_url} target="_blank" className="text-[10px] text-orange-500 font-bold underline">NIDA IMAGE</a>
                                    <a href={driver.plate_image_url} target="_blank" className="text-[10px] text-orange-500 font-bold underline">PLATE IMAGE</a>
                                </div>
                            </div>
                            <button onClick={async () => { await supabase.from('users').update({ account_status: 'active' }).eq('id', driver.id); fetchData(); }} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold">Approve Driver</button>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* THE MAIN LOAD BOARD */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white">
            <h2 className="text-xl font-extrabold text-slate-900">{isDriver ? 'Live Freight Marketplace' : 'Network Load Board'}</h2>
            {!isDriver && (
                <button onClick={() => setShowLoadForm(true)} className="bg-orange-500 text-white px-6 py-2 rounded-xl font-bold text-sm shadow-lg">+ Post Cargo</button>
            )}
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
                <tr>
                  <th className="px-8 py-5">Shipment Detail</th>
                  <th className="px-8 py-5">Commodity</th>
                  <th className="px-8 py-5">{isDriver ? 'Your Payout' : 'Revenue'}</th>
                  <th className="px-8 py-5 text-right">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {liveLoads.map((load) => (
                  <tr key={load.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-8 py-6">
                        <p className="font-bold text-slate-900">{load.origin} → {load.destination}</p>
                        <p className="text-xs text-slate-500">{load.weight}</p>
                    </td>
                    <td className="px-8 py-6">
                        <p className="font-medium">{load.commodity}</p>
                    </td>
                    <td className="px-8 py-6">
                        <p className="font-black text-lg">TZS {isDriver ? load.driver_price?.toLocaleString() : load.shipper_price?.toLocaleString()}</p>
                        {isAdmin && <p className="text-[10px] font-bold text-orange-500">Margin: TZS {load.broker_margin?.toLocaleString()}</p>}
                    </td>
                    <td className="px-8 py-6 text-right">
                        {isAdmin ? (
                            <button onClick={async () => { await supabase.from('loads').delete().eq('id', load.id); fetchData(); }} className="text-red-400 hover:text-red-600 font-bold text-xs uppercase">Delete</button>
                        ) : isDriver ? (
                            <button disabled={userProfile?.account_status !== 'active'} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold disabled:bg-slate-200">Request Load</button>
                        ) : (
                            <span className="text-xs font-bold text-slate-400 italic">Tracking Live</span>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* POST LOAD MODAL */}
        {showLoadForm && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-lg shadow-2xl">
                    <h3 className="text-2xl font-black mb-6">Broadcast New Freight</h3>
                    <form onSubmit={handlePostLoad} className="space-y-4">
                        <input type="text" placeholder="Origin" required onChange={(e) => setFormOrigin(e.target.value)} className="w-full bg-slate-50 border-none p-4 rounded-xl font-bold"/>
                        <input type="text" placeholder="Destination" required onChange={(e) => setFormDest(e.target.value)} className="w-full bg-slate-50 border-none p-4 rounded-xl font-bold"/>
                        <div className="grid grid-cols-2 gap-4">
                            <input type="text" placeholder="Commodity" required onChange={(e) => setFormCommodity(e.target.value)} className="bg-slate-50 border-none p-4 rounded-xl font-bold text-sm"/>
                            <input type="text" placeholder="Weight" required onChange={(e) => setFormWeight(e.target.value)} className="bg-slate-50 border-none p-4 rounded-xl font-bold text-sm"/>
                        </div>
                        <input type="number" placeholder="Shipper Price (TZS)" required onChange={(e) => setFormShipperPrice(e.target.value)} className="w-full bg-orange-50 border-none p-4 rounded-xl font-black text-orange-600 text-xl"/>
                        <button type="submit" className="w-full bg-orange-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-orange-500/30 mt-4">Initialize Broadcast</button>
                        <button type="button" onClick={() => setShowLoadForm(false)} className="w-full text-slate-400 font-bold text-xs">Cancel</button>
                    </form>
                </div>
            </div>
        )}

      </main>
    </div>
  );
}