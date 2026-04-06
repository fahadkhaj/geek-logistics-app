// app/dashboard/page.tsx
"use client";
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { 
  LogOut, Globe, Sun, Moon, AlertTriangle, X, Loader2, ChevronRight, 
  ChevronLeft, LayoutDashboard, ListTodo, Users, Menu, ShieldCheck, 
  BellRing, Bell, Truck, BarChart3, Settings as SettingsIcon, Download,
  User as UserIcon, Lock, CheckCircle2, Activity, Wallet
} from 'lucide-react';
import { translations } from '@/lib/translations';

import CommunityView from '@/components/dashboard/CommunityView';
import CargoView from '@/components/dashboard/CargoView';
import DriverView from '@/components/dashboard/DriverView';

// 100% Bulletproof Modal Wrapper (Escapes all layout traps)
const ModalPortal = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted || typeof document === 'undefined') return null;
  return createPortal(children, document.body);
};

export default function Dashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fatalError, setFatalError] = useState<string | null>(null);
  const [lang, setLang] = useState<'SW' | 'EN'>('EN');
  
  const [isDark, setIsDark] = useState(false); 
  const [currentView, setCurrentView] = useState<'overview'|'fleet'|'transactions'|'analytics'|'community'|'settings'>('overview');
  
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false); 
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true); 
  const [showNotifs, setShowNotifs] = useState(false); 
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  const addNotification = (title: string, desc: string, type: 'success' | 'info' | 'system') => {
    const newNotif = { id: Date.now(), title, desc, time: "Just now", type };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const bgMainClass = isDark ? 'bg-[#0B0F19]' : 'bg-[#f4f7fa]'; 
  const textPrimary = isDark ? "text-white" : "text-slate-900";
  const textSecondary = isDark ? "text-slate-400" : "text-slate-500";
  const glassNav = isDark ? "bg-[#0B0F19]/90 border-white/10 backdrop-blur-2xl" : "bg-white/90 border-slate-200/60 backdrop-blur-2xl";
  const glassCard = isDark ? "bg-[#131826]/90 border border-white/10 backdrop-blur-2xl shadow-xl rounded-3xl" : "bg-white/90 border border-slate-200 backdrop-blur-2xl shadow-lg shadow-slate-200/30 rounded-3xl";

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined' && window.innerWidth < 1024) setIsRightSidebarOpen(false);
    
    const fetchUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) { router.replace('/login'); return; }

        const { data, error } = await supabase.from('users').select('*').eq('id', session.user.id).single();
        if (error || !data) { setFatalError("Profile Error: Not found in database."); setLoading(false); return; }
        
        setProfile(data); setLoading(false);

        const hasSeenWelcome = localStorage.getItem(`gl_welcome_${data.id}`);
        const isNewAccount = new Date(data.created_at) > new Date(Date.now() - 600000);
        if (!hasSeenWelcome && (data.account_status === 'pending_review' || isNewAccount)) {
          setTimeout(() => setShowWelcome(true), 1200); 
        }
      } catch (err) { setFatalError("Critical connection error."); setLoading(false); }
    };
    fetchUser();
  }, [router]);

  const triggerToast = (msg: string) => { setToastMsg(msg); setTimeout(() => setToastMsg(null), 4000); };
  
  const closeWelcome = () => { setShowWelcome(false); if (profile?.id) localStorage.setItem(`gl_welcome_${profile.id}`, 'true'); };

  const handleSignOut = async () => {
    setLoading(true);
    try { await supabase.auth.signOut(); } catch (e) { }
    const welcomeFlag = profile?.id ? localStorage.getItem(`gl_welcome_${profile.id}`) : null;
    localStorage.clear(); sessionStorage.clear();
    if (profile?.id && welcomeFlag) localStorage.setItem(`gl_welcome_${profile.id}`, 'true');
    router.replace('/login');
  };

  if (!mounted) return null;
  const t = translations[lang];
  const isCargoMode = profile?.role === 'cargo_owner';
  const bgAccent = isCargoMode ? 'bg-indigo-500' : 'bg-orange-500';
  const textAccent = isCargoMode ? 'text-indigo-500' : 'text-orange-500';

  if (fatalError) return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-700 ${bgMainClass}`}>
      <div className={`relative z-10 w-full max-w-sm overflow-hidden rounded-3xl border shadow-2xl p-8 text-center ${glassCard}`}>
          <AlertTriangle size={32} className="text-red-500 mx-auto mb-6" />
          <h3 className={`text-xl font-bold mb-2 ${textPrimary}`}>{t.fatalErrorTitle}</h3>
          <p className={`text-sm mb-8 ${textSecondary}`}>{fatalError}</p>
          <button onClick={handleSignOut} className="w-full py-3.5 rounded-xl bg-red-500 text-white font-bold text-xs uppercase tracking-widest shadow-md active:scale-95 transition-all">Sign Out</button>
      </div>
    </div>
  );

  if (loading) return <div className={`min-h-screen flex items-center justify-center ${bgMainClass}`}><Loader2 size={36} className="text-indigo-500 animate-spin" /></div>;

  const AnalyticsView = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`w-full max-w-5xl mx-auto mt-2 sm:mt-6 pb-12`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <h2 className={`text-2xl font-bold ${textPrimary}`}>{t.analytics}</h2>
        <button className={`px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-colors shadow-sm active:scale-95 ${isDark ? 'border-white/10 bg-white/5 text-white hover:bg-white/10' : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'}`}><Download size={14} className="inline mr-1.5"/> Export CSV</button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {[
          { id: 1, label: isCargoMode ? 'Total Spend' : 'Total Earnings', val: 'TZS 4.2M', icon: <Wallet size={18} className={textAccent}/> },
          { id: 2, label: 'Completed Loads', val: '12', icon: <CheckCircle2 size={18} className="text-green-500"/> },
          { id: 3, label: 'Active Transit', val: '2', icon: <Truck size={18} className="text-blue-500"/> },
          { id: 4, label: 'Network Rank', val: 'Top 5%', icon: <Activity size={18} className="text-purple-500"/> }
        ].map((stat) => (
          <div key={stat.id} className={`p-6 rounded-3xl border transition-shadow hover:shadow-md ${glassCard}`}>
             <div className="flex items-center justify-between mb-4"><span className={`text-[10px] font-bold uppercase tracking-widest ${textSecondary}`}>{stat.label}</span> {stat.icon}</div>
             <p className={`text-2xl sm:text-3xl font-bold ${textPrimary}`}>{stat.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
         <div className={`col-span-1 lg:col-span-2 p-6 sm:p-8 rounded-3xl border ${glassCard}`}>
            <h3 className={`text-xs font-bold uppercase tracking-widest mb-6 sm:mb-8 ${textSecondary}`}>Monthly Volume</h3>
            <div className={`h-56 sm:h-64 rounded-2xl border flex items-end gap-2 sm:gap-4 p-4 sm:p-6 ${isDark ? 'bg-black/20 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
               {[40, 70, 45, 90, 60, 100, 30].map((h, i) => (
                 <div key={i} className={`flex-1 rounded-t-lg sm:rounded-t-xl transition-all ${isCargoMode ? 'bg-indigo-500/80 hover:bg-indigo-400' : 'bg-orange-500/80 hover:bg-orange-400'}`} style={{ height: `${h}%` }}></div>
               ))}
            </div>
         </div>
         <div className={`p-6 sm:p-8 rounded-3xl border ${glassCard}`}>
            <h3 className={`text-xs font-bold uppercase tracking-widest mb-6 sm:mb-8 ${textSecondary}`}>Recent Activity</h3>
            <div className="space-y-4 sm:space-y-5">
               {[1, 2, 3].map(i => (
                 <div key={i} className="flex items-center gap-4 p-3 rounded-2xl transition-colors hover:bg-black/5 dark:hover:bg-white/5">
                   <div className="w-10 h-10 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0"><CheckCircle2 size={16} className="text-green-500"/></div>
                   <div><p className={`text-sm font-bold ${textPrimary}`}>Load Delivered</p><p className={`text-[10px] font-medium mt-0.5 ${textSecondary}`}>GL-4829 • 2 hrs ago</p></div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </motion.div>
  );

  const SettingsView = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`w-full max-w-4xl mx-auto mt-2 sm:mt-6 pb-12`}>
      <h2 className={`text-2xl font-bold mb-6 sm:mb-8 ${textPrimary}`}>{t.settings}</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
         <div className={`col-span-1 flex flex-row lg:flex-col gap-2 overflow-x-auto hide-scrollbar pb-2 lg:pb-0`}>
            {[{id: 'profile', icon: <UserIcon size={16}/>, label: 'Profile'}, {id: 'security', icon: <Lock size={16}/>, label: 'Security'}, {id: 'notifs', icon: <Bell size={16}/>, label: 'Notifications'}].map(tab => (
              <button key={tab.id} className={`shrink-0 lg:w-full flex items-center justify-center lg:justify-start gap-3 px-5 py-3.5 rounded-xl text-xs font-bold transition-all ${tab.id === 'profile' ? (isDark ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600 shadow-sm') : (isDark ? 'text-slate-400 hover:bg-white/5' : 'text-slate-600 hover:bg-slate-100')}`}>{tab.icon} {tab.label}</button>
            ))}
         </div>
         
         <div className={`col-span-1 lg:col-span-2 p-6 sm:p-8 rounded-3xl border ${glassCard}`}>
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8 pb-8 border-b border-inherit">
               <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold shrink-0 shadow-inner ${isDark ? 'bg-black/50 text-slate-300 border border-white/10' : 'bg-slate-200 text-slate-600 border border-slate-300'}`}>{profile?.full_name?.charAt(0)}</div>
               <div>
                 <p className={`text-xl font-bold ${textPrimary}`}>{profile?.full_name}</p>
                 <p className={`text-xs font-medium uppercase tracking-widest mt-1.5 ${textSecondary}`}>{isCargoMode ? 'Cargo Owner' : 'Transporter'} • <span className="text-green-500">{profile?.account_status}</span></p>
                 <button className={`mt-4 px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors active:scale-95 ${isDark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'}`}>Change Avatar</button>
               </div>
            </div>

            <form className="space-y-5" onSubmit={e => e.preventDefault()}>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                 <div><label className={`block text-[9px] font-bold uppercase tracking-widest mb-2 ${textSecondary}`}>Full Name</label><input type="text" defaultValue={profile?.full_name} className={`w-full px-4 py-3.5 rounded-xl border text-sm font-medium focus:outline-none transition-colors ${isDark ? 'bg-black/40 border-white/10 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500'}`} /></div>
                 <div><label className={`block text-[9px] font-bold uppercase tracking-widest mb-2 ${textSecondary}`}>Email Address</label><input type="email" disabled defaultValue={profile?.email} className={`w-full px-4 py-3.5 rounded-xl border text-sm font-medium focus:outline-none opacity-60 cursor-not-allowed ${isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} /></div>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                 <div><label className={`block text-[9px] font-bold uppercase tracking-widest mb-2 ${textSecondary}`}>Phone Number</label><input type="tel" defaultValue={profile?.phone_number} className={`w-full px-4 py-3.5 rounded-xl border text-sm font-medium focus:outline-none transition-colors ${isDark ? 'bg-black/40 border-white/10 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500'}`} /></div>
                 <div><label className={`block text-[9px] font-bold uppercase tracking-widest mb-2 ${textSecondary}`}>Region</label><input type="text" defaultValue={profile?.region} className={`w-full px-4 py-3.5 rounded-xl border text-sm font-medium focus:outline-none transition-colors ${isDark ? 'bg-black/40 border-white/10 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500'}`} /></div>
               </div>
               <div className="pt-6 mt-6 border-t border-inherit flex justify-end">
                 <button type="submit" className={`px-8 py-3.5 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-md active:scale-95 transition-all ${isCargoMode ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-orange-600 hover:bg-orange-500'}`}>Save Profile</button>
               </div>
            </form>
         </div>
      </div>
    </motion.div>
  );

  const renderMainContent = () => {
    switch(currentView) {
      case 'overview': 
      case 'fleet': 
        return isCargoMode ? 
          <CargoView t={t} isDark={isDark} profile={profile} triggerToast={triggerToast} addNotification={addNotification} isRightSidebarOpen={isRightSidebarOpen} setIsRightSidebarOpen={setIsRightSidebarOpen} /> : 
          <DriverView t={t} lang={lang} isDark={isDark} profile={profile} triggerToast={triggerToast} addNotification={addNotification} isRightSidebarOpen={isRightSidebarOpen} setIsRightSidebarOpen={setIsRightSidebarOpen} />;
      case 'community': return <CommunityView t={t} isDark={isDark} isCargoMode={isCargoMode} profile={profile} triggerToast={triggerToast} addNotification={addNotification} />;
      case 'analytics': return <AnalyticsView />;
      case 'settings': return <SettingsView />;
      default: return <div className={`p-10 text-center rounded-3xl border ${glassCard} mt-6`}><h3 className="font-bold">Feature Coming Soon</h3></div>;
    }
  }

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-500 font-sans selection:bg-indigo-500/30 ${bgMainClass}`}>
      
      {/* Decorative Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <motion.div animate={{ x: [-20, 20, -20], y: [-20, 20, -20] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className={`absolute top-[-10%] right-[-5%] w-[60vw] h-[60vw] md:w-[40vw] md:h-[40vw] rounded-full blur-[120px] md:blur-[160px] bg-indigo-600 ${isDark ? 'opacity-[0.12]' : 'opacity-[0.04]'}`} />
        <motion.div animate={{ x: [20, -20, 20], y: [20, -20, 20] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className={`absolute bottom-[-10%] left-[-5%] w-[60vw] h-[60vw] md:w-[40vw] md:h-[40vw] rounded-full blur-[120px] md:blur-[160px] bg-orange-600 ${isDark ? 'opacity-[0.1]' : 'opacity-[0.03]'}`} />
      </div>

      <ModalPortal>
        <AnimatePresence>
          {toastMsg && (
            <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }} className="fixed top-6 left-1/2 -translate-x-1/2 z-[99999] px-6 py-3 rounded-full bg-indigo-600 text-white font-bold text-xs shadow-2xl flex items-center gap-3">
              <BellRing size={16} className="animate-bounce" /> {toastMsg}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showWelcome && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
               <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className={`w-full max-w-md rounded-[2.5rem] border shadow-2xl p-10 text-center relative overflow-hidden ${isDark ? 'bg-[#0B0F19] border-white/10' : 'bg-white border-slate-200'}`}>
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-500/20 blur-3xl rounded-full pointer-events-none" />
                  <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl relative z-10 ${bgAccent}`}>
                    <ShieldCheck size={40} className="text-white" />
                  </div>
                  <h3 className={`text-3xl font-bold mb-3 relative z-10 ${textPrimary}`}>Welcome to Geek</h3>
                  <p className={`text-sm mb-10 leading-relaxed relative z-10 ${textSecondary}`}>
                    {isCargoMode ? "Welcome to your shipping terminal. You can now post freight and track your deliveries across the network." : "Your transporter account is set up. Once our team verifies your documents, you will be able to book premium loads."}
                  </p>
                  <button onClick={closeWelcome} className={`w-full py-4 rounded-xl text-white font-bold text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95 relative z-10 ${isCargoMode ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30' : 'bg-orange-600 hover:bg-orange-500 shadow-orange-500/30'}`}>
                    Finish Onboarding
                  </button>
               </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showLogoutModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
               <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} className={`w-full max-w-sm rounded-[2.5rem] border shadow-2xl p-10 text-center ${isDark ? 'bg-[#080b1a] border-white/10' : 'bg-white border-slate-200'}`}>
                  <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6"><LogOut size={32} className="text-red-500" /></div>
                  <h3 className={`text-2xl font-bold mb-3 ${textPrimary}`}>Sign Out?</h3>
                  <p className={`text-sm mb-10 ${textSecondary}`}>Are you sure you want to sign out of Geek Logistics?</p>
                  <div className="flex items-center gap-4">
                     <button onClick={() => setShowLogoutModal(false)} className={`flex-1 py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-colors ${isDark ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'}`}>Cancel</button>
                     <button onClick={handleSignOut} className="flex-1 py-4 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs uppercase tracking-widest transition-colors shadow-md active:scale-95">Yes, Sign Out</button>
                  </div>
               </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </ModalPortal>

      {/* Desktop Sidebar */}
      <motion.aside animate={{ width: isSidebarCollapsed ? 96 : 240 }} className={`hidden lg:flex flex-col z-40 my-4 ml-4 rounded-[2rem] shrink-0 transition-colors border relative ${isDark ? 'bg-[#0B0F19]/70 border-white/10 backdrop-blur-3xl shadow-2xl' : 'bg-white/80 border-white/50 backdrop-blur-3xl shadow-xl'}`}>
         <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className={`absolute -right-3 top-8 w-6 h-6 rounded-full flex items-center justify-center border shadow-md z-50 transition-colors ${isDark ? 'bg-[#18181b] border-white/20 text-slate-400 hover:text-white' : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'}`}>
           {isSidebarCollapsed ? <ChevronRight size={14}/> : <ChevronLeft size={14}/>}
         </button>
         <div className={`h-[88px] flex items-center border-b border-inherit shrink-0 overflow-hidden ${isSidebarCollapsed ? 'justify-center px-0' : 'px-6'}`}>
            <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-lg ${bgAccent}`}><ShieldCheck size={20}/></div>
            {!isSidebarCollapsed && <motion.span initial={{opacity: 0}} animate={{opacity: 1}} className={`ml-3 font-bold tracking-tight text-lg whitespace-nowrap ${textPrimary}`}>Geek</motion.span>}
         </div>
         <div className={`flex-1 py-6 space-y-2 overflow-y-auto overflow-x-hidden ${isSidebarCollapsed ? 'px-3' : 'px-4'} hide-scrollbar`}>
            {[
              { id: 'overview', icon: <LayoutDashboard size={18} className="shrink-0"/>, label: t.overview },
              { id: 'analytics', icon: <BarChart3 size={18} className="shrink-0"/>, label: t.analytics },
              { id: 'community', icon: <Users size={18} className="shrink-0"/>, label: t.community },
              { id: 'settings', icon: <SettingsIcon size={18} className="shrink-0"/>, label: t.settings }
            ].map(nav => (
              <div key={nav.id} onClick={() => setCurrentView(nav.id as any)} className={`py-3.5 rounded-xl flex items-center cursor-pointer transition-all ${isSidebarCollapsed ? 'justify-center px-0' : 'px-4 gap-3'} ${currentView === nav.id ? (isDark ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm') : (isDark ? 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-transparent')}`}>
                {nav.icon} {!isSidebarCollapsed && <span className="text-xs font-bold whitespace-nowrap">{nav.label}</span>}
              </div>
            ))}
         </div>
      </motion.aside>

      {/* Mobile Sidebar */}
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
               <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto hide-scrollbar">
                  {[
                    { id: 'overview', icon: <LayoutDashboard size={18} className="shrink-0"/>, label: t.overview },
                    { id: 'analytics', icon: <BarChart3 size={18} className="shrink-0"/>, label: t.analytics },
                    { id: 'community', icon: <Users size={18} className="shrink-0"/>, label: t.community },
                    { id: 'settings', icon: <SettingsIcon size={18} className="shrink-0"/>, label: t.settings }
                  ].map(nav => (
                    <div key={nav.id} onClick={() => {setCurrentView(nav.id as any); setIsLeftSidebarOpen(false);}} className={`py-3.5 px-4 rounded-xl flex items-center gap-3 cursor-pointer transition-all ${currentView === nav.id ? (isDark ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm') : (isDark ? 'text-slate-400' : 'text-slate-500')}`}>
                      {nav.icon} <span className="text-xs font-bold">{nav.label}</span>
                    </div>
                  ))}
               </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col h-full relative z-10 min-w-0">
        
        <header className={`relative z-30 h-[72px] mx-4 mt-4 lg:ml-6 mr-4 rounded-2xl border flex items-center justify-between px-5 lg:px-6 transition-colors shrink-0 ${glassNav}`}>
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
               
               <div className="relative">
                 <button onClick={() => setShowNotifs(!showNotifs)} className={`p-2 lg:p-2.5 rounded-lg border transition-colors active:scale-95 relative ${isDark ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-white border-slate-200/50 text-slate-700 hover:bg-slate-50 shadow-sm'}`}>
                   <Bell size={18} />
                   {notifications.length > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#080b1a]"></span>}
                 </button>
                 
                 <AnimatePresence>
                   {showNotifs && (
                     <>
                       <div className="fixed inset-0 z-40" onClick={() => setShowNotifs(false)} />
                       <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className={`absolute right-0 top-14 w-[320px] rounded-3xl border shadow-2xl z-50 overflow-hidden ${glassCard}`}>
                          <div className="flex items-center justify-between p-5 border-b border-inherit">
                            <h3 className={`text-sm font-bold ${textPrimary}`}>{t.notifications}</h3>
                            <button onClick={() => setNotifications([])} className={`text-[10px] font-bold uppercase tracking-widest text-indigo-500 hover:underline`}>{t.markRead}</button>
                          </div>
                          <div className="max-h-[350px] overflow-y-auto hide-scrollbar">
                             {notifications.length > 0 ? notifications.map((n) => (
                               <div key={n.id} className="p-5 border-b border-inherit hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer flex gap-4">
                                 <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${n.type === 'success' ? 'bg-green-500/10 text-green-500 border-green-500/20' : n.type === 'info' ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' : 'bg-slate-500/10 text-slate-500 border-slate-500/20'}`}>
                                   <Truck size={16}/>
                                 </div>
                                 <div>
                                   <p className={`text-sm font-bold ${textPrimary}`}>{n.title}</p>
                                   <p className={`text-xs mt-1 mb-1.5 ${textSecondary}`}>{n.desc}</p>
                                   <p className={`text-[9px] font-bold uppercase tracking-widest text-slate-400`}>{n.time}</p>
                                 </div>
                               </div>
                             )) : (
                               <div className="p-8 text-center">
                                  <p className={`text-sm font-medium ${textSecondary}`}>{t.noNotifs}</p>
                               </div>
                             )}
                          </div>
                       </motion.div>
                     </>
                   )}
                 </AnimatePresence>
               </div>

               <motion.button layout onClick={() => setLang(lang === 'SW' ? 'EN' : 'SW')} className={`hidden sm:flex px-2 sm:px-3 py-2 lg:py-2.5 rounded-lg border text-[10px] font-bold uppercase transition-colors active:scale-95 w-[60px] sm:w-[72px] justify-center ${isDark ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'border-slate-200/50 bg-white/60 text-slate-700 hover:bg-white shadow-sm'}`}>
                 <Globe className="w-3 h-3 sm:w-4 sm:h-4 inline sm:mr-1.5" /> <span className="hidden sm:inline">{lang}</span><span className="inline sm:hidden ml-1">{lang}</span>
               </motion.button>
               <button onClick={() => setIsDark(!isDark)} className={`hidden sm:block p-2 lg:p-2.5 rounded-lg border transition-colors active:scale-95 ${isDark ? 'bg-white/5 border-white/10 text-yellow-400 hover:bg-white/10' : 'bg-white border-slate-200/50 text-indigo-600 hover:bg-slate-50 shadow-sm'}`}>
                 {isDark ? <Sun size={18} /> : <Moon size={18} />}
               </button>
               <button onClick={() => setShowLogoutModal(true)} className={`p-2 lg:px-4 lg:py-2.5 rounded-lg border text-[9px] font-bold uppercase transition-colors active:scale-95 flex items-center gap-2 ${isDark ? 'bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/20' : 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100 shadow-sm'}`}>
                 <LogOut size={16} /> <span className="hidden lg:inline">Sign Out</span>
               </button>
            </div>
          </LayoutGroup>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-5 lg:p-6 pb-24 hide-scrollbar">
          <div className="w-full max-w-[1400px] mx-auto min-h-full pb-10">
             <AnimatePresence mode="wait">
               {renderMainContent()}
             </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}