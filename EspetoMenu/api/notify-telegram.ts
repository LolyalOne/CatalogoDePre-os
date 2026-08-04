import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyA-q8LKOGlbbRo9blAiOqN69C10ou7swTU',
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

  const { orderId } = body;

  if (!orderId) {
    return res.status(400).json({ error: 'orderId is required' });
  }

  if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
    console.error('Credenciais do Telegram não configuradas.');
    return res.status(500).json({ error: 'Internal Server Error' });
  }

  try {
    const orderRef = doc(db, 'orders', orderId);
    const orderSnap = await getDoc(orderRef);

    if (!orderSnap.exists()) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    const orderData = orderSnap.data();
    let text = '';

    if (orderData.orderMode === 'delivery') {
      text += `🛵 *NOVO PEDIDO - DELIVERY*\n\n`;
    } else {
      text += `🛍️ *NOVO PEDIDO - RETIRADA/BALCÃO*\n\n`;
    }

    text += `*ID do Pedido:* #${orderId.slice(0, 6).toUpperCase()}\n`;
    text += `*Cliente:* ${orderData.customerName || 'Não informado'}\n`;
    text += `*Telefone:* ${orderData.customerPhone || 'Não informado'}\n`;
    text += `*Pagamento:* ${orderData.paymentMethod === 'cash' ? 'Dinheiro' : orderData.paymentMethod === 'card' ? 'Cartão' : orderData.paymentMethod}\n`;
    if (orderData.paymentMethod === 'cash' && orderData.changeAmount) {
      text += `*Troco para:* R$ ${orderData.changeAmount}\n`;
    }
    
    text += `\n*Itens:*\n`;
    orderData.items?.forEach((item: any) => {
      text += `🔸 ${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2)}\n`;
    });

    if (orderData.orderMode === 'delivery' && orderData.address) {
      text += `\n*Endereço de Entrega:*\n`;
      text += `📍 ${orderData.address.street}, ${orderData.address.number}\n`;
      text += `Bairro: ${orderData.address.neighborhood}\n`;
      if (orderData.address.reference) text += `Ref: ${orderData.address.reference}\n`;
    }

    text += `\n*Resumo:*\n`;
    text += `Subtotal: R$ ${(orderData.subtotal || 0).toFixed(2)}\n`;
    if (orderData.orderMode === 'delivery') {
      text += `Taxa de Entrega: R$ ${(orderData.deliveryFee || 0).toFixed(2)}\n`;
    }
    text += `*TOTAL: R$ ${(orderData.total || 0).toFixed(2)}*\n`;

    const telegramRes = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: text,
        parse_mode: 'Markdown'
      })
    });

    if (!telegramRes.ok) {
      throw new Error('Falha ao enviar mensagem para o Telegram');
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Erro ao notificar Telegram:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
