import CodeBlock from '../components/CodeBlock.jsx';
import { GITHUB_DOCS_URL, GITHUB_EXAMPLES_URL } from '../config/constants.js';
import '../styles/hero.css';

function DocGrid({ docs }) {
  return (
    <div className="services-grid" style={{ marginBottom: '50px' }}>
      {docs.map((doc) => (
        <a
          key={doc.title}
          href={doc.url}
          target="_blank"
          rel="noopener noreferrer"
          className="doc-link-card"
          style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
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
  );
}

const conceptDocs = [
  {
    title: 'What is Agentic AI?',
    description: 'Plain-English primer on what makes an AI agentic — no CS degree required.',
    url: `${GITHUB_DOCS_URL}/user/WHAT-IS-AGENTIC-AI.md`,
    icon: 'bi-book',
  },
  {
    title: 'Building Agents — 8-Module Blueprint',
    description: 'Architectural companion for engineers. Purpose, prompt, LLM, tools, memory, orchestration, UI, evals — every module mapped to concrete JaiClaw code.',
    url: `${GITHUB_DOCS_URL}/user/BUILDING-AGENTS.md`,
    icon: 'bi-diagram-2',
  },
  {
    title: 'From Personal to Enterprise',
    description: 'The five-level scaling spectrum: laptop assistant → embedded library → multi-tenant SaaS. Same codebase, no rewrites.',
    url: `${GITHUB_DOCS_URL}/user/JAICLAW-FROM-PERSONAL-TO-ENTERPRISE.md`,
    icon: 'bi-graph-up',
  },
];

const referenceDocs = [
  {
    title: 'Getting Started',
    description: 'Clone the repo, run the quickstart script, and have a working AI assistant in minutes.',
    url: `${GITHUB_DOCS_URL}/user/GETTING-STARTED.md`,
    icon: 'bi-rocket-takeoff',
  },
  {
    title: 'MCP Server Reference',
    description: 'Expose any JaiClaw capability as an MCP endpoint. Two SPIs, six design patterns, HTTP / SSE / stdio transports.',
    url: `${GITHUB_DOCS_URL}/user/features/mcp.md`,
    icon: 'bi-plug',
  },
  {
    title: 'MCP Design Patterns',
    description: 'Six canonical MCP integration patterns — direct wrapper, composite service, MCP-to-agent, event-driven, hierarchical, local resource — each with a production exemplar.',
    url: `${GITHUB_DOCS_URL}/user/features/mcp-design-patterns.md`,
    icon: 'bi-diagram-3',
  },
  {
    title: 'Operations Guide',
    description: 'Deploy to Kubernetes, configure monitoring, manage secrets, and scale your assistant.',
    url: `${GITHUB_DOCS_URL}/user/OPERATIONS.md`,
    icon: 'bi-gear',
  },
  {
    title: 'Production Deployment',
    description: 'Kubernetes, Helm, secrets, observability, resource sizing — the operator playbook for 1.0.',
    url: `${GITHUB_DOCS_URL}/user/PRODUCTION-DEPLOYMENT.md`,
    icon: 'bi-hdd-network',
  },
  {
    title: 'Compliance (GDPR + HIPAA)',
    description: 'One property enables the compliance substrate: audit trail, retention, PHI redaction, BAA-eligible providers, Art. 15 / 17 / 20 rights.',
    url: `${GITHUB_DOCS_URL}/user/COMPLIANCE.md`,
    icon: 'bi-file-earmark-lock',
  },
  {
    title: 'Authoring Channels',
    description: 'How to write a new channel adapter for Telegram, Slack, Discord, Email, SMS, or a platform we don\'t ship yet.',
    url: `${GITHUB_DOCS_URL}/user/AUTHORING-CHANNELS.md`,
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
            Start with the concepts, then jump to the reference guides.
          </p>
        </div>

        <h3 style={{ marginTop: '10px', marginBottom: '20px' }}>Concepts</h3>
        <DocGrid docs={conceptDocs} />

        <h3 style={{ marginTop: '10px', marginBottom: '20px' }}>Reference</h3>
        <DocGrid docs={referenceDocs} />

        <div className="quick-start-section" style={{ margin: '0 auto 40px' }}>
          <h2>Quick Start</h2>
          <CodeBlock code={QUICKSTART_CODE} language="bash" />
        </div>
      </div>
    </div>
  );
}
