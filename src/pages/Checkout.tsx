import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import slimHealthLogo from "@/assets/slimhealth-logo-2.png";

interface AddressData {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
}

const Checkout = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Format phone
  const formatPhone = (value: string) => {
    const nums = value.replace(/\D/g, "").slice(0, 11);
    if (nums.length <= 2) return nums;
    if (nums.length <= 7) return `(${nums.slice(0, 2)}) ${nums.slice(2)}`;
    return `(${nums.slice(0, 2)}) ${nums.slice(2, 7)}-${nums.slice(7)}`;
  };

  // Format CPF
  const formatCPF = (value: string) => {
    const nums = value.replace(/\D/g, "").slice(0, 11);
    if (nums.length <= 3) return nums;
    if (nums.length <= 6) return `${nums.slice(0, 3)}.${nums.slice(3)}`;
    if (nums.length <= 9) return `${nums.slice(0, 3)}.${nums.slice(3, 6)}.${nums.slice(6)}`;
    return `${nums.slice(0, 3)}.${nums.slice(3, 6)}.${nums.slice(6, 9)}-${nums.slice(9)}`;
  };

  // Format CEP
  const formatCEP = (value: string) => {
    const nums = value.replace(/\D/g, "").slice(0, 8);
    if (nums.length <= 5) return nums;
    return `${nums.slice(0, 5)}-${nums.slice(5)}`;
  };

  // Fetch address from CEP
  const fetchAddress = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length !== 8) return;

    setCepLoading(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data: AddressData & { erro?: boolean } = await response.json();
      
      if (!data.erro) {
        setFormData(prev => ({
          ...prev,
          logradouro: data.logradouro || "",
          bairro: data.bairro || "",
          cidade: data.localidade || "",
          estado: data.uf || "",
        }));
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.cep;
          return newErrors;
        });
      } else {
        setErrors(prev => ({ ...prev, cep: "CEP não encontrado" }));
      }
    } catch {
      setErrors(prev => ({ ...prev, cep: "Erro ao buscar CEP" }));
    } finally {
      setCepLoading(false);
    }
  };

  // Handle CEP change
  useEffect(() => {
    const cleanCep = formData.cep.replace(/\D/g, "");
    if (cleanCep.length === 8) {
      fetchAddress(cleanCep);
    }
  }, [formData.cep]);

  const handleChange = (field: string, value: string) => {
    let formattedValue = value;
    
    if (field === "telefone") formattedValue = formatPhone(value);
    if (field === "cpf") formattedValue = formatCPF(value);
    if (field === "cep") formattedValue = formatCEP(value);

    setFormData(prev => ({ ...prev, [field]: formattedValue }));
    
    // Clear error on change
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.nome.trim()) newErrors.nome = "Nome obrigatório";
    if (!formData.email.includes("@")) newErrors.email = "Email inválido";
    if (formData.telefone.replace(/\D/g, "").length < 10) newErrors.telefone = "Telefone inválido";
    if (formData.cpf.replace(/\D/g, "").length !== 11) newErrors.cpf = "CPF inválido";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinueStep1 = async () => {
    if (!validateStep1()) return;

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsLoading(false);
    setCurrentStep(2);
  };

  // Step indicator component
  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-2 py-4">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
              step === currentStep
                ? "bg-[#00C853] text-white"
                : step < currentStep
                ? "bg-[#00C853] text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {step}
          </div>
          {step < 3 && (
            <div
              className={`w-8 h-0.5 ${
                step < currentStep ? "bg-[#00C853]" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  // Step 1: Personal Data
  if (currentStep === 1) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex flex-col">
        {/* Header */}
        <div className="bg-white py-3 px-4 border-b border-gray-200">
          <div className="max-w-md mx-auto flex items-center justify-center">
            <img src={slimHealthLogo} alt="SlimHealth" className="h-10" />
          </div>
        </div>

        {/* Step Indicator */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-md mx-auto">
            <StepIndicator />
          </div>
        </div>

        <div className="flex-1 p-4 max-w-md mx-auto w-full space-y-4 pb-28">
          {/* Product Summary */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
                <img 
                  src="/placeholder.svg" 
                  alt="Mounjaro" 
                  className="w-12 h-12 object-contain"
                />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm">Mounjaro™️ 5 mg</p>
                <p className="text-xs text-gray-500">Caneta injetável</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-[#00C853] text-lg">R$ 67,90</p>
                <p className="text-xs text-gray-400 line-through">R$ 1.789,87</p>
              </div>
            </div>
          </div>

          {/* Personal Data Form */}
          <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
            <h2 className="font-bold text-gray-900 text-lg">Dados Pessoais</h2>
            
            <div>
              <label className="text-sm text-gray-600 mb-1.5 block">Nome completo</label>
              <input
                type="text"
                placeholder="Digite seu nome completo"
                value={formData.nome}
                onChange={e => handleChange("nome", e.target.value)}
                className={`w-full px-4 py-3.5 rounded-xl bg-[#F5F5F5] border-2 ${
                  errors.nome ? "border-red-500" : "border-transparent"
                } focus:border-[#00C853] focus:outline-none transition text-sm`}
              />
              {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome}</p>}
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-1.5 block">E-mail</label>
              <input
                type="email"
                placeholder="Digite seu e-mail"
                value={formData.email}
                onChange={e => handleChange("email", e.target.value)}
                className={`w-full px-4 py-3.5 rounded-xl bg-[#F5F5F5] border-2 ${
                  errors.email ? "border-red-500" : "border-transparent"
                } focus:border-[#00C853] focus:outline-none transition text-sm`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-600 mb-1.5 block">Telefone</label>
                <input
                  type="tel"
                  placeholder="(00) 00000-0000"
                  value={formData.telefone}
                  onChange={e => handleChange("telefone", e.target.value)}
                  className={`w-full px-4 py-3.5 rounded-xl bg-[#F5F5F5] border-2 ${
                    errors.telefone ? "border-red-500" : "border-transparent"
                  } focus:border-[#00C853] focus:outline-none transition text-sm`}
                />
                {errors.telefone && <p className="text-red-500 text-xs mt-1">{errors.telefone}</p>}
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1.5 block">CPF</label>
                <input
                  type="text"
                  placeholder="000.000.000-00"
                  value={formData.cpf}
                  onChange={e => handleChange("cpf", e.target.value)}
                  className={`w-full px-4 py-3.5 rounded-xl bg-[#F5F5F5] border-2 ${
                    errors.cpf ? "border-red-500" : "border-transparent"
                  } focus:border-[#00C853] focus:outline-none transition text-sm`}
                />
                {errors.cpf && <p className="text-red-500 text-xs mt-1">{errors.cpf}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Bottom Button */}
        <div className="fixed inset-x-0 bottom-0 bg-white border-t border-gray-200 p-4 shadow-lg">
          <div className="max-w-md mx-auto">
            <button
              onClick={handleContinueStep1}
              disabled={isLoading}
              className="w-full bg-[#00C853] hover:bg-[#00B548] disabled:opacity-70 text-white font-bold py-4 px-6 rounded-xl text-base transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processando...
                </>
              ) : (
                "Continuar"
              )}
            </button>
            <p className="text-center text-xs text-gray-500 mt-2">
              🔒 Seus dados estão protegidos
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Placeholder for step 2 and 3 (will be implemented next)
  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center">
      <p className="text-gray-600">Etapa {currentStep} - Em breve</p>
      <button 
        onClick={() => setCurrentStep(1)} 
        className="mt-4 text-[#00C853] underline"
      >
        Voltar para Etapa 1
      </button>
    </div>
  );
};

export default Checkout;
