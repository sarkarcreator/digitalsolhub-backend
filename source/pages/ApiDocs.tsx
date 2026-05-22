
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import Logo from '../components/Logo';
import { Language } from '../types';
import { ArrowLeft, BookOpen, Code } from 'lucide-react';

const ApiDocs: React.FC = () => {
  const { lang: paramLang } = useParams<{ lang: string }>();
  const lang = (Object.values(Language).includes(paramLang as Language)) ? (paramLang as Language) : Language.ENGLISH;

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <SEO title="API Documentation | DSH" description="Technical documentation." lang={lang} />
      
      <div className="border-b border-slate-200 sticky top-0 bg-white z-50">
         <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link to={`/${lang}/employer-portal`} className="flex items-center gap-2">
               <Logo className="w-8 h-8 text-slate-900" />
               <span className="font-bold">Developer Docs</span>
            </Link>
            <div className="flex gap-4">
               <Link to={`/${lang}/employer-dashboard`} className="text-sm font-bold text-blue-600 hover:underline">Dashboard</Link>
            </div>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 flex gap-12">
         {/* Sidebar Nav */}
         <aside className="w-64 hidden lg:block sticky top-24 h-fit">
            <h4 className="font-bold uppercase text-xs text-slate-500 mb-4">Getting Started</h4>
            <ul className="space-y-2 text-sm border-l border-slate-200 ml-1">
               <li><a href="#intro" className="block pl-4 border-l border-blue-600 text-blue-600 font-medium">Introduction</a></li>
               <li><a href="#auth" className="block pl-4 text-slate-600 hover:text-slate-900">Authentication</a></li>
               <li><a href="#endpoints" className="block pl-4 text-slate-600 hover:text-slate-900">Endpoints</a></li>
            </ul>
         </aside>

         {/* Content */}
         <main className="flex-1 max-w-3xl">
            <section id="intro" className="mb-16">
               <h1 className="text-4xl font-bold mb-6">Introduction</h1>
               <p className="text-lg text-slate-600 leading-relaxed mb-4">
                  The Digital Solutions Hub Validation API allows employers and recruitment platforms to programmatically verify the authenticity of certificates issued by DSH Academy.
               </p>
               <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg text-blue-800 text-sm">
                  <strong>Base URL:</strong> <code>https://digitalsolhub.com/api/v1</code>
               </div>
            </section>

            <section id="auth" className="mb-16">
               <h2 className="text-2xl font-bold mb-4">Authentication</h2>
               <p className="text-slate-600 mb-4">
                  All API requests must include your API Key in the <code>Authorization</code> header.
               </p>
               <div className="bg-slate-900 text-blue-300 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  Authorization: Bearer dsh_live_sk_...
               </div>
            </section>

            <section id="endpoints" className="mb-16">
               <h2 className="text-2xl font-bold mb-8">Endpoints</h2>

               <div className="mb-12">
                  <div className="flex items-center gap-3 mb-4">
                     <span className="bg-green-100 text-green-700 px-3 py-1 rounded font-bold text-xs">GET</span>
                     <h3 className="font-mono font-bold">/verify/certificate/{'{id}'}</h3>
                  </div>
                  <p className="text-slate-600 mb-4">Retrieve details for a single certificate.</p>
                  <h4 className="font-bold text-sm mb-2">Response Example</h4>
                  <pre className="bg-slate-50 p-4 rounded-lg text-sm text-slate-700 border border-slate-200 overflow-x-auto">
{`{
  "status": "verified",
  "student_name": "Ali A****",
  "course_name": "Digital Marketing",
  "issue_date": "15/09/2024",
  "verification_url": "https://...",
  "blockchain": {
    "network": "Polygon",
    "tx_hash": "0x..."
  }
}`}
                  </pre>
               </div>

               <div className="mb-12">
                  <div className="flex items-center gap-3 mb-4">
                     <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded font-bold text-xs">POST</span>
                     <h3 className="font-mono font-bold">/verify/bulk</h3>
                  </div>
                  <p className="text-slate-600 mb-4">Verify up to 100 certificates in a single request.</p>
                  <h4 className="font-bold text-sm mb-2">Request Body</h4>
                  <pre className="bg-slate-50 p-4 rounded-lg text-sm text-slate-700 border border-slate-200 overflow-x-auto mb-4">
{`{
  "ids": ["CERT-001", "CERT-002"]
}`}
                  </pre>
               </div>
            </section>
         </main>
      </div>
    </div>
  );
};

export default ApiDocs;
