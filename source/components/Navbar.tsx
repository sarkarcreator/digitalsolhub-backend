
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Smartphone, User, LogIn, Search, BookOpen, Briefcase, ArrowRight, ShoppingBag, Wrench, Rocket } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS, COURSES, SERVICE_CATEGORIES } from '../constants';
import LanguageSwitcher from './LanguageSwitcher';
import Logo from './Logo';

interface NavbarProps {
  lang: Language;
}

const Navbar: React.FC<NavbarProps> = ({ lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { label: TRANSLATIONS.home[lang], path: `/${lang}` },
    { label: TRANSLATIONS.academy[lang], path: `/${lang}/academy` },
    { label: TRANSLATIONS.services[lang], path: `/${lang}/services` },
    { label: TRANSLATIONS.marketplace[lang], path: `/${lang}/marketplace` },
    { label: TRANSLATIONS.jobs[lang], path: `/${lang}/jobs` },
    { label: TRANSLATIONS.tools[lang], path: `/${lang}/tools` },
  ];

  const isActive = (path: string) => {
    if (path.endsWith(`/${lang}`) && location.pathname === `/${lang}`) return true;
    if (path.endsWith(`/${lang}`) && location.pathname === `/${lang}/`) return true;
    if (!path.endsWith(`/${lang}`) && location.pathname.includes(path)) return true;
    return false;
  };

  // Debounce Search Input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Search Logic
  useEffect(() => {
    if (debouncedQuery.trim().length === 0) {
      setSearchResults([]);
      return;
    }

    const lowerQuery = debouncedQuery.toLowerCase();

    // Filter Courses
    const matchedCourses = COURSES.filter(c => 
      c.title.toLowerCase().includes(lowerQuery) || 
      (c.titleUr && c.titleUr.includes(debouncedQuery)) ||
      c.category.toLowerCase().includes(lowerQuery)
    ).map(c => ({
      type: 'Course',
      typeLabel: lang === Language.ENGLISH ? 'Course' : 'کورس',
      title: lang === Language.URDU && c.titleUr ? c.titleUr : c.title,
      path: `/${lang}/course/${c.id}`,
      icon: BookOpen
    }));

    // Filter Services
    const matchedServices = SERVICE_CATEGORIES.filter(s => {
      const title = s.title[lang] || s.title[Language.ENGLISH];
      const itemsMatch = s.items.some(i => i.toLowerCase().includes(lowerQuery));
      return title?.toLowerCase().includes(lowerQuery) || itemsMatch;
    }).map(s => ({
      type: 'Service',
      typeLabel: lang === Language.ENGLISH ? 'Service' : 'سروس',
      title: s.title[lang] || s.title[Language.ENGLISH],
      path: `/${lang}/services/${s.id}`,
      icon: Briefcase
    }));

    setSearchResults([...matchedCourses, ...matchedServices]);
  }, [debouncedQuery, lang]);

  // Click outside to close search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchQuery('');
        setSearchResults([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = (path: string) => {
    navigate(path);
    setSearchQuery('');
    setSearchResults([]);
    setIsOpen(false);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <nav className="fixed w-full top-0 z-50 backdrop-blur-md bg-slate-950/90 border-b border-white/10 shadow-lg shadow-black/20 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Tagline */}
          <Link to={`/${lang}`} className="flex items-center gap-3 group hover:opacity-90 transition-opacity shrink-0">
             <Logo className="w-10 h-10 md:w-12 md:h-12" withText={true} />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden xl:flex items-center space-x-6 rtl:space-x-reverse ml-auto mr-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-cyan-400 relative py-1 ${
                  isActive(item.path) ? 'text-cyan-400' : 'text-gray-300'
                }`}
              >
                {item.label}
                {isActive(item.path) && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-500 rounded-full animate-pulse"></span>
                )}
              </Link>
            ))}
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden lg:block relative mx-4" ref={searchRef}>
             <div className="relative group">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 group-focus-within:text-cyan-400 transition-colors rtl:right-3 rtl:left-auto pointer-events-none" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={TRANSLATIONS.search[lang]}
                  className="bg-slate-900/50 border border-white/10 rounded-full pl-10 pr-10 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 w-64 transition-all placeholder:text-gray-600 focus:bg-slate-900"
                />
                {searchQuery && (
                  <button 
                    onClick={handleClearSearch}
                    className="absolute right-3 top-2.5 text-gray-500 hover:text-white transition-colors rtl:right-auto rtl:left-3"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
             </div>
             
             {/* Results Dropdown */}
             {searchQuery && (
               <div className="absolute top-full left-0 w-full mt-2 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                 {searchResults.length > 0 ? (
                   <div className="max-h-64 overflow-y-auto custom-scrollbar">
                     {searchResults.map((result, i) => (
                       <button
                         key={i}
                         onClick={() => handleResultClick(result.path)}
                         className="w-full text-left px-4 py-3 hover:bg-white/5 flex items-center gap-3 transition-colors border-b border-white/5 last:border-0 group"
                       >
                         <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-slate-700 transition-colors shrink-0">
                            <result.icon className="w-4 h-4 text-cyan-400" />
                         </div>
                         <div className="flex-1 min-w-0">
                           <p className="text-sm font-bold text-white truncate group-hover:text-cyan-400 transition-colors">{result.title}</p>
                           <p className="text-[10px] text-gray-500 uppercase tracking-wider">{result.typeLabel}</p>
                         </div>
                         <ArrowRight className="w-3 h-3 text-gray-600 group-hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-all rtl:rotate-180" />
                       </button>
                     ))}
                   </div>
                 ) : (
                   <div className="p-4 text-center text-xs text-gray-500">
                     {debouncedQuery === searchQuery ? `No results found for "${searchQuery}"` : 'Searching...'}
                   </div>
                 )}
               </div>
             )}
          </div>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
             <LanguageSwitcher currentLang={lang} />
             <Link 
               to={`/${lang}/login`}
               className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 text-white hover:bg-white/10 transition-all text-sm font-bold"
             >
               <LogIn className="w-4 h-4" />
               <span>{TRANSLATIONS.login[lang]}</span>
             </Link>
             <Link 
               to={`/${lang}/signup`}
               className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:shadow-lg hover:shadow-cyan-500/30 transition-all text-sm font-bold"
             >
               <User className="w-4 h-4" />
               <span>{TRANSLATIONS.signup[lang]}</span>
             </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-4">
             <LanguageSwitcher currentLang={lang} />
             <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white p-1"
            >
              {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-white/10 animate-in slide-in-from-top-5 duration-200 h-screen overflow-y-auto pb-20">
          
          {/* Mobile Search */}
          <div className="p-4 border-b border-white/5 bg-slate-900/30">
             <div className="relative">
                <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-500 rtl:right-3 rtl:left-auto pointer-events-none" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={TRANSLATIONS.search[lang]}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-white focus:outline-none focus:border-cyan-500/50"
                />
                {searchQuery && (
                  <button 
                    onClick={handleClearSearch}
                    className="absolute right-3 top-3.5 text-gray-500 hover:text-white transition-colors rtl:right-auto rtl:left-3"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
             </div>
             {/* Mobile Search Results */}
             {searchQuery && (
               <div className="mt-3 bg-slate-900 border border-white/10 rounded-xl overflow-hidden shadow-xl">
                 {searchResults.length > 0 ? (
                   searchResults.map((result, i) => (
                     <button
                       key={i}
                       onClick={() => handleResultClick(result.path)}
                       className="w-full text-left px-4 py-3 border-b border-white/5 last:border-0 flex items-center gap-3 text-white hover:bg-white/5"
                     >
                        <div className="p-1.5 bg-slate-800 rounded-md shrink-0">
                           <result.icon className="w-4 h-4 text-cyan-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                           <p className="text-sm font-bold truncate">{result.title}</p>
                           <p className="text-[10px] text-gray-500 uppercase">{result.typeLabel}</p>
                        </div>
                     </button>
                   ))
                 ) : (
                   <div className="p-4 text-center text-sm text-gray-500">
                     {debouncedQuery === searchQuery ? 'No results found' : 'Searching...'}
                   </div>
                 )}
               </div>
             )}
          </div>

          <div className="px-4 pt-4 pb-6 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-lg text-base font-medium border border-transparent ${
                  isActive(item.path)
                    ? 'bg-slate-900 border-cyan-500/20 text-cyan-400'
                    : 'text-gray-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 flex flex-col gap-3 border-t border-white/5 mt-4">
               <Link 
                 to={`/${lang}/login`}
                 onClick={() => setIsOpen(false)}
                 className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-white/20 text-white bg-slate-900 font-bold"
               >
                 <LogIn className="w-5 h-5" />
                 {TRANSLATIONS.login[lang]}
               </Link>
               <Link 
                 to={`/${lang}/signup`}
                 onClick={() => setIsOpen(false)}
                 className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold"
               >
                 <User className="w-5 h-5" />
                 {TRANSLATIONS.signup[lang]}
               </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
