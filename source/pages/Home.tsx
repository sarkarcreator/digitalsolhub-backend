
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';
import SEO from '../components/SEO';
import { 
  ArrowRight, CheckCircle, Monitor, Briefcase, 
  Coins, Users, Rocket, Brain, ShieldCheck, 
  Globe, Megaphone, ShoppingBag, Wrench, Search, BookOpen 
} from 'lucide-react';

const Home: React.FC = () => {
  const { lang: paramLang } = useParams<{ lang: string }>();
  const lang = (Object.values(Language).includes(paramLang as Language)) ? (paramLang as Language) : Language.ENGLISH;

  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Digital Solutions Hub",
    "url": "https://digitalsolhub.com",
    "logo": "https://digitalsolhub.com/logo.png",
    "founder": {
      "@type": "Person",
      "name": "Sarkar Azeem"
    },
    "sameAs": [
      "https://www.facebook.com/digitalsolutionshub",
      "https://www.linkedin.com/company/digitalsolutionshub",
      "https://www.instagram.com/digitalsolutionshub"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-917-695-7737",
      "contactType": "customer service",
      "areaServed": ["PK", "AE", "US", "GB"],
      "availableLanguage": ["English", "Urdu", "Arabic"]
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Digital Solutions Hub",
    "url": "https://digitalsolhub.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://digitalsolhub.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <div className="min-h-screen">
      <SEO 
        title={TRANSLATIONS.metaTitleHome[lang]}
        description={TRANSLATIONS.metaDescHome[lang]} 
        lang={lang} 
        schema={{ "@graph": [organizationSchema, websiteSchema] }}
      />

      {/* Hero Section - Super Platform */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-40 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-black">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-900/10 rounded-full blur-[150px] animate-pulse-slow"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-gold-600/10 rounded-full blur-[150px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-block mb-8 px-5 py-2 rounded-full border border-gold-500/30 bg-gold-500/10 backdrop-blur-md animate-float">
             <span className="text-gold-400 text-xs md:text-sm font-bold tracking-widest uppercase">The All-in-One Digital Ecosystem</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-tight tracking-tight">
            {TRANSLATIONS.super_tagline[lang]}
          </h1>
          
          <p className="max-w-3xl mx-auto text-gray-400 text-lg md:text-2xl mb-12 leading-relaxed font-light">
            One platform to <span className="text-white font-bold">Learn</span>, <span className="text-white font-bold">Earn</span>, <span className="text-white font-bold">Hire</span>, and <span className="text-white font-bold">Grow</span>. 
            Join the digital revolution with AI-powered tools, global accreditation, and seamless services.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to={`/${lang}/academy`} className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white font-bold text-xl hover:shadow-2xl hover:shadow-blue-500/30 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3">
              <Rocket className="w-6 h-6" /> {TRANSLATIONS.eco_learn[lang]}
            </Link>
            <Link to={`/${lang}/services`} className="w-full sm:w-auto px-10 py-5 bg-slate-800 border border-gold-500/50 rounded-2xl text-gold-400 font-bold text-xl hover:bg-slate-700 hover:border-gold-400 transition-all flex items-center justify-center gap-3">
              <Briefcase className="w-6 h-6" /> {TRANSLATIONS.eco_hire[lang]}
            </Link>
          </div>
        </div>
      </section>

      {/* Ecosystem Grid */}
      <section className="py-24 bg-black border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
             <h2 className="text-4xl font-bold text-white mb-6">Explore the Ecosystem</h2>
             <div className="h-1.5 w-24 bg-gradient-to-r from-blue-500 via-purple-500 to-gold-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {[
               { icon: BookOpen, title: "Academy", desc: "Master digital skills with AI-powered courses.", link: `/${lang}/academy`, color: "text-blue-400", bg: "bg-blue-900/20" },
               { icon: Briefcase, title: "Services Hub", desc: "Hire experts for SEO, Web, and Marketing.", link: `/${lang}/services`, color: "text-purple-400", bg: "bg-purple-900/20" },
               { icon: ShoppingBag, title: "Marketplace", desc: "Buy & Sell freelance gigs and digital assets.", link: `/${lang}/marketplace`, color: "text-green-400", bg: "bg-green-900/20" },
               { icon: Search, title: "Job Portal", desc: "Find remote jobs and internships globally.", link: `/${lang}/jobs`, color: "text-pink-400", bg: "bg-pink-900/20" },
               { icon: Wrench, title: "AI Tools Suite", desc: "Automate your work with 50+ AI tools.", link: `/${lang}/tools`, color: "text-cyan-400", bg: "bg-cyan-900/20" },
               { icon: Rocket, title: "Incubator", desc: "Launch your startup with investor funding.", link: `/${lang}/startup`, color: "text-gold-400", bg: "bg-yellow-900/20" },
             ].map((item, i) => (
                <Link key={i} to={item.link} className="relative group overflow-hidden bg-slate-900 p-8 rounded-3xl border border-white/5 hover:border-white/20 transition-all duration-300">
                   <div className={`absolute top-0 right-0 w-32 h-32 ${item.bg} rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                   <div className={`w-16 h-16 ${item.bg} rounded-2xl flex items-center justify-center mb-6 ${item.color} group-hover:scale-110 transition-transform duration-500`}>
                      <item.icon className="w-8 h-8" />
                   </div>
                   <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                   <p className="text-gray-400 text-lg mb-6 leading-relaxed">{item.desc}</p>
                   <div className={`flex items-center ${item.color} text-sm font-bold gap-2 group-hover:translate-x-2 transition-transform`}>
                      Launch <ArrowRight className="w-4 h-4" />
                   </div>
                </Link>
             ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y border-white/5 bg-slate-900/50">
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
               { val: "50k+", label: "Students" },
               { val: "1.2M", label: "Project Revenue" },
               { val: "500+", label: "Partners" },
               { val: "24/7", label: "AI Support" }
            ].map((stat, i) => (
               <div key={i}>
                  <div className="text-4xl md:text-5xl font-black text-white mb-2">{stat.val}</div>
                  <div className="text-gray-500 uppercase tracking-widest text-xs md:text-sm font-bold">{stat.label}</div>
               </div>
            ))}
         </div>
      </section>

      {/* AI & Automation Highlight */}
      <section className="py-24 relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-blue-900/20 pointer-events-none"></div>
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="bg-slate-900/80 backdrop-blur-md rounded-[3rem] p-8 md:p-16 border border-white/10 flex flex-col md:flex-row items-center gap-16 shadow-2xl">
               <div className="flex-1 text-center md:text-left rtl:md:text-right">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-wider mb-8 border border-purple-500/30">
                     <Brain className="w-4 h-4" /> {TRANSLATIONS.ai_automation_title[lang]}
                  </div>
                  <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-8 leading-tight">
                     Automate Your Success with <span className="text-purple-400">Intelligent AI</span>
                  </h2>
                  <p className="text-xl text-gray-300 mb-10 leading-relaxed">
                     Access our suite of AI tools to generate leads, write code, create content, and automate business workflows instantly.
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                     <Link to={`/${lang}/tools`} className="px-8 py-4 bg-purple-600 text-white rounded-xl font-bold text-lg hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/30">
                        Try AI Tools
                     </Link>
                     <Link to={`/${lang}/services`} className="px-8 py-4 border border-purple-500 text-purple-400 rounded-xl font-bold text-lg hover:bg-purple-500/10 transition-colors">
                        Business Automation
                     </Link>
                  </div>
               </div>
               <div className="flex-1 w-full max-w-lg">
                  <div className="relative aspect-square rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-slate-950 flex items-center justify-center group">
                     <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 animate-pulse-slow"></div>
                     <Brain className="w-48 h-48 text-white/10 group-hover:scale-110 transition-transform duration-700" />
                     <div className="absolute bottom-10 left-10 right-10 bg-slate-900/90 backdrop-blur border border-white/10 rounded-2xl p-6 shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <p className="text-sm text-gray-300 mb-2">AI Agent active...</p>
                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                           <div className="h-full bg-purple-500 w-2/3 animate-pulse"></div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* About Preview */}
      <section className="bg-slate-950 border-t border-white/10 py-20">
         <div className="max-w-5xl mx-auto px-4 text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden border-4 border-gold-500/30 shadow-2xl">
               <img src="https://picsum.photos/400/400?grayscale" alt="Sarkar Azeem CEO" className="w-full h-full object-cover" loading="lazy" decoding="async" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Sarkar Azeem</h2>
            <p className="text-gold-400 text-sm font-bold uppercase tracking-widest mb-6">CEO & Founder</p>
            <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
               "We are not just building a platform; we are building the future of digital work in Pakistan. Join us to learn, earn, and scale globally."
            </p>
         </div>
      </section>

    </div>
  );
};

export default Home;
