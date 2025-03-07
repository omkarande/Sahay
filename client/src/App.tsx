import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PathwayGenerator from "./pages/PathwayGenerator";
import Profile from "./pages/profile";
import Research from "./pages/GamifiedLearning";;
import JobSearch from "./pages/JobSearch";
import Community from "./pages/Community";
import SignupPage from "./pages/signnnup";
import Testmonial from "./pages/Testimonials";
import LoginPage from "./pages/loginpage";
import SkillAssessmentPage from "./pages/SkillAssessment";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="/PathwayGenerator" element={<PathwayGenerator />} />
          <Route path="/GamifiedLearning" element={<Research />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/JobSearch" element={<JobSearch />} />
          <Route path="/Community" element={<Community />} />
          <Route path="/signnnup" element={<SignupPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/Testimonials" element={<Testmonial/>} />
          <Route path="/loginpage" element={<LoginPage/>} />
          <Route path="/Assessment" element={<SkillAssessmentPage />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
