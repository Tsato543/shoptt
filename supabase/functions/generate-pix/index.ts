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
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const PARADISE_PUBLIC_KEY = Deno.env.get('PARADISE_PUBLIC_KEY');
    if (!PARADISE_PUBLIC_KEY) {
      throw new Error('PARADISE_PUBLIC_KEY não configurada');
    }

    const PARADISE_PRODUCT_HASH = Deno.env.get('PARADISE_PRODUCT_HASH');
    if (!PARADISE_PRODUCT_HASH) {
      throw new Error('PARADISE_PRODUCT_HASH não configurada');
    }

    const body: PaymentRequest = await req.json();
    const { amount, customer_name, customer_email, customer_cpf, customer_phone, details } = body;

    // Validações básicas
    if (!amount || amount <= 0) {
      throw new Error('Valor inválido');
    }
    if (!customer_name || !customer_email || !customer_cpf) {
      throw new Error('Dados do cliente incompletos');
    }

    // Gerar identifier curto (máximo 20 caracteres)
    const identifier = `pix_${Date.now().toString(36)}`;

    const origin = req.headers.get('origin') || 'https://shoptt.lovable.app';

    console.log('Gerando PIX Paradise:', { amount, customer_name, customer_email, identifier });

    // Chamada à API da Paradise
    const paradiseResponse = await fetch('https://paradise-pay.com/payment/initiate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        public_key: PARADISE_PUBLIC_KEY,
        product_hash: PARADISE_PRODUCT_HASH,
        amount: amount.toFixed(2),
        currency: 'BRL',
        identifier: identifier,
        customer_name: customer_name,
        customer_email: customer_email,
        customer_cpf: customer_cpf,
        customer_phone: customer_phone,
        details: details,
        success_url: `${origin}/up1`,
        cancel_url: `${origin}/checkout`,
        ipn_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/paradise-webhook`,
        site_logo: 'https://shoptt.lovable.app/favicon.ico',
      }),
    });

    const paradiseData = await paradiseResponse.json();
    console.log('Resposta Paradise:', paradiseData);

    if (paradiseData.success === 'ok' && paradiseData.url) {
      return new Response(
        JSON.stringify({
          success: true,
          checkout_url: paradiseData.url,
          message: 'PIX gerado com sucesso',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    } else {
      const errorMsg = paradiseData.errors?.join(', ') || paradiseData.message || 'Erro ao gerar PIX';
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
