import { MercadoPagoConfig, Payment } from 'mercadopago';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Permite CORS no Vercel para quando for consumido pelo frontend
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  let body = req.body;
  
  // No Vercel, o body já pode vir parseado, mas garantimos que não rebenta se vier como string
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      body = {};
    }
  }

  const { transaction_amount, description, payer_email, orderId } = body;

  if (!transaction_amount || !description) {
    return res.status(400).json({ error: 'Faltam dados obrigatórios' });
  }

  if (!process.env.MP_ACCESS_TOKEN) {
    return res.status(500).json({ error: 'Token do Mercado Pago não configurado no servidor' });
  }

  const client = new MercadoPagoConfig({ 
    accessToken: process.env.MP_ACCESS_TOKEN, 
  });

  const payment = new Payment(client);

  try {
    const dateOfExpiration = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    const paymentResponse = await payment.create({
      body: {
        transaction_amount: Number(transaction_amount),
        description: description,
        payment_method_id: 'pix',
        payer: {
          email: payer_email || 'cliente@espetaria.com',
        },
        external_reference: orderId,
        notification_url: 'https://' + req.headers.host + '/api/webhook',
        date_of_expiration: dateOfExpiration,
      },
    });

    const transactionData = paymentResponse.point_of_interaction?.transaction_data;

    if (!transactionData?.qr_code_base64 || !transactionData?.qr_code) {
      throw new Error('O Mercado Pago não devolveu as chaves PIX.');
    }

    return res.status(200).json({
      qr_code_base64: transactionData.qr_code_base64,
      qr_code: transactionData.qr_code,
    });
  } catch (error: any) {
    console.error('Erro ao gerar PIX:', error);
    return res.status(500).json({ error: error.message || 'Erro interno no servidor' });
  }
}
