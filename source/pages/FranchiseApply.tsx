
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';
import SEO from '../components/SEO';
import { sendNotifications } from '../utils/notifications';
import { GitBranch, MapPin, DollarSign, Building, Loader2, CheckCircle, ArrowRight, Upload } from 'lucide-react';
import Logo from '../components/Logo';

const FranchiseApply: React.FC = () => {
  const { lang: paramLang } = useParams<{ lang: string }>();
  const lang = (Object.values(Language).includes(paramLang as Language)) ? (paramLang as Language) : Language.ENGLISH;
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    city: '',
    country: '',
    type: 'Partner',
    investment: '',
    experience: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API Call using notification util
    await sendNotifications('SERVICE_REQUEST', {
        name: formData.ownerName,
        email: formData.email,
        phone: formData.phone,
        details: `FRANCHISE APPLICATION: ${formData.type} in ${formData.city}, ${formData.country}. Investment: ${formData.investment}`
    });

    setTimeout(() => {
        setLoading(false);
        setStep(3);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col pt-24 pb-12 font-sans relative overflow-hidden">
      <SEO 
        title="Become a Franchise Partner | Digital Solutions Hub" 
        description="Join our global network. Open a DSH Branch in your city." 
        lang={lang} 
      />

      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-brand-neon/5 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-4xl mx-auto w-full px-4 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-12">
           <Link to={`/${lang}`} className="inline-block mb-6 hover:opacity-80 transition-opacity">
              <Logo className="w-16 h-16" withText={true} />
           </Link>
           <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              Expand Your Legacy with DSH
           </h1>
           <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Join the fastest growing digital education and agency network. Open a branch in your city today.
           </p>
        </div>

        {/* Form Container */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
           
           {step < 3 && (
              <div className="flex justify-between items-center mb-10 relative">
                 <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-800 -z-10 rounded-full"></div>
                 <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${step >= 1 ? 'bg-brand-neon text-black' : 'bg-slate-800 text-gray-500'}`}>1</div>
                 <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${step >= 2 ? 'bg-brand-neon text-black' : 'bg-slate-800 text-gray-500'}`}>2</div>
                 <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${step >= 3 ? 'bg-brand-neon text-black' : 'bg-slate-800 text-gray-500'}`}>3</div>
              </div>
           )}

           {step === 1 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                 <h2 className="text-2xl font-bold text-white mb-6">{TRANSLATIONS.business_details[lang]}</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                       <label className="block text-sm font-bold text-gray-400 mb-2">{TRANSLATIONS.owner_name[lang]}</label>
                       <div className="relative">
                          <input type="text" name="ownerName" value={formData.ownerName} onChange={handleChange} className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-brand-neon transition-colors" placeholder="e.g. Ali Khan" />
                       </div>
                    </div>
                    <div>
                       <label className="block text-sm font-bold text-gray-400 mb-2">{TRANSLATIONS.business_name[lang]}</label>
                       <div className="relative">
                          <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-brand-neon transition-colors" placeholder="e.g. DSH Lahore Campus" />
                       </div>
                    </div>
                    <div>
                       <label className="block text-sm font-bold text-gray-400 mb-2">{TRANSLATIONS.email[lang]}</label>
                       <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-brand-neon transition-colors" placeholder="contact@business.com" />
                    </div>
                    <div>
                       <label className="block text-sm font-bold text-gray-400 mb-2">{TRANSLATIONS.phone_num[lang]}</label>
                       <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-brand-neon transition-colors" placeholder="+1 917 695 7737" />
                    </div>
                 </div>
                 <div className="flex justify-end">
                    <button onClick={() => setStep(2)} className="px-8 py-3 bg-brand-neon text-black font-bold rounded-xl hover:shadow-[0_0_15px_rgba(0,243,255,0.4)] flex items-center gap-2 transition-all">
                       {TRANSLATIONS.btn_next[lang]} <ArrowRight className="w-5 h-5 rtl:rotate-180" />
                    </button>
                 </div>
              </div>
           )}

           {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                 <h2 className="text-2xl font-bold text-white mb-6">{TRANSLATIONS.location_strategy[lang]}</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                       <label className="block text-sm font-bold text-gray-400 mb-2">{TRANSLATIONS.lbl_city[lang]}</label>
                       <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-brand-neon transition-colors" placeholder="e.g. Dubai" />
                    </div>
                    <div>
                       <label className="block text-sm font-bold text-gray-400 mb-2">{TRANSLATIONS.lbl_country[lang]}</label>
                       <input type="text" name="country" value={formData.country} onChange={handleChange} className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-brand-neon transition-colors" placeholder="e.g. UAE" />
                    </div>
                    <div>
                       <label className="block text-sm font-bold text-gray-400 mb-2">{TRANSLATIONS.lbl_franchise_type[lang]}</label>
                       <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-brand-neon transition-colors relative z-10">
                          <option value="Partner">Partner Franchise (Physical)</option>
                          <option value="International">International Master Franchise</option>
                          <option value="Online">Online Franchise (Virtual)</option>
                       </select>
                    </div>
                    <div>
                       <label className="block text-sm font-bold text-gray-400 mb-2">{TRANSLATIONS.lbl_investment[lang]}</label>
                       <select name="investment" value={formData.investment} onChange={handleChange} className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-brand-neon transition-colors relative z-10">
                          <option value="Low">Under $5,000</option>
                          <option value="Medium">$5,000 - $20,000</option>
                          <option value="High">$20,000+</option>
                       </select>
                    </div>
                    <div className="md:col-span-2">
                       <label className="block text-sm font-bold text-gray-400 mb-2">{TRANSLATIONS.lbl_experience[lang]} (Optional)</label>
                       <textarea name="experience" value={formData.experience} onChange={handleChange} rows={3} className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-brand-neon transition-colors" placeholder="Describe your experience in education or digital business..." />
                    </div>
                 </div>
                 <div className="flex justify-between">
                    <button onClick={() => setStep(1)} className="px-8 py-3 text-gray-400 font-bold hover:text-white transition-colors">
                       {TRANSLATIONS.btn_back[lang]}
                    </button>
                    <button onClick={handleSubmit} disabled={loading} className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-purple-500/20 flex items-center gap-2 transition-all">
                       {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : TRANSLATIONS.btn_submit_app[lang]}
                    </button>
                 </div>
              </div>
           )}

           {step === 3 && (
              <div className="text-center py-12 animate-in zoom-in duration-500">
                 <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-12 h-12 text-green-500" />
                 </div>
                 <h2 className="text-3xl font-bold text-white mb-4">Application Received!</h2>
                 <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto">
                    Thank you for your interest in partnering with Digital Solutions Hub. Our franchise team will review your details and contact you within 48 hours.
                 </p>
                 <Link to={`/${lang}`} className="px-8 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-colors inline-block">
                    {TRANSLATIONS.home[lang]}
                 </Link>
              </div>
           )}

        </div>
      </div>
    </div>
  );
};

export default FranchiseApply;
