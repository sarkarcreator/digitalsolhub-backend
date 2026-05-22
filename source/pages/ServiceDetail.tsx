
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { SERVICE_CATEGORIES, TRANSLATIONS } from '../constants';
import { Language } from '../types';
import SEO from '../components/SEO';
import { ArrowLeft, CheckCircle, ChevronDown, ChevronUp, Clock, HelpCircle, Send, Star, Zap } from 'lucide-react';

const ServiceDetail: React.FC = () => {
  const { lang: paramLang, id } = useParams<{ lang: string; id: string }>();
  const lang = (Object.values(Language).includes(paramLang as Language)) ? (paramLang as Language) : Language.ENGLISH;
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = React.useState<number | null>(0);

  const service = SERVICE_CATEGORIES.find(s => s.id === id);

  if (!service || !service.details) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white">
      <h2 className="text-3xl font-bold mb-4">{lang === Language.ENGLISH ? 'Service Not Found' : 'سروس نہیں ملی'}</h2>
        <Link to={`/${lang}/services`} className="px-6 py-2 bg-brand-neon text-black rounded font-bold hover:bg-cyan-400">
          {TRANSLATIONS.back_services[lang]}
        </Link>
      </div>
    );
  }

  const { title, details } = service;
  const serviceTitle = title[lang] || title[Language.ENGLISH];
  const tagline = details.tagline[lang] || details.tagline[Language.ENGLISH];

  // Service Schema
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": serviceTitle,
    "provider": {
      "@type": "Organization",
      "name": "Digital Solutions Hub",
      "url": "https://digitalsolhub.com"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Global"
    },
    "description": details.metaDesc[lang],
    "offers": {
      "@type": "Offer",
      "price": "500",
      "priceCurrency": "USD"
    }
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-slate-950 text-white">
      <SEO 
        title={`${serviceTitle} | Digital Solutions Hub`} 
        description={details.metaDesc[lang] || ''} 
        lang={lang} 
        schema={serviceSchema}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
           <ArrowLeft className="w-4 h-4 rtl:rotate-180" /> {TRANSLATIONS.back_services[lang]}
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 md:p-12 border border-white/10 mb-12 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-96 h-96 bg-brand-neon/5 rounded-full blur-[100px] pointer-events-none"></div>
           <div className="relative z-10">
              <span className="inline-block px-3 py-1 rounded-full bg-brand-neon/10 text-brand-neon text-sm font-bold mb-4 border border-brand-neon/20">
                 {tagline}
              </span>
              <h1 className="text-4xl md:text-6xl font-extrabold mb-6">{serviceTitle}</h1>
              <p className="text-xl text-gray-400 max-w-2xl">{details.metaDesc[lang]}</p>
              
              <div className="flex flex-wrap gap-4 mt-8">
                 <Link to={`/${lang}/contact`} className="px-8 py-3 bg-brand-neon text-black font-bold rounded-xl hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20">
                    {TRANSLATIONS.get_consult[lang]}
                 </Link>
                 <button onClick={() => document.getElementById('benefits')?.scrollIntoView({behavior: 'smooth'})} className="px-8 py-3 border border-white/10 text-white font-bold rounded-xl hover:bg-white/5 transition-all">
                    {TRANSLATIONS.view_details[lang]}
                 </button>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
           
           {/* Main Content */}
           <div className="lg:col-span-2 space-y-12">
              
              {/* Benefits */}
              <section id="benefits">
                 <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Star className="w-6 h-6 text-brand-neon" /> {TRANSLATIONS.key_benefits[lang]}
                 </h2>
                 <div className="grid gap-4">
                    {details.benefits.map((benefit, i) => (
                       <div key={i} className="flex gap-4 p-4 rounded-xl bg-slate-900/50 border border-white/5">
                          <div className="mt-1">
                             <CheckCircle className="w-6 h-6 text-green-500" />
                          </div>
                          <div>
                             <h3 className="font-bold text-lg text-white mb-1">{benefit.title[lang]}</h3>
                             <p className="text-gray-400 text-sm">{benefit.desc[lang]}</p>
                          </div>
                       </div>
                    ))}
                 </div>
              </section>

              {/* Process */}
              <section>
                 <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Clock className="w-6 h-6 text-brand-neon" /> {TRANSLATIONS.our_process[lang]}
                 </h2>
                 <div className="relative border-l-2 border-slate-800 ml-3 space-y-8 pl-8 py-2">
                    {details.process.map((step, i) => (
                       <div key={i} className="relative">
                          <div className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-slate-900 border-2 border-brand-neon flex items-center justify-center text-xs font-bold text-white">
                             {i + 1}
                          </div>
                          <h3 className="font-bold text-lg text-white mb-2">{step.title[lang]}</h3>
                          <p className="text-gray-400">{step.desc[lang]}</p>
                       </div>
                    ))}
                 </div>
              </section>

              {/* FAQs */}
              <section>
                 <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <HelpCircle className="w-6 h-6 text-brand-neon" /> {TRANSLATIONS.freq_asked[lang]}
                 </h2>
                 <div className="space-y-4">
                    {details.faqs.map((faq, i) => (
                       <div key={i} className="border border-white/10 rounded-xl overflow-hidden bg-slate-900/30">
                          <button 
                             onClick={() => setOpenFaq(openFaq === i ? null : i)}
                             className="w-full flex items-center justify-between p-4 text-left font-bold text-white hover:bg-white/5 transition-colors"
                          >
                             {faq.question[lang]}
                             {openFaq === i ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                          </button>
                          {openFaq === i && (
                             <div className="p-4 pt-0 text-gray-400 text-sm leading-relaxed border-t border-white/5 mt-2">
                                {faq.answer[lang]}
                             </div>
                          )}
                       </div>
                    ))}
                 </div>
              </section>

           </div>

           {/* Sidebar */}
           <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                 
                 <div className="bg-gradient-to-br from-brand-blue to-purple-900 rounded-2xl p-6 shadow-xl border border-white/10 text-center">
                    <Zap className="w-12 h-12 text-white mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2">{TRANSLATIONS.ready_start[lang]}</h3>
                    <p className="text-white/80 mb-6 text-sm">Transform your business with our expert solutions today.</p>
                    <Link to={`/${lang}/contact`} className="block w-full py-3 bg-white text-brand-blue font-bold rounded-xl hover:bg-gray-100 transition-colors">
                       {TRANSLATIONS.book_consult[lang]}
                    </Link>
                 </div>

                 <div className="bg-slate-900 rounded-2xl p-6 border border-white/5">
                    <h4 className="font-bold text-white mb-4">Why Choose Us?</h4>
                    <ul className="space-y-3 text-sm text-gray-400">
                       <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-brand-neon" /> Expert Team</li>
                       <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-brand-neon" /> 24/7 Support</li>
                       <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-brand-neon" /> Proven Results</li>
                       <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-brand-neon" /> Global Standards</li>
                    </ul>
                 </div>

              </div>
           </div>

        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
