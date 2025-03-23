
import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Image } from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { fetchCategories } from "@/services/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Esquema de validación para el formulario de categoría
const categorySchema = z.object({
  name: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
  slug: z.string().min(2, { message: "El slug es requerido" })
    .regex(/^[a-z0-9-]+$/, { message: "El slug debe contener solo letras minúsculas, números y guiones" }),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

const AdminCategories = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [categoryImage, setCategoryImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error loading categories:", error);
        toast.error("Error al cargar categorías");
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  const onSubmit = async (values: CategoryFormValues) => {
    try {
      setIsLoading(true);
      
      // Preparar los datos de la categoría
      const categoryData = {
        name: values.name,
        slug: values.slug,
      };

      let categoryId;
      
      if (editingCategory) {
        // Actualización de categoría existente
        const { data, error } = await supabase
          .from('categories')
          .update(categoryData)
          .eq('id', editingCategory.id)
          .select();
          
        if (error) throw error;
        categoryId = editingCategory.id;
        toast.success("Categoría actualizada correctamente");
      } else {
        // Creación de nueva categoría
        const { data, error } = await supabase
          .from('categories')
          .insert(categoryData)
          .select();
          
        if (error) throw error;
        categoryId = data?.[0]?.id;
        toast.success("Categoría creada correctamente");
      }
      
      // Manejar la imagen si hay una nueva
      if (categoryImage) {
        const filename = `category_${categoryId}_${Date.now()}`;
        const { data, error } = await supabase.storage
          .from('category-images')
          .upload(filename, categoryImage);
          
        if (error) throw error;
        
        // Obtener URL pública
        const { data: urlData } = supabase.storage
          .from('category-images')
          .getPublicUrl(filename);
          
        // Actualizar la categoría con la URL de la imagen
        const { error: updateError } = await supabase
          .from('categories')
          .update({ image: urlData.publicUrl })
          .eq('id', categoryId);
          
        if (updateError) throw updateError;
      }
      
      // Recargar categorías
      const updatedCategories = await fetchCategories();
      setCategories(updatedCategories);
      
      // Cerrar el diálogo y limpiar
      setIsDialogOpen(false);
      setEditingCategory(null);
      setCategoryImage(null);
      setImagePreview(null);
      form.reset();
      
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error("Error al guardar la categoría");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCategory = (category: any) => {
    setEditingCategory(category);
    
    // Configurar el formulario con los datos de la categoría
    form.reset({
      name: category.name,
      slug: category.slug,
    });
    
    // Configurar imagen existente
    if (category.image) {
      setImagePreview(category.image);
    }
    
    setIsDialogOpen(true);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm("¿Estás seguro de eliminar esta categoría?")) return;
    
    try {
      setIsLoading(true);
      
      // Verificar si hay productos asociados a esta categoría
      const { data: products, error: checkError } = await supabase
        .from('products')
        .select('id')
        .eq('category_id', categoryId);
        
      if (checkError) throw checkError;
      
      if (products && products.length > 0) {
        toast.error(`No se puede eliminar: hay ${products.length} productos asignados a esta categoría`);
        return;
      }
      
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);
        
      if (error) throw error;
      
      // Actualizar la lista de categorías
      setCategories(categories.filter(c => c.id !== categoryId));
      toast.success("Categoría eliminada correctamente");
      
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Error al eliminar la categoría");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setCategoryImage(file);
    
    // Crear URL para vista previa
    setImagePreview(URL.createObjectURL(file));
  };

  const handleGenerateSlug = () => {
    const name = form.getValues("name");
    if (name) {
      const slug = name
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
      
      form.setValue("slug", slug);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-infinitywits-navy">Categorías de Productos</h2>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                setEditingCategory(null);
                form.reset({
                  name: "",
                  slug: "",
                });
                setCategoryImage(null);
                setImagePreview(null);
              }}
            >
              <Plus className="mr-2" size={16} />
              Agregar Categoría
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Editar Categoría" : "Nueva Categoría"}
              </DialogTitle>
              <DialogDescription>
                Complete los campos para {editingCategory ? "actualizar" : "crear"} una categoría.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre de la Categoría</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input {...field} placeholder="Nombre de la categoría" />
                        </FormControl>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={handleGenerateSlug}
                          className="shrink-0"
                        >
                          Generar Slug
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug (URL)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="categoria-ejemplo" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div>
                  <FormLabel className="block mb-2">Imagen de Categoría</FormLabel>
                  <div className="border border-dashed border-gray-300 rounded-md p-4 text-center">
                    {imagePreview ? (
                      <div className="relative inline-block">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="max-h-48 max-w-full rounded-md mx-auto"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-0 right-0 h-6 w-6 rounded-full"
                          onClick={() => {
                            setCategoryImage(null);
                            setImagePreview(null);
                          }}
                        >
                          <Trash2 size={12} />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <label className="cursor-pointer">
                          <div className="flex items-center justify-center">
                            <Button type="button" variant="outline">
                              <Image className="mr-2" size={16} />
                              Subir Imagen
                            </Button>
                          </div>
                          <input
                            type="file"
                            onChange={handleImageChange}
                            className="hidden"
                            accept="image/*"
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>
                
                <DialogFooter>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Guardando..." : editingCategory ? "Actualizar Categoría" : "Crear Categoría"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">ID</TableHead>
              <TableHead className="w-16">Imagen</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Cargando categorías...
                </TableCell>
              </TableRow>
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  No hay categorías disponibles
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-mono text-xs">{category.id.split('-')[0]}</TableCell>
                  <TableCell>
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-100 flex items-center justify-center rounded">
                        <Image size={16} className="text-gray-400" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="text-sm text-gray-500">{category.slug}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditCategory(category)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminCategories;
