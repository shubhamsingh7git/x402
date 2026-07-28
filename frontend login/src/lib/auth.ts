/**
 * DARE Authentication Service
 * Handles JWT token storage, login, register, and auth state.
 */

const API_BASE = import.meta.env.VITE_API_URL || '';
const TOKEN_KEY = 'dare_token';
const USER_KEY = 'dare_user';

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface UserResponse {
  id: string;
  email: string;
  username: string;
  is_active: boolean;
  created_at: string;
}

// ─── Token Storage ──────────────────────────────────────────────────────────

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isLoggedIn(): boolean {
  return getToken() !== null;
}

export function getAuthHeaders(): Record<string, string> {
  const token = getToken();
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}

// ─── Cached User ────────────────────────────────────────────────────────────

export function getCachedUser(): UserResponse | null {
  const data = localStorage.getItem(USER_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }
  return null;
}

function cacheUser(user: UserResponse): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

// ─── API Calls ──────────────────────────────────────────────────────────────

export async function login(email: string, password: string): Promise<TokenResponse> {
  const response = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Login failed' }));
    throw new Error(error.detail || `Login failed (${response.status})`);
  }

  const data: TokenResponse = await response.json();
  setToken(data.access_token);
  
  // Fetch and cache user profile
  try {
    const user = await getCurrentUser();
    cacheUser(user);
  } catch {
    // Non-critical — we have the token
  }
  
  return data;
}

export async function register(
  email: string,
  password: string,
  username: string
): Promise<TokenResponse> {
  const response = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, username, password }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Registration failed' }));
    throw new Error(error.detail || `Registration failed (${response.status})`);
  }

  const data: TokenResponse = await response.json();
  setToken(data.access_token);
  
  // Fetch and cache user profile
  try {
    const user = await getCurrentUser();
    cacheUser(user);
  } catch {
    // Non-critical
  }
  
  return data;
}

export async function getCurrentUser(): Promise<UserResponse> {
  const response = await fetch(`${API_BASE}/api/auth/me`, {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      clearToken();
    }
    throw new Error('Failed to fetch user profile');
  }

  return response.json();
}

export function logout(): void {
  clearToken();
}
