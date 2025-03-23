
import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { User, PackageCheck, LogOut, Settings, UserCheck, Save, Phone, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { fadeIn } from "@/utils/animations";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Profile = () => {
  const {
    user,
    isAuthenticated,
    logout
  } = useAuth();

  // If not authenticated, redirect to login with current path
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: { pathname: "/perfil" } }} />;
  }

  // Form state
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    dni: user?.dni || "",
    address: "",
    city: "",
    postalCode: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load profile data
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        dni: user.dni || ""
      }));
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // For DNI and phone fields, only allow numeric input
    if (name === 'dni') {
      const numericValue = value.replace(/\D/g, '').slice(0, 8);
      setFormData(prev => ({ ...prev, [name]: numericValue }));
    } else if (name === 'phone') {
      const numericValue = value.replace(/\D/g, '').slice(0, 9);
      setFormData(prev => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!user) {
        throw new Error("Usuario no autenticado");
      }

      // Update profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          phone: formData.phone,
          dni: formData.dni,
          address: formData.address
        })
        .eq('id', user.id);

      if (error) throw error;

      // Update auth metadata if needed
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          name: formData.name,
          phone: formData.phone,
          dni: formData.dni
        }
      });

      if (metadataError) throw metadataError;

      toast.success("Perfil actualizado exitosamente");
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err instanceof Error ? err.message : "Error al actualizar el perfil");
      toast.error("Error al actualizar el perfil");
    } finally {
      setIsSubmitting(false);
    }
  };

  return <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className={fadeIn({
          direction: 'down'
        })}>
            <h1 className="text-3xl font-bold text-infinitywits-navy mb-2">
              Mi Cuenta
            </h1>
            <p className="text-infinitywits-gray mb-6">
              Administra tu información y pedidos
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="">
              <Card className="border-gray-200 sticky top-24 mx-0">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-infinitywits-light flex items-center justify-center">
                      <User className="h-5 w-5 text-infinitywits-navy" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{user?.name}</CardTitle>
                      <CardDescription className="text-xs mt-1">{user?.email || user?.phone}</CardDescription>
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
                  <Button variant="outline" className="w-full text-infinitywits-gray" onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar Sesión
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <Tabs defaultValue="personal" className={fadeIn({
              direction: 'left'
            })}>
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
                      {error && (
                        <Alert variant="destructive" className="mb-4">
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}
                      
                      <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="name">Nombre Completo</Label>
                            <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Tu nombre completo" />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="dni">DNI</Label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <CreditCard className="h-4 w-4 text-infinitywits-gray" />
                              </div>
                              <Input 
                                id="dni" 
                                name="dni" 
                                value={formData.dni || ''} 
                                onChange={handleInputChange} 
                                placeholder="12345678" 
                                className="pl-10"
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="email">Correo Electrónico (opcional)</Label>
                            <Input 
                              id="email" 
                              name="email" 
                              type="email" 
                              value={formData.email || ''} 
                              onChange={handleInputChange} 
                              placeholder="tu@email.com" 
                              disabled={!!user?.email} 
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="phone">Teléfono</Label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Phone className="h-4 w-4 text-infinitywits-gray" />
                              </div>
                              <Input 
                                id="phone" 
                                name="phone" 
                                value={formData.phone || ''} 
                                onChange={handleInputChange} 
                                placeholder="987654321" 
                                className="pl-10"
                              />
                            </div>
                          </div>
                          
                          <div className="md:col-span-2 space-y-2">
                            <Label htmlFor="address">Dirección</Label>
                            <Input id="address" name="address" value={formData.address} onChange={handleInputChange} placeholder="Tu dirección" />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="city">Ciudad</Label>
                            <Input id="city" name="city" value={formData.city} onChange={handleInputChange} placeholder="Tu ciudad" />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="postalCode">Código Postal</Label>
                            <Input id="postalCode" name="postalCode" value={formData.postalCode} onChange={handleInputChange} placeholder="15000" />
                          </div>
                        </div>
                        
                        <Separator className="my-6" />
                        
                        <div className="flex justify-end">
                          <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                              <>Guardando...</>
                            ) : (
                              <>
                                <Save className="mr-2 h-4 w-4" />
                                Guardar Cambios
                              </>
                            )}
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
                      <div className="bg-infinitywits-light rounded-lg p-4 border border-infinitywits-light">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-infinitywits-navy">Dirección Principal</h3>
                            <p className="text-infinitywits-gray text-sm mt-1">
                              No hay dirección guardada
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            Agregar Dirección
                          </Button>
                        </div>
                      </div>
                      
                      <p className="text-sm text-infinitywits-gray">
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
                      <div className="bg-infinitywits-light rounded-lg p-4 border border-infinitywits-light">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-infinitywits-navy">Métodos de Pago</h3>
                            <p className="text-infinitywits-gray text-sm mt-1">
                              No hay métodos de pago guardados
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            Agregar Método de Pago
                          </Button>
                        </div>
                      </div>
                      
                      <p className="text-sm text-infinitywits-gray">
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
    </div>;
};
export default Profile;
