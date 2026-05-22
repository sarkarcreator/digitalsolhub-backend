
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Logo from '../components/Logo';
import SEO from '../components/SEO';
import SkillBadgeCard from '../components/SkillBadgeCard';
import { SkillBadge, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { getBadgeById } from '../utils/badgeManager';
import { CheckCircle, AlertCircle, ShieldCheck, Loader2, ArrowLeft, Calendar, User, BookOpen, Layers } from 'lucide-react';

const VerifyBadge: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [badge, setBadge] = useState<SkillBadge | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentLang, setCurrentLang] = useState<Language>(Language.ENGLISH);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
        if (id) {
            const found = getBadgeById(id);
            setBadge(found || null);
        }
        setLoading(false);
    }, 800);
  }, [id]);

  const t = TRANSLATIONS;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <SEO 
        title={badge ? `Verified Badge: ${badge.skillName}` : "Verify Badge"} 
        description="Verify digital skill micro-credentials." 
        lang={currentLang} 
      />

      <nav className="bg-white border-b border-slate-200 py-4 px-6 sticky top-0 z-50">
         <div className="max-w-4xl mx-auto flex justify-between items-center">
            <Link to={`/${currentLang}`} className="flex items-center gap-2">
               <Logo className="w-10 h-10" withText={true} />
            </Link>
            <div className="flex gap-2">
               {Object.values(Language).map(l => (
                  <button key={l} onClick={() => setCurrentLang(l)} className={`text-xs uppercase font-bold px-2 py-1 rounded ${currentLang === l ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>
                     {l}
                  </button>
               ))}
            </div>
         </div>
      </nav>

      <main className="flex-grow flex items-center justify-center p-6">
         {loading ? (
            <div className="text-center">
               <Loader2 className="w-10 h-10 animate-spin text-slate-400 mx-auto mb-4" />
               <p className="text-slate-500">Verifying Blockchain Record...</p>
            </div>
         ) : badge ? (
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-w-4xl w-full flex flex-col md:flex-row animate-in fade-in zoom-in duration-500">
               
               {/* Left: Badge Visual */}
               <div className="bg-slate-900 p-12 flex flex-col items-center justify-center text-center relative overflow-hidden md:w-1/3">
                  <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                  <SkillBadgeCard badge={badge} lang={currentLang} showActions={false} />
                  <div className="mt-8">
                     <p className="text-xs text-slate-500 font-mono uppercase tracking-widest mb-1">Badge ID</p>
                     <p className="text-white font-mono bg-white/10 px-3 py-1 rounded">{badge.id}</p>
                  </div>
               </div>

               {/* Right: Details */}
               <div className="p-8 md:p-12 flex-1 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-6">
                     <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" /> Verified Authentic
                     </div>
                     <span className="text-xs text-slate-400">Issued by DSH Academy</span>
                  </div>

                  <h1 className="text-3xl font-bold text-slate-900 mb-2">
                     {currentLang === Language.URDU && badge.skillNameUr ? badge.skillNameUr : badge.skillName}
                  </h1>
                  <p className="text-slate-500 mb-8">
                     This badge confirms the earner has demonstrated practical competency in this skill area.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg text-slate-500"><User className="w-5 h-5"/></div>
                        <div>
                           <p className="text-xs text-slate-500 uppercase font-bold">Earner</p>
                           <p className="font-bold text-slate-900">{badge.studentName}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg text-slate-500"><Layers className="w-5 h-5"/></div>
                        <div>
                           <p className="text-xs text-slate-500 uppercase font-bold">Level</p>
                           <p className="font-bold text-slate-900">{badge.level}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg text-slate-500"><Calendar className="w-5 h-5"/></div>
                        <div>
                           <p className="text-xs text-slate-500 uppercase font-bold">Issued On</p>
                           <p className="font-bold text-slate-900">{badge.issueDate}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg text-slate-500"><BookOpen className="w-5 h-5"/></div>
                        <div>
                           <p className="text-xs text-slate-500 uppercase font-bold">Module</p>
                           <p className="font-bold text-slate-900">{badge.courseId}</p>
                        </div>
                     </div>
                  </div>

                  <div className="pt-8 border-t border-slate-100">
                     <p className="text-xs text-slate-400 mb-4 flex items-center gap-1">
                        <ShieldCheck className="w-4 h-4 text-green-500" />
                        AI Verified Assessment & Practical Task Completion
                     </p>
                  </div>
               </div>

            </div>
         ) : (
            <div className="text-center">
               <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-10 h-10 text-red-500" />
               </div>
               <h2 className="text-2xl font-bold text-slate-900 mb-2">Badge Not Found</h2>
               <p className="text-slate-500 mb-6">The requested badge ID is invalid or has been revoked.</p>
               <Link to="/" className="text-blue-600 hover:underline font-bold">Return Home</Link>
            </div>
         )}
      </main>
    </div>
  );
};

export default VerifyBadge;
