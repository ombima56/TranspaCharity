import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CausesPage from "./pages/CausesPage";
import CauseDetail from "./pages/CauseDetail";
import AboutPage from "./pages/AboutPage";
import NotFound from "./pages/NotFound";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/causes" element={<CausesPage />} />
      <Route path="/cause/:id" element={<CauseDetail />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
