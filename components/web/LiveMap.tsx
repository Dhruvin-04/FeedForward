import { memo, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
  ZoomControl,
  useMap,
} from "react-leaflet";
import { DivIcon, LatLngLiteral } from "leaflet";
import "leaflet/dist/leaflet.css";
import { renderToStaticMarkup } from "react-dom/server";
import { Store, Building2, Bike } from "lucide-react";

// ── Types ──────────────────────────────────────────────
export type LiveLocation = {
  userId: string;
  role: "donor" | "ngo" | "volunteer" | string;
  lat: number;
  lng: number;
  label?: string;
};

type LiveMapProps = {
  /** All the locations to render (donors, NGOs, volunteers) */
  locations: LiveLocation[];
  /** Optional explicit center; defaults to first location or Mumbai fallback */
  center?: LatLngLiteral;
  /** Height class, e.g. "h-96" */
  height?: string;
};

// ── Helpers ────────────────────────────────────────────
const ROLE_CONFIG: Record<string, { color: string; bg: string; Icon: typeof Store }> = {
  donor: { color: "#ef4444", bg: "#fef2f2", Icon: Store },
  ngo: { color: "#3b82f6", bg: "#eff6ff", Icon: Building2 },
  volunteer: { color: "#22c55e", bg: "#f0fdf4", Icon: Bike },
};

function makeIcon(role: string) {
  const cfg = ROLE_CONFIG[role.toLowerCase()] ?? ROLE_CONFIG.volunteer;
  const html = renderToStaticMarkup(
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 36,
        height: 36,
        borderRadius: "50%",
        backgroundColor: cfg.bg,
        border: `2.5px solid ${cfg.color}`,
        boxShadow: `0 2px 6px ${cfg.color}55`,
      }}
    >
      <cfg.Icon size={18} color={cfg.color} strokeWidth={2.5} />
    </div>
  );
  return new DivIcon({ html, className: "", iconSize: [36, 36], iconAnchor: [18, 18] });
}

// ── Sub-component that pans on center change ──────────
function PanTo({ center }: { center: LatLngLiteral }) {
  const map = useMap();
  map.panTo(center, { animate: true });
  return null;
}

// ── Main Component ────────────────────────────────────
const LiveMap: React.FC<LiveMapProps> = memo(({ locations, center, height = "h-96" }) => {
  // Derive map center
  const mapCenter = useMemo<LatLngLiteral>(() => {
    if (center) return center;
    if (locations.length > 0) return { lat: locations[0].lat, lng: locations[0].lng };
    return { lat: 18.9774, lng: 72.835 }; // Mumbai fallback
  }, [center, locations]);

  // Group by role (normalize to lowercase to handle DB values like DONOR, NGO, VOLUNTEER)
  const donors = useMemo(() => locations.filter((l) => l.role.toLowerCase() === "donor"), [locations]);
  const ngos = useMemo(() => locations.filter((l) => l.role.toLowerCase() === "ngo"), [locations]);
  const volunteers = useMemo(() => locations.filter((l) => l.role.toLowerCase() === "volunteer"), [locations]);

  // Draw a path line from each donor to each NGO (shows pickup routes)
  const polylines = useMemo(() => {
    const lines: LatLngLiteral[][] = [];
    for (const d of donors) {
      for (const n of ngos) {
        lines.push([
          { lat: d.lat, lng: d.lng },
          { lat: n.lat, lng: n.lng },
        ]);
      }
    }
    return lines;
  }, [donors, ngos]);

  const tileUrl = "http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}";

  return (
    <div className={`w-full ${height} rounded-lg overflow-hidden shadow-sm border border-gray-200`}>
      {/* Legend */}
      <div className="flex gap-4 px-3 py-1.5 bg-white/90 text-xs font-medium border-b border-gray-100">
        <span className="flex items-center gap-1"><Store size={12} className="text-red-500" /> Donor</span>
        <span className="flex items-center gap-1"><Building2 size={12} className="text-blue-500" /> NGO</span>
        <span className="flex items-center gap-1"><Bike size={12} className="text-green-500" /> Volunteer</span>
        <span className="flex items-center gap-1">
          <span className="w-4 h-0.5 bg-blue-400 inline-block rounded" /> Route
        </span>
      </div>

      <MapContainer
        center={mapCenter}
        zoom={13}
        minZoom={5}
        zoomControl={false}
        attributionControl={false}
        style={{ width: "100%", height: "calc(100% - 28px)" }}
      >
        <TileLayer url={tileUrl} />
        <PanTo center={mapCenter} />

        {/* Polylines: donor ↔ NGO routes */}
        {polylines.map((line, i) => (
          <Polyline
            key={`route-${i}`}
            positions={line}
            pathOptions={{ color: "#3b82f6", weight: 4, dashArray: "10 8", opacity: 0.9 }}
          />
        ))}

        {/* Markers */}
        {locations.map((loc) => (
          <Marker
            key={loc.userId}
            position={{ lat: loc.lat, lng: loc.lng }}
            icon={makeIcon(loc.role)}
          >
            <Popup>
              <span className="text-sm font-medium capitalize">{loc.role.toLowerCase()}</span>
              {loc.label && <span className="block text-xs text-gray-500">{loc.label}</span>}
            </Popup>
          </Marker>
        ))}

        <ZoomControl position="topright" />
      </MapContainer>
    </div>
  );
});

LiveMap.displayName = "LiveMap";
export default LiveMap;