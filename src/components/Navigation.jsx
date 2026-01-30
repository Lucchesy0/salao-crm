export default function Navigation({ currentPage, onPageChange, availablePages, user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>Salão CRM</h1>
        <span className="user-badge">{user?.nome}</span>
      </div>
      <ul className="navbar-menu">
        {availablePages.map(page => (
          <li key={page.id}>
            <button
              className={`nav-link ${currentPage === page.id ? 'active' : ''}`}
              onClick={() => onPageChange(page.id)}
            >
              {page.label}
            </button>
          </li>
        ))}
      </ul>
      <button className="btn-logout" onClick={onLogout}>
        Sair
      </button>
    </nav>
  );
}
