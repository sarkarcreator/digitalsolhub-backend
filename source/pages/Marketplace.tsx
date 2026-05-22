
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Language } from '../types';
import SEO from '../components/SEO';
import { TRANSLATIONS } from '../constants';
import { Search, Star, Filter, Briefcase, Code, PenTool, Globe, DollarSign, X, CheckCircle, ArrowRight } from 'lucide-react';

const Marketplace: React.FC = () => {
  const { lang: paramLang } = useParams<{ lang: string }>();
  const lang = (Object.values(Language).includes(paramLang as Language)) ? (paramLang as Language) : Language.ENGLISH;
  const [selectedGig, setSelectedGig] = useState<any>(null);

  const categories = [
    { name: 'Development', icon: Code, count: 120 },
    { name: 'Design', icon: PenTool, count: 85 },
    { name: 'Marketing', icon: Globe, count: 64 },
    { name: 'Writing', icon: Briefcase, count: 42 },
  ];

  const gigs = [
    { id: 1, title: 'I will build a React Website', author: 'Ali Ahmed', rating: 4.9, price: '$50', image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&q=80&w=400', desc: 'Professional React JS website with responsive design, API integration, and modern UI/UX.' },
    { id: 2, title: 'Logo Design & Branding', author: 'Sarah K.', rating: 5.0, price: '$30', image: 'https://images.unsplash.com/photo-1626785774573-4b7993143a26?auto=format&fit=crop&q=80&w=400', desc: 'Unique logo concepts with complete branding kit including business card and letterhead.' },
    { id: 3, title: 'SEO Audit & Ranking', author: 'Sarkar Azeem', rating: 5.0, price: '$100', image: 'https://images.unsplash.com/photo-1571786256017-aee7a0c009b6?auto=format&fit=crop&q=80&w=400', desc: 'Comprehensive SEO audit and optimization to rank your website on the first page of Google.' },
    { id: 4, title: 'Social Media Management', author: 'Zainab B.', rating: 4.8, price: '$200', image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=400', desc: 'Monthly management of Facebook, Instagram, and LinkedIn with content creation and posting.' },
  ];

  return (
    <div className="pt-24 pb-20 min-h-screen bg-slate-950 font-sans text-white">
      <SEO title={`${TRANSLATIONS.marketplace[lang]} | DSH`} description="Hire top talent." lang={lang} />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
           <h1 className="text-4xl font-bold mb-4">{TRANSLATIONS.find_talent[lang]}</h1>
           <p className="text-gray-400 mb-8">Hire expert freelancers for your next project.</p>
           
           <div className="max-w-2xl mx-auto relative">
              <input type="text" placeholder={TRANSLATIONS.search[lang]} className="w-full bg-slate-900 border border-white/10 rounded-full py-4 pl-6 pr-14 text-white focus:outline-none focus:border-green-500 transition-colors" />
              <button className="absolute right-2 top-2 p-2 bg-green-500 rounded-full text-black hover:bg-green-400 rtl:right-auto rtl:left-2">
                 <Search className="w-6 h-6" />
              </button>
           </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
           {categories.map((cat, i) => (
              <div key={i} className="bg-slate-900/50 p-6 rounded-xl border border-white/5 hover:border-green-500/50 transition-all cursor-pointer text-center group">
                 <cat.icon className="w-8 h-8 mx-auto mb-3 text-gray-400 group-hover:text-green-400" />
                 <h3 className="font-bold text-white">{cat.name}</h3>
                 <p className="text-xs text-gray-500">{cat.count} Gigs</p>
              </div>
           ))}
        </div>

        {/* Gigs */}
        <h2 className="text-2xl font-bold mb-8">{TRANSLATIONS.popular_gigs[lang]}</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           {gigs.map((gig) => (
              <div 
                key={gig.id} 
                onClick={() => setSelectedGig(gig)}
                className="bg-slate-900 rounded-xl overflow-hidden border border-white/5 hover:border-white/20 transition-all group cursor-pointer"
              >
                 <div className="h-48 overflow-hidden relative">
                    <img src={gig.image} alt={gig.title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                 </div>
                 <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                       <h3 className="font-bold text-white line-clamp-2 hover:underline">{gig.title}</h3>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                       <div className="w-6 h-6 rounded-full bg-slate-700"></div>
                       <span className="text-sm text-gray-400">{gig.author}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-white/5 pt-3">
                       <div className="flex items-center gap-1 text-yellow-400 text-sm font-bold">
                          <Star className="w-4 h-4 fill-current" /> {gig.rating}
                       </div>
                       <div className="text-green-400 font-bold">
                          {TRANSLATIONS.starting_at[lang]} <span className="text-lg">{gig.price}</span>
                       </div>
                    </div>
                 </div>
              </div>
           ))}
        </div>
      </div>

      {/* Gig Modal */}
      {selectedGig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
           <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative">
              <div className="relative h-64">
                 <img src={selectedGig.image} alt={selectedGig.title} loading="eager" className="w-full h-full object-cover" />
                 <button onClick={() => setSelectedGig(null)} className="absolute top-4 right-4 bg-black/50 p-2 rounded-full hover:bg-black/80 text-white z-10 rtl:right-auto rtl:left-4">
                    <X className="w-5 h-5" />
                 </button>
              </div>
              <div className="p-8">
                 <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-1">{selectedGig.title}</h2>
                        <p className="text-green-400 font-medium">{selectedGig.author}</p>
                    </div>
                    <div className="text-2xl font-bold text-white">{selectedGig.price}</div>
                 </div>
                 
                 <p className="text-gray-300 mb-8 leading-relaxed">
                    {selectedGig.desc}
                 </p>

                 <div className="flex gap-4">
                    <Link to={`/${lang}/contact`} className="flex-1 bg-green-500 hover:bg-green-600 text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
                       {TRANSLATIONS.btn_hire_now[lang]} <ArrowRight className="w-5 h-5 rtl:rotate-180" />
                    </Link>
                    <button className="px-4 py-3 border border-white/10 rounded-xl hover:bg-white/5 text-white">
                       {TRANSLATIONS.btn_message[lang]}
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
