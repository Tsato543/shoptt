import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, MoreHorizontal, ChevronRight, ChevronLeft, Bookmark, Star, Zap, Shield } from "lucide-react";
import { trackViewContent, trackPageView } from "@/lib/tiktokPixel";

// Components
import ReviewSection from "@/components/ReviewSection";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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
  const [termsOpen, setTermsOpen] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const images = [
    { src: foto1, alt: "Mounjaro™️ 5 mg — Caneta injetável" },
    { src: foto2, alt: "Embalagem do Mounjaro™️ com QR code" },
    { src: foto3, alt: "Mounjaro™️ 5 mg — Vista lateral" },
    { src: foto4, alt: "Mounjaro™️ 5 mg — Produto na mão" },
  ];

  // Track ViewContent on mount - using actual checkout price
  useEffect(() => {
    trackPageView();
    trackViewContent('mounjaro-5mg', 'Mounjaro™️ 5 mg — Caneta injetável', 99.90);
  }, []);

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
    navigate("/checkout");
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
              <span className="text-[22px] font-extrabold leading-none">R$ 99,90</span>
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

        {/* Terms Link */}
        <Collapsible open={termsOpen} onOpenChange={setTermsOpen} className="px-3 py-4">
          <CollapsibleTrigger className="text-[10px] text-muted-foreground/50 hover:text-muted-foreground w-full text-center">
            Termos de Uso {termsOpen ? "▲" : "▼"}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <div className="text-[9px] text-muted-foreground/70 leading-relaxed space-y-2 text-justify">
              <p><strong>TERMOS DE USO, CIÊNCIA E CONCORDÂNCIA</strong></p>
              <p>Ao acessar, navegar, visualizar, contratar, adquirir, efetuar pagamento, confirmar inscrição, prosseguir, clicar em qualquer botão, preencher formulários, acessar áreas restritas ou utilizar de qualquer forma o conteúdo disponibilizado, o usuário declara, de maneira livre, consciente, voluntária e informada, que leu integralmente o presente termo, compreendeu seu conteúdo e concorda com todas as condições aqui descritas, sem qualquer ressalva, oposição ou questionamento.</p>
              <p>O usuário reconhece que este termo possui natureza contratual, produzindo efeitos jurídicos imediatos, sendo o aceite eletrônico plenamente válido, equivalente à assinatura física, para todos os fins legais.</p>
              <p>O usuário declara que compreende que o acesso ao conteúdo ocorre por meios digitais, eletrônicos ou online, sendo de sua inteira responsabilidade dispor de conexão com a internet, dispositivos compatíveis, softwares atualizados e condições técnicas adequadas para utilização do conteúdo.</p>
              <p>O fornecedor não se responsabiliza por falhas de acesso decorrentes de fatores externos, incluindo, mas não se limitando a, instabilidades de conexão, indisponibilidade temporária de plataformas, falhas de servidores, manutenções técnicas, atualizações de sistema, limitações de dispositivos ou quaisquer problemas alheios ao seu controle.</p>
              <p>O usuário reconhece que o conteúdo disponibilizado possui caráter informativo, educativo e orientativo, não constituindo aconselhamento personalizado, promessa de resultado, garantia de desempenho ou obrigação de resultado específico.</p>
              <p>O usuário declara ciência de que qualquer resultado obtido depende exclusivamente de fatores individuais, tais como dedicação pessoal, correta aplicação das orientações, disciplina, contexto pessoal, fatores externos e circunstâncias alheias ao controle do fornecedor.</p>
              <p>O fornecedor não garante, de forma expressa ou implícita, qualquer tipo de resultado, retorno, benefício ou desempenho específico, sendo vedada qualquer interpretação nesse sentido.</p>
              <p>O usuário assume integral responsabilidade pelas decisões tomadas com base no conteúdo acessado, isentando o fornecedor de qualquer responsabilidade por perdas, danos, prejuízos, expectativas frustradas ou consequências diretas ou indiretas decorrentes do uso das informações disponibilizadas.</p>
              <p>O usuário declara que compreende que exemplos, simulações, relatos, ilustrações ou demonstrações eventualmente apresentadas possuem caráter meramente ilustrativo, não representando promessa, garantia ou obrigação de resultado.</p>
              <p>O usuário compromete-se a utilizar o conteúdo de forma ética, lícita e exclusivamente pessoal, sendo expressamente proibida a reprodução, cópia, distribuição, compartilhamento, cessão, revenda, disponibilização pública ou privada, total ou parcial, do conteúdo, sem autorização expressa do fornecedor.</p>
              <p>O conteúdo é protegido por direitos autorais e demais legislações aplicáveis, sendo o uso indevido passível de bloqueio imediato de acesso, suspensão, cancelamento e adoção de medidas legais cabíveis, inclusive responsabilização civil e criminal.</p>
              <p>O usuário reconhece que não possui qualquer direito de propriedade sobre o conteúdo disponibilizado, recebendo apenas uma autorização limitada, pessoal e intransferível de acesso e uso, conforme as condições estabelecidas neste termo.</p>
              <p>O aceite deste termo é realizado de forma irretratável, não sendo admitida, em nenhuma hipótese, alegação futura de desconhecimento, erro, confusão, má interpretação, omissão de informação ou discordância com qualquer cláusula aqui prevista.</p>
              <p>O fornecedor poderá alterar, atualizar ou modificar estes termos a qualquer momento, sendo responsabilidade do usuário manter-se informado, e a continuidade do uso do conteúdo após eventuais alterações será considerada aceitação automática e integral das novas condições.</p>
              <p>Caso qualquer cláusula deste termo venha a ser considerada inválida, ilegal ou inexequível, tal circunstância não afetará a validade e eficácia das demais cláusulas, que permanecerão plenamente vigentes.</p>
              <p>O usuário declara que compreende que o presente termo substitui qualquer acordo, entendimento ou comunicação anterior, verbal ou escrita, relacionada ao acesso e uso do conteúdo disponibilizado.</p>
              <p>O usuário reconhece que não existe relação de sociedade, parceria, representação, vínculo empregatício ou qualquer outro vínculo além daquele estritamente definido neste termo.</p>
              <p>O usuário declara que realizou a aquisição de forma consciente, sem qualquer tipo de coação, induzimento ou pressão indevida, estando plenamente apto a aceitar as condições aqui estabelecidas.</p>
              <p>O usuário reconhece que é responsável por manter a confidencialidade de seus dados de acesso, não devendo compartilhá-los com terceiros, respondendo integralmente por qualquer uso indevido decorrente de sua negligência.</p>
              <p>O fornecedor não se responsabiliza por acessos realizados por terceiros mediante uso indevido das credenciais do usuário.</p>
              <p>Somente após a plena ciência e aceitação de todos os termos gerais acima, o usuário declara compreender a natureza específica do produto disponibilizado.</p>
              <p>O usuário reconhece expressamente que o produto adquirido consiste exclusivamente em um protocolo digital, composto por informações, orientações, métodos, conteúdos educativos e materiais acessados por meios eletrônicos.</p>
              <p>O usuário declara estar plenamente ciente de que o produto não se caracteriza como bem material, não envolvendo envio, entrega, transporte, logística ou disponibilização de qualquer item físico.</p>
              <p>Não haverá, em hipótese alguma, o envio de caixas, embalagens, brindes, mercadorias, produtos tangíveis, materiais impressos, equipamentos, objetos ou qualquer outro bem físico.</p>
              <p>O acesso ao protocolo ocorre exclusivamente em ambiente digital, por meio de plataformas online, áreas de membros, sistemas eletrônicos, links ou meios digitais informados após a confirmação.</p>
              <p>O usuário declara compreender que não existe estoque, frete, prazo de entrega física ou qualquer obrigação logística associada ao produto.</p>
              <p>Qualquer expectativa de recebimento de produto físico é considerada inexistente, infundada e incompatível com a proposta apresentada, não sendo aceita alegação posterior de erro, confusão ou interpretação equivocada.</p>
              <p>O usuário declara que compreendeu integralmente que adquiriu um produto de natureza intangível, digital, acessado exclusivamente por meios eletrônicos.</p>
              <p>Ao prosseguir, o usuário afirma estar 100% ciente da natureza digital do produto, declarando que sua decisão foi tomada de forma consciente, informada e voluntária.</p>
              <p>O usuário reconhece que todas as informações necessárias para compreensão da natureza do produto foram disponibilizadas de forma clara e suficiente antes da finalização.</p>
              <p>O usuário declara, de forma definitiva, que leu todo o conteúdo deste termo, compreendeu cada cláusula, concorda integralmente com todas as condições aqui descritas e aceita, sem qualquer ressalva, a natureza digital do produto e as regras de uso estabelecidas.</p>
            </div>
          </CollapsibleContent>
        </Collapsible>
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
