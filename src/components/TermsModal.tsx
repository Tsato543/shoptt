import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TermsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TermsModal = ({ open, onOpenChange }: TermsModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] p-0">
        <DialogHeader className="px-4 pt-4 pb-2">
          <DialogTitle className="text-sm font-semibold">Termos de Uso, Ciência e Concordância</DialogTitle>
        </DialogHeader>
        <ScrollArea className="px-4 pb-4 h-[60vh]">
          <div className="text-[10px] text-muted-foreground leading-relaxed space-y-3">
            <p>
              Ao acessar, navegar, visualizar, contratar, adquirir, efetuar pagamento, confirmar inscrição, prosseguir, clicar em qualquer botão, preencher formulários, acessar áreas restritas ou utilizar de qualquer forma o conteúdo disponibilizado, o usuário declara, de maneira livre, consciente, voluntária e informada, que leu integralmente o presente termo, compreendeu seu conteúdo e concorda com todas as condições aqui descritas, sem qualquer ressalva, oposição ou questionamento.
            </p>
            <p>
              O usuário reconhece que este termo possui natureza contratual, produzindo efeitos jurídicos imediatos, sendo o aceite eletrônico plenamente válido, equivalente à assinatura física, para todos os fins legais.
            </p>
            <p>
              O usuário declara que compreende que o acesso ao conteúdo ocorre por meios digitais, eletrônicos ou online, sendo de sua inteira responsabilidade dispor de conexão com a internet, dispositivos compatíveis, softwares atualizados e condições técnicas adequadas para utilização do conteúdo.
            </p>
            <p>
              O fornecedor não se responsabiliza por falhas de acesso decorrentes de fatores externos, incluindo, mas não se limitando a, instabilidades de conexão, indisponibilidade temporária de plataformas, falhas de servidores, manutenções técnicas, atualizações de sistema, limitações de dispositivos ou quaisquer problemas alheios ao seu controle.
            </p>
            <p>
              O usuário reconhece que o conteúdo disponibilizado possui caráter informativo, educativo e orientativo, não constituindo aconselhamento personalizado, promessa de resultado, garantia de desempenho ou obrigação de resultado específico.
            </p>
            <p>
              O usuário declara ciência de que qualquer resultado obtido depende exclusivamente de fatores individuais, tais como dedicação pessoal, correta aplicação das orientações, disciplina, contexto pessoal, fatores externos e circunstâncias alheias ao controle do fornecedor.
            </p>
            <p>
              O fornecedor não garante, de forma expressa ou implícita, qualquer tipo de resultado, retorno, benefício ou desempenho específico, sendo vedada qualquer interpretação nesse sentido.
            </p>
            <p>
              O usuário assume integral responsabilidade pelas decisões tomadas com base no conteúdo acessado, isentando o fornecedor de qualquer responsabilidade por perdas, danos, prejuízos, expectativas frustradas ou consequências diretas ou indiretas decorrentes do uso das informações disponibilizadas.
            </p>
            <p>
              O usuário declara que compreende que exemplos, simulações, relatos, ilustrações ou demonstrações eventualmente apresentadas possuem caráter meramente ilustrativo, não representando promessa, garantia ou obrigação de resultado.
            </p>
            <p>
              O usuário compromete-se a utilizar o conteúdo de forma ética, lícita e exclusivamente pessoal, sendo expressamente proibida a reprodução, cópia, distribuição, compartilhamento, cessão, revenda, disponibilização pública ou privada, total ou parcial, do conteúdo, sem autorização expressa do fornecedor.
            </p>
            <p>
              O conteúdo é protegido por direitos autorais e demais legislações aplicáveis, sendo o uso indevido passível de bloqueio imediato de acesso, suspensão, cancelamento e adoção de medidas legais cabíveis, inclusive responsabilização civil e criminal.
            </p>
            <p>
              O usuário reconhece que não possui qualquer direito de propriedade sobre o conteúdo disponibilizado, recebendo apenas uma autorização limitada, pessoal e intransferível de acesso e uso, conforme as condições estabelecidas neste termo.
            </p>
            <p>
              O aceite deste termo é realizado de forma irretratável, não sendo admitida, em nenhuma hipótese, alegação futura de desconhecimento, erro, confusão, má interpretação, omissão de informação ou discordância com qualquer cláusula aqui prevista.
            </p>
            <p>
              O fornecedor poderá alterar, atualizar ou modificar estes termos a qualquer momento, sendo responsabilidade do usuário manter-se informado, e a continuidade do uso do conteúdo após eventuais alterações será considerada aceitação automática e integral das novas condições.
            </p>
            <p>
              Caso qualquer cláusula deste termo venha a ser considerada inválida, ilegal ou inexequível, tal circunstância não afetará a validade e eficácia das demais cláusulas, que permanecerão plenamente vigentes.
            </p>
            <p>
              O usuário declara que compreende que o presente termo substitui qualquer acordo, entendimento ou comunicação anterior, verbal ou escrita, relacionada ao acesso e uso do conteúdo disponibilizado.
            </p>
            <p>
              O usuário reconhece que não existe relação de sociedade, parceria, representação, vínculo empregatício ou qualquer outro vínculo além daquele estritamente definido neste termo.
            </p>
            <p>
              O usuário declara que realizou a aquisição de forma consciente, sem qualquer tipo de coação, induzimento ou pressão indevida, estando plenamente apto a aceitar as condições aqui estabelecidas.
            </p>
            <p>
              O usuário reconhece que é responsável por manter a confidencialidade de seus dados de acesso, não devendo compartilhá-los com terceiros, respondendo integralmente por qualquer uso indevido decorrente de sua negligência.
            </p>
            <p>
              O fornecedor não se responsabiliza por acessos realizados por terceiros mediante uso indevido das credenciais do usuário.
            </p>
            <p>
              Somente após a plena ciência e aceitação de todos os termos gerais acima, o usuário declara compreender a natureza específica do produto disponibilizado.
            </p>
            <p>
              O usuário reconhece expressamente que o produto adquirido consiste exclusivamente em um protocolo digital, composto por informações, orientações, métodos, conteúdos educativos e materiais acessados por meios eletrônicos.
            </p>
            <p>
              O usuário declara estar plenamente ciente de que o produto não se caracteriza como bem material, não envolvendo envio, entrega, transporte, logística ou disponibilização de qualquer item físico.
            </p>
            <p>
              Não haverá, em hipótese alguma, o envio de caixas, embalagens, brindes, mercadorias, produtos tangíveis, materiais impressos, equipamentos, objetos ou qualquer outro bem físico.
            </p>
            <p>
              O acesso ao protocolo ocorre exclusivamente em ambiente digital, por meio de plataformas online, áreas de membros, sistemas eletrônicos, links ou meios digitais informados após a confirmação.
            </p>
            <p>
              O usuário declara compreender que não existe estoque, frete, prazo de entrega física ou qualquer obrigação logística associada ao produto.
            </p>
            <p>
              Qualquer expectativa de recebimento de produto físico é considerada inexistente, infundada e incompatível com a proposta apresentada, não sendo aceita alegação posterior de erro, confusão ou interpretação equivocada.
            </p>
            <p>
              O usuário declara que compreendeu integralmente que adquiriu um produto de natureza intangível, digital, acessado exclusivamente por meios eletrônicos.
            </p>
            <p>
              Ao prosseguir, o usuário afirma estar 100% ciente da natureza digital do produto, declarando que sua decisão foi tomada de forma consciente, informada e voluntária.
            </p>
            <p>
              O usuário reconhece que todas as informações necessárias para compreensão da natureza do produto foram disponibilizadas de forma clara e suficiente antes da finalização.
            </p>
            <p>
              O usuário declara, de forma definitiva, que leu todo o conteúdo deste termo, compreendeu cada cláusula, concorda integralmente com todas as condições aqui descritas e aceita, sem qualquer ressalva, a natureza digital do produto e as regras de uso estabelecidas.
            </p>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default TermsModal;
