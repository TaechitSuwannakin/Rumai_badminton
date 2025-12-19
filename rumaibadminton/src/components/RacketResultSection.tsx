import React from "react";
import { useAppSelector } from "../app/hooks";

const RacketResultSection: React.FC = () => {
  const rackets = useAppSelector(
    (state) => state.racket.recommendedRackets
  );

  if (rackets.length === 0) {
    return (
      <section id="racket-results" className="text-center text-sm text-slate-500">
        ยังไม่มีผลลัพธ์ กรุณาเลือกสไตล์แล้วกดค้นหา
      </section>
    );
  }

  return (
    <section
      id="racket-results"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10"
    >
      {rackets.map((racket) => (
        <div
          key={racket.id}
          className="rounded-3xl border border-slate-100 bg-white shadow-sm p-4 space-y-3"
        >
          <img
            src={racket.image_url ?? "/fallback.png"}
            alt={racket.model_name}
            className="h-40 mx-auto object-contain"
          />

          <div className="space-y-1">
            <h3 className="font-semibold text-sm">
              {racket.brand} {racket.model_name}
            </h3>
            <p className="text-xs text-slate-600">
              {racket.description ?? "ไม่มีคำอธิบาย"}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-[11px]">
            <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700">
              {racket.style_tag}
            </span>
            <span className="px-2 py-1 rounded-full bg-slate-50">
              {racket.balance_tag}
            </span>
            <span className="px-2 py-1 rounded-full bg-slate-50">
              {racket.flex}
            </span>
          </div>

          <div className="text-sm font-medium">
            ฿ {racket.price.toLocaleString()}
          </div>
        </div>
      ))}
    </section>
  );
};

export default RacketResultSection;
