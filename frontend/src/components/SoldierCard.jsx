import { Link } from "react-router-dom";
import { buildFileUrl } from "../api/client";

export default function SoldierCard({ soldier }) {
  const photo = buildFileUrl(soldier.photoPath);
  return (
    <div className="dogtag">
      <div
        className="dogtag-photo"
        style={photo ? { backgroundImage: `url(${photo})` } : {}}
      >
        {!photo && <span>Portrait unavailable</span>}
      </div>
      <div className="dogtag-body">
        {soldier.rank && <span className="rank-badge">{soldier.rank}</span>}
        <h3>{soldier.name}</h3>
        <div className="dogtag-meta">
          {soldier.village}, {soldier.districtDisplayName || soldier.district}
        </div>
        <Link to={`/soldiers/${soldier.id}`} className="btn btn-secondary btn-sm">
          View profile
        </Link>
      </div>
    </div>
  );
}
