
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { searchProducts, Product } from "@/services/api";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  className?: string;
  isMobile?: boolean;
}

const SearchBar = ({ className, isMobile = false }: SearchBarProps) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const searchBarRef = useRef<HTMLDivElement>(null);

  // Buscar productos cuando el usuario escribe
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const results = await searchProducts(searchQuery);
        setSearchResults(results.slice(0, 5)); // Limitamos a 5 resultados para no sobrecargar la UI
      } catch (error) {
        console.error("Error searching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSearchResults, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Cerrar la búsqueda al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Manejar la búsqueda completa
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setOpen(false);
      setSearchQuery("");
    }
  };

  // Formatear el precio
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(price);
  };

  return (
    <div ref={searchBarRef} className={cn("relative w-full", className)}>
      <form onSubmit={handleSearch}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Buscar productos..."
                className={cn(
                  "pr-8 border-infinitywits-navy focus:ring-infinitywits-blue w-full",
                  isMobile ? "text-base" : ""
                )}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value.trim().length >= 2) {
                    setOpen(true);
                  } else {
                    setOpen(false);
                  }
                }}
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 flex items-center px-2"
              >
                <Search className="h-5 w-5 text-infinitywits-navy" />
              </button>
            </div>
          </PopoverTrigger>
          <PopoverContent 
            className="p-0 border-infinitywits-navy bg-infinitywits-cream w-full max-w-[350px] md:max-w-[450px]"
            align="start"
            sideOffset={5}
          >
            <Command className="bg-infinitywits-cream rounded-lg">
              <CommandList>
                {isLoading ? (
                  <div className="py-6 text-center">
                    <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-infinitywits-navy border-t-transparent"></div>
                    <div className="mt-2 text-sm text-infinitywits-navy">Buscando...</div>
                  </div>
                ) : (
                  <>
                    <CommandEmpty className="py-6 text-center text-sm text-infinitywits-navy">
                      No se encontraron productos.
                    </CommandEmpty>
                    <CommandGroup heading="Productos sugeridos">
                      {searchResults.map((product) => (
                        <CommandItem
                          key={product.id}
                          onSelect={() => {
                            navigate(`/producto/${product.id}`);
                            setOpen(false);
                            setSearchQuery("");
                          }}
                          className="flex items-center py-3 hover:bg-infinitywits-lightblue cursor-pointer"
                        >
                          <div className="flex w-full items-center gap-2">
                            <div className="h-12 w-12 overflow-hidden rounded-md bg-infinitywits-lightblue flex-shrink-0">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="flex flex-col flex-1 min-w-0">
                              <p className="text-sm font-medium text-infinitywits-navy truncate">
                                {product.name}
                              </p>
                              <p className="text-sm font-bold text-infinitywits-blue">
                                {formatPrice(product.price)}
                              </p>
                            </div>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                    {searchQuery.trim().length >= 2 && (
                      <div className="p-2 border-t border-gray-200">
                        <button
                          onClick={(e) => {
                            handleSearch(e);
                          }}
                          className="w-full py-2 text-sm text-center text-infinitywits-cream bg-infinitywits-navy rounded-md hover:bg-infinitywits-navy/90 transition-colors"
                        >
                          Ver todos los resultados
                        </button>
                      </div>
                    )}
                  </>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </form>
    </div>
  );
};

export default SearchBar;
