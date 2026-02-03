import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const PARADISE_SECRET_KEY = Deno.env.get('PARADISE_PUBLIC_KEY');
    if (!PARADISE_SECRET_KEY) {
      throw new Error('PARADISE_SECRET_KEY não configurada');
    }

    const { reference } = await req.json();
    
    if (!reference) {
      throw new Error('Reference não fornecida');
    }

    console.log('Consultando status PIX:', { reference });

    // Consulta por external_id (nossa reference)
    const url = `https://multi.paradisepags.com/api/v1/query.php?action=list_transactions&external_id=${encodeURIComponent(reference)}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-API-Key': PARADISE_SECRET_KEY,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    console.log('Resposta Paradise status:', data);

    // A resposta é um array de transações
    if (Array.isArray(data) && data.length > 0) {
      const transaction = data[0];
      return new Response(
        JSON.stringify({
          success: true,
          status: transaction.status, // pending, approved, failed, refunded
          transaction_id: transaction.id,
          amount: transaction.amount,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    } else if (data.status) {
      // Resposta direta (caso a API retorne objeto único)
      return new Response(
        JSON.stringify({
          success: true,
          status: data.status,
          transaction_id: data.id,
          amount: data.amount,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    } else {
      return new Response(
        JSON.stringify({
          success: true,
          status: 'pending',
          message: 'Transação não encontrada ou ainda pendente',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }
  } catch (error) {
    console.error('Erro ao consultar status:', error);
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
