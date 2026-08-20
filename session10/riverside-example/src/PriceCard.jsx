// REFERENCE ONLY — do not copy for your own submission.
// Reusable Riverside FC price card matching the Block I tickets page.

export default function PriceCard({ title, price, description }) {
  return (
    <li className="price-card">
      <h3>{title}</h3>
      <span className="price">€{price}</span>
      <p>{description}</p>
    </li>
  );
}
