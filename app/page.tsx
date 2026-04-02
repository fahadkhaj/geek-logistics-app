"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, Moon, Globe, ArrowRight, ShieldCheck, 
  MapPin, Truck, Package, Activity, CheckCircle2,
  Headphones, Anchor, CreditCard, Mail, PhoneCall, Zap,
  Navigation, AlertCircle
} from 'lucide-react';

const translations = {
  EN: {
    navLogin: 'Sign In Portal',
    heroBadge: 'East Africa\'s Premier Freight Network',
    heroTitle1: 'The digital backbone of',
    heroTitleHighlight: 'East African logistics.',
    heroSub: 'Geek Logistics connects verified cargo owners with reliable transporters. Experience real-time tracking, secure escrow payments, and seamless AI load matching in one unified platform.',
    ctaPrimary: 'Ship Cargo',
    ctaSecondary: 'Find Loads',
    feed1Title: 'Shipment #GL-8492', feed1Sub: 'Dar es Salaam ➔ Kampala', feed1Status: 'In Transit',
    feed2Title: 'Escrow Payment', feed2Sub: 'Tsh 4,500,000 Secured', feed2Status: 'Verified',
    feed3Title: 'Smart Load Match', feed3Sub: '30T Flatbed needed in Mwanza', feed3Status: 'Matched',
    stat1: '10,000+', stat1Sub: 'Vetted Trucks',
    stat2: 'Tsh 5B+', stat2Sub: 'Escrow Secured',
    stat3: '99.9%', stat3Sub: 'Platform Uptime',
    pillarsTitle: 'Built for scale. Designed for trust.',
    p1Title: 'End-to-End Visibility', p1Desc: 'Watch your cargo move in real-time on our live map. Get predictive ETAs and instant alerts from port to final destination.',
    p2Title: 'Bank-Grade Escrow', p2Desc: 'We completely eliminate payment risk. Funds are secured upfront and released to drivers instantly upon verified delivery.',
    p3Title: '24/7 Dispatch Support', p3Desc: 'Our multi-lingual logistics experts are on standby day and night to resolve border, transit, or documentation issues.',
    forCargo: 'For Shippers',
    cargoTagline: 'Move cargo with absolute certainty.',
    cargoPoints: ['Instant access to thousands of vetted, reliable trucks.', 'Automated digital waybills and tax-compliant PODs.', 'Zero hidden broker fees—transparent, upfront pricing.'],
    forTrucks: 'For Transporters',
    truckTagline: 'Keep your wheels turning. Earn more.',
    truckPoints: ['Access direct-from-shipper premium loads. No middlemen.', 'Automated backhaul matching to eliminate empty return trips.', 'Instant payouts the second your delivery is verified.'],
    footerAbout: 'Geek Logistics is East Africa’s intelligent freight exchange, bridging the gap between cargo owners and transporters through world-class technology and unshakeable trust.',
    footerPlatform: 'Platform', footerPlatformL1: 'Shipper Dashboard', footerPlatformL2: 'Transporter App', footerPlatformL3: 'Pricing & Escrow',
    footerCompany: 'Company', footerCompanyL1: 'About Us', footerCompanyL2: 'Careers', footerCompanyL3: 'Help Center',
    footerContact: 'Contact Us', footerAddress: 'HQ: Arusha, Tanzania', footerRegion: 'Serving East Africa',
    rights: '© 2026 Geek Logistics East Africa. All rights reserved.'
  },
  SW: {
    navLogin: 'Ingia Kwenye Mfumo',
    heroBadge: 'Mtandao Bora wa Usafirishaji Afrika Mashariki',
    heroTitle1: 'Msingi mkuu wa kidijitali wa',
    heroTitleHighlight: 'usafirishaji Afrika Mashariki.',
    heroSub: 'Geek Logistics inawaunganisha wamiliki wa mizigo na wasafirishaji wa uhakika. Pata ufuatiliaji mubashara, malipo salama, na uunganishwaji wa mizigo katika mfumo mmoja.',
    ctaPrimary: 'Safirisha Mzigo',
    ctaSecondary: 'Tafuta Mzigo',
    feed1Title: 'Mzigo #GL-8492', feed1Sub: 'Dar es Salaam ➔ Kampala', feed1Status: 'Njiani',
    feed2Title: 'Malipo ya Escrow', feed2Sub: 'Tsh 4,500,000 Imehifadhiwa', feed2Status: 'Imethibitishwa',
    feed3Title: 'Mzigo Mpya', feed3Sub: 'Tani 30 Flatbed inahitajika Mwanza', feed3Status: 'Umepata',
    stat1: '10,000+', stat1Sub: 'Malori Yaliyohakikiwa',
    stat2: 'Tsh 5B+', stat2Sub: 'Malipo Salama',
    stat3: '99.9%', stat3Sub: 'Upatikanaji wa Mfumo',
    pillarsTitle: 'Imejengwa kwa ubora. Imeundwa kwa uaminifu.',
    p1Title: 'Ufuatiliaji Kila Hatua', p1Desc: 'Tazama mzigo wako ukitembea mubashara kwenye ramani. Pata taarifa za muda wa kufika kutoka bandarini hadi mwisho.',
    p2Title: 'Malipo Salama (Escrow)', p2Desc: 'Tunaondoa hatari ya malipo. Pesa zinalindwa na kutolewa kwa dereva mara tu mzigo unapothibitishwa kufika.',
    p3Title: 'Msaada wa Masaa 24', p3Desc: 'Wataalamu wetu wa usafirishaji wapo tayari usiku na mchana kutatua changamoto za mipakani au njiani.',
    forCargo: 'Wamiliki wa Mizigo',
    cargoTagline: 'Safirisha mzigo wako kwa uhakika kamili.',
    cargoPoints: ['Pata malori ya uhakika na yaliyothibitishwa mara moja.', 'Nyaraka za kidijitali (POD) zinazokidhi matakwa ya kodi.', 'Hakuna tozo zilizofichwa za madalali—bei ni wazi.'],
    forTrucks: 'Wasafirishaji (Malori)',
    truckTagline: 'Endesha muda wote. Ongeza kipato.',
    truckPoints: ['Mizigo mizuri moja kwa moja kutoka kwa wamiliki. Hakuna madalali.', 'Kutafutiwa mzigo wa kurudia ili usirudi tupu.', 'Malipo ya papo hapo mzigo unapothibitishwa kufika.'],
    footerAbout: 'Geek Logistics ni mtandao wa kisasa wa usafirishaji, unaowaunganisha wamiliki wa mizigo na wasafirishaji kupitia teknolojia na uaminifu wa hali ya juu.',
    footerPlatform: 'Mfumo Wetu', footerPlatformL1: 'Dashibodi ya Wamiliki', footerPlatformL2: 'App ya Wasafirishaji', footerPlatformL3: 'Bei na Escrow',
    footerCompany: 'Kampuni', footerCompanyL1: 'Kuhusu Sisi', footerCompanyL2: 'Ajira', footerCompanyL3: 'Kituo cha Msaada',
    footerContact: 'Wasiliana Nasi', footerAddress: 'Makao Makuu: Arusha, Tanzania', footerRegion: 'Huduma kwa Afrika Mashariki',
    rights: '© 2026 Geek Logistics East Africa. Haki zote zimehifadhiwa.'
  }
};

const transitionEase = [0.16, 1, 0.3, 1];

const fadeUp = { 
  hidden: { opacity: 0, y: 30 }, 
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: transitionEase } } 
};

const staggerContainer = { 
  hidden: { opacity: 0 }, 
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } } 
};

const langCrossfade = {
  hidden: { opacity: 0, filter: 'blur(4px)' },
  visible: { opacity: 1, filter: 'blur(0px)', transition: { duration: 0.4 } },
  exit: { opacity: 0, filter: 'blur(4px)', transition: { duration: 0.2 } }
};

const floatAnim = (delay: number) => ({
  y: [0, -12, 0],
  transition: { duration: 5, repeat: Infinity, ease: "easeInOut", delay }
});

export default function HomePage() {
  const router = useRouter();
  const [lang, setLang] = useState<'EN' | 'SW'>('SW');
  const [isDark, setIsDark] = useState(true);
  const [activeWidget, setActiveWidget] = useState(0);
  const t = translations[lang];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWidget((prev) => (prev + 1) % 3);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const textPrimary = isDark ? "text-white" : "text-slate-900";
  const textSecondary = isDark ? "text-slate-300" : "text-slate-600";
  const bgMainColor = isDark ? '#080b1a' : '#fbfcfd'; 
  
  const glassNav = isDark ? "bg-[#080b1a]/60 border-white/5 backdrop-blur-xl" : "bg-white/60 border-slate-200/50 backdrop-blur-xl";
  const glassCardBase = isDark ? "bg-white/[0.02] border-white/5 backdrop-blur-2xl shadow-2xl hover:bg-white/[0.04]" : "bg-white border-slate-200 backdrop-blur-2xl shadow-xl hover:shadow-2xl";
  const glassNotification = isDark ? "bg-[#111322]/95 border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl" : "bg-white/95 border border-slate-200 shadow-[0_20px_40px_rgba(0,0,0,0.08)] backdrop-blur-xl";

  const widgets = [
    { title: t.feed1Title, sub: t.feed1Sub, status: t.feed1Status, icon: <Navigation size={20} className="text-blue-400 fill-current" />, color: 'blue' },
    { title: t.feed2Title, sub: t.feed2Sub, status: t.feed2Status, icon: <ShieldCheck size={20} className="text-green-400" />, color: 'green' },
    { title: t.feed3Title, sub: t.feed3Sub, status: t.feed3Status, icon: <Zap size={20} className="text-orange-400 fill-current" />, color: 'orange' }
  ];

  return (
    <div className={`min-h-screen font-sans selection:bg-indigo-500/30 overflow-x-hidden transition-colors duration-700`} style={{ backgroundColor: bgMainColor }}>
      
      {/* UNIFIED AMBIENT GLOWS */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div animate={{ x: [-10, 10, -10], y: [-10, 10, -10] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className={`absolute top-[-5%] right-[-5%] w-[45vw] h-[45vw] rounded-full blur-[160px] bg-indigo-600 ${isDark ? 'opacity-[0.08]' : 'opacity-[0.05]'}`} />
        <motion.div animate={{ x: [10, -10, 10], y: [10, -10, 10] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className={`absolute bottom-[-5%] left-[-5%] w-[45vw] h-[45vw] rounded-full blur-[160px] bg-orange-600 ${isDark ? 'opacity-[0.06]' : 'opacity-[0.04]'}`} />
        <div className={`absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] ${isDark ? 'opacity-[0.08]' : 'opacity-[0.03]'}`} />
      </div>

      {/* NAVBAR */}
      <nav className={`fixed top-0 inset-x-0 z-50 border-b transition-colors duration-500 ${glassNav}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shadow-md ${isDark ? 'bg-white/10 border border-white/10' : 'bg-slate-900'}`}>
               <ShieldCheck size={18} className={isDark ? "text-orange-400" : "text-white"} />
            </div>
            <span className={`font-bold tracking-tight text-lg sm:text-xl ${textPrimary}`}>Geek Logistics.</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-4">
            <button onClick={() => setLang(lang === 'SW' ? 'EN' : 'SW')} className={`flex px-2 sm:px-4 py-2 rounded-xl border text-[10px] sm:text-xs font-bold uppercase transition-colors active:scale-95 ${isDark ? 'border-white/10 bg-white/5 text-white hover:bg-white/10' : 'border-slate-200 bg-white/60 text-slate-700 hover:bg-white'}`}>
              <Globe className="w-3.5 h-3.5 sm:mr-2" /> <span className="hidden sm:inline">{lang}</span><span className="inline sm:hidden ml-1">{lang}</span>
            </button>
            <button onClick={() => setIsDark(!isDark)} className={`p-2 sm:p-2.5 rounded-xl border transition-colors active:scale-95 ${isDark ? 'border-white/10 bg-white/5 text-yellow-400 hover:bg-white/10' : 'border-slate-200 bg-white/60 text-indigo-600 hover:bg-white'}`}>
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <div className={`hidden sm:block w-px h-6 mx-1 ${isDark ? 'bg-white/10' : 'bg-slate-300'}`} />
            <button onClick={() => router.push('/login')} className={`px-4 sm:px-6 py-2 sm:py-2.5 font-bold rounded-xl text-[10px] sm:text-xs uppercase tracking-widest transition-all active:scale-95 shadow-md ${isDark ? 'bg-white text-black hover:bg-slate-200' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
              <AnimatePresence mode="wait"><motion.span key={lang} variants={langCrossfade} initial="hidden" animate="visible" exit="exit">{t.navLogin}</motion.span></AnimatePresence>
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className="relative z-10 pt-28 sm:pt-36 lg:pt-40 pb-16 px-4 sm:px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-8">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="w-full lg:w-[55%] flex flex-col items-center lg:items-start text-center lg:text-left">
          <motion.div variants={fadeUp} className={`px-4 py-2 rounded-full border mb-6 flex items-center gap-2 shadow-sm w-fit ${isDark ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300' : 'bg-indigo-50 border-indigo-200 text-indigo-700'}`}>
             <ShieldCheck className="w-3.5 h-3.5" />
             <AnimatePresence mode="wait">
               <motion.span key={lang} variants={langCrossfade} initial="hidden" animate="visible" exit="exit" className="text-[10px] sm:text-xs font-bold tracking-widest uppercase">{t.heroBadge}</motion.span>
             </AnimatePresence>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.h1 key={`title-${lang}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className={`text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter leading-[1.05] mb-6 ${textPrimary} text-balance`}>
              {t.heroTitle1} <br className="hidden sm:block"/>
              <span className="bg-gradient-to-r from-orange-500 to-indigo-500 bg-clip-text text-transparent">
                {t.heroTitleHighlight}
              </span>
            </motion.h1>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.p key={`sub-${lang}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`text-sm sm:text-lg font-medium leading-relaxed max-w-xl mb-10 ${textSecondary} text-balance`}>
              {t.heroSub}
            </motion.p>
          </AnimatePresence>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button onClick={() => router.push('/login')} className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] active:scale-95 flex items-center justify-center gap-3">
              <Package size={16} /> <AnimatePresence mode="wait"><motion.span key={lang} variants={langCrossfade} initial="hidden" animate="visible" exit="exit">{t.ctaPrimary}</motion.span></AnimatePresence>
            </button>
            <button onClick={() => router.push('/login')} className={`w-full sm:w-auto px-8 py-4 rounded-xl border font-bold text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-3 ${isDark ? 'border-white/10 bg-white/5 hover:bg-white/10 text-white' : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-900 shadow-sm'}`}>
              <Truck size={16} className="text-orange-500" /> <AnimatePresence mode="wait"><motion.span key={lang} variants={langCrossfade} initial="hidden" animate="visible" exit="exit">{t.ctaSecondary}</motion.span></AnimatePresence>
            </button>
          </motion.div>
        </motion.div>

        {/* DESKTOP: STAGGERED FLOATING WIDGETS */}
        <div className="hidden lg:flex w-[45%] flex-col gap-6 relative">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
           {widgets.map((card, idx) => (
             <motion.div key={idx} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 + (idx * 0.15), ease: transitionEase }}>
               <motion.div animate={floatAnim(idx * 0.5)} className={`p-5 rounded-[1.25rem] w-full max-w-sm ${idx === 0 ? 'mr-auto ml-12' : idx === 1 ? 'ml-auto mr-0' : 'mx-auto'} ${glassNotification} flex items-start gap-4`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${isDark ? `bg-${card.color}-500/20 text-${card.color}-400` : `bg-${card.color}-100 text-${card.color}-600`}`}>
                    {card.icon}
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.div key={`desk-widg-${lang}-${idx}`} variants={langCrossfade} initial="hidden" animate="visible" exit="exit" className="flex-1 text-left">
                      <h4 className={`text-sm font-bold mb-0.5 ${textPrimary}`}>{card.title}</h4>
                      <p className={`text-xs font-medium mb-3 ${textSecondary}`}>{card.sub}</p>
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md ${isDark ? `bg-${card.color}-500/10 border border-${card.color}-500/20` : `bg-${card.color}-50 border border-${card.color}-200`}`}>
                        {idx === 0 && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />}
                        {idx === 1 && <CheckCircle2 size={12} className="text-green-500" />}
                        {idx === 2 && <AlertCircle size={12} className="text-orange-500" />}
                        <span className={`text-[10px] font-bold uppercase tracking-widest text-${card.color}-500`}>{card.status}</span>
                      </div>
                    </motion.div>
                  </AnimatePresence>
               </motion.div>
             </motion.div>
           ))}
        </div>

        {/* MOBILE: AUTO-CYCLING WIDGET */}
        <div className="flex lg:hidden w-full justify-center relative mt-4">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative w-full max-w-sm h-[130px]">
             <AnimatePresence mode="wait">
               <motion.div 
                 key={`${activeWidget}-${lang}`} initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }} transition={{ duration: 0.4, ease: "easeInOut" }}
                 className={`absolute inset-0 p-5 rounded-[1.5rem] w-full ${glassNotification} flex items-center gap-5`}
               >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${isDark ? `bg-${widgets[activeWidget].color}-500/20 text-${widgets[activeWidget].color}-400` : `bg-${widgets[activeWidget].color}-100 text-${widgets[activeWidget].color}-600`}`}>
                    {widgets[activeWidget].icon}
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className={`text-sm sm:text-base font-bold mb-1 ${textPrimary}`}>{widgets[activeWidget].title}</h4>
                    <p className={`text-xs font-medium mb-3 ${textSecondary}`}>{widgets[activeWidget].sub}</p>
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md ${isDark ? `bg-${widgets[activeWidget].color}-500/10 border border-${widgets[activeWidget].color}-500/20` : `bg-${widgets[activeWidget].color}-50 border border-${widgets[activeWidget].color}-200`}`}>
                      {activeWidget === 0 && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />}
                      {activeWidget === 1 && <CheckCircle2 size={12} className="text-green-500" />}
                      {activeWidget === 2 && <AlertCircle size={12} className="text-orange-500" />}
                      <span className={`text-[10px] font-bold uppercase tracking-widest text-${widgets[activeWidget].color}-500`}>{widgets[activeWidget].status}</span>
                    </div>
                  </div>
               </motion.div>
             </AnimatePresence>
           </motion.div>
        </div>
      </main>

      {/* STATS STRIP */}
      <div className="relative z-10 px-4 sm:px-6 max-w-6xl mx-auto mb-20">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeUp} className={`w-full flex flex-col sm:flex-row items-center justify-between py-8 px-10 rounded-[2rem] border ${glassCardBase}`}>
          <AnimatePresence mode="wait">
            <motion.div key={`stats-${lang}`} variants={langCrossfade} initial="hidden" animate="visible" exit="exit" className="flex flex-col sm:flex-row items-center justify-between w-full">
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left mb-6 sm:mb-0 w-full sm:w-auto">
                <h3 className={`text-3xl font-bold tracking-tight ${textPrimary}`}>{t.stat1}</h3>
                <p className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest mt-1.5 ${textSecondary}`}>{t.stat1Sub}</p>
              </div>
              <div className={`hidden sm:block w-px h-12 ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />
              <div className="w-full sm:hidden h-px bg-slate-200 dark:bg-white/10 mb-6" />
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left mb-6 sm:mb-0 w-full sm:w-auto">
                <h3 className={`text-3xl font-bold tracking-tight text-indigo-500`}>{t.stat2}</h3>
                <p className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest mt-1.5 ${textSecondary}`}>{t.stat2Sub}</p>
              </div>
              <div className={`hidden sm:block w-px h-12 ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />
              <div className="w-full sm:hidden h-px bg-slate-200 dark:bg-white/10 mb-6" />
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left w-full sm:w-auto">
                <h3 className={`text-3xl font-bold tracking-tight ${textPrimary}`}>{t.stat3}</h3>
                <p className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest mt-1.5 ${textSecondary}`}>{t.stat3Sub}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* SERVICE PILLARS SECTION */}
      <section className="relative z-10 py-12 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <AnimatePresence mode="wait">
             <motion.h2 key={`pill-hdr-${lang}`} variants={langCrossfade} initial="hidden" animate="visible" exit="exit" className={`text-3xl sm:text-4xl font-bold tracking-tight mb-4 ${textPrimary}`}>{t.pillarsTitle}</motion.h2>
          </AnimatePresence>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {[
            { icon: <MapPin className="w-8 h-8 text-indigo-500" />, title: t.p1Title, desc: t.p1Desc },
            { icon: <CreditCard className="w-8 h-8 text-green-500" />, title: t.p2Title, desc: t.p2Desc },
            { icon: <Headphones className="w-8 h-8 text-orange-500" />, title: t.p3Title, desc: t.p3Desc },
          ].map((pillar, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1, ease: transitionEase } } }} className={`p-8 sm:p-10 rounded-[2rem] border flex flex-col items-center sm:items-start text-center sm:text-left transition-colors ${glassCardBase}`}>
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm ${isDark ? 'bg-white/5 border border-white/10' : 'bg-slate-100 border border-slate-200'}`}>{pillar.icon}</div>
              <AnimatePresence mode="wait">
                <motion.div key={`pill-${lang}-${i}`} variants={langCrossfade} initial="hidden" animate="visible" exit="exit">
                  <h3 className={`text-xl font-bold mb-3 ${textPrimary}`}>{pillar.title}</h3>
                  <p className={`text-sm font-medium leading-relaxed ${textSecondary}`}>{pillar.desc}</p>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

      {/* DUAL AUDIENCE SECTION */}
      <section className="relative z-10 py-16 px-4 sm:px-6 max-w-7xl mx-auto mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className={`group relative p-8 sm:p-12 rounded-[2rem] sm:rounded-[2.5rem] border overflow-hidden flex flex-col ${glassCardBase}`}>
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -mr-20 -mt-20 transition-all duration-700 group-hover:bg-indigo-500/20 pointer-events-none" />
             <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-sm ${isDark ? 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400' : 'bg-indigo-50 border border-indigo-100 text-indigo-600'}`}><Package size={28} /></div>
             <AnimatePresence mode="wait">
               <motion.div key={`cargo-${lang}`} variants={langCrossfade} initial="hidden" animate="visible" exit="exit" className="flex flex-col flex-1">
                 <h3 className={`text-3xl font-bold mb-3 tracking-tight ${textPrimary}`}>{t.forCargo}</h3>
                 <p className={`text-sm sm:text-base font-semibold mb-10 ${textSecondary}`}>{t.cargoTagline}</p>
                 <ul className="space-y-4 mb-12 flex-1">
                   {t.cargoPoints.map((point, idx) => (<li key={idx} className="flex items-start gap-4"><CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" /><span className={`text-sm font-medium ${textPrimary}`}>{point}</span></li>))}
                 </ul>
                 <button onClick={() => router.push('/login')} className="w-full sm:w-auto self-start px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center justify-center gap-3">{t.navLogin} <ArrowRight size={16} /></button>
               </motion.div>
             </AnimatePresence>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.1, ease: transitionEase } } }} className={`group relative p-8 sm:p-12 rounded-[2rem] sm:rounded-[2.5rem] border overflow-hidden flex flex-col ${glassCardBase}`}>
             <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[80px] -mr-20 -mt-20 transition-all duration-700 group-hover:bg-orange-500/20 pointer-events-none" />
             <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-sm ${isDark ? 'bg-orange-500/10 border border-orange-500/20 text-orange-400' : 'bg-orange-50 border border-orange-100 text-orange-600'}`}><Truck size={28} /></div>
             <AnimatePresence mode="wait">
               <motion.div key={`truck-${lang}`} variants={langCrossfade} initial="hidden" animate="visible" exit="exit" className="flex flex-col flex-1">
                 <h3 className={`text-3xl font-bold mb-3 tracking-tight ${textPrimary}`}>{t.forTrucks}</h3>
                 <p className={`text-sm sm:text-base font-semibold mb-10 ${textSecondary}`}>{t.truckTagline}</p>
                 <ul className="space-y-4 mb-12 flex-1">
                   {t.truckPoints.map((point, idx) => (<li key={idx} className="flex items-start gap-4"><CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" /><span className={`text-sm font-medium ${textPrimary}`}>{point}</span></li>))}
                 </ul>
                 <button onClick={() => router.push('/login')} className="w-full sm:w-auto self-start px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center justify-center gap-3">{t.navLogin} <ArrowRight size={16} /></button>
               </motion.div>
             </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={`relative z-10 border-t pt-16 pb-8 ${isDark ? 'bg-[#080b1a] border-white/10' : 'bg-slate-50 border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <AnimatePresence mode="wait">
            <motion.div key={`footer-${lang}`} variants={langCrossfade} initial="hidden" animate="visible" exit="exit" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
              <div className="lg:col-span-1">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md ${isDark ? 'bg-white/10 border border-white/10' : 'bg-slate-900'}`}><ShieldCheck size={20} className={isDark ? "text-orange-400" : "text-white"} /></div>
                  <span className={`font-bold tracking-tight text-xl ${textPrimary}`}>Geek Logistics.</span>
                </div>
                <p className={`text-sm font-medium leading-relaxed mb-6 ${textSecondary}`}>{t.footerAbout}</p>
                <div className="flex items-center gap-4 text-indigo-500"><Anchor size={20} className="hover:text-orange-500 cursor-pointer transition-colors" /><Globe size={20} className="hover:text-orange-500 cursor-pointer transition-colors" /></div>
              </div>
              <div>
                <h4 className={`text-xs font-bold uppercase tracking-widest mb-5 ${textPrimary}`}>{t.footerPlatform}</h4>
                <ul className={`space-y-4 text-sm font-medium ${textSecondary}`}>
                  <li className="hover:text-indigo-500 cursor-pointer transition-colors">{t.footerPlatformL1}</li>
                  <li className="hover:text-indigo-500 cursor-pointer transition-colors">{t.footerPlatformL2}</li>
                  <li className="hover:text-indigo-500 cursor-pointer transition-colors">{t.footerPlatformL3}</li>
                </ul>
              </div>
              <div>
                <h4 className={`text-xs font-bold uppercase tracking-widest mb-5 ${textPrimary}`}>{t.footerCompany}</h4>
                <ul className={`space-y-4 text-sm font-medium ${textSecondary}`}>
                  <li className="hover:text-indigo-500 cursor-pointer transition-colors">{t.footerCompanyL1}</li>
                  <li className="hover:text-indigo-500 cursor-pointer transition-colors">{t.footerCompanyL2}</li>
                  <li className="hover:text-indigo-500 cursor-pointer transition-colors">{t.footerCompanyL3}</li>
                </ul>
              </div>
              <div>
                <h4 className={`text-xs font-bold uppercase tracking-widest mb-5 ${textPrimary}`}>{t.footerContact}</h4>
                <ul className={`space-y-4 text-sm font-medium ${textSecondary}`}>
                  <li className="flex items-start gap-3"><MapPin size={18} className="text-orange-500 shrink-0 mt-0.5" /><span>{t.footerAddress}<br/>{t.footerRegion}</span></li>
                  <li className="flex items-center gap-3"><Mail size={18} className="text-orange-500 shrink-0" /><span>dispatch@geeklogistics.co.tz</span></li>
                  <li className="flex items-center gap-3"><PhoneCall size={18} className="text-orange-500 shrink-0" /><span>+255 700 000 000</span></li>
                </ul>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className={`pt-8 border-t flex flex-col sm:flex-row items-center sm:justify-between gap-4 text-center sm:text-left ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
            <AnimatePresence mode="wait">
               <motion.p key={`rights-${lang}`} variants={langCrossfade} initial="hidden" animate="visible" exit="exit" className={`text-xs font-medium ${textSecondary}`}>{t.rights}</motion.p>
            </AnimatePresence>
            <div className="flex gap-4 justify-center">
              <span className={`text-[10px] font-bold uppercase tracking-widest ${textSecondary}`}>TZ</span><span className={`text-[10px] font-bold uppercase tracking-widest ${textSecondary}`}>KE</span>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${textSecondary}`}>UG</span><span className={`text-[10px] font-bold uppercase tracking-widest ${textSecondary}`}>RW</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}