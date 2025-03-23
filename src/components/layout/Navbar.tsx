
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import CartSidebar from "@/components/cart/CartSidebar";
import { fadeIn } from "@/utils/animations";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { totalItems, toggleCart } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-infinitywits-cream/90 backdrop-blur-md shadow-sm" : "bg-infinitywits-cream"
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link 
            to="/" 
            className={fadeIn({ direction: 'down' })}
          >
            <h1 className="text-2xl font-bold text-infinitywits-navy">
              Infinity<span className="text-infinitywits-blue">Wits</span>
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/productos" 
              className="text-infinitywits-navy hover:text-infinitywits-blue transition-colors"
            >
              Productos
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-infinitywits-navy hover:text-infinitywits-blue transition-colors flex items-center">
                  Categorías <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-infinitywits-cream border-infinitywits-navy">
                <DropdownMenuLabel>Categorías</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/categoria/microcontroladores" className="text-infinitywits-navy hover:text-infinitywits-blue">Microcontroladores</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/categoria/herramientas" className="text-infinitywits-navy hover:text-infinitywits-blue">Herramientas</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/categoria/fuentes-reguladores" className="text-infinitywits-navy hover:text-infinitywits-blue">Fuentes y Reguladores</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/categoria/accesorios-prototipado" className="text-infinitywits-navy hover:text-infinitywits-blue">Accesorios y Prototipado</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Search + User Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <form 
              onSubmit={handleSearch} 
              className="hidden md:flex relative rounded-md w-64"
            >
              <Input
                type="text"
                placeholder="Buscar productos..."
                className="pr-8 border-infinitywits-navy focus:ring-infinitywits-blue"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 flex items-center px-2"
              >
                <Search className="h-5 w-5 text-infinitywits-navy" />
              </button>
            </form>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="rounded-full text-infinitywits-navy hover:text-infinitywits-blue hover:bg-infinitywits-navy/10"
                >
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-infinitywits-cream border-infinitywits-navy">
                <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isAuthenticated ? (
                  <>
                    <DropdownMenuItem>
                      <span className="text-sm font-medium text-infinitywits-navy">Hola, {user?.name}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/perfil" className="text-infinitywits-navy hover:text-infinitywits-blue">Mi Perfil</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/pedidos" className="text-infinitywits-navy hover:text-infinitywits-blue">Mis Pedidos</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-infinitywits-navy hover:text-infinitywits-blue">
                      Cerrar Sesión
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/login" className="text-infinitywits-navy hover:text-infinitywits-blue">Iniciar Sesión</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/registro" className="text-infinitywits-navy hover:text-infinitywits-blue">Registrarse</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full relative text-infinitywits-navy hover:text-infinitywits-blue hover:bg-infinitywits-navy/10"
              onClick={toggleCart}
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-infinitywits-blue text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </Button>

            {/* Mobile Menu Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-infinitywits-navy hover:text-infinitywits-blue hover:bg-infinitywits-navy/10"
                  onClick={() => setIsMobileMenuOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-infinitywits-cream border-infinitywits-navy">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-8">
                    <Link 
                      to="/" 
                      className="text-xl font-bold text-infinitywits-navy"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Infinity<span className="text-infinitywits-blue">Wits</span>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-infinitywits-navy hover:text-infinitywits-blue hover:bg-infinitywits-navy/10"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Mobile Search */}
                  <form onSubmit={handleSearch} className="mb-6">
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Buscar productos..."
                        className="w-full pr-8 border-infinitywits-navy focus:ring-infinitywits-blue"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <button
                        type="submit"
                        className="absolute inset-y-0 right-0 flex items-center px-2"
                      >
                        <Search className="h-5 w-5 text-infinitywits-navy" />
                      </button>
                    </div>
                  </form>

                  {/* Mobile Links */}
                  <nav className="flex flex-col space-y-4">
                    <Link
                      to="/productos"
                      className="py-2 text-infinitywits-navy hover:text-infinitywits-blue transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Todos los Productos
                    </Link>
                    <div className="py-2">
                      <h3 className="font-medium mb-2 text-infinitywits-navy">Categorías</h3>
                      <div className="flex flex-col space-y-2 pl-4">
                        <Link
                          to="/categoria/microcontroladores"
                          className="text-infinitywits-blue hover:text-infinitywits-navy transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Microcontroladores
                        </Link>
                        <Link
                          to="/categoria/herramientas"
                          className="text-infinitywits-blue hover:text-infinitywits-navy transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Herramientas
                        </Link>
                        <Link
                          to="/categoria/fuentes-reguladores"
                          className="text-infinitywits-blue hover:text-infinitywits-navy transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Fuentes y Reguladores
                        </Link>
                        <Link
                          to="/categoria/accesorios-prototipado"
                          className="text-infinitywits-blue hover:text-infinitywits-navy transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Accesorios y Prototipado
                        </Link>
                      </div>
                    </div>
                  </nav>

                  <div className="mt-auto">
                    {isAuthenticated ? (
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-infinitywits-navy">Hola, {user?.name}</div>
                        <Link
                          to="/perfil"
                          className="block py-2 text-infinitywits-navy hover:text-infinitywits-blue transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Mi Perfil
                        </Link>
                        <Link
                          to="/pedidos"
                          className="block py-2 text-infinitywits-navy hover:text-infinitywits-blue transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Mis Pedidos
                        </Link>
                        <Button
                          variant="ghost"
                          className="w-full justify-start p-0 hover:bg-transparent"
                          onClick={() => {
                            logout();
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          <span className="py-2 text-infinitywits-navy hover:text-infinitywits-blue transition-colors">
                            Cerrar Sesión
                          </span>
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Link
                          to="/login"
                          className="block py-2 text-infinitywits-navy hover:text-infinitywits-blue transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Iniciar Sesión
                        </Link>
                        <Link
                          to="/registro"
                          className="block py-2 text-infinitywits-navy hover:text-infinitywits-blue transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Registrarse
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      <CartSidebar />
    </header>
  );
};

export default Navbar;
