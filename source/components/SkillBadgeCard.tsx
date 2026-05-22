
import React, { useRef } from 'react';
import { SkillBadge, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import Logo from './Logo';
import { CheckCircle, ShieldCheck, Download, Share2, Award, Zap, Code, Megaphone, Coins } from 'lucide-react';

interface SkillBadgeCardProps {
  badge: SkillBadge;
  lang: Language;
  showActions?: boolean;
}

const SkillBadgeCard: React.FC<SkillBadgeCardProps> = ({ badge, lang, showActions = true }) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Marketing': return 'from-blue-500 to-cyan-500 border-blue-400 text-blue-100';
      case 'Development': return 'from-green-500 to-emerald-600 border-green-400 text-green-100';
      case 'AI': return 'from-purple-500 to-violet-600 border-purple-400 text-purple-100';
      case 'Freelancing': return 'from-orange-500 to-amber-600 border-orange-400 text-orange-100';
      default: return 'from-slate-500 to-gray-600 border-gray-400';
    }
  };

  const getIcon = (cat: string) => {
    switch (cat) {
      case 'Marketing': return <Megaphone className="w-8 h-8" />;
      case 'Development': return <Code className="w-8 h-8" />;
      case 'AI': return <Zap className="w-8 h-8" />;
      case 'Freelancing': return <Coins className="w-8 h-8" />;
      default: return <Award className="w-8 h-8" />;
    }
  };

  const skillName = lang === Language.URDU && badge.skillNameUr ? badge.skillNameUr : badge.skillName;
  const t = TRANSLATIONS;

  const handleShare = () => {
    const text = `🥇 Earned a ${badge.skillName} Badge from Digital Solutions Hub.\n\nThis badge verifies my hands-on skills in ${badge.category}.\n\n✅ Verify here: https://digitalsolhub.com/verify/badge/${badge.id}\n\n#SkillBadge #MicroCredentials #DigitalSolutionsHub #AIReady`;
    const url = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="flex flex-col items-center gap-4 group">
      {/* Badge Visual */}
      <div 
        ref={canvasRef}
        className={`relative w-48 h-48 rounded-full flex flex-col items-center justify-center text-center p-4 bg-gradient-to-br ${getCategoryColor(badge.category)} border-4 shadow-xl transition-transform transform group-hover:scale-105`}
      >
        <div className="absolute inset-2 border border-white/30 rounded-full"></div>
        <div className="absolute top-4 opacity-80">
           <Logo className="w-6 h-6 text-white" withText={false} />
        </div>
        
        <div className="text-white mt-2 mb-1">
           {getIcon(badge.category)}
        </div>

        <h3 className="text-sm font-bold text-white uppercase leading-tight line-clamp-2 px-2 drop-shadow-md">
           {skillName}
        </h3>
        
        <div className="mt-2 flex flex-col items-center gap-1">
           <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full text-white font-semibold uppercase tracking-wider backdrop-blur-sm">
              {badge.level}
           </span>
           {badge.status === 'Verified' && (
              <div className="flex items-center gap-1 text-[10px] text-white font-bold">
                 <CheckCircle className="w-3 h-3" /> Verified
              </div>
           )}
        </div>
      </div>

      {/* Metadata & Actions */}
      {showActions && (
        <div className="text-center w-full">
           <p className="text-xs text-gray-400 mb-3 font-mono">{badge.id}</p>
           <div className="flex gap-2 justify-center">
              <button 
                onClick={handleShare}
                className="p-2 bg-[#0077b5] text-white rounded-lg hover:bg-[#006396] transition-colors shadow-lg"
                title={t.badge_share_linkedin[lang]}
              >
                 <Share2 className="w-4 h-4" />
              </button>
              <a 
                href={`/#/verify/badge/${badge.id}`}
                target="_blank"
                className="p-2 bg-slate-800 text-green-400 rounded-lg hover:bg-slate-700 transition-colors border border-white/10"
                title={t.badge_verify_link[lang]}
              >
                 <ShieldCheck className="w-4 h-4" />
              </a>
           </div>
        </div>
      )}
    </div>
  );
};

export default SkillBadgeCard;
