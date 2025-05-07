import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CausesPage from "./pages/CausesPage";
import CauseDetail from "./pages/CauseDetail";
import DonatePage from "./pages/DonatePage";
import Dashboard from "./pages/Dashboard";
import AboutPage from "./pages/AboutPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster position="top-right" />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/causes" element={<CausesPage />} />
        <Route path="/cause/:id" element={<CauseDetail />} />
        <Route path="/donate" element={<DonatePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
