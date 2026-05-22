
import { Partner } from '../types';

const STORAGE_KEY = 'dsh_partners';

const MOCK_PARTNERS: Partner[] = [
  {
    id: 'PARTNER-001',
    slug: 'tech-institute',
    name: 'Tech Institute of Excellence',
    tagline: 'Empowering Future Leaders',
    logo: 'https://cdn-icons-png.flaticon.com/512/3135/3135768.png', // Mock Logo
    brandColor: '#ef4444', // Red
    email: 'admin@techinstitute.com',
    phone: '+923001234567',
    website: 'https://techinstitute.com',
    status: 'Active',
    plan: 'Growth',
    createdAt: '2023-09-01',
    settings: {
      enableBlockchain: true,
      enableAttestation: false,
      customDomain: 'verify.techinstitute.com'
    },
    stats: {
      certificatesIssued: 145,
      students: 320
    }
  },
  {
    id: 'PARTNER-002',
    slug: 'code-camp',
    name: 'Code Camp PK',
    tagline: 'Learn to Code',
    logo: 'https://cdn-icons-png.flaticon.com/512/1005/1005141.png',
    brandColor: '#8b5cf6', // Violet
    email: 'hello@codecamp.pk',
    phone: '+923219876543',
    website: 'https://codecamp.pk',
    status: 'Active',
    plan: 'Starter',
    createdAt: '2024-02-15',
    settings: {
      enableBlockchain: false,
      enableAttestation: false
    },
    stats: {
      certificatesIssued: 45,
      students: 80
    }
  }
];

const initStorage = () => {
  if (typeof window !== 'undefined' && !localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_PARTNERS));
  }
};

export const getAllPartners = (): Partner[] => {
  initStorage();
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : MOCK_PARTNERS;
};

export const getPartnerBySlug = (slug: string): Partner | undefined => {
  const partners = getAllPartners();
  return partners.find(p => p.slug === slug);
};

export const getPartnerById = (id: string): Partner | undefined => {
  const partners = getAllPartners();
  return partners.find(p => p.id === id);
};

export const registerPartner = (data: Partial<Partner>): Partner => {
  const partners = getAllPartners();
  const newPartner: Partner = {
    id: `PARTNER-${Date.now()}`,
    slug: data.slug || `partner-${Date.now()}`,
    name: data.name || 'New Institute',
    tagline: data.tagline || '',
    logo: data.logo || 'https://via.placeholder.com/150',
    brandColor: data.brandColor || '#3b82f6',
    email: data.email || '',
    phone: data.phone || '',
    website: data.website || '',
    status: 'Pending',
    plan: 'Starter',
    createdAt: new Date().toISOString().split('T')[0],
    settings: {
      enableBlockchain: false,
      enableAttestation: false
    },
    stats: {
      certificatesIssued: 0,
      students: 0
    }
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...partners, newPartner]));
  return newPartner;
};

export const updatePartner = (id: string, updates: Partial<Partner>): Partner | null => {
  const partners = getAllPartners();
  const idx = partners.findIndex(p => p.id === id);
  if (idx === -1) return null;
  
  const updatedPartner = { ...partners[idx], ...updates };
  partners[idx] = updatedPartner;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(partners));
  return updatedPartner;
};
