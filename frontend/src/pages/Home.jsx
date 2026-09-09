import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import DistrictMap from "../components/DistrictMap.jsx";
import SoldierCard from "../components/SoldierCard.jsx";

export default function Home() {
  const [districts, setDistricts] = useState([]);
  const [stats, setStats] = useState({ total: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/api/public/districts"),
      api.get("/api/public/stats"),
      api.get("/api/public/soldiers"),
    ])
      .then(([d, s, soldiers]) => {
        setDistricts(d);
        setStats(s);
        setRecent(soldiers.slice(0, 6));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="hero-eyebrow">Khandesh region &middot; Dhule &middot; Jalgaon &middot; Nandurbar &middot; Nashik</span>
            <h1>A record of every soldier <span>this soil has given</span> to the nation.</h1>
            <p>
              VeerSetu Khandesh keeps a verified, city and village-wise record of soldiers from the Khandesh
              region who were martyred while serving in the Indian Armed Forces — and gives their families a
              direct, transparent way to receive support from the public.
            </p>
            <div className="hero-stats">
              <div className="stat">
                <div className="num">{stats.total ?? 0}</div>
                <div className="label">Soldiers recorded</div>
              </div>
              <div className="stat">
                <div className="num">4</div>
                <div className="label">Districts covered</div>
              </div>
              <div className="stat">
                <div className="num">2</div>
                <div className="label">Ways to register</div>
              </div>
            </div>
            <div className="hero-actions">
              <Link to="/map" className="btn btn-primary">Explore the map</Link>
              <Link to="/register" className="btn btn-secondary">Register a soldier's family</Link>
            </div>
          </div>
          <div className="hero-map-frame">
            <DistrictMap
              markers={districts.map((d) => ({ lat: d.lat, lng: d.lng, tooltip: d.name, permanentTooltip: true }))}
              scrollWheelZoom={false}
            />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="kicker">Our motive</span>
            <h2>Why this platform exists</h2>
            <p>
              Families of martyred soldiers are often known well within their own village, but invisible beyond
              it. This makes it hard for people who genuinely want to help — financially or otherwise — to find
              them, verify who they are, and reach them directly. VeerSetu Khandesh closes that gap for the four
              districts of Khandesh, with every record checked by an administrator before it goes live.
            </p>
          </div>
          <div className="grid-3">
            <div className="service-card">
              <div className="num">01</div>
              <h3>Verified records</h3>
              <p style={{ maxWidth: "none" }}>Every soldier's service details, rank, unit and native village are
                submitted by family or an admin and checked before appearing publicly — so visitors know the
                information is genuine.</p>
            </div>
            <div className="service-card">
              <div className="num">02</div>
              <h3>Direct financial support</h3>
              <p style={{ maxWidth: "none" }}>Each approved profile carries the family's UPI QR code, so
                contributions reach them directly. VeerSetu Khandesh never collects or holds funds itself.</p>
            </div>
            <div className="service-card">
              <div className="num">03</div>
              <h3>Other kinds of help</h3>
              <p style={{ maxWidth: "none" }}>Not everything is financial. Every profile lists a phone number and
                email so people can offer employment, education support, legal help, or simply reach out.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <span className="kicker">Browse by district</span>
            <h2>Soldiers recorded, district by district</h2>
          </div>
          <div className="grid-4">
            {districts.map((d) => (
              <Link key={d.code} to={`/map?district=${d.code}`} className="district-card">
                <div className="num">{d.count}</div>
                <div className="name">{d.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {!loading && recent.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-head">
              <span className="kicker">Recently added</span>
              <h2>Latest verified records</h2>
            </div>
            <div className="grid-3">
              {recent.map((s) => (
                <SoldierCard key={s.id} soldier={s} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section section-alt">
        <div className="container" style={{ textAlign: "center" }}>
          <h2>Know a soldier's family from Khandesh?</h2>
          <p style={{ margin: "0 auto 24px" }}>
            Help their story be recorded, and help the family be reached by those who want to support them.
          </p>
          <Link to="/register" className="btn btn-primary">Register a soldier's family</Link>
        </div>
      </section>
    </>
  );
}
