import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface PaymentRequest {
  amount: number;
  customer_name: string;
  customer_email: string;
  customer_cpf: string;
  customer_phone: string;
  details: string;
  tracking?: Record<string, string>;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Secret Key para autenticação via header X-API-Key
    const PARADISE_SECRET_KEY = Deno.env.get('PARADISE_PUBLIC_KEY');
    if (!PARADISE_SECRET_KEY) {
      throw new Error('PARADISE_SECRET_KEY não configurada');
    }

    const PARADISE_PRODUCT_HASH = Deno.env.get('PARADISE_PRODUCT_HASH');
    if (!PARADISE_PRODUCT_HASH) {
      throw new Error('PARADISE_PRODUCT_HASH não configurada');
    }

    const body: PaymentRequest = await req.json();
    const { amount, customer_name, customer_email, customer_cpf, customer_phone, details, tracking } = body;

    // Validações básicas
    if (!amount || amount <= 0) {
      throw new Error('Valor inválido');
    }
    if (!customer_name || !customer_email || !customer_cpf) {
      throw new Error('Dados do cliente incompletos');
    }

    // Gerar reference único (identificador da transação)
    const reference = `order_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    // Converter valor de reais para centavos (API espera Integer em centavos)
    const amountInCents = Math.round(amount * 100);

    console.log('Gerando PIX Paradise:', { 
      amountInCents, 
      customer_name, 
      customer_email, 
      reference,
      productHash: PARADISE_PRODUCT_HASH,
      tracking,
    });

    // Chamada à API da Paradise - URL e formato corretos conforme documentação
    const paradiseResponse = await fetch('https://multi.paradisepags.com/api/v1/transaction.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': PARADISE_SECRET_KEY,
      },
      body: JSON.stringify({
        amount: amountInCents,
        description: details || 'Compra na loja',
        reference: reference,
        productHash: PARADISE_PRODUCT_HASH,
        customer: {
          name: customer_name,
          email: customer_email,
          document: customer_cpf.replace(/\D/g, ''),
          phone: customer_phone.replace(/\D/g, ''),
        },
        // Forward all TikTok / UTM tracking params
        ...(tracking && Object.keys(tracking).length > 0 ? { metadata: tracking } : {}),
      }),
    });

    const paradiseData = await paradiseResponse.json();
    console.log('Resposta Paradise:', paradiseData);

    if (paradiseData.status === 'success' && paradiseData.qr_code) {
      return new Response(
        JSON.stringify({
          success: true,
          qr_code: paradiseData.qr_code,
          qr_code_base64: paradiseData.qr_code_base64,
          transaction_id: paradiseData.transaction_id,
          reference: paradiseData.id,
          amount: paradiseData.amount,
          expires_at: paradiseData.expires_at,
          message: 'PIX gerado com sucesso',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    } else {
      const errorMsg = paradiseData.message || paradiseData.error || 'Erro ao gerar PIX';
      throw new Error(errorMsg);
    }
  } catch (error) {
    console.error('Erro ao gerar PIX:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
