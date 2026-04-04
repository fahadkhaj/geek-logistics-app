// components/dashboard/DriverView.tsx
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, MapPin, Package, ArrowRight, Wallet, Radar, Camera, Loader2, ArrowLeft, UploadCloud, X } from 'lucide-react';
import RouteVisualizer from './RouteVisualizer';

interface DriverViewProps {
  t: any;
  lang: string;
  isDark: boolean;
  profile: any;
  triggerToast: (msg: string) => void;
  addNotification: (title: string, desc: string, type: 'success' | 'info' | 'system') => void;
  isRightSidebarOpen: boolean;
  setIsRightSidebarOpen: (val: boolean) => void;
}

const transitionEase = [0.16, 1, 0.3, 1];
const viewVar = { hidden: { opacity: 0, scale: 0.98 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: transitionEase } }, exit: { opacity: 0, scale: 0.98, transition: { duration: 0.2 } } };

export default function DriverView({ t, lang, isDark, profile, triggerToast, addNotification, isRightSidebarOpen, setIsRightSidebarOpen }: DriverViewProps) {
  const [activeLoad, setActiveLoad] = useState<any>(null); 
  const [availableLoads, setAvailableLoads] = useState<any[]>([]);
  const [isOnline, setIsOnline] = useState(false);
  const [showPodModal, setShowPodModal] = useState(false);
  const [podFile, setPodFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [loadToBook, setLoadToBook] = useState<any>(null);
  const watchIdRef = useRef<number | null>(null);

  const textPrimary = isDark ? "text-white" : "text-slate-900";
  const textSecondary = isDark ? "text-slate-400" : "text-slate-500";
  const glassCard = isDark ? "bg-[#131826]/70 border border-white/10 backdrop-blur-3xl shadow-xl rounded-3xl" : "bg-white/90 border border-slate-200 backdrop-blur-3xl shadow-lg shadow-slate-200/30 rounded-3xl";
  const innerCard = isDark ? "bg-white/[0.03] border border-white/10 hover:bg-white/[0.05]" : "bg-slate-50/80 border border-slate-200/80 hover:bg-white shadow-sm";

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
          triggerToast(t.newLoadAlert); 
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

  // FIXED: Removed the Unsplash Image Hack and added proper try/catch throwing
  const submitPOD = async (e: React.FormEvent) => {
    e.preventDefault(); 
    if (!podFile || !activeLoad) return; 
    setIsUploading(true);
    
    try {
      const path = `${activeLoad.id}-pod.${podFile.name.split('.').pop()}`; 
      const { error: uploadErr } = await supabase.storage.from('shipment_docs').upload(path, podFile);
      
      if (uploadErr) throw new Error(`Storage Error: ${uploadErr.message}`);
      
      const podUrl = supabase.storage.from('shipment_docs').getPublicUrl(path).data.publicUrl;
      
      const { error: dbError } = await supabase.from('shipments').update({ status: 'pending_approval', pod_url: podUrl }).eq('id', activeLoad.id);
      
      if (dbError) throw new Error(`Database Error: ${dbError.message}`);

      setActiveLoad({...activeLoad, status: 'pending_approval', pod_url: podUrl}); 
      setShowPodModal(false); 
      triggerToast("POD Uploaded. Awaiting Payout."); 
      addNotification("POD Uploaded", "Awaiting shipper approval for payout.", "info");
      
    } catch (err: any) {
      console.error("Upload process failed:", err);
      alert(err.message || "Failed to upload document. Please try again.");
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

      {!activeLoad && isRightSidebarOpen && (
        <div className="hidden lg:flex flex-col shrink-0 overflow-hidden box-content h-full">
           <DriverRightSidebar />
        </div>
      )}

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
}