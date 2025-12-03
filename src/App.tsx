import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateCelebration from "./pages/CreateCelebration";
import Celebration from "./pages/Celebration";
import CelebrationWall from "./pages/CelebrationWall";
import CelebrationAddMessage from "./pages/CelebrationAddMessage";
import CelebrationAdmin from "./pages/CelebrationAdmin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CreateCelebration />} />
          <Route path="/c/:slug" element={<Celebration />} />
          <Route path="/c/:slug/wall" element={<CelebrationWall />} />
          <Route path="/c/:slug/add" element={<CelebrationAddMessage />} />
          <Route path="/c/:slug/admin" element={<CelebrationAdmin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
