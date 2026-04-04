// components/dashboard/RouteVisualizer.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Truck } from 'lucide-react';

interface RouteVisualizerProps {
  origin: string;
  dest: string;
  status: string;
}

export default function RouteVisualizer({ origin, dest, status }: RouteVisualizerProps) {
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
}