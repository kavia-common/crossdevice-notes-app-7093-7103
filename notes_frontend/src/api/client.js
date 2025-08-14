import Cookies from 'js-cookie';

/**
 * API client for communicating with the backend.
 * Uses a token from a cookie if available and always includes credentials for server-managed cookies.
 */
const FALLBACK_API_BASE = 'http://localhost:3001'; // For local development only
const API_BASE = (process.env.REACT_APP_API_BASE || FALLBACK_API_BASE).replace(/\/+$/, '');

// PUBLIC_INTERFACE
export function getApiBase() {
  /** Returns the configured API base URL. Prefer setting REACT_APP_API_BASE in .env. */
  return API_BASE;
}

function getAuthHeader() {
  const token = Cookies.get('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleJsonResponse(res) {
  const contentType = res.headers.get('content-type') || '';
  let data = null;
  if (contentType.includes('application/json')) {
    data = await res.json();
  } else {
    const text = await res.text();
    data = text ? { message: text } : null;
  }

  if (!res.ok) {
    const message = (data && (data.error || data.message)) || `Request failed with ${res.status}`;
    const error = new Error(message);
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
}

// PUBLIC_INTERFACE
export async function apiFetch(path, { method = 'GET', body, headers = {}, auth = true } = {}) {
  /**
   * Generic fetch wrapper for the API.
   * - path: API endpoint path starting with '/'
   * - method: HTTP method
   * - body: object to be JSON.stringified
   * - headers: additional headers
   * - auth: whether to attach Authorization header from cookie
   */
  const h = {
    'Content-Type': 'application/json',
    ...(auth ? getAuthHeader() : {}),
    ...headers,
  };

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: h,
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include', // send/receive cookies
  });

  // If backend returns token via JSON, capture and persist it
  const data = await handleJsonResponse(res);
  if (data && data.token) {
    Cookies.set('auth_token', data.token, { sameSite: 'Lax' });
  }
  return data;
}

// PUBLIC_INTERFACE
export const AuthApi = {
  /** Login with email/password. Returns user or login response. */
  login: (email, password) => apiFetch('/auth/login', { method: 'POST', body: { email, password }, auth: false }),
  /** Register with email/password. */
  register: (email, password) => apiFetch('/auth/register', { method: 'POST', body: { email, password }, auth: false }),
  /** Logout (server-side and client-side). */
  logout: async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST', auth: true });
    } catch (_) {
      // ignore logout errors
    }
    Cookies.remove('auth_token');
    return true;
  },
  /** Optionally fetch current user */
  me: () => apiFetch('/auth/me', { method: 'GET', auth: true }),
};

// PUBLIC_INTERFACE
export const NotesApi = {
  /** Fetch all notes for the current user. */
  list: () => apiFetch('/notes', { method: 'GET', auth: true }),
  /** Create a new note. */
  create: (payload) => apiFetch('/notes', { method: 'POST', body: payload, auth: true }),
  /** Update a note by id. */
  update: (id, payload) => apiFetch(`/notes/${encodeURIComponent(id)}`, { method: 'PUT', body: payload, auth: true }),
  /** Delete a note by id. */
  remove: (id) => apiFetch(`/notes/${encodeURIComponent(id)}`, { method: 'DELETE', auth: true }),
};
