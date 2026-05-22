
import { AttestationRecord, AttestationType, AttestationStatus } from '../types';
import { getAllCertificates } from './certificateManager';

const STORAGE_KEY = 'dsh_attestations';

// Mock Data
const MOCK_ATTESTATIONS: AttestationRecord[] = [
  {
    id: 'DSH-ATT-2024-001',
    certificateId: 'DSH-FREELANCE-2024-001',
    studentName: 'Ali Ahmed',
    courseName: 'Freelancing & Online Earning',
    type: 'Academy',
    requestDate: '2024-10-26',
    attestationDate: '2024-10-27',
    status: 'Issued',
    officerName: 'Sarkar Azeem',
    feePaid: true
  }
];

const initStorage = () => {
  if (typeof window !== 'undefined' && !localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_ATTESTATIONS));
  }
};

export const getAllAttestations = (): AttestationRecord[] => {
  initStorage();
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : MOCK_ATTESTATIONS;
};

export const getAttestationById = (id: string): AttestationRecord | undefined => {
  const list = getAllAttestations();
  return list.find(a => a.id === id);
};

export const getAttestationByCertId = (certId: string): AttestationRecord | undefined => {
  const list = getAllAttestations();
  return list.find(a => a.certificateId === certId);
};

export const requestAttestation = (certId: string, studentName: string, courseName: string, type: AttestationType): AttestationRecord => {
  const list = getAllAttestations();
  
  // Check existing
  const existing = list.find(a => a.certificateId === certId);
  if (existing) return existing;

  const newRecord: AttestationRecord = {
    id: `DSH-ATT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    certificateId: certId,
    studentName,
    courseName,
    type,
    requestDate: new Date().toISOString().split('T')[0],
    status: 'Pending',
    feePaid: false // In real app, integrated with payment
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify([...list, newRecord]));
  return newRecord;
};

export const updateAttestationStatus = (id: string, status: AttestationStatus, officerName?: string): AttestationRecord[] => {
  const list = getAllAttestations();
  const updated = list.map(a => {
    if (a.id === id) {
      return {
        ...a,
        status,
        officerName: officerName || a.officerName,
        attestationDate: status === 'Issued' || status === 'Attested' ? new Date().toISOString().split('T')[0] : a.attestationDate
      };
    }
    return a;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};
