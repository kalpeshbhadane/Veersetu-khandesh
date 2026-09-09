import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../api/client";
import DistrictMap from "../components/DistrictMap.jsx";

export default function MapExplore() {
  const [searchParams] = useSearchParams();
  const [districts, setDistricts] = useState([]);
  const [district, setDistrict] = useState(searchParams.get("district") || "");
  const [village, setVillage] = useState("");
  const [soldiers, setSoldiers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/public/districts").then(setDistricts);
  }, []);

  useEffect(() => {
    setLoading(true);
    let url = "/api/public/soldiers?";
    if (district) url += `district=${district}&`;
    if (village) url += `village=${encodeURIComponent(village)}&`;
    api.get(url).then((data) => {
      setSoldiers(data);
      setLoading(false);
    });
  }, [district, village]);

  const villages = useMemo(() => {
    return [...new Set(soldiers.map((s) => s.village).filter(Boolean))].sort();
  }, [soldiers]);

  const markers = soldiers.map((s) => ({
    lat: s.latitude,
    lng: s.longitude,
    popupHtml: `<strong>${s.name}</strong><br>${s.rank || ""} · ${s.force || ""}<br>${s.village}, ${s.districtDisplayName}<br><a href="/soldiers/${s.id}">View profile &rarr;</a>`,
  }));

  return (
    <section className="section" style={{ paddingTop: 40 }}>
      <div className="container">
        <div className="section-head">
          <span className="kicker">Interactive map</span>
          <h2>Select a district, then a village</h2>
          <p>Click a district marker to see its villages, or pick one from the list. Each pin on the map is a
            verified soldier record.</p>
        </div>

        <div className="map-shell">
          <div className="map-sidebar">
            <div className="field">
              <label htmlFor="districtSelect">District</label>
              <select
                id="districtSelect"
                value={district}
                onChange={(e) => {
                  setDistrict(e.target.value);
                  setVillage("");
                }}
              >
                <option value="">All districts</option>
                {districts.map((d) => (
                  <option key={d.code} value={d.code}>{d.name}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="villageSelect">Village</label>
              <select id="villageSelect" value={village} onChange={(e) => setVillage(e.target.value)}>
                <option value="">All villages</option>
                {villages.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
            <hr style={{ border: "none", borderTop: "1px dashed var(--rule)", margin: "18px 0" }} />
            {loading && <p style={{ fontSize: "0.88rem" }}>Loading…</p>}
            {!loading && soldiers.length === 0 && (
              <p style={{ fontSize: "0.88rem" }}>No verified records found for this selection yet.</p>
            )}
            {!loading &&
              soldiers.map((s) => (
                <a key={s.id} href={`/soldiers/${s.id}`} className="village-pick">
                  <strong>{s.name}</strong>
                  <br />
                  <span style={{ color: "var(--charcoal-soft)", fontSize: "0.82rem" }}>
                    {s.rank || ""} — {s.village}, {s.districtDisplayName}
                  </span>
                </a>
              ))}
          </div>
          <DistrictMap markers={markers} fitToMarkers={markers.length > 0} />
        </div>
      </div>
    </section>
  );
}
