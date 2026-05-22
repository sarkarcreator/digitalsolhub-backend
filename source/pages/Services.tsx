import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { TRANSLATIONS, SERVICE_CATEGORIES, PRICING_PACKAGES, PAYMENT_METHODS, PAYMENT_TERMS } from '../constants';
import { Language } from '../types';
import SEO from '../components/SEO';
import { sendNotifications } from '../utils/notifications';
import { ArrowRight, Check, Send, Sparkles, Monitor, Globe, Megaphone, Video, Cpu, Layers, DollarSign, Coins, Loader2, Landmark, Smartphone, CreditCard, Bitcoin, AlertTriangle } from 'lucide-react';

const Services: React.FC = () => {
  const { lang: paramLang } = useParams<{ lang: string }>();
  const lang = (Object.values(Language).includes(paramLang as Language)) ? (paramLang as Language) : Language.ENGLISH;
  
  const [formVisible, setFormVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    budget: '$100 - $500',
    details: ''
  });

  // Pricing States
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'onetime'>('monthly');
  const [currency, setCurrency] = useState<'USD' | 'PKR'>('USD');

  useEffect(() => {
    try {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (timeZone.includes('Karachi') || timeZone.includes('Islamabad') || timeZone.includes('Pakistan')) {
        setCurrency('PKR');
      }
    } catch (e) {
      console.log('Timezone detection failed, defaulting to USD');
    }
  }, []);

  // Icon mapping
  const icons: { [key: string]: any } = {
    'web-dev': Monitor,
    'seo': Globe,
    'marketing': Megaphone,
    'social': Video, // Changed to video for social monetization
    'monetization': Coins,
    'graphic-design': Layers,
    'ai-solutions': Cpu,
    'other': Sparkles
  };

  const paymentIcons: { [key: string]: any } = {
    'Landmark': Landmark,
    'Smartphone': Smartphone,
    'CreditCard': CreditCard,
    'Globe': Globe,
    'Bitcoin': Bitcoin
  };

  const handleRequest = (catId: string = '') => {
    if (catId) setSelectedCategory(catId);
    setFormVisible(true);
    setTimeout(() => {
      document.getElementById('service-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await sendNotifications('SERVICE_REQUEST', {
        name: formData.name,
        email: formData.email,
        phone: formData.whatsapp,
        details: `Category: ${selectedCategory}, Budget: ${formData.budget}, Desc: ${formData.details}`
      });

      if (result.success) {
        window.open(result.adminUrl, '_blank');
        setSubmitted(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-slate-950">
      <SEO 
        title={`${TRANSLATIONS.services[lang]} | Digital Solutions Hub`} 
        description={TRANSLATIONS.svc_hero_sub[lang]} 
        lang={lang} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center mb-16 md:mb-24 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-neon/5 rounded-full blur-[120px] pointer-events-none"></div>
          
          <div className="inline-block px-4 py-1.5 rounded-full border border-brand-neon/30 bg-brand-neon/5 backdrop-blur-sm mb-6 animate-float">
             <span className="text-brand-neon text-sm font-bold uppercase tracking-wider">{TRANSLATIONS.services[lang]}</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight relative z-10">
            {TRANSLATIONS.our_services[lang]}
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed relative z-10">
            {TRANSLATIONS.svc_hero_sub[lang]}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24 relative z-10">
           {SERVICE_CATEGORIES.map((service) => {
             const Icon = icons[service.id] || Sparkles;
             return (
               <div key={service.id} className="group bg-slate-900/50 border border-white/5 rounded-2xl p-8 hover:bg-slate-800/60 hover:border-brand-neon/30 transition-all duration-300 flex flex-col">
                  <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center mb-6 group-hover:bg-brand-neon group-hover:text-black transition-colors text-brand-neon">
                     <Icon className="w-8 h-8" />
                  </div>
                  <Link to={`/${lang}/services/${service.id}`} className="block">
                    <h3 className="text-2xl font-bold text-white mb-4 hover:text-brand-neon transition-colors cursor-pointer">{service.title[lang]}</h3>
                  </Link>
                  <ul className="space-y-3 mb-8 flex-grow">
                    {service.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-400 text-sm">
                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-brand-neon shrink-0"></div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="flex gap-4 mt-auto">
                    <button 
                      onClick={() => handleRequest(service.id)}
                      className="flex-1 py-3 border border-white/10 rounded-xl text-white font-bold hover:bg-brand-neon hover:text-black hover:border-brand-neon transition-all flex items-center justify-center gap-2"
                    >
                      {TRANSLATIONS.svc_req_btn[lang]}
                    </button>
                    <Link 
                      to={`/${lang}/services/${service.id}`}
                      className="px-4 py-3 bg-slate-800 rounded-xl text-gray-300 hover:text-white hover:bg-slate-700 transition-colors flex items-center justify-center"
                      title={TRANSLATIONS.view_details[lang]}
                    >
                      <ArrowRight className="w-5 h-5 rtl:rotate-180" />
                    </Link>
                  </div>
               </div>
             );
           })}
        </div>

        {/* How It Works */}
        <section className="mb-24">
           <h2 className="text-3xl font-bold text-white mb-12 text-center">{TRANSLATIONS.how_it_works[lang]}</h2>
           <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                 { step: "01", title: TRANSLATIONS.hiw_req[lang], icon: Check },
                 { step: "02", title: TRANSLATIONS.hiw_prop[lang], icon: Check },
                 { step: "03", title: TRANSLATIONS.hiw_pay[lang], icon: Check },
                 { step: "04", title: TRANSLATIONS.hiw_deliver[lang], icon: Check },
              ].map((step, i) => (
                 <div key={i} className="relative flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-slate-900 border-2 border-brand-neon rounded-full flex items-center justify-center text-xl font-bold text-white mb-6 shadow-[0_0_20px_rgba(6,182,212,0.2)] z-10">
                       {step.step}
                    </div>
                    <h3 className="text-lg font-bold text-white">{step.title}</h3>
                 </div>
              ))}
           </div>
           <div className="text-center mt-12">
              <button onClick={() => handleRequest()} className="px-8 py-4 bg-gradient-to-r from-brand-blue to-brand-neon text-black font-bold rounded-xl shadow-lg hover:shadow-cyan-500/20 transition-all">
                 {TRANSLATIONS.get_consult[lang]}
              </button>
           </div>
        </section>

        {/* Pricing & Packages Section */}
        <div className="mb-24 relative z-10">
           <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{TRANSLATIONS.pricing_title[lang]}</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">{TRANSLATIONS.pricing_sub[lang]}</p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8">
                 {/* Currency Toggle */}
                 <div className="bg-slate-900 border border-white/10 rounded-lg p-1 flex items-center">
                    <button onClick={() => setCurrency('USD')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${currency === 'USD' ? 'bg-brand-blue text-white' : 'text-gray-400 hover:text-white'}`}>USD</button>
                    <button onClick={() => setCurrency('PKR')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${currency === 'PKR' ? 'bg-brand-blue text-white' : 'text-gray-400 hover:text-white'}`}>PKR</button>
                 </div>
                 
                 {/* Billing Toggle */}
                 <div className="bg-slate-900 border border-white/10 rounded-lg p-1 flex items-center">
                    <button onClick={() => setBillingCycle('monthly')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${billingCycle === 'monthly' ? 'bg-brand-neon text-black' : 'text-gray-400 hover:text-white'}`}>{TRANSLATIONS.monthly[lang]}</button>
                    <button onClick={() => setBillingCycle('onetime')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${billingCycle === 'onetime' ? 'bg-brand-neon text-black' : 'text-gray-400 hover:text-white'}`}>{TRANSLATIONS.one_time[lang]}</button>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-16">
              {PRICING_PACKAGES.map((pkg, idx) => {
                 let priceDisplay = '';
                 if (pkg.price === 'custom') {
                    priceDisplay = TRANSLATIONS.custom_price[lang] || 'Custom';
                 } else {
                    const amount = (pkg.price as any)[currency][billingCycle];
                    const symbol = currency === 'USD' ? '$' : 'Rs ';
                    priceDisplay = `${symbol}${amount}`;
                 }

                 return (
                   <div key={pkg.id} className={`relative rounded-2xl p-8 transition-all duration-300 ${pkg.popular ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-brand-neon shadow-[0_0_30px_rgba(0,243,255,0.15)] transform md:-translate-y-4' : 'bg-slate-900/50 border border-white/10 hover:border-brand-blue/50'}`}>
                      {pkg.popular && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-neon text-black text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full shadow-lg">{TRANSLATIONS.most_popular[lang]}</div>}
                      <h3 className="text-xl font-bold text-white mb-2">{pkg.name[lang]}</h3>
                      <div className="text-3xl font-bold text-white mb-6">
                         {priceDisplay}
                         {pkg.price !== 'custom' && billingCycle === 'monthly' && <span className="text-base font-normal text-gray-500">/mo</span>}
                      </div>
                      <div className="space-y-4 mb-8">
                         {pkg.features[lang]?.map((feat: string, i: number) => (
                            <div key={i} className="flex items-start gap-3 text-gray-400">
                               <Check className={`w-5 h-5 shrink-0 ${pkg.popular ? 'text-brand-neon' : 'text-brand-blue'}`} />
                               <span className="text-sm">{feat}</span>
                            </div>
                         ))}
                      </div>
                      <button onClick={() => handleRequest(pkg.id === 'business' ? '' : 'web-dev')} className={`w-full py-3 rounded-xl font-bold transition-all ${pkg.popular ? 'bg-brand-neon text-black hover:bg-cyan-400 shadow-lg shadow-cyan-500/20' : 'bg-slate-800 text-white hover:bg-white hover:text-black border border-white/10'}`}>
                         {TRANSLATIONS[pkg.buttonKey as keyof typeof TRANSLATIONS]?.[lang]}
                      </button>
                   </div>
                 );
              })}
           </div>
        </div>

        {/* Request Form Section */}
        <div id="service-form" className={`transition-all duration-700 ${formVisible ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-10'}`}>
           <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden max-w-4xl mx-auto">
              {submitted ? (
                <div className="text-center py-12 relative z-10">
                  <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in">
                    <Check className="w-12 h-12 text-green-500" />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-4">{TRANSLATIONS.form_success[lang]}</h2>
                  <p className="text-gray-400 text-lg mb-8">{TRANSLATIONS.form_success_msg[lang]}</p>
                  <button onClick={() => { setSubmitted(false); setFormVisible(false); }} className="px-8 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-colors">
                     {TRANSLATIONS.home[lang]}
                  </button>
                </div>
              ) : (
                <div className="relative z-10">
                  <div className="text-center mb-10">
                     <h2 className="text-3xl font-bold text-white mb-2">{TRANSLATIONS.svc_quote_btn[lang]}</h2>
                     <p className="text-gray-400">{TRANSLATIONS.svc_expert_btn[lang]}</p>
                  </div>

                  <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="md:col-span-2">
                       <label className="block text-sm font-bold text-gray-400 mb-2">{TRANSLATIONS.form_category[lang]}</label>
                       <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-neon transition-colors relative z-10">
                         <option value="">Select a Category</option>
                         {SERVICE_CATEGORIES.map(c => (
                           <option key={c.id} value={c.id}>{c.title[lang]}</option>
                         ))}
                       </select>
                     </div>
                     <div>
                       <label className="block text-sm font-bold text-gray-400 mb-2">{TRANSLATIONS.form_name[lang]}</label>
                       <input name="name" value={formData.name} onChange={handleInputChange} required type="text" className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-neon transition-colors" placeholder="John Doe" />
                     </div>
                     <div>
                       <label className="block text-sm font-bold text-gray-400 mb-2">{TRANSLATIONS.form_email[lang]}</label>
                       <input name="email" value={formData.email} onChange={handleInputChange} required type="email" className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-neon transition-colors" placeholder="john@example.com" />
                     </div>
                     <div>
                       <label className="block text-sm font-bold text-gray-400 mb-2">{TRANSLATIONS.form_whatsapp[lang]}</label>
                       <input name="whatsapp" value={formData.whatsapp} onChange={handleInputChange} required type="tel" className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-neon transition-colors" placeholder="+1 917 695 7737" />
                     </div>
                     <div>
                       <label className="block text-sm font-bold text-gray-400 mb-2">{TRANSLATIONS.form_budget[lang]}</label>
                       <select name="budget" value={formData.budget} onChange={handleInputChange} className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-neon transition-colors relative z-10">
                          <option>$100 - $500</option>
                          <option>$500 - $1,000</option>
                          <option>$1,000 - $5,000</option>
                          <option>$5,000+</option>
                       </select>
                     </div>
                     <div className="md:col-span-2">
                       <label className="block text-sm font-bold text-gray-400 mb-2">{TRANSLATIONS.form_details[lang]}</label>
                       <textarea name="details" value={formData.details} onChange={handleInputChange} required rows={4} className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-neon transition-colors" placeholder="Tell us about your project..."></textarea>
                     </div>
                     <div className="md:col-span-2">
                       <button type="submit" disabled={loading} className="w-full py-4 bg-gradient-to-r from-brand-blue to-brand-neon text-black font-bold text-lg rounded-xl hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] transition-all flex items-center justify-center gap-2">
                          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{TRANSLATIONS.form_submit[lang]} <Send className="w-5 h-5 rtl:rotate-180" /></>}
                       </button>
                     </div>
                  </form>
                </div>
              )}
           </div>
        </div>

      </div>
    </div>
  );
};

export default Services;
