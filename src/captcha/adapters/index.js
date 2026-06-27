import KaptchaAdapter from './KaptchaAdapter.jsx';
import TurnstileAdapter from './TurnstileAdapter.jsx';

/**
 * Adapter registry. Adding a new captcha provider on the backend means adding
 * one entry here on the frontend. The ContactView never branches on provider.
 */
export const ADAPTERS = {
  kaptcha:   KaptchaAdapter,
  turnstile: TurnstileAdapter,
};
