
import React, { forwardRef } from 'react';
import Logo from './Logo';
import { QRCodeSVG } from 'qrcode.react';
import { Language, AttestationRecord } from '../types';
import Badge from './Badge';
import AttestationSeal from './AttestationSeal';

interface CertificateProps {
  studentName: string;
  courseName: string;
  completionDate: string;
  certificateId: string;
  instructorName?: string;
  lang?: Language;
  issuerName?: string;
  issuerLogo?: string;
  issuerTagline?: string;
  themeColor?: string; // Custom brand color hex
  isAccredited?: boolean;
  attestation?: AttestationRecord; // New Prop
  partnerMode?: boolean; // If true, apply white-label styles
}

const Certificate = forwardRef<HTMLDivElement, CertificateProps>(({ 
  studentName, 
  courseName, 
  completionDate, 
  certificateId,
  instructorName = "Sarkar Azeem",
  lang = Language.ENGLISH,
  issuerName = "DSH Academy",
  issuerLogo,
  issuerTagline,
  themeColor = "#CA8A04", // Default Gold-600
  isAccredited = false,
  attestation,
  partnerMode = false
}, ref) => {
  
  // Use partner verification URL if in partner mode (mocked)
  const verifyUrl = partnerMode
    ? `digitalsolhub.com/p/verify/${certificateId}`
    : `digitalsolhub.com/verify/${certificateId}`;
    
  const currentLang = lang || Language.ENGLISH;
  const isRtl = currentLang === Language.URDU || currentLang === Language.ARABIC;

   // Translations
   const t = {
      header: {
         [Language.ENGLISH]: 'Certificate of Completion',
         [Language.URDU]: 'تکمیل کورس کا سرٹیفکیٹ',
         [Language.ARABIC]: 'شهادة إتمام الدورة',
         [Language.RUSSIAN]: 'Сертификат о завершении'
      },
      certify: {
         [Language.ENGLISH]: 'This is to certify that',
         [Language.URDU]: 'یہ تصدیق کی جاتی ہے کہ',
         [Language.ARABIC]: 'تشهد الأكاديمية أن',
         [Language.RUSSIAN]: 'Настоящим подтверждается, что'
      },
      desc: {
         [Language.ENGLISH]: 'has successfully completed the professional training program and demonstrated practical competency in the required skills.',
         [Language.URDU]: 'نے پیشہ ورانہ تربیتی پروگرام کامیابی سے مکمل کیا ہے اور مطلوبہ مہارتوں میں عملی قابلیت کا مظاہرہ کیا ہے۔',
         [Language.ARABIC]: 'أتم البرنامج التدريبي المهني بنجاح وأثبت الكفاءة العملية في المهارات المطلوبة.',
         [Language.RUSSIAN]: 'успешно завершил(а) профессиональную учебную программу и продемонстрировал(а) практическую компетентность в требуемых навыках.'
      },
      date: { [Language.ENGLISH]: 'Issue Date', [Language.URDU]: 'تاریخ اجرا', [Language.ARABIC]: 'تاريخ الإصدار', [Language.RUSSIAN]: 'Дата выдачи' },
      id: { [Language.ENGLISH]: 'Certificate ID', [Language.URDU]: 'سرٹیفکیٹ نمبر', [Language.ARABIC]: 'رقم الشهادة', [Language.RUSSIAN]: 'ID сертификата' },
      verify: { [Language.ENGLISH]: 'Scan to Verify', [Language.URDU]: 'تصدیق کے لیے اسکین کریں', [Language.ARABIC]: 'امسح للتحقق', [Language.RUSSIAN]: 'Сканируйте для проверки' },
      attested_footer: {
          [Language.ENGLISH]: 'This document has been officially attested by Digital Solutions Hub under internal compliance and quality verification standards.',
          [Language.URDU]: 'اس دستاویز کو ڈیجیٹل سلوشنز ہب نے اندرونی معیارات کے تحت باضابطہ طور پر تصدیق کیا ہے۔',
          [Language.ARABIC]: 'تم تصديق هذه الوثيقة رسمياً من قبل مركز الحلول الرقمية ضمن معايير الالتزام والجودة الداخلية.',
          [Language.RUSSIAN]: 'Этот документ официально заверен Digital Solutions Hub в соответствии с внутренними стандартами соответствия и качества.'
      }
   };
  

  return (
    <div className="w-full flex justify-center bg-white print:bg-white print:p-0">
      {/* A4 Landscape Container */}
      <div 
        ref={ref}
        id="certificate-content"
        className="relative w-[1123px] h-[794px] bg-white text-slate-900 shadow-2xl overflow-hidden print:shadow-none print:w-full print:h-full print:m-0 print:border-0"
        style={{ fontFamily: "'Playfair Display', serif", direction: 'ltr', pageBreakAfter: 'always' }} 
      >
        {/* --- Borders & Frame with Dynamic Color --- */}
        <div className="absolute inset-3 border-[4px] border-slate-900 z-20"></div>
        <div className="absolute inset-5 border-[2px] z-20" style={{ borderColor: themeColor }}></div>
        
        {/* Corner Ornaments */}
        <div className="absolute top-5 left-5 w-32 h-32 z-30 pointer-events-none" style={{ color: themeColor }}>
           <svg viewBox="0 0 100 100" fill="currentColor"><path d="M0 0 L40 0 L0 40 Z" /><path d="M5 5 L90 5" stroke="currentColor" strokeWidth="1" /><path d="M5 5 L5 90" stroke="currentColor" strokeWidth="1" /></svg>
        </div>
        <div className="absolute top-5 right-5 w-32 h-32 z-30 pointer-events-none rotate-90" style={{ color: themeColor }}>
           <svg viewBox="0 0 100 100" fill="currentColor"><path d="M0 0 L40 0 L0 40 Z" /><path d="M5 5 L90 5" stroke="currentColor" strokeWidth="1" /><path d="M5 5 L5 90" stroke="currentColor" strokeWidth="1" /></svg>
        </div>
        <div className="absolute bottom-5 left-5 w-32 h-32 z-30 pointer-events-none -rotate-90" style={{ color: themeColor }}>
           <svg viewBox="0 0 100 100" fill="currentColor"><path d="M0 0 L40 0 L0 40 Z" /><path d="M5 5 L90 5" stroke="currentColor" strokeWidth="1" /><path d="M5 5 L5 90" stroke="currentColor" strokeWidth="1" /></svg>
        </div>
        <div className="absolute bottom-5 right-5 w-32 h-32 z-30 pointer-events-none rotate-180" style={{ color: themeColor }}>
           <svg viewBox="0 0 100 100" fill="currentColor"><path d="M0 0 L40 0 L0 40 Z" /><path d="M5 5 L90 5" stroke="currentColor" strokeWidth="1" /><path d="M5 5 L5 90" stroke="currentColor" strokeWidth="1" /></svg>
        </div>

        {/* --- Background Watermark --- */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04]">
           {issuerLogo ? (
               <img src={issuerLogo} alt="Watermark" className="w-[500px] h-[500px] object-contain grayscale" />
           ) : (
               <Logo className="w-[500px] h-[500px] text-slate-900" />
           )}
        </div>

        {/* --- Attestation Overlay (If Attested) --- */}
        {attestation && attestation.status === 'Issued' && (
            <div className="absolute top-12 right-24 z-50 transform rotate-12 drop-shadow-2xl">
                <AttestationSeal 
                    id={attestation.id} 
                    date={attestation.attestationDate} 
                    officer={attestation.officerName} 
                    type={attestation.type.toUpperCase()}
                    className="w-40 h-40"
                />
            </div>
        )}

        {/* --- Main Content --- */}
        <div className="relative z-40 h-full flex flex-col items-center pt-16 pb-12 px-24 text-center justify-between">
          
          {/* Header */}
          <div className="flex flex-col items-center w-full">
             <div className="flex items-center gap-3 mb-2">
                {issuerLogo ? (
                    <img src={issuerLogo} alt="Logo" className="h-14 object-contain" />
                ) : (
                    <Logo className="w-14 h-14 text-slate-900" />
                )}
                
                <div className="h-10 w-px bg-slate-300 mx-2"></div>
                
                <div className="text-left">
                   <h2 className="text-2xl font-bold text-slate-900 tracking-widest uppercase font-serif leading-none">{issuerName}</h2>
                   {issuerTagline && (
                       <p className="text-[10px] tracking-[0.2em] font-sans font-bold uppercase mt-1" style={{ color: themeColor }}>
                           {issuerTagline}
                       </p>
                   )}
                </div>
             </div>
             
             <div className="mt-8 mb-2">
                <h1 className={`text-5xl font-bold text-slate-900 tracking-wide uppercase font-serif ${isRtl ? 'font-urdu' : ''}`} style={{ textShadow: '1px 1px 0px rgba(0,0,0,0.1)' }}>
                  {t.header[currentLang]}
                </h1>
             </div>
             
             <div className="h-0.5 w-64 bg-gradient-to-r from-transparent via-current to-transparent" style={{ color: themeColor }}></div>
          </div>

          {/* Body */}
          <div className="w-full max-w-4xl flex flex-col items-center">
             <p className={`text-xl text-slate-500 font-sans italic mt-6 ${isRtl ? 'font-urdu' : ''}`}>
                {t.certify[currentLang]}
             </p>

             <div className="relative mt-4 mb-6 w-full">
                <h2 className="text-6xl font-bold text-slate-900 font-serif border-b-2 border-slate-900/10 inline-block pb-2 px-12 min-w-[60%] leading-tight">
                   {studentName}
                </h2>
             </div>

             <div className="max-w-3xl">
                <p className={`text-lg text-slate-600 leading-relaxed ${isRtl ? 'font-urdu' : 'font-sans'}`}>
                   {t.desc[currentLang]}
                </p>
             </div>

             <div className="mt-6 bg-slate-50/80 px-8 py-3 rounded-lg border border-slate-100">
                <h3 className={`text-3xl font-bold text-slate-900 font-sans uppercase tracking-tight ${isRtl ? 'font-urdu' : ''}`} style={{ color: themeColor }}>
                   {courseName}
                </h3>
             </div>
          </div>

          {/* Footer Area */}
          <div className="w-full grid grid-cols-3 items-end mt-4">
             
             {/* Left: Date/ID */}
             <div className="text-left font-sans text-slate-600 space-y-4 pl-4">
                <div>
                   <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isRtl ? 'font-urdu' : ''}`} style={{ color: themeColor }}>{t.date[currentLang]}</p>
                   <p className="text-lg font-bold text-slate-800 font-serif">{completionDate}</p>
                </div>
                <div>
                   <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isRtl ? 'font-urdu' : ''}`} style={{ color: themeColor }}>{t.id[currentLang]}</p>
                   <p className="text-sm font-mono tracking-wider text-slate-900">{certificateId}</p>
                </div>
             </div>

             {/* Center: Badge */}
             <div className="flex justify-center -mb-8 relative z-50">
                {partnerMode ? (
                    <div className="w-32 h-32 rounded-full border-4 flex items-center justify-center bg-white shadow-xl" style={{ borderColor: themeColor }}>
                        {issuerLogo ? <img src={issuerLogo} className="w-20 object-contain" /> : <Logo className="w-20 h-20 text-slate-400" />}
                    </div>
                ) : (
                    <Badge level="Gold" className="w-40 h-40 scale-110 drop-shadow-2xl" lightMode={true} />
                )}
             </div>

             {/* Right: Signature/QR */}
             <div className="text-right flex flex-col items-end gap-6 pr-4">
                <div className="text-center relative">
                   <div className="font-serif italic text-4xl text-slate-900 mb-2 px-8 -rotate-2" style={{ fontFamily: "'Dancing Script', cursive, serif" }}>
                      {instructorName}
                   </div>
                   <div className="border-t border-slate-900 w-48 mx-auto"></div>
                   <p className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: themeColor }}>Authorized Signatory</p>
                </div>

                <div className="flex items-center gap-3 bg-white p-1.5 rounded border border-slate-200 shadow-sm">
                   <div className="bg-white">
                      <QRCodeSVG value={`https://${verifyUrl}`} size={42} fgColor="#0F172A" />
                   </div>
                   <div className="text-left font-sans">
                      <p className={`text-[8px] font-bold text-slate-500 uppercase tracking-wider ${isRtl ? 'font-urdu' : ''}`}>{t.verify[currentLang]}</p>
                      <p className="text-[8px] text-blue-600 font-medium truncate w-24">{verifyUrl}</p>
                   </div>
                </div>
             </div>

          </div>
          
          {/* Partner / Attestation Footer Text */}
          <div className="absolute bottom-2 w-full text-center space-y-1">
             {attestation && attestation.status === 'Issued' && (
                <p className={`text-[8px] text-slate-400 font-bold uppercase tracking-widest ${isRtl ? 'font-urdu' : 'font-sans'}`}>
                   {t.attested_footer[currentLang]} â€¢ Attestation ID: {attestation.id}
                </p>
             )}
             {partnerMode && (
                 <p className="text-[7px] text-slate-300 uppercase tracking-widest font-sans">
                     Powered by Digital Solutions Hub Verification Infrastructure
                 </p>
             )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default Certificate;
