import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Force set the API URL for production
if (import.meta.env.PROD) {
  window.ENV = window.ENV || {};
  window.ENV.VITE_API_URL = "https://transpacharity-api.onrender.com/api";
}

createRoot(document.getElementById("root")!).render(<App />);
