
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Language } from '../types';
import { Globe, ChevronDown, Check } from 'lucide-react';

interface LanguageSwitcherProps {
  currentLang: Language;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ currentLang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: Language.ENGLISH, label: 'English', short: 'EN', flag: '🇬🇧' },
    { code: Language.URDU, label: 'اردو', short: 'UR', flag: '🇵🇰' },
    { code: Language.ARABIC, label: 'العربية', short: 'AR', flag: '🇸🇦' },
    { code: Language.RUSSIAN, label: 'Русский', short: 'RU', flag: '🇷🇺' },
  ];

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (newLang: Language) => {
    if (newLang === currentLang) {
      setIsOpen(false);
      return;
    }
    
    // Replace the language segment in the path
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const search = location.search;
    const hash = location.hash;
    
    // Path structure is expected to be /:lang/...
    // If we are at root (shouldn't happen due to redirect) or just /:lang
    if (pathSegments.length <= 1) {
      navigate(`/${newLang}${search}${hash}`);
    } else {
      // Replace first segment
      pathSegments[0] = newLang;
      navigate(`/${pathSegments.join('/')}${search}${hash}`);
    }
    
    setIsOpen(false);
  };

  return (
    <div className="relative z-50" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-full border transition-all text-sm font-medium group backdrop-blur-sm ${
          isOpen 
            ? 'bg-slate-800 border-cyan-500/50 text-white shadow-[0_0_10px_rgba(6,182,212,0.2)]' 
            : 'bg-slate-800/80 border-slate-700 text-gray-300 hover:bg-slate-700 hover:text-white'
        }`}
        aria-label="Select Language"
      >
        <Globe className={`w-4 h-4 ${isOpen ? 'text-cyan-400' : 'text-gray-400 group-hover:text-cyan-400'} transition-colors`} />
        <span className="uppercase tracking-wide text-xs md:text-sm">{currentLang}</span>
        <ChevronDown className={`w-3 h-3 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-cyan-400' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 rtl:left-0 rtl:right-auto mt-3 w-48 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50 ring-1 ring-white/10">
          <div className="py-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`w-full text-left rtl:text-right px-4 py-3 text-sm transition-all flex items-center justify-between group ${
                  currentLang === lang.code 
                    ? 'bg-slate-800/80 text-cyan-400 font-bold' 
                    : 'text-gray-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                   <span className="text-lg leading-none filter drop-shadow-sm">{lang.flag}</span>
                   <span className={lang.code === Language.URDU || lang.code === Language.ARABIC ? 'font-urdu text-base' : 'font-sans'}>{lang.label}</span>
                </div>
                {currentLang === lang.code && <Check className="w-4 h-4 text-cyan-400" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
