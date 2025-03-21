
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
        isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-white"
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link 
            to="/" 
            className={fadeIn({ direction: 'down' })}
          >
            <h1 className="text-2xl font-bold text-ruway-secondary">
              Ruway<span className="text-ruway-primary">.</span>
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/productos" 
              className="nav-link"
            >
              Productos
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="nav-link flex items-center">
                  Categorías <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Categorías</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/categoria/microcontroladores">Microcontroladores</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/categoria/herramientas">Herramientas</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/categoria/fuentes-reguladores">Fuentes y Reguladores</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/categoria/accesorios-prototipado">Accesorios y Prototipado</Link>
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
                className="pr-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 flex items-center px-2"
              >
                <Search className="h-5 w-5 text-ruway-gray" />
              </button>
            </form>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="rounded-full"
                >
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isAuthenticated ? (
                  <>
                    <DropdownMenuItem>
                      <span className="text-sm font-medium">Hola, {user?.name}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/perfil">Mi Perfil</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/pedidos">Mis Pedidos</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      Cerrar Sesión
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/login">Iniciar Sesión</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/registro">Registrarse</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full relative"
              onClick={toggleCart}
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-ruway-primary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
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
                  className="md:hidden"
                  onClick={() => setIsMobileMenuOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-8">
                    <Link 
                      to="/" 
                      className="text-xl font-bold text-ruway-secondary"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Ruway<span className="text-ruway-primary">.</span>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
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
                        className="w-full pr-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <button
                        type="submit"
                        className="absolute inset-y-0 right-0 flex items-center px-2"
                      >
                        <Search className="h-5 w-5 text-ruway-gray" />
                      </button>
                    </div>
                  </form>

                  {/* Mobile Links */}
                  <nav className="flex flex-col space-y-4">
                    <Link
                      to="/productos"
                      className="py-2 text-ruway-secondary hover:text-ruway-primary transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Todos los Productos
                    </Link>
                    <div className="py-2">
                      <h3 className="font-medium mb-2">Categorías</h3>
                      <div className="flex flex-col space-y-2 pl-4">
                        <Link
                          to="/categoria/microcontroladores"
                          className="text-ruway-gray hover:text-ruway-primary transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Microcontroladores
                        </Link>
                        <Link
                          to="/categoria/herramientas"
                          className="text-ruway-gray hover:text-ruway-primary transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Herramientas
                        </Link>
                        <Link
                          to="/categoria/fuentes-reguladores"
                          className="text-ruway-gray hover:text-ruway-primary transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Fuentes y Reguladores
                        </Link>
                        <Link
                          to="/categoria/accesorios-prototipado"
                          className="text-ruway-gray hover:text-ruway-primary transition-colors"
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
                        <div className="text-sm font-medium">Hola, {user?.name}</div>
                        <Link
                          to="/perfil"
                          className="block py-2 text-ruway-secondary hover:text-ruway-primary transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Mi Perfil
                        </Link>
                        <Link
                          to="/pedidos"
                          className="block py-2 text-ruway-secondary hover:text-ruway-primary transition-colors"
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
                          <span className="py-2 text-ruway-secondary hover:text-ruway-primary transition-colors">
                            Cerrar Sesión
                          </span>
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Link
                          to="/login"
                          className="block py-2 text-ruway-secondary hover:text-ruway-primary transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Iniciar Sesión
                        </Link>
                        <Link
                          to="/registro"
                          className="block py-2 text-ruway-secondary hover:text-ruway-primary transition-colors"
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
