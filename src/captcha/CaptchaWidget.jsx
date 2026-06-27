import { ADAPTERS } from './adapters/index.js';

/**
 * Provider-agnostic captcha host. Dispatches to a per-provider adapter by name
 * (config.provider). Adding a new provider:
 *   1. server-side: add a CaptchaProvider bean named "myprov"
 *   2. client-side: write MyProvAdapter and register it in ADAPTERS
 * No changes here, no changes in the form using this widget.
 *
 * Props:
 *   config:   IssueResult from GET /captcha; null until loaded
 *   baseUrl:  origin to prepend to relative image URLs (homegrown providers)
 *   onSolved: forwarded to the active adapter
 *   onReload: forwarded; adapters that support refresh call this
 */
export default function CaptchaWidget({ config, baseUrl, onSolved, onReload }) {
  if (!config) return null;
  const Adapter = ADAPTERS[config.provider];
  if (!Adapter) {
    console.error(`No frontend adapter for captcha provider '${config.provider}'`);
    return (
      <div className="error-message" role="alert">
        Captcha provider '{config.provider}' is not supported by this build.
      </div>
    );
  }
  return <Adapter config={config} baseUrl={baseUrl} onSolved={onSolved} onReload={onReload} />;
}
