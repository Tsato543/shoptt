import { ArrowLeft, Search, ShoppingCart } from "lucide-react";
import setaImg from "@/assets/seta.png";

interface HeaderProps {
  cartCount?: number;
  onBack?: () => void;
  onShare?: () => void;
  onCartClick?: () => void;
}

const Header = ({ cartCount = 0, onBack, onShare, onCartClick }: HeaderProps) => {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (window.history.length > 1) {
      window.history.back();
    }
  };

  const handleShare = async () => {
    if (onShare) {
      onShare();
      return;
    }
    
    try {
      if (navigator.share) {
        await navigator.share({ title: document.title, url: location.href });
      } else {
        await navigator.clipboard.writeText(location.href);
      }
    } catch (e) {
      // noop
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border/0">
      <div className="max-w-6xl mx-auto px-3 py-2">
        <div className="flex items-center gap-3">
          {/* Voltar */}
          <button
            onClick={handleBack}
            className="shrink-0 p-2 rounded-lg hover:bg-muted active:scale-95 transition"
            aria-label="Voltar"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={1.8} />
          </button>

          {/* Busca */}
          <div className="flex-1">
            <label className="relative block">
              <span className="absolute inset-y-0 left-2 flex items-center">
                <Search className="w-4 h-4 text-muted-foreground" />
              </span>
              <input
                type="text"
                placeholder="Pesquisar"
                className="w-full rounded-2xl bg-muted placeholder-muted-foreground text-[15px] pl-8 pr-3 py-2 outline-none focus:ring-2 focus:ring-muted"
              />
            </label>
          </div>

          {/* Compartilhar */}
          <button
            onClick={handleShare}
            className="shrink-0 p-2 rounded-lg hover:bg-muted active:scale-95 transition"
            aria-label="Compartilhar"
          >
            <img src={setaImg} alt="Compartilhar" className="w-5 h-5" />
          </button>

          {/* Carrinho */}
          <button
            onClick={onCartClick}
            className="shrink-0 p-2 rounded-lg hover:bg-muted active:scale-95 transition relative"
            aria-label="Carrinho"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 shadow-md border-2 border-background">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
