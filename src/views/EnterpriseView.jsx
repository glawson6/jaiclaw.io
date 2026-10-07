import { Link } from 'react-router-dom';
import CodeBlock from '../components/CodeBlock.jsx';
import { GITHUB_DOCS_URL } from '../config/constants.js';
import { productionPillars } from '../config/enterprise-data.js';
import '../styles/features.css';

const PROMETHEUS_SCRAPE = `# prometheus.yml — scrape JaiClaw metrics
scrape_configs:
  - job_name: jaiclaw
    metrics_path: /actuator/prometheus
    kubernetes_sd_configs:
      - role: pod
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: 'true'`;

const HELM_SNIPPET = `# values.yaml — JaiClaw reference deployment
replicaCount: 3

resources:
  requests:
    cpu: 500m
    memory: 1Gi
  limits:
    cpu: 2000m
    memory: 4Gi

probes:
  liveness:
    path: /actuator/health/liveness
  readiness:
    path: /actuator/health/readiness

metrics:
  prometheus:
    enabled: true`;

const COMPLIANCE_SNIPPET = `# application.yml — turn on the HIPAA safeguard bundle
jaiclaw:
  compliance:
    profile: hipaa    # none | gdpr | hipaa | both | soc2 | fedramp-moderate | cmmc-l2 | fips
                      # (default: none)

# Per-tenant metadata drives the rest — set on TenantContext.getMetadata():
#   gdpr.lawful_basis      -> stamped on every AuditEvent
#   data.retention_days    -> TTL for RetentionEnforcementService (you schedule it)
#   hipaa.phi_processing   -> triggers BAA-eligible-provider check
#   gdpr.consent_token     -> linked to ConsentManager records`;

const APPROVAL_SNIPPET = `jaiclaw:
  approval:
    chat:
      enabled: true
      approvers:
        - channel-id: telegram
          account-id: \${TELEGRAM_ACCOUNT_ID}
          peer-id: "9001"
          user-id: "9001"           # recommended; required for group chats
  agent:
    agents:
      default:
        tool-loop:
          mode: explicit            # required — approval only runs here
          approval-floors:
            rebootDevice: PROMPT_ALWAYS
          approval:
            auto-approve: false     # master switch; DENY floors still win
            default-timeout: 5m
            on-timeout: deny        # deny (default) | approve
            tools:
              rebootDevice: { timeout: 2m }`;

export default function EnterpriseView() {
  return (
    <div className="features-page">
      <div className="intro">
        <h2>Enterprise & Production</h2>
        <p>
          JaiClaw is designed for production. Observability, multi-tenancy, security hardening,
          Kubernetes deployment, and a published API stability program are all in the box — not
          a roadmap.
        </p>
      </div>

      {productionPillars.map((pillar) => (
        <section key={pillar.id} className="feature-section">
          <div className="feature-section-header">
            <h2>
              <i className={`bi ${pillar.icon}`}></i>
              {pillar.title}
            </h2>
            <p>{pillar.description}</p>
          </div>
          <div className="feature-highlights">
            {pillar.highlights.map((highlight) => (
              <div key={highlight.label} className="feature-highlight-item">
                <strong>{highlight.label}</strong>
                <span>{highlight.detail}</span>
              </div>
            ))}
          </div>
        </section>
      ))}

      <section className="feature-section">
        <div className="feature-section-header">
          <h2>
            <i className="bi bi-file-earmark-code"></i>
            Helm values reference
          </h2>
          <p>A starting point for a production Helm deployment.</p>
        </div>
        <CodeBlock code={HELM_SNIPPET} language="yaml" />
      </section>

      <section className="feature-section">
        <div className="feature-section-header">
          <h2>
            <i className="bi bi-graph-up"></i>
            Prometheus scrape configuration
          </h2>
          <p>Drop this into your Prometheus config to ingest JaiClaw metrics.</p>
        </div>
        <CodeBlock code={PROMETHEUS_SCRAPE} language="yaml" />
      </section>

      <section className="feature-section">
        <div className="feature-section-header">
          <h2>
            <i className="bi bi-file-earmark-lock"></i>
            Enabling compliance safeguards
          </h2>
          <p>
            One property flips the coherent bundle on. Individual flags override any single
            element in either direction — an operator running HIPAA on a bench deployment
            can still disable the HTTPS guard explicitly. Effective flags surface at{' '}
            <code>jaiclaw.compliance.effective.*</code> so the runtime state is inspectable.
          </p>
        </div>
        <CodeBlock code={COMPLIANCE_SNIPPET} language="yaml" />
        <div style={{
          background: '#f9f9f9',
          border: '1px solid #e5e5e5',
          borderLeft: '4px solid #7851a9',
          padding: '16px 20px',
          marginTop: 20,
          borderRadius: 4,
          fontSize: '0.95rem',
          color: '#333',
        }}>
          <strong>Position:</strong> JaiClaw is <em>compliance-capable</em>, not
          compliance-certified. GDPR and HIPAA are properties of a deployment — not of a
          framework. What ships is the multi-tenant isolation, audit SPI, retention
          enforcement, BAA-eligible-provider metadata, encryption + redaction SPIs, and
          LLM-call audit trail an adopter needs to build a defensible deployment.
          BAA legal negotiation, TLS termination, SIEM integration, IAM lifecycle, and
          DPA / RoPA maintenance stay with the operator.
        </div>
        <p style={{ marginTop: 20, color: '#555' }}>
          Full mapping of capability → GDPR article / HIPAA safeguard, Tier 2 SPI reference,
          and Tier 3 governance SPIs in{' '}
          <a
            href={`${GITHUB_DOCS_URL}/user/COMPLIANCE.md`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <code>docs/user/COMPLIANCE.md</code>
          </a>
          . The <code>soc2</code> profile and its Trust Services Criteria mapping are in{' '}
          <a
            href={`${GITHUB_DOCS_URL}/compliance/soc2.md`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <code>docs/compliance/soc2.md</code>
          </a>
          .
        </p>
      </section>

      <section className="feature-section">
        <div className="feature-section-header">
          <h2>
            <i className="bi bi-hand-thumbs-up"></i>
            Human-in-the-loop approval over chat
          </h2>
          <p>
            New in 1.3.0. A tool floored to <code>PROMPT_ALWAYS</code> asks a configured
            approver — never whoever triggered the run — and waits for a text reply. Every
            request carries a short code the approver must quote back (<code>yes K7Q4</code>),
            so an answer cannot be applied to a different call than the one it was read
            against. <code>user-id</code> restricts who in a group conversation may answer.
            Approval only runs in the <code>explicit</code> tool loop, and an approval that
            cannot be obtained is a denial.
          </p>
        </div>
        <CodeBlock code={APPROVAL_SNIPPET} language="yaml" />
        <p style={{ marginTop: 20, color: '#555' }}>
          Timeouts, <code>auto-approve</code>, reply vocabulary and known limitations in{' '}
          <a
            href={`${GITHUB_DOCS_URL}/user/BUDGETS-AND-GUARDS.md`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <code>docs/user/BUDGETS-AND-GUARDS.md</code>
          </a>
          .
        </p>
      </section>

      <section className="cta-section">
        <h2>Need a hand?</h2>
        <p>
          Get in touch to discuss enterprise deployments, support contracts, or custom integrations.
        </p>
        <div className="cta-buttons">
          <Link to="/contact" className="product-link-btn">
            Contact Us
          </Link>
          <Link to="/docs" className="product-link-btn secondary-dark">
            Production Docs
          </Link>
        </div>
      </section>
    </div>
  );
}
