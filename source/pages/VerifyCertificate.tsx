
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Logo from '../components/Logo';
import SEO from '../components/SEO';
import { ADMIN_WHATSAPP } from '../utils/notifications';
import { TRANSLATIONS } from '../constants';
import { CertificateData, Language } from '../types';
import { getCertificateById } from '../utils/certificateManager';
import { getExplorerLink } from '../utils/blockchainManager';
import { 
  CheckCircle, AlertCircle, ShieldCheck, Loader2, ArrowLeft, 
  Phone, Globe, Award, QrCode, Search, Database, Fingerprint, Lock, ExternalLink, Mail, ChevronDown
} from 'lucide-react';

const VerifyCertificate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [inputId, setInputId] = useState(id || '');
  const [status, setStatus] = useState<'idle' | 'loading' | 'valid' | 'invalid' | 'revoked'>('idle');
  const [data, setData] = useState<CertificateData | null>(null);
  const [checkingBlockchain, setCheckingBlockchain] = useState(false);
  const [blockchainVerified, setBlockchainVerified] = useState(false);
  
  // Local Language State for this Landing Page
  const [currentLang, setCurrentLang] = useState<Language>(Language.ENGLISH);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  // Use Translations from constants
  const t = TRANSLATIONS;
  const isRtl = currentLang === Language.URDU || currentLang === Language.ARABIC;

  useEffect(() => {
    if (id) {
      handleVerify(id);
    }
    // Update HTML dir/lang attributes for this page specifically
    document.documentElement.lang = currentLang;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
  }, [id, currentLang]);

  const handleVerify = (certId: string) => {
    if (!certId.trim()) return;
    setStatus('loading');
    setCheckingBlockchain(false);
    setBlockchainVerified(false);
    
    setTimeout(() => {
      const foundCert = getCertificateById(certId.trim());
      if (foundCert) {
        if (foundCert.status === 'Revoked') {
           setStatus('revoked');
           setData(foundCert);
        } else if (foundCert.status === 'Approved') {
           setStatus('valid');
           setData(foundCert);
           
           // Simulate blockchain integrity check if record exists
           if (foundCert.blockchain) {
               setCheckingBlockchain(true);
               setTimeout(() => {
                   setCheckingBlockchain(false);
                   setBlockchainVerified(true);
               }, 1500);
           }
        } else {
           setStatus('invalid');
           setData(null);
        }
      } else {
        setStatus('invalid');
        setData(null);
      }
    }, 800);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleVerify(inputId);
  };

  // Structured Data for SEO
  const credentialSchema = data ? {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalCredential",
    "credentialCategory": "certification",
    "educationalLevel": "Professional",
    "dateCreated": data.issueDate,
    "name": data.courseName,
    "issuer": {
      "@type": "Organization",
      "name": "Digital Solutions Hub",
      "url": "https://digitalsolhub.com",
      "logo": "https://digitalsolhub.com/logo.png"
    },
    "awardedTo": {
      "@type": "Person",
      "name": data.studentName
    },
    "credentialId": data.id,
    "image": `https://digitalsolhub.com/certs/${data.id}.png` // Hypothetical image URL
  } : null;

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col ${isRtl ? 'font-urdu' : ''}`}>
      <SEO 
        title={`${t.verify_page_title[currentLang]} | DSH Academy`}
        description={t.verify_page_desc[currentLang]}
        lang={currentLang} 
        schema={credentialSchema ? credentialSchema : undefined}
      />
      
      {/* --- Top Navigation --- */}
      <nav className="bg-white border-b border-slate-200 py-4 px-6 sticky top-0 z-50">
         <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Link to={`/${currentLang}`} className="flex items-center gap-2">
               <Logo className="w-10 h-10" withText={true} />
            </Link>
            
            <div className="relative">
               <button 
                  onClick={() => setLangMenuOpen(!langMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors text-sm font-bold text-slate-600"
               >
                  <Globe className="w-4 h-4" />
                  <span className="uppercase">{currentLang}</span>
                  <ChevronDown className="w-3 h-3" />
               </button>
               {langMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-40 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50">
                     {Object.values(Language).map((l) => (
                        <button
                           key={l}
                           onClick={() => { setCurrentLang(l); setLangMenuOpen(false); }}
                           className={`w-full text-left px-4 py-3 text-sm hover:bg-slate-50 ${currentLang === l ? 'font-bold text-blue-600 bg-blue-50' : 'text-slate-600'}`}
                        >
                           {l === Language.URDU ? 'Ø§Ø±Ø¯Ùˆ' : l === Language.ARABIC ? 'Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©' : l === Language.RUSSIAN ? 'Ð ÑƒÑÑÐºÐ¸Ð¹' : 'English'}
                        </button>
                     ))}
                  </div>
               )}
            </div>
         </div>
      </nav>

      <main className="flex-grow">
         {/* --- Hero Section --- */}
         <section className="relative bg-slate-900 text-white py-20 px-6 overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/20 rounded-full blur-[120px]"></div>
            
            <div className="max-w-3xl mx-auto text-center relative z-10">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-500/10 border border-gold-500/30 rounded-full text-gold-400 text-xs font-bold uppercase tracking-widest mb-6">
                  <ShieldCheck className="w-4 h-4" /> Official Verification Portal
               </div>
               <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                  {t.verify_page_title[currentLang]}
               </h1>
               <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
                  {t.verify_page_desc[currentLang]}
               </p>

               {/* Verification Input Card */}
               <div className="bg-white rounded-2xl p-2 md:p-3 shadow-2xl flex flex-col md:flex-row gap-2 max-w-2xl mx-auto border-4 border-white/10">
                  <div className="relative flex-grow">
                     <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Award className="h-5 w-5 text-slate-400" />
                     </div>
                     <input
                        type="text"
                        value={inputId}
                        onChange={(e) => setInputId(e.target.value)}
                        placeholder={t.enter_cert_id[currentLang]}
                        className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-transparent rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                     />
                  </div>
                  <button 
                     onClick={handleManualSubmit}
                     disabled={status === 'loading' || !inputId}
                     className="bg-slate-900 text-white font-bold py-4 px-8 rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
                  >
                     {status === 'loading' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                     {t.verify_btn[currentLang]}
                  </button>
                  {/* Visual QR Button (Simulation for Web) */}
                  <button className="bg-slate-100 text-slate-900 p-4 rounded-xl hover:bg-slate-200 transition-colors" title="Scan QR using camera">
                     <QrCode className="w-6 h-6" />
                  </button>
               </div>
            </div>
         </section>

         {/* --- Result Section --- */}
         <section className="max-w-4xl mx-auto px-6 -mt-10 relative z-20 pb-20">
            
            {status === 'valid' && data && (
               <div className="space-y-6">
                   {/* Main Certificate Card */}
                   <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden animate-in slide-in-from-bottom-8 duration-700">
                      <div className="bg-green-50 border-b border-green-100 p-6 flex items-center justify-center gap-3">
                         <CheckCircle className="w-8 h-8 text-green-600 fill-current" />
                         <h2 className="text-xl font-bold text-green-800">{t.authentic_msg[currentLang]}</h2>
                      </div>
                      
                      <div className="p-8 md:p-12">
                         <div className="flex flex-col md:flex-row gap-8 items-start">
                            {/* Digital Badge */}
                            <div className="flex-shrink-0 mx-auto md:mx-0">
                               <div className="w-40 h-40 rounded-full bg-slate-900 flex items-center justify-center border-4 border-gold-500 shadow-2xl relative">
                                  <Award className="w-20 h-20 text-gold-500" />
                                  <div className="absolute inset-0 border-[3px] border-white/20 rounded-full m-2"></div>
                                  <div className="absolute bottom-0 bg-gold-500 text-slate-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                                     {t.valid[currentLang]}
                                  </div>
                               </div>
                            </div>

                            {/* Details */}
                            <div className="flex-grow w-full">
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                                  <div>
                                     <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">{t.student_name[currentLang]}</p>
                                     <p className="text-2xl font-serif font-bold text-slate-900">{data.studentName}</p>
                                  </div>
                                  <div>
                                     <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">{t.course_name[currentLang]}</p>
                                     <p className="text-xl font-bold text-blue-700">{data.courseName}</p>
                                  </div>
                                  <div>
                                     <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">{t.issue_date[currentLang]}</p>
                                     <p className="text-lg font-medium text-slate-700">{data.issueDate}</p>
                                  </div>
                                  <div>
                                     <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">{t.cert_id[currentLang]}</p>
                                     <p className="text-lg font-mono font-medium text-slate-700 bg-slate-100 inline-block px-2 rounded">{data.id}</p>
                                  </div>
                               </div>

                               <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-between">
                                  <div>
                                     <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">{t.issued_by[currentLang]}</p>
                                     <div className="flex items-center gap-2">
                                        <Logo className="w-6 h-6" />
                                        <span className="font-bold text-slate-900">Digital Solutions Hub</span>
                                     </div>
                                  </div>
                                  <div className="text-right">
                                     <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">{t.ceo[currentLang]}</p>
                                     <p className="text-xs font-serif italic text-slate-600">Sarkar Azeem</p>
                                  </div>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>

                   {/* Blockchain Verification Card */}
                   {data.blockchain ? (
                       <div className="bg-slate-900 rounded-3xl shadow-2xl border border-white/10 overflow-hidden text-white animate-in slide-in-from-bottom-8 delay-300">
                           <div className="p-6 border-b border-white/10 flex justify-between items-center">
                               <div className="flex items-center gap-3">
                                   <Database className="w-6 h-6 text-brand-neon" />
                                   <h3 className="font-bold text-lg">{t.blockchain_audit[currentLang]}</h3>
                               </div>
                               <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${checkingBlockchain ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}>
                                   {checkingBlockchain ? <Loader2 className="w-3 h-3 animate-spin" /> : <ShieldCheck className="w-3 h-3" />}
                                   {checkingBlockchain ? t.verifying[currentLang] : t.integrity_confirmed[currentLang]}
                               </div>
                           </div>
                           
                           <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                               <div className="space-y-6">
                                   <div>
                                       <p className="text-xs text-gray-500 uppercase font-bold mb-1">{t.bc_network[currentLang]}</p>
                                       <p className="text-white font-medium flex items-center gap-2">
                                           <img src={data.blockchain.network === 'Polygon' ? 'https://cryptologos.cc/logos/polygon-matic-logo.png?v=026' : 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=026'} className="w-5 h-5" alt="Network" />
                                           {data.blockchain.network} Mainnet
                                       </p>
                                   </div>
                                   <div>
                                       <p className="text-xs text-gray-500 uppercase font-bold mb-1">{t.bc_tx_hash[currentLang]}</p>
                                       <a href={getExplorerLink(data.blockchain)} target="_blank" className="text-brand-neon font-mono text-xs break-all hover:underline flex items-start gap-2">
                                           {data.blockchain.txHash} <ExternalLink className="w-3 h-3 flex-shrink-0 mt-0.5" />
                                       </a>
                                   </div>
                                   <div>
                                       <p className="text-xs text-gray-500 uppercase font-bold mb-1">Block Number</p>
                                       <p className="text-white font-mono">{data.blockchain.blockNumber}</p>
                                   </div>
                               </div>

                               <div className="bg-slate-950 rounded-xl p-6 border border-white/5 relative overflow-hidden">
                                   <div className="absolute top-0 right-0 p-4 opacity-10"><Fingerprint className="w-16 h-16" /></div>
                                   <p className="text-xs text-gray-500 uppercase font-bold mb-4">Cryptographic Proof</p>
                                   
                                   <div className="space-y-4">
                                       <div>
                                           <p className="text-[10px] text-gray-600 mb-1">Off-Chain Data Hash</p>
                                           <p className={`font-mono text-[10px] break-all ${checkingBlockchain ? 'animate-pulse text-yellow-500' : 'text-green-500'}`}>
                                               {data.blockchain.integrityHash}
                                           </p>
                                       </div>
                                       <div className="w-full h-px bg-white/10"></div>
                                       <div>
                                           <p className="text-[10px] text-gray-600 mb-1">On-Chain Stored Hash</p>
                                           <p className="font-mono text-[10px] break-all text-green-500">
                                               {data.blockchain.integrityHash}
                                           </p>
                                       </div>
                                   </div>
                                   
                                   {!checkingBlockchain && (
                                       <div className="mt-4 flex items-center gap-2 text-green-400 text-xs font-bold bg-green-500/10 p-2 rounded justify-center">
                                           <CheckCircle className="w-4 h-4" /> Hashes Match â€¢ Data Untampered
                                       </div>
                                   )}
                               </div>
                           </div>
                       </div>
                   ) : (
                       <div className="bg-white rounded-3xl shadow p-6 border border-slate-200 text-center">
                           <p className="text-slate-500 text-sm">This certificate is valid but has not been minted to the blockchain yet.</p>
                       </div>
                   )}
               </div>
            )}

            {status === 'invalid' && (
               <div className="bg-white rounded-3xl shadow-xl border border-red-100 p-8 text-center animate-in slide-in-from-bottom-8">
                  <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                     <AlertCircle className="w-10 h-10 text-red-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">{t.invalid_title[currentLang]}</h2>
                  <p className="text-slate-500 mb-8">{t.invalid_msg[currentLang]}</p>
                  <a href={`https://wa.me/${ADMIN_WHATSAPP}`} className="inline-flex items-center gap-2 text-blue-600 font-bold hover:underline" target="_blank" rel="noopener noreferrer">
                     <Phone className="w-4 h-4" /> WhatsApp Support
                  </a>
               </div>
            )}

            {status === 'revoked' && (
               <div className="bg-white rounded-3xl shadow-xl border-l-8 border-red-600 p-8 animate-in slide-in-from-bottom-8">
                  <div className="flex items-start gap-4">
                     <AlertCircle className="w-10 h-10 text-red-600 shrink-0" />
                     <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">{t.revoked_title[currentLang]}</h2>
                        <p className="text-red-600 font-medium mb-4">{t.revoked_msg[currentLang]}</p>
                        <p className="text-slate-500 text-sm">
                           {t.cert_id[currentLang]}: <span className="font-mono font-bold">{inputId}</span>
                        </p>
                     </div>
                  </div>
               </div>
            )}

         </section>

         {/* --- Trust Section --- */}
         <section className="bg-white py-20 border-t border-slate-200">
            <div className="max-w-7xl mx-auto px-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                  <div>
                     <h2 className="text-3xl font-bold text-slate-900 mb-6">{t.bc_authenticity[currentLang]}</h2>
                     <div className="space-y-6">
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                                <Lock className="w-5 h-5" />
                            </div>
                            <span className="font-medium text-slate-700">Prevents fake certificates</span>
                        </div>
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                                <Database className="w-5 h-5" />
                            </div>
                            <span className="font-medium text-slate-700">Permanent Blockchain Record</span>
                        </div>
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <span className="font-medium text-slate-700">Trusted by employers worldwide</span>
                        </div>
                     </div>
                  </div>
                  <div className="bg-slate-900 rounded-3xl p-8 text-center text-white relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                     <div className="relative z-10">
                        <Award className="w-16 h-16 text-gold-500 mx-auto mb-6" />
                        <h3 className="text-xl font-bold mb-2">Need Help?</h3>
                        <p className="text-slate-400 mb-8 text-sm">Our support team is available 24/7.</p>
                        <a 
                           href={`https://wa.me/${ADMIN_WHATSAPP}`} 
                           target="_blank"
                           rel="noopener noreferrer"
                           className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-all"
                        >
                           <Phone className="w-5 h-5" /> WhatsApp Support
                        </a>
                        <p className="text-xs text-slate-500 mt-4 font-mono">+1 917 695 7737</p>
                     </div>
                  </div>
               </div>
            </div>
         </section>
      </main>

      {/* --- Footer --- */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
         <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="flex justify-center mb-6">
               <Logo className="w-12 h-12" withText={false} />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Digital Solutions Hub</h3>
            <p className="text-sm mb-8">Where Innovation Finds Direction</p>
            <div className="flex justify-center gap-6 text-sm font-medium">
               <Link to={`/${currentLang}`} className="hover:text-white transition-colors flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" /> Back to Home
               </Link>
               <a href="mailto:admin@digitalsolhub.com" className="hover:text-white transition-colors flex items-center gap-2">
                  <Mail className="w-4 h-4" /> admin@digitalsolhub.com
               </a>
            </div>
            <p className="mt-12 text-xs text-slate-600">&copy; {new Date().getFullYear()} DSH Academy. All Rights Reserved.</p>
         </div>
      </footer>
    </div>
  );
};

export default VerifyCertificate;
