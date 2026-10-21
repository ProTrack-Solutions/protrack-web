/**
 * Ilustrações animadas (SVG puro) dos módulos.
 * As animações ficam pausadas até o <Reveal> ao redor ganhar `.is-visible`
 * (ver regras `.art` em landing-theme.css). Elementos animados nunca usam o
 * atributo `transform` — a animação CSS o sobrescreveria — e são
 * posicionados só por coordenadas.
 */

const C = {
  ink: "#1B2436",
  night: "#0A1024",
  slate: "#64748B",
  line: "#E2E8F0",
  blue: "#4F94E5",
  blueDark: "#2867B2",
  blueLight: "#EEF5FD",
  green: "#31A16C",
  greenDark: "#1F7A4F",
  greenLight: "#D5F1E4",
  peach: "#F08E58",
  peachDark: "#B5541F",
  peachLight: "#FDE6D8",
  gold: "#F6C453",
  goldDark: "#D9A21F",
};

const delay = (ms: number) => ({ animationDelay: `${ms}ms` });

function Backdrop({ id, from, to, dot }: { id: string; from: string; to: string; dot: string }) {
  return (
    <>
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
        <pattern id={`${id}-dots`} width="18" height="18" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.3" fill={dot} opacity="0.22" />
        </pattern>
        <filter id={`${id}-shadow`} x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="8" stdDeviation="9" floodColor={C.ink} floodOpacity="0.14" />
        </filter>
      </defs>
      <rect width="400" height="300" fill={`url(#${id}-bg)`} />
      <rect width="400" height="300" fill={`url(#${id}-dots)`} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Estoque                                                             */
/* ------------------------------------------------------------------ */

type BoxProps = { x: number; y: number; w: number; h: number };

function Box({ x, y, w, h }: BoxProps) {
  const labelW = Math.min(w - 16, 30);
  return (
    <>
      <rect x={x} y={y} width={w} height={h} rx="4" fill="#E8B987" />
      <rect x={x} y={y} width={w} height={h * 0.24} rx="4" fill="#D9A56F" />
      <rect x={x + w / 2 - 4} y={y} width="8" height={h * 0.24 + 4} fill="#F3D3AE" />
      <rect x={x + 8} y={y + h - 19} width={labelW} height="12" rx="2" fill="#fff" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect
          key={i}
          x={x + 11 + i * ((labelW - 6) / 5)}
          y={y + h - 17}
          width={i % 2 ? 1.2 : 2}
          height="8"
          fill={C.ink}
          opacity="0.7"
        />
      ))}
    </>
  );
}

const shelfBoxes: BoxProps[] = [
  { x: 54, y: 98, w: 58, h: 52 },
  { x: 120, y: 108, w: 52, h: 42 },
  { x: 180, y: 92, w: 64, h: 58 },
  { x: 54, y: 190, w: 72, h: 50 },
  { x: 134, y: 200, w: 52, h: 40 },
  { x: 194, y: 206, w: 50, h: 34 },
];

const stockLevels = [
  { pct: 0.85, color: C.blue },
  { pct: 0.6, color: C.green },
  { pct: 0.18, color: C.peach, low: true },
];

export function EstoqueArt() {
  return (
    <svg
      viewBox="0 0 400 300"
      className="art h-full w-full"
      role="img"
      aria-label="Ilustração: prateleiras com caixas sendo escaneadas e painel de níveis de estoque com alerta de mínimo"
    >
      <Backdrop id="est" from="#F3F8FE" to="#D6E6FA" dot={C.blue} />
      <defs>
        <linearGradient id="est-laser" x1="0" x2="1">
          <stop offset="0" stopColor="#FF4D6D" stopOpacity="0" />
          <stop offset="0.5" stopColor="#FF4D6D" />
          <stop offset="1" stopColor="#FF4D6D" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* estante */}
      <rect x="36" y="56" width="8" height="196" rx="3" fill={C.blueDark} opacity="0.85" />
      <rect x="252" y="56" width="8" height="196" rx="3" fill={C.blueDark} opacity="0.85" />
      <rect x="30" y="150" width="236" height="9" rx="3" fill={C.blueDark} />
      <rect x="30" y="240" width="236" height="9" rx="3" fill={C.blueDark} />

      {/* caixas caindo na prateleira */}
      {shelfBoxes.map((b, i) => (
        <g key={i} className="a-drop" style={delay(150 + i * 120)}>
          <Box {...b} />
        </g>
      ))}

      {/* laser do leitor de código de barras */}
      <g className="a-scan">
        <rect x="168" y="90" width="88" height="12" fill="url(#est-laser)" opacity="0.25" />
        <rect x="168" y="95" width="88" height="2.5" fill="url(#est-laser)" />
      </g>

      {/* +12 unidades entrando */}
      <g className="a-rise">
        <rect x="124" y="74" width="44" height="20" rx="10" fill={C.green} />
        <text x="146" y="88" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">
          +12 un.
        </text>
      </g>

      {/* painel de níveis */}
      <g className="a-up" style={delay(500)}>
        <rect x="276" y="52" width="110" height="196" rx="14" fill="#fff" filter="url(#est-shadow)" />
        <text x="290" y="78" fontSize="12" fontWeight="700" fill={C.ink}>
          Níveis
        </text>
        {stockLevels.map((l, i) => {
          const y = 96 + i * 46;
          return (
            <g key={i}>
              <rect x="290" y={y} width={44 + i * 6} height="7" rx="3.5" fill="#CBD5E1" />
              <rect x="290" y={y + 16} width="80" height="10" rx="5" fill={C.blueLight} />
              <rect
                x="290"
                y={y + 16}
                width={80 * l.pct}
                height="10"
                rx="5"
                fill={l.color}
                className="a-fill"
                style={delay(900 + i * 200)}
              />
              {l.low && (
                <>
                  <line
                    x1="314"
                    y1={y + 11}
                    x2="314"
                    y2={y + 31}
                    stroke={C.peachDark}
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                  />
                  <circle cx="370" cy={y + 3} r="7" fill={C.peach} className="a-pulse" />
                  <circle cx="370" cy={y + 3} r="7" fill={C.peach} />
                  <text x="370" y={y + 7} textAnchor="middle" fontSize="10" fontWeight="800" fill="#fff">
                    !
                  </text>
                </>
              )}
            </g>
          );
        })}
        <text x="290" y="232" fontSize="9.5" fontWeight="700" fill={C.peachDark}>
          3 abaixo do mínimo
        </text>
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Financeiro                                                          */
/* ------------------------------------------------------------------ */

const CASH_LINE =
  "M46 200 C 66 196, 76 184, 92 184 S 120 196, 136 192 S 160 160, 180 158 S 206 172, 222 166 S 248 128, 274 120";

function Coin({ cy }: { cy: number }) {
  return (
    <>
      <ellipse cx="344" cy={cy + 6} rx="26" ry="8" fill={C.goldDark} />
      <rect x="318" y={cy} width="52" height="6" fill={C.goldDark} />
      <ellipse cx="344" cy={cy} rx="26" ry="8" fill={C.gold} />
      <ellipse cx="344" cy={cy} rx="16" ry="4.5" fill="none" stroke={C.goldDark} strokeWidth="1.5" opacity="0.6" />
    </>
  );
}

const cashMoves = [
  { x: 36, w: 156, color: C.green, light: C.greenLight, label: "+ R$ 389,90", up: true },
  { x: 202, w: 150, color: C.peach, light: C.peachLight, label: "− R$ 120,00", up: false },
];

export function FinanceiroArt() {
  return (
    <svg
      viewBox="0 0 400 300"
      className="art h-full w-full"
      role="img"
      aria-label="Ilustração: gráfico de fluxo de caixa subindo, pilha de moedas e lançamentos de entrada e saída"
    >
      <Backdrop id="fin" from="#F1FBF6" to="#CFEEDF" dot={C.green} />
      <defs>
        <linearGradient id="fin-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.green} stopOpacity="0.35" />
          <stop offset="1" stopColor={C.green} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* card do gráfico */}
      <g className="a-up">
        <rect x="26" y="34" width="270" height="200" rx="16" fill="#fff" filter="url(#fin-shadow)" />
        <text x="46" y="62" fontSize="12" fontWeight="600" fill={C.slate}>
          Fluxo de caixa
        </text>
        <text x="46" y="90" fontSize="22" fontWeight="800" fill={C.greenDark}>
          R$ 12.480
        </text>
        <rect x="166" y="73" width="46" height="20" rx="10" fill={C.greenLight} />
        <text x="189" y="87" textAnchor="middle" fontSize="10.5" fontWeight="700" fill={C.greenDark}>
          +18%
        </text>
        {[130, 160, 190].map((y) => (
          <line key={y} x1="46" x2="276" y1={y} y2={y} stroke={C.line} strokeDasharray="4 5" />
        ))}
        <path d={`${CASH_LINE} L274 214 L46 214 Z`} fill="url(#fin-area)" className="a-fade" style={delay(1300)} />
        <path
          d={CASH_LINE}
          fill="none"
          stroke={C.green}
          strokeWidth="3.5"
          strokeLinecap="round"
          pathLength={1}
          className="a-draw"
          style={delay(400)}
        />
        <circle cx="274" cy="120" r="5" fill={C.green} className="a-pulse" style={delay(2000)} />
        <circle cx="274" cy="120" r="5" fill={C.green} stroke="#fff" strokeWidth="2" className="a-pop" style={delay(1900)} />
      </g>

      {/* pilha de moedas */}
      {[236, 222, 208, 194].map((cy, i) => (
        <g key={cy} className="a-drop" style={delay(600 + i * 140)}>
          <Coin cy={cy} />
        </g>
      ))}
      <g className="a-coin">
        <Coin cy={180} />
      </g>

      {/* lançamentos */}
      {cashMoves.map((m, i) => (
        <g key={m.label} className="a-up" style={delay(1500 + i * 200)}>
          <rect x={m.x} y="248" width={m.w} height="36" rx="18" fill="#fff" filter="url(#fin-shadow)" />
          <circle cx={m.x + 20} cy="266" r="11" fill={m.light} />
          <path
            d={m.up ? `M${m.x + 20} 271 v-10 m-4 4 l4 -4 l4 4` : `M${m.x + 20} 261 v10 m-4 -4 l4 4 l4 -4`}
            fill="none"
            stroke={m.color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text x={m.x + 40} y="270.5" fontSize="12" fontWeight="700" fill={C.ink}>
            {m.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Vendas                                                              */
/* ------------------------------------------------------------------ */

const installments = [0, 1, 2, 3, 4, 5];

export function VendasArt() {
  return (
    <svg
      viewBox="0 0 400 300"
      className="art h-full w-full"
      role="img"
      aria-label="Ilustração: impressora emitindo o comprovante da venda e carnê de seis parcelas sendo quitado"
    >
      <Backdrop id="ven" from="#FFF6F0" to="#FBDCC6" dot={C.peach} />
      <defs>
        <clipPath id="ven-slot">
          <rect x="0" y="0" width="400" height="158" />
        </clipPath>
      </defs>

      {/* comprovante saindo da impressora */}
      <g clipPath="url(#ven-slot)">
        <g className="a-print">
          <path
            d="M66 46 l7 -8 l7 8 l7 -8 l7 8 l7 -8 l7 8 l7 -8 l7 8 l7 -8 l7 8 l7 -8 l7 8 l7 -8 l7 8 l7 -8 l7 8 V170 H66 Z"
            fill="#fff"
            filter="url(#ven-shadow)"
          />
          <text x="122" y="62" textAnchor="middle" fontSize="7" fontWeight="800" letterSpacing="1" fill={C.slate}>
            PROTRACK GERENCIAL
          </text>
          <text x="122" y="80" textAnchor="middle" fontSize="11" fontWeight="800" fill={C.ink}>
            Venda #1042
          </text>
          <line x1="76" x2="168" y1="89" y2="89" stroke="#CBD5E1" strokeDasharray="3 3" />
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <rect x="78" y={97 + i * 12} width={46 - i * 8} height="5" rx="2.5" fill="#CBD5E1" />
              <rect x={146 - i * 2} y={97 + i * 12} width={20 + i * 2} height="5" rx="2.5" fill="#CBD5E1" />
            </g>
          ))}
          <line x1="76" x2="168" y1="132" y2="132" stroke="#CBD5E1" strokeDasharray="3 3" />
          <text x="78" y="146" fontSize="8.5" fontWeight="800" fill={C.slate}>
            TOTAL
          </text>
          <text x="166" y="146" textAnchor="end" fontSize="11" fontWeight="800" fill={C.peachDark}>
            R$ 389,90
          </text>
        </g>
      </g>

      {/* impressora */}
      <ellipse cx="122" cy="246" rx="84" ry="8" fill={C.ink} opacity="0.12" />
      <rect x="40" y="154" width="164" height="84" rx="14" fill={C.ink} />
      <rect x="58" y="152" width="128" height="9" rx="4.5" fill={C.night} />
      <rect x="52" y="176" width="140" height="48" rx="9" fill="#2A3550" />
      <circle cx="70" cy="200" r="5" fill="#34D399" className="a-blink" />
      <rect x="84" y="190" width="94" height="20" rx="5" fill={C.night} />
      <text x="131" y="203.5" textAnchor="middle" fontSize="8" fontWeight="700" letterSpacing="1" fill="#6EE7B7">
        IMPRIMINDO
      </text>

      {/* +1 venda */}
      <g className="a-pop" style={delay(2400)}>
        <g className="a-bob">
          <rect x="182" y="94" width="58" height="24" rx="12" fill={C.peach} />
          <text x="211" y="110" textAnchor="middle" fontSize="10" fontWeight="800" fill="#fff">
            +1 venda
          </text>
        </g>
      </g>

      {/* carnê */}
      <g className="a-up" style={delay(300)}>
        <rect x="248" y="28" width="134" height="244" rx="16" fill="#fff" filter="url(#ven-shadow)" />
        <text x="264" y="54" fontSize="12" fontWeight="800" fill={C.ink}>
          Carnê 6x
        </text>
        <text x="264" y="70" fontSize="9.5" fill={C.slate}>
          R$ 64,98 por mês
        </text>
        {installments.map((i) => {
          const y = 86 + i * 29;
          const paid = i < 3;
          const pending = i === 3;
          return (
            <g key={i}>
              <rect x="260" y={y} width="110" height="23" rx="11.5" fill="#F8FAFC" />
              <text x="272" y={y + 15.5} fontSize="10" fontWeight="800" fill={C.ink}>
                {i + 1}/6
              </text>
              <text x="298" y={y + 15.5} fontSize="9.5" fill={C.slate}>
                R$ 64,98
              </text>
              <circle cx="356" cy={y + 11.5} r="7.5" fill={C.line} />
              {paid && (
                <>
                  <circle cx="356" cy={y + 11.5} r="7.5" fill={C.green} className="a-pop" style={delay(1300 + i * 450)} />
                  <path
                    d={`M352.5 ${y + 11.5} l2.5 2.5 l4.5 -5`}
                    fill="none"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    pathLength={1}
                    className="a-draw a-draw-fast"
                    style={delay(1500 + i * 450)}
                  />
                </>
              )}
              {pending && (
                <>
                  <circle cx="356" cy={y + 11.5} r="7.5" fill={C.peach} className="a-pulse" style={delay(2800)} />
                  <circle cx="356" cy={y + 11.5} r="7.5" fill={C.peach} className="a-pop" style={delay(2700)} />
                </>
              )}
            </g>
          );
        })}
      </g>
    </svg>
  );
}

export const moduleArt = {
  estoque: EstoqueArt,
  financeiro: FinanceiroArt,
  vendas: VendasArt,
};
