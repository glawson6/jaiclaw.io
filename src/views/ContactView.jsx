import { useEffect, useRef, useState } from 'react';
import {
  JAICLAW_CONTACT_API_URL,
  JAICLAW_CAPTCHA_URL,
  JAICLAW_TOKEN_API_URL,
  FEATURE_SUBMISSION_TOKEN,
} from '../config/constants.js';
import CaptchaWidget from '../captcha/CaptchaWidget.jsx';
import { useCaptchaConfig } from '../captcha/useCaptchaConfig.js';
import { useSubmissionToken } from '../security/useSubmissionToken.js';
import {
  submitContact,
  SubmissionTokenError,
  RateLimitError,
  CaptchaError,
  ValidationError,
} from '../security/submitContact.js';

export default function ContactView() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  // Honeypot ref — bots fill anything visible; humans never see this input.
  const honeypotRef = useRef(null);
  // Provider-agnostic captcha payload — whatever the active adapter produces.
  const [captcha, setCaptcha] = useState(null);

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  // When >0, submit is locked out and the button shows a countdown — driven by
  // a 429 Retry-After. Decremented by a 1s interval.
  const [rateLimitCountdown, setRateLimitCountdown] = useState(0);

  const { config: captchaConfig, reload: reloadCaptcha } = useCaptchaConfig(JAICLAW_CAPTCHA_URL);
  const { token, reload: reloadToken } = useSubmissionToken(
    JAICLAW_TOKEN_API_URL,
    FEATURE_SUBMISSION_TOKEN
  );

  // Countdown tick — runs only while we're rate-limited. Cleared on unmount.
  useEffect(() => {
    if (rateLimitCountdown <= 0) return undefined;
    const id = setInterval(() => setRateLimitCountdown((n) => Math.max(0, n - 1)), 1000);
    return () => clearInterval(id);
  }, [rateLimitCountdown]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Inner submit, parameterised on a token. Returns true on success, false on
  // a SubmissionTokenError that should trigger a one-shot retry, throws otherwise.
  // The retry happens by the outer caller, not recursively here — that keeps
  // the retry budget explicit and easy to reason about.
  const postOnce = async (currentToken) => {
    const body = {
      ...formData,
      honeypot: honeypotRef.current?.value ?? '',
      captcha,
    };
    await submitContact({
      apiUrl: JAICLAW_CONTACT_API_URL,
      body,
      token: currentToken,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rateLimitCountdown > 0) return;
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    // Dev fallback: no API configured → log and pretend success. Keeps the form
    // testable without a backend.
    if (!JAICLAW_CONTACT_API_URL) {
      console.log('Contact form (no API configured):', formData);
      setSuccessMessage('Your message has been sent successfully!');
      setFormData({ name: '', email: '', subject: '', message: '' });
      if (honeypotRef.current) honeypotRef.current.value = '';
      setIsSubmitting(false);
      return;
    }

    // One auto-retry budget: if the token was expired/used by the time we sent
    // it, mint a fresh one and resend transparently. After that, surface the error.
    let retryAttempted = false;
    let currentToken = token;

    while (true) {
      try {
        await postOnce(currentToken);
        setSuccessMessage('Your message has been sent successfully! We will get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
        if (honeypotRef.current) honeypotRef.current.value = '';
        reloadCaptcha();
        setCaptcha(null);
        reloadToken(); // fresh token for the next submit
        break;
      } catch (err) {
        if (err instanceof SubmissionTokenError && !retryAttempted) {
          // Token was already consumed or expired between mint and submit.
          // Mint a fresh one and try once more before surfacing the error.
          retryAttempted = true;
          currentToken = await mintFreshTokenInline();
          if (currentToken) continue;
          // Fell through: re-mint failed → tell the user.
          reloadToken();
          setErrorMessage('Your session expired. Please try again.');
          break;
        }
        if (err instanceof SubmissionTokenError) {
          reloadToken();
          setErrorMessage('Your session expired. Please try again.');
        } else if (err instanceof RateLimitError) {
          const ra = err.retryAfter;
          if (ra && ra > 0) {
            setRateLimitCountdown(ra);
            setErrorMessage(`Too many requests. Please wait ${ra} seconds and try again.`);
          } else {
            setErrorMessage('Too many requests. Please wait a moment and try again.');
          }
        } else if (err instanceof CaptchaError) {
          reloadCaptcha();
          setCaptcha(null);
          setErrorMessage('Captcha failed. Please solve the new challenge and resubmit.');
        } else if (err instanceof ValidationError) {
          setErrorMessage(err.detail || 'Please check the form fields and try again.');
        } else {
          console.error('Contact form submission error:', err);
          setErrorMessage('There was an error sending your message. Please try again.');
        }
        break;
      }
    }

    setIsSubmitting(false);
  };

  // Mint a fresh token synchronously inside the submit handler so we can retry
  // immediately without depending on the hook's effect cycle. Returns the token
  // string or null on failure.
  const mintFreshTokenInline = async () => {
    if (!FEATURE_SUBMISSION_TOKEN || !JAICLAW_TOKEN_API_URL) return null;
    try {
      const r = await fetch(`${JAICLAW_TOKEN_API_URL}/forms/leads/token`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
      if (!r.ok) return null;
      const json = await r.json();
      return json.token || null;
    } catch {
      return null;
    }
  };

  // Disable submit while in-flight, while waiting on the initial token, or
  // while rate-limited. The token check only matters when the feature is on
  // and the URL is set; both off → token is intentionally null and submit
  // should remain enabled.
  const waitingOnToken =
    FEATURE_SUBMISSION_TOKEN && Boolean(JAICLAW_TOKEN_API_URL) && !token;
  const submitDisabled = isSubmitting || waitingOnToken || rateLimitCountdown > 0;

  let submitLabel = 'Send Message';
  if (isSubmitting) submitLabel = 'Sending…';
  else if (rateLimitCountdown > 0) submitLabel = `Wait ${rateLimitCountdown}s…`;
  else if (waitingOnToken) submitLabel = 'Preparing…';

  return (
    <div className="container">
      <div className="intro">
        <h2>Contact Us</h2>
        <p>
          Have questions about JaiClaw? Interested in professional support?
          We would love to hear from you.
        </p>
      </div>

      <div className="contact-form-container">
        <h2>Get in Touch</h2>

        {successMessage && (
          <div className="success-message" role="alert">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="error-message" role="alert">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="subject">Subject *</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message *</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={6}
              required
            />
          </div>

          {/* Honeypot — invisible to humans, filled by bots. Off-screen rather
              than display:none because some bot frameworks skip display:none
              fields. Must stay empty when submitted. */}
          <input
            ref={honeypotRef}
            type="text"
            name="honeypot"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: '-9999px',
              width: '1px',
              height: '1px',
              opacity: 0,
            }}
            defaultValue=""
          />

          <CaptchaWidget
            config={captchaConfig}
            baseUrl={JAICLAW_CAPTCHA_URL}
            onSolved={setCaptcha}
            onReload={reloadCaptcha}
          />

          <button
            type="submit"
            disabled={submitDisabled}
            className="submit-btn"
          >
            {submitLabel}
          </button>
        </form>
      </div>
    </div>
  );
}
