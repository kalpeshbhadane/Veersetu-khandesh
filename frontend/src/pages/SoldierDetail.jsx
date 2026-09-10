import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api, buildFileUrl } from "../api/client";

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
}

export default function SoldierDetail() {
  const { id } = useParams();
  const [soldier, setSoldier] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(`/api/public/soldiers/${id}`).then(setSoldier).catch((e) => setError(e.message));
  }, [id]);

  if (error) return <div className="container section">{error}</div>;
  if (!soldier) return <div className="loading-strip">Loading record…</div>;

  const photo = buildFileUrl(soldier.photoPath);
  const qr = buildFileUrl(soldier.qrCodePath);

  return (
    <section className="section" style={{ paddingTop: 40 }}>
      <div className="container">
        {soldier.approvalStatus !== "APPROVED" && (
          <div className="alert alert-error">
            This record is not yet public — you are viewing it as a preview. Status: <strong>{soldier.approvalStatus}</strong>
          </div>
        )}

        <div className="detail-grid">
          <div>
            <div className="detail-photo" style={photo ? { backgroundImage: `url(${photo})` } : {}} />

            {(qr || soldier.familyUpiId) && (
              <div className="donate-box">
                <h4 style={{ fontFamily: "var(--font-head)", marginBottom: 10 }}>Support this family</h4>
                {qr && <img src={qr} alt="UPI QR code for donations" />}
                {soldier.familyUpiId && (
                  <a
                    href={`upi://pay?pa=${encodeURIComponent(soldier.familyUpiId)}&pn=${encodeURIComponent(soldier.name)}&cu=INR`}
                    className="btn btn-brass btn-block"
                    style={qr ? { marginTop: 14 } : undefined}
                  >
                    Pay via UPI
                  </a>
                )}
                <p style={{ fontSize: "0.85rem", margin: "10px auto 0" }}>
                  {soldier.familyUpiId
                    ? <>On your own phone, tap <strong>Pay via UPI</strong> to open your payment app directly — no screenshot or scanning needed. On another device, scan the QR code instead. VeerSetu Khandesh does not collect or hold any funds.</>
                    : "Scan to send support directly via UPI. VeerSetu Khandesh does not collect or hold any funds."}
                </p>
              </div>
            )}

            <div className="contact-row">
              {soldier.familyContactPhone && (
                <a href={`tel:${soldier.familyContactPhone}`} className="btn btn-secondary btn-sm">Call family</a>
              )}
              {soldier.familyContactEmail && (
                <a href={`mailto:${soldier.familyContactEmail}`} className="btn btn-secondary btn-sm">Email family</a>
              )}
            </div>
          </div>

          <div>
            <span className="hero-eyebrow">{soldier.districtDisplayName} district</span>
            <h1>{soldier.name}</h1>
            {(soldier.rank || soldier.force) && (
              <p style={{ fontSize: "1.1rem", color: "var(--charcoal)" }}>
                {soldier.rank}{soldier.rank && soldier.force ? " · " : ""}{soldier.force}
              </p>
            )}

            <div className="section-label">Service details</div>
            <table className="info-table">
              <tbody>
                {soldier.battalion && (
                  <tr><td>Battalion / Unit</td><td>{soldier.battalion}{soldier.unit ? `, ${soldier.unit}` : ""}</td></tr>
                )}
                {soldier.designation && <tr><td>Designation</td><td>{soldier.designation}</td></tr>}
                {soldier.serviceNumber && <tr><td>Service number</td><td>{soldier.serviceNumber}</td></tr>}
                {soldier.postingPlace && <tr><td>Posted at</td><td>{soldier.postingPlace}</td></tr>}
                {soldier.age && <tr><td>Age</td><td>{soldier.age}</td></tr>}
              </tbody>
            </table>

            <div className="section-label">Martyrdom</div>
            <table className="info-table">
              <tbody>
                {soldier.martyrdomDate && <tr><td>Date</td><td>{formatDate(soldier.martyrdomDate)}</td></tr>}
                {soldier.martyrdomPlace && <tr><td>Place</td><td>{soldier.martyrdomPlace}</td></tr>}
                {soldier.operationName && <tr><td>Operation</td><td>{soldier.operationName}</td></tr>}
              </tbody>
            </table>

            <div className="section-label">Native place</div>
            <table className="info-table">
              <tbody>
                <tr><td>Village</td><td>{soldier.village}</td></tr>
                {soldier.taluka && <tr><td>Taluka</td><td>{soldier.taluka}</td></tr>}
                <tr><td>District</td><td>{soldier.districtDisplayName}</td></tr>
                {soldier.address && <tr><td>Address</td><td>{soldier.address}</td></tr>}
              </tbody>
            </table>

            {soldier.story && (
              <>
                <div className="section-label">Their story</div>
                <p style={{ maxWidth: "none", whiteSpace: "pre-line" }}>{soldier.story}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
