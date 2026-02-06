import promoBanner from "@/assets/checkout/promo-banner-new.jpg";

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
    </div>
  );
};

export default CheckoutPromoBanner;
