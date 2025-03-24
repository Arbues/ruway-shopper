
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Minus, 
  Plus, 
  ShoppingCart, 
  Heart, 
  Share2, 
  Check, 
  ChevronRight, 
  ArrowLeft,
  Image as ImageIcon
} from "lucide-react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/ui/ProductCard";
import { fetchProductById, fetchProducts, Product } from "@/services/api";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";
import { fadeIn } from "@/utils/animations";

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>([]);
  
  useEffect(() => {
    const loadProductData = async () => {
      if (!productId) return;
      
      setIsLoading(true);
      try {
        const productData = await fetchProductById(productId);
        if (productData) {
          setProduct(productData);
          // Initialize images loaded state
          setImagesLoaded(new Array(productData.images?.length || 1).fill(false));
          
          // Load related products (same category)
          const allProducts = await fetchProducts();
          const filtered = allProducts
            .filter(p => p.id !== productData.id && p.category === productData.category)
            .slice(0, 4);
          setRelatedProducts(filtered);
        }
      } catch (error) {
        console.error("Error loading product:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProductData();
    // Reset quantity when product changes
    setQuantity(1);
    setActiveImage(0);
  }, [productId]);

  const handleQuantityChange = (value: number) => {
    setQuantity(Math.max(1, value));
  };

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
    }
  };

  const handleImageLoad = (index: number) => {
    setImagesLoaded(prev => {
      const updated = [...prev];
      updated[index] = true;
      return updated;
    });
  };

  // Loading state
  if (isLoading || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 pb-16">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="h-96 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                <div className="h-10 bg-gray-200 rounded animate-pulse w-1/3"></div>
                <div className="h-12 bg-gray-200 rounded animate-pulse w-full"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Ensure we always have exactly 5 images to display
  const displayImages = Array.isArray(product.images) && product.images.length > 0 
    ? [...product.images].slice(0, 5) 
    : [product.image || '/placeholder.svg'];
  
  // Fill with placeholders if needed
  while (displayImages.length < 5) {
    displayImages.push('/placeholder.svg');
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container-custom">
          {/* Breadcrumbs */}
          <div className={fadeIn({ direction: 'down' })}>
            <Breadcrumb className="mb-6">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/">Inicio</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/productos">Productos</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to={`/categoria/${product.category}`}>
                      {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{product.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Back Button (Mobile) */}
          <div className="block md:hidden mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/productos" className="flex items-center text-ruway-gray">
                <ArrowLeft className="h-4 w-4 mr-1" /> Volver a Productos
              </Link>
            </Button>
          </div>

          {/* Product Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className={fadeIn({ direction: 'right' })}>
              <div className="sticky top-24">
                {/* Main Image */}
                <div className="bg-white rounded-lg overflow-hidden mb-4 border border-gray-200 relative aspect-square">
                  {!imagesLoaded[activeImage] && (
                    <div className="absolute inset-0 bg-gray-100 animate-pulse"></div>
                  )}
                  <img
                    src={displayImages[activeImage]}
                    alt={product.name}
                    className={cn(
                      "w-full h-full object-contain transition-opacity duration-300",
                      !imagesLoaded[activeImage] ? "opacity-0" : "opacity-100"
                    )}
                    onLoad={() => handleImageLoad(activeImage)}
                  />
                </div>
                
                {/* Thumbnail Images - Always show 5 */}
                <div className="grid grid-cols-5 gap-2">
                  {displayImages.map((image, index) => (
                    <button
                      key={index}
                      className={cn(
                        "h-20 rounded-md border overflow-hidden flex-shrink-0 transition-all",
                        activeImage === index
                          ? "border-ruway-primary ring-2 ring-ruway-primary/20"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                      onClick={() => setActiveImage(index)}
                    >
                      <img
                        src={image}
                        alt={`${product.name} - vista ${index + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className={fadeIn({ direction: 'left' })}>
              {/* SKU & Stock */}
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-ruway-gray">
                  #{product.sku}
                </div>
                <div className={cn(
                  "text-sm font-medium px-3 py-1 rounded-full",
                  product.stockStatus === 'En Stock'
                    ? "bg-ruway-accent/10 text-ruway-accent"
                    : "bg-destructive/10 text-destructive"
                )}>
                  {product.stockStatus}
                </div>
              </div>
              
              {/* Product Name */}
              <h1 className="text-3xl font-bold text-ruway-secondary mb-4">
                {product.name}
              </h1>
              
              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-ruway-secondary">
                    S/ {product.price.toFixed(2)}
                  </span>
                  
                  {product.original_price && (
                    <span className="ml-3 text-lg text-ruway-gray line-through">
                      S/ {product.original_price.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <p className="text-ruway-gray">
                  {product.description}
                </p>
              </div>

              {/* Add to Cart */}
              <div className="mb-8">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-gray-200 rounded-md">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-none rounded-l-md"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center">
                      {quantity}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-none rounded-r-md"
                      onClick={() => handleQuantityChange(quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <Button
                    className="flex-1"
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={product.stockStatus !== 'En Stock'}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Agregar al Carrito
                  </Button>
                </div>
                
                {product.stockStatus !== 'En Stock' && (
                  <p className="text-sm text-destructive mt-2">
                    Producto temporalmente agotado
                  </p>
                )}
                
                {/* Wishlist & Share */}
                <div className="flex items-center space-x-4 mt-4">
                  <Button variant="outline" size="sm">
                    <Heart className="mr-2 h-4 w-4" />
                    Guardar
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="mr-2 h-4 w-4" />
                    Compartir
                  </Button>
                </div>
              </div>

              {/* Key Features */}
              {product.features && product.features.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-ruway-secondary mb-3">
                    Características Principales
                  </h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="mr-2 h-5 w-5 text-ruway-accent flex-shrink-0 mt-0.5" />
                        <span className="text-ruway-gray">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Shipping Info */}
              <div className="bg-ruway-light rounded-lg p-4 mb-6">
                <h3 className="text-sm font-medium text-ruway-secondary mb-2">
                  Información de Envío
                </h3>
                <p className="text-sm text-ruway-gray">
                  Envío gratis a todo el Perú en compras mayores a S/200.
                </p>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className={`mt-16 ${fadeIn({ direction: 'up' })}`}>
            <Tabs defaultValue="description">
              <TabsList className="w-full grid grid-cols-4 mb-6">
                <TabsTrigger value="description">Descripción</TabsTrigger>
                <TabsTrigger value="specifications">Especificaciones Técnicas</TabsTrigger>
                <TabsTrigger value="features">Funcionalidades</TabsTrigger>
                <TabsTrigger value="diagram">Diagrama</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="p-6 bg-white rounded-lg border border-gray-200">
                <h3 className="text-xl font-medium text-ruway-secondary mb-4">
                  Descripción Detallada
                </h3>
                <div className="prose text-ruway-gray max-w-none">
                  <p>{product.description}</p>
                </div>
              </TabsContent>
              
              <TabsContent value="specifications" className="p-6 bg-white rounded-lg border border-gray-200">
                <h3 className="text-xl font-medium text-ruway-secondary mb-4">
                  Especificaciones Técnicas
                </h3>
                
                {product.specs && Object.keys(product.specs).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(product.specs).map(([key, value]) => (
                      <div key={key} className="py-2 border-b border-gray-100">
                        <div className="text-sm font-medium text-ruway-secondary">{key}</div>
                        <div className="text-ruway-gray">{value}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-ruway-gray">
                    No hay especificaciones técnicas disponibles para este producto.
                  </p>
                )}
              </TabsContent>
              
              <TabsContent value="features" className="p-6 bg-white rounded-lg border border-gray-200">
                <h3 className="text-xl font-medium text-ruway-secondary mb-4">
                  Funcionalidades Principales
                </h3>
                
                {product.features && product.features.length > 0 ? (
                  <ul className="space-y-3">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="mr-3 h-5 w-5 text-ruway-accent flex-shrink-0 mt-0.5" />
                        <span className="text-ruway-gray">{feature}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-ruway-gray">
                    No hay funcionalidades principales disponibles para este producto.
                  </p>
                )}
              </TabsContent>
              
              <TabsContent value="diagram" className="p-6 bg-white rounded-lg border border-gray-200">
                <h3 className="text-xl font-medium text-ruway-secondary mb-4">
                  Diagrama del Producto
                </h3>
                
                {product.diagram_image ? (
                  <div className="flex justify-center">
                    <img 
                      src={product.diagram_image} 
                      alt={`Diagrama de ${product.name}`} 
                      className="max-w-full h-auto max-h-96 object-contain"
                    />
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-300" />
                    <p className="mt-4 text-ruway-gray">
                      No hay diagrama disponible para este producto.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className={`mt-16 ${fadeIn({ direction: 'up' })}`}>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-ruway-secondary">
                  Productos Relacionados
                </h2>
                <Link 
                  to={`/categoria/${product.category}`} 
                  className="text-ruway-primary hover:text-ruway-primary/80 flex items-center"
                >
                  Ver más <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct, index) => (
                  <ProductCard 
                    key={relatedProduct.id} 
                    product={relatedProduct}
                    index={index}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
