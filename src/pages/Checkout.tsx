import { useState } from "react";
import { ArrowLeft, Lock, ShieldCheck, Users, Minus, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import mounjaroBox from "@/assets/checkout/mounjaro-box.png";

const Checkout = () => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
  });

  const price = 67.90;
  const subtotal = price * quantity;

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

  const handleChange = (field: string, value: string) => {
    let formattedValue = value;
    if (field === "telefone") formattedValue = formatPhone(value);
    if (field === "cpf") formattedValue = formatCPF(value);
    setFormData(prev => ({ ...prev, [field]: formattedValue }));
  };

  const isFormValid = 
    formData.nome.trim().length > 0 &&
    formData.email.includes("@") &&
    formData.telefone.replace(/\D/g, "").length >= 10 &&
    formData.cpf.replace(/\D/g, "").length === 11;

  const handleContinue = () => {
    if (isFormValid) {
      // Next step will be implemented
      console.log("Continue to step 2", formData);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex flex-col">
      {/* Header */}
      <header className="bg-white px-4 py-3 flex items-center gap-3 border-b border-gray-100">
        <button
          onClick={() => navigate(-1)}
          className="p-1 -ml-1"
          aria-label="Voltar"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" strokeWidth={1.5} />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">Dados pessoais</h1>
      </header>

      {/* Progress Bar */}
      <div className="h-1 bg-gray-200 flex">
        <div className="w-1/2 bg-[#E63946]" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto pb-28">
        {/* Product Card */}
        <div className="bg-white mx-4 mt-4 rounded-xl p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <img
              src={mounjaroBox}
              alt="Mounjaro"
              className="w-20 h-20 object-contain rounded-lg bg-gray-50"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 leading-tight">
                Mounjaro™ 5 mg – Tirzepatida (caneta...
              </p>
              <p className="text-base font-bold text-[#2DB573] mt-1">
                R$ {price.toFixed(2).replace(".", ",")}
              </p>
            </div>
            {/* Quantity Selector */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-50"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-5 text-center font-medium text-gray-900">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-50"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
          {/* Buying Now */}
          <div className="flex items-center gap-1.5 mt-3 text-[#2DB573]">
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium">27 comprando agora</span>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white mx-4 mt-3 rounded-xl p-4 shadow-sm">
          {/* Header */}
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Dados protegidos</span>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">
                Nome completo
              </label>
              <input
                type="text"
                placeholder="Digite seu nome"
                value={formData.nome}
                onChange={e => handleChange("nome", e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm placeholder:text-gray-400 focus:outline-none focus:border-gray-400 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">
                E-mail
              </label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={e => handleChange("email", e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm placeholder:text-gray-400 focus:outline-none focus:border-gray-400 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">
                Telefone
              </label>
              <input
                type="tel"
                placeholder="(00) 00000-0000"
                value={formData.telefone}
                onChange={e => handleChange("telefone", e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm placeholder:text-gray-400 focus:outline-none focus:border-gray-400 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">
                CPF
              </label>
              <input
                type="text"
                placeholder="000.000.000-00"
                value={formData.cpf}
                onChange={e => handleChange("cpf", e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm placeholder:text-gray-400 focus:outline-none focus:border-gray-400 transition"
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

      {/* Fixed Bottom */}
      <div className="fixed inset-x-0 bottom-0 bg-white border-t border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Subtotal</p>
            <p className="text-xl font-bold text-[#E63946]">
              R$ {subtotal.toFixed(2).replace(".", ",")}
            </p>
          </div>
          <button
            onClick={handleContinue}
            disabled={!isFormValid}
            className={`px-12 py-3.5 rounded-lg font-semibold text-base transition ${
              isFormValid
                ? "bg-[#E63946] text-white hover:bg-[#D62B39]"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
