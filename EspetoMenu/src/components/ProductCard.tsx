import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import type { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
  index?: number;
}

const ProductCard = ({ product, onAdd, index = 0 }: ProductCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileTap={{ scale: 0.98 }}
      className="flex gap-3 bg-card rounded-lg p-3 border border-border hover:border-primary/30 transition-colors"
    >
      <div className="w-20 h-20 rounded-lg bg-secondary flex items-center justify-center shrink-0 overflow-hidden">
        <img src={product.image} alt={product.name} loading="eager" width={80} height={80} className="w-full h-full object-cover rounded-lg" />
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-foreground text-sm leading-tight">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
            {product.description}
          </p>
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-primary font-bold text-sm">
            R$ {product.price.toFixed(2)}
          </span>
          <motion.div whileTap={{ scale: 0.85 }}>
            <Button
              size="icon"
              className="h-8 w-8 rounded-full bg-primary hover:bg-primary/90 shadow-md shadow-primary/20"
              onClick={() => onAdd(product)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
