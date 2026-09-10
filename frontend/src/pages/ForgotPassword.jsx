import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await api.post("/api/auth/forgot-password", { email });
      setMessage(res?.message || "If an account exists for that email address, a password reset link has been sent.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section" style={{ paddingTop: 56 }}>
      <div className="container">
        <div className="form-card">
          <span className="hero-eyebrow" style={{ display: "block", textAlign: "center" }}>Account recovery</span>
          <h2 style={{ textAlign: "center", marginBottom: 6 }}>Forgot your password?</h2>
          <p style={{ textAlign: "center", margin: "0 auto 24px" }}>
            Enter the email address on your account and we'll send you a link to reset your password.
          </p>

          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-error">{error}</div>}

          {!message && (
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" required autoComplete="username"
                  value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
                {submitting ? "Sending…" : "Send reset link"}
              </button>
            </form>
          )}

          <p style={{ textAlign: "center", marginTop: 20, fontSize: "0.9rem" }}>
            <Link to="/login">Back to log in</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
