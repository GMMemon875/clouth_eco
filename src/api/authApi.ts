import { IUser, IRegisterData } from '../types/auth';
import { IOrder } from '../types/store';

const BACKEND_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const API_BASE = `${BACKEND_BASE}/api/auth`;

export function getAuthToken(): string | null {
  return localStorage.getItem('noor_auth_token');
}

export function setAuthToken(token: string | null) {
  if (token) {
    localStorage.setItem('noor_auth_token', token);
  } else {
    localStorage.removeItem('noor_auth_token');
  }
}

export function getAuthHeaders(): Record<string, string> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function registerCustomerApi(data: IRegisterData): Promise<{ user: IUser; token: string }> {
  const res = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Registration failed');
  }

  setAuthToken(json.data.token);
  return json.data;
}

export async function loginCustomerApi(email: string, password: string): Promise<{ user: IUser; token: string }> {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Invalid credentials');
  }

  setAuthToken(json.data.token);
  return json.data;
}

export async function loginAdminApi(email: string, password: string): Promise<{ user: IUser; token: string }> {
  const res = await fetch(`${API_BASE}/admin-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Administrator authentication failed');
  }

  setAuthToken(json.data.token);
  return json.data;
}

export async function logoutApi(): Promise<void> {
  try {
    await fetch(`${API_BASE}/logout`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
    });
  } catch (err) {
    console.error('Logout request error:', err);
  } finally {
    setAuthToken(null);
  }
}

export async function fetchCurrentProfile(): Promise<IUser | null> {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const res = await fetch(`${API_BASE}/me`, {
      headers: getAuthHeaders(),
      credentials: 'include',
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      setAuthToken(null);
      return null;
    }

    return json.data;
  } catch (err) {
    return null;
  }
}

export async function updateProfileApi(updates: {
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
  area?: string;
  landmark?: string;
}): Promise<IUser> {
  const res = await fetch(`${API_BASE}/profile`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify(updates),
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Failed to update profile');
  }

  return json.data;
}

export async function changePasswordApi(
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
): Promise<void> {
  const res = await fetch(`${API_BASE}/change-password`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Failed to change password');
  }
}

export async function requestPasswordResetApi(email: string): Promise<string> {
  const res = await fetch(`${API_BASE}/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Password reset request failed');
  }

  return json.message || 'Password reset instructions dispatched.';
}

export async function resetPasswordApi(token: string, newPassword: string, confirmPassword: string): Promise<string> {
  const res = await fetch(`${API_BASE}/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, newPassword, confirmPassword }),
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Password reset failed');
  }

  return json.message || 'Password reset successfully.';
}

export async function fetchMyOrdersApi(): Promise<IOrder[]> {
  const res = await fetch('/api/orders/my-orders', {
    headers: getAuthHeaders(),
    credentials: 'include',
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Failed to load your orders');
  }

  return json.data;
}
