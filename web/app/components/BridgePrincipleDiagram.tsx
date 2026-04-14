"use client";

import { useState } from "react";

type Bridge = {
  id: string;
  label: string;
  source: string;
  bottleneck: string;
  color: string;
  principle: string;
};

const BRIDGES: Bridge[] = [
  { id: "frit", label: "프릿 실링", source: "PDP", bottleneck: "유리-금속 실링", color: "#D4A853",
    principle: "저융점 유리 분말(Bi₂O₃)을 450°C에서 용융 → 유리-유리 접합 + 금속 와이어 매립" },
  { id: "aao", label: "AAO 나노전극", source: "나노기술", bottleneck: "전극 품질", color: "#6BA368",
    principle: "Al 양극산화 → 나노채널 → Ni 도금 → 나노팁 어레이 → 전계 집중 + 균일 방전" },
  { id: "micro", label: "마이크로 격벽", source: "MEMS", bottleneck: "진공 시스템", color: "#7B9EB8",
    principle: "V=f(p·d): 갭 d를 줄이면 → 압력 p를 올려도 방전 가능 → 진공 불필요" },
  { id: "butyl", label: "부틸 2중 실링", source: "건축 IGU", bottleneck: "유리-금속 실링", color: "#6BA368",
    principle: "부틸 내층(CTE 흡수 + 가스차단) + Torr Seal 외층(UHV 가스 차단) = 상온 복합 기밀 봉착" },
  { id: "solgel", label: "졸-겔 코팅", source: "화학/반도체", bottleneck: "기밀+수명", color: "#B8A9C9",
    principle: "TEOS 가수분해 → SiO₂ 나노코팅 → 유기 실링 위 오버코팅(투과율 100x 감소)" },
  { id: "map", label: "MAP 플러싱", source: "식품 산업", bottleneck: "가스 충전", color: "#C17B5E",
    principle: "네온 관류 → 공기 치환 → O₂ 센서 확인 → 밀봉. 진공 펌프 불필요." },
  { id: "pib", label: "PIB 장기 실링", source: "태양전지", bottleneck: "장기 수명", color: "#D4A853",
    principle: "PIB(폴리이소부틸렌)는 부틸보다 10x 낮은 가스 투과율 → 수명 100일→1000일+" },
  { id: "mil", label: "MIL-spec 커넥터", source: "우주/항공", bottleneck: "핀 관통 봉착", color: "#ef8f44",
    principle: "기밀 피드스루를 직접 만들지 않고 산업 표준 부품(TO-8, D-sub) 구매로 해결" },
];

function BridgeIllustration({ bridge, w, h }: { bridge: Bridge; w: number; h: number }) {
  const c = bridge.color;
  const cx = w / 2;

  switch (bridge.id) {
    case "frit":
      return (
        <g>
          {/* Glass plates */}
          <rect x={10} y={10} width={w - 20} height={15} rx={2} fill="#7B9EB825" stroke="#7B9EB860" strokeWidth={0.8} />
          <rect x={10} y={h - 25} width={w - 20} height={15} rx={2} fill="#7B9EB825" stroke="#7B9EB860" strokeWidth={0.8} />
          {/* Frit layer with dots becoming solid */}
          <rect x={15} y={28} width={(w - 30) / 2 - 5} height={8} rx={1} fill={c + "30"} stroke={c + "60"} strokeWidth={0.6} strokeDasharray="2 2" />
          {[20, 30, 40, 50, 60].map((dx, i) => <circle key={i} cx={dx} cy={32} r={1.2} fill={c + "60"} />)}
          <text x={(w - 30) / 4 + 15} y={44} fill={c} fontSize="5" textAnchor="middle">분말</text>
          {/* Arrow */}
          <line x1={cx - 3} y1={32} x2={cx + 3} y2={32} stroke={c} strokeWidth={1} />
          <polygon points={`${cx + 1},30 ${cx + 5},32 ${cx + 1},34`} fill={c} />
          {/* Fused frit */}
          <rect x={cx + 8} y={28} width={(w - 30) / 2 - 5} height={8} rx={1} fill={c + "50"} stroke={c} strokeWidth={0.8} />
          <text x={cx + 8 + ((w - 30) / 2 - 5) / 2} y={44} fill={c} fontSize="5" textAnchor="middle" fontWeight="bold">융착</text>
          {/* Dumet wires */}
          {[25, 50, 75, 100].map((dx, i) => (
            <line key={i} x1={dx} y1={8} x2={dx} y2={h - 8} stroke="#C17B5E60" strokeWidth={1.2} />
          ))}
          <text x={cx} y={h - 4} fill="#666" fontSize="4" textAnchor="middle">450°C 소성</text>
        </g>
      );
    case "aao":
      return (
        <g>
          {/* Al base */}
          <rect x={10} y={h - 20} width={w - 20} height={10} rx={1} fill="#B8A9C930" stroke="#B8A9C960" strokeWidth={0.5} />
          {/* Nanotip array */}
          {Array.from({ length: 12 }, (_, i) => {
            const nx = 18 + i * ((w - 36) / 11);
            return (
              <g key={i}>
                <rect x={nx - 1.5} y={20} width={3} height={h - 40} rx={0.5} fill={c + "40"} stroke={c + "70"} strokeWidth={0.4} />
                <circle cx={nx} cy={18} r={2} fill={c} opacity={0.8} />
              </g>
            );
          })}
          <text x={cx} y={12} fill={c} fontSize="5" fontWeight="bold" textAnchor="middle">Ni 나노팁</text>
          <text x={cx} y={h - 5} fill="#B8A9C9" fontSize="4" textAnchor="middle">Al 기판</text>
        </g>
      );
    case "micro":
      return (
        <g>
          {/* Traditional large gap */}
          <rect x={8} y={10} width={12} height={h - 20} rx={1} fill="#ef8f4430" stroke="#ef8f44" strokeWidth={0.8} />
          <rect x={55} y={10} width={12} height={h - 20} rx={1} fill="#ef8f4430" stroke="#ef8f44" strokeWidth={0.8} />
          <text x={37} y={cx - 5} fill="#888" fontSize="6" textAnchor="middle">d=1.5mm</text>
          <text x={37} y={cx + 3} fill="#888" fontSize="5" textAnchor="middle">15 Torr</text>
          {/* Arrow */}
          <line x1={75} y1={h / 2} x2={85} y2={h / 2} stroke="#666" strokeWidth={0.8} />
          <polygon points="83,28 88,30 83,32" fill="#666" />
          {/* Micro gap */}
          <rect x={90} y={15} width={12} height={h - 30} rx={1} fill={c + "40"} stroke={c} strokeWidth={1} />
          <rect x={108} y={15} width={12} height={h - 30} rx={1} fill={c + "40"} stroke={c} strokeWidth={1} />
          <text x={110} y={cx - 5} fill={c} fontSize="6" fontWeight="bold" textAnchor="middle">d=0.5mm</text>
          <text x={110} y={cx + 3} fill={c} fontSize="5" textAnchor="middle">200 Torr</text>
          <text x={cx + 15} y={h - 4} fill="#666" fontSize="4" textAnchor="middle">p·d ≈ 일정 → 진공 불필요</text>
        </g>
      );
    case "butyl":
      return (
        <g>
          {/* Glass dome */}
          <path d={`M 20 ${h - 15} L 20 20 Q 20 8 ${cx} 8 Q ${w - 20} 8 ${w - 20} 20 L ${w - 20} ${h - 15}`}
            fill="#7B9EB815" stroke="#7B9EB870" strokeWidth={0.8} />
          {/* Butyl layer (green) */}
          <rect x={15} y={h - 18} width={w - 30} height={6} rx={1} fill={c + "50"} stroke={c} strokeWidth={0.8} />
          <text x={cx} y={h - 13} fill={c} fontSize="4" fontWeight="bold" textAnchor="middle">부틸 (가스 차단)</text>
          {/* Torr Seal (orange) */}
          <rect x={12} y={h - 11} width={w - 24} height={5} rx={1} fill="#D4A85340" stroke="#D4A85380" strokeWidth={0.6} />
          <text x={cx} y={h - 7} fill="#D4A853" fontSize="3.5" textAnchor="middle">Torr Seal (가스 차단)</text>
          <text x={cx} y={20} fill="#7B9EB8" fontSize="5" textAnchor="middle">유리 돔</text>
          <text x={cx} y={h - 1} fill="#666" fontSize="4" textAnchor="middle">상온 2중 봉착</text>
        </g>
      );
    case "solgel":
      return (
        <g>
          {/* Base sealing layer */}
          <rect x={10} y={h / 2} width={w - 20} height={12} rx={2} fill="#6BA36830" stroke="#6BA36860" strokeWidth={0.6} />
          <text x={cx} y={h / 2 + 9} fill="#6BA368" fontSize="4" textAnchor="middle">유기 실링 (부틸)</text>
          {/* Sol-gel overcoating */}
          <rect x={8} y={h / 2 - 5} width={w - 16} height={6} rx={1} fill={c + "40"} stroke={c} strokeWidth={0.8} />
          <text x={cx} y={h / 2 - 1} fill={c} fontSize="4" fontWeight="bold" textAnchor="middle">SiO₂ 졸-겔 코팅</text>
          {/* Arrows showing reduced permeation */}
          {[30, 50, 70, 90].map((ax, i) => (
            <g key={i}>
              <line x1={ax} y1={10} x2={ax} y2={h / 2 - 7} stroke="#ef444450" strokeWidth={0.8} strokeDasharray="2 1" />
              <text x={ax} y={h / 2 - 9} fill="#ef4444" fontSize="6" textAnchor="middle">×</text>
            </g>
          ))}
          <text x={cx} y={14} fill="#ef4444" fontSize="4" textAnchor="middle" opacity={0.7}>가스 투과</text>
          <text x={cx} y={h - 4} fill="#666" fontSize="4" textAnchor="middle">투과율 100x 감소</text>
        </g>
      );
    case "map":
      return (
        <g>
          {/* Tube */}
          <rect x={30} y={10} width={w - 60} height={h - 25} rx={4} fill="#7B9EB815" stroke="#7B9EB860" strokeWidth={0.8} />
          {/* Ne in arrow */}
          <line x1={5} y1={h / 3} x2={30} y2={h / 3} stroke={c} strokeWidth={1.5} />
          <polygon points={`28,${h / 3 - 2} 33,${h / 3} 28,${h / 3 + 2}`} fill={c} />
          <text x={17} y={h / 3 - 5} fill={c} fontSize="5" fontWeight="bold" textAnchor="middle">Ne</text>
          {/* Air out arrow */}
          <line x1={w - 30} y1={h * 2 / 3} x2={w - 5} y2={h * 2 / 3} stroke="#ef444480" strokeWidth={1} />
          <polygon points={`${w - 7},${h * 2 / 3 - 2} ${w - 2},${h * 2 / 3} ${w - 7},${h * 2 / 3 + 2}`} fill="#ef444480" />
          <text x={w - 17} y={h * 2 / 3 - 5} fill="#ef4444" fontSize="5" textAnchor="middle" opacity={0.7}>Air</text>
          {/* Ne fills tube */}
          <text x={cx} y={h / 2 + 3} fill={c + "80"} fontSize="7" fontWeight="bold" textAnchor="middle">Ne</text>
          <text x={cx} y={h - 5} fill="#666" fontSize="4" textAnchor="middle">플러싱으로 공기 치환</text>
        </g>
      );
    case "pib":
      return (
        <g>
          {/* Comparison bars */}
          <text x={15} y={15} fill="#D4A853" fontSize="5">부틸 (IIR)</text>
          <rect x={15} y={18} width={80} height={8} rx={2} fill="#D4A85340" stroke="#D4A85370" strokeWidth={0.5} />
          <text x={97} y={25} fill="#D4A853" fontSize="4">100일</text>
          <text x={15} y={40} fill={c} fontSize="5" fontWeight="bold">PIB</text>
          <rect x={15} y={43} width={8} height={8} rx={2} fill={c + "50"} stroke={c} strokeWidth={0.5} />
          <text x={25} y={50} fill={c} fontSize="4" fontWeight="bold">1000일+</text>
          <text x={cx} y={h - 4} fill="#666" fontSize="4" textAnchor="middle">투과율 10x 낮음 → 수명 10x</text>
        </g>
      );
    case "mil":
      return (
        <g>
          {/* TO-8 header */}
          <rect x={cx - 30} y={h / 2 - 8} width={60} height={16} rx={3} fill={c + "30"} stroke={c} strokeWidth={1} />
          <text x={cx} y={h / 2 + 2} fill={c} fontSize="5" fontWeight="bold" textAnchor="middle">TO-8 Header</text>
          {/* Pins */}
          {[-20, -12, -4, 4, 12, 20].map((px, i) => (
            <line key={i} x1={cx + px} y1={h / 2 + 8} x2={cx + px} y2={h / 2 + 22} stroke={c + "80"} strokeWidth={1.2} />
          ))}
          {/* Labels */}
          <text x={cx} y={15} fill="#888" fontSize="4" textAnchor="middle">유리-금속 봉착 직접 제조 대신</text>
          <text x={cx} y={h - 4} fill={c} fontSize="4" fontWeight="bold" textAnchor="middle">기밀 피드스루 구매 = ₩20K</text>
        </g>
      );
    default:
      return null;
  }
}

export default function BridgePrincipleDiagram({ bridgeId }: { bridgeId: string }) {
  const bridge = BRIDGES.find(b => b.id === bridgeId);
  if (!bridge) return null;

  const svgW = 140;
  const svgH = 70;

  return (
    <figure className="my-4 float-right ml-4" style={{ width: "180px" }}>
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" xmlns="http://www.w3.org/2000/svg">
        <rect width={svgW} height={svgH} fill="#111116" rx="6" stroke={bridge.color + "30"} strokeWidth="0.5" />
        <BridgeIllustration bridge={bridge} w={svgW} h={svgH} />
      </svg>
      <figcaption className="text-[10px] text-stone-500 text-center mt-1">{bridge.principle.substring(0, 50)}...</figcaption>
    </figure>
  );
}

// Full-width version showing all bridges
export function BridgePrincipleOverview() {
  const [active, setActive] = useState(0);
  const svgW = 560;
  const svgH = 100;
  const cardW = 130;
  const cardH = 65;

  return (
    <figure className="my-8">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {BRIDGES.map((b, i) => {
          const isActive = active === i;
          return (
            <div
              key={b.id}
              className="flex-shrink-0 cursor-pointer rounded-lg border transition-all p-1"
              style={{
                borderColor: isActive ? b.color + "60" : b.color + "20",
                backgroundColor: isActive ? b.color + "10" : "transparent",
                width: "140px",
              }}
              onMouseEnter={() => setActive(i)}
            >
              <svg viewBox={`0 0 ${cardW} ${cardH}`} className="w-full" xmlns="http://www.w3.org/2000/svg">
                <rect width={cardW} height={cardH} fill="#111116" rx="4" stroke={isActive ? b.color + "40" : "#ffffff08"} strokeWidth="0.5" />
                <BridgeIllustration bridge={b} w={cardW} h={cardH} />
              </svg>
              <div className="text-[10px] font-medium text-center mt-1" style={{ color: b.color }}>{b.label}</div>
              <div className="text-[9px] text-stone-500 text-center">{b.source}</div>
            </div>
          );
        })}
      </div>
      <div className="rounded-lg border p-3 mt-2 transition-all"
        style={{ borderColor: BRIDGES[active].color + "40", backgroundColor: BRIDGES[active].color + "10" }}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium" style={{ color: BRIDGES[active].color }}>{BRIDGES[active].label}</span>
          <span className="text-[10px] text-stone-500">우회: {BRIDGES[active].bottleneck}</span>
        </div>
        <p className="text-xs text-stone-400">{BRIDGES[active].principle}</p>
      </div>
    </figure>
  );
}
