"use client";
import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState('');
  
  // Basic Info
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('cargo_owner');
  const [region, setRegion] = useState('Dar es Salaam'); // Default region

  // Truck Specs
  const [truckType, setTruckType] = useState('Flatbed');
  const [capacity, setCapacity] = useState('30');

  // Verification Files & Text
  const [nidaText, setNidaText] = useState('');
  const [nidaFile, setNidaFile] = useState<File | null>(null);
  const [plateFile, setPlateFile] = useState<File | null>(null);

  // File Size Validator (Max 5MB)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setFile: React.Dispatch<React.SetStateAction<File | null>>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File is too large. Please select an image under 5MB.");
        e.target.value = ''; // Reset input
        return;
      }
      setFile(file);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      setStatusText('Authenticating...');
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        alert("Login Failed: " + error.message);
        setLoading(false);
      } else {
        router.push('/dashboard');
      }
    } else {
      // --- STRICT VALIDATION BEFORE WE EVEN HIT THE DATABASE ---
      if (role === 'truck_owner') {
        const nidaClean = nidaText.replace(/\s/g, ''); // remove spaces
        if (nidaClean.length !== 20 || !/^\d+$/.test(nidaClean)) {
          alert("Invalid NIDA: Must be exactly 20 digits.");
          setLoading(false);
          return;
        }
        if (!nidaFile || !plateFile) {
          alert("Please upload both your physical NIDA and Truck Plate images.");
          setLoading(false);
          return;
        }
      }

      setStatusText('Creating account...');
      const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
      
      if (authError) {
        alert("Signup Failed: " + authError.message);
        setLoading(false);
        return;
      } 
      
      if (authData.user) {
        let nidaUrl = null;
        let plateUrl = null;

        // --- SECURE IMAGE UPLOADS ---
        if (role === 'truck_owner') {
          setStatusText('Uploading secure documents...');
          
          if (nidaFile) {
            const nidaExt = nidaFile.name.split('.').pop();
            const nidaPath = `${authData.user.id}-nida.${nidaExt}`; // Groups file to specific driver ID!
            const { error: uploadErr } = await supabase.storage.from('verification_docs').upload(nidaPath, nidaFile);
            if (!uploadErr) {
              const { data: publicUrlData } = supabase.storage.from('verification_docs').getPublicUrl(nidaPath);
              nidaUrl = publicUrlData.publicUrl;
            }
          }

          if (plateFile) {
            const plateExt = plateFile.name.split('.').pop();
            const platePath = `${authData.user.id}-plate.${plateExt}`; // Groups file to specific driver ID!
            const { error: uploadErr } = await supabase.storage.from('verification_docs').upload(platePath, plateFile);
            if (!uploadErr) {
              const { data: publicUrlData } = supabase.storage.from('verification_docs').getPublicUrl(platePath);
              plateUrl = publicUrlData.publicUrl;
            }
          }
        }

        setStatusText('Finalizing profile...');
        
        const { error: dbError } = await supabase.from('users').insert([{
          id: authData.user.id,
          email: email,
          full_name: fullName,
          phone: phone,
          role: role,
          region: region,
          truck_type: role === 'truck_owner' ? truckType : null,
          capacity_tons: role === 'truck_owner' ? capacity : null,
          nida_number: role === 'truck_owner' ? nidaText : null,
          nida_image_url: nidaUrl,
          plate_image_url: plateUrl,
          account_status: role === 'truck_owner' ? 'pending_review' : 'active'
        }]);

        if (dbError) {
          alert("Profile error: " + dbError.message);
          setLoading(false);
        } else {
          router.push('/dashboard');
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-900 selection:bg-orange-500 selection:text-white">
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 md:px-24 py-12 bg-white shadow-2xl z-10 relative overflow-y-auto">
        <div className="max-w-md w-full mx-auto my-auto">
          <div className="flex items-center gap-3 mb-6 mt-8">
            <div className="w-10 h-10 bg-orange-500 text-white flex items-center justify-center rounded-xl font-bold text-xl shadow-lg">G</div>
            <span className="text-2xl font-black tracking-tight text-slate-900">Geek Logistics</span>
          </div>

          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
            {isLogin ? 'Welcome back' : 'Create an account'}
          </h2>
          <p className="text-slate-500 mb-6 font-medium text-sm">
            {isLogin ? 'Enter your details to access your command center.' : 'Join the most verified freight network in East Africa.'}
          </p>

          <form className="space-y-4" onSubmit={handleAuth}>
            {!isLogin && (
              <div className="flex p-1 bg-slate-100 rounded-xl mb-4">
                <button type="button" onClick={() => setRole('cargo_owner')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${role === 'cargo_owner' ? 'bg-white text-orange-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>
                  Cargo Owner
                </button>
                <button type="button" onClick={() => setRole('truck_owner')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${role === 'truck_owner' ? 'bg-white text-orange-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>
                  Truck Owner
                </button>
              </div>
            )}

            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Full Name / Company</label>
                    <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Phone</label>
                    <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm" placeholder="0700 000 000" />
                  </div>
                </div>

                {/* Location Dropdown */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Base Region</label>
                  <select value={region} onChange={(e) => setRegion(e.target.value)} className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm font-medium">
                    <option value="Dar es Salaam">Dar es Salaam</option>
                    <option value="Arusha">Arusha</option>
                    <option value="Mwanza">Mwanza</option>
                    <option value="Dodoma">Dodoma</option>
                    <option value="Mbeya">Mbeya</option>
                    <option value="Kilimanjaro">Kilimanjaro</option>
                  </select>
                </div>
              </>
            )}

            {/* TRUCK OWNER SPECIFIC FIELDS */}
            {!isLogin && role === 'truck_owner' && (
              <div className="p-4 bg-orange-50/50 border border-orange-100 rounded-xl space-y-4">
                <h3 className="text-sm font-bold text-orange-800 flex items-center gap-2 border-b border-orange-200 pb-2">
                  Fleet & Verification Specs
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Truck Type</label>
                    <select value={truckType} onChange={(e) => setTruckType(e.target.value)} className="w-full bg-white border border-slate-200 px-3 py-2 rounded-lg text-sm outline-none">
                      <option value="Flatbed">Flatbed</option>
                      <option value="Tipper">Tipper</option>
                      <option value="Box Truck">Box Truck</option>
                      <option value="Refrigerated">Refrigerated</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Capacity (Tons)</label>
                    <input type="number" required value={capacity} onChange={(e) => setCapacity(e.target.value)} className="w-full bg-white border border-slate-200 px-3 py-2 rounded-lg text-sm outline-none" placeholder="30" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">20-Digit NIDA Number</label>
                  <input type="text" required value={nidaText} onChange={(e) => setNidaText(e.target.value)} maxLength={20} className="w-full bg-white border border-slate-200 px-3 py-2 rounded-lg text-sm outline-none font-mono" placeholder="19901025..." />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="relative group cursor-pointer">
                    <input type="file" accept="image/*" required onChange={(e) => handleFileChange(e, setNidaFile)} className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer" />
                    <div className={`border-2 border-dashed rounded-xl p-3 text-center transition-all ${nidaFile ? 'border-green-500 bg-green-50' : 'border-slate-300 bg-white hover:border-orange-500'}`}>
                      <div className="text-xl mb-1">{nidaFile ? '✅' : '🪪'}</div>
                      <p className="text-[10px] font-bold text-slate-600 truncate px-1">{nidaFile ? nidaFile.name : 'Photo of NIDA'}</p>
                    </div>
                  </div>

                  <div className="relative group cursor-pointer">
                    <input type="file" accept="image/*" required onChange={(e) => handleFileChange(e, setPlateFile)} className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer" />
                    <div className={`border-2 border-dashed rounded-xl p-3 text-center transition-all ${plateFile ? 'border-green-500 bg-green-50' : 'border-slate-300 bg-white hover:border-orange-500'}`}>
                      <div className="text-xl mb-1">{plateFile ? '✅' : '🚛'}</div>
                      <p className="text-[10px] font-bold text-slate-600 truncate px-1">{plateFile ? plateFile.name : 'Photo of Plate'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email Address</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm" placeholder="you@company.com" />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm" placeholder="••••••••" />
            </div>

            <button disabled={loading} className="w-full bg-slate-900 hover:bg-orange-500 disabled:bg-slate-300 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all mt-6 text-base">
              {loading ? statusText : (isLogin ? 'Sign In' : 'Join Network')}
            </button>
          </form>

          <p className="text-center text-slate-500 mt-6 font-medium pb-4 text-sm">
            {isLogin ? "New to Geek Logistics? " : "Already verified? "}
            <button onClick={() => setIsLogin(!isLogin)} className="text-orange-500 font-bold hover:underline">
              {isLogin ? 'Create an account' : 'Sign in here'}
            </button>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 bg-slate-900 relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/20 blur-[100px] rounded-full"></div>
        <div className="relative z-10 max-w-lg text-center px-12">
          <h3 className="text-4xl font-extrabold text-white mb-6 leading-tight">East Africa's most trusted freight network.</h3>
          <p className="text-slate-400 text-lg leading-relaxed">We secure the network by validating NIDA IDs, organizing fleets by base region, and enforcing strict payload specifications.</p>
        </div>
      </div>
    </div>
  );
}