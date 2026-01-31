import { useState, useEffect } from "react";
import Header from "@/components/Header";
import SellerInfo from "@/components/SellerInfo";
import ProductTabs from "@/components/ProductTabs";
import ProductCard, { Product } from "@/components/ProductCard";
import CouponModal from "@/components/CouponModal";
import ChatModal from "@/components/ChatModal";

// Product images
import prod1Img from "@/assets/prod1.png";
import prod2Img from "@/assets/prod2.png";
import prod3Img from "@/assets/prod3.png";
import prod4Img from "@/assets/prod4.png";
import prod5Img from "@/assets/prod5.png";
import prod6Img from "@/assets/prod6.png";
import prod7Img from "@/assets/prod7.png";
import prod8Img from "@/assets/prod8.png";
import prod9Img from "@/assets/prod9.png";

const products: Product[] = [
  {
    id: "mounjaro",
    name: "Mounjaro™️ 2,5 mg – Tirzepatida (caneta injetável)",
    image: prod1Img,
    price: 67.90,
    originalPrice: 1789.87,
    discount: "11.11",
    promoLabel: "96% OFF",
    rating: 4.8,
    soldCount: 2540,
    hasFreeShipping: true,
  },
  {
    id: "smarttv43",
    name: "Smart TV Samsung 43\" Crystal UHD 4K UN43U8600 2025",
    image: prod2Img,
    price: 2408.61,
    originalPrice: 2589.90,
    discount: "7% OFF",
    promoLabel: "PIX",
    rating: 4.9,
    soldCount: 2224,
    hasFreeShipping: true,
  },
  {
    id: "pcgamer",
    name: "PC Gamer Pichau Afrodite i5-12400F RTX 4060 16GB SSD 1TB",
    image: prod3Img,
    price: 3899.90,
    originalPrice: 4599.90,
    discount: "15% OFF",
    promoLabel: "PROMO",
    rating: 4.9,
    soldCount: 856,
    hasFreeShipping: true,
  },
  {
    id: "caixadesom4",
    name: "Caixa de Som Boombox Plus AIWA BBS-01-LBL 200W BT 30H IP66 USB RGB",
    image: prod4Img,
    price: 87.30,
    originalPrice: 2379.90,
    discount: "11.11",
    promoLabel: "96% OFF",
    rating: 4.6,
    soldCount: 4549,
    hasFreeShipping: true,
  },
  {
    id: "ps5pro",
    name: "Console PlayStation 5 Pro Sony SSD 2TB DualSense Branco",
    image: prod5Img,
    price: 4299.90,
    originalPrice: 4799.90,
    discount: "10% OFF",
    promoLabel: "LANÇAMENTO",
    rating: 4.9,
    soldCount: 3247,
    hasFreeShipping: true,
  },
  {
    id: "steamdeck",
    name: "Valve Steam Deck Console portátil 64GB SSD Midnight Black",
    image: prod6Img,
    price: 2699.90,
    originalPrice: 3599.90,
    discount: "11.11",
    promoLabel: "25% OFF",
    rating: 4.7,
    soldCount: 2156,
    hasFreeShipping: true,
  },
  {
    id: "psportal",
    name: "Reprodutor remoto PlayStation Portal Midnight Black",
    image: prod7Img,
    price: 1899.90,
    originalPrice: 2239.90,
    discount: "11.11",
    promoLabel: "15% OFF",
    rating: 4.6,
    soldCount: 1894,
    hasFreeShipping: true,
  },
  {
    id: "xboxalldigital",
    name: "Microsoft Xbox All Digital Console + Controle Branco",
    image: prod8Img,
    price: 1899.90,
    originalPrice: 2299.90,
    discount: "11.11",
    promoLabel: "85% OFF",
    rating: 4.6,
    soldCount: 2130,
    hasFreeShipping: true,
  },
  {
    id: "alienware",
    name: "Alienware Aurora R16 Gaming Desktop Intel i9-14900KF RTX 4080",
    image: prod9Img,
    price: 15999.90,
    originalPrice: 18999.90,
    discount: "11.11",
    promoLabel: "85% OFF",
    rating: 4.6,
    soldCount: 781,
    hasFreeShipping: true,
  },
];

const Index = () => {
  const [showCoupon, setShowCoupon] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const couponShown = localStorage.getItem("couponShown");
    if (couponShown !== "true") {
      setShowCoupon(true);
    }
  }, []);

  const handleCloseCoupon = () => {
    setShowCoupon(false);
  };

  const handleAddToCart = (product: Product) => {
    setCartCount((prev) => prev + 1);
    console.log("Adicionado ao carrinho:", product.name);
  };

  const handleBuy = (product: Product) => {
    console.log("Comprar:", product.name);
  };

  return (
    <div className="min-h-dvh flex flex-col bg-background">
      <CouponModal isOpen={showCoupon} onClose={handleCloseCoupon} />
      <ChatModal isOpen={showChat} onClose={() => setShowChat(false)} />

      <Header cartCount={cartCount} />

      <main className="flex-1">
        <SellerInfo onMessageClick={() => setShowChat(true)} />

        {/* Separador */}
        <div className="h-2 bg-muted" />

        <ProductTabs>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onBuy={handleBuy}
              onAddToCart={handleAddToCart}
            />
          ))}
        </ProductTabs>
      </main>

      {/* Year element (hidden) */}
      <span id="year" className="sr-only">
        {new Date().getFullYear()}
      </span>
    </div>
  );
};

export default Index;
