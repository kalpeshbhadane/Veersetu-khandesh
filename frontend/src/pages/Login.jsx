import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const justRegistered = location.state?.registered;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      // AuthContext will refresh; give it a beat then route based on role
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 50);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <section className="section" style={{ paddingTop: 56 }}>
      <div className="container">
        <div className="form-card">
          <span className="hero-eyebrow" style={{ display: "block", textAlign: "center" }}>Welcome back</span>
          <h2 style={{ textAlign: "center", marginBottom: 24 }}>Log in</h2>

          {justRegistered && (
            <div className="alert alert-success">
              Your account has been created. Log in below to register your soldier's details.
            </div>
          )}
          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" required autoComplete="username"
                value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" required autoComplete="current-password"
                value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
              {submitting ? "Logging in…" : "Log in"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: 20, fontSize: "0.9rem" }}>
            Family of a martyred soldier? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
