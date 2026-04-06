// components/dashboard/DriverView.tsx
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Truck, MapPin, Package, ArrowRight, Wallet, Radar, Camera, Loader2, ArrowLeft, UploadCloud, X, Zap, Navigation } from 'lucide-react';
import RouteVisualizer from './RouteVisualizer';

interface DriverViewProps { t: any; lang: string; isDark: boolean; profile: any; triggerToast: (msg: string) => void; addNotification: (title: string, desc: string, type: 'success' | 'info' | 'system') => void; isRightSidebarOpen: boolean; setIsRightSidebarOpen: (val: boolean) => void; }

const ModalPortal = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted || typeof document === 'undefined') return null;
  return createPortal(children, document.body);
};

export default function DriverView({ t, lang, isDark, profile, triggerToast, addNotification, isRightSidebarOpen, setIsRightSidebarOpen }: DriverViewProps) {
  const [mounted, setMounted] = useState(false);
  const [activeLoad, setActiveLoad] = useState<any>(null); 
  const [availableLoads, setAvailableLoads] = useState<any[]>([]);
  const [isOnline, setIsOnline] = useState(false);
  const [showGpsConfirm, setShowGpsConfirm] = useState(false);
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
    setMounted(true);
    fetchLoads();
    const channel = supabase.channel('driver_market')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'shipments' }, payload => {
        if (payload.new.status === 'pending') { triggerToast(t.newLoadAlert); setAvailableLoads(prev => [payload.new, ...prev]); }
      }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [lang]);

  const handleAcceptLoad = async () => {
    if (!loadToBook) return;
    const { error } = await supabase.from('shipments').update({ driver_id: profile.id, status: 'in_transit' }).eq('id', loadToBook.id);
    if (!error) { setActiveLoad({...loadToBook, status: 'in_transit'}); setLoadToBook(null); triggerToast("Load Booked Successfully!"); }
  };

  const confirmGPS = () => {
    setShowGpsConfirm(false);
    if (typeof window === 'undefined' || !navigator?.geolocation) return alert(t.gpsError);
    setIsOnline(true); 
    triggerToast("GPS Connected. You are visible to Shippers.");
    watchIdRef.current = navigator.geolocation.watchPosition(
      async (pos) => { await supabase.from('driver_locations').upsert({ driver_id: profile.id, latitude: pos.coords.latitude, longitude: pos.coords.longitude }); },
      (err) => { alert(t.gpsError); setIsOnline(false); }, { enableHighAccuracy: true }
    );
  };

  const handleToggleGPS = () => {
    if (isOnline) {
      setIsOnline(false); 
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
      triggerToast("Offline. GPS Disconnected.");
    } else {
      setShowGpsConfirm(true);
    }
  };

  const submitPOD = async (e: React.FormEvent) => {
    e.preventDefault(); if (!podFile || !activeLoad) return; setIsUploading(true);
    try {
      const path = `${activeLoad.id}-pod.${podFile.name.split('.').pop()}`; 
      const { error: uploadErr } = await supabase.storage.from('shipment_docs').upload(path, podFile);
      if (uploadErr) throw new Error(`Storage Error: ${uploadErr.message}`);
      const podUrl = supabase.storage.from('shipment_docs').getPublicUrl(path).data.publicUrl;
      const { error: dbError } = await supabase.from('shipments').update({ status: 'pending_approval', pod_url: podUrl }).eq('id', activeLoad.id);
      if (dbError) throw new Error(`Database Error: ${dbError.message}`);
      setActiveLoad({...activeLoad, status: 'pending_approval', pod_url: podUrl}); setShowPodModal(false); triggerToast("POD Uploaded. Awaiting Payout."); 
    } catch (err: any) {
      alert(err.message || "Failed to upload document. Please try again.");
    } finally { setIsUploading(false); }
  };

  return (
    <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="w-full flex flex-col gap-6 mt-2 lg:mt-6 pb-10">
      
      {!activeLoad && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className={`p-6 sm:p-8 flex flex-col justify-center rounded-[2rem] ${glassCard}`}>
             <div className="flex items-center gap-3 mb-2"><div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center"><Wallet size={16} className="text-green-500" /></div><h3 className={`text-[10px] font-bold uppercase tracking-widest ${textSecondary}`}>{t.wallet} Balance</h3></div>
             <p className={`text-3xl font-bold tracking-tight ${textPrimary}`}>0.00 <span className={`text-sm font-medium ${textSecondary}`}>TZS</span></p>
          </div>

          <div className={`p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 rounded-[2rem] ${glassCard}`}>
             <div>
               <h3 className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 mb-2 ${textSecondary}`}><Radar size={14}/> GPS Telemetry</h3>
               {isOnline ? (
                 <p className="text-lg font-bold text-orange-500 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" /> Transmitting Live</p>
               ) : (
                 <p className={`text-lg font-bold ${textPrimary}`}>System Offline</p>
               )}
               <p className={`text-xs mt-1 font-medium ${textSecondary}`}>Turn on to receive live local dispatches.</p>
             </div>
             <button onClick={(e) => { e.preventDefault(); handleToggleGPS(); }} className={`px-6 py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-md active:scale-95 whitespace-nowrap ${isOnline ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-orange-600 text-white hover:bg-orange-500'}`}>
               {isOnline ? 'Go Offline' : 'Go Online'}
             </button>
          </div>
        </div>
      )}

      {activeLoad ? (
         <div className={`p-6 sm:p-10 rounded-[2rem] w-full ${glassCard}`}>
            <div className="flex items-center justify-between mb-8 border-b border-inherit pb-6">
               <h3 className="text-2xl font-bold flex items-center gap-3 text-orange-500"><Truck size={28} /> Active Dispatch</h3>
               <span className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-sm ${activeLoad?.status === 'in_transit' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/30' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/30'}`}>
                 {activeLoad?.status === 'in_transit' ? t.inTransit : t.pendingApproval}
               </span>
            </div>
            
            <div className={`p-6 rounded-2xl border mb-8 ${innerCard}`}>
              <p className={`text-xs font-bold uppercase tracking-widest mb-3 ${textSecondary}`}>Active Route</p>
              <p className={`text-2xl font-bold ${textPrimary} flex-wrap flex items-center mb-3`}>{activeLoad?.origin} <ArrowRight className="inline mx-4 text-orange-500 shrink-0" size={20}/> {activeLoad?.destination}</p>
              <div className="flex items-center gap-4 pt-4 border-t border-inherit">
                 <p className={`text-sm font-medium ${textSecondary}`}>{activeLoad?.commodity} • {activeLoad?.weight}</p>
                 {/* DRIVER SEES EXACTLY 80% PAYOUT */}
                 <p className="text-lg font-bold text-green-500">Payout: TZS {(activeLoad?.price * 0.80).toLocaleString()}</p>
              </div>
            </div>
            
            <div className="mb-10"><RouteVisualizer origin={activeLoad?.origin} dest={activeLoad?.destination} status={activeLoad?.status} /></div>
            
            {activeLoad?.status === 'in_transit' ? (
              <button onClick={(e) => { e.preventDefault(); setShowPodModal(true); }} className="w-full py-5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white flex items-center justify-center gap-3 transition-all shadow-xl font-bold active:scale-95 text-xs uppercase tracking-widest">
                  <Camera size={20} /> {t.uploadDocs}
              </button>
            ) : (
              <div className="w-full py-5 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 flex items-center justify-center gap-3 font-bold text-xs uppercase tracking-widest">
                  <Loader2 size={20} className="animate-spin" /> Awaiting Shipper Approval
              </div>
            )}
         </div>
      ) : (
         <div className={`flex-1 w-full p-6 sm:p-8 ${glassCard}`}>
            <div className={`mb-6 p-4 rounded-2xl flex items-center gap-4 border overflow-hidden ${innerCard}`}>
               <Zap size={16} className="text-orange-500 animate-pulse shrink-0" />
               <div className="flex items-center gap-8 whitespace-nowrap overflow-x-auto hide-scrollbar">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Loads Today: <span className={textPrimary}>142</span></span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Drivers Online: <span className={textPrimary}>89</span></span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Active Lanes: <span className={textPrimary}>Dar - Nairobi</span></span>
               </div>
            </div>

            <div className="flex items-center justify-between mb-6 sm:mb-8 pb-5 border-b border-inherit">
              <div>
                <h3 className={`text-xl sm:text-2xl font-bold tracking-tight ${textPrimary}`}>{t.marketTitle}</h3>
              </div>
              <span className="px-3 py-1.5 bg-orange-500/10 text-orange-500 border border-orange-500/30 rounded-lg text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-sm whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"/> Live
              </span>
            </div>

            <div className="space-y-4">
              {availableLoads.length > 0 ? availableLoads.map((load) => (
                <div key={load.id} className={`p-5 sm:p-6 rounded-2xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-5 border hover:shadow-md ${innerCard}`}>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[9px] font-bold uppercase tracking-widest text-orange-500 bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-md shrink-0`}>{load.id.substring(0,8)}</span>
                      <div className={`flex items-center gap-1.5 text-[10px] font-semibold truncate ${textSecondary}`}><Package size={12} className="text-orange-500 shrink-0"/> <span className="truncate">{load.commodity} • {load.weight}</span></div>
                    </div>
                    <div className={`flex items-center gap-3 font-bold text-base sm:text-lg ${textPrimary} flex-wrap`}>{load.origin} <ArrowRight size={16} className={`shrink-0 ${textSecondary}`} /> {load.destination}</div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 sm:gap-6 border-t sm:border-none border-inherit pt-4 sm:pt-0 shrink-0">
                    <div className="text-left sm:text-right">
                      <p className={`text-[9px] uppercase font-bold tracking-widest mb-0.5 ${textSecondary}`}>{t.payout}</p>
                      <p className="text-lg sm:text-2xl font-bold text-green-500 whitespace-nowrap">TZS {(load.price * 0.80).toLocaleString()}</p>
                    </div>
                    <button onClick={(e) => { e.preventDefault(); setLoadToBook(load); }} className="px-6 py-3.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl text-[10px] uppercase tracking-widest transition-all shadow-sm active:scale-95 whitespace-nowrap">{t.acceptBtn}</button>
                  </div>
                </div>
              )) : (
                <div className={`p-12 sm:p-16 rounded-[3rem] text-center border border-dashed ${isDark ? 'bg-black/20 border-white/10' : 'bg-white/50 border-slate-300'}`}>
                   <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm ${isDark ? 'bg-orange-500/10 border border-orange-500/20' : 'bg-orange-50 border border-orange-100'}`}><Truck size={36} className="text-orange-500" /></div>
                   <p className={`font-bold text-sm ${textPrimary}`}>{t.noLoads}</p>
                </div>
              )}
            </div>
         </div>
      )}

      {/* PORTALS FOR MODALS */}
      <ModalPortal>
        <AnimatePresence>
          {showGpsConfirm && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                 <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} className={`w-full max-w-sm rounded-[2.5rem] border shadow-2xl p-10 text-center ${isDark ? 'bg-[#080b1a] border-white/10' : 'bg-white border-slate-200'}`}>
                    <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-6"><Navigation size={32} className="text-orange-500" /></div>
                    <h3 className={`text-2xl font-bold mb-3 ${textPrimary}`}>Enable GPS?</h3>
                    <p className={`text-sm mb-10 leading-relaxed ${textSecondary}`}>Geek Logistics needs access to your live location to match you with nearby dispatches. Do you accept?</p>
                    <div className="flex items-center gap-4">
                       <button onClick={() => setShowGpsConfirm(false)} className={`flex-1 py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-colors ${isDark ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'}`}>Cancel</button>
                       <button onClick={confirmGPS} className="flex-1 py-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-[10px] uppercase tracking-widest transition-colors shadow-md active:scale-95">Yes, Allow</button>
                    </div>
                 </motion.div>
             </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {loadToBook && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                 <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} className={`w-full max-w-md rounded-[2.5rem] border shadow-2xl p-10 text-center ${isDark ? 'bg-[#080b1a] border-white/10' : 'bg-white border-slate-200'}`}>
                    <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-6"><Truck size={32} className="text-orange-500" /></div>
                    <h3 className={`text-2xl font-bold mb-3 ${textPrimary}`}>Confirm Booking</h3>
                    <p className={`text-sm mb-10 leading-relaxed ${textSecondary}`}>Book Load <span className="font-bold text-orange-500">#{loadToBook.id.substring(0,8)}</span> for <span className="font-bold text-green-500">TZS {(loadToBook.price * 0.80).toLocaleString()}</span>?</p>
                    <div className="flex items-center gap-4">
                       <button onClick={() => setLoadToBook(null)} className={`flex-1 py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-colors ${isDark ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'}`}>Cancel</button>
                       <button onClick={handleAcceptLoad} className="flex-1 py-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-[10px] uppercase tracking-widest transition-colors shadow-md active:scale-95">Yes, Book</button>
                    </div>
                 </motion.div>
              </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showPodModal && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                 <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} className={`w-full max-w-sm overflow-hidden rounded-[2.5rem] border shadow-2xl p-8 text-center ${isDark ? 'bg-[#080b1a] border-white/10' : 'bg-white border-slate-200'}`}>
                    <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-6"><UploadCloud size={32} className="text-orange-500" /></div>
                    <h3 className={`text-2xl font-bold mb-3 ${textPrimary}`}>{t.uploadPodTitle}</h3>
                    <p className={`text-xs mb-8 ${textSecondary}`}>{t.uploadPodSub}</p>
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
      </ModalPortal>
    </motion.div>
  );
}