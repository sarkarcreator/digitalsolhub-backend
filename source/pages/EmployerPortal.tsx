
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Language } from '../types';
import SEO from '../components/SEO';
import Logo from '../components/Logo';
import { ShieldCheck, Database, CheckCircle, Zap, Code, Lock } from 'lucide-react';

const EmployerPortal: React.FC = () => {
  const { lang: paramLang } = useParams<{ lang: string }>();
  const lang = (Object.values(Language).includes(paramLang as Language)) ? (paramLang as Language) : Language.ENGLISH;

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-white">
      <SEO 
        title="Employer Verification API | Digital Solutions Hub" 
        description="Verify candidate certificates instantly via API." 
        lang={lang} 
      />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
         <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]"></div>
         <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
                <Code className="w-4 h-4" /> Developer API Available
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
               Hire with Confidence.<br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Verify Instantly.</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
               Integrate the DSH Validation API into your HR systems to verify student credentials in real-time. Zero fakes, 100% blockchain-backed trust.
            </p>
            <div className="flex justify-center gap-4">
               <Link to={`/${lang}/employer-dashboard`} className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20">
                  Get API Key
               </Link>
               <Link to={`/${lang}/api-docs`} className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-white/10 transition-all">
                  View Documentation
               </Link>
            </div>
         </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-slate-900/50 border-y border-white/5">
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                  { icon: Zap, title: "Real-Time Verification", desc: "Instant JSON responses for Certificate IDs." },
                  { icon: Database, title: "Bulk Processing", desc: "Verify thousands of candidates at once via CSV or API." },
                  { icon: ShieldCheck, title: "Blockchain Proof", desc: "Cryptographic ledger ensures data has not been tampered with." },
                  { icon: Lock, title: "Secure & Private", desc: "GDPR compliant data masking for privacy protection." },
                  { icon: CheckCircle, title: "Revocation Check", desc: "Live status updates on revoked or suspended credentials." },
                  { icon: Code, title: "Easy Integration", desc: "RESTful endpoints compatible with any ATS or HR software." }
               ].map((feat, i) => (
                  <div key={i} className="p-8 rounded-2xl bg-slate-950 border border-white/5 hover:border-blue-500/30 transition-all group">
                     <feat.icon className="w-10 h-10 text-slate-600 group-hover:text-blue-400 mb-6 transition-colors" />
                     <h3 className="text-xl font-bold text-white mb-2">{feat.title}</h3>
                     <p className="text-gray-400 text-sm">{feat.desc}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Code Snippet */}
      <section className="py-20">
         <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
               <h2 className="text-3xl font-bold text-white mb-4">Seamless Integration</h2>
               <p className="text-gray-400 mb-8">
                  Our API is designed for developers. Use simple HTTP requests to verify credentials directly within your existing workflow.
               </p>
               <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-gray-300"><CheckCircle className="w-5 h-5 text-green-500"/> 99.9% Uptime SLA</li>
                  <li className="flex items-center gap-3 text-gray-300"><CheckCircle className="w-5 h-5 text-green-500"/> Rate limiting protection</li>
                  <li className="flex items-center gap-3 text-gray-300"><CheckCircle className="w-5 h-5 text-green-500"/> Detailed audit logs</li>
               </ul>
            </div>
            <div className="flex-1 w-full">
               <div className="bg-slate-900 rounded-xl border border-white/10 overflow-hidden shadow-2xl">
                  <div className="bg-slate-800 px-4 py-2 flex items-center gap-2 border-b border-white/5">
                     <div className="w-3 h-3 rounded-full bg-red-500"></div>
                     <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                     <div className="w-3 h-3 rounded-full bg-green-500"></div>
                     <span className="text-xs text-gray-500 ml-2 font-mono">bash</span>
                  </div>
                  <div className="p-6 overflow-x-auto">
                     <pre className="font-mono text-sm text-blue-300">
{`curl -X GET https://api.dsh.com/v1/verify/CERT-123 \\
  -H "Authorization: Bearer dsh_sk_..."`}
                     </pre>
                     <pre className="font-mono text-sm text-green-400 mt-4">
{`{
  "status": "verified",
  "student": "Ali A****",
  "course": "Web Development",
  "issue_date": "2024-05-20"
}`}
                     </pre>
                  </div>
               </div>
            </div>
         </div>
      </section>

    </div>
  );
};

export default EmployerPortal;
