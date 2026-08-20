// REFERENCE ONLY — do not copy for your own submission.
// Shared single-page header matching the Block I Riverside FC navigation.

const userIcon = (
  <svg className="nav-user-icon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
    <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z" />
  </svg>
);

export default function SiteHeader() {
  return (
    <header id="top" className="site-header">
      <div className="brand">
        <h1>Riverside FC</h1>
        <p>Founded 1974 · Home of Riverside Football Club</p>
      </div>
      <nav>
        <ul>
          <li><a href="#top">Home</a></li>
          <li><a href="#fixtures">Fixtures</a></li>
          <li><a href="#squad">Squad</a></li>
          <li><a href="#">Tickets</a></li>
          <li><a href="#">{userIcon} Login</a></li>
        </ul>
      </nav>
    </header>
  );
}
