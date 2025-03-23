
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";

// Pages
import Index from "@/pages/Index";
import ProductList from "@/pages/ProductList";
import ProductDetail from "@/pages/ProductDetail";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Cart from "@/pages/Cart";
import Profile from "@/pages/Profile";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/productos" element={<ProductList />} />
              <Route path="/categoria/:categorySlug" element={<ProductList />} />
              <Route path="/search" element={<ProductList />} />
              <Route path="/producto/:productId" element={<ProductDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Register />} />
              <Route path="/carrito" element={<Cart />} />
              <Route path="/perfil" element={<Profile />} />
              <Route path="/admin" element={<Admin />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
