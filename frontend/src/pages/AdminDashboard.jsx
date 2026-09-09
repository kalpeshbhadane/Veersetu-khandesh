import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";

export default function AdminDashboard() {
  const [pending, setPending] = useState([]);
  const [stats, setStats] = useState({ pending: 0, approved: 0 });
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    Promise.all([api.get("/api/admin/soldiers/pending"), api.get("/api/admin/stats")]).then(([p, s]) => {
      setPending(p);
      setStats(s);
      setLoading(false);
    });
  };

  useEffect(load, []);

  return (
    <section className="section" style={{ paddingTop: 44 }}>
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
          <div>
            <span className="hero-eyebrow">Admin</span>
            <h2 style={{ margin: 0 }}>Review queue</h2>
          </div>
          <Link to="/admin/soldiers/new" className="btn btn-primary">+ Add a soldier record</Link>
        </div>

        <div className="hero-stats" style={{ margin: "0 0 32px", border: "none", padding: 0 }}>
          <div className="stat"><div className="num">{stats.pending}</div><div className="label">Pending review</div></div>
          <div className="stat"><div className="num">{stats.approved}</div><div className="label">Approved &amp; live</div></div>
        </div>

        {loading && <div className="loading-strip">Loading…</div>}

        {!loading && pending.length > 0 && (
          <table className="table">
            <thead>
              <tr><th>Name</th><th>Village</th><th>District</th><th>Submitted by</th><th></th></tr>
            </thead>
            <tbody>
              {pending.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.village}</td>
                  <td>{s.districtDisplayName}</td>
                  <td>{s.submittedByName}</td>
                  <td><Link to={`/admin/soldiers/${s.id}/review`} className="btn btn-secondary btn-sm">Review</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && pending.length === 0 && (
          <div className="form-card" style={{ textAlign: "center" }}>
            <p>Nothing waiting for review right now.</p>
          </div>
        )}
      </div>
    </section>
  );
}
