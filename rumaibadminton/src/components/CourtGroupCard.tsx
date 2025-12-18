import React, { useRef } from "react";
import { MapContainer, TileLayer, CircleMarker, useMapEvent } from "react-leaflet";
import type { Map as LeafletMap } from "leaflet";

export type GroupType = "มือใหม่" | "มือกลาง" | "มือโปร" | "ตีชิล";

type CourtGroupCardProps = {
  courtName: string;
  lat: number;
  lng: number;

  groupType: GroupType;
  levelText?: string;
  note?: string;

  playersMax: number;

  timeRange: string;
  priceText: string;

  lineGroupUrl: string;
  onJoin?: () => void;
};

function badgeClass(type: GroupType) {
  switch (type) {
    case "มือใหม่":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "มือกลาง":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "มือโปร":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "ตีชิล":
      return "bg-slate-50 text-slate-700 border-slate-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
}

// ช่วยแก้อาการ tile โชว์ไม่เต็มในบาง layout
function FixLeafletSize() {
  useMapEvent("load", (map) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        map.invalidateSize();
      });
    });
  });
  return null;
}

const CourtGroupCard: React.FC<CourtGroupCardProps> = ({
  courtName,
  lat,
  lng,
  groupType,
  levelText,
  note,
  playersMax,
  timeRange,
  priceText,
  lineGroupUrl,
  onJoin,
}) => {
  const mapRef = useRef<LeafletMap | null>(null);

  const mapsUrl = "https://maps.app.goo.gl/NYit6tz3oXGoBkQy8";
  const openGoogleMaps = () => {
    window.open(mapsUrl, "_blank", "noopener,noreferrer");
  };

  const openLineGroup = () => {
    window.open(lineGroupUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="relative group w-full max-w-[320px]">
      {/* Glow */}
      <div className="absolute -inset-1 rounded-[24px] bg-gradient-to-br from-emerald-400/40 via-teal-300/30 to-blue-400/40 blur-xl opacity-70 group-hover:opacity-100 transition duration-500" />

      <div className="relative rounded-[24px] border border-white/60 bg-white/80 backdrop-blur-2xl shadow-xl overflow-hidden">
        {/* MAP (แผนที่จริง + กดได้) */}
        <div
          className="relative w-full min-h-[96px] h-[96px] overflow-hidden cursor-pointer bg-slate-200"
          onClick={openGoogleMaps}
          title="คลิกเพื่อเปิดใน Google Maps"
        >
          <MapContainer
            key={`${lat},${lng}`}
            center={[lat, lng]}
            zoom={15}
            className="absolute inset-0 leaflet-map"
            zoomControl={false}
            attributionControl={false}
            dragging={false}
            scrollWheelZoom={false}
            doubleClickZoom={false}
            touchZoom={false}
            keyboard={false}
            whenReady={() => {
              // typings ของทอย: whenReady ต้องเป็น () => void
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  mapRef.current?.invalidateSize();
                });
              });
            }}
            ref={(instance) => {
              // รองรับหลายเวอร์ชัน: บางทีเป็น map ตรง ๆ / บางทีเป็น { leafletElement }
              // @ts-expect-error - รองรับหลายเวอร์ชันของ react-leaflet
              mapRef.current = instance?.leafletElement ?? instance ?? null;
            }}
          >
            <FixLeafletSize />
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <CircleMarker center={[lat, lng]} radius={6} />
          </MapContainer>

          {/* overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent pointer-events-none" />

          {/* hint */}
          <div className="absolute top-2 right-2 pointer-events-none text-white text-[10px] bg-black/40 px-2 py-1 rounded-lg">
            🗺️ เปิดแผนที่
          </div>
        </div>

        {/* BODY */}
        <div className="p-4 space-y-3">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
              ก๊วนแบดมินตัน
            </p>

            <h2 className="text-sm font-extrabold text-slate-800 truncate">
              {courtName}
            </h2>

            <div className="flex flex-wrap gap-2 pt-2">
              <span
                className={`text-[10px] font-bold px-2 py-1 rounded-lg border ${badgeClass(
                  groupType
                )}`}
              >
                🏸 {groupType}
              </span>

              {levelText ? (
                <span className="text-[10px] font-semibold px-2 py-1 rounded-lg border bg-white text-slate-700 border-slate-200">
                  {levelText}
                </span>
              ) : null}

              <span className="text-[10px] font-semibold px-2 py-1 rounded-lg border bg-white text-slate-700 border-slate-200">
                รับทั้งหมด {playersMax} คน
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-base">🕒</span>
              <div>
                <p className="text-[10px] text-slate-400 leading-none">เวลา</p>
                <p className="text-xs font-semibold text-slate-700">
                  {timeRange || "-"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-base">💰</span>
              <div>
                <p className="text-[10px] text-slate-400 leading-none">ค่าสนาม</p>
                <p className="text-xs font-semibold text-slate-700">
                  {priceText || "-"}
                </p>
              </div>
            </div>
          </div>

          {note ? (
            <p className="text-xs text-slate-600 italic">“{note}”</p>
          ) : null}

          <div className="flex gap-2 pt-1">
            <button
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 rounded-lg transition-colors shadow-md shadow-emerald-200"
              onClick={() => {
                if (onJoin) onJoin();
                openLineGroup();
              }}> ขอจอยก๊วน
            </button>

            <button
              onClick={openGoogleMaps}
              className="px-3 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              aria-label="open map"
              title="เปิดใน Google Maps"
            >
              🗺️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourtGroupCard;
