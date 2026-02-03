import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Copy, Loader2, ShieldCheck } from "lucide-react";

type PixState = {
  amountReais: number;
  quantityLabel?: string;
  qrCode?: string;
  qrImageUrl?: string;
  expiresAt?: string;
};

// Mantém consistência com o checkout atual
const PINK = "#FF3B66";

const formatMoneyBRL = (value: number) =>
  `R$ ${value.toFixed(2).replace(".", ",")}`;

const clamp0 = (n: number) => (n < 0 ? 0 : n);

const PixPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state || null) as PixState | null;

  const expiresAtMs = useMemo(() => {
    if (!state?.expiresAt) return Date.now() + 30 * 60 * 1000;
    const ms = Date.parse(state.expiresAt);
    return Number.isFinite(ms) ? ms : Date.now() + 30 * 60 * 1000;
  }, [state?.expiresAt]);

  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(t);
  }, []);

  const remainingMs = clamp0(expiresAtMs - now);
  const mm = Math.floor(remainingMs / 60000);
  const ss = Math.floor((remainingMs % 60000) / 1000);
  const timerText = `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;

  if (!state) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] flex flex-col">
        <header className="bg-white px-4 py-3 flex items-center gap-3 border-b border-gray-100">
          <button onClick={() => navigate("/checkout")} className="p-1 -ml-1" aria-label="Voltar">
            <ArrowLeft className="w-6 h-6 text-gray-700" strokeWidth={1.5} />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Pagamento PIX</h1>
        </header>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm w-full max-w-md text-center">
            <p className="text-gray-700 font-medium">Nenhum PIX ativo encontrado.</p>
            <p className="text-gray-500 text-sm mt-1">Volte ao checkout e clique em Pagar novamente.</p>
            <button
              onClick={() => navigate("/checkout")}
              className="mt-4 w-full py-3 rounded-xl font-semibold text-white"
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
    <div className="min-h-screen bg-[#F8F8F8] flex flex-col">
      <header className="bg-white px-4 py-3 flex items-center gap-3 border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1" aria-label="Voltar">
          <ArrowLeft className="w-6 h-6 text-gray-700" strokeWidth={1.5} />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">Pagamento PIX</h1>
      </header>

      <div className="h-1 bg-gray-200">
        <div className="h-1 w-2/3" style={{ backgroundColor: PINK }} />
      </div>

      <main className="flex-1 overflow-auto pb-10">
        <section className="mx-4 mt-4">
          <div
            className="rounded-2xl p-5 text-white"
            style={{ background: "linear-gradient(135deg, #FF3B66 0%, #FF4D80 100%)" }}
          >
            <p className="text-center text-white/90 text-sm">Valor a pagar</p>
            <p className="text-center text-5xl font-extrabold mt-2">{formatMoneyBRL(state.amountReais)}</p>
            <p className="text-center text-white/90 mt-2">{state.quantityLabel || "1 item"}</p>
          </div>
        </section>

        <section className="bg-white mx-4 mt-4 rounded-2xl p-5 shadow-sm">
          <p className="text-center text-gray-700 font-medium">
            Escaneie o QR Code com o app do seu banco
          </p>

          <div className="flex justify-center mt-4">
            <div className="rounded-2xl p-4 border border-gray-200 bg-white">
              {state.qrImageUrl ? (
                <img
                  src={state.qrImageUrl}
                  alt="QR Code do PIX"
                  className="w-56 h-56 object-contain"
                  loading="lazy"
                />
              ) : (
                <div className="w-56 h-56 flex items-center justify-center text-gray-400">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 my-4">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-gray-400 text-sm">ou copie o código</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <button
            onClick={async () => {
              if (!state.qrCode) return;
              try {
                await navigator.clipboard.writeText(state.qrCode);
                alert("Código PIX copiado!");
              } catch {
                alert("Não foi possível copiar automaticamente. Segure e copie manualmente.");
              }
            }}
            disabled={!state.qrCode}
            className="w-full py-4 rounded-2xl font-semibold text-base text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-60"
            style={{ backgroundColor: PINK }}
          >
            <Copy className="w-5 h-5" />
            Copiar código PIX
          </button>

          {state.qrCode ? (
            <p className="text-xs text-center text-gray-400 mt-4 break-all line-clamp-2">
              {state.qrCode}
            </p>
          ) : null}
        </section>

        <section className="mx-4 mt-4 rounded-2xl p-4 border border-yellow-200 bg-yellow-50">
          <div className="flex items-center gap-3 text-yellow-800">
            <span className="font-semibold">O PIX expira em:</span>
            <span className="font-extrabold text-xl tabular-nums">{timerText}</span>
          </div>
        </section>

        <section className="mx-4 mt-3 rounded-2xl p-4 border border-blue-200 bg-blue-50">
          <div className="flex items-center gap-3 text-blue-700">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="font-medium">Aguardando confirmação do pagamento...</span>
          </div>
        </section>

        <section className="bg-white mx-4 mt-4 rounded-2xl p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Como pagar:</h2>
          <ol className="space-y-2 text-gray-700">
            <li className="flex gap-2"><span className="font-bold" style={{ color: PINK }}>1.</span> Abra o app do seu banco</li>
            <li className="flex gap-2"><span className="font-bold" style={{ color: PINK }}>2.</span> Escolha pagar via PIX com QR Code ou código</li>
            <li className="flex gap-2"><span className="font-bold" style={{ color: PINK }}>3.</span> Escaneie ou cole o código copiado</li>
            <li className="flex gap-2"><span className="font-bold" style={{ color: PINK }}>4.</span> Confirme o pagamento no app do banco</li>
          </ol>

          <div className="flex items-center justify-center gap-2 mt-5 text-[#2DB573]">
            <ShieldCheck className="w-5 h-5" />
            <span className="font-medium">Pagamento 100% seguro</span>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PixPayment;
