import { Language } from '../types';

export type UserRole = 'student' | 'client' | 'admin';

export interface AuthUser {
  id: number | string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  studentId?: string | null;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
  message?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  role: UserRole;
}

export interface RegisterPayload {
  role: Exclude<UserRole, 'admin'>;
  name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
  student_id?: string;
  course?: string;
  industry?: string;
  project?: string;
  language?: Language;
}

export interface AdminStudentLead {
  id: number | string;
  name: string;
  email: string;
  phone: string;
  studentId: string;
  course: string;
  status: 'invited' | 'registered' | 'disabled';
  createdAt?: string;
}

export interface AdminStudentCreatePayload {
  name: string;
  email: string;
  phone: string;
  course: string;
}

const API_BASE_URL = (import.meta as ImportMeta & { env?: Record<string, string> }).env?.VITE_API_BASE_URL || '/api';
const AUTH_STORAGE_KEY = 'dsh_auth';

class ApiError extends Error {
  status?: number;
  payload?: unknown;
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as AuthResponse;
    return parsed.token;
  } catch {
    return null;
  }
}

function persistAuth(data: AuthResponse) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
}

export function clearAuth() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function getStoredAuth(): AuthResponse | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthResponse;
  } catch {
    return null;
  }
}

async function request<T>(path: string, init: RequestInit = {}, requiresAuth = false): Promise<T> {
  const headers = new Headers(init.headers || {});
  headers.set('Accept', 'application/json');

  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (requiresAuth) {
    const token = getToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await response.json() : await response.text();

  if (!response.ok) {
    const error = new ApiError(
      typeof payload === 'object' && payload && 'message' in payload ? String((payload as { message?: string }).message) : 'Request failed.'
    );
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload as T;
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const data = await request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  persistAuth(data);
  return data;
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const data = await request<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  persistAuth(data);
  return data;
}

export async function fetchAdminStudents(): Promise<AdminStudentLead[]> {
  return request<AdminStudentLead[]>('/admin/students', {}, true);
}

export async function createAdminStudent(payload: AdminStudentCreatePayload): Promise<AdminStudentLead> {
  return request<AdminStudentLead>('/admin/students', {
    method: 'POST',
    body: JSON.stringify(payload)
  }, true);
}
