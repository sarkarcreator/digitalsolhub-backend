import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Language, Lead, LeadStatus, Franchise, BlockchainNetwork, CertificateData, AttestationRecord } from '../types';
import { TRANSLATIONS } from '../constants';
import SEO from '../components/SEO';
import AdminSidebar from '../components/AdminSidebar';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { getAllCertificates, updateCertificateStatus, attachBlockchainRecord } from '../utils/certificateManager';
import { getAllLeads, updateLeadStatus } from '../utils/crmManager';
import { getAllFranchises, updateFranchiseStatus } from '../utils/franchiseManager';
import { getAllAttestations, updateAttestationStatus } from '../utils/attestationManager';
import { mintCertificateOnChain } from '../utils/blockchainManager';
import { createAdminStudent, fetchAdminStudents, type AdminStudentLead } from '../utils/api';
import { 
  Menu, Users, Briefcase, DollarSign, 
  CheckCircle, XCircle, Clock, ShieldOff, Award, Shield,
  Globe, BarChart3, Target, GitBranch, TrendingUp, Laptop, Loader2, Link as LinkIcon, Database, Presentation, ChevronLeft, ChevronRight, AlertTriangle, FileBadge
} from 'lucide-react';

const AdminDashboard = () => {
  const { lang: paramLang } = useParams<{ lang: string }>();
  const lang = (Object.values(Language).includes(paramLang as Language)) ? (paramLang as Language) : Language.ENGLISH;
  const navigate = useNavigate();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState('overview');
  
  // Data States
  const [certificates, setCertificates] = useState<CertificateData[]>([]);
  const [attestations, setAttestations] = useState<AttestationRecord[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [franchises, setFranchises] = useState<Franchise[]>([]);
  const [students, setStudents] = useState<AdminStudentLead[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentsError, setStudentsError] = useState('');
  const [studentForm, setStudentForm] = useState({
    name: '',
    email: '',
    phone: '',
    course: 'Web Development'
  });
  
  // Blockchain State
  const [mintingId, setMintingId] = useState<string | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<BlockchainNetwork>('Polygon');

  useEffect(() => {
    const isRtl = lang === Language.URDU || lang === Language.ARABIC;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    document.body.className = 'bg-slate-950 font-sans text-white';
    
    setCertificates(getAllCertificates());
    setAttestations(getAllAttestations());
    setLeads(getAllLeads());
    setFranchises(getAllFranchises());
    loadStudents();
  }, [lang]);

  const loadStudents = async () => {
    setStudentsLoading(true);
    setStudentsError('');
    try {
      const data = await fetchAdminStudents();
      setStudents(data);
    } catch (error) {
      setStudentsError(error instanceof Error ? error.message : 'Unable to load student records.');
    } finally {
      setStudentsLoading(false);
    }
  };

  // --- Actions ---

  const handleCertAction = (id: string, action: 'approve' | 'reject' | 'revoke') => {
    let newStatus: 'Pending' | 'Approved' | 'Revoked' = 'Pending';
    if (action === 'approve') newStatus = 'Approved';
    if (action === 'revoke') newStatus = 'Revoked';
    
    const updated = updateCertificateStatus(id, newStatus);
    setCertificates(updated);
  };

  const handleAttestationAction = (id: string, action: 'approve' | 'reject') => {
      const updated = updateAttestationStatus(id, action === 'approve' ? 'Issued' : 'Rejected', 'Sarkar Azeem');
      setAttestations(updated);
  };

  const handleMintCertificate = async (cert: CertificateData) => {
    if (cert.status !== 'Approved') return;
    setMintingId(cert.id);
    
    try {
      const record = await mintCertificateOnChain(cert, selectedNetwork);
      const updatedList = attachBlockchainRecord(cert.id, record);
      setCertificates(updatedList);
    } catch (error) {
      console.error("Minting failed", error);
    } finally {
      setMintingId(null);
    }
  };

  const handleStudentFieldChange = (field: keyof typeof studentForm, value: string) => {
    setStudentForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateStudent = async (event: React.FormEvent) => {
    event.preventDefault();
    setStudentsError('');

    try {
      const created = await createAdminStudent(studentForm);
      setStudents((prev) => [created, ...prev]);
      setStudentForm({
        name: '',
        email: '',
        phone: '',
        course: 'Web Development'
      });
    } catch (error) {
      setStudentsError(error instanceof Error ? error.message : 'Unable to create student ID.');
    }
  };

  const renderStudentsView = () => (
    <div className="space-y-8 animate-in fade-in">
      <div className="grid grid-cols-1 xl:grid-cols-[420px,1fr] gap-6">
        <form onSubmit={handleCreateStudent} className="glass rounded-2xl border border-white/10 p-6 space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Create Student ID</h2>
            <p className="text-sm text-gray-400 mt-1">
              Admin pehle real student ka record banayega. Student baad mein isi generated ID se signup karega.
            </p>
          </div>

          {studentsError && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {studentsError}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Student Name</label>
            <input
              value={studentForm.name}
              onChange={(e) => handleStudentFieldChange('name', e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white focus:outline-none focus:border-brand-neon/50"
              placeholder="Ali Ahmed"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Email</label>
            <input
              type="email"
              value={studentForm.email}
              onChange={(e) => handleStudentFieldChange('email', e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white focus:outline-none focus:border-brand-neon/50"
              placeholder="student@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Phone</label>
            <input
              value={studentForm.phone}
              onChange={(e) => handleStudentFieldChange('phone', e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white focus:outline-none focus:border-brand-neon/50"
              placeholder="+92 301 7862281"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Course</label>
            <select
              value={studentForm.course}
              onChange={(e) => handleStudentFieldChange('course', e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white focus:outline-none focus:border-brand-neon/50 relative z-10"
            >
              <option>Web Development</option>
              <option>Digital Marketing</option>
              <option>SEO</option>
              <option>Graphic Design</option>
              <option>AI Tools</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 font-bold text-white transition hover:opacity-90"
          >
            Generate Student ID
          </button>
        </form>

        <div className="glass rounded-2xl border border-white/10 overflow-hidden">
          <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white">Student Onboarding Queue</h3>
              <p className="text-sm text-gray-400">Only admin-created IDs should be allowed to register.</p>
            </div>
            <button
              onClick={loadStudents}
              className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white hover:border-brand-neon/50"
            >
              Refresh
            </button>
          </div>

          {studentsLoading ? (
            <div className="p-10 flex items-center justify-center gap-3 text-gray-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              Loading students...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-300">
                <thead className="bg-slate-900/70 text-xs uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-6 py-4">Student</th>
                    <th className="px-6 py-4">Student ID</th>
                    <th className="px-6 py-4">Course</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.length === 0 ? (
                    <tr>
                      <td className="px-6 py-8 text-gray-500" colSpan={4}>
                        No backend student records yet.
                      </td>
                    </tr>
                  ) : (
                    students.map((student) => (
                      <tr key={student.id} className="border-t border-white/5">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-white">{student.name}</div>
                          <div className="text-xs text-gray-500">{student.email}</div>
                        </td>
                        <td className="px-6 py-4 font-mono text-cyan-300">{student.studentId}</td>
                        <td className="px-6 py-4">{student.course}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-wider text-gray-300">
                            {student.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderAttestationsView = () => (
      <div className="space-y-6 animate-in fade-in">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2"><FileBadge className="w-6 h-6 text-brand-neon"/> Official Attestation Requests</h2>
          <div className="glass rounded-xl overflow-hidden border border-white/5">
              <table className="w-full text-left text-gray-400">
                  <thead className="bg-slate-900 text-xs uppercase font-bold text-gray-300">
                      <tr>
                          <th className="p-4">Request ID</th>
                          <th className="p-4">Student</th>
                          <th className="p-4">Type</th>
                          <th className="p-4">Date</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Actions</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                      {attestations.map(att => (
                          <tr key={att.id} className="hover:bg-white/5 transition-colors">
                              <td className="p-4 font-mono text-xs">{att.id}</td>
                              <td className="p-4 text-white font-bold">{att.studentName}</td>
                              <td className="p-4">{att.type}</td>
                              <td className="p-4">{att.requestDate}</td>
                              <td className="p-4">
                                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                      att.status === 'Issued' ? 'bg-blue-500/20 text-blue-400' :
                                      att.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                      'bg-red-500/20 text-red-400'
                                  }`}>
                                      {att.status}
                                  </span>
                              </td>
                              <td className="p-4 text-right flex items-center justify-end gap-2">
                                  {att.status === 'Pending' && (
                                      <>
                                          <button onClick={() => handleAttestationAction(att.id, 'approve')} className="p-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20" title="Issue Seal">
                                              <Award className="w-4 h-4" />
                                          </button>
                                          <button onClick={() => handleAttestationAction(att.id, 'reject')} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20" title="Reject">
                                              <XCircle className="w-4 h-4" />
                                          </button>
                                      </>
                                  )}
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </div>
  );

  const renderContent = () => {
    switch(currentView) {
      case 'certifications': return (
        <div className="space-y-8">
            {/* Standard Certs Table - omitted for brevity, similar to existing */}
            <div className="glass rounded-xl p-6 mb-8">
                <h3 className="text-xl font-bold text-white mb-4">Certificate Management</h3>
                <p className="text-gray-400">Manage standard certificates here.</p>
                {/* ... existing table code ... */}
            </div>
            {/* Attestation Table */}
            {renderAttestationsView()}
        </div>
      );
      case 'overview': return <div className="text-center p-10 text-gray-500">Dashboard Overview</div>;
      case 'students': return renderStudentsView();
      default: return <div className="text-center p-10 text-gray-500">Select a menu item</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-brand-neon/30">
      <SEO 
        title="Admin Dashboard | Digital Solutions Hub" 
        description="Super Admin Control Panel" 
        lang={lang} 
      />

      <AdminSidebar 
        lang={lang} 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        currentView={currentView}
        onNavigate={setCurrentView}
      />

      <div className="lg:pl-72 transition-all duration-300">
         <header className="h-20 bg-slate-900/80 backdrop-blur-md border-b border-white/10 px-8 flex items-center justify-between sticky top-0 z-40">
            <div className="flex items-center gap-4">
               <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden text-white"><Menu className="w-6 h-6" /></button>
               <h1 className="text-xl font-bold text-white capitalize hidden sm:block">{currentView.replace('-', ' ')}</h1>
            </div>
            <div className="flex items-center gap-4">
               <LanguageSwitcher currentLang={lang} />
               <div className="w-10 h-10 rounded-full bg-brand-neon/20 flex items-center justify-center border border-brand-neon/50 text-brand-neon font-bold">
                  SA
               </div>
            </div>
         </header>

         <main className="p-8">
            {renderContent()}
         </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
