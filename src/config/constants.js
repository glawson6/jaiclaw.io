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

// Build-time feature flags. Vite inlines import.meta.env.* at build time.
// Default OFF: unset / empty / anything other than the exact strings 'true'/'1'
// resolves to false. To enable, set JAICLAW_FEATURE_PRICING=true at build time.
export const FEATURE_PRICING = ['true', '1'].includes(
  String(import.meta.env.JAICLAW_FEATURE_PRICING ?? '').toLowerCase()
);
