/**
 * POSTs the contact form. Pure function — no React, no DOM. Usable by any
 * future form that needs the same token + captcha + honeypot envelope.
 *
 * args:
 *   apiUrl       Full URL for POST /leads
 *   body         { name, email, subject, message, honeypot, captcha }
 *   token        Submission token string, or null to skip the header
 *   tokenHeader  Header name. Defaults to 'X-Submission-Token' to match server.
 *
 * throws (all extend SubmitError, all carry .status):
 *   SubmissionTokenError    server rejected the token; caller should re-mint
 *   RateLimitError          429; .retryAfter (seconds) when the server sent one
 *   CaptchaError            captcha-failed; caller should re-mint captcha
 *   ValidationError         400; .detail carries the server message
 *   SubmitError             anything else
 */

export class SubmitError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'SubmitError';
    this.status = status;
  }
}

export class SubmissionTokenError extends SubmitError {
  constructor(message, status) {
    super(message, status);
    this.name = 'SubmissionTokenError';
  }
}

export class RateLimitError extends SubmitError {
  constructor(message, status, retryAfter) {
    super(message, status);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}

export class CaptchaError extends SubmitError {
  constructor(message, status) {
    super(message, status);
    this.name = 'CaptchaError';
  }
}

export class ValidationError extends SubmitError {
  constructor(message, status, detail) {
    super(message, status);
    this.name = 'ValidationError';
    this.detail = detail;
  }
}

// RFC 7807 problem types — matched by exact string against problem.type so the
// server can evolve the human messages without breaking client routing.
const TOKEN_PROBLEM = 'https://taptech.net/problems/submission-token-invalid';
const CAPTCHA_PROBLEM = 'https://taptech.net/problems/captcha-failed';
const RATE_PROBLEM = 'https://taptech.net/problems/rate-limited';

export async function submitContact({ apiUrl, body, token, tokenHeader = 'X-Submission-Token' }) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers[tokenHeader] = token;

  const res = await fetch(apiUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  if (res.ok) return;

  const problem = await res.json().catch(() => ({}));
  const msg = problem.detail || problem.title || res.statusText || 'Submit failed';

  if (problem.type === TOKEN_PROBLEM) throw new SubmissionTokenError(msg, res.status);
  if (problem.type === CAPTCHA_PROBLEM) throw new CaptchaError(msg, res.status);
  if (problem.type === RATE_PROBLEM || res.status === 429) {
    const ra = res.headers.get('Retry-After');
    throw new RateLimitError(msg, res.status, ra ? parseInt(ra, 10) : null);
  }
  if (res.status === 400) throw new ValidationError(msg, res.status, problem.detail);
  throw new SubmitError(msg, res.status);
}
