import { Link } from 'react-router-dom';
import { differentiators, comparisons, whenNotToChoose } from '../config/comparison-data.js';
import '../styles/features.css';

export default function WhyJaiClawView() {
  return (
    <div className="features-page">
      <div className="intro">
        <h2>Why JaiClaw</h2>
        <p>
          There are good Java AI libraries. There are good Python frameworks. JaiClaw exists because
          shipping a production AI assistant on the JVM still takes 6–12 months of plumbing.
          Here is what JaiClaw gives you that the alternatives do not — and where the alternatives
          are still the better choice.
        </p>
      </div>

      <section className="feature-section">
        <div className="feature-section-header">
          <h2>
            <i className="bi bi-stars"></i>
            Five differentiators
          </h2>
          <p>The capabilities that make JaiClaw worth picking over the alternatives.</p>
        </div>
        <div className="feature-highlights">
          {differentiators.map((item) => (
            <div key={item.id} className="feature-highlight-item">
              <strong>
                <i className={`bi ${item.icon}`} style={{ marginRight: 8, color: '#cfb53b' }}></i>
                {item.title}
              </strong>
              <span>{item.description}</span>
            </div>
          ))}
        </div>
      </section>

      {comparisons.map((comparison) => (
        <section key={comparison.id} className="feature-section">
          <div className="feature-section-header">
            <h2>
              <i className="bi bi-arrow-left-right"></i>
              {comparison.title}
            </h2>
            <p>{comparison.summary}</p>
          </div>
          <div className="feature-highlights">
            {comparison.bullets.map((bullet, idx) => (
              <div key={idx} className="feature-highlight-item">
                <span>{bullet}</span>
              </div>
            ))}
          </div>
        </section>
      ))}

      <section className="feature-section">
        <div className="feature-section-header">
          <h2>
            <i className="bi bi-signpost-2"></i>
            {whenNotToChoose.title}
          </h2>
          <p>{whenNotToChoose.description}</p>
        </div>
        <div className="feature-highlights">
          {whenNotToChoose.cases.map((c) => (
            <div key={c.label} className="feature-highlight-item">
              <strong>{c.label}</strong>
              <span>{c.detail}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <h2>Convinced?</h2>
        <p>Start with the quick-start or browse the examples to see JaiClaw in action.</p>
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
