
import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCart } from "@/context/CartContext";
import { Product } from "@/services/api";
import { cn } from "@/lib/utils";
import { fadeIn } from "@/utils/animations";

interface ProductCardProps {
  product: Product;
  className?: string;
  index?: number;
}

const ProductCard = ({ product, className, index = 0 }: ProductCardProps) => {
  const { addItem } = useCart();
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
  };

  return (
    <Card 
      className={cn(
        "relative overflow-hidden card-hover border border-gray-200 transition-standard",
        fadeIn({ 
          direction: 'up', 
          staggerChildren: true, 
          delayMultiplier: 0.1, 
          index 
        }),
        className
      )}
    >
      <Link to={`/producto/${product.id}`} className="block">
        {/* Stock Label */}
        <div className="absolute top-3 left-3 z-10">
          <span 
            className={cn(
              "text-xs font-medium py-1 px-2 rounded-md",
              product.stockStatus === 'En Stock' 
                ? "bg-ruway-accent/10 text-ruway-accent"
                : "bg-destructive/10 text-destructive"
            )}
          >
            {product.stockStatus}
          </span>
        </div>

        {/* Product Image */}
        <div className="relative h-48 w-full bg-ruway-light overflow-hidden">
          {!isImageLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
          )}
          <img
            src={product.image}
            alt={product.name}
            className={cn(
              "w-full h-full object-contain transition-all duration-500 hover:scale-105",
              !isImageLoaded ? "opacity-0" : "opacity-100"
            )}
            onLoad={() => setIsImageLoaded(true)}
          />
          
          {/* Quick Actions Overlay */}
          <div className="absolute inset-0 bg-black/0 flex items-center justify-center gap-2 opacity-0 hover:opacity-100 hover:bg-black/10 transition-all duration-300">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    size="icon"
                    variant="secondary"
                    className="rounded-full bg-white text-ruway-secondary hover:bg-white/90"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Agregar al carrito</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to={`/producto/${product.id}`}>
                    <Button 
                      size="icon"
                      variant="secondary"
                      className="rounded-full bg-white text-ruway-secondary hover:bg-white/90"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Ver detalles</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <CardContent className="p-4">
          {/* SKU */}
          <div className="text-xs text-ruway-gray mb-1">#{product.sku}</div>
          
          {/* Product Name */}
          <h3 className="font-medium text-ruway-secondary hover:text-ruway-primary transition-colors line-clamp-2 h-12">
            {product.name}
          </h3>
          
          {/* Price */}
          <div className="mt-2 flex items-baseline">
            <span className="text-lg font-bold text-ruway-secondary">
              S/ {product.price.toFixed(2)}
            </span>
            
            {product.originalPrice && (
              <span className="ml-2 text-sm text-ruway-gray line-through">
                S/ {product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          
          {/* Add to Cart Button (Mobile-friendly) */}
          <Button 
            className="w-full mt-3 md:hidden"
            onClick={handleAddToCart}
          >
            Agregar al carrito
          </Button>
        </CardContent>
      </Link>
    </Card>
  );
};

export default ProductCard;
