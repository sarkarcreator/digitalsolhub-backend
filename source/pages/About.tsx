
import React from 'react';
import { useParams } from 'react-router-dom';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';
import SEO from '../components/SEO';
import { ADMIN_WHATSAPP } from '../utils/notifications';
import { Award, Target, Heart, TrendingUp, Briefcase, Globe } from 'lucide-react';

const About: React.FC = () => {
  const { lang: paramLang } = useParams<{ lang: string }>();
  const lang = (Object.values(Language).includes(paramLang as Language)) ? (paramLang as Language) : Language.ENGLISH;

  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "mainEntity": {
      "@type": "Person",
      "name": "Sarkar Azeem",
      "jobTitle": "CEO & Founder",
      "affiliation": {
        "@type": "Organization",
        "name": "Digital Solutions Hub"
      }
    }
  };

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <SEO 
        title={TRANSLATIONS.metaTitleAbout[lang]} 
        description={TRANSLATIONS.metaDescAbout[lang]} 
        lang={lang} 
        schema={aboutSchema}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">{TRANSLATIONS.about[lang]}</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            {TRANSLATIONS.metaDescAbout[lang]}
          </p>
        </div>

        {/* CEO Section */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-8 md:p-12 mb-20 relative overflow-hidden">
           <div className="absolute top-0 right-0 rtl:left-0 rtl:right-auto w-64 h-64 bg-gold-500/10 blur-[80px] rounded-full"></div>
           <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-gold-500/30 overflow-hidden shadow-2xl shrink-0">
                 <img src="https://picsum.photos/400/400?grayscale" alt="Sarkar Azeem CEO" className="w-full h-full object-cover" />
              </div>
              <div className="text-center md:text-left rtl:md:text-right">
                 <h2 className="text-3xl font-bold text-white mb-2">
                   {lang === Language.ENGLISH ? 'Sarkar Azeem' : 'سرکار عظیم'}
                 </h2>
                 <p className="text-gold-400 font-medium text-lg mb-6">
                   {lang === Language.ENGLISH ? 'CEO & Founder' : 'CEO اور فاؤنڈر'}
                 </p>
                 <blockquote className="text-xl text-gray-300 italic mb-6">
                   "{lang === Language.ENGLISH 
                     ? 'The future belongs to those who learn more skills and combine them in creative ways.' 
                     : 'مستقبل ان لوگوں کا ہے جو مزید مہارتیں سیکھتے ہیں اور انہیں تخلیقی طریقوں سے جوڑتے ہیں۔'}"
                 </blockquote>
                 <a href={`https://wa.me/${ADMIN_WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium">
                   {lang === Language.ENGLISH ? 'WhatsApp' : 'واٹس ایپ'}
                 </a>
              </div>
           </div>
        </div>

        {/* Mission Vision Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-slate-900/50 p-8 rounded-xl border border-white/5 hover:border-gold-500/30 transition-all group">
            <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mb-6 group-hover:bg-gold-500 group-hover:text-black transition-colors">
                <Target className="w-6 h-6 text-gold-500 group-hover:text-black" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">{lang === Language.ENGLISH ? 'Our Mission' : 'ہمارا مشن'}</h3>
            <p className="text-gray-400">
              {lang === Language.ENGLISH 
                ? 'To bridge the gap between talent and opportunity through world-class digital education.' 
                : 'عالمی معیار کی ڈیجیٹل تعلیم کے ذریعے ٹیلنٹ اور مواقع کے درمیان خلا کو پاور کرنا۔'}
            </p>
          </div>

          <div className="bg-slate-900/50 p-8 rounded-xl border border-white/5 hover:border-gold-500/30 transition-all group">
            <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mb-6 group-hover:bg-gold-500 group-hover:text-black transition-colors">
                <Award className="w-6 h-6 text-gold-500 group-hover:text-black" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">{lang === Language.ENGLISH ? 'Our Vision' : 'ہمارا وژن'}</h3>
            <p className="text-gray-400">
              {lang === Language.ENGLISH 
                ? 'To become the leading digital empowerment hub in the region.' 
                : 'علاقے میں ڈیجیٹل بااختیاری کا سب سے بڑا مرکز بننا۔'}
            </p>
          </div>

          <div className="bg-slate-900/50 p-8 rounded-xl border border-white/5 hover:border-gold-500/30 transition-all group">
            <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mb-6 group-hover:bg-gold-500 group-hover:text-black transition-colors">
                <Heart className="w-6 h-6 text-gold-500 group-hover:text-black" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">{lang === Language.ENGLISH ? 'Our Values' : 'ہمارے اقدار'}</h3>
            <p className="text-gray-400">
              {lang === Language.ENGLISH 
                ? 'Integrity, Innovation, Excellence, and Student Success.' 
                : 'دیانتداری، جدت، کمال، اور طلباء کی کامیابی۔'}
            </p>
          </div>
        </div>

        {/* Investment & Partner Power Line */}
        <section className="bg-slate-900 rounded-3xl p-12 text-center border border-white/10 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-96 h-96 bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>
           <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold-600/5 rounded-full blur-[120px] pointer-events-none"></div>
           
           <div className="relative z-10">
              <h2 className="text-3xl font-bold text-white mb-6">Why Partner With Us?</h2>
              <div className="text-2xl md:text-3xl font-serif text-gold-400 italic mb-10 leading-relaxed max-w-4xl mx-auto">
                 "Digital Solutions Hub is a multi-income digital ecosystem with courses, services, accreditation, and automation — designed for scalable, global growth."
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-5xl mx-auto">
                 <div className="flex items-start gap-4">
                    <div className="p-3 bg-slate-800 rounded-xl text-blue-400">
                       <Globe className="w-6 h-6" />
                    </div>
                    <div>
                       <h4 className="font-bold text-white mb-1">Global Scale</h4>
                       <p className="text-gray-400 text-sm">International reach across Pakistan, UAE, and beyond.</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-4">
                    <div className="p-3 bg-slate-800 rounded-xl text-green-400">
                       <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                       <h4 className="font-bold text-white mb-1">Diverse Revenue</h4>
                       <p className="text-gray-400 text-sm">7 income streams ensuring business stability.</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-4">
                    <div className="p-3 bg-slate-800 rounded-xl text-gold-400">
                       <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                       <h4 className="font-bold text-white mb-1">High Growth</h4>
                       <p className="text-gray-400 text-sm">Projected to reach 66M+ PKR annual revenue.</p>
                    </div>
                 </div>
              </div>
           </div>
        </section>

      </div>
    </div>
  );
};

export default About;
