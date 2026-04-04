// components/dashboard/CargoView.tsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Package, ArrowRight, Trash2, Map as MapIcon, Loader2, Check, X, Info, ArrowLeft, Activity, Circle, CheckCircle2, FileCheck, Wallet, Truck, Layers, Box, Snowflake } from 'lucide-react';
import RouteVisualizer from './RouteVisualizer';

interface CargoViewProps {
  t: any;
  isDark: boolean;
  profile: any;
  triggerToast: (msg: string) => void;
  addNotification: (title: string, desc: string, type: 'success' | 'info' | 'system') => void;
  isRightSidebarOpen: boolean;
}

const serviceTypes = [{ id: 'FTL', icon: <Truck size={24} />, title: 'Full truckload (FTL)', desc: 'Best for shipments that fill an entire truck.' }, { id: 'LTL', icon: <Layers size={24} />, title: 'Less-than-truckload (LTL)', desc: 'Best for shipments under 12 pallets.' }];
const equipmentTypes = [{ id: 'Flatbed', icon: <Truck size={20} />, title: 'Flatbed', desc: 'Standard open trailer.' }, { id: 'Dry Van', icon: <Box size={20} />, title: 'Dry Van', desc: 'Enclosed cargo area.' }, { id: 'Tipper', icon: <Truck size={20} />, title: 'Tipper', desc: 'Bulk loose materials.' }, { id: 'Refrigerated', icon: <Snowflake size={20} />, title: 'Refrigerated', desc: 'Temperature controlled.' }];

const transitionEase = [0.16, 1, 0.3, 1];
const viewVar = { hidden: { opacity: 0, scale: 0.98 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: transitionEase } }, exit: { opacity: 0, scale: 0.98, transition: { duration: 0.2 } } };
const stepVar = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 20, stiffness: 100 } } };

export default function CargoView({ t, isDark, profile, triggerToast, addNotification, isRightSidebarOpen }: CargoViewProps) {
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

      {!activeTrackingLoad && isRightSidebarOpen && (
        <div className="hidden lg:flex flex-col shrink-0 overflow-hidden box-content h-full">
           <CargoRightSidebar />
        </div>
      )}

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
}