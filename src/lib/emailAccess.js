import { useEffect, useState } from 'react';

export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

function consumeLinkToken(name) {
  const token = new URLSearchParams(window.location.hash.slice(1)).get('token');
  if (token) {
    try { sessionStorage.setItem(name, token); } catch { /* The current link still works if storage is disabled. */ }
    window.history.replaceState(window.history.state, '', window.location.pathname + window.location.search);
  }
  return token;
}

export function useEmailAccess(name) {
  const [token, setToken] = useState(() => {
    const incoming = consumeLinkToken(name);
    if (incoming) return incoming;
    try { return sessionStorage.getItem(name) || ''; } catch { return ''; }
  });
  useEffect(() => {
    // Email clients may reuse a tab already on this path. A hash-only
    // navigation does not remount the React page, so consume the new link too.
    const onLinkChange = () => {
      const incoming = consumeLinkToken(name);
      if (incoming) setToken(incoming);
    };
    window.addEventListener('hashchange', onLinkChange);
    onLinkChange();
    return () => window.removeEventListener('hashchange', onLinkChange);
  }, [name]);
  return [token, setToken];
}

export async function accessRequest(path, token, body) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: body === undefined ? 'GET' : 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    cache: 'no-store', referrerPolicy: 'no-referrer',
  });
  let result;
  try { result = await response.json(); }
  catch { throw new Error('Unable to load this page. Please try again.'); }
  if (!response.ok) throw new Error(result.message || 'Unable to load this page');
  return result;
}
