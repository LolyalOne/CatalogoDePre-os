import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CartItem } from "@/data/products";

interface CartBarProps {
  items: CartItem[];
  onOpenCart: () => void;
}

const CartBar = ({ items, onOpenCart }: CartBarProps) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-slide-up">
      <Button
        onClick={onOpenCart}
        className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl shadow-xl shadow-primary/30 flex items-center justify-between px-5"
      >
        <div className="flex items-center gap-2">
          <div className="bg-primary-foreground/20 rounded-full w-7 h-7 flex items-center justify-center">
            <span className="text-sm font-bold">{totalItems}</span>
          </div>
          <span className="font-semibold">Ver Carrinho</span>
        </div>
        <span className="font-bold">R$ {totalPrice.toFixed(2)}</span>
      </Button>
    </div>
  );
};

export default CartBar;
