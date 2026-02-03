import { useState, useEffect, useMemo } from "react";
import { X, Copy, Clock, Loader2, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { trackCompletePayment } from "@/lib/tiktokPixel";
import tiktokLogo from "@/assets/tiktok-shop-logo.png";

interface PixModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  title: string;
  customerName: string;
  customerEmail: string;
  customerCpf: string;
  customerPhone: string;
  details: string;
  onSuccess: () => void;
}

const PINK = "#FF3B66";

const PixModal = ({
  isOpen,
  onClose,
  amount,
  title,
  customerName,
  customerEmail,
  customerCpf,
  customerPhone,
  details,
  onSuccess,
}: PixModalProps) => {
  const [loading, setLoading] = useState(false);
  const [pixData, setPixData] = useState<{
    qrCode: string;
    qrImageUrl: string;
    reference: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'approved'>('pending');

  // Timer de 14 minutos
  const expiresAtMs = useMemo(() => Date.now() + 14 * 60 * 1000, [pixData]);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(t);
  }, []);

  const remainingMs = Math.max(0, expiresAtMs - now);
  const mm = Math.floor(remainingMs / 60000);
  const ss = Math.floor((remainingMs % 60000) / 1000);
  const timerText = `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;

  // Gerar PIX quando o modal abre
  useEffect(() => {
    if (!isOpen || pixData) return;

    const generatePix = async () => {
      setLoading(true);
      try {
        const reference = `upsell_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

        const { data, error } = await supabase.functions.invoke('generate-pix', {
          body: {
            amount,
            customer_name: customerName,
            customer_email: customerEmail,
            customer_cpf: customerCpf.replace(/\D/g, ''),
            customer_phone: customerPhone.replace(/\D/g, ''),
            details,
          },
        });

        if (error) {
          console.error('Erro ao gerar PIX:', error);
          alert('Erro ao gerar PIX. Tente novamente.');
          onClose();
          return;
        }

        if (data?.success && (data?.qr_code || data?.qr_code_base64)) {
          setPixData({
            qrCode: data.qr_code || '',
            qrImageUrl: data.qr_code_base64 || '',
            reference: data.reference || reference,
          });
        } else {
          alert(data?.error || 'Erro ao gerar PIX. Tente novamente.');
          onClose();
        }
      } catch (err) {
        console.error('Erro:', err);
        alert('Erro ao processar. Tente novamente.');
        onClose();
      } finally {
        setLoading(false);
      }
    };

    generatePix();
  }, [isOpen]);

  // Polling para verificar status
  useEffect(() => {
    if (!pixData?.reference) return;
    if (paymentStatus === 'approved') return;

    const checkStatus = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('check-pix-status', {
          body: { reference: pixData.reference },
        });

        if (!error && data?.success && data?.status === 'approved') {
          setPaymentStatus('approved');
          // Track CompletePayment
          trackCompletePayment('upsell', title, amount);
          setTimeout(() => {
            onSuccess();
          }, 2000);
          return true;
        }
        return false;
      } catch {
        return false;
      }
    };

    const interval = setInterval(checkStatus, 5000);
    checkStatus();

    return () => clearInterval(interval);
  }, [pixData?.reference, paymentStatus, onSuccess]);

  const handleCopy = async () => {
    if (!pixData?.qrCode) return;
    try {
      await navigator.clipboard.writeText(pixData.qrCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Não foi possível copiar.");
    }
  };

  // Reset state quando fecha
  useEffect(() => {
    if (!isOpen) {
      setPixData(null);
      setPaymentStatus('pending');
      setCopied(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header com logo */}
        <div className="flex items-center justify-between p-5 pb-3">
          <div className="flex-1" />
          <img 
            src={tiktokLogo} 
            alt="TikTok Shop" 
            className="h-7"
          />
          <div className="flex-1 flex justify-end">
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Título e Valor */}
        <div className="text-center px-5 pb-4">
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className="text-4xl font-extrabold text-gray-900 mt-1">
            R$ {amount.toFixed(2).replace('.', ',')}
          </p>
        </div>

        {/* QR Code */}
        <div className="px-5 pb-4">
          <div className="flex justify-center">
            <div className="rounded-2xl border-2 border-gray-100 p-4 bg-white">
              {loading || !pixData?.qrImageUrl ? (
                <div className="w-48 h-48 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
                </div>
              ) : (
                <img
                  src={pixData.qrImageUrl}
                  alt="QR Code PIX"
                  className="w-48 h-48 object-contain"
                />
              )}
            </div>
          </div>
        </div>

        {/* Botão Copiar */}
        <div className="px-5 pb-4">
          <button
            onClick={handleCopy}
            disabled={!pixData?.qrCode}
            className="w-full py-4 rounded-xl font-bold text-base text-white transition-all flex items-center justify-center gap-2.5 active:scale-[0.98] disabled:opacity-50"
            style={{ backgroundColor: copied ? "#2DB573" : PINK }}
          >
            <Copy className="w-5 h-5" strokeWidth={2.5} />
            {copied ? "Código copiado!" : "Copiar código PIX"}
          </button>
        </div>

        {/* Timer */}
        <div className="px-5 pb-3">
          <div className="flex items-center justify-center gap-2 text-amber-600">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">O PIX expira em:</span>
            <span className="font-bold text-base tabular-nums">{timerText}</span>
          </div>
        </div>

        {/* Status */}
        <div className="px-5 pb-4">
          {paymentStatus === 'approved' ? (
            <div className="flex items-center justify-center gap-2 text-emerald-600">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold text-sm">Pagamento confirmado!</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 text-blue-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm font-medium">Aguardando confirmação...</span>
            </div>
          )}
        </div>

        {/* Código truncado */}
        {pixData?.qrCode && (
          <div className="px-5 pb-5">
            <p className="text-[10px] text-center text-gray-400 break-all line-clamp-2 leading-relaxed">
              {pixData.qrCode}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PixModal;
