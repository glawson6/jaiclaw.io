// JaiClaw.io site constants

export const SITE_NAME = 'JaiClaw';
export const SITE_TAGLINE = 'The Java Framework for Building AI Assistants That Actually Ship';

export const GITHUB_URL = 'https://github.com/glawson6/jaiclaw';
export const GITHUB_EXAMPLES_URL = 'https://github.com/glawson6/jaiclaw/tree/main/jaiclaw-examples';
export const GITHUB_DOCS_URL = 'https://github.com/glawson6/jaiclaw/tree/main/docs';

export const TAPTECH_URL = 'https://holdings.taptech.net';

export const JAICLAW_CONTACT_API_URL = import.meta.env.JAICLAW_CONTACT_API_URL || '';

// Base URL for the captcha service backing the Contact form. When unset, the
// ContactView skips captcha minting/rendering — server-side captcha enforcement
// is treated as off in that env.
export const JAICLAW_CAPTCHA_URL = import.meta.env.JAICLAW_CAPTCHA_URL || '';

// Submission-token mint endpoint. When unset, ContactView skips the token fetch
// and submits without the X-Submission-Token header — useful for local dev
// against a server with taptech.crm.protect.submission-token.enabled=false.
export const JAICLAW_TOKEN_API_URL = import.meta.env.JAICLAW_TOKEN_API_URL || '';

// Build-time feature flags. Vite inlines import.meta.env.* at build time.
// Default OFF: unset / empty / anything other than the exact strings 'true'/'1'
// resolves to false. To enable, set JAICLAW_FEATURE_PRICING=true at build time.
export const FEATURE_PRICING = ['true', '1'].includes(
  String(import.meta.env.JAICLAW_FEATURE_PRICING ?? '').toLowerCase()
);

// Submission token feature flag. Default ON: only an explicit 'false' or '0'
// turns it off. The negative-flag style is deliberate — security defaults
// should be on unless deliberately disabled (the opposite of FEATURE_PRICING).
export const FEATURE_SUBMISSION_TOKEN = !['false', '0'].includes(
  String(import.meta.env.JAICLAW_FEATURE_SUBMISSION_TOKEN ?? '').toLowerCase()
);
