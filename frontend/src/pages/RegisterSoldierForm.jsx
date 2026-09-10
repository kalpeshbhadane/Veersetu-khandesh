import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api, buildFileUrl } from "../api/client";

const FORCES = [
  "Indian Army", "Indian Navy", "Indian Air Force",
  "Border Security Force (BSF)", "Central Reserve Police Force (CRPF)",
  "Indo-Tibetan Border Police (ITBP)", "Other",
];

const emptyForm = {
  name: "", age: "", dateOfBirth: "",
  force: "", rank: "", battalion: "", unit: "", designation: "", serviceNumber: "", postingPlace: "",
  martyrdomDate: "", martyrdomPlace: "", operationName: "", story: "",
  district: "", taluka: "", village: "", address: "", latitude: "", longitude: "",
  familyContactName: "", familyContactPhone: "", familyContactEmail: "",
};

// Turns a SoldierResponse from the API into the flat string-keyed shape the
// form's controlled inputs expect (numbers/nulls -> "" so inputs stay controlled).
function toFormState(s) {
  const next = { ...emptyForm };
  Object.keys(next).forEach((key) => {
    const value = s[key];
    next[key] = value === null || value === undefined ? "" : value;
  });
  return next;
}

export default function RegisterSoldierForm({ audience }) {
  const navigate = useNavigate();
  const { id: editId } = useParams(); // only present on the /edit route
  const isEdit = Boolean(editId);

  const [districts, setDistricts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [photo, setPhoto] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [currentPhotoPath, setCurrentPhotoPath] = useState(null);
  const [currentQrPath, setCurrentQrPath] = useState(null);
  const [recordStatus, setRecordStatus] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loadingRecord, setLoadingRecord] = useState(isEdit);

  useEffect(() => {
    api.get("/api/public/districts").then(setDistricts);
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/api/family/soldiers/${editId}`)
      .then((s) => {
        setForm(toFormState(s));
        setCurrentPhotoPath(s.photoPath);
        setCurrentQrPath(s.qrCodePath);
        setRecordStatus(s.approvalStatus);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoadingRecord(false));
  }, [isEdit, editId]);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v !== "" && v !== null) data.append(k, v);
      });
      if (photo) data.append("photo", photo);
      if (qrCode) data.append("qrCode", qrCode);

      if (isEdit) {
        await api.putForm(`/api/family/soldiers/${editId}`, data);
      } else {
        const endpoint = audience === "admin" ? "/api/admin/soldiers" : "/api/family/soldiers";
        await api.postForm(endpoint, data);
      }

      navigate(audience === "admin" ? "/admin/dashboard" : "/family/dashboard", {
        state: isEdit ? { updated: true } : { submitted: true },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingRecord) return <div className="loading-strip">Loading record…</div>;

  return (
    <section className="section" style={{ paddingTop: 44 }}>
      <div className="container">
        <div className="form-card wide">
          <span className="hero-eyebrow" style={{ display: "block", textAlign: "center" }}>Soldier record</span>
          <h2 style={{ textAlign: "center", marginBottom: 6 }}>
            {isEdit ? "Update soldier record" : "Register a soldier's details"}
          </h2>
          <p style={{ textAlign: "center", margin: "0 auto 8px" }}>
            {isEdit
              ? "Change any field, and replace the photo or QR code only if you need to — anything you leave blank keeps its current file."
              : audience === "admin"
                ? "As an admin, records you submit are published immediately."
                : "Your submission will be reviewed by an administrator before it appears publicly."}
          </p>

          {isEdit && recordStatus === "APPROVED" && (
            <div className="alert alert-info">
              This record is currently <strong>live and public</strong>. Saving changes will send it back for
              admin review, and it will be temporarily removed from the public map until re-approved.
            </div>
          )}
          {isEdit && recordStatus === "REJECTED" && (
            <div className="alert alert-info">
              This record was previously rejected. Update it below and resubmit for review.
            </div>
          )}

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="section-label">Identity</div>
            <div className="field">
              <label htmlFor="name">Full name</label>
              <input type="text" id="name" required value={form.name} onChange={update("name")} />
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="age">Age (at time of martyrdom)</label>
                <input type="number" id="age" min="16" max="70" value={form.age} onChange={update("age")} />
              </div>
              <div className="field">
                <label htmlFor="dateOfBirth">Date of birth</label>
                <input type="date" id="dateOfBirth" value={form.dateOfBirth} onChange={update("dateOfBirth")} />
              </div>
            </div>
            <div className="field">
              <label htmlFor="photo">Soldier's photo{isEdit ? " (leave blank to keep the current one)" : ""}</label>
              {isEdit && currentPhotoPath && (
                <div className="current-file-preview">
                  <img src={buildFileUrl(currentPhotoPath)} alt="Current photo" />
                  <span>Current photo</span>
                </div>
              )}
              <input type="file" id="photo" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} />
            </div>

            <div className="section-label">Service details</div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="force">Force</label>
                <select id="force" required value={form.force} onChange={update("force")}>
                  <option value="">Select</option>
                  {FORCES.map((f) => <option key={f}>{f}</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="rank">Rank</label>
                <input type="text" id="rank" placeholder="e.g. Naib Subedar, Sepoy" value={form.rank} onChange={update("rank")} />
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="battalion">Battalion</label>
                <input type="text" id="battalion" placeholder="e.g. 4 Rajputana Rifles" value={form.battalion} onChange={update("battalion")} />
              </div>
              <div className="field">
                <label htmlFor="unit">Unit</label>
                <input type="text" id="unit" value={form.unit} onChange={update("unit")} />
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="designation">Designation / post</label>
                <input type="text" id="designation" value={form.designation} onChange={update("designation")} />
              </div>
              <div className="field">
                <label htmlFor="serviceNumber">Service number</label>
                <input type="text" id="serviceNumber" value={form.serviceNumber} onChange={update("serviceNumber")} />
              </div>
            </div>
            <div className="field">
              <label htmlFor="postingPlace">Posted at (at time of martyrdom)</label>
              <input type="text" id="postingPlace" value={form.postingPlace} onChange={update("postingPlace")} />
            </div>

            <div className="section-label">Martyrdom</div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="martyrdomDate">Date</label>
                <input type="date" id="martyrdomDate" value={form.martyrdomDate} onChange={update("martyrdomDate")} />
              </div>
              <div className="field">
                <label htmlFor="martyrdomPlace">Place</label>
                <input type="text" id="martyrdomPlace" value={form.martyrdomPlace} onChange={update("martyrdomPlace")} />
              </div>
            </div>
            <div className="field">
              <label htmlFor="operationName">Operation (if applicable)</label>
              <input type="text" id="operationName" value={form.operationName} onChange={update("operationName")} />
            </div>
            <div className="field">
              <label htmlFor="story">Their story</label>
              <textarea id="story" rows={4} placeholder="A short account of their service and sacrifice"
                value={form.story} onChange={update("story")} />
            </div>

            <div className="section-label">Native place (Khandesh)</div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="district">District</label>
                <select id="district" required value={form.district} onChange={update("district")}>
                  <option value="">Select</option>
                  {districts.map((d) => <option key={d.code} value={d.code}>{d.name}</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="taluka">Taluka</label>
                <input type="text" id="taluka" value={form.taluka} onChange={update("taluka")} />
              </div>
            </div>
            <div className="field">
              <label htmlFor="village">Village</label>
              <input type="text" id="village" required value={form.village} onChange={update("village")} />
            </div>
            <div className="field">
              <label htmlFor="address">Full address</label>
              <input type="text" id="address" value={form.address} onChange={update("address")} />
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="latitude">Village latitude (optional)</label>
                <input type="number" step="any" id="latitude" value={form.latitude} onChange={update("latitude")} />
              </div>
              <div className="field">
                <label htmlFor="longitude">Village longitude (optional)</label>
                <input type="number" step="any" id="longitude" value={form.longitude} onChange={update("longitude")} />
              </div>
            </div>
            <p className="field-hint">Leave latitude/longitude blank and the district's centre point will be used on the map instead.</p>

            <div className="section-label">Family contact &amp; support</div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="familyContactName">Contact person's name</label>
                <input type="text" id="familyContactName" value={form.familyContactName} onChange={update("familyContactName")} />
              </div>
              <div className="field">
                <label htmlFor="familyContactPhone">Contact phone</label>
                <input type="tel" id="familyContactPhone" value={form.familyContactPhone} onChange={update("familyContactPhone")} />
              </div>
            </div>
            <div className="field">
              <label htmlFor="familyContactEmail">Contact email</label>
              <input type="email" id="familyContactEmail" value={form.familyContactEmail} onChange={update("familyContactEmail")} />
            </div>
            <div className="field">
              <label htmlFor="qrCode">UPI QR code image (for direct donations){isEdit ? " — leave blank to keep the current one" : ""}</label>
              {isEdit && currentQrPath && (
                <div className="current-file-preview">
                  <img src={buildFileUrl(currentQrPath)} alt="Current QR code" />
                  <span>Current QR code</span>
                </div>
              )}
              <input type="file" id="qrCode" accept="image/*" onChange={(e) => setQrCode(e.target.files[0])} />
              <p className="field-hint">Upload a screenshot of your UPI QR code from Google Pay, PhonePe, Paytm etc.</p>
            </div>

            <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: 10 }} disabled={submitting}>
              {submitting ? (isEdit ? "Saving…" : "Submitting…") : (isEdit ? "Save changes" : "Submit for review")}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
