import { useState, useEffect } from "react";
import { ArrowLeft, Lock, ShieldCheck, Users, Minus, Plus, Truck, Loader2, ChevronRight, Check, Copy, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import mounjaroBox from "@/assets/checkout/mounjaro-box.png";
import fullLogo from "@/assets/checkout/full-logo.png";
import jadlogLogo from "@/assets/checkout/jadlog-logo.png";
import correiosLogo from "@/assets/checkout/correios-logo.png";
import pixLogo from "@/assets/checkout/pix-logo.png";
import canetasExtras from "@/assets/checkout/canetas-extras.webp";
import kitTransporte from "@/assets/checkout/kit-transporte.webp";
import aulaAplicacao from "@/assets/checkout/aula-aplicacao.webp";

interface AddressData {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
}

// Cor rosa padrão: rgb(255,59,102)
const PINK = "#FF3B66";
const PINK_HOVER = "#E6345C";

const shippingOptions = [
  { id: "full", name: "Frete Grátis", time: "Entrega em 10 a 12 dias", price: 0, logo: fullLogo },
  { id: "jadlog", name: "JADLOG", time: "Entrega em até 5 dias úteis", price: 15.90, logo: jadlogLogo },
  { id: "sedex", name: "SEDEX 12", time: "Entrega de 12h a 24h", price: 29.90, logo: correiosLogo },
];

const orderBumps = [
  { 
    id: "canetas", 
    name: "+2 Canetas Aplicadoras Premium", 
    description: "Continue seu tratamento sem interrupções",
    oldPrice: 129.90,
    price: 89.90, 
    discount: 31,
    badge: "MAIS VENDIDO",
    image: canetasExtras 
  },
  { 
    id: "kit", 
    name: "Kit Transporte Refrigerado", 
    description: "Bolsa térmica para levar aonde for",
    oldPrice: 49.90,
    price: 29.90, 
    discount: 40,
    image: kitTransporte 
  },
  { 
    id: "aula", 
    name: "Aula Exclusiva de Aplicação", 
    description: "Aprenda a aplicar como um profissional",
    oldPrice: 39.90,
    price: 19.90, 
    discount: 50,
    image: aulaAplicacao 
  },
];

// Format helpers
const formatPhone = (value: string) => {
  const nums = value.replace(/\D/g, "").slice(0, 11);
  if (nums.length <= 2) return nums;
  if (nums.length <= 7) return `(${nums.slice(0, 2)}) ${nums.slice(2)}`;
  return `(${nums.slice(0, 2)}) ${nums.slice(2, 7)}-${nums.slice(7)}`;
};

const formatCPF = (value: string) => {
  const nums = value.replace(/\D/g, "").slice(0, 11);
  if (nums.length <= 3) return nums;
  if (nums.length <= 6) return `${nums.slice(0, 3)}.${nums.slice(3)}`;
  if (nums.length <= 9) return `${nums.slice(0, 3)}.${nums.slice(3, 6)}.${nums.slice(6)}`;
  return `${nums.slice(0, 3)}.${nums.slice(3, 6)}.${nums.slice(6, 9)}-${nums.slice(9)}`;
};

const formatCEP = (value: string) => {
  const nums = value.replace(/\D/g, "").slice(0, 8);
  if (nums.length <= 5) return nums;
  return `${nums.slice(0, 5)}-${nums.slice(5)}`;
};

const inputClass = "w-full px-4 py-3 rounded-lg border border-gray-200 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF3B66]/20 focus:border-[#FF3B66] transition-colors";

const Checkout = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [cepLoading, setCepLoading] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState("");
  const [selectedBumps, setSelectedBumps] = useState<string[]>([]);
  const [pixLoading, setPixLoading] = useState(false);
  const [showPixModal, setShowPixModal] = useState(false);
  const [pixUrl, setPixUrl] = useState("");

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    cep: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    uf: "",
  });

  const price = 67.90;
  const selectedShippingData = shippingOptions.find(s => s.id === selectedShipping);
  const shippingPrice = selectedShippingData?.price || 0;
  const bumpsTotal = orderBumps.filter(b => selectedBumps.includes(b.id)).reduce((sum, b) => sum + b.price, 0);
  const total = (price * quantity) + shippingPrice + bumpsTotal;

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
          rua: data.logradouro || "",
          bairro: data.bairro || "",
          cidade: data.localidade || "",
          uf: data.uf || "",
        }));
      }
    } catch {
      // Silent fail
    } finally {
      setCepLoading(false);
    }
  };

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
    if (field === "uf") formattedValue = value.toUpperCase().slice(0, 2);
    setFormData(prev => ({ ...prev, [field]: formattedValue }));
  };

  const toggleBump = (id: string) => {
    setSelectedBumps(prev => 
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };

  const isStep1Valid = 
    formData.nome.trim().length > 0 &&
    formData.email.includes("@") &&
    formData.telefone.replace(/\D/g, "").length >= 10 &&
    formData.cpf.replace(/\D/g, "").length === 11;

  const isStep2Valid = 
    formData.cep.replace(/\D/g, "").length === 8 &&
    formData.rua.trim().length > 0 &&
    formData.numero.trim().length > 0 &&
    formData.bairro.trim().length > 0 &&
    formData.cidade.trim().length > 0 &&
    formData.uf.length === 2 &&
    selectedShipping !== "";

  const goToStep = (newStep: number) => {
    if (newStep !== step) {
      setStep(newStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleContinue = () => {
    if (step === 1 && isStep1Valid) {
      goToStep(2);
    } else if (step === 2 && isStep2Valid) {
      goToStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      goToStep(step - 1);
    } else {
      navigate(-1);
    }
  };

  const handlePay = async () => {
    if (pixLoading) return;
    
    setPixLoading(true);
    try {
      const identifier = `order_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      
      const { data, error } = await supabase.functions.invoke('generate-pix', {
        body: {
          amount: total,
          customer_name: formData.nome,
          customer_email: formData.email,
          customer_cpf: formData.cpf.replace(/\D/g, ''),
          customer_phone: formData.telefone.replace(/\D/g, ''),
          details: `Mounjaro 5mg x${quantity}${selectedBumps.length > 0 ? ' + ' + selectedBumps.length + ' adicionais' : ''}`,
          identifier,
        },
      });

      if (error) {
        console.error('Erro ao gerar PIX:', error);
        alert('Erro ao gerar PIX. Tente novamente.');
        return;
      }

      if (data?.success && data?.checkout_url) {
        setPixUrl(data.checkout_url);
        setShowPixModal(true);
      } else {
        alert(data?.error || 'Erro ao gerar PIX. Tente novamente.');
      }
    } catch (err) {
      console.error('Erro ao processar pagamento:', err);
      alert('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setPixLoading(false);
    }
  };

  // Step 1: Personal Data
  if (step === 1) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] flex flex-col">
        <header className="bg-white px-4 py-3 flex items-center gap-3 border-b border-gray-100">
          <button onClick={handleBack} className="p-1 -ml-1" aria-label="Voltar">
            <ArrowLeft className="w-6 h-6 text-gray-700" strokeWidth={1.5} />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Dados pessoais</h1>
        </header>

        <div className="h-1 bg-gray-200 flex">
          <div className="w-1/3" style={{ backgroundColor: PINK }} />
        </div>

        <div className="flex-1 overflow-auto pb-28">
          {/* Product Card */}
          <div className="bg-white mx-4 mt-4 rounded-xl p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <img src={mounjaroBox} alt="Mounjaro" className="w-20 h-20 object-contain rounded-lg bg-gray-50" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 leading-tight">Mounjaro™ 5 mg – Tirzepatida (caneta...</p>
                <p className="text-base font-bold text-[#2DB573] mt-1">R$ {price.toFixed(2).replace(".", ",")}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-50">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-5 text-center font-medium text-gray-900">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-50">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-3 text-[#2DB573]">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">27 comprando agora</span>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white mx-4 mt-3 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Dados protegidos</span>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">Nome completo</label>
                <input 
                  type="text" 
                  placeholder="Digite seu nome" 
                  value={formData.nome} 
                  onChange={e => handleChange("nome", e.target.value)} 
                  className={inputClass} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">E-mail</label>
                <input 
                  type="email" 
                  placeholder="seu@email.com" 
                  value={formData.email} 
                  onChange={e => handleChange("email", e.target.value)} 
                  className={inputClass} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">Telefone</label>
                <input 
                  type="tel" 
                  placeholder="(00) 00000-0000" 
                  value={formData.telefone} 
                  onChange={e => handleChange("telefone", e.target.value)} 
                  className={inputClass} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">CPF</label>
                <input 
                  type="text" 
                  placeholder="000.000.000-00" 
                  value={formData.cpf} 
                  onChange={e => handleChange("cpf", e.target.value)} 
                  className={inputClass} 
                />
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex items-center justify-center gap-6 mt-6 px-4">
            <div className="flex items-center gap-1.5 text-gray-500">
              <ShieldCheck className="w-4 h-4 text-[#2DB573]" />
              <span className="text-xs font-medium">Compra Segura</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-500">
              <Lock className="w-4 h-4 text-gray-400" />
              <span className="text-xs font-medium">SSL Ativo</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-500">
              <ShieldCheck className="w-4 h-4 text-[#2DB573]" />
              <span className="text-xs font-medium">Garantia</span>
            </div>
          </div>
        </div>

        <div className="fixed inset-x-0 bottom-0 bg-white border-t border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Subtotal</p>
              <p className="text-xl font-bold" style={{ color: PINK }}>R$ {(price * quantity).toFixed(2).replace(".", ",")}</p>
            </div>
            <button 
              onClick={handleContinue} 
              disabled={!isStep1Valid} 
              className={`px-12 py-3.5 rounded-lg font-semibold text-base transition-colors ${
                isStep1Valid 
                  ? "text-white hover:opacity-90" 
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
              style={isStep1Valid ? { backgroundColor: PINK } : {}}
            >
              Continuar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Address
  if (step === 2) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] flex flex-col">
        <header className="bg-white px-4 py-3 flex items-center gap-3 border-b border-gray-100">
          <button onClick={handleBack} className="p-1 -ml-1" aria-label="Voltar">
            <ArrowLeft className="w-6 h-6 text-gray-700" strokeWidth={1.5} />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Endereço</h1>
        </header>

        <div className="h-1 bg-gray-200 flex">
          <div className="w-2/3" style={{ backgroundColor: PINK }} />
        </div>

        <div className="flex-1 overflow-auto pb-28">
          {/* Product Card */}
          <div className="bg-white mx-4 mt-4 rounded-xl p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <img src={mounjaroBox} alt="Mounjaro" className="w-20 h-20 object-contain rounded-lg bg-gray-50" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 leading-tight">Mounjaro™ 5 mg – Tirzepatida (caneta...</p>
                <p className="text-base font-bold text-[#2DB573] mt-1">R$ {price.toFixed(2).replace(".", ",")}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-50">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-5 text-center font-medium text-gray-900">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-50">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-3 text-[#2DB573]">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">29 comprando agora</span>
            </div>
          </div>

          {/* Address Form */}
          <div className="bg-white mx-4 mt-3 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Dados protegidos</span>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">CEP</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="00000-000" 
                    value={formData.cep} 
                    onChange={e => handleChange("cep", e.target.value)} 
                    className={inputClass} 
                  />
                  {cepLoading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 animate-spin text-gray-400" />}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">Rua</label>
                <input 
                  type="text" 
                  placeholder="Nome da rua" 
                  value={formData.rua} 
                  onChange={e => handleChange("rua", e.target.value)} 
                  className={inputClass} 
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1.5">Número</label>
                  <input 
                    type="text" 
                    placeholder="Nº" 
                    value={formData.numero} 
                    onChange={e => handleChange("numero", e.target.value)} 
                    className={inputClass} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1.5">Complemento</label>
                  <input 
                    type="text" 
                    placeholder="Opcional" 
                    value={formData.complemento} 
                    onChange={e => handleChange("complemento", e.target.value)} 
                    className={inputClass} 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">Bairro</label>
                <input 
                  type="text" 
                  placeholder="Nome do bairro" 
                  value={formData.bairro} 
                  onChange={e => handleChange("bairro", e.target.value)} 
                  className={inputClass} 
                />
              </div>
              <div className="grid grid-cols-[1fr,80px] gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1.5">Cidade</label>
                  <input 
                    type="text" 
                    placeholder="Cidade" 
                    value={formData.cidade} 
                    onChange={e => handleChange("cidade", e.target.value)} 
                    className={inputClass} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1.5">UF</label>
                  <input 
                    type="text" 
                    placeholder="UF" 
                    value={formData.uf} 
                    onChange={e => handleChange("uf", e.target.value)} 
                    className={inputClass} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Options */}
          <div className="bg-white mx-4 mt-3 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Truck className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">Escolha uma forma de entrega:</span>
            </div>
            <div className="space-y-3">
              {shippingOptions.map((option) => (
                <button 
                  key={option.id} 
                  onClick={() => setSelectedShipping(option.id)} 
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-colors ${
                    selectedShipping === option.id ? "border-[#2DB573] bg-[#F0FDF4]" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedShipping === option.id ? "border-[#2DB573]" : "border-gray-300"}`}>
                    {selectedShipping === option.id && <div className="w-2.5 h-2.5 rounded-full bg-[#2DB573]" />}
                  </div>
                  <img src={option.logo} alt={option.name} className="h-6 w-auto object-contain" />
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold text-gray-900">{option.name}</p>
                    <p className="text-xs text-gray-500">{option.time}</p>
                  </div>
                  <span className={`text-sm font-bold ${option.price === 0 ? "text-[#2DB573]" : "text-gray-700"}`}>
                    {option.price === 0 ? "Grátis" : `R$ ${option.price.toFixed(2).replace(".", ",")}`}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex items-center justify-center gap-6 mt-6 px-4">
            <div className="flex items-center gap-1.5 text-gray-500">
              <ShieldCheck className="w-4 h-4 text-[#2DB573]" />
              <span className="text-xs font-medium">Compra Segura</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-500">
              <Lock className="w-4 h-4 text-gray-400" />
              <span className="text-xs font-medium">SSL Ativo</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-500">
              <ShieldCheck className="w-4 h-4 text-[#2DB573]" />
              <span className="text-xs font-medium">Garantia</span>
            </div>
          </div>
        </div>

        <div className="fixed inset-x-0 bottom-0 bg-white border-t border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Subtotal</p>
              <p className="text-xl font-bold" style={{ color: PINK }}>R$ {((price * quantity) + shippingPrice).toFixed(2).replace(".", ",")}</p>
            </div>
            <button 
              onClick={handleContinue} 
              disabled={!isStep2Valid} 
              className={`px-12 py-3.5 rounded-lg font-semibold text-base transition-colors ${
                isStep2Valid 
                  ? "text-white hover:opacity-90" 
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
              style={isStep2Valid ? { backgroundColor: PINK } : {}}
            >
              Continuar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Confirmation
  if (step === 3) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] flex flex-col">
        <header className="bg-white px-4 py-3 flex items-center gap-3 border-b border-gray-100">
          <button onClick={handleBack} className="p-1 -ml-1" aria-label="Voltar">
            <ArrowLeft className="w-6 h-6 text-gray-700" strokeWidth={1.5} />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Confirmação</h1>
        </header>

        <div className="h-1" style={{ backgroundColor: PINK }} />

        <div className="flex-1 overflow-auto pb-28">
          {/* Itens do pedido */}
          <div className="bg-white mx-4 mt-4 rounded-xl p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Itens do pedido</h2>
            <div className="flex items-start gap-3">
              <img src={mounjaroBox} alt="Mounjaro" className="w-16 h-16 object-contain rounded-lg bg-gray-50" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 leading-tight">Mounjaro™ 5 mg – Tirzepatida (caneta...</p>
                <p className="text-base font-bold text-[#2DB573] mt-1">R$ {price.toFixed(2).replace(".", ",")}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-50">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-5 text-center font-medium text-gray-900">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-50">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Comprador - dados da etapa 1 */}
          <button 
            onClick={() => goToStep(1)} 
            className="bg-white mx-4 mt-3 rounded-xl p-4 shadow-sm w-[calc(100%-2rem)] text-left flex items-center justify-between hover:bg-gray-50"
          >
            <div>
              <h2 className="text-sm font-semibold text-gray-900 mb-1">Comprador</h2>
              <p className="text-sm text-gray-600">{formData.nome}</p>
              <p className="text-sm text-gray-500">{formData.telefone}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          {/* Endereço de entrega - dados da etapa 2 */}
          <button 
            onClick={() => goToStep(2)} 
            className="bg-white mx-4 mt-3 rounded-xl p-4 shadow-sm w-[calc(100%-2rem)] text-left flex items-center justify-between hover:bg-gray-50"
          >
            <div>
              <h2 className="text-sm font-semibold text-gray-900 mb-1">Endereço de entrega</h2>
              <p className="text-sm text-gray-600">{formData.rua}, {formData.numero}</p>
              <p className="text-sm text-gray-500">{formData.bairro} • {formData.cidade}, {formData.uf}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          {/* Forma de entrega - dados da etapa 2 */}
          <button 
            onClick={() => goToStep(2)} 
            className="bg-white mx-4 mt-3 rounded-xl p-4 shadow-sm w-[calc(100%-2rem)] text-left flex items-center justify-between hover:bg-gray-50"
          >
            <div>
              <h2 className="text-sm font-semibold text-gray-900 mb-1">Forma de entrega</h2>
              <p className="text-sm text-gray-600">{selectedShippingData?.name}</p>
              <p className="text-sm text-gray-500">{selectedShippingData?.time}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-700">
                {shippingPrice === 0 ? "Grátis" : `R$ ${shippingPrice.toFixed(2).replace(".", ",")}`}
              </span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </button>

          {/* Order Bumps */}
          <div className="bg-white mx-4 mt-3 rounded-xl p-4 shadow-sm">
            <h2 className="text-base font-semibold mb-4" style={{ color: PINK }}>Adicione ao seu pedido</h2>
            <div className="space-y-3">
              {orderBumps.map((bump) => (
                <button
                  key={bump.id}
                  onClick={() => toggleBump(bump.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-colors ${
                    selectedBumps.includes(bump.id) ? "border-[#2DB573] bg-[#F0FDF4]" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img src={bump.image} alt={bump.name} className="w-16 h-16 object-contain rounded-lg bg-gray-50" />
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-gray-900">{bump.name}</p>
                      {bump.badge && (
                        <span className="text-[10px] font-bold text-[#2DB573] bg-[#E8F5E9] px-1.5 py-0.5 rounded">
                          {bump.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{bump.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-400 line-through">R$ {bump.oldPrice.toFixed(2).replace(".", ",")}</span>
                      <span className="text-sm font-bold" style={{ color: PINK }}>R$ {bump.price.toFixed(2).replace(".", ",")}</span>
                      <span className="text-[10px] font-bold text-[#2DB573] bg-[#E8F5E9] px-1.5 py-0.5 rounded">-{bump.discount}%</span>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    selectedBumps.includes(bump.id) ? "border-[#2DB573] bg-[#2DB573]" : "border-gray-300"
                  }`}>
                    {selectedBumps.includes(bump.id) && <Check className="w-4 h-4 text-white" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Forma de pagamento */}
          <div className="bg-white mx-4 mt-3 rounded-xl p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Forma de pagamento</h2>
            <div className="flex items-center gap-3 p-3 rounded-xl border-2 border-[#2DB573] bg-[#F0FDF4]">
              <img src={pixLogo} alt="PIX" className="h-8 w-auto object-contain" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">Pix</p>
                <p className="text-xs text-gray-500">Aprovação imediata</p>
              </div>
              <div className="w-6 h-6 rounded-full bg-[#2DB573] flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex items-center justify-center gap-6 mt-6 px-4">
            <div className="flex items-center gap-1.5 text-gray-500">
              <ShieldCheck className="w-4 h-4 text-[#2DB573]" />
              <span className="text-xs font-medium">Compra Segura</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-500">
              <Lock className="w-4 h-4 text-gray-400" />
              <span className="text-xs font-medium">SSL Ativo</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-500">
              <ShieldCheck className="w-4 h-4 text-[#2DB573]" />
              <span className="text-xs font-medium">Garantia</span>
            </div>
          </div>
        </div>

        <div className="fixed inset-x-0 bottom-0 bg-white border-t border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Total</p>
              <p className="text-xl font-bold" style={{ color: PINK }}>R$ {total.toFixed(2).replace(".", ",")}</p>
            </div>
            <button 
              onClick={handlePay} 
              disabled={pixLoading}
              className="px-16 py-3.5 rounded-lg font-semibold text-base text-white hover:opacity-90 transition-opacity disabled:opacity-70 flex items-center gap-2"
              style={{ backgroundColor: PINK }}
            >
              {pixLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Gerando PIX...
                </>
              ) : (
                'Pagar'
              )}
            </button>
          </div>
        </div>

        {/* PIX Modal */}
        {showPixModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <img src={pixLogo} alt="PIX" className="h-6 w-auto" />
                  <h2 className="text-lg font-semibold text-gray-900">Pagamento PIX</h2>
                </div>
                <button 
                  onClick={() => setShowPixModal(false)}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <div className="p-6">
                <p className="text-center text-gray-600 mb-4">
                  Você será redirecionado para a página de pagamento PIX.
                </p>
                
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">Valor a pagar:</span>
                    <span className="text-xl font-bold" style={{ color: PINK }}>
                      R$ {total.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 text-center">
                    O PIX expira em 30 minutos
                  </div>
                </div>

                <button
                  onClick={() => {
                    window.open(pixUrl, '_blank');
                  }}
                  className="w-full py-4 rounded-xl font-semibold text-base text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  style={{ backgroundColor: PINK }}
                >
                  Abrir Pagamento PIX
                </button>

                <p className="text-xs text-center text-gray-400 mt-4">
                  Após o pagamento, você será redirecionado automaticamente
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default Checkout;
