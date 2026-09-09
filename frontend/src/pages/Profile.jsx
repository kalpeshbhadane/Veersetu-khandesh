import { useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext.jsx";

export default function Profile() {
  const { user, refresh } = useAuth();
  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
    relationToSoldier: user?.relationToSoldier || "",
    currentPassword: "",
    newPassword: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSubmitting(true);
    try {
      await api.put("/api/auth/me", form);
      await refresh();
      setSuccess(true);
      setForm({ ...form, currentPassword: "", newPassword: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <section className="section" style={{ paddingTop: 56 }}>
      <div className="container">
        <div className="form-card">
          <span className="hero-eyebrow" style={{ display: "block", textAlign: "center" }}>Account</span>
          <h2 style={{ textAlign: "center", marginBottom: 24 }}>Your profile</h2>

          {success && <div className="alert alert-success">Your profile has been updated.</div>}
          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="fullName">Full name</label>
              <input type="text" id="fullName" required value={form.fullName} onChange={update("fullName")} />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" value={user.email} disabled />
              <p className="field-hint">Email can't be changed here.</p>
            </div>
            <div className="field">
              <label htmlFor="phone">Phone number</label>
              <input type="tel" id="phone" value={form.phone} onChange={update("phone")} />
            </div>
            {user.role === "FAMILY" && (
              <div className="field">
                <label htmlFor="relationToSoldier">Your relation to the soldier</label>
                <input type="text" id="relationToSoldier" value={form.relationToSoldier} onChange={update("relationToSoldier")} />
              </div>
            )}

            <div className="section-label">Change password (optional)</div>
            <div className="field">
              <label htmlFor="currentPassword">Current password</label>
              <input type="password" id="currentPassword" value={form.currentPassword} onChange={update("currentPassword")} />
            </div>
            <div className="field">
              <label htmlFor="newPassword">New password</label>
              <input type="password" id="newPassword" minLength={6} value={form.newPassword} onChange={update("newPassword")} />
              <p className="field-hint">Leave both password fields blank to keep your current password.</p>
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
              {submitting ? "Saving…" : "Save changes"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
