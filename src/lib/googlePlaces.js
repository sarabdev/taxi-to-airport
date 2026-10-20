const GOOGLE_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY;
const SCRIPT_SELECTOR = 'script[src*="maps.googleapis.com/maps/api/js"]';

let placesPromise = null;

const placesReady = () => Boolean(window.google?.maps?.places);

/**
 * Loads the Google Maps Places library once and resolves with `google.maps`.
 * Reuses a script tag another page may already have added, so the library is
 * never injected twice. Resolves with null when no API key is configured.
 */
export function loadGooglePlaces() {
  if (!GOOGLE_KEY) return Promise.resolve(null);
  if (placesReady()) return Promise.resolve(window.google.maps);
  if (placesPromise) return placesPromise;

  placesPromise = new Promise((resolve, reject) => {
    const onLoad = () =>
      placesReady()
        ? resolve(window.google.maps)
        : reject(new Error('Google Places library failed to load'));
    const onError = () => {
      placesPromise = null;
      reject(new Error('Google Maps script failed to load'));
    };

    let script = document.querySelector(SCRIPT_SELECTOR);

    if (!script) {
      script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_KEY}&libraries=places`;
      script.async = true;
      document.body.appendChild(script);
    }

    script.addEventListener('load', onLoad, { once: true });
    script.addEventListener('error', onError, { once: true });
  });

  return placesPromise;
}

export const getPlaceDisplayName = (place) =>
  place?.name || place?.formatted_address || '';
