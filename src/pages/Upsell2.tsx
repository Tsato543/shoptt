import { CreditCard, Info, HelpCircle } from "lucide-react";
import tiktokLogo from "@/assets/tiktok-shop.png";

const Upsell2 = () => {
  return (
    <div className="min-h-screen bg-secondary/30 flex flex-col">
      {/* Header */}
      <div className="bg-card py-4 border-b border-border">
        <img 
          src={tiktokLogo} 
          alt="TikTok Shop" 
          className="h-8 mx-auto"
        />
      </div>

      <div className="flex-1 p-4 space-y-4 max-w-md mx-auto w-full">
        {/* Status do Pedido */}
        <div className="bg-card rounded-2xl p-6 shadow-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-xl font-bold text-foreground">Status do Pedido</h1>
          </div>

          <div className="border border-border rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground text-sm">Número do pedido:</span>
              <span className="text-primary font-semibold">00044792</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground text-sm">Status:</span>
              <span className="text-primary font-semibold">Aguardando pagamento</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground text-sm">Valor da TENF:</span>
              <span className="text-primary font-semibold">R$ 26,75</span>
            </div>
          </div>
        </div>

        {/* Pagamento Pendente */}
        <div className="bg-card rounded-2xl p-6 shadow-card">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Pagamento Pendente</h2>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Seu pedido está quase pronto para ser enviado! Para finalizar o processo, precisamos que você realize o pagamento da <strong className="text-foreground">TENF</strong> (Taxa de Emissão da Nota Fiscal) no valor de R$ 26,75.
          </p>
        </div>

        {/* Botão - será integrado depois */}
        <button
          className="w-full font-bold py-4 px-6 rounded-xl text-base transition-colors shadow-lg uppercase tracking-wide text-white"
          style={{ backgroundColor: '#ff3870' }}
        >
          Pagar TENF - R$ 26,75
        </button>

        {/* Por que preciso pagar */}
        <div className="bg-card rounded-2xl p-6 shadow-card">
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Por que preciso pagar a TENF?</h2>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            A TENF é uma taxa obrigatória para emissão da nota fiscal do seu produto. Sem esse pagamento, não podemos finalizar o processo de despacho. Após o pagamento, seu pedido será enviado em até 24 horas.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Upsell2;
