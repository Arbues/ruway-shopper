
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, Truck, ShieldCheck, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/ui/ProductCard";
import CategoryCard from "@/components/ui/CategoryCard";
import { fetchCategories, fetchProducts, Category, Product } from "@/services/api";
import { fadeIn } from "@/utils/animations";

const Index = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [categoriesData, productsData] = await Promise.all([
          fetchCategories(),
          fetchProducts()
        ]);
        
        setCategories(categoriesData);
        // For MVP, just showing all products as featured
        setFeaturedProducts(productsData);
      } catch (error) {
        console.error("Error loading home page data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="relative bg-ruway-light py-20 overflow-hidden">
          <div className="container-custom relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className={fadeIn({ direction: 'right' })}>
                <h1 className="text-4xl md:text-5xl font-bold text-ruway-secondary leading-tight mb-4">
                  Tecnología y Electrónica para tus Proyectos
                </h1>
                <p className="text-lg text-ruway-gray mb-8 max-w-lg">
                  Descubre los mejores componentes y herramientas para tus proyectos electrónicos, IoT y desarrollo.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" asChild>
                    <Link to="/productos">
                      Explorar Productos
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/categoria/microcontroladores">
                      Ver Microcontroladores
                    </Link>
                  </Button>
                </div>
              </div>
              
              <div className={fadeIn({ direction: 'left' })}>
                <img 
                  src="/placeholder.svg" 
                  alt="Ruway Electronics" 
                  className="w-full h-auto object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
          
          {/* Background gradient elements */}
          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-ruway-primary/5 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-ruway-accent/5 rounded-full filter blur-3xl"></div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className={`p-6 text-center ${fadeIn({ direction: 'up', index: 0 })}`}>
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-ruway-primary/10 flex items-center justify-center">
                    <Zap className="h-6 w-6 text-ruway-primary" />
                  </div>
                </div>
                <h3 className="text-lg font-medium text-ruway-secondary mb-2">Calidad Garantizada</h3>
                <p className="text-ruway-gray">Componentes y productos originales con garantía de fábrica.</p>
              </div>
              
              <div className={`p-6 text-center ${fadeIn({ direction: 'up', index: 1 })}`}>
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-ruway-primary/10 flex items-center justify-center">
                    <Truck className="h-6 w-6 text-ruway-primary" />
                  </div>
                </div>
                <h3 className="text-lg font-medium text-ruway-secondary mb-2">Envío Rápido</h3>
                <p className="text-ruway-gray">Envíos a todo el Perú. Gratis en compras mayores a S/200.</p>
              </div>
              
              <div className={`p-6 text-center ${fadeIn({ direction: 'up', index: 2 })}`}>
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-ruway-primary/10 flex items-center justify-center">
                    <ShieldCheck className="h-6 w-6 text-ruway-primary" />
                  </div>
                </div>
                <h3 className="text-lg font-medium text-ruway-secondary mb-2">Soporte Técnico</h3>
                <p className="text-ruway-gray">Asistencia técnica especializada para todos tus proyectos.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <div className="mb-10 flex justify-between items-center">
              <h2 className="text-2xl md:text-3xl font-bold text-ruway-secondary">
                Categorías
              </h2>
              <Link 
                to="/categorias" 
                className="text-ruway-primary hover:text-ruway-primary/80 flex items-center transition-colors"
              >
                Ver todo <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-36 bg-gray-200 rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category, index) => (
                  <CategoryCard 
                    key={category.id} 
                    category={category} 
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="mb-10 flex justify-between items-center">
              <h2 className="text-2xl md:text-3xl font-bold text-ruway-secondary">
                Productos Destacados
              </h2>
              <Link 
                to="/productos" 
                className="text-ruway-primary hover:text-ruway-primary/80 flex items-center transition-colors"
              >
                Ver todo <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-80 bg-gray-200 rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {featuredProducts.slice(0, 8).map((product, index) => (
                  <ProductCard 
                    key={product.id} 
                    product={product}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-12 bg-ruway-secondary text-white">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="text-center md:text-left mb-6 md:mb-0">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">¿Listo para comenzar tu proyecto?</h2>
                <p className="text-white/80">Encuentra todo lo que necesitas en un solo lugar.</p>
              </div>
              <Button 
                size="lg" 
                className="bg-white text-ruway-secondary hover:bg-white/90"
                asChild
              >
                <Link to="/productos">
                  Comprar Ahora <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
