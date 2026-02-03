import { CheckCircle, AlertTriangle, Clock, Gift, CircleCheck } from "lucide-react";
import tiktokLogo from "@/assets/tiktok-shop.png";

const Upsell5 = () => {
  const handleClick = () => {
    // Redireciona para link externo ou ação final
    window.open('https://www.tiktok.com', '_blank');
  };

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
        {/* Card Principal */}
        <div className="bg-card rounded-2xl shadow-card overflow-hidden">
          {/* Pedido Confirmado */}
          <div className="p-6 text-center border-b border-border">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CheckCircle className="w-6 h-6 text-emerald-500" />
              <h1 className="text-xl font-bold text-foreground">Pedido confirmado</h1>
            </div>
            <p className="text-muted-foreground text-sm">
              Seu produto chegará em breve
            </p>
          </div>

          {/* Desculpas */}
          <div className="p-6 text-center border-b border-border bg-rose-50">
            <div className="flex items-center justify-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              <span className="text-rose-500 font-semibold">Pedimos desculpas pelo inconveniente</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Para compensar, temos uma oportunidade exclusiva para você.
            </p>
          </div>

          {/* Pesquisa Bonificada */}
          <div className="p-6 text-center">
            <span className="inline-block bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-full mb-4 uppercase tracking-wide">
              PESQUISA BONIFICADA
            </span>
            
            <h2 className="text-xl font-bold text-foreground mb-3">
              Seu CPF foi selecionado
            </h2>
            
            <p className="text-4xl font-extrabold text-emerald-500 mb-4">
              GANHE ATÉ R$ 3000
            </p>
            
            <p className="text-muted-foreground text-sm mb-6">
              Participe da campanha do TikTok e seja bonificado em dinheiro por suas respostas.
            </p>

            {/* Lista de benefícios */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-center gap-3">
                <Clock className="w-5 h-5 text-emerald-500" />
                <span className="text-foreground">Apenas 2 minutos</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Gift className="w-5 h-5 text-emerald-500" />
                <span className="text-foreground">Ganhe até R$ 3000 em dinheiro</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <CircleCheck className="w-5 h-5 text-emerald-500" />
                <span className="text-foreground">Pagamento imediato</span>
              </div>
            </div>

            {/* Botão */}
            <button
              onClick={handleClick}
              className="w-full bg-foreground hover:bg-foreground/90 text-background font-bold py-4 px-6 rounded-xl text-base transition-colors shadow-lg uppercase tracking-wide"
            >
              QUERO GANHAR ATÉ R$ 3000
            </button>
          </div>
        </div>

        {/* Texto final */}
        <p className="text-center text-muted-foreground text-sm px-4">
          Esta é uma compensação exclusiva pelo inconveniente. Seu CPF foi aprovado para receber o valor.
        </p>
      </div>
    </div>
  );
};

export default Upsell5;
