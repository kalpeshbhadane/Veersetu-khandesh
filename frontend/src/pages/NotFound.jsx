import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="section" style={{ textAlign: "center", paddingTop: 80 }}>
      <div className="container">
        <span className="hero-eyebrow">Not found</span>
        <h1>This page doesn't exist.</h1>
        <Link to="/" className="btn btn-primary">Back to home</Link>
      </div>
    </section>
  );
}
