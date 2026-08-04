import { useState } from "react";
import Header from "@/components/Header";
import { logoImg } from "@/data/products";
import CategoryNav from "@/components/CategoryNav";
import ProductList from "@/components/ProductList";
import CartBar from "@/components/CartBar";
import CartModal from "@/components/CartModal";
import type { Product, CartItem } from "@/data/products";

const Index = () => {
  const [isOpen] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const handleAddToCart = (product: Product) => {
    console.log("handleAddToCart", product.id);
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleUpdateQty = (id: string, delta: number) => {
    console.log("handleUpdateQty", id, delta);
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const handleRemove = (id: string) => {
    console.log("handleRemoveFromCart", id);
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const handleCheckout = () => {
    console.log("handleCheckout — enviar para WhatsApp");
  };

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto">
      <Header isOpen={isOpen} logoUrl={logoImg} />
      <CategoryNav selected={selectedCategory} onSelect={setSelectedCategory} />
      <ProductList category={selectedCategory} onAddToCart={handleAddToCart} />
      <CartBar items={cart} onOpenCart={() => setCartOpen(true)} />
      <CartModal
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cart}
        onUpdateQty={handleUpdateQty}
        onRemove={handleRemove}
        onCheckout={handleCheckout}
      />
    </div>
  );
};

export default Index;
