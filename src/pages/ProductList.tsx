import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Filter, X } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/ui/ProductCard";
import { fetchProductsByCategory, fetchProducts, searchProducts, Product } from "@/services/api";
import { fadeIn } from "@/utils/animations";

const ProductList = () => {
  const { categorySlug } = useParams();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q');

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOption, setSortOption] = useState('featured');
  const [stockFilter, setStockFilter] = useState<string | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const getPageTitle = () => {
    if (searchQuery) return `Resultados para "${searchQuery}"`;
    if (categorySlug) {
      const categoryName = categorySlug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      return categoryName;
    }
    return 'Todos los Productos';
  };

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        let productsData: Product[] = [];
        
        if (searchQuery) {
          productsData = await searchProducts(searchQuery);
        } else if (categorySlug) {
          productsData = await fetchProductsByCategory(categorySlug);
        } else {
          productsData = await fetchProducts();
        }
        
        setProducts(productsData);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [categorySlug, searchQuery]);

  const getFilteredAndSortedProducts = () => {
    let filteredProducts = [...products];
    
    if (stockFilter) {
      filteredProducts = filteredProducts.filter(p => p.stockStatus === stockFilter);
    }
    
    switch (sortOption) {
      case 'price-asc':
        return filteredProducts.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return filteredProducts.sort((a, b) => b.price - a.price);
      case 'name-asc':
        return filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
      case 'featured':
      default:
        return filteredProducts;
    }
  };

  const filteredAndSortedProducts = getFilteredAndSortedProducts();

  const handleStockFilterChange = (value: string) => {
    if (stockFilter === value) {
      setStockFilter(null);
    } else {
      setStockFilter(value);
    }
  };

  const clearFilters = () => {
    setStockFilter(null);
    setSortOption('featured');
  };

  const FiltersContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-ruway-secondary mb-3">Disponibilidad</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="filter-stock"
              checked={stockFilter === 'En Stock'}
              onCheckedChange={() => handleStockFilterChange('En Stock')}
            />
            <label 
              htmlFor="filter-stock"
              className="text-sm text-ruway-gray cursor-pointer"
            >
              En Stock
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="filter-outofstock"
              checked={stockFilter === 'Agotado'}
              onCheckedChange={() => handleStockFilterChange('Agotado')}
            />
            <label 
              htmlFor="filter-outofstock" 
              className="text-sm text-ruway-gray cursor-pointer"
            >
              Agotado
            </label>
          </div>
        </div>
      </div>

      <Separator />
      
      <Button 
        variant="outline"
        size="sm"
        className="w-full"
        onClick={clearFilters}
      >
        Limpiar Filtros
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container-custom">
          <div className={fadeIn({ direction: 'down' })}>
            <h1 className="text-3xl font-bold text-ruway-secondary mb-2">
              {getPageTitle()}
            </h1>
            
            {searchQuery && (
              <p className="text-ruway-gray mb-6">
                {filteredAndSortedProducts.length} resultados encontrados
              </p>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-8 mt-6">
            <div className="hidden md:block w-64 flex-shrink-0">
              <div className="sticky top-24 bg-white p-4 rounded-lg border border-gray-200">
                <h2 className="font-medium text-lg mb-4 text-ruway-secondary">Filtros</h2>
                <FiltersContent />
              </div>
            </div>

            <div className="md:hidden flex items-center justify-between mb-4">
              <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" /> Filtros
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader className="mb-6">
                    <SheetTitle>Filtros</SheetTitle>
                  </SheetHeader>
                  <FiltersContent />
                </SheetContent>
              </Sheet>

              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Destacados</SelectItem>
                  <SelectItem value="price-asc">Precio: Menor a Mayor</SelectItem>
                  <SelectItem value="price-desc">Precio: Mayor a Menor</SelectItem>
                  <SelectItem value="name-asc">Nombre: A-Z</SelectItem>
                  <SelectItem value="name-desc">Nombre: Z-A</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <div className="hidden md:flex items-center justify-between mb-6">
                <div className="text-sm text-ruway-gray">
                  Mostrando {filteredAndSortedProducts.length} productos
                </div>
                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger className="w-[220px]">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Destacados</SelectItem>
                    <SelectItem value="price-asc">Precio: Menor a Mayor</SelectItem>
                    <SelectItem value="price-desc">Precio: Mayor a Menor</SelectItem>
                    <SelectItem value="name-asc">Nombre: A-Z</SelectItem>
                    <SelectItem value="name-desc">Nombre: Z-A</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {stockFilter && (
                <div className="flex items-center mb-4">
                  <div className="text-sm text-ruway-gray mr-2">Filtros activos:</div>
                  <div className="inline-flex items-center bg-ruway-light text-ruway-secondary text-sm px-3 py-1 rounded-full">
                    {stockFilter}
                    <button 
                      className="ml-1"
                      onClick={() => setStockFilter(null)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              )}

              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-80 bg-gray-200 rounded-lg animate-pulse"></div>
                  ))}
                </div>
              ) : filteredAndSortedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAndSortedProducts.map((product, index) => (
                    <ProductCard 
                      key={product.id} 
                      product={product}
                      index={index}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium text-ruway-secondary mb-2">
                    No se encontraron productos
                  </h3>
                  <p className="text-ruway-gray">
                    Intente con otros filtros o términos de búsqueda.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductList;
