import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Fetches a single-use submission token from <baseUrl>/forms/leads/token.
 * Lifecycle:
 *   - On mount: mint a token (one request, even in React StrictMode dev double-mount).
 *   - reload(): mint a fresh one (call after a 403 token-invalid response or
 *     after a successful submit so the next submit has a fresh token).
 *
 * Returns { token, expiresInSeconds, error, reload }.
 *
 * When baseUrl is empty or enabled is false, the hook is inert and `token`
 * stays null. Callers should treat null token as "skip the header" — server-side
 * the matching protect.submission-token.enabled=false must be set for the POST
 * to succeed in that mode.
 */
export function useSubmissionToken(baseUrl, enabled) {
  const [token, setToken] = useState(null);
  const [expiresInSeconds, setExpiresInSeconds] = useState(0);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  // Latest AbortController so we can cancel an in-flight mint when a new one
  // is requested — and defang React 18+ StrictMode's double-mount of effects
  // so we don't burn a token on initial load in dev.
  const inFlightRef = useRef(null);

  useEffect(() => {
    if (!enabled || !baseUrl) {
      setToken(null);
      return;
    }
    if (inFlightRef.current) inFlightRef.current.abort();
    const controller = new AbortController();
    inFlightRef.current = controller;

    fetch(`${baseUrl}/forms/leads/token`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`token mint failed: ${r.status}`))))
      .then((json) => {
        if (controller.signal.aborted) return;
        setToken(json.token);
        setExpiresInSeconds(json.expiresInSeconds || 0);
        setError(null);
      })
      .catch((e) => {
        if (e.name === 'AbortError') return;
        setError(e);
        setToken(null);
      });

    return () => controller.abort();
  }, [baseUrl, enabled, reloadKey]);

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);
  return { token, expiresInSeconds, error, reload };
}
