
import React from 'react';
import { useParams } from 'react-router-dom';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';
import SEO from '../components/SEO';
import { FileText } from 'lucide-react';

const Terms: React.FC = () => {
  const { lang: paramLang } = useParams<{ lang: string }>();
  const lang = paramLang === Language.URDU ? Language.URDU : Language.ENGLISH;

  return (
    <div className="pt-24 pb-20 min-h-screen bg-slate-950">
      <SEO 
        title={`${TRANSLATIONS.terms_conditions[lang]} | Digital Solutions Hub`} 
        description="Terms of service and usage guidelines." 
        lang={lang} 
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 text-blue-400 mb-6">
             <FileText className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{TRANSLATIONS.terms_conditions[lang]}</h1>
          <p className="text-gray-400 text-lg">{TRANSLATIONS.trusted_partner[lang]}</p>
        </div>

        <div className="space-y-8 text-gray-300 leading-relaxed bg-slate-900/50 p-8 md:p-12 rounded-2xl border border-white/10">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
            <p>By accessing or using our website and services, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Services</h2>
            <p>Digital Solutions Hub provides digital services including but not limited to web development, digital marketing, and online education. We reserve the right to modify or discontinue any service at any time without notice.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. User Accounts</h2>
            <p>To access certain features, you may be required to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Intellectual Property</h2>
            <p>All content included on this site, such as text, graphics, logos, images, and software, is the property of Digital Solutions Hub or its content suppliers and protected by international copyright laws.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Limitation of Liability</h2>
            <p>Digital Solutions Hub shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the services.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Changes to Terms</h2>
            <p>We reserve the right to modify these terms at any time. We will notify you of any changes by posting the new Terms and Conditions on this page.</p>
          </section>
        </div>

      </div>
    </div>
  );
};

export default Terms;
