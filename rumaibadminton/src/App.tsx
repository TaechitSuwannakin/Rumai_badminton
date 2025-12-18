import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { useAppDispatch } from './app/hooks';
import { setInitialRackets } from './features/racket/racketSlice';

import Header from './components/Header';
import HeroSection from './components/HeroSection';
import RacketSelectorForm from './components/RacketSelectorForm';
import RacketResultSection from './components/RacketResultSection';
import CourtGroupCard from './components/CourtGroupCard';

const InitialLoader: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setInitialRackets());
  }, [dispatch]);

  return null;
}


const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-slate-50 to-white text-slate-900">
      <InitialLoader />
      <Header />
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
              timeRange="17:00 - 24:00"
              priceText="ค่าสนาม 70บาท-เกมละ 20บาท"
              note="เล่นขำๆ เน้นออกกำลังกาย มีลูกให้" 
              lineGroupUrl="https://line.me/ti/g2/nuV0PfV78IdtpHWYl-SZD-WXs1A3fCBLIbjIGA?utm_source=invitation&utm_medium=link_copy&utm_campaign=default"/>
          </div>

        </div>
      </section>
      <RacketSelectorForm />
      <RacketResultSection />

    </div>
  )
}

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;