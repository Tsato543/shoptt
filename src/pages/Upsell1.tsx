import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { trackPageView, trackViewContent } from "@/lib/tiktokPixel";
import tiktokLogo from "@/assets/tiktok-shop.png";
import PixModal from "@/components/PixModal";

const PINK = "#ff3870";
const AMOUNT = 47.89;

interface CustomerData {
  name: string;
  email: string;
  cpf: string;
  phone: string;
}

const Upsell1 = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
    trackViewContent('upsell1', 'Emissão de NFe', AMOUNT);
  }, []);

  // Verifica se o usuário chegou aqui legitimamente (após pagamento aprovado)
  useEffect(() => {
    const paymentApproved = localStorage.getItem('checkoutPaymentApproved');
    if (!paymentApproved) {
      // Se não veio do pagamento aprovado, redireciona pro checkout
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
    // Marca que o up1 foi pago
    localStorage.setItem('up1PaymentApproved', 'true');
    navigate('/up2');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-card p-8 text-center space-y-6">
        {/* Logo TikTok Shop */}
        <img 
          src={tiktokLogo} 
          alt="TikTok Shop" 
          className="h-10 mx-auto"
        />

        {/* Título */}
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Parabéns! 🎉</h1>
        </div>

        {/* Descrição */}
        <p className="text-muted-foreground text-sm leading-relaxed">
          Você acabou de garantir seu produto promocional através da TikTok Shop! Para concluir, basta realizar o pagamento da emissão da Nota Fiscal do seu produto.
        </p>

        {/* Card de taxa */}
        <div className="bg-secondary/50 rounded-xl p-6 space-y-2">
          <p className="text-sm text-muted-foreground font-medium">
            NF-e (Taxa de Emissão de Nota Fiscal)
          </p>
          <p className="text-3xl font-extrabold text-foreground">
            R$ {AMOUNT.toFixed(2).replace('.', ',')}
          </p>
          <p className="text-xs text-muted-foreground">
            Taxa única para emissão da nota fiscal
          </p>
        </div>

        {/* Botão de pagamento */}
        <button
          onClick={() => setShowPixModal(true)}
          className="w-full font-bold py-4 px-6 rounded-xl text-base transition-colors shadow-lg text-white flex items-center justify-center gap-2"
          style={{ backgroundColor: PINK }}
        >
          EFETUAR PAGAMENTO DA TAXA
        </button>

        {/* Texto explicativo */}
        <div className="bg-secondary/30 rounded-xl p-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Para receber seu produto do TikTok Shop, é necessário pagar a NF-e (Taxa de Emissão de Nota Fiscal). Sem o pagamento, o envio não será autorizado e o pedido será cancelado. Após a confirmação, o produto é enviado imediatamente para o endereço cadastrado.
          </p>
        </div>
      </div>

      {/* PIX Modal */}
      <PixModal
        isOpen={showPixModal}
        onClose={() => setShowPixModal(false)}
        amount={AMOUNT}
        title="Taxa de Nota Fiscal"
        customerName={customerData.name}
        customerEmail={customerData.email}
        customerCpf={customerData.cpf}
        customerPhone={customerData.phone}
        details="NF-e Taxa de Emissão"
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default Upsell1;
