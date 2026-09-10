import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../api/client";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/api/auth/reset-password", { token, newPassword });
      navigate("/login", { state: { passwordReset: true } });
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
          <h2 style={{ textAlign: "center", marginBottom: 24 }}>Choose a new password</h2>

          {!token && (
            <div className="alert alert-error">
              This reset link is missing its token. Request a new one from the{" "}
              <Link to="/forgot-password">forgot password</Link> page.
            </div>
          )}
          {error && <div className="alert alert-error">{error}</div>}

          {token && (
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="newPassword">New password</label>
                <input type="password" id="newPassword" required minLength={6} autoComplete="new-password"
                  value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="confirmPassword">Confirm new password</label>
                <input type="password" id="confirmPassword" required minLength={6} autoComplete="new-password"
                  value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
                {submitting ? "Saving…" : "Reset password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
