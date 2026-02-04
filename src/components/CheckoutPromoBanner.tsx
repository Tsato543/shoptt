import promoBanner from "@/assets/checkout/promo-banner.png";

const CheckoutPromoBanner = () => {
  return (
    <div className="mx-4 mt-4">
      <img 
        src={promoBanner} 
        alt="Valor Promocional Interno SlimHealth" 
        className="w-full rounded-xl shadow-sm"
      />
    </div>
  );
};

export default CheckoutPromoBanner;
