import React from "react";
import HeroSection from "./HeroSection";
import RacketSelectorForm from "./RacketSelectorForm";
import RacketResultSection from "./RacketResultSection";
import CourtGroupCard from "./CourtGroupCard";

const Body: React.FC = () => {
  return (
    <>
      {/* HERO + CARD */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr,1fr] gap-10 lg:gap-12 items-start">
          <HeroSection />

          <div className="w-full lg:justify-self-end lg:max-w-sm">
            <CourtGroupCard
              courtName="Everyday badminton"
              lat={13.860289389496884}
              lng={100.53248689971326}
              groupType="ตีชิล"
              levelText="มือหน้าบ้าน - มือหนักอึ้ง"
              playersMax={27}
              timeRange="ทุกวัน 17:00 - 24:00"
              priceText="ค่าสนาม 70บาท-เกมละ 20บาท"
              note="ตีกันน่ารัก ไม่ซีเรียส แค่รู้กติกา  มาสนุกด้วยกันครับ ลงชื่อ 12 คนแรกลุ้นจับรางวัล"
              lineGroupUrl="https://line.me/ti/g2/nuV0PfV78IdtpHWYl-SZD-WXs1A3fCBLIbjIGA?utm_source=invitation&utm_medium=link_copy&utm_campaign=default"
            />
          </div>
        </div>
      </section>

      <RacketSelectorForm />
      <RacketResultSection />
    </>
  );
};

export default Body;
