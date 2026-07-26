import { features, skillsSpotlight } from '../config/features-data.js';
import CodeBlock from '../components/CodeBlock.jsx';
import '../styles/features.css';

// Hand-drawn box the LLM would emit without the ascii-rendering skill — borders
// drift, spacing is uneven, and the right edge often doesn't line up. Kept
// intentionally rough to make the contrast visible.
const ASCII_BEFORE = `+----------------------------------------+
| STATUS                                |
|  Build green - all tests passing.    |
+---------------------------------------+`;

// What the ascii_box tool returns. Matches the SKILL.md reference output.
const ASCII_AFTER = `╔════════════════════════════════════════════════════════════╗
║[ STATUS ]                                                  ║
║Build green — all tests passing.                            ║
╚════════════════════════════════════════════════════════════╝`;

const ASCII_TOOL_CALL = `{
  "tool": "ascii_box",
  "args": {
    "content": "Build green — all tests passing.",
    "title": "STATUS",
    "border": "double"
  }
}`;

export default function FeaturesView() {
  const asciiSkill = skillsSpotlight.find((s) => s.id === 'ascii-rendering');
  const otherSkills = skillsSpotlight.filter((s) => s.id !== 'ascii-rendering');

  return (
    <div className="features-page">
      <div className="intro">
        <h2>Features</h2>
        <p>
          JaiClaw is deeper than the feature list suggests. Built on Java 21, Spring Boot 4.1.0, Spring AI 2.0.0,
          Embabel 2.0.0, and Apache Camel 4.21, it provides everything you need to ship production AI assistants.
        </p>
      </div>

      {features.map((feature) => (
        <section key={feature.id} className="feature-section">
          <div className="feature-section-header">
            <h2>
              <i className={`bi ${feature.icon}`}></i>
              {feature.title}
            </h2>
            <p>{feature.description}</p>
          </div>
          {feature.image && (
            <div className="feature-screenshot">
              <img
                src={feature.image}
                alt={feature.imageAlt || feature.title}
                loading="lazy"
                onError={(e) => { e.currentTarget.parentElement.style.display = 'none'; }}
              />
            </div>
          )}
          <div className="feature-highlights">
            {feature.highlights.map((highlight) => (
              <div key={highlight.label} className="feature-highlight-item">
                <strong>{highlight.label}</strong>
                <span>{highlight.detail}</span>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* Bundled Skills Spotlight */}
      <section className="feature-section">
        <div className="feature-section-header">
          <h2>
            <i className="bi bi-stars"></i>
            Bundled Skills — Spotlight
          </h2>
          <p>
            Skills are markdown files with YAML frontmatter that the agent loads on demand —
            packaged know-how, not extra code to maintain. The bundled library covers system admin,
            content generation, debugging methodology, ops, and more. Here are a few worth knowing about.
          </p>
        </div>

        {/* ascii-rendering — featured with before/after */}
        <div style={{ marginBottom: 40 }}>
          <h3 style={{ marginBottom: 8 }}>
            <i className={`bi ${asciiSkill.icon}`} style={{ marginRight: 8, color: '#cfb53b' }}></i>
            {asciiSkill.title}
          </h3>
          <p style={{ color: '#555', marginBottom: 20 }}>{asciiSkill.summary}</p>

          <p style={{ color: '#555', marginBottom: 8, fontWeight: 600 }}>
            Without the skill — the LLM hand-draws borders character-by-character. Slow, token-heavy, and the right edge rarely lines up:
          </p>
          <CodeBlock code={ASCII_BEFORE} language="text" />

          <p style={{ color: '#555', margin: '20px 0 8px', fontWeight: 600 }}>
            With the skill — the agent emits a single structured tool call:
          </p>
          <CodeBlock code={ASCII_TOOL_CALL} language="json" />

          <p style={{ color: '#555', margin: '20px 0 8px', fontWeight: 600 }}>
            …and gets back a clean Unicode box, every time:
          </p>
          <CodeBlock code={ASCII_AFTER} language="text" />
        </div>

        {/* Other spotlighted skills */}
        <div className="feature-highlights">
          {otherSkills.map((skill) => (
            <div key={skill.id} className="feature-highlight-item">
              <strong>
                <i className={`bi ${skill.icon}`} style={{ marginRight: 8, color: '#cfb53b' }}></i>
                {skill.title}
              </strong>
              <span>{skill.summary}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
