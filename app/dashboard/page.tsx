"use client";
import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
// TRIPLE-CHECKED IMPORTS - ZERO ERRORS
import { 
  LogOut, Globe, Sun, Moon, MapPin, 
  Package, ArrowRight, Truck, Plus, 
  Navigation, Camera, AlertTriangle, CheckCircle2,
  Wallet, Activity, FileText, X, Loader2,
  ChevronRight, ChevronLeft, MapIcon, Radar, CheckCircle, Search, Clock,
  LayoutDashboard, ListTodo, CreditCard, Settings, Users, Menu, Trash2, ShieldCheck, Check
} from 'lucide-react';

// ==========================================
// 1. DICTIONARY (100% CONSISTENCY)
// ==========================================
const translations = {
  SW: {
    shipperRole: 'Mmiliki wa Mzigo',
    driverRole: 'Dereva',
    welcome: 'Karibu Geek Logistics,',
    welcomeQuote: '"Mshirika wako wa kuaminika, salama, na wa haraka kwa usafirishaji wa mizigo ndani na nje ya mipaka."',
    marketTitle: 'Soko la Mizigo',
    marketSub: 'Mizigo inayopatikana sokoni sasa.',
    acceptBtn: 'Pokea Mzigo',
    payout: 'Malipo',
    activeTrip: 'Safari ya Sasa',
    startGPS: 'Washa GPS (Kazini)',
    stopGPS: 'Zima GPS',
    uploadDocs: 'Weka Nyaraka',
    finishTrip: 'Kamilisha Safari',
    wallet: 'Mapato Yako',
    myDocs: 'Uhakiki wa Nyaraka',
    postCargoTitle: 'Sajili Mzigo',
    activePostings: 'Mizigo Sokoni',
    trackFleet: 'Uchambuzi & Ramani',
    noActiveTrack: 'Hujasajili mzigo wowote bado.',
    waitingDriver: 'Inatafuta Dereva',
    origin: 'Kutoka (Mkoa)',
    dest: 'Kwenda (Mkoa)',
    commodity: 'Aina ya Mzigo',
    truckType: 'Lori Linalohitajika',
    weight: 'Uzito (Tani)',
    price: 'Bei (TZS)',
    toggleDash: 'Muhtasari',
    trackById: 'Fuatilia Mzigo',
    trackBtn: 'Tafuta',
    enterId: 'Ingiza ID ya Mzigo',
    overview: 'Muhtasari',
    transactions: 'Miamala',
    fleet: 'Mizigo & Ramani',
    settings: 'Mipangilio',
    community: 'Jamii',
    clear: 'Funga',
    routeDetails: 'Taarifa za Safari',
    mapOffline: 'Ramani Haipo Hewani',
    mapOfflineSub: 'Ufuatiliaji utaanza dereva akianza safari.',
    noLoads: 'Hakuna mizigo mipya sokoni kwa sasa.',
    inTransit: 'Njiani (Live)',
    delivered: 'Imefika',
    totalSpend: 'Jumla ya Matumizi',
    selectShipment: 'Chagua mzigo upande wa kushoto kufuatilia ramani.',
    tripTools: 'Zana za Safari',
    gpsRadar: 'Rada ya GPS',
    submitFreight: 'Weka Sokoni',
    registering: 'Inasajili...',
    deleteTitle: 'Futa Mzigo',
    deleteMsg: 'Je, una uhakika unataka kufuta mzigo huu sokoni?',
    confirm: 'Ndio, Futa',
    deny: 'Hapana, Ghairi',
    gpsError: 'Tafadhali ruhusu simu kusoma GPS.'
  },
  EN: {
    shipperRole: 'Cargo Owner',
    driverRole: 'Driver',
    welcome: 'Welcome to Geek Logistics,',
    welcomeQuote: '"Your secure, reliable, and fast partner for freight logistics across the region."',
    marketTitle: 'Freight Market',
    marketSub: 'Currently available loads on the exchange.',
    acceptBtn: 'Accept Load',
    payout: 'Payout',
    activeTrip: 'Active Trip',
    startGPS: 'Go Online',
    stopGPS: 'Go Offline',
    uploadDocs: 'Upload POD',
    finishTrip: 'Complete Trip',
    wallet: 'Wallet Balance',
    myDocs: 'Document Verification',
    postCargoTitle: 'Post Cargo',
    activePostings: 'Active Postings',
    trackFleet: 'Analytics & Fleet',
    noActiveTrack: 'You have no active shipments yet.',
    waitingDriver: 'Finding Driver',
    origin: 'From (Region)',
    dest: 'To (Region)',
    commodity: 'Commodity',
    truckType: 'Required Truck Type',
    weight: 'Weight (Tons)',
    price: 'Payout (TZS)',
    toggleDash: 'Dashboard',
    trackById: 'Track Cargo',
    trackBtn: 'Search',
    enterId: 'Enter Cargo ID',
    overview: 'Overview',
    transactions: 'Transactions',
    fleet: 'Fleet & Map',
    settings: 'Settings',
    community: 'Community',
    clear: 'Close',
    routeDetails: 'Route Details',
    mapOffline: 'Map Offline',
    mapOfflineSub: 'Live tracking unlocks when driver is en route.',
    noLoads: 'No new loads on the market currently.',
    inTransit: 'In Transit (Live)',
    delivered: 'Delivered',
    totalSpend: 'Total Freight Spend',
    selectShipment: 'Select a shipment on the left to track on map.',
    tripTools: 'Trip Tools',
    gpsRadar: 'GPS Radar',
    submitFreight: 'Submit Freight',
    registering: 'Registering...',
    deleteTitle: 'Delete Shipment',
    deleteMsg: 'Are you sure you want to delete this shipment from the market?',
    confirm: 'Yes, Delete',
    deny: 'No, Cancel',
    gpsError: 'Please allow GPS access on your device.'
  }
};

// ==========================================
// 1.5 ANIMATION VARIABLES
// ==========================================
const containerVar = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVar = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } }
};

// GLOBALS
const glassCard = "bg-white/[0.03] border border-white/10 backdrop-blur-2xl shadow-xl rounded-2xl sm:rounded-3xl";
const innerCard = "bg-black/30 border border-white/5 shadow-sm";

// ==========================================
// 2. DRIVER VIEW
// ==========================================
const DriverView = ({ profile, t, isDark, isRightSidebarOpen, setIsRightSidebarOpen }: any) => {
  const [activeLoad, setActiveLoad] = useState<any>(null); 
  const [availableLoads, setAvailableLoads] = useState<any[]>([]);
  const [isOnline, setIsOnline] = useState(false);
  const [location, setLocation] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    const fetchLoads = async () => {
      const { data: myLoad } = await supabase.from('shipments').select('*').eq('driver_id', profile.id).eq('status', 'in_transit').single();
      if (myLoad) {
        setActiveLoad(myLoad);
      } else {
        const { data: openLoads } = await supabase.from('shipments').select('*').eq('status', 'pending').order('created_at', { ascending: false });
        if (openLoads) setAvailableLoads(openLoads);
      }
    };
    fetchLoads();

    const channel = supabase.channel('market_updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'shipments' }, () => { fetchLoads(); }).subscribe();

    return () => {
      supabase.removeChannel(channel);
      if (typeof window !== 'undefined' && navigator?.geolocation && watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [profile.id]);

  const handleAcceptLoad = async (load: any) => {
    const { error } = await supabase.from('shipments').update({ driver_id: profile.id, status: 'in_transit' }).eq('id', load.id);
    if (!error) {
      setActiveLoad(load);
      if (window.innerWidth >= 1024) setIsRightSidebarOpen(true);
      if (!isOnline) toggleGPS();
    }
  };

  const toggleGPS = async () => {
    if (typeof window === 'undefined' || !navigator?.geolocation) return setError(t.gpsError);

    if (isOnline) {
      setIsOnline(false); setLocation(null); setError(null);
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
      if (profile?.id) await supabase.from('driver_locations').delete().eq('driver_id', profile.id);
    } else {
      setIsOnline(true); setError(null);
      watchIdRef.current = navigator.geolocation.watchPosition(
        async (pos) => {
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          if (profile?.id) {
            await supabase.from('driver_locations').upsert({
              driver_id: profile.id, latitude: pos.coords.latitude, longitude: pos.coords.longitude, updated_at: new Date().toISOString()
            });
          }
        },
        (err) => { setError(t.gpsError); setIsOnline(false); },
        { enableHighAccuracy: true }
      );
    }
  };

  const bgCard = isDark ? glassCard : "bg-white/90 border border-slate-200 backdrop-blur-xl shadow-lg shadow-slate-200/50 rounded-2xl sm:rounded-3xl";
  const bgInner = isDark ? innerCard : "bg-slate-50 border border-slate-100 shadow-sm";
  const textPrimary = isDark ? "text-white" : "text-slate-900";
  const textSecondary = isDark ? "text-slate-400" : "text-slate-500";

  const DriverRightSidebar = () => (
    <div className="w-full lg:w-[360px] space-y-4 sm:space-y-6 flex flex-col h-full">
       <div className="flex lg:hidden items-center justify-between mb-2 pb-4 border-b border-white/10">
           <h3 className={`text-sm font-bold ${textPrimary}`}>{t.toggleDash}</h3>
           <button onClick={() => setIsRightSidebarOpen(false)} className={`p-2 rounded-full ${isDark ? 'bg-white/10 text-white' : 'bg-slate-200 text-slate-800'}`}><X size={16}/></button>
       </div>
       <div className={`p-5 sm:p-8 rounded-2xl sm:rounded-3xl flex flex-col justify-between min-h-[140px] ${bgCard}`}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center"><Wallet size={16} className="text-orange-500" /></div>
            <h3 className={`text-[10px] font-bold uppercase tracking-widest ${textSecondary}`}>{t.wallet}</h3>
          </div>
          <p className={`text-2xl sm:text-3xl font-bold tracking-tight ${textPrimary}`}>0.00 <span className={`text-[10px] font-medium ${textSecondary}`}>TZS</span></p>
       </div>
       <div className={`p-5 sm:p-8 rounded-2xl sm:rounded-3xl ${bgCard}`}>
          <h3 className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 mb-4 ${textSecondary}`}><Radar size={14}/> {t.gpsRadar}</h3>
          <div className={`p-6 rounded-2xl border border-dashed text-center flex flex-col items-center justify-center ${isDark ? 'border-white/10 bg-black/20' : 'border-slate-300 bg-slate-50'}`}>
            <div className={`w-12 h-12 rounded-full mb-3 flex items-center justify-center ${isOnline ? 'bg-orange-500/20 text-orange-500 animate-pulse' : (isDark ? 'bg-white/5 text-slate-500' : 'bg-slate-200 text-slate-400')}`}>
               <MapPin size={20} />
            </div>
            <p className={`text-xs font-bold ${isOnline ? 'text-orange-500' : textSecondary}`}>{isOnline ? t.startGPS : t.stopGPS}</p>
          </div>
       </div>
    </div>
  );

  return (
    <div className="flex w-full relative mt-6">
      <div className="flex-1 min-w-0 space-y-4 sm:space-y-6 transition-all duration-300">
        {!activeLoad ? (
          <div className={`p-5 sm:p-8 ${bgCard}`}>
            <div className="flex items-center justify-between mb-4 sm:mb-6 pb-4 border-b border-inherit">
              <div>
                <h3 className={`text-lg sm:text-2xl font-bold tracking-tight ${textPrimary}`}>{t.marketTitle}</h3>
                <p className={`text-xs sm:text-sm mt-1 font-medium ${textSecondary}`}>{t.marketSub}</p>
              </div>
              <span className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-orange-500/10 text-orange-500 border border-orange-500/30 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-sm whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"/> Live
              </span>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {availableLoads.length > 0 ? availableLoads.map((load, i) => (
                <div key={i} className={`p-4 sm:p-5 rounded-2xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:border-orange-500/40 hover:bg-black/10 ${bgInner}`}>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2">
                      <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 sm:py-1 rounded shrink-0`}>{load.id.substring(0,8)}</span>
                      <div className={`flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold truncate ${textSecondary}`}>
                        <Package size={12} className="text-orange-500 shrink-0"/> <span className="truncate">{load.commodity} • {load.weight}</span>
                      </div>
                    </div>
                    <div className={`flex items-center gap-2 font-bold text-sm sm:text-lg ${textPrimary} flex-wrap`}>
                      {load.origin} <ArrowRight size={14} className={`shrink-0 ${textSecondary}`} /> {load.dest}
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 sm:gap-6 border-t sm:border-none border-inherit pt-3 sm:pt-0 shrink-0">
                    <div className="text-left sm:text-right">
                      <p className={`text-[9px] sm:text-[10px] uppercase font-bold tracking-widest mb-0.5 ${textSecondary}`}>{t.payout}</p>
                      <p className="text-base sm:text-xl font-bold text-green-500 whitespace-nowrap">TZS {load.price.toLocaleString()}</p>
                    </div>
                    <button onClick={() => handleAcceptLoad(load)} className="px-4 py-2 sm:px-6 sm:py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl text-[10px] sm:text-xs uppercase tracking-widest transition-all shadow-md active:scale-95 whitespace-nowrap">
                      {t.acceptBtn}
                    </button>
                  </div>
                </div>
              )) : (
                <div className={`p-8 sm:p-10 rounded-2xl text-center border border-dashed ${isDark ? 'border-white/10 text-slate-500 bg-black/20' : 'border-slate-300 text-slate-400 bg-slate-50'}`}>
                   <Truck size={28} className="mx-auto mb-3 sm:mb-4 opacity-50 text-orange-500" />
                   <p className="font-bold text-sm sm:text-base">{t.noLoads}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className={`p-5 sm:p-8 ${bgCard}`}>
            <div className="flex items-center justify-between mb-4 sm:mb-6 border-b border-inherit pb-4">
               <h3 className="text-lg sm:text-xl font-bold flex items-center gap-2 text-orange-500"><Truck size={18} /> {t.activeTrip}</h3>
               <span className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-green-500/10 text-green-600 border border-green-500/30 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-widest shadow-sm">In Transit</span>
            </div>
            <div className={`p-5 sm:p-6 rounded-2xl border mb-5 sm:mb-6 ${bgInner}`}>
              <p className={`text-xl sm:text-2xl font-bold ${textPrimary} flex-wrap flex items-center`}>
                {activeLoad.origin} <ArrowRight className="inline mx-2 text-orange-500 shrink-0" size={16}/> {activeLoad.destination}
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-3">
                 <p className={`text-xs sm:text-sm font-medium ${textSecondary}`}>{activeLoad.commodity} • {activeLoad.weight}</p>
                 <div className={`hidden sm:block w-px h-4 ${isDark ? 'bg-white/10' : 'bg-slate-300'}`} />
                 <p className="text-sm font-bold text-green-500">TZS {activeLoad.price.toLocaleString()}</p>
              </div>
            </div>
            <button onClick={async () => { 
                  await supabase.from('shipments').update({ status: 'completed' }).eq('id', activeLoad.id);
                  setActiveLoad(null); if(isOnline) toggleGPS(); 
                }} 
                className="w-full py-3.5 sm:py-4 rounded-xl bg-green-500 hover:bg-green-600 text-white flex items-center justify-center gap-2 transition-all shadow-md font-bold active:scale-95 text-[10px] sm:text-sm uppercase tracking-widest"
            >
                <CheckCircle2 size={16} /> {t.finishTrip}
            </button>
          </div>
        )}
      </div>

      {/* DESKTOP RIGHT DRAWER */}
      <AnimatePresence initial={false}>
        {isRightSidebarOpen && (
          <motion.div 
            initial={{ width: 0, opacity: 0, marginLeft: 0 }}
            animate={{ width: 360, opacity: 1, marginLeft: 24 }}
            exit={{ width: 0, opacity: 0, marginLeft: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="hidden lg:flex flex-col shrink-0 overflow-hidden box-content"
          >
             <div className="w-[360px] h-full"><DriverRightSidebar /></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE RIGHT DRAWER */}
      <AnimatePresence>
        {isRightSidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm" onClick={() => setIsRightSidebarOpen(false)} />
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.2, ease: "easeOut" }}
              className={`fixed inset-y-0 right-0 z-50 w-[85%] sm:w-[360px] h-full shadow-2xl lg:hidden p-5 sm:p-6 overflow-y-auto ${isDark ? 'bg-[#0a0a0c] border-l border-white/10' : 'bg-slate-50 border-l border-slate-200'}`}
            >
               <DriverRightSidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// ==========================================
// 3. CARGO OWNER VIEW
// ==========================================
const CargoView = ({ profile, t, isDark, isRightSidebarOpen, setIsRightSidebarOpen }: any) => {
  const [showModal, setShowModal] = useState(false);
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);
  const [postStatus, setPostStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [activeTrackingLoad, setActiveTrackingLoad] = useState<any>(null); 
  const [trackedDriver, setTrackedDriver] = useState<any>(null);
  const [formData, setFormData] = useState({ origin: '', dest: '', commodity: '', truckType: '', weight: '', price: '' });
  const [postings, setPostings] = useState<any[]>([]);
  const [searchId, setSearchId] = useState('');

  useEffect(() => {
    const fetchPostings = async () => {
      const { data } = await supabase.from('shipments').select('*').eq('cargo_owner_id', profile.id).order('created_at', { ascending: false });
      if (data) setPostings(data);
    };
    fetchPostings();

    const channel = supabase.channel('market_updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'shipments' }, () => { fetchPostings(); })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'driver_locations' }, (payload: any) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') setTrackedDriver(payload.new);
      }).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [profile.id]);

  const handlePostLoad = async (e: React.FormEvent) => {
    e.preventDefault();
    setPostStatus('loading');
    const newShipment = {
      cargo_owner_id: profile.id, origin: formData.origin, destination: formData.dest,
      commodity: `${formData.commodity} (${formData.truckType})`, weight: formData.weight, price: parseFloat(formData.price.replace(/,/g, '')), 
      status: 'pending' // STRAIGHT TO MARKET
    };
    const { data, error } = await supabase.from('shipments').insert(newShipment).select();
    if (!error && data) {
      setPostStatus('success');
      setTimeout(() => {
        setPostings([data[0], ...postings]); setShowModal(false); setPostStatus('idle');
        setFormData({ origin: '', dest: '', commodity: '', truckType: '', weight: '', price: '' });
      }, 1500);
    } else {
      setPostStatus('idle'); alert("Error: " + error?.message);
    }
  };

  const handleSelectLoad = (post: any) => {
    setActiveTrackingLoad(post);
    setIsRightSidebarOpen(true); 
  };

  const handleTrackSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if(!searchId) return;
    const found = postings.find(p => p.id.startsWith(searchId) || p.id === searchId);
    if(found) handleSelectLoad(found);
    else alert("Mzigo haujapatikana. Hakiki ID.");
  };

  const confirmDeleteLoad = async () => {
    if (!deleteModalId) return;
    const { error } = await supabase.from('shipments').delete().eq('id', deleteModalId);
    if (!error) {
      setPostings(postings.filter(p => p.id !== deleteModalId));
      if (activeTrackingLoad?.id === deleteModalId) setActiveTrackingLoad(null);
      setDeleteModalId(null);
    }
  };

  const getStatusBadge = (status: string) => {
     switch(status) {
       case 'pending': return <span className="bg-blue-500/10 text-blue-400 border border-blue-500/30 px-2.5 py-1 rounded-lg text-[8px] sm:text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 whitespace-nowrap"><Globe size={10}/> Sokoni</span>;
       case 'in_transit': return <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 px-2.5 py-1 rounded-lg text-[8px] sm:text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-[0_0_15px_rgba(99,102,241,0.2)] whitespace-nowrap"><Navigation size={10}/> Njiani</span>;
       default: return <span className="bg-green-500/10 text-green-500 border border-green-500/30 px-2.5 py-1 rounded-lg text-[8px] sm:text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 whitespace-nowrap"><CheckCircle size={10}/> Imefika</span>;
     }
  };

  const bgCard = isDark ? glassCard : "bg-white/90 border border-slate-200 backdrop-blur-xl shadow-lg shadow-slate-200/50 rounded-2xl sm:rounded-3xl";
  const bgInner = isDark ? innerCard : "bg-slate-50 border border-slate-100 shadow-sm";
  const textPrimary = isDark ? "text-white" : "text-slate-900";
  const textSecondary = isDark ? "text-slate-400" : "text-slate-500";

  // Reusable Right Sidebar Content
  const RightSidebarContent = () => {
    const activeCount = postings.filter(p => p.status === 'pending' || p.status === 'in_transit').length;
    const completedCount = postings.filter(p => p.status === 'completed').length;

    return (
      <div className="w-full lg:w-[360px] space-y-4 sm:space-y-6 flex flex-col h-full">
        <div className="flex lg:hidden items-center justify-between mb-2 pb-4 border-b border-white/10">
           <h3 className={`text-sm font-bold ${textPrimary}`}>{t.toggleDash}</h3>
           <button onClick={() => setIsRightSidebarOpen(false)} className={`p-2 rounded-full ${isDark ? 'bg-white/10 text-white' : 'bg-slate-200 text-slate-800'}`}><X size={16}/></button>
        </div>

        <AnimatePresence mode="wait">
          {activeTrackingLoad ? (
             <motion.div 
               key="tracking"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               transition={{ duration: 0.2 }}
               className="space-y-4 sm:space-y-6"
             >
                <div className={`p-5 sm:p-8 rounded-2xl sm:rounded-3xl ${bgCard}`}>
                  <div className="flex items-center justify-between mb-4 sm:mb-6 pb-4 border-b border-inherit">
                    <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest ${textSecondary}`}>{t.trackFleet}</span>
                    <button onClick={() => setActiveTrackingLoad(null)} className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-indigo-500 hover:text-indigo-400 bg-indigo-500/10 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-colors`}>{t.clear}</button>
                  </div>

                  <div className={`h-40 sm:h-48 rounded-xl sm:rounded-2xl relative overflow-hidden flex items-center justify-center mb-5 sm:mb-6 border ${isDark ? 'border-white/10 bg-black/60' : 'border-slate-200 bg-slate-100'}`}>
                     {activeTrackingLoad.status === 'in_transit' && trackedDriver ? (
                       <>
                         <iframe src={`https://maps.google.com/maps?q=Tanzania&t=k&z=6&ie=UTF8&iwloc=&output=embed3${trackedDriver.latitude},${trackedDriver.longitude}&z=14&output=embed`} className="absolute inset-0 w-full h-full border-0 filter invert-[90%] hue-rotate-[180deg] contrast-[85%] saturate-[120%] opacity-80" />
                         <div className="absolute pointer-events-none w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-indigo-600 border-2 border-white shadow-[0_0_20px_#4f46e5] flex items-center justify-center z-10 animate-bounce"><Truck className="w-4 h-4 text-white" /></div>
                       </>
                     ) : activeTrackingLoad.status === 'pending' ? (
                       <div className="text-center w-full px-4 sm:px-6">
                         <Radar size={32} className="mx-auto mb-3 sm:mb-4 text-indigo-500 animate-[spin_3s_linear_infinite]" />
                         <p className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest ${textPrimary}`}>{t.waitingDriver}</p>
                         <p className={`text-[9px] sm:text-[10px] font-medium mt-1.5 sm:mt-2 ${textSecondary} leading-relaxed`}>Tunawataarifu madereva walio karibu na {activeTrackingLoad.origin}.</p>
                       </div>
                     ) : (
                       <div className="text-center opacity-50">
                         <MapPin size={28} className={`mx-auto mb-2 sm:mb-3 ${textSecondary}`} />
                         <p className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest ${textPrimary}`}>{t.delivered}</p>
                       </div>
                     )}
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                     <div className={`p-4 sm:p-5 rounded-xl sm:rounded-2xl border ${bgInner}`}>
                       <p className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest mb-1.5 ${textSecondary}`}>{t.routeDetails}</p>
                       <p className={`text-xs sm:text-sm font-bold ${textPrimary}`}>{activeTrackingLoad.origin} <ArrowRight size={10} className="inline mx-1.5 text-indigo-500"/> {activeTrackingLoad.destination}</p>
                       <p className={`text-[10px] sm:text-[11px] font-medium mt-1.5 sm:mt-2 ${textSecondary}`}>{activeTrackingLoad.commodity} • {activeTrackingLoad.weight}</p>
                     </div>

                     <div className={`p-4 sm:p-5 rounded-xl sm:rounded-2xl border flex items-center justify-between ${bgInner}`}>
                       <div className="flex items-center gap-2 sm:gap-3">
                         <FileText size={14} className="text-indigo-500"/>
                         <span className={`text-xs sm:text-sm font-semibold ${textPrimary}`}>{t.myDocs}</span>
                       </div>
                       <span className={`text-[8px] sm:text-[9px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-lg ${activeTrackingLoad.status === 'completed' ? 'bg-green-500/10 text-green-500 border border-green-500/30' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/30'}`}>
                         {activeTrackingLoad.status === 'completed' ? 'Verified' : 'Pending'}
                       </span>
                     </div>
                  </div>
               </div>
             </motion.div>
          ) : (
             <motion.div 
               key="overview"
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: 20 }}
               transition={{ duration: 0.2 }}
               className="space-y-4 sm:space-y-6"
             >
              <div className={`p-5 sm:p-8 rounded-2xl sm:rounded-3xl flex flex-col justify-between min-h-[140px] sm:min-h-[160px] ${bgCard}`}>
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center"><Wallet size={16} className="text-indigo-500" /></div>
                  <h3 className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest ${textSecondary}`}>{t.totalSpend}</h3>
                </div>
                <p className={`text-2xl sm:text-3xl font-bold tracking-tight ${textPrimary}`}>0.00 <span className={`text-[9px] sm:text-[10px] font-medium ${textSecondary}`}>TZS</span></p>
              </div>

              <div className={`p-5 sm:p-8 rounded-2xl sm:rounded-3xl ${bgCard}`}>
                <div className="flex items-center justify-between mb-4 sm:mb-6 border-b border-inherit pb-3 sm:pb-4">
                  <h3 className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 ${textSecondary}`}><Activity size={14}/> Fleet Summary</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                   <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border ${bgInner}`}>
                      <p className={`text-lg sm:text-xl font-bold ${textPrimary}`}>{activeCount}</p>
                      <p className={`text-[8px] sm:text-[9px] font-bold uppercase tracking-widest mt-1 ${textSecondary}`}>Active Loads</p>
                   </div>
                   <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border ${bgInner}`}>
                      <p className={`text-lg sm:text-xl font-bold ${textPrimary}`}>{completedCount}</p>
                      <p className={`text-[8px] sm:text-[9px] font-bold uppercase tracking-widest mt-1 ${textSecondary}`}>Completed</p>
                   </div>
                </div>

                <div className={`p-5 sm:p-6 rounded-xl sm:rounded-2xl border border-dashed text-center flex flex-col items-center justify-center ${isDark ? 'border-white/10 bg-black/20' : 'border-slate-300 bg-slate-50'}`}>
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full mb-2 sm:mb-3 flex items-center justify-center ${isDark ? 'bg-white/5' : 'bg-slate-200'}`}>
                     <MapPin size={18} className={`opacity-50 ${textSecondary}`} />
                  </div>
                  <p className={`text-[10px] sm:text-[11px] font-medium leading-relaxed ${textSecondary}`}>{t.selectShipment}</p>
                </div>
              </div>
             </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="flex mt-6 w-full relative">
      {/* ADDED min-w-0 TO PREVENT OVERFLOW */}
      <motion.div variants={itemVar} className="flex-1 min-w-0 space-y-4 sm:space-y-6 transition-all duration-300">
        
        {/* TRACK BY ID BAR */}
        <form onSubmit={handleTrackSearch} className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-2.5 rounded-2xl ${bgCard}`}>
           <div className={`flex-1 flex items-center gap-2 sm:gap-3 px-3 sm:px-4 ${isDark ? 'bg-black/30' : 'bg-slate-100'} rounded-xl h-10 sm:h-12 border border-white/5`}>
             <Search size={14} className={textSecondary} />
             <input type="text" placeholder={t.enterId} value={searchId} onChange={(e)=>setSearchId(e.target.value)} className={`bg-transparent w-full text-xs sm:text-sm font-semibold outline-none ${textPrimary} placeholder-slate-500`} />
           </div>
           <button type="submit" className="h-10 sm:h-12 px-4 sm:px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-[10px] sm:text-xs uppercase tracking-widest transition-colors shadow-md active:scale-95">
             {t.trackBtn}
           </button>
        </form>

        <div className={`p-5 sm:p-8 ${bgCard}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8 border-b border-inherit pb-4 sm:pb-6">
            <div>
              <h3 className={`text-lg sm:text-2xl font-bold tracking-tight ${textPrimary}`}>{t.activePostings}</h3>
              <p className={`text-xs sm:text-sm mt-1 sm:mt-2 font-medium ${textSecondary}`}>Dhibiti na fuatilia mizigo yako hapa.</p>
            </div>
            <button onClick={() => setShowModal(true)} className="px-5 py-3 sm:px-6 sm:py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:opacity-90 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/30 text-[10px] sm:text-xs uppercase tracking-widest active:scale-95 whitespace-nowrap">
               <Plus size={14} /> {t.postCargoTitle}
            </button>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {postings.length > 0 ? postings.map((post, i) => (
              <div key={i} onClick={() => handleSelectLoad(post)} className={`p-4 sm:p-5 rounded-2xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 cursor-pointer hover:border-indigo-500/40 hover:bg-black/10 ${bgInner} ${activeTrackingLoad?.id === post.id ? 'ring-1 ring-indigo-500 bg-indigo-500/5' : ''}`}>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                    <span className="text-[9px] sm:text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg uppercase tracking-widest border border-indigo-500/30 shrink-0">{post.id.substring(0,8)}</span>
                    <span className={`text-[10px] sm:text-xs font-semibold flex items-center gap-1.5 truncate ${textSecondary}`}><Package size={12} className="shrink-0"/> <span className="truncate">{post.commodity} • {post.weight}</span></span>
                  </div>
                  <h4 className={`text-sm sm:text-lg font-bold flex items-center gap-2 sm:gap-3 ${textPrimary} flex-wrap`}>{post.origin} <ArrowRight size={14} className={`shrink-0 ${textSecondary}`}/> {post.destination}</h4>
                </div>
                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 sm:gap-5 border-t sm:border-none border-inherit pt-3 sm:pt-0 shrink-0">
                  <div className="text-left sm:text-right flex flex-col items-start sm:items-end">
                    <p className="text-base sm:text-xl font-bold text-green-500 mb-0.5 sm:mb-1 whitespace-nowrap">TZS {post.price.toLocaleString()}</p>
                    {getStatusBadge(post.status)}
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setDeleteModalId(post.id); }} 
                    className={`p-2 sm:p-2.5 rounded-lg transition-colors ${isDark ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )) : (
              <div className={`p-8 sm:p-12 rounded-2xl sm:rounded-3xl text-center border border-dashed ${isDark ? 'border-white/10 bg-black/20' : 'border-slate-300 bg-slate-50'}`}>
                 <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 ${isDark ? 'bg-indigo-500/10' : 'bg-indigo-50'}`}>
                    <Package size={24} className="text-indigo-500" />
                 </div>
                 <p className={`font-bold text-sm sm:text-base ${textPrimary}`}>{t.noActiveTrack}</p>
                 <p className={`text-xs sm:text-sm mt-1 font-medium ${textSecondary}`}>Bofya kitufe cha kusajili mzigo kuanza.</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* DESKTOP RIGHT DRAWER - ANIMATING MARGIN TO AVOID OVERLAPS */}
      <AnimatePresence initial={false}>
        {isRightSidebarOpen && (
          <motion.div 
            initial={{ width: 0, opacity: 0, marginLeft: 0 }}
            animate={{ width: 360, opacity: 1, marginLeft: 24 }}
            exit={{ width: 0, opacity: 0, marginLeft: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="hidden lg:flex flex-col shrink-0 overflow-hidden box-content"
          >
             <div className="w-[360px] h-full"><RightSidebarContent /></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE RIGHT DRAWER */}
      <AnimatePresence>
        {isRightSidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm" onClick={() => setIsRightSidebarOpen(false)} />
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.2, ease: "easeOut" }}
              className={`fixed inset-y-0 right-0 z-50 w-[85%] sm:w-[360px] h-full shadow-2xl lg:hidden p-5 sm:p-6 overflow-y-auto ${isDark ? 'bg-[#0a0a0c] border-l border-white/10' : 'bg-slate-50 border-l border-slate-200'}`}
            >
               <RightSidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* DELETE MODAL & POST MODAL LOGIC REMAINS IDENTICAL... */}
      <AnimatePresence>
        {deleteModalId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
             <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} className={`w-full max-w-sm overflow-hidden rounded-3xl border shadow-2xl p-6 sm:p-8 text-center ${isDark ? 'bg-[#0a0a0c] border-white/10' : 'bg-white border-slate-200'}`}>
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-5 sm:mb-6">
                   <Trash2 size={28} className="text-red-500" />
                </div>
                <h3 className={`text-lg sm:text-xl font-bold mb-2 ${textPrimary}`}>{t.deleteTitle}</h3>
                <p className={`text-xs sm:text-sm mb-6 sm:mb-8 ${textSecondary}`}>{t.deleteMsg}</p>
                <div className="flex items-center gap-3 sm:gap-4">
                   <button onClick={() => setDeleteModalId(null)} className={`flex-1 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm transition-colors ${isDark ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'}`}>
                     {t.deny}
                   </button>
                   <button onClick={confirmDeleteLoad} className="flex-1 py-2.5 sm:py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs sm:text-sm transition-colors shadow-lg shadow-red-500/20">
                     {t.confirm}
                   </button>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} className={`w-full max-w-lg overflow-hidden rounded-3xl border shadow-2xl ${isDark ? 'bg-[#0a0a0c] border-white/10' : 'bg-white border-slate-200'}`}>
              
              {postStatus === 'loading' ? (
                 <div className="p-12 sm:p-16 text-center flex flex-col items-center justify-center">
                    <Loader2 size={32} className="text-indigo-500 animate-spin mb-4 sm:mb-6" />
                    <h3 className={`text-lg sm:text-xl font-bold ${textPrimary} mb-2`}>{t.registering}</h3>
                 </div>
              ) : postStatus === 'success' ? (
                 <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="p-12 sm:p-16 text-center flex flex-col items-center justify-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                       <Check size={32} className="text-green-500" />
                    </div>
                    <h3 className={`text-xl sm:text-2xl font-bold mb-2 ${textPrimary}`}>Imesajiliwa!</h3>
                    <p className={`text-xs sm:text-sm font-medium ${textSecondary}`}>Mzigo wako upo hewani tayari.</p>
                 </motion.div>
              ) : (
                 <>
                  <div className="flex items-center justify-between p-5 sm:p-8 border-b border-inherit">
                    <h3 className={`text-lg sm:text-2xl font-bold ${textPrimary}`}>{t.postCargoTitle}</h3>
                    <button onClick={() => setShowModal(false)} className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full transition-colors ${isDark ? 'bg-white/5 hover:bg-white/10 text-slate-400' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}><X size={16}/></button>
                  </div>

                  <form onSubmit={handlePostLoad} className="p-5 sm:p-8 space-y-4 sm:space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                      <div>
                        <label className={`block text-[9px] sm:text-[10px] font-bold mb-1 sm:mb-1.5 uppercase tracking-widest ${textSecondary}`}>{t.origin}</label>
                        <input required type="text" placeholder="Mf. Dar es Salaam" value={formData.origin} onChange={e => setFormData({...formData, origin: e.target.value})} className={`w-full p-3 sm:p-4 rounded-xl border focus:outline-none transition-colors text-xs sm:text-sm font-medium ${isDark ? 'bg-black/50 border-white/10 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-500'}`} />
                      </div>
                      <div>
                        <label className={`block text-[9px] sm:text-[10px] font-bold mb-1 sm:mb-1.5 uppercase tracking-widest ${textSecondary}`}>{t.dest}</label>
                        <input required type="text" placeholder="Mf. Arusha" value={formData.dest} onChange={e => setFormData({...formData, dest: e.target.value})} className={`w-full p-3 sm:p-4 rounded-xl border focus:outline-none transition-colors text-xs sm:text-sm font-medium ${isDark ? 'bg-black/50 border-white/10 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-500'}`} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                      <div>
                        <label className={`block text-[9px] sm:text-[10px] font-bold mb-1 sm:mb-1.5 uppercase tracking-widest ${textSecondary}`}>{t.commodity}</label>
                        <input required type="text" placeholder="Mf. Mahindi" value={formData.commodity} onChange={e => setFormData({...formData, commodity: e.target.value})} className={`w-full p-3 sm:p-4 rounded-xl border focus:outline-none transition-colors text-xs sm:text-sm font-medium ${isDark ? 'bg-black/50 border-white/10 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-500'}`} />
                      </div>
                      <div>
                        <label className={`block text-[9px] sm:text-[10px] font-bold mb-1 sm:mb-1.5 uppercase tracking-widest ${textSecondary}`}>{t.truckType}</label>
                        <input required type="text" placeholder="Mf. Flatbed" value={formData.truckType} onChange={e => setFormData({...formData, truckType: e.target.value})} className={`w-full p-3 sm:p-4 rounded-xl border focus:outline-none transition-colors text-xs sm:text-sm font-medium ${isDark ? 'bg-black/50 border-white/10 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-500'}`} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                      <div>
                        <label className={`block text-[9px] sm:text-[10px] font-bold mb-1 sm:mb-1.5 uppercase tracking-widest ${textSecondary}`}>{t.weight}</label>
                        <input required type="text" placeholder="Mf. 30 Tani" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} className={`w-full p-3 sm:p-4 rounded-xl border focus:outline-none transition-colors text-xs sm:text-sm font-medium ${isDark ? 'bg-black/50 border-white/10 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-500'}`} />
                      </div>
                      <div>
                        <label className={`block text-[9px] sm:text-[10px] font-bold mb-1 sm:mb-1.5 uppercase tracking-widest ${textSecondary}`}>{t.price}</label>
                        <input required type="number" placeholder="Mf. 1500000" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className={`w-full p-3 sm:p-4 rounded-xl border focus:outline-none transition-colors text-xs sm:text-sm font-medium ${isDark ? 'bg-black/50 border-white/10 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-500'}`} />
                      </div>
                    </div>
                    <div className="pt-5 sm:pt-6 mt-5 sm:mt-6 border-t border-inherit">
                      <button type="submit" className="w-full py-3.5 sm:py-5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:opacity-90 text-white font-bold rounded-xl transition-all shadow-xl shadow-indigo-500/30 active:scale-95 text-[10px] sm:text-xs uppercase tracking-widest">
                        Weka Sokoni
                      </button>
                    </div>
                  </form>
                 </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ==========================================
// 4. MAIN LAYOUT WITH RETRACTABLE LEFT SIDEBAR
// ==========================================
export default function Dashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<'SW' | 'EN'>('SW');
  const [isDark, setIsDark] = useState(true);
  
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false); 
  // Initialize right sidebar default state purely for desktop
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false); 

  useEffect(() => {
    // Automatically open right sidebar only if it's a desktop display
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      setIsRightSidebarOpen(true);
    }
    
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push('/login');
      const { data } = await supabase.from('users').select('*').eq('id', user.id).single();
      if (!data) return router.push('/login');
      setProfile(data);
      setLoading(false);
    };
    fetchUser();
  }, [router]);

  if (loading) return (
    <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#09090b]' : 'bg-[#f4f7f9]'}`}>
      <Loader2 size={32} className="text-indigo-500 animate-spin" />
    </div>
  );

  const t = translations[lang];
  const roleColor = profile.role === 'cargo_owner' ? 'bg-indigo-600' : 'bg-orange-600';
  const roleText = profile.role === 'cargo_owner' ? 'text-indigo-500' : 'text-orange-500';
  const glowColor = profile.role === 'cargo_owner' ? '#4f46e5' : '#f97316';
  const textSecondary = isDark ? "text-slate-400" : "text-slate-500";

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-500 font-sans selection:bg-indigo-500/30 ${isDark ? 'bg-[#050505]' : 'bg-[#f4f7f9]'}`}>
      
      {/* FIXED BACKGROUND ORBS */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {isDark ? (
          <>
            <motion.div animate={{ x: [-20, 20, -20], y: [-20, 20, -20] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute top-[-10%] right-[-5%] w-[40rem] h-[40rem] rounded-full blur-[140px] opacity-[0.15]" style={{ background: glowColor }} />
            <motion.div animate={{ x: [20, -20, 20], y: [20, -20, 20] }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute bottom-[-10%] left-[-5%] w-[30rem] h-[30rem] rounded-full blur-[120px] opacity-[0.1]" style={{ background: profile.role === 'cargo_owner' ? '#8b5cf6' : '#facc15' }} />
          </>
        ) : (
          <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-50 to-transparent" />
        )}
      </div>

      {/* LEFT RETRACTABLE SIDEBAR */}
      <motion.aside 
         animate={{ width: isLeftSidebarOpen ? 256 : 88 }}
         transition={{ duration: 0.2, ease: "easeOut" }}
         className={`hidden lg:flex flex-col z-40 relative backdrop-blur-2xl border-r shrink-0 ${isDark ? 'bg-[#050505]/70 border-white/5' : 'bg-white/80 border-slate-200 shadow-sm'}`}
      >
         <button 
           onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)} 
           className={`absolute -right-3 top-6 w-6 h-6 rounded-full flex items-center justify-center border shadow-sm z-50 transition-colors ${isDark ? 'bg-[#18181b] border-white/20 text-slate-400 hover:text-white' : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'}`}
         >
           {isLeftSidebarOpen ? <ChevronLeft size={14}/> : <ChevronRight size={14}/>}
         </button>

         <div className={`h-[88px] flex items-center border-b border-inherit shrink-0 overflow-hidden ${!isLeftSidebarOpen ? 'justify-center px-0' : 'px-6'}`}>
            <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-lg ${roleColor}`}>G</div>
            {isLeftSidebarOpen && <span className={`ml-3 font-bold tracking-tight text-lg whitespace-nowrap ${isDark ? 'text-white' : 'text-slate-900'}`}>Geek Logistics</span>}
         </div>
         
         <div className={`flex-1 py-8 space-y-3 overflow-y-auto overflow-x-hidden ${!isLeftSidebarOpen ? 'px-3' : 'px-4'}`}>
            <div className={`py-4 rounded-xl flex items-center cursor-pointer transition-all ${!isLeftSidebarOpen ? 'justify-center' : 'px-5 gap-4'} ${isDark ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'}`}>
              <LayoutDashboard size={20} className="shrink-0" />
              {isLeftSidebarOpen && <span className="text-sm font-semibold whitespace-nowrap">{t.overview}</span>}
            </div>
            <div className={`py-4 rounded-xl flex items-center cursor-pointer transition-all ${!isLeftSidebarOpen ? 'justify-center' : 'px-5 gap-4'} ${isDark ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}>
              <ListTodo size={20} className="shrink-0" />
              {isLeftSidebarOpen && <span className="text-sm font-semibold whitespace-nowrap">{t.transactions}</span>}
            </div>
            <div className={`py-4 rounded-xl flex items-center cursor-pointer transition-all ${!isLeftSidebarOpen ? 'justify-center' : 'px-5 gap-4'} ${isDark ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}>
              <Users size={20} className="shrink-0" />
              {isLeftSidebarOpen && <span className="text-sm font-semibold whitespace-nowrap">{t.community}</span>}
            </div>
            <div className={`py-4 rounded-xl flex items-center cursor-pointer transition-all ${!isLeftSidebarOpen ? 'justify-center' : 'px-5 gap-4'} ${isDark ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}>
              <Settings size={20} className="shrink-0" />
              {isLeftSidebarOpen && <span className="text-sm font-semibold whitespace-nowrap">{t.settings}</span>}
            </div>
         </div>

         <div className={`p-6 border-t border-inherit shrink-0 overflow-hidden`}>
            <div className={`flex items-center ${!isLeftSidebarOpen ? 'justify-center' : 'gap-3 px-3 py-2 rounded-xl'} ${isLeftSidebarOpen && (isDark ? 'bg-white/5 border border-white/5' : 'bg-slate-50 border border-slate-200')}`}>
              <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-sm font-bold ${isDark ? 'bg-white/10 text-white' : 'bg-slate-200 text-slate-800'}`}>
                {profile.full_name.charAt(0)}
              </div>
              {isLeftSidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{profile.full_name}</p>
                  <p className={`text-[10px] uppercase font-bold tracking-widest truncate ${textSecondary}`}>{profile.role === 'cargo_owner' ? t.shipperRole : t.driverRole}</p>
                </div>
              )}
            </div>
         </div>
      </motion.aside>

      {/* MOBILE LEFT DRAWER */}
      <AnimatePresence>
        {isLeftSidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm" onClick={() => setIsLeftSidebarOpen(false)} />
            <motion.aside 
               initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ duration: 0.2, ease: "easeOut" }}
               className={`fixed inset-y-0 left-0 w-72 flex flex-col z-50 lg:hidden shadow-2xl ${isDark ? 'bg-[#09090b] border-r border-white/10' : 'bg-white border-r border-slate-200'}`}
            >
               <div className={`h-[88px] flex items-center justify-between px-6 border-b border-inherit shrink-0`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-sm ${roleColor}`}>
                      <ShieldCheck size={20} />
                    </div>
                    <span className={`font-bold tracking-tight text-xl ${isDark ? 'text-white' : 'text-slate-900'}`}>Geek Logistics</span>
                  </div>
                  <button onClick={() => setIsLeftSidebarOpen(false)} className={`p-2 rounded-full ${isDark ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-800'}`}><X size={16}/></button>
               </div>
               <div className="flex-1 py-8 px-6 space-y-3 overflow-y-auto">
                  <div className={`py-4 px-5 rounded-2xl flex items-center gap-4 text-sm font-bold cursor-pointer ${isDark ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'}`}>
                    <LayoutDashboard size={20} className="shrink-0" /> {t.overview}
                  </div>
                  <div className={`py-4 px-5 rounded-2xl flex items-center gap-4 text-sm font-semibold cursor-pointer ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    <ListTodo size={20} className="shrink-0" /> {t.transactions}
                  </div>
                  <div className={`py-4 px-5 rounded-2xl flex items-center gap-4 text-sm font-semibold cursor-pointer ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    <Users size={20} className="shrink-0" /> {t.community}
                  </div>
                  <div className={`py-4 px-5 rounded-2xl flex items-center gap-4 text-sm font-semibold cursor-pointer ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    <Settings size={20} className="shrink-0" /> {t.settings}
                  </div>
               </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        
        <header className={`h-[88px] border-b flex items-center justify-between px-5 sm:px-6 lg:px-10 sticky top-0 z-30 transition-colors backdrop-blur-2xl ${isDark ? 'bg-[#09090b]/70 border-white/5' : 'bg-white/80 border-slate-200'}`}>
          <div className="flex items-center gap-3 sm:gap-4 lg:hidden">
            <button onClick={() => setIsLeftSidebarOpen(true)} className={`p-2 sm:p-3 rounded-xl border ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
              <Menu size={18} />
            </button>
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold text-white text-base sm:text-lg shadow-sm ${roleColor}`}>
              <ShieldCheck size={18} />
            </div>
          </div>

          <div className="hidden lg:block">
             <h2 className={`text-xs font-bold uppercase tracking-widest ${textSecondary}`}>{t.overview}</h2>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 ml-auto">
             <button onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)} className={`hidden lg:flex px-5 py-3 rounded-xl border text-[10px] font-bold tracking-widest uppercase transition-colors active:scale-95 ${isDark ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm'}`}>
               {isRightSidebarOpen ? <ChevronRight size={14} className="mr-2"/> : <ChevronLeft size={14} className="mr-2"/>}
               <span className="hidden sm:inline">{t.toggleDash}</span>
             </button>
             <div className={`hidden sm:block w-px h-8 mx-2 ${isDark ? 'bg-white/10' : 'bg-slate-300'}`} />
             
             <button onClick={() => setLang(lang === 'SW' ? 'EN' : 'SW')} className={`px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl border text-[9px] sm:text-[10px] font-bold tracking-widest uppercase transition-colors active:scale-95 ${isDark ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm'}`}>
               <Globe className="w-3 h-3 sm:w-4 sm:h-4 inline sm:mr-2" /> <span className="hidden sm:inline">{lang}</span>
             </button>
             <button onClick={() => setIsDark(!isDark)} className={`p-2.5 sm:p-3 rounded-xl border transition-colors active:scale-95 ${isDark ? 'bg-white/5 border-white/10 text-yellow-400 hover:bg-white/10' : 'bg-white border-slate-200 text-indigo-600 hover:bg-slate-50 shadow-sm'}`}>
               {isDark ? <Sun size={16} /> : <Moon size={16} />}
             </button>
             <button onClick={async () => { await supabase.auth.signOut(); router.push('/login'); }} className={`p-2.5 sm:p-3 rounded-xl border transition-colors active:scale-95 ${isDark ? 'bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/20' : 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100 shadow-sm'}`}>
               <LogOut size={16} />
             </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 flex">
          <div className="flex-1 flex flex-col min-w-0">
            <motion.div initial="hidden" animate="visible" variants={containerVar} className="w-full">
              <motion.div variants={itemVar} className="mb-4 sm:mb-6">
                <h1 className={`text-2xl sm:text-4xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                   {t.welcome} <span className={roleText}>{profile.full_name.split(' ')[0]}</span>.
                </h1>
                <p className={`text-[10px] sm:text-sm mt-1 sm:mt-2 font-medium italic ${textSecondary} max-w-2xl`}>
                  {t.welcomeQuote}
                </p>
              </motion.div>

              {profile.role === 'truck_owner' && <DriverView profile={profile} t={t} isDark={isDark} isRightSidebarOpen={isRightSidebarOpen} setIsRightSidebarOpen={setIsRightSidebarOpen} />}
              {profile.role === 'cargo_owner' && <CargoView profile={profile} t={t} isDark={isDark} isRightSidebarOpen={isRightSidebarOpen} setIsRightSidebarOpen={setIsRightSidebarOpen} />}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}