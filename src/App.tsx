
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import FlowTasks from "./pages/FlowTasks";
import Dashboard from "./pages/Dashboard";
import AIPlanner from "./pages/AIPlanner";
import Blog from "./pages/Blog";
import Focus from "./pages/Focus";
import Settings from "./pages/Settings";
import About from "./pages/About";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/todo" element={<FlowTasks />} />
          <Route path="/flow-tasks" element={<FlowTasks />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ai-planner" element={<AIPlanner />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/focus" element={<Focus />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/about" element={<About />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
