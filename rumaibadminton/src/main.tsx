import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx'; 

// 1. หา Root Element ใน HTML (ต้องมี <div id="root"></div> ใน index.html)
const rootElement = document.getElementById('root'); 

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode> 
      <App />
    </React.StrictMode>
  );
} else {
    console.error("Failed to find the root element with ID 'root'."); 
}