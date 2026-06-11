import { Link } from 'react-router-dom';

export default function PricingCard({ title, price, description, features, cta, ctaLink, featured }) {
  const isExternal = ctaLink && ctaLink.startsWith('http');

  return (
    <div className={`pricing-card ${featured ? 'pricing-card-featured' : ''}`}>
      {featured && <div className="pricing-badge">Most Popular</div>}
      <h3>{title}</h3>
      <div className="pricing-price">{price}</div>
      <p className="pricing-description">{description}</p>
      <ul className="pricing-features">
        {features.map((feature, index) => (
          <li key={index}>
            <i className="bi bi-check-circle"></i> {feature}
          </li>
        ))}
      </ul>
      {isExternal ? (
        <a
          href={ctaLink}
          target="_blank"
          rel="noopener noreferrer"
          className="product-link-btn"
        >
          {cta}
        </a>
      ) : (
        <Link to={ctaLink} className="product-link-btn">
          {cta}
        </Link>
      )}
    </div>
  );
}
