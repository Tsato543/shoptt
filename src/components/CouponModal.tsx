import { useState, useEffect } from "react";

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CouponModal = ({ isOpen, onClose }: CouponModalProps) => {
  const [claimed, setClaimed] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !claimed) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeydown, true);
    }

    return () => {
      document.removeEventListener("keydown", handleKeydown, true);
    };
  }, [isOpen, claimed]);

  const handleClaim = () => {
    if (claimed) return;
    setClaimed(true);
    localStorage.setItem("couponShown", "true");
    
    setTimeout(() => {
      onClose();
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div
      className="coupon-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="couponLabel"
    >
      <div className="coupon-card">
        <div className="flex items-center justify-between p-4 pb-2">
          <div
            className="flex items-center gap-2 font-extrabold text-foreground text-[16px]"
            id="couponLabel"
          >
            <span className="text-[18px]">Olá,</span> Cupom Exclusivo!
          </div>
        </div>

        <div className="px-4 pb-4">
          <span className="inline-block px-2.5 py-1.5 font-extrabold text-[12px] rounded-full text-white bg-sale">
            ATÉ 85% OFF
          </span>
          <div className="mt-2.5 mb-1.5 text-muted-foreground text-[13px]">
            Toda a loja com <b className="text-foreground">até 85% OFF</b>.
          </div>
          <div className="mb-3 text-muted-foreground/70 text-[12px]">
            Aplicado automaticamente no checkout.
          </div>

          {/* Vídeo em círculo */}
          <div className="flex justify-center items-center my-3">
            <div className="w-[140px] h-[140px] rounded-full overflow-hidden bg-transparent">
              <video
                src="/videos/ticket2.mp4"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <button
            onClick={handleClaim}
            disabled={claimed}
            className={`btn-claim mt-2 ${claimed ? "claimed" : ""}`}
          >
            {claimed ? "Resgatado" : "Resgatar Cupom"}
          </button>

          <div className="flex items-center gap-2 text-muted-foreground/70 text-[11px] mt-2.5 leading-tight">
            <span className="w-1.5 h-1.5 rounded-full bg-warning"></span>
            <span>Cupom por tempo limitado.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouponModal;
