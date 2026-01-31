import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import logoImg from "@/assets/logo.png";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  type: "bot" | "cta";
  html?: string;
}

const AGENT_NAME = "Laissa";
const STORAGE_KEY = "chat_history_laissa_v1";
const SCRIPTED_MSGS = [
  'Olá! 👋 Todos os produtos estão com descontos de até <strong>85% OFF</strong>.',
  'Aproveite agora: as ofertas são por tempo limitado e os <strong>estoques estão acabando</strong>.',
];

const ChatModal = ({ isOpen, onClose }: ChatModalProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const streamRef = useRef<HTMLDivElement>(null);

  const loadHistory = (): ChatMessage[] => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  };

  const saveHistory = (items: ChatMessage[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // quota
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const hist = loadHistory();
    if (hist.length > 0) {
      setMessages(hist);
    } else {
      runScriptedConversation();
    }
  }, [isOpen]);

  useEffect(() => {
    if (streamRef.current) {
      streamRef.current.scrollTop = streamRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const runScriptedConversation = async () => {
    const newMessages: ChatMessage[] = [];

    for (const msg of SCRIPTED_MSGS) {
      setIsTyping(true);
      await new Promise((r) => setTimeout(r, 2000));
      setIsTyping(false);
      
      const message: ChatMessage = { type: "bot", html: msg };
      newMessages.push(message);
      setMessages([...newMessages]);
    }

    setIsTyping(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsTyping(false);

    const ctaMessage: ChatMessage = { type: "cta" };
    newMessages.push(ctaMessage);
    setMessages([...newMessages]);
    saveHistory(newMessages);
  };

  const handleCtaClick = () => {
    onClose();
    const dest = document.querySelector("#products");
    dest?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/40 p-4">
      <div className="w-full max-w-md bg-muted rounded-t-2xl rounded-b-xl overflow-hidden shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between bg-background px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <img src={logoImg} alt={AGENT_NAME} className="w-8 h-8 rounded-full" />
            <span className="font-semibold text-foreground">{AGENT_NAME}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-muted transition"
            aria-label="Fechar chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div
          ref={streamRef}
          className="h-[300px] overflow-y-auto p-4 space-y-3 bg-muted"
        >
          {messages.map((msg, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <img
                src={logoImg}
                alt={AGENT_NAME}
                className="w-6 h-6 rounded-full mt-1"
              />
              <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-background border shadow-sm px-3 py-2 text-[13px] leading-snug text-foreground">
                <div className="text-[11px] text-muted-foreground mb-1">
                  {AGENT_NAME}
                </div>
                {msg.type === "bot" && (
                  <div dangerouslySetInnerHTML={{ __html: msg.html || "" }} />
                )}
                {msg.type === "cta" && (
                  <div className="space-y-2">
                    <div>
                      Se precisar de ajuda para escolher, posso te orientar aqui
                      no chat. <strong>Aproveite já</strong>! 🔥
                    </div>
                    <button
                      onClick={handleCtaClick}
                      className="btn-primary"
                    >
                      Aproveitar ofertas
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-start gap-2">
              <img
                src={logoImg}
                alt={AGENT_NAME}
                className="w-6 h-6 rounded-full mt-1"
              />
              <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-background border shadow-sm px-3 py-2">
                <span className="inline-flex items-center gap-1">
                  <span
                    className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-pulse"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-pulse"
                    style={{ animationDelay: "120ms" }}
                  />
                  <span
                    className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-pulse"
                    style={{ animationDelay: "240ms" }}
                  />
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
