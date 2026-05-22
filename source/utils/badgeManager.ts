
import { SkillBadge } from '../types';

const STORAGE_KEY = 'dsh_skill_badges';

// Initial Mock Badges to populate for demo
const MOCK_BADGES: SkillBadge[] = [
  {
    id: 'SB-SEO-001',
    skillName: 'SEO Keyword Research',
    skillNameUr: 'SEO کی ورڈ ریسرچ',
    studentName: 'Ali Ahmed',
    category: 'Marketing',
    level: 'Intermediate',
    issueDate: '2024-10-15',
    courseId: 'seo-specialist',
    status: 'Verified'
  },
  {
    id: 'SB-AI-002',
    skillName: 'Prompt Engineering',
    skillNameUr: 'پرامپٹ انجینئرنگ',
    studentName: 'Ali Ahmed',
    category: 'AI',
    level: 'Beginner',
    issueDate: '2024-10-20',
    courseId: 'ai-automation',
    status: 'Verified'
  },
  {
    id: 'SB-DEV-003',
    skillName: 'React Components',
    skillNameUr: 'ری ایکٹ اجزاء',
    studentName: 'Ali Ahmed',
    category: 'Development',
    level: 'Advanced',
    issueDate: '2024-10-25',
    courseId: 'web-dev',
    status: 'Verified'
  }
];

const initStorage = () => {
  if (typeof window !== 'undefined' && !localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_BADGES));
  }
};

export const getAllBadges = (): SkillBadge[] => {
  initStorage();
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : MOCK_BADGES;
};

export const getBadgeById = (id: string): SkillBadge | undefined => {
  const badges = getAllBadges();
  return badges.find(b => b.id === id);
};

export const getStudentBadges = (studentName: string): SkillBadge[] => {
  const badges = getAllBadges();
  return badges.filter(b => b.studentName === studentName);
};

export const issueBadge = (badge: Omit<SkillBadge, 'id' | 'issueDate' | 'status'>): SkillBadge => {
  const badges = getAllBadges();
  
  // Prevent duplicate
  const existing = badges.find(b => b.studentName === badge.studentName && b.skillName === badge.skillName);
  if (existing) return existing;

  const newBadge: SkillBadge = {
    ...badge,
    id: `SB-${Math.floor(1000 + Math.random() * 9000)}`,
    issueDate: new Date().toISOString().split('T')[0],
    status: 'Verified'
  };

  const updatedBadges = [newBadge, ...badges];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBadges));
  return newBadge;
};
