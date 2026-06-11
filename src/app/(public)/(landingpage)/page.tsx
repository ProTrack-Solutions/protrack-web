import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowRight,
  BarChart3,
  Package,
  DollarSign,
  Users,
  Shield,
  Zap,
  CheckCircle,
  TrendingUp,
  Clock,
  Eye,
  Smartphone,
  Globe,
  HeartHandshake,
  Target,
  Lightbulb,
  Award,
} from "lucide-react";
import Link from "next/link";

export default function Ladingpage() {
  return (
    <>
      <div className="min-h-screen bg-gradient-background from-background via-background to-muted/20">
        {/* Navigation Header */}
        <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b z-50">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Package className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold text-foreground">
                ProTrack
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Funcionalidades
              </a>
              <a
                href="#how-it-works"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Como Funciona
              </a>
              <a
                href="#benefits"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Benefícios
              </a>
              <Button asChild variant="outline" size="sm">
                <Link href="/estoque">Acessar Sistema</Link>
              </Button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative overflow-hidden px-4 pt-32 pb-20 md:pt-40 md:pb-32">
          <div className="absolute inset-0 bg-gradient-background from-primary/5 via-transparent to-accent/5" />
          <div className="relative max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <Badge
                variant="secondary"
                className="mb-6 px-4 py-2 text-sm font-medium animate-fade-in"
              >
                <Zap className="w-4 h-4 mr-2" />
                Sistema Completo de Gestão Empresarial
              </Badge>

              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-primary from-foreground via-primary to-foreground bg-clip-text text-transparent mb-6 leading-tight animate-fade-in">
                Revolucione a Gestão
                <br />
                do Seu <span className="text-primary">Negócio</span>
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto mb-12 leading-relaxed animate-fade-in">
                Uma plataforma integrada e intuitiva que centraliza controle de
                estoque, gestão financeira, relatórios avançados e muito mais.
                Transforme dados em decisões inteligentes.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in">
                <Button
                  asChild
                  size="lg"
                  className="text-lg px-8 py-6 h-auto hover-scale"
                >
                  <Link href="/estoque">
                    Começar Gratuitamente
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-6 h-auto hover-scale"
                >
                  <Link href="/dashboard-financeiro">
                    <Eye className="w-5 h-5 mr-2" />
                    Demo ao Vivo
                  </Link>
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto animate-fade-in">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    99.9%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Disponibilidade
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    50+
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Funcionalidades
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    24/7
                  </div>
                  <div className="text-sm text-muted-foreground">Suporte</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    100%
                  </div>
                  <div className="text-sm text-muted-foreground">Seguro</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="px-4 py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4">
                Funcionalidades Completas
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Tudo que Seu Negócio Precisa
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Uma suite completa de ferramentas integradas para gerenciar
                todos os aspectos da sua empresa com eficiência e precisão
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              <Card className="group hover:shadow-xl transition-all duration-500 border-2 hover:border-primary/20 hover:-translate-y-1">
                <CardHeader className="pb-4">
                  <div className="w-14 h-14 bg-gradient-primary from-primary to-primary/80 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Package className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl">
                    Controle Inteligente de Estoque
                  </CardTitle>
                  <CardDescription className="text-base">
                    Gestão completa de produtos com alertas automáticos e
                    rastreamento em tempo real
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-primary mr-3" />
                      <span>Cadastro detalhado com códigos de barras</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-primary mr-3" />
                      <span>Movimentações automatizadas de entrada/saída</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-primary mr-3" />
                      <span>Alertas personalizáveis de estoque mínimo</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-primary mr-3" />
                      <span>Relatórios de giro e rentabilidade</span>
                    </div>
                  </div>
                  <Progress value={95} className="h-2" />
                  <div className="text-xs text-muted-foreground mt-1">
                    95% de precisão no controle
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl transition-all duration-500 border-2 hover:border-primary/20 hover:-translate-y-1">
                <CardHeader className="pb-4">
                  <div className="w-14 h-14 bg-gradient-secondary from-accent to-accent/80 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <DollarSign className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-xl">
                    Gestão Financeira Avançada
                  </CardTitle>
                  <CardDescription className="text-base">
                    Controle total do fluxo de caixa com análises preditivas e
                    planejamento
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-primary mr-3" />
                      <span>Contas a pagar/receber automatizadas</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-primary mr-3" />
                      <span>Fluxo de caixa projetado até 12 meses</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-primary mr-3" />
                      <span>Conciliação bancária automática</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-primary mr-3" />
                      <span>Análise de lucratividade por produto</span>
                    </div>
                  </div>
                  <Progress value={98} className="h-2" />
                  <div className="text-xs text-muted-foreground mt-1">
                    98% de precisão financeira
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl transition-all duration-500 border-2 hover:border-primary/20 hover:-translate-y-1">
                <CardHeader className="pb-4">
                  <div className="w-14 h-14 bg-gradient-primary from-secondary to-secondary/80 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <BarChart3 className="w-7 h-7 text-secondary-foreground" />
                  </div>
                  <CardTitle className="text-xl">
                    Analytics & Inteligência
                  </CardTitle>
                  <CardDescription className="text-base">
                    Dashboards interativos com insights acionáveis para decisões
                    estratégicas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-primary mr-3" />
                      <span>Dashboard em tempo real personalizável</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-primary mr-3" />
                      <span>KPIs automáticos e alertas inteligentes</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-primary mr-3" />
                      <span>Relatórios exportáveis em múltiplos formatos</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-primary mr-3" />
                      <span>Previsões baseadas em machine learning</span>
                    </div>
                  </div>
                  <Progress value={92} className="h-2" />
                  <div className="text-xs text-muted-foreground mt-1">
                    92% de acurácia nas previsões
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl transition-all duration-500 border-2 hover:border-primary/20 hover:-translate-y-1">
                <CardHeader className="pb-4">
                  <div className="w-14 h-14 bg-gradient-primary from-primary to-primary/80 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl">Gestão de Equipe</CardTitle>
                  <CardDescription className="text-base">
                    Controle total de usuários, permissões e produtividade da
                    equipe
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-primary mr-3" />
                      <span>Perfis personalizados por função</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-primary mr-3" />
                      <span>Controle granular de permissões</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-primary mr-3" />
                      <span>Log completo de atividades</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-primary mr-3" />
                      <span>Métricas de produtividade individual</span>
                    </div>
                  </div>
                  <Progress value={96} className="h-2" />
                  <div className="text-xs text-muted-foreground mt-1">
                    96% de satisfação da equipe
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl transition-all duration-500 border-2 hover:border-primary/20 hover:-translate-y-1">
                <CardHeader className="pb-4">
                  <div className="w-14 h-14 bg-gradient-secondary from-accent to-accent/80 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Shield className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-xl">
                    Segurança Empresarial
                  </CardTitle>
                  <CardDescription className="text-base">
                    Proteção militar dos seus dados com compliance total
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-primary mr-3 " />
                      <span>Criptografia AES-256 end-to-end</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-primary mr-3 " />
                      <span>Backup automático multi-região</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-primary mr-3 " />
                      <span>Conformidade LGPD e ISO 27001</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-primary mr-3 " />
                      <span>Monitoramento 24/7 com IA</span>
                    </div>
                  </div>
                  <Progress value={100} className="h-2" />
                  <div className="text-xs text-muted-foreground mt-1">
                    100% de proteção garantida
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl transition-all duration-500 border-2 hover:border-primary/20 hover:-translate-y-1">
                <CardHeader className="pb-4">
                  <div className="w-14 h-14 bg-gradient-secondary from-secondary to-secondary/80 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Zap className="w-7 h-7 text-secondary-foreground" />
                  </div>
                  <CardTitle className="text-xl">Performance Extrema</CardTitle>
                  <CardDescription className="text-base">
                    Sistema otimizado para máxima velocidade e disponibilidade
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-primary mr-3" />
                      <span>Interface responsiva ultra-rápida</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-primary mr-3" />
                      <span>Sincronização instantânea global</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-primary mr-3" />
                      <span>Atualizações automáticas sem downtime</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-primary mr-3" />
                      <span>Escalabilidade infinita na nuvem</span>
                    </div>
                  </div>
                  <Progress value={99} className="h-2" />
                  <div className="text-xs text-muted-foreground mt-1">
                    99.9% de uptime garantido
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="px-4 py-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4">
                Processo Simples
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Como Funciona
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Em poucos passos, você transforma completamente a gestão do seu
                negócio
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-primary  from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl font-bold text-primary-foreground">
                    1
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Configure Rapidamente
                </h3>
                <p className="text-muted-foreground text-lg">
                  Importe seus dados existentes ou comece do zero. Nosso
                  assistente guia você em cada etapa da configuração inicial.
                </p>
              </div>

              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-primary from-accent to-accent/80 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl font-bold text-white">2</span>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Gerencie Intuitivamente
                </h3>
                <p className="text-muted-foreground text-lg">
                  Interface intuitiva que sua equipe aprende em minutos.
                  Automatize processos e elimine tarefas repetitivas.
                </p>
              </div>

              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-primary from-secondary to-secondary/80 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl font-bold text-secondary-foreground">
                    3
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Cresça Exponencialmente
                </h3>
                <p className="text-muted-foreground text-lg">
                  Use insights inteligentes para tomar decisões estratégicas e
                  acelerar o crescimento do seu negócio.
                </p>
              </div>
            </div>

            <Tabs defaultValue="estoque" className="max-w-5xl mx-auto flex-col">
              <TabsList className="grid w-full grid-cols-4 mb-8">
                <TabsTrigger value="estoque">Estoque</TabsTrigger>
                <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
                <TabsTrigger value="vendas">Vendas</TabsTrigger>
                <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
              </TabsList>

              <TabsContent value="estoque" className="mt-8">
                <Card className="border-2">
                  <CardContent className="p-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                      <div>
                        <h3 className="text-3xl font-bold text-foreground mb-4">
                          Controle Total do Estoque
                        </h3>
                        <p className="text-lg text-muted-foreground mb-6">
                          Gerencie produtos, fornecedores e movimentações em uma
                          interface única e intuitiva.
                        </p>
                        <ul className="space-y-3">
                          <li className="flex items-center text-lg">
                            <CheckCircle className="w-5 h-5 text-primary mr-3" />
                            Cadastro rápido com código de barras
                          </li>
                          <li className="flex items-center text-lg">
                            <CheckCircle className="w-5 h-5 text-primary mr-3" />
                            Alertas automáticos de reposição
                          </li>
                          <li className="flex items-center text-lg">
                            <CheckCircle className="w-5 h-5 text-primary mr-3" />
                            Inventário em tempo real
                          </li>
                        </ul>
                      </div>
                      <div className="bg-muted/50 rounded-xl p-8 text-center">
                        <Package className="w-24 h-24 text-primary mx-auto mb-4" />
                        <div className="text-6xl font-bold text-primary mb-2">
                          2.5s
                        </div>
                        <div className="text-muted-foreground">
                          Tempo médio para cadastrar produto
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="financeiro" className="mt-8">
                <Card className="border-2">
                  <CardContent className="p-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                      <div>
                        <h3 className="text-3xl font-bold text-foreground mb-4">
                          Finanças Inteligentes
                        </h3>
                        <p className="text-lg text-muted-foreground mb-6">
                          Controle completo do fluxo de caixa com previsões
                          precisas e automações financeiras.
                        </p>
                        <ul className="space-y-3">
                          <li className="flex items-center text-lg">
                            <CheckCircle className="w-5 h-5 text-primary mr-3" />
                            Fluxo de caixa projetado
                          </li>
                          <li className="flex items-center text-lg">
                            <CheckCircle className="w-5 h-5 text-primary mr-3" />
                            Conciliação bancária automática
                          </li>
                          <li className="flex items-center text-lg">
                            <CheckCircle className="w-5 h-5 text-primary mr-3" />
                            Análise de lucratividade
                          </li>
                        </ul>
                      </div>
                      <div className="bg-muted/50 rounded-xl p-8 text-center">
                        <DollarSign className="w-24 h-24 text-accent mx-auto mb-4" />
                        <div className="text-6xl font-bold text-accent mb-2">
                          87%
                        </div>
                        <div className="text-muted-foreground">
                          Redução no tempo de fechamento
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="vendas" className="mt-8">
                <Card className="border-2">
                  <CardContent className="p-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                      <div>
                        <h3 className="text-3xl font-bold text-foreground mb-4">
                          Vendas Otimizadas
                        </h3>
                        <p className="text-lg text-muted-foreground mb-6">
                          Acelere suas vendas com automações inteligentes e
                          análises de comportamento.
                        </p>
                        <ul className="space-y-3">
                          <li className="flex items-center text-lg">
                            <CheckCircle className="w-5 h-5 text-primary mr-3" />
                            PDV integrado completo
                          </li>
                          <li className="flex items-center text-lg">
                            <CheckCircle className="w-5 h-5 text-primary mr-3" />
                            Análise de padrões de compra
                          </li>
                          <li className="flex items-center text-lg">
                            <CheckCircle className="w-5 h-5 text-primary mr-3" />
                            Campanhas automáticas
                          </li>
                        </ul>
                      </div>
                      <div className="bg-muted/50 rounded-xl p-8 text-center">
                        <TrendingUp className="w-24 h-24 text-secondary mx-auto mb-4" />
                        <div className="text-6xl font-bold text-secondary mb-2">
                          43%
                        </div>
                        <div className="text-muted-foreground">
                          Aumento médio nas vendas
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="relatorios" className="mt-8">
                <Card className="border-2">
                  <CardContent className="p-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                      <div>
                        <h3 className="text-3xl font-bold text-foreground mb-4">
                          Insights Poderosos
                        </h3>
                        <p className="text-lg text-muted-foreground mb-6">
                          Relatórios interativos e dashboards personalizáveis
                          para decisões estratégicas.
                        </p>
                        <ul className="space-y-3">
                          <li className="flex items-center text-lg">
                            <CheckCircle className="w-5 h-5 text-primary mr-3" />
                            Dashboards personalizáveis
                          </li>
                          <li className="flex items-center text-lg">
                            <CheckCircle className="w-5 h-5 text-primary mr-3" />
                            Relatórios automáticos
                          </li>
                          <li className="flex items-center text-lg">
                            <CheckCircle className="w-5 h-5 text-primary mr-3" />
                            Previsões com IA
                          </li>
                        </ul>
                      </div>
                      <div className="bg-muted/50 rounded-xl p-8 text-center">
                        <BarChart3 className="w-24 h-24 text-primary mx-auto mb-4" />
                        <div className="text-6xl font-bold text-primary mb-2">
                          92%
                        </div>
                        <div className="text-muted-foreground">
                          Precisão nas previsões
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="px-4 py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4">
                Vantagens Competitivas
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Por Que Escolher o ProTrack?
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Mais que um sistema, uma transformação digital completa para seu
                negócio
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              <Card className="text-center border-2 hover:border-primary/20 transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    Economia de Tempo
                  </h3>
                  <p className="text-muted-foreground">
                    Automatize tarefas repetitivas e ganhe até 8 horas por
                    semana
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-2 hover:border-primary/20 transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <Target className="w-12 h-12 text-accent mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    Decisões Precisas
                  </h3>
                  <p className="text-muted-foreground">
                    Dados em tempo real para decisões estratégicas certeiras
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-2 hover:border-primary/20 transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <Lightbulb className="w-12 h-12 text-secondary mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    Inovação Contínua
                  </h3>
                  <p className="text-muted-foreground">
                    Atualizações constantes com as últimas tecnologias
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-2 hover:border-primary/20 transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <Award className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    Excelência Garantida
                  </h3>
                  <p className="text-muted-foreground">
                    Padrão internacional de qualidade e segurança
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold text-foreground mb-6">
                  Resultados Comprovados
                </h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-lg font-medium">
                        Redução de Custos Operacionais
                      </span>
                      <span className="text-2xl font-bold text-primary">
                        35%
                      </span>
                    </div>
                    <Progress value={35} className="h-3" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-lg font-medium">
                        Aumento na Produtividade
                      </span>
                      <span className="text-2xl font-bold text-accent">
                        52%
                      </span>
                    </div>
                    <Progress value={52} className="h-3" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-lg font-medium">
                        Melhoria na Precisão dos Dados
                      </span>
                      <span className="text-2xl font-bold text-secondary">
                        89%
                      </span>
                    </div>
                    <Progress value={89} className="h-3" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-lg font-medium">
                        Satisfação dos Usuários
                      </span>
                      <span className="text-2xl font-bold text-primary">
                        96%
                      </span>
                    </div>
                    <Progress value={96} className="h-3" />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <Card className="p-6 border-l-4 border-l-primary">
                  <div className="flex items-start space-x-4">
                    <HeartHandshake className="w-8 h-8 text-primary mt-1" />
                    <div>
                      <h4 className="text-xl font-bold text-foreground mb-2">
                        Suporte Especializado
                      </h4>
                      <p className="text-muted-foreground">
                        Equipe dedicada 24/7 com especialistas em gestão
                        empresarial para garantir seu sucesso.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 border-l-4 border-l-accent">
                  <div className="flex items-start space-x-4">
                    <Globe className="w-8 h-8 text-accent mt-1" />
                    <div>
                      <h4 className="text-xl font-bold text-foreground mb-2">
                        Acesso Global
                      </h4>
                      <p className="text-muted-foreground">
                        Gerencie seu negócio de qualquer lugar do mundo com
                        sincronização em tempo real.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 border-l-4 border-l-secondary">
                  <div className="flex items-start space-x-4">
                    <Smartphone className="w-8 h-8 text-secondary mt-1" />
                    <div>
                      <h4 className="text-xl font-bold text-foreground mb-2">
                        Mobile First
                      </h4>
                      <p className="text-muted-foreground">
                        Interface otimizada para dispositivos móveis, permitindo
                        gestão completa no smartphone.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 py-20">
          <div className="max-w-5xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6 px-4 py-2">
              <Zap className="w-4 h-4 mr-2" />
              Comece Agora Mesmo
            </Badge>

            <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Transforme Seu Negócio
              <br />
              <span className="text-primary">Hoje Mesmo</span>
            </h2>

            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              Junte-se a milhares de empresas que já revolucionaram sua gestão.
              Comece gratuitamente e veja os resultados em dias, não meses.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Button
                asChild
                size="lg"
                className="text-xl px-12 py-8 h-auto hover-scale"
              >
                <Link href="/estoque">
                  <Package className="w-6 h-6 mr-3" />
                  Começar Gratuitamente
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-xl px-12 py-8 h-auto hover-scale"
              >
                <Link href="/dashboard-financeiro">
                  <BarChart3 className="w-6 h-6 mr-3" />
                  Ver Demo Interativa
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
              <div>
                <div className="text-lg font-medium text-muted-foreground mb-2">
                  Setup
                </div>
                <div className="text-2xl font-bold text-primary">5 min</div>
              </div>
              <div>
                <div className="text-lg font-medium text-muted-foreground mb-2">
                  Suporte
                </div>
                <div className="text-2xl font-bold text-primary">24/7</div>
              </div>
              <div>
                <div className="text-lg font-medium text-muted-foreground mb-2">
                  Garantia
                </div>
                <div className="text-2xl font-bold text-primary">30 dias</div>
              </div>
              <div>
                <div className="text-lg font-medium text-muted-foreground mb-2">
                  Teste
                </div>
                <div className="text-2xl font-bold text-primary">Grátis</div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-muted/50 border-t px-4 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <Package className="w-8 h-8 text-primary" />
                <span className="text-xl font-bold text-foreground">
                  ProTrack
                </span>
              </div>
              <div className="flex items-center space-x-6 text-muted-foreground">
                <a href="#" className="hover:text-primary transition-colors">
                  Termos
                </a>
                <a href="#" className="hover:text-primary transition-colors">
                  Privacidade
                </a>
                <a href="#" className="hover:text-primary transition-colors">
                  Suporte
                </a>
                <a href="#" className="hover:text-primary transition-colors">
                  Contato
                </a>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t text-center text-muted-foreground">
              <p>
                &copy; 2026 ProTrack. Todos os direitos reservados. Desenvolvido
                para impulsionar o seu sucesso.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
