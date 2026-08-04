import { Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  isOpen: boolean;
  logoUrl?: string;
}

const Header = ({ isOpen, logoUrl }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center shrink-0 overflow-hidden">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo Espetinho Chama na Brasa" className="w-full h-full object-cover" />
          ) : (
            <Flame className="w-6 h-6 text-primary" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-foreground leading-tight truncate">
            Espetinho Chama na Brasa
          </h1>
          <p className="text-xs text-muted-foreground">Churrasco de verdade 🔥</p>
        </div>
        <Badge
          className={`shrink-0 text-xs px-2 py-0.5 ${
            isOpen
              ? "bg-green-600/20 text-green-400 border-green-600/30"
              : "bg-destructive/20 text-red-400 border-destructive/30"
          }`}
          variant="outline"
        >
          {isOpen ? "Aberto" : "Fechado"}
        </Badge>
      </div>
    </header>
  );
};

export default Header;
