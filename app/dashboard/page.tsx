"use client";
import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, Globe, Sun, Moon, MapPin, Package, ArrowRight, Truck, Plus, 
  AlertTriangle, CheckCircle2, Wallet, Activity, FileText, X, Loader2,
  ChevronRight, ChevronLeft, Radar, CheckCircle, LayoutDashboard, 
  ListTodo, Settings, Users, Menu, Trash2, ShieldCheck, Check, Snowflake, 
  Box, Circle, FileCheck, Info, Layers, BellRing, UploadCloud, Camera, ArrowLeft,
  BarChart3, RefreshCw, Mail, Phone, CreditCard, Download
} from 'lucide-react';

const translations = {
  EN: {
    shipperRole: 'Cargo Owner', driverRole: 'Transporter',
    welcome: 'Welcome,', welcomeQuote: '"Your secure partner for enterprise freight."',
    marketTitle: 'Live Load Board', marketSub: 'Premium guaranteed loads available for instant booking.',
    acceptBtn: 'Book Load', payout: 'Payout', activeTrip: 'Active Shipment',
    startGPS: 'Go Online (GPS)', stopGPS: 'Go Offline',
    uploadDocs: 'Upload POD', finishTrip: 'Complete Delivery',
    wallet: 'Available Balance', myDocs: 'Document Vault',
    postCargoTitle: 'Create Shipment', activePostings: 'Active Shipments',
    trackFleet: 'Telemetry Command', noActiveTrack: 'You have no active shipments yet.',
    step1: 'Searching Network', step2: 'Carrier Dispatched', step3: 'In Transit', step4: 'Awaiting POD Approval', step5: 'Delivered & Paid',
    viewPOD: 'Review POD & Pay',
    serviceTitle: 'Choose Service Type', serviceSub: 'Select Full Truckload or Less-than-Truckload.',
    equipTitle: 'Choose Equipment', equipSub: 'Select the trailer type needed for your freight.',
    detailsTitle: 'Shipment Details', detailsSub: 'Provide lane details to lock in your rate.',
    origin: 'Pickup Location', dest: 'Dropoff Location', commodity: 'Commodity', truckType: 'Required Equipment',
    weight: 'Weight (Tons)', price: 'Target Payout (TZS)',
    toggleDash: 'Dashboard', overview: 'Overview', transactions: 'Billing', analytics: 'Analytics', community: 'Network', settings: 'Settings',
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
    approvePayout: 'Approve & Release Funds', fatalErrorTitle: 'Account Error', fatalErrorMsg: 'Your profile is missing from the database.'
  },
  SW: {
    shipperRole: 'Mmiliki wa Mzigo', driverRole: 'Msafirishaji',
    welcome: 'Karibu,', welcomeQuote: '"Mshirika wako salama kwa usafirishaji wa uhakika."',
    marketTitle: 'Soko Mubashara la Mizigo', marketSub: 'Mizigo ya uhakika inapatikana sasa kwa uchukuaji wa haraka.',
    acceptBtn: 'Pokea Mzigo', payout: 'Malipo', activeTrip: 'Safari Yako ya Sasa',
    startGPS: 'Washa GPS (Nipo Hewani)', stopGPS: 'Zima GPS',
    uploadDocs: 'Weka Hati (POD)', finishTrip: 'Kamilisha Safari',
    wallet: 'Salio Linalopatikana', myDocs: 'Hifadhi ya Nyaraka',
    postCargoTitle: 'Sajili Mzigo', activePostings: 'Mizigo Yako Sokoni',
    trackFleet: 'Kituo cha Ufuatiliaji', noActiveTrack: 'Huna mizigo inayosafirishwa kwa sasa.',
    step1: 'Inatafuta Wasafirishaji', step2: 'Lori Limepatikana', step3: 'Mzigo Upo Njiani', step4: 'Inasubiri Uhakiki wa POD', step5: 'Imefikishwa & Kulipwa',
    viewPOD: 'Kagua Hati (POD) & Lipa',
    serviceTitle: 'Chagua Aina ya Huduma', serviceSub: 'FTL (Lori Zima) au LTL (Mzigo Mdogo).',
    equipTitle: 'Chagua Aina ya Lori', equipSub: 'Chagua aina ya trela inayohitajika kwa mzigo wako.',
    detailsTitle: 'Taarifa za Mzigo', detailsSub: 'Weka maelezo ya njia ili kufunga bei yako.',
    origin: 'Mahali pa Kuchukua', dest: 'Mahali pa Kushusha', commodity: 'Aina ya Mzigo', truckType: 'Lori Linalohitajika',
    weight: 'Uzito (Tani)', price: 'Malipo Tarajiwa (TZS)',
    toggleDash: 'Dashibodi', overview: 'Muhtasari', transactions: 'Miamala na Malipo', analytics: 'Uchambuzi', community: 'Mtandao', settings: 'Mipangilio',
    clear: 'Funga', routeDetails: 'Taarifa za Njia',
    noLoads: 'Hakuna mizigo mipya sokoni kwa sasa. Kaa tayari!',
    inTransit: 'Ipo Njiani', delivered: 'Imelipwa', pendingApproval: 'Inasubiri Idhini',
    totalSpend: 'Jumla ya Matumizi ya Usafirishaji', selectShipment: 'Chagua mzigo ili kuona ufuatiliaji mubashara.',
    tripTools: 'Zana za Usafirishaji', gpsRadar: 'Hali ya GPS',
    submitFreight: 'Weka Sokoni', registering: 'Inachakata...',
    deleteTitle: 'Ghairi Mzigo', deleteMsg: 'Je, una uhakika unataka kughairi mzigo huu?',
    confirm: 'Ndio, Ghairi', deny: 'Hapana, Acha', gpsError: 'Tafadhali ruhusu simu yako kusoma GPS.',
    nextStep: 'Hatua Inayofuata', backStep: 'Rudi Nyuma',
    newLoadAlert: '🚨 Mzigo Mpya Umewekwa Sokoni!',
    uploadPodTitle: 'Weka Hati ya Makabidhiano (POD)', uploadPodSub: 'Weka picha ya Hati iliyosainiwa ili kuomba malipo.',
    approvePayout: 'Thibitisha & Toa Malipo', fatalErrorTitle: 'Hitilafu ya Akaunti', fatalErrorMsg: 'Akaunti yako haipatikani kwenye kanzidata.'
  }
};

const serviceTypes = [{ id: 'FTL', icon: <Truck size={28} />, title: 'Full truckload (FTL)', desc: 'Best for shipments that fill an entire truck.' }, { id: 'LTL', icon: <Layers size={28} />, title: 'Less-than-truckload (LTL)', desc: 'Best for shipments under 12 pallets.' }];
const equipmentTypes = [{ id: 'Flatbed', icon: <Truck size={24} />, title: 'Flatbed', desc: 'Standard open trailer.' }, { id: 'Dry Van', icon: <Box size={24} />, title: 'Dry Van', desc: 'Enclosed cargo area.' }, { id: 'Tipper', icon: <Truck size={24} />, title: 'Tipper', desc: 'Bulk loose materials.' }, { id: 'Refrigerated', icon: <Snowflake size={24} />, title: 'Refrigerated', desc: 'Temperature controlled.' }];

const transitionEase = "easeInOut" as const;
const containerVar = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVar = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: transitionEase } } };
const stepVar = { hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: transitionEase } }, exit: { opacity: 0, x: -20, transition: { duration: 0.2 } } };
const viewVar = { hidden: { opacity: 0, scale: 0.98 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: transitionEase } }, exit: { opacity: 0, scale: 0.98, transition: { duration: 0.2 } } };

export default function Dashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false); 
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fatalError, setFatalError] = useState<string | null>(null);
  const [lang, setLang] = useState<'SW' | 'EN'>('EN');
  
  // DEFAULT LIGHT THEME
  const [isDark, setIsDark] = useState(false);
  const [currentView, setCurrentView] = useState<'overview'|'transactions'|'analytics'|'community'|'settings'>('overview');
  
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false); 
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false); 
  const watchIdRef = useRef<number | null>(null);

  const bgMainClass = isDark ? 'bg-[#080b1a]' : 'bg-[#f0f4f8]'; 
  const textPrimary = isDark ? "text-white" : "text-slate-900";
  const textSecondary = isDark ? "text-slate-400" : "text-slate-500";
  const glassNav = isDark ? "bg-[#080b1a]/60 border-white/5 backdrop-blur-2xl" : "bg-white/80 border-slate-200/50 backdrop-blur-3xl shadow-sm";
  const glassCard = isDark ? "bg-white/[0.02] border border-white/5 backdrop-blur-2xl shadow-xl rounded-3xl" : "bg-white/90 border border-slate-200/60 backdrop-blur-2xl shadow-xl shadow-slate-200/50 rounded-3xl";
  const innerCard = isDark ? "bg-black/20 border border-white/5 shadow-sm" : "bg-slate-50 border border-slate-100 shadow-sm";

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) setIsRightSidebarOpen(true);
    
    const fetchUser = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) return router.replace('/login');
        const { data, error } = await supabase.from('users').select('*').eq('id', user.id).single();
        if (error || !data) { setFatalError(translations[lang].fatalErrorMsg); setLoading(false); return; }
        setProfile(data); setLoading(false);
      } catch (err) { router.replace('/login'); }
    };
    fetchUser();
  }, [router, lang]);

  const triggerToast = (msg: string) => { setToastMsg(msg); setTimeout(() => setToastMsg(null), 4000); };

  if (!mounted) return <div className="min-h-screen bg-[#f0f4f8]" />; // Light mode hydration shield

  if (fatalError) return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-700 ${bgMainClass}`}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`relative z-10 w-full max-w-sm overflow-hidden rounded-3xl border shadow-2xl p-8 text-center ${isDark ? 'bg-[#111322]/90 border-white/10' : 'bg-white border-slate-200'}`}>
          <AlertTriangle size={28} className="text-red-500 mx-auto mb-6" />
          <h3 className={`text-xl font-bold mb-2 ${textPrimary}`}>{translations[lang].fatalErrorTitle}</h3>
          <p className={`text-sm mb-8 ${textSecondary}`}>{fatalError}</p>
          <button onClick={async () => { await supabase.auth.signOut(); router.replace('/login'); }} className="w-full py-3 rounded-xl bg-red-500 text-white font-bold text-sm shadow-lg active:scale-95">Return to Login</button>
      </motion.div>
    </div>
  );

  if (loading) return <div className={`min-h-screen flex flex-col items-center justify-center ${bgMainClass}`}><Loader2 size={40} className="text-indigo-500 animate-spin" /></div>;

  const t = translations[lang];
  const isCargoMode = profile?.role === 'cargo_owner';
  const accentColor = isCargoMode ? 'text-indigo-500' : 'text-orange-500';
  const bgAccent = isCargoMode ? 'bg-indigo-500' : 'bg-orange-500';

  // ==========================================
  // SUB-VIEWS (Transactions, Analytics, etc.)
  // ==========================================
  const TransactionsView = () => (
    <motion.div variants={viewVar} initial="hidden" animate="visible" exit="exit" className={`p-6 sm:p-8 ${glassCard} mt-6`}>
      <h2 className={`text-2xl font-bold mb-6 ${textPrimary}`}>Billing & Transactions</h2>
      <div className={`p-4 rounded-3xl border ${innerCard}`}>
         <div className="flex items-center justify-between p-5 border-b border-inherit">
           <div><p className={`font-bold ${textPrimary}`}>Load #GL-3891</p><p className={`text-xs mt-1 font-medium ${textSecondary}`}>Paid • Mar 14, 2026</p></div>
           <p className="font-bold text-green-500">TZS 1,200,000</p>
         </div>
         <div className="flex items-center justify-between p-5">
           <div><p className={`font-bold ${textPrimary}`}>Load #GL-3850</p><p className={`text-xs mt-1 font-medium ${textSecondary}`}>Paid • Mar 10, 2026</p></div>
           <p className="font-bold text-green-500">TZS 850,000</p>
         </div>
      </div>
      <button className={`mt-6 px-5 py-3 text-sm font-bold rounded-xl border flex items-center gap-2 transition-colors ${isDark ? 'border-white/10 text-white hover:bg-white/5' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-sm'}`}><Download size={16}/> Download Statements</button>
    </motion.div>
  );

  const AnalyticsView = () => (
    <motion.div variants={viewVar} initial="hidden" animate="visible" exit="exit" className={`p-6 sm:p-8 ${glassCard} mt-6`}>
      <h2 className={`text-2xl font-bold mb-6 ${textPrimary}`}>Performance Analytics</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className={`p-6 rounded-3xl border ${innerCard}`}>
           <h3 className={`text-[10px] font-bold uppercase tracking-widest mb-4 ${textSecondary}`}>Total Volume Moved</h3>
           <p className={`text-4xl font-bold ${textPrimary}`}>120 <span className={`text-sm ${textSecondary}`}>Tons</span></p>
           <p className="text-xs text-green-500 font-bold mt-2">↑ 14% vs last month</p>
        </div>
        <div className={`p-6 rounded-3xl border ${innerCard}`}>
           <h3 className={`text-[10px] font-bold uppercase tracking-widest mb-4 ${textSecondary}`}>Average Transit Time</h3>
           <p className={`text-4xl font-bold ${textPrimary}`}>1.2 <span className={`text-sm ${textSecondary}`}>Days</span></p>
           <p className="text-xs text-green-500 font-bold mt-2">↑ 5% faster</p>
        </div>
      </div>
      <div className={`mt-6 h-64 rounded-3xl border flex items-end justify-between p-6 ${innerCard} items-baseline gap-3`}>
         {[40, 70, 45, 90, 60, 100, 80].map((h, i) => (
           <div key={i} className={`w-full rounded-t-lg transition-all hover:opacity-80 ${isCargoMode ? 'bg-indigo-500' : 'bg-orange-500'}`} style={{ height: `${h}%` }}></div>
         ))}
      </div>
    </motion.div>
  );

  const CommunityView = () => (
    <motion.div variants={viewVar} initial="hidden" animate="visible" exit="exit" className={`p-6 sm:p-8 ${glassCard} mt-6`}>
      <h2 className={`text-2xl font-bold mb-6 ${textPrimary}`}>Geek Network</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className={`p-6 rounded-3xl border text-center ${innerCard}`}>
             <div className="w-20 h-20 rounded-full bg-slate-200 mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-slate-500">D</div>
             <h3 className={`font-bold text-lg ${textPrimary}`}>Driver {i}</h3>
             <p className={`text-xs mt-1.5 font-medium ${textSecondary}`}>⭐⭐⭐⭐⭐ 5.0</p>
             <button className={`mt-5 w-full py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors ${isDark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 shadow-sm'}`}>View Profile</button>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const SettingsView = () => (
    <motion.div variants={viewVar} initial="hidden" animate="visible" exit="exit" className={`p-6 sm:p-8 ${glassCard} mt-6 max-w-2xl mx-auto`}>
      <h2 className={`text-2xl font-bold mb-8 text-center ${textPrimary}`}>Account Settings</h2>
      <div className="space-y-5">
        <div>
          <label className={`block text-[10px] font-bold mb-2 uppercase tracking-widest ${textSecondary}`}>Full Name</label>
          <input type="text" readOnly value={profile?.full_name} className={`w-full p-4 rounded-xl border focus:outline-none text-sm font-bold ${isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'}`} />
        </div>
        <div>
          <label className={`block text-[10px] font-bold mb-2 uppercase tracking-widest ${textSecondary}`}>Email Address</label>
          <input type="email" readOnly value={profile?.email} className={`w-full p-4 rounded-xl border focus:outline-none text-sm font-bold ${isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'}`} />
        </div>
        <div>
          <label className={`block text-[10px] font-bold mb-2 uppercase tracking-widest ${textSecondary}`}>Phone Number</label>
          <input type="text" readOnly value={profile?.phone_number} className={`w-full p-4 rounded-xl border focus:outline-none text-sm font-bold ${isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'}`} />
        </div>
        <button className={`w-full py-4 mt-4 rounded-xl font-bold text-xs uppercase tracking-widest text-white shadow-lg active:scale-95 transition-all ${isCargoMode ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20' : 'bg-orange-600 hover:bg-orange-500 shadow-orange-500/20'}`}>Update Profile</button>
      </div>
    </motion.div>
  );

  // ==========================================
  // DRIVER VIEW 
  // ==========================================
  const DriverView = () => {
    const [activeLoad, setActiveLoad] = useState<any>(null); 
    const [availableLoads, setAvailableLoads] = useState<any[]>([]);
    const [isOnline, setIsOnline] = useState(false);
    const [showPodModal, setShowPodModal] = useState(false);
    const [podFile, setPodFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [showBackhaulModal, setShowBackhaulModal] = useState(false);

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
        }).subscribe();
      return () => { supabase.removeChannel(channel); };
    }, [lang]);

    const handleAcceptLoad = async (load: any) => {
      const { error } = await supabase.from('shipments').update({ driver_id: profile.id, status: 'in_transit' }).eq('id', load.id);
      if (!error) { setActiveLoad({...load, status: 'in_transit'}); setShowBackhaulModal(false); if (window.innerWidth >= 1024) setIsRightSidebarOpen(true); }
    };

    const toggleGPS = async () => {
      if (typeof window === 'undefined' || !navigator?.geolocation) return alert(t.gpsError);
      if (isOnline) {
        setIsOnline(false); if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
      } else {
        setIsOnline(true); triggerToast("GPS Connected. Transmitting.");
        watchIdRef.current = navigator.geolocation.watchPosition(
          async (pos) => { await supabase.from('driver_locations').upsert({ driver_id: profile.id, latitude: pos.coords.latitude, longitude: pos.coords.longitude }); },
          (err) => { alert(t.gpsError); setIsOnline(false); }, { enableHighAccuracy: true }
        );
      }
    };

    const submitPOD = async (e: React.FormEvent) => {
      e.preventDefault(); if (!podFile || !activeLoad) return; setIsUploading(true);
      const path = `${activeLoad.id}-pod.${podFile.name.split('.').pop()}`; 
      const { error: uploadErr } = await supabase.storage.from('shipment_docs').upload(path, podFile);
      if (!uploadErr) {
        const podUrl = supabase.storage.from('shipment_docs').getPublicUrl(path).data.publicUrl;
        const { error: dbError } = await supabase.from('shipments').update({ status: 'pending_approval', pod_url: podUrl }).eq('id', activeLoad.id);
        if (!dbError) { setActiveLoad({...activeLoad, status: 'pending_approval', pod_url: podUrl}); setShowPodModal(false); triggerToast("POD Uploaded. Awaiting Payout."); }
      }
      setIsUploading(false);
    };

    const DriverRightSidebar = () => (
      <div className="w-full lg:w-90 space-y-4 sm:space-y-6 flex flex-col h-full">
         <div className="flex lg:hidden items-center justify-between mb-2 pb-4 border-b border-white/10">
             <h3 className={`text-sm font-bold ${textPrimary}`}>{t.toggleDash}</h3>
             <button onClick={() => setIsRightSidebarOpen(false)} className={`p-2 rounded-full ${isDark ? 'bg-white/10 text-white' : 'bg-slate-200 text-slate-800'}`}><X size={16}/></button>
         </div>
         <div className={`p-6 sm:p-8 flex flex-col justify-between min-h-40 ${glassCard}`}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center justify-center"><Wallet size={18} className="text-green-500" /></div>
              <h3 className={`text-[10px] font-bold uppercase tracking-widest ${textSecondary}`}> {t.wallet} </h3>
            </div>
            <p className={`text-3xl font-bold tracking-tight ${textPrimary}`}>0.00 <span className={`text-[10px] font-medium ${textSecondary}`}>TZS</span></p>
         </div>
         <div className={`p-6 sm:p-8 ${glassCard}`}>
            <h3 className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 mb-4 ${textSecondary}`}><Radar size={14}/> {t.gpsRadar}</h3>
            <div className={`p-8 rounded-3xl border border-dashed text-center flex flex-col items-center justify-center ${isDark ? 'border-white/10 bg-black/20' : 'border-slate-300 bg-white'}`}>
              <button onClick={toggleGPS} className={`w-16 h-16 rounded-full mb-4 flex items-center justify-center transition-all shadow-xl ${isOnline ? 'bg-orange-500 text-white shadow-orange-500/30 animate-pulse' : (isDark ? 'bg-white/10 text-slate-400 hover:bg-white/20' : 'bg-slate-100 border border-slate-200 text-slate-500 hover:bg-slate-200')}`}>
                 <MapPin size={24} />
              </button>
              <p className={`text-xs font-bold uppercase tracking-widest ${isOnline ? 'text-orange-500' : textSecondary}`}>{isOnline ? t.startGPS : t.stopGPS}</p>
            </div>
         </div>
         
         <div className={`p-6 sm:p-8 ${glassCard}`}>
            <h3 className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 mb-4 ${textSecondary}`}><RefreshCw size={14}/> Suggested Backhaul</h3>
            <div className={`p-5 rounded-2xl border ${innerCard}`}>
               <p className={`text-sm font-bold ${textPrimary}`}>Dodoma <ArrowRight size={12} className="inline mx-1 text-orange-500"/> Dar es Salaam</p>
               <p className={`text-[10px] font-bold uppercase tracking-widest mt-2 ${textSecondary}`}>Agricultural • 20 Tons</p>
               <button onClick={() => setShowBackhaulModal(true)} className={`mt-4 w-full py-3 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-colors border shadow-sm ${isDark ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'}`}>View Details</button>
            </div>
         </div>
      </div>
    );

    return (
      <div className="flex w-full relative mt-6">
        <motion.div variants={viewVar} initial="hidden" animate="visible" exit="exit" className="flex-1 min-w-0 space-y-4 sm:space-y-6 transition-all duration-300">
          {!activeLoad ? (
            <div className={`p-6 sm:p-8 ${glassCard}`}>
              <div className="flex items-center justify-between mb-6 sm:mb-8 pb-4 border-b border-inherit">
                <div>
                  <h3 className={`text-xl sm:text-3xl font-bold tracking-tight ${textPrimary}`}>{t.marketTitle}</h3>
                  <p className={`text-xs sm:text-sm mt-1.5 font-medium ${textSecondary}`}>{t.marketSub}</p>
                </div>
                <span className="px-3 py-1.5 bg-orange-500/10 text-orange-500 border border-orange-500/30 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-sm whitespace-nowrap">
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"/> Live
                </span>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {availableLoads.length > 0 ? availableLoads.map((load, i) => (
                  <div key={i} className={`p-5 rounded-3xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:border-orange-500/40 hover:shadow-lg ${innerCard}`}>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`text-[10px] font-bold uppercase tracking-widest text-orange-500 bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-lg shrink-0`}>{load.id.substring(0,8)}</span>
                        <div className={`flex items-center gap-1.5 text-xs font-semibold truncate ${textSecondary}`}>
                          <Package size={12} className="text-orange-500 shrink-0"/> <span className="truncate">{load.commodity} • {load.weight}</span>
                        </div>
                      </div>
                      <div className={`flex items-center gap-3 font-bold text-base sm:text-xl ${textPrimary} flex-wrap`}>
                        {load.origin} <ArrowRight size={16} className={`shrink-0 ${textSecondary}`} /> {load.destination}
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 sm:gap-6 border-t sm:border-none border-inherit pt-4 sm:pt-0 shrink-0">
                      <div className="text-left sm:text-right">
                        <p className={`text-[10px] uppercase font-bold tracking-widest mb-1 ${textSecondary}`}>{t.payout}</p>
                        <p className="text-lg sm:text-2xl font-bold text-green-500 whitespace-nowrap">TZS {load.price.toLocaleString()}</p>
                      </div>
                      <button onClick={() => handleAcceptLoad(load)} className="px-6 py-3.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl text-[10px] sm:text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95 whitespace-nowrap">
                        {t.acceptBtn}
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className={`p-10 sm:p-16 rounded-3xl text-center border border-dashed ${isDark ? 'border-white/10 text-slate-500 bg-black/20' : 'border-slate-300 text-slate-400 bg-white'}`}>
                     <Truck size={32} className="mx-auto mb-4 opacity-50 text-orange-500" />
                     <p className="font-bold text-sm sm:text-base">{t.noLoads}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className={`p-6 sm:p-8 ${glassCard}`}>
              <div className="flex items-center justify-between mb-6 sm:mb-8 border-b border-inherit pb-5">
                 <h3 className="text-xl sm:text-2xl font-bold flex items-center gap-3 text-orange-500"><Truck size={24} /> {t.activeTrip}</h3>
                 <span className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm ${activeLoad.status === 'in_transit' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/30' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/30'}`}>
                   {activeLoad.status === 'in_transit' ? t.inTransit : t.pendingApproval}
                 </span>
              </div>
              <div className={`p-6 sm:p-8 rounded-3xl border mb-6 sm:mb-8 ${innerCard}`}>
                <p className={`text-2xl sm:text-3xl font-bold ${textPrimary} flex-wrap flex items-center`}>
                  {activeLoad.origin} <ArrowRight className="inline mx-3 sm:mx-4 text-orange-500 shrink-0" size={20}/> {activeLoad.destination}
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 mt-4">
                   <p className={`text-sm font-medium ${textSecondary}`}>{activeLoad.commodity} • {activeLoad.weight}</p>
                   <div className={`hidden sm:block w-px h-5 ${isDark ? 'bg-white/10' : 'bg-slate-300'}`} />
                   <p className="text-base sm:text-lg font-bold text-green-500">TZS {activeLoad.price.toLocaleString()}</p>
                </div>
              </div>
              {activeLoad.status === 'in_transit' ? (
                <button onClick={() => setShowPodModal(true)} className="w-full py-4 sm:py-5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white flex items-center justify-center gap-2 transition-all shadow-lg font-bold active:scale-95 text-xs sm:text-sm uppercase tracking-widest">
                    <Camera size={18} /> {t.uploadDocs}
                </button>
              ) : (
                <div className="w-full py-4 sm:py-5 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 flex items-center justify-center gap-3 font-bold text-xs sm:text-sm uppercase tracking-widest">
                    <Loader2 size={18} className="animate-spin" /> Awaiting Escrow Release
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* DRIVER POD MODAL */}
        <AnimatePresence>
          {showPodModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
               <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} className={`w-full max-w-md overflow-hidden rounded-3xl border shadow-2xl p-8 text-center ${isDark ? 'bg-[#080b1a] border-white/10' : 'bg-white border-slate-200'}`}>
                  <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-6"><UploadCloud size={32} className="text-orange-500" /></div>
                  <h3 className={`text-xl font-bold mb-2 ${textPrimary}`}>{t.uploadPodTitle}</h3>
                  <p className={`text-sm mb-6 ${textSecondary}`}>{t.uploadPodSub}</p>
                  <form onSubmit={submitPOD}>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="relative group cursor-pointer mb-8">
                      <input type="file" accept="image/*" required onChange={(e) => {if(e.target.files) setPodFile(e.target.files[0])}} className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer" />
                      <div className={`border-2 border-dashed rounded-3xl p-10 text-center transition-all ${podFile ? 'border-green-500 bg-green-500/10' : isDark ? 'border-white/20 bg-black/40 hover:border-orange-500' : 'border-slate-300 bg-slate-50 hover:border-orange-500'}`}>
                        <div className="text-4xl mb-3">{podFile ? '📄' : '📸'}</div>
                        <p className={`text-xs font-bold uppercase tracking-wider truncate ${podFile ? 'text-green-500' : textSecondary}`}>{podFile ? podFile.name : 'Tap to Upload Image'}</p>
                      </div>
                    </motion.div>
                    <div className="flex items-center gap-4">
                       <button type="button" onClick={() => setShowPodModal(false)} className={`flex-1 py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-colors ${isDark ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'}`}>{t.clear}</button>
                       <button type="submit" disabled={isUploading} className={`flex-1 py-4 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-xs uppercase tracking-widest transition-colors shadow-lg ${isUploading ? 'opacity-70' : ''}`}>
                         {isUploading ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'Submit POD'}
                       </button>
                    </div>
                  </form>
               </motion.div>
            </motion.div>
          )}

          {/* BACKHAUL MODAL */}
          {showBackhaulModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
               <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} className={`w-full max-w-sm rounded-3xl border shadow-2xl p-8 text-center ${isDark ? 'bg-[#080b1a] border-white/10' : 'bg-white border-slate-200'}`}>
                  <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-6"><RefreshCw size={32} className="text-orange-500" /></div>
                  <h3 className={`text-xl font-bold mb-2 ${textPrimary}`}>Suggested Backhaul</h3>
                  <div className={`p-6 rounded-2xl border mt-6 mb-8 ${innerCard}`}>
                     <p className={`text-xl font-bold ${textPrimary}`}>Dodoma <ArrowRight size={16} className="inline mx-2 text-orange-500"/> Dar es Salaam</p>
                     <p className={`text-[10px] font-bold uppercase tracking-widest mt-3 mb-5 ${textSecondary}`}>Agricultural • 20 Tons • Flatbed</p>
                     <p className="text-2xl font-bold text-green-500">TZS 900,000</p>
                  </div>
                  <div className="flex gap-4">
                     <button onClick={() => setShowBackhaulModal(false)} className={`flex-1 py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-colors ${isDark ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'}`}>Cancel</button>
                     <button onClick={() => { setShowBackhaulModal(false); triggerToast("Backhaul Accepted & Routed!"); }} className="flex-1 py-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-widest transition-colors shadow-lg active:scale-95">Accept Load</button>
                  </div>
               </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence initial={false}>
          {isRightSidebarOpen && (
            <motion.div initial={{ width: 0, opacity: 0, marginLeft: 0 }} animate={{ width: 360, opacity: 1, marginLeft: 32 }} exit={{ width: 0, opacity: 0, marginLeft: 0 }} transition={{ duration: 0.2, ease: "easeOut" }} className="hidden lg:flex flex-col shrink-0 overflow-hidden box-content">
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
        <div className={`p-6 sm:p-8 rounded-3xl border ${innerCard} relative`}>
          <div className={`absolute left-11.75 top-12 bottom-12 w-0.5 ${isDark ? 'bg-white/5' : 'bg-slate-200'}`} />
          <div className="space-y-8 relative z-10">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center gap-5">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-[4px] ${isDark ? 'border-[#080b1a]' : 'border-slate-50'} transition-colors ${s.done ? 'bg-indigo-500 text-white' : s.active ? 'bg-indigo-500/20 border-indigo-500 text-indigo-500' : (isDark ? 'bg-white/5 text-slate-600' : 'bg-slate-200 text-slate-400')}`}>
                  {s.done ? <Check size={16} /> : <Circle size={12} className="fill-current" />}
                </div>
                <div>
                  <h4 className={`text-sm font-bold ${s.active ? textPrimary : textSecondary}`}>{s.label}</h4>
                  {s.active && !s.done && i === 0 && <p className="text-xs text-indigo-500 font-bold animate-pulse mt-1">Live matching...</p>}
                  {s.active && !s.done && i === 2 && <p className="text-xs text-indigo-500 font-bold mt-1">Driver pinging GPS...</p>}
                </div>
              </div>
            ))}
          </div>
          <AnimatePresence>
            {status === 'pending_approval' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`mt-8 pt-6 border-t ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                <button onClick={() => setPodModalUrl(activeTrackingLoad.pod_url)} className="w-full py-4 bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/20 text-white rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95">
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
        <div className="w-full lg:w-[380px] space-y-4 sm:space-y-6 flex flex-col h-full">
          <div className="flex lg:hidden items-center justify-between mb-2 pb-4 border-b border-white/10">
             <h3 className={`text-sm font-bold ${textPrimary}`}>{t.toggleDash}</h3>
             <button onClick={() => setIsRightSidebarOpen(false)} className={`p-2 rounded-full ${isDark ? 'bg-white/10 text-white' : 'bg-slate-200 text-slate-800'}`}><X size={16}/></button>
          </div>
          <AnimatePresence mode="wait">
            {activeTrackingLoad ? (
               <motion.div key="tracking" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="space-y-4 sm:space-y-6">
                 <div className={`p-6 sm:p-8 rounded-3xl ${glassCard}`}>
                   <div className="flex items-center justify-between mb-6 pb-4 border-b border-inherit">
                     <span className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 ${textPrimary}`}><Activity size={16} className="text-indigo-500"/> {t.trackFleet}</span>
                     <button onClick={() => setActiveTrackingLoad(null)} className={`text-[9px] font-bold uppercase tracking-widest text-slate-400 hover:text-indigo-500 bg-indigo-500/5 px-3 py-1.5 rounded-lg transition-colors`}>{t.clear}</button>
                   </div>
                   <TelemetryStepper status={activeTrackingLoad.status} />
                   <div className={`mt-6 p-5 sm:p-6 rounded-2xl border ${innerCard}`}>
                     <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${textSecondary}`}>{t.routeDetails}</p>
                     <p className={`text-sm font-bold ${textPrimary}`}>{activeTrackingLoad.origin} <ArrowRight size={12} className="inline mx-2 text-indigo-500"/> {activeTrackingLoad.destination}</p>
                     <p className={`text-[11px] font-medium mt-2 ${textSecondary}`}>{activeTrackingLoad.commodity} • {activeTrackingLoad.weight}</p>
                   </div>
                 </div>
               </motion.div>
            ) : (
               <motion.div key="overview" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }} className="space-y-4 sm:space-y-6">
                <div className={`p-6 sm:p-8 rounded-3xl flex flex-col justify-between min-h-[160px] ${glassCard}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center"><Wallet size={18} className="text-indigo-500" /></div>
                    <h3 className={`text-[10px] font-bold uppercase tracking-widest ${textSecondary}`}>{t.totalSpend}</h3>
                  </div>
                  <p className={`text-3xl font-bold tracking-tight ${textPrimary}`}>0.00 <span className={`text-[10px] font-medium ${textSecondary}`}>TZS</span></p>
                </div>
                <div className={`p-6 sm:p-8 rounded-3xl ${glassCard}`}>
                  <div className="flex items-center justify-between mb-6 border-b border-inherit pb-4">
                    <h3 className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 ${textSecondary}`}><Activity size={16}/> Fleet Summary</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                     <div className={`p-4 rounded-2xl border ${innerCard}`}>
                        <p className={`text-2xl font-bold ${textPrimary}`}>{activeCount}</p>
                        <p className={`text-[9px] font-bold uppercase tracking-widest mt-1.5 ${textSecondary}`}>Active Loads</p>
                     </div>
                     <div className={`p-4 rounded-2xl border ${innerCard}`}>
                        <p className={`text-2xl font-bold ${textPrimary}`}>{completedCount}</p>
                        <p className={`text-[9px] font-bold uppercase tracking-widest mt-1.5 ${textSecondary}`}>Completed</p>
                     </div>
                  </div>
                  <div className={`p-6 rounded-2xl border border-dashed text-center flex flex-col items-center justify-center ${isDark ? 'border-white/10 bg-black/20' : 'border-slate-300 bg-white'}`}>
                    <div className={`w-12 h-12 rounded-full mb-3 flex items-center justify-center ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}><MapPin size={20} className={`opacity-50 ${textSecondary}`} /></div>
                    <p className={`text-[11px] font-medium leading-relaxed ${textSecondary}`}>{t.selectShipment}</p>
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
        <motion.div variants={viewVar} initial="hidden" animate="visible" exit="exit" className="flex-1 min-w-0 space-y-4 sm:space-y-6 transition-all duration-300">
          <div className={`p-6 sm:p-8 ${glassCard}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8 border-b border-inherit pb-5 sm:pb-6">
              <div><h3 className={`text-xl sm:text-3xl font-bold tracking-tight ${textPrimary}`}>{t.activePostings}</h3></div>
              <button onClick={() => setShowWizard(true)} className="px-6 py-3.5 sm:px-8 sm:py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/20 active:scale-95 text-[10px] sm:text-xs uppercase tracking-widest whitespace-nowrap">
                 <Plus size={16} /> {t.postCargoTitle}
              </button>
            </div>
            <div className="space-y-4">
              {postings.length > 0 ? postings.map((post, i) => (
                <div key={i} onClick={() => setActiveTrackingLoad(post)} className={`p-5 sm:p-6 rounded-3xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-5 cursor-pointer hover:border-indigo-500/40 hover:shadow-lg ${innerCard} ${activeTrackingLoad?.id === post.id ? 'ring-2 ring-indigo-500 bg-indigo-500/5' : ''}`}>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3 mb-2.5">
                      <span className="text-[10px] font-bold text-indigo-500 bg-indigo-500/10 px-3 py-1 rounded-lg uppercase tracking-widest border border-indigo-500/30 shrink-0">{post.id.substring(0,8)}</span>
                      <span className={`text-xs font-semibold flex items-center gap-1.5 truncate ${textSecondary}`}><Package size={14} className="shrink-0"/> <span className="truncate">{post.commodity} • {post.weight}</span></span>
                    </div>
                    <h4 className={`text-base sm:text-xl font-bold flex items-center gap-3 ${textPrimary} flex-wrap`}>{post.origin} <ArrowRight size={16} className={`shrink-0 ${textSecondary}`}/> {post.destination}</h4>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-5 border-t sm:border-none border-inherit pt-4 sm:pt-0 shrink-0">
                    <div className="text-left sm:text-right flex flex-col items-start sm:items-end">
                      <p className="text-lg sm:text-2xl font-bold text-green-500 mb-1 whitespace-nowrap">TZS {post.price.toLocaleString()}</p>
                      <span className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 whitespace-nowrap ${post.status === 'pending' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/30' : post.status === 'in_transit' ? 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/30' : post.status === 'pending_approval' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/30' : 'bg-green-500/10 text-green-500 border border-green-500/30'}`}>
                        {post.status === 'pending' ? 'Sokoni' : post.status === 'in_transit' ? t.inTransit : post.status === 'pending_approval' ? t.pendingApproval : t.delivered}
                      </span>
                    </div>
                    {post.status === 'pending' && <button onClick={(e) => { e.stopPropagation(); setDeleteModalId(post.id); }} className={`p-3 rounded-xl transition-colors ${isDark ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}><Trash2 size={18} /></button>}
                  </div>
                </div>
              )) : (
                <div className={`p-12 sm:p-16 rounded-3xl text-center border border-dashed ${isDark ? 'border-white/10 bg-black/20' : 'border-slate-300 bg-white'}`}>
                   <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-indigo-500/10' : 'bg-indigo-50'}`}><Package size={32} className="text-indigo-500" /></div>
                   <p className={`font-bold text-base ${textPrimary}`}>{t.noActiveTrack}</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <AnimatePresence initial={false}>
          {isRightSidebarOpen && (
            <motion.div initial={{ width: 0, opacity: 0, marginLeft: 0 }} animate={{ width: 380, opacity: 1, marginLeft: 32 }} exit={{ width: 0, opacity: 0, marginLeft: 0 }} transition={{ duration: 0.2, ease: "easeOut" }} className="hidden lg:flex flex-col shrink-0 overflow-hidden box-content">
               <CargoRightSidebar />
            </motion.div>
          )}
        </AnimatePresence>

        {/* WIZARD & MODALS */}
        <AnimatePresence>
          {showWizard && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} className={`w-full max-w-3xl overflow-hidden rounded-[2.5rem] border shadow-2xl ${isDark ? 'bg-[#080b1a] border-white/10' : 'bg-white border-slate-200'}`}>
                {postStatus === 'loading' ? (
                   <div className="p-16 text-center flex flex-col items-center justify-center h-[450px]"><Loader2 size={40} className="text-indigo-500 animate-spin mb-6" /><h3 className={`text-2xl font-bold ${textPrimary} mb-2`}>{t.registering}</h3></div>
                ) : postStatus === 'success' ? (
                   <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="p-16 text-center flex flex-col items-center justify-center h-[450px]"><div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-8"><Check size={40} className="text-green-500" /></div><h3 className={`text-3xl font-bold mb-2 ${textPrimary}`}>Imesajiliwa!</h3></motion.div>
                ) : (
                   <>
                    <div className="flex items-center justify-between p-8 border-b border-inherit">
                      <div>
                        <h3 className={`text-2xl font-bold ${textPrimary}`}>{postStep === 1 ? t.serviceTitle : postStep === 2 ? t.equipTitle : t.detailsTitle}</h3>
                        <p className={`text-sm font-medium mt-1.5 ${textSecondary}`}>{postStep === 1 ? t.serviceSub : postStep === 2 ? t.equipSub : t.detailsSub}</p>
                      </div>
                      <button onClick={() => {setShowWizard(false); setPostStep(1);}} className={`w-12 h-12 flex items-center justify-center rounded-full transition-colors ${isDark ? 'bg-white/5 hover:bg-white/10 text-slate-400' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'}`}><X size={20}/></button>
                    </div>
                    <div className="p-8 min-h-[400px]">
                      <AnimatePresence mode="wait">
                        {postStep === 1 ? (
                          <motion.div key="step1" variants={stepVar} initial="hidden" animate="visible" exit="exit" className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {serviceTypes.map((srv) => (
                              <div key={srv.id} onClick={() => { setFormData({...formData, serviceType: srv.title}); setPostStep(2); }} className={`p-8 rounded-3xl border cursor-pointer transition-all hover:-translate-y-1 ${isDark ? 'bg-white/[0.02] border-white/5 hover:border-indigo-500/50' : 'bg-slate-50 border-slate-200 hover:border-indigo-500/50 hover:shadow-lg'}`}>
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 ${isDark ? 'bg-white/5 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>{srv.icon}</div>
                                <h4 className={`text-xl font-bold mb-2 ${textPrimary}`}>{srv.title}</h4>
                                <p className={`text-sm font-medium ${textSecondary}`}>{srv.desc}</p>
                              </div>
                            ))}
                          </motion.div>
                        ) : postStep === 2 ? (
                          <motion.div key="step2" variants={stepVar} initial="hidden" animate="visible" exit="exit" className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {equipmentTypes.map((equip) => (
                              <div key={equip.id} onClick={() => { setFormData({...formData, truckType: equip.id}); setPostStep(3); }} className={`p-6 rounded-3xl border cursor-pointer transition-all hover:-translate-y-1 ${isDark ? 'bg-white/[0.02] border-white/5 hover:border-indigo-500/50' : 'bg-slate-50 border-slate-200 hover:border-indigo-500/50 hover:shadow-lg'}`}>
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${isDark ? 'bg-white/5 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>{equip.icon}</div>
                                <h4 className={`text-lg font-bold mb-1 ${textPrimary}`}>{equip.title}</h4>
                                <p className={`text-xs font-medium ${textSecondary}`}>{equip.desc}</p>
                              </div>
                            ))}
                            <div className="col-span-1 sm:col-span-2 pt-4"><button onClick={() => setPostStep(1)} className="text-xs font-bold text-slate-400 hover:text-indigo-500 uppercase tracking-widest transition-colors"><ArrowLeft size={16} className="inline mr-2"/> {t.backStep}</button></div>
                          </motion.div>
                        ) : (
                          <motion.div key="step3" variants={stepVar} initial="hidden" animate="visible" exit="exit">
                            <form onSubmit={handlePostLoad} className="space-y-6">
                              <div className={`flex items-center gap-5 mb-8 p-5 rounded-2xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-indigo-50/50 border-indigo-100'}`}>
                                <Info size={24} className="text-indigo-500 shrink-0" />
                                <div className="flex-1"><p className={`text-sm font-bold ${textPrimary}`}>{formData.serviceType}</p><p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${textSecondary}`}>Equipment: <span className="text-indigo-500">{formData.truckType}</span></p></div>
                                <button type="button" onClick={() => setPostStep(2)} className="text-xs font-bold text-indigo-500 uppercase tracking-widest hover:text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-500/10 transition-colors">Change</button>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div><label className={`block text-[10px] font-bold mb-2 uppercase tracking-widest ${textSecondary}`}>{t.origin}</label><input required type="text" placeholder="e.g. Dar es Salaam" value={formData.origin} onChange={e => setFormData({...formData, origin: e.target.value})} className={`w-full p-4 rounded-xl border focus:outline-none text-sm font-bold transition-colors ${isDark ? 'bg-black/40 border-white/10 text-white focus:border-indigo-500' : 'bg-white border-slate-200 text-slate-900 focus:border-indigo-500 shadow-sm'}`} /></div>
                                <div><label className={`block text-[10px] font-bold mb-2 uppercase tracking-widest ${textSecondary}`}>{t.dest}</label><input required type="text" placeholder="e.g. Arusha" value={formData.dest} onChange={e => setFormData({...formData, dest: e.target.value})} className={`w-full p-4 rounded-xl border focus:outline-none text-sm font-bold transition-colors ${isDark ? 'bg-black/40 border-white/10 text-white focus:border-indigo-500' : 'bg-white border-slate-200 text-slate-900 focus:border-indigo-500 shadow-sm'}`} /></div>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div><label className={`block text-[10px] font-bold mb-2 uppercase tracking-widest ${textSecondary}`}>{t.commodity}</label><input required type="text" placeholder="e.g. Electronics" value={formData.commodity} onChange={e => setFormData({...formData, commodity: e.target.value})} className={`w-full p-4 rounded-xl border focus:outline-none text-sm font-bold transition-colors ${isDark ? 'bg-black/40 border-white/10 text-white focus:border-indigo-500' : 'bg-white border-slate-200 text-slate-900 focus:border-indigo-500 shadow-sm'}`} /></div>
                                <div><label className={`block text-[10px] font-bold mb-2 uppercase tracking-widest ${textSecondary}`}>{t.weight}</label><input required type="text" placeholder="e.g. 15 Tons" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} className={`w-full p-4 rounded-xl border focus:outline-none text-sm font-bold transition-colors ${isDark ? 'bg-black/40 border-white/10 text-white focus:border-indigo-500' : 'bg-white border-slate-200 text-slate-900 focus:border-indigo-500 shadow-sm'}`} /></div>
                              </div>
                              <div><label className={`block text-[10px] font-bold mb-2 uppercase tracking-widest ${textSecondary}`}>{t.price}</label><input required type="number" placeholder="Guaranteed Rate (TZS)" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className={`w-full p-4 rounded-xl border focus:outline-none text-xl font-bold text-green-500 transition-colors ${isDark ? 'bg-black/40 border-white/10 focus:border-green-500' : 'bg-white border-slate-200 focus:border-green-500 shadow-sm'}`} /></div>
                              <div className="pt-4 mt-4 flex gap-4"><button type="button" onClick={() => setPostStep(2)} className={`px-8 py-4 rounded-xl border font-bold text-xs uppercase tracking-widest transition-all ${isDark ? 'border-white/10 bg-white/5 hover:bg-white/10 text-white' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-900 shadow-sm'}`}>{t.backStep}</button><button type="submit" className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 active:scale-95 text-xs uppercase tracking-widest transition-all">{t.submitFreight}</button></div>
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
          {deleteModalId && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
               <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} className={`w-full max-w-sm overflow-hidden rounded-3xl border shadow-2xl p-8 text-center ${isDark ? 'bg-[#080b1a] border-white/10' : 'bg-white border-slate-200'}`}>
                  <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6"><Trash2 size={32} className="text-red-500" /></div>
                  <h3 className={`text-xl font-bold mb-2 ${textPrimary}`}>{t.deleteTitle}</h3>
                  <p className={`text-sm mb-8 ${textSecondary}`}>{t.deleteMsg}</p>
                  <div className="flex items-center gap-4">
                     <button onClick={() => setDeleteModalId(null)} className={`flex-1 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-colors ${isDark ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'}`}>{t.deny}</button>
                     <button onClick={confirmDeleteLoad} className="flex-1 py-3.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs uppercase tracking-widest transition-colors shadow-lg">{t.confirm}</button>
                  </div>
               </motion.div>
            </motion.div>
          )}
          {podModalUrl && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
               <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} className={`w-full max-w-lg overflow-hidden rounded-3xl border shadow-2xl p-8 text-center ${isDark ? 'bg-[#080b1a] border-white/10' : 'bg-white border-slate-200'}`}>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className={`text-xl font-bold ${textPrimary}`}>Proof of Delivery</h3>
                    <button onClick={() => setPodModalUrl(null)} className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isDark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'}`}><X size={18}/></button>
                  </div>
                  <div className={`w-full h-72 rounded-2xl mb-8 overflow-hidden border flex items-center justify-center ${isDark ? 'bg-black/50 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                     <img src={podModalUrl} alt="POD" className="object-contain w-full h-full" />
                  </div>
                  <button onClick={approvePayout} className="w-full py-4.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold uppercase tracking-widest text-xs transition-all shadow-lg shadow-green-500/20 flex justify-center gap-2 active:scale-95">
                    <CheckCircle2 size={18} /> {t.approvePayout}
                  </button>
               </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const renderMainContent = () => {
    switch(currentView) {
      case 'overview': return isCargoMode ? <CargoView /> : <DriverView />;
      case 'transactions': return <TransactionsView />;
      case 'analytics': return <AnalyticsView />;
      case 'community': return <CommunityView />;
      case 'settings': return <SettingsView />;
      default: return isCargoMode ? <CargoView /> : <DriverView />;
    }
  }

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-500 font-sans selection:bg-indigo-500/30 ${bgMainClass}`}>
      <AnimatePresence>
        {toastMsg && (
          <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }} className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-full bg-indigo-600 text-white font-bold text-sm shadow-2xl flex items-center gap-3">
            <BellRing size={16} className="animate-bounce" /> {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <motion.div animate={{ x: [-10, 10, -10], y: [-10, 10, -10] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className={`absolute top-0 right-0 w-[45vw] h-[45vw] rounded-full blur-[160px] bg-indigo-600 ${isDark ? 'opacity-[0.08]' : 'opacity-[0.04]'}`} />
        <motion.div animate={{ x: [10, -10, 10], y: [10, -10, 10] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className={`absolute bottom-0 left-0 w-[45vw] h-[45vw] rounded-full blur-[160px] bg-orange-600 ${isDark ? 'opacity-[0.06]' : 'opacity-[0.03]'}`} />
      </div>

      {/* LEFT SIDEBAR (DESKTOP) */}
      <motion.aside animate={{ width: isLeftSidebarOpen ? 280 : 96 }} transition={{ duration: 0.3, ease: transitionEase }} className={`hidden lg:flex flex-col z-40 my-4 ml-4 rounded-[2rem] shrink-0 transition-colors border ${isDark ? 'bg-[#080b1a]/60 border-white/5 backdrop-blur-2xl' : 'bg-white/80 border-slate-200/50 backdrop-blur-3xl shadow-xl shadow-slate-200/50'}`}>
         <button onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)} className={`absolute -right-3 top-8 w-7 h-7 rounded-full flex items-center justify-center border shadow-sm z-50 transition-colors ${isDark ? 'bg-[#18181b] border-white/20 text-slate-400 hover:text-white' : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'}`}>
           {isLeftSidebarOpen ? <ChevronLeft size={16}/> : <ChevronRight size={16}/>}
         </button>
         <div className={`h-[96px] flex items-center border-b border-inherit shrink-0 overflow-hidden ${!isLeftSidebarOpen ? 'justify-center px-0' : 'px-8'}`}>
            <div className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center font-bold text-white text-xl shadow-lg ${bgAccent}`}><ShieldCheck size={24}/></div>
            {isLeftSidebarOpen && <span className={`ml-4 font-bold tracking-tight text-xl whitespace-nowrap ${textPrimary}`}>Geek Logistics</span>}
         </div>
         <div className={`flex-1 py-8 space-y-3 overflow-y-auto overflow-x-hidden ${!isLeftSidebarOpen ? 'px-4' : 'px-5'}`}>
            <div onClick={() => setCurrentView('overview')} className={`py-4 rounded-2xl flex items-center cursor-pointer transition-all ${!isLeftSidebarOpen ? 'justify-center' : 'px-5 gap-4'} ${currentView === 'overview' ? (isDark ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm') : (isDark ? 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-transparent')}`}><LayoutDashboard size={20} className="shrink-0" />{isLeftSidebarOpen && <span className="text-sm font-bold whitespace-nowrap">{t.overview}</span>}</div>
            <div onClick={() => setCurrentView('transactions')} className={`py-4 rounded-2xl flex items-center cursor-pointer transition-all ${!isLeftSidebarOpen ? 'justify-center' : 'px-5 gap-4'} ${currentView === 'transactions' ? (isDark ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm') : (isDark ? 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-transparent')}`}><ListTodo size={20} className="shrink-0" />{isLeftSidebarOpen && <span className="text-sm font-bold whitespace-nowrap">{t.transactions}</span>}</div>
            <div onClick={() => setCurrentView('analytics')} className={`py-4 rounded-2xl flex items-center cursor-pointer transition-all ${!isLeftSidebarOpen ? 'justify-center' : 'px-5 gap-4'} ${currentView === 'analytics' ? (isDark ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm') : (isDark ? 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-transparent')}`}><BarChart3 size={20} className="shrink-0" />{isLeftSidebarOpen && <span className="text-sm font-bold whitespace-nowrap">{t.analytics}</span>}</div>
            <div onClick={() => setCurrentView('community')} className={`py-4 rounded-2xl flex items-center cursor-pointer transition-all ${!isLeftSidebarOpen ? 'justify-center' : 'px-5 gap-4'} ${currentView === 'community' ? (isDark ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm') : (isDark ? 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-transparent')}`}><Users size={20} className="shrink-0" />{isLeftSidebarOpen && <span className="text-sm font-bold whitespace-nowrap">{t.community}</span>}</div>
            <div onClick={() => setCurrentView('settings')} className={`py-4 rounded-2xl flex items-center cursor-pointer transition-all ${!isLeftSidebarOpen ? 'justify-center' : 'px-5 gap-4'} ${currentView === 'settings' ? (isDark ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm') : (isDark ? 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-transparent')}`}><Settings size={20} className="shrink-0" />{isLeftSidebarOpen && <span className="text-sm font-bold whitespace-nowrap">{t.settings}</span>}</div>
         </div>
         <div className={`p-6 border-t border-inherit shrink-0 overflow-hidden`}>
            <div className={`flex items-center ${!isLeftSidebarOpen ? 'justify-center' : 'gap-4 px-4 py-3 rounded-2xl'} ${isLeftSidebarOpen && (isDark ? 'bg-white/5 border border-white/5' : 'bg-slate-50 border border-slate-200')}`}>
              <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-sm font-bold ${isDark ? 'bg-white/10 text-white' : 'bg-slate-200 text-slate-800'}`}>
                {profile?.full_name?.charAt(0) || 'U'}
              </div>
              {isLeftSidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold truncate ${textPrimary}`}>{profile?.full_name}</p>
                  <p className={`text-[10px] uppercase font-bold tracking-widest mt-0.5 truncate ${textSecondary}`}>{isCargoMode ? t.shipperRole : t.driverRole}</p>
                </div>
              )}
            </div>
         </div>
      </motion.aside>

      {/* LEFT SIDEBAR (MOBILE) */}
      <AnimatePresence>
        {isLeftSidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm" onClick={() => setIsLeftSidebarOpen(false)} />
            <motion.aside initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ duration: 0.3, ease: "easeOut" }} className={`fixed inset-y-0 left-0 w-80 flex flex-col z-50 lg:hidden shadow-2xl ${isDark ? 'bg-[#080b1a] border-r border-white/10' : 'bg-white border-r border-slate-200'}`}>
               <div className={`h-[96px] flex items-center justify-between px-8 border-b border-inherit shrink-0`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white text-xl shadow-sm ${bgAccent}`}><ShieldCheck size={24} /></div>
                    <span className={`font-bold tracking-tight text-xl ${textPrimary}`}>Geek Logistics</span>
                  </div>
                  <button onClick={() => setIsLeftSidebarOpen(false)} className={`p-2.5 rounded-full ${isDark ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-800'}`}><X size={18}/></button>
               </div>
               <div className="flex-1 py-8 px-6 space-y-4 overflow-y-auto">
                  <div onClick={() => {setCurrentView('overview'); setIsLeftSidebarOpen(false);}} className={`py-4 px-5 rounded-2xl flex items-center gap-4 text-sm font-bold cursor-pointer ${currentView === 'overview' ? (isDark ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-indigo-50 text-indigo-600 border border-indigo-100') : (isDark ? 'text-slate-400' : 'text-slate-500')}`}><LayoutDashboard size={20} className="shrink-0" /> {t.overview}</div>
                  <div onClick={() => {setCurrentView('transactions'); setIsLeftSidebarOpen(false);}} className={`py-4 px-5 rounded-2xl flex items-center gap-4 text-sm font-bold cursor-pointer ${currentView === 'transactions' ? (isDark ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-indigo-50 text-indigo-600 border border-indigo-100') : (isDark ? 'text-slate-400' : 'text-slate-500')}`}><ListTodo size={20} className="shrink-0" /> {t.transactions}</div>
                  <div onClick={() => {setCurrentView('analytics'); setIsLeftSidebarOpen(false);}} className={`py-4 px-5 rounded-2xl flex items-center gap-4 text-sm font-bold cursor-pointer ${currentView === 'analytics' ? (isDark ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-indigo-50 text-indigo-600 border border-indigo-100') : (isDark ? 'text-slate-400' : 'text-slate-500')}`}><BarChart3 size={20} className="shrink-0" /> {t.analytics}</div>
                  <div onClick={() => {setCurrentView('community'); setIsLeftSidebarOpen(false);}} className={`py-4 px-5 rounded-2xl flex items-center gap-4 text-sm font-bold cursor-pointer ${currentView === 'community' ? (isDark ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-indigo-50 text-indigo-600 border border-indigo-100') : (isDark ? 'text-slate-400' : 'text-slate-500')}`}><Users size={20} className="shrink-0" /> {t.community}</div>
                  <div onClick={() => {setCurrentView('settings'); setIsLeftSidebarOpen(false);}} className={`py-4 px-5 rounded-2xl flex items-center gap-4 text-sm font-bold cursor-pointer ${currentView === 'settings' ? (isDark ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-indigo-50 text-indigo-600 border border-indigo-100') : (isDark ? 'text-slate-400' : 'text-slate-500')}`}><Settings size={20} className="shrink-0" /> {t.settings}</div>
               </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        
        {/* FLOATING TOP NAVIGATION */}
        <header className={`h-[88px] mx-4 mt-4 lg:ml-6 mr-4 rounded-[2rem] border flex items-center justify-between px-6 lg:px-8 z-30 transition-colors ${glassNav}`}>
          <div className="flex items-center gap-4 lg:hidden">
            <button onClick={() => setIsLeftSidebarOpen(true)} className={`p-3 rounded-xl border ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'}`}><Menu size={18} /></button>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-sm ${bgAccent}`}><ShieldCheck size={20} /></div>
          </div>
          <div className="hidden lg:block">
             <h2 className={`text-xs font-bold uppercase tracking-widest ${textSecondary}`}>Geek Command Center</h2>
          </div>
          
          <div className="flex items-center gap-3 lg:gap-5 ml-auto">
             <button onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)} className={`hidden lg:flex px-5 py-3 rounded-xl border text-[10px] font-bold tracking-widest uppercase transition-colors active:scale-95 ${isDark ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10' : 'bg-white border-slate-200/50 text-slate-700 hover:bg-slate-50 shadow-sm'}`}>
               {isRightSidebarOpen ? <ChevronRight size={14} className="mr-2"/> : <ChevronLeft size={14} className="mr-2"/>}
               <span className="hidden sm:inline">{t.toggleDash}</span>
             </button>
             <div className={`hidden sm:block w-px h-8 mx-2 ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />
             <button onClick={() => setLang(lang === 'SW' ? 'EN' : 'SW')} className={`flex px-3 sm:px-5 py-3 rounded-xl border text-[10px] sm:text-xs font-bold uppercase transition-colors active:scale-95 ${isDark ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'border-slate-200/50 bg-white/60 text-slate-700 hover:bg-white shadow-sm'}`}>
               <Globe className="w-3 h-3 sm:w-4 sm:h-4 inline sm:mr-2" /> <span className="hidden sm:inline">{lang}</span><span className="inline sm:hidden ml-1">{lang}</span>
             </button>
             <button onClick={() => setIsDark(!isDark)} className={`p-3 rounded-xl border transition-colors active:scale-95 ${isDark ? 'bg-white/5 border-white/10 text-yellow-400 hover:bg-white/10' : 'bg-white border-slate-200/50 text-indigo-600 hover:bg-slate-50 shadow-sm'}`}>
               {isDark ? <Sun size={18} /> : <Moon size={18} />}
             </button>
             <button onClick={async () => { await supabase.auth.signOut(); localStorage.clear(); sessionStorage.clear(); router.push('/login'); }} className={`p-3 rounded-xl border transition-colors active:scale-95 ${isDark ? 'bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/20' : 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100 shadow-sm'}`}>
               <LogOut size={18} />
             </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 flex">
          <div className="flex-1 flex flex-col min-w-0 max-w-[1500px] mx-auto">
            <motion.div initial="hidden" animate="visible" variants={containerVar} className="w-full">
              <motion.div variants={itemVar} className="mb-6 sm:mb-8 px-2">
                <h1 className={`text-3xl sm:text-4xl font-bold tracking-tight ${textPrimary}`}>
                   {t.welcome} <span className={accentColor}>{profile?.full_name?.split(' ')[0]}</span>.
                </h1>
                <p className={`text-xs sm:text-sm mt-2 font-medium italic ${textSecondary} max-w-2xl`}>
                  {t.welcomeQuote}
                </p>
              </motion.div>

              <AnimatePresence mode="wait">
                {renderMainContent()}
              </AnimatePresence>

            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}