
import React, { useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { COURSES, TRANSLATIONS, STUDENT_PLANS, SYLLABUS_CURRICULUM, SOFT_SKILLS_MODULE } from '../constants';
import { Language } from '../types';
import SEO from '../components/SEO';
import { Play, Clock, CheckCircle, Star, Sparkles, BookOpen, Brain, Rocket, ChevronDown, ChevronUp } from 'lucide-react';

const Academy: React.FC = () => {
  const { lang: paramLang } = useParams<{ lang: string }>();
  const lang = paramLang === Language.URDU ? Language.URDU : Language.ENGLISH;
  const location = useLocation();
  
  const [filter, setFilter] = useState((location.state as any)?.category || 'All');
  const [currency, setCurrency] = useState<'PKR' | 'USD'>('PKR');
  const [openLevel, setOpenLevel] = useState<string | null>('foundation');
  
  // Helper to get translated category
  const getCategory = (c: any) => lang === Language.URDU && c.categoryUr ? c.categoryUr : c.category;

  const filterOptions = [
    { label: lang === Language.ENGLISH ? 'All Courses' : 'تمام کورسز', value: 'All' },
    { label: lang === Language.ENGLISH ? 'Technical Skills' : 'ٹیکنیکل اسکلز', value: 'Technical Skills' },
    { label: lang === Language.ENGLISH ? 'Digital Marketing' : 'ڈیجیٹل مارکیٹنگ', value: 'Digital Marketing' },
    { label: lang === Language.ENGLISH ? 'Freelancing' : 'فری لانسنگ', value: 'Freelancing' },
    { label: lang === Language.ENGLISH ? 'E-Commerce' : 'ای کامرس', value: 'E-Commerce' },
    { label: lang === Language.ENGLISH ? 'Soft Skills' : 'سافٹ اسکلز', value: 'Soft Skills' }
  ];

  const filteredCourses = filter === 'All' 
    ? COURSES 
    : COURSES.filter(c => (c.category === filter || c.categoryUr === filter));

  return (
    <div className="pt-24 pb-20 min-h-screen bg-slate-950">
      <SEO 
        title={TRANSLATIONS.metaTitleAcademy[lang]} 
        description={TRANSLATIONS.metaDescAcademy[lang]} 
        lang={lang} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{TRANSLATIONS.academy[lang]}</h1>
          <p className="text-gray-400">{TRANSLATIONS.metaDescAcademy[lang]}</p>
        </div>

        {/* What You Will Learn (Summary) */}
        <section className="mb-20">
           <h2 className="text-2xl font-bold text-white mb-8 text-center">{TRANSLATIONS.what_learn[lang]}</h2>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                 "Shopify, eBay, Dropshipping", "Affiliate Marketing", "SEO & Website Traffic",
                 "Digital Marketing (Ads)", "Web Design & WordPress", "Graphic Design",
                 "AI Tools & Automation", "Freelancing & Online Earning"
              ].map((topic, i) => (
                 <div key={i} className="bg-slate-900 border border-white/5 p-4 rounded-xl text-center hover:border-brand-neon/30 transition-colors">
                    <p className="text-sm text-gray-300 font-medium">{topic}</p>
                 </div>
              ))}
           </div>
        </section>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {filterOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg ${
                filter === opt.value 
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-cyan-500/30' 
                  : 'bg-slate-900 text-gray-400 border border-slate-800 hover:border-blue-500/50 hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-24">
          {filteredCourses.map((course) => {
            const title = lang === Language.URDU && course.titleUr ? course.titleUr : course.title;
            const description = lang === Language.URDU && course.descriptionUr ? course.descriptionUr : course.description;
            const category = getCategory(course);
            const duration = lang === Language.URDU && course.durationUr ? course.durationUr : course.duration;
            const isSoftSkill = course.category === 'Soft Skills';

            return (
              <div 
                key={course.id} 
                className={`group rounded-xl overflow-hidden transition-all flex flex-col relative ${
                  isSoftSkill 
                    ? 'bg-white border-2 border-blue-50 hover:border-blue-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]' 
                    : 'bg-slate-900 border border-slate-800 hover:border-gold-500/50 hover:shadow-2xl hover:shadow-purple-900/20'
                }`}
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={course.image} alt={title} loading="lazy" decoding="async" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center ${isSoftSkill ? 'bg-blue-600/80 backdrop-blur-[2px]' : 'bg-black/60 backdrop-blur-[2px]'}`}>
                     <Link to={`/${lang}/course/${course.id}`} className={`w-14 h-14 rounded-full flex items-center justify-center transition-all transform hover:scale-110 shadow-xl ${isSoftSkill ? 'bg-white text-blue-600' : 'bg-white/20 text-white backdrop-blur-md hover:bg-gold-500 hover:text-black'}`}>
                       {isSoftSkill ? <Sparkles className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
                     </Link>
                  </div>
                  <div className={`absolute top-2 right-2 rtl:right-auto rtl:left-2 px-3 py-1 backdrop-blur-sm rounded-full text-xs font-bold ${
                      isSoftSkill 
                        ? 'bg-blue-600/90 text-white shadow-lg shadow-blue-500/30' 
                        : 'bg-black/60 text-white border border-white/10'
                    }`}>
                    {category}
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-3">
                      <div className={`flex items-center gap-2 text-xs ${isSoftSkill ? 'text-blue-500 font-medium' : 'text-gray-500'}`}>
                         <Clock className="w-3 h-3" />
                         <span>{duration}</span>
                      </div>
                      <div className={`flex items-center gap-1 text-xs font-bold ${isSoftSkill ? 'text-slate-700' : 'text-gold-500'}`}>
                         <Star className={`w-3 h-3 fill-current ${isSoftSkill ? 'text-yellow-400' : ''}`} />
                         <span>{course.rating || '4.8'}</span>
                         <span className={isSoftSkill ? 'text-slate-400 font-normal' : 'text-gray-600 font-normal'}>({course.students})</span>
                      </div>
                  </div>

                  <h3 className={`text-lg font-bold mb-2 transition-colors line-clamp-1 ${isSoftSkill ? 'text-slate-900 group-hover:text-blue-600' : 'text-white group-hover:text-gold-400'}`}>{title}</h3>
                  <p className={`text-sm mb-4 line-clamp-2 ${isSoftSkill ? 'text-slate-500' : 'text-gray-400'}`}>{description}</p>
                  
                  <div className="space-y-2 mb-6 flex-grow">
                    <div className={`flex items-center gap-2 text-xs ${isSoftSkill ? 'text-slate-600' : 'text-gray-400'}`}>
                      <CheckCircle className={`w-3 h-3 ${isSoftSkill ? 'text-blue-500' : 'text-green-500'}`} />
                      <span>{lang === Language.ENGLISH ? 'Certificate on Completion' : 'تکمیل پر سرٹیفکیٹ'}</span>
                    </div>
                  </div>

                  <Link to={`/${lang}/course/${course.id}`} className={`block w-full text-center py-3 rounded-lg text-sm font-bold transition-all ${
                     isSoftSkill 
                       ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/20' 
                       : 'border border-purple-500/30 text-purple-400 hover:bg-purple-600 hover:text-white'
                  }`}>
                    {lang === Language.ENGLISH ? 'Enroll Now' : 'ابھی داخلہ لیں'}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Curriculum Section */}
        <section className="mb-24 scroll-mt-24" id="curriculum">
           <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-2">{lang === Language.ENGLISH ? 'Complete Curriculum Roadmap' : 'مکمل نصاب کا روڈ میپ'}</h2>
              <p className="text-gray-400">{lang === Language.ENGLISH ? 'A structured path from beginner to expert.' : 'ابتدائی سے ماہر تک کا ایک منظم راستہ۔'}</p>
           </div>

           <div className="space-y-6 max-w-4xl mx-auto">
              {SYLLABUS_CURRICULUM.map((level) => (
                 <div key={level.id} className={`rounded-2xl border transition-all duration-300 overflow-hidden ${level.bg} ${level.border} ${openLevel === level.id ? 'ring-1 ring-white/20' : ''}`}>
                    <button 
                       onClick={() => setOpenLevel(openLevel === level.id ? null : level.id)}
                       className="w-full flex items-center justify-between p-6 text-left"
                    >
                       <span className={`text-xl font-bold ${level.color}`}>{level.level}</span>
                       {openLevel === level.id ? <ChevronUp className="w-6 h-6 text-gray-400" /> : <ChevronDown className="w-6 h-6 text-gray-400" />}
                    </button>
                    
                    {openLevel === level.id && (
                       <div className="px-6 pb-6 animate-in slide-in-from-top-2">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             {level.modules.map((mod) => (
                                <div key={mod.id} className="bg-slate-950/50 p-4 rounded-xl border border-white/5">
                                   <h4 className="text-white font-bold mb-2 text-sm">{mod.title}</h4>
                                   <ul className="space-y-1">
                                      {mod.topics.map((topic, i) => (
                                         <li key={i} className="flex items-center gap-2 text-xs text-gray-400">
                                            <div className="w-1 h-1 bg-white/30 rounded-full"></div>
                                            {topic}
                                         </li>
                                      ))}
                                   </ul>
                                </div>
                             ))}
                          </div>
                       </div>
                    )}
                 </div>
              ))}
           </div>
        </section>

        {/* Soft Skills & Outcomes */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-24">
           {/* Soft Skills */}
           <div className="bg-gradient-to-br from-blue-900/20 to-slate-900 rounded-3xl p-8 border border-blue-500/20 h-full">
              <div className="flex items-center gap-3 mb-6">
                 <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
                    <Brain className="w-6 h-6" />
                 </div>
                 <h3 className="text-xl font-bold text-white">{SOFT_SKILLS_MODULE.title}</h3>
              </div>
              <div className="flex flex-wrap gap-2.5">
                 {SOFT_SKILLS_MODULE.skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-300 text-sm border border-blue-500/20 hover:bg-blue-500/20 transition-colors cursor-default">
                       {skill}
                    </span>
                 ))}
              </div>
           </div>

           {/* Outcomes */}
           <div className="bg-gradient-to-br from-green-900/20 to-slate-900 rounded-3xl p-8 border border-green-500/20 h-full">
              <div className="flex items-center gap-3 mb-6">
                 <div className="p-3 bg-green-500/20 rounded-xl text-green-400">
                    <Rocket className="w-6 h-6" />
                 </div>
                 <h3 className="text-xl font-bold text-white">{TRANSLATIONS.student_benefits[lang]}</h3>
              </div>
              <ul className="grid grid-cols-2 gap-4">
                 {[
                    TRANSLATIONS.sb_daily[lang], TRANSLATIONS.sb_dash[lang], 
                    TRANSLATIONS.sb_live[lang], TRANSLATIONS.sb_cert[lang], 
                    TRANSLATIONS.sb_career[lang], "Freelancing Ready"
                 ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-300 text-sm">
                       <CheckCircle className="w-4 h-4 text-green-500" /> {item}
                    </li>
                 ))}
              </ul>
           </div>
        </section>

        {/* Student Pricing Plans Section */}
        <section id="student-pricing" className="mb-24">
           <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                 {lang === Language.ENGLISH ? 'Student Membership Plans' : 'طلباء کی رکنیت کے منصوبے'}
              </h2>
              <div className="flex justify-center gap-4 mb-8">
                 <button onClick={() => setCurrency('PKR')} className={`px-4 py-1.5 rounded-lg border text-sm font-bold transition-all ${currency === 'PKR' ? 'bg-brand-neon text-black border-brand-neon' : 'border-white/20 text-gray-400'}`}>PKR</button>
                 <button onClick={() => setCurrency('USD')} className={`px-4 py-1.5 rounded-lg border text-sm font-bold transition-all ${currency === 'USD' ? 'bg-brand-neon text-black border-brand-neon' : 'border-white/20 text-gray-400'}`}>USD</button>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {STUDENT_PLANS.map((plan, i) => (
                 <div key={plan.id} className={`relative p-8 rounded-3xl border flex flex-col ${
                    plan.popular 
                    ? 'bg-gradient-to-b from-slate-900 to-black border-brand-neon shadow-[0_0_30px_rgba(0,243,255,0.15)] scale-105 z-10' 
                    : 'bg-slate-900/50 border-white/10 hover:border-white/20'
                 }`}>
                    {plan.popular && (
                       <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-neon text-black text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                          Most Popular
                       </div>
                    )}
                    
                    <div className="mb-6">
                       <h3 className={`text-xl font-bold mb-1 ${plan.id === 'starter' ? 'text-green-400' : plan.id === 'professional' ? 'text-blue-400' : 'text-purple-400'}`}>
                          {plan.name}
                       </h3>
                       <p className="text-sm text-gray-400">{plan.level}</p>
                    </div>

                    <div className="mb-6">
                       <span className="text-3xl font-bold text-white">
                          {currency === 'PKR' ? `Rs ${plan.price.PKR}` : `$${plan.price.USD}`}
                       </span>
                       <span className="text-sm text-gray-500 block mt-1">{plan.duration} Access</span>
                    </div>

                    <div className="space-y-4 mb-8 flex-1">
                       {plan.features.map((feat, idx) => (
                          <div key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                             <CheckCircle className={`w-4 h-4 mt-0.5 shrink-0 ${plan.popular ? 'text-brand-neon' : 'text-gray-500'}`} />
                             <span>{feat}</span>
                          </div>
                       ))}
                    </div>

                    <Link 
                       to={`/${lang}/apply`}
                       className={`w-full py-3 rounded-xl font-bold text-center transition-all ${
                          plan.popular 
                          ? 'bg-brand-neon text-black hover:bg-cyan-400 shadow-lg shadow-cyan-500/20' 
                          : 'bg-slate-800 text-white hover:bg-white hover:text-black'
                       }`}
                    >
                       {TRANSLATIONS.enroll_now[lang].split('|')[0]}
                    </Link>
                    
                    <p className="text-xs text-center text-gray-500 mt-4 italic">{plan.bestFor}</p>
                 </div>
              ))}
           </div>
        </section>

      </div>
    </div>
  );
};

export default Academy;
