import { Link } from 'react-router-dom';
import StatCounter from '../components/StatCounter.jsx';
import FeatureCard from '../components/FeatureCard.jsx';
import CodeBlock from '../components/CodeBlock.jsx';
import { GITHUB_URL, TAPTECH_URL } from '../config/constants.js';
import '../styles/hero.css';

const MAVEN_SNIPPET = `<dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>io.jaiclaw</groupId>
      <artifactId>jaiclaw-bom</artifactId>
      <version>0.9.2</version>
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
  { icon: 'bi-lightbulb', title: '70+ Skills', description: 'Pre-built capabilities from system admin to content generation, loaded from markdown.' },
  { icon: 'bi-building', title: 'Multi-Tenancy', description: 'JWT-based tenant isolation with per-tenant sessions, memory, skills, and billing.' },
  { icon: 'bi-diagram-3', title: 'Multi-Agent', description: 'GOAP planning via Embabel — deterministic action sequences with auto parallelism.' },
];

export default function HomeView() {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>The Java Framework for Building AI Assistants That Actually Ship</h1>
          <p className="hero-subtitle">Java 21 · Spring Boot 3.5.15 · Spring AI 1.1.7 · Embabel 0.3.5</p>
          <p className="hero-description">
            Production-ready framework with 160 Maven modules and 31 Spring Boot starters. Connect any LLM to 11 messaging channels — Telegram, Slack, Discord, Email, SMS, Signal, Teams, WhatsApp, Google Chat, LINE, and Matrix — with tools, skills, memory, and multi-agent planning built in.
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
          <StatCounter value="160" label="Maven Modules" />
          <StatCounter value="31" label="Starters" />
          <StatCounter value="11" label="Channels" />
          <StatCounter value="11" label="LLM Providers" />
          <StatCounter value="42" label="Examples" />
        </div>
      </section>

      {/* Quick Start */}
      <section className="quick-start-section">
        <h2>Quick Start</h2>
        <p style={{ textAlign: 'center', color: '#555' }}>
          Add JaiClaw to your Spring Boot project:
        </p>
        <CodeBlock code={MAVEN_SNIPPET} language="xml" />
        <p style={{ textAlign: 'center', color: '#555' }}>
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
