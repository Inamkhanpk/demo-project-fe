const BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

export async function fetchMetrics(params: URLSearchParams) {
  const res = await fetch(`${BASE}/metrics?${params.toString()}`, { cache: 'no-store', credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch metrics');
  return res.json();
}

export function alertsSSE(params: URLSearchParams) {
  console.log('Connecting to SSE with params:', params.toString());
  return new EventSource(`${BASE}/alerts/stream?${params.toString()}`);
}

export function csvUrl(params: URLSearchParams) {
  return `${BASE}/metrics/csv?${params.toString()}`;
}


export async function login( email: string, password: string) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  });

  if (!res.ok) {
    const msg = (await res.json()).message || 'Login failed';
    throw new Error(msg);
  }

  return res.json();
}