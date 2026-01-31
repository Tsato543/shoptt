import logoImg from "@/assets/logo.png";

interface SellerInfoProps {
  onMessageClick?: () => void;
}

const SellerInfo = ({ onMessageClick }: SellerInfoProps) => {
  return (
    <section className="pt-3 pb-3 border-b">
      <div className="max-w-6xl mx-auto px-3 space-y-3">
        {/* Separador */}
        <div className="h-2 bg-muted rounded-sm"></div>

        {/* Linha vendedor */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={logoImg}
              alt="Atakarejo Oficial"
              className="w-14 h-14 rounded-full object-cover"
            />
            <div className="leading-tight">
              {/* Nome + selo verificado */}
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-[16px]">Atakarejo Oficial</span>
                {/* selo verificado */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="17"
                  height="17"
                  viewBox="0 0 48 48"
                  aria-label="Loja verificada"
                >
                  <polygon
                    fill="#42a5f5"
                    points="29.62,3 33.053,8.308 39.367,8.624 39.686,14.937 44.997,18.367 42.116,23.995 45,29.62 39.692,33.053 39.376,39.367 33.063,39.686 29.633,44.997 24.005,42.116 18.38,45 14.947,39.692 8.633,39.376 8.314,33.063 3.003,29.633 5.884,24.005 3,18.38 8.308,14.947 8.624,8.633 14.937,8.314 18.367,3.003 23.995,5.884"
                  />
                  <polygon
                    fill="#fff"
                    points="21.396,31.255 14.899,24.76 17.021,22.639 21.428,27.046 30.996,17.772 33.084,19.926"
                  />
                </svg>
              </div>
              <div className="text-xs text-muted-foreground">18.8K vendido(s)</div>
            </div>
          </div>

          <button
            onClick={onMessageClick}
            className="px-3 py-1.5 rounded-full border text-sm text-foreground bg-background hover:bg-muted active:scale-95 transition shadow-sm"
            aria-label="Enviar mensagem"
          >
            Mensagem
          </button>
        </div>

        {/* Cartão Cupom */}
        <div className="rounded-xl bg-success-light border border-success/20 px-3 py-3 flex items-start justify-between">
          <div className="text-[13px] leading-tight">
            <div className="font-semibold text-foreground">Semana #JANEIRO</div>
            <div className="text-muted-foreground text-[12px]">
              Cupom de até 85% OFF
            </div>
          </div>
          <div className="text-[12px] font-medium text-success self-center">
            Resgatado
          </div>
        </div>
      </div>
    </section>
  );
};

export default SellerInfo;
