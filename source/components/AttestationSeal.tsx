
import React from 'react';
import Logo from './Logo';

interface AttestationSealProps {
  id: string;
  date?: string;
  officer?: string;
  type?: string;
  className?: string;
}

const AttestationSeal: React.FC<AttestationSealProps> = ({ id, date, officer, type = "ACADEMY", className = "w-32 h-32" }) => {
  return (
    <div className={`relative flex items-center justify-center rounded-full border-4 border-double border-yellow-600 text-yellow-800 bg-yellow-50/50 backdrop-blur-sm ${className}`}>
      
      {/* Curved Text Path */}
      <svg className="absolute inset-0 w-full h-full animate-spin-slow" viewBox="0 0 100 100">
        <path id="curve" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="transparent" />
        <text className="text-[10px] uppercase font-bold tracking-[0.2em] fill-yellow-700">
          <textPath href="#curve" startOffset="0%">
            * Digital Solutions Hub * Official Attestation *
          </textPath>
        </text>
      </svg>

      {/* Inner Circle */}
      <div className="absolute inset-2 border border-yellow-600/30 rounded-full"></div>
      
      <div className="flex flex-col items-center justify-center z-10 text-center">
         <Logo className="w-1/4 h-1/4 mb-1 text-yellow-700" withText={false} />
         <h4 className="text-[8px] font-black uppercase tracking-wider text-blue-900 leading-tight">
            {type}
            <br/>VERIFIED
         </h4>
         
         {officer && (
             <div className="mt-1 border-t border-yellow-600/50 pt-0.5 w-16">
                 <p className="text-[5px] font-serif italic text-slate-600">Sig: {officer}</p>
             </div>
         )}
         
         {date && <p className="text-[5px] font-mono text-slate-500 mt-0.5">{date}</p>}
      </div>

      {/* Stamp Texture Overlay */}
      <div className="absolute inset-0 rounded-full bg-[url('https://www.transparenttextures.com/patterns/grunge-wall.png')] opacity-30 mix-blend-multiply pointer-events-none"></div>
    </div>
  );
};

export default AttestationSeal;
