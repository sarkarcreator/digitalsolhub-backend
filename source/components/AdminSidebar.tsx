import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { 
  LayoutDashboard, Users, UserCheck, Briefcase, CreditCard, 
  MessageSquare, FileText, Settings, LogOut, X, Shield, PenTool, 
  Award, BookOpen, BarChart3, Globe, Lock, Target, GitBranch, TrendingUp, Presentation
} from 'lucide-react';
import Logo from './Logo';

interface SidebarProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
  currentView: string;
  onNavigate: (view: string) => void;
}

const AdminSidebar: React.FC<SidebarProps> = ({ lang, isOpen, onClose, currentView, onNavigate }) => {
  const navigate = useNavigate();

  const menuItems = [
    { icon: LayoutDashboard, label: TRANSLATIONS.cdash_overview[lang], id: 'overview' },
    { icon: Presentation, label: 'Investor Pitch Deck', id: 'deck' },
    { icon: TrendingUp, label: 'Financial Projections', id: 'financials' },
    { icon: GitBranch, label: 'Franchise Network', id: 'franchises' },
    { icon: Target, label: 'CRM & Sales', id: 'crm' },
    { icon: Briefcase, label: TRANSLATIONS.adash_services[lang], id: 'requests' },
    { icon: Users, label: TRANSLATIONS.adash_students[lang], id: 'students' },
    { icon: UserCheck, label: TRANSLATIONS.adash_clients[lang], id: 'clients' },
    { icon: BookOpen, label: 'Courses', id: 'courses' },
    { icon: Award, label: 'Certificates', id: 'certifications' },
    { icon: CreditCard, label: TRANSLATIONS.cdash_invoices[lang], id: 'payments' },
    { icon: Globe, label: 'Content & CMS', id: 'cms' },
    { icon: PenTool, label: 'Proposals', id: 'proposals' },
    { icon: Shield, label: 'Team & Roles', id: 'team' },
    { icon: BarChart3, label: 'Reports', id: 'reports' },
    { icon: MessageSquare, label: TRANSLATIONS.dash_messages[lang], id: 'messages' },
    { icon: Settings, label: TRANSLATIONS.dash_settings[lang], id: 'settings' },
  ];

  const handleLogout = () => {
    navigate(`/${lang}/login`);
  };

  const handleNav = (id: string) => {
    onNavigate(id);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`fixed top-0 left-0 rtl:left-auto rtl:right-0 z-50 h-full w-72 bg-slate-950 border-r border-brand-neon/20 shadow-[0_0_30px_rgba(0,243,255,0.05)] transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full rtl:translate-x-full'
      }`}>
        <div className="h-full flex flex-col">
          {/* Logo Section */}
          <div className="h-24 flex items-center justify-between px-6 border-b border-brand-neon/20 bg-slate-900/50">
            <Link to={`/${lang}`} className="flex items-center gap-2">
              <Logo className="w-10 h-10" withText={true} />
            </Link>
            <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-brand-neon">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Admin Label */}
          <div className="px-6 py-4 flex items-center gap-2 text-brand-neon font-bold uppercase text-xs tracking-widest border-b border-white/5">
             <Lock className="w-3 h-3" />
             Super Admin
          </div>

          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto py-4 px-4 space-y-1 custom-scrollbar">
            {menuItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`w-full group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive 
                      ? 'bg-brand-neon/10 text-brand-neon border-l-2 border-brand-neon shadow-[0_0_15px_rgba(0,243,255,0.1)]' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white hover:translate-x-1 rtl:hover:-translate-x-1'
                  }`}
                >
                  <item.icon className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-brand-neon' : 'text-gray-500 group-hover:text-brand-neon'
                  }`} />
                  <span className="font-medium text-sm tracking-wide text-left rtl:text-right">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Logout */}
          <div className="p-4 border-t border-brand-neon/10 bg-slate-950/80">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all group border border-transparent hover:border-red-500/20"
            >
              <LogOut className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              <span className="font-medium text-sm">{TRANSLATIONS.dash_logout[lang]}</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;