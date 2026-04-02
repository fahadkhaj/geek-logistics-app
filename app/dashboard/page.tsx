"use client";
import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, Globe, Sun, Moon, MapPin, Package, ArrowRight, Truck, Plus, 
  AlertTriangle, CheckCircle2, Wallet, Activity, FileText, X, Loader2,
  ChevronRight, ChevronLeft, Radar, CheckCircle, Search, LayoutDashboard, 
  ListTodo, Settings, Users, Menu, Trash2, ShieldCheck, Check, Snowflake, 
  Box, Circle, FileCheck, Info, Layers, BellRing, UploadCloud, Camera, ArrowLeft
} from 'lucide-react';

const translations = {
  SW: {
    shipperRole: 'Mmiliki wa Mzigo', driverRole: 'Dereva',
    welcome: 'Karibu Geek Logistics,', welcomeQuote: '"Mshirika wako wa kuaminika, salama, na wa haraka kwa usafirishaji."',
    marketTitle: 'Soko la Mizigo (Live)', marketSub: 'Mizigo inayopatikana sokoni sasa kwa bei nzuri.',
    acceptBtn: 'Pokea Mzigo', payout: 'Malipo', activeTrip: 'Safari Yako ya Sasa',
    startGPS: 'Washa GPS (Kazini)', stopGPS: 'Zima GPS',
    uploadDocs: 'Weka Nyaraka (POD)', finishTrip: 'Kamilisha Safari',
    wallet: 'Mapato Yako', myDocs: 'Uhakiki wa Nyaraka',
    postCargoTitle: 'Sajili Mzigo', activePostings: 'Mizigo Yako Sokoni',
    trackFleet: 'Ufuatiliaji & Uchambuzi', noActiveTrack: 'Hujasajili mzigo wowote bado.',
    waitingDriver: 'Inatafuta Dereva...',
    step1: 'Inatafuta Lori', step2: 'Lori Limepatikana', step3: 'Mzigo Upo Njiani', step4: 'Inasubiri Uthibitisho', step5: 'Mzigo Umefika',
    viewPOD: 'Kagua Nyaraka (POD) & Lipa',
    serviceTitle: 'Chagua Aina ya Huduma', serviceSub: 'FTL (Lori Zima) au LTL (Mzigo Mdogo).',
    equipTitle: 'Chagua Aina ya Lori', equipSub: 'Tusaidie kupata lori sahihi kwa mzigo wako.',
    detailsTitle: 'Taarifa za Mzigo', detailsSub: 'Weka maelezo ya kina ili kupata bei nzuri.',
    origin: 'Kutoka (Mkoa)', dest: 'Kwenda (Mkoa)', commodity: 'Aina ya Mzigo', truckType: 'Lori Linalohitajika',
    weight: 'Uzito (Tani)', price: 'Bei Elekezi (TZS)',
    toggleDash: 'Muhtasari', trackById: 'Fuatilia Mzigo', trackBtn: 'Tafuta', enterId: 'Ingiza ID ya Mzigo',
    overview: 'Dashibodi', transactions: 'Miamala', fleet: 'Mizigo', settings: 'Mipangilio', community: 'Jamii',
    clear: 'Funga', routeDetails: 'Taarifa za Safari',
    noLoads: 'Hakuna mizigo mipya sokoni kwa sasa. Kaa tayari!',
    inTransit: 'Njiani', delivered: 'Imefika', pendingApproval: 'Inasubiri Malipo',
    totalSpend: 'Jumla ya Matumizi', selectShipment: 'Chagua mzigo kufuatilia Telemetry.',
    tripTools: 'Zana za Safari', gpsRadar: 'Mfumo wa GPS',
    submitFreight: 'Weka Sokoni', registering: 'Inasajili...',
    deleteTitle: 'Futa Mzigo', deleteMsg: 'Je, una uhakika unataka kufuta mzigo huu sokoni?',
    confirm: 'Ndio, Futa', deny: 'Hapana, Ghairi', gpsError: 'Tafadhali ruhusu simu kusoma GPS.',
    nextStep: 'Endelea', backStep: 'Rudi Nyuma',
    newLoadAlert: 'Mzigo Mpya Umewekwa Sokoni!',
    uploadPodTitle: 'Weka Hati ya Makabidhiano (POD)', uploadPodSub: 'Piga picha nyaraka zilizosainiwa ili kulipwa.',
    approvePayout: 'Thibitisha na Toa Malipo', backToLoads: 'Rudi Kwenye Mizigo',
    fatalErrorTitle: 'Hitilafu ya Akaunti', fatalErrorMsg: 'Akaunti yako haijasajiliwa kikamilifu kwenye kanzidata. Tafadhali rudi mwanzo na ufungue akaunti mpya.'
  },
  EN: {
    shipperRole: 'Cargo Owner', driverRole: 'Transporter',
    welcome: 'Welcome to Geek Logistics,', welcomeQuote: '"Your secure, reliable, and fast partner for enterprise freight logistics."',
    marketTitle: 'Live Load Board', marketSub: 'Premium guaranteed loads available for instant booking.',
    acceptBtn: 'Book Load', payout: 'Payout', activeTrip: 'Active Shipment',
    startGPS: 'Go Online (GPS)', stopGPS: 'Go Offline',
    uploadDocs: 'Upload POD', finishTrip: 'Complete Delivery',
    wallet: 'Available Balance', myDocs: 'Document Vault',
    postCargoTitle: 'Create Shipment', activePostings: 'Active Shipments',
    trackFleet: 'Telemetry Command', noActiveTrack: 'You have no active shipments yet.',
    waitingDriver: 'Matching with Carrier...',
    step1: 'Searching Network', step2: 'Carrier Dispatched', step3: 'In Transit', step4: 'Awaiting POD Approval', step5: 'Delivered & Paid',
    viewPOD: 'Review POD & Release Funds',
    serviceTitle: 'Choose Service Type', serviceSub: 'Select Full Truckload or Less-than-Truckload.',
    equipTitle: 'Choose Equipment', equipSub: 'Select the trailer type needed for your freight.',
    detailsTitle: 'Shipment Details', detailsSub: 'Provide lane details to lock in your rate.',
    origin: 'Pickup Location', dest: 'Dropoff Location', commodity: 'Commodity', truckType: 'Required Equipment',
    weight: 'Weight (Tons)', price: 'Target Payout (TZS)',
    toggleDash: 'Dashboard', trackById: 'Track Shipment', trackBtn: 'Track', enterId: 'Enter Shipment ID',
    overview: 'Overview', transactions: 'Billing', fleet: 'Shipments', settings: 'Settings', community: 'Network',
    clear: 'Close', routeDetails: 'Lane Details',
    noLoads: 'No new loads on the market currently. Stay tuned!',
    inTransit: 'In Transit', delivered: 'Paid', pendingApproval: 'Pending Approval',
    totalSpend: 'Total Freight Spend', selectShipment: 'Select a shipment to view live telemetry.',
    tripTools: 'Dispatch Tools', gpsRadar: 'GPS Status',
    submitFreight: 'Post to Market', registering: 'Processing...',
    deleteTitle: 'Cancel Shipment', deleteMsg: 'Are you sure you want to cancel this shipment?',
    confirm: 'Yes, Cancel', deny: 'No, Keep it', gpsError: 'Please allow GPS access on your device.',
    nextStep: 'Next Step', backStep: 'Go Back',
    newLoadAlert: '🚨 New Load Posted to the Market!',
    uploadPodTitle: 'Upload Proof of Delivery', uploadPodSub: 'Upload the signed Waybill/POD to request payout.',
    approvePayout: 'Approve & Release Funds', backToLoads: 'Back to Shipments',
    fatalErrorTitle: 'Account Error', fatalErrorMsg: 'Signup Incomplete: Your profile is missing from the database. We are logging you out so you can create a fresh account.'
  }
};

const serviceTypes = [
  { id: 'FTL', icon: <Truck size={28} />, title: 'Full truckload (FTL)', desc: 'Best for shipments that fill an entire truck.' },
  { id: 'LTL', icon: <Layers size={28} />, title: 'Less-than-truckload (LTL)', desc: 'Best for shipments under 12 pallets.' }
];

const equipmentTypes = [
  { id: 'Flatbed', icon: <Truck size={24} />, title: 'Flatbed', desc: 'Standard open trailer.' },
  { id: 'Dry Van', icon: <Box size={24} />, title: 'Dry Van', desc: 'Enclosed cargo area.' },
  { id: 'Tipper', icon: <Truck size={24} />, title: 'Tipper', desc: 'Bulk loose materials.' },
  { id: 'Refrigerated', icon: <Snowflake size={24} />, title: 'Refrigerated', desc: 'Temperature controlled.' }
];

const transitionEase = [0.16, 1, 0.3, 1];
const containerVar = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVar = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: transitionEase } } };
const stepVar = { hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: transitionEase } }, exit: { opacity: 0, x: -20, transition: { duration: 0.2 } } };

export default function Dashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false); // HYDRATION SHIELD
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fatalError, setFatalError] = useState<string | null>(null);
  const [lang, setLang] = useState<'SW' | 'EN'>('SW');
  const [isDark, setIsDark] = useState(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false); 
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false); 
  const watchIdRef = useRef<number | null>(null);

  // FIX: Valid Tailwind class definitions instead of raw hex strings
  const bgMainClass = isDark ? 'bg-[#080b1a]' : 'bg-[#fbfcfd]'; 
  const textPrimary = isDark ? "text-white" : "text-slate-900";
  const textSecondary = isDark ? "text-slate-300" : "text-slate-600";
  const glassNav = isDark ? "bg-[#080b1a]/60 border-white/5 backdrop-blur-xl" : "bg-white/60 border-slate-200/50 backdrop-blur-xl";
  const glassCard = isDark ? "bg-white/[0.02] border border-white/5 backdrop-blur-2xl shadow-xl rounded-2xl sm:rounded-3xl" : "bg-white/90 border border-slate-200 backdrop-blur-xl shadow-lg rounded-2xl sm:rounded-3xl";
  const innerCard = isDark ? "bg-black/20 border border-white/5 shadow-sm" : "bg-slate-50 border border-slate-100 shadow-sm";

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) setIsRightSidebarOpen(true);
    
    const fetchUser = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) return router.replace('/login');
        
        const { data, error } = await supabase.from('users').select('*').eq('id', user.id).single();

        if (error || !data) {
           setFatalError(translations[lang].fatalErrorMsg);
           setLoading(false);
           return;
        }
        setProfile(data); setLoading(false);
      } catch (err) {
        if (typeof window !== 'undefined') { localStorage.clear(); sessionStorage.clear(); }
        router.replace('/login');
      }
    };
    fetchUser();
  }, [router, lang]);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  // BULLETPROOF HYDRATION SHIELD
  if (!mounted) return <div className="min-h-screen bg-[#080b1a]" />;

  if (fatalError) return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-700 ${bgMainClass}`}>
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div animate={{ x: [-10, 10, -10], y: [-10, 10, -10] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className={`absolute top-[-5%] right-[-5%] w-[45vw] h-[45vw] rounded-full blur-[160px] bg-red-600 ${isDark ? 'opacity-[0.08]' : 'opacity-[0.05]'}`} />
      </div>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`relative z-10 w-full max-w-sm overflow-hidden rounded-3xl border shadow-2xl p-6 sm:p-8 text-center ${isDark ? 'bg-[#111322]/90 border-white/10 backdrop-blur-xl' : 'bg-white border-slate-200'}`}>
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle size={28} className="text-red-500" />
          </div>
          <h3 className={`text-xl font-bold mb-2 ${textPrimary}`}>{translations[lang].fatalErrorTitle}</h3>
          <p className={`text-sm mb-8 ${textSecondary}`}>{fatalError}</p>
          <button 
            onClick={async () => {
              await supabase.auth.signOut();
              if (typeof window !== 'undefined') { localStorage.clear(); sessionStorage.clear(); }
              router.replace('/login');
            }} 
            className="w-full py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-colors shadow-lg active:scale-95"
          >
            {lang === 'SW' ? 'Rudi Kwenye Login' : 'Return to Login'}
          </button>
      </motion.div>
    </div>
  );

  if (loading) return (
    <div className={`min-h-screen flex flex-col items-center justify-center ${bgMainClass}`}>
      <Loader2 size={40} className="text-indigo-500 animate-spin mb-4" />
      <p className={`text-xs font-bold tracking-widest uppercase animate-pulse ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Loading Platform...</p>
    </div>
  );

  const t = translations[lang];
  const isCargoMode = profile?.role === 'cargo_owner';
  const accentColor = isCargoMode ? 'text-indigo-500' : 'text-orange-500';
  const bgAccent = isCargoMode ? 'bg-indigo-500' : 'bg-orange-500';

  const DriverView = () => {
    const [activeLoad, setActiveLoad] = useState<any>(null); 
    const [availableLoads, setAvailableLoads] = useState<any[]>([]);
    const [isOnline, setIsOnline] = useState(false);
    const [showPodModal, setShowPodModal] = useState(false);
    const [podFile, setPodFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const fetchLoads = async () => {
      const { data: myLoad } = await supabase.from('shipments').select('*').eq('driver_id', profile.id).neq('status', 'completed').single();
      if (myLoad) setActiveLoad(myLoad);
      else {
        const { data: openLoads } = await supabase.from('shipments').select('*').eq('status', 'pending').order('created_at', { ascending: false });
        if (openLoads) setAvailableLoads(openLoads);
      }
    };

    useEffect(() => {
      fetchLoads();
      const channel = supabase.channel('driver_market')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'shipments' }, payload => {
          if (payload.new.status === 'pending') { triggerToast(translations[lang].newLoadAlert); setAvailableLoads(prev => [payload.new, ...prev]); }
        })
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'shipments' }, payload => { fetchLoads(); }).subscribe();
      return () => { supabase.removeChannel(channel); };
    }, [lang]);

    const handleAcceptLoad = async (load: any) => {
      const { error } = await supabase.from('shipments').update({ driver_id: profile.id, status: 'in_transit' }).eq('id', load.id);
      if (!error) { setActiveLoad({...load, status: 'in_transit'}); if (window.innerWidth >= 1024) setIsRightSidebarOpen(true); }
    };

    const toggleGPS = async () => {
      if (typeof window === 'undefined' || !navigator?.geolocation) return alert(t.gpsError);
      if (isOnline) {
        setIsOnline(false);
        if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
      } else {
        setIsOnline(true); triggerToast("GPS Connected. Telemetry Active.");
        watchIdRef.current = navigator.geolocation.watchPosition(
          async (pos) => {
            await supabase.from('driver_locations').upsert({ driver_id: profile.id, latitude: pos.coords.latitude, longitude: pos.coords.longitude, updated_at: new Date().toISOString() });
          },
          (err) => { alert(t.gpsError); setIsOnline(false); },
          { enableHighAccuracy: true }
        );
      }
    };

    const submitPOD = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!podFile || !activeLoad) return;
      setIsUploading(true);
      const ext = podFile.name.split('.').pop();
      const path = `${activeLoad.id}-pod.${ext}`; 
      const { error: uploadErr } = await supabase.storage.from('shipment_docs').upload(path, podFile);
      if (!uploadErr) {
        const podUrl = supabase.storage.from('shipment_docs').getPublicUrl(path).data.publicUrl;
        const { error: dbError } = await supabase.from('shipments').update({ status: 'pending_approval', pod_url: podUrl }).eq('id', activeLoad.id);
        if (!dbError) { setActiveLoad({...activeLoad, status: 'pending_approval', pod_url: podUrl}); setShowPodModal(false); triggerToast("POD Uploaded. Awaiting Payout."); }
      }
      setIsUploading(false);
    };

    const DriverRightSidebar = () => (
      <div className="w-full lg:w-[360px] space-y-4 sm:space-y-6 flex flex-col h-full">
         <div className="flex lg:hidden items-center justify-between mb-2 pb-4 border-b border-white/10">
             <h3 className={`text-sm font-bold ${textPrimary}`}>{t.toggleDash}</h3>
             <button onClick={() => setIsRightSidebarOpen(false)} className={`p-2 rounded-full ${isDark ? 'bg-white/10 text-white' : 'bg-slate-200 text-slate-800'}`}><X size={16}/></button>
         </div>
         <div className={`p-5 sm:p-8 flex flex-col justify-between min-h-[140px] ${glassCard}`}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center justify-center"><Wallet size={16} className="text-green-500" /></div>
              <h3 className={`text-[10px] font-bold uppercase tracking-widest ${textSecondary}`}>{t.wallet}</h3>
            </div>
            <p className={`text-2xl sm:text-3xl font-bold tracking-tight ${textPrimary}`}>0.00 <span className={`text-[10px] font-medium ${textSecondary}`}>TZS</span></p>
         </div>
         <div className={`p-5 sm:p-8 ${glassCard}`}>
            <h3 className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 mb-4 ${textSecondary}`}><Radar size={14}/> {t.gpsRadar}</h3>
            <div className={`p-6 rounded-2xl border border-dashed text-center flex flex-col items-center justify-center ${isDark ? 'border-white/10 bg-black/20' : 'border-slate-300 bg-slate-50'}`}>
              <button onClick={toggleGPS} className={`w-14 h-14 rounded-full mb-3 flex items-center justify-center transition-all shadow-lg ${isOnline ? 'bg-orange-500 text-white shadow-orange-500/30 animate-pulse' : (isDark ? 'bg-white/10 text-slate-400 hover:bg-white/20' : 'bg-slate-200 text-slate-500 hover:bg-slate-300')}`}>
                 <MapPin size={24} />
              </button>
              <p className={`text-xs font-bold uppercase tracking-widest ${isOnline ? 'text-orange-500' : textSecondary}`}>{isOnline ? t.startGPS : t.stopGPS}</p>
            </div>
         </div>
      </div>
    );

    return (
      <div className="flex w-full relative mt-6">
        <motion.div variants={itemVar} className="flex-1 min-w-0 space-y-4 sm:space-y-6 transition-all duration-300">
          {!activeLoad ? (
            <div className={`p-5 sm:p-8 ${glassCard}`}>
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
                  <div key={i} className={`p-4 sm:p-5 rounded-2xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:border-orange-500/40 hover:bg-black/10 ${innerCard}`}>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 sm:gap-3 mb-2">
                        <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 sm:py-1 rounded shrink-0`}>{load.id.substring(0,8)}</span>
                        <div className={`flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold truncate ${textSecondary}`}>
                          <Package size={12} className="text-orange-500 shrink-0"/> <span className="truncate">{load.commodity} • {load.weight}</span>
                        </div>
                      </div>
                      <div className={`flex items-center gap-2 font-bold text-sm sm:text-lg ${textPrimary} flex-wrap`}>
                        {load.origin} <ArrowRight size={14} className={`shrink-0 ${textSecondary}`} /> {load.destination}
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
            <div className={`p-5 sm:p-8 ${glassCard}`}>
              <div className="flex items-center justify-between mb-4 sm:mb-6 border-b border-inherit pb-4">
                 <h3 className="text-lg sm:text-xl font-bold flex items-center gap-2 text-orange-500"><Truck size={18} /> {t.activeTrip}</h3>
                 <span className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-widest shadow-sm ${activeLoad.status === 'in_transit' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/30' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/30'}`}>
                   {activeLoad.status === 'in_transit' ? t.inTransit : t.pendingApproval}
                 </span>
              </div>
              <div className={`p-5 sm:p-6 rounded-2xl border mb-5 sm:mb-6 ${innerCard}`}>
                <p className={`text-xl sm:text-2xl font-bold ${textPrimary} flex-wrap flex items-center`}>
                  {activeLoad.origin} <ArrowRight className="inline mx-2 text-orange-500 shrink-0" size={16}/> {activeLoad.destination}
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-3">
                   <p className={`text-xs sm:text-sm font-medium ${textSecondary}`}>{activeLoad.commodity} • {activeLoad.weight}</p>
                   <div className={`hidden sm:block w-px h-4 ${isDark ? 'bg-white/10' : 'bg-slate-300'}`} />
                   <p className="text-sm font-bold text-green-500">TZS {activeLoad.price.toLocaleString()}</p>
                </div>
              </div>
              {activeLoad.status === 'in_transit' ? (
                <button onClick={() => setShowPodModal(true)} className="w-full py-3.5 sm:py-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white flex items-center justify-center gap-2 transition-all shadow-md font-bold active:scale-95 text-[10px] sm:text-sm uppercase tracking-widest">
                    <Camera size={16} /> {t.uploadDocs}
                </button>
              ) : (
                <div className="w-full py-3.5 sm:py-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 flex items-center justify-center gap-2 font-bold text-[10px] sm:text-sm uppercase tracking-widest">
                    <Loader2 size={16} className="animate-spin" /> Awaiting Escrow Release
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* DRIVER POD MODAL */}
        <AnimatePresence>
          {showPodModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
               <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} className={`w-full max-w-md overflow-hidden rounded-3xl border shadow-2xl p-6 sm:p-8 text-center ${isDark ? 'bg-[#080b1a] border-white/10' : 'bg-white border-slate-200'}`}>
                  <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-6"><UploadCloud size={28} className="text-orange-500" /></div>
                  <h3 className={`text-xl font-bold mb-2 ${textPrimary}`}>{t.uploadPodTitle}</h3>
                  <p className={`text-sm mb-6 ${textSecondary}`}>{t.uploadPodSub}</p>
                  
                  <form onSubmit={submitPOD}>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="relative group cursor-pointer mb-6">
                      <input type="file" accept="image/*" required onChange={(e) => {if(e.target.files) setPodFile(e.target.files[0])}} className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer" />
                      <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${podFile ? 'border-green-500 bg-green-500/10' : isDark ? 'border-white/20 bg-black/40 hover:border-orange-500' : 'border-slate-300 bg-white/50 hover:border-orange-500'}`}>
                        <div className="text-3xl mb-2">{podFile ? '📄' : '📸'}</div>
                        <p className={`text-xs font-bold uppercase tracking-wider truncate ${podFile ? 'text-green-500' : textSecondary}`}>{podFile ? podFile.name : 'Tap to Upload Image'}</p>
                      </div>
                    </motion.div>
                    
                    <div className="flex items-center gap-4">
                       <button type="button" onClick={() => setShowPodModal(false)} className={`flex-1 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-colors ${isDark ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'}`}>{t.clear}</button>
                       <button type="submit" disabled={isUploading} className={`flex-1 py-3.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-xs uppercase tracking-widest transition-colors shadow-lg ${isUploading ? 'opacity-70' : ''}`}>
                         {isUploading ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'Submit POD'}
                       </button>
                    </div>
                  </form>
               </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence initial={false}>
          {isRightSidebarOpen && (
            <motion.div initial={{ width: 0, opacity: 0, marginLeft: 0 }} animate={{ width: 360, opacity: 1, marginLeft: 24 }} exit={{ width: 0, opacity: 0, marginLeft: 0 }} transition={{ duration: 0.2, ease: "easeOut" }} className="hidden lg:flex flex-col shrink-0 overflow-hidden box-content">
               <DriverRightSidebar />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // ==========================================
  // CARGO OWNER VIEW
  // ==========================================
  const CargoView = () => {
    const [showWizard, setShowWizard] = useState(false);
    const [postStep, setPostStep] = useState<1 | 2 | 3>(1);
    const [deleteModalId, setDeleteModalId] = useState<string | null>(null);
    const [podModalUrl, setPodModalUrl] = useState<string | null>(null);
    const [postStatus, setPostStatus] = useState<'idle' | 'loading' | 'success'>('idle');
    const [activeTrackingLoad, setActiveTrackingLoad] = useState<any>(null); 
    const [formData, setFormData] = useState({ serviceType: '', origin: '', dest: '', commodity: '', truckType: '', weight: '', price: '' });
    const [postings, setPostings] = useState<any[]>([]);

    const fetchPostings = async () => {
      const { data } = await supabase.from('shipments').select('*').eq('cargo_owner_id', profile.id).order('created_at', { ascending: false });
      if (data) {
        setPostings(data);
        if (activeTrackingLoad) {
          const updatedActive = data.find(d => d.id === activeTrackingLoad.id);
          if (updatedActive) setActiveTrackingLoad(updatedActive);
        }
      }
    };

    useEffect(() => {
      fetchPostings();
      const channel = supabase.channel('cargo_updates')
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'shipments', filter: `cargo_owner_id=eq.${profile.id}` }, payload => {
          triggerToast("Shipment Status Updated!"); fetchPostings();
        }).subscribe();
      return () => { supabase.removeChannel(channel); };
    }, [activeTrackingLoad]);

    const handlePostLoad = async (e: React.FormEvent) => {
      e.preventDefault(); setPostStatus('loading');
      const newShipment = {
        cargo_owner_id: profile.id, origin: formData.origin, destination: formData.dest,
        commodity: `[${formData.serviceType}] ${formData.commodity} (${formData.truckType})`, 
        weight: formData.weight, price: parseFloat(formData.price.replace(/,/g, '')), status: 'pending'
      };
      const { data, error } = await supabase.from('shipments').insert(newShipment).select();
      if (!error && data) {
        setPostStatus('success');
        setTimeout(() => {
          fetchPostings(); setShowWizard(false); setPostStatus('idle'); setPostStep(1);
          setFormData({ serviceType: '', origin: '', dest: '', commodity: '', truckType: '', weight: '', price: '' });
        }, 1500);
      } else { setPostStatus('idle'); alert("Error: " + error?.message); }
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

    const approvePayout = async () => {
      if (!activeTrackingLoad) return;
      const { error } = await supabase.from('shipments').update({ status: 'completed' }).eq('id', activeTrackingLoad.id);
      if (!error) { setPodModalUrl(null); fetchPostings(); triggerToast("Funds Released Successfully!"); }
    };

    const TelemetryStepper = ({ status }: { status: string }) => {
      const steps = [
        { label: t.step1, active: ['pending','in_transit','pending_approval','completed'].includes(status), done: ['in_transit','pending_approval','completed'].includes(status) },
        { label: t.step2, active: ['in_transit','pending_approval','completed'].includes(status), done: ['in_transit','pending_approval','completed'].includes(status) },
        { label: t.step3, active: ['in_transit','pending_approval','completed'].includes(status), done: ['pending_approval','completed'].includes(status) },
        { label: t.step4, active: ['pending_approval','completed'].includes(status), done: status === 'completed' },
        { label: t.step5, active: status === 'completed', done: status === 'completed' }
      ];

      return (
        <div className={`p-6 sm:p-8 rounded-2xl border ${innerCard} relative`}>
          <div className="absolute left-[39px] top-10 bottom-10 w-0.5 bg-white/5" />
          <div className="space-y-8 relative z-10">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center gap-5">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-[#080b1a] transition-colors ${s.done ? 'bg-indigo-500 text-white' : s.active ? 'bg-indigo-500/20 border-indigo-500 text-indigo-500' : 'bg-white/5 text-slate-600'}`}>
                  {s.done ? <Check size={16} /> : <Circle size={12} className="fill-current" />}
                </div>
                <div>
                  <h4 className={`text-sm font-bold ${s.active ? textPrimary : textSecondary}`}>{s.label}</h4>
                  {s.active && !s.done && i === 0 && <p className="text-xs text-indigo-400 animate-pulse mt-1">Live matching...</p>}
                  {s.active && !s.done && i === 2 && <p className="text-xs text-indigo-400 mt-1">Driver pinging GPS...</p>}
                </div>
              </div>
            ))}
          </div>
          
          <AnimatePresence>
            {status === 'pending_approval' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 pt-6 border-t border-white/10">
                <button onClick={() => setPodModalUrl(activeTrackingLoad.pod_url)} className="w-full py-3.5 bg-green-500 hover:bg-green-600 shadow-lg text-white rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
                  <FileCheck size={16} /> {t.viewPOD}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    };

    const CargoRightSidebar = () => {
      const activeCount = postings.filter(p => ['pending','in_transit','pending_approval'].includes(p.status)).length;
      const completedCount = postings.filter(p => p.status === 'completed').length;

      return (
        <div className="w-full lg:w-[360px] space-y-4 sm:space-y-6 flex flex-col h-full">
          <div className="flex lg:hidden items-center justify-between mb-2 pb-4 border-b border-white/10">
             <h3 className={`text-sm font-bold ${textPrimary}`}>{t.toggleDash}</h3>
             <button onClick={() => setIsRightSidebarOpen(false)} className={`p-2 rounded-full ${isDark ? 'bg-white/10 text-white' : 'bg-slate-200 text-slate-800'}`}><X size={16}/></button>
          </div>

          <AnimatePresence mode="wait">
            {activeTrackingLoad ? (
               <motion.div key="tracking" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="space-y-4 sm:space-y-6">
                 <div className={`p-5 sm:p-8 rounded-2xl sm:rounded-3xl ${glassCard}`}>
                   <div className="flex items-center justify-between mb-6 pb-4 border-b border-inherit">
                     <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 ${textPrimary}`}><Activity size={14} className="text-indigo-500"/> {t.trackFleet}</span>
                     <button onClick={() => setActiveTrackingLoad(null)} className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-white bg-white/5 px-2.5 py-1.5 rounded-lg transition-colors`}>{t.clear}</button>
                   </div>
                   
                   <TelemetryStepper status={activeTrackingLoad.status} />

                   <div className={`mt-6 p-4 sm:p-5 rounded-xl sm:rounded-2xl border ${innerCard}`}>
                     <p className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest mb-1.5 ${textSecondary}`}>{t.routeDetails}</p>
                     <p className={`text-xs sm:text-sm font-bold ${textPrimary}`}>{activeTrackingLoad.origin} <ArrowRight size={10} className="inline mx-1.5 text-indigo-500"/> {activeTrackingLoad.destination}</p>
                     <p className={`text-[10px] sm:text-[11px] font-medium mt-1.5 sm:mt-2 ${textSecondary}`}>{activeTrackingLoad.commodity} • {activeTrackingLoad.weight}</p>
                   </div>
                 </div>
               </motion.div>
            ) : (
               <motion.div key="overview" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }} className="space-y-4 sm:space-y-6">
                <div className={`p-5 sm:p-8 rounded-2xl sm:rounded-3xl flex flex-col justify-between min-h-[140px] sm:min-h-[160px] ${glassCard}`}>
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center"><Wallet size={16} className="text-indigo-500" /></div>
                    <h3 className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest ${textSecondary}`}>{t.totalSpend}</h3>
                  </div>
                  <p className={`text-2xl sm:text-3xl font-bold tracking-tight ${textPrimary}`}>0.00 <span className={`text-[9px] sm:text-[10px] font-medium ${textSecondary}`}>TZS</span></p>
                </div>

                <div className={`p-5 sm:p-8 rounded-2xl sm:rounded-3xl ${glassCard}`}>
                  <div className="flex items-center justify-between mb-4 sm:mb-6 border-b border-inherit pb-3 sm:pb-4">
                    <h3 className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 ${textSecondary}`}><Activity size={14}/> Fleet Summary</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                     <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border ${innerCard}`}>
                        <p className={`text-lg sm:text-xl font-bold ${textPrimary}`}>{activeCount}</p>
                        <p className={`text-[8px] sm:text-[9px] font-bold uppercase tracking-widest mt-1 ${textSecondary}`}>Active Loads</p>
                     </div>
                     <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border ${innerCard}`}>
                        <p className={`text-lg sm:text-xl font-bold ${textPrimary}`}>{completedCount}</p>
                        <p className={`text-[8px] sm:text-[9px] font-bold uppercase tracking-widest mt-1 ${textSecondary}`}>Completed</p>
                     </div>
                  </div>
                  <div className={`p-5 sm:p-6 rounded-xl sm:rounded-2xl border border-dashed text-center flex flex-col items-center justify-center ${isDark ? 'border-white/10 bg-black/20' : 'border-slate-300 bg-slate-50'}`}>
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full mb-2 sm:mb-3 flex items-center justify-center ${isDark ? 'bg-white/5' : 'bg-slate-200'}`}><MapPin size={18} className={`opacity-50 ${textSecondary}`} /></div>
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
        <motion.div variants={itemVar} className="flex-1 min-w-0 space-y-4 sm:space-y-6 transition-all duration-300">
          
          <div className={`p-5 sm:p-8 ${glassCard}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8 border-b border-inherit pb-4 sm:pb-6">
              <div>
                <h3 className={`text-lg sm:text-2xl font-bold tracking-tight ${textPrimary}`}>{t.activePostings}</h3>
              </div>
              <button onClick={() => setShowWizard(true)} className="px-5 py-3 sm:px-6 sm:py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 text-[10px] sm:text-xs uppercase tracking-widest whitespace-nowrap">
                 <Plus size={14} /> {t.postCargoTitle}
              </button>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {postings.length > 0 ? postings.map((post, i) => (
                <div key={i} onClick={() => setActiveTrackingLoad(post)} className={`p-4 sm:p-5 rounded-2xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 cursor-pointer hover:border-indigo-500/40 hover:bg-black/10 ${innerCard} ${activeTrackingLoad?.id === post.id ? 'ring-1 ring-indigo-500 bg-indigo-500/5' : ''}`}>
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
                      
                      <span className={`px-2.5 py-1 rounded-lg text-[8px] sm:text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 whitespace-nowrap ${
                        post.status === 'pending' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' : 
                        post.status === 'in_transit' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30' : 
                        post.status === 'pending_approval' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/30' : 
                        'bg-green-500/10 text-green-500 border border-green-500/30'
                      }`}>
                        {post.status === 'pending' ? 'Sokoni' : post.status === 'in_transit' ? t.inTransit : post.status === 'pending_approval' ? t.pendingApproval : t.delivered}
                      </span>
                    </div>
                    {post.status === 'pending' && (
                      <button onClick={(e) => { e.stopPropagation(); setDeleteModalId(post.id); }} className={`p-2 sm:p-2.5 rounded-lg transition-colors ${isDark ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}><Trash2 size={16} /></button>
                    )}
                  </div>
                </div>
              )) : (
                <div className={`p-8 sm:p-12 rounded-2xl sm:rounded-3xl text-center border border-dashed ${isDark ? 'border-white/10 bg-black/20' : 'border-slate-300 bg-slate-50'}`}>
                   <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 ${isDark ? 'bg-indigo-500/10' : 'bg-indigo-50'}`}><Package size={24} className="text-indigo-500" /></div>
                   <p className={`font-bold text-sm sm:text-base ${textPrimary}`}>{t.noActiveTrack}</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <AnimatePresence initial={false}>
          {isRightSidebarOpen && (
            <motion.div initial={{ width: 0, opacity: 0, marginLeft: 0 }} animate={{ width: 360, opacity: 1, marginLeft: 24 }} exit={{ width: 0, opacity: 0, marginLeft: 0 }} transition={{ duration: 0.2, ease: "easeOut" }} className="hidden lg:flex flex-col shrink-0 overflow-hidden box-content">
               <CargoRightSidebar />
            </motion.div>
          )}
        </AnimatePresence>

        {/* UBER FREIGHT MULTI-STEP WIZARD */}
        <AnimatePresence>
          {showWizard && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} className={`w-full max-w-3xl overflow-hidden rounded-3xl border shadow-2xl ${isDark ? 'bg-[#080b1a] border-white/10' : 'bg-white border-slate-200'}`}>
                
                {postStatus === 'loading' ? (
                   <div className="p-16 text-center flex flex-col items-center justify-center h-[400px]">
                      <Loader2 size={32} className="text-indigo-500 animate-spin mb-6" />
                      <h3 className={`text-xl font-bold ${textPrimary} mb-2`}>{t.registering}</h3>
                   </div>
                ) : postStatus === 'success' ? (
                   <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="p-16 text-center flex flex-col items-center justify-center h-[400px]">
                      <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6"><Check size={32} className="text-green-500" /></div>
                      <h3 className={`text-2xl font-bold mb-2 ${textPrimary}`}>Imesajiliwa!</h3>
                   </motion.div>
                ) : (
                   <>
                    <div className="flex items-center justify-between p-6 sm:p-8 border-b border-white/5">
                      <div>
                        <h3 className={`text-2xl font-bold ${textPrimary}`}>{postStep === 1 ? t.serviceTitle : postStep === 2 ? t.equipTitle : t.detailsTitle}</h3>
                        <p className={`text-xs sm:text-sm font-medium mt-1 ${textSecondary}`}>{postStep === 1 ? t.serviceSub : postStep === 2 ? t.equipSub : t.detailsSub}</p>
                      </div>
                      <button onClick={() => {setShowWizard(false); setPostStep(1);}} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-slate-400 transition-colors"><X size={18}/></button>
                    </div>

                    <div className="p-6 sm:p-8 min-h-[400px]">
                      <AnimatePresence mode="wait">
                        {postStep === 1 ? (
                          <motion.div key="step1" variants={stepVar} initial="hidden" animate="visible" exit="exit" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {serviceTypes.map((srv) => (
                              <div key={srv.id} onClick={() => { setFormData({...formData, serviceType: srv.title}); setPostStep(2); }} className={`p-6 rounded-2xl border cursor-pointer transition-all hover:-translate-y-1 ${isDark ? 'bg-white/[0.02] border-white/5 hover:border-white/20' : 'bg-slate-50 border-slate-200'}`}>
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${isDark ? 'bg-white/5 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>
                                  {srv.icon}
                                </div>
                                <h4 className={`text-lg font-bold mb-1 ${textPrimary}`}>{srv.title}</h4>
                                <p className={`text-xs font-medium ${textSecondary}`}>{srv.desc}</p>
                              </div>
                            ))}
                          </motion.div>
                        ) : postStep === 2 ? (
                          <motion.div key="step2" variants={stepVar} initial="hidden" animate="visible" exit="exit" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {equipmentTypes.map((equip) => (
                              <div key={equip.id} onClick={() => { setFormData({...formData, truckType: equip.id}); setPostStep(3); }} className={`p-6 rounded-2xl border cursor-pointer transition-all hover:-translate-y-1 ${isDark ? 'bg-white/[0.02] border-white/5 hover:border-white/20' : 'bg-slate-50 border-slate-200'}`}>
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${isDark ? 'bg-white/5 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>
                                  {equip.icon}
                                </div>
                                <h4 className={`text-lg font-bold mb-1 ${textPrimary}`}>{equip.title}</h4>
                                <p className={`text-xs font-medium ${textSecondary}`}>{equip.desc}</p>
                              </div>
                            ))}
                            <div className="col-span-1 sm:col-span-2 pt-4">
                              <button onClick={() => setPostStep(1)} className="text-xs font-bold text-slate-400 hover:text-indigo-500 uppercase tracking-widest transition-colors"><ArrowLeft size={14} className="inline mr-2"/> {t.backStep}</button>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div key="step3" variants={stepVar} initial="hidden" animate="visible" exit="exit">
                            <form onSubmit={handlePostLoad} className="space-y-5">
                              <div className="flex items-center gap-4 mb-6 p-4 rounded-xl bg-white/5 border border-white/5">
                                <Info size={18} className="text-indigo-500 shrink-0" />
                                <div className="flex-1">
                                  <p className={`text-xs font-bold ${textPrimary}`}>{formData.serviceType}</p>
                                  <p className={`text-[10px] font-medium uppercase tracking-widest mt-1 ${textSecondary}`}>Equipment: <span className="text-indigo-400 font-bold">{formData.truckType}</span></p>
                                </div>
                                <button type="button" onClick={() => setPostStep(2)} className="text-xs font-bold text-indigo-500 uppercase tracking-widest hover:text-indigo-400">Change</button>
                              </div>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                  <label className={`block text-[10px] font-bold mb-1.5 uppercase tracking-widest ${textSecondary}`}>{t.origin}</label>
                                  <input required type="text" placeholder="e.g. Dar es Salaam" value={formData.origin} onChange={e => setFormData({...formData, origin: e.target.value})} className={`w-full p-4 rounded-xl border focus:outline-none text-sm font-medium ${isDark ? 'bg-black/40 border-white/10 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-500'}`} />
                                </div>
                                <div>
                                  <label className={`block text-[10px] font-bold mb-1.5 uppercase tracking-widest ${textSecondary}`}>{t.dest}</label>
                                  <input required type="text" placeholder="e.g. Arusha" value={formData.dest} onChange={e => setFormData({...formData, dest: e.target.value})} className={`w-full p-4 rounded-xl border focus:outline-none text-sm font-medium ${isDark ? 'bg-black/40 border-white/10 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-500'}`} />
                                </div>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                  <label className={`block text-[10px] font-bold mb-1.5 uppercase tracking-widest ${textSecondary}`}>{t.commodity}</label>
                                  <input required type="text" placeholder="e.g. Electronics" value={formData.commodity} onChange={e => setFormData({...formData, commodity: e.target.value})} className={`w-full p-4 rounded-xl border focus:outline-none text-sm font-medium ${isDark ? 'bg-black/40 border-white/10 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-500'}`} />
                                </div>
                                <div>
                                  <label className={`block text-[10px] font-bold mb-1.5 uppercase tracking-widest ${textSecondary}`}>{t.weight}</label>
                                  <input required type="text" placeholder="e.g. 15 Tons" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} className={`w-full p-4 rounded-xl border focus:outline-none text-sm font-medium ${isDark ? 'bg-black/40 border-white/10 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-500'}`} />
                                </div>
                              </div>
                              <div>
                                <label className={`block text-[10px] font-bold mb-1.5 uppercase tracking-widest ${textSecondary}`}>{t.price}</label>
                                <input required type="number" placeholder="Guaranteed Rate (TZS)" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className={`w-full p-4 rounded-xl border focus:outline-none text-lg font-bold text-green-500 ${isDark ? 'bg-black/40 border-white/10 focus:border-green-500' : 'bg-slate-50 border-slate-300 focus:border-green-500'}`} />
                              </div>
                              
                              <div className="pt-4 mt-2 flex gap-4">
                                <button type="button" onClick={() => setPostStep(2)} className={`px-6 py-4 rounded-xl border font-bold text-xs uppercase tracking-widest transition-all ${isDark ? 'border-white/10 bg-white/5 hover:bg-white/10 text-white' : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-900'}`}>
                                  {t.backStep}
                                </button>
                                <button type="submit" className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg active:scale-95 text-xs uppercase tracking-widest transition-all">
                                  {t.submitFreight}
                                </button>
                              </div>
                            </form>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                   </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* DELETE MODAL */}
        <AnimatePresence>
          {deleteModalId && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
               <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} className={`w-full max-w-sm overflow-hidden rounded-3xl border shadow-2xl p-6 sm:p-8 text-center ${isDark ? 'bg-[#080b1a] border-white/10' : 'bg-white border-slate-200'}`}>
                  <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6"><Trash2 size={28} className="text-red-500" /></div>
                  <h3 className={`text-xl font-bold mb-2 ${textPrimary}`}>{t.deleteTitle}</h3>
                  <p className={`text-sm mb-8 ${textSecondary}`}>{t.deleteMsg}</p>
                  <div className="flex items-center gap-4">
                     <button onClick={() => setDeleteModalId(null)} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-colors ${isDark ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'}`}>{t.deny}</button>
                     <button onClick={confirmDeleteLoad} className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-colors shadow-lg">{t.confirm}</button>
                  </div>
               </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* POD REVIEW MODAL (SHIPPER) */}
        <AnimatePresence>
          {podModalUrl && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
               <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} className={`w-full max-w-lg overflow-hidden rounded-3xl border shadow-2xl p-6 sm:p-8 text-center ${isDark ? 'bg-[#080b1a] border-white/10' : 'bg-white border-slate-200'}`}>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className={`text-xl font-bold ${textPrimary}`}>Proof of Delivery</h3>
                    <button onClick={() => setPodModalUrl(null)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><X size={16}/></button>
                  </div>
                  <div className="w-full h-64 bg-black/50 rounded-xl mb-6 overflow-hidden border border-white/10 flex items-center justify-center">
                     <img src={podModalUrl} alt="POD" className="object-contain w-full h-full" />
                  </div>
                  <button onClick={approvePayout} className="w-full py-4 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold uppercase tracking-widest text-xs transition-all shadow-lg shadow-green-500/20 flex justify-center gap-2 active:scale-95">
                    <CheckCircle2 size={16} /> {t.approvePayout}
                  </button>
               </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // ==========================================
  // MAIN DASHBOARD LAYOUT & NAVBAR
  // ==========================================
  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-500 font-sans selection:bg-indigo-500/30 ${bgMainClass}`}>
      
      {/* GLOBAL TOAST NOTIFICATION */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }} className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-full bg-indigo-600 text-white font-bold text-sm shadow-2xl flex items-center gap-3">
            <BellRing size={16} className="animate-bounce" /> {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div animate={{ x: [-10, 10, -10], y: [-10, 10, -10] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className={`absolute top-[-5%] right-[-5%] w-[45vw] h-[45vw] rounded-full blur-[160px] bg-indigo-600 ${isDark ? 'opacity-[0.08]' : 'opacity-[0.05]'}`} />
        <motion.div animate={{ x: [10, -10, 10], y: [10, -10, 10] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className={`absolute bottom-[-5%] left-[-5%] w-[45vw] h-[45vw] rounded-full blur-[160px] bg-orange-600 ${isDark ? 'opacity-[0.06]' : 'opacity-[0.04]'}`} />
        <div className={`absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] ${isDark ? 'opacity-[0.08]' : 'opacity-[0.03]'}`} />
      </div>

      <motion.aside animate={{ width: isLeftSidebarOpen ? 256 : 88 }} transition={{ duration: 0.2, ease: "easeOut" }} className={`hidden lg:flex flex-col z-40 relative backdrop-blur-2xl border-r shrink-0 ${isDark ? 'bg-[#080b1a]/60 border-white/5' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
         <button onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)} className={`absolute -right-3 top-6 w-6 h-6 rounded-full flex items-center justify-center border shadow-sm z-50 transition-colors ${isDark ? 'bg-[#18181b] border-white/20 text-slate-400 hover:text-white' : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'}`}>
           {isLeftSidebarOpen ? <ChevronLeft size={14}/> : <ChevronRight size={14}/>}
         </button>
         <div className={`h-[88px] flex items-center border-b border-inherit shrink-0 overflow-hidden ${!isLeftSidebarOpen ? 'justify-center px-0' : 'px-6'}`}>
            <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-lg ${bgAccent}`}>G</div>
            {isLeftSidebarOpen && <span className={`ml-3 font-bold tracking-tight text-lg whitespace-nowrap ${textPrimary}`}>Geek Logistics</span>}
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
                {profile?.full_name?.charAt(0) || 'U'}
              </div>
              {isLeftSidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold truncate ${textPrimary}`}>{profile?.full_name}</p>
                  <p className={`text-[10px] uppercase font-bold tracking-widest truncate ${textSecondary}`}>{isCargoMode ? t.shipperRole : t.driverRole}</p>
                </div>
              )}
            </div>
         </div>
      </motion.aside>

      <AnimatePresence>
        {isLeftSidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm" onClick={() => setIsLeftSidebarOpen(false)} />
            <motion.aside initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ duration: 0.2, ease: "easeOut" }} className={`fixed inset-y-0 left-0 w-72 flex flex-col z-50 lg:hidden shadow-2xl ${isDark ? 'bg-[#080b1a] border-r border-white/10' : 'bg-white border-r border-slate-200'}`}>
               <div className={`h-[88px] flex items-center justify-between px-6 border-b border-inherit shrink-0`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-sm ${bgAccent}`}><ShieldCheck size={20} /></div>
                    <span className={`font-bold tracking-tight text-xl ${textPrimary}`}>Geek Logistics</span>
                  </div>
                  <button onClick={() => setIsLeftSidebarOpen(false)} className={`p-2 rounded-full ${isDark ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-800'}`}><X size={16}/></button>
               </div>
               <div className="flex-1 py-8 px-6 space-y-3 overflow-y-auto">
                  <div className={`py-4 px-5 rounded-2xl flex items-center gap-4 text-sm font-bold cursor-pointer ${isDark ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'}`}><LayoutDashboard size={20} className="shrink-0" /> {t.overview}</div>
                  <div className={`py-4 px-5 rounded-2xl flex items-center gap-4 text-sm font-semibold cursor-pointer ${isDark ? 'text-slate-400' : 'text-slate-500'}`}><ListTodo size={20} className="shrink-0" /> {t.transactions}</div>
                  <div className={`py-4 px-5 rounded-2xl flex items-center gap-4 text-sm font-semibold cursor-pointer ${isDark ? 'text-slate-400' : 'text-slate-500'}`}><Users size={20} className="shrink-0" /> {t.community}</div>
                  <div className={`py-4 px-5 rounded-2xl flex items-center gap-4 text-sm font-semibold cursor-pointer ${isDark ? 'text-slate-400' : 'text-slate-500'}`}><Settings size={20} className="shrink-0" /> {t.settings}</div>
               </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        
        <header className={`h-[88px] border-b flex items-center justify-between px-5 sm:px-6 lg:px-10 sticky top-0 z-30 transition-colors ${glassNav}`}>
          <div className="flex items-center gap-3 sm:gap-4 lg:hidden">
            <button onClick={() => setIsLeftSidebarOpen(true)} className={`p-2 sm:p-3 rounded-xl border ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}><Menu size={18} /></button>
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold text-white text-base sm:text-lg shadow-sm ${bgAccent}`}><ShieldCheck size={18} /></div>
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
             <button onClick={() => setLang(lang === 'SW' ? 'EN' : 'SW')} className={`flex px-2 sm:px-4 py-2 rounded-xl border text-[10px] sm:text-xs font-bold uppercase transition-colors active:scale-95 ${isDark ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'border-slate-200 bg-white/60 text-slate-700 hover:bg-white'}`}>
               <Globe className="w-3 h-3 sm:w-4 sm:h-4 inline sm:mr-2" /> <span className="hidden sm:inline">{lang}</span><span className="inline sm:hidden ml-1">{lang}</span>
             </button>
             <button onClick={() => setIsDark(!isDark)} className={`p-2.5 sm:p-3 rounded-xl border transition-colors active:scale-95 ${isDark ? 'bg-white/5 border-white/10 text-yellow-400 hover:bg-white/10' : 'bg-white border-slate-200 text-indigo-600 hover:bg-slate-50 shadow-sm'}`}>
               {isDark ? <Sun size={16} /> : <Moon size={16} />}
             </button>
             <button onClick={async () => { await supabase.auth.signOut(); localStorage.clear(); sessionStorage.clear(); router.push('/login'); }} className={`p-2.5 sm:p-3 rounded-xl border transition-colors active:scale-95 ${isDark ? 'bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/20' : 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100 shadow-sm'}`}>
               <LogOut size={16} />
             </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 flex">
          <div className="flex-1 flex flex-col min-w-0">
            <motion.div initial="hidden" animate="visible" variants={containerVar} className="w-full">
              <motion.div variants={itemVar} className="mb-4 sm:mb-6">
                <h1 className={`text-2xl sm:text-4xl font-bold tracking-tight ${textPrimary}`}>
                   {t.welcome} <span className={accentColor}>{profile?.full_name?.split(' ')[0]}</span>.
                </h1>
                <p className={`text-[10px] sm:text-sm mt-1 sm:mt-2 font-medium italic ${textSecondary} max-w-2xl`}>
                  {t.welcomeQuote}
                </p>
              </motion.div>

              {isCargoMode ? <CargoView /> : <DriverView />}

            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}