import { ShoppingCart } from "lucide-react";
import ticketImg from "@/assets/ticket.png";

export interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  discount: string;
  promoLabel: string;
  rating: number;
  soldCount: number;
  hasFreeShipping: boolean;
}

interface ProductCardProps {
  product: Product;
  onBuy?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

const ProductCard = ({ product, onBuy, onAddToCart }: ProductCardProps) => {
  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <article className="py-3 flex gap-3 items-start">
      <div className="flex gap-3 items-start flex-1 cursor-pointer" onClick={() => onBuy?.(product)}>
        <div className="w-20 h-20 rounded overflow-hidden bg-muted shrink-0">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[13px] font-medium text-foreground leading-snug line-clamp-2">
            {product.name}
          </h3>
          <div className="mt-1 flex items-center gap-1 text-[10px] leading-none flex-wrap">
            <span className="badge-sale">{product.discount}</span>
            <span className="badge-promo">
              <img src={ticketImg} alt="ticket" className="w-3.5 h-3.5" />
              {product.promoLabel}
            </span>
            {product.hasFreeShipping && (
              <span className="badge-shipping">Frete grátis</span>
            )}
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">
            <span className="text-warning">★ {product.rating}</span> •{" "}
            {product.soldCount.toLocaleString()} vendido(s)
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <div className="text-[18px] font-bold text-primary">
              R$ {formatPrice(product.price)}
            </div>
            <div className="text-[11px] text-muted-foreground line-through">
              R$ {formatPrice(product.originalPrice)}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-2 shrink-0">
        <button
          onClick={() => onAddToCart?.(product)}
          className="btn-cart"
          aria-label="Adicionar ao carrinho"
        >
          <ShoppingCart className="w-4 h-4" />
        </button>
        <button
          onClick={() => onBuy?.(product)}
          className="btn-primary"
        >
          Comprar
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
