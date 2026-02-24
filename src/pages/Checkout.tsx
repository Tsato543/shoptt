import { useState, useEffect } from "react";
import {
  ArrowLeft, Lock, ShieldCheck, Users, Minus, Plus, Truck,
  Loader2, ChevronRight, Check
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import {
  trackInitiateCheckout,
  trackAddPaymentInfo,
  trackPageView,
  trackAddToCart,
  identifyUser
} from "@/lib/tiktokPixel";

import mounjaroBox from "@/assets/checkout/mounjaro-box.png";
import fullLogo from "@/assets/checkout/full-logo.png";
import jadlogLogo from "@/assets/checkout/jadlog-logo.png";
import correiosLogo from "@/assets/checkout/correios-logo.png";
import pixLogo from "@/assets/checkout/pix-logo.png";
import canetasExtras from "@/assets/checkout/canetas-extras.webp";
import kitTransporte from "@/assets/checkout/kit-transporte.webp";
import aulaAplicacao from "@/assets/checkout/aula-aplicacao.webp";
import anvisaLogo from "@/assets/checkout/anvisa-logo.png";
import govbrLogo from "@/assets/checkout/govbr-logo.png";
import promoBanner from "@/assets/checkout/promo-banner-new.jpg";
import { getTrackingParams } from "@/lib/trackingParams";

interface AddressData {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
}

const PINK = "#FF3B66";

const shippingOptions = [
  { id: "full", name: "Frete Grátis", time: "Entrega em 10 a 12 dias", price: 0, logo: fullLogo },
  { id: "jadlog", name: "JADLOG", time: "Entrega em até 5 dias úteis", price: 15.90, logo: jadlogLogo },
  { id: "sedex", name: "SEDEX 12", time: "Entrega de 12h a 24h", price: 29.90, logo: correiosLogo },
];

const orderBumps = [
  { id: "canetas", name: "+2 Canetas Aplicadoras Premium", description: "Continue seu tratamento sem interrupções", oldPrice: 129.90, price: 89.90, discount: 31, image: canetasExtras },
  { id: "kit", name: "Kit Transporte Refrigerado", description: "Bolsa térmica para levar aonde for", oldPrice: 49.90, price: 29.90, discount: 40, image: kitTransporte },
  { id: "aula", name: "Aula Exclusiva de Aplicação", description: "Aprenda a aplicar como um profissional", oldPrice: 39.90, price: 19.90, discount: 50, image: aulaAplicacao },
];

const Checkout = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [selectedShipping, setSelectedShipping] = useState("");
  const [selectedBumps, setSelectedBumps] = useState<string[]>([]);
  const [pixLoading, setPixLoading] = useState(false);

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

  // ✅ TICKET DO PRODUTO
  const price = 67.67;

  const selectedShippingData = shippingOptions.find(s => s.id === selectedShipping);
  const shippingPrice = selectedShippingData?.price || 0;
  const bumpsTotal = orderBumps
    .filter(b => selectedBumps.includes(b.id))
    .reduce((sum, b) => sum + b.price, 0);

  const total = (price * quantity) + shippingPrice + bumpsTotal;

  useEffect(() => {
    trackPageView();
    trackInitiateCheckout("mounjaro-5mg", "Mounjaro 5mg", price);
  }, []);

  const handlePay = async () => {
    if (pixLoading) return;

    identifyUser(formData.email, formData.telefone, formData.nome);
    trackAddPaymentInfo("mounjaro-5mg", "Mounjaro 5mg", total);

    setPixLoading(true);

    try {
      const identifier = `order_${Date.now()}`;

      const { data, error } = await supabase.functions.invoke("generate-pix", {
        body: {
          amount: total,
          customer_name: formData.nome,
          customer_email: formData.email,
          customer_cpf: formData.cpf.replace(/\D/g, ""),
          customer_phone: formData.telefone.replace(/\D/g, ""),
          details: `Mounjaro 5mg x${quantity}`,
          identifier,
          tracking: getTrackingParams(),
        },
      });

      if (error) throw error;

      navigate("/pix", {
        state: {
          amountReais: total,
          qrCode: data.qr_code,
          qrImageUrl: data.qr_code_base64,
        },
      });

    } catch (err) {
      alert("Erro ao gerar PIX");
    } finally {
      setPixLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      <div className="mx-4 mt-4">
        <img
          src={promoBanner}
          alt="Estoque interno de funcionários liberado ao público - R$ 67,67"
          className="w-full rounded-xl"
        />
        <p className="text-[10px] text-gray-500 text-center mt-2">
          Este valor é mais baixo porque este lote fazia parte do estoque interno destinado
          a funcionários da SlimHealth. Como restaram algumas unidades, a empresa decidiu
          liberar o último lote ao público mantendo o mesmo valor interno de R$ 67,67.
        </p>
      </div>

      <div className="fixed bottom-0 inset-x-0 bg-white border-t px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Total</p>
            <p className="text-xl font-bold" style={{ color: PINK }}>
              R$ {total.toFixed(2).replace(".", ",")}
            </p>
          </div>
          <button
            onClick={handlePay}
            disabled={pixLoading}
            className="px-14 py-3 rounded-lg text-white font-semibold"
            style={{ backgroundColor: PINK }}
          >
            {pixLoading ? "Gerando PIX..." : "Pagar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
