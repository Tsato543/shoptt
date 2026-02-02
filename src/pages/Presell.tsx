import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

type Step = "welcome" | "name" | "age" | "loading";

const Presell = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("welcome");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (step === "loading") {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            navigate("/produto");
            return 100;
          }
          return prev + 2;
        });
      }, 80);

      return () => clearInterval(interval);
    }
  }, [step, navigate]);

  const handleContinue = () => {
    if (step === "welcome") {
      setStep("name");
    } else if (step === "name" && name.trim()) {
      setStep("age");
    } else if (step === "age" && age) {
      setStep("loading");
    }
  };

  const getLoadingText = () => {
    if (progress < 30) return "Iniciando...";
    if (progress < 60) return "Processando...";
    if (progress < 90) return "Quase pronto...";
    return "Redirecionando...";
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-card p-8 text-center">
        {step === "welcome" && (
          <div className="space-y-6">
            <h1 className="text-2xl font-extrabold text-foreground">Parabéns!</h1>
            <p className="text-muted-foreground">
              Você vai garantir nosso produto em condição especial.
            </p>
            <div className="bg-sale/90 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2">
              <span>⚠️</span>
              <span>Restam apenas 19 unidades em estoque.</span>
            </div>
            <button
              onClick={handleContinue}
              className="w-full bg-success hover:bg-success/90 text-white font-bold py-4 px-6 rounded-xl text-lg transition-colors"
            >
              Continuar
            </button>
          </div>
        )}

        {step === "name" && (
          <div className="space-y-6">
            <h1 className="text-2xl font-extrabold text-foreground">Antes de continuar</h1>
            <input
              type="text"
              placeholder="Digite seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-5 py-4 text-lg border border-border rounded-xl bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-success/50"
            />
            <button
              onClick={handleContinue}
              disabled={!name.trim()}
              className="w-full bg-success hover:bg-success/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl text-lg transition-colors"
            >
              Continuar
            </button>
          </div>
        )}

        {step === "age" && (
          <div className="space-y-6">
            <h1 className="text-2xl font-extrabold text-foreground">Confirme sua idade</h1>
            <select
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full px-5 py-4 text-lg border border-success rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-success/50 appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23666'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M8 9l4-4 4 4m0 6l-4 4-4-4'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 1rem center",
                backgroundSize: "1.5rem",
              }}
            >
              <option value="" disabled>
                Digite sua idade
              </option>
              {Array.from({ length: 83 }, (_, i) => i + 18).map((ageOption) => (
                <option key={ageOption} value={ageOption}>
                  {ageOption} anos
                </option>
              ))}
            </select>
            <button
              onClick={handleContinue}
              disabled={!age}
              className="w-full bg-success hover:bg-success/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl text-lg transition-colors"
            >
              Continuar
            </button>
          </div>
        )}

        {step === "loading" && (
          <div className="space-y-6">
            <h1 className="text-2xl font-extrabold text-foreground">Aguarde um momento</h1>
            <p className="text-muted-foreground">
              Você está sendo redirecionado(a) para nossa página de vendas!
            </p>
            <div className="text-4xl font-bold text-sale">{progress}%</div>
            <div className="relative h-3 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full transition-all duration-100 rounded-full"
                style={{
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, hsl(var(--sale)) 0%, hsl(280, 70%, 50%) 50%, hsl(180, 70%, 50%) 100%)",
                }}
              />
            </div>
            <p className="text-muted-foreground">{getLoadingText()}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Presell;
