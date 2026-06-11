export const productionPillars = [
  {
    id: 'observability',
    title: 'Observability Out of the Box',
    icon: 'bi-bar-chart-line',
    description: 'Spring Boot Actuator + Micrometer ship with first-class JaiClaw metrics. Wire to Prometheus and Grafana in minutes.',
    highlights: [
      { label: 'jaiclaw.agent.invocations', detail: 'Counter — agent calls per tenant, provider, outcome' },
      { label: 'jaiclaw.tool.calls', detail: 'Counter — tool invocations per tool, outcome' },
      { label: 'jaiclaw.tokens.usage', detail: 'Counter — prompt / completion / total tokens per provider' },
      { label: 'jaiclaw.sessions.active', detail: 'Gauge — live sessions per tenant' },
    ],
  },
  {
    id: 'kubernetes',
    title: 'Kubernetes-Native Deployment',
    icon: 'bi-box-seam',
    description: 'Reference Helm charts and Kubernetes manifests cover the production basics so you can deploy with confidence.',
    highlights: [
      { label: 'Helm Charts', detail: 'Reference chart for the framework itself' },
      { label: 'Liveness Probe', detail: '/actuator/health/liveness wired up' },
      { label: 'Readiness Probe', detail: '/actuator/health/readiness wired up' },
      { label: 'Prometheus Scrape', detail: 'Scrape annotations on the service' },
    ],
  },
  {
    id: 'multi-tenancy',
    title: 'Multi-Tenancy at the Core',
    icon: 'bi-building',
    description: 'JWT-based tenant isolation is not a layer you add — it is wired through sessions, memory, skills, tools, and billing.',
    highlights: [
      { label: 'JWT-Derived Context', detail: 'Tenant identity flows from auth tokens' },
      { label: 'Per-Tenant Resources', detail: 'Sessions, memory, skills, and tool grants per tenant' },
      { label: 'Billing-Linked Access', detail: 'Feature grants on payment, revoke on expiry' },
      { label: 'Auditability', detail: 'Tenant tag on every metric, log, and audit event' },
    ],
  },
  {
    id: 'security',
    title: 'Security Hardening',
    icon: 'bi-shield-check',
    description: 'Six opt-in protections, agent-to-agent ECDH key exchange, workspace path boundaries, and timing-safe auth comparisons.',
    highlights: [
      { label: 'HMAC Webhooks', detail: 'Verify channel and integration callbacks' },
      { label: 'SSRF Guards', detail: 'Outbound HTTP filter for tool calls' },
      { label: 'Workspace Boundaries', detail: 'File tools cannot escape declared workspace' },
      { label: 'ECDH P-256', detail: 'Agent-to-agent session bootstrap' },
    ],
  },
  {
    id: 'api-stability',
    title: 'API Stability Program',
    icon: 'bi-bookmark-check',
    description: '@Stable / @Experimental / @Internal annotations mark the API surface. Know what you can depend on on the road to 1.0.',
    highlights: [
      { label: '@Stable', detail: 'Compatibility guarantee' },
      { label: '@Experimental', detail: 'May change with notice' },
      { label: '@Internal', detail: 'Do not depend on these' },
      { label: 'Road to 1.0', detail: 'Published roadmap and stability commitments' },
    ],
  },
  {
    id: 'sizing',
    title: 'Resource Sizing Guidance',
    icon: 'bi-cpu',
    description: 'Reference deployment profiles for small, medium, and large workloads — with concrete starting points instead of guesswork.',
    highlights: [
      { label: 'Small', detail: 'Single-tenant prototype / internal tool' },
      { label: 'Medium', detail: 'Multi-tenant SaaS up to dozens of tenants' },
      { label: 'Large', detail: 'High-throughput enterprise deployments' },
      { label: 'Tuning Knobs', detail: 'Compaction threshold, session TTL, tool concurrency' },
    ],
  },
];
