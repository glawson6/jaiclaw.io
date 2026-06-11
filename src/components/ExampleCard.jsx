import { GITHUB_EXAMPLES_URL } from '../config/constants.js';

export default function ExampleCard({ name, title, category, description, modules }) {
  return (
    <div className="example-card">
      <div className="example-card-header">
        <span className="example-category-badge">{category}</span>
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="example-modules">
        {modules.map((mod) => (
          <span key={mod} className="example-module-tag">{mod}</span>
        ))}
      </div>
      <a
        href={`${GITHUB_EXAMPLES_URL}/${name}`}
        target="_blank"
        rel="noopener noreferrer"
        className="example-link"
      >
        <i className="bi bi-github"></i> View Source
      </a>
    </div>
  );
}
