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
  identifier: string;
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

    const body: PaymentRequest = await req.json();
    const { amount, customer_name, customer_email, customer_cpf, customer_phone, details, identifier } = body;

    // Validações básicas
    if (!amount || amount <= 0) {
      throw new Error('Valor inválido');
    }
    if (!customer_name || !customer_email || !customer_cpf) {
      throw new Error('Dados do cliente incompletos');
    }

    console.log('Gerando PIX Paradise:', { amount, customer_name, customer_email, identifier });

    // Chamada à API da Paradise
    const paradiseResponse = await fetch('https://paradise-pay.com/payment/initiate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        public_key: PARADISE_PUBLIC_KEY,
        amount: amount.toFixed(2),
        currency: 'BRL',
        identifier: identifier,
        customer_name: customer_name,
        customer_email: customer_email,
        details: details,
        success_url: `${req.headers.get('origin') || 'https://shoptt.lovable.app'}/up1`,
        ipn_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/paradise-webhook`,
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
      throw new Error(paradiseData.message || 'Erro ao gerar PIX');
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
