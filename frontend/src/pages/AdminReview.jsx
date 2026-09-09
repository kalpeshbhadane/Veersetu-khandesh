import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api, buildFileUrl } from "../api/client";

export default function AdminReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [soldier, setSoldier] = useState(null);
  const [showReject, setShowReject] = useState(false);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.get(`/api/admin/soldiers/${id}`).then(setSoldier);
  }, [id]);

  const approve = async () => {
    setBusy(true);
    await api.post(`/api/admin/soldiers/${id}/approve`, {});
    navigate("/admin/dashboard");
  };

  const reject = async (e) => {
    e.preventDefault();
    setBusy(true);
    await api.post(`/api/admin/soldiers/${id}/reject`, { reason });
    navigate("/admin/dashboard");
  };

  if (!soldier) return <div className="loading-strip">Loading…</div>;
  const photo = buildFileUrl(soldier.photoPath);
  const qr = buildFileUrl(soldier.qrCodePath);

  return (
    <section className="section" style={{ paddingTop: 44 }}>
      <div className="container">
        <div className="detail-grid">
          <div>
            <div className="detail-photo" style={photo ? { backgroundImage: `url(${photo})` } : {}} />
            {qr && (
              <div className="donate-box">
                <h4 style={{ fontFamily: "var(--font-head)", marginBottom: 10 }}>QR code provided</h4>
                <img src={qr} alt="Uploaded QR code" />
              </div>
            )}
          </div>

          <div>
            <span className="hero-eyebrow">Reviewing submission</span>
            <h2>{soldier.name}</h2>

            <table className="info-table">
              <tbody>
                <tr><td>Force / Rank</td><td>{soldier.force} — {soldier.rank || ""}</td></tr>
                <tr><td>Battalion / Unit</td><td>{soldier.battalion || ""} {soldier.unit || ""}</td></tr>
                <tr><td>Designation</td><td>{soldier.designation}</td></tr>
                <tr><td>Service number</td><td>{soldier.serviceNumber}</td></tr>
                <tr><td>Martyrdom date &amp; place</td><td>{soldier.martyrdomDate || ""} — {soldier.martyrdomPlace || ""}</td></tr>
                <tr><td>Village / Taluka / District</td><td>{soldier.village} / {soldier.taluka || "-"} / {soldier.districtDisplayName}</td></tr>
                <tr><td>Contact</td><td>{soldier.familyContactPhone || "-"} &middot; {soldier.familyContactEmail || "-"}</td></tr>
                <tr><td>Submitted by</td><td>{soldier.submittedByName} {soldier.submittedByEmail ? `(${soldier.submittedByEmail})` : ""}</td></tr>
              </tbody>
            </table>

            {soldier.story && (
              <>
                <div className="section-label">Story submitted</div>
                <p style={{ maxWidth: "none", whiteSpace: "pre-line" }}>{soldier.story}</p>
              </>
            )}

            <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
              <button className="btn btn-primary" onClick={approve} disabled={busy}>Approve &amp; publish</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowReject(true)} disabled={busy}>Reject</button>
            </div>

            {showReject && (
              <form onSubmit={reject} style={{ marginTop: 20 }}>
                <div className="field">
                  <label htmlFor="reason">Reason for rejection (shown to the family)</label>
                  <textarea id="reason" rows={3} required value={reason} onChange={(e) => setReason(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-brass" disabled={busy}>Confirm rejection</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
