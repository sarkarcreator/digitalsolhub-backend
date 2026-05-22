
import { Franchise } from '../types';

const STORAGE_KEY = 'dsh_franchises';

const MOCK_FRANCHISES: Franchise[] = [
  {
    id: 'DSH-HQ-001',
    name: 'DSH Headquarters',
    type: 'Company-Owned',
    accreditationType: 'None',
    ownerName: 'Sarkar Azeem',
    email: 'ceo@dsh.com',
    phone: '+1 917 695 7737',
    city: 'Islamabad',
    country: 'Pakistan',
    status: 'Active',
    joinedDate: '2020-01-01',
    studentsCount: 1500,
    revenue: 5000000,
    currency: 'PKR',
    commissionRate: 0, 
    walletBalance: 0,
    whiteLabel: { enabled: false },
    allowedCourses: ['all']
  },
  {
    id: 'DSH-DXB-002',
    name: 'DSH Dubai Hub',
    type: 'International',
    accreditationType: 'AF',
    ownerName: 'Rashid Al-Maktoum',
    email: 'dubai@dsh.com',
    phone: '+971501234567',
    city: 'Dubai',
    country: 'UAE',
    status: 'Active',
    joinedDate: '2023-05-15',
    studentsCount: 320,
    revenue: 150000, 
    currency: 'AED',
    commissionRate: 15,
    walletBalance: 45000,
    whiteLabel: { enabled: false },
    allowedCourses: ['all']
  },
  {
    id: 'ATP-LHR-099',
    name: 'NextGen Skills Institute',
    type: 'Partner',
    accreditationType: 'ATP', // Accredited Training Partner
    ownerName: 'Bilal Ahmed',
    email: 'bilal@nextgen.com',
    phone: '+923214445555',
    city: 'Lahore',
    country: 'Pakistan',
    status: 'Active',
    joinedDate: '2023-08-10',
    studentsCount: 210,
    revenue: 850000,
    currency: 'PKR',
    commissionRate: 20,
    walletBalance: 120000,
    whiteLabel: {
        enabled: true,
        customLogo: 'https://cdn-icons-png.flaticon.com/512/10434/10434252.png', // Mock Logo
        domain: 'nextgen.dsh.com'
    },
    allowedCourses: ['web-dev', 'graphic-design'] // Only licensed for these
  },
  {
    id: 'DSH-VIRTUAL-004',
    name: 'DSH Online Global',
    type: 'Online',
    accreditationType: 'AF',
    ownerName: 'Sarah J.',
    email: 'online@dsh.com',
    phone: '+1555019988',
    city: 'New York',
    country: 'USA',
    status: 'Active',
    joinedDate: '2024-01-20',
    studentsCount: 540,
    revenue: 25000,
    currency: 'USD',
    commissionRate: 30,
    walletBalance: 8000,
    whiteLabel: { enabled: false },
    allowedCourses: ['all']
  }
];

const initStorage = () => {
  if (typeof window !== 'undefined' && !localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_FRANCHISES));
  }
};

export const getAllFranchises = (): Franchise[] => {
  initStorage();
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : MOCK_FRANCHISES;
};

export const getFranchiseById = (id: string): Franchise | undefined => {
  const list = getAllFranchises();
  return list.find(f => f.id === id);
};

export const addFranchise = (data: Partial<Franchise>): Franchise => {
  const list = getAllFranchises();
  const newFranchise: Franchise = {
    id: `ATP-${data.city?.substring(0,3).toUpperCase()}-${list.length + 100}`,
    name: data.name || 'New Institute',
    type: data.type || 'Partner',
    accreditationType: data.accreditationType || 'ATP',
    ownerName: data.ownerName || '',
    email: data.email || '',
    phone: data.phone || '',
    city: data.city || '',
    country: data.country || '',
    status: 'Pending',
    joinedDate: new Date().toISOString().split('T')[0],
    studentsCount: 0,
    revenue: 0,
    currency: data.currency || 'USD',
    commissionRate: 20, 
    walletBalance: 0,
    whiteLabel: { enabled: false },
    allowedCourses: []
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...list, newFranchise]));
  return newFranchise;
};

export const updateFranchiseStatus = (id: string, status: Franchise['status']): Franchise[] => {
  const list = getAllFranchises();
  const updated = list.map(f => f.id === id ? { ...f, status } : f);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const updateFranchiseSettings = (id: string, settings: Partial<Franchise>): Franchise[] => {
    const list = getAllFranchises();
    const updated = list.map(f => f.id === id ? { ...f, ...settings } : f);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
};
