
import { useState, useEffect } from "react";
import { Users, Search, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AdminCustomers = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        // Obtener perfiles de usuarios
        const { data, error } = await supabase
          .from('profiles')
          .select('*');
          
        if (error) throw error;
        
        setCustomers(data || []);
      } catch (error) {
        console.error("Error loading customers:", error);
        toast.error("Error al cargar clientes");
      } finally {
        setIsLoading(false);
      }
    };

    loadCustomers();
  }, []);

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="w-full md:w-auto flex gap-2">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              className="pl-10"
              placeholder="Buscar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Users className="text-infinitywits-navy" size={18} />
            <CardTitle className="text-xl">Clientes Registrados</CardTitle>
          </div>
          <CardDescription>
            Listado de todos los clientes registrados en la plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-white rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Correo</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Dirección</TableHead>
                  <TableHead>Registro</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Cargando clientes...
                    </TableCell>
                  </TableRow>
                ) : filteredCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No se encontraron clientes
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-mono text-xs">{customer.id.split('-')[0]}</TableCell>
                      <TableCell className="font-medium">{customer.name || "—"}</TableCell>
                      <TableCell>{customer.email || "—"}</TableCell>
                      <TableCell>{customer.phone || "—"}</TableCell>
                      <TableCell className="max-w-xs truncate">{customer.address || "—"}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {customer.created_at ? new Date(customer.created_at).toLocaleDateString() : "—"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Users className="text-amber-500" size={18} />
            <CardTitle className="text-xl">Clientes no Registrados</CardTitle>
          </div>
          <CardDescription>
            Clientes que han realizado compras sin crear una cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
            <p className="text-sm text-amber-800">
              Los datos de los clientes no registrados estarán disponibles cuando se implementen los pedidos de compra sin registro.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCustomers;
