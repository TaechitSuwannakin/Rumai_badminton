import React from "react";
import { useAppSelector } from "../app/hooks";
import RacketCard from "./RacketCard"; // ✅ 1. เพิ่มบรรทัดนี้: นำเข้าการ์ดตัวเทพของเรา

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
        // ✅ 2. เปลี่ยนมาใช้ RacketCard แทน div ยาวๆ อันเดิม
        <RacketCard key={racket.id} racket={racket} />
      ))}
    </section>
  );
};

export default RacketResultSection;