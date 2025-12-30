import React from "react";
import { useAppSelector } from "../app/hooks";
import RacketCard from "./RacketCard"; 

const RacketResultSection: React.FC = () => {
  //ดึง state ข้อมูล, สถานะโหลด, และ error ก่อน
  const { recommendedRackets, isLoading, error } = useAppSelector(
    (state) => state.racket
  );

  //กรณีที่ Error
  if (error) {
    return (
      <section className="mt-10 p-6 text-center rounded-2xl bg-red-50 border border-red-100 text-red-600">
        <p>เกิดข้อผิดพลาด: {error}</p>
        <p className="text-sm mt-1">ลองกดค้นหาใหม่อีกครั้ง</p>
      </section>
    );
  }

  //กรณีหน้าสถานะรอ Loading 
  if (isLoading) {
    return (
      <section className="mt-10 text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-emerald-500 mb-2"></div>
        <p className="text-slate-500 text-sm">กำลังเฟ้นหาไม้สำหรับคุณ...</p>
      </section>
    );
  }

  //ทำกรณีไม่มีข้อมูล (ยังไม่ค้นหา หรือ หาไม่เจอ)
  if (!recommendedRackets || recommendedRackets.length === 0) {
    return (
      <section className="mt-10 text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
        <p className="text-slate-500 text-lg">ไม่พบไม้แบดที่ตรงกับเงื่อนไขนี้ </p>
        <p className="text-slate-400 text-sm mt-2">ลองเปลี่ยนงบประมาณ หรือสไตล์การเล่นดู</p>
      </section>
    );
  }

  //ทำแสดงผลลัพธ์
  return (
    <section id="racket-results" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8" >
      {recommendedRackets.map((racket) => (
        <RacketCard key={racket.id} racket={racket} />
      ))}
    </section>
  );
};

export default RacketResultSection;