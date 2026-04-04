// components/dashboard/CommunityView.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Send, Users, MapPin, Star } from 'lucide-react';

interface CommunityViewProps {
  t: any;
  isDark: boolean;
  isCargoMode: boolean;
  profile: any;
  triggerToast: (msg: string) => void;
  addNotification: (title: string, desc: string, type: 'success' | 'info' | 'system') => void;
}

const initialFeed = [
  { id: 1, user: "Alpha Logistics", role: "Cargo Owner", time: "10 min ago", content: "Need a 30T Flatbed from Dar es Salaam to Nairobi urgently. High-priority shipment." },
  { id: 2, user: "Peter Waweru", role: "Transporter", time: "25 min ago", content: "Empty 20T Dry Van in Nairobi, available for immediate dispatch." }
];

const mockNetwork = [
  { id: 1, name: "Juma Kassim", role: "Transporter", rating: 4.9, online: true, location: "Arusha" },
  { id: 2, name: "Alpha Logistics", role: "Cargo Owner", rating: 4.8, online: true, location: "Dar es Salaam" },
  { id: 3, name: "Peter Waweru", role: "Transporter", rating: 4.5, online: false, location: "Nairobi" },
  { id: 4, name: "Aisha M.", role: "Transporter", rating: 5.0, online: true, location: "Dodoma" },
];

const transitionEase = [0.16, 1, 0.3, 1];
const viewVar = { hidden: { opacity: 0, scale: 0.98 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: transitionEase } }, exit: { opacity: 0, scale: 0.98, transition: { duration: 0.2 } } };

export default function CommunityView({ t, isDark, isCargoMode, profile, triggerToast, addNotification }: CommunityViewProps) {
  const [feed, setFeed] = useState<any[]>([]); 
  const [newPost, setNewPost] = useState("");
  const [replies, setReplies] = useState<{ [postId: number]: string }>({});

  const textPrimary = isDark ? "text-white" : "text-slate-900";
  const textSecondary = isDark ? "text-slate-400" : "text-slate-500";
  const glassCard = isDark ? "bg-[#131826]/70 border border-white/10 backdrop-blur-3xl shadow-xl rounded-3xl" : "bg-white/90 border border-slate-200 backdrop-blur-3xl shadow-lg shadow-slate-200/30 rounded-3xl";
  const innerCard = isDark ? "bg-white/[0.03] border border-white/10 hover:bg-white/[0.05]" : "bg-slate-50/80 border border-slate-200/80 hover:bg-white shadow-sm";

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
}