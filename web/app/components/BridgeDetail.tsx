"use client";

import { useState } from "react";

type BridgeData = {
  id: string;
  label: string;
  bottleneck: string;
  sourceField: string;
  color: string;
  cost: string;
  principle: string;
  projectUse: string;
  evidence: string;
};

const BRIDGE_COLORS: Record<string, string> = {
  sealing: "#6BA368",
  electrode: "#ef8f44",
  vacuum: "#7B9EB8",
  pin: "#B8A9C9",
  supplement: "#D4A853",
  equipment: "#C17B5E",
};

function BridgeIllustration({ id, w, h }: { id: string; w: number; h: number }) {
  const cx = w / 2;
  const cy = h / 2;

  switch (id) {
    case "frit":
      return (
        <g>
          <rect x={10} y={10} width={w - 20} height={12} rx={2} fill="#7B9EB830" stroke="#7B9EB870" strokeWidth={0.8} />
          <rect x={10} y={24} width={w - 20} height={6} rx={1} fill="#D4A85345" stroke="#D4A853" strokeWidth={0.8} />
          <text x={cx} y={20} fill="#7B9EB8" fontSize="5" textAnchor="middle">유리</text>
          <text x={cx} y={29} fill="#D4A853" fontSize="4" fontWeight="bold" textAnchor="middle">프릿 450°C</text>
          <rect x={10} y={32} width={w - 20} height={12} rx={2} fill="#7B9EB830" stroke="#7B9EB870" strokeWidth={0.8} />
          {[20, 35, 50, 65, 80].map((px, i) => (
            <line key={i} x1={px} y1={8} x2={px} y2={46} stroke="#C17B5E70" strokeWidth={1.2} />
          ))}
          <text x={cx} y={h - 4} fill="#666" fontSize="4" textAnchor="middle">듀멧 와이어 매립</text>
        </g>
      );
    case "butyl":
      return (
        <g>
          <path d={`M 15 ${h - 12} L 15 15 Q 15 5 ${cx} 5 Q ${w - 15} 5 ${w - 15} 15 L ${w - 15} ${h - 12}`}
            fill="#7B9EB818" stroke="#7B9EB8" strokeWidth={1} />
          <rect x={12} y={h - 14} width={w - 24} height={5} rx={1} fill="#6BA36850" stroke="#6BA368" strokeWidth={0.8} />
          <rect x={10} y={h - 8} width={w - 20} height={4} rx={1} fill="#D4A85340" stroke="#D4A85380" strokeWidth={0.6} />
          <text x={cx} y={15} fill="#7B9EB8" fontSize="5" textAnchor="middle">유리 돔</text>
          <text x={cx} y={h - 11} fill="#6BA368" fontSize="3.5" textAnchor="middle">부틸</text>
          <text x={cx} y={h - 4} fill="#D4A853" fontSize="3.5" textAnchor="middle">폴리설파이드</text>
        </g>
      );
    case "preform":
      return (
        <g>
          <ellipse cx={cx} cy={cy - 5} rx={30} ry={8} fill="#D4A85330" stroke="#D4A853" strokeWidth={1} />
          <text x={cx} y={cy - 2} fill="#D4A853" fontSize="5" fontWeight="bold" textAnchor="middle">프리폼 링</text>
          <text x={cx} y={cy + 10} fill="#888" fontSize="4" textAnchor="middle">320°C에서 용융 → 기밀</text>
          <text x={cx} y={h - 4} fill="#666" fontSize="4" textAnchor="middle">분말 혼합 불필요</text>
        </g>
      );
    case "aao":
      return (
        <g>
          <rect x={10} y={h - 15} width={w - 20} height={8} rx={1} fill="#B8A9C930" stroke="#B8A9C960" strokeWidth={0.5} />
          {Array.from({ length: 10 }, (_, i) => {
            const nx = 15 + i * ((w - 30) / 9);
            return (
              <g key={i}>
                <rect x={nx - 1} y={12} width={2} height={h - 27} rx={0.5} fill="#ef8f4440" stroke="#ef8f4470" strokeWidth={0.4} />
                <circle cx={nx} cy={10} r={1.5} fill="#ef8f44" opacity={0.8} />
              </g>
            );
          })}
          <text x={cx} y={8} fill="#ef8f44" fontSize="5" fontWeight="bold" textAnchor="middle">Ni 나노팁</text>
          <text x={cx} y={h - 3} fill="#B8A9C9" fontSize="4" textAnchor="middle">Al 기판</text>
        </g>
      );
    case "mgo":
      return (
        <g>
          <rect x={15} y={20} width={w - 30} height={20} rx={2} fill="#ef8f4425" stroke="#ef8f44" strokeWidth={0.8} />
          <rect x={13} y={16} width={w - 26} height={5} rx={1} fill="#6BA36840" stroke="#6BA368" strokeWidth={0.8} />
          <text x={cx} y={20} fill="#6BA368" fontSize="4" fontWeight="bold" textAnchor="middle">MgO 코팅</text>
          <text x={cx} y={34} fill="#ef8f44" fontSize="5" textAnchor="middle">Ni 전극</text>
          <text x={cx} y={h - 8} fill="#888" fontSize="4" textAnchor="middle">γ ≈ 0.5</text>
          <text x={cx} y={h - 2} fill="#888" fontSize="3" textAnchor="middle">전압 저감 + 스퍼터링 방호</text>
        </g>
      );
    case "micro":
      return (
        <g>
          <rect x={15} y={8} width={8} height={h - 16} rx={1} fill="#7B9EB840" stroke="#7B9EB8" strokeWidth={0.8} />
          <rect x={w - 23} y={8} width={8} height={h - 16} rx={1} fill="#7B9EB840" stroke="#7B9EB8" strokeWidth={0.8} />
          <text x={cx} y={cy - 3} fill="#7B9EB8" fontSize="6" fontWeight="bold" textAnchor="middle">0.5mm</text>
          <text x={cx} y={cy + 5} fill="#888" fontSize="4" textAnchor="middle">200 Torr</text>
          <text x={cx} y={h - 3} fill="#666" fontSize="3.5" textAnchor="middle">고압 → 진공 불필요</text>
        </g>
      );
    case "map":
      return (
        <g>
          <rect x={20} y={8} width={w - 40} height={h - 20} rx={3} fill="#7B9EB815" stroke="#7B9EB860" strokeWidth={0.8} />
          <line x1={5} y1={cy - 5} x2={20} y2={cy - 5} stroke="#6BA368" strokeWidth={1.5} />
          <polygon points={`18,${cy - 7} 23,${cy - 5} 18,${cy - 3}`} fill="#6BA368" />
          <text x={12} y={cy - 9} fill="#6BA368" fontSize="5" fontWeight="bold" textAnchor="middle">Ne</text>
          <line x1={w - 20} y1={cy + 5} x2={w - 5} y2={cy + 5} stroke="#ef444480" strokeWidth={1} />
          <text x={w - 12} y={cy + 1} fill="#ef4444" fontSize="4" textAnchor="middle" opacity={0.7}>Air</text>
          <text x={cx} y={h - 4} fill="#666" fontSize="3.5" textAnchor="middle">플러싱으로 공기 치환</text>
        </g>
      );
    case "penning":
      return (
        <g>
          <circle cx={cx - 12} cy={cy} r={10} fill="#6BA36820" stroke="#6BA368" strokeWidth={0.8} />
          <text x={cx - 12} y={cy + 2} fill="#6BA368" fontSize="6" fontWeight="bold" textAnchor="middle">Ne</text>
          <text x={cx + 3} y={cy + 2} fill="#888" fontSize="6" textAnchor="middle">+</text>
          <circle cx={cx + 18} cy={cy} r={7} fill="#7B9EB820" stroke="#7B9EB8" strokeWidth={0.8} />
          <text x={cx + 18} y={cy + 2} fill="#7B9EB8" fontSize="5" fontWeight="bold" textAnchor="middle">Ar</text>
          <text x={cx} y={h - 4} fill="#888" fontSize="3.5" textAnchor="middle">항복 전압 10-30% ↓</text>
        </g>
      );
    case "pirani":
      return (
        <g>
          <rect x={15} y={10} width={w - 30} height={h - 24} rx={4} fill="#B8A9C915" stroke="#B8A9C960" strokeWidth={0.8} />
          <line x1={25} y1={cy} x2={w - 25} y2={cy} stroke="#D4A853" strokeWidth={1.5} />
          <circle cx={cx} cy={cy} r={3} fill="#D4A853" />
          <text x={cx} y={18} fill="#B8A9C9" fontSize="5" textAnchor="middle">Arduino ADC</text>
          <text x={cx} y={h - 6} fill="#888" fontSize="4" textAnchor="middle">₩8.5K (상용 대비 95% ↓)</text>
        </g>
      );
    case "milspec":
      return (
        <g>
          <rect x={cx - 25} y={cy - 8} width={50} height={16} rx={3} fill="#B8A9C930" stroke="#B8A9C9" strokeWidth={1} />
          <text x={cx} y={cy + 2} fill="#B8A9C9" fontSize="5" fontWeight="bold" textAnchor="middle">TO-8</text>
          {[-15, -8, -1, 6, 13].map((px, i) => (
            <line key={i} x1={cx + px} y1={cy + 8} x2={cx + px} y2={cy + 20} stroke="#B8A9C970" strokeWidth={1} />
          ))}
          <text x={cx} y={h - 3} fill="#888" fontSize="3.5" textAnchor="middle">기밀 피드스루 구매</text>
        </g>
      );
    case "solgel":
      return (
        <g>
          <rect x={15} y={cy} width={w - 30} height={10} rx={2} fill="#6BA36830" stroke="#6BA36860" strokeWidth={0.6} />
          <rect x={13} y={cy - 4} width={w - 26} height={5} rx={1} fill="#D4A85340" stroke="#D4A853" strokeWidth={0.8} />
          <text x={cx} y={cy - 1} fill="#D4A853" fontSize="4" fontWeight="bold" textAnchor="middle">SiO₂ / MgO 코팅</text>
          <text x={cx} y={cy + 7} fill="#6BA368" fontSize="4" textAnchor="middle">유기 실링</text>
          {[25, 40, 55, 70].map((ax, i) => (
            <line key={i} x1={ax} y1={8} x2={ax} y2={cy - 6} stroke="#ef444440" strokeWidth={0.6} strokeDasharray="2 1" />
          ))}
          <text x={cx} y={14} fill="#ef4444" fontSize="3.5" textAnchor="middle" opacity={0.6}>투과 차단</text>
        </g>
      );
    case "pib":
      return (
        <g>
          <rect x={15} y={12} width={55} height={7} rx={2} fill="#D4A85340" stroke="#D4A85370" strokeWidth={0.5} />
          <text x={72} y={18} fill="#D4A853" fontSize="4">100일</text>
          <text x={15} y={10} fill="#D4A853" fontSize="4">부틸</text>
          <rect x={15} y={28} width={6} height={7} rx={2} fill="#6BA36850" stroke="#6BA368" strokeWidth={0.5} />
          <text x={23} y={34} fill="#6BA368" fontSize="4" fontWeight="bold">1000일+</text>
          <text x={15} y={26} fill="#6BA368" fontSize="4">PIB</text>
        </g>
      );
    case "tigetter":
      return (
        <g>
          <line x1={cx - 15} y1={12} x2={cx + 15} y2={12} stroke="#C17B5E" strokeWidth={2} />
          <text x={cx} y={10} fill="#C17B5E" fontSize="5" fontWeight="bold" textAnchor="middle">Ti</text>
          <circle cx={cx} cy={cy + 2} r={12} fill="#ef8f4410" stroke="#ef8f4440" strokeWidth={0.5} />
          <text x={cx} y={cy + 5} fill="#ef8f44" fontSize="4" textAnchor="middle" opacity={0.6}>O₂ 흡착</text>
          <text x={cx} y={h - 4} fill="#888" fontSize="3.5" textAnchor="middle">700°C+ 플래싱</text>
        </g>
      );
    case "kiln":
      return (
        <g>
          <rect x={10} y={12} width={w - 20} height={h - 24} rx={5} fill="#C17B5E15" stroke="#C17B5E60" strokeWidth={0.8} />
          <path d={`M 25 ${h - 14} L 25 22 Q 25 15 ${cx} 15 Q ${w - 25} 15 ${w - 25} 22 L ${w - 25} ${h - 14}`}
            fill="#ef8f4415" stroke="#ef8f4460" strokeWidth={0.8} />
          <text x={cx} y={cy} fill="#ef8f44" fontSize="5" fontWeight="bold" textAnchor="middle">SiC</text>
          <text x={cx} y={cy + 8} fill="#C17B5E" fontSize="4" textAnchor="middle">+ Arduino PID</text>
          <text x={cx} y={h - 5} fill="#888" fontSize="3.5" textAnchor="middle">₩71K, 자택</text>
        </g>
      );
    case "3dprint":
      return (
        <g>
          <text x={cx} y={cy - 2} fill="#ef8f44" fontSize="18" fontWeight="bold" textAnchor="middle" opacity={0.7}>8</text>
          <text x={cx} y={cy + 12} fill="#888" fontSize="4" textAnchor="middle">3D → 도금 → 용해</text>
          <text x={cx} y={h - 3} fill="#666" fontSize="3.5" textAnchor="middle">중공 Ni 전극</text>
        </g>
      );
    default:
      return <text x={cx} y={cy} fill="#666" fontSize="6" textAnchor="middle">{id}</text>;
  }
}

export default function BridgeDetail({ bridge }: { bridge: BridgeData }) {
  const [expanded, setExpanded] = useState(false);
  const c = bridge.color;
  const svgW = 100;
  const svgH = 55;

  return (
    <div
      className="rounded-xl border transition-all cursor-pointer"
      style={{
        borderColor: expanded ? c + "50" : c + "20",
        backgroundColor: expanded ? c + "08" : "transparent",
      }}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start gap-3 p-4">
        {/* Mini illustration */}
        <div className="flex-shrink-0" style={{ width: "100px" }}>
          <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" xmlns="http://www.w3.org/2000/svg">
            <rect width={svgW} height={svgH} fill="#111116" rx="6" stroke={c + "25"} strokeWidth="0.5" />
            <BridgeIllustration id={bridge.id} w={svgW} h={svgH} />
          </svg>
        </div>

        {/* Title + brief */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-bold" style={{ color: c }}>{bridge.label}</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: c + "15", color: c + "cc" }}>
              {bridge.cost}
            </span>
          </div>
          <p className="text-xs text-stone-400 leading-relaxed">{bridge.principle}</p>
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-4 pb-4 space-y-2 border-t" style={{ borderColor: c + "15" }}>
          <div className="pt-3">
            <div className="text-[10px] text-stone-500 mb-0.5">출처 분야</div>
            <div className="text-xs text-stone-300">{bridge.sourceField}</div>
          </div>
          <div>
            <div className="text-[10px] text-stone-500 mb-0.5">이 프로젝트에서의 사용</div>
            <div className="text-xs text-stone-300">{bridge.projectUse}</div>
          </div>
          <div>
            <div className="text-[10px] text-stone-500 mb-0.5">근거</div>
            <div className="text-xs text-stone-400">{bridge.evidence}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export { type BridgeData, BRIDGE_COLORS, BridgeIllustration };
