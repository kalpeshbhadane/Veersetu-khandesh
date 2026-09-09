import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/client";

export default function RegisterFamily() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", relationToSoldier: "", password: "" });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await api.post("/api/auth/register", form);
      navigate("/login", { state: { registered: true } });
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
          <span className="hero-eyebrow" style={{ display: "block", textAlign: "center" }}>Family account</span>
          <h2 style={{ textAlign: "center", marginBottom: 6 }}>Create your account</h2>
          <p style={{ textAlign: "center", margin: "0 auto 24px" }}>
            After creating an account, you'll be able to submit your soldier's details for review.
          </p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="fullName">Your full name</label>
              <input type="text" id="fullName" required value={form.fullName} onChange={update("fullName")} />
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" required value={form.email} onChange={update("email")} />
              </div>
              <div className="field">
                <label htmlFor="phone">Phone number</label>
                <input type="tel" id="phone" value={form.phone} onChange={update("phone")} />
              </div>
            </div>
            <div className="field">
              <label htmlFor="relationToSoldier">Your relation to the soldier</label>
              <input type="text" id="relationToSoldier" placeholder="e.g. Son, Wife, Brother"
                value={form.relationToSoldier} onChange={update("relationToSoldier")} />
            </div>
            <div className="field">
              <label htmlFor="password">Create a password</label>
              <input type="password" id="password" required minLength={6} value={form.password} onChange={update("password")} />
            </div>
            <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
              {submitting ? "Creating…" : "Create account"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: 20, fontSize: "0.9rem" }}>
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
