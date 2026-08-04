import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useConfigStore } from "@/store/useConfigStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Save, LogOut, Settings, Plus, Tag, Package, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/data/products";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

const AdminConfig = () => {
  const navigate = useNavigate();
  const {
    isLoading,
    fetchConfig,
    updateConfig,
    storeName,
    whatsappNumber,
    deliveryFee,
    openTime,
    closeTime,
    pixKey,
    products,
    categories,
    addCategory,
    addProduct,
    removeProduct,
    updateProductPrice,
  } = useConfigStore();

  const [formData, setFormData] = useState({
    storeName: "",
    whatsappNumber: "",
    deliveryFee: 0,
    openTime: "",
    closeTime: "",
    pixKey: "",
  });

  const [newCat, setNewCat] = useState("");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/login", { replace: true });
      } else {
        fetchConfig();
      }
    });

    return () => unsubscribe();
  }, [navigate, fetchConfig]);

  useEffect(() => {
    if (!isLoading) {
      setFormData({
        storeName,
        whatsappNumber,
        deliveryFee,
        openTime,
        closeTime,
        pixKey,
      });
      if (categories.length > 1 && !newProduct.category) {
        setNewProduct(prev => ({ ...prev, category: categories[1] }));
      }
    }
  }, [isLoading, storeName, whatsappNumber, deliveryFee, openTime, closeTime, pixKey, categories]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Sessão terminada!");
    } catch (error) {
      toast.error("Erro ao terminar sessão.");
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateConfig(formData);
      toast.success("Configurações guardadas com sucesso!");
    } catch (error) {
      toast.error("Erro ao guardar as configurações.");
    }
  };

  const handleAddCategory = () => {
    if (!newCat.trim()) return;
    addCategory(newCat.trim());
    setNewCat("");
    toast.success(`Categoria "${newCat.trim()}" adicionada!`);
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category) {
      toast.error("Preencha nome, preço e categoria.");
      return;
    }
    const product: Product = {
      id: `custom-${Date.now()}`,
      name: newProduct.name,
      description: newProduct.description,
      price: parseFloat(newProduct.price),
      category: newProduct.category,
      image: newProduct.image || "/placeholder.svg",
    };
    addProduct(product);
    setNewProduct({ name: "", description: "", price: "", category: categories[1] || "", image: "" });
    setShowAddProduct(false);
    toast.success(`"${product.name}" adicionado ao cardápio!`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background max-w-lg mx-auto p-4 space-y-6 pt-16">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-8 flex-1" />
        </div>
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    );
  }

  const productCategories = categories.filter((c) => c !== "Todos");

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto pb-24">
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border px-4 py-3 flex items-center gap-3">
        <Link to="/">
          <Button variant="ghost" size="icon" className="shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-lg font-bold text-foreground flex-1">Administração</h1>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </header>

      <div className="flex gap-2 px-4 pt-4">
        <Link
          to="/administrador/config"
          className="flex-1 text-center text-xs font-semibold py-2 rounded-xl border border-primary bg-primary/10 text-primary transition-colors"
        >
          Configurações
        </Link>
        <Link
          to="/administrador/pedidos"
          className="flex-1 text-center text-xs font-semibold py-2 rounded-xl border border-border bg-card text-muted-foreground hover:border-muted-foreground/30 transition-colors"
        >
          Histórico de Pedidos
        </Link>
      </div>

      <main className="px-4 py-6 space-y-6">
        <form onSubmit={handleSaveSettings} className="space-y-4">
          <section className="bg-card rounded-xl border border-border p-4 space-y-4">
            <div className="flex items-center gap-2 text-foreground font-semibold">
              <Settings className="h-5 w-5 text-primary" />
              Configurações Gerais
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome da Loja</label>
              <Input
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">WhatsApp (com código país)</label>
              <Input
                value={formData.whatsappNumber}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                placeholder="Ex: 5511999999999"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Taxa de Entrega (R$)</label>
              <Input
                type="number"
                step="0.50"
                min="0"
                value={formData.deliveryFee}
                onChange={(e) => setFormData({ ...formData, deliveryFee: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Abertura</label>
                <Input
                  type="time"
                  value={formData.openTime}
                  onChange={(e) => setFormData({ ...formData, openTime: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Fecho</label>
                <Input
                  type="time"
                  value={formData.closeTime}
                  onChange={(e) => setFormData({ ...formData, closeTime: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Chave PIX</label>
              <Input
                value={formData.pixKey}
                onChange={(e) => setFormData({ ...formData, pixKey: e.target.value })}
              />
            </div>
            
            <Button type="submit" className="w-full mt-2">
              <Save className="h-4 w-4 mr-2" />
              Guardar Configurações
            </Button>
          </section>
        </form>

        {/* Categorias */}
        <section className="bg-card rounded-xl border border-border p-4 space-y-3">
          <div className="flex items-center gap-2 text-foreground font-semibold">
            <Tag className="h-5 w-5 text-primary" />
            Categorias
          </div>
          <div className="flex flex-wrap gap-2">
            {productCategories.map((cat) => (
              <span
                key={cat}
                className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-medium"
              >
                {cat}
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Nova categoria..."
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
              className="flex-1"
            />
            <Button size="sm" onClick={handleAddCategory}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </section>

        {/* Produtos */}
        <section className="bg-card rounded-xl border border-border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-foreground font-semibold">
              <Package className="h-5 w-5 text-primary" />
              Produtos e Preços
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowAddProduct(!showAddProduct)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Novo
            </Button>
          </div>

          {showAddProduct && (
            <div className="bg-secondary/50 rounded-lg p-3 space-y-2 border border-border">
              <Input
                placeholder="Nome do produto"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              />
              <Input
                placeholder="Descrição"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              />
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Preço"
                  step="0.50"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="w-28"
                />
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="flex-1 bg-background border border-input rounded-md px-3 py-2 text-sm text-foreground"
                >
                  {productCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <Input
                placeholder="URL da imagem (opcional)"
                value={newProduct.image}
                onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
              />
              <Button size="sm" className="w-full" onClick={handleAddProduct}>
                Adicionar Produto
              </Button>
            </div>
          )}

          <div className="space-y-2 max-h-[50vh] overflow-y-auto">
            {productCategories.map((cat) => {
              const catProducts = products.filter((p) => p.category === cat);
              if (catProducts.length === 0) return null;
              return (
                <div key={cat}>
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-3 mb-1.5">
                    {cat}
                  </h3>
                  {catProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-2 py-2 border-b border-border/50 last:border-0"
                    >
                      <div className="w-8 h-8 rounded bg-secondary overflow-hidden shrink-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="flex-1 text-sm text-foreground truncate">
                        {product.name}
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-muted-foreground">R$</span>
                        <Input
                          type="number"
                          step="0.50"
                          min="0"
                          value={product.price}
                          onChange={(e) =>
                            updateProductPrice(product.id, parseFloat(e.target.value) || 0)
                          }
                          className="w-20 h-8 text-sm"
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => {
                          removeProduct(product.id);
                          toast.success(`"${product.name}" removido!`);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </section>

      </main>
    </div>
  );
};

export default AdminConfig;
