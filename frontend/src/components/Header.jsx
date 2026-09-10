import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  const handleLogout = async () => {
    closeMenu();
    await logout();
    navigate("/");
  };

  return (
    <header className="site-header">
      <div className="container nav">
        <Link to="/" className="brand" onClick={closeMenu}>
          <span className="mark">VS</span>
          <span>
            VeerSetu Khandesh
            <small>Roll of Honour &middot; Family Support</small>
          </span>
        </Link>
        <button
          type="button"
          className="nav-toggle"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
        <nav className={menuOpen ? "nav-links open" : "nav-links"}>
          <Link to="/map" onClick={closeMenu}>Explore the Map</Link>
          <Link to="/about" onClick={closeMenu}>About &amp; Services</Link>

          {!user && (
            <>
              <Link to="/login" onClick={closeMenu}>Log in</Link>
              <Link to="/register" className="nav-cta" onClick={closeMenu}>Register a Soldier</Link>
            </>
          )}
          {user && user.role === "FAMILY" && (
            <Link to="/family/dashboard" className="nav-cta" onClick={closeMenu}>My Dashboard</Link>
          )}
          {user && user.role === "ADMIN" && (
            <Link to="/admin/dashboard" className="nav-cta" onClick={closeMenu}>Admin Dashboard</Link>
          )}
          {user && <Link to="/profile" onClick={closeMenu}>My Profile</Link>}
          {user && (
            <button className="nav-logout" onClick={handleLogout}>Log out</button>
          )}
        </nav>
      </div>
    </header>
  );
}
