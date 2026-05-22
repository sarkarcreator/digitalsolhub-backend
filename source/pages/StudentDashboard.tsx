
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Language, CertificateData } from '../types';
import { TRANSLATIONS, COURSES, SOFT_SKILLS_MODULE } from '../constants';
import SEO from '../components/SEO';
import DashboardSidebar from '../components/DashboardSidebar';
import LanguageSwitcher from '../components/LanguageSwitcher';
import StudentAssistant from '../components/StudentAssistant';
import Certificate from '../components/Certificate';
import LinkedInShareModal from '../components/LinkedInShareModal';
import SkillBadgeCard from '../components/SkillBadgeCard';
import { QRCodeSVG } from 'qrcode.react';
import { getAllCertificates, issueCertificate } from '../utils/certificateManager';
import { getStudentBadges } from '../utils/badgeManager';
import { requestAttestation, getAttestationByCertId } from '../utils/attestationManager';
import { sendNotifications } from '../utils/notifications';
import { 
  Bell, Search, Menu, PlayCircle, FileText, 
  Award, CheckCircle, Clock, 
  BookOpen, Mic, Brain, X, Printer, Share2, Linkedin, ShieldCheck, Database, Zap, FileBadge, Download
} from 'lucide-react';

const StudentDashboard: React.FC = () => {
  const { lang: paramLang } = useParams<{ lang: string }>();
  const lang = (Object.values(Language).includes(paramLang as Language)) ? (paramLang as Language) : Language.ENGLISH;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  
  const [isVoiceBotOpen, setIsVoiceBotOpen] = useState(false);
  const [viewCertificate, setViewCertificate] = useState<any | null>(null);
  const [shareCertificate, setShareCertificate] = useState<any | null>(null); 
  const certificateRef = useRef<HTMLDivElement>(null);
  const [myCertificates, setMyCertificates] = useState<any[]>([]);
  const [myBadges, setMyBadges] = useState<any[]>([]);

  // Simulate Enrolled Courses mapped from Global Data
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const isRtl = lang === Language.URDU || lang === Language.ARABIC;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    document.body.className = 'bg-slate-950 font-sans text-white';
    
    loadCertificates();
    loadBadges();
    
    const mockEnrollment = COURSES.slice(0, 3).map(course => ({
       ...course,
       progress: Math.floor(Math.random() * 100), // Random progress
       status: 'Active'
    }));
    setEnrolledCourses(mockEnrollment);

  }, [lang]);

  const loadCertificates = () => {
    const allCerts = getAllCertificates();
    const studentCerts = allCerts.filter(c => c.studentName === 'Ali Ahmed').map(cert => {
        const attestation = getAttestationByCertId(cert.id);
        return { ...cert, attestation };
    });
    setMyCertificates(studentCerts);
  };

  const loadBadges = () => {
    const badges = getStudentBadges('Ali Ahmed');
    setMyBadges(badges);
  };

  const student = {
    name: "Ali Ahmed",
    email: "ali.ahmed@example.com",
    image: "https://picsum.photos/200/200?random=student",
    id: "ST-2024-882"
  };

  const handleRequestAttestation = (cert: CertificateData) => {
      if (!cert.attestation) {
          requestAttestation(cert.id, cert.studentName, cert.courseName, 'Academy');
          alert("Attestation Request Submitted! Admin will review shortly.");
          loadCertificates(); 
      }
  };

  const handleShareProgress = (courseName: string, progress: number) => {
   const text = `I'm making great progress in the ${courseName} at Digital Solutions Hub! 🏆\n\n${progress}% Completed.`;
    const linkedinUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text)}`;
    window.open(linkedinUrl, '_blank');
  };

  const handleCompleteCourse = async (courseId: string, courseName: string) => {
    // 1. Update Course Progress locally
    setEnrolledCourses(prev => prev.map(c => c.id === courseId ? { ...c, progress: 100, status: 'Completed' } : c));
    
    // 2. Auto-Issue Certificate
    const newCert = issueCertificate(student.name, courseName);
    
    // 3. Trigger Email Notification (Simulation)
    await sendNotifications('CERTIFICATE_ISSUED', {
        name: student.name,
        email: student.email,
        details: `${courseName} (ID: ${newCert.id})`
    });

    alert(`Congratulations! You have completed ${courseName}. Certificate has been issued and emailed.`);

    // 4. Refresh Dashboard
    loadCertificates();
    setCurrentView('certificates');
  };

  const handleDownloadCertificate = () => {
    // Uses window.print() but the CSS will hide everything else due to @media print
    window.print();
  };
  
  const openLinkedInShare = (cert: any) => {
    const courseDetails = COURSES.find(c => c.title === cert.courseName);
    const skills = courseDetails?.learningOutcomes || ['Digital Skills', 'Professional Development'];
    setShareCertificate({ ...cert, skills });
  };

  const renderContent = () => {
    switch(currentView) {
      case 'certificates':
         return (
            <div className="space-y-8 animate-in fade-in">
               <div className="space-y-6">
                   <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                      <Award className="w-6 h-6 text-gold-500" />
                      {TRANSLATIONS.dash_certificates[lang]}
                   </h2>
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {myCertificates.length > 0 ? myCertificates.map(cert => (
                         <div key={cert.id} className={`glass p-1 rounded-2xl relative group overflow-hidden border border-white/10 ${cert.status === 'Approved' ? 'hover:border-gold-500/30' : 'opacity-70'}`}>
                            <div className="bg-slate-950 rounded-xl p-6 relative z-10 h-full flex flex-col justify-between">
                               
                               <div className="absolute top-0 right-0 flex">
                                   {cert.blockchain && (
                                       <div className="bg-green-900/80 backdrop-blur border-b border-l border-green-500/30 px-3 py-1 rounded-bl-xl flex items-center gap-1.5">
                                           <Database className="w-3 h-3 text-green-400" />
                                           <span className="text-[10px] font-bold text-green-100 uppercase tracking-wide">On-Chain</span>
                                       </div>
                                   )}
                                   {cert.attestation && cert.attestation.status === 'Issued' && (
                                       <div className="bg-blue-900/80 backdrop-blur border-b border-l border-blue-500/30 px-3 py-1 rounded-bl-xl flex items-center gap-1.5 ml-[-1px]">
                                           <FileBadge className="w-3 h-3 text-blue-400" />
                                           <span className="text-[10px] font-bold text-blue-100 uppercase tracking-wide">Attested</span>
                                       </div>
                                   )}
                               </div>
                               
                               <div className="flex justify-between items-start mb-6">
                                  <div className="flex items-center gap-4">
                                     <div className="p-3 bg-gradient-to-br from-gold-400 to-yellow-600 rounded-full shadow-lg shadow-gold-500/20">
                                        <Award className="w-8 h-8 text-black" />
                                     </div>
                                     <div>
                                        <h3 className="text-lg font-bold text-white leading-tight">{cert.courseName}</h3>
                                        <p className="text-xs text-gold-500 font-mono mt-1">{cert.id}</p>
                                     </div>
                                  </div>
                                  {cert.status === 'Approved' && (
                                     <div className="bg-white p-1 rounded">
                                        <QRCodeSVG value={`https://digitalsolhub.com/verify/${cert.id}`} size={40} />
                                     </div>
                                  )}
                               </div>

                               <div className="mb-4">
                                   {!cert.attestation ? (
                                       <button 
                                          onClick={() => handleRequestAttestation(cert)}
                                          className="w-full py-2 bg-slate-900 border border-white/10 rounded-lg text-xs font-bold text-gray-400 hover:text-white hover:border-gold-500/50 transition-all flex items-center justify-center gap-2"
                                       >
                                           <ShieldCheck className="w-3 h-3" /> Request Official Attestation
                                       </button>
                                   ) : (
                                       <div className={`p-2 rounded-lg border text-xs flex items-center justify-between ${
                                           cert.attestation.status === 'Issued' ? 'bg-blue-500/10 border-blue-500/30 text-blue-300' : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300'
                                       }`}>
                                           <span className="font-bold flex items-center gap-2">
                                               {cert.attestation.status === 'Issued' ? <CheckCircle className="w-3 h-3"/> : <Clock className="w-3 h-3"/>}
                                               Attestation: {cert.attestation.status}
                                           </span>
                                           {cert.attestation.status === 'Issued' && (
                                               <a href={`/#/verify/attestation/${cert.attestation.id}`} target="_blank" className="underline hover:text-white">View Record</a>
                                           )}
                                       </div>
                                   )}
                               </div>

                               <div className="grid grid-cols-2 gap-3 mt-auto">
                                     <button 
                                        onClick={() => setViewCertificate(cert)}
                                        className="col-span-1 py-2.5 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-700 transition-all flex items-center justify-center gap-2 border border-white/10"
                                     >
                                        <Award className="w-4 h-4" /> View
                                     </button>
                                     <button 
                                        onClick={() => openLinkedInShare(cert)}
                                        className="col-span-1 py-2.5 bg-[#0077b5] text-white font-bold rounded-lg hover:bg-[#006396] transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/20"
                                     >
                                        <Linkedin className="w-4 h-4" /> Share
                                     </button>
                               </div>
                            </div>
                         </div>
                      )) : (
                         <div className="col-span-2 text-center text-gray-500 py-10 border border-dashed border-white/10 rounded-xl">No Certificates Yet</div>
                      )}
                   </div>
               </div>

               <div className="pt-8 border-t border-white/10">
                   <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                      <Zap className="w-6 h-6 text-brand-neon" />
                      {TRANSLATIONS.skill_badges[lang]}
                   </h2>
                   
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {myBadges.map((badge) => (
                         <SkillBadgeCard key={badge.id} badge={badge} lang={lang} />
                      ))}
                      {myBadges.length === 0 && (
                         <div className="col-span-4 text-center py-10 bg-slate-900/50 rounded-xl border border-white/5">
                            <Zap className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                            <p className="text-gray-500">Complete modules to earn verified skill badges.</p>
                         </div>
                      )}
                   </div>
               </div>
            </div>
         );

      case 'courses':
        return (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
               <BookOpen className="w-6 h-6 text-brand-neon" />
               {TRANSLATIONS.dash_my_courses[lang]}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {enrolledCourses.map(course => {
                 const progress = course.progress || 0;
                 const status = progress === 100 ? 'Completed' : 'Active';

                 return (
                 <div key={course.id} className="glass p-4 rounded-2xl group hover:border-brand-neon/30 transition-all flex flex-col h-full border border-white/5">
                    <div className="relative h-40 rounded-xl overflow-hidden mb-4 cursor-pointer" onClick={() => navigate(`/${lang}/course/${course.id}`)}>
                       <img src={course.image} alt={course.title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                       <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <PlayCircle className="w-12 h-12 text-white" />
                       </div>
                       <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-bold ${status === 'Completed' ? 'bg-green-500 text-white' : 'bg-brand-neon text-black'}`}>
                          {status}
                       </div>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{course.title}</h3>
                    <p className="text-xs text-gray-400 mb-3">Instructor: {course.instructor?.name}</p>
                    
                    <div className="w-full bg-slate-800 rounded-full h-1.5 mb-2">
                       <div className={`h-full rounded-full ${status === 'Completed' ? 'bg-green-500' : 'bg-brand-neon'}`} style={{ width: `${progress}%` }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mb-4">
                       <span>{progress}% Complete</span>
                       <span>{(course.learningOutcomes?.length || 0) * 3} Lessons</span>
                    </div>

                    <div className="mt-auto flex flex-col gap-2">
                        {status !== 'Completed' ? (
                           <>
                              <button onClick={() => navigate(`/${lang}/course/${course.id}`)} className="w-full py-2 rounded-lg text-sm font-bold bg-brand-neon text-black hover:shadow-lg hover:shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all">
                                 <PlayCircle className="w-4 h-4" /> Continue Learning
                              </button>
                              <div className="flex gap-2">
                                <button onClick={() => handleCompleteCourse(course.id, course.title)} className="flex-1 py-2 rounded-lg text-xs font-bold border border-green-500/50 text-green-400 hover:bg-green-500/10 transition-all">
                                   Mark as Completed
                                </button>
                                <button onClick={() => handleShareProgress(course.title, progress)} className="px-3 py-2 rounded-lg border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 transition-all">
                                   <Share2 className="w-4 h-4" />
                                </button>
                              </div>
                           </>
                        ) : (
                           <div className="flex gap-2">
                               <button onClick={() => navigate(`/${lang}/course/${course.id}`)} className="flex-1 py-2 rounded-lg text-sm font-bold bg-slate-800 text-green-400 hover:bg-slate-700 flex items-center justify-center gap-2 transition-all">
                                  <CheckCircle className="w-4 h-4" /> Review
                               </button>
                               <button onClick={() => handleShareProgress(course.title, 100)} className="px-3 py-2 rounded-lg bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 transition-all">
                                   <Share2 className="w-4 h-4" />
                                </button>
                           </div>
                        )}
                    </div>
                 </div>
               )})}
            </div>
            
            {/* Soft Skills Quick Access */}
            <div className="mt-12 bg-slate-900/50 border border-white/5 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2"><Brain className="w-5 h-5 text-purple-400"/> Soft Skills Library</h3>
                    <button onClick={() => navigate(`/${lang}/academy`)} className="text-sm text-purple-400 hover:underline">View Full Library</button>
                </div>
                <div className="flex flex-wrap gap-3">
                    {SOFT_SKILLS_MODULE.skills.slice(0, 8).map((skill, i) => (
                        <span key={i} className="px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-300 text-xs border border-purple-500/20">
                            {skill}
                        </span>
                    ))}
                    <span className="px-3 py-1.5 rounded-lg bg-slate-800 text-gray-400 text-xs">+{SOFT_SKILLS_MODULE.skills.length - 8} More</span>
                </div>
            </div>
          </div>
        );

      case 'dashboard':
      default:
        return (
          <div className="space-y-8 animate-in fade-in">
             <div className="relative rounded-3xl bg-gradient-to-r from-brand-blue to-indigo-900 p-8 overflow-hidden shadow-2xl border border-white/10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-neon/20 rounded-full blur-[80px]"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                   <div>
                      <h1 className="text-3xl font-bold text-white mb-2">{TRANSLATIONS.dash_welcome[lang]} <span className="text-brand-neon">{student.name}</span></h1>
                      <p className="text-blue-100">Welcome to DSH Academy. Your journey to mastery begins here.</p>
                   </div>
                   <button onClick={() => setCurrentView('courses')} className="px-6 py-3 bg-white text-blue-900 font-bold rounded-xl shadow-lg hover:shadow-cyan-500/20 transition-all flex items-center gap-2">
                      <PlayCircle className="w-5 h-5" /> {TRANSLATIONS.dash_start_lesson[lang]}
                   </button>
                </div>
             </div>
             
             {/* Stats */}
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                   { label: "Active Courses", val: enrolledCourses.filter(c => c.status === 'Active').length.toString(), icon: BookOpen, color: "text-blue-400", bg: "bg-blue-500/10" },
                   { label: "Completed", val: enrolledCourses.filter(c => c.status === 'Completed').length.toString(), icon: CheckCircle, color: "text-green-400", bg: "bg-green-500/10" },
                   { label: "Certificates", val: myCertificates.length.toString(), icon: Award, color: "text-gold-500", bg: "bg-gold-500/10" },
                   { label: "Attestations", val: myCertificates.filter(c => c.attestation?.status === 'Issued').length.toString(), icon: FileBadge, color: "text-brand-neon", bg: "bg-cyan-500/10" }
                ].map((stat, i) => (
                   <div key={i} className="glass p-4 rounded-xl border border-white/5 hover:bg-white/5 transition-colors flex flex-col justify-between h-32">
                      <div className={`p-2 rounded-lg w-fit ${stat.bg}`}>
                         <stat.icon className={`w-5 h-5 ${stat.color}`} />
                      </div>
                      <div>
                         <div className="text-2xl font-bold text-white">{stat.val}</div>
                         <div className="text-xs text-gray-400 uppercase tracking-wider">{stat.label}</div>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-brand-neon/30">
      <SEO 
        title={`${TRANSLATIONS.dashboard[lang]} | Student Portal`} 
        description="Access your courses, worksheets, and certificates." 
        lang={lang} 
      />

      <DashboardSidebar 
        lang={lang} 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        currentView={currentView}
        onNavigate={setCurrentView}
      />

      <div className="lg:pl-72 lg:rtl:pl-0 lg:rtl:pr-72 transition-all duration-300">
        <header className="sticky top-0 z-30 h-20 bg-slate-900/80 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5"><Menu className="w-6 h-6" /></button>
            <div className="hidden sm:flex items-center relative group">
              <Search className="absolute left-3 w-4 h-4 text-gray-500 rtl:right-3 rtl:left-auto group-focus-within:text-brand-neon transition-colors" />
              <input type="text" placeholder={TRANSLATIONS.search[lang]} className="bg-slate-950 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-brand-neon/50 w-64 transition-all" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher currentLang={lang} />
            <button onClick={() => setIsVoiceBotOpen(true)} className="p-2 text-gray-400 hover:text-white hover:bg-purple-600/20 rounded-lg transition-colors" title="AI Tutor"><Mic className="w-5 h-5 text-purple-400" /></button>
            <button onClick={() => setCurrentView('announcements')} className="relative p-2 text-gray-400 hover:text-brand-neon transition-colors"><Bell className="w-5 h-5" /></button>
            <div onClick={() => setCurrentView('profile')} className="flex items-center gap-3 pl-4 border-l border-white/10 rtl:pl-0 rtl:pr-4 rtl:border-l-0 rtl:border-r cursor-pointer hover:opacity-80 transition-opacity">
              <img src={student.image} alt="Profile" loading="eager" className="w-9 h-9 rounded-lg border border-white/10 object-cover" />
              <div className="hidden md:block text-sm"><p className="font-bold text-white leading-tight">{student.name}</p><p className="text-[10px] text-brand-neon uppercase tracking-widest font-semibold">{student.id}</p></div>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-8">
          {renderContent()}
        </main>
      </div>

      <StudentAssistant lang={lang} studentName={student.name} courses={enrolledCourses.map(c => ({ name: c.title, progress: c.progress || 0 }))} isOpenExternal={isVoiceBotOpen} setIsOpenExternal={setIsVoiceBotOpen} />

      {viewCertificate && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-auto">
           {/* Certificate Container with ID for Print Scoping if needed */}
           <div id="certificate-container" className="relative w-full max-w-[1200px]">
              <div className="flex justify-between items-center mb-4 text-white print:hidden">
                 <h2 className="text-xl font-bold flex items-center gap-2"><Award className="w-6 h-6 text-gold-500" /> Certificate Preview</h2>
                 <div className="flex items-center gap-3">
                    <button onClick={handleDownloadCertificate} className="bg-white text-black px-4 py-2 rounded-lg font-bold hover:bg-gray-200 transition-colors flex items-center gap-2"><Printer className="w-4 h-4" /> Download PDF / Print</button>
                    <button onClick={() => setViewCertificate(null)} className="bg-slate-800 text-white p-2 rounded-lg hover:bg-slate-700 transition-colors"><X className="w-5 h-5" /></button>
                 </div>
              </div>
              <div className="overflow-auto rounded-lg shadow-2xl border border-white/10 print:border-0 print:shadow-none print:w-full">
                 <Certificate 
                    ref={certificateRef}
                    studentName={student.name}
                    courseName={viewCertificate.courseName}
                    completionDate={viewCertificate.issueDate}
                    certificateId={viewCertificate.id}
                    attestation={viewCertificate.attestation} // Pass attestation data
                    lang={lang}
                 />
              </div>
           </div>
        </div>
      )}

      {shareCertificate && (
        <LinkedInShareModal isOpen={true} onClose={() => setShareCertificate(null)} studentName={shareCertificate.studentName} courseName={shareCertificate.courseName} certificateId={shareCertificate.id} skills={shareCertificate.skills || []} lang={lang} />
      )}
    </div>
  );
};

export default StudentDashboard;
