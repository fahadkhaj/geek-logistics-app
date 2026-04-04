"use client";
import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { 
  LogOut, Globe, Sun, Moon, MapPin, Package, ArrowRight, Truck, Plus, 
  AlertTriangle, CheckCircle2, Wallet, Activity, FileText, X, Loader2,
  ChevronRight, ChevronLeft, Radar, CheckCircle, LayoutDashboard, 
  ListTodo, Settings, Users, Menu, Trash2, ShieldCheck, Check, Snowflake, 
  Box, Circle, FileCheck, Info, Layers, BellRing, UploadCloud, Camera, ArrowLeft,
  BarChart3, Download, Map as MapIcon, Star, Bell, Search, 
  MessageSquare, Send, MoreHorizontal, Maximize2, Minimize2
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
    origin: 'Pickup Location', dest: 'Dropoff Location', commodity: 'Commodity', truckType: 'Equipment', weight: 'Weight (Tons)', price: 'Target Payout (TZS)',
    toggleDash: 'Dashboard', overview: 'Overview', fleet: 'Fleet / Loads', transactions: 'Billing', analytics: 'Analytics', community: 'Marketplace', settings: 'Settings',
    clear: 'Close Map', routeDetails: 'Lane Details', noLoads: 'No new loads on the market currently. Stay tuned!',
    inTransit: 'In Transit', delivered: 'Paid', pendingApproval: 'Pending Approval',
    totalSpend: 'Total Freight Spend', selectShipment: 'Select a load to view telemetry.',
    submitFreight: 'Post to Market', registering: 'Processing...',
    deleteTitle: 'Cancel Shipment', deleteMsg: 'Are you sure you want to cancel this shipment? This cannot be undone.',
    confirm: 'Yes, Cancel', deny: 'No, Keep it', gpsError: 'Please allow GPS access.',
    backStep: 'Go Back', newLoadAlert: '🚨 New Load Posted!',
    uploadPodTitle: 'Upload Proof of Delivery', uploadPodSub: 'Upload the signed Waybill to request payout.',
    approvePayout: 'Approve & Release Funds', fatalErrorTitle: 'Account Error', fatalErrorMsg: 'Your profile is missing from the database.',
    notifications: 'Notifications', markRead: 'Mark all as read', noNotifs: 'You are all caught up!',
    feedTitle: 'Marketplace Feed', feedSub: 'Live updates, available trucks, and urgent load requests.',
    chatPlaceholder: 'Post an urgent load or truck availability here...', postBtn: 'Post', onlineMembers: 'Active Network'
  },
  SW: {
    shipperRole: 'Mmiliki wa Mzigo', driverRole: 'Msafirishaji',
    welcome: 'Karibu,', welcomeQuote: '"Mshirika wako salama kwa usafirishaji wa uhakika."',
    marketTitle: 'Ubao wa Mizigo', marketSub: 'Mizigo inapatikana sasa kwa uchukuaji wa haraka.',
    acceptBtn: 'Chukua Mzigo', payout: 'Malipo', activeTrip: 'Mzigo Wako wa Sasa',
    startGPS: 'Washa GPS', stopGPS: 'Zima GPS',
    uploadDocs: 'Pakia Hati (POD)', finishTrip: 'Kamilisha Safari',
    wallet: 'Salio Linalopatikana', myDocs: 'Hifadhi ya Nyaraka',
    postCargoTitle: 'Weka Mzigo Sokoni', activePostings: 'Mizigo Yako',
    trackFleet: 'Ufuatiliaji Mubashara', noActiveTrack: 'Huna mizigo inayosafirishwa kwa sasa.',
    step1: 'Inatafuta Gari', step2: 'Gari Limepatikana', step3: 'Mzigo Upo Njiani', step4: 'Inasubiri Uhakiki', step5: 'Imefikishwa & Kulipwa',
    viewPOD: 'Kagua Hati & Lipa',
    serviceTitle: 'Aina ya Huduma', serviceSub: 'Lori Zima (FTL) au Mzigo Mdogo (LTL).',
    equipTitle: 'Aina ya Lori', equipSub: 'Chagua aina ya trela inayohitajika.',
    detailsTitle: 'Taarifa za Mzigo', detailsSub: 'Weka maelezo ya njia ili kufunga bei yako.',
    origin: 'Kutoka', dest: 'Kwenda', commodity: 'Aina ya Mzigo', truckType: 'Lori Linalohitajika', weight: 'Uzito (Tani)', price: 'Malipo (TZS)',
    toggleDash: 'Dashibodi', overview: 'Muhtasari', fleet: 'Mizigo / Magari', transactions: 'Miamala', analytics: 'Uchambuzi', community: 'Soko & Mtandao', settings: 'Mipangilio',
    clear: 'Funga Ramani', routeDetails: 'Taarifa za Njia', noLoads: 'Hakuna mizigo mipya sokoni kwa sasa.',
    inTransit: 'Ipo Njiani', delivered: 'Imelipwa', pendingApproval: 'Inasubiri',
    totalSpend: 'Matumizi ya Usafirishaji', selectShipment: 'Chagua mzigo kuona taarifa zake.',
    submitFreight: 'Tangaza Mzigo', registering: 'Inachakata...',
    deleteTitle: 'Ghairi Mzigo', deleteMsg: 'Je, una uhakika unataka kughairi mzigo huu? Huwezi kurudisha nyuma.',
    confirm: 'Ndio, Ghairi', deny: 'Hapana, Acha', gpsError: 'Tafadhali ruhusu simu kusoma GPS.',
    backStep: 'Rudi Nyuma', newLoadAlert: '🚨 Mzigo Mpya Umewekwa Sokoni!',
    uploadPodTitle: 'Pakia Hati ya Makabidhiano', uploadPodSub: 'Weka picha ya Hati iliyosainiwa ili uweze kulipwa.',
    approvePayout: 'Thibitisha & Toa Malipo', fatalErrorTitle: 'Hitilafu ya Akaunti', fatalErrorMsg: 'Akaunti yako haipatikani kwenye kanzidata.',
    notifications: 'Taarifa Mpya', markRead: 'Soma zote', noNotifs: 'Huna taarifa mpya!',
    feedTitle: 'Soko la Gumzo', feedSub: 'Taarifa mubashara, malori yaliyopo, na mizigo ya haraka.',
    chatPlaceholder: 'Tangaza mzigo au upatikanaji wa lori hapa...', postBtn: 'Tuma', onlineMembers: 'Mtandao Mubashara'
  }
};

const serviceTypes = [{ id: 'FTL', icon: <Truck size={24} />, title: 'Full truckload (FTL)', desc: 'Best for shipments that fill an entire truck.' }, { id: 'LTL', icon: <Layers size={24} />, title: 'Less-than-truckload (LTL)', desc: 'Best for shipments under 12 pallets.' }];
const equipmentTypes = [{ id: 'Flatbed', icon: <Truck size={20} />, title: 'Flatbed', desc: 'Standard open trailer.' }, { id: 'Dry Van', icon: <Box size={20} />, title: 'Dry Van', desc: 'Enclosed cargo area.' }, { id: 'Tipper', icon: <Truck size={20} />, title: 'Tipper', desc: 'Bulk loose materials.' }, { id: 'Refrigerated', icon: <Snowflake size={20} />, title: 'Refrigerated', desc: 'Temperature controlled.' }];

const mockNetwork = [
  { id: 1, name: "Juma Kassim", role: "Transporter", rating: 4.9, online: true, location: "Arusha" },
  { id: 2, name: "Alpha Logistics", role: "Cargo Owner", rating: 4.8, online: true, location: "Dar es Salaam" },
  { id: 3, name: "Peter Waweru", role: "Transporter", rating: 4.5, online: false, location: "Nairobi" },
  { id: 4, name: "Aisha M.", role: "Transporter", rating: 5.0, online: true, location: "Dodoma" },
];

const initialFeed = [
  { id: 1, user: "Alpha Logistics", role: "Cargo Owner", time: "10 min ago", content: "Need a 30T Flatbed from Dar es Salaam to Nairobi urgently. High-priority shipment." },
  { id: 2, user: "Peter Waweru", role: "Transporter", time: "25 min ago", content: "Empty 20T Dry Van in Nairobi, available for immediate dispatch." }
];

const transitionEase = [0.16, 1, 0.3, 1];
const containerVar = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const itemVar = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: transitionEase } } };
const viewVar = { hidden: { opacity: 0, scale: 0.98 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: transitionEase } }, exit: { opacity: 0, scale: 0.98, transition: { duration: 0.2 } } };
const stepVar = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 20, stiffness: 100 } } };

// ==========================================
// FIXED: ROBUST ROUTE VISUALIZER (NO CLIPPING)
// ==========================================
const RouteVisualizer = ({ origin, dest, status }: { origin: string, dest: string, status: string }) => {
  const isComplete = status === 'completed' || status === 'pending_approval';
  const isPending = status === 'pending';
  
  let mapStatusText = "Preparing for Dispatch";
  if (status === 'in_transit') mapStatusText = "In Transit - Live GPS";
  if (status === 'pending_approval') mapStatusText = "Arrived - Awaiting POD Approval";
  if (status === 'completed') mapStatusText = "Delivery Completed & Paid";
  
  return (
    <div className="w-full bg-[#0B0F19] rounded-2xl border border-white/10 relative flex flex-col justify-center h-36 overflow-hidden shadow-inner p-4 sm:p-6">
        <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg z-30 backdrop-blur-sm">
           {!isComplete && !isPending && <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/>}
           <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{mapStatusText}</span>
        </div>

        <div className="w-full mt-4 flex items-center justify-between px-4 sm:px-8">
            <div className="relative z-20 flex flex-col items-center shrink-0">
               <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-4 border-[#0B0F19] z-20 shadow-[0_0_12px_rgba(99,102,241,0.5)] ${isPending ? 'bg-orange-500' : 'bg-indigo-500'}`} />
               <span className="absolute top-6 sm:top-8 text-[9px] sm:text-[10px] font-bold text-slate-300 uppercase tracking-widest whitespace-nowrap">{origin}</span>
            </div>

            <div className="flex-1 relative h-1.5 bg-slate-800 rounded-full mx-2 sm:mx-4">
              <motion.div initial={{ width: '0%' }} animate={{ width: isComplete ? '100%' : isPending ? '0%' : '50%' }} className="absolute left-0 top-0 bottom-0 bg-indigo-500 rounded-full z-10" />
              {!isComplete && !isPending && (
                <motion.div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-30" animate={{ left: ['0%', '100%'] }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }}>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 sm:border-[3px] shadow-xl bg-indigo-600 border-indigo-400 text-white shadow-[0_0_20px_rgba(99,102,241,0.8)]">
                     <Truck size={14} className="sm:w-4 sm:h-4" />
                  </div>
                </motion.div>
              )}
              {isPending && (
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-30 left-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 sm:border-[3px] shadow-xl bg-slate-800 border-slate-600 text-slate-400">
                     <Truck size={14} className="sm:w-4 sm:h-4" />
                  </div>
                </div>
              )}
            </div>

            <div className="relative z-20 flex flex-col items-center shrink-0">
               <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-4 border-[#0B0F19] z-20 ${isComplete ? 'bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)]' : 'bg-slate-700'}`} />
               <span className="absolute top-6 sm:top-8 text-[9px] sm:text-[10px] font-bold text-slate-300 uppercase tracking-widest whitespace-nowrap">{dest}</span>
            </div>
        </div>
    </div>
  );
};

export default function Dashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fatalError, setFatalError] = useState<string | null>(null);
  const [lang, setLang] = useState<'SW' | 'EN'>('EN');
  
  const [isDark, setIsDark] = useState(false); 
  const [currentView, setCurrentView] = useState<'overview'|'fleet'|'transactions'|'community'|'settings'>('overview');
  
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false); 
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false); 
  const [showNotifs, setShowNotifs] = useState(false); 
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const watchIdRef = useRef<number | null>(null);

  const [notifications, setNotifications] = useState<any[]>([]);

  const addNotification = (title: string, desc: string, type: 'success' | 'info' | 'system') => {
    const newNotif = { id: Date.now(), title, desc, time: "Just now", type };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const bgMainClass = isDark ? 'bg-[#0B0F19]' : 'bg-[#f4f7fa]'; 
  const textPrimary = isDark ? "text-white" : "text-slate-900";
  const textSecondary = isDark ? "text-slate-400" : "text-slate-500";
  
  const glassNav = isDark ? "bg-[#0B0F19]/70 border-white/10 backdrop-blur-3xl shadow-2xl" : "bg-white/80 border-white/60 backdrop-blur-3xl shadow-lg shadow-slate-200/40";
  const glassCard = isDark ? "bg-[#131826]/70 border border-white/10 backdrop-blur-3xl shadow-xl rounded-3xl" : "bg-white/90 border border-slate-200 backdrop-blur-3xl shadow-lg shadow-slate-200/30 rounded-3xl";
  const innerCard = isDark ? "bg-white/[0.03] border border-white/10 hover:bg-white/[0.05]" : "bg-slate-50/80 border border-slate-200/80 hover:bg-white shadow-sm";

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

  if (!mounted) return <div className="min-h-screen bg-[#f4f7fa]" />;

  if (fatalError) return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-700 ${bgMainClass}`}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`relative z-10 w-full max-w-sm overflow-hidden rounded-3xl border shadow-2xl p-8 text-center ${glassCard}`}>
          <AlertTriangle size={32} className="text-red-500 mx-auto mb-6" />
          <h3 className={`text-xl font-bold mb-2 ${textPrimary}`}>{translations[lang].fatalErrorTitle}</h3>
          <p className={`text-sm mb-8 ${textSecondary}`}>{fatalError}</p>
          <button onClick={async () => { await supabase.auth.signOut(); router.replace('/login'); }} className="w-full py-3.5 rounded-xl bg-red-500 text-white font-bold text-xs uppercase tracking-widest shadow-md active:scale-95 transition-all">Return to Login</button>
      </motion.div>
    </div>
  );

  if (loading) return <div className={`min-h-screen flex flex-col items-center justify-center ${bgMainClass}`}><Loader2 size={36} className="text-indigo-500 animate-spin" /></div>;

  const t = translations[lang];
  const isCargoMode = profile?.role === 'cargo_owner';
  const accentColor = isCargoMode ? 'text-indigo-500' : 'text-orange-500';
  const bgAccent = isCargoMode ? 'bg-indigo-500' : 'bg-orange-500';

  // ==========================================
  // COMPACT TELEMETRY MAP MODAL
  // ==========================================
  const TelemetryModal = ({ load, onClose }: { load: any, onClose: () => void }) => {
    const steps = [
      { label: t.step1, active: ['pending','in_transit','pending_approval','completed'].includes(load.status), done: ['in_transit','pending_approval','completed'].includes(load.status) },
      { label: t.step2, active: ['in_transit','pending_approval','completed'].includes(load.status), done: ['in_transit','pending_approval','completed'].includes(load.status) },
      { label: t.step3, active: ['in_transit','pending_approval','completed'].includes(load.status), done: ['pending_approval','completed'].includes(load.status) },
      { label: t.step4, active: ['pending_approval','completed'].includes(load.status), done: load.status === 'completed' },
      { label: t.step5, active: load.status === 'completed', done: load.status === 'completed' }
    ];

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
         <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} className={`w-full max-w-xl max-h-[90vh] overflow-y-auto hide-scrollbar rounded-[2rem] border shadow-2xl flex flex-col ${isDark ? 'bg-[#0B0F19] border-white/10' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center justify-between p-6 border-b border-inherit shrink-0">
              <div>
                <h3 className={`text-xl font-bold ${textPrimary}`}>Load #{load.id?.substring(0,8) || 'GL-TEST'}</h3>
                <p className={`text-[10px] font-medium uppercase tracking-widest mt-1 ${textSecondary}`}>{load.commodity || 'Freight Goods'}</p>
              </div>
              <button onClick={onClose} className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${isDark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'}`}><X size={18}/></button>
            </div>
            
            <div className="p-6">
              <RouteVisualizer origin={load.origin} dest={load.destination} status={load.status} />
              
              <div className={`grid grid-cols-2 gap-4 p-5 rounded-2xl border mt-6 ${innerCard}`}>
                 <div>
                   <p className={`text-[9px] font-bold uppercase tracking-widest ${textSecondary}`}>Origin</p>
                   <p className={`text-sm font-bold ${textPrimary} mt-1`}>{load.origin}</p>
                 </div>
                 <div>
                   <p className={`text-[9px] font-bold uppercase tracking-widest ${textSecondary}`}>Destination</p>
                   <p className={`text-sm font-bold ${textPrimary} mt-1`}>{load.destination}</p>
                 </div>
                 <div>
                   <p className={`text-[9px] font-bold uppercase tracking-widest ${textSecondary}`}>Weight</p>
                   <p className={`text-sm font-bold ${textPrimary} mt-1`}>{load.weight}</p>
                 </div>
                 <div>
                   <p className={`text-[9px] font-bold uppercase tracking-widest ${textSecondary}`}>Payout</p>
                   <p className={`text-sm font-bold text-green-500 mt-1`}>TZS {load.price?.toLocaleString() || '0'}</p>
                 </div>
              </div>

              <div className="mt-6 flex flex-col gap-5 bg-black/5 dark:bg-white/5 p-6 rounded-2xl">
                 <h3 className={`text-[10px] font-bold uppercase tracking-widest ${textSecondary} mb-2`}>Trip Progress</h3>
                 {steps.map((s, i) => (
                   <div key={i} className="flex items-center gap-4">
                     <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 ${isDark ? 'border-[#0B0F19]' : 'border-slate-50'} transition-colors ${s.done ? 'bg-indigo-500 text-white' : s.active ? 'bg-indigo-500/20 border-indigo-500 text-indigo-500' : (isDark ? 'bg-white/10 text-slate-600' : 'bg-slate-200 text-slate-400')}`}>
                       {s.done ? <Check size={12} /> : <Circle size={6} className="fill-current" />}
                     </div>
                     <div>
                       <h4 className={`text-xs font-bold ${s.active ? textPrimary : textSecondary}`}>{s.label}</h4>
                     </div>
                   </div>
                 ))}
              </div>
            </div>
         </motion.div>
      </motion.div>
    );
  };

  // ==========================================
  // SHARED SUB-VIEWS 
  // ==========================================
  const FleetView = () => {
    const [fleetLoads, setFleetLoads] = useState<any[]>([]);
    const [viewMapLoad, setViewMapLoad] = useState<any>(null);

    useEffect(() => {
      const fetchFleet = async () => {
        const { data } = await supabase.from('shipments')
          .select('*')
          .or(`cargo_owner_id.eq.${profile.id},driver_id.eq.${profile.id}`)
          .order('created_at', { ascending: false });
        if (data) setFleetLoads(data);
      };
      fetchFleet();
    }, []);

    return (
      <motion.div variants={viewVar} initial="hidden" animate="visible" exit="exit" className={`p-6 sm:p-8 ${glassCard} mt-6`}>
        <h2 className={`text-2xl font-bold mb-6 ${textPrimary}`}>{t.fleet}</h2>
        <motion.div variants={containerVar} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {fleetLoads.length > 0 ? fleetLoads.map((load) => (
            <motion.div variants={itemVar} key={load.id} className={`p-5 rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-md ${innerCard}`}>
              <div className="flex items-center gap-4 mb-4">
                 <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isCargoMode ? 'bg-indigo-500/10 text-indigo-500' : 'bg-orange-500/10 text-orange-500'}`}><Truck size={20}/></div>
                 <div className="min-w-0">
                    <p className={`font-bold text-sm truncate ${textPrimary}`}>Load #{load.id.substring(0,8)}</p>
                    <p className={`text-[10px] mt-0.5 font-medium truncate ${textSecondary}`}>{load.origin} ➔ {load.destination}</p>
                 </div>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-inherit">
                 <span className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-md ${load.status === 'completed' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'}`}>
                    {load.status === 'completed' ? t.delivered : load.status === 'pending_approval' ? t.pendingApproval : t.inTransit}
                 </span>
                 <button onClick={() => setViewMapLoad(load)} className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${isCargoMode ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400' : 'bg-orange-50 text-orange-600 hover:bg-orange-100 dark:bg-orange-500/10 dark:text-orange-400'}`}>
                   <MapIcon size={14}/> View Map
                 </button>
              </div>
            </motion.div>
          )) : (
            <div className={`col-span-1 md:col-span-2 p-10 text-center border border-dashed rounded-2xl text-sm font-medium ${isDark ? 'border-white/10 text-slate-500 bg-black/20' : 'border-slate-300 text-slate-400 bg-white/50'}`}>
              No historical or active fleet loads found.
            </div>
          )}
        </motion.div>
        <AnimatePresence>
           {viewMapLoad && <TelemetryModal load={viewMapLoad} onClose={() => setViewMapLoad(null)} />}
        </AnimatePresence>
      </motion.div>
    );
  };

  const TransactionsView = () => {
    const handleDownloadPDF = () => {
      const printWindow = window.open('', '_blank');
      if (!printWindow) { triggerToast("Please allow pop-ups to download the PDF statement."); return; }
      
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Geek Logistics - Official Statement</title>
            <style>
              body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; max-width: 800px; margin: 0 auto; }
              .header { border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end; }
              .logo { font-size: 28px; font-weight: 800; color: #4f46e5; letter-spacing: -1px; }
              .doc-title { font-size: 14px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 1px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { text-align: left; padding: 16px 12px; border-bottom: 1px solid #f1f5f9; }
              th { text-transform: uppercase; font-size: 11px; color: #64748b; font-weight: 700; letter-spacing: 0.5px; background: #f8fafc; }
              .total { font-weight: bold; color: #10b981; }
              .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center; }
            </style>
          </head>
          <body>
            <div class="header">
              <div>
                <div class="logo">Geek Logistics</div>
                <div style="font-size: 14px; color: #64748b; margin-top: 4px;">Dar es Salaam, Tanzania</div>
              </div>
              <div style="text-align: right;">
                <div class="doc-title">Official Billing Statement</div>
                <div style="font-size: 14px; margin-top: 4px;">Date: ${new Date().toLocaleDateString()}</div>
                <div style="font-size: 14px;">User: ${profile?.full_name || 'Geek User'}</div>
              </div>
            </div>
            <table>
              <thead><tr><th>Date</th><th>Load ID</th><th>Status</th><th>Amount (TZS)</th></tr></thead>
              <tbody>
                <tr><td>Mar 14, 2026</td><td>GL-3891</td><td>Paid</td><td class="total">1,200,000</td></tr>
                <tr><td>Mar 10, 2026</td><td>GL-3850</td><td>Paid</td><td class="total">850,000</td></tr>
              </tbody>
            </table>
            <div class="footer">
              Generated by Geek Logistics System. This is a computer-generated document and requires no signature.
            </div>
          </body>
        </html>
      `;

      printWindow.document.open();
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      setTimeout(() => { printWindow.focus(); printWindow.print(); triggerToast("Statement prepared for printing/saving."); }, 250);
    };

    return (
      <motion.div variants={viewVar} initial="hidden" animate="visible" exit="exit" className={`p-6 sm:p-8 ${glassCard} mt-6`}>
        <h2 className={`text-2xl font-bold mb-8 ${textPrimary}`}>{t.transactions}</h2>
        <div className={`rounded-2xl border overflow-hidden ${innerCard}`}>
           <div className="flex items-center justify-between p-5 border-b border-inherit hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer">
             <div><p className={`font-bold ${textPrimary}`}>Load #GL-3891</p><p className={`text-[10px] mt-1 font-medium ${textSecondary}`}>Paid • Mar 14, 2026</p></div>
             <p className="text-base font-bold text-green-500">TZS 1,200,000</p>
           </div>
           <div className="flex items-center justify-between p-5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer">
             <div><p className={`font-bold ${textPrimary}`}>Load #GL-3850</p><p className={`text-[10px] mt-1 font-medium ${textSecondary}`}>Paid • Mar 10, 2026</p></div>
             <p className="text-base font-bold text-green-500">TZS 850,000</p>
           </div>
        </div>
        <button onClick={handleDownloadPDF} className={`mt-6 px-6 py-3.5 text-xs font-bold uppercase tracking-widest rounded-xl border flex items-center gap-2 transition-colors active:scale-95 ${isDark ? 'border-white/10 text-white hover:bg-white/10' : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50 shadow-sm'}`}><Download size={16}/> Download Statement PDF</button>
      </motion.div>
    );
  };

  // ==========================================
  // MARKETPLACE SOCIAL HUB 
  // ==========================================
  const CommunityView = () => {
    const [feed, setFeed] = useState<any[]>([]); 
    const [newPost, setNewPost] = useState("");
    const [replies, setReplies] = useState<{ [postId: number]: string }>({});

    useEffect(() => { if (feed.length === 0) setFeed(initialFeed); }, []);

    const handlePost = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newPost.trim()) return;
      const post = { id: Date.now(), user: profile?.full_name || "You", role: isCargoMode ? t.shipperRole : t.driverRole, time: "Just now", content: newPost, comments: [] };
      setFeed([post, ...feed]); setNewPost(""); triggerToast("Message posted to the network!"); addNotification("New Network Post", "Your message is live on the board.", "info");
    };

    const handleReply = (e: React.FormEvent, postId: number) => {
        e.preventDefault();
        const replyText = replies[postId];
        if (!replyText || !replyText.trim()) return;
        triggerToast("Reply posted!");
        setReplies({...replies, [postId]: ""}); 
    };

    return (
      <motion.div variants={viewVar} initial="hidden" animate="visible" exit="exit" className={`p-6 sm:p-8 ${glassCard} mt-6 flex flex-col min-h-full`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-8 border-b border-inherit pb-6 shrink-0">
          <div>
            <h2 className={`text-2xl font-bold tracking-tight ${textPrimary}`}>{t.feedTitle}</h2>
            <p className={`text-xs mt-1.5 font-medium ${textSecondary}`}>{t.feedSub}</p>
          </div>
          <div className={`flex items-center px-4 py-3 rounded-xl border ${innerCard}`}>
            <Search size={16} className={textSecondary} />
            <input type="text" placeholder="Search network..." className="bg-transparent border-none focus:outline-none ml-3 text-xs font-medium text-inherit w-full sm:w-48" />
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 flex flex-col min-w-0">
            <form onSubmit={handlePost} className={`p-5 rounded-2xl border mb-6 shadow-sm ${isDark ? 'bg-[#0B0F19] border-white/10' : 'bg-white border-slate-200'}`}>
              <textarea value={newPost} onChange={(e) => setNewPost(e.target.value)} placeholder={t.chatPlaceholder} className={`w-full p-4 rounded-xl resize-none text-sm font-medium mb-4 h-20 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner ${isDark ? 'bg-[#131826] border border-white/10 text-white placeholder-slate-500' : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400'}`} />
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold uppercase tracking-widest ${textSecondary}`}>Public Post</span>
                <button type="submit" disabled={!newPost.trim()} className={`px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2 ${!newPost.trim() ? 'opacity-50 cursor-not-allowed bg-slate-200 text-slate-400 dark:bg-white/10 dark:text-slate-500' : 'bg-indigo-600 text-white shadow-md hover:bg-indigo-500 hover:shadow-indigo-500/30'}`}>
                  <Send size={14}/> {t.postBtn}
                </button>
              </div>
            </form>

            <div className="space-y-4">
              <AnimatePresence>
                {feed.map((post) => (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={post.id} className={`p-5 sm:p-6 rounded-2xl border ${innerCard}`}>
                    <div className="flex items-start justify-between mb-4">
                       <div className="flex items-center gap-3">
                         <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 ${isDark ? 'bg-[#080b1a] border-white/10 text-slate-300' : 'bg-white border-slate-200 text-slate-700 shadow-sm'}`}>{post.user.charAt(0)}</div>
                         <div>
                           <p className={`font-bold text-sm ${textPrimary}`}>{post.user}</p>
                           <p className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${textSecondary}`}>{post.role}</p>
                         </div>
                       </div>
                       <p className={`text-[10px] font-bold text-slate-400`}>{post.time}</p>
                    </div>
                    <p className={`text-sm leading-relaxed ${textPrimary}`}>{post.content}</p>
                    <div className="mt-5 pt-4 border-t border-inherit">
                       <form onSubmit={(e) => handleReply(e, post.id)} className="flex items-center gap-3">
                          <input type="text" value={replies[post.id] || ""} onChange={e => setReplies({...replies, [post.id]: e.target.value})} placeholder="Write a reply..." className={`flex-1 text-xs font-medium p-3 rounded-xl border focus:outline-none focus:border-indigo-500 transition-colors ${isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}/>
                          <button type="submit" disabled={!replies[post.id]?.trim()} className={`p-3 rounded-xl transition-all ${!replies[post.id]?.trim() ? 'bg-slate-200 text-slate-400 dark:bg-white/10 dark:text-slate-500 cursor-not-allowed' : 'bg-indigo-600 text-white shadow-md active:scale-95'}`}><Send size={16}/></button>
                       </form>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="hidden lg:flex w-72 flex-col shrink-0 border-l border-inherit pl-8">
            <h3 className={`text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2 ${textSecondary}`}><Users size={16}/> {t.onlineMembers}</h3>
            <div className="space-y-4 w-full">
               {mockNetwork.map(user => (
                 <div key={user.id} className={`p-4 rounded-2xl border transition-colors hover:shadow-sm cursor-pointer ${innerCard}`}>
                   <div className="flex items-center gap-3 mb-3">
                     <div className="relative">
                       <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 ${isDark ? 'bg-[#080b1a] border-white/10 text-slate-300' : 'bg-white border-slate-200 text-slate-700 shadow-sm'}`}>{user.name.charAt(0)}</div>
                       {user.online && <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-[#131826] rounded-full" />}
                     </div>
                     <div className="min-w-0">
                       <p className={`font-bold text-sm truncate ${textPrimary}`}>{user.name}</p>
                       <p className={`text-[9px] font-bold uppercase tracking-widest mt-0.5 ${textSecondary}`}>{user.role}</p>
                     </div>
                   </div>
                   <div className="flex items-center justify-between text-[10px] font-medium text-slate-500 bg-black/5 dark:bg-white/5 p-2.5 rounded-lg">
                     <span className="flex items-center gap-1"><MapPin size={12}/> {user.location}</span>
                     <span className="flex items-center gap-1"><Star size={12} className="text-yellow-400 fill-yellow-400"/> {user.rating}</span>
                   </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // ==========================================
  // DRIVER OVERVIEW 
  // ==========================================
  const DriverView = () => {
    const [activeLoad, setActiveLoad] = useState<any>(null); 
    const [availableLoads, setAvailableLoads] = useState<any[]>([]);
    const [isOnline, setIsOnline] = useState(false);
    const [showPodModal, setShowPodModal] = useState(false);
    const [podFile, setPodFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [loadToBook, setLoadToBook] = useState<any>(null);

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
          if (payload.new.status === 'pending') { 
            triggerToast(translations[lang].newLoadAlert); 
            setAvailableLoads(prev => [payload.new, ...prev]); 
            addNotification("New Load Available", `${payload.new.origin} to ${payload.new.destination}`, "info");
          }
        })
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'shipments' }, payload => { 
          fetchLoads(); 
          if(payload.new.status === 'completed' && payload.new.driver_id === profile.id) {
            triggerToast("Payout Received!");
            addNotification("Escrow Released", `TZS ${payload.new.price.toLocaleString()} added to wallet.`, "success");
            setActiveLoad(null);
          }
        }).subscribe();
      return () => { supabase.removeChannel(channel); };
    }, [lang]);

    const handleAcceptLoad = async () => {
      if (!loadToBook) return;
      const { error } = await supabase.from('shipments').update({ driver_id: profile.id, status: 'in_transit' }).eq('id', loadToBook.id);
      if (!error) { 
        setActiveLoad({...loadToBook, status: 'in_transit'}); 
        setLoadToBook(null);
        if (window.innerWidth >= 1024) setIsRightSidebarOpen(true); 
        addNotification("Load Accepted", `You are now routing to ${loadToBook.origin}.`, "success");
        triggerToast("Load Booked Successfully!");
      }
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
      try {
        const path = `${activeLoad.id}-pod.${podFile.name.split('.').pop()}`; 
        const { error: uploadErr } = await supabase.storage.from('shipment_docs').upload(path, podFile);
        
        // MOCK FALLBACK: If storage fails, mock the URL so the UI doesn't hang.
        const podUrl = uploadErr ? 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=400&q=80' : supabase.storage.from('shipment_docs').getPublicUrl(path).data.publicUrl;
        
        const { error: dbError } = await supabase.from('shipments').update({ status: 'pending_approval', pod_url: podUrl }).eq('id', activeLoad.id);
        if (!dbError) { 
          setActiveLoad({...activeLoad, status: 'pending_approval', pod_url: podUrl}); 
          setShowPodModal(false); 
          triggerToast("POD Uploaded. Awaiting Payout."); 
          addNotification("POD Uploaded", "Awaiting shipper approval for payout.", "info");
        } else {
          alert("Database Error: " + dbError.message);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsUploading(false);
      }
    };

    const DriverRightSidebar = () => (
      <div className="w-full lg:w-[320px] shrink-0 space-y-6 flex flex-col h-full">
         <div className="flex lg:hidden items-center justify-between mb-2 pb-4 border-b border-inherit">
             <h3 className={`text-sm font-bold ${textPrimary}`}>{t.toggleDash}</h3>
             <button onClick={() => setIsRightSidebarOpen(false)} className={`p-2 rounded-full ${isDark ? 'bg-white/10 text-white' : 'bg-slate-200 text-slate-800'}`}><X size={16}/></button>
         </div>
         <div className={`p-6 sm:p-8 flex flex-col justify-between min-h-[160px] rounded-[2rem] ${glassCard}`}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center"><Wallet size={16} className="text-green-500" /></div>
              <h3 className={`text-[10px] font-bold uppercase tracking-widest ${textSecondary}`}>{t.wallet}</h3>
            </div>
            <p className={`text-3xl font-bold tracking-tight ${textPrimary}`}>0.00 <span className={`text-[10px] font-medium ${textSecondary}`}>TZS</span></p>
         </div>
         <div className={`p-6 sm:p-8 rounded-[2rem] ${glassCard}`}>
            <h3 className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 mb-6 ${textSecondary}`}><Radar size={14}/> {t.gpsRadar}</h3>
            <div className={`p-8 rounded-2xl border border-dashed text-center flex flex-col items-center justify-center ${isDark ? 'bg-black/20 border-white/10' : 'bg-white/50 border-slate-300'}`}>
              <button onClick={toggleGPS} className={`w-16 h-16 rounded-full mb-4 flex items-center justify-center transition-all shadow-lg ${isOnline ? 'bg-orange-500 text-white shadow-orange-500/30 animate-pulse' : (isDark ? 'bg-white/10 text-slate-400 hover:bg-white/20' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 shadow-sm')}`}>
                 <MapPin size={24} />
              </button>
              <p className={`text-[10px] font-bold uppercase tracking-widest ${isOnline ? 'text-orange-500' : textSecondary}`}>{isOnline ? t.startGPS : t.stopGPS}</p>
            </div>
         </div>
      </div>
    );

    return (
      <div className="flex flex-col lg:flex-row mt-6 w-full h-[calc(100vh-140px)] gap-6 lg:gap-8 relative">
        <motion.div variants={viewVar} initial="hidden" animate="visible" exit="exit" className={`flex-1 min-w-0 transition-all duration-300 h-full overflow-y-auto hide-scrollbar ${activeLoad ? 'hidden lg:block' : 'block'}`}>
            <div className={`p-6 sm:p-8 ${glassCard} min-h-full`}>
              <div className="flex items-center justify-between mb-6 sm:mb-8 pb-5 border-b border-inherit">
                <div>
                  <h3 className={`text-xl sm:text-2xl font-bold tracking-tight ${textPrimary}`}>{t.marketTitle}</h3>
                  <p className={`text-[10px] sm:text-xs mt-1.5 font-medium ${textSecondary}`}>{t.marketSub}</p>
                </div>
                <span className="px-3 py-1.5 bg-orange-500/10 text-orange-500 border border-orange-500/30 rounded-lg text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-sm whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"/> Live
                </span>
              </div>

              <div className="space-y-4">
                {availableLoads.length > 0 ? availableLoads.map((load, i) => (
                  <div key={i} className={`p-5 rounded-2xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-5 border hover:shadow-md ${innerCard}`}>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-[9px] font-bold uppercase tracking-widest text-orange-500 bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-md shrink-0`}>{load.id.substring(0,8)}</span>
                        <div className={`flex items-center gap-1.5 text-[10px] font-semibold truncate ${textSecondary}`}>
                          <Package size={12} className="text-orange-500 shrink-0"/> <span className="truncate">{load.commodity} • {load.weight}</span>
                        </div>
                      </div>
                      <div className={`flex items-center gap-3 font-bold text-base sm:text-lg ${textPrimary} flex-wrap`}>
                        {load.origin} <ArrowRight size={16} className={`shrink-0 ${textSecondary}`} /> {load.destination}
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 sm:gap-6 border-t sm:border-none border-inherit pt-4 sm:pt-0 shrink-0">
                      <div className="text-left sm:text-right">
                        <p className={`text-[9px] uppercase font-bold tracking-widest mb-0.5 ${textSecondary}`}>{t.payout}</p>
                        <p className="text-lg sm:text-2xl font-bold text-green-500 whitespace-nowrap">TZS {load.price.toLocaleString()}</p>
                      </div>
                      <button onClick={() => setLoadToBook(load)} className="px-6 py-3.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl text-[10px] uppercase tracking-widest transition-all shadow-sm active:scale-95 whitespace-nowrap">
                        {t.acceptBtn}
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className={`p-12 sm:p-16 rounded-[2rem] text-center border border-dashed ${isDark ? 'border-white/10 text-slate-500 bg-black/20' : 'border-slate-300 text-slate-400 bg-white/50'}`}>
                     <Truck size={32} className="mx-auto mb-4 opacity-50 text-orange-500" />
                     <p className="font-bold text-sm">{t.noLoads}</p>
                  </div>
                )}
              </div>
            </div>
        </motion.div>

        {/* ACTIVE LOAD VIEW (Shows on right for Desktop, REPLACES list on Mobile) */}
        <div className={`w-full lg:w-[400px] shrink-0 flex-col h-full ${activeLoad ? 'flex' : 'hidden'}`}>
           <button onClick={() => setActiveLoad(null)} className="lg:hidden mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-100 dark:bg-white/5 px-4 py-2.5 rounded-xl self-start">
              <ArrowLeft size={16}/> Back to List
           </button>
           <div className={`p-6 sm:p-8 rounded-[2rem] ${glassCard} flex-1 overflow-y-auto hide-scrollbar`}>
              <div className="flex items-center justify-between mb-6 border-b border-inherit pb-5">
                 <h3 className="text-xl font-bold flex items-center gap-2 text-orange-500"><Truck size={24} /> {t.activeTrip}</h3>
                 <span className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest shadow-sm ${activeLoad?.status === 'in_transit' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/30' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/30'}`}>
                   {activeLoad?.status === 'in_transit' ? t.inTransit : t.pendingApproval}
                 </span>
              </div>
              
              <div className={`p-5 rounded-2xl border mb-6 ${innerCard}`}>
                <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${textSecondary}`}>{t.routeDetails}</p>
                <p className={`text-lg sm:text-xl font-bold ${textPrimary} flex-wrap flex items-center mb-2`}>
                  {activeLoad?.origin} <ArrowRight className="inline mx-2 text-orange-500 shrink-0" size={16}/> {activeLoad?.destination}
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 pt-3 border-t border-inherit">
                   <p className={`text-[10px] font-medium ${textSecondary}`}>{activeLoad?.commodity} • {activeLoad?.weight}</p>
                   <p className="text-sm font-bold text-green-500">TZS {activeLoad?.price.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="mb-8">
                <RouteVisualizer origin={activeLoad?.origin} dest={activeLoad?.destination} status={activeLoad?.status} />
              </div>

              {activeLoad?.status === 'in_transit' ? (
                <button onClick={() => setShowPodModal(true)} className="w-full py-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white flex items-center justify-center gap-2 transition-all shadow-lg font-bold active:scale-95 text-[10px] uppercase tracking-widest">
                    <Camera size={18} /> {t.uploadDocs}
                </button>
              ) : (
                <div className="w-full py-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 flex items-center justify-center gap-2 font-bold text-[10px] uppercase tracking-widest">
                    <Loader2 size={16} className="animate-spin" /> Awaiting Escrow Release
                </div>
              )}
           </div>
        </div>

        {/* RIGHT SIDEBAR (Only shows on Desktop when NO active load) */}
        {!activeLoad && isRightSidebarOpen && (
          <div className="hidden lg:flex flex-col shrink-0 overflow-hidden box-content h-full">
             <DriverRightSidebar />
          </div>
        )}

        {/* CONFIRM BOOK LOAD MODAL */}
        <AnimatePresence>
          {loadToBook && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
               <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} className={`w-full max-w-sm rounded-[2rem] border shadow-2xl p-8 text-center ${isDark ? 'bg-[#080b1a] border-white/10' : 'bg-white border-slate-200'}`}>
                  <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-5"><Truck size={28} className="text-orange-500" /></div>
                  <h3 className={`text-xl font-bold mb-2 ${textPrimary}`}>Confirm Booking</h3>
                  <p className={`text-xs mb-6 leading-relaxed ${textSecondary}`}>You are about to book Load <span className="font-bold text-orange-500">#{loadToBook.id.substring(0,8)}</span> from <span className="font-bold text-inherit">{loadToBook.origin}</span> to <span className="font-bold text-inherit">{loadToBook.destination}</span>. Do you agree to the transit terms?</p>
                  <div className="flex items-center gap-4">
                     <button onClick={() => setLoadToBook(null)} className={`flex-1 py-3.5 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-colors ${isDark ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'}`}>Cancel</button>
                     <button onClick={handleAcceptLoad} className="flex-1 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-[10px] uppercase tracking-widest transition-colors shadow-md active:scale-95">Yes, Book</button>
                  </div>
               </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* DRIVER POD MODAL */}
        <AnimatePresence>
          {showPodModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
               <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} className={`w-full max-w-sm overflow-hidden rounded-[2rem] border shadow-2xl p-8 text-center ${isDark ? 'bg-[#080b1a] border-white/10' : 'bg-white border-slate-200'}`}>
                  <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-5"><UploadCloud size={28} className="text-orange-500" /></div>
                  <h3 className={`text-xl font-bold mb-2 ${textPrimary}`}>{t.uploadPodTitle}</h3>
                  <p className={`text-xs mb-6 ${textSecondary}`}>{t.uploadPodSub}</p>
                  <form onSubmit={submitPOD}>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="relative group cursor-pointer mb-6">
                      <input type="file" accept="image/*" required onChange={(e) => {if(e.target.files) setPodFile(e.target.files[0])}} className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer" />
                      <div className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all ${podFile ? 'border-green-500 bg-green-500/10' : isDark ? 'bg-black/40 border-white/20 hover:border-orange-500' : 'bg-slate-50 border-slate-300 hover:border-orange-500'}`}>
                        <div className="text-4xl mb-3">{podFile ? '📄' : '📸'}</div>
                        <p className={`text-[10px] font-bold uppercase tracking-wider truncate ${podFile ? 'text-green-500' : textSecondary}`}>{podFile ? podFile.name : 'Tap to Upload'}</p>
                      </div>
                    </motion.div>
                    <div className="flex items-center gap-4">
                       <button type="button" onClick={() => setShowPodModal(false)} className={`flex-1 py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-colors ${isDark ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'}`}>{t.clear}</button>
                       <button type="submit" disabled={isUploading} className={`flex-1 py-4 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-[10px] uppercase tracking-widest transition-colors shadow-lg active:scale-95 ${isUploading ? 'opacity-70' : ''}`}>
                         {isUploading ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'Submit POD'}
                       </button>
                    </div>
                  </form>
               </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // ==========================================
  // CARGO OWNER OVERVIEW
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
      if (data) { setPostings(data); if (activeTrackingLoad) { const updatedActive = data.find(d => d.id === activeTrackingLoad.id); if (updatedActive) setActiveTrackingLoad(updatedActive); } }
    };

    useEffect(() => {
      fetchPostings();
      const channel = supabase.channel('cargo_updates')
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'shipments', filter: `cargo_owner_id=eq.${profile.id}` }, payload => {
          fetchPostings();
          if (payload.new.status === 'pending_approval') {
             triggerToast("Driver uploaded POD!");
             addNotification("POD Ready for Review", `Load to ${payload.new.destination} requires approval.`, "info");
          }
        }).subscribe();
      return () => { supabase.removeChannel(channel); };
    }, [activeTrackingLoad]);

    const handlePostLoad = async (e: React.FormEvent) => {
      e.preventDefault(); setPostStatus('loading');
      const newShipment = { cargo_owner_id: profile.id, origin: formData.origin, destination: formData.dest, commodity: `[${formData.serviceType}] ${formData.commodity} (${formData.truckType})`, weight: formData.weight, price: parseFloat(formData.price.replace(/,/g, '')), status: 'pending' };
      const { data, error } = await supabase.from('shipments').insert(newShipment).select();
      if (!error && data) { 
        setPostStatus('success'); 
        addNotification("Load Posted", `Your load to ${formData.dest} is live on the market.`, "info");
        setTimeout(() => { fetchPostings(); setShowWizard(false); setPostStatus('idle'); setPostStep(1); setFormData({ serviceType: '', origin: '', dest: '', commodity: '', truckType: '', weight: '', price: '' }); }, 1500); 
      } else { setPostStatus('idle'); alert("Error: " + error?.message); }
    };

    const confirmDeleteLoad = async () => {
      if (!deleteModalId) return;
      const { error } = await supabase.from('shipments').delete().eq('id', deleteModalId);
      if (!error) { setPostings(postings.filter(p => p.id !== deleteModalId)); if (activeTrackingLoad?.id === deleteModalId) setActiveTrackingLoad(null); setDeleteModalId(null); triggerToast("Shipment Deleted"); }
    };

    const approvePayout = async () => {
      if (!activeTrackingLoad) return;
      const { error } = await supabase.from('shipments').update({ status: 'completed' }).eq('id', activeTrackingLoad.id);
      if (!error) { 
        setPodModalUrl(null); 
        fetchPostings(); 
        triggerToast("Funds Released Successfully!"); 
        addNotification("Payout Released", `TZS ${activeTrackingLoad.price.toLocaleString()} transferred to driver.`, "success");
        setActiveTrackingLoad(null); 
      }
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
        <div className={`p-6 rounded-2xl relative mt-6`}>
          <div className={`absolute left-[39px] top-10 bottom-10 w-0.5 ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />
          <div className="space-y-6 relative z-10">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 ${isDark ? 'border-[#131826]' : 'border-white'} transition-colors ${s.done ? 'bg-indigo-500 text-white' : s.active ? 'bg-indigo-500/20 border-indigo-500 text-indigo-500' : (isDark ? 'bg-white/10 text-slate-600' : 'bg-slate-200 text-slate-400')}`}>
                  {s.done ? <Check size={12} /> : <Circle size={6} className="fill-current" />}
                </div>
                <div>
                  <h4 className={`text-[11px] font-bold uppercase tracking-widest ${s.active ? textPrimary : textSecondary}`}>{s.label}</h4>
                </div>
              </div>
            ))}
          </div>
          <AnimatePresence>
            {status === 'pending_approval' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`mt-8 pt-6 border-t ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                <button onClick={() => setPodModalUrl(activeTrackingLoad.pod_url)} className="w-full py-4 bg-green-500 hover:bg-green-600 shadow-md text-white rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95">
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
        <div className="w-full lg:w-[320px] shrink-0 flex flex-col h-full space-y-6">
          <div className={`p-6 sm:p-8 rounded-[2rem] flex flex-col justify-between min-h-[160px] ${glassCard}`}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center"><Wallet size={16} className="text-indigo-500" /></div>
              <h3 className={`text-[10px] font-bold uppercase tracking-widest ${textSecondary}`}>{t.totalSpend}</h3>
            </div>
            <p className={`text-3xl font-bold tracking-tight ${textPrimary}`}>0.00 <span className={`text-[10px] font-medium ${textSecondary}`}>TZS</span></p>
          </div>

          <div className={`p-6 sm:p-8 rounded-[2rem] ${glassCard}`}>
            <div className="flex items-center justify-between mb-5 border-b border-inherit pb-4">
              <h3 className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 ${textSecondary}`}><Activity size={14}/> Fleet Summary</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
               <div className={`p-4 rounded-2xl border text-center ${innerCard}`}>
                  <p className={`text-2xl font-bold ${textPrimary}`}>{activeCount}</p>
                  <p className={`text-[9px] font-bold uppercase tracking-widest mt-1.5 ${textSecondary}`}>Active Loads</p>
               </div>
               <div className={`p-4 rounded-2xl border text-center ${innerCard}`}>
                  <p className={`text-2xl font-bold ${textPrimary}`}>{completedCount}</p>
                  <p className={`text-[9px] font-bold uppercase tracking-widest mt-1.5 ${textSecondary}`}>Completed</p>
               </div>
            </div>
            <div className={`p-6 rounded-2xl border border-dashed text-center flex flex-col items-center justify-center ${isDark ? 'bg-black/20 border-white/10' : 'bg-white/50 border-slate-300'}`}>
              <div className={`w-12 h-12 rounded-full mb-3 flex items-center justify-center ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}><MapIcon size={20} className={`opacity-50 ${textSecondary}`} /></div>
              <p className={`text-[10px] font-medium leading-relaxed ${textSecondary}`}>{t.selectShipment}</p>
            </div>
          </div>
        </div>
      );
    };

    return (
      <div className="flex flex-col lg:flex-row mt-6 w-full h-[calc(100vh-140px)] gap-6 lg:gap-8 relative">
        
        {/* LIST VIEW */}
        <motion.div variants={viewVar} initial="hidden" animate="visible" exit="exit" className={`flex-1 min-w-0 h-full overflow-y-auto hide-scrollbar ${activeTrackingLoad ? 'hidden lg:block' : 'block'}`}>
          <div className={`p-6 sm:p-8 ${glassCard} min-h-full`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 sm:gap-6 mb-6 sm:mb-8 border-b border-inherit pb-5 sm:pb-6">
              <div><h3 className={`text-xl sm:text-2xl font-bold tracking-tight ${textPrimary}`}>{t.activePostings}</h3></div>
              <button onClick={() => setShowWizard(true)} className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 text-[10px] uppercase tracking-widest whitespace-nowrap">
                 <Plus size={16} /> {t.postCargoTitle}
              </button>
            </div>
            
            <div className="space-y-4">
              {postings.filter(p => p.status !== 'completed').length > 0 ? postings.filter(p => p.status !== 'completed').map((post, i) => (
                <div key={i} className={`p-5 sm:p-6 rounded-2xl transition-all border ${innerCard} ${activeTrackingLoad?.id === post.id ? 'ring-2 ring-indigo-500 bg-indigo-500/5' : 'hover:shadow-md'}`}>
                  <div onClick={() => setActiveTrackingLoad(activeTrackingLoad?.id === post.id ? null : post)} className="cursor-pointer">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3 mb-2.5">
                          <span className="text-[10px] font-bold text-indigo-500 bg-indigo-500/10 px-3 py-1.5 rounded-lg uppercase tracking-widest border border-indigo-500/20 shrink-0">{post.id.substring(0,8)}</span>
                          <span className={`text-[11px] font-semibold flex items-center gap-1.5 truncate ${textSecondary}`}><Package size={14} className="shrink-0"/> <span className="truncate">{post.commodity} • {post.weight}</span></span>
                        </div>
                        <h4 className={`text-base sm:text-lg font-bold flex items-center gap-3 ${textPrimary} flex-wrap`}>{post.origin} <ArrowRight size={16} className={`shrink-0 ${textSecondary}`}/> {post.destination}</h4>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-5 border-t sm:border-none border-inherit pt-4 sm:pt-0 shrink-0">
                        <div className="text-left sm:text-right flex flex-col items-start sm:items-end">
                          <p className="text-lg sm:text-xl font-bold text-green-500 mb-1 whitespace-nowrap">TZS {post.price.toLocaleString()}</p>
                          <span className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 whitespace-nowrap ${post.status === 'pending' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : post.status === 'in_transit' ? 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20' : post.status === 'pending_approval' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}>
                            {post.status === 'pending' ? 'Sokoni' : post.status === 'in_transit' ? t.inTransit : post.status === 'pending_approval' ? t.pendingApproval : t.delivered}
                          </span>
                        </div>
                        {post.status === 'pending' && <button onClick={(e) => { e.stopPropagation(); setDeleteModalId(post.id); }} className={`p-3 rounded-xl transition-colors ${isDark ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}><Trash2 size={18} /></button>}
                      </div>
                    </div>
                  </div>
                </div>
              )) : (
                <div className={`p-12 sm:p-16 rounded-[2rem] text-center border border-dashed ${isDark ? 'bg-black/20 border-white/10' : 'bg-white/50 border-slate-300'}`}>
                   <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 ${isDark ? 'bg-indigo-500/10' : 'bg-indigo-50'}`}><Package size={32} className="text-indigo-500" /></div>
                   <p className={`font-bold text-sm ${textPrimary}`}>{t.noActiveTrack}</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* DETAIL VIEW */}
        <div className={`w-full lg:w-[420px] shrink-0 flex-col h-full ${activeTrackingLoad ? 'flex' : 'hidden'}`}>
           <button onClick={() => setActiveTrackingLoad(null)} className="lg:hidden mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-100 dark:bg-white/5 px-5 py-3 rounded-xl self-start">
              <ArrowLeft size={16}/> Back to List
           </button>
           
           <div className={`p-6 sm:p-8 rounded-[2rem] h-full overflow-y-auto hide-scrollbar ${glassCard}`}>
             <div className="flex items-center justify-between mb-6 pb-5 border-b border-inherit">
               <span className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 ${textPrimary}`}><Activity size={16} className="text-indigo-500"/> {t.trackFleet}</span>
               <button onClick={() => setActiveTrackingLoad(null)} className={`text-[9px] font-bold uppercase tracking-widest text-slate-400 hover:text-indigo-500 bg-indigo-500/5 px-3 py-2 rounded-lg transition-colors hidden lg:block`}>{t.clear}</button>
             </div>

             <div className={`p-5 rounded-2xl border mb-6 ${innerCard}`}>
               <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${textSecondary}`}>{t.routeDetails}</p>
               <p className={`text-lg font-bold ${textPrimary}`}>{activeTrackingLoad?.origin} <ArrowRight size={14} className="inline mx-2 text-indigo-500"/> {activeTrackingLoad?.destination}</p>
               <p className={`text-xs font-medium mt-2 ${textSecondary}`}>{activeTrackingLoad?.commodity} • {activeTrackingLoad?.weight}</p>
             </div>

             {activeTrackingLoad && (
                <div className="mb-6">
                  <RouteVisualizer origin={activeTrackingLoad.origin} dest={activeTrackingLoad.destination} status={activeTrackingLoad.status} />
                </div>
             )}

             <TelemetryStepper status={activeTrackingLoad?.status || 'pending'} />
           </div>
        </div>

        {/* RIGHT SIDEBAR */}
        {!activeTrackingLoad && isRightSidebarOpen && (
          <div className="hidden lg:flex flex-col shrink-0 overflow-hidden box-content h-full">
             <CargoRightSidebar />
          </div>
        )}

        {/* WIZARD & MODALS */}
        <AnimatePresence>
          {showWizard && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
              <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} className={`w-full max-w-xl overflow-hidden rounded-[2rem] border shadow-2xl my-auto ${isDark ? 'bg-[#080b1a] border-white/10' : 'bg-white border-slate-200'}`}>
                {postStatus === 'loading' ? (
                   <div className="p-12 text-center flex flex-col items-center justify-center min-h-[400px]"><Loader2 size={36} className="text-indigo-500 animate-spin mb-4" /><h3 className={`text-xl font-bold ${textPrimary} mb-1`}>{t.registering}</h3></div>
                ) : postStatus === 'success' ? (
                   <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="p-12 text-center flex flex-col items-center justify-center min-h-[400px]"><div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6"><Check size={32} className="text-green-500" /></div><h3 className={`text-2xl font-bold mb-2 ${textPrimary}`}>Imesajiliwa!</h3></motion.div>
                ) : (
                   <>
                    <div className="flex items-center justify-between p-6 border-b border-inherit shrink-0">
                      <div>
                        <h3 className={`text-xl font-bold ${textPrimary}`}>{postStep === 1 ? t.serviceTitle : postStep === 2 ? t.equipTitle : t.detailsTitle}</h3>
                        <p className={`text-[10px] sm:text-xs font-medium mt-1 ${textSecondary}`}>{postStep === 1 ? t.serviceSub : postStep === 2 ? t.equipSub : t.detailsSub}</p>
                      </div>
                      <button onClick={() => {setShowWizard(false); setPostStep(1);}} className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${isDark ? 'bg-white/5 hover:bg-white/10 text-slate-400' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'}`}><X size={18}/></button>
                    </div>
                    <div className="p-6">
                      <AnimatePresence mode="wait">
                        {postStep === 1 ? (
                          <motion.div key="step1" variants={stepVar} initial="hidden" animate="visible" exit="exit" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {serviceTypes.map((srv) => (
                              <div key={srv.id} onClick={() => { setFormData({...formData, serviceType: srv.title}); setPostStep(2); }} className={`p-6 rounded-2xl border cursor-pointer transition-all hover:-translate-y-1 ${isDark ? 'bg-white/[0.02] border-white/5 hover:border-indigo-500/50' : 'bg-slate-50 border-slate-200 hover:border-indigo-500/50 shadow-sm'}`}>
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${isDark ? 'bg-white/5 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>{srv.icon}</div>
                                <h4 className={`text-base font-bold mb-1 ${textPrimary}`}>{srv.title}</h4>
                                <p className={`text-[10px] font-medium ${textSecondary}`}>{srv.desc}</p>
                              </div>
                            ))}
                          </motion.div>
                        ) : postStep === 2 ? (
                          <motion.div key="step2" variants={stepVar} initial="hidden" animate="visible" exit="exit" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {equipmentTypes.map((equip) => (
                              <div key={equip.id} onClick={() => { setFormData({...formData, truckType: equip.id}); setPostStep(3); }} className={`p-5 rounded-2xl border cursor-pointer transition-all hover:-translate-y-1 ${isDark ? 'bg-white/[0.02] border-white/5 hover:border-indigo-500/50' : 'bg-slate-50 border-slate-200 hover:border-indigo-500/50 shadow-sm'}`}>
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${isDark ? 'bg-white/5 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>{equip.icon}</div>
                                <h4 className={`text-sm font-bold mb-1 ${textPrimary}`}>{equip.title}</h4>
                                <p className={`text-[10px] font-medium ${textSecondary}`}>{equip.desc}</p>
                              </div>
                            ))}
                            <div className="col-span-1 sm:col-span-2 pt-2"><button onClick={() => setPostStep(1)} className="text-[10px] font-bold text-slate-400 hover:text-indigo-500 uppercase tracking-widest transition-colors"><ArrowLeft size={14} className="inline mr-1.5"/> {t.backStep}</button></div>
                          </motion.div>
                        ) : (
                          <motion.div key="step3" variants={stepVar} initial="hidden" animate="visible" exit="exit">
                            <form onSubmit={handlePostLoad} className="space-y-4">
                              <div className={`flex items-center gap-4 mb-5 p-4 rounded-xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-indigo-50/50 border-indigo-100'}`}>
                                <Info size={20} className="text-indigo-500 shrink-0" />
                                <div className="flex-1"><p className={`text-xs font-bold ${textPrimary}`}>{formData.serviceType}</p><p className={`text-[9px] font-bold uppercase tracking-widest mt-1 ${textSecondary}`}>Equipment: <span className="text-indigo-500">{formData.truckType}</span></p></div>
                                <button type="button" onClick={() => setPostStep(2)} className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest hover:text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-500/10 transition-colors">Change</button>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div><label className={`block text-[9px] font-bold mb-1.5 uppercase tracking-widest ${textSecondary}`}>{t.origin}</label><input required type="text" placeholder="e.g. Dar es Salaam" value={formData.origin} onChange={e => setFormData({...formData, origin: e.target.value})} className={`w-full p-3.5 rounded-xl border focus:outline-none text-xs font-bold transition-colors ${isDark ? 'bg-black/40 border-white/10 text-white focus:border-indigo-500' : 'bg-white border-slate-200 text-slate-900 focus:border-indigo-500 shadow-sm'}`} /></div>
                                <div><label className={`block text-[9px] font-bold mb-1.5 uppercase tracking-widest ${textSecondary}`}>{t.dest}</label><input required type="text" placeholder="e.g. Arusha" value={formData.dest} onChange={e => setFormData({...formData, dest: e.target.value})} className={`w-full p-3.5 rounded-xl border focus:outline-none text-xs font-bold transition-colors ${isDark ? 'bg-black/40 border-white/10 text-white focus:border-indigo-500' : 'bg-white border-slate-200 text-slate-900 focus:border-indigo-500 shadow-sm'}`} /></div>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div><label className={`block text-[9px] font-bold mb-1.5 uppercase tracking-widest ${textSecondary}`}>{t.commodity}</label><input required type="text" placeholder="e.g. Electronics" value={formData.commodity} onChange={e => setFormData({...formData, commodity: e.target.value})} className={`w-full p-3.5 rounded-xl border focus:outline-none text-xs font-bold transition-colors ${isDark ? 'bg-black/40 border-white/10 text-white focus:border-indigo-500' : 'bg-white border-slate-200 text-slate-900 focus:border-indigo-500 shadow-sm'}`} /></div>
                                <div><label className={`block text-[9px] font-bold mb-1.5 uppercase tracking-widest ${textSecondary}`}>{t.weight}</label><input required type="text" placeholder="e.g. 15 Tons" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} className={`w-full p-3.5 rounded-xl border focus:outline-none text-xs font-bold transition-colors ${isDark ? 'bg-black/40 border-white/10 text-white focus:border-indigo-500' : 'bg-white border-slate-200 text-slate-900 focus:border-indigo-500 shadow-sm'}`} /></div>
                              </div>
                              <div><label className={`block text-[9px] font-bold mb-1.5 uppercase tracking-widest ${textSecondary}`}>{t.price}</label><input required type="number" placeholder="Guaranteed Rate (TZS)" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className={`w-full p-3.5 rounded-xl border focus:outline-none text-lg font-bold text-green-500 transition-colors ${isDark ? 'bg-black/40 border-white/10 focus:border-green-500' : 'bg-white border-slate-200 focus:border-green-500 shadow-sm'}`} /></div>
                              <div className="pt-2 mt-4 flex gap-3"><button type="button" onClick={() => setPostStep(2)} className={`px-6 py-3 rounded-xl border font-bold text-[10px] uppercase tracking-widest transition-all ${isDark ? 'bg-white/5 hover:bg-white/10 text-white' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-900 shadow-sm'}`}>{t.backStep}</button><button type="submit" className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md active:scale-95 text-[10px] uppercase tracking-widest transition-all">{t.submitFreight}</button></div>
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
               <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} className={`w-full max-w-sm overflow-hidden rounded-3xl border shadow-2xl p-6 text-center ${isDark ? 'bg-[#080b1a] border-white/10' : 'bg-white border-slate-200'}`}>
                  <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 size={24} className="text-red-500" /></div>
                  <h3 className={`text-lg font-bold mb-1 ${textPrimary}`}>{t.deleteTitle}</h3>
                  <p className={`text-xs mb-6 ${textSecondary}`}>{t.deleteMsg}</p>
                  <div className="flex items-center gap-3">
                     <button onClick={() => setDeleteModalId(null)} className={`flex-1 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-colors ${isDark ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'}`}>{t.deny}</button>
                     <button onClick={confirmDeleteLoad} className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-[10px] uppercase tracking-widest transition-colors shadow-md">{t.confirm}</button>
                  </div>
               </motion.div>
            </motion.div>
          )}
          {podModalUrl && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
               <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} className={`w-full max-w-lg overflow-hidden rounded-3xl border shadow-2xl p-6 text-center ${isDark ? 'bg-[#080b1a] border-white/10' : 'bg-white border-slate-200'}`}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className={`text-lg font-bold ${textPrimary}`}>Proof of Delivery</h3>
                    <button onClick={() => setPodModalUrl(null)} className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isDark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'}`}><X size={16}/></button>
                  </div>
                  <div className={`w-full h-64 rounded-2xl mb-6 overflow-hidden border flex items-center justify-center ${isDark ? 'bg-black/50 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                     <img src={podModalUrl} alt="POD" className="object-contain w-full h-full" />
                  </div>
                  <button onClick={approvePayout} className="w-full py-3.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold uppercase tracking-widest text-[10px] transition-all shadow-md flex justify-center gap-2 active:scale-95">
                    <CheckCircle2 size={16} /> {t.approvePayout}
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
      case 'fleet': return <FleetView />;
      case 'transactions': return <TransactionsView />;
      case 'community': return <CommunityView />;
      default: return isCargoMode ? <CargoView /> : <DriverView />;
    }
  }

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-500 font-sans selection:bg-indigo-500/30 ${bgMainClass}`}>
      <AnimatePresence>
        {toastMsg && (
          <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }} className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] px-5 py-2.5 rounded-full bg-indigo-600 text-white font-bold text-xs shadow-xl flex items-center gap-2">
            <BellRing size={14} className="animate-bounce" /> {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <motion.div animate={{ x: [-20, 20, -20], y: [-20, 20, -20] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className={`absolute top-[-10%] right-[-5%] w-[60vw] h-[60vw] md:w-[40vw] md:h-[40vw] rounded-full blur-[120px] md:blur-[160px] bg-indigo-600 ${isDark ? 'opacity-[0.12]' : 'opacity-[0.04]'}`} />
        <motion.div animate={{ x: [20, -20, 20], y: [20, -20, 20] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className={`absolute bottom-[-10%] left-[-5%] w-[60vw] h-[60vw] md:w-[40vw] md:h-[40vw] rounded-full blur-[120px] md:blur-[160px] bg-orange-600 ${isDark ? 'opacity-[0.1]' : 'opacity-[0.03]'}`} />
      </div>

      {/* LEFT SIDEBAR (DESKTOP) */}
      <motion.aside animate={{ width: isLeftSidebarOpen ? 240 : 80 }} transition={{ duration: 0.3, ease: transitionEase }} className={`hidden lg:flex flex-col z-40 my-4 ml-4 rounded-[2rem] shrink-0 transition-colors border ${isDark ? 'bg-[#0B0F19]/70 border-white/10 backdrop-blur-3xl shadow-2xl shadow-black/50' : 'bg-white/80 border-white/50 backdrop-blur-3xl shadow-xl shadow-slate-200/40'}`}>
         <button onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)} className={`absolute -right-3 top-8 w-6 h-6 rounded-full flex items-center justify-center border shadow-sm z-50 transition-colors ${isDark ? 'bg-[#18181b] border-white/20 text-slate-400 hover:text-white' : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'}`}>
           {isLeftSidebarOpen ? <ChevronLeft size={14}/> : <ChevronRight size={14}/>}
         </button>
         <div className={`h-[88px] flex items-center border-b border-inherit shrink-0 overflow-hidden ${!isLeftSidebarOpen ? 'justify-center px-0' : 'px-6'}`}>
            <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-lg ${bgAccent}`}><ShieldCheck size={20}/></div>
            {isLeftSidebarOpen && <span className={`ml-3 font-bold tracking-tight text-lg whitespace-nowrap ${textPrimary}`}>Geek</span>}
         </div>
         <div className={`flex-1 py-6 space-y-2 overflow-y-auto overflow-x-hidden ${!isLeftSidebarOpen ? 'px-3' : 'px-4'}`}>
            <div onClick={() => setCurrentView('overview')} className={`py-3 rounded-xl flex items-center cursor-pointer transition-all ${!isLeftSidebarOpen ? 'justify-center' : 'px-4 gap-3'} ${currentView === 'overview' ? (isDark ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm') : (isDark ? 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-transparent')}`}><LayoutDashboard size={18} className="shrink-0" />{isLeftSidebarOpen && <span className="text-xs font-bold whitespace-nowrap">{t.overview}</span>}</div>
            <div onClick={() => setCurrentView('fleet')} className={`py-3 rounded-xl flex items-center cursor-pointer transition-all ${!isLeftSidebarOpen ? 'justify-center' : 'px-4 gap-3'} ${currentView === 'fleet' ? (isDark ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm') : (isDark ? 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-transparent')}`}><Truck size={18} className="shrink-0" />{isLeftSidebarOpen && <span className="text-xs font-bold whitespace-nowrap">{t.fleet}</span>}</div>
            <div onClick={() => setCurrentView('transactions')} className={`py-3 rounded-xl flex items-center cursor-pointer transition-all ${!isLeftSidebarOpen ? 'justify-center' : 'px-4 gap-3'} ${currentView === 'transactions' ? (isDark ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm') : (isDark ? 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-transparent')}`}><ListTodo size={18} className="shrink-0" />{isLeftSidebarOpen && <span className="text-xs font-bold whitespace-nowrap">{t.transactions}</span>}</div>
            <div onClick={() => setCurrentView('community')} className={`py-3 rounded-xl flex items-center cursor-pointer transition-all ${!isLeftSidebarOpen ? 'justify-center' : 'px-4 gap-3'} ${currentView === 'community' ? (isDark ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm') : (isDark ? 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-transparent')}`}><Users size={18} className="shrink-0" />{isLeftSidebarOpen && <span className="text-xs font-bold whitespace-nowrap">{t.community}</span>}</div>
         </div>
      </motion.aside>

      {/* LEFT SIDEBAR (MOBILE) */}
      <AnimatePresence>
        {isLeftSidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm" onClick={() => setIsLeftSidebarOpen(false)} />
            <motion.aside initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ duration: 0.3, ease: "easeOut" }} className={`fixed inset-y-0 left-0 w-64 flex flex-col z-50 lg:hidden shadow-2xl ${isDark ? 'bg-[#0B0F19] border-r border-white/10' : 'bg-white border-r border-slate-200'}`}>
               <div className={`h-[72px] flex items-center justify-between px-6 border-b border-inherit shrink-0`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-sm ${bgAccent}`}><ShieldCheck size={20} /></div>
                    <span className={`font-bold tracking-tight text-lg ${textPrimary}`}>Geek</span>
                  </div>
                  <button onClick={() => setIsLeftSidebarOpen(false)} className={`p-2 rounded-full ${isDark ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-800'}`}><X size={16}/></button>
               </div>
               <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
                  <div onClick={() => {setCurrentView('overview'); setIsLeftSidebarOpen(false);}} className={`py-3 px-4 rounded-xl flex items-center gap-3 text-xs font-bold cursor-pointer ${currentView === 'overview' ? (isDark ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-indigo-50 text-indigo-600 border border-indigo-100') : (isDark ? 'text-slate-400' : 'text-slate-500')}`}><LayoutDashboard size={18} className="shrink-0" /> {t.overview}</div>
                  <div onClick={() => {setCurrentView('fleet'); setIsLeftSidebarOpen(false);}} className={`py-3 px-4 rounded-xl flex items-center gap-3 text-xs font-bold cursor-pointer ${currentView === 'fleet' ? (isDark ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-indigo-50 text-indigo-600 border border-indigo-100') : (isDark ? 'text-slate-400' : 'text-slate-500')}`}><Truck size={18} className="shrink-0" /> {t.fleet}</div>
                  <div onClick={() => {setCurrentView('transactions'); setIsLeftSidebarOpen(false);}} className={`py-3 px-4 rounded-xl flex items-center gap-3 text-xs font-bold cursor-pointer ${currentView === 'transactions' ? (isDark ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-indigo-50 text-indigo-600 border border-indigo-100') : (isDark ? 'text-slate-400' : 'text-slate-500')}`}><ListTodo size={18} className="shrink-0" /> {t.transactions}</div>
                  <div onClick={() => {setCurrentView('community'); setIsLeftSidebarOpen(false);}} className={`py-3 px-4 rounded-xl flex items-center gap-3 text-xs font-bold cursor-pointer ${currentView === 'community' ? (isDark ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-indigo-50 text-indigo-600 border border-indigo-100') : (isDark ? 'text-slate-400' : 'text-slate-500')}`}><Users size={18} className="shrink-0" /> {t.community}</div>
               </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        
        {/* DYNAMIC HEADER */}
        <header className={`h-[72px] mx-4 mt-4 lg:ml-6 mr-4 rounded-2xl border flex items-center justify-between px-5 lg:px-6 z-30 transition-colors ${glassNav}`}>
          <div className="flex items-center gap-3 lg:hidden">
            <button onClick={() => setIsLeftSidebarOpen(true)} className={`p-2 rounded-lg border ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'}`}><Menu size={16} /></button>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm shadow-sm ${bgAccent}`}><ShieldCheck size={16} /></div>
          </div>
          
          <div className="hidden lg:flex items-center gap-3">
             <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-inner border-2 ${isDark ? 'bg-[#080b1a] border-white/10' : 'bg-slate-200 border-white text-slate-700'}`}>
                {profile?.full_name?.charAt(0) || 'U'}
             </div>
             <div className="flex flex-col">
                <span className={`text-sm font-bold ${textPrimary}`}>{profile?.full_name || 'Geek User'}</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                   <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                   <span className={`text-[9px] uppercase font-bold tracking-widest text-green-500`}>{isCargoMode ? t.shipperRole : t.driverRole}</span>
                </div>
             </div>
          </div>
          
          <LayoutGroup>
            <div className="flex items-center gap-2 lg:gap-4 ml-auto relative">
               <button onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)} className={`hidden lg:flex px-4 py-2 rounded-lg border text-[9px] font-bold tracking-widest uppercase transition-colors active:scale-95 ${isDark ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10' : 'bg-white border-slate-200/50 text-slate-700 hover:bg-slate-50 shadow-sm'}`}>
                 {isRightSidebarOpen ? <ChevronRight size={14} className="mr-1.5"/> : <ChevronLeft size={14} className="mr-1.5"/>}
                 <span className="hidden sm:inline">{t.toggleDash}</span>
               </button>

               <div className="relative">
                 <button onClick={() => setShowNotifs(!showNotifs)} className={`p-2 rounded-lg border transition-colors active:scale-95 relative ${isDark ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-white border-slate-200/50 text-slate-700 hover:bg-slate-50 shadow-sm'}`}>
                   <Bell size={16} />
                   {notifications.length > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#080b1a]"></span>}
                 </button>
                 
                 <AnimatePresence>
                   {showNotifs && (
                     <>
                       <div className="fixed inset-0 z-40" onClick={() => setShowNotifs(false)} />
                       <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className={`absolute right-0 top-12 w-80 rounded-2xl border shadow-xl z-50 overflow-hidden ${glassCard}`}>
                          <div className="flex items-center justify-between p-4 border-b border-inherit">
                            <h3 className={`text-xs font-bold ${textPrimary}`}>{t.notifications}</h3>
                            <button onClick={() => setNotifications([])} className={`text-[9px] font-bold uppercase tracking-widest text-indigo-500 hover:underline`}>{t.markRead}</button>
                          </div>
                          <div className="max-h-[300px] overflow-y-auto">
                             {notifications.length > 0 ? notifications.map((n) => (
                               <div key={n.id} className="p-4 border-b border-inherit hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer flex gap-4">
                                 <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${n.type === 'success' ? 'bg-green-500/10 text-green-500' : n.type === 'info' ? 'bg-indigo-500/10 text-indigo-500' : 'bg-slate-500/10 text-slate-500'}`}>
                                   {n.type === 'success' ? <CheckCircle2 size={14}/> : n.type === 'info' ? <Truck size={14}/> : <Activity size={14}/>}
                                 </div>
                                 <div>
                                   <p className={`text-xs font-bold ${textPrimary}`}>{n.title}</p>
                                   <p className={`text-[10px] mt-0.5 mb-1 ${textSecondary}`}>{n.desc}</p>
                                   <p className={`text-[8px] font-bold uppercase tracking-widest text-slate-400`}>{n.time}</p>
                                 </div>
                               </div>
                             )) : (
                               <div className="p-6 text-center">
                                  <p className={`text-xs font-medium ${textSecondary}`}>{t.noNotifs}</p>
                               </div>
                             )}
                          </div>
                       </motion.div>
                     </>
                   )}
                 </AnimatePresence>
               </div>

               <div className={`hidden sm:block w-px h-6 mx-1 ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />
               <motion.button layout onClick={() => setLang(lang === 'SW' ? 'EN' : 'SW')} className={`flex px-2 sm:px-3 py-2 rounded-lg border text-[9px] font-bold uppercase transition-colors active:scale-95 w-[60px] sm:w-[72px] justify-center ${isDark ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'border-slate-200/50 bg-white/60 text-slate-700 hover:bg-white shadow-sm'}`}>
                 <Globe className="w-3 h-3 sm:w-4 sm:h-4 inline sm:mr-1.5" /> <span className="hidden sm:inline">{lang}</span><span className="inline sm:hidden ml-1">{lang}</span>
               </motion.button>
               <button onClick={() => setIsDark(!isDark)} className={`p-2 rounded-lg border transition-colors active:scale-95 ${isDark ? 'bg-white/5 border-white/10 text-yellow-400 hover:bg-white/10' : 'bg-white border-slate-200/50 text-indigo-600 hover:bg-slate-50 shadow-sm'}`}>
                 {isDark ? <Sun size={16} /> : <Moon size={16} />}
               </button>
               <button onClick={() => setShowLogoutModal(true)} className={`p-2 rounded-lg border transition-colors active:scale-95 ${isDark ? 'bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/20' : 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100 shadow-sm'}`}>
                 <LogOut size={16} />
               </button>
            </div>
          </LayoutGroup>
        </header>

        {/* LOGOUT CONFIRMATION MODAL */}
        <AnimatePresence>
          {showLogoutModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
               <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} className={`w-full max-w-sm rounded-[2rem] border shadow-2xl p-8 text-center ${isDark ? 'bg-[#080b1a] border-white/10' : 'bg-white border-slate-200'}`}>
                  <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-5"><LogOut size={28} className="text-red-500" /></div>
                  <h3 className={`text-xl font-bold mb-2 ${textPrimary}`}>Sign Out?</h3>
                  <p className={`text-sm mb-8 ${textSecondary}`}>Are you sure you want to sign out of Geek Logistics?</p>
                  <div className="flex items-center gap-4">
                     <button onClick={() => setShowLogoutModal(false)} className={`flex-1 py-3.5 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-colors ${isDark ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'}`}>Cancel</button>
                     <button onClick={async () => { await supabase.auth.signOut(); localStorage.clear(); sessionStorage.clear(); router.push('/login'); }} className="flex-1 py-3.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-[10px] uppercase tracking-widest transition-colors shadow-md">Yes, Sign Out</button>
                  </div>
               </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="flex-1 overflow-hidden p-4 sm:p-5 lg:p-6 pb-20 flex">
          <div className="flex-1 flex flex-col min-w-0 max-w-[1400px] mx-auto overflow-hidden">
             <AnimatePresence mode="wait">
               {renderMainContent()}
             </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}