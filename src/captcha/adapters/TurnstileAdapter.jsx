import { useEffect, useRef } from 'react';

/**
 * Cloudflare Turnstile widget. Loads the Turnstile JS lazily (once per page),
 * then renders the widget into a div. Resolves the token via the onSolved callback.
 *
 * Props:
 *   config:    { provider:'turnstile', siteKey, widgetUrl, ... }
 *   onSolved:  ({ provider, token }) => void
 */
export default function TurnstileAdapter({ config, onSolved }) {
  const ref = useRef(null);
  const widgetIdRef = useRef(null);

  useEffect(() => {
    if (!config?.siteKey) return;
    let cancelled = false;

    const mount = () => {
      if (cancelled || !ref.current || !window.turnstile) return;
      widgetIdRef.current = window.turnstile.render(ref.current, {
        sitekey: config.siteKey,
        callback: (token) => onSolved({ provider: 'turnstile', token }),
        'expired-callback': () => onSolved({ provider: 'turnstile', token: '' }),
        'error-callback':   () => onSolved({ provider: 'turnstile', token: '' }),
      });
    };

    if (window.turnstile) {
      mount();
    } else {
      const existing = document.querySelector(`script[src="${config.widgetUrl}"]`);
      if (existing) {
        existing.addEventListener('load', mount, { once: true });
      } else {
        const script = document.createElement('script');
        script.src = config.widgetUrl;
        script.async = true;
        script.defer = true;
        script.addEventListener('load', mount, { once: true });
        document.head.appendChild(script);
      }
    }

    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        try { window.turnstile.remove(widgetIdRef.current); } catch (_) {}
        widgetIdRef.current = null;
      }
    };
  }, [config?.siteKey, config?.widgetUrl, onSolved]);

  return (
    <div className="form-group captcha-section">
      <div ref={ref} />
    </div>
  );
}
