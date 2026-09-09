import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext.jsx";

const badgeClass = { PENDING: "badge-pending", APPROVED: "badge-approved", REJECTED: "badge-rejected" };
const badgeLabel = { PENDING: "Pending review", APPROVED: "Approved & live", REJECTED: "Needs changes" };

export default function FamilyDashboard() {
  const { user } = useAuth();
  const [soldiers, setSoldiers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/family/soldiers").then((data) => {
      setSoldiers(data);
      setLoading(false);
    });
  }, []);

  return (
    <section className="section" style={{ paddingTop: 44 }}>
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
          <div>
            <span className="hero-eyebrow">Welcome, {user?.fullName}</span>
            <h2 style={{ margin: 0 }}>Your submissions</h2>
          </div>
          <Link to="/family/soldiers/new" className="btn btn-primary">+ Register a soldier</Link>
        </div>

        {loading && <div className="loading-strip">Loading…</div>}

        {!loading && soldiers.length > 0 && (
          <table className="table">
            <thead>
              <tr><th>Name</th><th>Village</th><th>District</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {soldiers.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.village}</td>
                  <td>{s.districtDisplayName}</td>
                  <td><span className={`badge ${badgeClass[s.approvalStatus]}`}>{badgeLabel[s.approvalStatus]}</span></td>
                  <td><Link to={`/soldiers/${s.id}`}>View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && soldiers.length === 0 && (
          <div className="form-card" style={{ textAlign: "center" }}>
            <p>You haven't registered a soldier's record yet.</p>
            <Link to="/family/soldiers/new" className="btn btn-primary">Register a soldier</Link>
          </div>
        )}
      </div>
    </section>
  );
}
