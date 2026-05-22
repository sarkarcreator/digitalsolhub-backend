
export enum Language {
  ENGLISH = 'en',
  URDU = 'ur',
  ARABIC = 'ar',
  RUSSIAN = 'ru'
}

export interface Course {
  id: string;
  title: string;
  titleUr?: string; // Urdu Title
  description: string;
  descriptionUr?: string; // Urdu Description
  category: string;
  categoryUr?: string; // Urdu Category
  duration: string;
  durationUr?: string;
  image: string;
  price?: string;
  rating?: number;
  students?: number;
  instructor?: {
    name: string;
    role: string;
    roleUr?: string;
    image: string;
    bio?: string;
    bioUr?: string;
    quote?: string;
    quoteUr?: string;
    socials?: {
      linkedin?: string;
      twitter?: string;
      website?: string;
    };
  };
  learningOutcomes?: string[];
  learningOutcomesUr?: string[];
  fullDescription?: string;
  fullDescriptionUr?: string;
}

export interface NavItem {
  id: string;
  label: string;
  path: string;
}

export interface Translations {
  [key: string]: {
    [key in Language]?: string;
  };
}

export interface ServiceDetail {
  tagline: { [key in Language]?: string };
  metaTitle: { [key in Language]?: string };
  metaDesc: { [key in Language]?: string };
  keywords: { [key in Language]?: string };
  benefits: { title: { [key in Language]?: string }; desc: { [key in Language]?: string } }[];
  process: { title: { [key in Language]?: string }; desc: { [key in Language]?: string } }[];
  faqs: { question: { [key in Language]?: string }; answer: { [key in Language]?: string } }[];
}

export interface ServiceCategory {
  id: string;
  title: { [key in Language]?: string };
  items: string[];
  details: ServiceDetail;
}

// CRM Types
export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: 'Website' | 'WhatsApp' | 'Ads' | 'Referral' | 'Manual';
  interest: string; // Course or Service Name
  type: 'Student' | 'Client';
  status: LeadStatus;
  budget: string;
  language: Language;
  notes: string[];
  createdAt: string;
  lastContact: string;
  probability?: number; // AI Predicted
}

// Franchise & Accreditation Types
export type FranchiseType = 'Company-Owned' | 'Partner' | 'International' | 'Online';
export type AccreditationType = 'ATP' | 'AI' | 'AF' | 'CTP' | 'None'; 
// ATP: Accredited Training Partner, AI: Accredited Instructor, AF: Accredited Franchise, CTP: Corporate Training Partner
export type BadgeLevel = 'Gold' | 'Silver' | 'Platinum' | 'None';

export interface Franchise {
  id: string;
  name: string; // e.g. "DSH Lahore Branch" or "TechInstitute (Accredited)"
  type: FranchiseType;
  accreditationType: AccreditationType;
  badgeLevel?: BadgeLevel;
  ownerName: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  status: 'Active' | 'Pending' | 'Suspended';
  joinedDate: string;
  studentsCount: number;
  revenue: number;
  currency: string;
  commissionRate: number; // Percentage sent to HQ (e.g. 20)
  walletBalance: number; // Earnings available for withdrawal
  
  // White Label & Content Settings
  whiteLabel?: {
    enabled: boolean;
    customLogo?: string;
    primaryColor?: string;
    domain?: string; // e.g. partner.dsh.com
  };
  allowedCourses?: string[]; // IDs of courses they are licensed to teach
}

// Partner (White-Label SaaS) Types
export interface Partner {
  id: string;
  slug: string; // unique handle for URLs (e.g. 'tech-institute')
  name: string;
  tagline: string;
  logo: string;
  brandColor: string;
  email: string;
  phone: string;
  website: string;
  status: 'Active' | 'Pending' | 'Suspended';
  plan: 'Starter' | 'Growth' | 'Enterprise';
  createdAt: string;
  settings: {
    enableBlockchain: boolean;
    enableAttestation: boolean;
    customDomain?: string;
  };
  stats: {
    certificatesIssued: number;
    students: number;
  };
}

// Blockchain & Certificate Types
export type BlockchainNetwork = 'Polygon' | 'Ethereum' | 'BNB Chain' | 'Solana';

export interface BlockchainRecord {
  network: BlockchainNetwork;
  txHash: string;
  blockNumber: number;
  contractAddress: string;
  timestamp: string;
  integrityHash: string; // The cryptographic hash of the certificate data
  nftTokenId?: string; // Optional if minted as NFT
}

// Attestation Types
export type AttestationStatus = 'Pending' | 'Verified' | 'Attested' | 'Issued' | 'Rejected';
export type AttestationType = 'Academy' | 'Compliance' | 'Skill' | 'Blockchain';

export interface AttestationRecord {
  id: string;
  certificateId: string;
  studentName: string;
  courseName: string;
  type: AttestationType;
  requestDate: string;
  attestationDate?: string;
  status: AttestationStatus;
  officerName?: string;
  feePaid: boolean;
  qrCode?: string;
}

export interface CertificateData {
  id: string;
  studentName: string;
  courseName: string;
  issueDate: string;
  status: 'Pending' | 'Approved' | 'Revoked';
  grade: string;
  blockchain?: BlockchainRecord; // Optional until minted
  attestation?: AttestationRecord; // Optional official layer
  partnerId?: string; // ID of the issuing partner (if white-labeled)
}

// Employer API Types
export interface ApiKey {
  key: string;
  createdAt: string;
  status: 'Active' | 'Revoked';
  lastUsed?: string;
  label: string;
}

export interface ApiLog {
  id: string;
  timestamp: string;
  endpoint: string;
  method: 'GET' | 'POST';
  status: 200 | 401 | 404 | 429 | 500;
  ip: string;
  userAgent: string;
}

export interface EmployerAccount {
  companyName: string;
  email: string;
  apiKeys: ApiKey[];
  logs: ApiLog[];
  plan: 'Free' | 'Enterprise';
  trustScore: number;
}

// Skill Badge Types
export type SkillCategory = 'Marketing' | 'Development' | 'AI' | 'Freelancing';
export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface SkillBadge {
  id: string;
  skillName: string;
  skillNameUr?: string; // Translation
  studentName: string;
  category: SkillCategory;
  level: SkillLevel;
  issueDate: string;
  courseId: string; // Linked Course
  status: 'Verified' | 'Revoked';
  partnerId?: string; // Issuer
}
