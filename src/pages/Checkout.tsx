import { useState, useEffect } from "react";
import { ArrowLeft, Copy, Check, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import tiktokLogo from "@/assets/tiktok-shop.png";

interface AddressData {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
}

const Checkout = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPix, setShowPix] = useState(false);
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

  // PIX code (mock)
  const pixCode = "00020126580014br.gov.bcb.pix0136a629532e-7372-4d12-9875-fd5ef86b3912520400005303986540567.905802BR5925SLIMHEALTH COMERCIO LTDA6009SAO PAULO62070503***6304E2CA";

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.nome.trim()) newErrors.nome = "Nome obrigatório";
    if (!formData.email.includes("@")) newErrors.email = "Email inválido";
    if (formData.telefone.replace(/\D/g, "").length < 10) newErrors.telefone = "Telefone inválido";
    if (formData.cpf.replace(/\D/g, "").length !== 11) newErrors.cpf = "CPF inválido";
    if (formData.cep.replace(/\D/g, "").length !== 8) newErrors.cep = "CEP inválido";
    if (!formData.logradouro.trim()) newErrors.logradouro = "Endereço obrigatório";
    if (!formData.numero.trim()) newErrors.numero = "Número obrigatório";
    if (!formData.bairro.trim()) newErrors.bairro = "Bairro obrigatório";
    if (!formData.cidade.trim()) newErrors.cidade = "Cidade obrigatória";
    if (!formData.estado.trim()) newErrors.estado = "Estado obrigatório";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setShowPix(true);
  };

  const handleCopyPix = async () => {
    try {
      await navigator.clipboard.writeText(pixCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  if (showPix) {
    return (
      <div className="min-h-screen bg-secondary/30 flex flex-col">
        {/* Header */}
        <div className="bg-card py-4 border-b border-border">
          <img src={tiktokLogo} alt="TikTok Shop" className="h-8 mx-auto" />
        </div>

        <div className="flex-1 p-4 max-w-md mx-auto w-full space-y-4">
          {/* Success Card */}
          <div className="bg-card rounded-2xl p-6 shadow-card text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center mx-auto mb-4">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-xl font-bold text-foreground mb-2">Pedido Gerado!</h1>
            <p className="text-muted-foreground text-sm">
              Escaneie o QR Code ou copie o código PIX para finalizar o pagamento
            </p>
          </div>

          {/* PIX Card */}
          <div className="bg-card rounded-2xl p-6 shadow-card">
            <div className="text-center mb-4">
              <p className="text-muted-foreground text-sm uppercase tracking-wide mb-1">Valor a pagar</p>
              <p className="text-3xl font-extrabold text-emerald-500">R$ 67,90</p>
            </div>

            {/* QR Code placeholder */}
            <div className="bg-white p-4 rounded-xl mb-4 flex items-center justify-center">
              <div className="w-48 h-48 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTYgMjU2Ij48cmVjdCB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0zMiAzMmg2NHY2NEgzMnptOCA4djQ4aDQ4VjQwem0xNiAxNmgyNHYyNEg1NnptNjQtMjRoOHY4aC04em0xNiAwaDh2OGgtOHptMTYgMGg4djhoLTh6bTE2IDBoMTZ2OGgtMTZ6bTI0IDBoOHY4aC04em0xNiAwaDh2OGgtOHptMTYgMGg4djhoLTh6TTMyIDk2aDh2OGgtOHptMTYgMGg4djhoLTh6bTE2IDBoOHY4aC04em0xNiAwaDh2OGgtOHptMTYgMGg4djhoLTh6bTE2IDBoOHY4aC04em0xNiAwaDh2OGgtOHptMTYgMGg4djhoLTh6bTE2IDBoOHY4aC04em0xNiAwaDh2OGgtOHptMTYgMGg4djhoLTh6TTMyIDEyOGg4djhoLTh6bTgwIDBoOHY4aC04em00OCAwaDh2OGgtOHptNDggMGg4djhoLTh6TTMyIDE2MGg2NHY2NEgzMnptOCA4djQ4aDQ4di00OHptMTYgMTZoMjR2MjRINTZ6bTY0LTI0aDh2OGgtOHptMTYgMGg4djhoLTh6bTE2IDBoOHY4aC04em0xNiAwaDh2OGgtOHptMTYgMGg4djhoLTh6bTE2IDBoOHY4aC04em0xNiAwaDY0djY0aC02NHptOCA4djQ4aDQ4di00OHptMTYgMTZoMjR2MjRoLTI0eiIvPjwvc3ZnPg==')] bg-contain bg-center bg-no-repeat" />
            </div>

            {/* PIX Code */}
            <div className="bg-secondary/50 rounded-xl p-3 mb-4">
              <p className="text-xs text-muted-foreground mb-1">Código PIX Copia e Cola</p>
              <p className="text-xs text-foreground font-mono break-all line-clamp-2">{pixCode}</p>
            </div>

            <button
              onClick={handleCopyPix}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 px-6 rounded-xl text-base transition-colors flex items-center justify-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5" />
                  Código Copiado!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  Copiar Código PIX
                </>
              )}
            </button>
          </div>

          {/* Timer */}
          <div className="bg-card rounded-2xl p-4 shadow-card text-center">
            <p className="text-muted-foreground text-sm">
              ⏱️ O código PIX expira em <span className="font-bold text-foreground">30:00</span> minutos
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30 flex flex-col">
      {/* Header */}
      <div className="bg-card py-3 border-b border-border sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-muted active:scale-95 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <img src={tiktokLogo} alt="TikTok Shop" className="h-6" />
          <span className="font-semibold text-foreground">Checkout</span>
        </div>
      </div>

      <div className="flex-1 p-4 max-w-md mx-auto w-full space-y-4 pb-32">
        {/* Product Summary */}
        <div className="bg-card rounded-2xl p-4 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-foreground text-sm">Mounjaro™️ 5 mg</p>
              <p className="text-xs text-muted-foreground">Caneta injetável</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-emerald-500">R$ 67,90</p>
              <p className="text-xs text-muted-foreground line-through">R$ 1.789,87</p>
            </div>
          </div>
        </div>

        {/* Personal Data */}
        <div className="bg-card rounded-2xl p-4 shadow-card space-y-3">
          <h2 className="font-bold text-foreground">Dados Pessoais</h2>
          
          <div>
            <input
              type="text"
              placeholder="Nome completo"
              value={formData.nome}
              onChange={e => handleChange("nome", e.target.value)}
              className={`w-full px-4 py-3 rounded-xl bg-secondary/50 border ${errors.nome ? "border-red-500" : "border-transparent"} focus:border-primary focus:outline-none transition text-sm`}
            />
            {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome}</p>}
          </div>

          <div>
            <input
              type="email"
              placeholder="E-mail"
              value={formData.email}
              onChange={e => handleChange("email", e.target.value)}
              className={`w-full px-4 py-3 rounded-xl bg-secondary/50 border ${errors.email ? "border-red-500" : "border-transparent"} focus:border-primary focus:outline-none transition text-sm`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                type="tel"
                placeholder="Telefone"
                value={formData.telefone}
                onChange={e => handleChange("telefone", e.target.value)}
                className={`w-full px-4 py-3 rounded-xl bg-secondary/50 border ${errors.telefone ? "border-red-500" : "border-transparent"} focus:border-primary focus:outline-none transition text-sm`}
              />
              {errors.telefone && <p className="text-red-500 text-xs mt-1">{errors.telefone}</p>}
            </div>
            <div>
              <input
                type="text"
                placeholder="CPF"
                value={formData.cpf}
                onChange={e => handleChange("cpf", e.target.value)}
                className={`w-full px-4 py-3 rounded-xl bg-secondary/50 border ${errors.cpf ? "border-red-500" : "border-transparent"} focus:border-primary focus:outline-none transition text-sm`}
              />
              {errors.cpf && <p className="text-red-500 text-xs mt-1">{errors.cpf}</p>}
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-card rounded-2xl p-4 shadow-card space-y-3">
          <h2 className="font-bold text-foreground">Endereço de Entrega</h2>
          
          <div className="relative">
            <input
              type="text"
              placeholder="CEP"
              value={formData.cep}
              onChange={e => handleChange("cep", e.target.value)}
              className={`w-full px-4 py-3 rounded-xl bg-secondary/50 border ${errors.cep ? "border-red-500" : "border-transparent"} focus:border-primary focus:outline-none transition text-sm`}
            />
            {cepLoading && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 animate-spin text-muted-foreground" />
            )}
            {errors.cep && <p className="text-red-500 text-xs mt-1">{errors.cep}</p>}
          </div>

          <div>
            <input
              type="text"
              placeholder="Endereço"
              value={formData.logradouro}
              onChange={e => handleChange("logradouro", e.target.value)}
              className={`w-full px-4 py-3 rounded-xl bg-secondary/50 border ${errors.logradouro ? "border-red-500" : "border-transparent"} focus:border-primary focus:outline-none transition text-sm`}
            />
            {errors.logradouro && <p className="text-red-500 text-xs mt-1">{errors.logradouro}</p>}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <input
                type="text"
                placeholder="Número"
                value={formData.numero}
                onChange={e => handleChange("numero", e.target.value)}
                className={`w-full px-4 py-3 rounded-xl bg-secondary/50 border ${errors.numero ? "border-red-500" : "border-transparent"} focus:border-primary focus:outline-none transition text-sm`}
              />
              {errors.numero && <p className="text-red-500 text-xs mt-1">{errors.numero}</p>}
            </div>
            <div className="col-span-2">
              <input
                type="text"
                placeholder="Complemento (opcional)"
                value={formData.complemento}
                onChange={e => handleChange("complemento", e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-transparent focus:border-primary focus:outline-none transition text-sm"
              />
            </div>
          </div>

          <div>
            <input
              type="text"
              placeholder="Bairro"
              value={formData.bairro}
              onChange={e => handleChange("bairro", e.target.value)}
              className={`w-full px-4 py-3 rounded-xl bg-secondary/50 border ${errors.bairro ? "border-red-500" : "border-transparent"} focus:border-primary focus:outline-none transition text-sm`}
            />
            {errors.bairro && <p className="text-red-500 text-xs mt-1">{errors.bairro}</p>}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <input
                type="text"
                placeholder="Cidade"
                value={formData.cidade}
                onChange={e => handleChange("cidade", e.target.value)}
                className={`w-full px-4 py-3 rounded-xl bg-secondary/50 border ${errors.cidade ? "border-red-500" : "border-transparent"} focus:border-primary focus:outline-none transition text-sm`}
              />
              {errors.cidade && <p className="text-red-500 text-xs mt-1">{errors.cidade}</p>}
            </div>
            <div>
              <input
                type="text"
                placeholder="UF"
                value={formData.estado}
                onChange={e => handleChange("estado", e.target.value.toUpperCase().slice(0, 2))}
                className={`w-full px-4 py-3 rounded-xl bg-secondary/50 border ${errors.estado ? "border-red-500" : "border-transparent"} focus:border-primary focus:outline-none transition text-sm`}
              />
              {errors.estado && <p className="text-red-500 text-xs mt-1">{errors.estado}</p>}
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-card rounded-2xl p-4 shadow-card">
          <h2 className="font-bold text-foreground mb-3">Forma de Pagamento</h2>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border-2 border-emerald-500">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">₽</span>
            </div>
            <div>
              <p className="font-semibold text-emerald-700">PIX</p>
              <p className="text-xs text-emerald-600">Aprovação instantânea</p>
            </div>
            <div className="ml-auto">
              <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom */}
      <div className="fixed inset-x-0 bottom-0 bg-card border-t border-border p-4 shadow-lg">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-muted-foreground">Total</span>
            <span className="text-2xl font-extrabold text-emerald-500">R$ 67,90</span>
          </div>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-70 text-white font-bold py-4 px-6 rounded-xl text-base transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processando...
              </>
            ) : (
              "Gerar PIX"
            )}
          </button>
          <p className="text-center text-xs text-muted-foreground mt-2">
            🔒 Pagamento 100% seguro
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
