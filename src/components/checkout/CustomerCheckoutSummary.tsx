
import React from 'react';
import { Package, ShoppingBag } from 'lucide-react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/context/CartContext';

const CustomerCheckoutSummary: React.FC = () => {
  const { items, totalItems, totalPrice } = useCart();

  return (
    <Card>
      <CardContent className="pt-6">
        <CardTitle className="flex items-center gap-2 mb-4">
          <ShoppingBag size={20} />
          Resumen de compra
        </CardTitle>
        
        <div className="space-y-4 mb-4">
          <div className="flex justify-between text-sm">
            <span>Productos ({totalItems})</span>
            <span>S/. {totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Envío</span>
            <span className="text-green-600">Gratis</span>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <div className="flex justify-between font-bold mb-6">
          <span>Total</span>
          <span>S/. {totalPrice.toFixed(2)}</span>
        </div>
        
        <div className="space-y-4 mt-6">
          <h3 className="font-semibold text-sm mb-2">Tus productos:</h3>
          {items.map((item) => (
            <div key={item.product.id} className="flex gap-3">
              <div className="w-16 h-16 rounded border overflow-hidden flex-shrink-0">
                <img 
                  src={item.product.image} 
                  alt={item.product.name} 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium line-clamp-2">{item.product.name}</h4>
                <div className="flex justify-between mt-1">
                  <span className="text-sm text-muted-foreground">Cant: {item.quantity}</span>
                  <span className="text-sm font-semibold">S/. {(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerCheckoutSummary;
