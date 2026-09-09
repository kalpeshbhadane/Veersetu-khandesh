import { useEffect, useRef } from "react";
import L from "leaflet";

/**
 * markers: [{ lat, lng, popupHtml, tooltip, permanentTooltip }]
 * Re-renders markers whenever the `markers` prop changes; map instance is
 * created once and kept for the component's lifetime.
 */
export default function DistrictMap({ center = [20.85, 74.9], zoom = 8, markers = [], fitToMarkers = false, scrollWheelZoom = true, className }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const layerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, { scrollWheelZoom }).setView(center, zoom);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 16,
    }).addTo(map);
    mapRef.current = map;
    layerRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mapRef.current || !layerRef.current) return;
    layerRef.current.clearLayers();
    const bounds = [];

    markers.forEach((m) => {
      const marker = L.circleMarker([m.lat, m.lng], {
        radius: m.radius || 9,
        color: "#6E1F2A",
        fillColor: "#AD8A34",
        fillOpacity: 0.9,
        weight: 2,
      }).addTo(layerRef.current);

      if (m.popupHtml) marker.bindPopup(m.popupHtml);
      if (m.tooltip) {
        marker.bindTooltip(m.tooltip, {
          permanent: !!m.permanentTooltip,
          direction: "top",
          className: "khandesh-tooltip",
        });
      }
      bounds.push([m.lat, m.lng]);
    });

    if (fitToMarkers && bounds.length > 0) {
      mapRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
    }
  }, [markers, fitToMarkers]);

  return <div ref={containerRef} className={className} />;
}
