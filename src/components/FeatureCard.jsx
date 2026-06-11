export default function FeatureCard({ icon, title, description }) {
  return (
    <div className="service-item">
      <h3>
        <i className={`bi ${icon}`}></i>{' '}
        {title}
      </h3>
      <p>{description}</p>
    </div>
  );
}
