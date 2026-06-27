# Contact Form Security

How the Contact form on jaiclaw.io is protected, and how to run it locally.

## Where does the form post?

`POST <JAICLAW_CONTACT_API_URL>` with the JSON body:

```json
{
  "name": "...",
  "email": "...",
  "subject": "...",
  "message": "...",
  "honeypot": "",
  "captcha": { "id": "...", "answer": "..." }
}
```

Plus the header `X-Submission-Token: <token>` when the submission-token feature is on.

The backend is `taptech-crm-app` and the canonical contract lives in `taptech-crm-api-contract/src/main/resources/openapi/tapcrm.yaml`.

## How is it protected?

Five overlapping defences, each independently configurable on the server:

| Defence | Client role | Server flag |
|---|---|---|
| Honeypot | Hidden form field; must be empty on submit | `taptech.crm.protect.honeypot.enabled` |
| Captcha | Solve and attach `{id, answer}` | `taptech.crm.protect.captcha.enabled` |
| Submission token | Fetch from `/forms/leads/token`, send as `X-Submission-Token` | `taptech.crm.protect.submission-token.enabled` |
| Origin / Referer | Browser sends automatically | server checks |
| Rate limit | Surface 429 with countdown | per-IP, server-side |

Full architecture in the companion docs `SECURITY-ARCHITECTURE.md` and `SECURITY-API-PLAN.md` (taptech-company repo).

## How do I run it locally against a non-secured server?

Three knobs: the contact API URL, the captcha URL, and the token URL — point all three at your local backend and the form will exercise the full envelope.

```bash
cat > .env.local <<'EOF'
JAICLAW_CONTACT_API_URL=http://localhost:8080/leads
JAICLAW_CAPTCHA_URL=http://localhost:8080
JAICLAW_TOKEN_API_URL=http://localhost:8080
JAICLAW_FEATURE_SUBMISSION_TOKEN=true
EOF

npm run dev
```

To disable a defence locally without restarting the backend, unset the corresponding URL or flag:

```bash
# Skip the token mint entirely (server must allow it):
JAICLAW_FEATURE_SUBMISSION_TOKEN=false npm run dev

# Skip captcha (server must allow it):
# Just leave JAICLAW_CAPTCHA_URL unset.

# Skip the network entirely — form prints to console:
# Leave JAICLAW_CONTACT_API_URL unset.
```

## How do I verify the security wiring in production?

Open DevTools → Network, then load the Contact page:

1. `GET /forms/leads/token` returns 200 `{token, expiresInSeconds}` once on mount.
2. `GET /captcha` returns 200 with a provider-agnostic `IssueResult`.
3. `POST /leads` carries `X-Submission-Token` header and the full body.

After a successful submit, both `/captcha` and `/forms/leads/token` are re-minted — the new token is ready for the next submit.

## Error handling

The form distinguishes five error classes by RFC 7807 `problem.type`:

| Class | Trigger | UI behaviour |
|---|---|---|
| `SubmissionTokenError` | `https://taptech.net/problems/submission-token-invalid` | Auto-retries once with a fresh token; on second failure shows "Your session expired." |
| `RateLimitError` | 429 or `https://taptech.net/problems/rate-limited` | Reads `Retry-After`; disables submit and counts down to zero |
| `CaptchaError` | `https://taptech.net/problems/captcha-failed` | Re-mints captcha, clears the answer, prompts the user |
| `ValidationError` | 400 | Shows `problem.detail` from the server |
| `SubmitError` (catch-all) | Anything else | Generic "Please try again" |

## Test coverage

v1 ships **code-only** — no Vitest, no React Testing Library. The `useSubmissionToken` hook and `submitContact` pure function are designed to be testable (the latter has zero React dependencies), but the test harness has not been added yet. Add Vitest + RTL in a follow-up to land the unit-test suite documented in `docs/SECURITY-UI-PLAN.md` §UI-PROT-02/03.

E2E coverage is manual against a real `taptech-crm-app` deployment. Playwright is not in the toolchain; do not add it for this work alone.
