import {
  BarChart3,
  Boxes,
  DollarSign,
  Layers,
  ReceiptText,
  ShieldCheck,
  ShoppingCart,
  Users,
  Zap,
} from "lucide-react";
import tileEstoque from "@/assets/tile-estoque.png";
import tileFinanceiro from "@/assets/tile-financeiro.png";
import tileVendas from "@/assets/tile-vendas.png";

export const marqueeWords = [
  "Estoque inteligente",
  "Vendas em segundos",
  "Fluxo de caixa vivo",
  "Contas a pagar",
  "Contas a receber",
  "Relatórios em tempo real",
  "Clientes 360°",
  "WhatsApp integrado",
];

/** Cada módulo carrega sua própria cor pastel (usada em ícone, kicker e overlay) */
export const modules = [
  {
    title: "Estoque",
    kicker: "Controle total",
    description:
      "Cadastro completo de produtos com código de barras, categorias coloridas, tamanhos, custo, preço e margem calculada automaticamente. Alertas de estoque mínimo antes da ruptura.",
    image: tileEstoque,
    to: "/estoque",
    icon: Boxes,
    tone: "blue" as const,
  },
  {
    title: "Financeiro",
    kicker: "Caixa sob controle",
    description:
      "Contas a pagar e a receber, baixas parciais, agendamento de pagamentos, métodos com taxas e prazos, e um fluxo de caixa que se atualiza a cada movimento.",
    image: tileFinanceiro,
    to: "/fluxo-caixa",
    icon: DollarSign,
    tone: "green" as const,
  },
  {
    title: "Vendas",
    kicker: "Do balcão ao boleto",
    description:
      "Venda à vista ou a prazo com entrada, desconto percentual, parcelamento automático e vencimentos. Cada parcela nasce com status próprio e cobrança rastreada.",
    image: tileVendas,
    to: "/vendas",
    icon: ShoppingCart,
    tone: "peach" as const,
  },
];

export const capabilities = [
  {
    icon: BarChart3,
    title: "Painéis em tempo real",
    text: "Receita, margem, inadimplência e giro de estoque em gráficos que respondem no mesmo instante em que a venda acontece.",
    tone: "blue" as const,
  },
  {
    icon: Users,
    title: "Clientes 360°",
    text: "Ficha completa com documentos, contatos, endereço e histórico de compras e parcelas — tudo em uma tela só.",
    tone: "green" as const,
  },
  {
    icon: ReceiptText,
    title: "Parcelamento inteligente",
    text: "Entrada, número de parcelas e dia de vencimento: o sistema monta o carnê e acompanha cada baixa.",
    tone: "peach" as const,
  },
  {
    icon: Layers,
    title: "Cadastros centralizados",
    text: "Categorias, fornecedores, departamentos e métodos de pagamento organizados em um único painel de configurações.",
    tone: "blue" as const,
  },
  {
    icon: ShieldCheck,
    title: "Segurança e permissões",
    text: "Usuários, perfis e trilhas de auditoria com registro de quem criou e alterou cada informação.",
    tone: "green" as const,
  },
  {
    icon: Zap,
    title: "WhatsApp conectado",
    text: "Conexão via QR Code para disparar cobranças e avisos direto do sistema, sem sair do fluxo.",
    tone: "peach" as const,
  },
];

export const steps = [
  {
    n: "01",
    title: "Cadastre sua empresa",
    text: "Em menos de dois minutos: dados fiscais, endereço e fuso horário. O sistema já nasce configurado para o seu negócio.",
  },
  {
    n: "02",
    title: "Suba produtos e clientes",
    text: "Importe ou cadastre com categorias coloridas, preços e margem calculada. Clientes com ficha completa e histórico.",
  },
  {
    n: "03",
    title: "Venda e receba",
    text: "Registre vendas à vista ou parceladas, gere as cobranças e dê baixa nos recebimentos com dois cliques.",
  },
  {
    n: "04",
    title: "Decida com dados",
    text: "Acompanhe fluxo de caixa, relatórios e indicadores para saber exatamente onde o lucro está.",
  },
];

export const faqs = [
  {
    q: "Preciso instalar alguma coisa?",
    a: "Não. O Pro Track roda direto no navegador, em qualquer computador, tablet ou celular. Basta entrar com seu usuário e a operação continua de onde parou.",
  },
  {
    q: "Consigo controlar vendas parceladas?",
    a: "Sim. Você define entrada, desconto, número de parcelas e o dia de vencimento. O sistema gera cada parcela com status próprio (paga, pendente ou atrasada) e atualiza o contas a receber automaticamente.",
  },
  {
    q: "Como funciona a integração com o WhatsApp?",
    a: "Nas Configurações do Sistema você lê um QR Code com o aparelho da empresa. A partir daí, cobranças e avisos podem ser enviados sem sair do sistema.",
  },
  {
    q: "Meus dados ficam seguros?",
    a: "Cada registro guarda quem criou e quando foi alterado. O acesso é controlado por usuários, perfis e permissões por departamento.",
  },
  {
    q: "Posso trocar de plano depois?",
    a: "Pode, a qualquer momento. A mudança vale já no próximo ciclo e nenhum dado é perdido no processo.",
  },
];

export const navLinks: [string, string][] = [
  ["Módulos", "#modulos"],
  ["Recursos", "#recursos"],
  ["Como funciona", "#como-funciona"],
  ["Planos", "#planos"],
  ["FAQ", "#faq"],
];

/** Mapeia o "tone" de cada item para as classes utilitárias do tema pastel */
export const toneClasses = {
  blue: {
    chip: "chip-blue",
    solidBg: "bg-[hsl(211,79%,63%)]",
    text: "text-[hsl(211,65%,42%)]",
  },
  green: {
    chip: "chip-green",
    solidBg: "bg-[hsl(155,55%,48%)]",
    text: "text-[hsl(155,55%,30%)]",
  },
  peach: {
    chip: "chip-peach",
    solidBg: "bg-[hsl(21,88%,68%)]",
    text: "text-[hsl(21,70%,40%)]",
  },
};
