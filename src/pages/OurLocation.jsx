import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { MapPin, Phone, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "leaflet/dist/leaflet.css";
import { getOurLocations } from "../services/api";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

function MapPanner({ coords }) {
  const map = useMap();
  if (coords) map.flyTo(coords, 16, { duration: 1 });
  return null;
}

function directionsHref(loc, coord) {
  if (coord?.length === 2) {
    const [lat, lng] = coord;
    if (
      lat != null &&
      lng != null &&
      !Number.isNaN(lat) &&
      !Number.isNaN(lng) &&
      (lat !== 0 || lng !== 0)
    ) {
      return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    }
  }
  const g = loc?.google_map;
  if (typeof g === "string" && /^https?:\/\//i.test(g)) return g;
  return null;
}

export default function ContactPage() {
  const [locations, setLocations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [coordsList, setCoordsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLocations() {
      try {
        const data = await getOurLocations();
        const coords = data.map((loc) => {
          const match = loc.google_map?.match(/!2d([-.\d]+)!3d([-.\d]+)/);
          return match
            ? [parseFloat(match[2]), parseFloat(match[1])]
            : [0, 0];
        });
        setLocations(data);
        setCoordsList(coords);
        if (data.length > 0) setSelected(0);
      } catch (err) {
        console.error("Failed to load locations:", err);
      } finally {
        setLoading(false);
      }
    }
    loadLocations();
  }, []);

  const activeCoord = selected != null ? coordsList[selected] : null;
  const activeLoc = selected != null ? locations[selected] : null;
  const gridCols =
    locations.length === 1
      ? "grid-cols-1 max-w-md mx-auto w-full"
      : "grid-cols-2";

  if (loading) {
    return (
      <section className="border-b border-border bg-background pb-8 pt-[4.5rem] sm:pb-12 sm:pt-24 md:pt-28">
        <div className="container-custom px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="mb-4 max-w-xl space-y-1.5 border-b border-border pb-4 sm:mb-6 sm:space-y-2 sm:pb-6">
            <div className="h-2 w-14 animate-pulse rounded bg-muted sm:h-2.5 sm:w-16" />
            <div className="h-5 max-w-[10rem] animate-pulse rounded bg-muted sm:h-7 sm:max-w-[12rem]" />
            <div className="h-2.5 max-w-md animate-pulse rounded bg-muted/80 sm:h-3" />
          </div>
          <div
            className={`grid gap-1.5 sm:gap-3 md:gap-4 ${gridCols}`}
          >
            {[0, 1].map((i) => (
              <div
                key={i}
                className="h-[88px] animate-pulse rounded-lg border border-border bg-muted/35 sm:h-[120px] sm:rounded-xl md:h-[140px]"
              />
            ))}
          </div>
          <div className="mt-2 h-[200px] animate-pulse rounded-lg border border-border bg-muted/35 sm:mt-3 sm:h-[280px] md:h-[340px] lg:h-[400px]" />
        </div>
      </section>
    );
  }

  if (locations.length === 0) {
    return (
      <section className="flex min-h-[50vh] items-center justify-center border-b border-border bg-background px-3 py-16 sm:px-4 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-sm border border-border bg-card px-5 py-8 text-center shadow-sm sm:max-w-md sm:px-8 sm:py-10"
        >
          <MapPin
            className="mx-auto h-7 w-7 text-muted-foreground sm:h-9 sm:w-9"
            strokeWidth={1.25}
            aria-hidden
          />
          <h2 className="mt-4 text-base font-medium tracking-tight text-foreground sm:mt-6 sm:text-xl">
            No locations listed
          </h2>
          <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground sm:text-sm">
            Store information will appear here once it is available.
          </p>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="border-b border-border bg-background pb-8 pt-5 sm:pb-12 sm:pt-24 md:pt-28 lg:pb-16">
      <div className="container-custom px-3 sm:px-4 md:px-6 lg:px-8">
        <header className="mb-3 border-b border-border pb-3 text-center sm:mb-5 sm:pb-5 md:mb-7 md:pb-7 md:text-left">
          <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-muted-foreground sm:text-[10px] sm:tracking-[0.2em] md:text-xs">
            Locations
          </p>
          <h1 className="mt-1 text-balance font-[family-name:var(--font-display)] text-base font-semibold tracking-tight text-foreground sm:mt-2 sm:text-xl md:text-2xl lg:text-[1.75rem]">
            Find a store
          </h1>
          <p className="mx-auto mt-1 max-w-xl text-pretty text-[10px] leading-snug text-muted-foreground sm:mt-2 sm:text-xs md:mx-0 md:text-sm">
            Tap a branch — map updates below. Directions open in Google Maps.
          </p>
        </header>

        {/* Cards: always side-by-side when 2+, ultra-compact on phones */}
        <div
          className={`grid min-w-0 gap-1.5 sm:gap-3 md:gap-4 ${gridCols}`}
        >
          <AnimatePresence mode="popLayout">
            {locations.map((loc, idx) => {
              const isActive = selected === idx;
              const dir = directionsHref(loc, coordsList[idx]);
              return (
                <motion.article
                  key={`${loc.name}-${idx}`}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.18, delay: idx * 0.03 }}
                  onClick={() => setSelected(idx)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelected(idx);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-pressed={isActive}
                  className={`group relative min-w-0 cursor-pointer rounded-lg border bg-card text-left shadow-sm transition-[box-shadow,border-color,background-color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background sm:rounded-xl md:rounded-2xl ${
                    isActive
                      ? "border-foreground/25 ring-1 ring-foreground/15"
                      : "border-border hover:border-foreground/15 hover:bg-muted/30"
                  }`}
                >
                  <div className="flex h-full flex-col p-2 sm:p-4 md:p-5">
                    <div className="flex items-start gap-1.5 sm:gap-3">
                      <span
                        className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded text-[8px] font-semibold tabular-nums sm:h-7 sm:w-7 sm:rounded-md sm:text-[10px] md:h-8 md:w-8 md:text-xs ${
                          isActive
                            ? "bg-foreground text-background"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h2 className="font-[family-name:var(--font-display)] text-[10px] font-semibold leading-tight text-foreground line-clamp-2 sm:text-sm md:text-base">
                          {loc.name}
                        </h2>
                        <a
                          href={`tel:${String(loc.phone).replace(/\s/g, "")}`}
                          onClick={(e) => e.stopPropagation()}
                          className="mt-0.5 inline-flex min-w-0 max-w-full items-center gap-0.5 text-[9px] text-muted-foreground transition-colors hover:text-foreground sm:mt-1.5 sm:gap-1 sm:text-xs"
                        >
                          <Phone
                            className="h-2.5 w-2.5 shrink-0 sm:h-3.5 sm:w-3.5"
                            aria-hidden
                          />
                          <span className="truncate">{loc.phone}</span>
                        </a>
                        <p className="mt-0.5 line-clamp-2 text-[8px] leading-snug text-muted-foreground sm:mt-2 sm:line-clamp-3 sm:text-[11px] sm:leading-relaxed md:text-xs">
                          {loc.address}
                        </p>
                      </div>
                    </div>
                    {dir && (
                      <a
                        href={dir}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="mt-1.5 inline-flex w-fit items-center gap-0.5 text-[8px] font-medium uppercase tracking-wide text-foreground underline decoration-foreground/25 underline-offset-2 transition-colors hover:decoration-foreground/50 sm:mt-3 sm:gap-1 sm:text-[10px] md:text-xs"
                      >
                        <span className="sm:hidden">Maps</span>
                        <span className="hidden sm:inline">Directions</span>
                        <ArrowUpRight
                          className="h-2.5 w-2.5 sm:h-3 sm:w-3"
                          aria-hidden
                        />
                      </a>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Map below cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mt-2 overflow-hidden rounded-lg border border-border bg-muted shadow-sm sm:mt-3 md:mt-5 md:rounded-xl"
        >
          {activeLoc && (
            <div className="flex items-center justify-between gap-2 border-b border-border bg-background/95 px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2">
              <p className="min-w-0 truncate text-[9px] font-medium text-foreground sm:text-xs md:text-sm">
                <span className="text-muted-foreground">Selected · </span>
                {activeLoc.name}
              </p>
              {directionsHref(activeLoc, activeCoord) && (
                <a
                  href={directionsHref(activeLoc, activeCoord)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex shrink-0 items-center gap-0.5 text-[8px] font-semibold uppercase tracking-wide text-foreground hover:underline sm:text-[10px] md:text-xs"
                >
                  Open
                  <ArrowUpRight className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                </a>
              )}
            </div>
          )}
          <MapContainer
            center={coordsList[selected] || [23.7945, 90.3435]}
            zoom={13}
            scrollWheelZoom={true}
            className="z-[400] h-[200px] w-full sm:h-[280px] md:h-[340px] lg:h-[400px]"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
            />
            {coordsList.map((coord, idx) => (
              <Marker
                key={`m-${idx}`}
                position={coord}
                eventHandlers={{
                  click: () => setSelected(idx),
                }}
              >
                <Popup>
                  <div className="min-w-[160px] max-w-[220px] pr-1 text-[11px] leading-snug text-card-foreground sm:min-w-[200px] sm:text-sm">
                    <p className="font-[family-name:var(--font-display)] font-semibold">
                      {locations[idx].name}
                    </p>
                    <p className="mt-0.5 text-muted-foreground">
                      {locations[idx].address}
                    </p>
                    <p className="mt-1.5 flex items-center gap-1 text-muted-foreground">
                      <Phone className="h-3 w-3 shrink-0" />
                      {locations[idx].phone}
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
            <MapPanner coords={coordsList[selected]} />
          </MapContainer>
        </motion.div>
      </div>
    </section>
  );
}
