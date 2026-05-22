
import { Lead, LeadStatus, Language } from '../types';

const STORAGE_KEY = 'dsh_crm_leads';

const MOCK_LEADS: Lead[] = [
  {
    id: 'L-101',
    name: 'Zainab Bibi',
    email: 'zainab@gmail.com',
    phone: '+923001234567',
    source: 'Ads',
    interest: 'Shopify Mastery',
    type: 'Student',
    status: 'New',
    budget: 'PKR 25,000',
    language: Language.URDU,
    notes: ['Interested in dropshipping.', 'Asked for installment plan.'],
    createdAt: '2024-10-25',
    lastContact: '2024-10-25',
    probability: 60
  },
  {
    id: 'L-102',
    name: 'TechFlow Solutions',
    email: 'contact@techflow.com',
    phone: '+923339876543',
    source: 'Website',
    interest: 'Web Development',
    type: 'Client',
    status: 'Qualified',
    budget: '$1,500',
    language: Language.ENGLISH,
    notes: ['Needs a custom React app.', 'Meeting scheduled for Monday.'],
    createdAt: '2024-10-24',
    lastContact: '2024-10-26',
    probability: 85
  },
  {
    id: 'L-103',
    name: 'Ahmed Raza',
    email: 'ahmed.r@hotmail.com',
    phone: '+923215555555',
    source: 'WhatsApp',
    interest: 'SEO Services',
    type: 'Client',
    status: 'Proposal',
    budget: '$500/mo',
    language: Language.ENGLISH,
    notes: ['Proposal sent via email.', 'Waiting for approval.'],
    createdAt: '2024-10-22',
    lastContact: '2024-10-25',
    probability: 90
  },
  {
    id: 'L-104',
    name: 'Fatima K.',
    email: 'fatima@yahoo.com',
    phone: '+923456667777',
    source: 'Referral',
    interest: 'Digital Marketing Course',
    type: 'Student',
    status: 'Won',
    budget: 'PKR 10,000',
    language: Language.URDU,
    notes: ['Enrolled successfully.', 'Payment verified.'],
    createdAt: '2024-10-20',
    lastContact: '2024-10-21',
    probability: 100
  }
];

const initStorage = () => {
  if (typeof window !== 'undefined' && !localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_LEADS));
  }
};

export const getAllLeads = (): Lead[] => {
  initStorage();
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : MOCK_LEADS;
};

export const addLead = (lead: Omit<Lead, 'id' | 'createdAt' | 'lastContact' | 'notes'>): Lead => {
  const leads = getAllLeads();
  const newLead: Lead = {
    ...lead,
    id: `L-${100 + leads.length + 1}`,
    createdAt: new Date().toISOString().split('T')[0],
    lastContact: new Date().toISOString().split('T')[0],
    notes: [],
    probability: 50 // Default
  };
  const updatedLeads = [newLead, ...leads];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLeads));
  return newLead;
};

export const updateLeadStatus = (id: string, status: LeadStatus): Lead[] => {
  const leads = getAllLeads();
  const updatedLeads = leads.map(l => l.id === id ? { ...l, status, lastContact: new Date().toISOString().split('T')[0] } : l);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLeads));
  return updatedLeads;
};

export const addLeadNote = (id: string, note: string): Lead[] => {
  const leads = getAllLeads();
  const updatedLeads = leads.map(l => l.id === id ? { ...l, notes: [...l.notes, note] } : l);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLeads));
  return updatedLeads;
};

export const PIPELINE_STAGES: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'];
