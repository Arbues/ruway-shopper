
import { useState, useEffect } from "react";
import { QrCode, DollarSign, Settings, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AdminPayments = () => {
  const [yapeSetting, setYapeSetting] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Obtener configuración de Yape
        const { data, error } = await supabase
          .from('settings')
          .select('yape_qr')
          .single();
          
        if (error && error.code !== 'PGRST116') {
          throw error;
        }
        
        if (data) {
          setYapeSetting(data.yape_qr);
        }
      } catch (error) {
        console.error("Error loading payment settings:", error);
        toast.error("Error al cargar configuración de pagos");
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  return (
    <div>
      <Tabs defaultValue="yape">
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="yape" className="flex items-center gap-2">
              <QrCode size={16} />
              Yape
            </TabsTrigger>
            <TabsTrigger value="card" className="flex items-center gap-2">
              <DollarSign size={16} />
              Tarjeta
            </TabsTrigger>
          </TabsList>
          
          <Button variant="outline" size="sm" asChild>
            <a href="#/admin?tab=settings">
              <Settings size={16} className="mr-2" />
              Configuración de Pagos
            </a>
          </Button>
        </div>
        
        <TabsContent value="yape">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Yape</CardTitle>
              <CardDescription>
                Gestiona la configuración para recibir pagos con Yape
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-lg font-medium mb-4">Código QR Actual</h3>
                  {isLoading ? (
                    <div className="w-full h-64 bg-gray-100 animate-pulse rounded-md"></div>
                  ) : yapeSetting ? (
                    <div className="border rounded-md p-4 bg-white flex items-center justify-center">
                      <img 
                        src={yapeSetting} 
                        alt="Código QR de Yape" 
                        className="max-w-full max-h-64 object-contain"
                      />
                    </div>
                  ) : (
                    <div className="border border-dashed rounded-md p-8 text-center bg-gray-50">
                      <QrCode size={64} className="mx-auto text-gray-300 mb-3" />
                      <p className="text-muted-foreground">
                        No hay código QR configurado
                      </p>
                      <Button variant="outline" size="sm" className="mt-4" asChild>
                        <a href="#/admin?tab=settings">
                          Configurar QR
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Condiciones de Uso</h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Solo disponible para compras menores a 500 soles</li>
                      <li>El cliente debe enviar comprobante de pago</li>
                      <li>El administrador debe verificar cada pago manualmente</li>
                      <li>Solo para clientes en Perú</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Proceso de Pago</h3>
                    <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                      <li>Cliente selecciona Yape como método de pago</li>
                      <li>Se muestra el código QR con instrucciones</li>
                      <li>Cliente escanea y realiza el pago</li>
                      <li>Cliente confirma el pago</li>
                      <li>Administrador recibe notificación para verificar</li>
                    </ol>
                  </div>
                  
                  <div className="rounded-md bg-amber-50 border border-amber-200 p-4">
                    <p className="text-sm text-amber-800">
                      <strong>Nota:</strong> Actualiza regularmente tu código QR para mayor seguridad. Los QR anteriores serán invalidados automáticamente.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="card">
          <Card>
            <CardHeader>
              <CardTitle>Pago con Tarjeta</CardTitle>
              <CardDescription>
                Esta funcionalidad está en desarrollo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border border-dashed rounded-md p-8 text-center bg-gray-50">
                <DollarSign size={64} className="mx-auto text-gray-300 mb-3" />
                <h3 className="text-lg font-medium mb-2">Función en Desarrollo</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-4">
                  La integración con pasarela de pagos para tarjetas se implementará en futuras actualizaciones.
                </p>
                <div className="inline-flex items-center justify-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded-md text-blue-700 text-sm">
                  <ArrowUpDown size={16} />
                  Próximamente disponible
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPayments;
