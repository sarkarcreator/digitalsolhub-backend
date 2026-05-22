import React, { useState, useEffect, useRef } from 'react';
import { X, Linkedin, Download, Copy, Check, Share2, ExternalLink } from 'lucide-react';
import { Language } from '../types';
import Logo from './Logo';

interface LinkedInShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  courseName: string;
  certificateId: string;
  skills: string[];
  lang: Language;
}

const LinkedInShareModal: React.FC<LinkedInShareModalProps> = ({
  isOpen,
  onClose,
  studentName,
  courseName,
  certificateId,
  skills,
  lang
}) => {
  const [postText, setPostText] = useState('');
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageUrl, setImageUrl] = useState<string>('');

  const verifyLink = `https://digitalsolhub.com/verify/${certificateId}`;
  const skillTags = skills.slice(0, 3).join(', ');

  // --- 1. Dynamic Post Generation ---
  useEffect(() => {
    const templates = {
      [Language.ENGLISH]: `🎉 Proud to announce that I have successfully completed the ${courseName} from Digital Solutions Hub (DSH Academy).\n\nThis program enhanced my skills in ${skillTags} using AI-driven and industry-standard practices.\n\n✅ Certificate Verified: ${verifyLink}\n\nThank you Digital Solutions Hub for empowering my digital journey.\n\n#DigitalSolutionsHub #DSHAcademy #OnlineLearning #DigitalSkills #AICertification #${courseName.replace(/\s/g, '')} #OpenToWork`,
      [Language.URDU]: `🎉 مجھے یہ اعلان کرتے ہوئے فخر ہے کہ میں نے ${courseName} Digital Solutions Hub (DSH Academy) سے کامیابی کے ساتھ مکمل کر لیا ہے۔\n\nاس پروگرام نے میری مہارتوں میں اضافہ کیا: ${skillTags}.\n\n✅ سرٹیفیکیٹ کی تصدیق: ${verifyLink}\n\nشکریہ Digital Solutions Hub۔\n\n#DigitalSolutionsHub #DSHAcademy #OnlineLearning #DigitalSkills`,
      [Language.ARABIC]: `🎉 فخورون بالإعلان أنني أكملت ${courseName} من مركز الحلول الرقمية (DSH Academy).\n\nهذا البرنامج عزز مهاراتي في ${skillTags}.\n\n✅ تم التحقق من الشهادة: ${verifyLink}\n\nشكرًا Digital Solutions Hub.\n\n#DigitalSolutionsHub #DSHAcademy`,
      [Language.RUSSIAN]: `🎉 С гордостью сообщаю, что я успешно завершил курс ${courseName} в Digital Solutions Hub (DSH Academy).\n\nЭта программа улучшила мои навыки в ${skillTags}.\n\n✅ Сертификат подтверждён: ${verifyLink}\n\nСпасибо Digital Solutions Hub.\n\n#DigitalSolutionsHub #DSHAcademy`
    };

    setPostText(templates[lang] || templates[Language.ENGLISH]);
  }, [lang, courseName, studentName, skills, verifyLink]);

  // --- 2. Canvas Image Generation ---
  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Canvas Settings (16:9 High Res)
      canvas.width = 1200;
      canvas.height = 628;

      // Background - Navy Gradient
      const grad = ctx.createLinearGradient(0, 0, 1200, 628);
      grad.addColorStop(0, '#0f172a'); // Slate 950
      grad.addColorStop(1, '#1e293b'); // Slate 800
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1200, 628);

      // Decorative Gold Accent
      ctx.strokeStyle = '#CA8A04'; // Gold 600
      ctx.lineWidth = 4;
      ctx.strokeRect(20, 20, 1160, 588);

      // Top Right Glow
      const glow = ctx.createRadialGradient(1200, 0, 50, 1200, 0, 600);
      glow.addColorStop(0, 'rgba(234, 179, 8, 0.2)');
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, 1200, 628);

      // Text Settings
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // "VERIFIED CERTIFICATE" Badge
      ctx.fillStyle = '#22c55e'; // Green 500
      ctx.font = 'bold 24px Inter, sans-serif';
      ctx.fillText('✅ VERIFIED CERTIFICATE', 600, 100);

      // Course Name
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 48px Playfair Display, serif';
      ctx.fillText(courseName, 600, 220);

      // "Awarded To"
      ctx.fillStyle = '#94a3b8'; // Slate 400
      ctx.font = '24px Inter, sans-serif';
      ctx.fillText('Awarded To', 600, 290);

      // Student Name
      ctx.fillStyle = '#FACC15'; // Gold 400
      ctx.font = 'bold 64px Inter, sans-serif';
      ctx.fillText(studentName, 600, 360);

      // Footer - DSH Branding
      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 30px Poppins, sans-serif';
      ctx.fillText('DIGITAL SOLUTIONS HUB', 600, 500);
      
      // Verification Link
      ctx.fillStyle = '#38bdf8'; // Sky 400
      ctx.font = '20px monospace';
      ctx.fillText(`ID: ${certificateId}`, 600, 540);
      ctx.fillText('verify.digitalsolhub.com', 600, 570);

      // Store as Data URL for download
      setImageUrl(canvas.toDataURL('image/png'));
    }
  }, [isOpen, courseName, studentName, certificateId]);

  const handleShare = () => {
    // LinkedIn Share URL with pre-filled text (Works best on Desktop)
    const linkedInUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(postText)}`;
    window.open(linkedInUrl, '_blank');
  };

  const handleDownload = () => {
    if (imageUrl) {
      const link = document.createElement('a');
      link.download = `DSH_Certificate_${certificateId}.png`;
      link.href = imageUrl;
      link.click();
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(postText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Left: Preview & Actions */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col border-b md:border-b-0 md:border-r border-white/10 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Linkedin className="w-6 h-6 text-blue-500" /> Share to LinkedIn
            </h2>
            <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="mb-6">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Post Preview</label>
            <textarea 
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              className="w-full h-64 bg-slate-950 border border-white/10 rounded-xl p-4 text-sm text-gray-300 focus:outline-none focus:border-brand-neon resize-none custom-scrollbar"
            />
          </div>

          <div className="mt-auto space-y-3">
            <button 
              onClick={handleShare}
              className="w-full py-3 bg-[#0077b5] hover:bg-[#006396] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-blue-500/20"
            >
              <Share2 className="w-5 h-5" /> Post on LinkedIn
            </button>
            <div className="flex gap-3">
              <button 
                onClick={handleCopy}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors border border-white/10"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />} 
                {copied ? 'Copied' : 'Copy Text'}
              </button>
              <a 
                href={verifyLink}
                target="_blank"
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors border border-white/10"
              >
                <ExternalLink className="w-4 h-4" /> View Page
              </a>
            </div>
          </div>
        </div>

        {/* Right: Image Preview */}
        <div className="w-full md:w-1/2 p-6 md:p-8 bg-black/50 flex flex-col items-center justify-center relative">
          <button onClick={onClose} className="hidden md:block absolute top-4 right-4 text-gray-400 hover:text-white bg-black/50 rounded-full p-2 hover:bg-white/10 transition-all">
            <X className="w-6 h-6" />
          </button>

          <div className="mb-6 w-full">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 text-center">LinkedIn Optimized Image (Auto-Generated)</label>
            <div className="relative rounded-lg overflow-hidden border border-white/10 shadow-2xl group">
              <canvas ref={canvasRef} className="w-full h-auto block" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                 <p className="text-white font-bold text-sm flex items-center gap-2"><Download className="w-4 h-4" /> Ready to Download</p>
              </div>
            </div>
          </div>

          <button 
            onClick={handleDownload}
            className="px-6 py-2 bg-brand-neon/10 text-brand-neon border border-brand-neon/50 rounded-lg font-bold text-sm hover:bg-brand-neon hover:text-black transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Download Image
          </button>
          <p className="text-xs text-gray-500 mt-4 text-center">
            Upload this image with your LinkedIn post for higher engagement.
          </p>
        </div>

      </div>
    </div>
  );
};

export default LinkedInShareModal;