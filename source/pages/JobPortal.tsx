
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';
import SEO from '../components/SEO';
import { Briefcase, MapPin, DollarSign, Clock, Search, X, Upload, CheckCircle } from 'lucide-react';

const JobPortal: React.FC = () => {
  const { lang: paramLang } = useParams<{ lang: string }>();
  const lang = (Object.values(Language).includes(paramLang as Language)) ? (paramLang as Language) : Language.ENGLISH;
  
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [applied, setApplied] = useState(false);

  const jobs = [
    { id: 1, title: 'Senior React Developer', company: 'TechFlow', location: 'Remote', type: 'Full-time', salary: '$3000 - $5000', desc: 'We are looking for an experienced React developer to lead our frontend team.' },
    { id: 2, title: 'Digital Marketing Specialist', company: 'GrowFast Agency', location: 'Dubai', type: 'Contract', salary: 'AED 5000', desc: 'Manage PPC campaigns and social media strategy for international clients.' },
    { id: 3, title: 'SEO Executive', company: 'DSH HQ', location: 'Islamabad', type: 'Full-time', salary: 'PKR 80,000', desc: 'Optimize website content and build backlinks to improve organic ranking.' },
    { id: 4, title: 'Graphic Design Intern', company: 'Creative Studio', location: 'Lahore', type: 'Internship', salary: 'PKR 25,000', desc: 'Assist senior designers in creating social media posts and branding materials.' },
  ];

  const handleApply = () => {
      setApplied(true);
      setTimeout(() => {
          setApplied(false);
          setSelectedJob(null);
      }, 2000);
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-slate-950 font-sans text-white">
      <SEO title={`${TRANSLATIONS.jobs[lang]} | DSH`} description="Find your dream job." lang={lang} />
      
      <div className="max-w-6xl mx-auto px-6">
         <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">{TRANSLATIONS.find_job[lang]}</h1>
            <p className="text-gray-400 mb-8">Connecting talent with top global companies.</p>
            <div className="flex gap-4 max-w-2xl mx-auto">
               <div className="flex-1 relative">
                  <Search className="absolute left-4 top-3.5 text-gray-500 w-5 h-5 rtl:right-4 rtl:left-auto" />
                  <input type="text" placeholder={TRANSLATIONS.search[lang]} className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 pl-12 pr-4 rtl:pr-12 rtl:pl-4 text-white focus:outline-none focus:border-blue-500" />
               </div>
               <button className="px-8 py-3 bg-blue-600 rounded-xl font-bold hover:bg-blue-700 transition-colors">Search</button>
            </div>
         </div>

         <div className="space-y-4">
            {jobs.map((job) => (
               <div key={job.id} className="bg-slate-900/50 border border-white/5 p-6 rounded-xl flex flex-col md:flex-row justify-between items-center hover:border-blue-500/30 transition-all group">
                  <div className="flex items-center gap-6 mb-4 md:mb-0 w-full md:w-auto">
                     <div className="w-16 h-16 bg-slate-800 rounded-lg flex items-center justify-center text-gray-400 text-xl font-bold">
                        {job.company[0]}
                     </div>
                     <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{job.title}</h3>
                        <p className="text-gray-400 text-sm">{job.company}</p>
                     </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 md:gap-8 items-center text-sm text-gray-400 w-full md:w-auto justify-between md:justify-end">
                     <div className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location}</div>
                     <div className="flex items-center gap-1"><Clock className="w-4 h-4" /> {job.type}</div>
                     <div className="flex items-center gap-1 text-green-400 font-bold"><DollarSign className="w-4 h-4" /> {job.salary}</div>
                     <button 
                        onClick={() => setSelectedJob(job)}
                        className="px-6 py-2 border border-white/10 rounded-lg hover:bg-white hover:text-black transition-colors font-bold"
                     >
                        {TRANSLATIONS.apply_job[lang]}
                     </button>
                  </div>
               </div>
            ))}
         </div>
      </div>

      {/* Application Modal */}
      {selectedJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
              <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg p-8 relative shadow-2xl">
                  <button onClick={() => setSelectedJob(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white rtl:right-auto rtl:left-4"><X className="w-5 h-5"/></button>
                  
                  {applied ? (
                      <div className="text-center py-12">
                          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                          <h3 className="text-2xl font-bold text-white">Application Sent!</h3>
                          <p className="text-gray-400">Good luck! We will notify you soon.</p>
                      </div>
                  ) : (
                      <>
                          <h2 className="text-2xl font-bold text-white mb-2">{selectedJob.title}</h2>
                          <p className="text-blue-400 font-medium mb-6">{selectedJob.company} • {selectedJob.location}</p>
                          
                          <div className="mb-6 p-4 bg-slate-800/50 rounded-xl text-gray-300 text-sm leading-relaxed">
                              {selectedJob.desc}
                          </div>

                          <div className="space-y-4">
                              <div>
                                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{TRANSLATIONS.lbl_upload_cv[lang]}</label>
                                  <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 text-center hover:border-blue-500 cursor-pointer transition-colors">
                                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                      <p className="text-sm text-gray-300">Click to upload PDF</p>
                                  </div>
                              </div>
                              <button onClick={handleApply} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all">
                                  {TRANSLATIONS.btn_submit_app[lang]}
                              </button>
                          </div>
                      </>
                  )}
              </div>
          </div>
      )}
    </div>
  );
};

export default JobPortal;
