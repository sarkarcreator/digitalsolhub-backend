
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { COURSES } from '../constants';
import { Language } from '../types';
import SEO from '../components/SEO';
import { Clock, Users, Star, BookOpen, Check, PlayCircle, ShieldCheck, Smartphone, Award, Linkedin, Twitter, Globe, Quote, Download, User, Facebook, Copy, Sparkles, Monitor } from 'lucide-react';
import { jsPDF } from "jspdf";

const CourseDetail: React.FC = () => {
  const { lang: paramLang, id } = useParams<{ lang: string; id: string }>();
  const lang = (Object.values(Language).includes(paramLang as Language)) ? (paramLang as Language) : Language.ENGLISH;
  const [copied, setCopied] = useState(false);
  
  const course = COURSES.find(c => c.id === id);

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white">
        <h2 className="text-3xl font-bold mb-4">{lang === Language.ENGLISH ? 'Course Not Found' : 'کورس نہیں ملا'}</h2>
        <Link to={`/${lang}/academy`} className="px-6 py-2 bg-gold-500 text-black rounded font-bold hover:bg-gold-400">
          {lang === Language.ENGLISH ? 'Back to Academy' : 'واپس اکیڈمی پر'}
        </Link>
      </div>
    );
  }

  // Theme Logic
  const isSoftSkill = course.category === 'Soft Skills';

  const theme = {
    pageBg: isSoftSkill ? 'bg-slate-50' : 'bg-slate-950',
    textMain: isSoftSkill ? 'text-slate-900' : 'text-white',
    textMuted: isSoftSkill ? 'text-slate-600' : 'text-gray-300',
    textDim: isSoftSkill ? 'text-slate-500' : 'text-gray-400',
    heroBg: isSoftSkill ? 'bg-white' : 'bg-slate-900',
    heroOverlay: isSoftSkill ? 'bg-gradient-to-r from-slate-50 via-slate-50/95 to-transparent' : 'bg-gradient-to-r from-slate-950 via-slate-900 to-transparent',
    border: isSoftSkill ? 'border-blue-100' : 'border-white/10',
    accent: isSoftSkill ? 'text-blue-600' : 'text-gold-500',
    accentBg: isSoftSkill ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-gold-500/20 text-gold-400 border-gold-500/30',
    cardBg: isSoftSkill ? 'bg-white border-blue-100 shadow-sm' : 'bg-slate-900 border-slate-700 shadow-2xl',
    cardHover: isSoftSkill ? 'hover:border-blue-300' : 'hover:border-gold-500/30',
    buttonPrimary: isSoftSkill ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200' : 'bg-gradient-to-r from-gold-500 to-gold-600 text-black shadow-gold-500/40',
    buttonSecondary: isSoftSkill ? 'bg-white border-blue-200 text-slate-600 hover:text-blue-600 hover:border-blue-500' : 'bg-slate-800/80 border-slate-600 text-gray-300 hover:text-white hover:border-gold-500',
    iconBg: isSoftSkill ? 'bg-blue-100' : 'bg-slate-800',
    iconColor: isSoftSkill ? 'text-blue-600' : 'text-gold-500',
    instructorBg: isSoftSkill ? 'bg-slate-100/50' : 'bg-slate-900/80',
    sectionTitle: isSoftSkill ? 'text-slate-900' : 'text-white',
  };

  // Language specific data
  const title = lang === Language.URDU && course.titleUr ? course.titleUr : course.title;
  const description = lang === Language.URDU && course.descriptionUr ? course.descriptionUr : course.description;
  const fullDescription = lang === Language.URDU && course.fullDescriptionUr ? course.fullDescriptionUr : (course.fullDescription || course.description);
  const duration = lang === Language.URDU && course.durationUr ? course.durationUr : course.duration;
  const category = lang === Language.URDU && course.categoryUr ? course.categoryUr : course.category;
  const outcomes = lang === Language.URDU && course.learningOutcomesUr ? course.learningOutcomesUr : course.learningOutcomes;
  
  const instructorName = course.instructor?.name;
  const instructorRole = lang === Language.URDU && course.instructor?.roleUr ? course.instructor.roleUr : course.instructor?.role;
  const instructorBio = lang === Language.URDU && course.instructor?.bioUr ? course.instructor.bioUr : course.instructor?.bio;
  const instructorQuote = lang === Language.URDU && course.instructor?.quoteUr ? course.instructor.quoteUr : course.instructor?.quote;

  const shareUrl = window.location.href;

  // Schema.org Structured Data
  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": title,
    "description": description,
    "provider": {
      "@type": "Organization",
      "name": "Digital Solutions Hub Academy",
      "sameAs": "https://digitalsolhub.com"
    },
    "instructor": {
      "@type": "Person",
      "name": instructorName,
      "description": instructorRole
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": course.rating || 4.8,
      "reviewCount": course.students || 500
    },
    "offers": {
      "@type": "Offer",
      "category": category,
      "priceCurrency": "USD",
      "price": course.price?.replace('$', '') || "199"
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSyllabus = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    
    // Theme Colors for PDF
    const primaryColor = isSoftSkill ? [37, 99, 235] : [234, 179, 8]; // Blue vs Gold
    const headerBg = isSoftSkill ? [255, 255, 255] : [15, 23, 42]; // White vs Slate-950
    const textColor = isSoftSkill ? [15, 23, 42] : [234, 179, 8]; // Slate vs Gold (for brand text)
    
    // Decorative Border
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(1);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

    // Header Background
    doc.setFillColor(headerBg[0], headerBg[1], headerBg[2]);
    doc.rect(11, 11, pageWidth - 22, 40, 'F');
    
    // Brand Name
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Digital Solutions Hub", pageWidth / 2, 28, { align: "center" });
    
    // Tagline
    doc.setFontSize(10);
    doc.setTextColor(isSoftSkill ? 100 : 255, isSoftSkill ? 116 : 255, isSoftSkill ? 139 : 255); // Slate-500 vs White
    doc.setFont("helvetica", "normal");
    doc.text("Empowering Your Future", pageWidth / 2, 38, { align: "center" });

    // Course Title
    doc.setTextColor(15, 23, 42); // Always dark for body text readability on white PDF
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text(course.title, 20, 75); 
    
    // Category
    doc.setFontSize(12);
    doc.setTextColor(100, 116, 139);
    doc.text(`Category: ${course.category}`, 20, 85);

    doc.save(`${course.title.replace(/\s+/g, '_')}_Syllabus.pdf`);
  };

  return (
    <div className={`min-h-screen ${theme.pageBg} ${theme.textMain} pt-20 transition-colors duration-300`}>
      <SEO 
        title={title} 
        description={description} 
        lang={lang} 
        image={course.image}
        schema={courseSchema}
      />

      {/* Hero Section */}
      <div className={`relative ${theme.heroBg} border-b ${theme.border}`}>
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute inset-0 ${theme.heroOverlay} z-10`}></div>
          <img src={course.image} alt={title} loading="eager" fetchPriority="high" className="w-full h-full object-cover opacity-30 blur-sm" />
        </div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-3xl">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold mb-6 border ${theme.accentBg}`}>
              <span className={`w-2 h-2 rounded-full ${isSoftSkill ? 'bg-blue-500' : 'bg-gold-500'} animate-pulse`}></span>
              {category}
            </div>
            <h1 className={`text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight ${theme.sectionTitle}`}>
              {title}
            </h1>
            <p className={`text-xl ${theme.textMuted} mb-8 leading-relaxed`}>
              {description}
            </p>
            
            <div className={`flex flex-wrap items-center gap-6 text-sm md:text-base ${theme.textDim} mb-8`}>
              <div className="flex items-center gap-2">
                <Star className={`w-5 h-5 fill-current ${isSoftSkill ? 'text-yellow-400' : 'text-gold-500'}`} />
                <span className={theme.textMain}>{course.rating || '4.8'}</span>
                <span>({course.students || '500+'} {lang === Language.ENGLISH ? 'Reviews' : 'Ø¬Ø§Ø¦Ø²Û’'})</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className={`w-5 h-5 ${isSoftSkill ? 'text-blue-500' : 'text-blue-400'}`} />
                <span>{course.students || '1,200'}+ {lang === Language.ENGLISH ? 'Students' : 'Ø·Ù„Ø¨Ø§Ø¡'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className={`w-5 h-5 ${isSoftSkill ? 'text-purple-500' : 'text-purple-400'}`} />
                <span>{duration}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                 <img src={course.instructor?.image} alt={instructorName} className={`w-12 h-12 rounded-full border-2 ${isSoftSkill ? 'border-blue-500' : 'border-gold-500'}`} />
                 <div>
                   <p className={`text-sm ${theme.textDim}`}>{lang === Language.ENGLISH ? 'Created by' : 'ØªØ®Ù„ÛŒÙ‚ Ú©Ø§Ø±'}</p>
                   <p className={`font-bold ${theme.textMain}`}>{instructorName}</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Overview */}
            <section>
              <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${theme.sectionTitle}`}>
                <BookOpen className={`w-6 h-6 ${theme.accent}`} />
                {lang === Language.ENGLISH ? 'Course Overview' : 'کورس کا جائزہ'}
              </h2>
              <div className={`prose prose-lg ${isSoftSkill ? 'prose-slate' : 'prose-invert'} ${theme.textMuted}`}>
                <p>{fullDescription}</p>
              </div>
            </section>

            {/* Learning Outcomes */}
            <section className={`${theme.cardBg} rounded-2xl p-8 border ${theme.border} ${theme.cardHover} transition-colors`}>
              <h2 className={`text-2xl font-bold mb-6 ${theme.sectionTitle}`}>{lang === Language.ENGLISH ? 'What you\'ll learn' : 'آپ کیا سیکھیں گے'}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {outcomes?.map((outcome, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className={`mt-1 rounded-full p-1 ${isSoftSkill ? 'bg-blue-100' : 'bg-green-500/10'}`}>
                      <Check className={`w-4 h-4 shrink-0 ${isSoftSkill ? 'text-blue-600' : 'text-green-500'}`} />
                    </div>
                    <span className={`text-sm leading-relaxed ${theme.textMuted}`}>{outcome}</span>
                  </div>
                )) || <p className={theme.textDim}>Loading...</p>}
              </div>
            </section>

            {/* Instructor */}
            <section>
              <h2 className={`text-2xl font-bold mb-6 ${theme.sectionTitle}`}>{lang === Language.ENGLISH ? 'Your Instructor' : 'آپ کا انسٹرکٹر'}</h2>
              <div className={`group ${theme.instructorBg} backdrop-blur-sm rounded-2xl p-8 border ${theme.border} ${theme.cardHover} transition-all`}>
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="relative shrink-0">
                    <div className={`absolute -inset-1 bg-gradient-to-br ${isSoftSkill ? 'from-blue-400 to-purple-400' : 'from-gold-500 to-purple-600'} rounded-full blur opacity-30 group-hover:opacity-60 transition-opacity`}></div>
                    <img src={course.instructor?.image} alt={instructorName} loading="lazy" className={`relative w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-2 ${isSoftSkill ? 'border-white' : 'border-slate-800'}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <h3 className={`text-2xl font-bold ${theme.sectionTitle}`}>{instructorName}</h3>
                        <div className="flex gap-3">
                            {course.instructor?.socials?.linkedin && (
                                <a href={course.instructor.socials.linkedin} target="_blank" rel="noopener noreferrer" className={`${theme.textDim} hover:${theme.accent} transition-colors`}>
                                    <Linkedin className="w-5 h-5" />
                                </a>
                            )}
                        </div>
                    </div>
                    <p className={`${theme.accent} font-medium text-sm mb-6 uppercase tracking-wider`}>{instructorRole}</p>
                    
                    {instructorBio && (
                      <div className={`mb-6 rounded-lg p-5 border ${theme.border} relative overflow-hidden ${isSoftSkill ? 'bg-white' : 'bg-slate-800/30'}`}>
                        <div className={`absolute top-0 right-0 rtl:left-0 rtl:right-auto w-16 h-16 bg-gradient-to-br ${isSoftSkill ? 'from-blue-500/5' : 'from-gold-500/10'} to-transparent rounded-bl-full rtl:rounded-br-full rtl:rounded-bl-none`}></div>
                        <h4 className={`font-semibold mb-3 text-sm flex items-center gap-2 relative z-10 ${theme.sectionTitle}`}>
                          <User className={`w-4 h-4 ${theme.accent}`} />
                          {lang === Language.ENGLISH ? 'Biography' : 'Ø³ÙˆØ§Ù†Ø­ Ø¹Ù…Ø±ÛŒ'}
                        </h4>
                        <p className={`text-sm leading-relaxed relative z-10 ${theme.textMuted}`}>
                          {instructorBio}
                        </p>
                      </div>
                    )}

                    <div className={`relative p-6 rounded-xl border ${theme.border} ${isSoftSkill ? 'bg-white' : 'bg-slate-800/30'}`}>
                       <Quote className={`absolute top-4 left-4 rtl:right-4 rtl:left-auto w-6 h-6 ${isSoftSkill ? 'text-blue-200' : 'text-gold-500/20'}`} />
                       <div className={`relative z-10 prose prose-sm leading-relaxed italic pl-6 rtl:pr-6 rtl:pl-0 ${isSoftSkill ? 'prose-slate text-slate-600' : 'prose-invert text-gray-300'}`}>
                           "{instructorQuote}"
                       </div>
                    </div>

                  </div>
                </div>
              </div>
            </section>

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
             <div className="sticky top-24 space-y-6">
                
                {/* Enroll Card */}
                <div className={`${theme.cardBg} rounded-2xl overflow-hidden border ${theme.border} shadow-2xl`}>
                   <div className="p-6">
                      <div className={`text-3xl font-bold mb-2 ${theme.sectionTitle}`}>{course.price || "$199"}</div>
                      
                      {/* Enhanced Enroll Button */}
                      <Link to={`/${lang}/apply`} className={`relative block w-full py-4 ${theme.buttonPrimary} font-bold text-center text-lg rounded-lg shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] mb-4 overflow-hidden group`}>
                        <span className="relative z-10">{lang === Language.ENGLISH ? 'Enroll Now' : 'Ø§Ø¨Ú¾ÛŒ Ø¯Ø§Ø®Ù„Û Ù„ÛŒÚº'}</span>
                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-in-out z-0"></div>
                      </Link>

                      {/* Enhanced Download Button */}
                      <button 
                        onClick={handleDownloadSyllabus}
                        className={`relative block w-full py-3 ${theme.buttonSecondary} font-medium text-center rounded-lg transition-all duration-300 mb-6 flex items-center justify-center gap-2 group active:scale-[0.98] hover:scale-[1.02] hover:-translate-y-1 overflow-hidden`}
                      >
                        <Download className={`w-4 h-4 group-hover:scale-110 transition-transform duration-300 relative z-10 ${isSoftSkill ? 'text-blue-500' : 'text-gold-500'}`} />
                        <span className="transition-colors duration-300 relative z-10">{lang === Language.ENGLISH ? 'Download Syllabus' : 'Ù†ØµØ§Ø¨ ÚˆØ§Ø¤Ù† Ù„ÙˆÚˆ Ú©Ø±ÛŒÚº'}</span>
                        <div className={`absolute inset-0 ${isSoftSkill ? 'bg-blue-50' : 'bg-gold-500/5'} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                      </button>

                      {/* Share Section */}
                      <div className={`flex items-center justify-between py-4 border-t ${isSoftSkill ? 'border-gray-100' : 'border-slate-700/50'} mb-4`}>
                        <span className={`text-sm font-medium ${theme.textDim}`}>
                          {lang === Language.ENGLISH ? 'Share this course:' : 'Ø§Ø³ Ú©ÙˆØ±Ø³ Ú©Ùˆ Ø´ÛŒØ¦Ø± Ú©Ø±ÛŒÚº:'}
                        </span>
                        <div className="flex gap-2">
                           <a 
                             href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className={`w-8 h-8 rounded-full ${theme.iconBg} flex items-center justify-center text-blue-500 hover:bg-blue-500 hover:text-white transition-all hover:scale-110`}
                             aria-label="Share on Facebook"
                           >
                             <Facebook className="w-4 h-4" />
                           </a>
                           <a 
                             href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className={`w-8 h-8 rounded-full ${theme.iconBg} flex items-center justify-center text-sky-400 hover:bg-sky-400 hover:text-white transition-all hover:scale-110`}
                             aria-label="Share on Twitter"
                           >
                             <Twitter className="w-4 h-4" />
                           </a>
                           <a 
                             href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className={`w-8 h-8 rounded-full ${theme.iconBg} flex items-center justify-center text-blue-700 hover:bg-blue-700 hover:text-white transition-all hover:scale-110`}
                             aria-label="Share on LinkedIn"
                           >
                             <Linkedin className="w-4 h-4" />
                           </a>
                           <button 
                             onClick={handleCopyLink}
                             className={`w-8 h-8 rounded-full ${theme.iconBg} flex items-center justify-center ${theme.textDim} hover:${theme.accent} hover:text-black transition-all hover:scale-110`}
                             aria-label="Copy Link"
                           >
                             {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                           </button>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className={`flex items-center gap-3 text-sm ${theme.textMuted}`}>
                           <ShieldCheck className="w-5 h-5 text-green-500" />
                           <span>{lang === Language.ENGLISH ? 'Full Lifetime Access' : 'Ù…Ú©Ù…Ù„ Ù„Ø§Ø¦Ù Ù¹Ø§Ø¦Ù… Ø±Ø³Ø§Ø¦ÛŒ'}</span>
                        </div>
                        <div className={`flex items-center gap-3 text-sm ${theme.textMuted}`}>
                           <Award className="w-5 h-5 text-purple-500" />
                           <span>{lang === Language.ENGLISH ? 'Certificate of Completion' : 'ØªÚ©Ù…ÛŒÙ„ Ù¾Ø± Ø³Ø±Ù¹ÛŒÙÚ©ÛŒÙ¹'}</span>
                        </div>
                        {isSoftSkill && (
                           <div className={`flex items-center gap-3 text-sm ${theme.textMuted}`}>
                              <Monitor className="w-5 h-5 text-blue-500" />
                              <span>{lang === Language.ENGLISH ? 'Interactive Exercises' : 'Ø§Ù†Ù¹Ø±Ø§ÛŒÚ©Ù¹Ùˆ Ù…Ø´Ù‚ÛŒÚº'}</span>
                           </div>
                        )}
                      </div>
                   </div>
                </div>

             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
