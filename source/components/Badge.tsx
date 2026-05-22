
import React from 'react';
import { ShieldCheck, Star } from 'lucide-react';
import { BadgeLevel } from '../types';

interface BadgeProps {
  level: BadgeLevel;
  className?: string;
  lightMode?: boolean;
}

const Badge: React.FC<BadgeProps> = ({ level, className = "w-32 h-32", lightMode = false }) => {
  if (level === 'None' || !level) return null;

  const styles = {
    Gold: {
      gradient: "from-yellow-300 via-yellow-500 to-yellow-600",
      border: "border-yellow-200",
      text: "text-yellow-900",
      bgText: "GOLD",
      iconColor: "text-yellow-100",
      shadow: "shadow-yellow-500/30"
    },
    Silver: {
      gradient: "from-gray-300 via-gray-400 to-gray-500",
      border: "border-gray-200",
      text: "text-gray-900",
      bgText: "SILVER",
      iconColor: "text-gray-100",
      shadow: "shadow-gray-500/30"
    },
    Platinum: {
      gradient: "from-cyan-300 via-cyan-500 to-blue-600",
      border: "border-cyan-200",
      text: "text-blue-900",
      bgText: "PLATINUM",
      iconColor: "text-cyan-100",
      shadow: "shadow-cyan-500/30"
    }
  };

  const style = styles[level] || styles.Silver;

  return (
    <div className={`relative flex flex-col items-center justify-center rounded-full bg-gradient-to-br ${style.gradient} p-[3px] shadow-xl ${style.shadow} ${className}`}>
      {/* Outer Ring Detail */}
      <div className="absolute inset-0 rounded-full border-2 border-white/20"></div>
      
      {/* Inner Circle */}
      <div className={`w-full h-full rounded-full flex flex-col items-center justify-center relative overflow-hidden border-2 ${lightMode ? 'bg-gradient-to-br from-yellow-50 to-white border-yellow-500/30' : 'bg-slate-900 border-white/10'}`}>
        
        {/* Shine Effect */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-white/20 rounded-t-full pointer-events-none"></div>
        
        {/* Background Text */}
        <span className={`absolute text-[6px] font-black tracking-widest opacity-10 top-3 ${lightMode ? 'text-slate-900' : `${style.gradient} bg-clip-text text-transparent`}`}>
           DSH ACCREDITED
        </span>

        {/* Icon */}
        <div className={`mb-0.5 ${lightMode ? 'text-yellow-600' : `${style.gradient} bg-clip-text text-transparent`}`}>
           <ShieldCheck className="w-1/3 h-1/3 min-w-[24px] min-h-[24px] mx-auto drop-shadow-sm" strokeWidth={1.5} />
        </div>

        {/* Level Name */}
        <h3 className={`text-[10px] md:text-sm font-black uppercase tracking-wider ${lightMode ? 'text-slate-800' : `bg-gradient-to-r ${style.gradient} bg-clip-text text-transparent`}`}>
          {level}
        </h3>
        
        {/* Subtext */}
        <p className={`text-[5px] md:text-[7px] uppercase tracking-widest mt-0.5 font-bold ${lightMode ? 'text-slate-500' : 'text-gray-400'}`}>
          Training Partner
        </p>

        {/* Stars */}
        <div className="flex gap-0.5 mt-1">
           {[1,2,3,4,5].map(i => (
              <Star key={i} className={`w-1.5 h-1.5 md:w-2 md:h-2 fill-current ${i <= (level === 'Platinum' ? 5 : level === 'Gold' ? 4 : 3) ? (lightMode ? 'text-yellow-500' : 'text-white') : (lightMode ? 'text-gray-300' : 'text-gray-700')}`} />
           ))}
        </div>
      </div>
      
      {/* Ribbon */}
      <div className={`absolute -bottom-3 px-3 py-0.5 rounded-sm shadow-md ${lightMode ? 'bg-blue-900 text-white' : 'bg-slate-950 border border-white/20 text-white'}`}>
         <span className="text-[6px] md:text-[8px] font-bold uppercase tracking-wider block leading-tight">Verified</span>
         {/* Ribbon Tail Effect */}
         <div className={`absolute top-0 -left-1 w-2 h-full ${lightMode ? 'bg-blue-800' : 'bg-slate-900'} skew-x-[20deg] -z-10 rounded-l-sm`}></div>
         <div className={`absolute top-0 -right-1 w-2 h-full ${lightMode ? 'bg-blue-800' : 'bg-slate-900'} skew-x-[-20deg] -z-10 rounded-r-sm`}></div>
      </div>
    </div>
  );
};

export default Badge;
