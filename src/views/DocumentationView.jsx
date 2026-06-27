import CodeBlock from '../components/CodeBlock.jsx';
import { GITHUB_URL, GITHUB_DOCS_URL, GITHUB_EXAMPLES_URL } from '../config/constants.js';
import '../styles/hero.css';

const docLinks = [
  {
    title: 'Getting Started',
    description: 'Clone the repo, run the quickstart script, and have a working AI assistant in minutes.',
    url: GITHUB_URL,
    icon: 'bi-rocket-takeoff',
  },
  {
    title: 'Architecture Guide',
    description: 'Understand the module structure, plugin system, message pipeline, and extension points.',
    url: `${GITHUB_DOCS_URL}/ARCHITECTURE.md`,
    icon: 'bi-diagram-3',
  },
  {
    title: 'Operations Guide',
    description: 'Deploy to Kubernetes, configure monitoring, manage secrets, and scale your assistant.',
    url: `${GITHUB_DOCS_URL}/OPERATIONS.md`,
    icon: 'bi-gear',
  },
  {
    title: 'Channel Setup Guides',
    description: 'Step-by-step guides for Telegram, Slack, Discord, Email, SMS, Signal, and Teams.',
    url: `${GITHUB_DOCS_URL}/CHANNELS.md`,
    icon: 'bi-chat-dots',
  },
  {
    title: 'Examples',
    description: '42 standalone Spring Boot examples covering scheduling, GOAP, documents, voice, and more.',
    url: GITHUB_EXAMPLES_URL,
    icon: 'bi-code-square',
  },
];

const QUICKSTART_CODE = `# Install with a single command
curl -fsSL https://jaiclaw.io/install.sh | bash

# Or clone and run with Docker
git clone https://github.com/glawson6/jaiclaw.git
cd jaiclaw
./quickstart.sh

# Or with a cloud provider
ANTHROPIC_API_KEY=sk-ant-... ./quickstart.sh

# Run the interactive shell
./start.sh shell

# Run the gateway
./start.sh`;

export default function DocumentationView() {
  return (
    <div>
      <div className="container">
        <div className="intro">
          <h2>Documentation</h2>
          <p>
            JaiClaw documentation lives alongside the source code on GitHub.
            Below are the main guides to get you started.
          </p>
        </div>

        <div className="services-grid" style={{ marginBottom: '50px' }}>
          {docLinks.map((doc) => (
            <a
              key={doc.title}
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="doc-link-card"
              style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'block',
              }}
            >
              <div className="service-item" style={{ height: '100%', cursor: 'pointer', transition: 'transform 0.2s' }}>
                <h3>
                  <i className={`bi ${doc.icon}`} style={{ color: '#cfb53b' }}></i>{' '}
                  {doc.title}
                </h3>
                <p style={{ color: '#555' }}>{doc.description}</p>
              </div>
            </a>
          ))}
        </div>

        <div className="quick-start-section" style={{ margin: '0 auto 40px' }}>
          <h2>Quick Start</h2>
          <CodeBlock code={QUICKSTART_CODE} language="bash" />
        </div>
      </div>
    </div>
  );
}
