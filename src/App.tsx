import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CausesPage from "./pages/CausesPage";
import CauseDetail from "./pages/CauseDetail";
import DonatePage from "./pages/DonatePage";
import Dashboard from "./pages/Dashboard";
import AboutPage from "./pages/AboutPage";
import NotFound from "./pages/NotFound";
import Web3Provider from "./components/Web3Provider";
import TransactionsPage from "./pages/TransactionsPage";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import { useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Log the API URL to verify it's correct in production
    console.log("Environment:", import.meta.env.MODE);
    console.log("API URL from env:", import.meta.env.VITE_API_URL);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Web3Provider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/causes" element={<CausesPage />} />
              <Route path="/cause/:id" element={<CauseDetail />} />
              <Route path="/donate" element={<DonatePage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/transactions" element={<TransactionsPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </Web3Provider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
