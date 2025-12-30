import React from "react";
import { useAppSelector } from "../app/hooks";

const HeroSection: React.FC = () => {
  const previewRacket = useAppSelector((state) => state.racket.recommendedRackets[0]);

  return (
    <div className="relative overflow-hidden rounded-[32px] bg-slate-50/80 border border-white p-6 sm:p-8 shadow-sm">
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-100/40 blur-[60px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-100/30 blur-[60px] rounded-full pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* --- Header --- */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold tracking-[0.2em] text-emerald-700/60 uppercase">DEMO Racket Guide </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-tight">
            เลือกไม้แบดที่เหมาะกับ <span className="text-emerald-600">สไตล์การเล่น</span>ของคุณ
          </h1>
          <p className="text-xs text-slate-500 max-w-lg">
            เลือกสายและแนวที่ชอบ แล้วเราจะทำหน้าที่เลือกไม้ให้คุณเอง ให้เป็น 1 ในตัวเลือกที่เหมาะกับคุณที่สุด!
          </p>
        </div>

        {/* --- ข้อมูลน้ำหนัก (Weight) --- */}
        <div className="bg-white/60 backdrop-blur-sm border border-white/80 p-5 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">ตัวเลขหน้า U ยิ่งมาก ไม้ยิ่ง "เบา"</h3>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { u: "3U", w: "85-89g", t: "สายรุก", d: "ตบหนัก ลูกพุ่งแรง เหมาะกับคนแรงแขนดี เน้นเล่นเดี่ยว แต่หนักมากกก" },
              { u: "4U", w: "80-84g", t: "สายคุมเกม", d: "เน้นความคล่องตัว ตบตัดหยอด ทำได้หมด เล่นได้ทั้งเดี่ยวและคู่" },
              { u: "5U", w: "75-79g", t: "สายตีชิล", d: "ความคล่องตัวสูงสุด เล่นคู่สบายๆ ไม่เน้นบุกหนัก" },
            ].map((item) => (
              <div key={item.u} className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-emerald-600">{item.u}</span>
                  <span className="text-[11px] font-bold text-slate-400">{item.w}</span>
                </div>
                <p className="text-[12px] font-bold text-slate-700">{item.t}</p>
                <p className="text-[11px] leading-relaxed text-slate-500">{item.d}</p>
              </div>
            ))}
          </div>
        </div>

        {/* --- ความแข็งของก้าน (Stiffness) --- */}
        <div className="bg-white/60 backdrop-blur-sm border border-white/80 p-5 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">ความแข็งของก้าน (Shaft Stiffness)</h3>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-[13px] font-bold text-slate-800">ก้านอ่อน (Flexible)</p>
              <p className="text-[12px] leading-relaxed text-slate-600">
                มีสปริงช่วยส่งแรง ตีสบาย ไม่กินแรง แต่คอนโทรลทิศทางยากเล็กน้อย 
                <span className="ml-1 text-red-500 font-bold underline decoration-emerald-200 underline-offset-2">เหมาะกับมือใหม่และทั่วไป</span>
              </p>
            </div>
            <div className="space-y-1 border-l sm:pl-6 border-slate-100">
              <p className="text-[13px] font-bold text-slate-800">ก้านแข็ง (Stiff)</p>
              <p className="text-[12px] leading-relaxed text-slate-600">
                หน้าไม้นิ่ง คอนโทรลแม่นยำ ตบจิกและแรง แต่กินแรงสุดๆ ถ้าข้อมือไม่แข็งจะตีไม่ไป 
                <span className="ml-1 text-red-500 font-bold underline decoration-red-100 underline-offset-2">เหมาะสำหรับมือกลางขึ้นไป</span>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HeroSection;