
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Language, Franchise, Course } from '../types';
import SEO from '../components/SEO';
import { getFranchiseById, updateFranchiseSettings } from '../utils/franchiseManager';
import { COURSES } from '../constants';
import Logo from '../components/Logo';
import Badge from '../components/Badge';
import { 
  LayoutDashboard, Users, DollarSign, BookOpen, Settings, LogOut, 
  MapPin, ShieldCheck, TrendingUp, Wallet, Bell, Search, Menu, Award, Palette, Globe, Save, Lock, FileText, ExternalLink
} from 'lucide-react';

const FranchiseDashboard: React.FC = () => {
  const { lang: paramLang, id } = useParams<{ lang: string; id: string }>();
  const lang = (Object.values(Language).includes(paramLang as Language)) ? (paramLang as Language) : Language.ENGLISH;
  
  const [franchise, setFranchise] = useState<Franchise | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [view, setView] = useState('dashboard'); // dashboard, courses, settings, students, certificates, legal
  
  // Settings Form State
  const [logoUrl, setLogoUrl] = useState('');
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    if (id) {
      const data = getFranchiseById(id);
      if (data) {
          setFranchise(data);
          setLogoUrl(data.whiteLabel?.customLogo || '');
          setDisplayName(data.name);
      }
    }
  }, [id]);

  const handleSaveSettings = () => {
      if (!franchise) return;
      
      const updated = updateFranchiseSettings(franchise.id, {
          name: displayName,
          whiteLabel: {
              ...franchise.whiteLabel,
              enabled: true,
              customLogo: logoUrl
          }
      });
      // Update local state is mocked via reload or re-fetch in real app
      setFranchise(updated[0] || franchise); // Simple mock update
      alert("Settings Saved!");
  };

  const toggleCourse = (courseId: string) => {
      if (!franchise) return;
      const currentAllowed = franchise.allowedCourses || [];
      let newAllowed;
      
      if (currentAllowed.includes(courseId)) {
          newAllowed = currentAllowed.filter(id => id !== courseId);
      } else {
          newAllowed = [...currentAllowed, courseId];
      }
      
      updateFranchiseSettings(franchise.id, { allowedCourses: newAllowed });
      setFranchise({ ...franchise, allowedCourses: newAllowed });
  };

  if (!franchise) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="text-center">
           <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
           <p className="text-gray-400 mb-6">Invalid ID or Accreditation Revoked.</p>
           <Link to={`/${lang}`} className="bg-brand-neon text-black px-6 py-2 rounded-lg font-bold">Go Home</Link>
        </div>
      </div>
    );
  }

  // --- Dynamic Branding Logic ---
  // If white-label enabled, use custom logo in sidebar
  const hasCustomBranding = franchise.whiteLabel?.enabled && franchise.whiteLabel.customLogo;

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-white">
      <SEO 
        title={`${franchise.name} | Partner Portal`} 
        description="Manage your institute performance and courses." 
        lang={lang} 
      />

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 h-full w-72 bg-slate-900 border-r border-white/10 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
         <div className="h-24 flex items-center px-6 border-b border-white/10">
            {hasCustomBranding ? (
                <div className="flex items-center gap-2">
                    <img src={franchise.whiteLabel?.customLogo} alt="Partner Logo" className="h-10 max-w-[150px] object-contain" />
                </div>
            ) : (
                <Logo className="w-10 h-10" withText={true} />
            )}
         </div>
         <div className="p-4">
            <div className="bg-brand-neon/10 border border-brand-neon/20 rounded-xl p-4 mb-6">
               <div className="flex items-center justify-between mb-1">
                   <p className="text-xs text-brand-neon font-bold uppercase tracking-wider">{franchise.accreditationType !== 'None' ? `Accredited ${franchise.accreditationType}` : franchise.type}</p>
                   <ShieldCheck className="w-4 h-4 text-brand-neon" />
               </div>
               <h3 className="font-bold text-white leading-tight">{franchise.name}</h3>
               <p className="text-xs text-gray-400 mt-2 flex items-center gap-1"><MapPin className="w-3 h-3"/> {franchise.city}, {franchise.country}</p>
            </div>
            
            <nav className="space-y-1">
               <button onClick={() => setView('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${view === 'dashboard' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                   <LayoutDashboard className="w-5 h-5" /> Dashboard
               </button>
               <button onClick={() => setView('courses')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${view === 'courses' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                   <BookOpen className="w-5 h-5" /> Course Library
               </button>
               <button onClick={() => setView('students')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${view === 'students' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                   <Users className="w-5 h-5" /> Students
               </button>
               <button onClick={() => setView('certificates')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${view === 'certificates' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                   <Award className="w-5 h-5" /> Certificates
               </button>
               <button onClick={() => setView('legal')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${view === 'legal' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                   <FileText className="w-5 h-5" /> Legal & Contracts
               </button>
               <button onClick={() => setView('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${view === 'settings' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                   <Settings className="w-5 h-5" /> Settings
               </button>
            </nav>
         </div>
         <div className="absolute bottom-0 w-full p-4 border-t border-white/10">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10">
               <LogOut className="w-5 h-5" /> Logout
            </button>
         </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-72 transition-all duration-300">
         {/* Header */}
         <header className="h-20 bg-slate-900/50 backdrop-blur-md border-b border-white/10 px-8 flex items-center justify-between sticky top-0 z-40">
            <div className="flex items-center gap-4">
               <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden text-white"><Menu className="w-6 h-6" /></button>
               <h1 className="text-xl font-bold text-white hidden sm:block">
                   {view === 'dashboard' ? 'Overview' : view.charAt(0).toUpperCase() + view.slice(1)}
               </h1>
            </div>
            <div className="flex items-center gap-6">
               <div className="hidden md:flex flex-col items-end">
                  <span className="text-sm font-bold text-white">{franchise.ownerName}</span>
                  <span className="text-xs text-gray-400">Partner Manager</span>
               </div>
               <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/20 overflow-hidden">
                  <img src={`https://ui-avatars.com/api/?name=${franchise.ownerName}&background=random`} alt="Profile" />
               </div>
            </div>
         </header>

         <main className="p-8">
            
            {/* VIEW: DASHBOARD */}
            {view === 'dashboard' && (
                <div className="space-y-8 animate-in fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-slate-800/50 border border-white/5 p-6 rounded-2xl">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400"><Users className="w-6 h-6" /></div>
                                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">+12%</span>
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-1">{franchise.studentsCount}</h3>
                            <p className="text-sm text-gray-400">Total Students</p>
                        </div>
                        <div className="bg-slate-800/50 border border-white/5 p-6 rounded-2xl">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-green-500/20 rounded-xl text-green-400"><DollarSign className="w-6 h-6" /></div>
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-1">{franchise.currency} {franchise.revenue.toLocaleString()}</h3>
                            <p className="text-sm text-gray-400">Total Revenue</p>
                        </div>
                        <div className="bg-slate-800/50 border border-white/5 p-6 rounded-2xl">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400"><Wallet className="w-6 h-6" /></div>
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-1">{franchise.currency} {franchise.walletBalance.toLocaleString()}</h3>
                            <p className="text-sm text-gray-400">Wallet Balance</p>
                        </div>
                        <div className="bg-slate-800/50 border border-white/5 p-6 rounded-2xl">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-orange-500/20 rounded-xl text-orange-400"><ShieldCheck className="w-6 h-6" /></div>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1">{franchise.accreditationType}</h3>
                            <p className="text-sm text-gray-400">Status: {franchise.status}</p>
                        </div>
                    </div>
                    
                    {/* Badge & Quick Actions */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1 bg-gradient-to-br from-slate-900 to-black border border-white/10 p-8 rounded-2xl flex flex-col items-center justify-center text-center">
                            <Badge level={franchise.badgeLevel || 'Gold'} className="mb-4" />
                            <h3 className="text-xl font-bold text-white mb-1">Accredited Partner</h3>
                            <p className="text-sm text-gray-400 mb-6">Current Standing: Excellent</p>
                            <button className="text-xs text-brand-neon hover:underline">View Compliance Report</button>
                        </div>

                        <div className="lg:col-span-2 bg-slate-800/30 border border-white/5 p-6 rounded-2xl">
                            <h3 className="text-lg font-bold text-white mb-4">Accreditation Benefits</h3>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-2 text-sm text-gray-300">
                                    <CheckCircle className="w-4 h-4 text-green-500" /> Issue Co-Branded Certificates
                                </li>
                                <li className="flex items-center gap-2 text-sm text-gray-300">
                                    <CheckCircle className="w-4 h-4 text-green-500" /> Access DSH Master Curriculum
                                </li>
                                <li className="flex items-center gap-2 text-sm text-gray-300">
                                    <CheckCircle className="w-4 h-4 text-green-500" /> Global Verification System
                                </li>
                                <li className="flex items-center gap-2 text-sm text-gray-300">
                                    <CheckCircle className="w-4 h-4 text-green-500" /> White-Label LMS Platform
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* VIEW: COURSE LIBRARY */}
            {view === 'courses' && (
                <div className="space-y-6 animate-in fade-in">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white">DSH Master Course Library</h2>
                        <p className="text-sm text-gray-400">Enable courses to offer at your institute.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {COURSES.map(course => {
                            const isEnabled = franchise.allowedCourses?.includes(course.id) || franchise.allowedCourses?.includes('all');
                            
                            return (
                                <div key={course.id} className={`bg-slate-900/50 border rounded-xl overflow-hidden transition-all ${isEnabled ? 'border-brand-neon/50 shadow-[0_0_15px_rgba(0,243,255,0.1)]' : 'border-white/5 opacity-70'}`}>
                                    <img src={course.image} alt={course.title} className="w-full h-32 object-cover grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all" />
                                    <div className="p-4">
                                        <h3 className="font-bold text-white mb-1 line-clamp-1">{course.title}</h3>
                                        <p className="text-xs text-gray-400 mb-4">{course.category}</p>
                                        <button 
                                            onClick={() => toggleCourse(course.id)}
                                            className={`w-full py-2 rounded-lg text-xs font-bold transition-colors ${isEnabled ? 'bg-brand-neon text-black' : 'bg-slate-800 text-gray-400 hover:text-white'}`}
                                        >
                                            {isEnabled ? 'Enabled' : 'Enable Course'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* VIEW: SETTINGS (White Label) */}
            {view === 'settings' && (
                <div className="max-w-2xl mx-auto animate-in fade-in">
                    <div className="glass p-8 rounded-2xl border border-white/10 space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                                <Palette className="w-6 h-6 text-purple-400" /> Branding & White-Label
                            </h2>
                            <p className="text-gray-400 text-sm">Customize how your dashboard and certificates appear.</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-300 mb-2">Institute Display Name</label>
                                <input 
                                    type="text" 
                                    value={displayName} 
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    className="w-full bg-slate-950 border border-white/10 rounded-lg p-3 text-white focus:border-brand-neon outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-300 mb-2">Logo URL</label>
                                <div className="flex gap-4">
                                    <input 
                                        type="text" 
                                        value={logoUrl} 
                                        onChange={(e) => setLogoUrl(e.target.value)}
                                        placeholder="https://your-website.com/logo.png"
                                        className="flex-1 bg-slate-950 border border-white/10 rounded-lg p-3 text-white focus:border-brand-neon outline-none"
                                    />
                                    {logoUrl && (
                                        <div className="w-12 h-12 bg-white rounded-lg p-1 flex items-center justify-center border border-white/20">
                                            <img src={logoUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">This logo will appear on your dashboard and certificates.</p>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-white/10 flex justify-end">
                            <button 
                                onClick={handleSaveSettings}
                                className="px-6 py-3 bg-brand-neon text-black font-bold rounded-xl hover:shadow-[0_0_15px_rgba(0,243,255,0.4)] flex items-center gap-2"
                            >
                                <Save className="w-4 h-4" /> Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* VIEW: LEGAL */}
            {view === 'legal' && (
                <div className="space-y-6 animate-in fade-in">
                    <h2 className="text-2xl font-bold text-white mb-6">Legal & Contracts</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { title: 'Accreditation Agreement', desc: 'Terms of partnership & branding.', link: '/en/legal/accreditation-agreement' },
                            { title: 'White-Label License', desc: 'Software usage rights.', link: '/en/legal/white-label-agreement' },
                            { title: 'NDA', desc: 'Non-Disclosure Agreement.', link: '/en/legal/nda' },
                        ].map((doc, i) => (
                            <div key={i} className="glass p-6 rounded-xl border border-white/5 flex flex-col justify-between h-48">
                                <div>
                                    <FileText className="w-8 h-8 text-gray-400 mb-4" />
                                    <h3 className="font-bold text-white mb-2">{doc.title}</h3>
                                    <p className="text-sm text-gray-400">{doc.desc}</p>
                                </div>
                                <Link to={doc.link} target="_blank" className="flex items-center gap-2 text-sm text-brand-neon font-bold hover:underline mt-4">
                                    View Document <ExternalLink className="w-3 h-3" />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* VIEW: STUDENTS (Placeholder) */}
            {view === 'students' && (
                <div className="text-center py-20 text-gray-500">
                    <Users className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p>Student Management Module</p>
                </div>
            )}

            {/* VIEW: CERTIFICATES (Placeholder) */}
            {view === 'certificates' && (
                <div className="text-center py-20 text-gray-500">
                    <Award className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p>Certificate Issuance Module</p>
                </div>
            )}

         </main>
      </div>
    </div>
  );
};

// Helper component for list items
const CheckCircle = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

export default FranchiseDashboard;
