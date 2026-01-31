import { useState } from "react";
import { SlidersHorizontal, LayoutGrid } from "lucide-react";

interface ProductTabsProps {
  children: React.ReactNode;
}

const ProductTabs = ({ children }: ProductTabsProps) => {
  const [activeTab, setActiveTab] = useState("produtos");
  const [activeSubTab, setActiveSubTab] = useState("recomendado");

  return (
    <section id="products" className="bg-background">
      <div className="max-w-6xl mx-auto px-3 py-2">
        {/* Tabs topo */}
        <div className="flex items-center justify-between border-b">
          <nav className="flex items-center gap-6 text-[13px] text-muted-foreground">
            <button
              onClick={() => setActiveTab("inicio")}
              className={`py-3 ${activeTab === "inicio" ? "text-foreground font-medium" : ""}`}
            >
              Página inicial
            </button>
            <button
              onClick={() => setActiveTab("produtos")}
              className={`py-3 relative ${activeTab === "produtos" ? "text-foreground font-medium" : ""}`}
            >
              Produtos
              {activeTab === "produtos" && (
                <span className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-foreground rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("categorias")}
              className={`py-3 ${activeTab === "categorias" ? "text-foreground font-medium" : ""}`}
            >
              Categorias
            </button>
          </nav>
        </div>

        {/* Subtabs e ações */}
        <div className="flex items-center justify-between text-[13px] text-muted-foreground mt-2">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveSubTab("recomendado")}
              className={`py-2 ${activeSubTab === "recomendado" ? "text-foreground font-medium" : ""}`}
            >
              Recomendado
            </button>
            <button
              onClick={() => setActiveSubTab("vendidos")}
              className={`py-2 ${activeSubTab === "vendidos" ? "text-foreground font-medium" : ""}`}
            >
              Mais vendidos
            </button>
            <button
              onClick={() => setActiveSubTab("lancamentos")}
              className={`py-2 ${activeSubTab === "lancamentos" ? "text-foreground font-medium" : ""}`}
            >
              Lançamentos
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="p-1.5 rounded hover:bg-muted"
              aria-label="Ordenar"
            >
              <SlidersHorizontal className="w-5 h-5" strokeWidth={1.5} />
            </button>
            <button
              className="p-1.5 rounded hover:bg-muted"
              aria-label="Layout"
            >
              <LayoutGrid className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Separador */}
        <div className="h-2 bg-muted mt-1 mb-2 rounded-sm" />

        {/* Lista de produtos */}
        <div className="divide-y">{children}</div>
      </div>
    </section>
  );
};

export default ProductTabs;
