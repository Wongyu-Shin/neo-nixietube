"use client";

import { useState } from "react";

const PARTS = [
  {
    id: "sol",
    label: "졸 용기",
    detail: "마그네슘 아세테이트 4수화물 5g + 에탄올 50mL + 옥살산 pH 5. 30분 교반 후 사용.",
    color: "#6BA368",
  },
  {
    id: "electrode",
    label: "전극",
    detail: "니켈 숫자 전극 (AAO 또는 벌크). 졸에 3초 침지 → 1mm/s 속도로 인상.",
    color: "#ef8f44",
  },
  {
    id: "pull",
    label: "인상 속도 가이드",
    detail: "인상 속도가 코팅 두께를 결정. 1mm/s → ~100nm 두께. 빠르면 두껍고 불균일.",
    color: "#D4A853",
  },
  {
    id: "dry",
    label: "건조 대기",
    detail: "각 코팅 사이 5분 건조. 3회 반복 딥코팅.",
    color: "#7B9EB8",
  },
  {
    id: "anneal",
    label: "미니가마 어닐링",
    detail: "400°C 30분 어닐링. 유기물 완전 제거 → 결정질 MgO. Arduino PID로 온도 제어.",
    color: "#C17B5E",
  },
];

export default function DipCoatingSetup() {
  const [hovered, setHovered] = useState<string | null>(null);
  const activePart = PARTS.find((p) => p.id === hovered);

  const svgW = 520;
  const svgH = 300;

  const isActive = (id: string) => hovered === id;

  return (
    <figure className="my-8">
      <svg
        viewBox={`0 0 ${svgW} ${svgH}`}
        className="w-full max-w-2xl mx-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width={svgW} height={svgH} fill="#111116" rx="8" stroke="#ffffff10" strokeWidth="0.5" />

        <text x={svgW / 2} y={18} fill="#e8e8e8" fontSize="10" fontWeight="bold" textAnchor="middle">
          MgO 졸-겔 딥코팅 공정 셋업
        </text>

        {/* ===== LEFT: Dip Coating Station ===== */}

        {/* Sol container (beaker) */}
        <g
          onMouseEnter={() => setHovered("sol")}
          onMouseLeave={() => setHovered(null)}
          style={{ cursor: "pointer" }}
        >
          {/* Beaker body */}
          <path
            d="M 45 120 L 45 210 Q 45 225 60 225 L 140 225 Q 155 225 155 210 L 155 120"
            fill={isActive("sol") ? "#6BA36830" : "#6BA36818"}
            stroke={isActive("sol") ? "#6BA368" : "#6BA36870"}
            strokeWidth={isActive("sol") ? 1.5 : 1}
          />
          {/* Sol liquid fill */}
          <path
            d="M 47 140 L 47 210 Q 47 223 60 223 L 140 223 Q 153 223 153 210 L 153 140 Z"
            fill="#6BA36825"
          />
          {/* Liquid surface with meniscus */}
          <path
            d="M 47 140 Q 100 135 153 140"
            fill="none"
            stroke="#6BA36880"
            strokeWidth={0.8}
          />
          {/* Beaker spout */}
          <path
            d="M 45 120 L 38 115"
            fill="none"
            stroke={isActive("sol") ? "#6BA368" : "#6BA36870"}
            strokeWidth={1}
          />
          {/* Graduation marks */}
          {[155, 170, 185, 200].map((y, i) => (
            <line key={i} x1={48} y1={y} x2={55} y2={y} stroke="#6BA36845" strokeWidth={0.5} />
          ))}
          <text x={100} y={190} fill="#6BA368" fontSize="6" textAnchor="middle" opacity={0.9}>
            MgO 졸
          </text>
          <text x={100} y={200} fill="#6BA368" fontSize="4.5" textAnchor="middle" opacity={0.6}>
            Mg(OAc)₂ + EtOH
          </text>
          <text x={100} y={240} fill="#6BA368" fontSize="7" textAnchor="middle" opacity={0.8}>
            졸 용기
          </text>
        </g>

        {/* Electrode being dipped */}
        <g
          onMouseEnter={() => setHovered("electrode")}
          onMouseLeave={() => setHovered(null)}
          style={{ cursor: "pointer" }}
        >
          {/* Electrode body — vertical rectangle dipped in sol */}
          <rect
            x={92} y={55} width={16} height={100}
            rx={1}
            fill={isActive("electrode") ? "#ef8f4435" : "#ef8f4420"}
            stroke={isActive("electrode") ? "#ef8f44" : "#ef8f4480"}
            strokeWidth={isActive("electrode") ? 1.5 : 0.8}
          />
          {/* Digit pattern etched on electrode */}
          <text x={100} y={95} fill="#ef8f44" fontSize="14" fontWeight="bold" textAnchor="middle" opacity={0.4}>
            5
          </text>
          {/* Clip/holder at top */}
          <rect
            x={88} y={48} width={24} height={10}
            rx={2}
            fill="#ef8f4418"
            stroke="#ef8f4460"
            strokeWidth={0.6}
          />
          {/* Thin coating layer visible on electrode */}
          <line x1={92} y1={110} x2={92} y2={140} stroke="#6BA36890" strokeWidth={1.5} />
          <line x1={108} y1={110} x2={108} y2={140} stroke="#6BA36890" strokeWidth={1.5} />
          <text x={100} y={43} fill="#ef8f44" fontSize="6" textAnchor="middle" opacity={0.8}>
            Ni 전극
          </text>
        </g>

        {/* Pull-up speed arrow */}
        <g
          onMouseEnter={() => setHovered("pull")}
          onMouseLeave={() => setHovered(null)}
          style={{ cursor: "pointer" }}
        >
          {/* Vertical arrow pointing up */}
          <line
            x1={130} y1={130} x2={130} y2={60}
            stroke={isActive("pull") ? "#D4A853" : "#D4A85380"}
            strokeWidth={isActive("pull") ? 1.8 : 1.2}
            markerEnd="url(#arrowUp)"
          />
          {/* Speed label */}
          <rect
            x={135} y={78} width={38} height={16}
            rx={3}
            fill={isActive("pull") ? "#D4A85325" : "#D4A85312"}
            stroke={isActive("pull") ? "#D4A853" : "#D4A85350"}
            strokeWidth={0.6}
          />
          <text x={154} y={88} fill="#D4A853" fontSize="7" fontWeight="bold" textAnchor="middle">
            1mm/s
          </text>
          <text x={154} y={100} fill="#D4A853" fontSize="4.5" textAnchor="middle" opacity={0.6}>
            인상 속도
          </text>

          {/* Arrow marker definition */}
          <defs>
            <marker id="arrowUp" markerWidth="6" markerHeight="6" refX="3" refY="6" orient="auto">
              <path d="M 0 6 L 3 0 L 6 6" fill={isActive("pull") ? "#D4A853" : "#D4A85380"} />
            </marker>
          </defs>
        </g>

        {/* ===== CENTER: 3-cycle loop ===== */}
        <g>
          {/* Loop label */}
          <text x={280} y={38} fill="#e8e8e8" fontSize="8" fontWeight="bold" textAnchor="middle">
            3회 반복 공정
          </text>

          {/* Cycle flow: dip → pull → dry → repeat */}
          {/* Step 1: Dip */}
          <rect x={210} y={48} width={46} height={22} rx={4}
            fill="#6BA36820" stroke="#6BA36860" strokeWidth={0.7} />
          <text x={233} y={57} fill="#6BA368" fontSize="6" fontWeight="bold" textAnchor="middle">침지</text>
          <text x={233} y={65} fill="#6BA368" fontSize="4" textAnchor="middle" opacity={0.6}>3초</text>

          {/* Arrow 1→2 */}
          <line x1={256} y1={59} x2={268} y2={59} stroke="#ffffff30" strokeWidth={0.7} markerEnd="url(#arrowSmall)" />

          {/* Step 2: Pull */}
          <rect x={268} y={48} width={46} height={22} rx={4}
            fill="#D4A85320" stroke="#D4A85360" strokeWidth={0.7} />
          <text x={291} y={57} fill="#D4A853" fontSize="6" fontWeight="bold" textAnchor="middle">인상</text>
          <text x={291} y={65} fill="#D4A853" fontSize="4" textAnchor="middle" opacity={0.6}>1mm/s</text>

          {/* Arrow 2→3 */}
          <line x1={314} y1={59} x2={326} y2={59} stroke="#ffffff30" strokeWidth={0.7} markerEnd="url(#arrowSmall)" />

          {/* Step 3: Dry */}
          <rect x={326} y={48} width={46} height={22} rx={4}
            fill="#7B9EB820" stroke="#7B9EB860" strokeWidth={0.7} />
          <text x={349} y={57} fill="#7B9EB8" fontSize="6" fontWeight="bold" textAnchor="middle">건조</text>
          <text x={349} y={65} fill="#7B9EB8" fontSize="4" textAnchor="middle" opacity={0.6}>5분</text>

          {/* Repeat loop arrow back */}
          <path
            d="M 349 70 L 349 80 Q 349 84 345 84 L 237 84 Q 233 84 233 80 L 233 72"
            fill="none" stroke="#ffffff25" strokeWidth={0.7}
            markerEnd="url(#arrowSmall)"
          />
          <text x={291} y={90} fill="#ffffff50" fontSize="5" textAnchor="middle">×3 반복</text>

          {/* Arrow small marker */}
          <defs>
            <marker id="arrowSmall" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
              <path d="M 0 0 L 5 2.5 L 0 5" fill="#ffffff40" />
            </marker>
          </defs>

          {/* Final arrow down to anneal */}
          <line x1={291} y1={92} x2={291} y2={108} stroke="#ffffff30" strokeWidth={0.7} markerEnd="url(#arrowSmall)" />
          <text x={300} y={103} fill="#ffffff40" fontSize="4.5">완료 후</text>
        </g>

        {/* ===== Dry station ===== */}
        <g
          onMouseEnter={() => setHovered("dry")}
          onMouseLeave={() => setHovered(null)}
          style={{ cursor: "pointer" }}
        >
          {/* Fan / air flow symbol */}
          <rect x={220} y={110} width={60} height={50} rx={6}
            fill={isActive("dry") ? "#7B9EB825" : "#7B9EB812"}
            stroke={isActive("dry") ? "#7B9EB8" : "#7B9EB850"}
            strokeWidth={isActive("dry") ? 1.5 : 0.8}
          />
          {/* Fan blades (simple propeller) */}
          <circle cx={250} cy={130} r={12} fill="none"
            stroke={isActive("dry") ? "#7B9EB8" : "#7B9EB860"} strokeWidth={0.6} />
          <path d="M 250 118 Q 256 125 250 130 Q 244 125 250 118" fill="#7B9EB840" />
          <path d="M 250 142 Q 244 135 250 130 Q 256 135 250 142" fill="#7B9EB840" />
          <path d="M 238 130 Q 245 124 250 130 Q 245 136 238 130" fill="#7B9EB840" />
          <path d="M 262 130 Q 255 136 250 130 Q 255 124 262 130" fill="#7B9EB840" />
          <circle cx={250} cy={130} r={2} fill="#7B9EB860" />

          {/* Air flow lines */}
          {[0, 1, 2].map((i) => (
            <path
              key={i}
              d={`M ${265 + i * 5} ${125 + i * 3} Q ${272 + i * 5} ${128 + i * 2} ${265 + i * 5} ${133 + i * 3}`}
              fill="none"
              stroke="#7B9EB840"
              strokeWidth={0.5}
            />
          ))}

          <text x={250} y={168} fill="#7B9EB8" fontSize="6.5" textAnchor="middle" opacity={0.8}>
            건조 대기
          </text>
          <text x={250} y={177} fill="#7B9EB8" fontSize="4.5" textAnchor="middle" opacity={0.5}>
            5분 / 회
          </text>
        </g>

        {/* ===== Anneal station (kiln) ===== */}
        <g
          onMouseEnter={() => setHovered("anneal")}
          onMouseLeave={() => setHovered(null)}
          style={{ cursor: "pointer" }}
        >
          {/* Kiln body */}
          <path
            d="M 320 160 L 320 120 Q 320 108 340 108 L 380 108 Q 400 108 400 120 L 400 160"
            fill={isActive("anneal") ? "#C17B5E28" : "#C17B5E15"}
            stroke={isActive("anneal") ? "#C17B5E" : "#C17B5E70"}
            strokeWidth={isActive("anneal") ? 1.5 : 0.8}
          />
          {/* Kiln base */}
          <rect x={315} y={160} width={90} height={8} rx={2}
            fill="#C17B5E20" stroke="#C17B5E50" strokeWidth={0.6} />
          {/* Kiln door */}
          <rect x={335} y={118} width={50} height={38} rx={3}
            fill="#C17B5E10" stroke="#C17B5E40" strokeWidth={0.5} />

          {/* Heat glow */}
          <circle cx={360} cy={137} r={10} fill="#C17B5E" opacity={0.08} />
          <circle cx={360} cy={137} r={18} fill="#C17B5E" opacity={0.04} />

          {/* Heat waves inside */}
          {[345, 355, 365, 375].map((x, i) => (
            <path
              key={i}
              d={`M ${x} 150 Q ${x + 3} 143 ${x} 136 Q ${x - 3} 129 ${x} 122`}
              fill="none"
              stroke="#C17B5E50"
              strokeWidth={0.5}
            />
          ))}

          {/* Temperature label */}
          <text x={360} y={155} fill="#C17B5E" fontSize="7" fontWeight="bold" textAnchor="middle">
            400°C
          </text>

          <text x={360} y={177} fill="#C17B5E" fontSize="6.5" textAnchor="middle" opacity={0.8}>
            미니가마 어닐링
          </text>
          <text x={360} y={186} fill="#C17B5E" fontSize="4.5" textAnchor="middle" opacity={0.5}>
            30분 유지
          </text>

          {/* Arduino PID badge */}
          <rect x={405} y={125} width={42} height={20} rx={3}
            fill="#B8A9C915" stroke="#B8A9C940" strokeWidth={0.5} />
          <text x={426} y={135} fill="#B8A9C9" fontSize="5" fontWeight="bold" textAnchor="middle">Arduino</text>
          <text x={426} y={142} fill="#B8A9C9" fontSize="4" textAnchor="middle" opacity={0.6}>PID 제어</text>
        </g>

        {/* ===== BOTTOM: Full process arrow ===== */}
        <g>
          <text x={svgW / 2} y={210} fill="#e8e8e8" fontSize="7" fontWeight="bold" textAnchor="middle">
            전체 공정 흐름
          </text>

          {/* Process flow boxes */}
          {/* Dip ×3 */}
          <rect x={60} y={220} width={80} height={24} rx={5}
            fill="#6BA36815" stroke="#6BA36850" strokeWidth={0.7} />
          <text x={100} y={233} fill="#6BA368" fontSize="6" fontWeight="bold" textAnchor="middle">
            딥코팅 ×3
          </text>
          <text x={100} y={241} fill="#6BA368" fontSize="4" textAnchor="middle" opacity={0.5}>
            침지 → 인상 → 건조
          </text>

          {/* Arrow */}
          <line x1={140} y1={232} x2={165} y2={232} stroke="#ffffff30" strokeWidth={0.8} markerEnd="url(#arrowSmall)" />

          {/* Anneal */}
          <rect x={165} y={220} width={70} height={24} rx={5}
            fill="#C17B5E15" stroke="#C17B5E50" strokeWidth={0.7} />
          <text x={200} y={233} fill="#C17B5E" fontSize="6" fontWeight="bold" textAnchor="middle">
            어닐링
          </text>
          <text x={200} y={241} fill="#C17B5E" fontSize="4" textAnchor="middle" opacity={0.5}>
            400°C, 30분
          </text>

          {/* Arrow */}
          <line x1={235} y1={232} x2={260} y2={232} stroke="#ffffff30" strokeWidth={0.8} markerEnd="url(#arrowSmall)" />

          {/* Result */}
          <rect x={260} y={220} width={80} height={24} rx={5}
            fill="#D4A85315" stroke="#D4A85350" strokeWidth={0.7} />
          <text x={300} y={233} fill="#D4A853" fontSize="6" fontWeight="bold" textAnchor="middle">
            결정질 MgO
          </text>
          <text x={300} y={241} fill="#D4A853" fontSize="4" textAnchor="middle" opacity={0.5}>
            ~300nm (3 layer)
          </text>

          {/* Arrow */}
          <line x1={340} y1={232} x2={365} y2={232} stroke="#ffffff30" strokeWidth={0.8} markerEnd="url(#arrowSmall)" />

          {/* Storage */}
          <rect x={365} y={220} width={90} height={24} rx={5}
            fill="#7B9EB815" stroke="#7B9EB850" strokeWidth={0.7} />
          <text x={410} y={233} fill="#7B9EB8" fontSize="6" fontWeight="bold" textAnchor="middle">
            데시케이터 보관
          </text>
          <text x={410} y={241} fill="#7B9EB8" fontSize="4" textAnchor="middle" opacity={0.5}>
            MgO 수분 민감
          </text>
        </g>

        {/* ===== Annotation ===== */}
        <rect x={60} y={255} width={400} height={22} rx={4}
          fill="#ef8f4408" stroke="#ef8f4430" strokeWidth={0.5} />
        <text x={65} y={268} fill="#ef8f44" fontSize="5" opacity={0.7}>
          ⚠
        </text>
        <text x={78} y={269} fill="#ef8f44" fontSize="5.5" opacity={0.8}>
          코팅 후 데시케이터 보관 필수 (MgO 수분 민감) — 대기 노출 시 Mg(OH)₂ 전환으로 절연 특성 저하
        </text>

        {/* Section label: left */}
        <text x={100} y={33} fill="#ffffff30" fontSize="5.5" textAnchor="middle">
          딥코팅 스테이션
        </text>

        {/* Section label: right */}
        <text x={360} y={33} fill="#ffffff30" fontSize="5.5" textAnchor="middle">
          후처리
        </text>
      </svg>

      {activePart ? (
        <div
          className="max-w-2xl mx-auto mt-2 rounded-lg border p-3 transition-all duration-200"
          style={{ borderColor: activePart.color + "55", backgroundColor: activePart.color + "18" }}
        >
          <div className="text-sm font-medium" style={{ color: activePart.color }}>{activePart.label}</div>
          <p className="text-xs text-stone-400 mt-1">{activePart.detail}</p>
        </div>
      ) : (
        <figcaption className="text-center text-stone-500 text-xs mt-2">
          각 구성 요소를 호버하여 상세 확인. 졸 용기 · 전극 · 인상 속도 · 건조 · 어닐링 — 총 5개 영역.
        </figcaption>
      )}
    </figure>
  );
}
