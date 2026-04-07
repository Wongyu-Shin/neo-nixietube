"use client";

import { useState } from "react";

const PARTS = [
  {
    id: "tube",
    label: "닉시관 (점등 중)",
    detail: "1mA 연속 점등. 양극 저항으로 전류 설정. 100시간 목표.",
    color: "#ef8f44",
  },
  {
    id: "psu",
    label: "부스트 컨버터 + 저항",
    detail: "12V → 300-500V. 양극 저항 조정으로 1mA 설정. 연속 동작.",
    color: "#7B9EB8",
  },
  {
    id: "camera",
    label: "카메라 스탠드",
    detail: "동일 각도/조명에서 매일 촬영. 밝기, 색상, 흑화 진행 정량화.",
    color: "#D4A853",
  },
  {
    id: "o2",
    label: "O\u2082 센서",
    detail: "관 외벽에 테이프 부착. 배경 O\u2082와 비교하여 누출 감지. 주간 확인.",
    color: "#ef4444",
  },
  {
    id: "timer",
    label: "타이머/로거",
    detail: "누적 점등 시간 기록. 24시간/48시간/100시간 체크포인트.",
    color: "#B8A9C9",
  },
];

const MILESTONES = [
  { hour: 0, label: "점등 시작", x: 0 },
  { hour: 24, label: "1차 사진 + O\u2082 체크", x: 0.24 },
  { hour: 48, label: "2차 사진", x: 0.48 },
  { hour: 100, label: "최종 평가 \u2192 PoC 성공 \uD83C\uDF89", x: 1.0 },
];

export default function AgingSetup() {
  const [hovered, setHovered] = useState<string | null>(null);

  const activePart = PARTS.find((p) => p.id === hovered);
  const svgW = 540;
  const svgH = 300;

  return (
    <figure className="my-8">
      <svg
        viewBox={`0 0 ${svgW} ${svgH}`}
        className="w-full max-w-2xl mx-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width={svgW} height={svgH} fill="#111116" rx="8" stroke="#ffffff10" strokeWidth="0.5" />

        <text x={svgW / 2} y={20} fill="#e8e8e8" fontSize="11" fontWeight="bold" textAnchor="middle">
          에이징 및 관찰 셋업 (Path 2 — Step 6: 100시간 Burn-in)
        </text>

        {/* ================================================================ */}
        {/* === Boost Converter + Resistor (left) === */}
        {/* ================================================================ */}
        <g
          onMouseEnter={() => setHovered("psu")}
          onMouseLeave={() => setHovered(null)}
          style={{ cursor: "pointer" }}
        >
          <rect x={20} y={55} width={90} height={60} rx={6}
            fill={hovered === "psu" ? "#7B9EB830" : "#7B9EB818"}
            stroke={hovered === "psu" ? "#7B9EB8" : "#7B9EB870"}
            strokeWidth={hovered === "psu" ? 2 : 1} />
          {/* DC-DC converter symbol */}
          <rect x={30} y={62} width={34} height={22} rx={3}
            fill="#7B9EB815" stroke="#7B9EB850" strokeWidth={0.6} />
          <text x={47} y={75} fill="#7B9EB8" fontSize="5" fontWeight="bold" textAnchor="middle">DC-DC</text>
          {/* Arrow: 12V in */}
          <text x={30} y={60} fill="#7B9EB8" fontSize="4.5" opacity={0.6}>12V</text>
          {/* Arrow: HV out */}
          <text x={70} y={60} fill="#7B9EB8" fontSize="4.5" opacity={0.6}>300-500V</text>
          {/* Resistor symbol */}
          <path d="M 72 73 L 78 73 L 80 68 L 84 78 L 88 68 L 92 78 L 96 68 L 98 73 L 104 73"
            fill="none" stroke="#7B9EB8" strokeWidth={0.8} opacity={0.7} />
          <text x={88} y={85} fill="#7B9EB8" fontSize="4" textAnchor="middle" opacity={0.6}>양극 저항</text>
          <text x={65} y={105} fill="#7B9EB8" fontSize="6" textAnchor="middle" opacity={0.9}>부스트 컨버터</text>
          <text x={65} y={114} fill="#7B9EB8" fontSize="5" textAnchor="middle" opacity={0.5}>+ 저항</text>
        </g>

        {/* === Wire: PSU → Tube === */}
        <line x1={110} y1={80} x2={145} y2={80}
          stroke="#7B9EB850" strokeWidth={1.5} strokeDasharray="4 3" />
        <polygon points="138,77 138,83 144,80" fill="#7B9EB860" />

        {/* ================================================================ */}
        {/* === Nixie Tube (center) — lit with glow === */}
        {/* ================================================================ */}
        <g
          onMouseEnter={() => setHovered("tube")}
          onMouseLeave={() => setHovered(null)}
          style={{ cursor: "pointer" }}
        >
          {/* Orange glow aura */}
          <ellipse cx={195} cy={85} rx={38} ry={50}
            fill="url(#glowGrad)" opacity={hovered === "tube" ? 0.7 : 0.45} />
          {/* Glass dome */}
          <path
            d="M 170 140 L 170 80 Q 170 40 195 40 Q 220 40 220 80 L 220 140"
            fill={hovered === "tube" ? "#ef8f4428" : "#ef8f4415"}
            stroke={hovered === "tube" ? "#ef8f44" : "#ef8f4480"}
            strokeWidth={hovered === "tube" ? 2 : 1.2} />
          {/* Base */}
          <rect x={166} y={140} width={58} height={8} rx={2}
            fill="#ef8f4420" stroke="#ef8f4460" strokeWidth={0.8} />
          {/* Digit "7" glowing inside */}
          <text x={195} y={105} fill="#ef8f44" fontSize="28" fontWeight="bold" textAnchor="middle"
            opacity={hovered === "tube" ? 1 : 0.8}>7</text>
          {/* Pin leads at bottom */}
          {[180, 190, 200, 210].map((px) => (
            <line key={px} x1={px} y1={148} x2={px} y2={156}
              stroke="#ef8f4450" strokeWidth={0.8} />
          ))}
          <text x={195} y={168} fill="#ef8f44" fontSize="7" textAnchor="middle" opacity={0.9}>닉시관</text>
          <text x={195} y={177} fill="#ef8f44" fontSize="5" textAnchor="middle" opacity={0.5}>1mA 점등 중</text>
        </g>

        {/* Glow gradient definition */}
        <defs>
          <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ef8f44" stopOpacity="0.35" />
            <stop offset="60%" stopColor="#ef8f44" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#ef8f44" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ================================================================ */}
        {/* === Camera Stand (right of tube) === */}
        {/* ================================================================ */}
        <g
          onMouseEnter={() => setHovered("camera")}
          onMouseLeave={() => setHovered(null)}
          style={{ cursor: "pointer" }}
        >
          {/* Stand pole */}
          <line x1={300} y1={50} x2={300} y2={155}
            stroke={hovered === "camera" ? "#D4A853" : "#D4A85370"}
            strokeWidth={2} />
          {/* Base */}
          <rect x={285} y={150} width={30} height={6} rx={2}
            fill="#D4A85320" stroke="#D4A85360" strokeWidth={0.6} />
          {/* Arm extending toward tube */}
          <line x1={270} y1={60} x2={300} y2={60}
            stroke={hovered === "camera" ? "#D4A853" : "#D4A85370"}
            strokeWidth={1.5} />
          {/* Phone body */}
          <rect x={258} y={50} width={16} height={28} rx={2}
            fill={hovered === "camera" ? "#D4A85335" : "#D4A85320"}
            stroke={hovered === "camera" ? "#D4A853" : "#D4A85370"}
            strokeWidth={hovered === "camera" ? 1.5 : 0.8} />
          {/* Camera lens */}
          <circle cx={266} cy={58} r={3}
            fill="#D4A85330" stroke="#D4A85380" strokeWidth={0.6} />
          {/* Dotted line: camera aim → tube */}
          <line x1={258} y1={64} x2={225} y2={80}
            stroke="#D4A85340" strokeWidth={0.8} strokeDasharray="3 2" />
          <text x={300} y={168} fill="#D4A853" fontSize="6" textAnchor="middle" opacity={0.9}>카메라 스탠드</text>
          <text x={300} y={177} fill="#D4A853" fontSize="4.5" textAnchor="middle" opacity={0.5}>매일 촬영</text>
        </g>

        {/* ================================================================ */}
        {/* === O2 Sensor (taped to tube exterior) === */}
        {/* ================================================================ */}
        <g
          onMouseEnter={() => setHovered("o2")}
          onMouseLeave={() => setHovered(null)}
          style={{ cursor: "pointer" }}
        >
          {/* Sensor body taped to tube */}
          <rect x={222} y={88} width={32} height={18} rx={3}
            fill={hovered === "o2" ? "#ef444430" : "#ef444418"}
            stroke={hovered === "o2" ? "#ef4444" : "#ef444470"}
            strokeWidth={hovered === "o2" ? 1.5 : 0.8} />
          {/* Tape indicators */}
          <line x1={220} y1={92} x2={224} y2={92}
            stroke="#ef444460" strokeWidth={2} />
          <line x1={220} y1={100} x2={224} y2={100}
            stroke="#ef444460" strokeWidth={2} />
          <text x={238} y={100} fill="#ef4444" fontSize="6" fontWeight="bold" textAnchor="middle">O&#x2082;</text>
          <text x={238} y={118} fill="#ef4444" fontSize="5" textAnchor="middle" opacity={0.7}>센서</text>
        </g>

        {/* ================================================================ */}
        {/* === Timer/Logger (far right) === */}
        {/* ================================================================ */}
        <g
          onMouseEnter={() => setHovered("timer")}
          onMouseLeave={() => setHovered(null)}
          style={{ cursor: "pointer" }}
        >
          <rect x={350} y={55} width={70} height={50} rx={5}
            fill={hovered === "timer" ? "#B8A9C930" : "#B8A9C918"}
            stroke={hovered === "timer" ? "#B8A9C9" : "#B8A9C970"}
            strokeWidth={hovered === "timer" ? 2 : 1} />
          {/* Screen */}
          <rect x={358} y={62} width={44} height={20} rx={2}
            fill="#B8A9C915" stroke="#B8A9C950" strokeWidth={0.5} />
          {/* Timer display */}
          <text x={380} y={76} fill="#B8A9C9" fontSize="8" fontWeight="bold" textAnchor="middle">048:32</text>
          {/* Buttons */}
          <circle cx={364} cy={94} r={3} fill="#B8A9C920" stroke="#B8A9C960" strokeWidth={0.5} />
          <circle cx={380} cy={94} r={3} fill="#B8A9C920" stroke="#B8A9C960" strokeWidth={0.5} />
          <circle cx={396} cy={94} r={3} fill="#B8A9C920" stroke="#B8A9C960" strokeWidth={0.5} />
          <text x={385} y={118} fill="#B8A9C9" fontSize="6" textAnchor="middle" opacity={0.9}>타이머/로거</text>
          <text x={385} y={127} fill="#B8A9C9" fontSize="4.5" textAnchor="middle" opacity={0.5}>누적 시간 기록</text>
        </g>

        {/* === Wire: Timer ← Tube connection === */}
        <line x1={224} y1={145} x2={350} y2={95}
          stroke="#B8A9C940" strokeWidth={0.8} strokeDasharray="3 2" />

        {/* ================================================================ */}
        {/* === Timeline Bar (bottom) === */}
        {/* ================================================================ */}
        <g>
          {/* Timeline background */}
          <rect x={30} y={210} width={480} height={28} rx={4}
            fill="#ffffff06" stroke="#ffffff15" strokeWidth={0.5} />
          <text x={270} y={206} fill="#e8e8e8" fontSize="7" fontWeight="bold" textAnchor="middle">
            100시간 Burn-in 타임라인
          </text>

          {/* Track line */}
          <line x1={50} y1={226} x2={490} y2={226}
            stroke="#ffffff20" strokeWidth={1.5} />
          {/* Filled progress (decorative) */}
          <line x1={50} y1={226} x2={490} y2={226}
            stroke="#ef8f4430" strokeWidth={1.5} />

          {/* Milestones */}
          {MILESTONES.map((ms) => {
            const mx = 50 + ms.x * 440;
            return (
              <g key={ms.hour}>
                <circle cx={mx} cy={226} r={4}
                  fill={ms.hour === 100 ? "#ef8f4460" : "#ffffff20"}
                  stroke={ms.hour === 100 ? "#ef8f44" : "#ffffff50"}
                  strokeWidth={1} />
                <text x={mx} y={220} fill="#e8e8e8" fontSize="5.5" fontWeight="bold" textAnchor="middle">
                  {ms.hour}h
                </text>
                <text x={mx} y={235} fill="#aaa" fontSize="4.5" textAnchor="middle">
                  {ms.label}
                </text>
              </g>
            );
          })}
        </g>

        {/* ================================================================ */}
        {/* === Success Criteria Annotation (bottom-right) === */}
        {/* ================================================================ */}
        <g>
          <rect x={340} y={248} width={185} height={44} rx={5}
            fill="#6BA36810" stroke="#6BA36840" strokeWidth={0.8} strokeDasharray="5 3" />
          <text x={432} y={261} fill="#6BA368" fontSize="6.5" fontWeight="bold" textAnchor="middle">
            성공 기준 (Pass Criteria)
          </text>
          <text x={348} y={273} fill="#e8e8e8" fontSize="5.5" dominantBaseline="middle">
            &#x2713; 글로우 유지 + 전류 안정 (&#xB1;10%)
          </text>
          <text x={348} y={283} fill="#e8e8e8" fontSize="5.5" dominantBaseline="middle">
            {"✓ 흑화 면적 < 10%"}
          </text>
          <text x={348} y={293} fill="#ef8f44" fontSize="5.5" dominantBaseline="middle">
            &#x2713; 색상: 오렌지 유지
          </text>
        </g>

        {/* === Workstation label (bottom-left) === */}
        <text x={30} y={265} fill="#666" fontSize="5.5">
          연속 점등 워크스테이션 — 안정된 전원, 고정 촬영, 누출 모니터링
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
          각 부품을 호버하여 상세 확인. 100시간 연속 점등으로 글로우 안정성, 흑화, 누출 여부를 종합 평가.
        </figcaption>
      )}
    </figure>
  );
}
