import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Language } from '../types';
import { ADMIN_WHATSAPP } from '../utils/notifications';
import { TRANSLATIONS } from '../constants';
import SEO from '../components/SEO';
import { login } from '../utils/api';
import { UserCircle, Briefcase, Mail, Lock, ArrowRight, Check, AlertCircle, Shield, ShieldCheck, HelpCircle } from 'lucide-react';

const Login: React.FC = () => {
  const { lang: paramLang } = useParams<{ lang: string }>();
  const lang = paramLang === Language.URDU ? Language.URDU : Language.ENGLISH;
  const navigate = useNavigate();
  const [userType, setUserType] = useState<'student' | 'client' | 'admin'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError(TRANSLATIONS.fill_all_fields[lang]);
      return;
    }

    setLoading(true);

    try {
      const response = await login({
        email,
        password,
        role: userType
      });

      if (response.user.role === 'admin') {
        navigate(`/${lang}/admin-dashboard`, { replace: true });
      } else if (response.user.role === 'student') {
        navigate(`/${lang}/dashboard`, { replace: true });
      } else {
        navigate(`/${lang}/client-dashboard`, { replace: true });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : TRANSLATIONS.invalid_login[lang]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-slate-950 relative overflow-hidden px-4">
      <SEO 
        title={`${TRANSLATIONS.login[lang]} | Digital Solutions Hub`} 
        description="Login to your Student or Client portal." 
        lang={lang} 
      />

      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-blue/20 rounded-full blur-[100px] animate-pulse-slow"></div>
         <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-neon/10 rounded-full blur-[100px] animate-pulse-slow"></div>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
        
        {/* Selection Cards */}
        <div className="space-y-6">
           <h1 className="text-3xl font-bold text-white mb-8 text-center md:text-left rtl:md:text-right">
             {TRANSLATIONS.welcome[lang]}
           </h1>
           
           <div 
             onClick={() => setUserType('student')}
             className={`cursor-pointer group relative p-6 rounded-2xl border transition-all duration-300 ${
               userType === 'student' 
               ? 'bg-brand-blue/10 border-brand-blue/50 shadow-[0_0_30px_rgba(59,130,246,0.15)]' 
               : 'bg-white/5 border-white/10 hover:bg-white/10'
             }`}
           >
             <div className="flex items-center justify-between mb-2">
                <div className={`p-3 rounded-lg ${userType === 'student' ? 'bg-brand-blue text-white' : 'bg-slate-800 text-gray-400'}`}>
                   <UserCircle className="w-6 h-6" />
                </div>
                {userType === 'student' && <div className="w-6 h-6 bg-brand-blue rounded-full flex items-center justify-center"><Check className="w-4 h-4 text-white" /></div>}
             </div>
             <h3 className="text-xl font-bold text-white mb-1">{TRANSLATIONS.login_student[lang]}</h3>
             <p className="text-sm text-gray-400">Access your courses, assignments, and progress.</p>
           </div>

           <div 
             onClick={() => setUserType('client')}
             className={`cursor-pointer group relative p-6 rounded-2xl border transition-all duration-300 ${
               userType === 'client' 
               ? 'bg-brand-neon/10 border-brand-neon/50 shadow-[0_0_30px_rgba(6,182,212,0.15)]' 
               : 'bg-white/5 border-white/10 hover:bg-white/10'
             }`}
           >
             <div className="flex items-center justify-between mb-2">
                <div className={`p-3 rounded-lg ${userType === 'client' ? 'bg-brand-cyan text-black' : 'bg-slate-800 text-gray-400'}`}>
                   <Briefcase className="w-6 h-6" />
                </div>
                {userType === 'client' && <div className="w-6 h-6 bg-brand-neon rounded-full flex items-center justify-center"><Check className="w-4 h-4 text-black" /></div>}
             </div>
             <h3 className="text-xl font-bold text-white mb-1">{TRANSLATIONS.login_client[lang]}</h3>
             <p className="text-sm text-gray-400">Manage projects, view reports, and billing.</p>
           </div>
        </div>

        {/* Login Form */}
        <div className="glass p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
          
          {/* Security Banner */}
          <div className="absolute top-0 left-0 w-full bg-green-500/10 border-b border-green-500/20 py-2 px-4 flex items-center justify-center gap-2">
             <ShieldCheck className="w-4 h-4 text-green-400" />
             <span className="text-xs font-bold text-green-400 uppercase tracking-widest">{TRANSLATIONS.ssl_secured[lang]}</span>
          </div>

          <div className="mt-6">
            <h2 className="text-2xl font-bold text-white mb-2 text-center flex items-center justify-center gap-2">
              {userType === 'student' ? TRANSLATIONS.login_student[lang] : userType === 'client' ? TRANSLATIONS.login_client[lang] : TRANSLATIONS.login_admin[lang]}
            </h2>
            <p className="text-center text-xs text-gray-500 mb-6">{TRANSLATIONS.login_security_msg[lang]}</p>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{TRANSLATIONS.email_phone[lang]}</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-500 group-focus-within:text-brand-blue transition-colors rtl:right-3 rtl:left-auto" />
                  <input 
                    type="text" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-brand-blue/50 focus:bg-slate-900/80 transition-all"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{TRANSLATIONS.password[lang]}</label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-500 group-focus-within:text-brand-blue transition-colors rtl:right-3 rtl:left-auto" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-brand-blue/50 focus:bg-slate-900/80 transition-all"
                    placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-600 bg-slate-800 text-brand-blue focus:ring-brand-blue" />
                  <span>{TRANSLATIONS.remember_me[lang]}</span>
                </label>
                <a href="#" className="text-brand-blue hover:text-brand-neon transition-colors">
                  {TRANSLATIONS.forgot_pass[lang]}
                </a>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 rounded-xl font-bold text-lg shadow-lg transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 ${
                  userType === 'student'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-blue-600/30'
                    : userType === 'client'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-cyan-500/30'
                      : 'bg-gradient-to-r from-red-600 to-orange-600 text-white hover:shadow-red-500/30'
                } ${loading ? 'opacity-70 cursor-wait' : ''}`}
              >
                <Lock className="w-5 h-5" />
                {loading ? 'Signing in...' : TRANSLATIONS.login[lang]}
              </button>
            </form>

            <div className="mt-8 text-center pt-6 border-t border-white/5 space-y-4">
              <p className="text-gray-400 text-sm">
                {TRANSLATIONS.no_account[lang]} <Link to={`/${lang}/signup`} className={`font-bold hover:underline ${
                  userType === 'student' ? 'text-brand-blue' : 'text-brand-neon'
                }`}>{TRANSLATIONS.create_account[lang]}</Link>
              </p>
              
              <div className="flex justify-center items-center gap-4">
                  <button 
                      onClick={() => setUserType(userType === 'admin' ? 'student' : 'admin')}
                      className="text-xs text-gray-500 hover:text-white transition-colors"
                  >
                      {userType === 'admin' ? 'Back to User Login' : 'Admin Login'}
                  </button>
                  <span className="text-gray-600">|</span>
                    <a href={`https://wa.me/${ADMIN_WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="text-xs text-green-500 hover:text-green-400 flex items-center gap-1">
                      <HelpCircle className="w-3 h-3" /> Login Issue?
                    </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
