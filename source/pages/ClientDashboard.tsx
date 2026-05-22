import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Language } from '../types';
import { TRANSLATIONS, SERVICE_CATEGORIES } from '../constants';
import SEO from '../components/SEO';
import ClientSidebar from '../components/ClientSidebar';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { 
  Bell, Search, Menu, Activity, CheckCircle, 
  Clock, CreditCard, MessageSquare, Briefcase, PlusCircle, FileText, Save, Download, ArrowLeft, ShieldCheck, FolderOpen, Calendar
} from 'lucide-react';

const ClientDashboard: React.FC = () => {
  const { lang: paramLang } = useParams<{ lang: string }>();
  const lang = (Object.values(Language).includes(paramLang as Language)) ? (paramLang as Language) : Language.ENGLISH;
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const isRtl = lang === Language.URDU || lang === Language.ARABIC;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    document.body.className = 'bg-slate-950 font-sans text-white';
  }, [lang]);

  // Mock Data
  const client = {
    name: "Business Solutions Ltd",
    logo: "https://picsum.photos/200/200?random=client",
    plan: "Enterprise"
  };

  const services = [
    {
      id: 1,
      title: "E-Commerce Website",
      category: "Web Development",
      status: "Active",
      progress: 75,
      nextMilestone: "Payment Gateway",
      deadline: "Nov 15, 2024",
      description: "Comprehensive e-commerce platform development focusing on user experience, secure payment integration, and inventory management automation.",
      files: [
        { name: "Project_Requirements.pdf", date: "Oct 10, 2024", size: "1.2 MB" },
        { name: "UI_Design_Mockups.zip", date: "Oct 15, 2024", size: "45 MB" },
        { name: "Contract_Signed.pdf", date: "Oct 05, 2024", size: "0.8 MB" }
      ]
    },
    {
      id: 2,
      title: "SEO Optimization",
      category: "Digital Marketing",
      status: "In Progress",
      progress: 40,
      nextMilestone: "Content Strategy",
      deadline: "Dec 01, 2024",
      description: "On-page and off-page SEO optimization to improve organic search rankings, including keyword research, content optimization, and backlink strategy.",
      files: [
        { name: "SEO_Audit_Report.pdf", date: "Oct 20, 2024", size: "3.5 MB" },
        { name: "Keyword_Strategy.xlsx", date: "Oct 22, 2024", size: "0.5 MB" }
      ]
    },
    {
      id: 3,
      title: "Corporate Branding",
      category: "Graphic Design",
      status: "Completed",
      progress: 100,
      nextMilestone: "Project Delivered",
      deadline: "Oct 10, 2024",
      description: "Complete brand identity design including logo, color palette, typography, and brand guidelines document.",
      files: [
        { name: "Brand_Guidelines.pdf", date: "Oct 10, 2024", size: "12 MB" },
        { name: "Logo_Pack.zip", date: "Oct 09, 2024", size: "28 MB" }
      ]
    }
  ];

  const handleProjectClick = (project: any) => {
    setSelectedProject(project);
    setCurrentView('project-details');
  };

  const renderContent = () => {
     switch(currentView) {
        case 'services':
           return (
             <div className="space-y-6 animate-in fade-in">
                <div className="flex justify-between items-center">
                   <h2 className="text-2xl font-bold text-white">{TRANSLATIONS.cdash_projects[lang]}</h2>
                   <button onClick={() => setCurrentView('add-project')} className="bg-brand-neon text-black px-4 py-2 rounded-lg font-bold hover:shadow-[0_0_15px_rgba(0,243,255,0.4)] transition-all flex items-center gap-2">
                      <PlusCircle className="w-5 h-5" /> {TRANSLATIONS.cdash_create_new[lang]}
                   </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {services.map(service => (
                     <div 
                        key={service.id} 
                        onClick={() => handleProjectClick(service)}
                        className="glass p-6 rounded-2xl border border-white/5 hover:border-brand-neon/50 hover:bg-slate-900/80 transition-all group cursor-pointer relative overflow-hidden"
                     >
                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ArrowLeft className="w-5 h-5 text-brand-neon rotate-180" />
                        </div>
                        <div className="flex justify-between items-start mb-4">
                           <div className="p-3 bg-slate-800 rounded-xl text-brand-neon">
                              <Briefcase className="w-6 h-6" />
                           </div>
                           <span className={`px-2 py-1 text-xs rounded-full border font-bold uppercase ${
                               service.status === 'Active' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                               service.status === 'Completed' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                               'bg-orange-500/10 text-orange-400 border-orange-500/20'
                           }`}>
                               {service.status}
                           </span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-brand-neon transition-colors">{service.title}</h3>
                        <p className="text-gray-400 text-sm mb-6">{service.category}</p>
                        
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-gray-500 font-medium">
                               <span>Completion</span>
                               <span className="text-white">{service.progress}%</span>
                            </div>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                               <div className={`h-full rounded-full shadow-[0_0_10px_currentColor] transition-all duration-1000 ${
                                   service.progress === 100 ? 'bg-green-500 text-green-500' : 'bg-brand-neon text-brand-neon'
                               }`} style={{width: `${service.progress}%`}}></div>
                            </div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
           );

        case 'project-details':
            if (!selectedProject) return null;
            return (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                    {/* Navigation */}
                    <button 
                        onClick={() => setCurrentView('services')} 
                        className="text-gray-400 hover:text-white text-sm flex items-center gap-2 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 rtl:rotate-180" /> Back to Projects
                    </button>

                    {/* Header Card */}
                    <div className="glass p-8 rounded-3xl border border-white/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-neon/5 rounded-full blur-[100px] pointer-events-none"></div>
                        <div className="relative z-10 flex flex-col md:flex-row justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="text-3xl font-bold text-white">{selectedProject.title}</h1>
                                    <span className={`px-3 py-1 text-xs rounded-full border font-bold uppercase ${
                                        selectedProject.status === 'Active' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                        selectedProject.status === 'Completed' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                        'bg-orange-500/10 text-orange-400 border-orange-500/20'
                                    }`}>
                                        {selectedProject.status}
                                    </span>
                                </div>
                                <p className="text-gray-400 text-lg">{selectedProject.category}</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5 text-center min-w-[120px]">
                                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Deadline</p>
                                    <div className="flex items-center justify-center gap-1 text-white font-bold">
                                        <Calendar className="w-4 h-4 text-brand-neon" /> {selectedProject.deadline}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <div className="flex justify-between text-sm text-gray-400 mb-2">
                                <span>Project Progress</span>
                                <span className="text-white font-bold">{selectedProject.progress}%</span>
                            </div>
                            <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full rounded-full shadow-[0_0_15px_currentColor] transition-all duration-1000 ${
                                        selectedProject.progress === 100 ? 'bg-green-500 text-green-500' : 'bg-brand-neon text-brand-neon'
                                    }`} 
                                    style={{width: `${selectedProject.progress}%`}}
                                ></div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Details Column */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="glass p-6 rounded-2xl border border-white/5">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-purple-400" /> Description
                                </h3>
                                <p className="text-gray-300 leading-relaxed">
                                    {selectedProject.description}
                                </p>
                            </div>

                            <div className="glass p-6 rounded-2xl border border-white/5">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-orange-400" /> Next Milestone
                                </h3>
                                <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5 flex items-center justify-between">
                                    <div>
                                        <p className="text-white font-bold">{selectedProject.nextMilestone}</p>
                                        <p className="text-xs text-gray-500">Upcoming deliverable</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-400">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Files Column */}
                        <div className="lg:col-span-1">
                            <div className="glass p-6 rounded-2xl border border-white/5">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <FolderOpen className="w-5 h-5 text-blue-400" /> Project Files
                                </h3>
                                <div className="space-y-3">
                                    {selectedProject.files?.map((file: any, i: number) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-white/5 hover:bg-white/5 transition-colors group">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="p-2 bg-slate-800 rounded-lg text-brand-neon">
                                                    <FileText className="w-4 h-4" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm text-white font-medium truncate">{file.name}</p>
                                                    <p className="text-xs text-gray-500">{file.size} • {file.date}</p>
                                                </div>
                                            </div>
                                            <button className="p-2 text-gray-400 hover:text-brand-neon rounded-lg transition-colors">
                                                <Download className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <button className="w-full mt-6 py-2 border border-white/10 rounded-lg text-sm font-bold text-gray-300 hover:bg-white/5 transition-all">
                                    View All Files
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );

        case 'status':
            return (
                <div className="space-y-6 animate-in fade-in">
                    <h2 className="text-2xl font-bold text-white">{TRANSLATIONS.cdash_timeline[lang]}</h2>
                    <div className="glass p-8 rounded-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-neon/5 rounded-full blur-3xl"></div>
                        <div className="space-y-8 relative z-10">
                            {services.map(svc => (
                                <div key={svc.id} className="border-l-2 border-slate-800 pl-6 relative">
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 bg-slate-950 border-2 border-brand-neon rounded-full"></div>
                                    <h3 className="text-lg font-bold text-white mb-2">{svc.title}</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
                                            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Status</p>
                                            <p className="text-green-400 font-bold">{svc.status}</p>
                                        </div>
                                        <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
                                            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Next Milestone</p>
                                            <p className="text-white">{svc.nextMilestone}</p>
                                        </div>
                                        <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
                                            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Deadline</p>
                                            <p className="text-white">{svc.deadline}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );

        case 'downloads':
           return (
             <div className="space-y-6 animate-in fade-in">
                <h2 className="text-2xl font-bold text-white">{TRANSLATIONS.cdash_files[lang]}</h2>
                <div className="grid gap-4">
                   {['Contract_Agreement.pdf', 'Website_Assets.zip', 'SEO_Report_Oct.pdf', 'Logo_Source_Files.ai'].map((file, i) => (
                      <div key={i} className="flex items-center justify-between p-5 bg-slate-900/50 rounded-xl border border-white/5 hover:bg-white/5 transition-colors group">
                         <div className="flex items-center gap-4">
                            <div className="p-3 bg-slate-800 rounded-lg text-brand-neon group-hover:text-white transition-colors">
                               <FileText className="w-6 h-6" />
                            </div>
                            <div>
                                <span className="block text-white font-medium mb-1">{file}</span>
                                <span className="text-xs text-gray-500">2.4 MB • Oct 24, 2024</span>
                            </div>
                         </div>
                         <button className="p-2 text-gray-400 hover:text-brand-neon hover:bg-brand-neon/10 rounded-lg transition-all">
                            <Download className="w-5 h-5" />
                         </button>
                      </div>
                   ))}
                </div>
             </div>
           );
         
         case 'payments':
            return (
               <div className="space-y-6 animate-in fade-in">
                  <div className="flex justify-between items-center mb-2">
                     <h2 className="text-2xl font-bold text-white">{TRANSLATIONS.cdash_invoices[lang]}</h2>
                     <span className="text-xs text-gray-500 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-green-500" /> Authorized by Sarkar Azeem (CEO)
                     </span>
                  </div>
                  
                  <div className="glass rounded-2xl overflow-hidden border border-white/5">
                     <table className="w-full text-left text-gray-400">
                        <thead className="bg-slate-900 text-gray-300 uppercase text-xs font-bold tracking-wider">
                           <tr>
                              <th className="p-5">Invoice ID</th>
                              <th className="p-5">Service</th>
                              <th className="p-5">Issue Date</th>
                              <th className="p-5">Due Date</th>
                              <th className="p-5">Amount</th>
                              <th className="p-5">Status</th>
                              <th className="p-5 text-right">Action</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                           {[
                             { id: "INV-001", service: "Web Development", date: "Oct 24", due: "Oct 24", amount: "$500.00", status: "Paid" },
                             { id: "INV-002", service: "SEO Services", date: "Oct 20", due: "Nov 01", amount: "$1,250.00", status: "Unpaid" }
                           ].map((inv, i) => (
                              <tr key={i} className="hover:bg-white/5 transition-colors">
                                 <td className="p-5 font-bold text-white font-mono text-sm">{inv.id}</td>
                                 <td className="p-5 text-white">{inv.service}</td>
                                 <td className="p-5 text-sm">{inv.date}</td>
                                 <td className="p-5 text-sm text-brand-neon">{inv.due}</td>
                                 <td className="p-5 text-white font-bold">{inv.amount}</td>
                                 <td className="p-5"><span className={`px-2 py-1 rounded text-xs font-bold uppercase ${inv.status === 'Paid' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>{inv.status}</span></td>
                                 <td className="p-5 text-right">
                                    <button className="text-xs text-brand-neon hover:text-white underline transition-colors flex items-center justify-end gap-1 w-full">
                                       <Download className="w-3 h-3" /> Download
                                    </button>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
                  
                  {/* Payment Info Note */}
                  <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5 text-sm text-gray-400 flex items-center gap-3">
                     <CreditCard className="w-5 h-5 text-brand-neon" />
                     <p>Accepted: Bank Transfer, JazzCash/EasyPaisa, Cards, Crypto. Please upload payment proof in Messages.</p>
                  </div>
               </div>
            );

         case 'messages':
            return (
               <div className="h-[calc(100vh-140px)] flex flex-col glass rounded-2xl overflow-hidden animate-in fade-in border border-white/5">
                  <div className="p-4 border-b border-white/10 bg-slate-900/50 flex justify-between items-center">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">PM</div>
                        <div>
                            <h3 className="font-bold text-white text-sm">Project Manager</h3>
                            <p className="text-xs text-green-400 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span> Online</p>
                        </div>
                     </div>
                  </div>
                  <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar">
                     <div className="flex gap-3">
                        <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-none text-sm text-gray-300 max-w-[80%] border border-white/5">
                           Hello! The dashboard designs are ready for review.
                        </div>
                     </div>
                     <div className="flex gap-3 flex-row-reverse">
                        <div className="bg-brand-neon text-black p-3 rounded-2xl rounded-tr-none text-sm font-medium max-w-[80%] shadow-lg shadow-brand-neon/20">
                           Great! I'll take a look shortly.
                        </div>
                     </div>
                  </div>
                  <div className="p-4 border-t border-white/10 bg-slate-900/50 flex gap-2">
                     <input type="text" placeholder={TRANSLATIONS.send_message[lang]} className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-neon transition-all" />
                     <button className="p-3 bg-brand-neon text-black rounded-xl hover:bg-cyan-400 transition-colors shadow-lg shadow-brand-neon/20">
                        <MessageSquare className="w-5 h-5" />
                     </button>
                  </div>
               </div>
            );

         case 'add-project':
            return (
               <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in">
                  <button onClick={() => setCurrentView('services')} className="text-gray-400 hover:text-white text-sm mb-4 flex items-center gap-2">
                     <ArrowLeft className="w-4 h-4 rtl:rotate-180" /> Back to Services
                  </button>
                  <h2 className="text-2xl font-bold text-white">{TRANSLATIONS.cdash_create_new[lang]}</h2>
                  <form className="glass p-8 rounded-2xl space-y-6 border border-white/10">
                     <div>
                        <label className="block text-sm text-gray-400 mb-2">{TRANSLATIONS.form_category[lang]}</label>
                        <select className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-brand-neon transition-colors relative z-10">
                           <option value="">Select Service</option>
                           {SERVICE_CATEGORIES.map(c => (
                              <option key={c.id} value={c.id}>{c.title[lang]}</option>
                           ))}
                        </select>
                     </div>
                     <div>
                        <label className="block text-sm text-gray-400 mb-2">Project Name</label>
                        <input type="text" className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-brand-neon transition-colors" placeholder="e.g. Corporate Website Redesign" />
                     </div>
                     <div>
                        <label className="block text-sm text-gray-400 mb-2">{TRANSLATIONS.form_details[lang]}</label>
                        <textarea rows={4} className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-brand-neon transition-colors" placeholder="Describe your project requirements..."></textarea>
                     </div>
                     <button type="button" onClick={() => setCurrentView('services')} className="w-full py-3 bg-brand-neon text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] transition-all">
                        Submit Request
                     </button>
                  </form>
               </div>
            );

         default: 
            return (
               <div className="space-y-8 animate-in fade-in">
                  <div className="rounded-3xl bg-gradient-to-r from-purple-900 to-slate-900 p-8 border border-white/10 relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px]"></div>
                     <div className="relative z-10">
                        <h1 className="text-3xl font-bold text-white mb-2">{TRANSLATIONS.dash_welcome[lang]}</h1>
                        <p className="text-purple-200">You have 2 active projects and 1 pending invoice.</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                     {[
                        { label: TRANSLATIONS.cdash_active_orders[lang], val: "02", icon: Activity, color: "text-brand-neon" },
                        { label: TRANSLATIONS.cdash_pending_pay[lang], val: "$1,250", icon: Clock, color: "text-orange-400" },
                        { label: TRANSLATIONS.cdash_completed_proj[lang], val: "12", icon: CheckCircle, color: "text-green-400" }
                     ].map((stat, i) => (
                        <div key={i} className="glass p-6 rounded-2xl border border-white/5">
                           <div className="flex justify-between items-start mb-4">
                              <div className="p-3 bg-slate-800 rounded-xl">
                                 <stat.icon className={`w-6 h-6 ${stat.color}`} />
                              </div>
                           </div>
                           <h3 className="text-3xl font-bold text-white mb-1">{stat.val}</h3>
                           <p className="text-sm text-gray-400 uppercase tracking-wider">{stat.label}</p>
                        </div>
                     ))}
                  </div>
               </div>
            );
     }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-white selection:bg-brand-neon/30">
      <SEO 
        title={`${TRANSLATIONS.dashboard[lang]} | Client Portal`} 
        description="Manage your services, ads, and payments." 
        lang={lang} 
      />

      <ClientSidebar 
        lang={lang} 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        currentView={currentView}
        onNavigate={setCurrentView}
      />

      {/* Main Content */}
      <div className="lg:pl-72 lg:rtl:pl-0 lg:rtl:pr-72 transition-all duration-300">
        
        {/* Header - Dark & Glass */}
        <header className="sticky top-0 z-30 h-20 bg-slate-900/80 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden sm:flex items-center relative group">
              <Search className="absolute left-3 w-4 h-4 text-gray-500 rtl:right-3 rtl:left-auto group-focus-within:text-brand-neon transition-colors" />
              <input 
                type="text" 
                placeholder={TRANSLATIONS.search[lang]} 
                className="bg-slate-950 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-brand-neon/50 w-80 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <LanguageSwitcher currentLang={lang} />
            <button 
              onClick={() => setCurrentView('messages')}
              className="relative p-2 text-gray-400 hover:text-brand-neon transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-brand-neon rounded-full shadow-[0_0_8px_#00f3ff]"></span>
            </button>
            <div 
              onClick={() => setCurrentView('profile')}
              className="flex items-center gap-3 pl-4 border-l border-white/10 rtl:pl-0 rtl:pr-4 rtl:border-l-0 rtl:border-r cursor-pointer hover:opacity-80 transition-opacity"
            >
              <img src={client.logo} alt="Profile" className="w-9 h-9 rounded-lg border border-white/10 object-cover" />
              <div className="hidden md:block text-sm">
                <p className="font-bold text-white leading-none mb-1">{client.name}</p>
                <p className="text-[10px] text-brand-neon uppercase tracking-widest font-semibold">{client.plan}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-4 sm:p-8 space-y-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default ClientDashboard;