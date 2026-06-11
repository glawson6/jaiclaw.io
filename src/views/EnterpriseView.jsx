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
