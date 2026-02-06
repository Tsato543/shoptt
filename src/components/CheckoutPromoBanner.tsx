import promoBanner from "@/assets/checkout/promo-banner-new.jpg";
import anvisaLogo from "@/assets/checkout/anvisa-logo.png";
import govbrLogo from "@/assets/checkout/govbr-logo.png";

const CheckoutPromoBanner = () => {
  return (
    <div className="mx-4 mt-4">
      <img 
        src={promoBanner} 
        alt="Estoque interno de funcionários liberado ao público - R$ 99,90" 
        className="w-full rounded-xl shadow-sm"
      />
      <p className="text-[10px] text-gray-500 text-center mt-2 px-2 leading-tight">
        Esse valor é mais baixo porque esse lote era reservado para funcionários da SlimHealth. Como sobraram algumas unidades, a empresa decidiu liberar o último estoque para o público pelo mesmo preço interno de R$ 99,90.
      </p>
      <div className="flex justify-center items-center gap-4 mt-3">
        <img src={anvisaLogo} alt="ANVISA" className="h-10 object-contain" />
        <img src={govbrLogo} alt="gov.br" className="h-8 object-contain" />
      </div>
    </div>
  );
};

export default CheckoutPromoBanner;
