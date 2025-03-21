
import { ShoppingCart, X, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import CartItem from "./CartItem";
import { Link } from "react-router-dom";

const CartSidebar = () => {
  const { 
    items, 
    isOpen, 
    closeCart, 
    totalItems, 
    totalPrice 
  } = useCart();

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader className="px-1">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              <span>Carrito de Compras</span>
              {totalItems > 0 && (
                <span className="ml-1 inline-flex items-center justify-center bg-ruway-primary text-white text-xs rounded-full h-5 px-2">
                  {totalItems}
                </span>
              )}
            </SheetTitle>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={closeCart}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </SheetHeader>
        
        {items.length > 0 ? (
          <>
            <div className="flex-1 overflow-y-auto py-6 px-1">
              <div className="space-y-1">
                {items.map(item => (
                  <CartItem key={item.product.id} item={item} />
                ))}
              </div>
            </div>
            
            <div className="mt-6 px-1">
              <Separator />
              <div className="mt-4 space-y-3">
                <div className="flex justify-between text-base text-ruway-gray">
                  <p>Subtotal</p>
                  <p>S/ {totalPrice.toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-base text-ruway-gray">
                  <p>Envío</p>
                  <p>Calculado en el checkout</p>
                </div>
                <Separator />
                <div className="flex justify-between text-base font-medium text-ruway-secondary">
                  <p>Total</p>
                  <p>S/ {totalPrice.toFixed(2)}</p>
                </div>
                
                <div className="mt-6 space-y-3">
                  <Button 
                    className="w-full" 
                    size="lg"
                    asChild
                  >
                    <Link to="/checkout" onClick={closeCart}>
                      Proceder al Pago
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    asChild
                  >
                    <Link to="/carrito" onClick={closeCart}>
                      Ver Carrito
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4 p-8">
            <div className="bg-ruway-light w-20 h-20 rounded-full flex items-center justify-center">
              <ShoppingBag className="h-10 w-10 text-ruway-gray" />
            </div>
            <h3 className="text-lg font-medium text-ruway-secondary">
              Tu carrito está vacío
            </h3>
            <p className="text-ruway-gray text-center">
              Parece que no has añadido ningún producto a tu carrito todavía.
            </p>
            <Button 
              className="mt-4" 
              asChild
            >
              <Link to="/productos" onClick={closeCart}>
                Explorar Productos
              </Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartSidebar;
