import { CERTIFICATES_DB } from '../constants';
import { CertificateData, BlockchainRecord } from '../types';

const STORAGE_KEY = 'dsh_certificates';

// Initialize storage if empty
const initStorage = () => {
  if (typeof window !== 'undefined' && !localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(CERTIFICATES_DB));
  }
};

export const getAllCertificates = (): CertificateData[] => {
  initStorage();
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : CERTIFICATES_DB;
};

export const getCertificateById = (id: string): CertificateData | undefined => {
  const certs = getAllCertificates();
  return certs.find(c => c.id === id);
};

export const generateCertificateId = (courseName: string): string => {
  const courseCode = courseName
    .split(' ')
    .filter(w => w.length > 2) // Ignore small words
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .substring(0, 4);
    
  const year = new Date().getFullYear();
  // Generate a random 5 digit number
  const randomNum = Math.floor(10000 + Math.random() * 90000); 
  
  return `DSH-${courseCode || 'GEN'}-${year}-${randomNum}`;
};

export const issueCertificate = (studentName: string, courseName: string): CertificateData => {
  const certs = getAllCertificates();
  
  // Check if already exists to prevent duplicates
  const existing = certs.find(c => c.studentName === studentName && c.courseName === courseName);
  if (existing) return existing;

  const newCert: CertificateData = {
    id: generateCertificateId(courseName),
    studentName,
    courseName,
    issueDate: new Date().toLocaleDateString('en-GB'), // DD/MM/YYYY
    status: 'Approved', // Auto-approve upon course completion
    grade: 'A+' // Default grade for completion
  };

  const updatedCerts = [newCert, ...certs]; // Prepend new cert
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCerts));
  return newCert;
};

export const updateCertificateStatus = (id: string, status: 'Pending' | 'Approved' | 'Revoked'): CertificateData[] => {
  const certs = getAllCertificates();
  const updatedCerts = certs.map(c => c.id === id ? { ...c, status } : c);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCerts));
  return updatedCerts;
};

export const attachBlockchainRecord = (id: string, record: BlockchainRecord): CertificateData[] => {
  const certs = getAllCertificates();
  const updatedCerts = certs.map(c => c.id === id ? { ...c, blockchain: record } : c);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCerts));
  return updatedCerts;
};