import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Copy, Loader2, ShieldCheck, Clock, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type PixState = {
  amountReais: number;
  quantityLabel?: string;
  qrCode?: string;
  qrImageUrl?: string;
  expiresAt?: string;
  reference?: string;
};

const PINK = "#FF3B66";

const formatMoneyBRL = (value: number) =>
  `R$ ${value.toFixed(2).replace(".", ",")}`;

const clamp0 = (n: number) => (n < 0 ? 0 : n);

const PixPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state || null) as PixState | null;

  // Sempre 14 minutos a partir de quando a tela foi carregada
  const expiresAtMs = useMemo(() => {
    return Date.now() + 14 * 60 * 1000;
  }, []);

  const [now, setNow] = useState(Date.now());
  const [copied, setCopied] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'approved' | 'failed'>('pending');

  // Timer
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(t);
  }, []);

  // Polling para verificar status do pagamento
  useEffect(() => {
    if (!state?.reference) return;
    if (paymentStatus === 'approved') return;

    const checkStatus = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('check-pix-status', {
          body: { reference: state.reference },
        });

        if (!error && data?.success && data?.status === 'approved') {
          setPaymentStatus('approved');
          // Aguarda 2 segundos para mostrar feedback e redireciona
          setTimeout(() => {
            navigate('/up1');
          }, 2000);
        }
      } catch (err) {
        console.error('Erro ao verificar status:', err);
      }
    };

    // Verifica a cada 5 segundos
    const interval = setInterval(checkStatus, 5000);
    // Verifica imediatamente também
    checkStatus();

    return () => clearInterval(interval);
  }, [state?.reference, paymentStatus, navigate]);

  const remainingMs = clamp0(expiresAtMs - now);
  const mm = Math.floor(remainingMs / 60000);
  const ss = Math.floor((remainingMs % 60000) / 1000);
  const timerText = `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;

  const handleCopy = async () => {
    if (!state?.qrCode) return;
    try {
      await navigator.clipboard.writeText(state.qrCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Não foi possível copiar automaticamente.");
    }
  };

  if (!state) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex flex-col max-w-md mx-auto">
        <header className="bg-white px-4 py-4 flex items-center gap-3 shadow-sm">
          <button onClick={() => navigate("/checkout")} className="p-1.5 -ml-1 rounded-full hover:bg-gray-100 transition-colors" aria-label="Voltar">
            <ArrowLeft className="w-5 h-5 text-gray-700" strokeWidth={2} />
          </button>
          <h1 className="text-base font-semibold text-gray-900">Pagamento PIX</h1>
        </header>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm w-full text-center">
            <p className="text-gray-700 font-medium">Nenhum PIX ativo encontrado.</p>
            <p className="text-gray-500 text-sm mt-1">Volte ao checkout e clique em Pagar novamente.</p>
            <button
              onClick={() => navigate("/checkout")}
              className="mt-5 w-full py-3.5 rounded-xl font-semibold text-white text-sm"
              style={{ backgroundColor: PINK }}
            >
              Voltar ao checkout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex flex-col max-w-md mx-auto">
      {/* Header */}
      <header className="bg-white px-4 py-4 flex items-center gap-3 shadow-sm sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-1.5 -ml-1 rounded-full hover:bg-gray-100 transition-colors" aria-label="Voltar">
          <ArrowLeft className="w-5 h-5 text-gray-700" strokeWidth={2} />
        </button>
        <h1 className="text-base font-semibold text-gray-900">Pagamento PIX</h1>
      </header>

      {/* Progress bar */}
      <div className="h-1 bg-gray-200">
        <div className="h-1 w-full" style={{ backgroundColor: PINK }} />
      </div>

      <main className="flex-1 overflow-auto pb-8">
        {/* Valor card */}
        <section className="mx-4 mt-4">
          <div
            className="rounded-2xl py-6 px-5 text-white shadow-lg"
            style={{ background: "linear-gradient(135deg, #FF3B66 0%, #FF6B8A 100%)" }}
          >
            <p className="text-center text-white/80 text-xs font-medium tracking-wide uppercase">Valor a pagar</p>
            <p className="text-center text-4xl font-bold mt-1 tracking-tight">{formatMoneyBRL(state.amountReais)}</p>
            <p className="text-center text-white/80 text-sm mt-1">{state.quantityLabel || "1 item"}</p>
          </div>
        </section>

        {/* QR Code card */}
        <section className="bg-white mx-4 mt-4 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 pb-4">
            <p className="text-center text-gray-600 text-sm font-medium">
              Escaneie o QR Code com o app do seu banco
            </p>

            <div className="flex justify-center mt-4">
              <div className="rounded-xl p-3 border border-gray-100 bg-white shadow-sm">
                {state.qrImageUrl ? (
                  <img
                    src={state.qrImageUrl}
                    alt="QR Code do PIX"
                    className="w-44 h-44 object-contain"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-44 h-44 flex items-center justify-center text-gray-300">
                    <Loader2 className="w-8 h-8 animate-spin" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 px-5">
            <div className="h-px flex-1 bg-gray-100" />
            <span className="text-gray-400 text-xs font-medium">ou copie o código</span>
            <div className="h-px flex-1 bg-gray-100" />
          </div>

          {/* Copy button */}
          <div className="p-5 pt-4">
            <button
              onClick={handleCopy}
              disabled={!state.qrCode}
              className="w-full py-3.5 rounded-xl font-semibold text-sm text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98]"
              style={{ backgroundColor: copied ? "#2DB573" : PINK }}
            >
              <Copy className="w-4 h-4" />
              {copied ? "Código copiado!" : "Copiar código PIX"}
            </button>

            {state.qrCode && (
              <p className="text-[10px] text-center text-gray-400 mt-3 break-all line-clamp-2 leading-relaxed px-2">
                {state.qrCode}
              </p>
            )}
          </div>
        </section>

        {/* Timer */}
        <section className="mx-4 mt-3 rounded-xl p-3.5 bg-amber-50 border border-amber-100">
          <div className="flex items-center justify-center gap-2 text-amber-700">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">O PIX expira em:</span>
            <span className="font-bold text-base tabular-nums">{timerText}</span>
          </div>
        </section>

        {/* Payment status */}
        {paymentStatus === 'approved' ? (
          <section className="mx-4 mt-2 rounded-xl p-4 bg-emerald-50 border border-emerald-200">
            <div className="flex items-center justify-center gap-2 text-emerald-600">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">Pagamento confirmado! Redirecionando...</span>
            </div>
          </section>
        ) : (
          <section className="mx-4 mt-2 rounded-xl p-3.5 bg-blue-50 border border-blue-100">
            <div className="flex items-center justify-center gap-2 text-blue-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm font-medium">Aguardando confirmação do pagamento...</span>
            </div>
          </section>
        )}

        {/* Instructions */}
        <section className="bg-white mx-4 mt-4 rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm font-bold text-gray-900 mb-3">Como pagar:</h2>
          <ol className="space-y-2.5 text-sm text-gray-600">
            <li className="flex gap-2.5 items-start">
              <span className="font-bold text-sm" style={{ color: PINK }}>1.</span>
              <span>Abra o app do seu banco</span>
            </li>
            <li className="flex gap-2.5 items-start">
              <span className="font-bold text-sm" style={{ color: PINK }}>2.</span>
              <span>Escolha pagar via PIX com QR Code ou código</span>
            </li>
            <li className="flex gap-2.5 items-start">
              <span className="font-bold text-sm" style={{ color: PINK }}>3.</span>
              <span>Escaneie ou cole o código copiado</span>
            </li>
            <li className="flex gap-2.5 items-start">
              <span className="font-bold text-sm" style={{ color: PINK }}>4.</span>
              <span>Confirme o pagamento no app do banco</span>
            </li>
          </ol>

          <div className="flex items-center justify-center gap-2 mt-5 pt-4 border-t border-gray-100">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-medium text-emerald-600">Pagamento 100% seguro</span>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PixPayment;
