import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Trash2, ArrowRight, ArrowLeft } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/context/CartContext";
import { fadeIn } from "@/utils/animations";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { items, totalPrice, updateItemQuantity, removeItem, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const navigate = useNavigate();

  const handleQuantityChange = (productId: string, quantity: number) => {
    updateItemQuantity(productId, quantity);
  };

  const handleRemoveItem = (productId: string) => {
    removeItem(productId);
  };

  const handleApplyCoupon = () => {
    setIsApplyingCoupon(true);
    setTimeout(() => {
      setIsApplyingCoupon(false);
      // For MVP, we're not implementing actual coupon functionality
      if (couponCode) {
        // toast.error("Cupón inválido o expirado");
        setCouponCode("");
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container-custom">
          <div className={fadeIn({ direction: 'down' })}>
            <h1 className="text-3xl font-bold text-ruway-secondary mb-2">
              Carrito de Compras
            </h1>
            <p className="text-ruway-gray mb-6">
              {items.length} {items.length === 1 ? "producto" : "productos"} en tu carrito
            </p>
          </div>

          {items.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${fadeIn({ direction: 'right' })}`}>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">Producto</TableHead>
                          <TableHead>Descripción</TableHead>
                          <TableHead className="text-right">Precio</TableHead>
                          <TableHead className="text-center">Cantidad</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {items.map(({ product, quantity }) => (
                          <TableRow key={product.id}>
                            <TableCell>
                              <div className="w-20 h-20 rounded-md border border-gray-200 overflow-hidden">
                                <img 
                                  src={product.image} 
                                  alt={product.name}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                            </TableCell>
                            <TableCell>
                              <Link 
                                to={`/producto/${product.id}`}
                                className="font-medium text-ruway-secondary hover:text-ruway-primary transition-colors"
                              >
                                {product.name}
                              </Link>
                              <div className="text-xs text-ruway-gray mt-1">
                                #{product.sku}
                              </div>
                              <div className={`text-xs mt-1 ${
                                product.stockStatus === 'En Stock' 
                                  ? "text-ruway-accent" 
                                  : "text-destructive"
                              }`}>
                                {product.stockStatus}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              S/ {product.price.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-center">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 rounded-l-md rounded-r-none"
                                  onClick={() => handleQuantityChange(product.id, quantity - 1)}
                                  disabled={quantity <= 1}
                                >
                                  -
                                </Button>
                                <Input
                                  type="number"
                                  min="1"
                                  value={quantity}
                                  onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value) || 1)}
                                  className="h-8 w-12 rounded-none text-center p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 rounded-r-md rounded-l-none"
                                  onClick={() => handleQuantityChange(product.id, quantity + 1)}
                                >
                                  +
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              S/ {(product.price * quantity).toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-ruway-gray hover:text-destructive"
                                onClick={() => handleRemoveItem(product.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  <div className="p-4 border-t border-gray-200 flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm"
                      asChild
                    >
                      <Link to="/productos" className="flex items-center">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Continuar Comprando
                      </Link>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={clearCart}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Vaciar Carrito
                    </Button>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className={`border-gray-200 ${fadeIn({ direction: 'left' })}`}>
                  <CardHeader>
                    <CardTitle>Resumen del Pedido</CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Coupon Code */}
                    <div className="space-y-2">
                      <label htmlFor="coupon" className="text-sm font-medium text-ruway-secondary">
                        Cupón de Descuento
                      </label>
                      <div className="flex space-x-2">
                        <Input
                          id="coupon"
                          placeholder="Ingresa tu código"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                        />
                        <Button 
                          variant="outline"
                          onClick={handleApplyCoupon}
                          disabled={!couponCode || isApplyingCoupon}
                        >
                          {isApplyingCoupon ? "Aplicando..." : "Aplicar"}
                        </Button>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {/* Price Summary */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-ruway-gray">
                        <span>Subtotal</span>
                        <span>S/ {totalPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-ruway-gray">
                        <span>Envío</span>
                        <span>{totalPrice >= 200 ? "Gratis" : "Calculado en el checkout"}</span>
                      </div>
                      {totalPrice < 200 && (
                        <div className="text-xs text-ruway-primary mt-1">
                          Añade S/ {(200 - totalPrice).toFixed(2)} más para obtener envío gratis
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between font-medium text-ruway-secondary">
                        <span>Total</span>
                        <span>S/ {totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      onClick={() => navigate('/checkout')} 
                      className="bg-infinitywits-navy hover:bg-infinitywits-navy/90"
                    >
                      Procesar Compra
                    </Button>
                  </CardFooter>
                </Card>
                
                {/* Payment Methods */}
                <div className="mt-6 bg-white rounded-lg border border-gray-200 p-4">
                  <h3 className="font-medium text-ruway-secondary mb-3">
                    Aceptamos
                  </h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-12 h-8 bg-gray-100 rounded"></div>
                    <div className="w-12 h-8 bg-gray-100 rounded"></div>
                    <div className="w-12 h-8 bg-gray-100 rounded"></div>
                    <div className="w-12 h-8 bg-gray-100 rounded"></div>
                  </div>
                </div>
                
                {/* Shipping Policy */}
                <div className="mt-4 bg-ruway-light rounded-lg p-4">
                  <h3 className="text-sm font-medium text-ruway-secondary mb-2">
                    Envío Gratis
                  </h3>
                  <p className="text-sm text-ruway-gray">
                    En compras mayores a S/200 a todo el Perú.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className={`flex flex-col items-center justify-center py-16 ${fadeIn({ direction: 'up' })}`}>
              <div className="bg-ruway-light w-24 h-24 rounded-full flex items-center justify-center mb-6">
                <ShoppingCart className="h-12 w-12 text-ruway-gray" />
              </div>
              <h2 className="text-2xl font-bold text-ruway-secondary mb-2">
                Tu carrito está vacío
              </h2>
              <p className="text-ruway-gray mb-6 max-w-md text-center">
                Parece que aún no has añadido productos a tu carrito. Explora nuestro catálogo para encontrar lo que necesitas.
              </p>
              <Button asChild>
                <Link to="/productos">
                  Explorar Productos
                </Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;
