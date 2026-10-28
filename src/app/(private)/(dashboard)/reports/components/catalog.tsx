import { ReactNode } from "react";
import {
  AlarmClock,
  ArrowLeftRight,
  Boxes,
  CalendarDays,
  CreditCard,
  HandCoins,
  Layers,
  Receipt,
  Scale,
  ShoppingCart,
  Trophy,
  UserRound,
  Users,
  Wallet,
} from "lucide-react";
import { ReportType } from "@/interfaces/reports.interface";

export interface ReportDefinition {
  type: ReportType;
  title: string;
  description: string;
  icon: ReactNode;
  /** Posição de estoque é sempre "agora": o período não se aplica */
  usesPeriod: boolean;
}

export interface ReportGroup {
  label: string;
  reports: ReportDefinition[];
}

const icon = "h-4 w-4";

export const REPORT_GROUPS: ReportGroup[] = [
  {
    label: "Vendas",
    reports: [
      {
        type: "sales",
        title: "Vendas no período",
        description: "Lista de todas as vendas com cliente, vendedor e lucro",
        icon: <ShoppingCart className={icon} />,
        usesPeriod: true,
      },
      {
        type: "sales_by_day",
        title: "Faturamento por dia",
        description: "Vendas, ticket médio e lucro dia a dia",
        icon: <CalendarDays className={icon} />,
        usesPeriod: true,
      },
      {
        type: "sales_by_payment_method",
        title: "Por forma de pagamento",
        description: "Quanto entrou em dinheiro, Pix, cartão e a prazo",
        icon: <CreditCard className={icon} />,
        usesPeriod: true,
      },
      {
        type: "sales_by_seller",
        title: "Por vendedor",
        description: "Desempenho de cada vendedor, base para comissão",
        icon: <UserRound className={icon} />,
        usesPeriod: true,
      },
      {
        type: "sales_by_customer",
        title: "Por cliente",
        description: "Ranking dos clientes que mais compraram",
        icon: <Users className={icon} />,
        usesPeriod: true,
      },
    ],
  },
  {
    label: "Produtos e estoque",
    reports: [
      {
        type: "products_abc",
        title: "Curva ABC e margem",
        description: "Produtos que mais faturam e a margem de cada um",
        icon: <Trophy className={icon} />,
        usesPeriod: true,
      },
      {
        type: "profit_category",
        title: "Margem por categoria",
        description: "Receita, custo e lucro de cada categoria",
        icon: <Layers className={icon} />,
        usesPeriod: true,
      },
      {
        type: "inventory",
        title: "Posição de estoque",
        description: "Saldo atual e valor do estoque a custo e a venda",
        icon: <Boxes className={icon} />,
        usesPeriod: false,
      },
      {
        type: "stock_movements",
        title: "Movimentações de estoque",
        description: "Entradas, saídas e ajustes (kardex)",
        icon: <ArrowLeftRight className={icon} />,
        usesPeriod: true,
      },
    ],
  },
  {
    label: "Financeiro",
    reports: [
      {
        type: "dre",
        title: "DRE gerencial",
        description: "Receita, CMV, despesas e resultado do período",
        icon: <Scale className={icon} />,
        usesPeriod: true,
      },
      {
        type: "open_installments",
        title: "Inadimplência",
        description: "Parcelas em aberto e dias de atraso",
        icon: <AlarmClock className={icon} />,
        usesPeriod: true,
      },
      {
        type: "payments_received",
        title: "Recebimentos de crediário",
        description: "Pagamentos de parcelas recebidos",
        icon: <HandCoins className={icon} />,
        usesPeriod: true,
      },
      {
        type: "bills_payable",
        title: "Contas a pagar",
        description: "Contas do período, pagas e em aberto",
        icon: <Receipt className={icon} />,
        usesPeriod: true,
      },
      {
        type: "cash_sessions",
        title: "Fechamentos de caixa",
        description: "Turnos, sangrias, suprimentos e diferenças",
        icon: <Wallet className={icon} />,
        usesPeriod: true,
      },
    ],
  },
];

export const REPORTS: ReportDefinition[] = REPORT_GROUPS.flatMap(
  (group) => group.reports,
);

export const findReport = (type: ReportType) =>
  REPORTS.find((report) => report.type === type) ?? REPORTS[0];
