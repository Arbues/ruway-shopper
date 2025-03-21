
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { CartItem as CartItemType } from "@/context/CartContext";
import { cn } from "@/lib/utils";

interface CartItemProps {
  item: CartItemType;
  className?: string;
}

const CartItem = ({ item, className }: CartItemProps) => {
  const { product, quantity } = item;
  const { updateItemQuantity, removeItem } = useCart();

  const handleQuantityChange = (newQuantity: number) => {
    updateItemQuantity(product.id, newQuantity);
  };

  const handleRemoveItem = () => {
    removeItem(product.id);
  };

  return (
    <div className={cn("flex py-4 border-b border-gray-200 last:border-0", className)}>
      {/* Product Image */}
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-contain object-center"
        />
      </div>

      {/* Product Details */}
      <div className="ml-4 flex flex-1 flex-col">
        <div className="flex justify-between text-base font-medium text-ruway-secondary">
          <h3 className="line-clamp-2">
            {product.name}
          </h3>
          <p className="ml-4 whitespace-nowrap">
            S/ {(product.price * quantity).toFixed(2)}
          </p>
        </div>
        <p className="mt-1 text-sm text-ruway-gray">#{product.sku}</p>
        
        {/* Quantity Controls */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center border border-gray-200 rounded-md">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none rounded-l-md text-ruway-gray hover:text-ruway-secondary"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-sm font-medium text-ruway-secondary">
              {quantity}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none rounded-r-md text-ruway-gray hover:text-ruway-secondary"
              onClick={() => handleQuantityChange(quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-ruway-gray hover:text-destructive"
            onClick={handleRemoveItem}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
