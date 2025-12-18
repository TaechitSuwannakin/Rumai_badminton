import React from 'react';
import { useAppSelector } from '../app/hooks';


const HeroSection: React.FC = () => {
  const previewRacket = useAppSelector(state => state.racket.recommendedRackets[0]);


  const defaultPreview = {
    brand: 'Astro',
    model_name: 'Force 9000',
    details: '(Even · Medium)',
    description: 'เหมาะกับผู้เล่นที่ชอบเปิดเกมเร็ว ตีโต้ไว แต่ยังต้องการคุมหน้าเน็ตได้ดี',
    tags: ['All-round / Fast attack', 'Even balance', 'งบ 2,000–3,000'],
  };

  const displayData = previewRacket ? {
    brand: previewRacket.brand,
    model_name: previewRacket.model_name,
    details: `(${previewRacket.balance_tag.split(' ')[0]} · ${previewRacket.flex})`,
    description: previewRacket.description,
    tags: [
      `${previewRacket.style_tag} / ${previewRacket.flex}`,
      previewRacket.balance_tag,
      `งบ ${previewRacket.price.toLocaleString()} ฿`
    ],
  } : defaultPreview;


  return (
    <section className="grid grid-cols-1 md:grid-cols-[1.3fr,1fr] gap-10 items-center">


      <div className="space-y-5">
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-emerald-100 shadow-sm" >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
          <span className="text-[11px] font-medium text-emerald-700">เพิ่มตัวเลือกเพื่อให้คุณมีตัวเลือกที่หลากหลาาย </span>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight leading-tight">
            เลือกไม้แบดที่เหมาะกับ
            <span className="text-emerald-600">สไตล์การเล่น</span>ของคุณ </h1>
          <p className="text-sm text-slate-600 max-w-xl">
            เลือกเลยว่าคุณชอบสายไหน - บุกไว บุกหนัก คุมเกม all around <br /> แล้วเราจะทำหน้าที่เลือกไม้ให้คุณเอง
          </p>
        </div>
      </div>

      <div className="relative flex justify-center">
        <div className="rounded-3xl bg-white/60 backdrop-blur-xl border border-white shadow-xl p-6">
          <img
            src="/hero-racket.png"
            alt="Badminton Racket"
            className="w-72 drop-shadow-xl"
          />
        </div>
      </div>


    </section>
  );
};

export default HeroSection;