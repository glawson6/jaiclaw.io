import { features } from '../config/features-data.js';
import '../styles/features.css';

export default function FeaturesView() {
  return (
    <div className="features-page">
      <div className="intro">
        <h2>Features</h2>
        <p>
          JaiClaw is deeper than the feature list suggests. Built on Java 21, Spring Boot 3.5, and Spring AI,
          it provides everything you need to ship production AI assistants.
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
    </div>
  );
}
