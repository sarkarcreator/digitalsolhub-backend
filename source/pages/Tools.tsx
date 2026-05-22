
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';
import SEO from '../components/SEO';
import { Bot, FileText, Mail, Search, Sparkles, Code, Cpu, X, Play, Loader2 } from 'lucide-react';

const Tools: React.FC = () => {
  const { lang: paramLang } = useParams<{ lang: string }>();
  const lang = (Object.values(Language).includes(paramLang as Language)) ? (paramLang as Language) : Language.ENGLISH;
  
  const [activeTool, setActiveTool] = useState<any>(null);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const tools = [
    { id: 'mentor', title: 'AI Career Mentor', icon: Bot, desc: 'Get personalized career guidance.', placeholder: 'I want to become a web developer...' },
    { id: 'proposal', title: 'Proposal Generator', icon: FileText, desc: 'Write winning Upwork proposals.', placeholder: 'Client wants a React website...' },
    { id: 'lead', title: 'Lead Generator', icon: Search, desc: 'Find clients for your agency.', placeholder: 'Real estate agents in Dubai...' },
    { id: 'code', title: 'Code Assistant', icon: Code, desc: 'Debug and write code faster.', placeholder: 'Fix this React useEffect bug...' },
    { id: 'email', title: 'Cold Email Writer', icon: Mail, desc: 'Generate high-converting emails.', placeholder: 'Selling SEO services to dentists...' },
    { id: 'auto', title: 'Business Auto-Pilot', icon: Cpu, desc: 'Automate workflows with AI.', placeholder: 'Automate invoice generation...' },
  ];

  const handleLaunch = (tool: any) => {
      setActiveTool(tool);
      setInput('');
      setOutput('');
  };

  const handleGenerate = () => {
      if (!input.trim()) return;
      setLoading(true);
      setTimeout(() => {
          setOutput(`[AI Generated Response for ${activeTool.title}]\n\nHere is a tailored solution based on: "${input}"...\n\n(This is a simulation. Connect API Key for live results.)`);
          setLoading(false);
      }, 1500);
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-slate-950 font-sans text-white">
      <SEO title={`${TRANSLATIONS.ai_super_tools[lang]} | DSH`} description="Boost productivity with AI." lang={lang} />
      
      <div className="max-w-7xl mx-auto px-6">
         <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
               {TRANSLATIONS.ai_super_tools[lang]}
            </h1>
            <p className="text-gray-400 text-lg">Automate, Create, and Scale your business.</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tools.map((tool) => (
               <div 
                 key={tool.id} 
                 onClick={() => handleLaunch(tool)}
                 className="bg-slate-900 border border-white/10 p-8 rounded-2xl hover:border-purple-500/50 hover:bg-slate-800/50 transition-all group cursor-pointer relative overflow-hidden"
               >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <tool.icon className="w-12 h-12 text-purple-400 mb-6 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-bold text-white mb-2">{tool.title}</h3>
                  <p className="text-gray-400 text-sm mb-6">{tool.desc}</p>
                  <span className="text-purple-400 font-bold text-sm flex items-center gap-2">
                     {TRANSLATIONS.launch_tool[lang]} <Sparkles className="w-4 h-4" />
                  </span>
               </div>
            ))}
         </div>
      </div>

      {/* Tool Modal */}
      {activeTool && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in">
              <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-3xl h-[80vh] flex flex-col shadow-2xl overflow-hidden">
                  <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-800/50">
                      <div className="flex items-center gap-3">
                          <activeTool.icon className="w-6 h-6 text-purple-400" />
                          <h2 className="text-xl font-bold text-white">{activeTool.title}</h2>
                      </div>
                      <button onClick={() => setActiveTool(null)} className="text-gray-400 hover:text-white p-2 hover:bg-white/10 rounded-full"><X className="w-6 h-6"/></button>
                  </div>
                  
                  <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-6">
                      <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase">{TRANSLATIONS.lbl_input[lang]}</label>
                          <textarea 
                              value={input}
                              onChange={(e) => setInput(e.target.value)}
                              className="w-full h-32 bg-slate-950 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-purple-500 resize-none"
                              placeholder={activeTool.placeholder}
                          />
                      </div>
                      
                      <div className="flex justify-end">
                          <button 
                              onClick={handleGenerate} 
                              disabled={loading || !input.trim()}
                              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl flex items-center gap-2 disabled:opacity-50 transition-all"
                          >
                              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                              {TRANSLATIONS.btn_generate[lang]}
                          </button>
                      </div>

                      {output && (
                          <div className="space-y-2 flex-1 flex flex-col">
                              <label className="text-xs font-bold text-gray-500 uppercase">{TRANSLATIONS.lbl_output[lang]}</label>
                              <div className="flex-1 bg-slate-950/50 border border-white/5 rounded-xl p-6 text-gray-300 font-mono text-sm leading-relaxed overflow-y-auto">
                                  {output}
                              </div>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Tools;
