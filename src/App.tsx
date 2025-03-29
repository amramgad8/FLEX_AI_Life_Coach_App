
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TaskHub from "./pages/FlowTasks";
import Dashboard from "./pages/Dashboard";
import AIPlanner from "./pages/AIPlanner";
import Blog from "./pages/Blog";
import Focus from "./pages/Focus";
import Settings from "./pages/Settings";
import About from "./pages/About";
import Onboarding from "./pages/Onboarding";
import EisenhowerMatrixView from "./pages/EisenhowerMatrixView";
import Goals from "./pages/Goals";
import FAQ from "./pages/FAQ";
import HelpCenter from "./pages/HelpCenter";
import Community from "./pages/Community";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/todo" element={<TaskHub />} />
            <Route path="/flow-tasks" element={<TaskHub />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/ai-planner" element={<AIPlanner />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/focus" element={<Focus />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/about" element={<About />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/eisenhower" element={<EisenhowerMatrixView />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/help-center" element={<HelpCenter />} />
            <Route path="/community" element={<Community />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;