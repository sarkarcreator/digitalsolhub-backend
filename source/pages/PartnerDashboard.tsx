
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Partner, Language } from '../types';
import SEO from '../components/SEO';
import { getPartnerBySlug } from '../utils/partnerManager';
import Logo from '../components/Logo';
import { 
  LayoutDashboard, Users, BookOpen, Settings, LogOut, 
  Award, Globe, Save, Palette, FileText, CheckCircle, PlusCircle, ExternalLink, ShieldCheck, Copy
} from 'lucide-react';

const PartnerDashboard: React.FC = () => {
  const { lang: paramLang, slug } = useParams<{ lang: string; slug: string }>();
  const lang = (Object.values(Language).includes(paramLang as Language)) ? (paramLang as Language) : Language.ENGLISH;
  
  const [partner, setPartner] = useState<Partner | null>(null);
  const [view, setView] = useState('overview');
  const [loading, setLoading] = useState(true);

  // Mock Certificates
  const [certs, setCerts] = useState([
      { id: 'CERT-001', student: 'Sarah Khan', course: 'Web Development', date: '2024-10-20', status: 'Active' },
      { id: 'CERT-002', student: 'Ahmed Ali', course: 'SEO Mastery', date: '2024-10-22', status: 'Active' }
  ]);

  useEffect(() => {
    if (slug) {
        // Simulate fetch
        setTimeout(() => {
            const data = getPartnerBySlug(slug);
            setPartner(data || null);
            setLoading(false);
        }, 500);
    }
  }, [slug]);

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading Portal...</div>;
  if (!partner) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Partner Not Found</div>;

  const verificationUrl = `https://digitalsolhub.com/verify/${partner.slug}/CERT-ID`;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex">
      <SEO 
        title={`${partner.name} | Partner Dashboard`} 
        description="Manage your institute." 
        lang={lang} 
      />

      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full z-20">
         <div className="h-20 flex items-center px-6 border-b border-white/10">
            {partner.logo ? (
                <img src={partner.logo} alt="Logo" loading="eager" className="h-8 object-contain" />
            ) : (
                <Logo className="w-8 h-8" withText={false} />
            )}
            <span className="ml-3 font-bold text-sm truncate">{partner.name}</span>
         </div>
         
         <nav className="flex-1 p-4 space-y-1">
            <button onClick={() => setView('overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${view === 'overview' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                <LayoutDashboard className="w-4 h-4" /> Overview
            </button>
            <button onClick={() => setView('certificates')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${view === 'certificates' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                <Award className="w-4 h-4" /> Certificates
            </button>
            <button onClick={() => setView('branding')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${view === 'branding' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                <Palette className="w-4 h-4" /> Branding
            </button>
            <button onClick={() => setView('students')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${view === 'students' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                <Users className="w-4 h-4" /> Students
            </button>
            <button onClick={() => setView('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${view === 'settings' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                <Settings className="w-4 h-4" /> Settings
            </button>
         </nav>

         <div className="p-4 border-t border-white/10">
             <div className="bg-slate-800 rounded-lg p-3 mb-4">
                 <p className="text-xs text-gray-400 mb-1">Your Verification URL</p>
                 <code className="text-[10px] text-blue-300 block bg-black/30 p-1 rounded mb-2 break-all">{verificationUrl}</code>
                 <button className="text-[10px] flex items-center gap-1 text-gray-300 hover:text-white"><Copy className="w-3 h-3"/> Copy Link</button>
             </div>
             <button className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300">
                 <LogOut className="w-4 h-4" /> Sign Out
             </button>
         </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
         
         <header className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 capitalize">{view}</h1>
                <p className="text-slate-500 text-sm">Welcome back, Admin</p>
            </div>
            <div className="flex items-center gap-4">
                <Link to={`/verify/${partner.slug}/preview`} target="_blank" className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-1">
                    <ExternalLink className="w-4 h-4" /> View Public Page
                </Link>
                <div className="w-10 h-10 rounded-full bg-slate-200 border border-slate-300 overflow-hidden">
                    <img src={`https://ui-avatars.com/api/?name=${partner.name}&background=random`} alt="Avatar" loading="eager" />
                </div>
            </div>
         </header>

         {view === 'overview' && (
             <div className="space-y-8 animate-in fade-in">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                         <div className="flex justify-between items-start mb-4">
                             <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Award className="w-6 h-6"/></div>
                             <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">+5 this week</span>
                         </div>
                         <h3 className="text-3xl font-bold text-slate-900 mb-1">{partner.stats.certificatesIssued}</h3>
                         <p className="text-sm text-slate-500">Certificates Issued</p>
                     </div>
                     <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                         <div className="flex justify-between items-start mb-4">
                             <div className="p-3 bg-purple-50 text-purple-600 rounded-lg"><Users className="w-6 h-6"/></div>
                         </div>
                         <h3 className="text-3xl font-bold text-slate-900 mb-1">{partner.stats.students}</h3>
                         <p className="text-sm text-slate-500">Active Students</p>
                     </div>
                     <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                         <div className="flex justify-between items-start mb-4">
                             <div className="p-3 bg-orange-50 text-orange-600 rounded-lg"><ShieldCheck className="w-6 h-6"/></div>
                         </div>
                         <h3 className="text-3xl font-bold text-slate-900 mb-1">{partner.plan}</h3>
                         <p className="text-sm text-slate-500">Current Plan</p>
                     </div>
                 </div>

                 {/* Recent Certs */}
                 <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                     <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                         <h3 className="font-bold text-slate-800">Recent Certificates</h3>
                         <button className="text-sm text-blue-600 font-medium hover:underline">View All</button>
                     </div>
                     <table className="w-full text-sm text-left">
                         <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                             <tr>
                                 <th className="px-6 py-3">ID</th>
                                 <th className="px-6 py-3">Student</th>
                                 <th className="px-6 py-3">Course</th>
                                 <th className="px-6 py-3">Date</th>
                                 <th className="px-6 py-3">Status</th>
                             </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-100">
                             {certs.map((c, i) => (
                                 <tr key={i} className="hover:bg-slate-50">
                                     <td className="px-6 py-4 font-mono text-xs">{c.id}</td>
                                     <td className="px-6 py-4 font-bold text-slate-900">{c.student}</td>
                                     <td className="px-6 py-4">{c.course}</td>
                                     <td className="px-6 py-4 text-slate-500">{c.date}</td>
                                     <td className="px-6 py-4">
                                         <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-bold">
                                             {c.status}
                                         </span>
                                     </td>
                                 </tr>
                             ))}
                         </tbody>
                     </table>
                 </div>
             </div>
         )}

         {view === 'branding' && (
             <div className="max-w-2xl bg-white p-8 rounded-xl border border-slate-200 shadow-sm animate-in fade-in">
                 <h2 className="text-xl font-bold text-slate-900 mb-6">Institute Branding</h2>
                 <div className="space-y-6">
                     <div>
                         <label className="block text-sm font-bold text-slate-700 mb-2">Logo URL</label>
                         <div className="flex gap-4">
                             <input type="text" defaultValue={partner.logo} className="flex-1 border border-slate-300 rounded-lg p-3 text-sm focus:border-blue-500 outline-none" />
                             <div className="w-12 h-12 border border-slate-200 rounded-lg p-1 flex items-center justify-center bg-slate-50">
                                 <img src={partner.logo} className="max-w-full max-h-full object-contain" />
                             </div>
                         </div>
                     </div>
                     <div>
                         <label className="block text-sm font-bold text-slate-700 mb-2">Primary Color</label>
                         <div className="flex gap-4 items-center">
                             <input type="color" defaultValue={partner.brandColor} className="w-12 h-12 p-1 rounded cursor-pointer border border-slate-300" />
                             <span className="text-sm font-mono bg-slate-100 px-3 py-1 rounded">{partner.brandColor}</span>
                         </div>
                     </div>
                     <div>
                         <label className="block text-sm font-bold text-slate-700 mb-2">Custom Subdomain</label>
                         <div className="flex items-center">
                             <span className="bg-slate-100 border border-slate-300 border-r-0 rounded-l-lg py-3 px-4 text-slate-500 text-sm">verify.</span>
                             <input type="text" defaultValue={partner.slug} className="flex-1 border border-slate-300 py-3 px-4 text-sm focus:border-blue-500 outline-none" />
                             <span className="bg-slate-100 border border-slate-300 border-l-0 rounded-r-lg py-3 px-4 text-slate-500 text-sm">.dsh.com</span>
                         </div>
                     </div>
                     <div className="pt-6 border-t border-slate-100 flex justify-end">
                         <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center gap-2">
                             <Save className="w-4 h-4" /> Save Changes
                         </button>
                     </div>
                 </div>
             </div>
         )}

         {view === 'certificates' && (
             <div className="animate-in fade-in">
                 <div className="flex justify-between items-center mb-6">
                     <h2 className="text-xl font-bold text-slate-900">Certificate Management</h2>
                     <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 flex items-center gap-2 text-sm">
                         <PlusCircle className="w-4 h-4" /> Issue New Certificate
                     </button>
                 </div>
                 <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500">
                     <FileText className="w-16 h-16 mx-auto mb-4 opacity-20" />
                     <p>Select "Issue New Certificate" to generate credentials for your students.</p>
                 </div>
             </div>
         )}

      </main>
    </div>
  );
};

export default PartnerDashboard;
