// components/dashboard/CargoView.tsx
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Package, ArrowRight, Trash2, Map as MapIcon, Loader2, Check, X, Info, ArrowLeft, Activity, Circle, CheckCircle2, FileCheck, Wallet, Truck, Layers, Box, Snowflake, Navigation } from 'lucide-react';
import RouteVisualizer from './RouteVisualizer';

interface CargoViewProps { t: any; isDark: boolean; profile: any; triggerToast: (msg: string) => void; addNotification: (title: string, desc: string, type: 'success' | 'info' | 'system') => void; isRightSidebarOpen: boolean; setIsRightSidebarOpen: (val: boolean) => void; }

const serviceTypes = [{ id: 'FTL', icon: <Truck size={24} />, title: 'Full truckload (FTL)', desc: 'Best for shipments that fill an entire truck.' }, { id: 'LTL', icon: <Layers size={24} />, title: 'Less-than-truckload (LTL)', desc: 'Best for shipments under 12 pallets.' }];
const equipmentTypes = [{ id: 'Flatbed', icon: <Truck size={20} />, title: 'Flatbed', desc: 'Standard open trailer.' }, { id: 'Dry Van', icon: <Box size={20} />, title: 'Dry Van', desc: 'Enclosed cargo area.' }, { id: 'Tipper', icon: <Truck size={20} />, title: 'Tipper', desc: 'Bulk loose materials.' }, { id: 'Refrigerated', icon: <Snowflake size={20} />, title: 'Refrigerated', desc: 'Temperature controlled.' }];

const ModalPortal = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted || typeof document === 'undefined') return null;
  return createPortal(children, document.body);
};

export default function CargoView({ t, isDark, profile, triggerToast, addNotification, isRightSidebarOpen, setIsRightSidebarOpen }: CargoViewProps) {
  const [showWizard, setShowWizard] = useState(false);
  const [postStep, setPostStep] = useState<1 | 2 | 3>(1);
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);
  const [podModalUrl, setPodModalUrl] = useState<string | null>(null);
  const [postStatus, setPostStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [activeTrackingLoad, setActiveTrackingLoad] = useState<any>(null); 
  const [formData, setFormData] = useState({ serviceType: '', origin: '', dest: '', commodity: '', truckType: '', weight: '', price: '' });
  const [postings, setPostings] = useState<any[]>([]);

  const textPrimary = isDark ? "text-white" : "text-slate-900";
  const textSecondary = isDark ? "text-slate-400" : "text-slate-500";
  const glassCard = isDark ? "bg-[#131826]/70 border border-white/10 backdrop-blur-3xl shadow-xl rounded-3xl" : "bg-white/90 border border-slate-200 backdrop-blur-3xl shadow-lg shadow-slate-200/30 rounded-3xl";
  const innerCard = isDark ? "bg-white/[0.03] border border-white/10 hover:bg-white/[0.05]" : "bg-slate-50/80 border border-slate-200/80 hover:bg-white shadow-sm";

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
    const channel = supabase.channel('cargo_updates').on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'shipments', filter: `cargo_owner_id=eq.${profile.id}` }, payload => {
        fetchPostings();
        if (payload.new.status === 'pending_approval') triggerToast("Driver uploaded POD!");
      }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [activeTrackingLoad]);

  const handlePostLoad = async (e: React.FormEvent) => {
    e.preventDefault(); setPostStatus('loading');
    const cleanPrice = parseFloat(formData.price.replace(/,/g, ''));
    const newShipment = { cargo_owner_id: profile.id, origin: formData.origin, destination: formData.dest, commodity: `[${formData.serviceType}] ${formData.commodity} (${formData.truckType})`, weight: formData.weight, price: cleanPrice, status: 'pending' };
    const { data, error } = await supabase.from('shipments').insert(newShipment).select();
    if (!error && data) { 
      setPostStatus('success'); 
      addNotification("Load Posted", `Your load to ${formData.dest} is live.`, "info");
      fetchPostings();
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
    if (!error) { setPodModalUrl(null); fetchPostings(); triggerToast("Funds Released!"); setActiveTrackingLoad(null); }
  };

  const closeWizard = () => {
    setShowWizard(false); setPostStatus('idle'); setPostStep(1); 
    setFormData({ serviceType: '', origin: '', dest: '', commodity: '', truckType: '', weight: '', price: '' });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    setFormData({...formData, price: val ? parseInt(val, 10).toLocaleString() : ''});
  };

  return (
    <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="flex flex-col lg:flex-row w-full gap-6 lg:gap-8 mt-2 lg:mt-6 items-start relative">
      
      <div className={`flex-1 min-w-0 w-full p-6 sm:p-8 ${glassCard} ${activeTrackingLoad ? 'hidden lg:block' : 'block'}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-6 sm:mb-8 border-b border-inherit pb-5 sm:pb-6">
          <h3 className={`text-xl sm:text-2xl font-bold tracking-tight ${textPrimary}`}>{t.activePostings}</h3>
          <button onClick={() => setShowWizard(true)} className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 text-[10px] uppercase tracking-widest whitespace-nowrap">
             <Plus size={16} /> {t.postCargoTitle}
          </button>
        </div>
        
        <div className="space-y-4">
          {postings.filter(p => p.status !== 'completed').length > 0 ? postings.filter(p => p.status !== 'completed').map((post) => (
            <div key={post.id} className={`p-5 sm:p-6 rounded-2xl transition-all border ${innerCard} ${activeTrackingLoad?.id === post.id ? 'border-indigo-500 bg-indigo-500/5 shadow-md' : 'hover:shadow-md'}`}>
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3 mb-2.5">
                      <span className="text-[10px] font-bold text-indigo-500 bg-indigo-500/10 px-3 py-1.5 rounded-lg uppercase tracking-widest border border-indigo-500/20 shrink-0">{post.id.substring(0,8)}</span>
                      <span className={`text-[11px] font-semibold flex items-center gap-1.5 truncate ${textSecondary}`}><Package size={14} className="shrink-0"/> <span className="truncate">{post.commodity}</span></span>
                    </div>
                    <h4 className={`text-base sm:text-lg font-bold flex items-center gap-3 ${textPrimary} flex-wrap`}>{post.origin} <ArrowRight size={16} className={`shrink-0 ${textSecondary}`}/> {post.destination}</h4>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-5 border-t sm:border-none border-inherit pt-4 sm:pt-0 shrink-0">
                    <div className="text-left sm:text-right flex flex-col items-start sm:items-end">
                      <p className="text-[9px] uppercase font-bold tracking-widest text-slate-400 mb-0.5">Budget Spent</p>
                      <p className="text-lg sm:text-xl font-bold text-indigo-500 mb-1 whitespace-nowrap">TZS {post.price.toLocaleString()}</p>
                      <span className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 whitespace-nowrap ${post.status === 'pending' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : post.status === 'in_transit' ? 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20' : post.status === 'pending_approval' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}>
                        {post.status === 'pending' ? 'Sokoni' : post.status === 'in_transit' ? t.inTransit : post.status === 'pending_approval' ? t.pendingApproval : t.delivered}
                      </span>
                    </div>
                    {post.status === 'pending' && <button onClick={(e) => { e.preventDefault(); setDeleteModalId(post.id); }} className={`p-3 rounded-xl transition-colors ${isDark ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}><Trash2 size={18} /></button>}
                  </div>
                </div>
                
                {/* DEDICATED TRACK CARGO BUTTON (No Card Clicking) */}
                <div className="mt-5 pt-4 border-t border-inherit flex items-center justify-between">
                   <p className={`text-[10px] font-medium ${textSecondary}`}>Tap to view live telemetry map</p>
                   <button onClick={(e) => { e.preventDefault(); setActiveTrackingLoad(post); setIsRightSidebarOpen(true); }} className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-colors shadow-sm active:scale-95 ${activeTrackingLoad?.id === post.id ? 'bg-indigo-600 text-white' : 'bg-indigo-500 text-white hover:bg-indigo-400'}`}>
                     <Navigation size={14} /> Track Cargo
                   </button>
                </div>
              </div>
            </div>
          )) : (
            <div className={`p-12 sm:p-16 rounded-[3rem] text-center border border-dashed ${isDark ? 'bg-black/20 border-white/10' : 'bg-white/50 border-slate-300'}`}>
               <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm ${isDark ? 'bg-indigo-500/10 border border-indigo-500/20' : 'bg-indigo-50 border border-indigo-100'}`}><Package size={36} className="text-indigo-500" /></div>
               <p className={`font-bold text-sm ${textPrimary}`}>{t.noActiveTrack}</p>
            </div>
          )}
        </div>
      </div>

      <div className={`w-full lg:w-[420px] shrink-0 flex-col lg:sticky lg:top-6 ${isRightSidebarOpen ? 'flex' : 'hidden'} ${activeTrackingLoad ? 'block' : 'hidden lg:flex'}`}>
         {activeTrackingLoad ? (
           <div className={`p-6 sm:p-8 rounded-[2rem] w-full ${glassCard}`}>
             <div className="flex items-center justify-between mb-6 pb-5 border-b border-inherit">
               <span className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 ${textPrimary}`}><Activity size={16} className="text-indigo-500"/> {t.trackFleet}</span>
               {/* STRICT PREVENT DEFAULT TO STOP BUBBLING */}
               <button onClick={(e) => { e.preventDefault(); setActiveTrackingLoad(null); }} className={`text-[9px] font-bold uppercase tracking-widest text-slate-400 hover:text-indigo-500 bg-indigo-500/5 px-3 py-2 rounded-lg transition-colors hidden lg:block`}>{t.clear}</button>
             </div>
             
             <button onClick={(e) => { e.preventDefault(); setActiveTrackingLoad(null); }} className="lg:hidden mb-6 w-full py-4 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px] rounded-xl flex justify-center gap-2 active:scale-95">
                <ArrowLeft size={16} /> Back to List
             </button>

             <div className={`p-5 rounded-2xl border mb-6 ${innerCard}`}>
               <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${textSecondary}`}>{t.routeDetails}</p>
               <p className={`text-lg font-bold ${textPrimary}`}>{activeTrackingLoad?.origin} <ArrowRight size={14} className="inline mx-2 text-indigo-500"/> {activeTrackingLoad?.destination}</p>
               <p className={`text-xs font-medium mt-2 ${textSecondary}`}>{activeTrackingLoad?.commodity} • {activeTrackingLoad?.weight}</p>
             </div>
             <div className="mb-6"><RouteVisualizer origin={activeTrackingLoad.origin} dest={activeTrackingLoad.destination} status={activeTrackingLoad.status} /></div>
             
             <div className={`p-6 rounded-2xl relative border mt-6 ${innerCard}`}>
                <div className={`absolute left-[39px] top-10 bottom-10 w-0.5 ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />
                <div className="space-y-6 relative z-10">
                  {['Searching Network', 'Dispatched', 'In Transit', 'Awaiting POD', 'Delivered'].map((label, i) => {
                    const statusLevel = activeTrackingLoad.status === 'completed' ? 4 : activeTrackingLoad.status === 'pending_approval' ? 3 : activeTrackingLoad.status === 'in_transit' ? 2 : activeTrackingLoad.status === 'pending' ? 0 : 1;
                    const isActive = statusLevel >= i;
                    const isDone = statusLevel > i || activeTrackingLoad.status === 'completed';
                    return (
                      <div key={i} className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 ${isDark ? 'border-[#131826]' : 'border-white'} transition-colors ${isDone ? 'bg-indigo-500 text-white' : isActive ? 'bg-indigo-500/20 border-indigo-500 text-indigo-500' : (isDark ? 'bg-white/10 text-slate-600' : 'bg-slate-200 text-slate-400')}`}>
                          {isDone ? <Check size={12} /> : <Circle size={6} className="fill-current" />}
                        </div>
                        <h4 className={`text-[11px] font-bold uppercase tracking-widest ${isActive ? textPrimary : textSecondary}`}>{label}</h4>
                      </div>
                    )
                  })}
                </div>
                {activeTrackingLoad.status === 'pending_approval' && (
                  <div className={`mt-8 pt-6 border-t ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                    <button onClick={(e) => { e.preventDefault(); setPodModalUrl(activeTrackingLoad.pod_url); }} className="w-full py-4 bg-green-500 hover:bg-green-600 shadow-md text-white rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95"><FileCheck size={16} /> {t.viewPOD}</button>
                  </div>
                )}
             </div>
           </div>
         ) : (
           <div className={`p-6 sm:p-8 rounded-[2rem] w-full ${glassCard}`}>
             <div className="flex items-center justify-between mb-5 border-b border-inherit pb-4">
               <h3 className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 ${textSecondary}`}><Activity size={14}/> Fleet Summary</h3>
             </div>
             <div className="grid grid-cols-2 gap-4 mb-6">
                <div className={`p-4 rounded-2xl border text-center ${innerCard}`}><p className={`text-2xl font-bold ${textPrimary}`}>{postings.filter(p => p.status !== 'completed').length}</p><p className={`text-[9px] font-bold uppercase tracking-widest mt-1.5 ${textSecondary}`}>Active Loads</p></div>
                <div className={`p-4 rounded-2xl border text-center ${innerCard}`}><p className={`text-2xl font-bold ${textPrimary}`}>{postings.filter(p => p.status === 'completed').length}</p><p className={`text-[9px] font-bold uppercase tracking-widest mt-1.5 ${textSecondary}`}>Completed</p></div>
             </div>
             <div className={`p-6 rounded-2xl border border-dashed text-center flex flex-col items-center justify-center ${isDark ? 'bg-black/20 border-white/10' : 'bg-white/50 border-slate-300'}`}>
               <div className={`w-12 h-12 rounded-full mb-3 flex items-center justify-center ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}><MapIcon size={20} className={`opacity-50 ${textSecondary}`} /></div>
               <p className={`text-[10px] font-medium leading-relaxed ${textSecondary}`}>{t.selectShipment}</p>
             </div>
           </div>
         )}
      </div>

      {/* PORTALS FOR 100% BLACKOUT MODALS */}
      <ModalPortal>
        <AnimatePresence>
          {showWizard && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto`}>
              <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto hide-scrollbar rounded-[2.5rem] border shadow-2xl relative ${isDark ? 'bg-[#080b1a] border-white/10' : 'bg-white border-slate-200'}`}>
                 <div className="absolute top-5 right-5 z-50">
                   <button onClick={closeWizard} className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors border shadow-sm ${isDark ? 'bg-[#131826] border-white/10 text-white hover:bg-white/10' : 'bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200'}`}><X size={16}/></button>
                 </div>

                 {postStatus === 'loading' ? (
                    <div className="p-16 text-center flex flex-col items-center justify-center min-h-[350px]">
                      <Loader2 size={36} className="text-indigo-500 animate-spin mb-6" />
                      <h3 className={`text-xl font-bold ${textPrimary}`}>{t.registering}</h3>
                    </div>
                 ) : postStatus === 'success' ? (
                    <div className="p-16 text-center flex flex-col items-center justify-center min-h-[350px]">
                      <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 shadow-inner border border-green-500/30">
                         <Check size={36} className="text-green-500" />
                      </div>
                      <h3 className={`text-2xl font-bold mb-3 ${textPrimary}`}>Shipment Live!</h3>
                      <p className={`text-sm mb-8 ${textSecondary}`}>Your load has been successfully broadcasted.</p>
                      <button onClick={closeWizard} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md active:scale-95 text-xs uppercase tracking-widest transition-all">Done</button>
                    </div>
                 ) : (
                    <>
                     <div className="p-6 sm:p-8 border-b border-inherit bg-black/5 dark:bg-white/5">
                       <h3 className={`text-xl font-bold pr-10 ${textPrimary}`}>{postStep === 1 ? t.serviceTitle : postStep === 2 ? t.equipTitle : t.detailsTitle}</h3>
                       <p className={`text-[11px] sm:text-xs font-medium mt-1 ${textSecondary}`}>{postStep === 1 ? t.serviceSub : postStep === 2 ? t.equipSub : t.detailsSub}</p>
                     </div>
                     
                     <div className="p-6 sm:p-8">
                       <AnimatePresence mode="wait">
                         {postStep === 1 ? (
                           <motion.div key="step1" initial={{opacity: 0, x: 20}} animate={{opacity: 1, x: 0}} exit={{opacity: 0, x: -20}} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                             {serviceTypes.map((srv) => (
                               <div key={srv.id} onClick={() => { setFormData({...formData, serviceType: srv.title}); setPostStep(2); }} className={`p-5 rounded-2xl border cursor-pointer transition-all hover:-translate-y-1 ${isDark ? 'bg-white/[0.02] border-white/5 hover:border-indigo-500/50' : 'bg-slate-50 border-slate-200 hover:border-indigo-500/50 shadow-sm'}`}>
                                 <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${isDark ? 'bg-white/5 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>{srv.icon}</div>
                                 <h4 className={`text-base font-bold mb-1 ${textPrimary}`}>{srv.title}</h4>
                                 <p className={`text-[10px] font-medium ${textSecondary}`}>{srv.desc}</p>
                               </div>
                             ))}
                           </motion.div>
                         ) : postStep === 2 ? (
                           <motion.div key="step2" initial={{opacity: 0, x: 20}} animate={{opacity: 1, x: 0}} exit={{opacity: 0, x: -20}} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                             {equipmentTypes.map((equip) => (
                               <div key={equip.id} onClick={() => { setFormData({...formData, truckType: equip.id}); setPostStep(3); }} className={`p-4 rounded-2xl border cursor-pointer transition-all hover:-translate-y-1 ${isDark ? 'bg-white/[0.02] border-white/5 hover:border-indigo-500/50' : 'bg-slate-50 border-slate-200 hover:border-indigo-500/50 shadow-sm'}`}>
                                 <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${isDark ? 'bg-white/5 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>{equip.icon}</div>
                                 <h4 className={`text-sm font-bold mb-1 ${textPrimary}`}>{equip.title}</h4>
                                 <p className={`text-[10px] font-medium ${textSecondary}`}>{equip.desc}</p>
                               </div>
                             ))}
                             <div className="col-span-1 sm:col-span-2 pt-2">
                                <button onClick={() => setPostStep(1)} className="text-[10px] font-bold text-slate-400 hover:text-indigo-500 uppercase tracking-widest transition-colors"><ArrowLeft size={14} className="inline mr-1.5"/> {t.backStep}</button>
                             </div>
                           </motion.div>
                         ) : (
                           <motion.div key="step3" initial={{opacity: 0, x: 20}} animate={{opacity: 1, x: 0}} exit={{opacity: 0, x: -20}}>
                             <form onSubmit={handlePostLoad} className="space-y-4">
                               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                 <div><label className={`block text-[9px] font-bold mb-1.5 uppercase tracking-widest ${textSecondary}`}>{t.origin}</label><input required type="text" placeholder="e.g. Dar es Salaam" value={formData.origin} onChange={e => setFormData({...formData, origin: e.target.value})} className={`w-full p-3 rounded-xl border focus:outline-none text-xs font-bold transition-colors ${isDark ? 'bg-black/40 border-white/10 text-white focus:border-indigo-500' : 'bg-white border-slate-200 text-slate-900 focus:border-indigo-500 shadow-sm'}`} /></div>
                                 <div><label className={`block text-[9px] font-bold mb-1.5 uppercase tracking-widest ${textSecondary}`}>{t.dest}</label><input required type="text" placeholder="e.g. Nairobi" value={formData.dest} onChange={e => setFormData({...formData, dest: e.target.value})} className={`w-full p-3 rounded-xl border focus:outline-none text-xs font-bold transition-colors ${isDark ? 'bg-black/40 border-white/10 text-white focus:border-indigo-500' : 'bg-white border-slate-200 text-slate-900 focus:border-indigo-500 shadow-sm'}`} /></div>
                               </div>
                               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                 <div><label className={`block text-[9px] font-bold mb-1.5 uppercase tracking-widest ${textSecondary}`}>{t.commodity}</label><input required type="text" placeholder="e.g. Electronics" value={formData.commodity} onChange={e => setFormData({...formData, commodity: e.target.value})} className={`w-full p-3 rounded-xl border focus:outline-none text-xs font-bold transition-colors ${isDark ? 'bg-black/40 border-white/10 text-white focus:border-indigo-500' : 'bg-white border-slate-200 text-slate-900 focus:border-indigo-500 shadow-sm'}`} /></div>
                                 <div><label className={`block text-[9px] font-bold mb-1.5 uppercase tracking-widest ${textSecondary}`}>{t.weight}</label><input required type="text" placeholder="e.g. 15 Tons" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} className={`w-full p-3 rounded-xl border focus:outline-none text-xs font-bold transition-colors ${isDark ? 'bg-black/40 border-white/10 text-white focus:border-indigo-500' : 'bg-white border-slate-200 text-slate-900 focus:border-indigo-500 shadow-sm'}`} /></div>
                               </div>
                               
                               <div className={`p-4 rounded-2xl border ${isDark ? 'bg-black/40 border-white/10' : 'bg-slate-50 border-slate-200 shadow-sm'}`}>
                                  <label className={`block text-[9px] font-bold mb-2 uppercase tracking-widest ${textSecondary}`}>Total Shipment Budget (TZS)</label>
                                  <input required type="text" placeholder="e.g. 1,500,000" value={formData.price} onChange={handlePriceChange} className={`w-full p-3 rounded-xl border focus:outline-none text-lg tracking-tight font-bold text-indigo-500 transition-colors mb-2 ${isDark ? 'bg-[#0B0F19] border-white/10 focus:border-indigo-500' : 'bg-white border-slate-200 focus:border-indigo-500 shadow-sm'}`} />
                                  <p className={`text-[9px] font-medium ${textSecondary}`}>This is the total amount you will pay. All fees are included.</p>
                               </div>

                               <div className="pt-2 flex gap-3">
                                 <button type="button" onClick={() => setPostStep(2)} className={`px-6 py-3 rounded-xl border font-bold text-[10px] uppercase tracking-widest transition-all ${isDark ? 'bg-white/5 hover:bg-white/10 text-white' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-900 shadow-sm'}`}>{t.backStep}</button>
                                 <button type="submit" className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md active:scale-95 text-[10px] uppercase tracking-widest transition-all">{t.submitFreight}</button>
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

        <AnimatePresence>
          {deleteModalId && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
               <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} className={`w-full max-w-sm overflow-hidden rounded-[2.5rem] border shadow-2xl p-10 text-center ${isDark ? 'bg-[#080b1a] border-white/10' : 'bg-white border-slate-200'}`}>
                  <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6"><Trash2 size={32} className="text-red-500" /></div>
                  <h3 className={`text-2xl font-bold mb-3 ${textPrimary}`}>{t.deleteTitle}</h3>
                  <p className={`text-sm mb-8 ${textSecondary}`}>{t.deleteMsg}</p>
                  <div className="flex items-center gap-4">
                     <button onClick={() => setDeleteModalId(null)} className={`flex-1 py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-colors ${isDark ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'}`}>{t.deny}</button>
                     <button onClick={confirmDeleteLoad} className="flex-1 py-4 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-[10px] uppercase tracking-widest transition-colors shadow-md">Yes</button>
                  </div>
               </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {podModalUrl && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
               <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} className={`w-full max-w-2xl overflow-hidden rounded-[2.5rem] border shadow-2xl p-8 text-center ${isDark ? 'bg-[#080b1a] border-white/10' : 'bg-white border-slate-200'}`}>
                  <div className="flex justify-between items-center mb-6 border-b border-inherit pb-4">
                    <h3 className={`text-xl font-bold ${textPrimary}`}>Proof of Delivery</h3>
                    <button onClick={() => setPodModalUrl(null)} className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isDark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'}`}><X size={18}/></button>
                  </div>
                  <div className={`w-full h-96 rounded-2xl mb-8 overflow-hidden border flex items-center justify-center ${isDark ? 'bg-black/50 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                     <img src={podModalUrl} alt="POD" className="object-contain w-full h-full" />
                  </div>
                  <button onClick={approvePayout} className="w-full py-5 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-bold uppercase tracking-widest text-xs transition-all shadow-lg flex justify-center items-center gap-3 active:scale-95">
                    <CheckCircle2 size={20} /> {t.approvePayout}
                  </button>
               </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </ModalPortal>
    </motion.div>
  );
}