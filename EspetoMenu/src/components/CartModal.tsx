import { useState } from "react";
import { Minus, Plus, Trash2, Copy, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { useConfigStore } from "@/store/useConfigStore";
import type { CartItem } from "@/data/products";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface CartModalProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQty: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
}

const CartModal = ({
  open,
  onClose,
  items,
  onUpdateQty,
  onRemove,
  onCheckout,
}: CartModalProps) => {
  const {
    storeName,
    deliveryFee: storeDeliveryFee,
    openTime,
    closeTime,
    pixKey,
  } = useConfigStore();

  const [orderMode, setOrderMode] = useState("delivery");
  const [paymentMethod, setPaymentMethod] = useState("pix");
  const [changeAmount, setChangeAmount] = useState("");
  const [address, setAddress] = useState({
    street: "",
    number: "",
    neighborhood: "",
    reference: "",
  });

  const [isGeneratingPix, setIsGeneratingPix] = useState(false);
  const [pixData, setPixData] = useState<{ qrCodeBase64: string; qrCode: string } | null>(null);
  const [orderSaved, setOrderSaved] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const deliveryFee = orderMode === "delivery" ? storeDeliveryFee : 0;
  const total = subtotal + deliveryFee;

  const checkIfOpen = () => {
    if (!openTime || !closeTime) return true;
    
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTimeInMinutes = currentHours * 60 + currentMinutes;

    const [openH, openM] = openTime.split(":").map(Number);
    const [closeH, closeM] = closeTime.split(":").map(Number);
    const openTimeInMinutes = openH * 60 + openM;
    const closeTimeInMinutes = closeH * 60 + closeM;

    if (closeTimeInMinutes < openTimeInMinutes) {
      // Closes after midnight (e.g. 18:00 to 02:00)
      return currentTimeInMinutes >= openTimeInMinutes || currentTimeInMinutes <= closeTimeInMinutes;
    }

    return currentTimeInMinutes >= openTimeInMinutes && currentTimeInMinutes <= closeTimeInMinutes;
  };

  const isOpen = checkIfOpen();

  const saveOrderToFirestore = async () => {
    if (orderSaved && orderId) return orderId;
    try {
      const docRef = await addDoc(collection(db, "orders"), {
        items: items.map((i) => ({
          id: i.id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          image: i.image ?? null,
        })),
        customerName,
        customerPhone,
        subtotal,
        deliveryFee,
        total,
        paymentMethod,
        orderMode,
        address: orderMode === "delivery" ? address : null,
        changeAmount: paymentMethod === "cash" && changeAmount ? changeAmount : null,
        status: "pendente",
        storeName,
        createdAt: serverTimestamp(),
      });
      setOrderSaved(true);
      setOrderId(docRef.id);
      return docRef.id;
    } catch (err) {
      console.error("Falha ao gravar pedido no Firestore:", err);
      toast.warning("Pedido enviado, mas não foi possível registá-lo no histórico.");
      return null;
    }
  };

  const handleFinalizeOrder = async () => {
    if (!isOpen) {
      toast.error("O estabelecimento encontra-se fechado neste momento.");
      return;
    }

    if (!customerName.trim() || !customerPhone.trim()) {
      toast.error("Por favor, preencha o Nome Completo e o Telefone/WhatsApp.");
      return;
    }

    if (orderMode === "delivery" && (!address.street || !address.number || !address.neighborhood)) {
      toast.error("Preencha o endereço de entrega (Rua, Nº e Bairro).");
      return;
    }

    if (paymentMethod === "pix" && !pixData) {
      // Regista o pedido como pendente antes de gerar o Pix dinâmico
      const savedOrderId = await saveOrderToFirestore();
      setIsGeneratingPix(true);
      try {
        const response = await fetch('/api/create-pix', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            transaction_amount: total,
            description: `Pedido - ${storeName}`,
            payer_email: 'cliente@espetaria.com',
            orderId: savedOrderId
          })
        });

        if (!response.ok) {
          throw new Error('Falha ao gerar o Pix via Mercado Pago');
        }

        const data = await response.json();
        setPixData({
          qrCodeBase64: data.qr_code_base64,
          qrCode: data.qr_code,
        });
      } catch (error) {
        console.error(error);
        toast.error("Erro ao gerar o Pix. Tente novamente ou escolha outra forma de pagamento.");
      } finally {
        setIsGeneratingPix(false);
      }
      return; // Interrompe para o utilizador pagar primeiro
    }

    // Regista o pedido (caso ainda não tenha sido registado)
    const savedOrderId = await saveOrderToFirestore();

    if (savedOrderId) {
      try {
        await fetch('/api/notify-telegram', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ orderId: savedOrderId })
        });
      } catch (err) {
        console.error("Erro ao enviar notificação para o Telegram", err);
      }
    }
    
    // Altera o estado para mostrar a tela de sucesso sem abrir o WhatsApp
    setOrderSuccess(true);
  };

  const handleClose = () => {
    setPixData(null);
    setOrderSaved(false);
    setOrderId(null);
    setOrderSuccess(false);
    setCustomerName("");
    setCustomerPhone("");
    onClose();
  };

  const handleSuccessClose = () => {
    items.forEach(item => onRemove(item.id));
    onCheckout();
    handleClose();
  };

  return (
    <Sheet open={open} onOpenChange={(v) => !v && handleClose()}>
      <SheetContent
        side="bottom"
        className="h-[90vh] rounded-t-3xl bg-background border-border overflow-y-auto p-0 flex flex-col"
      >
        <SheetHeader className="px-5 pt-5 pb-3 shrink-0">
          <SheetTitle className="text-foreground text-lg">
            {orderSuccess ? "Sucesso!" : "Seu Pedido"}
          </SheetTitle>
        </SheetHeader>

        {orderSuccess ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Pedido efetuado com sucesso!</h2>
            <p className="text-muted-foreground text-sm max-w-[250px]">
              A nossa equipa já recebeu a sua ordem e começará a prepará-la em breve.
            </p>
            <Button 
              onClick={handleSuccessClose}
              className="w-full max-w-xs h-14 rounded-2xl font-bold text-base shadow-lg"
            >
              Fechar e Voltar ao Menu
            </Button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <p className="text-sm">Seu carrinho está vazio</p>
          </div>
        ) : (
          <div className="px-5 pb-8 space-y-5">
            {!isOpen && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-3 flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-destructive">Estamos Fechados</p>
                  <p className="text-xs text-destructive/80">Nosso horário de funcionamento é das {openTime} às {closeTime}.</p>
                </div>
              </div>
            )}

            {/* Cart Items */}
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 bg-card p-3 rounded-xl border border-border"
                >
                  <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                    <img src={item.image} alt={item.name} loading="lazy" width={48} height={48} className="w-full h-full object-cover rounded-lg" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-primary font-bold">
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 rounded-full border-border"
                      onClick={() => onUpdateQty(item.id, -1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-6 text-center text-sm font-bold text-foreground">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 rounded-full border-border"
                      onClick={() => onUpdateQty(item.id, 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive/80"
                      onClick={() => onRemove(item.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="bg-border" />
            
            {/* Customer Info */}
            <div className="space-y-3 bg-card rounded-xl p-4 border border-border">
              <Label className="text-sm font-semibold text-foreground">
                Seus Dados
              </Label>
              <div className="space-y-2">
                <Input
                  placeholder="Nome Completo"
                  className="bg-secondary border-border text-sm"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
                <Input
                  placeholder="Telefone / WhatsApp"
                  className="bg-secondary border-border text-sm"
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </div>
            </div>

            <Separator className="bg-border" />

            {/* Order Mode */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-foreground">
                Modalidade
              </Label>
              <RadioGroup
                value={orderMode}
                onValueChange={setOrderMode}
                className="grid grid-cols-3 gap-2"
              >
                {[
                  { value: "delivery", label: "Delivery" },
                  { value: "pickup", label: "Retirada" },
                  { value: "dine-in", label: "No Local" },
                ].map((mode) => (
                  <Label
                    key={mode.value}
                    htmlFor={mode.value}
                    className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                      orderMode === mode.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-muted-foreground hover:border-muted-foreground/30"
                    }`}
                  >
                    <RadioGroupItem
                      value={mode.value}
                      id={mode.value}
                      className="sr-only"
                    />
                    {mode.label}
                  </Label>
                ))}
              </RadioGroup>
            </div>

            {/* Delivery Address */}
            {orderMode === "delivery" && (
              <div className="space-y-3 bg-card rounded-xl p-4 border border-border">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold text-foreground">
                    Endereço de Entrega
                  </Label>
                  <span className="text-xs text-accent font-medium">
                    Taxa: R$ {storeDeliveryFee.toFixed(2)}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Input
                    placeholder="Rua"
                    className="col-span-2 bg-secondary border-border text-sm"
                    value={address.street}
                    onChange={(e) =>
                      setAddress({ ...address, street: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Nº"
                    className="bg-secondary border-border text-sm"
                    value={address.number}
                    onChange={(e) =>
                      setAddress({ ...address, number: e.target.value })
                    }
                  />
                </div>
                <Input
                  placeholder="Bairro"
                  className="bg-secondary border-border text-sm"
                  value={address.neighborhood}
                  onChange={(e) =>
                    setAddress({ ...address, neighborhood: e.target.value })
                  }
                />
                <Input
                  placeholder="Referência"
                  className="bg-secondary border-border text-sm"
                  value={address.reference}
                  onChange={(e) =>
                    setAddress({ ...address, reference: e.target.value })
                  }
                />
              </div>
            )}

            <Separator className="bg-border" />

            {/* Payment */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-foreground">
                Forma de Pagamento
              </Label>
              <RadioGroup
                value={paymentMethod}
                onValueChange={(val) => {
                  setPaymentMethod(val);
                  setPixData(null); // Reseta o Pix gerado se mudar o método de pagamento
                }}
                className="grid grid-cols-3 gap-2"
              >
                {[
                  { value: "pix", label: "Pix" },
                  { value: "card", label: "Cartão" },
                  { value: "cash", label: "Dinheiro" },
                ].map((pm) => (
                  <Label
                    key={pm.value}
                    htmlFor={`pay-${pm.value}`}
                    className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                      paymentMethod === pm.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-muted-foreground hover:border-muted-foreground/30"
                    }`}
                  >
                    <RadioGroupItem
                      value={pm.value}
                      id={`pay-${pm.value}`}
                      className="sr-only"
                    />
                    {pm.label}
                  </Label>
                ))}
              </RadioGroup>

              {paymentMethod === "cash" && (
                <Input
                  placeholder="Precisa de troco para quanto?"
                  className="bg-secondary border-border text-sm"
                  type="number"
                  value={changeAmount}
                  onChange={(e) => setChangeAmount(e.target.value)}
                />
              )}

              {/* Antiga lógica de mostrar Chave PIX Estática só é visível se o Mercado Pago ainda não gerou o dinâmico */}
              {paymentMethod === "pix" && pixKey && !pixData && (
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 flex items-center justify-between gap-3 mt-3">
                  <div className="min-w-0">
                    <p className="text-xs text-primary font-semibold mb-0.5">Chave PIX (Manual)</p>
                    <p className="text-sm font-medium text-foreground truncate">{pixKey}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="shrink-0 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"
                    onClick={() => {
                      navigator.clipboard.writeText(pixKey);
                      toast.success("Chave PIX copiada!");
                    }}
                  >
                    <Copy className="h-4 w-4 mr-1.5" />
                    Copiar
                  </Button>
                </div>
              )}
            </div>

            {/* Nova Secção PIX Dinâmico (Mercado Pago) */}
            {pixData && (
              <div className="bg-card rounded-xl border border-border p-4 space-y-4 flex flex-col items-center text-center mt-4">
                <h3 className="text-base font-bold text-primary">Escaneie o QR Code</h3>
                <div className="bg-white p-2 rounded-xl border border-border/50">
                  <img
                    src={`data:image/jpeg;base64,${pixData.qrCodeBase64}`}
                    alt="QR Code Pix"
                    className="w-48 h-48 object-contain"
                  />
                </div>
                <div className="w-full space-y-2">
                  <p className="text-sm font-semibold text-foreground text-left">Ou utilize o Pix Copia e Cola:</p>
                  <div className="flex gap-2">
                    <Input
                      readOnly
                      value={pixData.qrCode}
                      className="bg-secondary border-border text-xs truncate"
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      className="shrink-0"
                      onClick={() => {
                        navigator.clipboard.writeText(pixData.qrCode);
                        toast.success("Código copiado!");
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-start gap-2 bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-xl w-full mt-2">
                  <Clock className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-yellow-700 text-left font-medium">
                    Aguardando pagamento... O seu pedido será confirmado automaticamente no sistema da loja assim que o Pix for compensado. O código expira em 15 minutos.
                  </p>
                </div>
              </div>
            )}

            <Separator className="bg-border" />

            {/* Summary */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>R$ {subtotal.toFixed(2)}</span>
              </div>
              {orderMode === "delivery" && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Taxa de Entrega</span>
                  <span>R$ {storeDeliveryFee.toFixed(2)}</span>
                </div>
              )}
              <Separator className="bg-border" />
              <div className="flex justify-between font-bold text-foreground text-base">
                <span>Total</span>
                <span className="text-primary">R$ {total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            {!pixData ? (
              <Button
                onClick={handleFinalizeOrder}
                disabled={!isOpen || isGeneratingPix}
                className="w-full h-14 rounded-2xl bg-[hsl(142,70%,45%)] hover:bg-[hsl(142,70%,40%)] text-white font-bold text-base shadow-lg disabled:opacity-50 disabled:pointer-events-none transition-all"
              >
                {isGeneratingPix ? (
                  "Carregando..."
                ) : paymentMethod === "pix" ? (
                  "Gerar Pix e Finalizar"
                ) : (
                  "Finalizar Pedido"
                )}
              </Button>
            ) : (
              <Button
                onClick={handleSuccessClose}
                className="w-full h-14 rounded-2xl font-bold text-base shadow-lg transition-all"
              >
                Fechar e Voltar ao Menu
              </Button>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartModal;
