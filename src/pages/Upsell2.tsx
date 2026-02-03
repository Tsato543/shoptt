import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Info, HelpCircle } from "lucide-react";
import tiktokLogo from "@/assets/tiktok-shop.png";
import PixModal from "@/components/PixModal";

const PINK = "#ff3870";
const AMOUNT = 26.75;

interface CustomerData {
  name: string;
  email: string;
  cpf: string;
  phone: string;
}

const Upsell2 = () => {
  const navigate = useNavigate();
  const [showPixModal, setShowPixModal] = useState(false);
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: 'Cliente',
    email: 'cliente@email.com',
    cpf: '00000000000',
    phone: '00000000000',
  });

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
    navigate('/up3');
  };

  return (
    <div className="min-h-screen bg-secondary/30 flex flex-col">
      {/* Header */}
      <div className="bg-card py-4 border-b border-border">
        <img 
          src={tiktokLogo} 
          alt="TikTok Shop" 
          className="h-8 mx-auto"
        />
      </div>

      <div className="flex-1 p-4 space-y-4 max-w-md mx-auto w-full">
        {/* Status do Pedido */}
        <div className="bg-card rounded-2xl p-6 shadow-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-xl font-bold text-foreground">Status do Pedido</h1>
          </div>

          <div className="border border-border rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground text-sm">Número do pedido:</span>
              <span className="text-primary font-semibold">00044792</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground text-sm">Status:</span>
              <span className="text-primary font-semibold">Aguardando pagamento</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground text-sm">Valor da TENF:</span>
              <span className="text-primary font-semibold">R$ {AMOUNT.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>
        </div>

        {/* Pagamento Pendente */}
        <div className="bg-card rounded-2xl p-6 shadow-card">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Pagamento Pendente</h2>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Seu pedido está quase pronto para ser enviado! Para finalizar o processo, precisamos que você realize o pagamento da <strong className="text-foreground">TENF</strong> (Taxa de Emissão da Nota Fiscal) no valor de R$ {AMOUNT.toFixed(2).replace('.', ',')}.
          </p>
        </div>

        {/* Botão */}
        <button
          onClick={() => setShowPixModal(true)}
          className="w-full font-bold py-4 px-6 rounded-xl text-base transition-colors shadow-lg uppercase tracking-wide text-white"
          style={{ backgroundColor: PINK }}
        >
          Pagar TENF - R$ {AMOUNT.toFixed(2).replace('.', ',')}
        </button>

        {/* Por que preciso pagar */}
        <div className="bg-card rounded-2xl p-6 shadow-card">
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Por que preciso pagar a TENF?</h2>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            A TENF é uma taxa obrigatória para emissão da nota fiscal do seu produto. Sem esse pagamento, não podemos finalizar o processo de despacho. Após o pagamento, seu pedido será enviado em até 24 horas.
          </p>
        </div>
      </div>

      {/* PIX Modal */}
      <PixModal
        isOpen={showPixModal}
        onClose={() => setShowPixModal(false)}
        amount={AMOUNT}
        title="TENF - Taxa de Nota Fiscal"
        customerName={customerData.name}
        customerEmail={customerData.email}
        customerCpf={customerData.cpf}
        customerPhone={customerData.phone}
        details="TENF Taxa de Emissão"
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default Upsell2;
