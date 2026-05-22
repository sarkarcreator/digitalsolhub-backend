
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';
import SEO from '../components/SEO';
import { register } from '../utils/api';
import { UserCircle, Briefcase, User, Phone, Mail, Lock, Globe, BookOpen, Layers, IdCard, AlertCircle, Check, Loader2 } from 'lucide-react';

const Signup: React.FC = () => {
  const { lang: paramLang } = useParams<{ lang: string }>();
  const lang = paramLang === Language.URDU ? Language.URDU : Language.ENGLISH;
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'student' | 'client'>('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    studentId: '',
    course: 'Web Development',
    industry: 'E-Commerce',
    project: 'Web Development',
    password: '',
    confirmPassword: ''
  });

  const [studentIdError, setStudentIdError] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'studentId') setStudentIdError('');
    if (e.target.name === 'email') setEmailError('');
    if (error) setError('');
  };

  const validateStudentId = (id: string) => {
      const trimmedId = id.trim();
      if (!trimmedId) return TRANSLATIONS.id_required[lang];
      if (!/^[a-zA-Z0-9]+$/.test(trimmedId)) return TRANSLATIONS.id_alphanumeric[lang];
      if (trimmedId.length < 5 || trimmedId.length > 10) return TRANSLATIONS.id_length[lang];
      return '';
  };

  const validateEmail = (email: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email && !emailRegex.test(email)) {
          return lang === Language.URDU ? 'ای میل کا فارمیٹ غلط ہے' : 'Invalid email format';
      }
      return '';
  };

  // Real-time valid check for green state (only if no error is currently shown or typing fixes it)
  const isStudentIdValid = activeTab === 'student' && !studentIdError && formData.studentId.length >= 5 && formData.studentId.length <= 10 && /^[a-zA-Z0-9]+$/.test(formData.studentId);
  const isEmailValid = !emailError && formData.email.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

  const handleIdBlur = () => {
      if (activeTab === 'student') {
          const err = validateStudentId(formData.studentId);
          setStudentIdError(err);
      }
  };

  const handleEmailBlur = () => {
      const err = validateEmail(formData.email);
      setEmailError(err);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setStudentIdError('');
    setEmailError('');

    // Validate Email first
    const emailErr = validateEmail(formData.email);
    if (emailErr) {
        setEmailError(emailErr);
        return;
    }

    if (activeTab === 'student') {
      const idError = validateStudentId(formData.studentId);
      if (idError) {
        setStudentIdError(idError);
        setError(idError);
        return;
      }
    }

    if (formData.password !== formData.confirmPassword) {
      setError(lang === Language.URDU ? 'پاس ورڈ ایک جیسے نہیں ہیں' : 'Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const result = await register({
        role: activeTab,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
        student_id: activeTab === 'student' ? formData.studentId : undefined,
        course: activeTab === 'student' ? formData.course : undefined,
        industry: activeTab === 'client' ? formData.industry : undefined,
        project: activeTab === 'client' ? formData.project : undefined,
        language: lang
      });

      if (result.token) {
        if (result.user.role === 'student') {
          navigate(`/${lang}/dashboard`);
        } else {
          navigate(`/${lang}/client-dashboard`);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-slate-950 px-4 relative overflow-hidden">
      <SEO 
        title={`${TRANSLATIONS.signup[lang]} | Digital Solutions Hub`} 
        description="Create your Student or Client account." 
        lang={lang} 
      />

       {/* Background Glow */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-blue/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-2xl relative z-10">
        
        <div className="glass rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
          
          {/* Tabs */}
          <div className="grid grid-cols-2 border-b border-white/10 bg-black/20">
            <button
              onClick={() => { setActiveTab('student'); setError(''); setStudentIdError(''); setEmailError(''); }}
              className={`py-5 text-center font-bold text-sm sm:text-base transition-all relative ${
                activeTab === 'student' ? 'text-white bg-white/5' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <UserCircle className="w-5 h-5" />
                {TRANSLATIONS.signup_student[lang]}
              </div>
              {activeTab === 'student' && <div className="absolute bottom-0 left-0 w-full h-1 bg-brand-blue shadow-[0_0_10px_#3b82f6]"></div>}
            </button>
            <button
              onClick={() => { setActiveTab('client'); setError(''); setEmailError(''); }}
              className={`py-5 text-center font-bold text-sm sm:text-base transition-all relative ${
                activeTab === 'client' ? 'text-white bg-white/5' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Briefcase className="w-5 h-5" />
                {TRANSLATIONS.signup_client[lang]}
              </div>
              {activeTab === 'client' && <div className="absolute bottom-0 left-0 w-full h-1 bg-brand-neon shadow-[0_0_10px_#06b6d4]"></div>}
            </button>
          </div>

          <div className="p-8 md:p-10">
            <h2 className="text-2xl font-bold text-white mb-2 text-center">
               {activeTab === 'student' ? 'Start Your Learning Journey' : 'Scale Your Business'}
            </h2>
            <p className="text-gray-400 text-center mb-8 text-sm">
               {activeTab === 'student' ? 'Join thousands of students mastering digital skills.' : 'Partner with us for world-class digital solutions.'}
            </p>
            
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-5">
              
              {/* Common Fields */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  {activeTab === 'student' ? TRANSLATIONS.full_name[lang] : TRANSLATIONS.business_name[lang]}
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-500 rtl:right-4 rtl:left-auto" />
                  <input name="name" type="text" value={formData.name} onChange={handleInputChange} className="w-full bg-slate-950/60 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-brand-blue/50 focus:bg-slate-900 transition-all" placeholder={activeTab === 'student' ? "John Doe" : "Tech Solutions Inc."} required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                 <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{TRANSLATIONS.email[lang]}</label>
                    <div className="relative group">
                      <Mail className={`absolute left-4 top-3.5 w-5 h-5 transition-colors rtl:right-4 rtl:left-auto ${
                           emailError
                             ? 'text-red-400' 
                             : isEmailValid 
                               ? 'text-green-500' 
                               : 'text-gray-500 group-focus-within:text-brand-blue'
                        }`} />
                      <input 
                        name="email" 
                        type="email" 
                        value={formData.email} 
                        onChange={handleInputChange}
                        onBlur={handleEmailBlur}
                        className={`w-full border rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none transition-all placeholder:text-gray-500 ${
                            emailError
                              ? 'bg-red-500/5 border-red-500 focus:border-red-500 focus:bg-red-500/10' 
                              : isEmailValid 
                                ? 'bg-green-500/5 border-green-500 focus:border-green-500 focus:bg-green-500/10'
                                : 'bg-slate-950/60 border-white/10 focus:border-brand-blue/50 focus:bg-slate-900'
                          }`}
                        placeholder="email@example.com" 
                        required 
                      />
                      {isEmailValid && (
                          <div className="absolute right-4 top-3.5 rtl:right-auto rtl:left-4 animate-in fade-in zoom-in duration-300">
                             <Check className="w-5 h-5 text-green-500" />
                          </div>
                      )}
                      {emailError && (
                          <div className="absolute right-4 top-3.5 rtl:right-auto rtl:left-4 animate-in fade-in zoom-in duration-300">
                             <AlertCircle className="w-5 h-5 text-red-500" />
                          </div>
                      )}
                    </div>
                    {emailError && (
                        <p className="text-[10px] mt-1 pl-1 text-red-400 animate-in fade-in slide-in-from-top-1 font-medium">
                          {emailError}
                        </p>
                    )}
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{TRANSLATIONS.phone_num[lang]}</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-3.5 w-5 h-5 text-gray-500 rtl:right-4 rtl:left-auto" />
                      <input name="phone" type="tel" value={formData.phone} onChange={handleInputChange} className="w-full bg-slate-950/60 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-brand-blue/50 focus:bg-slate-900 transition-all placeholder:text-gray-500" placeholder="+92 301 7862281" required />
                    </div>
                 </div>
              </div>

              {/* Specific Fields */}
              {activeTab === 'student' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                   <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{TRANSLATIONS.student_id[lang]}</label>
                      <div className="relative group">
                        <IdCard className={`absolute left-4 top-3.5 w-5 h-5 transition-colors rtl:right-4 rtl:left-auto ${
                           studentIdError
                             ? 'text-red-400' 
                             : isStudentIdValid 
                               ? 'text-green-500' 
                               : 'text-gray-500 group-focus-within:text-brand-blue'
                        }`} />
                        <input 
                          name="studentId" 
                          type="text" 
                          value={formData.studentId}
                          onChange={handleInputChange}
                          onBlur={handleIdBlur}
                          className={`w-full border rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none transition-all placeholder:text-gray-500 ${
                            studentIdError
                              ? 'bg-red-500/5 border-red-500 focus:border-red-500 focus:bg-red-500/10' 
                              : isStudentIdValid 
                                ? 'bg-green-500/5 border-green-500 focus:border-green-500 focus:bg-green-500/10'
                                : 'bg-slate-950/60 border-white/10 focus:border-brand-blue/50 focus:bg-slate-900'
                          }`}
                          placeholder={lang === Language.ENGLISH ? 'e.g. ST12345 (Alphanumeric, 5-10 chars)' : 'مثال: ST12345 (5-10 حروف/نمبر)'} 
                          required
                          maxLength={10}
                        />
                        {isStudentIdValid && (
                          <div className="absolute right-4 top-3.5 rtl:right-auto rtl:left-4 animate-in fade-in zoom-in duration-300">
                             <Check className="w-5 h-5 text-green-500" />
                          </div>
                        )}
                        {studentIdError && (
                          <div className="absolute right-4 top-3.5 rtl:right-auto rtl:left-4 animate-in fade-in zoom-in duration-300">
                             <AlertCircle className="w-5 h-5 text-red-500" />
                          </div>
                        )}
                      </div>
                      {studentIdError ? (
                        <p className="text-[10px] mt-1 pl-1 text-red-400 animate-in fade-in slide-in-from-top-1 font-medium">
                          {studentIdError}
                        </p>
                      ) : (
                        <p className={`text-[10px] mt-1 pl-1 transition-colors ${isStudentIdValid ? 'text-green-500 font-medium' : 'text-gray-500'}`}>
                          {TRANSLATIONS.id_hint[lang]}
                        </p>
                      )}
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{TRANSLATIONS.course_interest[lang]}</label>
                      <div className="relative">
                        <BookOpen className="absolute left-4 top-3.5 w-5 h-5 text-gray-500 rtl:right-4 rtl:left-auto" />
                        <select name="course" value={formData.course} onChange={handleInputChange} className="w-full bg-slate-950/60 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-brand-blue/50 focus:bg-slate-900 appearance-none">
                          <option>Web Development</option>
                          <option>Digital Marketing</option>
                          <option>SEO</option>
                          <option>Graphic Design</option>
                          <option>AI Tools</option>
                        </select>
                      </div>
                   </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                   <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{TRANSLATIONS.industry_type[lang]}</label>
                      <div className="relative">
                        <Globe className="absolute left-4 top-3.5 w-5 h-5 text-gray-500 rtl:right-4 rtl:left-auto" />
                        <select name="industry" value={formData.industry} onChange={handleInputChange} className="w-full bg-slate-950/60 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-brand-blue/50 focus:bg-slate-900 appearance-none">
                          <option>E-Commerce</option>
                          <option>Education</option>
                          <option>Healthcare</option>
                          <option>Technology</option>
                        </select>
                      </div>
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{TRANSLATIONS.project_type[lang]}</label>
                      <div className="relative">
                        <Layers className="absolute left-4 top-3.5 w-5 h-5 text-gray-500 rtl:right-4 rtl:left-auto" />
                        <select name="project" value={formData.project} onChange={handleInputChange} className="w-full bg-slate-950/60 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-brand-blue/50 focus:bg-slate-900 appearance-none">
                          <option>Web Development</option>
                          <option>App Development</option>
                          <option>Digital Marketing</option>
                          <option>SEO Services</option>
                        </select>
                      </div>
                   </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                 <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{TRANSLATIONS.password[lang]}</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-500 rtl:right-4 rtl:left-auto" />
                      <input name="password" type="password" value={formData.password} onChange={handleInputChange} className="w-full bg-slate-950/60 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-brand-blue/50 focus:bg-slate-900 transition-all" placeholder="••••••••" required />
                    </div>
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{TRANSLATIONS.confirm_pass[lang]}</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-500 rtl:right-4 rtl:left-auto" />
                      <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleInputChange} className="w-full bg-slate-950/60 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-brand-blue/50 focus:bg-slate-900 transition-all" placeholder="••••••••" required />
                    </div>
                 </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform hover:-translate-y-1 mt-4 flex items-center justify-center gap-2 ${
                  activeTab === 'student'
                    ? 'bg-gradient-to-r from-brand-blue to-indigo-600 text-white hover:shadow-blue-600/30'
                    : 'bg-gradient-to-r from-brand-cyan to-brand-blue text-white hover:shadow-cyan-500/30'
                } ${loading ? 'opacity-80 cursor-wait' : ''}`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                  </>
                ) : (
                  activeTab === 'student' ? TRANSLATIONS.create_student_acc[lang] : TRANSLATIONS.create_client_acc[lang]
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
