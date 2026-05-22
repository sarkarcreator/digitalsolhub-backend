
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPartnerBySlug } from '../utils/partnerManager';
import { Partner, Language } from '../types';
import SEO from '../components/SEO';
import Logo from '../components/Logo';
import { CheckCircle, ShieldCheck, Loader2, ArrowLeft, Award, Calendar, User, Search } from 'lucide-react';

// Mock Cert Data for demo
const MOCK_CERT = {
    id: 'CERT-001',
    student: 'Sarah Khan',
    course: 'Advanced Web Development',
    date: '20 Oct 2024',
    status: 'Verified'
};

const PartnerVerification: React.FC = () => {
  const { slug, id } = useParams<{ slug: string; id: string }>();
  const [partner, setPartner] = useState<Partner | null>(null);
  const [loading, setLoading] = useState(true);
  const [certId, setCertId] = useState(id || '');
  const [certData, setCertData] = useState<any>(null);

  useEffect(() => {
    if (slug) {
        setTimeout(() => {
            const p = getPartnerBySlug(slug);
            setPartner(p || null);
            setLoading(false);
            
            // Auto verify if ID present
            if (id && p) {
                setCertData(MOCK_CERT); 
            }
        }, 800);
    }
  }, [slug, id]);

  const handleVerify = (e: React.FormEvent) => {
      e.preventDefault();
      // Mock logic
      if (certId === 'CERT-001') setCertData(MOCK_CERT);
      else setCertData(null);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-gray-400" /></div>;
  if (!partner) return <div className="min-h-screen flex items-center justify-center">Partner Not Found</div>;

  const brandColor = partner.brandColor || '#3b82f6';

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      <SEO 
        title={`Verify Certificate | ${partner.name}`} 
        description={`Official verification portal for ${partner.name}.`} 
        lang={Language.ENGLISH} 
      />

      {/* Partner Header */}
      <header className="bg-white border-b border-slate-200 py-4 px-6 sticky top-0 z-50 shadow-sm">
         <div className="max-w-4xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
               {partner.logo ? <img src={partner.logo} alt={partner.name} className="h-10 object-contain" /> : <div className="font-bold text-xl">{partner.name}</div>}
               <div className="hidden sm:block w-px h-6 bg-slate-300 mx-2"></div>
               <span className="hidden sm:block text-xs text-slate-500 uppercase tracking-wider font-bold">Verification Portal</span>
            </div>
            <Link to="/" className="text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1">
                Powered by DSH <ShieldCheck className="w-3 h-3" />
            </Link>
         </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-6 relative overflow-hidden">
         {/* Background Decor */}
         <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-white to-transparent opacity-50 pointer-events-none" style={{ backgroundColor: `${brandColor}10` }}></div>

         <div className="w-full max-w-lg relative z-10">
            
            {!certData ? (
                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 text-center animate-in zoom-in">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: `${brandColor}20`, color: brandColor }}>
                        <Award className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Verify Credential</h1>
                    <p className="text-slate-500 text-sm mb-8">Enter the unique certificate ID issued by {partner.name}.</p>
                    
                    <form onSubmit={handleVerify} className="relative">
                        <input 
                            type="text" 
                            value={certId} 
                            onChange={(e) => setCertId(e.target.value)} 
                            className="w-full border border-slate-300 rounded-xl py-4 pl-4 pr-12 text-center font-mono text-lg uppercase focus:border-blue-500 outline-none transition-colors"
                            placeholder="CERT-XXXX-XXXX"
                        />
                        <button type="submit" className="absolute right-2 top-2 p-2 rounded-lg text-white transition-transform active:scale-95" style={{ backgroundColor: brandColor }}>
                            <Search className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            ) : (
                <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in slide-in-from-bottom-8">
                    <div className="p-8 text-center relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10" style={{ backgroundColor: brandColor }}></div>
                        <CheckCircle className="w-16 h-16 mx-auto mb-4 relative z-10" style={{ color: brandColor }} />
                        <h2 className="text-2xl font-bold text-slate-900 relative z-10">Credential Verified</h2>
                        <p className="text-slate-500 text-sm relative z-10">This certificate is valid and active.</p>
                    </div>
                    
                    <div className="p-8 bg-slate-50/50">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white border border-slate-100 rounded-xl shadow-sm text-slate-400">
                                    <User className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase">Awarded To</p>
                                    <p className="text-lg font-bold text-slate-900">{certData.student}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white border border-slate-100 rounded-xl shadow-sm text-slate-400">
                                    <Award className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase">Credential</p>
                                    <p className="text-lg font-bold text-slate-900">{certData.course}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white border border-slate-100 rounded-xl shadow-sm text-slate-400">
                                    <Calendar className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase">Issue Date</p>
                                    <p className="text-lg font-bold text-slate-900">{certData.date}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-200 text-center">
                            <p className="text-xs text-slate-400 uppercase font-bold mb-2">Issued By</p>
                            <div className="flex items-center justify-center gap-2">
                                {partner.logo && <img src={partner.logo} className="h-6 object-contain grayscale opacity-70" />}
                                <span className="font-bold text-slate-600">{partner.name}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-slate-900 text-white p-3 text-center text-xs flex justify-center items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-green-400" />
                        Verified by Digital Solutions Hub Infrastructure
                    </div>
                </div>
            )}

         </div>
      </main>
    </div>
  );
};

export default PartnerVerification;
