
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../components/Logo';
import { Printer, ArrowLeft } from 'lucide-react';

const NDA: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-serif pt-10 pb-20">
      <div className="max-w-4xl mx-auto px-8">
        
        <div className="flex justify-between items-center mb-12 no-print">
           <Link to="/en" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 font-sans">
              <ArrowLeft className="w-4 h-4" /> Back to Home
           </Link>
           <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded hover:bg-slate-700 font-sans text-sm">
              <Printer className="w-4 h-4" /> Print NDA
           </button>
        </div>

        <div className="text-center mb-12 border-b-2 border-slate-900 pb-8">
           <div className="flex justify-center mb-4">
              <Logo className="w-16 h-16 text-slate-900" />
           </div>
           <h1 className="text-3xl font-bold uppercase tracking-wide mb-2">Non-Disclosure Agreement (NDA)</h1>
           <p className="text-slate-600 font-sans text-sm">Mutual Confidentiality Agreement</p>
        </div>

        <div className="space-y-8 text-justify leading-relaxed text-sm md:text-base">
           <p>
              This Non-Disclosure Agreement ("Agreement") is made between <strong>Digital Solutions Hub (DSH)</strong> ("Disclosing Party") and the Partner/Licensee ("Receiving Party").
           </p>

           <section>
              <h3 className="font-bold text-lg uppercase mb-2">1. Definition of Confidential Information</h3>
              <p>"Confidential Information" includes, but is not limited to, course curriculum, teaching methodologies, proprietary software code (LMS/CRM), business strategies, student data, pricing models, and any non-public information shared by DSH.</p>
           </section>

           <section>
              <h3 className="font-bold text-lg uppercase mb-2">2. Obligations</h3>
              <p>The Receiving Party agrees to: (a) hold Confidential Information in strict confidence; (b) not disclose it to any third party without prior written consent; and (c) use it solely for the purpose of the business relationship (Accreditation or Franchise).</p>
           </section>

           <section>
              <h3 className="font-bold text-lg uppercase mb-2">3. Intellectual Property</h3>
              <p>Nothing in this Agreement grants the Receiving Party any rights to the Disclosing Party’s intellectual property, trademarks, or copyrights, except as explicitly stated in a separate Accreditation or Franchise Agreement.</p>
           </section>

           <section>
              <h3 className="font-bold text-lg uppercase mb-2">4. Non-Compete</h3>
              <p>The Receiving Party agrees not to use the Confidential Information to develop a competing business, platform, or curriculum that directly mimics the proprietary models of Digital Solutions Hub during the term of this agreement and for a period of 2 years thereafter.</p>
           </section>

           <section>
              <h3 className="font-bold text-lg uppercase mb-2">5. Term</h3>
              <p>This Agreement remains in effect for the duration of the partnership and for a period of 5 years following termination.</p>
           </section>

           <div className="pt-12 mt-12 border-t border-slate-200 grid grid-cols-2 gap-20">
              <div>
                 <p className="border-b border-black mb-2 h-8"></p>
                 <p className="font-bold text-xs uppercase">Sarkar Azeem, CEO (DSH)</p>
              </div>
              <div>
                 <p className="border-b border-black mb-2 h-8"></p>
                 <p className="font-bold text-xs uppercase">Partner Signature</p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default NDA;
