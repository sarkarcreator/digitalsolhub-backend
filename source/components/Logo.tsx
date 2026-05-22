import React from 'react';

interface LogoProps {
  className?: string;
  withText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = "w-12 h-12", withText = false }) => {
  return (
    <div className="flex items-center gap-2 select-none">
      {/* Icon Part: Replicating the gear/circuit style from the image */}
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="logo-grad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#22d3ee" /> {/* Cyan */}
            <stop offset="50%" stopColor="#3b82f6" /> {/* Blue */}
            <stop offset="100%" stopColor="#10b981" /> {/* Emerald */}
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        {/* Background Glow */}
        <circle cx="50" cy="50" r="30" fill="url(#logo-grad)" fillOpacity="0.15" filter="url(#glow)" />

        {/* Center Hex/Gear Shape */}
        <path d="M50 30 L70 42 L70 65 L50 77 L30 65 L30 42 Z" fill="#0F172A" stroke="url(#logo-grad)" strokeWidth="3" />
        <circle cx="50" cy="53.5" r="8" fill="url(#logo-grad)" />

        {/* Horizontal Connection Lines */}
        <path d="M70 53.5 H90" stroke="url(#logo-grad)" strokeWidth="3" strokeLinecap="round" />
        <path d="M30 53.5 H10" stroke="url(#logo-grad)" strokeWidth="3" strokeLinecap="round" />
        
        {/* Side Bars */}
        <rect x="85" y="40" width="8" height="27" rx="2" fill="url(#logo-grad)" />
        <rect x="7" y="40" width="8" height="27" rx="2" fill="url(#logo-grad)" />

        {/* Vertical Connections & Dots */}
        <circle cx="50" cy="15" r="3" fill="#22d3ee" />
        <circle cx="50" cy="92" r="3" fill="#10b981" />
        <path d="M50 30 V15" stroke="url(#logo-grad)" strokeWidth="2" />
        <path d="M50 77 V92" stroke="url(#logo-grad)" strokeWidth="2" />
      </svg>
      
      {/* Text Part: Stacked layout matching the image typography */}
      {withText && (
        <div className="flex flex-col items-start leading-none justify-center">
          <span className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 tracking-wide" style={{ fontFamily: 'Poppins, sans-serif' }}>
            DIGITAL
          </span>
          <div className="w-full flex items-center justify-center bg-gradient-to-r from-slate-800 to-slate-900 border border-blue-500/30 rounded-[2px] my-[2px] px-1 py-[1px] shadow-sm">
             <span className="text-[8px] md:text-[9px] font-bold text-cyan-100 tracking-[0.25em] ml-1">
               SOLUTIONS
             </span>
          </div>
          <span className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-emerald-400 tracking-wide" style={{ fontFamily: 'Poppins, sans-serif' }}>
            HUB
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;