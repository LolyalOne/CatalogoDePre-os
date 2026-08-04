import { motion } from "framer-motion";
import { useConfigStore } from "@/store/useConfigStore";

interface CategoryNavProps {
  selected: string;
  onSelect: (category: string) => void;
}

const CategoryNav = ({ selected, onSelect }: CategoryNavProps) => {
  const categories = useConfigStore((s) => s.categories);

  return (
    <nav className="sticky top-[73px] z-30 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="flex gap-2 px-4 py-3 overflow-x-auto no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`relative shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selected === cat
                ? "text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {selected === cat && (
              <motion.span
                layoutId="category-pill"
                className="absolute inset-0 bg-primary rounded-full shadow-lg shadow-primary/25"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{cat}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default CategoryNav;
