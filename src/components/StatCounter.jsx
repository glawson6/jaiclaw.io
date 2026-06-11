export default function StatCounter({ value, label }) {
  return (
    <div className="stat-counter">
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}
