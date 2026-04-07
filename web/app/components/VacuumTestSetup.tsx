"use client";

import { useState } from "react";

const PARTS = [
  { id: "pump", label: "로터리 펌프", detail: "로터리 펌프. 네온사인 업체/대학에서 접근. 10⁻²~10⁻³ Torr 도달.", color: "#7B9EB8" },
  { id: "adapter", label: "KF25 어댑터", detail: "KF25 규격 진공 클램프. 배기관(OD 5mm)과 진공 배관 연결. O-링 포함.", color: "#D4A853" },
  { id: "valve", label: "밸브", detail: "수동 밸브. Hold test 시 펌프 차단. 잠금 후 1시간 압력 변화 관찰.", color: "#C17B5E" },
  { id: "tube", label: "프릿 봉착 관", detail: "프릿 소성 완료된 관. 배기관을 통해 진공 라인에 연결.", color: "#ef8f44" },
  { id: "pirani", label: "Arduino 피라니 게이지", detail: "DIY 피라니 게이지. 열선(텅스텐)+Arduino ADC. 10⁻³~10² Torr 범위 측정. 10초 간격 로깅.", color: "#B8A9C9" },
  { id: "arduino", label: "Arduino + 디스플레이", detail: "Arduino Nano. 피라니 압력을 LCD/OLED에 표시 + SD카드 로깅. Hold test 1시간 자동 기록.", color: "#6BA368" },
];

export default function VacuumTestSetup() {
  const [hovered, setHovered] = useState<string | null>(null);

  const activePart = PARTS.find((p) => p.id === hovered);
  const svgW = 560;
  const svgH = 280;

  return (
    <figure className="my-8">
      <svg
        viewBox={`0 0 ${svgW} ${svgH}`}
        className="w-full max-w-2xl mx-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width={svgW} height={svgH} fill="#111116" rx="8" stroke="#ffffff10" strokeWidth="0.5" />

        <text x={svgW / 2} y={20} fill="#e8e8e8" fontSize="11" fontWeight="bold" textAnchor="middle">
          진공 기밀 테스트 셋업 (Path 1 — 프릿 봉착)
        </text>

        {/* === Rotary Pump === */}
        <g
          onMouseEnter={() => setHovered("pump")}
          onMouseLeave={() => setHovered(null)}
          style={{ cursor: "pointer" }}
        >
          <rect x={20} y={80} width={80} height={60} rx={6}
            fill={hovered === "pump" ? "#7B9EB830" : "#7B9EB818"}
            stroke={hovered === "pump" ? "#7B9EB8" : "#7B9EB870"}
            strokeWidth={hovered === "pump" ? 2 : 1} />
          {/* Motor circle */}
          <circle cx={60} cy={100} r={14}
            fill="#7B9EB810" stroke="#7B9EB850" strokeWidth={0.8} />
          <circle cx={60} cy={100} r={6}
            fill="#7B9EB820" stroke="#7B9EB860" strokeWidth={0.5} />
          {/* Exhaust port */}
          <rect x={95} y={103} width={8} height={6} rx={1}
            fill="#7B9EB830" stroke="#7B9EB860" strokeWidth={0.5} />
          <text x={60} y={130} fill="#7B9EB8" fontSize="6" textAnchor="middle" opacity={0.9}>로터리 펌프</text>
          <text x={60} y={148} fill="#7B9EB8" fontSize="5" textAnchor="middle" opacity={0.6}>10⁻³ Torr</text>
        </g>

        {/* === Tubing: Pump → Adapter === */}
        <line x1={103} y1={106} x2={130} y2={106}
          stroke="#7B9EB850" strokeWidth={1.5} strokeDasharray="4 3" />

        {/* === KF25 Adapter === */}
        <g
          onMouseEnter={() => setHovered("adapter")}
          onMouseLeave={() => setHovered(null)}
          style={{ cursor: "pointer" }}
        >
          <rect x={130} y={94} width={28} height={24} rx={3}
            fill={hovered === "adapter" ? "#D4A85335" : "#D4A85320"}
            stroke={hovered === "adapter" ? "#D4A853" : "#D4A85370"}
            strokeWidth={hovered === "adapter" ? 2 : 1} />
          {/* O-ring indicator */}
          <ellipse cx={144} cy={106} rx={8} ry={5}
            fill="none" stroke="#D4A85380" strokeWidth={0.8} strokeDasharray="2 1" />
          <text x={144} y={128} fill="#D4A853" fontSize="5" textAnchor="middle" opacity={0.9}>KF25</text>
        </g>

        {/* === Tubing: Adapter → Valve === */}
        <line x1={158} y1={106} x2={188} y2={106}
          stroke="#D4A85350" strokeWidth={1.5} strokeDasharray="4 3" />

        {/* === Valve === */}
        <g
          onMouseEnter={() => setHovered("valve")}
          onMouseLeave={() => setHovered(null)}
          style={{ cursor: "pointer" }}
        >
          {/* Valve body — bowtie/butterfly shape */}
          <polygon points="188,92 210,106 188,120"
            fill={hovered === "valve" ? "#C17B5E30" : "#C17B5E18"}
            stroke={hovered === "valve" ? "#C17B5E" : "#C17B5E70"}
            strokeWidth={hovered === "valve" ? 1.5 : 0.8} />
          <polygon points="230,92 210,106 230,120"
            fill={hovered === "valve" ? "#C17B5E30" : "#C17B5E18"}
            stroke={hovered === "valve" ? "#C17B5E" : "#C17B5E70"}
            strokeWidth={hovered === "valve" ? 1.5 : 0.8} />
          {/* Handle */}
          <line x1={209} y1={92} x2={209} y2={78}
            stroke={hovered === "valve" ? "#C17B5E" : "#C17B5E80"}
            strokeWidth={1.5} />
          <circle cx={209} cy={76} r={3}
            fill={hovered === "valve" ? "#C17B5E40" : "#C17B5E20"}
            stroke={hovered === "valve" ? "#C17B5E" : "#C17B5E80"}
            strokeWidth={0.8} />
          <text x={209} y={135} fill="#C17B5E" fontSize="6" textAnchor="middle" opacity={0.9}>밸브</text>
        </g>

        {/* === Tubing: Valve → Tube === */}
        <line x1={230} y1={106} x2={268} y2={106}
          stroke="#C17B5E50" strokeWidth={1.5} strokeDasharray="4 3" />

        {/* === Frit-sealed Tube (center) === */}
        <g
          onMouseEnter={() => setHovered("tube")}
          onMouseLeave={() => setHovered(null)}
          style={{ cursor: "pointer" }}
        >
          {/* Glass dome */}
          <path
            d="M 280 180 L 280 110 Q 280 60 320 60 Q 360 60 360 110 L 360 180"
            fill={hovered === "tube" ? "#ef8f4430" : "#ef8f4418"}
            stroke={hovered === "tube" ? "#ef8f44" : "#ef8f4480"}
            strokeWidth={hovered === "tube" ? 2 : 1.2} />
          {/* Base plate */}
          <rect x={275} y={180} width={90} height={10} rx={2}
            fill="#ef8f4420" stroke="#ef8f4460" strokeWidth={0.8} />
          {/* Exhaust tube (connects to vacuum line) */}
          <rect x={265} y={100} width={16} height={5} rx={1}
            fill="#ef8f4425" stroke="#ef8f4460" strokeWidth={0.6} />
          {/* Electrode inside */}
          <text x={320} y={130} fill="#ef8f4450" fontSize="22" fontWeight="bold" textAnchor="middle">7</text>
          {/* Frit seal line */}
          <path d="M 282 180 Q 320 174 358 180"
            fill="none" stroke="#ef8f4480" strokeWidth={1.2} strokeDasharray="2 2" />
          <text x={320} y={170} fill="#ef8f44" fontSize="5" textAnchor="middle" opacity={0.7}>프릿 봉착선</text>
          <text x={320} y={200} fill="#ef8f44" fontSize="7" textAnchor="middle" opacity={0.9}>프릿 봉착 관</text>
        </g>

        {/* === Tubing: Tube → Pirani gauge === */}
        <line x1={360} y1={106} x2={395} y2={106}
          stroke="#ef8f4450" strokeWidth={1.5} strokeDasharray="4 3" />
        {/* T-junction indicator */}
        <circle cx={378} cy={106} r={2.5}
          fill="#ffffff15" stroke="#ffffff30" strokeWidth={0.5} />

        {/* === Pirani Gauge === */}
        <g
          onMouseEnter={() => setHovered("pirani")}
          onMouseLeave={() => setHovered(null)}
          style={{ cursor: "pointer" }}
        >
          <rect x={395} y={82} width={60} height={48} rx={4}
            fill={hovered === "pirani" ? "#B8A9C930" : "#B8A9C918"}
            stroke={hovered === "pirani" ? "#B8A9C9" : "#B8A9C970"}
            strokeWidth={hovered === "pirani" ? 2 : 1} />
          {/* Filament symbol */}
          <path d="M 415 100 Q 420 94 425 100 Q 430 106 435 100"
            fill="none" stroke="#B8A9C9" strokeWidth={1} opacity={0.7} />
          <text x={425} y={118} fill="#B8A9C9" fontSize="6" fontWeight="bold" textAnchor="middle">피라니</text>
          <text x={425} y={93} fill="#B8A9C9" fontSize="5" textAnchor="middle" opacity={0.6}>게이지</text>
        </g>

        {/* === Wire: Pirani → Arduino === */}
        <line x1={425} y1={130} x2={425} y2={152}
          stroke="#B8A9C950" strokeWidth={1} strokeDasharray="3 2" />
        <line x1={425} y1={152} x2={490} y2={152}
          stroke="#6BA36850" strokeWidth={1} strokeDasharray="3 2" />

        {/* === Arduino + Display === */}
        <g
          onMouseEnter={() => setHovered("arduino")}
          onMouseLeave={() => setHovered(null)}
          style={{ cursor: "pointer" }}
        >
          <rect x={470} y={132} width={75} height={56} rx={4}
            fill={hovered === "arduino" ? "#6BA36830" : "#6BA36818"}
            stroke={hovered === "arduino" ? "#6BA368" : "#6BA36870"}
            strokeWidth={hovered === "arduino" ? 2 : 1} />
          {/* OLED screen */}
          <rect x={478} y={140} width={38} height={20} rx={2}
            fill="#6BA36815" stroke="#6BA36850" strokeWidth={0.5} />
          <text x={497} y={152} fill="#6BA368" fontSize="6" fontWeight="bold" textAnchor="middle">P</text>
          <text x={497} y={158} fill="#6BA368" fontSize="4" textAnchor="middle" opacity={0.7}>Torr</text>
          {/* SD card slot */}
          <rect x={522} y={142} width={14} height={10} rx={1}
            fill="#6BA36820" stroke="#6BA36860" strokeWidth={0.5} />
          <text x={529} y={150} fill="#6BA368" fontSize="4" textAnchor="middle" opacity={0.7}>SD</text>
          <text x={507} y={176} fill="#6BA368" fontSize="6" textAnchor="middle" opacity={0.9}>Arduino</text>
          <text x={507} y={184} fill="#6BA368" fontSize="5" textAnchor="middle" opacity={0.6}>Nano</text>
        </g>

        {/* === Hold Test Annotation Box === */}
        <g>
          <rect x={20} y={210} width={220} height={52} rx={5}
            fill="#ffffff06" stroke="#ef8f4450" strokeWidth={1} strokeDasharray="6 3" />
          <text x={130} y={228} fill="#ef8f44" fontSize="8" fontWeight="bold" textAnchor="middle">
            Hold Test
          </text>
          <text x={130} y={242} fill="#e8e8e8" fontSize="7" textAnchor="middle" opacity={0.8}>
            t=0 → t=60min
          </text>
          <text x={130} y={256} fill="#6BA368" fontSize="7" fontWeight="bold" textAnchor="middle">
            {"ΔP < 1 Torr = PASS"}
          </text>
        </g>

        {/* === Flow direction arrows === */}
        {/* Arrow on pump→adapter line */}
        <polygon points="120,103 120,109 126,106" fill="#7B9EB860" />
        {/* Arrow on adapter→valve line */}
        <polygon points="176,103 176,109 182,106" fill="#D4A85360" />
        {/* Arrow on valve→tube line */}
        <polygon points="254,103 254,109 260,106" fill="#C17B5E60" />

        {/* Bottom note */}
        <text x={svgW / 2} y={svgH - 6} fill="#666" fontSize="6" textAnchor="middle">
          밸브 잠금 후 1시간 피라니 게이지 모니터링 — 압력 상승 1 Torr 미만이면 기밀 합격
        </text>
      </svg>

      {/* Info panel */}
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
          각 부품을 호버하여 상세 확인. 로터리 펌프로 배기 후 밸브 잠금, 피라니 게이지로 1시간 압력 변화 측정.
        </figcaption>
      )}
    </figure>
  );
}
