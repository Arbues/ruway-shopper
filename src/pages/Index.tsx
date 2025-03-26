import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Zap } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ui/ProductCard";
import CategoryCard from "@/components/ui/CategoryCard";
import { fetchProducts, fetchCategories, Product, Category } from "@/services/api";
import { fadeIn } from "@/utils/animations";

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch featured products
        const productsData = await fetchProducts();
        setProducts(productsData.slice(0, 4)); // Show only 4 featured products
        
        // Fetch categories
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error loading home data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  return (
    <div className="bg-infinitywits-cream">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-24 bg-infinitywits-cream">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className={fadeIn({ direction: 'left' })}>
              <h1 className="text-5xl font-bold text-infinitywits-navy mb-4">
                Impulsa tu Innovación con Componentes de Calidad
              </h1>
              <p className="text-ruway-gray text-lg mb-6">
                Descubre un mundo de posibilidades con nuestra selección de componentes electrónicos de vanguardia.
              </p>
              <Link to="/productos">
                <Button size="lg">
                  Explorar Productos
                  <Zap className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <div className={fadeIn({ direction: 'right' })}>
              <img
                src="/hero-image.svg"
                alt="Componentes Electrónicos"
                className="w-full rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className={fadeIn({ direction: 'down' })}>
            <h2 className="text-3xl font-bold text-infinitywits-navy mb-2">
              Productos Destacados
            </h2>
            <p className="text-ruway-gray mb-8">
              Nuestra selección de productos más populares y de alta calidad
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
            {isLoading ? (
              Array(4).fill(0).map((_, index) => (
                <div 
                  key={`prod-skeleton-${index}`} 
                  className="h-64 bg-gray-200 rounded-lg animate-pulse"
                ></div>
              ))
            ) : products.length === 0 ? (
              <p className="col-span-full text-center text-gray-500">
                No hay productos destacados disponibles
              </p>
            ) : (
              products.map((product, index) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  index={index}
                />
              ))
            )}
          </div>
          
          <div className={`mt-10 text-center ${fadeIn({ direction: 'up' })}`}>
            <Link to="/productos">
              <Button>
                Ver todos los productos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className={fadeIn({ direction: 'down' })}>
            <h2 className="text-3xl font-bold text-infinitywits-navy mb-2">
              Categorías de Productos
            </h2>
            <p className="text-ruway-gray mb-8">
              Explora nuestra amplia gama de categorías para encontrar lo que necesitas
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
            {isLoading ? (
              Array(8).fill(0).map((_, index) => (
                <div 
                  key={`cat-skeleton-${index}`} 
                  className="h-48 bg-gray-200 rounded-lg animate-pulse"
                ></div>
              ))
            ) : categories.length === 0 ? (
              <p className="col-span-full text-center text-gray-500">
                No hay categorías disponibles
              </p>
            ) : (
              categories.map((category, index) => (
                <CategoryCard 
                  key={category.id} 
                  category={category} 
                  index={index}
                />
              ))
            )}
          </div>
          
          <div className={`mt-10 text-center ${fadeIn({ direction: 'up' })}`}>
            <Link to="/productos">
              <Button>
                Ver todas las categorías
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Why Choose Us Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className={fadeIn({ direction: 'down' })}>
            <h2 className="text-3xl font-bold text-infinitywits-navy mb-2">
              ¿Por qué elegirnos?
            </h2>
            <p className="text-ruway-gray mb-8">
              Comprometidos con la calidad, innovación y satisfacción del cliente
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className={fadeIn({ direction: 'left', delay: 0.2 })}>
              <h3 className="text-xl font-semibold text-infinitywits-navy mb-2">
                Amplia Selección
              </h3>
              <p className="text-ruway-gray">
                Contamos con un extenso catálogo de componentes electrónicos para cubrir todas tus necesidades.
              </p>
            </div>
            <div className={fadeIn({ direction: 'up', delay: 0.4 })}>
              <h3 className="text-xl font-semibold text-infinitywits-navy mb-2">
                Calidad Garantizada
              </h3>
              <p className="text-ruway-gray">
                Trabajamos con los mejores fabricantes para asegurar la calidad y durabilidad de nuestros productos.
              </p>
            </div>
            <div className={fadeIn({ direction: 'right', delay: 0.6 })}>
              <h3 className="text-xl font-semibold text-infinitywits-navy mb-2">
                Soporte Técnico
              </h3>
              <p className="text-ruway-gray">
                Ofrecemos asesoramiento técnico especializado para ayudarte en tus proyectos.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 bg-infinitywits-navy text-white">
        <div className="container-custom text-center">
          <div className={fadeIn({ direction: 'down' })}>
            <h2 className="text-4xl font-bold mb-4">
              ¿Listo para tu próximo proyecto?
            </h2>
            <p className="text-lg mb-8">
              Encuentra los componentes que necesitas y da vida a tus ideas.
            </p>
            <Link to="/productos">
              <Button variant="secondary" size="lg">
                Explorar Componentes
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
