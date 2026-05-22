
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Language } from '../types';
import SEO from '../components/SEO';
import { TRANSLATIONS } from '../constants';
import { sendNotifications } from '../utils/notifications';
import { ShieldCheck, Award, Globe, CheckCircle, ArrowRight, Loader2, Building, User, FileText, Zap, Monitor, Briefcase, Lock } from 'lucide-react';
import Logo from '../components/Logo';
import Badge from '../components/Badge';

const AccreditationApply: React.FC = () => {
  const { lang: paramLang } = useParams<{ lang: string }>();
  const lang = (Object.values(Language).includes(paramLang as Language)) ? (paramLang as Language) : Language.ENGLISH;
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', 
    email: '',
    phone: '',
    country: '',
    city: '',
    type: 'ATP', 
    experience: '',
    courses: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    await sendNotifications('SERVICE_REQUEST', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        details: `ACCREDITATION APPLICATION: ${formData.type} in ${formData.city}, ${formData.country}. Experience: ${formData.experience}.`
    });

    setTimeout(() => {
        setLoading(false);
        setStep(3);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col pt-24 pb-12 font-sans relative overflow-hidden">
      <SEO 
        title="Get Accredited | Digital Solutions Hub" 
        description="Become a Global Accredited Partner. Issue verified certificates and access our White-Label Platform." 
        lang={lang} 
      />

      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-gold-500/5 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-6xl mx-auto w-full px-4 relative z-10">
        
        {/* Sales Pitch Hero */}
        <div className="text-center mb-16">
           <Link to={`/${lang}`} className="inline-block mb-6 hover:opacity-80 transition-opacity">
              <Logo className="w-16 h-16" withText={true} />
           </Link>
           <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold-500/30 bg-gold-500/10 mb-6 animate-fade-in-up">
              <span className="text-gold-400 text-xs font-bold uppercase tracking-widest">Global Accreditation Authority</span>
           </div>
           <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
              Don't Just Teach. <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300">Become an Authority.</span>
           </h1>
           <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              "Digital Solutions Hub is not just an institute, it is a global digital education authority. 
              By becoming an accredited partner, you get ready-made courses, certificates, 
              verification system, CRM, LMS, and international trust — without building anything from scratch."
           </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
           {[
              { icon: Globe, title: "International Recognition", desc: "Issue certificates verified by a global body." },
              { icon: Monitor, title: "White-Label Platform", desc: "Your own LMS & CRM under your brand domain." },
              { icon: Briefcase, title: "Ready-Made Business", desc: "Instant access to curriculum, exams, and workflows." },
              { icon: CheckCircle, title: "Central Verification", desc: "Anti-fraud student certificate tracking system." },
              { icon: Zap, title: "Marketing Support", desc: "Use our brand authority to close more sales." },
              { icon: ShieldCheck, title: "Legal Protection", desc: "Secure contracts, NDAs, and compliance checks." }
           ].map((item, i) => (
              <div key={i} className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 hover:border-gold-500/30 transition-all group">
                 <item.icon className="w-10 h-10 text-slate-600 group-hover:text-gold-500 mb-4 transition-colors" />
                 <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                 <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
           ))}
        </div>

        {/* Application Form */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden max-w-4xl mx-auto">
           
           {/* Steps Indicator */}
           {step < 3 && (
              <div className="flex justify-between items-center mb-10 relative max-w-xs mx-auto">
                 <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-800 -z-10 rounded-full"></div>
                 <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${step >= 1 ? 'bg-gold-500 text-black' : 'bg-slate-800 text-gray-500'}`}>1</div>
                 <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${step >= 2 ? 'bg-gold-500 text-black' : 'bg-slate-800 text-gray-500'}`}>2</div>
                 <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${step >= 3 ? 'bg-gold-500 text-black' : 'bg-slate-800 text-gray-500'}`}>3</div>
              </div>
           )}

           {step === 1 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                 <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-gold-500" /> {TRANSLATIONS.attestation_req[lang]}
                 </h2>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div 
                        onClick={() => setFormData({...formData, type: 'ATP'})}
                        className={`p-6 rounded-xl border cursor-pointer transition-all ${formData.type === 'ATP' ? 'bg-gold-500/10 border-gold-500' : 'bg-slate-950 border-white/10 hover:border-white/30'}`}
                    >
                        <Building className={`w-8 h-8 mb-4 ${formData.type === 'ATP' ? 'text-gold-500' : 'text-gray-400'}`} />
                        <h3 className="text-lg font-bold text-white mb-2">Training Partner (ATP)</h3>
                        <p className="text-xs text-gray-400">For Institutes & Schools.</p>
                    </div>
                    <div 
                        onClick={() => setFormData({...formData, type: 'AI'})}
                        className={`p-6 rounded-xl border cursor-pointer transition-all ${formData.type === 'AI' ? 'bg-gold-500/10 border-gold-500' : 'bg-slate-950 border-white/10 hover:border-white/30'}`}
                    >
                        <User className={`w-8 h-8 mb-4 ${formData.type === 'AI' ? 'text-gold-500' : 'text-gray-400'}`} />
                        <h3 className="text-lg font-bold text-white mb-2">Accredited Instructor (AI)</h3>
                        <p className="text-xs text-gray-400">For Freelance Trainers.</p>
                    </div>
                    <div 
                        onClick={() => setFormData({...formData, type: 'CTP'})}
                        className={`p-6 rounded-xl border cursor-pointer transition-all ${formData.type === 'CTP' ? 'bg-gold-500/10 border-gold-500' : 'bg-slate-950 border-white/10 hover:border-white/30'}`}
                    >
                        <Globe className={`w-8 h-8 mb-4 ${formData.type === 'CTP' ? 'text-gold-500' : 'text-gray-400'}`} />
                        <h3 className="text-lg font-bold text-white mb-2">Corporate Partner (CTP)</h3>
                        <p className="text-xs text-gray-400">For Companies.</p>
                    </div>
                 </div>
                 
                 <div className="flex justify-end">
                    <button onClick={() => setStep(2)} className="px-8 py-3 bg-gold-500 text-black font-bold rounded-xl hover:bg-gold-400 flex items-center gap-2 transition-all">
                       {TRANSLATIONS.btn_next[lang]} <ArrowRight className="w-5 h-5 rtl:rotate-180" />
                    </button>
                 </div>
              </div>
           )}

           {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                 <h2 className="text-2xl font-bold text-white mb-6">{TRANSLATIONS.institute_profile[lang]}</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                       <label className="block text-sm font-bold text-gray-400 mb-2">
                          {formData.type === 'AI' ? TRANSLATIONS.owner_name[lang] : TRANSLATIONS.form_institute_name[lang]}
                       </label>
                       <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-gold-500 transition-colors" placeholder={formData.type === 'AI' ? 'e.g. Ali Khan' : 'e.g. Tech Skills Academy'} />
                    </div>
                    <div>
                       <label className="block text-sm font-bold text-gray-400 mb-2">{TRANSLATIONS.email[lang]}</label>
                       <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-gold-500 transition-colors" placeholder="contact@example.com" />
                    </div>
                    <div>
                       <label className="block text-sm font-bold text-gray-400 mb-2">{TRANSLATIONS.lbl_city[lang]}</label>
                       <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-gold-500 transition-colors" placeholder="e.g. Lahore" />
                    </div>
                    <div>
                       <label className="block text-sm font-bold text-gray-400 mb-2">{TRANSLATIONS.lbl_country[lang]}</label>
                       <input type="text" name="country" value={formData.country} onChange={handleChange} className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-gold-500 transition-colors" placeholder="e.g. Pakistan" />
                    </div>
                    <div>
                       <label className="block text-sm font-bold text-gray-400 mb-2">{TRANSLATIONS.phone_num[lang]}</label>
                       <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-gold-500 transition-colors" placeholder="+92 301 7862281" />
                    </div>
                    <div className="md:col-span-2">
                       <label className="block text-sm font-bold text-gray-400 mb-2">{TRANSLATIONS.lbl_experience[lang]}</label>
                       <textarea name="experience" value={formData.experience} onChange={handleChange} rows={3} className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-gold-500 transition-colors" placeholder="Briefly describe your training experience or institute history..." />
                    </div>
                 </div>
                 
                 {/* Legal Checkbox */}
                 <div className="mb-8 p-4 bg-slate-950/50 border border-white/5 rounded-xl">
                    <p className="text-xs text-gray-400 mb-2">By applying, you agree to our standard terms:</p>
                    <div className="flex flex-wrap gap-4 text-xs font-bold text-gold-500">
                        <Link to="/en/legal/accreditation-agreement" target="_blank" className="hover:underline flex items-center gap-1"><FileText className="w-3 h-3"/> Accreditation Agreement</Link>
                        <Link to="/en/legal/white-label-agreement" target="_blank" className="hover:underline flex items-center gap-1"><FileText className="w-3 h-3"/> White-Label Agreement</Link>
                        <Link to="/en/legal/nda" target="_blank" className="hover:underline flex items-center gap-1"><Lock className="w-3 h-3"/> NDA</Link>
                    </div>
                 </div>

                 <div className="flex justify-between">
                    <button onClick={() => setStep(1)} className="px-8 py-3 text-gray-400 font-bold hover:text-white transition-colors">
                       {TRANSLATIONS.btn_back[lang]}
                    </button>
                    <button onClick={handleSubmit} disabled={loading} className="px-8 py-3 bg-gradient-to-r from-gold-500 to-yellow-600 text-black font-bold rounded-xl hover:shadow-lg hover:shadow-gold-500/20 flex items-center gap-2 transition-all">
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
                 <h2 className="text-3xl font-bold text-white mb-4">Application Submitted!</h2>
                 <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto">
                    We have received your request for <strong>{formData.type === 'ATP' ? 'Partner' : formData.type === 'AI' ? 'Instructor' : 'Corporate'} Accreditation</strong>.
                    <br/><br/>
                    Our Accreditation Board will review your details and contact you for the audit process within 3 business days.
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

export default AccreditationApply;
