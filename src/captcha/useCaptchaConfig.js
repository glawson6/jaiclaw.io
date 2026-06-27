import { useEffect, useState } from 'react';

/**
 * Fetches GET /captcha once on mount. The shape is provider-agnostic (see
 * backend IssueResult): { provider, id?, imageUrl?, siteKey?, widgetUrl?, ttlSeconds }.
 * Returns null until loaded; null also if baseUrl is empty (captcha disabled).
 */
export function useCaptchaConfig(baseUrl) {
  const [config, setConfig] = useState(null);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!baseUrl) { setConfig(null); return; }
    let cancelled = false;
    fetch(`${baseUrl}/captcha`)
      .then(r => r.ok ? r.json() : Promise.reject(new Error(`captcha mint failed: ${r.status}`)))
      .then(json => { if (!cancelled) setConfig(json); })
      .catch(e => { if (!cancelled) setError(e); });
    return () => { cancelled = true; };
  }, [baseUrl, reloadKey]);

  const reload = () => setReloadKey(k => k + 1);
  return { config, error, reload };
}
