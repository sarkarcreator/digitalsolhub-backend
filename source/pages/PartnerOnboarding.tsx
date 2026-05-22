
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';
import Logo from '../components/Logo';
import { registerPartner } from '../utils/partnerManager';
import { 
  Building, User, Mail, Phone, Globe, Palette, CheckCircle, 
  ArrowRight, Loader2, Upload, Layout, ArrowLeft
} from 'lucide-react';

const PartnerOnboarding: React.FC = () => {
  const { lang: paramLang } = useParams<{ lang: string }>();
  const lang = (Object.values(Language).includes(paramLang as Language)) ? (paramLang as Language) : Language.ENGLISH;
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    slug: '',
    email: '',
    phone: '',
    website: '',
    brandColor: '#3b82f6',
    logo: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Basic slugify
    const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    setFormData({ ...formData, slug: val });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
        const newPartner = registerPartner(formData);
        setLoading(false);
        navigate(`/p/${newPartner.slug}/dashboard`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col items-center justify-center p-4">
      <SEO title={`${TRANSLATIONS.institute_profile[lang]} | DSH`} description="Setup your white-label institute." lang={lang} />
      
      {/* Header */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center">
         <Link to={`/${lang}`} className="flex items-center gap-2">
            <Logo className="w-8 h-8" />
            <span className="font-bold text-sm hidden sm:block">Digital Solutions Hub</span>
         </Link>
         <div className="text-xs text-gray-500 font-mono">Partner Setup Wizard v1.0</div>
      </div>

      <div className="w-full max-w-2xl">
         
         {/* Steps */}
         <div className="flex justify-between items-center mb-12 px-8">
            {[1, 2, 3].map((s) => (
               <div key={s} className="flex flex-col items-center relative z-10">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ${step >= s ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]' : 'bg-slate-800 text-gray-500'}`}>
                     {step > s ? <CheckCircle className="w-5 h-5"/> : s}
                  </div>
                  <span className={`text-xs mt-2 font-medium ${step >= s ? 'text-blue-400' : 'text-gray-600'}`}>
                     {s === 1 ? 'Profile' : s === 2 ? 'Branding' : 'Review'}
                  </span>
               </div>
            ))}
            {/* Progress Bar */}
            <div className="absolute top-9 left-0 w-full h-0.5 bg-slate-800 -z-0">
               <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${((step - 1) / 2) * 100}%` }}></div>
            </div>
         </div>

         {/* Form Card */}
         <div className="bg-slate-900 border border-white/10 rounded-2xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-[80px] pointer-events-none"></div>

            <form onSubmit={handleSubmit}>
                {step === 1 && (
                   <div className="space-y-6 animate-in fade-in slide-in-from-right-8">
                      <div className="text-center mb-8">
                         <h2 className="text-2xl font-bold mb-2">{TRANSLATIONS.institute_profile[lang]}</h2>
                         <p className="text-gray-400 text-sm">Let's set up your organization's basic details.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{TRANSLATIONS.form_institute_name[lang]}</label>
                            <div className="relative">
                               <Building className="absolute left-3 top-3 w-5 h-5 text-gray-500 rtl:right-3 rtl:left-auto" />
                               <input required name="name" value={formData.name} onChange={handleChange} className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 pl-10 pr-4 rtl:pr-10 rtl:pl-4 focus:border-blue-500 outline-none transition-colors" placeholder="e.g. Apex Coding Academy" />
                            </div>
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{TRANSLATIONS.form_tagline[lang]}</label>
                            <input name="tagline" value={formData.tagline} onChange={handleChange} className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 px-4 focus:border-blue-500 outline-none transition-colors" placeholder="e.g. Learn. Build. Grow." />
                         </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{TRANSLATIONS.email[lang]}</label>
                            <div className="relative">
                               <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-500 rtl:right-3 rtl:left-auto" />
                               <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 pl-10 pr-4 rtl:pr-10 rtl:pl-4 focus:border-blue-500 outline-none transition-colors" placeholder="admin@institute.com" />
                            </div>
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{TRANSLATIONS.phone_num[lang]}</label>
                            <div className="relative">
                               <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-500 rtl:right-3 rtl:left-auto" />
                               <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 pl-10 pr-4 rtl:pr-10 rtl:pl-4 focus:border-blue-500 outline-none transition-colors" placeholder="+1 234 567 890" />
                            </div>
                         </div>
                      </div>

                      <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{TRANSLATIONS.form_website[lang]}</label>
                         <div className="relative">
                            <Globe className="absolute left-3 top-3 w-5 h-5 text-gray-500 rtl:right-3 rtl:left-auto" />
                            <input name="website" value={formData.website} onChange={handleChange} className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 pl-10 pr-4 rtl:pr-10 rtl:pl-4 focus:border-blue-500 outline-none transition-colors" placeholder="https://..." />
                         </div>
                      </div>

                      <div className="flex justify-end pt-4">
                         <button type="button" onClick={() => setStep(2)} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold flex items-center gap-2 transition-all">
                            {TRANSLATIONS.btn_next[lang]} <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                         </button>
                      </div>
                   </div>
                )}

                {step === 2 && (
                   <div className="space-y-6 animate-in fade-in slide-in-from-right-8">
                      <div className="text-center mb-8">
                         <h2 className="text-2xl font-bold mb-2">{TRANSLATIONS.white_label_branding[lang]}</h2>
                         <p className="text-gray-400 text-sm">Customize how your certificates and portal look.</p>
                      </div>

                      <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{TRANSLATIONS.form_custom_subdomain[lang]}</label>
                         <div className="flex items-center direction-ltr">
                            <span className="bg-slate-800 border border-white/10 border-r-0 rounded-l-xl py-3 px-4 text-gray-400 text-sm">verify.</span>
                            <input required name="slug" value={formData.slug} onChange={handleSlugChange} className="flex-1 bg-slate-950 border border-white/10 rounded-r-xl py-3 px-4 focus:border-blue-500 outline-none transition-colors font-mono text-blue-400" placeholder="your-brand" />
                            <span className="bg-slate-800 border border-white/10 border-l-0 rounded-r-xl py-3 px-4 text-gray-400 text-sm">.digitalsolhub.com</span>
                         </div>
                         <p className="text-[10px] text-gray-500 mt-2">This will be your verification portal URL.</p>
                      </div>

                      <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{TRANSLATIONS.form_brand_color[lang]}</label>
                         <div className="flex gap-4 items-center bg-slate-950 border border-white/10 p-4 rounded-xl">
                            <input type="color" name="brandColor" value={formData.brandColor} onChange={handleChange} className="w-10 h-10 rounded cursor-pointer bg-transparent border-0" />
                            <div className="flex-1">
                               <p className="text-sm font-bold text-white">{formData.brandColor}</p>
                               <p className="text-xs text-gray-500">Primary color for certificates & dashboard.</p>
                            </div>
                            <div className="w-8 h-8 rounded-full border-2 border-white/20" style={{ backgroundColor: formData.brandColor }}></div>
                         </div>
                      </div>

                      <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{TRANSLATIONS.form_logo_url[lang]}</label>
                         <div className="relative">
                            <div className="absolute left-3 top-3 rtl:right-3 rtl:left-auto"><Upload className="w-5 h-5 text-gray-500"/></div>
                            <input name="logo" value={formData.logo} onChange={handleChange} className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 pl-10 pr-4 rtl:pr-10 rtl:pl-4 focus:border-blue-500 outline-none transition-colors" placeholder="https://your-site.com/logo.png" />
                         </div>
                         {formData.logo && (
                            <div className="mt-4 p-4 bg-white/5 rounded-xl flex justify-center border border-white/5 border-dashed">
                               <img src={formData.logo} alt="Preview" className="h-12 object-contain" onError={(e) => (e.target as HTMLImageElement).style.display = 'none'} />
                            </div>
                         )}
                      </div>

                      <div className="flex justify-between pt-4">
                         <button type="button" onClick={() => setStep(1)} className="px-6 py-3 text-gray-400 hover:text-white font-bold transition-colors">
                            {TRANSLATIONS.btn_back[lang]}
                         </button>
                         <button type="button" onClick={() => setStep(3)} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold flex items-center gap-2 transition-all">
                            {TRANSLATIONS.btn_next[lang]} <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                         </button>
                      </div>
                   </div>
                )}

                {step === 3 && (
                   <div className="space-y-8 animate-in fade-in slide-in-from-right-8 text-center">
                      <div className="mb-8">
                         <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-500">
                            <Layout className="w-10 h-10" />
                         </div>
                         <h2 className="text-2xl font-bold mb-2">{TRANSLATIONS.ready_launch[lang]}</h2>
                         <p className="text-gray-400 text-sm max-w-md mx-auto">
                            You are about to create a dedicated partner workspace for <strong>{formData.name}</strong>.
                         </p>
                      </div>

                      <div className="bg-slate-950 rounded-xl p-6 border border-white/10 text-left rtl:text-right max-w-sm mx-auto space-y-3">
                         <div className="flex justify-between">
                            <span className="text-gray-500 text-xs uppercase">Portal URL</span>
                            <span className="text-blue-400 font-mono text-xs">verify.{formData.slug}.dsh.com</span>
                         </div>
                         <div className="flex justify-between">
                            <span className="text-gray-500 text-xs uppercase">Admin Email</span>
                            <span className="text-white text-sm">{formData.email}</span>
                         </div>
                         <div className="flex justify-between">
                            <span className="text-gray-500 text-xs uppercase">Theme</span>
                            <div className="flex items-center gap-2">
                               <div className="w-3 h-3 rounded-full" style={{ backgroundColor: formData.brandColor }}></div>
                               <span className="text-white text-sm">{formData.brandColor}</span>
                            </div>
                         </div>
                      </div>

                      <div className="flex justify-between pt-4">
                         <button type="button" onClick={() => setStep(2)} className="px-6 py-3 text-gray-400 hover:text-white font-bold transition-colors">
                            {TRANSLATIONS.btn_back[lang]}
                         </button>
                         <button type="submit" disabled={loading} className="px-10 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-lg hover:shadow-cyan-500/20 rounded-xl font-bold flex items-center gap-2 transition-all text-white">
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : TRANSLATIONS.btn_create_workspace[lang]}
                         </button>
                      </div>
                   </div>
                )}
            </form>
         </div>
      </div>
    </div>
  );
};

export default PartnerOnboarding;
