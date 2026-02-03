import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductMounjaro from "./pages/ProductMounjaro";
import Checkout from "./pages/Checkout";
import Upsell1 from "./pages/Upsell1";
import Upsell2 from "./pages/Upsell2";
import Upsell3 from "./pages/Upsell3";
import Upsell4 from "./pages/Upsell4";
import Upsell5 from "./pages/Upsell5";
import PixPayment from "./pages/PixPayment";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProductMounjaro />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/pix" element={<PixPayment />} />
          <Route path="/up1" element={<Upsell1 />} />
          <Route path="/up2" element={<Upsell2 />} />
          <Route path="/up3" element={<Upsell3 />} />
          <Route path="/up4" element={<Upsell4 />} />
          <Route path="/up5" element={<Upsell5 />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
