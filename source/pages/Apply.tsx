import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { TRANSLATIONS } from '../constants';
import { Language } from '../types';
import SEO from '../components/SEO';
import { sendNotifications } from '../utils/notifications';
import { Upload, Check, Send, Loader2 } from 'lucide-react';

const Apply: React.FC = () => {
  const { lang: paramLang } = useParams<{ lang: string }>();
  const lang = paramLang === Language.URDU ? Language.URDU : Language.ENGLISH;
  
  const [formStep, setFormStep] = useState(0);
  const [applicationType, setApplicationType] = useState('admission');
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    targetCountry: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await sendNotifications('COURSE_ENROLLMENT', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        details: `Type: ${applicationType}${formData.targetCountry ? `, Country: ${formData.targetCountry}` : ''}`
      });

      if (result.success) {
        window.open(result.adminUrl, '_blank');
        setFormStep(2);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-slate-950">
      <SEO 
        title={TRANSLATIONS.metaTitleApply[lang]} 
        description={TRANSLATIONS.metaDescApply[lang]} 
        lang={lang} 
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{TRANSLATIONS.apply[lang]}</h1>
          <p className="text-gray-400">{TRANSLATIONS.metaDescApply[lang]}</p>
        </div>

        {formStep === 2 ? (
          <div className="bg-slate-900 border border-green-500/30 rounded-2xl p-12 text-center animate-float">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{TRANSLATIONS.appSubmitted[lang]}</h2>
            <p className="text-gray-400 mb-8">{TRANSLATIONS.thankYouApp[lang]}</p>
            <p className="text-sm text-gray-500 mb-8">Admin notified via WhatsApp.</p>
            <button onClick={() => setFormStep(0)} className="px-6 py-2 bg-slate-800 text-white rounded hover:bg-slate-700 transition-colors">
              {TRANSLATIONS.submitAnother[lang]}
            </button>
          </div>
        ) : (
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 md:p-10 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{TRANSLATIONS.appType[lang]}</label>
                <select 
                  value={applicationType} 
                  onChange={(e) => setApplicationType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500 transition-colors relative z-10"
                >
                  <option value="admission">{TRANSLATIONS.svc_admission[lang]}</option>
                  <option value="job">{TRANSLATIONS.svc_jobs[lang]}</option>
                  <option value="course">{TRANSLATIONS.svc_skills[lang]}</option>
                  <option value="visa">{TRANSLATIONS.svc_visa[lang]}</option>
                  <option value="certification">{lang === Language.ENGLISH ? 'Online Certification' : 'آن لائن سرٹیفیکیشن'}</option>
                  <option value="freelance">{lang === Language.ENGLISH ? 'Freelance Program' : 'فری لانس پروگرام'}</option>
                  <option value="fbr">{TRANSLATIONS.svc_fbr[lang]}</option>
                  <option value="consult">{TRANSLATIONS.svc_consult[lang]}</option>
                </select>
              </div>

              {/* Personal Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">{TRANSLATIONS.full_name[lang]}</label>
                  <input name="name" value={formData.name} onChange={handleInputChange} required type="text" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500 transition-colors" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">{TRANSLATIONS.phone_num[lang]}</label>
                  <input name="phone" value={formData.phone} onChange={handleInputChange} required type="tel" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500 transition-colors" placeholder="+92 301 7862281" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{TRANSLATIONS.email[lang]}</label>
                <input name="email" value={formData.email} onChange={handleInputChange} required type="email" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500 transition-colors" placeholder="john@example.com" />
              </div>

              {/* Dynamic Fields based on Type */}
              {applicationType === 'visa' && (
                 <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">{TRANSLATIONS.country[lang]}</label>
                    <input name="targetCountry" value={formData.targetCountry} onChange={handleInputChange} type="text" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500 transition-colors" placeholder="e.g. Canada, UK, Dubai" />
                 </div>
              )}

              {/* File Upload */}
              <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center hover:border-gold-500/50 transition-colors cursor-pointer bg-slate-950/50">
                <input type="file" className="hidden" id="file-upload" />
                <label htmlFor="file-upload" className="cursor-pointer">
                   <Upload className="w-10 h-10 text-gray-500 mx-auto mb-3" />
                   <p className="text-sm text-gray-300 font-medium">{TRANSLATIONS.uploadDoc[lang]}</p>
                   <p className="text-xs text-gray-500 mt-1">CV, ID Card, or Educational Certificates (PDF/JPG)</p>
                </label>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg py-4 rounded-lg shadow-lg shadow-purple-900/20 hover:shadow-purple-900/40 transition-all flex items-center justify-center gap-2">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>
                    <span>{TRANSLATIONS.submitApp[lang]}</span>
                    <Send className="w-5 h-5 rtl:rotate-180" />
                  </>
                )}
              </button>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};

export default Apply;
