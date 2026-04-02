"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, Moon, ShieldCheck, Activity, ArrowRight, Truck, Wallet, 
  Map, Zap, CheckCircle2, Globe, FileText, HeadphonesIcon,
  Package, Mail, Lock, Loader2, User, AlertTriangle, Phone, 
  CreditCard, Hash, MapPin, ChevronDown, ArrowLeft, Eye, EyeOff
} from 'lucide-react';

const tanzaniaRegions = [
  "Arusha", "Dar es Salaam", "Dodoma", "Geita", "Iringa", "Kagera", "Katavi", "Kigoma", 
  "Kilimanjaro", "Lindi", "Manyara", "Mara", "Mbeya", "Morogoro", "Mtwara", "Mwanza", 
  "Njombe", "Pwani", "Rukwa", "Ruvuma", "Shinyanga", "Simiyu", "Singida", "Songwe", 
  "Tabora", "Tanga", "Zanzibar"
];

const translations = {
  EN: {
    backHome: 'Home', formLoginTitle: 'Welcome Back', formLoginSub: 'Sign in to access the freight market.',
    formJoinTitle: 'Create Account', formJoinSub: 'Join East Africa\'s secure logistics network.',
    cargoBtn: 'Cargo Owner', truckBtn: 'Truck Owner', name: 'Full Name / Company', phone: 'Phone (0700...)', 
    region: 'Base Region', tinText: 'TIN / Business ID', truckType: 'Truck Type', capacity: 'Tonnage (e.g. 30)',
    nidaText: '20-DIGIT NIDA', licenseText: 'Driving License No.', idVerification: 'ID Verification',
    nidaDoc: 'NIDA ID', plateDoc: 'Truck Plate', email: 'Email Address', password: 'Password',
    passReq: 'Min. 8 characters, 1 uppercase, 1 symbol.', btnInit: 'Sign In', btnDeploy: 'Create Account',
    unrecognized: 'Don\'t have an account?', reqClearance: 'Create one', verified: 'Already have an account?', authHere: 'Sign in',
    storyLogTitle1: 'Welcome to', storyLogTitle2: 'Geek Logistics.', storyLogSub: 'Your direct connection to premium freight and verified drivers.',
    sysActive: 'System Active', sysActiveDesc: '99.9% Network Uptime.', endSecure: 'Secure & Verified', endSecureDesc: 'All dispatch data is protected.',
    livePulse: 'Live Market Pulse', livePulseDesc: 'Real-time rates and metrics.',
    storyCargoTitle1: 'Move cargo with', storyCargoTitle2: 'certainty.', storyCargoSub: 'Broadcast your load instantly to verified drivers.',
    cargoF1: 'Reliable Drivers', cargoF1D: 'Trusted and fully vetted.', cargoF2: 'Live Telemetry', cargoF2D: 'Real-time GPS tracking.',
    cargoF3: 'Instant Matching', cargoF3D: 'Find trucks in minutes.', cargoF4: 'Digital Docs', cargoF4D: 'Waybills and e-invoices.',
    storyTruckTitle1: 'Never drive', storyTruckTitle2: 'empty.', storyTruckSub: 'Access premium loads with zero middlemen.',
    truckF1: 'Fast Payouts', truckF1D: 'Get paid on delivery.', truckF2: 'Backhaul Matching', truckF2D: 'Automated return loads.',
    truckF3: 'Secure Cargo', truckF3D: 'Vetted shippers only.', truckF4: '24/7 Support', truckF4D: 'Direct logistics assistance.'
  },
  SW: {
    backHome: 'Mwanzo', formLoginTitle: 'Karibu Tena', formLoginSub: 'Ingia ili kufikia soko la mizigo.',
    formJoinTitle: 'Tengeneza Akaunti', formJoinSub: 'Jiunge na mtandao salama wa usafirishaji.',
    cargoBtn: 'Mmiliki wa Mzigo', truckBtn: 'Mmiliki wa Lori', name: 'Jina / Kampuni', phone: 'Simu (0700...)', 
    region: 'Mkoa', tinText: 'TIN / Biashara', truckType: 'Aina ya Lori', capacity: 'Tani (mf. 30)',
    nidaText: 'NIDA (Tarakimu 20)', licenseText: 'Namba ya Leseni', idVerification: 'Uthibitisho',
    nidaDoc: 'NIDA', plateDoc: 'Namba ya Lori', email: 'Barua Pepe', password: 'Nenosiri',
    passReq: 'Herufi 8+, kubwa, ndogo, na alama.', btnInit: 'Ingia', btnDeploy: 'Tengeneza Akaunti',
    unrecognized: 'Huna akaunti?', reqClearance: 'Tengeneza hapa', verified: 'Tayari una akaunti?', authHere: 'Ingia hapa',
    storyLogTitle1: 'Karibu', storyLogTitle2: 'Geek Logistics.', storyLogSub: 'Muunganiko wako wa moja kwa moja na madereva.',
    sysActive: 'Mfumo Hewani', sysActiveDesc: 'Upatikanaji wa 99.9%.', endSecure: 'Usalama Kamili', endSecureDesc: 'Taarifa zote zinalindwa.',
    livePulse: 'Soko Mubashara', livePulseDesc: 'Bei za wakati halisi.',
    storyCargoTitle1: 'Safirisha kwa', storyCargoTitle2: 'uhakika.', storyCargoSub: 'Tangaza mzigo wako mara moja.',
    cargoF1: 'Madereva Makini', cargoF1D: 'Wamehakikiwa kikamilifu.', cargoF2: 'Ufuatiliaji Mubashara', cargoF2D: 'Tazama mzigo kwenye ramani.',
    cargoF3: 'Lori la Haraka', cargoF3D: 'Pata lori ndani ya dakika.', cargoF4: 'Nyaraka Dijitali', cargoF4D: 'Hati na ankara papo hapo.',
    storyTruckTitle1: 'Usiendeshe', storyTruckTitle2: 'tupu.', storyTruckSub: 'Pata mizigo bila madalali.',
    truckF1: 'Malipo ya Haraka', truckF1D: 'Lipwa mzigo ukifika.', truckF2: 'Mzigo wa Kurudia', truckF2D: 'Tunakutafutia mzigo wa kurudi.',
    truckF3: 'Mizigo Salama', truckF3D: 'Wamiliki wamehakikiwa.', truckF4: 'Msaada 24/7', truckF4D: 'Timu yetu ipo kwa ajili yako.'
  }
};

const transitionEase = [0.16, 1, 0.3, 1];
const langCrossfade = { hidden: { opacity: 0, y: 5 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: transitionEase } }, exit: { opacity: 0, y: -5, transition: { duration: 0.2 } } };
const formStagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const formItem = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: transitionEase } } };

export default function Login() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [lang, setLang] = useState<'SW' | 'EN'>('EN');
  const [role, setRole] = useState<'cargo_owner' | 'truck_owner'>('cargo_owner');
  const [isLogin, setIsLogin] = useState(true);
  
  // DEFAULT LIGHT THEME 
  const [isDark, setIsDark] = useState(false); 
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); const [fullName, setFullName] = useState(''); 
  const [phone, setPhone] = useState(''); const [region, setRegion] = useState(''); 
  const [showRegions, setShowRegions] = useState(false); const [tin, setTin] = useState(''); 
  const [truckType, setTruckType] = useState(''); const [capacity, setCapacity] = useState(''); 
  const [nida, setNida] = useState(''); const [license, setLicense] = useState('');
  const [nidaFile, setNidaFile] = useState<File | null>(null); const [plateFile, setPlateFile] = useState<File | null>(null);

  useEffect(() => {
    setMounted(true);
    const checkSession = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (user && !error) router.push('/dashboard');
      else { await supabase.auth.signOut(); setIsCheckingSession(false); }
    };
    checkSession();
  }, [router]);

  // BULLETPROOF HYDRATION SHIELD (Returns null until client mounts)
  if (!mounted) return null;
  
  if (isCheckingSession) return <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#080b1a]' : 'bg-[#f4f6f8]'}`}><Loader2 size={32} className="text-indigo-500 animate-spin" /></div>;

  const t = translations[lang];
  const isCargoMode = role === 'cargo_owner';

  const textPrimary = isDark ? "text-white" : "text-slate-900";
  const textSecondary = isDark ? "text-slate-400" : "text-slate-500";
  const bgMainClass = isDark ? 'bg-[#080b1a]' : 'bg-[#f4f6f8]'; 
  const glassNav = isDark ? "bg-[#080b1a]/40 border-white/5 backdrop-blur-2xl" : "bg-white/60 border-slate-200/50 backdrop-blur-2xl";
  const glassPanelCard = isDark ? "bg-white/[0.02] border-white/5 shadow-2xl backdrop-blur-2xl" : "bg-white border-slate-200 shadow-2xl backdrop-blur-2xl";
  const glassPanelStory = isDark ? "bg-white/[0.02] border-white/5 backdrop-blur-xl" : "bg-white/80 border-slate-200 backdrop-blur-xl shadow-sm";
  const accentColor = isCargoMode ? 'text-indigo-500' : 'text-orange-500';
  const bgGradient = isCargoMode ? 'from-indigo-600 to-indigo-500' : 'from-orange-600 to-orange-500';
  const focusRing = isCargoMode ? 'focus:border-indigo-500 focus:ring-indigo-500/20' : 'focus:border-orange-500 focus:ring-orange-500/20';
  const inputStyle = `w-full pl-12 pr-4 py-3.5 sm:py-4 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 transition-all ${isDark ? `bg-black/40 border border-white/10 text-white placeholder-slate-500 ${focusRing}` : `bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 ${focusRing}`}`;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setFile: React.Dispatch<React.SetStateAction<File | null>>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { alert("File is too large. Limit: 5MB."); e.target.value = ''; return; }
      setFile(file);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError(null);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error; router.push('/dashboard');
      } else {
        const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#\$%\^&\*]).{8,}$/;
        if (!passRegex.test(password)) throw new Error(t.passReq);
        if (role === 'truck_owner') {
          const nidaClean = nida.replace(/\s/g, ''); 
          if (nidaClean.length !== 20 || !/^\d+$/.test(nidaClean)) throw new Error(lang === 'EN' ? "Invalid NIDA" : "NIDA Sio Sahihi");
          if (!nidaFile || !plateFile) throw new Error(lang === 'EN' ? "Upload Images" : "Weka Picha");
        }
        const { data: authData, error: authError } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName, role: role, phone } } });
        if (authError) throw authError;
        if (authData.session) {
           let nidaUrl = null; let plateUrl = null;
           if (role === 'truck_owner') {
             if (nidaFile) { const { error: uErr } = await supabase.storage.from('verification_docs').upload(`${authData.user!.id}-nida.${nidaFile.name.split('.').pop()}`, nidaFile); if (!uErr) nidaUrl = supabase.storage.from('verification_docs').getPublicUrl(`${authData.user!.id}-nida.${nidaFile.name.split('.').pop()}`).data.publicUrl; }
             if (plateFile) { const { error: uErr } = await supabase.storage.from('verification_docs').upload(`${authData.user!.id}-plate.${plateFile.name.split('.').pop()}`, plateFile); if (!uErr) plateUrl = supabase.storage.from('verification_docs').getPublicUrl(`${authData.user!.id}-plate.${plateFile.name.split('.').pop()}`).data.publicUrl; }
           }
           const { error: dbError } = await supabase.from('users').insert([{ id: authData.user!.id, full_name: fullName, email, role: role, phone_number: phone, region, nida_number: role === 'truck_owner' ? nida : null, tin_number: role === 'cargo_owner' ? tin : null, truck_type: role === 'truck_owner' ? truckType : null, capacity_tons: role === 'truck_owner' ? capacity : null, plate_number: null, license_number: role === 'truck_owner' ? license : null, nida_image_url: nidaUrl, plate_image_url: plateUrl, account_status: role === 'truck_owner' ? 'pending_review' : 'active' }]);
           if (dbError) throw dbError; router.push('/dashboard');
        } else { throw new Error("Email Confirmation is still ON in Supabase."); }
      }
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  const renderStory = () => {
    if (isLogin) {
      return (
        <motion.div key="story-login" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }} className="max-w-md">
          <div className="mb-10">
            <AnimatePresence mode="wait">
              <motion.div key={`hdr-${lang}`} variants={langCrossfade} initial="hidden" animate="visible" exit="exit">
                <h2 className={`text-4xl lg:text-5xl font-bold tracking-tighter leading-[1.1] mb-4 ${textPrimary}`}>{t.storyLogTitle1} <br/><span className={accentColor}>{t.storyLogTitle2}</span></h2>
                <p className={`text-base font-medium leading-relaxed ${textSecondary}`}>{t.storyLogSub}</p>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="grid grid-cols-2 gap-4">
             {[{ icon: <Activity className={`w-5 h-5 mb-3 ${accentColor}`} />, title: t.sysActive, desc: t.sysActiveDesc, colSpan: false }, { icon: <ShieldCheck className={`w-5 h-5 mb-3 ${accentColor}`} />, title: t.endSecure, desc: t.endSecureDesc, colSpan: false }, { icon: <Globe className={`w-5 h-5 ${accentColor}`} />, title: t.livePulse, desc: t.livePulseDesc, colSpan: true }].map((item, i) => (
               <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.1 }} className={`${item.colSpan ? 'col-span-2' : ''} p-5 rounded-2xl border ${glassPanelStory}`}>
                  <AnimatePresence mode="wait"><motion.div key={`card-${lang}-${i}`} variants={langCrossfade} initial="hidden" animate="visible" exit="exit" className={item.colSpan ? "flex items-center gap-4" : ""}>{item.icon}<div><h3 className={`text-sm font-bold mb-1 ${textPrimary}`}>{item.title}</h3><p className={`text-xs font-medium ${textSecondary}`}>{item.desc}</p></div></motion.div></AnimatePresence>
               </motion.div>
             ))}
          </div>
        </motion.div>
      );
    }
    const features = role === 'cargo_owner' ? [{ icon: <CheckCircle2 className={`w-5 h-5 ${accentColor}`}/>, title: t.cargoF1, desc: t.cargoF1D }, { icon: <Map className={`w-5 h-5 ${accentColor}`}/>, title: t.cargoF2, desc: t.cargoF2D }, { icon: <Zap className={`w-5 h-5 ${accentColor}`}/>, title: t.cargoF3, desc: t.cargoF3D }, { icon: <FileText className={`w-5 h-5 ${accentColor}`}/>, title: t.cargoF4, desc: t.cargoF4D }] : [{ icon: <Wallet className={`w-5 h-5 ${accentColor}`}/>, title: t.truckF1, desc: t.truckF1D }, { icon: <Truck className={`w-5 h-5 ${accentColor}`}/>, title: t.truckF2, desc: t.truckF2D }, { icon: <ShieldCheck className={`w-5 h-5 ${accentColor}`}/>, title: t.truckF3, desc: t.truckF3D }, { icon: <HeadphonesIcon className={`w-5 h-5 ${accentColor}`}/>, title: t.truckF4, desc: t.truckF4D }];
    return (
      <motion.div key={`story-${role}`} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }} className="max-w-md">
        <div className="mb-10">
          <AnimatePresence mode="wait">
            <motion.div key={`hdr-${lang}`} variants={langCrossfade} initial="hidden" animate="visible" exit="exit">
              <h2 className={`text-4xl lg:text-5xl font-bold tracking-tighter leading-[1.1] mb-4 ${textPrimary}`}>{role === 'cargo_owner' ? t.storyCargoTitle1 : t.storyTruckTitle1} <br/><span className={accentColor}>{role === 'cargo_owner' ? t.storyCargoTitle2 : t.storyTruckTitle2}</span></h2>
              <p className={`text-base font-medium leading-relaxed ${textSecondary}`}>{role === 'cargo_owner' ? t.storyCargoSub : t.storyTruckSub}</p>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="space-y-3">
           {features.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.1 }} className={`flex items-center gap-4 p-4 rounded-2xl border ${glassPanelStory}`}>
                 <div className={`p-2.5 rounded-xl shrink-0 ${isDark ? (isCargoMode ? 'bg-indigo-500/10' : 'bg-orange-500/10') : (isCargoMode ? 'bg-indigo-50' : 'bg-orange-50')}`}>{item.icon}</div>
                 <AnimatePresence mode="wait"><motion.div key={`card-${lang}-${i}`} variants={langCrossfade} initial="hidden" animate="visible" exit="exit"><h4 className={`font-bold text-sm ${textPrimary}`}>{item.title}</h4><p className={`text-xs font-medium ${textSecondary}`}>{item.desc}</p></motion.div></AnimatePresence>
              </motion.div>
           ))}
        </div>
      </motion.div>
    );
  };

  return (
    <div className={`min-h-screen flex justify-center pt-24 lg:pt-32 pb-12 px-4 sm:px-8 relative overflow-y-auto overflow-x-hidden font-sans transition-colors duration-700 ${bgMainClass}`}>
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div animate={{ x: [10, -10, 10], y: [10, -10, 10] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className={`absolute bottom-[-5%] left-[-5%] w-[45vw] h-[45vw] rounded-full blur-[160px] bg-orange-600 ${isDark ? 'opacity-[0.06]' : 'opacity-[0.02]'}`} />
        <motion.div animate={{ x: [-10, 10, -10], y: [-10, 10, -10] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className={`absolute top-[-5%] right-[-5%] w-[45vw] h-[45vw] rounded-full blur-[160px] bg-indigo-600 ${isDark ? 'opacity-[0.08]' : 'opacity-[0.03]'}`} />
      </div>

      <nav className={`fixed top-0 inset-x-0 z-50 border-b transition-colors duration-500 ${glassNav}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={() => router.push('/')} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold tracking-widest uppercase transition-colors active:scale-95 shadow-sm ${isDark ? 'border-white/10 bg-white/5 text-white hover:bg-white/10' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}>
              <ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">{t.backHome}</span>
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setLang(lang === 'SW' ? 'EN' : 'SW')} className={`flex px-3 sm:px-4 py-2.5 rounded-xl border text-xs font-bold uppercase transition-colors active:scale-95 ${isDark ? 'border-white/10 bg-white/5 text-white hover:bg-white/10' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}>
              <Globe className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">{lang}</span><span className="inline sm:hidden ml-1">{lang}</span>
            </button>
            <button onClick={() => setIsDark(!isDark)} className={`p-2.5 rounded-xl border transition-colors active:scale-95 ${isDark ? 'border-white/10 bg-white/5 text-yellow-400 hover:bg-white/10' : 'border-slate-200 bg-white text-indigo-600 hover:bg-slate-50 shadow-sm'}`}>
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </nav>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: transitionEase }} className="w-full max-w-[1000px] grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 lg:gap-16 relative z-10 items-start mt-4 lg:mt-0">
        
        <div className="hidden lg:flex flex-col pr-4 sticky top-28">
           <AnimatePresence mode="wait">{renderStory()}</AnimatePresence>
        </div>

        <div className="flex flex-col w-full">
          <div className="lg:hidden text-center mb-6 mt-4">
            <div className={`w-12 h-12 mx-auto rounded-2xl flex items-center justify-center shadow-lg mb-4 ${isDark ? 'bg-white/5 border border-white/10' : 'bg-slate-900'}`}><ShieldCheck size={24} className={isDark ? "text-orange-400" : "text-white"} /></div>
            <AnimatePresence mode="wait">
              <motion.div key={`mob-hdr-${lang}`} variants={langCrossfade} initial="hidden" animate="visible" exit="exit">
                <h2 className={`text-3xl font-bold tracking-tight mb-2 ${textPrimary}`}>{isLogin ? t.storyLogTitle1 : isCargoMode ? t.storyCargoTitle1 : t.storyTruckTitle1} <br/><span className={accentColor}>{isLogin ? t.storyLogTitle2 : isCargoMode ? t.storyCargoTitle2 : t.storyTruckTitle2}</span></h2>
                <p className={`text-sm font-medium px-4 ${textSecondary}`}>{isLogin ? t.storyLogSub : isCargoMode ? t.storyCargoSub : t.storyTruckSub}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className={`border rounded-[2rem] p-6 sm:p-8 w-full transition-colors duration-500 overflow-hidden ${glassPanelCard}`}>
            <div className="text-center mb-8">
              <AnimatePresence mode="wait">
                <motion.div key={`form-hdr-${lang}`} variants={langCrossfade} initial="hidden" animate="visible" exit="exit">
                  <h2 className={`text-2xl font-bold tracking-tight mb-2 ${textPrimary}`}>{isLogin ? t.formLoginTitle : t.formJoinTitle}</h2>
                  <p className={`text-sm font-medium ${textSecondary}`}>{isLogin ? t.formLoginSub : t.formJoinSub}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            {!isLogin && (
              <div className={`flex p-1.5 rounded-xl mb-8 relative border ${isDark ? 'bg-black/40 border-white/5' : 'bg-slate-100 border-slate-200 shadow-inner'}`}>
                <motion.div className={`absolute top-1.5 bottom-1.5 w-[calc(50%-0.375rem)] rounded-lg shadow-md bg-gradient-to-r ${bgGradient}`} animate={{ x: role === 'cargo_owner' ? '0%' : '100%' }} transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                <button type="button" onClick={() => setRole('cargo_owner')} className={`flex-1 py-2.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest rounded-lg transition-all z-10 flex items-center justify-center gap-2 ${role === 'cargo_owner' ? 'text-white' : textSecondary}`}><Package size={16} /> <AnimatePresence mode="wait"><motion.span key={lang} variants={langCrossfade} initial="hidden" animate="visible" exit="exit">{t.cargoBtn}</motion.span></AnimatePresence></button>
                <button type="button" onClick={() => setRole('truck_owner')} className={`flex-1 py-2.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest rounded-lg transition-all z-10 flex items-center justify-center gap-2 ${role === 'truck_owner' ? 'text-white' : textSecondary}`}><Truck size={16} /> <AnimatePresence mode="wait"><motion.span key={lang} variants={langCrossfade} initial="hidden" animate="visible" exit="exit">{t.truckBtn}</motion.span></AnimatePresence></button>
              </div>
            )}

            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
                <AlertTriangle className="text-red-500 shrink-0" size={18} />
                <p className="text-xs sm:text-sm font-bold text-red-500">{error}</p>
              </motion.div>
            )}

            <form onSubmit={handleAuth} className="flex flex-col min-h-[300px]">
              <div className="flex-1 space-y-4">
                <AnimatePresence mode="wait">
                  {!isLogin ? (
                    <motion.div key={`register-fields-${role}`} variants={formStagger} initial="hidden" animate="visible" exit="exit" className="space-y-4 pb-2">
                      <motion.div variants={formItem} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="relative"><User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} /><input required type="text" placeholder={t.name} value={fullName} onChange={e => setFullName(e.target.value)} className={inputStyle} /></div>
                        <div className="relative"><Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} /><input required type="tel" placeholder={t.phone} value={phone} onChange={e => setPhone(e.target.value)} className={inputStyle} /></div>
                      </motion.div>
                      <motion.div variants={formItem} className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input required type="text" placeholder={t.region} value={region} onChange={e => { setRegion(e.target.value); setShowRegions(true); }} onFocus={() => setShowRegions(true)} onBlur={() => setTimeout(() => setShowRegions(false), 200)} className={inputStyle} />
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <AnimatePresence>
                          {showRegions && (
                            <motion.ul initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className={`absolute z-50 w-full mt-2 max-h-40 overflow-y-auto rounded-xl border shadow-2xl p-1.5 ${isDark ? 'bg-[#0a0a0c] border-white/10' : 'bg-white border-slate-200'}`}>
                              {tanzaniaRegions.filter(r => r.toLowerCase().includes(region.toLowerCase())).map(reg => (
                                <li key={reg} onMouseDown={() => { setRegion(reg); setShowRegions(false); }} className={`px-4 py-3 rounded-lg cursor-pointer text-sm font-semibold transition-colors ${isDark ? 'hover:bg-white/10 text-slate-200' : 'hover:bg-slate-100 text-slate-700'}`}>{reg}</li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </motion.div>

                      {role === 'cargo_owner' && (
                        <motion.div variants={formItem} className="relative">
                          <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                          <input required type="text" placeholder={t.tinText} value={tin} onChange={e => setTin(e.target.value)} className={inputStyle} />
                        </motion.div>
                      )}

                      {role === 'truck_owner' && (
                        <motion.div variants={formItem} className="space-y-4 pt-1">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="relative"><Truck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} /><input list="truckTypes" required placeholder={t.truckType} value={truckType} onChange={e => setTruckType(e.target.value)} className={inputStyle} /><datalist id="truckTypes"><option value="Flatbed"/><option value="Tipper"/><option value="Box Truck"/><option value="Refrigerated"/><option value="Lowboy"/></datalist></div>
                            <div className="relative"><Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} /><input required type="number" placeholder={t.capacity} value={capacity} onChange={e => setCapacity(e.target.value)} className={inputStyle} /></div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="relative"><CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} /><input required type="text" placeholder={t.nidaText} value={nida} onChange={e => setNida(e.target.value)} maxLength={20} className={`${inputStyle} tracking-widest`} /></div>
                            <div className="relative"><FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} /><input required type="text" placeholder={t.licenseText} value={license} onChange={e => setLicense(e.target.value)} className={`${inputStyle} tracking-widest`} /></div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 pt-2">
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="relative group cursor-pointer">
                              <input type="file" accept="image/*" required onChange={(e) => handleFileChange(e, setNidaFile)} className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer" />
                              <div className={`border-2 border-dashed rounded-xl p-3 text-center transition-all ${nidaFile ? 'border-green-500 bg-green-500/10' : isDark ? 'border-white/20 bg-black/40 hover:border-orange-500' : 'border-slate-300 bg-white/50 hover:border-orange-500'}`}>
                                <div className="text-lg mb-1">{nidaFile ? '✅' : '🪪'}</div>
                                <p className={`text-[10px] font-bold uppercase tracking-wider truncate ${nidaFile ? 'text-green-500' : textSecondary}`}>{t.nidaDoc}</p>
                              </div>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="relative group cursor-pointer">
                              <input type="file" accept="image/*" required onChange={(e) => handleFileChange(e, setPlateFile)} className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer" />
                              <div className={`border-2 border-dashed rounded-xl p-3 text-center transition-all ${plateFile ? 'border-green-500 bg-green-500/10' : isDark ? 'border-white/20 bg-black/40 hover:border-orange-500' : 'border-slate-300 bg-white/50 hover:border-orange-500'}`}>
                                <div className="text-lg mb-1">{plateFile ? '✅' : '🚛'}</div>
                                <p className={`text-[10px] font-bold uppercase tracking-wider truncate ${plateFile ? 'text-green-500' : textSecondary}`}>{t.plateDoc}</p>
                              </div>
                            </motion.div>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                <motion.div variants={formItem} initial="hidden" animate="visible" className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input required type="email" placeholder={t.email} value={email} onChange={e => setEmail(e.target.value)} className={inputStyle} />
                </motion.div>
                <motion.div variants={formItem} initial="hidden" animate="visible" className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input required type={showPassword ? "text" : "password"} placeholder={t.password} value={password} onChange={e => setPassword(e.target.value)} className={inputStyle} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                </motion.div>
              </div>

              <div className="mt-8">
                <button type="submit" disabled={loading} className={`w-full py-4 rounded-xl text-white font-bold uppercase tracking-widest text-xs transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 ${isCargoMode ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-orange-600 hover:bg-orange-500'} ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <AnimatePresence mode="wait"><motion.span key={lang} variants={langCrossfade} initial="hidden" animate="visible" exit="exit">{isLogin ? t.btnInit : t.btnDeploy}</motion.span></AnimatePresence>}
                  {!loading && <ArrowRight size={18} />}
                </button>
                
                <div className="mt-6 text-center">
                  <AnimatePresence mode="wait">
                    <motion.div key={`switch-${lang}`} variants={langCrossfade} initial="hidden" animate="visible" exit="exit" className={`text-sm font-medium ${textSecondary}`}>
                      {isLogin ? `${t.unrecognized} ` : `${t.verified} `}
                      <button type="button" onClick={() => { setIsLogin(!isLogin); setError(null); }} className={`font-bold transition-colors ${accentColor} hover:underline`}>{isLogin ? t.reqClearance : t.authHere}</button>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </form>

          </div>
        </div>
      </motion.div>
    </div>
  );
}