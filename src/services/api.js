
const API_URL =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_URL) ||
  (typeof process !== "undefined" && process.env && process.env.REACT_APP_API_URL) ||
  "http://127.0.0.1:8000"; 

const BASE = API_URL.replace(/\/$/, ""); // retire le / final si présent

// Clés de stockage local 
const ACCESS_KEY = "JO_ACCESS_V1";
const REFRESH_KEY = "JO_REFRESH_V1";

export function setTokens(access, refresh) {
  if (access) localStorage.setItem(ACCESS_KEY, access);
  if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
}
export function getAccessToken() {
  return localStorage.getItem(ACCESS_KEY) || "";
}
export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY) || "";
}
export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

// Helper fetch avec retry automatique en cas de 401 
async function apiFetch(path, { method = "GET", body, headers = {}, retry = true } = {}) {
  const token = getAccessToken();
  const init = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  };

  const res = await fetch(`${BASE}${path}`, init);

  // si 401 et on a un refresh → tenter un refresh une seule fois
  if (res.status === 401 && retry) {
    const refresh = getRefreshToken();
    if (refresh) {
      const r = await fetch(`${BASE}/api/accounts/token/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      });
      if (r.ok) {
        const data = await r.json();
        const newAccess = data.access;
        if (newAccess) {
          setTokens(newAccess, refresh);
          return apiFetch(path, { method, body, headers, retry: false });
        }
      }
      clearTokens();
    }
  }

  // parse JSON ou message d’erreur lisible
  let payload = null;
  const text = await res.text();
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = { detail: text || "Invalid JSON response" };
  }

  if (!res.ok) {
    const err = new Error(payload?.detail || `HTTP ${res.status}`);
    err.status = res.status;
    err.payload = payload;
    throw err;
  }
  return payload;
}

// -------- Endpoints comptes --------

export async function register({ username, email, password }) {
  const out = await apiFetch("/api/accounts/register", {
    method: "POST",
    body: { username, email, password },
  });
  const access = out?.tokens?.access;
  const refresh = out?.tokens?.refresh;
  if (access && refresh) setTokens(access, refresh);
  return out;
}

export async function login({ username, password }) {
  const out = await apiFetch("/api/accounts/login", {
    method: "POST",
    body: { username, password },
  });
  if (out?.access && out?.refresh) setTokens(out.access, out.refresh);
  return out;
}

export async function getMe() {
  return apiFetch("/api/accounts/me");
}

export function logout() {
  clearTokens();
}

// -------- Endpoints réservations / tickets --------

/**
 * payload attendu :
 * {
 *   client: { nom, prenom, email, telephone? },
 *   panier: [ { id, titre, prix, qty }, ... ],
 *   total: number|string,
 *   places: number
 * }
 */
export async function createReservation(payload) {
  return apiFetch("/api/reservations", {
    method: "POST",
    body: payload,
  }); // => { reservation_id }
}

export async function checkout(reservation_id) {
  return apiFetch("/api/checkout", {
    method: "POST",
    body: { reservation_id },
  }); // => { status:"paid", ticket:{ id, reservation_id, qr_url, summary:{...} } }
}

export async function getTicket(id) {
  return apiFetch(`/api/tickets/${id}`); // => { id, reservation_id, qr_url, created_at }
}

export async function verifyToken(tokenOrQr) {
  const body =
    (tokenOrQr || "").startsWith("jo://ticket/")
      ? { qr: tokenOrQr }
      : { token: tokenOrQr };
  return apiFetch("/api/verify", { method: "POST", body });
}

export const API_BASE = BASE;
