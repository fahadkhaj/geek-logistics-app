"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
// TRIPLE-CHECKED IMPORTS
import { 
  Sun, Moon, ShieldCheck, Activity, ArrowRight, Truck, Wallet, 
  Map, Zap, CheckCircle2, Globe, FileText, HeadphonesIcon,
  Package, Mail, Lock, Loader2, User, AlertTriangle, Phone, 
  CreditCard, Hash, MapPin, ChevronDown, Check
} from 'lucide-react';

// ==========================================
// 1. TANZANIA REGIONS
// ==========================================
const tanzaniaRegions = [
  "Arusha", "Dar es Salaam", "Dodoma", "Geita", "Iringa", "Kagera", "Katavi", "Kigoma", 
  "Kilimanjaro", "Lindi", "Manyara", "Mara", "Mbeya", "Morogoro", "Mtwara", "Mwanza", 
  "Njombe", "Pemba Kaskazini", "Pemba Kusini", "Pwani", "Rukwa", "Ruvuma", "Shinyanga", 
  "Simiyu", "Singida", "Songwe", "Tabora", "Tanga", "Zanzibar Mjini Magharibi", 
  "Zanzibar Kaskazini", "Zanzibar Kusini"
];

// ==========================================
// 2. DICTIONARY (MERGED W/ PREMIUM WORDING)
// ==========================================
const translations = {
  EN: {
    formLoginTitle: 'Welcome Back.',
    formLoginSub: 'Sign in to access live tracking and the freight market.',
    formJoinTitle: 'Create Account.',
    formJoinSub: 'Join the most secure logistics network in East Africa.',
    cargoBtn: 'Cargo Owner',
    truckBtn: 'Truck Owner',
    name: 'Full Name / Company',
    phone: 'Phone (0700...)',
    region: 'Base Region (Type to search)',
    tinText: 'TIN Number / Business ID',
    truckType: 'Truck Type (Type or Select)',
    capacity: 'Tonnage (e.g. 30)',
    nidaText: '20-DIGIT NIDA',
    licenseText: 'Driving License No.',
    idVerification: 'Identity Verification',
    nidaDoc: 'NIDA ID',
    plateDoc: 'Truck Plate',
    email: 'Email Address',
    password: 'Password',
    btnInit: 'Sign In Securely',
    btnDeploy: 'Create Account',
    unrecognized: 'Don\'t have an account?',
    reqClearance: 'Create one here',
    verified: 'Already have an account?',
    authHere: 'Sign in here',

    storyLogTitle1: 'Welcome to',
    storyLogTitle2: 'Geek Logistics.',
    storyLogSub: 'Sign in to access live freight tracking, find direct loads, and get paid faster.',
    sysActive: 'System Active',
    sysActiveDesc: '99.9% Network Uptime across East Africa.',
    endSecure: 'Secure & Verified',
    endSecureDesc: 'All dispatch data is protected and shippers are vetted.',
    livePulse: 'Live Market Pulse',
    livePulseDesc: 'Real-time freight rates and border delay metrics.',

    storyCargoTitle1: 'Move cargo with',
    storyCargoTitle2: 'absolute certainty.',
    storyCargoSub: 'Stop calling brokers. Broadcast your load to a network of verified drivers instantly.',
    cargoF1: 'Highly Reliable Drivers',
    cargoF1D: 'Trusted drivers available anytime, every time. Fully vetted for your peace of mind.',
    cargoF2: 'Live GPS Telemetry',
    cargoF2D: 'Watch your cargo move on the map with predictive ETAs.',
    cargoF3: 'Instant Capacity',
    cargoF3D: 'Get matched with trucks in minutes, not days.',
    cargoF4: 'Digital Documentation',
    cargoF4D: 'Generate waybills, PODs, and tax-compliant e-invoices instantly upon delivery.',

    storyTruckTitle1: 'Never drive',
    storyTruckTitle2: 'empty again.',
    storyTruckSub: 'Access premium, direct-from-shipper loads. No middlemen, no delayed payments. Just drive and earn.',
    truckF1: 'Guaranteed Fast Payouts',
    truckF1D: 'Get paid immediately upon uploading delivery proof.',
    truckF2: 'Backhaul Matching',
    truckF2D: 'We automatically find you a load for the trip home.',
    truckF3: 'Secure Cargo & Docs',
    truckF3D: 'We thoroughly vet all shippers and documentation so you can drive with confidence.',
    truckF4: '24/7 Dispatch Support',
    truckF4D: 'Direct access to our multi-lingual logistics team.'
  },
  SW: {
    formLoginTitle: 'Karibu Tena.',
    formLoginSub: 'Ingia ili kufuatilia mizigo na kufikia soko mubashara.',
    formJoinTitle: 'Tengeneza Akaunti.',
    formJoinSub: 'Jiunge na mtandao salama zaidi wa usafirishaji Afrika Mashariki.',
    cargoBtn: 'Mmiliki wa Mzigo',
    truckBtn: 'Mmiliki wa Lori',
    name: 'Jina Kamili / Kampuni',
    phone: 'Simu (0700...)',
    region: 'Mkoa (Tafuta hapa)',
    tinText: 'Namba ya TIN / Biashara',
    truckType: 'Aina ya Lori (Chagua au Andika)',
    capacity: 'Tani (mf. 30)',
    nidaText: 'NIDA YA TARAKIMU 20',
    licenseText: 'Namba ya Leseni',
    idVerification: 'Uthibitisho wa Kitambulisho',
    nidaDoc: 'Kitambulisho cha NIDA',
    plateDoc: 'Namba ya Lori',
    email: 'Barua Pepe',
    password: 'Nenosiri',
    btnInit: 'Ingia Kwa Usalama',
    btnDeploy: 'Tengeneza Akaunti',
    unrecognized: 'Huna akaunti?',
    reqClearance: 'Tengeneza hapa',
    verified: 'Tayari una akaunti?',
    authHere: 'Ingia hapa',

    storyLogTitle1: 'Karibu kwenye',
    storyLogTitle2: 'Geek Logistics.',
    storyLogSub: 'Ingiza taarifa zako ili kufikia dashibodi ya usafirishaji mubashara, kupata mizigo, na kulipwa haraka.',
    sysActive: 'Mfumo Upo Hewani',
    sysActiveDesc: 'Upatikanaji wa 99.9% kote Afrika Mashariki.',
    endSecure: 'Usalama wa Hali ya Juu',
    endSecureDesc: 'Taarifa zote zinalindwa na wateja wamehakikiwa.',
    livePulse: 'Hali ya Soko Mubashara',
    livePulseDesc: 'Bei za usafirishaji na foleni za mipakani kwa wakati halisi.',

    storyCargoTitle1: 'Safirisha mzigo kwa',
    storyCargoTitle2: 'uhakika kamili.',
    storyCargoSub: 'Acha kupiga madalali. Tangaza mzigo wako kwa madereva waliothibitishwa mara moja.',
    cargoF1: 'Madereva wa Kuaminika',
    cargoF1D: 'Madereva wa kuaminika kila saa, kila wakati. Wote wamehakikiwa.',
    cargoF2: 'Ufuatiliaji wa GPS Mubashara',
    cargoF2D: 'Tazama mzigo wako ukitembea kwenye ramani na kujua utafika lini.',
    cargoF3: 'Uwezo wa Haraka',
    cargoF3D: 'Pata lori ndani ya dakika, sio siku.',
    cargoF4: 'Nyaraka za Kidijitali',
    cargoF4D: 'Pata hati za usafirishaji na ankara papo hapo mzigo ukifika.',

    storyTruckTitle1: 'Usiendeshe gari',
    storyTruckTitle2: 'tupu tena.',
    storyTruckSub: 'Pata mizigo mizuri moja kwa moja kutoka kwa wamiliki. Hakuna madalali, hakuna ucheleweshwaji. Endesha na ulipwe.',
    truckF1: 'Malipo ya Haraka na Uhakika',
    truckF1D: 'Lipwa mara moja unapoweka uthibitisho wa kufikisha mzigo.',
    truckF2: 'Mzigo wa Kurudia',
    truckF2D: 'Tunakutafutia mzigo wa kurudi nyumbani kiotomatiki.',
    truckF3: 'Mzigo na Nyaraka Salama',
    truckF3D: 'Tunakagua wamiliki na nyaraka zote za mzigo ili uendeshe kwa amani.',
    truckF4: 'Msaada wa 24/7',
    truckF4D: 'Wasiliana moja kwa moja na timu yetu ya wataalamu wa usafirishaji.'
  }
};

// --- SMOOTH ANIMATION VARIANTS ---
const viewTransition = {
  hidden: { opacity: 0, y: 15, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, y: -15, filter: 'blur(8px)', transition: { duration: 0.3, ease: "easeIn" } }
};

const scrollHeaderVariant = {
  hidden: { opacity: 0, x: -30, filter: 'blur(10px)' },
  visible: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { type: 'spring', stiffness: 80, damping: 15 } },
  exit: { opacity: 0, x: 20, filter: 'blur(8px)', transition: { duration: 0.3 } }
};

const getScrollCardVariant = (index: number) => ({
  hidden: { opacity: 0, x: -40, scale: 0.96, filter: 'blur(10px)' },
  visible: { 
    opacity: 1, x: 0, scale: 1, filter: 'blur(0px)', 
    transition: { type: 'spring', stiffness: 70, damping: 15, delay: index * 0.1 } 
  },
  exit: { opacity: 0, x: 30, scale: 0.96, filter: 'blur(8px)', transition: { duration: 0.3 } }
});

// ==========================================
// 3. MAIN COMPONENT
// ==========================================
export default function Login() {
  const router = useRouter();
  
  // App State
  const [lang, setLang] = useState<'SW' | 'EN'>('SW');
  const [role, setRole] = useState<'cargo_owner' | 'truck_owner'>('cargo_owner');
  const [isLogin, setIsLogin] = useState(true);
  const [isDark, setIsDark] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  
  // Region Custom Dropdown State
  const [region, setRegion] = useState('');
  const [showRegions, setShowRegions] = useState(false);
  
  const [tin, setTin] = useState('');
  const [truckType, setTruckType] = useState('');
  const [capacity, setCapacity] = useState('');
  const [nida, setNida] = useState('');
  const [license, setLicense] = useState('');
  const [nidaFile, setNidaFile] = useState<File | null>(null);
  const [plateFile, setPlateFile] = useState<File | null>(null);

  const t = translations[lang];
  const isCargoMode = role === 'cargo_owner';

  // THEME VARIABLES
  const textPrimary = isDark ? "text-white" : "text-slate-900";
  const textSecondary = isDark ? "text-slate-400" : "text-slate-600";
  const bgMain = isDark ? "bg-[#050505]" : "bg-[#f8fafc]"; 
  
  const glassPanelCard = isDark 
    ? "bg-white/[0.03] border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] backdrop-blur-3xl" 
    : "bg-white/70 border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.06)] backdrop-blur-3xl";
    
  const glassPanelStory = isDark 
    ? "bg-white/[0.02] border-white/10 backdrop-blur-xl" 
    : "bg-white/60 border-white/80 backdrop-blur-xl shadow-sm";
  
  // COLORS
  const accentColor = isCargoMode ? 'text-indigo-500' : 'text-orange-500';
  const bgGradient = isCargoMode ? 'from-indigo-600 to-indigo-500' : 'from-orange-600 to-orange-500';
  
  // For the Hover Morphing Button
  const primaryButtonHex = isCargoMode ? '#4f46e5' : '#f97316'; // Indigo 600 : Orange 500
  const oppositeButtonHex = isCargoMode ? '#f97316' : '#4f46e5'; // Orange 500 : Indigo 600

  // DYNAMIC BACKGROUND THEME SYNC
  const bgMainColor = isDark 
    ? (isCargoMode ? '#070714' : '#0f0703') // Deep Indigo vs Deep Orange
    : (isCargoMode ? '#eef2ff' : '#fff7ed'); // Light Indigo vs Light Orange

  const inputBase = "w-full pl-12 pr-4 py-3.5 sm:py-4.5 rounded-xl text-sm font-semibold focus:outline-none transition-all";
  const inputDark = `bg-black/40 border border-white/10 text-white placeholder-slate-500 ${isCargoMode ? 'focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500' : 'focus:border-orange-500 focus:ring-1 focus:ring-orange-500'}`;
  const inputLight = `bg-white/80 border border-slate-200 text-slate-900 placeholder-slate-400 shadow-sm ${isCargoMode ? 'focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500' : 'focus:border-orange-500 focus:ring-1 focus:ring-orange-500'}`;
  const inputStyle = `${inputBase} ${isDark ? inputDark : inputLight}`;

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) router.push('/dashboard');
    };
    checkSession();
  }, [router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setFile: React.Dispatch<React.SetStateAction<File | null>>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { alert("File is too large. Limit: 5MB."); e.target.value = ''; return; }
      setFile(file);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push('/dashboard');
      } else {
        if (role === 'truck_owner') {
          const nidaClean = nida.replace(/\s/g, ''); 
          if (nidaClean.length !== 20 || !/^\d+$/.test(nidaClean)) {
            throw new Error(lang === 'EN' ? "Invalid NIDA: Must be exactly 20 digits." : "NIDA Sio Sahihi: Lazima iwe tarakimu 20.");
          }
          if (!nidaFile || !plateFile) {
            throw new Error(lang === 'EN' ? "Please upload NIDA and Plate images." : "Tafadhali weka picha ya NIDA na Lori.");
          }
        }

        const { data: authData, error: authError } = await supabase.auth.signUp({
          email, password, options: { data: { full_name: fullName, role, phone } }
        });
        if (authError) throw authError;

        if (authData.user) {
          let nidaUrl = null; let plateUrl = null;
          
          if (role === 'truck_owner') {
            if (nidaFile) {
              const nidaExt = nidaFile.name.split('.').pop();
              const nidaPath = `${authData.user.id}-nida.${nidaExt}`; 
              const { error: uploadErr } = await supabase.storage.from('verification_docs').upload(nidaPath, nidaFile);
              if (!uploadErr) nidaUrl = supabase.storage.from('verification_docs').getPublicUrl(nidaPath).data.publicUrl;
            }
            if (plateFile) {
              const plateExt = plateFile.name.split('.').pop();
              const platePath = `${authData.user.id}-plate.${plateExt}`; 
              const { error: uploadErr } = await supabase.storage.from('verification_docs').upload(platePath, plateFile);
              if (!uploadErr) plateUrl = supabase.storage.from('verification_docs').getPublicUrl(platePath).data.publicUrl;
            }
          }

          const { error: dbError } = await supabase.from('users').insert([
            { 
              id: authData.user.id, 
              full_name: fullName, 
              email, 
              role, 
              phone_number: phone,
              region,
              nida_number: role === 'truck_owner' ? nida : null,
              tin_number: role === 'cargo_owner' ? tin : null,
              truck_type: role === 'truck_owner' ? truckType : null,
              capacity_tons: role === 'truck_owner' ? capacity : null,
              plate_number: role === 'truck_owner' ? plateNumber : null,
              license_number: role === 'truck_owner' ? license : null,
              nida_image_url: nidaUrl,
              plate_image_url: plateUrl,
              account_status: role === 'truck_owner' ? 'pending_review' : 'active'
            }
          ]);
          if (dbError) throw dbError;
          router.push('/dashboard');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // 4. RENDER STORY (LEFT SIDEBAR)
  // ==========================================
  const renderStory = () => {
    if (isLogin) {
      return (
        <motion.div key={`${lang}-login`} exit={{ opacity: 0, transition: { duration: 0.3 } }} className="max-w-xl">
          <motion.div variants={scrollHeaderVariant} initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }} className="mb-10">
            <h2 className={`text-4xl lg:text-5xl font-bold tracking-tighter leading-[1.1] mb-4 ${textPrimary}`}>
              {t.storyLogTitle1} <br/>
              <span className={accentColor}>{t.storyLogTitle2}</span>
            </h2>
            <p className={`text-lg font-medium leading-relaxed max-w-md ${textSecondary}`}>{t.storyLogSub}</p>
          </motion.div>
          <div className="grid grid-cols-2 gap-4 relative">
             {[
               { icon: <Activity className={`w-6 h-6 mb-4 ${accentColor}`} />, title: t.sysActive, desc: t.sysActiveDesc, colSpan: false },
               { icon: <ShieldCheck className={`w-6 h-6 mb-4 ${accentColor}`} />, title: t.endSecure, desc: t.endSecureDesc, colSpan: false },
               { icon: <Globe className={`w-6 h-6 ${accentColor}`} />, title: t.livePulse, desc: t.livePulseDesc, colSpan: true }
             ].map((item, i) => (
               <motion.div 
                 key={i} variants={getScrollCardVariant(i)} initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.3 }} whileHover={{ scale: 1.03 }}
                 className={`${item.colSpan ? 'col-span-2' : ''} p-6 rounded-[1.5rem] border ${glassPanelStory}`}
               >
                  {item.colSpan ? (
                    <div className="flex items-center gap-4">
                      {item.icon}
                      <div><h3 className={`text-lg font-bold mb-0.5 ${textPrimary}`}>{item.title}</h3><p className={`text-sm font-medium ${textSecondary}`}>{item.desc}</p></div>
                    </div>
                  ) : (
                    <>
                      {item.icon}
                      <h3 className={`text-base font-bold mb-1 ${textPrimary}`}>{item.title}</h3>
                      <p className={`text-xs font-medium ${textSecondary}`}>{item.desc}</p>
                    </>
                  )}
               </motion.div>
             ))}
          </div>
        </motion.div>
      );
    }

    if (role === 'cargo_owner') {
      return (
        <motion.div key={`${lang}-cargo`} exit={{ opacity: 0, transition: { duration: 0.3 } }} className="max-w-xl">
          <motion.div variants={scrollHeaderVariant} initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }} className="mb-10">
            <h2 className={`text-4xl lg:text-5xl font-bold tracking-tighter leading-[1.1] mb-4 ${textPrimary}`}>
              {t.storyCargoTitle1} <br/><span className={accentColor}>{t.storyCargoTitle2}</span>
            </h2>
            <p className={`text-lg font-medium leading-relaxed max-w-md ${textSecondary}`}>{t.storyCargoSub}</p>
          </motion.div>
          <div className="space-y-3">
             {[
               { icon: <CheckCircle2 className={`w-5 h-5 ${accentColor}`}/>, title: t.cargoF1, desc: t.cargoF1D },
               { icon: <Map className={`w-5 h-5 ${accentColor}`}/>, title: t.cargoF2, desc: t.cargoF2D },
               { icon: <Zap className={`w-5 h-5 ${accentColor}`}/>, title: t.cargoF3, desc: t.cargoF3D },
               { icon: <FileText className={`w-5 h-5 ${accentColor}`}/>, title: t.cargoF4, desc: t.cargoF4D }
             ].map((item, i) => (
                <motion.div key={i} variants={getScrollCardVariant(i)} initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.3 }} whileHover={{ x: 6 }} className={`flex items-center gap-5 p-5 rounded-[1.25rem] border ${glassPanelStory}`}>
                   <div className={`p-3 rounded-xl shrink-0 ${isDark ? 'bg-indigo-500/10' : 'bg-indigo-50'}`}>{item.icon}</div>
                   <div><h4 className={`font-bold text-sm ${textPrimary}`}>{item.title}</h4><p className={`text-xs font-medium ${textSecondary}`}>{item.desc}</p></div>
                </motion.div>
             ))}
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div key={`${lang}-truck`} exit={{ opacity: 0, transition: { duration: 0.3 } }} className="max-w-xl">
        <motion.div variants={scrollHeaderVariant} initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }} className="mb-10">
          <h2 className={`text-4xl lg:text-5xl font-bold tracking-tighter leading-[1.1] mb-4 ${textPrimary}`}>
            {t.storyTruckTitle1} <br/><span className={accentColor}>{t.storyTruckTitle2}</span>
          </h2>
          <p className={`text-lg font-medium leading-relaxed max-w-md ${textSecondary}`}>{t.storyTruckSub}</p>
        </motion.div>
        <div className="space-y-3">
           {[
             { icon: <Wallet className={`w-5 h-5 ${accentColor}`}/>, title: t.truckF1, desc: t.truckF1D },
             { icon: <Truck className={`w-5 h-5 ${accentColor}`}/>, title: t.truckF2, desc: t.truckF2D },
             { icon: <ShieldCheck className={`w-5 h-5 ${accentColor}`}/>, title: t.truckF3, desc: t.truckF3D },
             { icon: <HeadphonesIcon className={`w-5 h-5 ${accentColor}`}/>, title: t.truckF4, desc: t.truckF4D }
           ].map((item, i) => (
              <motion.div key={i} variants={getScrollCardVariant(i)} initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.3 }} whileHover={{ x: 6 }} className={`flex items-center gap-5 p-5 rounded-[1.25rem] border ${glassPanelStory}`}>
                 <div className={`p-3 rounded-xl shrink-0 ${isDark ? 'bg-orange-500/10' : 'bg-orange-50'}`}>{item.icon}</div>
                 <div><h4 className={`font-bold text-sm ${textPrimary}`}>{item.title}</h4><p className={`text-xs font-medium ${textSecondary}`}>{item.desc}</p></div>
              </motion.div>
           ))}
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div 
      className="min-h-screen flex justify-center pt-24 lg:pt-32 pb-12 px-4 sm:px-8 relative overflow-y-auto overflow-x-hidden font-sans selection:bg-indigo-500/30"
      animate={{ backgroundColor: bgMainColor }}
      transition={{ duration: 1, ease: "easeInOut" }}
    >
      
      {/* TOP CONTROLS (LANG & THEME) */}
      <div className="absolute top-4 right-4 sm:top-8 sm:right-8 z-50 flex items-center gap-2 sm:gap-3">
         <button onClick={() => setLang(lang === 'SW' ? 'EN' : 'SW')} className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl border text-[10px] sm:text-xs font-bold tracking-widest uppercase transition-colors active:scale-95 shadow-lg backdrop-blur-md ${isDark ? 'border-white/10 bg-white/5 text-white hover:bg-white/10' : 'border-white/60 bg-white/60 text-slate-700 hover:bg-white'}`}>
           <Globe className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 sm:mr-2" /> {lang}
         </button>
         <button onClick={() => setIsDark(!isDark)} className={`p-2 sm:p-2.5 rounded-xl border transition-colors active:scale-95 shadow-lg backdrop-blur-md ${isDark ? 'border-white/10 bg-white/5 text-yellow-400 hover:bg-white/10' : 'border-white/60 bg-white/60 text-indigo-600 hover:bg-white'}`}>
           {isDark ? <Sun size={16} className="sm:w-[18px] sm:h-[18px]" /> : <Moon size={16} className="sm:w-[18px] sm:h-[18px]" />}
         </button>
      </div>

      {/* ANIMATED BACKGROUND ORBS (COMBINED INDIGO & ORANGE - Visible in Light & Dark Mode) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.div 
          animate={{ x: [-20, 30, -20], y: [-20, 30, -20] }} 
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }} 
          className={`absolute top-[-10%] right-[-10%] w-[50rem] h-[50rem] rounded-full blur-[140px] bg-[#4f46e5] ${isDark ? 'opacity-[0.15]' : 'opacity-[0.12]'}`} 
        />
        <motion.div 
          animate={{ x: [30, -20, 30], y: [30, -20, 30] }} 
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }} 
          className={`absolute bottom-[-10%] left-[-10%] w-[45rem] h-[45rem] rounded-full blur-[140px] bg-[#ea580c] ${isDark ? 'opacity-[0.12]' : 'opacity-[0.1]'}`} 
        />
        {/* Subtle Texture */}
        <motion.div 
          className={`absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] ${isDark ? 'opacity-[0.02]' : 'opacity-[0.04]'}`}
          animate={{ backgroundPosition: ["0px 0px", "100px 100px"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* MAIN CONTAINER */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-6 sm:gap-8 lg:gap-12 relative z-10 items-start mt-8 lg:mt-0"
      >
        
        {/* LEFT COLUMN: DYNAMIC STORYTELLING (Pinned with sticky) */}
        <div className="hidden lg:flex flex-col pr-4 sticky top-32">
           <AnimatePresence mode="wait">
             {renderStory()}
           </AnimatePresence>
        </div>

        {/* RIGHT COLUMN: THE LOGIN CARD */}
        <div className="flex flex-col w-full">
          
          {/* MOBILE STORY HEADER */}
          <div className="lg:hidden text-center mb-6">
            <div className="w-12 h-12 mx-auto rounded-2xl flex items-center justify-center shadow-lg bg-[#050505] border border-white/10 mb-4">
               <ShieldCheck size={24} className="text-white" />
            </div>
            <h2 className={`text-3xl font-bold tracking-tight mb-2 ${textPrimary}`}>
              {isLogin ? t.storyLogTitle1 : isCargoMode ? t.storyCargoTitle1 : t.storyTruckTitle1} <br/>
              <span className={accentColor}>{isLogin ? t.storyLogTitle2 : isCargoMode ? t.storyCargoTitle2 : t.storyTruckTitle2}</span>
            </h2>
            <p className={`text-sm font-medium px-4 ${textSecondary}`}>
              {isLogin ? t.storyLogSub : isCargoMode ? t.storyCargoSub : t.storyTruckSub}
            </p>
          </div>

          <div className={`border rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 w-full transition-colors duration-500 ${glassPanelCard}`}>
            
            <div className="text-center mb-8">
              <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight mb-2 ${textPrimary}`}>
                {isLogin ? t.formLoginTitle : t.formJoinTitle}
              </h2>
              <p className={`text-sm font-medium ${textSecondary}`}>
                {isLogin ? t.formLoginSub : t.formJoinSub}
              </p>
            </div>

            {/* ROLE SELECTOR */}
            {!isLogin && (
              <div className={`flex p-1.5 rounded-xl mb-8 relative border ${isDark ? 'bg-black/40 border-white/5' : 'bg-white/60 border-slate-200 shadow-inner'}`}>
                <motion.div 
                  className="absolute top-1.5 bottom-1.5 w-[calc(50%-0.375rem)] rounded-lg shadow-md"
                  style={{ backgroundColor: primaryButtonHex }}
                  animate={{ x: role === 'cargo_owner' ? '0%' : '100%' }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
                <button
                  type="button"
                  onClick={() => setRole('cargo_owner')}
                  className={`flex-1 py-3 text-[10px] sm:text-xs font-bold uppercase tracking-widest rounded-lg transition-all z-10 flex items-center justify-center gap-2 ${role === 'cargo_owner' ? 'text-white' : textSecondary}`}
                >
                  <Package size={16} /> {t.cargoBtn}
                </button>
                <button
                  type="button"
                  onClick={() => setRole('truck_owner')}
                  className={`flex-1 py-3 text-[10px] sm:text-xs font-bold uppercase tracking-widest rounded-lg transition-all z-10 flex items-center justify-center gap-2 ${role === 'truck_owner' ? 'text-white' : textSecondary}`}
                >
                  <Truck size={16} /> {t.truckBtn}
                </button>
              </div>
            )}

            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
                <AlertTriangle className="text-red-500 shrink-0" size={18} />
                <p className="text-xs sm:text-sm font-bold text-red-500">{error}</p>
              </motion.div>
            )}

            {/* FORM ENGINE */}
            <form onSubmit={handleAuth} className="space-y-4">
              
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div key="register-fields" variants={viewTransition} initial="hidden" animate="visible" exit="exit" className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input required type="text" placeholder={t.name} value={fullName} onChange={e => setFullName(e.target.value)} className={inputStyle} />
                      </div>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input required type="tel" placeholder={t.phone} value={phone} onChange={e => setPhone(e.target.value)} className={inputStyle} />
                      </div>
                    </div>

                    {/* CUSTOM PREMIUM REGION DROPDOWN */}
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                      <input 
                        required 
                        type="text"
                        placeholder={t.region} 
                        value={region} 
                        onChange={e => { setRegion(e.target.value); setShowRegions(true); }}
                        onFocus={() => setShowRegions(true)}
                        onBlur={() => setTimeout(() => setShowRegions(false), 200)}
                        className={inputStyle} 
                      />
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                      <AnimatePresence>
                        {showRegions && (
                          <motion.ul 
                            initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                            className={`absolute z-50 w-full mt-2 max-h-48 overflow-y-auto rounded-xl border shadow-2xl p-1.5 ${isDark ? 'bg-[#0a0a0c] border-white/10' : 'bg-white border-slate-200'}`}
                          >
                            {tanzaniaRegions.filter(r => r.toLowerCase().includes(region.toLowerCase())).map(reg => (
                              <li 
                                key={reg} 
                                onMouseDown={() => { setRegion(reg); setShowRegions(false); }} 
                                className={`px-4 py-3 rounded-lg cursor-pointer text-sm font-semibold transition-colors ${isDark ? 'hover:bg-white/10 text-slate-200' : 'hover:bg-slate-100 text-slate-700'}`}
                              >
                                {reg}
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* CONDITIONAL CARGO OWNER FIELDS */}
                    <AnimatePresence>
                      {role === 'cargo_owner' && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }} 
                          animate={{ opacity: 1, height: 'auto' }} 
                          exit={{ opacity: 0, height: 0 }} 
                          transition={{ opacity: { duration: 0.2 }, height: { duration: 0.3, ease: "easeInOut" } }}
                          className="relative overflow-hidden"
                        >
                          <FileText className="absolute left-4 top-[28px] -translate-y-1/2 text-slate-500" size={18} />
                          <input required type="text" placeholder={t.tinText} value={tin} onChange={e => setTin(e.target.value)} className={`${inputStyle} mt-1`} />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* CONDITIONAL TRUCK OWNER FIELDS */}
                    <AnimatePresence>
                      {role === 'truck_owner' && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }} 
                          animate={{ opacity: 1, height: 'auto' }} 
                          exit={{ opacity: 0, height: 0 }} 
                          transition={{ opacity: { duration: 0.2 }, height: { duration: 0.3, ease: "easeInOut" } }}
                          className="space-y-4 overflow-hidden pt-4"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="relative">
                              <Truck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                              <input list="truckTypes" required placeholder={t.truckType} value={truckType} onChange={e => setTruckType(e.target.value)} className={inputStyle} />
                              <datalist id="truckTypes">
                                <option value="Flatbed"/>
                                <option value="Tipper"/>
                                <option value="Box Truck"/>
                                <option value="Refrigerated"/>
                                <option value="Lowboy"/>
                              </datalist>
                            </div>
                            <div className="relative">
                              <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                              <input required type="number" placeholder={t.capacity} value={capacity} onChange={e => setCapacity(e.target.value)} className={inputStyle} />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="relative">
                              <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                              <input required type="text" placeholder={t.nidaText} value={nida} onChange={e => setNida(e.target.value)} maxLength={20} className={`${inputStyle} tracking-widest`} />
                            </div>
                            <div className="relative">
                              <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                              <input required type="text" placeholder={t.licenseText} value={license} onChange={e => setLicense(e.target.value)} className={`${inputStyle} tracking-widest`} />
                            </div>
                          </div>

                          {/* FILE UPLOADS */}
                          <div className="grid grid-cols-2 gap-4 pt-2">
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="relative group cursor-pointer">
                              <input type="file" accept="image/*" required onChange={(e) => handleFileChange(e, setNidaFile)} className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer" />
                              <div className={`border-2 border-dashed rounded-xl p-4 text-center transition-all ${nidaFile ? 'border-green-500 bg-green-500/10' : isDark ? 'border-white/20 bg-black/40 hover:border-orange-500' : 'border-slate-300 bg-white/50 hover:border-orange-500'}`}>
                                <div className="text-xl mb-1">{nidaFile ? '✅' : '🪪'}</div>
                                <p className={`text-[9px] font-bold uppercase tracking-wider truncate ${nidaFile ? 'text-green-500' : textSecondary}`}>{t.nidaDoc}</p>
                              </div>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="relative group cursor-pointer">
                              <input type="file" accept="image/*" required onChange={(e) => handleFileChange(e, setPlateFile)} className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer" />
                              <div className={`border-2 border-dashed rounded-xl p-4 text-center transition-all ${plateFile ? 'border-green-500 bg-green-500/10' : isDark ? 'border-white/20 bg-black/40 hover:border-orange-500' : 'border-slate-300 bg-white/50 hover:border-orange-500'}`}>
                                <div className="text-xl mb-1">{plateFile ? '✅' : '🚛'}</div>
                                <p className={`text-[9px] font-bold uppercase tracking-wider truncate ${plateFile ? 'text-green-500' : textSecondary}`}>{t.plateDoc}</p>
                              </div>
                            </motion.div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input required type="email" placeholder={t.email} value={email} onChange={e => setEmail(e.target.value)} className={inputStyle} />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input required type="password" placeholder={t.password} value={password} onChange={e => setPassword(e.target.value)} className={inputStyle} />
              </div>

              <motion.button 
                type="submit" 
                disabled={loading} 
                initial={{ backgroundColor: primaryButtonHex }}
                animate={{ backgroundColor: primaryButtonHex }}
                whileHover={{ backgroundColor: oppositeButtonHex, scale: 1.02 }} 
                whileTap={{ backgroundColor: oppositeButtonHex, scale: 0.96 }}
                transition={{ duration: 0.3 }}
                className={`w-full py-4 sm:py-4.5 rounded-xl text-white font-bold uppercase tracking-widest text-xs transition-shadow shadow-xl flex items-center justify-center gap-3 mt-6 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? t.btnInit : t.btnDeploy)}
                {!loading && <ArrowRight size={18} />}
              </motion.button>
            </form>

            <div className="mt-8 text-center">
              <p className={`text-xs sm:text-sm font-medium ${textSecondary}`}>
                {isLogin ? `${t.unrecognized} ` : `${t.verified} `}
                <button onClick={() => { setIsLogin(!isLogin); setError(null); }} className={`font-bold transition-colors ${accentColor} hover:underline`}>
                  {isLogin ? t.reqClearance : t.authHere}
                </button>
              </p>
            </div>
          </div>
        </div>

      </motion.div>
    </motion.div>
  );
}