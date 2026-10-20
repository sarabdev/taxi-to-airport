const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
const STORAGE_KEY = 'partnerReferral';
const REFERRAL_PARAM = 'ref';

// How long a guest stays attributed to the partner whose link they opened.
export const REFERRAL_TTL_MS = 30 * 24 * 60 * 60 * 1000;

const normalizeCode = (code) =>
  String(code || '').trim().toUpperCase().replace(/[^A-Z0-9-]/g, '');

function readStoredReferral() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (!stored?.referralCode || !stored?.capturedAt) return null;
    if (Date.now() - stored.capturedAt > REFERRAL_TTL_MS) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return stored;
  } catch {
    return null;
  }
}

/** The partner code to attach to a booking, or null when none is active. */
export function getActiveReferralCode() {
  return readStoredReferral()?.referralCode || null;
}

/**
 * Remembers the partner from a `?ref=CODE` link. The code is confirmed with the
 * API first so a mistyped or suspended code never replaces a valid one. The
 * parameter is then removed from the address bar so it is not shared onwards.
 * The most recent valid partner link wins.
 */
export async function captureReferralFromUrl() {
  const url = new URL(window.location.href);
  const code = normalizeCode(url.searchParams.get(REFERRAL_PARAM));
  if (!code) return;

  url.searchParams.delete(REFERRAL_PARAM);
  window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash);

  try {
    const response = await fetch(
      `${API_BASE}/api/partners/referral/${encodeURIComponent(code)}`
    );
    if (!response.ok) return;

    const partner = await response.json();
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        referralCode: partner.referralCode,
        companyName: partner.companyName,
        capturedAt: Date.now(),
      })
    );
  } catch (error) {
    console.error('Unable to confirm partner referral', error);
  }
}
