// app/dashboard/page.tsx
"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { 
  LogOut, Globe, Sun, Moon, MapPin, Truck, AlertTriangle, CheckCircle2, 
  Activity, X, Loader2, ChevronRight, ChevronLeft, LayoutDashboard, 
  ListTodo, Users, Menu, ShieldCheck, BellRing, Download, Map as MapIcon, Bell
} from 'lucide-react';
import { translations } from '@/lib/translations';

// Imported Extracted Components
import CommunityView from '@/components/dashboard/CommunityView';
import CargoView from '@/components/dashboard/CargoView';
import DriverView from '@/components/dashboard/DriverView';
import RouteVisualizer from '@/components/dashboard/RouteVisualizer';

const transitionEase = [0.16, 1, 0.3, 1];
const containerVar = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const itemVar = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: transitionEase } } };
const viewVar = { hidden: { opacity: 0, scale: 0.98 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: transitionEase } }, exit: { opacity: 0, scale: 0.98, transition: { duration: 0.2 } } };

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

  const t = translations[lang];
  const isCargoMode = profile?.role === 'cargo_owner';
  const bgAccent = isCargoMode ? 'bg-indigo-500' : 'bg-orange-500';

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
        
        {/* Simple Modal overlay for View Map button in Fleet */}
        <AnimatePresence>
           {viewMapLoad && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                <div className={`w-full max-w-xl rounded-[2rem] border shadow-2xl p-6 ${isDark ? 'bg-[#080b1a] border-white/10' : 'bg-white border-slate-200'}`}>
                  <div className="flex justify-between mb-4"><h3 className="font-bold">Route Telemetry</h3><button onClick={() => setViewMapLoad(null)}><X size={16}/></button></div>
                  <RouteVisualizer origin={viewMapLoad.origin} dest={viewMapLoad.destination} status={viewMapLoad.status} />
                </div>
             </motion.div>
           )}
        </AnimatePresence>
      </motion.div>
    );
  };

  const TransactionsView = () => {
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
        <button onClick={() => triggerToast("Statement feature coming soon.")} className={`mt-6 px-6 py-3.5 text-xs font-bold uppercase tracking-widest rounded-xl border flex items-center gap-2 transition-colors active:scale-95 ${isDark ? 'border-white/10 text-white hover:bg-white/10' : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50 shadow-sm'}`}><Download size={16}/> Download Statement PDF</button>
      </motion.div>
    );
  };

  const renderMainContent = () => {
    switch(currentView) {
      case 'overview': 
        return isCargoMode ? 
          <CargoView t={t} isDark={isDark} profile={profile} triggerToast={triggerToast} addNotification={addNotification} isRightSidebarOpen={isRightSidebarOpen} /> : 
          <DriverView t={t} lang={lang} isDark={isDark} profile={profile} triggerToast={triggerToast} addNotification={addNotification} isRightSidebarOpen={isRightSidebarOpen} setIsRightSidebarOpen={setIsRightSidebarOpen} />;
      case 'fleet': return <FleetView />;
      case 'transactions': return <TransactionsView />;
      case 'community': return <CommunityView t={t} isDark={isDark} isCargoMode={isCargoMode} profile={profile} triggerToast={triggerToast} addNotification={addNotification} />;
      default: return isCargoMode ? <CargoView t={t} isDark={isDark} profile={profile} triggerToast={triggerToast} addNotification={addNotification} isRightSidebarOpen={isRightSidebarOpen}/> : <DriverView t={t} lang={lang} isDark={isDark} profile={profile} triggerToast={triggerToast} addNotification={addNotification} isRightSidebarOpen={isRightSidebarOpen} setIsRightSidebarOpen={setIsRightSidebarOpen} />;
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