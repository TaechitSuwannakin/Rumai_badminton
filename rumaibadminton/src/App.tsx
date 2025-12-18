import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { useAppDispatch } from './app/hooks';
import { setInitialRackets } from './features/racket/racketSlice';

import Header from './components/Header';
import HeroSection from './components/HeroSection'; 
import RacketSelectorForm from './components/RacketSelectorForm';
import RacketResultSection from './components/RacketResultSection';

// Component สำหรับ Initial Load
const InitialLoader: React.FC = () => {
    const dispatch = useAppDispatch();
    
    // Dispatch initial mock data when the app mounts
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
            <main className="max-w-5xl mx-auto px-4 py-10 space-y-10">
                <HeroSection/>
                <RacketSelectorForm />
                <RacketResultSection />
            </main>
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