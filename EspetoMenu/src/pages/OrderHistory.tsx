import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, getDocs, orderBy, query, Timestamp, doc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { db, auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ArrowLeft, LogOut, Receipt, Printer, Download, Check, X, Edit, Plus, Minus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string | null;
}

interface OrderAddress {
  street: string;
  number: string;
  neighborhood: string;
  reference?: string;
}

interface OrderDoc {
  id: string;
  items: OrderItem[];
  total: number;
  subtotal: number;
  deliveryFee: number;
  paymentMethod: string;
  orderMode: string;
  address?: OrderAddress | null;
  changeAmount?: string | null;
  status: string;
  storeName: string;
  createdAt: Timestamp | null;
}

const tabClass = (active: boolean) =>
  `flex-1 text-center text-xs font-semibold py-2 rounded-xl border transition-colors ${
    active
      ? "border-primary bg-primary/10 text-primary"
      : "border-border bg-card text-muted-foreground hover:border-muted-foreground/30"
  }`;

const paymentLabel = (m: string) =>
  m === "pix" ? "Pix" : m === "card" ? "Cartão" : m === "cash" ? "Dinheiro" : m;

const StatusBadge = ({ status }: { status: string }) => {
  const s = (status || "").toLowerCase();
  if (s === "pago") {
    return (
      <Badge className="bg-green-500/15 text-green-600 border border-green-500/30 hover:bg-green-500/20">
        Pago
      </Badge>
    );
  }
  if (s === "cancelado") {
    return (
      <Badge className="bg-destructive/15 text-destructive border border-destructive/30 hover:bg-destructive/20">
        Cancelado
      </Badge>
    );
  }
  if (s === "entregue") {
    return (
      <Badge className="bg-blue-500/15 text-blue-600 border border-blue-500/30 hover:bg-blue-500/20">
        Entregue
      </Badge>
    );
  }
  return (
    <Badge className="bg-yellow-500/15 text-yellow-600 border border-yellow-500/30 hover:bg-yellow-500/20">
      Pendente
    </Badge>
  );
};

const OrderHistory = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderDoc[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // States for actions
  const [orderToCancel, setOrderToCancel] = useState<OrderDoc | null>(null);
  const [orderToEdit, setOrderToEdit] = useState<OrderDoc | null>(null);
  const [editedItems, setEditedItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/login", { replace: true });
      } else {
        fetchOrders();
      }
    });

    const fetchOrders = async () => {
      try {
        const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        const list: OrderDoc[] = snap.docs.map((d) => {
          const data = d.data() as Omit<OrderDoc, "id">;
          return { id: d.id, ...data };
        });
        setOrders(list);
      } catch (err) {
        console.error(err);
        toast.error("Erro ao carregar histórico de pedidos.");
      } finally {
        setIsLoading(false);
      }
    };

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Sessão terminada!");
    } catch (error) {
      toast.error("Erro ao terminar sessão.");
    }
  };

  const formatDate = (ts: Timestamp | null) => {
    if (!ts) return "—";
    try {
      return ts.toDate().toLocaleString("pt-BR");
    } catch {
      return "—";
    }
  };

  const itemsSummary = (items: OrderItem[]) =>
    items.map((i) => `${i.quantity}x ${i.name}`).join(", ");

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status: newStatus });
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      toast.success(`Status atualizado para ${newStatus}.`);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar status.");
    }
  };

  const confirmCancel = async () => {
    if (!orderToCancel) return;
    await handleUpdateStatus(orderToCancel.id, "cancelado");
    setOrderToCancel(null);
  };

  const openEditModal = (order: OrderDoc) => {
    setOrderToEdit(order);
    setEditedItems([...order.items]);
  };

  const handleUpdateQty = (itemId: string, delta: number) => {
    setEditedItems(prev => {
      return prev.map(item => {
        if (item.id === itemId) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      });
    });
  };

  const handleRemoveItem = (itemId: string) => {
    setEditedItems(prev => prev.filter(item => item.id !== itemId));
  };

  const saveEditedOrder = async () => {
    if (!orderToEdit) return;
    try {
      const newSubtotal = editedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
      const newTotal = newSubtotal + (orderToEdit.deliveryFee || 0);

      await updateDoc(doc(db, "orders", orderToEdit.id), {
        items: editedItems,
        subtotal: newSubtotal,
        total: newTotal
      });

      setOrders(orders.map(o => o.id === orderToEdit.id ? {
        ...o,
        items: editedItems,
        subtotal: newSubtotal,
        total: newTotal
      } : o));

      toast.success("Pedido atualizado com sucesso!");
      setOrderToEdit(null);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar pedido.");
    }
  };

  const handlePrintThermal = (order: OrderDoc) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Permita a abertura de pop-ups para imprimir o cupom.");
      return;
    }

    let itemsHtml = order.items
      .map(
        (i) => `
      <tr>
        <td style="padding: 2px 0;">${i.quantity}x ${i.name}</td>
        <td style="text-align: right; padding: 2px 0;">R$ ${(i.price * i.quantity).toFixed(2)}</td>
      </tr>
    `
      )
      .join("");

    let addressHtml = "";
    if (order.orderMode === "delivery" && order.address) {
      addressHtml = `
        <div style="margin-top: 10px; border-top: 1px dashed #000; padding-top: 10px;">
          <strong>ENDEREÇO DE ENTREGA:</strong><br/>
          Rua: ${order.address.street}, ${order.address.number}<br/>
          Bairro: ${order.address.neighborhood}<br/>
          ${order.address.reference ? `Ref: ${order.address.reference}<br/>` : ""}
          Taxa de Entrega: R$ ${(order.deliveryFee || 0).toFixed(2)}
        </div>
      `;
    }

    let changeHtml = "";
    if (order.paymentMethod === "cash" && order.changeAmount) {
      changeHtml = `
        <div style="margin-top: 10px;">
          <strong>TROCO PARA:</strong> R$ ${order.changeAmount}
        </div>
      `;
    }

    const htmlContent = `
      <html>
        <head>
          <title>Cupom - Pedido ${order.id}</title>
          <style>
            @page { margin: 0; }
            body {
              font-family: monospace;
              width: 80mm;
              margin: 0 auto;
              padding: 10px;
              color: #000;
              font-size: 12px;
            }
            .header { text-align: center; margin-bottom: 10px; border-bottom: 1px dashed #000; padding-bottom: 10px; }
            .header h1 { margin: 0; font-size: 16px; }
            .section { margin-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; }
            .totals { margin-top: 10px; border-top: 1px dashed #000; padding-top: 10px; text-align: right; }
            .footer { text-align: center; margin-top: 20px; font-size: 10px; border-top: 1px dashed #000; padding-top: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${order.storeName || "Loja"}</h1>
            <div>Pedido #${order.id.slice(0, 6).toUpperCase()}</div>
            <div>${formatDate(order.createdAt)}</div>
          </div>
          
          <div class="section">
            <strong>MODALIDADE:</strong> ${
              order.orderMode === "delivery" ? "Delivery" : order.orderMode === "pickup" ? "Retirada" : "No Local"
            }<br/>
            <strong>PAGAMENTO:</strong> ${paymentLabel(order.paymentMethod)}<br/>
            <strong>STATUS:</strong> ${order.status.toUpperCase()}
          </div>

          <div class="section">
            <table>
              ${itemsHtml}
            </table>
          </div>

          ${addressHtml}
          ${changeHtml}

          <div class="totals">
            <strong>SUBTOTAL:</strong> R$ ${(order.subtotal || 0).toFixed(2)}<br/>
            ${order.orderMode === "delivery" ? `<strong>TAXA ENTREGA:</strong> R$ ${(order.deliveryFee || 0).toFixed(2)}<br/>` : ""}
            <strong style="font-size: 14px;">TOTAL: R$ ${order.total.toFixed(2)}</strong>
          </div>

          <div class="footer">
            Obrigado pela preferência!
          </div>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const handleDownloadPDF = (order: OrderDoc) => {
    try {
      const doc = new jsPDF();
      let y = 20;

      doc.setFontSize(20);
      doc.text(order.storeName || "Loja", 105, y, { align: "center" });
      y += 10;
      
      doc.setFontSize(14);
      doc.text(`Recibo de Pedido #${order.id.slice(0, 6).toUpperCase()}`, 105, y, { align: "center" });
      y += 10;

      doc.setFontSize(10);
      doc.text(`Data: ${formatDate(order.createdAt)}`, 20, y);
      y += 5;
      doc.text(`Status: ${order.status.toUpperCase()}`, 20, y);
      y += 5;
      doc.text(`Modalidade: ${order.orderMode === "delivery" ? "Delivery" : order.orderMode === "pickup" ? "Retirada" : "No Local"}`, 20, y);
      y += 5;
      doc.text(`Pagamento: ${paymentLabel(order.paymentMethod)}`, 20, y);
      y += 10;

      doc.line(20, y, 190, y);
      y += 10;

      doc.setFontSize(12);
      doc.text("Itens do Pedido", 20, y);
      y += 10;

      doc.setFontSize(10);
      order.items.forEach((item) => {
        doc.text(`${item.quantity}x ${item.name}`, 20, y);
        doc.text(`R$ ${(item.price * item.quantity).toFixed(2)}`, 190, y, { align: "right" });
        y += 7;
      });

      y += 5;
      doc.line(20, y, 190, y);
      y += 10;

      if (order.orderMode === "delivery" && order.address) {
        doc.setFontSize(12);
        doc.text("Endereço de Entrega", 20, y);
        y += 7;
        doc.setFontSize(10);
        doc.text(`${order.address.street}, ${order.address.number}`, 20, y);
        y += 5;
        doc.text(`Bairro: ${order.address.neighborhood}`, 20, y);
        y += 5;
        if (order.address.reference) {
          doc.text(`Ref: ${order.address.reference}`, 20, y);
          y += 5;
        }
        y += 5;
        doc.line(20, y, 190, y);
        y += 10;
      }

      if (order.paymentMethod === "cash" && order.changeAmount) {
        doc.text(`Troco para: R$ ${order.changeAmount}`, 20, y);
        y += 10;
      }

      doc.setFontSize(12);
      doc.text("Resumo Financeiro", 20, y);
      y += 7;
      doc.setFontSize(10);
      doc.text("Subtotal:", 20, y);
      doc.text(`R$ ${(order.subtotal || 0).toFixed(2)}`, 190, y, { align: "right" });
      y += 7;
      
      if (order.orderMode === "delivery") {
        doc.text("Taxa de Entrega:", 20, y);
        doc.text(`R$ ${(order.deliveryFee || 0).toFixed(2)}`, 190, y, { align: "right" });
        y += 7;
      }

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("TOTAL:", 20, y);
      doc.text(`R$ ${order.total.toFixed(2)}`, 190, y, { align: "right" });

      doc.save(`pedido-${order.id}.pdf`);
      toast.success("PDF baixado com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao gerar o PDF.");
    }
  };

  return (
    <div className="min-h-screen bg-background max-w-[1200px] mx-auto pb-24">
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

      <div className="flex gap-2 px-4 pt-4 max-w-lg mx-auto">
        <Link to="/administrador/config" className={tabClass(false)}>
          Configurações
        </Link>
        <Link to="/administrador/pedidos" className={tabClass(true)}>
          Histórico de Pedidos
        </Link>
      </div>

      <main className="px-4 py-6">
        <section className="bg-card rounded-xl border border-border p-4 space-y-3">
          <div className="flex items-center gap-2 text-foreground font-semibold">
            <Receipt className="h-5 w-5 text-primary" />
            Pedidos recebidos
          </div>

          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : orders.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Nenhum pedido registado ainda.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">Data/Hora</TableHead>
                    <TableHead>Itens</TableHead>
                    <TableHead className="whitespace-nowrap">Total</TableHead>
                    <TableHead className="whitespace-nowrap">Pagamento</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((o) => (
                    <TableRow key={o.id}>
                      <TableCell className="whitespace-nowrap text-xs">
                        {formatDate(o.createdAt)}
                      </TableCell>
                      <TableCell
                        className="text-xs max-w-[180px] truncate"
                        title={itemsSummary(o.items || [])}
                      >
                        {itemsSummary(o.items || [])}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-xs font-semibold">
                        R$ {Number(o.total || 0).toFixed(2)}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-xs">
                        {paymentLabel(o.paymentMethod)}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={o.status} />
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <div className="flex flex-wrap items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs text-blue-600 hover:text-blue-700"
                            onClick={() => handleUpdateStatus(o.id, "entregue")}
                            disabled={o.status === "entregue" || o.status === "cancelado"}
                          >
                            <Check className="h-3.5 w-3.5 mr-1" />
                            Entregue
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs text-destructive hover:text-destructive"
                            onClick={() => setOrderToCancel(o)}
                            disabled={o.status === "cancelado"}
                          >
                            <X className="h-3.5 w-3.5 mr-1" />
                            Cancelar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs"
                            onClick={() => openEditModal(o)}
                            disabled={o.status === "cancelado" || o.status === "entregue"}
                          >
                            <Edit className="h-3.5 w-3.5 mr-1" />
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs"
                            onClick={() => handlePrintThermal(o)}
                          >
                            <Printer className="h-3.5 w-3.5 mr-1" />
                            Cupom
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs"
                            onClick={() => handleDownloadPDF(o)}
                          >
                            <Download className="h-3.5 w-3.5 mr-1" />
                            PDF
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </section>
      </main>

      {/* AlertDialog para Cancelar */}
      <AlertDialog open={!!orderToCancel} onOpenChange={(open) => !open && setOrderToCancel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deseja cancelar este pedido?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O pedido será marcado como cancelado.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancel} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Confirmar Cancelamento
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog para Editar Pedido */}
      <Dialog open={!!orderToEdit} onOpenChange={(open) => !open && setOrderToEdit(null)}>
        <DialogContent className="max-w-md w-[95vw] rounded-xl">
          <DialogHeader>
            <DialogTitle>Editar Pedido #{orderToEdit?.id.slice(0, 6).toUpperCase()}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            {editedItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3 bg-secondary/50 p-2 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{item.name}</p>
                  <p className="text-xs text-primary font-bold">
                    R$ {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7 rounded-full"
                    onClick={() => handleUpdateQty(item.id, -1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-6 text-center text-sm font-bold">
                    {item.quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7 rounded-full"
                    onClick={() => handleUpdateQty(item.id, 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:text-destructive/80"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
            
            {editedItems.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-4">Nenhum item no pedido.</p>
            )}

            <div className="flex justify-between font-bold pt-4 border-t">
              <span>Novo Total:</span>
              <span className="text-primary">
                R$ {(
                  editedItems.reduce((sum, i) => sum + i.price * i.quantity, 0) + 
                  (orderToEdit?.deliveryFee || 0)
                ).toFixed(2)}
              </span>
            </div>
          </div>

          <DialogFooter className="flex-row gap-2 justify-end sm:justify-end">
            <Button variant="outline" className="flex-1 sm:flex-none" onClick={() => setOrderToEdit(null)}>Cancelar</Button>
            <Button className="flex-1 sm:flex-none" onClick={saveEditedOrder} disabled={editedItems.length === 0}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderHistory;
