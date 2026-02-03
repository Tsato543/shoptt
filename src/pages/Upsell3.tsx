import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, AlertTriangle, X, CreditCard } from "lucide-react";
import { trackPageView, trackViewContent } from "@/lib/tiktokPixel";
import PixModal from "@/components/PixModal";

const PINK = "#ff3870";
const AMOUNT = 31.90;

interface CustomerData {
  name: string;
  email: string;
  cpf: string;
  phone: string;
}

const Upsell3 = () => {
  const navigate = useNavigate();
  const [showPixModal, setShowPixModal] = useState(false);
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: 'Cliente',
    email: 'cliente@email.com',
    cpf: '00000000000',
    phone: '00000000000',
  });

  // Track page view
  useEffect(() => {
    trackPageView();
    trackViewContent('upsell3', 'Correção ICMS', AMOUNT);
  }, []);

  // Verifica se o usuário pagou o up2
  useEffect(() => {
    const up2Paid = localStorage.getItem('up2PaymentApproved');
    if (!up2Paid) {
      navigate('/checkout', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const stored = localStorage.getItem('customerData');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setCustomerData(data);
      } catch {
        // Mantém dados default
      }
    }
  }, []);

  const handleSuccess = () => {
    setShowPixModal(false);
    localStorage.setItem('up3PaymentApproved', 'true');
    navigate('/up4');
  };

  return (
    <div className="min-h-screen bg-secondary/30 flex flex-col items-center p-4 pt-8">
      <div className="w-full max-w-md space-y-4">
        {/* Card 1 - Pedido Concluído */}
        <div className="bg-card rounded-2xl p-6 shadow-card text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">
            Pedido Concluído com Sucesso
          </h2>
          <p className="text-muted-foreground text-sm">
            Aguarde um momento...
          </p>
        </div>

        {/* Card 2 - Validação CEP */}
        <div className="bg-card rounded-2xl p-6 shadow-card text-center">
          <div className="w-14 h-14 rounded-full bg-amber-400 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">
            Validação do CEP para Entrega
          </h2>
          <p className="text-muted-foreground text-sm">
            Estamos verificando as informações...
          </p>
        </div>

        {/* Card 3 - Erro Frete */}
        <div className="bg-card rounded-2xl p-6 shadow-card text-center border-2 border-rose-400">
          <div className="w-14 h-14 rounded-full bg-rose-500 flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">
            O valor do Frete foi calculado errado para sua região
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            O pedido não será enviado. Faça a correção do pagamento do frete para que seu pedido seja enviado.
          </p>
          
          {/* Botão */}
          <button
            onClick={() => setShowPixModal(true)}
            className="w-full font-bold py-4 px-6 rounded-xl text-base transition-colors shadow-lg uppercase tracking-wide flex items-center justify-center gap-2 mb-4 text-white"
            style={{ backgroundColor: PINK }}
          >
            <CreditCard className="w-5 h-5" />
            PAGAR FRETE - R$ {AMOUNT.toFixed(2).replace('.', ',')}
          </button>

          <div className="bg-rose-100 rounded-xl p-3">
            <p className="text-rose-500 text-sm font-medium">
              O valor pago do frete anterior será reembolsado
            </p>
          </div>
        </div>
      </div>

      {/* PIX Modal */}
      <PixModal
        isOpen={showPixModal}
        onClose={() => setShowPixModal(false)}
        amount={AMOUNT}
        title="Correção de Frete"
        customerName={customerData.name}
        customerEmail={customerData.email}
        customerCpf={customerData.cpf}
        customerPhone={customerData.phone}
        details="Correção de Frete"
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default Upsell3;
