import '../styles/hero.css';

const whitepapers = [
  {
    title: 'AI-Driven Kubernetes Ingress Security: A JaiClaw Client Engagement',
    description:
      'Case study — an AI-powered Kubernetes security operator built on JaiClaw for real-time threat detection, autonomous enforcement, and conversational management via Telegram.',
    url: '/whitepapers/jaiclaw-security-operator.pdf',
    icon: 'bi-shield-lock',
  },
  {
    title: 'TapTech Sentinel: Architecture, Threat Detection Pipeline, and Design Decisions',
    description:
      'Architecture whitepaper — an AI-powered Kubernetes Ingress security operator with CRD-based state, automated enforcement, and daily reporting.',
    url: '/whitepapers/taptech-sentinel.pdf',
    icon: 'bi-diagram-3',
  },
];

export default function ResourcesView() {
  return (
    <div>
      <div className="container">
        <div className="intro">
          <h2>Resources</h2>
          <p>
            Whitepapers and technical publications from the JaiClaw project and
            TapTech Holdings engineering team.
          </p>
        </div>

        <h3 style={{ color: '#7851a9', marginBottom: '10px' }}>Whitepapers</h3>
        <div className="services-grid" style={{ marginBottom: '50px' }}>
          {whitepapers.map((paper) => (
            <a
              key={paper.title}
              href={paper.url}
              target="_blank"
              rel="noopener noreferrer"
              className="doc-link-card"
              style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'block',
              }}
            >
              <div
                className="service-item"
                style={{ height: '100%', cursor: 'pointer', transition: 'transform 0.2s' }}
              >
                <h3>
                  <i className={`bi ${paper.icon}`} style={{ color: '#cfb53b' }}></i>{' '}
                  {paper.title}
                </h3>
                <p style={{ color: '#555' }}>{paper.description}</p>
                <span style={{ color: '#7851a9', fontWeight: 'bold', fontSize: '0.9rem' }}>
                  <i className="bi bi-file-earmark-pdf"></i> View PDF
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
