
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { Linkedin, Facebook, Twitter, Instagram, Mail, MapPin, Phone, ShieldCheck, Lock, Award, Check } from 'lucide-react';
import Logo from './Logo';

interface FooterProps {
  lang: Language;
}

const Footer: React.FC<FooterProps> = ({ lang }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Simulate API call
      setTimeout(() => {
        setSubscribed(true);
        setEmail('');
        setTimeout(() => setSubscribed(false), 3000);
      }, 500);
    }
  };

  return (
    <footer className="bg-slate-950 border-t border-white/10 pt-16 pb-8 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute bottom-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
         <div className="absolute -bottom-1/2 -left-1/4 w-[50%] h-[100%] bg-gold-600/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand */}
          <div className="space-y-6">
            <Link to={`/${lang}`}>
               <Logo className="w-16 h-16" withText={true} />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed border-l-2 rtl:border-l-0 rtl:border-r-2 border-gold-500/30 pl-4 rtl:pl-0 rtl:pr-4">
              {TRANSLATIONS.footerDesc[lang]}
            </p>
            <div className="flex gap-4">
              {[
                { Icon: Facebook, label: 'Facebook', href: 'https://facebook.com' },
                { Icon: Twitter, label: 'Twitter', href: 'https://twitter.com' },
                { Icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com' },
                { Icon: Instagram, label: 'Instagram', href: 'https://instagram.com' }
              ].map(({ Icon, label, href }, i) => (
                <a 
                  key={i} 
                  href={href} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label={label}
                  className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-gray-400 hover:bg-gold-500 hover:text-black hover:border-gold-500 transition-all duration-300"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
            {/* Trusted Partner Badge */}
            <div className="pt-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-900/30 border border-green-500/30 rounded-full">
                    <ShieldCheck className="w-4 h-4 text-green-400" />
                  <span className="text-xs font-bold text-green-400 uppercase tracking-wider">{TRANSLATIONS.trusted_partner[lang]}</span>
                </div>
              </div>

              {/* Quick Links */}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-gold-500 rounded-full"></span>
              {TRANSLATIONS.quickLinks[lang]}
            </h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><Link to={`/${lang}/apply`} className="hover:text-gold-400 transition-colors flex items-center gap-2 hover:translate-x-1 rtl:hover:-translate-x-1 duration-200">{TRANSLATIONS.ctaApply[lang]}</Link></li>
              <li><Link to={`/${lang}/academy`} className="hover:text-gold-400 transition-colors flex items-center gap-2 hover:translate-x-1 rtl:hover:-translate-x-1 duration-200">{TRANSLATIONS.academy[lang]}</Link></li>
              <li><Link to={`/${lang}/franchise-apply`} className="hover:text-gold-400 transition-colors flex items-center gap-2 hover:translate-x-1 rtl:hover:-translate-x-1 duration-200">Franchise Program</Link></li>
              <li><Link to={`/${lang}/accreditation-apply`} className="hover:text-gold-400 transition-colors flex items-center gap-2 hover:translate-x-1 rtl:hover:-translate-x-1 duration-200 text-gold-500 font-bold"><Award className="w-3 h-3" /> Get Accredited</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-gold-500 rounded-full"></span>
              {TRANSLATIONS.contactUs[lang]}
            </h3>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded bg-slate-900 flex items-center justify-center shrink-0 group-hover:bg-gold-500 group-hover:text-black transition-colors">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="mt-1">{TRANSLATIONS.address[lang]}</span>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded bg-slate-900 flex items-center justify-center shrink-0 group-hover:bg-gold-500 group-hover:text-black transition-colors">
                   <Phone className="w-4 h-4" />
                </div>
                <span>+1 917 695 7737</span>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded bg-slate-900 flex items-center justify-center shrink-0 group-hover:bg-gold-500 group-hover:text-black transition-colors">
                   <Mail className="w-4 h-4" />
                </div>
                <span>support@digitalsolhub.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter & Security */}
          <div>
            <h3 className="text-white font-bold mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-gold-500 rounded-full"></span>
              {TRANSLATIONS.newsletter[lang]}
            </h3>
            <p className="text-gray-400 text-sm mb-4">{TRANSLATIONS.subscribeDesc[lang]}</p>
            <form onSubmit={handleSubscribe} className="space-y-3 mb-8">
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                placeholder={TRANSLATIONS.enterEmail[lang]}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-500 transition-colors"
                required
              />
              <button 
                type="submit"
                disabled={subscribed}
                className={`w-full font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 ${
                  subscribed 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gradient-to-r from-gold-500 to-gold-600 text-black hover:shadow-lg hover:shadow-gold-500/20 hover:-translate-y-0.5'
                }`}
              >
                {subscribed ? <><Check className="w-4 h-4" /> Subscribed</> : TRANSLATIONS.subscribeBtn[lang]}
              </button>
            </form>
            
            {/* Security Badge */}
            <div className="bg-slate-900/50 rounded-lg p-3 border border-white/5 flex flex-col gap-2">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-800 rounded text-green-400">
                      <Lock className="w-5 h-5" />
                  </div>
                  <div>
                      <p className="text-xs font-bold text-white uppercase tracking-wider">{TRANSLATIONS.ssl_secured[lang]}</p>
                      <p className="text-[10px] text-gray-500">{TRANSLATIONS.data_protection_notice[lang]}</p>
                  </div>
               </div>
               <p className="text-[10px] text-green-400 border-t border-white/5 pt-2 text-center">
                  ❤️ All payments are secure & encrypted.
               </p>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} {TRANSLATIONS.trusted_partner[lang]}</p>
          <div className="flex gap-6">
             <Link to={`/${lang}/terms`} className="hover:text-white transition-colors">{TRANSLATIONS.terms_conditions[lang]}</Link>
             <Link to={`/${lang}/privacy`} className="hover:text-white transition-colors">{TRANSLATIONS.privacy_policy[lang]}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
