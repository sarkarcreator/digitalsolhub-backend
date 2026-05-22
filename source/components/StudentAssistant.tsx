
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { Mic, MicOff, X, Volume2, WifiOff, ShieldCheck, Sparkles, BookOpen, GraduationCap } from 'lucide-react';
import { Language } from '../types';

interface StudentAssistantProps {
  lang: Language;
  studentName: string;
  courses: { name: string; progress: number }[];
  onClose?: () => void;
  isOpenExternal?: boolean; // Control from parent
  setIsOpenExternal?: (val: boolean) => void;
}

const StudentAssistant: React.FC<StudentAssistantProps> = ({ 
  lang, 
  studentName, 
  courses, 
  isOpenExternal, 
  setIsOpenExternal 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'listening' | 'speaking' | 'error'>('idle');

  // Sync with parent state if provided
  useEffect(() => {
    if (isOpenExternal !== undefined) {
      setIsOpen(isOpenExternal);
      if (!isOpenExternal) disconnectVoice();
    }
  }, [isOpenExternal]);

  const handleClose = () => {
    setIsOpen(false);
    if (setIsOpenExternal) setIsOpenExternal(false);
    disconnectVoice();
  };

  // Audio Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sessionPromiseRef = useRef<Promise<any> | null>(null);

  // --- Audio Helpers ---
  const floatTo16BitPCM = (input: Float32Array) => {
    const output = new Int16Array(input.length);
    for (let i = 0; i < input.length; i++) {
      const s = Math.max(-1, Math.min(1, input[i]));
      output[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return output;
  };

  const base64ToUint8Array = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
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

  // --- Gemini Live Connection ---
  const connectToLiveAPI = async () => {
    setStatus('connecting');
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_API_KEY || process.env.API_KEY || process.env.GEMINI_API_KEY || '';
      if (!apiKey) {
        setStatus('error');
        throw new Error('Gemini API key not configured');
      }
      const ai = new GoogleGenAI({ apiKey });
      
      inputContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Construct Course Context String
      const courseContext = courses.map(c => `${c.name} (${c.progress}% complete)`).join(', ');

      const systemInstruction = `
        You are the **Official Learning Assistant & Mentor** for **Digital Solutions Hub**.
        
        **BRAND IDENTITY:**
        - **Organization:** Digital Solutions Hub
        - **CEO:** Sarkar Azeem
        - **Support:** +92301-7862281

        **YOUR ROLE:**
        - Act as a personal tutor and daily guide for the student: ${studentName}.
        - **Tone:** Friendly, Supportive, Motivating, clear human-like voice. Slow-medium pace for better understanding.

        **OFFICIAL SYLLABUS & CURRICULUM (Knowledge Base):**
        **LEVEL 1: FOUNDATION (Beginner)**
        - Module 1: Digital Basics (Internet, Freelancing vs Jobs, Tools, Mindset)
        - Module 2: Personal Branding Basics (Profile optimization, Online presence, Trust)
        - Module 3: Data Entry (Tools, Platforms, Speed)
        - Module 4: Affiliate Marketing Intro (How it works, First commission)
        - Module 5: AI Introduction (ChatGPT, AI tools, Productivity)

        **LEVEL 2: PROFESSIONAL (Skill Builder)**
        - Module 6: Shopify & Dropshipping (Store setup, Product research, Payments, Fulfillment)
        - Module 7: eBay & Marketplaces (Seller accounts, Listing, Scaling)
        - Module 8: SEO Complete (Keyword research, On-page/Technical SEO, Backlinks)
        - Module 9: Digital Marketing (FB/Google/TikTok Ads, Funnels)
        - Module 10: Web Design (WordPress, Themes, Speed)
        - Module 11: Graphic Design (Canva, Branding, Social media creatives)

        **LEVEL 3: EXPERT (Earning + Automation)**
        - Module 12: Advanced SEO & Traffic (Scaling, Analytics)
        - Module 13: Personal Branding Authority (Content strategy, Growth, Monetization)
        - Module 14: AI Automation (Workflows, Chatbots, Zapier)
        - Module 15: Freelancing Mastery (Fiverr/Upwork, Proposal writing, Clients)
        - Module 16: Monetization Systems (YouTube, AdSense, Affiliate funnels)
        - Module 17: Agency Setup (Pricing, Team building)

        **SOFT SKILLS:** Communication, Time Management, Client Handling, Confidence.

        **STUDENT CONTEXT:**
        - **Enrolled Courses:** ${courseContext}.
        - **Current Status:** Needs guidance on next steps, assignments, or earning strategies.

        **CORE BEHAVIORS:**
        1. **Daily Guide:** If asked "Today's lesson" or "What to study", suggest the next topic based on their course progress.
        2. **Progress Tracking:** Read out progress percentages. Be motivating (e.g., "You're 75% done with Module 6, keep going!").
        3. **Assignment Help:** Explain concepts step-by-step. **Give hints, NOT full answers.** Encourage independent work.
        4. **Career & Earning:** Explain how to earn via Upwork/Fiverr using their specific skills. Mention "Personal Branding".
        5. **Admin Support:** If they have account/payment/dashboard issues, refer to **WhatsApp: +1 917 695 7737**.

        **RESPONSE RULES:**
        - **Language:** Detect user language (English, Urdu, Arabic, Russian) and switch FULLY to that language.
        - **Urdu Mix:** Use natural Urdu-English mix for Pakistani students (e.g., "Ghabrana nahi hai, step-by-step seekhein.").
        - **Unknowns:** If a query is outside your training data, say: "For accurate details, please contact our team on WhatsApp: +92301-7862281". NEVER make up information.
        - **Security:** "Your learning data is secure with Digital Solutions Hub."
        - **No Negativity:** Never demotivate. Always encourage. "Earning learning ke baad hi start hoti hai, focus on skills."
      `;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setIsConnected(true);
            setStatus('listening');
            
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
              setStatus('speaking');
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
                    setStatus('listening');
                 }
              };
            }
          },
          onclose: () => disconnectVoice(),
          onerror: (err) => {
            console.error(err);
            setStatus('error');
            disconnectVoice();
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } }
          },
          systemInstruction: systemInstruction
        }
      });

      sessionPromiseRef.current = sessionPromise;

    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  const disconnectVoice = () => {
    setIsConnected(false);
    setIsSpeaking(false);
    setStatus('idle');
    
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
    // Floating Trigger Button (Only visible if not open)
    return (
      <button
        onClick={() => {
            setIsOpen(true);
            if (setIsOpenExternal) setIsOpenExternal(true);
        }}
        className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-[0_0_30px_rgba(124,58,237,0.4)] flex items-center justify-center hover:scale-110 transition-transform animate-float"
        title="AI Learning Assistant"
      >
        <Sparkles className="w-8 h-8 absolute animate-pulse opacity-50" />
        <Mic className="w-8 h-8 relative z-10" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
        </span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md mx-4 bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="absolute top-0 w-full p-4 flex justify-between items-center z-20">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-slate-800 rounded-lg">
                <GraduationCap className="w-5 h-5 text-purple-400" />
            </div>
            <span className="font-bold text-white text-sm">Learning Assistant</span>
          </div>
          <button onClick={handleClose} className="p-2 bg-white/5 rounded-full hover:bg-white/20 text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex flex-col items-center justify-center pt-20 pb-12 px-8 relative">
           
           {/* Glow Effect */}
           <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] transition-all duration-700 ${isSpeaking ? 'scale-125 opacity-100' : 'scale-100 opacity-50'}`}></div>

           {/* Status Message */}
           <div className="text-center mb-10 relative z-10">
              <h3 className="text-2xl font-bold text-white mb-2">
                {status === 'idle' && `Hi, ${studentName}!`}
                {status === 'connecting' && "Connecting..."}
                {status === 'listening' && "I'm Listening..."}
                {status === 'speaking' && "Speaking..."}
                {status === 'error' && "Connection Error"}
              </h3>
              <p className="text-purple-200/60 text-sm">
                {status === 'idle' ? "Ready for today's lesson?" : "Ask about lessons, progress, or help."}
              </p>
           </div>

           {/* Visualizer / Button */}
           <div className="relative z-10 mb-8">
              <button 
                onClick={status === 'idle' || status === 'error' ? connectToLiveAPI : disconnectVoice}
                className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 relative ${
                  isConnected 
                    ? 'bg-red-500/20 text-red-500 border-2 border-red-500 hover:bg-red-500 hover:text-white' 
                    : 'bg-gradient-to-br from-purple-500 to-blue-600 text-white shadow-lg hover:scale-105'
                }`}
              >
                {isConnected ? (
                   isSpeaking ? <Volume2 className="w-10 h-10 animate-pulse" /> : <div className="flex gap-1 h-6 items-center"><span className="w-1 h-3 bg-current animate-bounce"></span><span className="w-1 h-5 bg-current animate-bounce delay-75"></span><span className="w-1 h-3 bg-current animate-bounce delay-150"></span></div>
                ) : (
                   <Mic className="w-10 h-10" />
                )}
                
                {/* Ping Rings */}
                {isConnected && !isSpeaking && (
                   <span className="absolute inset-0 rounded-full border border-purple-400/30 animate-ping"></span>
                )}
              </button>
           </div>

           {/* Suggestions */}
           {status === 'idle' && (
             <div className="flex flex-wrap justify-center gap-2 relative z-10 max-w-[300px]">
                {["Today's Lesson", "My Progress", "Help with Assignment"].map((text, i) => (
                  <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-gray-400">
                    {text}
                  </span>
                ))}
             </div>
           )}

           {status === 'error' && (
              <p className="text-red-400 text-xs mt-4 flex items-center gap-2"><WifiOff className="w-3 h-3" /> Check microphone permissions</p>
           )}

        </div>

        {/* Footer */}
        <div className="bg-slate-950/50 p-4 border-t border-white/5 text-center relative z-10">
           <p className="text-[10px] text-gray-500 flex items-center justify-center gap-1.5">
             <ShieldCheck className="w-3 h-3 text-green-500" />
             Your learning data is secure with Digital Solutions Hub.
           </p>
        </div>

      </div>
    </div>
  );
};

export default StudentAssistant;
