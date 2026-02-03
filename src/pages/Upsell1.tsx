import tiktokLogo from "@/assets/tiktok-shop.png";

const Upsell1 = () => {
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
            R$ 47,89
          </p>
          <p className="text-xs text-muted-foreground">
            Taxa única para emissão da nota fiscal
          </p>
        </div>

        {/* Botão - será integrado depois */}
        <button
          className="w-full font-bold py-4 px-6 rounded-xl text-base transition-colors shadow-lg text-white"
          style={{ backgroundColor: '#ff3870' }}
        >
          EFETUAR PAGAMENTO DA TAXA
        </button>

        {/* Texto explicativo */}
        <div className="bg-secondary/30 rounded-xl p-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Para receber seu produto do TikTok Shop, é necessário pagar a NF-e (Taxa de Emissão de Nota Fiscal). Sem o pagamento, o envio não será autorizado e o pedido será cancelado. Após a confirmação, o produto é enviado imediatamente para o endereço cadastrado.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Upsell1;
