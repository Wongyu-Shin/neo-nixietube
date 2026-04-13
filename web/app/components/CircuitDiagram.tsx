"use client";

import { useState } from "react";

const COMPONENTS = [
  {
    id: "adapter",
    label: "12V 어댑터",
    detail: "12V DC 전원 어댑터. 2A 이상 권장. 벽면 콘센트 → 안전한 저전압 DC 변환. 부스트 컨버터의 입력 전원.",
    color: "#7B9EB8",
  },
  {
    id: "boost",
    label: "부스트 컨버터",
    sublabel: "(300–500V)",
    detail: "NCH8200HV 또는 유사 모듈. 12V DC → 300–500V DC 가변 승압. 가변저항(트리머)으로 출력 전압 조절. 처음엔 300V부터 서서히 올릴 것.",
    color: "#B8A9C9",
  },
  {
    id: "bleed",
    label: "블리드 저항 1MΩ",
    detail: "출력 캐패시터와 병렬 연결. 전원 OFF 시 캐패시터 자동 방전 (약 5초). 감전 방지 핵심 안전 부품. 반드시 장착할 것.",
    color: "#D4A853",
  },
  {
    id: "ballast",
    label: "양극 저항 15–33kΩ",
    detail: "양극 직렬 저항. 2W 정격 필수. 전류 제한 2–5mA. I = (V − Vb) / R. 예: (170V − 130V) / 15kΩ ≈ 2.7mA. 이 저항 없이는 관이 파손될 수 있음.",
    color: "#D4A853",
  },
  {
    id: "nixie",
    label: "닉시관",
    sublabel: "(점등 테스트)",
    detail: "양극(+): 메쉬 전극. 음극(−): 숫자 형상 전극. 네온 가스 글로우 방전으로 발광. 정상 점등 시 따뜻한 오렌지 빛.",
    color: "#ef8f44",
  },
  {
    id: "ground",
    label: "GND (공통 접지)",
    detail: "모든 회로의 공통 리턴 경로. 12V 입력 GND와 고전압 GND가 동일. 접지 연결 확인 필수.",
    color: "#6BA368",
  },
  {
    id: "safety",
    label: "⚠️ 고전압 영역",
    detail: "300–500V DC는 치명적. 원핸드 룰: 한 손만 사용하여 감전 시 심장 경유 방지. 절연 장갑 필수 착용. 전원 OFF 후 블리드 저항 방전 확인(5초) 후 접촉.",
    color: "#ef4444",
  },
];

export default function CircuitDiagram() {
  const [hovered, setHovered] = useState<string | null>(null);
  const active = COMPONENTS.find((c) => c.id === hovered);

  const svgW = 560;
  const svgH = 300;

  const hover = (id: string) => ({
    onMouseEnter: () => setHovered(id),
    onMouseLeave: () => setHovered(null),
    style: { cursor: "pointer" as const },
  });

  const isActive = (id: string) => hovered === id;

  return (
    <figure className="my-8">
      <svg
        viewBox={`0 0 ${svgW} ${svgH}`}
        className="w-full max-w-2xl mx-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="circuitGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
          </filter>
          <filter id="circuitGlowSm" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
          </filter>
        </defs>

        {/* Background */}
        <rect width={svgW} height={svgH} fill="#111116" rx="8" stroke="#ffffff10" strokeWidth="0.5" />

        {/* Title */}
        <text x={svgW / 2} y={18} fill="#e8e8e8" fontSize="11" fontWeight="bold" textAnchor="middle">
          점등 테스트 회로도 — Path 2 (상온 봉착)
        </text>

        {/* ── HIGH VOLTAGE DANGER ZONE ── */}
        <g {...hover("safety")}>
          <rect
            x={175} y={30} width={365} height={215}
            rx={6} fill="none"
            stroke={isActive("safety") ? "#ef4444" : "#ef444460"}
            strokeWidth={isActive("safety") ? 2 : 1.2}
            strokeDasharray="8 4"
          />
          <text x={360} y={44} fill={isActive("safety") ? "#ef4444" : "#ef444490"} fontSize="8" fontWeight="bold" textAnchor="middle">
            ⚠️ 고전압 영역 (300–500V DC)
          </text>
          {/* Safety annotations */}
          <text x={540} y={80} fill="#ef444470" fontSize="6.5" textAnchor="end" fontStyle="italic">
            원핸드 룰 준수
          </text>
          <text x={540} y={92} fill="#ef444470" fontSize="6.5" textAnchor="end" fontStyle="italic">
            절연 장갑 필수
          </text>
        </g>

        {/* ══════════════════════════════════════════ */}
        {/* ── WIRING (behind components) ────────── */}
        {/* ══════════════════════════════════════════ */}

        {/* Adapter → Boost converter: +12V line (top) */}
        <line x1={130} y1={100} x2={195} y2={100} stroke="#7B9EB860" strokeWidth={1.5} />
        {/* Adapter → Boost converter: GND line (bottom) */}
        <line x1={130} y1={160} x2={195} y2={160} stroke="#6BA36860" strokeWidth={1.5} />

        {/* Boost output +HV line (top) going right */}
        <line x1={295} y1={100} x2={330} y2={100} stroke="#B8A9C960" strokeWidth={1.5} />
        {/* Boost output GND line (bottom) going right */}
        <line x1={295} y1={160} x2={330} y2={160} stroke="#6BA36860" strokeWidth={1.5} />

        {/* Bleed resistor vertical connections (parallel with output cap) */}
        <line x1={345} y1={100} x2={345} y2={107} stroke="#D4A85360" strokeWidth={1.2} />
        <line x1={345} y1={153} x2={345} y2={160} stroke="#D4A85360" strokeWidth={1.2} />

        {/* HV line continues from bleed area to ballast resistor */}
        <line x1={345} y1={100} x2={400} y2={100} stroke="#D4A85340" strokeWidth={1.5} />

        {/* Ballast resistor vertical top to wire */}
        <line x1={415} y1={100} x2={415} y2={107} stroke="#D4A85360" strokeWidth={1.2} />
        {/* Ballast resistor bottom to nixie anode */}
        <line x1={415} y1={153} x2={415} y2={165} stroke="#D4A85360" strokeWidth={1.2} />

        {/* Wire from ballast to nixie (anode side) */}
        <line x1={415} y1={165} x2={470} y2={165} stroke="#ef8f4450" strokeWidth={1.5} />

        {/* GND line continues from bleed area rightward under nixie */}
        <line x1={345} y1={160} x2={345} y2={220} stroke="#6BA36840" strokeWidth={1.2} />
        <line x1={345} y1={220} x2={500} y2={220} stroke="#6BA36840" strokeWidth={1.2} />
        {/* GND up to nixie cathode */}
        <line x1={500} y1={220} x2={500} y2={200} stroke="#6BA36840" strokeWidth={1.2} />

        {/* ══════════════════════════════════════════ */}
        {/* ── 1. 12V DC ADAPTER ─────────────────── */}
        {/* ══════════════════════════════════════════ */}
        <g {...hover("adapter")}>
          <rect
            x={30} y={80} width={100} height={100}
            rx={6}
            fill={isActive("adapter") ? "#7B9EB825" : "#7B9EB815"}
            stroke={isActive("adapter") ? "#7B9EB8" : "#7B9EB850"}
            strokeWidth={isActive("adapter") ? 1.5 : 0.8}
          />
          {/* Plug icon */}
          <rect x={50} y={106} width={24} height={32} rx={3} fill="#7B9EB830" stroke="#7B9EB870" strokeWidth={0.8} />
          <line x1={58} y1={108} x2={58} y2={116} stroke="#7B9EB8" strokeWidth={2} strokeLinecap="round" />
          <line x1={66} y1={108} x2={66} y2={116} stroke="#7B9EB8" strokeWidth={2} strokeLinecap="round" />
          <text x={62} y={132} fill="#7B9EB8" fontSize="7" textAnchor="middle" fontWeight="bold">DC</text>
          {/* Output wires */}
          <line x1={74} y1={115} x2={100} y2={115} stroke="#7B9EB870" strokeWidth={1} />
          <text x={92} y={112} fill="#ef444490" fontSize="5.5">+12V</text>
          <line x1={74} y1={130} x2={100} y2={130} stroke="#6BA36870" strokeWidth={1} />
          <text x={92} y={142} fill="#6BA36890" fontSize="5.5">GND</text>
          {/* Label */}
          <text x={80} y={95} fill={isActive("adapter") ? "#7B9EB8" : "#7B9EB8bb"} fontSize="8" fontWeight="bold" textAnchor="middle">
            12V 어댑터
          </text>
          <text x={80} y={170} fill="#7B9EB870" fontSize="6" textAnchor="middle">AC 220V → DC 12V</text>
        </g>

        {/* ══════════════════════════════════════════ */}
        {/* ── 2. BOOST CONVERTER ────────────────── */}
        {/* ══════════════════════════════════════════ */}
        <g {...hover("boost")}>
          <rect
            x={195} y={75} width={100} height={110}
            rx={6}
            fill={isActive("boost") ? "#B8A9C925" : "#B8A9C915"}
            stroke={isActive("boost") ? "#B8A9C9" : "#B8A9C950"}
            strokeWidth={isActive("boost") ? 1.5 : 0.8}
          />
          {/* Module shape */}
          <rect x={215} y={105} width={60} height={40} rx={3} fill="#B8A9C920" stroke="#B8A9C960" strokeWidth={0.8} />
          {/* Step-up arrow */}
          <text x={245} y={120} fill="#B8A9C9" fontSize="7" textAnchor="middle" fontWeight="bold">12V</text>
          <line x1={235} y1={125} x2={255} y2={125} stroke="#B8A9C980" strokeWidth={0.8} markerEnd="url(#arrowPurple)" />
          <text x={245} y={138} fill="#B8A9C9" fontSize="8" textAnchor="middle" fontWeight="bold">500V</text>
          {/* Trimmer */}
          <circle cx={260} cy={150} r={4} fill="none" stroke="#B8A9C960" strokeWidth={0.8} />
          <line x1={258} y1={148} x2={262} y2={152} stroke="#B8A9C9" strokeWidth={0.8} />
          <text x={268} y={153} fill="#B8A9C960" fontSize="5">TRIM</text>
          {/* Input / Output labels */}
          <text x={198} y={100} fill="#B8A9C970" fontSize="5.5">IN</text>
          <text x={281} y={100} fill="#B8A9C970" fontSize="5.5">OUT</text>
          {/* Label */}
          <text x={245} y={90} fill={isActive("boost") ? "#B8A9C9" : "#B8A9C9bb"} fontSize="7.5" fontWeight="bold" textAnchor="middle">
            부스트 컨버터
          </text>
          <text x={245} y={178} fill="#B8A9C970" fontSize="6" textAnchor="middle">NCH8200HV</text>
        </g>

        {/* Arrow marker for boost */}
        <defs>
          <marker id="arrowPurple" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
            <path d="M 0 0 L 6 3 L 0 6 Z" fill="#B8A9C980" />
          </marker>
        </defs>

        {/* ══════════════════════════════════════════ */}
        {/* ── 3. BLEED RESISTOR ─────────────────── */}
        {/* ══════════════════════════════════════════ */}
        <g {...hover("bleed")}>
          {/* Resistor body (vertical zigzag between HV+ and GND) */}
          <rect
            x={328} y={105} width={34} height={50}
            rx={4}
            fill={isActive("bleed") ? "#D4A85325" : "#D4A85315"}
            stroke={isActive("bleed") ? "#D4A853" : "#D4A85350"}
            strokeWidth={isActive("bleed") ? 1.5 : 0.8}
          />
          {/* Zigzag resistor symbol */}
          <path
            d="M 345 110 L 340 116 L 350 122 L 340 128 L 350 134 L 340 140 L 350 146 L 345 150"
            fill="none"
            stroke={isActive("bleed") ? "#D4A853" : "#D4A853aa"}
            strokeWidth={1.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Label */}
          <text x={345} y={64} fill={isActive("bleed") ? "#D4A853" : "#D4A853bb"} fontSize="6.5" fontWeight="bold" textAnchor="middle">
            블리드 저항
          </text>
          <text x={345} y={73} fill="#D4A85390" fontSize="6" textAnchor="middle">1MΩ</text>
          {/* Discharge time annotation */}
          <text x={313} y={133} fill="#D4A85370" fontSize="5" textAnchor="end" transform="rotate(-90 313 133)">
            방전 5초
          </text>
          {/* Parallel symbol */}
          <text x={345} y={167} fill="#D4A85360" fontSize="5" textAnchor="middle">∥ 출력 캡</text>
        </g>

        {/* ══════════════════════════════════════════ */}
        {/* ── 4. BALLAST RESISTOR ───────────────── */}
        {/* ══════════════════════════════════════════ */}
        <g {...hover("ballast")}>
          <rect
            x={398} y={105} width={34} height={50}
            rx={4}
            fill={isActive("ballast") ? "#D4A85325" : "#D4A85315"}
            stroke={isActive("ballast") ? "#D4A853" : "#D4A85350"}
            strokeWidth={isActive("ballast") ? 1.5 : 0.8}
          />
          {/* Zigzag resistor symbol */}
          <path
            d="M 415 110 L 410 116 L 420 122 L 410 128 L 420 134 L 410 140 L 420 146 L 415 150"
            fill="none"
            stroke={isActive("ballast") ? "#D4A853" : "#D4A853aa"}
            strokeWidth={1.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Label */}
          <text x={415} y={64} fill={isActive("ballast") ? "#D4A853" : "#D4A853bb"} fontSize="6.5" fontWeight="bold" textAnchor="middle">
            양극 저항
          </text>
          <text x={415} y={73} fill="#D4A85390" fontSize="6" textAnchor="middle">15–33kΩ 2W</text>
          {/* Formula */}
          <text x={415} y={167} fill="#D4A85360" fontSize="5" textAnchor="middle">I=(V−Vb)/R</text>
          {/* Series annotation */}
          <text x={440} y={133} fill="#D4A85370" fontSize="5" textAnchor="start" transform="rotate(90 440 133)">
            직렬
          </text>
        </g>

        {/* ══════════════════════════════════════════ */}
        {/* ── 5. NIXIE TUBE ─────────────────────── */}
        {/* ══════════════════════════════════════════ */}
        <g {...hover("nixie")}>
          {/* Tube envelope */}
          <ellipse
            cx={485} cy={150} rx={40} ry={55}
            fill={isActive("nixie") ? "#ef8f4418" : "#ef8f4410"}
            stroke={isActive("nixie") ? "#ef8f44" : "#ef8f4460"}
            strokeWidth={isActive("nixie") ? 1.5 : 1}
          />
          {/* Inner glow */}
          <ellipse cx={485} cy={150} rx={28} ry={40}
            fill="#ef8f4410" filter="url(#circuitGlow)" />
          {/* Digit display - glowing "8" */}
          <text x={485} y={158} fill="#ef8f44" fontSize="32" fontWeight="bold" textAnchor="middle" opacity={0.9}>
            8
          </text>
          <text x={485} y={158} fill="#ef8f44" fontSize="32" fontWeight="bold" textAnchor="middle" opacity={0.5} filter="url(#circuitGlowSm)">
            8
          </text>
          {/* Anode (+) marker */}
          <text x={470} y={165} fill="#ef8f44" fontSize="7" textAnchor="middle" fontWeight="bold">+</text>
          <text x={470} y={173} fill="#ef8f4480" fontSize="5" textAnchor="middle">양극</text>
          {/* Cathode (-) marker */}
          <text x={500} y={200} fill="#6BA368" fontSize="7" textAnchor="middle" fontWeight="bold">−</text>
          <text x={500} y={208} fill="#6BA36880" fontSize="5" textAnchor="middle">음극</text>
          {/* Anode wire in */}
          <line x1={470} y1={165} x2={460} y2={165} stroke="#ef8f4450" strokeWidth={1} />
          {/* Label */}
          <text x={485} y={108} fill={isActive("nixie") ? "#ef8f44" : "#ef8f44bb"} fontSize="8" fontWeight="bold" textAnchor="middle">
            닉시관
          </text>
          <text x={485} y={118} fill="#ef8f4470" fontSize="6" textAnchor="middle">
            점등 테스트
          </text>
        </g>

        {/* ══════════════════════════════════════════ */}
        {/* ── 6. GROUND ─────────────────────────── */}
        {/* ══════════════════════════════════════════ */}
        <g {...hover("ground")}>
          {/* Ground symbol */}
          <line x1={420} y1={238} x2={420} y2={252} stroke={isActive("ground") ? "#6BA368" : "#6BA36880"} strokeWidth={1.5} />
          <line x1={410} y1={252} x2={430} y2={252} stroke={isActive("ground") ? "#6BA368" : "#6BA36880"} strokeWidth={1.5} />
          <line x1={413} y1={256} x2={427} y2={256} stroke={isActive("ground") ? "#6BA368" : "#6BA36880"} strokeWidth={1.2} />
          <line x1={416} y1={260} x2={424} y2={260} stroke={isActive("ground") ? "#6BA368" : "#6BA36880"} strokeWidth={0.8} />
          {/* GND line from nixie bottom to ground symbol */}
          <line x1={345} y1={220} x2={420} y2={220} stroke="#6BA36840" strokeWidth={1.2} />
          <line x1={420} y1={220} x2={420} y2={238} stroke="#6BA36850" strokeWidth={1.2} />
          {/* Label */}
          <text x={420} y={273} fill={isActive("ground") ? "#6BA368" : "#6BA36890"} fontSize="7" fontWeight="bold" textAnchor="middle">
            GND
          </text>
        </g>

        {/* ══════════════════════════════════════════ */}
        {/* ── FLOW ARROWS on wires ──────────────── */}
        {/* ══════════════════════════════════════════ */}
        {/* 12V → Boost */}
        <polygon points="180,97 186,100 180,103" fill="#7B9EB870" />
        {/* Boost → HV out */}
        <polygon points="316,97 322,100 316,103" fill="#B8A9C970" />
        {/* HV → Ballast */}
        <polygon points="390,97 396,100 390,103" fill="#D4A85370" />

        {/* ══════════════════════════════════════════ */}
        {/* ── CURRENT FLOW ANNOTATION ───────────── */}
        {/* ══════════════════════════════════════════ */}
        <text x={svgW / 2} y={svgH - 8} fill="#666" fontSize="7" textAnchor="middle">
          전류 경로: 어댑터 → 부스트 컨버터 → 양극 저항 → 닉시관 → GND | 블리드 저항: 출력 캡 병렬
        </text>

      </svg>

      {/* Info panel */}
      {active ? (
        <div
          className="max-w-2xl mx-auto mt-2 rounded-lg border p-3 transition-all duration-200"
          style={{
            borderColor: active.color + "55",
            backgroundColor: active.color + "18",
          }}
        >
          <div className="flex items-center gap-2">
            <span
              className="px-2 py-0.5 rounded text-[10px] font-bold"
              style={{ backgroundColor: active.color + "30", color: active.color }}
            >
              {active.label}
            </span>
            {active.sublabel && (
              <span className="text-xs" style={{ color: active.color + "90" }}>
                {active.sublabel}
              </span>
            )}
          </div>
          <p className="text-xs text-stone-400 mt-1.5 leading-relaxed">{active.detail}</p>
        </div>
      ) : (
        <figcaption className="text-center text-stone-500 text-xs mt-2">
          각 부품을 호버하여 상세 정보 확인. 빨간 점선 = 고전압 위험 구역.
        </figcaption>
      )}
    </figure>
  );
}
