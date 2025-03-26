
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heading, Package, User, Phone, Mail, CreditCard, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { fetchSettings } from '@/services/api';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CustomerCheckoutSummary from '@/components/checkout/CustomerCheckoutSummary';
import { fadeIn } from '@/utils/animations';

// Form schema for customer information
const customerInfoSchema = z.object({
  dni: z.string().min(8, { message: 'El DNI debe tener al menos 8 caracteres' }),
  fullName: z.string().min(3, { message: 'El nombre completo es requerido' }),
  phone: z.string().min(9, { message: 'El teléfono debe tener al menos 9 dígitos' }),
  email: z.string().email({ message: 'Correo electrónico inválido' }).optional().or(z.literal('')),
});

type CustomerInfoValues = z.infer<typeof customerInfoSchema>;

const CheckoutPage = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<'yape' | 'card'>('yape');
  const [yapeSetting, setYapeSetting] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [showYapeInstructions, setShowYapeInstructions] = useState(false);

  const customerForm = useForm<CustomerInfoValues>({
    resolver: zodResolver(customerInfoSchema),
    defaultValues: {
      dni: '',
      fullName: '',
      phone: '',
      email: '',
    },
  });

  // Load user data if authenticated
  useEffect(() => {
    const loadUserData = async () => {
      if (isAuthenticated && user) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('dni, name, phone')
            .eq('id', user.id)
            .maybeSingle();

          if (data && !error) {
            customerForm.setValue('dni', data.dni || '');
            customerForm.setValue('fullName', data.name || '');
            customerForm.setValue('phone', data.phone || '');
            customerForm.setValue('email', user.email || '');
          }
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      }
    };

    loadUserData();
  }, [isAuthenticated, user]);

  // Load settings for Yape QR
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await fetchSettings();
        if (settings && settings.yape_qr) {
          setYapeSetting(settings.yape_qr);
        }
      } catch (error) {
        console.error('Error loading Yape settings:', error);
      }
    };

    loadSettings();
  }, []);

  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value as 'yape' | 'card');
  };

  const onSubmit = async (data: CustomerInfoValues) => {
    if (totalPrice > 500 && paymentMethod === 'yape') {
      toast.error('Yape solo está disponible para compras menores a 500 soles', {
        description: 'Por favor selecciona otro método de pago'
      });
      return;
    }

    setIsLoading(true);

    try {
      // Save customer data
      const orderData = {
        user_id: isAuthenticated ? user?.id : null,
        total: totalPrice,
        status: 'pending',
        payment_status: 'pending',
        customer_data: {
          dni: data.dni,
          fullName: data.fullName,
          phone: data.phone,
          email: data.email || null
        }
      };

      // For Yape, show payment instructions
      if (paymentMethod === 'yape') {
        setShowYapeInstructions(true);
      } else {
        // For card payments (to be implemented later)
        toast.info('Pago con tarjeta aún no implementado', {
          description: 'Esta funcionalidad estará disponible próximamente'
        });
      }
    } catch (error) {
      console.error('Error processing order:', error);
      toast.error('Error al procesar la orden');
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate payment completion
  const handleYapePaymentComplete = () => {
    setShowYapeInstructions(false);
    setOrderComplete(true);
    
    // Clear cart after successful payment
    setTimeout(() => {
      clearCart();
    }, 500);
  };

  const handleBackToShopping = () => {
    navigate('/');
  };

  // If cart is empty, redirect to cart page
  if (items.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 pb-16">
          <div className="container-custom">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold mb-4">Tu carrito está vacío</h1>
              <p className="text-muted-foreground mb-6">Agrega productos a tu carrito antes de proceder al pago</p>
              <Button onClick={handleBackToShopping}>Volver a la tienda</Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container-custom">
          {orderComplete ? (
            <div className={`text-center py-12 ${fadeIn({ direction: 'up' })}`}>
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold mb-4">¡Pago Completado!</h1>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Tu pedido ha sido procesado correctamente. Recibirás una confirmación en breve.
              </p>
              <Button onClick={handleBackToShopping}>Volver a la tienda</Button>
            </div>
          ) : showYapeInstructions && yapeSetting ? (
            <div className={`max-w-3xl mx-auto ${fadeIn({ direction: 'up' })}`}>
              <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-6 text-center">Escanea el código QR para pagar con Yape</h2>
                
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="w-full md:w-1/2 flex justify-center">
                    <div className="border-4 border-infinitywits-navy bg-white p-4 rounded-md">
                      <img 
                        src={yapeSetting} 
                        alt="Código QR de Yape" 
                        className="max-w-full h-auto mx-auto"
                      />
                    </div>
                  </div>
                  
                  <div className="w-full md:w-1/2 space-y-6">
                    <h3 className="text-lg font-semibold">Instrucciones:</h3>
                    <ol className="list-decimal list-inside space-y-3">
                      <li>Abre la aplicación de Yape en tu teléfono</li>
                      <li>Selecciona la opción "Escanear QR"</li>
                      <li>Apunta tu cámara al código QR mostrado</li>
                      <li>Ingresa el monto exacto: S/. {totalPrice.toFixed(2)}</li>
                      <li>Confirma el pago en tu app</li>
                    </ol>
                    
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <h4 className="font-medium mb-2">Monto a pagar:</h4>
                      <p className="text-2xl font-bold text-infinitywits-navy">S/. {totalPrice.toFixed(2)}</p>
                    </div>
                    
                    <div className="pt-4">
                      <Button 
                        onClick={handleYapePaymentComplete} 
                        className="w-full"
                      >
                        He completado el pago
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full mt-2"
                        onClick={() => setShowYapeInstructions(false)}
                      >
                        Volver
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 ${fadeIn({ direction: 'up' })}`}>
              <div className="lg:col-span-2 space-y-8">
                <Card>
                  <CardContent className="pt-6">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                      <User size={24} />
                      Información del Cliente
                    </h2>
                    
                    <Form {...customerForm}>
                      <form onSubmit={customerForm.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={customerForm.control}
                            name="dni"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>DNI *</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Ingresa tu DNI" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={customerForm.control}
                            name="fullName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nombre Completo *</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Ingresa tu nombre completo" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={customerForm.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Teléfono *</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Ingresa tu número telefónico" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={customerForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Correo electrónico (opcional)</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Ingresa tu correo electrónico" type="email" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="space-y-6 mt-8">
                          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <CreditCard size={24} />
                            Método de Pago
                          </h2>
                          
                          <RadioGroup 
                            defaultValue="yape" 
                            value={paymentMethod}
                            onValueChange={handlePaymentMethodChange}
                            className="flex flex-col space-y-4"
                          >
                            <div className={`flex items-center space-x-3 border rounded-lg p-4 ${paymentMethod === 'yape' ? 'border-infinitywits-navy bg-blue-50' : 'border-gray-200'}`}>
                              <RadioGroupItem value="yape" id="yape" />
                              <Label htmlFor="yape" className="flex-1 flex items-center gap-2 cursor-pointer">
                                <img src="/yape-logo.png" alt="Yape" className="h-8 w-auto" />
                                <div>
                                  <p className="font-semibold">Yape</p>
                                  <p className="text-sm text-muted-foreground">
                                    Solo disponible para compras menores a S/. 500
                                  </p>
                                </div>
                              </Label>
                            </div>
                            
                            <div className={`flex items-center space-x-3 border rounded-lg p-4 ${paymentMethod === 'card' ? 'border-infinitywits-navy bg-blue-50' : 'border-gray-200'}`}>
                              <RadioGroupItem value="card" id="card" />
                              <Label htmlFor="card" className="flex-1 flex items-center gap-2 cursor-pointer">
                                <CreditCard className="h-5 w-5" />
                                <div>
                                  <p className="font-semibold">Tarjeta de crédito/débito</p>
                                  <p className="text-sm text-muted-foreground">
                                    Próximamente disponible
                                  </p>
                                </div>
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>
                        
                        <div className="pt-6">
                          <Button 
                            type="submit" 
                            className="w-full" 
                            disabled={isLoading || (paymentMethod === 'yape' && totalPrice > 500)}
                          >
                            {isLoading ? 'Procesando...' : 'Continuar con el pago'}
                          </Button>
                          {paymentMethod === 'yape' && totalPrice > 500 && (
                            <p className="text-sm text-red-500 mt-2">
                              Yape solo está disponible para compras menores a S/. 500. Por favor selecciona otro método de pago.
                            </p>
                          )}
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <CustomerCheckoutSummary />
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
