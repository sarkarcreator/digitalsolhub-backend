
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Logo from '../components/Logo';
import SEO from '../components/SEO';
import AttestationSeal from '../components/AttestationSeal';
import { AttestationRecord, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { getAttestationById } from '../utils/attestationManager';
import { CheckCircle, AlertCircle, ShieldCheck, Loader2, ArrowLeft, Calendar, FileText, User } from 'lucide-react';

const VerifyAttestation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [record, setRecord] = useState<AttestationRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentLang, setCurrentLang] = useState<Language>(Language.ENGLISH);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
        if (id) {
            const found = getAttestationById(id);
            setRecord(found || null);
        }
        setLoading(false);
    }, 1000);
  }, [id]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <SEO 
        title={record ? `Attestation: ${record.id}` : "Verify Attestation"} 
        description="Official document verification portal." 
        lang={currentLang} 
      />

      <nav className="bg-white border-b border-slate-200 py-4 px-6 sticky top-0 z-50">
         <div className="max-w-4xl mx-auto flex justify-between items-center">
            <Link to={`/${currentLang}`} className="flex items-center gap-2">
               <Logo className="w-10 h-10" withText={true} />
            </Link>
            <div className="flex gap-2">
               {Object.values(Language).map(l => (
                  <button key={l} onClick={() => setCurrentLang(l)} className={`text-xs uppercase font-bold px-2 py-1 rounded ${currentLang === l ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>
                     {l}
                  </button>
               ))}
            </div>
         </div>
      </nav>

      <main className="flex-grow flex items-center justify-center p-6">
         {loading ? (
            <div className="text-center">
               <Loader2 className="w-10 h-10 animate-spin text-slate-400 mx-auto mb-4" />
               <p className="text-slate-500">Retrieving Official Records...</p>
            </div>
         ) : record ? (
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-w-4xl w-full flex flex-col md:flex-row animate-in fade-in zoom-in duration-500">
               
               {/* Left: Seal Visual */}
               <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-12 flex flex-col items-center justify-center text-center relative overflow-hidden md:w-1/3 border-r border-slate-900/50">
                  <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                  <AttestationSeal id={record.id} date={record.attestationDate} officer={record.officerName} type={record.type.toUpperCase()} className="w-48 h-48 scale-110 drop-shadow-2xl" />
                  
                  <div className="mt-12 bg-white/10 backdrop-blur rounded-lg p-4 border border-white/10 w-full">
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Attestation ID</p>
                     <p className="text-white font-mono text-lg">{record.id}</p>
                  </div>
               </div>

               {/* Right: Details */}
               <div className="p-8 md:p-12 flex-1 flex flex-col justify-center bg-[url('https://www.transparenttextures.com/patterns/paper.png')]">
                  <div className="flex items-center gap-2 mb-6">
                     <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 border border-blue-200">
                        <ShieldCheck className="w-4 h-4" /> Officially Attested
                     </div>
                     <span className="text-xs text-slate-400">Digital Solutions Hub Authority</span>
                  </div>

                  <h1 className="text-3xl font-bold text-slate-900 mb-2 font-serif">
                     Certificate of {record.courseName}
                  </h1>
                  <p className="text-slate-500 mb-8 italic">
                     "This document has been verified against our central database and confirms the authenticity of the earned credentials."
                  </p>

                  <div className="space-y-6 mb-8">
                     <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="p-2 bg-white rounded-lg text-slate-500 shadow-sm"><User className="w-5 h-5"/></div>
                        <div>
                           <p className="text-xs text-slate-500 uppercase font-bold">Holder Name</p>
                           <p className="font-bold text-slate-900 text-lg">{record.studentName}</p>
                        </div>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="p-2 bg-white rounded-lg text-slate-500 shadow-sm"><FileText className="w-5 h-5"/></div>
                            <div>
                               <p className="text-xs text-slate-500 uppercase font-bold">Type</p>
                               <p className="font-bold text-slate-900">{record.type} Attestation</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="p-2 bg-white rounded-lg text-slate-500 shadow-sm"><Calendar className="w-5 h-5"/></div>
                            <div>
                               <p className="text-xs text-slate-500 uppercase font-bold">Attested On</p>
                               <p className="font-bold text-slate-900">{record.attestationDate}</p>
                            </div>
                        </div>
                     </div>
                  </div>

                  <div className="pt-8 border-t-2 border-slate-100 flex items-center justify-between">
                     <div>
                        <p className="text-xs text-slate-400 uppercase font-bold mb-1">Authorized Officer</p>
                        <p className="text-sm font-serif italic text-slate-800">{record.officerName}</p>
                     </div>
                     <div className="text-right">
                        <p className="text-xs text-slate-400 uppercase font-bold mb-1">Verification Status</p>
                        <p className="text-sm font-bold text-green-600 flex items-center justify-end gap-1"><CheckCircle className="w-4 h-4"/> Valid</p>
                     </div>
                  </div>
               </div>

            </div>
         ) : (
            <div className="text-center">
               <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-10 h-10 text-red-500" />
               </div>
               <h2 className="text-2xl font-bold text-slate-900 mb-2">Record Not Found</h2>
               <p className="text-slate-500 mb-6">The requested attestation ID is invalid or has been revoked.</p>
               <Link to="/" className="text-blue-600 hover:underline font-bold">Return Home</Link>
            </div>
         )}
      </main>
    </div>
  );
};

export default VerifyAttestation;
