// app/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, Moon, Globe, ArrowRight, ShieldCheck, 
  MapPin, Truck, Package, Activity, CheckCircle2,
  CreditCard, Mail, PhoneCall, Zap,
  LayoutDashboard, ChevronRight, Search, FileText, 
  Map as MapIcon, Users, BarChart3, ListTodo, Settings, Bell
} from 'lucide-react';

const translations = {
  EN: {
    navLogin: 'Sign In Portal',
    heroBadge: 'The #1 Logistics Platform in East Africa',
    heroTitle1: 'The smartest way to',
    heroTitleHighlight: 'move freight.',
    heroSub: 'Geek Logistics connects businesses directly with verified truck owners. No middlemen, no hidden fees. Track your cargo in real-time and pay securely only when it arrives.',
    ctaPrimary: 'I Need to Ship Cargo', ctaSecondary: 'I am a Transporter',
    howTitle: 'How Geek Logistics Works',
    how1: '1. Post Your Load', how1Desc: 'Tell us what you are moving and where it needs to go. Set your price.',
    how2: '2. Get Matched', how2Desc: 'Our system instantly alerts verified drivers near your pickup location.',
    how3: '3. Track & Pay', how3Desc: 'Watch your cargo move on a live map. Funds are released only upon delivery.',
    featTitle: 'Built for scale, designed for simplicity.',
    f1Title: 'Live GPS Tracking', f1Desc: 'Know exactly where your cargo is at any given second.',
    f2Title: 'Secure Escrow Payments', f2Desc: 'Your money is safe. We hold it until the job is done right.',
    f3Title: 'Zero Middlemen', f3Desc: 'Connect directly with drivers to save money and increase margins.',
    f4Title: 'Digital Proof of Delivery', f4Desc: 'Drivers snap a photo of the waybill to get paid instantly.',
    stat1: '10,000+', stat1Sub: 'Verified Trucks', 
    stat2: 'TZS 5B+', stat2Sub: 'Payments Secured', 
    stat3: '24/7', stat3Sub: 'Live Tracking',
    readyTitle: 'Ready to simplify your logistics?',
    readySub: 'Join the fastest-growing network of shippers and carriers in East Africa.',
    footerCompany: 'Company', footerProduct: 'Product', footerLegal: 'Legal', footerContact: 'Contact Us',
    footerAddress: 'Dar es Salaam, Tanzania',
    rights: '© 2026 Geek Logistics. All rights reserved.'
  },
  SW: {
    navLogin: 'Ingia Ndani',
    heroBadge: 'Mtandao Namba 1 wa Usafirishaji Afrika Mashariki',
    heroTitle1: 'Njia janja ya',
    heroTitleHighlight: 'kusafirisha mizigo.',
    heroSub: 'Geek Logistics inakuunganisha moja kwa moja na wenye malori waliohakikiwa. Hakuna madalali, hakuna usumbufu. Fuatilia mzigo wako kwenye ramani na ulipie salama ukifika.',
    ctaPrimary: 'Nataka Kusafirisha', ctaSecondary: 'Mimi ni Msafirishaji',
    howTitle: 'Jinsi Geek Logistics Inavyofanya Kazi',
    how1: '1. Weka Mzigo Wako', how1Desc: 'Tuambie unasafirisha nini, unaenda wapi, na bei yako.',
    how2: '2. Pata Lori Haraka', how2Desc: 'Mfumo unawapa taarifa madereva waliohakikiwa waliopo karibu nawe papo hapo.',
    how3: '3. Fuatilia & Lipia', how3Desc: 'Tazama lori kwenye ramani. Pesa inalipwa kwa dereva mzigo ukifika tu.',
    featTitle: 'Imeundwa kurahisisha biashara yako.',
    f1Title: 'Ufuatiliaji wa GPS', f1Desc: 'Jua mzigo wako ulipo kila sekunde kupitia ramani yetu.',
    f2Title: 'Malipo Salama (Escrow)', f2Desc: 'Pesa zako zipo salama. Tunazishikilia mpaka mzigo ufike salama.',
    f3Title: 'Hakuna Madalali', f3Desc: 'Wasiliana moja kwa moja na madereva ili kuokoa pesa na muda.',
    f4Title: 'Hati Dijitali (POD)', f4Desc: 'Dereva anapiga picha nyaraka mzigo ukifika ili kulipwa papo hapo.',
    stat1: '10,000+', stat1Sub: 'Malori Yaliyohakikiwa', 
    stat2: 'TZS 5B+', stat2Sub: 'Malipo Yaliyolindwa', 
    stat3: '24/7', stat3Sub: 'Ufuatiliaji Mubashara',
    readyTitle: 'Upo tayari kurahisisha usafirishaji wako?',
    readySub: 'Jiunge na mtandao unaokuwa kwa kasi zaidi wa wasafirishaji Afrika Mashariki.',
    footerCompany: 'Kampuni', footerProduct: 'Huduma Zetu', footerLegal: 'Sheria na Masharti', footerContact: 'Wasiliana Nasi',
    footerAddress: 'Dar es Salaam, Tanzania',
    rights: '© 2026 Geek Logistics. Haki zote zimehifadhiwa.'
  }
};

const transitionEase: [number, number, number, number] = [0.16, 1, 0.3, 1];
const staggerContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: transitionEase } } };

export default function LandingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false); 
  const [lang, setLang] = useState<'SW' | 'EN'>('EN');

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return <div className="min-h-screen bg-[#f8fafc]" />;

  const t = translations[lang];
  
  const bgMainClass = isDark ? 'bg-[#0B0F19]' : 'bg-[#f8fafc]'; 
  const textPrimary = isDark ? 'text-white' : 'text-slate-900';
  const textSecondary = isDark ? 'text-slate-300' : 'text-slate-500'; 
  const glassNav = isDark ? 'bg-[#0B0F19]/70 border-white/10 backdrop-blur-2xl shadow-2xl' : 'bg-white/80 border-slate-200/60 backdrop-blur-2xl shadow-sm';
  const glassCard = isDark ? 'bg-[#131826]/80 border-white/10 backdrop-blur-xl shadow-2xl shadow-black/50' : 'bg-white/90 border-slate-200/80 backdrop-blur-xl shadow-xl shadow-slate-200/50';
  const innerCard = isDark ? 'bg-white/[0.03] border-white/10 shadow-inner' : 'bg-slate-50 border-slate-200/60 shadow-sm';

  return (
    <div className={`min-h-screen font-sans selection:bg-indigo-500/30 overflow-x-hidden transition-colors duration-700 relative ${bgMainClass}`}>
      
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <motion.div animate={{ x: [-20, 20, -20], y: [-20, 20, -20] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className={`absolute top-[-10%] right-[-5%] w-[60vw] h-[60vw] md:w-[40vw] md:h-[40vw] rounded-full blur-[120px] md:blur-[160px] bg-indigo-600 ${isDark ? 'opacity-[0.12]' : 'opacity-[0.04]'}`} />
        <motion.div animate={{ x: [20, -20, 20], y: [20, -20, 20] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className={`absolute bottom-[-10%] left-[-5%] w-[60vw] h-[60vw] md:w-[40vw] md:h-[40vw] rounded-full blur-[120px] md:blur-[160px] bg-orange-600 ${isDark ? 'opacity-[0.1]' : 'opacity-[0.03]'}`} />
      </div>

      <nav className={`fixed top-4 inset-x-4 sm:inset-x-8 lg:inset-x-12 z-50 border rounded-full transition-colors duration-500 ${glassNav}`}>
        <div className="mx-auto px-4 sm:px-8 h-[64px] sm:h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white text-base sm:text-lg shadow-lg shadow-indigo-600/30"><ShieldCheck size={18}/></div>
            <span className={`font-bold tracking-tight text-base sm:text-lg hidden sm:block ${textPrimary}`}>Geek Logistics</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button onClick={() => setLang(lang === 'SW' ? 'EN' : 'SW')} className={`flex px-3 sm:px-4 py-2 sm:py-2.5 rounded-full border text-[10px] sm:text-xs font-bold uppercase transition-colors active:scale-95 ${isDark ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
              <Globe className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" /> <span className="hidden sm:inline">{lang}</span><span className="inline sm:hidden ml-1">{lang}</span>
            </button>
            <button onClick={() => setIsDark(!isDark)} className={`p-2 sm:p-2.5 rounded-full border transition-colors active:scale-95 ${isDark ? 'bg-white/5 border-white/10 text-yellow-400 hover:bg-white/10' : 'bg-white border-slate-200 text-indigo-600 hover:bg-slate-50'}`}>
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <div className={`hidden sm:block w-px h-6 sm:h-8 mx-1 ${isDark ? 'bg-white/10' : 'bg-slate-300'}`} />
            <button onClick={() => router.push('/login')} className="px-4 py-2 sm:px-6 sm:py-2.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] sm:text-xs font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">
              {t.navLogin}
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 flex flex-col items-center pt-32 sm:pt-40 pb-16 sm:pb-20 w-full">
        
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="text-center w-full max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div variants={fadeUp} className="mb-6 sm:mb-8 flex justify-center">
            <span className={`px-4 py-1.5 sm:py-2 rounded-full border text-[9px] sm:text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-sm ${isDark ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' : 'bg-indigo-50 text-indigo-600 border-indigo-200'}`}>
              <Zap size={12} className="animate-pulse sm:w-[14px] sm:h-[14px]" /> {t.heroBadge}
            </span>
          </motion.div>
          <motion.h1 variants={fadeUp} className={`text-4xl sm:text-6xl md:text-7xl font-bold tracking-tighter leading-[1.15] sm:leading-[1.1] mb-4 sm:mb-6 ${textPrimary}`}>
            {t.heroTitle1} <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-orange-500">
              {t.heroTitleHighlight}
            </span>
          </motion.h1>
          <motion.p variants={fadeUp} className={`text-sm sm:text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed mb-8 sm:mb-10 ${textSecondary}`}>
            {t.heroSub}
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button onClick={() => router.push('/login')} className="w-full sm:w-auto px-6 py-3.5 sm:px-8 sm:py-4 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm uppercase tracking-widest shadow-lg shadow-indigo-600/30 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-2">
              <Package size={16} /> {t.ctaPrimary} <ArrowRight size={16} className="ml-1" />
            </button>
            <button onClick={() => router.push('/login')} className={`w-full sm:w-auto px-6 py-3.5 sm:px-8 sm:py-4 rounded-full border font-bold text-xs sm:text-sm uppercase tracking-widest hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-2 ${isDark ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50 shadow-sm'}`}>
              <Truck size={16} /> {t.ctaSecondary} <ChevronRight size={16} className="ml-1"/>
            </button>
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4, ease: transitionEase }} className="w-full max-w-6xl mx-auto mt-16 sm:mt-20 mb-24 sm:mb-40 px-4 sm:px-6 lg:px-8 relative">
          <div className={`rounded-3xl sm:rounded-[2.5rem] border overflow-hidden flex flex-col md:flex-row w-full min-h-[500px] md:min-h-[600px] shadow-2xl ${glassCard}`}>
            <div className={`hidden md:flex flex-col items-center w-24 py-8 border-r shrink-0 ${isDark ? 'border-white/10 bg-[#080b1a]/40' : 'border-slate-200 bg-white/50'}`}>
               <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white mb-10 shadow-lg"><ShieldCheck size={24}/></div>
               <div className="space-y-8 flex flex-col items-center">
                 <div className={`p-3 rounded-xl ${isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}><LayoutDashboard size={20}/></div>
                 <div className={`${textSecondary}`}><MapIcon size={20}/></div>
                 <div className={`${textSecondary}`}><BarChart3 size={20}/></div>
                 <div className={`${textSecondary}`}><ListTodo size={20}/></div>
               </div>
               <div className={`mt-auto ${textSecondary}`}><Settings size={20}/></div>
            </div>

            <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 overflow-hidden w-full">
               <div className="flex items-center justify-between mb-6 sm:mb-8 pb-4 border-b border-inherit shrink-0">
                 <div className="hidden sm:block">
                   <div className={`w-32 h-3 rounded-full mb-2 ${isDark ? 'bg-white/20' : 'bg-slate-300'}`} />
                   <div className={`w-20 h-2 rounded-full ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />
                 </div>
                 <div className={`block sm:hidden text-sm font-bold ${textPrimary}`}>Live Dashboard</div>
                 <div className="flex items-center gap-3 sm:gap-4 w-auto">
                    <div className={`hidden sm:flex w-64 h-10 rounded-full items-center px-4 ${innerCard}`}><Search size={14} className={textSecondary}/></div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-orange-500 flex items-center justify-center border-2 border-white dark:border-[#0B0F19] shadow-sm shrink-0"><span className="text-white text-[10px] sm:text-xs font-bold">GL</span></div>
                 </div>
               </div>

               <div className="flex sm:grid sm:grid-cols-3 gap-3 sm:gap-4 mb-6 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar shrink-0 w-full">
                 {[
                   { icon: <Truck size={14} className="text-indigo-500"/>, title: "Active Loads", val: "24", bg: "bg-indigo-500/10" },
                   { icon: <CheckCircle2 size={14} className="text-green-500"/>, title: "Completed", val: "1,280", bg: "bg-green-500/10" },
                   { icon: <Activity size={14} className="text-orange-500"/>, title: "Avg Transit", val: "1.2 Days", bg: "bg-orange-500/10" }
                 ].map((stat, i) => (
                   <div key={i} className={`min-w-[140px] sm:min-w-0 p-4 rounded-2xl border flex flex-col justify-center ${innerCard}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${stat.bg}`}>{stat.icon}</div>
                        <span className={`text-[9px] font-bold uppercase tracking-widest ${textSecondary}`}>{stat.title}</span>
                      </div>
                      <p className={`text-lg sm:text-2xl font-bold ${textPrimary}`}>{stat.val}</p>
                   </div>
                 ))}
               </div>

               <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[250px] w-full">
                 
                 <div className={`lg:col-span-2 h-[250px] lg:h-auto min-h-[250px] rounded-2xl border relative overflow-hidden flex items-center justify-center w-full ${innerCard}`}>
                   <svg className={`absolute inset-0 w-full h-full ${isDark ? 'opacity-10' : 'opacity-5'}`} xmlns="http://www.w3.org/2000/svg">
                     <defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/></pattern></defs>
                     <rect width="100%" height="100%" fill="url(#grid)" />
                   </svg>
                   <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                      <path d="M 50 150 Q 200 50 400 120 T 700 80" fill="none" stroke="#6366f1" strokeWidth="3" strokeDasharray="8,8" className="opacity-50" />
                   </svg>
                   
                   <div className="absolute top-4 right-4 lg:hidden flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-sm z-20">
                     <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                     <span className={`text-[10px] font-bold uppercase ${textPrimary}`}>Live GPS</span>
                   </div>

                   <motion.div animate={{ x: [-20, 20, -20], y: [-10, 10, -10] }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }} className="absolute z-10 w-12 h-12 flex items-center justify-center">
                      <div className="absolute w-full h-full rounded-full border border-indigo-500/50 animate-ping" />
                      <div className="w-3 h-3 bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,1)]" />
                   </motion.div>
                   <div className="absolute left-[15%] top-[60%] flex flex-col items-center">
                     <MapPin size={20} className="text-orange-500 mb-1" />
                     <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${isDark ? 'bg-black/50 text-white' : 'bg-white/80 text-slate-800'} backdrop-blur-sm shadow-sm`}>Dar es Salaam</span>
                   </div>
                   <div className="absolute right-[25%] top-[30%] flex flex-col items-center">
                     <MapPin size={20} className="text-green-500 mb-1" />
                     <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${isDark ? 'bg-black/50 text-white' : 'bg-white/80 text-slate-800'} backdrop-blur-sm shadow-sm`}>Kampala</span>
                   </div>
                 </div>

                 <div className="hidden lg:flex flex-col gap-4 overflow-hidden w-full">
                    <h3 className={`text-xs font-bold uppercase tracking-widest ${textSecondary}`}>Live Activity</h3>
                    <div className="flex-1 space-y-3 overflow-hidden">
                      {[
                        { icon: <CheckCircle2 size={12} className="text-green-500"/>, title: "Payout Released", sub: "GL-4829 • TZS 1.2M", bg: "bg-green-500/10 border-green-500/20" },
                        { icon: <Truck size={12} className="text-indigo-500"/>, title: "Driver Matched", sub: "Mwanza to Dodoma", bg: "bg-indigo-500/10 border-indigo-500/20" },
                        { icon: <FileText size={12} className="text-blue-500"/>, title: "POD Uploaded", sub: "GL-3918 • Arusha", bg: "bg-blue-500/10 border-blue-500/20" }
                      ].map((item, i) => (
                        <div key={i} className={`p-3 rounded-xl border flex items-center gap-3 ${innerCard}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${item.bg}`}>{item.icon}</div>
                          <div className="min-w-0">
                             <p className={`text-xs font-bold truncate ${textPrimary}`}>{item.title}</p>
                             <p className={`text-[9px] font-medium mt-0.5 truncate ${textSecondary}`}>{item.sub}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                 </div>
               </div>
            </div>
          </div>

          <motion.div animate={{ y: [-10, 10, -10] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className={`absolute -right-12 top-1/4 hidden lg:flex items-center gap-4 p-5 rounded-2xl border shadow-2xl z-20 ${glassCard}`}>
            <div className="w-12 h-12 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center"><CheckCircle2 className="text-green-500"/></div>
            <div>
              <p className={`text-[10px] font-bold uppercase tracking-widest ${textSecondary}`}>Escrow Released</p>
              <p className={`text-xl font-bold ${textPrimary}`}>TZS 4.2M</p>
            </div>
          </motion.div>
          <motion.div animate={{ y: [10, -10, 10] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className={`absolute -left-12 bottom-1/4 hidden lg:flex items-center gap-4 p-5 rounded-2xl border shadow-2xl z-20 ${glassCard}`}>
            <div className="w-12 h-12 bg-orange-500/10 border border-orange-500/20 rounded-full flex items-center justify-center"><Bell className="text-orange-500"/></div>
            <div>
              <p className={`text-[10px] font-bold uppercase tracking-widest ${textSecondary}`}>Driver Alert</p>
              <p className={`text-sm font-bold ${textPrimary}`}>Truck arriving in 2 hrs</p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="max-w-7xl mx-auto w-full mb-24 sm:mb-40 text-center px-4 sm:px-6">
           <motion.h2 variants={fadeUp} className={`text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-12 sm:mb-16 ${textPrimary}`}>
             {t.howTitle}
           </motion.h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 relative w-full">
             <div className={`hidden md:block absolute top-12 left-[20%] right-[20%] h-0.5 border-t-2 border-dashed ${isDark ? 'border-white/10' : 'border-slate-300'} z-0`} />
             {[
               { icon: <FileText size={24} />, title: t.how1, desc: t.how1Desc, color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20' },
               { icon: <Truck size={24} />, title: t.how2, desc: t.how2Desc, color: 'text-orange-500', bg: 'bg-orange-500/10 border-orange-500/20' },
               { icon: <MapIcon size={24} />, title: t.how3, desc: t.how3Desc, color: 'text-green-500', bg: 'bg-green-500/10 border-green-500/20' }
             ].map((step, i) => (
               <motion.div key={i} variants={fadeUp} className="relative z-10 flex flex-col items-center px-4 sm:px-0">
                  <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mb-6 sm:mb-8 border-[6px] sm:border-8 ${isDark ? 'border-[#0B0F19] bg-[#131826]' : 'border-[#f8fafc] bg-white'} shadow-xl`}>
                     <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center border ${step.bg} ${step.color}`}>{step.icon}</div>
                  </div>
                  <h3 className={`text-lg sm:text-xl font-bold mb-3 ${textPrimary}`}>{step.title}</h3>
                  <p className={`text-xs sm:text-sm font-medium leading-relaxed max-w-xs ${textSecondary}`}>{step.desc}</p>
               </motion.div>
             ))}
           </div>
        </motion.div>

        <div className="max-w-7xl w-full mx-auto space-y-24 sm:space-y-32 px-4 sm:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="text-center w-full">
            <motion.h2 variants={fadeUp} className={`text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-12 sm:mb-16 ${textPrimary}`}>
              {t.featTitle}
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-left">
              {[
                { icon: <MapPin size={24} className="text-indigo-500"/>, title: t.f1Title, desc: t.f1Desc, bg: 'bg-indigo-500/10 border-indigo-500/20' },
                { icon: <CreditCard size={24} className="text-green-500"/>, title: t.f2Title, desc: t.f2Desc, bg: 'bg-green-500/10 border-green-500/20' },
                { icon: <Activity size={24} className="text-orange-500"/>, title: t.f3Title, desc: t.f3Desc, bg: 'bg-orange-500/10 border-orange-500/20' },
                { icon: <FileText size={24} className="text-blue-500"/>, title: t.f4Title, desc: t.f4Desc, bg: 'bg-blue-500/10 border-blue-500/20' }
              ].map((f, i) => (
                <motion.div key={i} variants={fadeUp} className={`p-6 sm:p-8 rounded-3xl border transition-all hover:-translate-y-2 hover:shadow-2xl w-full ${glassCard}`}>
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-5 sm:mb-6 border ${f.bg}`}>{f.icon}</div>
                  <h3 className={`text-lg sm:text-xl font-bold mb-2 sm:mb-3 ${textPrimary}`}>{f.title}</h3>
                  <p className={`text-xs sm:text-sm font-medium leading-relaxed ${textSecondary}`}>{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className={`w-full p-8 sm:p-16 rounded-[2rem] sm:rounded-[3rem] border ${glassCard}`}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-0 divide-y sm:divide-y-0 sm:divide-x divide-inherit text-center">
              {[
                { title: t.stat1, sub: t.stat1Sub },
                { title: t.stat2, sub: t.stat2Sub },
                { title: t.stat3, sub: t.stat3Sub }
              ].map((s, i) => (
                <motion.div key={i} variants={fadeUp} className="flex flex-col items-center justify-center pt-6 sm:pt-0 first:pt-0 w-full">
                  <p className="text-4xl sm:text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-orange-500 mb-2">{s.title}</p>
                  <p className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest ${textSecondary}`}>{s.sub}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="text-center max-w-3xl mx-auto pb-8 sm:pb-16 w-full">
             <motion.h2 variants={fadeUp} className={`text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 sm:mb-6 ${textPrimary}`}>{t.readyTitle}</motion.h2>
             <motion.p variants={fadeUp} className={`text-sm sm:text-lg mb-8 sm:mb-10 px-4 sm:px-0 ${textSecondary}`}>{t.readySub}</motion.p>
             <motion.div variants={fadeUp}>
               <button onClick={() => router.push('/login')} className="px-8 py-4 sm:px-10 sm:py-5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm uppercase tracking-widest shadow-xl shadow-indigo-600/30 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3 mx-auto">
                 {t.navLogin} <ChevronRight size={18} />
               </button>
             </motion.div>
          </motion.div>
        </div>
      </main>

      <footer className={`relative z-10 border-t transition-colors w-full ${isDark ? 'border-white/10 bg-[#080b1a]' : 'border-slate-200 bg-white'}`}>
        <div className="max-w-7xl mx-auto px-6 py-12 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-8 mb-12 sm:mb-16">
             <div className="sm:col-span-2 lg:col-span-1">
               <div className="flex items-center gap-3 mb-4 sm:mb-6">
                 <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg"><ShieldCheck size={18}/></div>
                 <span className={`font-bold tracking-tight text-lg sm:text-xl ${textPrimary}`}>Geek Logistics</span>
               </div>
               <p className={`text-xs sm:text-sm font-medium leading-relaxed max-w-sm ${textSecondary}`}>The smart freight network connecting East Africa's top businesses with reliable carriers.</p>
             </div>
             <div>
               <h4 className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-4 sm:mb-6 ${textPrimary}`}>{t.footerCompany}</h4>
               <ul className={`space-y-3 sm:space-y-4 text-xs sm:text-sm font-medium ${textSecondary}`}>
                 <li><a href="#" className="hover:text-indigo-500 transition-colors">About Us</a></li>
                 <li><a href="#" className="hover:text-indigo-500 transition-colors">Careers</a></li>
                 <li><a href="#" className="hover:text-indigo-500 transition-colors">Press & Media</a></li>
               </ul>
             </div>
             <div>
               <h4 className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-4 sm:mb-6 ${textPrimary}`}>{t.footerProduct}</h4>
               <ul className={`space-y-3 sm:space-y-4 text-xs sm:text-sm font-medium ${textSecondary}`}>
                 <li><a href="#" className="hover:text-indigo-500 transition-colors">For Shippers</a></li>
                 <li><a href="#" className="hover:text-indigo-500 transition-colors">For Carriers</a></li>
                 <li><a href="#" className="hover:text-indigo-500 transition-colors">Enterprise API</a></li>
               </ul>
             </div>
             <div>
               <h4 className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-4 sm:mb-6 ${textPrimary}`}>{t.footerContact}</h4>
               <ul className={`space-y-3 sm:space-y-4 text-xs sm:text-sm font-medium ${textSecondary}`}>
                 <li className="flex items-center gap-3"><MapPin size={16} className="text-indigo-500 shrink-0"/> {t.footerAddress}</li>
                 <li className="flex items-center gap-3"><PhoneCall size={16} className="text-indigo-500 shrink-0"/> +255 700 000 000</li>
                 <li className="flex items-center gap-3"><Mail size={16} className="text-indigo-500 shrink-0"/> hello@geeklogistics.com</li>
               </ul>
             </div>
          </div>

          <div className={`pt-6 sm:pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
            <p className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest ${textSecondary}`}>{t.rights}</p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest ${textSecondary}`}>Tanzania</span>
              <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest ${textSecondary}`}>Kenya</span>
              <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest ${textSecondary}`}>Uganda</span>
              <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest ${textSecondary}`}>Rwanda</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}