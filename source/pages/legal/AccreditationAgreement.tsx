
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../components/Logo';
import { Printer, ArrowLeft } from 'lucide-react';

const AccreditationAgreement: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-serif pt-10 pb-20">
      <div className="max-w-4xl mx-auto px-8">
        
        {/* Toolbar */}
        <div className="flex justify-between items-center mb-12 no-print">
           <Link to="/en" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 font-sans">
              <ArrowLeft className="w-4 h-4" /> Back to Home
           </Link>
           <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded hover:bg-slate-700 font-sans text-sm">
              <Printer className="w-4 h-4" /> Print Agreement
           </button>
        </div>

        {/* Header */}
        <div className="text-center mb-12 border-b-2 border-slate-900 pb-8">
           <div className="flex justify-center mb-4">
              <Logo className="w-16 h-16 text-slate-900" />
           </div>
           <h1 className="text-3xl font-bold uppercase tracking-wide mb-2">International Accreditation Agreement</h1>
           <p className="text-slate-600 font-sans text-sm">Digital Solutions Hub – DSH Academy</p>
        </div>

        {/* Content */}
        <div className="space-y-8 text-justify leading-relaxed text-sm md:text-base">
           <p>
              This Accreditation Agreement ("Agreement") is entered into by and between <strong>Digital Solutions Hub (DSH)</strong>, a global digital education authority ("Accreditor"), and the applying entity ("Partner"), collectively referred to as the "Parties".
           </p>

           <section>
              <h3 className="font-bold text-lg uppercase mb-2">1. Purpose & Authority</h3>
              <p>The Accreditor grants the Partner the non-exclusive, revocable right to operate as an <strong>Accredited Training Partner (ATP)</strong>, <strong>Accredited Instructor (AI)</strong>, or <strong>Accredited Franchise (AF)</strong> under the standards and curriculum of Digital Solutions Hub.</p>
           </section>

           <section>
              <h3 className="font-bold text-lg uppercase mb-2">2. Brand Usage Rights</h3>
              <p>The Partner is authorized to display the "Accredited by Digital Solutions Hub" badge and logo on marketing materials, websites, and premises, strictly in accordance with the DSH Brand Guidelines. Usage must not imply ownership of the DSH brand.</p>
           </section>

           <section>
              <h3 className="font-bold text-lg uppercase mb-2">3. Course Delivery & Standards</h3>
              <p>The Partner agrees to maintain the high quality of education mandated by DSH. This includes using approved curriculum, employing qualified instructors, and maintaining a student satisfaction rating of at least 4.0/5.0.</p>
           </section>

           <section>
              <h3 className="font-bold text-lg uppercase mb-2">4. Certification Authority</h3>
              <p>Certificates issued by the Partner must be generated through the DSH Central Verification System. Unauthorized issuance of certificates or bypassing the central system is grounds for immediate termination.</p>
           </section>

           <section>
              <h3 className="font-bold text-lg uppercase mb-2">5. Revenue Share & Fees</h3>
              <p>The Partner agrees to pay applicable accreditation fees and/or revenue shares as defined in their specific tiered plan (Gold, Silver, Platinum). Payments must be settled within 7 days of the invoice date.</p>
           </section>

           <section>
              <h3 className="font-bold text-lg uppercase mb-2">6. Audit & Compliance</h3>
              <p>DSH reserves the right to conduct scheduled or unscheduled audits of the Partner’s operations, student records, and teaching quality to ensure compliance with this Agreement.</p>
           </section>

           <section>
              <h3 className="font-bold text-lg uppercase mb-2">7. Termination</h3>
              <p>DSH may terminate this Agreement immediately upon breach of any terms, specifically regarding fraud, brand misuse, or failure to pay fees. Upon termination, the Partner must cease all use of DSH intellectual property.</p>
           </section>

           <section>
              <h3 className="font-bold text-lg uppercase mb-2">8. Jurisdiction</h3>
              <p>This Agreement shall be governed by international trade laws and the laws of the jurisdiction where Digital Solutions Hub is registered (Pakistan/Global Operations).</p>
           </section>

           <div className="pt-12 mt-12 border-t border-slate-200 grid grid-cols-2 gap-20">
              <div>
                 <p className="border-b border-black mb-2 h-8"></p>
                 <p className="font-bold text-xs uppercase">Signed for Digital Solutions Hub</p>
                 <p className="text-xs">Sarkar Azeem, CEO</p>
              </div>
              <div>
                 <p className="border-b border-black mb-2 h-8"></p>
                 <p className="font-bold text-xs uppercase">Signed for Partner</p>
                 <p className="text-xs">Authorized Representative</p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default AccreditationAgreement;
