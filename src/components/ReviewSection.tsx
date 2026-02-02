import { Star, ChevronRight, Check } from "lucide-react";

// Avatares
import carlosSilva from "@/assets/reviews/carlos_silva.jpeg";
import carlosProva from "@/assets/reviews/carlos_prova.jpeg";
import anaSantos from "@/assets/reviews/ana_santos.jpeg";
import anaProva from "@/assets/reviews/ana_prova.jpeg";
import joaoPereira from "@/assets/reviews/joao_pereira.jpeg";
import joaoProva from "@/assets/reviews/joao_prova.jpeg";
import fernandaLima from "@/assets/reviews/fernanda_lima.jpeg";
import fernandaProva from "@/assets/reviews/fernanda_prova.jpeg";
import robertoMendes from "@/assets/reviews/roberto_mendes.jpeg";
import robertoProva from "@/assets/reviews/roberto_prova.jpeg";

const reviews = [
  {
    name: "Carlos Silva",
    avatar: carlosSilva,
    rating: 5,
    text: "Acabei de receber hoje, vou tomar hoje mesmo!! Chegou super rapido e bem embalado. Ansiosa pelos resultados 🙌",
    proofImage: carlosProva,
  },
  {
    name: "Ana Santos",
    avatar: anaSantos,
    rating: 5,
    text: "Gente funciona demais!! Ja perdi 4kg em 2 semanas. Super recomendo p qm quer emagrecer de vdd",
    proofImage: anaProva,
  },
  {
    name: "João Pereira",
    avatar: joaoPereira,
    rating: 5,
    text: "Melhor compra q fiz!! O preco ta mt bom comparado as farmacias. Ja é a segunda vez q compro aqui",
    proofImage: joaoProva,
  },
  {
    name: "Fernanda Lima",
    avatar: fernandaLima,
    rating: 5,
    text: "Chegou certinho!! Produto original, lacrado. Minha endocrinologista aprovou. Ja to na segunda dose e sem efeitos colaterais",
    proofImage: fernandaProva,
  },
  {
    name: "Roberto Mendes",
    avatar: robertoMendes,
    rating: 4,
    text: "Recomendo demais! Minha esposa perdeu 6kg no primeiro mes. Agora to comprando pra mim tbm haha",
    proofImage: robertoProva,
  },
];

const ReviewSection = () => {
  return (
    <section className="bg-background px-3 py-3">
      <div className="flex items-center justify-between">
        <h2 className="text-[14px] font-semibold text-foreground">
          Avaliações dos clientes <span className="text-muted-foreground font-normal">({reviews.length})</span>
        </h2>
        <button className="flex items-center gap-1 text-muted-foreground text-[12px]">
          Ver mais
          <ChevronRight className="w-4 h-4" strokeWidth={1.6} />
        </button>
      </div>

      <div className="mt-1 flex items-center gap-2 text-[13px]">
        <span className="font-semibold">4.9</span>
        <span className="text-muted-foreground">/ 5</span>
        <div className="flex items-center gap-0.5 ml-1">
          {[1, 2, 3, 4].map((i) => (
            <Star key={i} className="w-4 h-4 text-warning" fill="currentColor" />
          ))}
          <Star className="w-4 h-4 text-warning opacity-50" fill="currentColor" />
        </div>
      </div>

      {reviews.map((review, idx) => (
        <article key={idx} className="mt-4">
          {/* Header: Avatar + Name + Badge */}
          <div className="flex items-center gap-2">
            <img
              src={review.avatar}
              alt={review.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="text-[14px] font-medium text-foreground">{review.name}</div>
            <span className="inline-flex items-center gap-1 text-[12px] text-success font-medium px-2 py-0.5 rounded-full border border-success/30 bg-success/5">
              <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
              Compra confirmada
            </span>
          </div>

          {/* Stars */}
          <div className="mt-1.5 flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i <= review.rating ? "text-warning" : "text-muted-foreground/30"}`}
                fill="currentColor"
              />
            ))}
          </div>

          {/* Text */}
          <p className="mt-2 text-[13px] text-foreground leading-relaxed">{review.text}</p>

          {/* Proof Image */}
          <div className="mt-2">
            <img
              src={review.proofImage}
              alt="Prova social"
              className="w-28 h-28 rounded-lg object-cover"
            />
          </div>
        </article>
      ))}
    </section>
  );
};

export default ReviewSection;
