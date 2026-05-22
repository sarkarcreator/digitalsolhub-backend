
import { CertificateData, EmployerAccount, ApiLog } from '../types';
import { getAllCertificates } from './certificateManager';

const STORAGE_KEY = 'dsh_employer_api';

// Initial Mock Data
const MOCK_EMPLOYER: EmployerAccount = {
  companyName: "Tech Recruiters Inc.",
  email: "hr@techrecruiters.com",
  plan: "Enterprise",
  trustScore: 98,
  apiKeys: [
    { key: "dsh_live_sk_83920193", createdAt: "2024-01-15", status: "Active", label: "Production Key" }
  ],
  logs: [
    { id: "req_1", timestamp: new Date(Date.now() - 100000).toISOString(), endpoint: "/verify/certificate/DSH-FREELANCE-2024-001", method: "GET", status: 200, ip: "192.168.1.1", userAgent: "PostmanRuntime/7.29.0" },
    { id: "req_2", timestamp: new Date(Date.now() - 200000).toISOString(), endpoint: "/verify/bulk", method: "POST", status: 200, ip: "192.168.1.1", userAgent: "Python-requests/2.26.0" }
  ]
};

// Initialize Storage
const initStorage = () => {
  if (typeof window !== 'undefined' && !localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_EMPLOYER));
  }
};

export const getEmployerAccount = (): EmployerAccount => {
  initStorage();
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : MOCK_EMPLOYER;
};

export const generateApiKey = (label: string): string => {
  const account = getEmployerAccount();
  const newKey = `dsh_live_sk_${Math.random().toString(36).substr(2, 9)}`;
  const updatedKeys = [...account.apiKeys, {
    key: newKey,
    createdAt: new Date().toISOString(),
    status: 'Active' as const,
    label
  }];
  
  const updatedAccount = { ...account, apiKeys: updatedKeys };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAccount));
  return newKey;
};

export const revokeApiKey = (key: string) => {
  const account = getEmployerAccount();
  const updatedKeys = account.apiKeys.map(k => k.key === key ? { ...k, status: 'Revoked' as const } : k);
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...account, apiKeys: updatedKeys }));
};

// --- SIMULATED API ENDPOINTS ---

interface ApiResponse {
  status: number;
  data?: any;
  error?: string;
}

const logRequest = (endpoint: string, method: 'GET' | 'POST', status: any) => {
  const account = getEmployerAccount();
  const newLog: ApiLog = {
    id: `req_${Date.now()}`,
    timestamp: new Date().toISOString(),
    endpoint,
    method,
    status: status,
    ip: "Simulated",
    userAgent: navigator.userAgent
  };
  // Keep last 50 logs
  const updatedLogs = [newLog, ...account.logs].slice(0, 50);
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...account, logs: updatedLogs }));
};

export const simulateApiCall = async (endpoint: string, method: 'GET' | 'POST', payload?: any, apiKey?: string): Promise<ApiResponse> => {
  // 1. Authenticate
  const account = getEmployerAccount();
  const validKey = account.apiKeys.find(k => k.key === apiKey && k.status === 'Active');
  
  // Simulate Network Latency
  await new Promise(resolve => setTimeout(resolve, 600));

  if (!apiKey || !validKey) {
    logRequest(endpoint, method, 401);
    return { status: 401, error: "Unauthorized: Invalid or missing API Key" };
  }

  // 2. Routing Logic
  try {
    const certificates = getAllCertificates();

    // Endpoint: GET /verify/certificate/{id}
    if (method === 'GET' && endpoint.startsWith('/verify/certificate/')) {
      const certId = endpoint.split('/').pop();
      const cert = certificates.find(c => c.id === certId);

      if (!cert) {
        logRequest(endpoint, method, 404);
        return { status: 404, error: "Certificate not found" };
      }

      logRequest(endpoint, method, 200);
      return {
        status: 200,
        data: {
          status: cert.status === 'Approved' ? 'verified' : cert.status.toLowerCase(),
          certificate_id: cert.id,
          student_name: `${cert.studentName.charAt(0)}*** ${cert.studentName.split(' ').pop()}`, // GDPR Masking
          course_name: cert.courseName,
          issue_date: cert.issueDate,
          issuer: "Digital Solutions Hub",
          verification_url: `https://digitalsolhub.com/verify/${cert.id}`,
          blockchain: cert.blockchain ? {
             network: cert.blockchain.network,
             tx_hash: cert.blockchain.txHash
          } : null
        }
      };
    }

    // Endpoint: POST /verify/bulk
    if (method === 'POST' && endpoint === '/verify/bulk') {
      const ids = payload?.ids || [];
      if (!Array.isArray(ids) || ids.length === 0) {
         logRequest(endpoint, method, 400);
         return { status: 400, error: "Invalid payload: 'ids' array required" };
      }

      const results = ids.map(id => {
        const cert = certificates.find(c => c.id === id);
        return {
          id,
          status: cert ? (cert.status === 'Approved' ? 'verified' : cert.status.toLowerCase()) : 'not_found',
          course: cert?.courseName || null
        };
      });

      logRequest(endpoint, method, 200);
      return { status: 200, data: { total: ids.length, results } };
    }

    // Endpoint: POST /verify/hash
    if (method === 'POST' && endpoint === '/verify/hash') {
        const hash = payload?.hash;
        const cert = certificates.find(c => c.blockchain?.integrityHash === hash);
        
        if(cert) {
            logRequest(endpoint, method, 200);
            return { 
                status: 200, 
                data: { 
                    status: 'verified', 
                    certificate_id: cert.id,
                    integrity_match: true
                } 
            };
        } else {
            logRequest(endpoint, method, 404);
            return { status: 404, error: "Hash not found on ledger" };
        }
    }

    logRequest(endpoint, method, 404);
    return { status: 404, error: "Endpoint not found" };

  } catch (err) {
    logRequest(endpoint, method, 500);
    return { status: 500, error: "Internal Server Error" };
  }
};
