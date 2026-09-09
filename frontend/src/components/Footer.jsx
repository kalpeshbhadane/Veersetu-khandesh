export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <h4>VeerSetu Khandesh</h4>
          <p style={{ color: "#9DA1B2", maxWidth: "42ch" }}>
            A bridge between the families of soldiers martyred while serving the Indian Armed Forces
            from the Khandesh region — Dhule, Jalgaon, Nandurbar and Nashik — and citizens who want to
            stand with them.
          </p>
        </div>
        <div>
          <h4>Explore</h4>
          <p><a href="/map">Khandesh map</a></p>
          <p><a href="/about">About the initiative</a></p>
          <p><a href="/register">Register a soldier</a></p>
        </div>
        <div>
          <h4>Reach the team</h4>
          <p><a href="mailto:help@veersetukhandesh.org">help@veersetukhandesh.org</a></p>
          <p><a href="tel:+919000000000">+91 90000 00000</a></p>
        </div>
      </div>
      <div className="container footer-note">
        Every soldier record is verified by an administrator before it appears publicly. This platform does not
        process payments itself — contributions go directly to a family via the UPI QR code shown on each profile.
      </div>
    </footer>
  );
}
