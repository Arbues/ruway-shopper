
import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, Image, Package, FileImage } from "lucide-react";
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
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { fetchProducts, fetchCategories } from "@/services/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Esquema de validación para el formulario de producto
const productSchema = z.object({
  name: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
  sku: z.string().min(2, { message: "El SKU es requerido" }),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "El precio debe ser un número mayor a 0",
  }),
  original_price: z.string().optional(),
  category_id: z.string().min(1, { message: "Selecciona una categoría" }),
  description: z.string().min(10, { message: "La descripción debe tener al menos 10 caracteres" }),
  stock_status: z.enum(["En Stock", "Agotado"]),
  features: z.array(z.string()).min(1, { message: "Agrega al menos una característica" }),
  specs: z.record(z.string(), z.string()).refine((val) => Object.keys(val).length > 0, {
    message: "Agrega al menos una especificación técnica",
  }),
});

type ProductFormValues = z.infer<typeof productSchema>;

const AdminProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [featureInputs, setFeatureInputs] = useState<string[]>([""]);
  const [specInputs, setSpecInputs] = useState<{ key: string; value: string }[]>([{ key: "", value: "" }]);
  const [productImages, setProductImages] = useState<File[]>([]);
  const [diagramImage, setDiagramImage] = useState<File | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [diagramUrl, setDiagramUrl] = useState<string>("");
  const [imageValidationError, setImageValidationError] = useState("");

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      sku: "",
      price: "",
      original_price: "",
      category_id: "",
      description: "",
      stock_status: "En Stock",
      features: [""],
      specs: {},
    },
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const productsData = await fetchProducts();
        const categoriesData = await fetchCategories();
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Error al cargar datos");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSubmit = async (values: ProductFormValues) => {
    try {
      // Validate images
      if (!editingProduct && productImages.length !== 5) {
        setImageValidationError("Debes subir exactamente 5 imágenes para el producto");
        return;
      }
      
      setIsLoading(true);
      setImageValidationError("");
      
      // Preparar los datos del producto
      const productData = {
        name: values.name,
        sku: values.sku,
        price: parseFloat(values.price),
        original_price: values.original_price ? parseFloat(values.original_price) : null,
        category_id: values.category_id,
        description: values.description,
        stock_status: values.stock_status,
        features: featureInputs.filter(f => f.trim() !== ""),
        specs: specInputs.reduce((acc, { key, value }) => {
          if (key.trim() !== "" && value.trim() !== "") {
            acc[key] = value;
          }
          return acc;
        }, {} as Record<string, string>),
      };

      let productId;
      
      if (editingProduct) {
        // Actualización de producto existente
        const { data, error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id)
          .select();
          
        if (error) throw error;
        productId = editingProduct.id;
        toast.success("Producto actualizado correctamente");
      } else {
        // Creación de nuevo producto
        const { data, error } = await supabase
          .from('products')
          .insert(productData)
          .select();
          
        if (error) throw error;
        productId = data?.[0]?.id;
        toast.success("Producto creado correctamente");
      }
      
      // Manejar las imágenes del producto (exactamente 5)
      if (productImages.length > 0) {
        const uploadPromises = productImages.map(async (file, index) => {
          const filename = `product_${productId}_${index}_${Date.now()}`;
          const { data, error } = await supabase.storage
            .from('product-images')
            .upload(filename, file);
            
          if (error) throw error;
          
          // Obtener URL pública
          const { data: urlData } = supabase.storage
            .from('product-images')
            .getPublicUrl(filename);
            
          return urlData.publicUrl;
        });
        
        const uploadedUrls = await Promise.all(uploadPromises);
        
        // Actualizar el producto con las URLs de las imágenes
        const { error: updateError } = await supabase
          .from('products')
          .update({ 
            image: uploadedUrls[0], // Primera imagen como principal
            images: uploadedUrls // Todas las imágenes
          })
          .eq('id', productId);
          
        if (updateError) throw updateError;
      }
      
      // Manejar el diagrama si existe
      if (diagramImage) {
        const diagramFilename = `diagram_${productId}_${Date.now()}`;
        const { error: diagramError } = await supabase.storage
          .from('product-images')
          .upload(diagramFilename, diagramImage);
          
        if (diagramError) throw diagramError;
        
        // Obtener URL pública del diagrama
        const { data: diagramUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(diagramFilename);
          
        // Actualizar el producto con la URL del diagrama
        const { error: updateDiagramError } = await supabase
          .from('products')
          .update({ diagram_image: diagramUrlData.publicUrl })
          .eq('id', productId);
          
        if (updateDiagramError) throw updateDiagramError;
      }
      
      // Recargar productos
      const updatedProducts = await fetchProducts();
      setProducts(updatedProducts);
      
      // Cerrar el diálogo y limpiar
      setIsDialogOpen(false);
      setEditingProduct(null);
      setFeatureInputs([""]);
      setSpecInputs([{ key: "", value: "" }]);
      setProductImages([]);
      setDiagramImage(null);
      setImageUrls([]);
      setDiagramUrl("");
      form.reset();
      
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Error al guardar el producto");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    
    // Configurar el formulario con los datos del producto
    form.reset({
      name: product.name,
      sku: product.sku,
      price: String(product.price),
      original_price: product.original_price ? String(product.original_price) : "",
      category_id: product.category_id || "",
      description: product.description || "",
      stock_status: product.stock_status || "En Stock",
      features: product.features || [""],
      specs: product.specs || {},
    });
    
    // Configurar características
    setFeatureInputs(product.features?.length ? product.features : [""]);
    
    // Configurar especificaciones
    if (product.specs && Object.keys(product.specs).length) {
      const specEntries = Object.entries(product.specs).map(([key, value]) => ({
        key,
        value: value as string,
      }));
      setSpecInputs(specEntries);
    } else {
      setSpecInputs([{ key: "", value: "" }]);
    }
    
    // Configurar imágenes existentes
    if (product.images?.length) {
      setImageUrls(product.images);
    } else if (product.image) {
      setImageUrls([product.image]);
    } else {
      setImageUrls([]);
    }
    
    // Configurar diagrama existente
    if (product.diagram_image) {
      setDiagramUrl(product.diagram_image);
    } else {
      setDiagramUrl("");
    }
    
    setIsDialogOpen(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;
    
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
        
      if (error) throw error;
      
      // Actualizar la lista de productos
      setProducts(products.filter(p => p.id !== productId));
      toast.success("Producto eliminado correctamente");
      
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Error al eliminar el producto");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFeature = () => {
    setFeatureInputs([...featureInputs, ""]);
  };

  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...featureInputs];
    updatedFeatures[index] = value;
    setFeatureInputs(updatedFeatures);
  };

  const handleRemoveFeature = (index: number) => {
    if (featureInputs.length > 1) {
      const updatedFeatures = featureInputs.filter((_, i) => i !== index);
      setFeatureInputs(updatedFeatures);
    }
  };

  const handleAddSpec = () => {
    setSpecInputs([...specInputs, { key: "", value: "" }]);
  };

  const handleSpecChange = (index: number, field: 'key' | 'value', value: string) => {
    const updatedSpecs = [...specInputs];
    updatedSpecs[index][field] = value;
    setSpecInputs(updatedSpecs);
  };

  const handleRemoveSpec = (index: number) => {
    if (specInputs.length > 1) {
      const updatedSpecs = specInputs.filter((_, i) => i !== index);
      setSpecInputs(updatedSpecs);
    }
  };

  const handleProductImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    // Reset validation error
    setImageValidationError("");
    
    const newImages = Array.from(files);
    
    // Check if we have exactly 5 images 
    if (editingProduct) {
      // For editing, we replace all images
      setProductImages(newImages);
      
      // Create URLs for preview
      const newUrls = newImages.map(file => URL.createObjectURL(file));
      setImageUrls(newUrls);
    } else {
      // For new products, we accumulate up to 5 images
      const totalImages = [...productImages, ...newImages];
      
      // Limit to 5 images max
      if (totalImages.length > 5) {
        setImageValidationError("Solo puedes seleccionar hasta 5 imágenes en total");
        return;
      }
      
      setProductImages(totalImages);
      
      // Create URLs for preview
      const newUrls = totalImages.map(file => URL.createObjectURL(file));
      setImageUrls(newUrls);
    }
  };

  const handleDiagramChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    setDiagramImage(file);
    setDiagramUrl(URL.createObjectURL(file));
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = productImages.filter((_, i) => i !== index);
    setProductImages(updatedImages);
    
    const updatedUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(updatedUrls);
    
    // Clear validation error if applicable
    if (imageValidationError && updatedImages.length <= 5) {
      setImageValidationError("");
    }
  };

  const handleRemoveDiagram = () => {
    setDiagramImage(null);
    setDiagramUrl("");
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="w-full md:w-auto flex gap-2">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              className="pl-10"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                setEditingProduct(null);
                form.reset({
                  name: "",
                  sku: "",
                  price: "",
                  original_price: "",
                  category_id: "",
                  description: "",
                  stock_status: "En Stock",
                  features: [""],
                  specs: {},
                });
                setFeatureInputs([""]);
                setSpecInputs([{ key: "", value: "" }]);
                setProductImages([]);
                setDiagramImage(null);
                setImageUrls([]);
                setDiagramUrl("");
                setImageValidationError("");
              }}
            >
              <Plus className="mr-2" size={16} />
              Agregar Producto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Editar Producto" : "Nuevo Producto"}
              </DialogTitle>
              <DialogDescription>
                Complete todos los campos para {editingProduct ? "actualizar" : "crear"} un producto.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Información básica */}
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre del Producto</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Nombre del producto" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="sku"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>SKU</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="SKU" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="category_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Categoría</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccionar" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories.map(category => (
                                  <SelectItem key={category.id} value={category.id}>
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Precio (S/)</FormLabel>
                            <FormControl>
                              <Input 
                                type="text" 
                                {...field} 
                                placeholder="Ej. 99.90" 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="original_price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Precio Original (opcional)</FormLabel>
                            <FormControl>
                              <Input 
                                type="text" 
                                {...field} 
                                placeholder="Ej. 129.90" 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="stock_status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estado de Stock</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="En Stock">En Stock</SelectItem>
                              <SelectItem value="Agotado">Agotado</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descripción</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder="Descripción del producto"
                              className="min-h-32"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* Imágenes del Producto */}
                  <div className="space-y-4">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="images">
                        <AccordionTrigger className="font-medium">
                          Imágenes del Producto (Requerido: 5 imágenes)
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="border border-dashed border-gray-300 rounded-md p-4 mb-4">
                            <div className="flex items-center justify-center mb-4">
                              <label className="cursor-pointer">
                                <div className="flex items-center justify-center">
                                  <Button type="button" variant="outline">
                                    <Image className="mr-2" size={16} />
                                    {imageUrls.length ? "Cambiar Imágenes" : "Subir Imágenes"}
                                  </Button>
                                </div>
                                <input
                                  type="file"
                                  multiple
                                  onChange={handleProductImagesChange}
                                  className="hidden"
                                  accept="image/*"
                                  title="Selecciona exactamente 5 imágenes"
                                />
                              </label>
                            </div>
                            
                            {imageValidationError && (
                              <div className="text-sm text-destructive mb-2 text-center">
                                {imageValidationError}
                              </div>
                            )}
                            
                            <div className="text-center text-sm mb-4">
                              {editingProduct ? (
                                "Se reemplazarán todas las imágenes existentes"
                              ) : (
                                `${imageUrls.length} de 5 imágenes seleccionadas`
                              )}
                            </div>
                            
                            {imageUrls.length > 0 && (
                              <div className="grid grid-cols-5 gap-3">
                                {imageUrls.map((url, index) => (
                                  <div key={index} className="relative">
                                    <img
                                      src={url}
                                      alt={`Vista previa ${index + 1}`}
                                      className="w-full h-24 object-cover rounded-md border"
                                    />
                                    <Button
                                      type="button"
                                      variant="destructive"
                                      size="icon"
                                      className="absolute top-0 right-0 h-6 w-6 rounded-full translate-x-1/3 -translate-y-1/3"
                                      onClick={() => handleRemoveImage(index)}
                                    >
                                      <Trash2 size={12} />
                                    </Button>
                                  </div>
                                ))}
                                
                                {/* Agregar placeholders para imágenes faltantes */}
                                {Array.from({ length: Math.max(0, 5 - imageUrls.length) }).map((_, index) => (
                                  <div 
                                    key={`placeholder-${index}`} 
                                    className="border border-dashed border-gray-300 rounded-md h-24 flex items-center justify-center bg-gray-50"
                                  >
                                    <span className="text-gray-400 text-xs">Imagen {imageUrls.length + index + 1}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="diagram">
                        <AccordionTrigger className="font-medium">
                          Diagrama del Producto (Opcional)
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="border border-dashed border-gray-300 rounded-md p-4">
                            <div className="flex items-center justify-center mb-4">
                              <label className="cursor-pointer">
                                <div className="flex items-center justify-center">
                                  <Button type="button" variant="outline">
                                    <FileImage className="mr-2" size={16} />
                                    {diagramUrl ? "Cambiar Diagrama" : "Subir Diagrama"}
                                  </Button>
                                </div>
                                <input
                                  type="file"
                                  onChange={handleDiagramChange}
                                  className="hidden"
                                  accept="image/*"
                                />
                              </label>
                            </div>
                            
                            {diagramUrl && (
                              <div className="relative">
                                <img
                                  src={diagramUrl}
                                  alt="Diagrama del producto"
                                  className="max-w-full h-auto rounded-md border max-h-48 mx-auto"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="absolute top-0 right-0 h-6 w-6 rounded-full translate-x-1/3 -translate-y-1/3"
                                  onClick={handleRemoveDiagram}
                                >
                                  <Trash2 size={12} />
                                </Button>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                    
                    {/* Características */}
                    <div>
                      <FormLabel className="block mb-2">Características Principales</FormLabel>
                      <Card>
                        <CardContent className="pt-4 space-y-2">
                          {featureInputs.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Input
                                value={feature}
                                onChange={(e) => handleFeatureChange(index, e.target.value)}
                                placeholder="Característica"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveFeature(index)}
                                disabled={featureInputs.length === 1}
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleAddFeature}
                            className="w-full"
                          >
                            <Plus size={16} className="mr-2" />
                            Agregar Característica
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                    
                    {/* Especificaciones técnicas */}
                    <div>
                      <FormLabel className="block mb-2">Especificaciones Técnicas</FormLabel>
                      <Card>
                        <CardContent className="pt-4 space-y-2">
                          {specInputs.map((spec, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Input
                                value={spec.key}
                                onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                                placeholder="Nombre"
                                className="w-1/3"
                              />
                              <Input
                                value={spec.value}
                                onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                                placeholder="Valor"
                                className="flex-1"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveSpec(index)}
                                disabled={specInputs.length === 1}
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleAddSpec}
                            className="w-full"
                          >
                            <Plus size={16} className="mr-2" />
                            Agregar Especificación
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline" type="button">Cancelar</Button>
                  </DialogClose>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Guardando..." : editingProduct ? "Actualizar Producto" : "Crear Producto"}
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
              <TableHead>SKU</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  Cargando productos...
                </TableCell>
              </TableRow>
            ) : filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  No se encontraron productos
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-mono text-xs">{product.id.split('-')[0]}</TableCell>
                  <TableCell>
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-100 flex items-center justify-center rounded">
                        <Package size={16} className="text-gray-400" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>S/ {product.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <span className={product.stockStatus === 'En Stock' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                      {product.stockStatus}
                    </span>
                  </TableCell>
                  <TableCell>{categories.find(c => c.id === product.category_id)?.name || '-'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditProduct(product)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteProduct(product.id)}
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

export default AdminProducts;
