import { Link } from 'react-router-dom';
import CodeBlock from '../components/CodeBlock.jsx';
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
    profile: hipaa    # none | gdpr | hipaa | both  (default: none)

# Per-tenant metadata drives the rest — set on TenantContext.getMetadata():
#   gdpr.lawful_basis      -> stamped on every AuditEvent
#   data.retention_days    -> enforced by RetentionEnforcementService
#   hipaa.phi_processing   -> triggers BAA-eligible-provider check
#   gdpr.consent_token     -> linked to ConsentManager records`;

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
            Enabling GDPR + HIPAA safeguards
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
            href="https://github.com/openclaw/jaiclaw/blob/main/docs/user/COMPLIANCE.md"
            target="_blank"
            rel="noopener noreferrer"
          >
            <code>docs/user/COMPLIANCE.md</code>
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
