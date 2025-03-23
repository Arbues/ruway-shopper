
import { useState, useEffect } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { 
  Package, 
  Tag, 
  Settings, 
  Users, 
  ShoppingCart, 
  QrCode,
  Plus,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { fadeIn } from "@/utils/animations";

// Componentes para pestañas de Administración
import AdminProducts from "@/components/admin/AdminProducts";
import AdminCategories from "@/components/admin/AdminCategories";
import AdminSettings from "@/components/admin/AdminSettings";
import AdminCustomers from "@/components/admin/AdminCustomers";
import AdminOrders from "@/components/admin/AdminOrders";
import AdminPayments from "@/components/admin/AdminPayments";

const Admin = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("products");

  // Redirigir si no es administrador
  if (!isAuthenticated || !user?.isAdmin) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-infinitywits-cream">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container-custom">
          <div className={fadeIn({ direction: 'down' })}>
            <h1 className="text-3xl font-bold text-infinitywits-navy mb-2">
              Panel de Administración
            </h1>
            <p className="text-ruway-gray mb-6">
              Gestiona productos, categorías y configuraciones del sistema
            </p>
          </div>

          <Tabs 
            defaultValue="products" 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className={fadeIn({ direction: 'up' })}
          >
            <div className="bg-white shadow-sm rounded-xl p-1 mb-8">
              <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full bg-gray-100 rounded-lg">
                <TabsTrigger value="products" className="rounded-md">
                  <Package className="w-4 h-4 mr-2 hidden md:inline" />
                  Productos
                </TabsTrigger>
                <TabsTrigger value="categories" className="rounded-md">
                  <Tag className="w-4 h-4 mr-2 hidden md:inline" />
                  Categorías
                </TabsTrigger>
                <TabsTrigger value="orders" className="rounded-md">
                  <ShoppingCart className="w-4 h-4 mr-2 hidden md:inline" />
                  Pedidos
                </TabsTrigger>
                <TabsTrigger value="customers" className="rounded-md">
                  <Users className="w-4 h-4 mr-2 hidden md:inline" />
                  Clientes
                </TabsTrigger>
                <TabsTrigger value="payments" className="rounded-md">
                  <QrCode className="w-4 h-4 mr-2 hidden md:inline" />
                  Pagos
                </TabsTrigger>
                <TabsTrigger value="settings" className="rounded-md">
                  <Settings className="w-4 h-4 mr-2 hidden md:inline" />
                  Ajustes
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="products">
              <AdminProducts />
            </TabsContent>
            
            <TabsContent value="categories">
              <AdminCategories />
            </TabsContent>
            
            <TabsContent value="orders">
              <AdminOrders />
            </TabsContent>
            
            <TabsContent value="customers">
              <AdminCustomers />
            </TabsContent>
            
            <TabsContent value="payments">
              <AdminPayments />
            </TabsContent>
            
            <TabsContent value="settings">
              <AdminSettings />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Admin;
