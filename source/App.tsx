
import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useParams, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import { Language } from './types';
import { Loader2 } from 'lucide-react';
import AdminRedirect from './components/AdminRedirect';

// Lazy Load Pages for Performance
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Academy = lazy(() => import('./pages/Academy'));
const Services = lazy(() => import('./pages/Services'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const Marketplace = lazy(() => import('./pages/Marketplace'));
const JobPortal = lazy(() => import('./pages/JobPortal'));
const Tools = lazy(() => import('./pages/Tools'));
const Apply = lazy(() => import('./pages/Apply'));
const Contact = lazy(() => import('./pages/Contact'));
const CourseDetail = lazy(() => import('./pages/CourseDetail'));
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));
const ClientDashboard = lazy(() => import('./pages/ClientDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Terms = lazy(() => import('./pages/Terms'));
const VerifyCertificate = lazy(() => import('./pages/VerifyCertificate')); 
const VerifyBadge = lazy(() => import('./pages/VerifyBadge'));
const VerifyAttestation = lazy(() => import('./pages/VerifyAttestation'));
const FranchiseApply = lazy(() => import('./pages/FranchiseApply'));
const FranchiseDashboard = lazy(() => import('./pages/FranchiseDashboard'));
const AccreditationApply = lazy(() => import('./pages/AccreditationApply'));
const AccreditationAgreement = lazy(() => import('./pages/legal/AccreditationAgreement'));
const WhiteLabelAgreement = lazy(() => import('./pages/legal/WhiteLabelAgreement'));
const NDA = lazy(() => import('./pages/legal/NDA'));
const EmployerPortal = lazy(() => import('./pages/EmployerPortal'));
const EmployerDashboard = lazy(() => import('./pages/EmployerDashboard'));
const ApiDocs = lazy(() => import('./pages/ApiDocs'));
const PartnerOnboarding = lazy(() => import('./pages/PartnerOnboarding'));
const PartnerDashboard = lazy(() => import('./pages/PartnerDashboard'));
const PartnerVerification = lazy(() => import('./pages/PartnerVerification'));

// Full Screen Loader
const PageLoader = () => (
  <div className="min-h-screen bg-slate-950 flex items-center justify-center">
    <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
  </div>
);

// Layout Wrapper
const MainLayout = () => {
  const { lang } = useParams<{ lang: string }>();
  // Default to English if lang is missing or invalid
  const currentLang = (Object.values(Language).includes(lang as Language)) ? (lang as Language) : Language.ENGLISH;
  
  useEffect(() => {
    const isRtl = currentLang === Language.URDU || currentLang === Language.ARABIC;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;
    
    // Font handling
    if (isRtl) {
        document.body.className = 'bg-slate-950 text-white font-urdu';
    } else {
        document.body.className = 'bg-slate-950 text-white font-sans';
    }
  }, [currentLang]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar lang={currentLang} />
      <main className="flex-grow relative">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer lang={currentLang} />
      <Chatbot lang={currentLang} />
    </div>
  );
};

// Scroll Handler
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Default Redirect */}
          <Route path="/" element={<Navigate to={`/${Language.ENGLISH}`} replace />} />
          <Route path="/admin" element={<AdminRedirect />} />
          <Route path="/admin/*" element={<AdminRedirect />} />
          
          {/* Public Verification Routes (No Navbar/Footer usually, or custom) */}
          <Route path="/verify/:id" element={<VerifyCertificate />} />
          <Route path="/verify/badge/:id" element={<VerifyBadge />} />
          <Route path="/verify/attestation/:id" element={<VerifyAttestation />} />
          <Route path="/verify/:slug/:id" element={<PartnerVerification />} />
          
          {/* Standalone Partner/Dashboard Routes */}
          <Route path="/partner-setup" element={<PartnerOnboarding />} />
          <Route path="/p/:slug/dashboard" element={<PartnerDashboard />} />
          <Route path="/:lang/dashboard" element={<StudentDashboard />} />
          <Route path="/:lang/client-dashboard" element={<ClientDashboard />} />
          <Route path="/:lang/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/:lang/employer-dashboard" element={<EmployerDashboard />} />
          <Route path="/:lang/franchise-dashboard/:id" element={<FranchiseDashboard />} />

          {/* Main Website Routes (Wrapped in Layout) */}
          <Route path="/:lang" element={<MainLayout />}>
             <Route index element={<Home />} />
             <Route path="about" element={<About />} />
             <Route path="academy" element={<Academy />} />
             <Route path="services" element={<Services />} />
             <Route path="services/:id" element={<ServiceDetail />} />
             <Route path="marketplace" element={<Marketplace />} />
             <Route path="jobs" element={<JobPortal />} />
             <Route path="tools" element={<Tools />} />
             <Route path="apply" element={<Apply />} />
             <Route path="contact" element={<Contact />} />
             <Route path="course/:id" element={<CourseDetail />} />
             <Route path="privacy" element={<PrivacyPolicy />} />
             <Route path="terms" element={<Terms />} />
             <Route path="franchise-apply" element={<FranchiseApply />} />
             <Route path="accreditation-apply" element={<AccreditationApply />} />
             <Route path="legal/accreditation-agreement" element={<AccreditationAgreement />} />
             <Route path="legal/white-label-agreement" element={<WhiteLabelAgreement />} />
             <Route path="legal/nda" element={<NDA />} />
             <Route path="login" element={<Login />} />
             <Route path="signup" element={<Signup />} />
             <Route path="employer-portal" element={<EmployerPortal />} />
             <Route path="api-docs" element={<ApiDocs />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to={`/${Language.ENGLISH}`} replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
