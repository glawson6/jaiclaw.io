import { useState } from 'react';
import ExampleCard from '../components/ExampleCard.jsx';
import { examples, categories } from '../config/examples-data.js';
import '../styles/examples.css';

export default function ExamplesView() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredExamples = activeCategory === 'All'
    ? examples
    : examples.filter((ex) => ex.category === activeCategory);

  return (
    <div className="examples-page">
      <div className="intro">
        <h2>Examples</h2>
        <p>
          {examples.length} standalone Spring Boot examples demonstrating JaiClaw framework capabilities.
          Each can be built and run independently.
        </p>
      </div>

      <div className="category-filters">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-filter-btn ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="examples-grid">
        {filteredExamples.map((example) => (
          <ExampleCard
            key={example.name}
            name={example.name}
            title={example.title}
            category={example.category}
            description={example.description}
            modules={example.modules}
          />
        ))}
      </div>
    </div>
  );
}
