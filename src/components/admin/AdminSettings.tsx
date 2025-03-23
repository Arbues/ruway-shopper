
import { useState, useEffect } from "react";
import { QrCode, ShieldCheck, MapPin, Phone, Mail, Globe, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

// Esquema de validación para configuraciones
const settingsSchema = z.object({
  company_name: z.string().min(1, { message: "El nombre de la empresa es requerido" }),
  company_slogan: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email({ message: "Correo electrónico inválido" }).optional().or(z.literal('')),
  website: z.string().url({ message: "URL del sitio web inválida" }).optional().or(z.literal('')),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

const AdminSettings = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [qrCode, setQrCode] = useState<File | null>(null);
  const [qrPreview, setQrPreview] = useState<string | null>(null);
  const [existingQrUrl, setExistingQrUrl] = useState<string | null>(null);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      company_name: "Infinity Wits",
      company_slogan: "",
      address: "",
      phone: "",
      email: "",
      website: "",
    },
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Obtener configuraciones
        const { data: settings, error } = await supabase
          .from('settings')
          .select('*')
          .single();
          
        if (error && error.code !== 'PGRST116') {
          throw error;
        }
        
        if (settings) {
          form.reset({
            company_name: settings.company_name || "Infinity Wits",
            company_slogan: settings.company_slogan || "",
            address: settings.address || "",
            phone: settings.phone || "",
            email: settings.email || "",
            website: settings.website || "",
          });
          
          if (settings.yape_qr) {
            setExistingQrUrl(settings.yape_qr);
            setQrPreview(settings.yape_qr);
          }
        }
      } catch (error) {
        console.error("Error loading settings:", error);
        toast.error("Error al cargar configuraciones");
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [form]);

  const onSubmit = async (values: SettingsFormValues) => {
    try {
      setIsLoading(true);
      
      // Preparar datos básicos
      const settingsData = {
        ...values,
      };

      // Subir QR si hay uno nuevo
      if (qrCode) {
        const filename = `yape_qr_${Date.now()}`;
        const { data, error } = await supabase.storage
          .from('settings')
          .upload(filename, qrCode);
          
        if (error) throw error;
        
        // Obtener URL pública
        const { data: urlData } = supabase.storage
          .from('settings')
          .getPublicUrl(filename);
          
        settingsData.yape_qr = urlData.publicUrl;
      } else if (existingQrUrl) {
        settingsData.yape_qr = existingQrUrl;
      }
      
      // Verificar si ya existen configuraciones
      const { data: existingSettings } = await supabase
        .from('settings')
        .select('id')
        .limit(1);
      
      if (existingSettings && existingSettings.length > 0) {
        // Actualizar configuraciones existentes
        const { error } = await supabase
          .from('settings')
          .update(settingsData)
          .eq('id', existingSettings[0].id);
          
        if (error) throw error;
      } else {
        // Crear nuevas configuraciones
        const { error } = await supabase
          .from('settings')
          .insert(settingsData);
          
        if (error) throw error;
      }
      
      toast.success("Configuraciones guardadas correctamente");
      
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Error al guardar configuraciones");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQrCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setQrCode(file);
    
    // Crear URL para vista previa
    const previewUrl = URL.createObjectURL(file);
    setQrPreview(previewUrl);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Configuración General</CardTitle>
          <CardDescription>
            Actualizar información básica de la tienda y métodos de contacto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Información de la Empresa */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Información de la Empresa</h3>
                  
                  <FormField
                    control={form.control}
                    name="company_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre de la Empresa</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Infinity Wits" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="company_slogan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Eslogan (opcional)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Tu eslogan aquí" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dirección</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Dirección completa" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Información de Contacto */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Información de Contacto</h3>
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="+51 987 654 321" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correo Electrónico</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="contacto@infinitywits.com" type="email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sitio Web</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://infinitywits.com" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <Separator />
              
              {/* Configuración de Yape */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Configuración de Yape</h3>
                <p className="text-sm text-muted-foreground">
                  Actualizar el código QR de Yape para recibir pagos. Se mostrará a los clientes al momento de pagar.
                </p>
                
                <div className="flex gap-8 items-start">
                  <div className="border border-dashed border-gray-300 rounded-md p-4 text-center w-48">
                    {qrPreview ? (
                      <div className="relative inline-block">
                        <img
                          src={qrPreview}
                          alt="Código QR de Yape"
                          className="max-h-40 max-w-full rounded-md mx-auto"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => {
                            if (existingQrUrl && !qrCode) {
                              // Si estamos eliminando el QR existente
                              setQrPreview(null);
                              setExistingQrUrl(null);
                            } else {
                              // Si estamos eliminando un nuevo QR cargado
                              setQrPreview(existingQrUrl);
                              setQrCode(null);
                            }
                          }}
                        >
                          Cambiar QR
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-40">
                        <QrCode size={48} className="text-gray-300 mb-2" />
                        <label className="cursor-pointer">
                          <Button type="button" variant="outline" size="sm">
                            Subir Código QR
                          </Button>
                          <input
                            type="file"
                            onChange={handleQrCodeChange}
                            className="hidden"
                            accept="image/*"
                          />
                        </label>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="text-base font-medium mb-2">Consideraciones para Yape</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Solo para compras menores a 500 soles</li>
                      <li>El código QR debe ser claro y escaneable</li>
                      <li>Recomendado: imagen de 400x400 píxeles</li>
                      <li>Este código será mostrado a los clientes al momento de pagar con Yape</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  <Save className="mr-2" size={16} />
                  {isLoading ? "Guardando..." : "Guardar Cambios"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-infinitywits-navy" />
            <CardTitle>Seguridad y Cuenta del Administrador</CardTitle>
          </div>
          <CardDescription>
            Información sobre la cuenta de administrador
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-infinitywits-lightblue/50 border border-infinitywits-lightblue rounded-md p-4">
            <h3 className="font-medium text-infinitywits-navy mb-2">Cuenta de Administrador</h3>
            <p className="text-sm mb-4">
              Esta cuenta administradora es única, persistente y no eliminable.
              Mantén seguras estas credenciales:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-medium text-muted-foreground">Usuario</h4>
                <p className="font-medium">Jose Muñoz</p>
              </div>
              <div>
                <h4 className="text-xs font-medium text-muted-foreground">Correo</h4>
                <p className="font-medium">admin@infinitywits.com</p>
              </div>
              <div>
                <h4 className="text-xs font-medium text-muted-foreground">Contraseña</h4>
                <p className="font-medium">••••••••••</p>
              </div>
              <div>
                <h4 className="text-xs font-medium text-muted-foreground">Nivel de Acceso</h4>
                <p className="font-medium">Administrador Total</p>
              </div>
            </div>
            
            <div className="mt-4 text-sm text-muted-foreground">
              <p className="font-medium text-amber-600">Importante:</p>
              <p>Por seguridad, no es posible cambiar estas credenciales desde la interfaz. Si necesitas recuperar acceso, contacta con el equipo de soporte técnico.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
