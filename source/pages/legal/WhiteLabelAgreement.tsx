
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../components/Logo';
import { Printer, ArrowLeft } from 'lucide-react';

const WhiteLabelAgreement: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-serif pt-10 pb-20">
      <div className="max-w-4xl mx-auto px-8">
        
        <div className="flex justify-between items-center mb-12 no-print">
           <Link to="/en" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 font-sans">
              <ArrowLeft className="w-4 h-4" /> Back to Home
           </Link>
           <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded hover:bg-slate-700 font-sans text-sm">
              <Printer className="w-4 h-4" /> Print Agreement
           </button>
        </div>

        <div className="text-center mb-12 border-b-2 border-slate-900 pb-8">
           <div className="flex justify-center mb-4">
              <Logo className="w-16 h-16 text-slate-900" />
           </div>
           <h1 className="text-3xl font-bold uppercase tracking-wide mb-2">White-Label Platform Agreement</h1>
           <p className="text-slate-600 font-sans text-sm">Digital Solutions Hub â€“ Technology Division</p>
        </div>

        <div className="space-y-8 text-justify leading-relaxed text-sm md:text-base">
           <p>
              This White-Label Platform Agreement ("Agreement") outlines the terms under which <strong>Digital Solutions Hub (DSH)</strong> ("Provider") grants the Client ("Licensee") the right to use the DSH Learning Management System (LMS) and CRM under their own branding.
           </p>

           <section>
              <h3 className="font-bold text-lg uppercase mb-2">1. License Grant</h3>
              <p>Provider grants Licensee a non-transferable, non-exclusive license to use the Platform via a designated sub-domain (e.g., <em>partner.digitalsolhub.com</em> or custom domain) for the duration of the subscription.</p>
           </section>

           <section>
              <h3 className="font-bold text-lg uppercase mb-2">2. Branding & Customization</h3>
              <p>Licensee may customize the Platform with their logo and primary colors ("White-Labeling"). However, the underlying software, code, and "Powered by DSH" or "Accredited by DSH" footers (where mandated by accreditation status) remain the intellectual property of the Provider.</p>
           </section>

           <section>
              <h3 className="font-bold text-lg uppercase mb-2">3. Data Ownership</h3>
              <p>Licensee retains full ownership of their student and client data entered into the Platform. DSH agrees to process this data solely for the purpose of providing the Service and in accordance with the Data Privacy Policy.</p>
           </section>

           <section>
              <h3 className="font-bold text-lg uppercase mb-2">4. Service Level Agreement (SLA)</h3>
              <p>Provider aims for 99.9% uptime. Scheduled maintenance will be communicated 24 hours in advance. Provider is not liable for downtime caused by third-party hosting providers or force majeure events.</p>
           </section>

           <section>
              <h3 className="font-bold text-lg uppercase mb-2">5. Security & Misuse</h3>
              <p>Licensee is responsible for maintaining the confidentiality of admin credentials. Any attempt to reverse-engineer, resell, or exploit the Platform code is strictly prohibited and will result in immediate termination and legal action.</p>
           </section>

           <div className="pt-12 mt-12 border-t border-slate-200 grid grid-cols-2 gap-20">
              <div>
                 <p className="border-b border-black mb-2 h-8"></p>
                 <p className="font-bold text-xs uppercase">Authorized Signature (DSH)</p>
              </div>
              <div>
                 <p className="border-b border-black mb-2 h-8"></p>
                 <p className="font-bold text-xs uppercase">Authorized Signature (Licensee)</p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default WhiteLabelAgreement;
