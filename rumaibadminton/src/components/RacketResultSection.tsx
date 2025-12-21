import React from "react";
import { useAppSelector } from "../app/hooks";

const RacketResultSection: React.FC = () => {
  // ดึง state มาให้ครบ ทั้งข้อมูล, สถานะโหลด, และ error
  const { recommendedRackets, isLoading, error } = useAppSelector(
    (state) => state.racket
  );

  // 1. กรณี Error
  if (error) {
    return (
      <section className="mt-10 p-6 text-center rounded-2xl bg-red-50 border border-red-100 text-red-600">
        <p>เกิดข้อผิดพลาด: {error}</p>
        <p className="text-sm mt-1">ลองกดค้นหาใหม่อีกครั้งนะครับ</p>
      </section>
    );
  }

  // 2. กรณี Loading (ทำ Skeleton ง่ายๆ หรือข้อความบอก)
  if (isLoading) {
    return (
      <section className="mt-10 text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-emerald-500 mb-2"></div>
        <p className="text-slate-500 text-sm">กำลังเฟ้นหาไม้ที่ใช่สำหรับคุณ...</p>
      </section>
    );
  }

  // 3. กรณีไม่มีข้อมูล (ยังไม่ค้นหา หรือ หาไม่เจอ)
  if (!recommendedRackets || recommendedRackets.length === 0) {
    return (
      <section className="mt-10 text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
        <p className="text-slate-500 text-lg">ไม่พบไม้แบดที่ตรงกับเงื่อนไขนี้ </p>
        <p className="text-slate-400 text-sm mt-2">ลองเปลี่ยนงบประมาณ หรือสไตล์การเล่นดูนะครับ</p>
      </section>
    );
  }

  // 4. แสดงผลลัพธ์
  return (
    <section
      id="racket-results"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
    >
      {recommendedRackets.map((racket) => (
        <div
          key={racket.id}
          className="group relative rounded-3xl border border-slate-100 bg-white p-4 space-y-3 transition-all hover:shadow-lg hover:-translate-y-1 duration-300"
        >

          {/* รูปภาพ */}
          <div className="bg-slate-50 rounded-2xl p-4 mb-2">
            <img
                src={racket.image_url ?? "https://placehold.co/400x400?text=No+Image"} // ใช้ placeholder กันเหนียว
                alt={racket.model_name}
                className="h-40 w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{racket.brand}</p>
                    <h3 className="font-bold text-slate-800 text-base leading-tight">
                    {racket.model_name}
                    </h3>
                </div>
                <div className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                    ฿{racket.price.toLocaleString()}
                </div>
            </div>
            
            <p className="text-xs text-slate-500 line-clamp-2 min-h-[2.5em]">
              {racket.description ?? "ไม่มีคำอธิบายเพิ่มเติม"}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-50">
            <Badge text={racket.style_tag} color="blue" />
            <Badge text={racket.balance_tag} color="slate" />
            {/* เช็คก่อนว่า flex มีค่าไหม */}
            {racket.flex && <Badge text={racket.flex} color="orange" />}
          </div>

        </div>
      ))}
    </section>
  );
};

// Component ย่อยสำหรับป้าย Tag (เพื่อให้โค้ดดูสะอาดตา)
const Badge = ({ text, color }: { text: string; color: 'blue' | 'slate' | 'orange' }) => {
    const colors = {
        blue: 'bg-blue-50 text-blue-700',
        slate: 'bg-slate-100 text-slate-600',
        orange: 'bg-orange-50 text-orange-700'
    }
    return (
        <span className={`px-2 py-1 rounded-md text-[10px] font-medium ${colors[color]}`}>
            {text}
        </span>
    )
}

export default RacketResultSection;