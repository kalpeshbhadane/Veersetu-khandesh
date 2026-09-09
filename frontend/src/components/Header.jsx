import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="site-header">
      <div className="container nav">
        <Link to="/" className="brand">
          <span className="mark">VS</span>
          <span>
            VeerSetu Khandesh
            <small>Roll of Honour &middot; Family Support</small>
          </span>
        </Link>
        <nav className="nav-links">
          <Link to="/map">Explore the Map</Link>
          <Link to="/about">About &amp; Services</Link>

          {!user && (
            <>
              <Link to="/login">Log in</Link>
              <Link to="/register" className="nav-cta">Register a Soldier</Link>
            </>
          )}
          {user && user.role === "FAMILY" && (
            <Link to="/family/dashboard" className="nav-cta">My Dashboard</Link>
          )}
          {user && user.role === "ADMIN" && (
            <Link to="/admin/dashboard" className="nav-cta">Admin Dashboard</Link>
          )}
          {user && <Link to="/profile">My Profile</Link>}
          {user && (
            <button className="nav-logout" onClick={handleLogout}>Log out</button>
          )}
        </nav>
      </div>
    </header>
  );
}
