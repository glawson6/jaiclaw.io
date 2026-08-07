import { Link } from 'react-router-dom';
import StatCounter from '../components/StatCounter.jsx';
import FeatureCard from '../components/FeatureCard.jsx';
import CodeBlock from '../components/CodeBlock.jsx';
import { GITHUB_URL, GITHUB_DOCS_URL, TAPTECH_URL } from '../config/constants.js';
import '../styles/hero.css';

const MAVEN_SNIPPET = `<repositories>
  <repository>
    <id>taptech-releases</id>
    <url>https://tooling.taptech.net/repository/maven-releases/</url>
    <releases><enabled>true</enabled></releases>
    <snapshots><enabled>false</enabled></snapshots>
  </repository>
  <repository>
    <id>embabel-snapshots</id>
    <url>https://repo.embabel.com/artifactory/libs-snapshot</url>
    <snapshots><enabled>true</enabled></snapshots>
    <releases><enabled>false</enabled></releases>
  </repository>
</repositories>

<dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>io.jaiclaw</groupId>
      <artifactId>jaiclaw-bom</artifactId>
      <version>1.0.0</version>
      <type>pom</type>
      <scope>import</scope>
    </dependency>
  </dependencies>
</dependencyManagement>

<dependencies>
  <dependency>
    <groupId>io.jaiclaw</groupId>
    <artifactId>jaiclaw-spring-boot-starter</artifactId>
  </dependency>
</dependencies>`;

const homeFeatures = [
  { icon: 'bi-chat-dots', title: '11 Channels', description: 'Telegram, Slack, Discord, Email, SMS, Signal, Teams, WhatsApp, Google Chat, LINE, Matrix. All support local dev mode.' },
  { icon: 'bi-cpu', title: '11 LLM Providers', description: 'Anthropic, OpenAI, Gemini, Ollama, Bedrock, and more. Swap with one env var.' },
  { icon: 'bi-tools', title: '38+ Tools', description: 'File editing, browser automation, Kubernetes monitoring, document analysis, and more.' },
  { icon: 'bi-bezier2', title: 'Pipelines + Studio', description: 'YAML, Java DSL, or a visual drag-and-drop React canvas — same runtime. Seven runnable pipeline examples ship with 1.0.' },
  { icon: 'bi-building', title: 'Multi-Tenancy', description: 'JWT-based tenant isolation with per-tenant sessions, memory, skills, and billing.' },
  { icon: 'bi-diagram-3', title: 'Agentic + Multi-Agent', description: 'Agents that plan, invoke tools, remember context, and hand off to specialists. GOAP planning via Embabel gives deterministic action sequences with auto parallelism.' },
  { icon: 'bi-plug', title: 'MCP: Host & Consume', description: 'Publish any JaiClaw tool as a Model Context Protocol server for Claude Desktop, Cursor, or any MCP client. 22 in-repo providers across 6 canonical patterns.' },
];

export default function HomeView() {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>The Java Framework for Building AI Assistants That Actually Ship</h1>
          <div className="version-badge-row">
            <span className="version-badge">1.0 · Stable release</span>
          </div>
          <p className="hero-subtitle">Java 21 · Spring Boot 4.1.0 · Spring AI 2.0.0 · Embabel 2.0.0 · Camel 4.21</p>
          <p className="hero-description">
            Production-ready <strong>agentic AI</strong> framework with 168 Maven modules and 31 Spring Boot starters. Connect any LLM to 11 messaging channels — Telegram, Slack, Discord, Email, SMS, Signal, Teams, WhatsApp, Google Chat, LINE, and Matrix — with tools, skills, memory, multi-agent planning, and MCP server hosting built in.
          </p>
          <div className="hero-buttons">
            <Link to="/docs" className="product-link-btn">
              Get Started
            </Link>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="product-link-btn secondary"
            >
              <i className="bi bi-github"></i> View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="stats-bar">
        <div className="stats-bar-inner">
          <StatCounter value="168" label="Maven Modules" />
          <StatCounter value="31" label="Starters" />
          <StatCounter value="11" label="Channels" />
          <StatCounter value="11" label="LLM Providers" />
          <StatCounter value="42" label="Examples" />
        </div>
      </section>

      {/* What is Agentic AI? */}
      <section className="home-features-section">
        <h2>What is agentic AI?</h2>
        <div style={{ maxWidth: 860, margin: '0 auto 30px', color: '#333' }}>
          <p>
            <strong>Agentic AI is software that does tasks for you</strong> — not just answers questions.
            The difference between asking for directions and hiring an assistant who books the trip, packs
            the bag, and drives you to the airport.
          </p>
          <p>
            An AI becomes <em>agentic</em> when it can break a big task into steps, use tools
            (search the web, read documents, call APIs, send messages), make decisions when the first
            approach fails, and remember context across a long-running job. JaiClaw gives you the Java
            runtime for all four: an agent loop, a tool registry, memory, and multi-agent orchestration —
            deployable as a library, a stateless gateway, or a single-binary assistant.
          </p>
        </div>
        <div className="services-grid">
          <a
            href={`${GITHUB_DOCS_URL}/user/WHAT-IS-AGENTIC-AI.md`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <FeatureCard
              icon="bi-book"
              title="Plain-English primer"
              description="What is agentic AI? Four capabilities, a real-world analogy, and where the human stays in the loop. No CS degree required."
            />
          </a>
          <a
            href={`${GITHUB_DOCS_URL}/user/BUILDING-AGENTS.md`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <FeatureCard
              icon="bi-diagram-2"
              title="For engineers: 8-module blueprint"
              description="Purpose, prompt, LLM, tools, memory, orchestration, UI, evals. Every module mapped to concrete JaiClaw classes and starters."
            />
          </a>
          <a
            href={`${GITHUB_DOCS_URL}/user/features/mcp.md`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <FeatureCard
              icon="bi-plug"
              title="MCP: host & consume"
              description="Publish any JaiClaw capability as a Model Context Protocol server. Two SPIs, six canonical patterns, HTTP / SSE / stdio transports."
            />
          </a>
        </div>
      </section>

      {/* Quick Start */}
      <section className="quick-start-section">
        <h2>Quick Start</h2>
        <p style={{ textAlign: 'center', color: '#555' }}>
          Add JaiClaw to your Spring Boot project:
        </p>
        <CodeBlock code={MAVEN_SNIPPET} language="xml" />
        <p style={{ textAlign: 'center', color: '#666', fontSize: '0.9rem', maxWidth: 720, margin: '10px auto 0' }}>
          <i className="bi bi-info-circle" style={{ marginRight: 6, color: '#7851a9' }}></i>
          1.0.0 ships to the TapTech Nexus (anonymous read — no credentials needed).
          Maven Central publication is deferred until the Embabel 2.0.0 GA lands there.
        </p>
        <p style={{ textAlign: 'center', color: '#555', marginTop: 30 }}>
          Or install with a single command:
        </p>
        <CodeBlock
          code={`curl -fsSL https://jaiclaw.io/install.sh | bash`}
          language="bash"
        />
      </section>

      {/* Key Features Grid */}
      <section className="home-features-section">
        <h2>Key Features</h2>
        <div className="services-grid">
          {homeFeatures.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </section>

      {/* Three Ways to Use JaiClaw */}
      <section className="home-features-section">
        <h2>Three Ways to Use JaiClaw</h2>
        <p style={{ textAlign: 'center', color: '#555', maxWidth: 760, margin: '0 auto 30px' }}>
          One framework. Every scale. Zero platform changes.
        </p>
        <div className="services-grid">
          <Link to="/features" style={{ textDecoration: 'none', color: 'inherit' }}>
            <FeatureCard
              icon="bi-box-seam"
              title="As an enterprise library"
              description="Pull JaiClaw via the BOM, compose the Spring Boot starters you need, implement the SPIs for your business domain. Stable @Stable / @Experimental / @Internal markers across 20+ committed SPIs."
            />
          </Link>
          <Link to="/features" style={{ textDecoration: 'none', color: 'inherit' }}>
            <FeatureCard
              icon="bi-building"
              title="As a multi-tenant gateway"
              description="Flip jaiclaw.tenant.mode=multi and the framework isolates sessions, memory, skills, secrets, and audit per tenant from a single codebase. Stateless gateway, horizontally scalable, Kubernetes-ready."
            />
          </Link>
          <Link to="/docs" style={{ textDecoration: 'none', color: 'inherit' }}>
            <FeatureCard
              icon="bi-terminal"
              title="As a single-binary assistant"
              description="One curl line and a multi-channel agent runs on your laptop. Telegram, Slack, Discord, and 8 more with local dev modes that need no public endpoint."
            />
          </Link>
        </div>
      </section>

      {/* Compliance Callout */}
      <section className="home-features-section">
        <div style={{
          maxWidth: 900,
          margin: '0 auto',
          padding: '28px 32px',
          background: '#f9f9f9',
          border: '1px solid #e5e5e5',
          borderLeft: '4px solid #7851a9',
          borderRadius: 6,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <i className="bi bi-file-earmark-lock" style={{ fontSize: '1.6rem', color: '#7851a9' }}></i>
            <h3 style={{ margin: 0 }}>GDPR + HIPAA compliance module — stable in 1.0</h3>
          </div>
          <p style={{ color: '#333', marginBottom: 12 }}>
            One property (<code>jaiclaw.compliance.profile</code>) turns on a coherent
            bundle of safeguards: LLM-call audit trail with Art. 30 fields, BAA-eligible
            provider enforcement, retention purge, HTTPS startup guard, PHI redaction,
            AES-GCM at-rest encryption, tamper-evident audit chain, and Art. 15 / 17 / 20
            data subject rights. Compliance-<em>capable</em>, not certified — the
            framework provides the raw material for a defensible deployment.
          </p>
          <Link to="/enterprise" className="product-link-btn" style={{ marginTop: 8 }}>
            See the compliance capabilities
          </Link>
        </div>
      </section>

      {/* About */}
      <section className="about-section">
        <h2>Built by TapTech Holdings</h2>
        <p>
          JaiClaw is developed and maintained by{' '}
          <a href={TAPTECH_URL} target="_blank" rel="noopener noreferrer">
            TapTech Holdings, Inc.
          </a>
          , a software engineering firm specializing in AI-powered enterprise solutions.
        </p>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to Build?</h2>
        <p>Get started with JaiClaw in minutes. Check out the documentation or explore the examples.</p>
        <div className="cta-buttons">
          <Link to="/docs" className="product-link-btn">
            Read the Docs
          </Link>
          <Link to="/examples" className="product-link-btn secondary-dark">
            Browse Examples
          </Link>
        </div>
      </section>
    </div>
  );
}
