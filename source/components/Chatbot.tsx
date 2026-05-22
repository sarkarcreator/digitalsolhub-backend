import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { MessageSquare, Send, X, Minimize2, User, Bot, Loader2, Phone, ShieldCheck, Sparkles, Mic, MicOff, Volume2, WifiOff } from 'lucide-react';
import { Language } from '../types';
import Logo from './Logo';
import { ADMIN_WHATSAPP } from '../utils/notifications';

interface ChatbotProps {
  lang: Language;
}

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  action?: {
    label: string;
    path?: string;
    url?: string;
  };
}

const Chatbot: React.FC<ChatbotProps> = ({ lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'text' | 'voice'>('text');
  
  // Text Chat State
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTextLoading, setIsTextLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Voice Chat State
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false); // Model is speaking
  const [voiceStatus, setVoiceStatus] = useState<'idle' | 'connecting' | 'listening' | 'speaking' | 'error'>('idle');
  
  // Refs for Audio Handling
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  
  const navigate = useNavigate();

  // --- Common Logic ---

  const getSystemInstruction = () => {
    // Map internal language codes to full names for the AI
    const langMap: Record<string, string> = {
      [Language.ENGLISH]: 'English',
      [Language.URDU]: 'Urdu',
      [Language.ARABIC]: 'Arabic',
      [Language.RUSSIAN]: 'Russian'
    };

    const currentLangName = langMap[lang] || 'English';

    return `
    SYSTEM ROLE:
    You are the intelligent automation bot for "Digital Solutions Hub".
    Your goal is to follow the defined flows and provide clear, localized responses.

    LANGUAGE RULE:
    - Current Language: **${currentLangName}**.
    - If Urdu: use Urdu (or Roman Urdu) where appropriate; otherwise prefer the target language.

    AUTOMATION SCRIPTS (SUMMARY):

    STEP 1: GREETING
    (Trigger: Hi/Hello/Start)
    Greet the user, present options, and wait for a numeric or short text selection.

    STEP 2A: STUDENT FLOW
    (Triggers: "1", "Student", "Learn")
    - Ask for user's goal, provide options (Online Earning, Freelancing, Digital Business, AI & Automation).
    - Allow commands: START, PRICE, JOIN to proceed or view pricing.

    STEP 2B: CLIENT FLOW
    (Triggers: "2", "Client", "Business")
    - Ask for service selection and basic details (business type, website, budget).
    - Offer to create a service request.

    STEP 2C: SUPPORT FLOW
    (Triggers: "3", "Support")
    - Ask the user to describe the issue.
    - For urgent matters provide WhatsApp contact: https://wa.me/${ADMIN_WHATSAPP}

    GENERAL:
    - Keep replies short, actionable, and polite.
    - When an action token like [ACTION:APPLY] or [ACTION:WHATSAPP] appears, expose a corresponding button.
    - Do not include internal tokens in the final user-visible text.
    `;
  };

  // --- Text Chat Logic ---

  useEffect(() => {
    // Initial Greeting matches Step 1
    const greetings: Record<string, string> = {
      [Language.ENGLISH]: "Assalam-o-Alaikum 👋\nWelcome to Digital Solutions Hub 🏆\n\nPlease choose one option:\n\n1. Learn Digital Skills (Student)\n2. Business Services (Client)\n3. Talk to Support",
      [Language.URDU]: "السلام علیکم 👋\nDigital Solutions Hub میں خوش آمدید 🏆\n\nبراہِ کرم ایک اختیار منتخب کریں:\n\n1. کورسز (طالب علم)\n2. کاروباری خدمات (کلائنٹ)\n3. سپورٹ سے رابطہ کریں",
      [Language.ARABIC]: "السلام عليكم 👋\nمرحبًا بكم في Digital Solutions Hub 🏆\n\nالرجاء اختيار أحد الخيارات:\n\n1. تعلم المهارات (طالب)\n2. خدمات الأعمال (عميل)\n3. تحدث إلى الدعم",
      [Language.RUSSIAN]: "Ассаляму алейкум 👋\nДобро пожаловать в Digital Solutions Hub 🏆\n\nПожалуйста, выберите опцию:\n\n1. Обучение (Студент)\n2. Бизнес услуги (Клиент)\n3. Обратиться в поддержку"
    };

    const initialMessage = ({
      [Language.ENGLISH]: "Assalam-o-Alaikum 👋\nWelcome to Digital Solutions Hub 🏆\n\nPlease choose one option:\n\n1. Learn Digital Skills (Student)\n2. Business Services (Client)\n3. Talk to Support",
      [Language.URDU]: "السلام علیکم 👋\nDigital Solutions Hub میں خوش آمدید 🏆\n\nبراہِ کرم ایک اختیار منتخب کریں:\n\n1. کورسز (طالب علم)\n2. کاروباری خدمات (کلائنٹ)\n3. سپورٹ سے رابطہ کریں",
      [Language.ARABIC]: "السلام عليكم 👋\nمرحبًا بكم في Digital Solutions Hub 🏆\n\nالرجاء اختيار أحد الخيارات:\n\n1. تعلم المهارات (طالب)\n2. خدمات الأعمال (عميل)\n3. تحدث إلى الدعم",
      [Language.RUSSIAN]: "Ассаляму алейкум 👋\nДобро пожаловать в Digital Solutions Hub 🏆\n\nПожалуйста, выберите опцию:\n\n1. Обучение (Студент)\n2. Бизнес услуги (Клиент)\n3. Обратиться в поддержку"
    } as Record<string, string>)[lang] || greetings[Language.ENGLISH];

    setMessages([{ id: 'init', role: 'model', text: initialMessage }]);
  }, [lang]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen, mode]);

  const handleTextGenerate = async (userText: string) => {
    setIsTextLoading(true);
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: userText };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    try {
      // Prefer server-side AI proxy. Backend should proxy requests to Gemini/GenAI.
      const resp = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: getSystemInstruction(),
          history: messages,
          prompt: userText,
        }),
      });

      if (!resp.ok) {
        throw new Error('AI service error');
      }

      const json = await resp.json();
      const responseText = (json?.text as string) || "Please contact our team on WhatsApp: +1 917 695 7737";
      
      // Auto-detect actions based on AI response content
      let action = undefined;
      const lowerText = responseText.toLowerCase();
      
      if (lowerText.includes('[action:apply]')) {
        action = { label: 'Apply Now', path: `/${lang}/apply` };
      } else if (lowerText.includes('[action:whatsapp]') || lowerText.includes('whatsapp')) {
        action = { label: 'WhatsApp', url: `https://wa.me/${ADMIN_WHATSAPP}` };
      } else if (lowerText.includes('sign up') || lowerText.includes('register')) {
        action = { label: 'Register', path: `/${lang}/signup` };
      }

      // Clean text tokens
      const cleanText = responseText.replace(/\[ACTION:.*?\]/g, '').trim();

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: cleanText,
        action
      }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: `Service temporarily unavailable. Please contact WhatsApp: +1 917 695 7737 (https://wa.me/${ADMIN_WHATSAPP})` }]);
    } finally {
      setIsTextLoading(false);
    }
  };

  // --- Voice Chat Logic (Live API) ---

  const base64ToUint8Array = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const floatTo16BitPCM = (input: Float32Array) => {
    const output = new Int16Array(input.length);
    for (let i = 0; i < input.length; i++) {
      const s = Math.max(-1, Math.min(1, input[i]));
      output[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return output;
  };

  const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const connectToLiveAPI = async () => {
    setVoiceStatus('connecting');
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_API_KEY || process.env.API_KEY || process.env.GEMINI_API_KEY || '';
      if (!apiKey) {
        setVoiceStatus('error');
        throw new Error('Gemini API key not configured');
      }
      const ai = new GoogleGenAI({ apiKey });
      
      inputContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setIsConnected(true);
            setVoiceStatus('listening');
            
            const source = inputContextRef.current!.createMediaStreamSource(stream);
            const processor = inputContextRef.current!.createScriptProcessor(4096, 1, 1);
            
            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcm16 = floatTo16BitPCM(inputData);
              const base64Audio = arrayBufferToBase64(pcm16.buffer);
              
              sessionPromiseRef.current?.then((session) => {
                session.sendRealtimeInput({
                  media: { mimeType: 'audio/pcm;rate=16000', data: base64Audio }
                });
              });
            };

            source.connect(processor);
            processor.connect(inputContextRef.current!.destination);
            sourceRef.current = source;
            processorRef.current = processor;
          },
          onmessage: async (msg: LiveServerMessage) => {
            const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioData) {
              setVoiceStatus('speaking');
              setIsSpeaking(true);
              
              const audioBytes = base64ToUint8Array(audioData);
              const dataInt16 = new Int16Array(audioBytes.buffer);
              const audioBuffer = audioContextRef.current!.createBuffer(1, dataInt16.length, 24000);
              const channelData = audioBuffer.getChannelData(0);
              for (let i = 0; i < dataInt16.length; i++) {
                 channelData[i] = dataInt16[i] / 32768.0;
              }

              const source = audioContextRef.current!.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(audioContextRef.current!.destination);
              
              const currentTime = audioContextRef.current!.currentTime;
              const startTime = Math.max(currentTime, nextStartTimeRef.current);
              source.start(startTime);
              nextStartTimeRef.current = startTime + audioBuffer.duration;

              source.onended = () => {
                 if (audioContextRef.current!.currentTime >= nextStartTimeRef.current - 0.1) {
                    setIsSpeaking(false);
                    setVoiceStatus('listening');
                 }
              };
            }
          },
          onclose: () => disconnectVoice(),
          onerror: (err) => {
            console.error(err);
            setVoiceStatus('error');
            disconnectVoice();
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } }
          },
          systemInstruction: getSystemInstruction()
        }
      });

      sessionPromiseRef.current = sessionPromise;

    } catch (error) {
      console.error(error);
      setVoiceStatus('error');
    }
  };

  const disconnectVoice = () => {
    setIsConnected(false);
    setIsSpeaking(false);
    setVoiceStatus('idle');
    
    streamRef.current?.getTracks().forEach(track => track.stop());
    sourceRef.current?.disconnect();
    processorRef.current?.disconnect();
    inputContextRef.current?.close();
    audioContextRef.current?.close();
    
    inputContextRef.current = null;
    audioContextRef.current = null;
    sessionPromiseRef.current = null;
    nextStartTimeRef.current = 0;
  };

  useEffect(() => {
    return () => disconnectVoice();
  }, []);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-brand-blue to-brand-neon text-white shadow-[0_0_30px_rgba(6,182,212,0.4)] flex items-center justify-center hover:scale-110 transition-transform animate-float group"
      >
        <Sparkles className="w-8 h-8 absolute animate-pulse opacity-50" />
        <Bot className="w-8 h-8 relative z-10 group-hover:rotate-12 transition-transform" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-8 right-8 z-50 w-full max-w-[350px] md:max-w-md bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-300 flex flex-col max-h-[600px]">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-full bg-brand-neon/20 flex items-center justify-center border border-brand-neon/50">
              <Bot className="w-6 h-6 text-brand-neon" />
           </div>
           <div>
              <h3 className="font-bold text-white text-sm">DSH Assistant</h3>
              <p className="text-[10px] text-green-400 flex items-center gap-1">
                 <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> Online
              </p>
           </div>
        </div>
        <div className="flex items-center gap-2">
           <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white p-1 hover:bg-white/10 rounded-lg transition-colors">
              <Minimize2 className="w-4 h-4" />
           </button>
           <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white p-1 hover:bg-white/10 rounded-lg transition-colors">
              <X className="w-4 h-4" />
           </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/50 min-h-[300px]">
         {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
               <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-slate-700' : 'bg-brand-neon/20'}`}>
                  {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-brand-neon" />}
               </div>
               <div className={`p-3 rounded-2xl text-sm max-w-[80%] ${
                  msg.role === 'user' 
                    ? 'bg-slate-800 text-white rounded-tr-none' 
                    : 'bg-slate-900 border border-white/10 text-gray-300 rounded-tl-none'
               }`}>
                  <p className="whitespace-pre-line">{msg.text}</p>
                  {msg.action && (
                     <div className="mt-3 pt-3 border-t border-white/5">
                        {msg.action.url ? (
                           <a href={msg.action.url} target="_blank" className="text-brand-neon hover:underline font-bold flex items-center gap-1">
                              {msg.action.label} <Sparkles className="w-3 h-3" />
                           </a>
                        ) : (
                           <button onClick={() => navigate(msg.action?.path || '/')} className="text-brand-neon hover:underline font-bold flex items-center gap-1">
                              {msg.action.label} <Sparkles className="w-3 h-3" />
                           </button>
                        )}
                     </div>
                  )}
               </div>
            </div>
         ))}
         {isTextLoading && (
            <div className="flex gap-3">
               <div className="w-8 h-8 rounded-full bg-brand-neon/20 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-brand-neon" />
               </div>
               <div className="bg-slate-900 border border-white/10 p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                  <span className="text-xs text-gray-500">Typing...</span>
               </div>
            </div>
         )}
         <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-900 border-t border-white/10">
         <div className="relative flex items-center gap-2">
            <input 
               type="text" 
               value={input}
               onChange={(e) => setInput(e.target.value)}
               onKeyPress={(e) => e.key === 'Enter' && input.trim() && handleTextGenerate(input)}
               placeholder="Type a message..." 
               className="w-full bg-slate-900 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-brand-neon transition-all"
            />
            <button 
               onClick={() => input.trim() && handleTextGenerate(input)}
               className="absolute right-2 p-2 bg-brand-neon text-black rounded-lg hover:bg-cyan-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
               disabled={!input.trim() || isTextLoading}
            >
               <Send className="w-4 h-4 rtl:rotate-180" />
            </button>
         </div>
         <div className="mt-2 flex justify-center">
            <p className="text-[10px] text-gray-600 flex items-center gap-1">
               <ShieldCheck className="w-3 h-3" /> Powered by Google Gemini AI
            </p>
         </div>
      </div>
    </div>
  );
};

export default Chatbot;