
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Language, EmployerAccount, ApiKey } from '../types';
import { getEmployerAccount, generateApiKey, revokeApiKey, simulateApiCall } from '../utils/apiManager';
import SEO from '../components/SEO';
import { 
  LayoutDashboard, Key, Shield, Activity, FileText, Plus, Trash2, 
  Copy, Check, Play, Loader2, Download, AlertTriangle
} from 'lucide-react';
import Logo from '../components/Logo';

const EmployerDashboard: React.FC = () => {
  const { lang: paramLang } = useParams<{ lang: string }>();
  const lang = (Object.values(Language).includes(paramLang as Language)) ? (paramLang as Language) : Language.ENGLISH;
  
  const [account, setAccount] = useState<EmployerAccount | null>(null);
  const [view, setView] = useState<'overview' | 'keys' | 'sandbox'>('overview');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  
  // Sandbox State
  const [sandboxMethod, setSandboxMethod] = useState<'GET' | 'POST'>('GET');
  const [sandboxEndpoint, setSandboxEndpoint] = useState('/verify/certificate/DSH-FREELANCE-2024-001');
  const [sandboxBody, setSandboxBody] = useState('');
  const [sandboxResponse, setSandboxResponse] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load initial data
    setAccount(getEmployerAccount());
  }, []);

  const refreshAccount = () => {
    setAccount(getEmployerAccount());
  };

  const handleCreateKey = () => {
    const label = prompt("Enter a label for this key (e.g. Production Server):");
    if (label) {
        generateApiKey(label);
        refreshAccount();
    }
  };

  const handleRevokeKey = (key: string) => {
      if(confirm("Are you sure? This action cannot be undone.")) {
          revokeApiKey(key);
          refreshAccount();
      }
  };

  const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text);
      setCopiedKey(text);
      setTimeout(() => setCopiedKey(null), 2000);
  };

  const runSimulation = async () => {
      if(!account?.apiKeys.find(k => k.status === 'Active')) {
          setSandboxResponse(JSON.stringify({ error: "No active API Key found. Create one first." }, null, 2));
          return;
      }
      
      setLoading(true);
      const activeKey = account.apiKeys.find(k => k.status === 'Active')?.key;
      
      let payload = undefined;
      if (sandboxMethod === 'POST' && sandboxBody) {
          try {
              payload = JSON.parse(sandboxBody);
          } catch(e) {
              setSandboxResponse(JSON.stringify({ error: "Invalid JSON Body" }, null, 2));
              setLoading(false);
              return;
          }
      }

      const res = await simulateApiCall(sandboxEndpoint, sandboxMethod, payload, activeKey);
      setSandboxResponse(JSON.stringify(res, null, 2));
      setLoading(false);
      refreshAccount(); // Update logs
  };

  if (!account) return null;

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-white flex">
      <SEO title="Employer Dashboard | DSH API" description="Manage API keys and integration." lang={lang} />

      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-white/10 hidden md:flex flex-col">
         <div className="h-20 flex items-center px-6 border-b border-white/10">
            <Logo className="w-8 h-8" />
            <span className="ml-3 font-bold text-sm">Developer Console</span>
         </div>
         <div className="p-4 space-y-1">
            <button onClick={() => setView('overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${view === 'overview' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                <LayoutDashboard className="w-4 h-4" /> Overview
            </button>
            <button onClick={() => setView('keys')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${view === 'keys' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                <Key className="w-4 h-4" /> API Keys
            </button>
            <button onClick={() => setView('sandbox')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${view === 'sandbox' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                <Activity className="w-4 h-4" /> API Playground
            </button>
         </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
         <header className="h-20 border-b border-white/10 flex items-center justify-between px-8 bg-slate-900/50 backdrop-blur-md">
            <h1 className="text-xl font-bold">{account.companyName}</h1>
            <div className="flex items-center gap-4">
               <span className="text-xs font-bold px-3 py-1 bg-green-500/20 text-green-400 rounded-full border border-green-500/30">Trust Score: {account.trustScore}/100</span>
               <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold">TR</div>
            </div>
         </header>

         <div className="flex-1 overflow-auto p-8">
            
            {/* VIEW: OVERVIEW */}
            {view === 'overview' && (
               <div className="space-y-8 animate-in fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div className="bg-slate-900 border border-white/5 p-6 rounded-xl">
                        <div className="flex justify-between items-start mb-4">
                           <div className="p-3 bg-blue-500/20 text-blue-400 rounded-lg"><Activity className="w-6 h-6"/></div>
                        </div>
                        <h3 className="text-3xl font-bold mb-1">{account.logs.length}</h3>
                        <p className="text-sm text-gray-400">Total Requests</p>
                     </div>
                     <div className="bg-slate-900 border border-white/5 p-6 rounded-xl">
                        <div className="flex justify-between items-start mb-4">
                           <div className="p-3 bg-green-500/20 text-green-400 rounded-lg"><Shield className="w-6 h-6"/></div>
                        </div>
                        <h3 className="text-3xl font-bold mb-1">{account.plan}</h3>
                        <p className="text-sm text-gray-400">Current Plan</p>
                     </div>
                  </div>

                  <div className="bg-slate-900 border border-white/5 rounded-xl overflow-hidden">
                     <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center">
                        <h3 className="font-bold">Recent API Logs</h3>
                        <button className="text-xs text-blue-400 hover:underline">View All</button>
                     </div>
                     <table className="w-full text-sm text-left text-gray-400">
                        <thead className="bg-slate-950 text-gray-500 uppercase text-xs font-bold">
                           <tr>
                              <th className="px-6 py-3">Time</th>
                              <th className="px-6 py-3">Method</th>
                              <th className="px-6 py-3">Endpoint</th>
                              <th className="px-6 py-3">Status</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                           {account.logs.map(log => (
                              <tr key={log.id} className="hover:bg-white/5">
                                 <td className="px-6 py-3 font-mono text-xs">{new Date(log.timestamp).toLocaleTimeString()}</td>
                                 <td className="px-6 py-3"><span className={`px-2 py-0.5 rounded text-xs font-bold ${log.method === 'GET' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}`}>{log.method}</span></td>
                                 <td className="px-6 py-3 font-mono text-xs truncate max-w-[200px]">{log.endpoint}</td>
                                 <td className="px-6 py-3">
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${log.status === 200 ? 'text-green-400' : 'text-red-400'}`}>
                                       {log.status}
                                    </span>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            )}

            {/* VIEW: KEYS */}
            {view === 'keys' && (
               <div className="space-y-6 animate-in fade-in">
                  <div className="flex justify-between items-center">
                     <h2 className="text-2xl font-bold">API Keys</h2>
                     <button onClick={handleCreateKey} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-bold transition-colors">
                        <Plus className="w-4 h-4" /> Generate New Key
                     </button>
                  </div>

                  <div className="space-y-4">
                     {account.apiKeys.map((k, i) => (
                        <div key={i} className="bg-slate-900 border border-white/5 p-6 rounded-xl flex items-center justify-between group">
                           <div>
                              <div className="flex items-center gap-3 mb-1">
                                 <span className="font-bold text-white">{k.label}</span>
                                 <span className={`text-[10px] px-2 py-0.5 rounded border uppercase font-bold ${k.status === 'Active' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>{k.status}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                 <code className="bg-black/30 px-2 py-1 rounded text-xs text-gray-300 font-mono">
                                    {k.status === 'Active' ? k.key : '••••••••••••••••••••'}
                                 </code>
                                 {k.status === 'Active' && (
                                    <button onClick={() => copyToClipboard(k.key)} className="text-gray-500 hover:text-white transition-colors">
                                       {copiedKey === k.key ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                                    </button>
                                 )}
                              </div>
                              <p className="text-xs text-gray-500 mt-2">Created: {new Date(k.createdAt).toLocaleDateString()}</p>
                           </div>
                           {k.status === 'Active' && (
                              <button onClick={() => handleRevokeKey(k.key)} className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                                 <Trash2 className="w-5 h-5" />
                              </button>
                           )}
                        </div>
                     ))}
                  </div>
               </div>
            )}

            {/* VIEW: SANDBOX */}
            {view === 'sandbox' && (
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full animate-in fade-in">
                  <div className="flex flex-col gap-6">
                     <div>
                        <h2 className="text-2xl font-bold mb-2">API Playground</h2>
                        <p className="text-gray-400 text-sm">Test endpoints directly in your browser.</p>
                     </div>

                     <div className="space-y-4">
                        <div>
                           <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Endpoint</label>
                           <div className="flex gap-2">
                              <select 
                                 value={sandboxMethod} 
                                 onChange={(e) => setSandboxMethod(e.target.value as any)} 
                                 className="bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm font-bold focus:border-blue-500 outline-none"
                              >
                                 <option>GET</option>
                                 <option>POST</option>
                              </select>
                              <input 
                                 type="text" 
                                 value={sandboxEndpoint} 
                                 onChange={(e) => setSandboxEndpoint(e.target.value)} 
                                 className="flex-1 bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm font-mono text-white focus:border-blue-500 outline-none"
                              />
                           </div>
                        </div>

                        {sandboxMethod === 'POST' && (
                           <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Request Body (JSON)</label>
                              <textarea 
                                 value={sandboxBody}
                                 onChange={(e) => setSandboxBody(e.target.value)}
                                 rows={6}
                                 className="w-full bg-slate-900 border border-white/10 rounded-lg p-3 text-sm font-mono text-gray-300 focus:border-blue-500 outline-none"
                                 placeholder='{ "ids": ["DSH-..." ] }'
                              />
                           </div>
                        )}

                        <button 
                           onClick={runSimulation}
                           disabled={loading}
                           className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                        >
                           {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                           Send Request
                        </button>
                     </div>
                  </div>

                  <div className="flex flex-col h-full">
                     <div className="flex justify-between items-center mb-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase">Response</label>
                        <span className="text-xs text-green-400 font-mono">200 OK</span>
                     </div>
                     <div className="flex-1 bg-slate-900 border border-white/10 rounded-xl p-4 overflow-auto font-mono text-xs text-blue-300 relative group">
                        <pre>{sandboxResponse || '// Response will appear here...'}</pre>
                        {sandboxResponse && (
                           <button onClick={() => copyToClipboard(sandboxResponse)} className="absolute top-2 right-2 p-2 bg-black/50 rounded hover:bg-white/10 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Copy className="w-3 h-3" />
                           </button>
                        )}
                     </div>
                  </div>
               </div>
            )}

         </div>
      </main>
    </div>
  );
};

export default EmployerDashboard;
