import ProductCard from "./ProductCard";
import { AnimatePresence, motion } from "framer-motion";
import type { Product } from "@/data/products";
import { useConfigStore } from "@/store/useConfigStore";

interface ProductListProps {
  category: string;
  onAddToCart: (product: Product) => void;
}

const ProductList = ({ category, onAddToCart }: ProductListProps) => {
  const products = useConfigStore((s) => s.products);

  const filtered =
    category === "Todos"
      ? products
      : products.filter((p) => p.category === category);

  const grouped = category === "Todos"
    ? Array.from(new Set(filtered.map((p) => p.category))).map((cat) => ({
        category: cat,
        items: filtered.filter((p) => p.category === cat),
      }))
    : [{ category, items: filtered }];

  return (
    <div className="px-4 py-4 space-y-6 pb-28">
      <AnimatePresence mode="wait">
        <motion.div
          key={category}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
          className="space-y-6"
        >
          {grouped.map((group) => (
            <div key={group.category}>
              {category === "Todos" && (
                <h2 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
                  <span className="w-1 h-5 bg-primary rounded-full" />
                  {group.category}
                </h2>
              )}
              <div className="space-y-3">
                {group.items.map((product, i) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAdd={onAddToCart}
                    index={i}
                  />
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ProductList;
