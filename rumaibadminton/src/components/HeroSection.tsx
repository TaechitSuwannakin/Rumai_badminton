import React from "react";
import { useAppSelector } from "../app/hooks";

const HeroSection: React.FC = () => {
  const previewRacket = useAppSelector((state) => state.racket.recommendedRackets[0]);

  const defaultPreview = {
    brand: "Astro",
    model_name: "Force 9000",
    details: "(Even · Medium)",
    description: "เหมาะกับผู้เล่นที่ชอบเปิดเกมเร็ว ตีโต้ไว แต่ยังต้องการคุมหน้าเน็ตได้ดี",
    tags: ["All-round / Fast attack", "Even balance", "งบ 2,000–3,000"],
  };

  const displayData = previewRacket
    ? {
        brand: previewRacket.brand,
        model_name: previewRacket.model_name,
        details: `(${previewRacket.balance_tag.split(" ")[0]} · ${previewRacket.flex})`,
        description: previewRacket.description,
        tags: [ `${previewRacket.style_tag} / ${previewRacket.flex}`,   previewRacket.balance_tag,
          `งบ ${previewRacket.price.toLocaleString()} ฿`,
        ],
      }
    : defaultPreview;

  return (
    <div className="space-y-5">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-emerald-100 shadow-sm">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
        <span className="text-[11px] font-medium text-emerald-700">
          เพิ่มตัวเลือกเพื่อให้คุณมีตัวเลือกที่หลากหลาย
        </span>
      </div>

      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight leading-tight">
          เลือกไม้แบดที่เหมาะกับ
          <span className="text-emerald-600">สไตล์การเล่น</span>ของคุณ
        </h1>

        <p className="text-sm text-slate-600 max-w-xl">  เลือกเลยว่าคุณชอบสายไหน - บุกไว บุกหนัก คุมเกม all around <br />
          แล้วเราจะทำหน้าที่เลือกไม้ให้คุณเอง
        </p>
        </div>

        <li className="text-slate-900 "> ตัวเลขหน้าตัว U ยิ่งมาก ไม้ยิ่ง "เบา" </li>
        <div className="text-sm text-slate-800 max-w-xl ">
          <p><span className="text-black font-bold">3U</span> :	85 - 89g เหมาะกับสายรุก ตบหนัก ลูกพุ่งแรง เหมาะกับผู้เล่นที่มีแรงแขนดี เน้นเล่นประเภทเดี่ยว </p>
          <p><span className="text-black font-bold">4U</span> :	80 - 84g เหมาะกับสายคุมเกม เน้นความคล่องตัว เล่นได้ทั้งเดี่ยวและคู่ </p>
          <p><span className="text-black font-bold">5U</span> :	75 - 79g เหมาะกับสายตีชิล เน้นความคล่องตัวสูงสุด เล่นคู่สบายๆ ไม่เน้นบุกหนัก </p>  
      </div>
       <li className="text-slate-900 "> ความแข็งของก้าน (Shaft Stiffness) </li>
        <div className="text-sm text-slate-600 max-w-xl ">
          <p><span className="text-black font-bold"> ก้านอ่อน (Flexible):</span> มีสปริงช่วยส่งแรง ตีสบาย ไม่กินแรง แต่คอนโทรลทิศทางลูกยากเล็กน้อย <span className="text-red-500">เหมาะกับมือใหม่</span></p>
          <p> <span className="text-black font-bold">ก้านแข็ง (Stiff):</span> ได้หน้าไม้ที่นิ่งและตอบสนองตามข้อมือทันที คอนโทรลทิศทางลูกได้แม่นยำมาก ตบลูกได้จิกและแรง แต่"กินแรง" สุดๆ ถ้าข้อมือไม่แข็งพอจะตีลูกไม่ไป <span className="text-red-500">เหมาะสำหรับ มือกลางๆขึ้นไป</span></p>
      </div>
    </div>
  );
};

export default HeroSection;
