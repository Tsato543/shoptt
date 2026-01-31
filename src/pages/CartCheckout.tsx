import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Minus, Plus, Trash2, Star, Shield, ChevronRight } from "lucide-react";

// Cart images
import emptyCartImg from "@/assets/cart/empty-cart.png";
import prod1Img from "@/assets/cart/prod1.png";
import prod2Img from "@/assets/cart/prod2.png";
import prod3Img from "@/assets/cart/prod3.png";
import prod4Img from "@/assets/cart/prod4.png";
import prod5Img from "@/assets/cart/prod5.png";
import prod6Img from "@/assets/cart/prod6.png";
import prod7Img from "@/assets/cart/prod7.png";
import prod8Img from "@/assets/cart/prod8.png";
import prod9Img from "@/assets/cart/prod9.png";

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

const recommendedProducts = [
  { id: "mounjaro", name: "Mounjaro™️ 2,5 mg – Tirzepatida (caneta injetável)", price: 67.90, oldPrice: 1789.87, sold: 2540, image: prod1Img },
  { id: "smarttv43", name: "Smart TV Samsung 43 Polegadas Crystal UHD 4K UN43U8600 2025", price: 2408.61, oldPrice: 2589.90, sold: 2224, image: prod2Img },
  { id: "pcgamer", name: "PC Gamer Pichau Afrodite i5-12400F RTX 4060 16GB SSD 1TB", price: 3899.90, oldPrice: 4599.90, sold: 856, image: prod3Img },
  { id: "caixadesom4", name: "Caixa de Som Boombox Plus AIWA BBS-01-LBL 200W BT 30H IP66 USB RGB", price: 87.30, oldPrice: 2379.90, sold: 4549, image: prod4Img },
  { id: "ps5pro", name: "Console PlayStation 5 Pro Sony SSD 2TB DualSense Branco", price: 4299.90, oldPrice: 4799.90, sold: 3247, image: prod5Img },
  { id: "steamdeck", name: "Valve Steam Deck Console portátil 64GB SSD Midnight Black", price: 2699.90, oldPrice: 3599.90, sold: 2156, image: prod6Img },
  { id: "psportal", name: "Reprodutor remoto PlayStation Portal Midnight Black", price: 1899.90, oldPrice: 2239.90, sold: 1894, image: prod7Img },
  { id: "xboxalldigital", name: "Microsoft Xbox All Digital Console + Controle Branco", price: 1899.90, oldPrice: 2299.90, sold: 2130, image: prod8Img },
  { id: "alienware", name: "Alienware Aurora R16 Gaming Desktop Intel i9-14900KF RTX 4080", price: 15999.90, oldPrice: 18999.90, sold: 781, image: prod9Img },
];

const CartCheckout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: "mounjaro", name: "Mounjaro™️ 2,5 mg – Tirzepatida", image: prod1Img, price: 67.90, quantity: 1 }
  ]);

  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(items =>
      items.map(item => {
        if (item.id === id) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    console.log("Finalizar compra");
  };

  const handleProductClick = (productId: string) => {
    if (productId === "mounjaro") {
      navigate("/produto/mounjaro");
    }
  };

  return (
    <div className="min-h-dvh flex flex-col bg-muted">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-center px-4 py-4 bg-background border-b">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 hover:bg-muted rounded-lg transition"
          aria-label="Voltar"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold">Carrinho ({totalItems})</h1>
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        {cartItems.length === 0 ? (
          /* Empty Cart */
          <div className="flex-1 bg-background px-5 py-10 flex flex-col items-center justify-center">
            <div className="text-center">
              <img src={emptyCartImg} alt="Carrinho vazio" className="w-40 h-auto mx-auto mb-6" />
              <div className="text-xl font-bold text-foreground mb-3">Seu carrinho está vazio</div>
              <div className="text-base text-muted-foreground mb-8">
                Adicione produtos para continuar comprando!
              </div>
              <button
                onClick={() => navigate("/")}
                className="w-full max-w-[300px] bg-primary text-primary-foreground py-4 px-6 rounded-lg font-bold shadow-lg hover:opacity-90 transition"
              >
                Começar a comprar
              </button>
            </div>
          </div>
        ) : (
          /* Cart Items */
          <div className="bg-background">
            {cartItems.map(item => (
              <div key={item.id} className="flex items-center p-4 border-b">
                <div className="w-20 h-20 rounded-lg overflow-hidden mr-3 shrink-0 bg-white">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="text-base font-semibold mb-1 line-clamp-2">{item.name}</div>
                  <div className="text-primary font-semibold mb-2">R$ {formatPrice(item.price)}</div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-7 h-7 rounded-full border flex items-center justify-center text-primary font-bold hover:bg-muted transition"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="min-w-6 text-center font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-7 h-7 rounded-full border flex items-center justify-center text-primary font-bold hover:bg-muted transition"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-primary p-2 hover:bg-muted rounded-lg transition"
                  aria-label="Remover item"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Customer Protection */}
        <section className="bg-[#fdf4e9] text-[#8b5e34]">
          <div className="flex items-center justify-between px-3 py-1.5">
            <div className="inline-flex items-center gap-2 font-semibold text-[13px]">
              <Shield className="w-4 h-4" fill="currentColor" />
              Proteção do cliente
            </div>
            <ChevronRight className="w-5 h-5" strokeWidth={1.6} />
          </div>
          <div className="px-3 pb-2 text-[13px] text-[#6b4b2a]">
            <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
              <div className="flex items-start gap-1.5">
                <span className="text-[#a3773f]">✓</span>
                <span>Devolução gratuita</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-[#a3773f]">✓</span>
                <span>Reembolso automático por danos</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-[#a3773f]">✓</span>
                <span>Pagamento seguro</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-[#a3773f]">✓</span>
                <span>Cupom por atraso na coleta</span>
              </div>
            </div>
          </div>
        </section>

        {/* Recommended Products */}
        <section className="bg-muted px-3 pt-4 pb-6">
          <h2 className="text-lg font-semibold text-foreground mb-3">Você também pode gostar</h2>
          <div className="grid grid-cols-2 gap-3">
            {recommendedProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => handleProductClick(p.id)}
                className="block rounded-2xl bg-background border border-border shadow-sm overflow-hidden cursor-pointer"
              >
                <div className="aspect-[4/3] bg-white">
                  <img src={p.image} alt={p.name} className="w-full h-full object-contain p-2" />
                </div>
                <div className="p-2.5">
                  <p className="text-[13px] text-foreground leading-snug line-clamp-2 min-h-[34px]">
                    {p.name}
                  </p>
                  <div className="mt-1">
                    <div className="flex items-baseline gap-2">
                      <div className="text-primary font-bold text-[16px]">R$ {formatPrice(p.price)}</div>
                      <span className="inline-flex h-5 px-1.5 rounded bg-sale text-white text-[11px] font-bold leading-none items-center">
                        11.11
                      </span>
                    </div>
                    <div className="text-[12px] text-muted-foreground line-through">
                      R$ {formatPrice(p.oldPrice)}
                    </div>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-[11px]">
                    <span className="inline-flex items-center px-1.5 py-[2px] rounded bg-accent text-accent-foreground font-bold">
                      85% OFF
                    </span>
                    <span className="badge-shipping">Frete grátis</span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-1.5 text-[12px] text-muted-foreground">
                    <Star className="w-4 h-4 text-warning" fill="currentColor" />
                    <span>4.8</span>
                    <span>• {p.sold.toLocaleString("pt-BR")} vendidos</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Cart Summary (fixed at bottom when has items) */}
      {cartItems.length > 0 && (
        <div className="sticky bottom-0 bg-background border-t p-4 space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>R$ {formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Frete</span>
            <span className="text-success font-semibold">Grátis</span>
          </div>
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>R$ {formatPrice(subtotal)}</span>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full bg-primary text-primary-foreground py-4 rounded-lg font-semibold text-base hover:opacity-90 transition"
          >
            Finalizar compra
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-background text-primary border-2 border-primary py-3.5 rounded-lg font-bold text-base hover:bg-primary hover:text-primary-foreground transition shadow-sm"
          >
            Adicionar mais produtos
          </button>
        </div>
      )}
    </div>
  );
};

export default CartCheckout;
