import { Link } from "react-router-dom";

export default function About() {
  return (
    <section className="section" style={{ paddingTop: 44 }}>
      <div className="container" style={{ maxWidth: 820 }}>
        <span className="hero-eyebrow">About the initiative</span>
        <h1>A record that helps families be seen — and reached.</h1>
        <p>
          Khandesh — Dhule, Jalgaon, Nandurbar and Nashik — has sent generations of its sons and daughters into
          the Indian Armed Forces. Many never returned. Their families continue to live in the same villages,
          often without the recognition, or the reach, that would let people who want to help actually find them.
        </p>
        <p>
          VeerSetu Khandesh ("setu" means bridge) exists to close that distance. It is a single, verified,
          district-and-village-wise record of soldiers from this region who were martyred in service, built and
          maintained with the families themselves.
        </p>

        <h2 style={{ marginTop: 44 }}>What the platform provides</h2>
        <div className="grid-2" style={{ marginTop: 20 }}>
          <div className="service-card">
            <h3>For soldiers' families</h3>
            <p style={{ maxWidth: "none" }}>A free, permanent public record of your soldier's service and
              sacrifice, a direct channel for financial support through your own UPI QR code, and a listed
              contact point for anyone offering other kinds of help.</p>
          </div>
          <div className="service-card">
            <h3>For the public</h3>
            <p style={{ maxWidth: "none" }}>A verified way to find and support martyred soldiers' families from
              the Khandesh region — browsable by district and village on an interactive map, with every record
              checked by an administrator before it is shown.</p>
          </div>
          <div className="service-card">
            <h3>Financial support</h3>
            <p style={{ maxWidth: "none" }}>Each family's profile carries their own UPI QR code. Contributions go
              straight to the family's account. VeerSetu Khandesh is a directory, not a payment processor, and
              never touches the funds.</p>
          </div>
          <div className="service-card">
            <h3>Other kinds of support</h3>
            <p style={{ maxWidth: "none" }}>Employment opportunities, education sponsorship for children, legal
              aid, medical help, or simply a visit — every profile lists a phone number and email so this kind of
              help can be arranged directly with the family or through the admin team.</p>
          </div>
        </div>

        <h2 style={{ marginTop: 44 }}>How a record gets published</h2>
        <table className="info-table">
          <tbody>
            <tr><td>1. Submission</td><td>A family member registers and fills in the soldier's details, or an
              admin does it on the family's behalf.</td></tr>
            <tr><td>2. Verification</td><td>An administrator reviews the submission — service details, native
              place, and contact information — before it is approved.</td></tr>
            <tr><td>3. Publication</td><td>Once approved, the record appears on the district map and is publicly
              visible, with the family's contact details and QR code.</td></tr>
          </tbody>
        </table>

        <div style={{ textAlign: "center", marginTop: 48 }}>
          <Link to="/register" className="btn btn-primary">Register a soldier's family</Link>
          <Link to="/map" className="btn btn-secondary" style={{ marginLeft: 12 }}>Explore the map</Link>
        </div>
      </div>
    </section>
  );
}
