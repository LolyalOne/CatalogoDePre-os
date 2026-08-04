import { MercadoPagoConfig, Payment } from 'mercadopago';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore';
import { jsPDF } from 'jspdf';

const firebaseConfig = {
  apiKey: 'YOUR_API_KEY_HERE',
  authDomain: 'espeto-f-cil-menu.firebaseapp.com',
  databaseURL: 'https://espeto-f-cil-menu-default-rtdb.firebaseio.com',
  projectId: 'espeto-f-cil-menu',
  storageBucket: 'espeto-f-cil-menu.firebasestorage.app',
  messagingSenderId: '549217212218',
  appId: '1:549217212218:web:81756bb071311cfdd92203',
  measurementId: 'G-91Z5GLT7QE'
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  let body = req.body || {};
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      body = {};
    }
  }

  const paymentId = req.query.id || req.query['data.id'] || body?.data?.id;

  if (!paymentId) {
    return res.status(200).send('OK');
  }

  if (!process.env.MP_ACCESS_TOKEN) {
    console.error('Token do Mercado Pago não configurado');
    return res.status(200).send('OK');
  }

  const client = new MercadoPagoConfig({ 
    accessToken: process.env.MP_ACCESS_TOKEN, 
  });

  const payment = new Payment(client);

  try {
    const paymentData = await payment.get({ id: paymentId });

    if (paymentData.status === 'approved') {
      const orderId = paymentData.external_reference;

      if (orderId) {
        const orderRef = doc(db, 'orders', orderId);
        await updateDoc(orderRef, { status: 'pago' });

        if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
          const orderSnap = await getDoc(orderRef);
          
          let orderText = `✅ *PIX PAGO! Novo pedido confirmado!*\n`;
          orderText += `Valor: R$ ${paymentData.transaction_amount}\n\n`;
          
          let orderData: any = null;

          if (orderSnap.exists()) {
            orderData = orderSnap.data();
            orderText += `*ID do Pedido:* #${orderId.slice(0, 6).toUpperCase()}\n`;
            orderText += `*Data:* ${orderData.createdAt?.toDate ? orderData.createdAt.toDate().toLocaleString('pt-BR') : 'N/A'}\n`;
            orderText += `*Modalidade:* ${orderData.orderMode === 'delivery' ? 'Delivery' : orderData.orderMode === 'pickup' ? 'Retirada' : 'No Local'}\n\n`;

            orderText += `*Itens:*\n`;
            orderData.items?.forEach((item: any) => {
              orderText += `🔸 ${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2)}\n`;
            });

            if (orderData.orderMode === 'delivery' && orderData.address) {
              orderText += `\n*Endereço de Entrega:*\n`;
              orderText += `📍 ${orderData.address.street}, ${orderData.address.number}\n`;
              orderText += `Bairro: ${orderData.address.neighborhood}\n`;
              if (orderData.address.reference) orderText += `Ref: ${orderData.address.reference}\n`;
            }

            orderText += `\n*Resumo:*\n`;
            orderText += `Subtotal: R$ ${(orderData.subtotal || 0).toFixed(2)}\n`;
            if (orderData.orderMode === 'delivery') {
              orderText += `Taxa de Entrega: R$ ${(orderData.deliveryFee || 0).toFixed(2)}\n`;
            }
            orderText += `*TOTAL: R$ ${(orderData.total || paymentData.transaction_amount).toFixed(2)}*\n`;
          }

          let pdfSent = false;
          
          if (orderData) {
            try {
              const pdfDoc = new jsPDF();
              let y = 20;

              pdfDoc.setFontSize(20);
              pdfDoc.text(orderData.storeName || "Loja", 105, y, { align: "center" });
              y += 10;
              
              pdfDoc.setFontSize(14);
              pdfDoc.text(`Recibo de Pedido #${orderId.slice(0, 6).toUpperCase()}`, 105, y, { align: "center" });
              y += 10;

              pdfDoc.setFontSize(10);
              pdfDoc.text(`Status: PAGO`, 20, y);
              y += 5;
              pdfDoc.text(`Modalidade: ${orderData.orderMode === "delivery" ? "Delivery" : orderData.orderMode === "pickup" ? "Retirada" : "No Local"}`, 20, y);
              y += 10;

              pdfDoc.line(20, y, 190, y);
              y += 10;

              pdfDoc.setFontSize(12);
              pdfDoc.text("Itens do Pedido", 20, y);
              y += 10;

              pdfDoc.setFontSize(10);
              orderData.items?.forEach((item: any) => {
                pdfDoc.text(`${item.quantity}x ${item.name}`, 20, y);
                pdfDoc.text(`R$ ${(item.price * item.quantity).toFixed(2)}`, 190, y, { align: "right" });
                y += 7;
              });

              y += 5;
              pdfDoc.line(20, y, 190, y);
              y += 10;

              if (orderData.orderMode === "delivery" && orderData.address) {
                pdfDoc.setFontSize(12);
                pdfDoc.text("Endereço de Entrega", 20, y);
                y += 7;
                pdfDoc.setFontSize(10);
                pdfDoc.text(`${orderData.address.street}, ${orderData.address.number}`, 20, y);
                y += 5;
                pdfDoc.text(`Bairro: ${orderData.address.neighborhood}`, 20, y);
                y += 5;
                if (orderData.address.reference) {
                  pdfDoc.text(`Ref: ${orderData.address.reference}`, 20, y);
                  y += 5;
                }
                y += 5;
                pdfDoc.line(20, y, 190, y);
                y += 10;
              }

              pdfDoc.setFontSize(12);
              pdfDoc.text("Resumo Financeiro", 20, y);
              y += 7;
              pdfDoc.setFontSize(10);
              pdfDoc.text("Subtotal:", 20, y);
              pdfDoc.text(`R$ ${(orderData.subtotal || 0).toFixed(2)}`, 190, y, { align: "right" });
              y += 7;
              
              if (orderData.orderMode === "delivery") {
                pdfDoc.text("Taxa de Entrega:", 20, y);
                pdfDoc.text(`R$ ${(orderData.deliveryFee || 0).toFixed(2)}`, 190, y, { align: "right" });
                y += 7;
              }

              pdfDoc.setFontSize(14);
              pdfDoc.setFont("helvetica", "bold");
              pdfDoc.text("TOTAL:", 20, y);
              pdfDoc.text(`R$ ${(orderData.total || paymentData.transaction_amount).toFixed(2)}`, 190, y, { align: "right" });

              const pdfBuffer = pdfDoc.output('arraybuffer');
              const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
              
              const formData = new FormData();
              formData.append('chat_id', process.env.TELEGRAM_CHAT_ID as string);
              formData.append('caption', `✅ PIX PAGO! Pedido #${orderId.slice(0, 6).toUpperCase()}`);
              formData.append('document', blob, `pedido-${orderId}.pdf`);

              const pdfRes = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendDocument`, {
                method: 'POST',
                body: formData
              });

              if (pdfRes.ok) {
                pdfSent = true;
              }
            } catch (err) {
              console.error('Erro ao gerar/enviar PDF via webhook:', err);
            }
          }

          if (!pdfSent) {
            await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                chat_id: process.env.TELEGRAM_CHAT_ID,
                text: orderText,
                parse_mode: 'Markdown'
              })
            });
          }
        }
      }
    }
  } catch (error) {
    console.error('Erro no processamento do webhook:', error);
  }

  return res.status(200).send('OK');
}
