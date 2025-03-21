
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { User, PackageCheck, LogOut, Settings, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { fadeIn } from "@/utils/animations";

const Profile = () => {
  const { user, isAuthenticated, logout } = useAuth();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Mock personal information form
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would update the user profile
    alert("Perfil actualizado exitosamente");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container-custom">
          <div className={fadeIn({ direction: 'down' })}>
            <h1 className="text-3xl font-bold text-ruway-secondary mb-2">
              Mi Cuenta
            </h1>
            <p className="text-ruway-gray mb-6">
              Administra tu información y pedidos
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className={fadeIn({ direction: 'right' })}>
              <Card className="border-gray-200 sticky top-24">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-ruway-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-ruway-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{user?.name}</CardTitle>
                      <CardDescription className="text-xs mt-1">{user?.email}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-4 space-y-1">
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link to="/perfil">
                      <UserCheck className="mr-2 h-4 w-4" />
                      Información Personal
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link to="/pedidos">
                      <PackageCheck className="mr-2 h-4 w-4" />
                      Mis Pedidos
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link to="/configuracion">
                      <Settings className="mr-2 h-4 w-4" />
                      Configuración
                    </Link>
                  </Button>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button 
                    variant="outline" 
                    className="w-full text-ruway-gray"
                    onClick={logout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar Sesión
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <Tabs defaultValue="personal" className={fadeIn({ direction: 'left' })}>
                <TabsList className="mb-6">
                  <TabsTrigger value="personal">Información Personal</TabsTrigger>
                  <TabsTrigger value="shipping">Direcciones de Envío</TabsTrigger>
                  <TabsTrigger value="payment">Métodos de Pago</TabsTrigger>
                </TabsList>
                
                <TabsContent value="personal">
                  <Card className="border-gray-200">
                    <CardHeader>
                      <CardTitle>Información Personal</CardTitle>
                      <CardDescription>
                        Actualiza tu información de perfil
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="name">Nombre Completo</Label>
                            <Input
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              placeholder="Tu nombre completo"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Correo Electrónico</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="tu@email.com"
                              disabled
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Teléfono</Label>
                            <Input
                              id="phone"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              placeholder="987654321"
                            />
                          </div>
                          <div className="md:col-span-2 space-y-2">
                            <Label htmlFor="address">Dirección</Label>
                            <Input
                              id="address"
                              name="address"
                              value={formData.address}
                              onChange={handleInputChange}
                              placeholder="Tu dirección"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="city">Ciudad</Label>
                            <Input
                              id="city"
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              placeholder="Tu ciudad"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="postalCode">Código Postal</Label>
                            <Input
                              id="postalCode"
                              name="postalCode"
                              value={formData.postalCode}
                              onChange={handleInputChange}
                              placeholder="15000"
                            />
                          </div>
                        </div>
                        
                        <Separator className="my-6" />
                        
                        <div className="flex justify-end">
                          <Button type="submit">
                            Guardar Cambios
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="shipping">
                  <Card className="border-gray-200">
                    <CardHeader>
                      <CardTitle>Direcciones de Envío</CardTitle>
                      <CardDescription>
                        Administra tus direcciones de envío
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-ruway-light rounded-lg p-4 border border-ruway-light">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-ruway-secondary">Dirección Principal</h3>
                            <p className="text-ruway-gray text-sm mt-1">
                              No hay dirección guardada
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            Agregar Dirección
                          </Button>
                        </div>
                      </div>
                      
                      <p className="text-sm text-ruway-gray">
                        Aún no has agregado direcciones de envío a tu cuenta.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="payment">
                  <Card className="border-gray-200">
                    <CardHeader>
                      <CardTitle>Métodos de Pago</CardTitle>
                      <CardDescription>
                        Administra tus métodos de pago
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-ruway-light rounded-lg p-4 border border-ruway-light">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-ruway-secondary">Métodos de Pago</h3>
                            <p className="text-ruway-gray text-sm mt-1">
                              No hay métodos de pago guardados
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            Agregar Método de Pago
                          </Button>
                        </div>
                      </div>
                      
                      <p className="text-sm text-ruway-gray">
                        Por seguridad, los métodos de pago se gestionan durante el proceso de checkout.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
