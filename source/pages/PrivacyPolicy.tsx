
import React from 'react';
import { useParams } from 'react-router-dom';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';
import SEO from '../components/SEO';
import { Shield, Lock } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  const { lang: paramLang } = useParams<{ lang: string }>();
  const lang = paramLang === Language.URDU ? Language.URDU : Language.ENGLISH;

  return (
    <div className="pt-24 pb-20 min-h-screen bg-slate-950">
      <SEO 
        title={`${TRANSLATIONS.privacy_policy[lang]} | Digital Solutions Hub`} 
        description="Our commitment to protecting your data." 
        lang={lang} 
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-neon/10 text-brand-neon mb-6">
             <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{TRANSLATIONS.privacy_policy[lang]}</h1>
          <p className="text-gray-400 text-lg">{TRANSLATIONS.data_protection_notice[lang]}</p>
        </div>

        <div className="space-y-8 text-gray-300 leading-relaxed bg-slate-900/50 p-8 md:p-12 rounded-2xl border border-white/10">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you create an account, subscribe to our newsletter, request customer support, or otherwise communicate with us. This may include your name, email address, phone number, and any other information you choose to provide.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
            <p>We use the information we collect to provide, maintain, and improve our services, to process your transactions, to send you related information including confirmations and invoices, and to communicate with you about products, services, offers, and events.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Data Security</h2>
            <div className="flex items-start gap-4 bg-slate-800/50 p-4 rounded-xl border border-white/5">
               <Lock className="w-6 h-6 text-green-400 shrink-0 mt-1" />
               <p className="text-sm">We implement industry-standard security measures, including 256-bit SSL encryption, to protect your personal information from unauthorized access, alteration, disclosure, or destruction.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Sharing of Information</h2>
            <p>We do not share your personal information with third parties except as described in this privacy policy or with your consent. We may disclose your information if we believe it is necessary to comply with a legal obligation or to protect our rights or property.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at <span className="text-brand-neon font-bold">support@digitalsolhub.com</span>.</p>
          </section>
        </div>

      </div>
    </div>
  );
};

export default PrivacyPolicy;
