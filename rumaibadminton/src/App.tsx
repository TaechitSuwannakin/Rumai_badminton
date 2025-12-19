import React from "react";
import { Provider } from "react-redux";
import { store } from "./app/store";

import Header from "./components/Header";
import Body from "./components/Body";


const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-slate-50 to-white text-slate-900">
      <Header />
      <Body />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;
