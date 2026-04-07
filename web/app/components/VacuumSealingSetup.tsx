"use client";

import { useState, useEffect } from "react";

const PARTS = [
  { id: "tube", label: "닉시관 (조립 중)", detail: "MgO 코팅 전극 + 프릿 봉착 관. 배기관으로 진공 라인 연결.", color: "#ef8f44" },
  { id: "pump", label: "로터리 펌프", detail: "10⁻³~10⁻⁴ Torr 배기. 네온사인 업체 또는 대학 실험실.", color: "#7B9EB8" },
  { id: "heatgun", label: "히트건", detail: "200°C 베이킹 2시간. 내벽 흡착 가스 탈착. 도달 진공도 개선.", color: "#C17B5E" },
  { id: "gas", label: "네온+Ar 가스", detail: "Ne + 0.5-1% Ar (Penning 혼합). 15-20 Torr 충전. Arduino 피라니로 압력 모니터링.", color: "#6BA368" },
  { id: "arduino", label: "Arduino 제어", detail: "피라니 게이지 + 압력 로깅. 가스 충전 압력 정밀 모니터링.", color: "#B8A9C9" },
  { id: "getter", label: "Ti 게터", detail: "Ti 와이어. 전류 인가로 700°C+ 자체 발열 → 잔류 O₂/H₂O 화학 흡착.", color: "#D4A853" },
];

const STEPS = [
  { num: 1, label: "전극삽입", x: 52, y: 298 },
  { num: 2, label: "프릿소성", x: 124, y: 298 },
  { num: 3, label: "진공배기", x: 196, y: 298 },
  { num: 4, label: "베이킹", x: 268, y: 298 },
  { num: 5, label: "가스충전", x: 340, y: 298 },
  { num: 6, label: "게터플래싱", x: 418, y: 298 },
  { num: 7, label: "팁오프", x: 506, y: 298 },
];

export default function VacuumSealingSetup() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [vacPhase, setVacPhase] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setVacPhase((p) => (p + 1) % 80), 100);
    return () => clearInterval(timer);
  }, []);

  const activePart = PARTS.find((p) => p.id === hovered);
  const svgW = 560;
  const svgH = 320;

  // Animated vacuum particles (being sucked toward pump)
  const vacParticles = Array.from({ length: 6 }, (_, i) => {
    const phase = ((vacPhase + i * 13) % 80) / 80;
    return {
      x: 230 - phase * 110,
      y: 148 + Math.sin(phase * Math.PI * 3) * 6,
      opacity: phase > 0.1 && phase < 0.9 ? 0.5 : 0,
    };
  });

  // Animated gas fill particles (flowing from cylinder into tube)
  const gasParticles = Array.from({ length: 5 }, (_, i) => {
    const phase = ((vacPhase + i * 15) % 80) / 80;
    return {
      x: 420 - phase * 100,
      y: 148 + Math.sin(phase * Math.PI * 2) * 5,
      opacity: phase > 0.1 && phase < 0.85 ? 0.45 : 0,
    };
  });

  return (
    <figure className="my-8">
      <svg
        viewBox={`0 0 ${svgW} ${svgH}`}
        className="w-full max-w-2xl mx-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width={svgW} height={svgH} fill="#111116" rx="8" stroke="#ffffff10" strokeWidth="0.5" />

        <text x={svgW / 2} y={20} fill="#e8e8e8" fontSize="11" fontWeight="bold" textAnchor="middle">
          통합 조립 + 진공 봉입 워크벤치 레이아웃
        </text>
        <text x={svgW / 2} y={33} fill="#666" fontSize="7" textAnchor="middle">
          Path 1 · Phase 3 — 전극 삽입부터 팁오프까지 7단계
        </text>

        {/* ====== ROTARY PUMP (left) ====== */}
        <g
          onMouseEnter={() => setHovered("pump")}
          onMouseLeave={() => setHovered(null)}
          style={{ cursor: "pointer" }}
        >
          <rect x={18} y={110} width={90} height={70} rx={6}
            fill={hovered === "pump" ? "#7B9EB828" : "#7B9EB812"}
            stroke={hovered === "pump" ? "#7B9EB8" : "#7B9EB870"}
            strokeWidth={hovered === "pump" ? 2 : 1}
          />
          {/* Motor body */}
          <circle cx={63} cy={140} r={18} fill="#7B9EB818" stroke="#7B9EB850" strokeWidth={0.8} />
          <circle cx={63} cy={140} r={8} fill="#7B9EB810" stroke="#7B9EB840" strokeWidth={0.5} />
          {/* Spinning indicator */}
          <line
            x1={63} y1={132}
            x2={63 + Math.cos(vacPhase * 0.3) * 7} y2={140 + Math.sin(vacPhase * 0.3) * 7}
            stroke="#7B9EB8" strokeWidth={1} opacity={0.6}
          />
          {/* Exhaust port */}
          <rect x={98} y={133} width={10} height={8} rx={1}
            fill="#7B9EB815" stroke="#7B9EB840" strokeWidth={0.5} />
          <text x={63} y={170} fill="#7B9EB8" fontSize="6" fontWeight="bold" textAnchor="middle">로터리 펌프</text>
          <text x={63} y={178} fill="#7B9EB8" fontSize="4.5" textAnchor="middle" opacity={0.6}>10⁻³ Torr</text>
        </g>

        {/* Vacuum line from pump to tube */}
        <path d="M 108 137 L 170 137 L 210 120" fill="none"
          stroke="#7B9EB860" strokeWidth={1.5} strokeDasharray="4 3" />
        <text x={145} y={130} fill="#7B9EB8" fontSize="5" opacity={0.7}>진공 라인</text>

        {/* Animated vacuum particles */}
        {vacParticles.map((p, i) => (
          <circle key={`vac-${i}`} cx={p.x} cy={p.y} r={1.8}
            fill="#7B9EB8" opacity={p.opacity} />
        ))}

        {/* ====== NIXIE TUBE (center) ====== */}
        <g
          onMouseEnter={() => setHovered("tube")}
          onMouseLeave={() => setHovered(null)}
          style={{ cursor: "pointer" }}
        >
          {/* Glass envelope - dome */}
          <path
            d="M 215 230 L 215 110 Q 215 75 265 75 Q 315 75 315 110 L 315 230"
            fill={hovered === "tube" ? "#ef8f4430" : "#ef8f4418"}
            stroke={hovered === "tube" ? "#ef8f44" : "#ef8f4480"}
            strokeWidth={hovered === "tube" ? 2 : 1.2}
          />
          {/* Base / header */}
          <rect x={210} y={230} width={110} height={14} rx={3}
            fill="#ef8f4420" stroke="#ef8f4460" strokeWidth={0.8} />

          {/* Exhaust tubulation (top) */}
          <rect x={259} y={60} width={12} height={18} rx={2}
            fill="#ef8f4415" stroke="#ef8f4455" strokeWidth={0.6} />
          <text x={265} y={57} fill="#ef8f44" fontSize="4.5" textAnchor="middle" opacity={0.7}>배기관</text>

          {/* Electrode stack inside */}
          <rect x={240} y={120} width={50} height={55} rx={3}
            fill="#ef8f4410" stroke="#ef8f4440" strokeWidth={0.5} />
          <text x={265} y={142} fill="#ef8f44" fontSize="6" textAnchor="middle" opacity={0.8}>전극</text>
          <text x={265} y={153} fill="#ef8f44" fontSize="5" textAnchor="middle" opacity={0.5}>MgO 코팅</text>
          {/* Digit hint */}
          <text x={265} y={170} fill="#ef8f4435" fontSize="16" fontWeight="bold" textAnchor="middle">0</text>

          {/* Dumet wires below */}
          <line x1={245} y1={244} x2={245} y2={255} stroke="#D4A85360" strokeWidth={0.8} />
          <line x1={255} y1={244} x2={255} y2={255} stroke="#D4A85360" strokeWidth={0.8} />
          <line x1={265} y1={244} x2={265} y2={255} stroke="#D4A85360" strokeWidth={0.8} />
          <line x1={275} y1={244} x2={275} y2={255} stroke="#D4A85360" strokeWidth={0.8} />
          <line x1={285} y1={244} x2={285} y2={255} stroke="#D4A85360" strokeWidth={0.8} />

          <text x={265} y={264} fill="#ef8f44" fontSize="6" fontWeight="bold" textAnchor="middle">닉시관</text>
        </g>

        {/* ====== Ti GETTER (inside tube) ====== */}
        <g
          onMouseEnter={() => setHovered("getter")}
          onMouseLeave={() => setHovered(null)}
          style={{ cursor: "pointer" }}
        >
          <rect x={224} y={190} width={34} height={16} rx={2}
            fill={hovered === "getter" ? "#D4A85340" : "#D4A85320"}
            stroke={hovered === "getter" ? "#D4A853" : "#D4A85365"}
            strokeWidth={hovered === "getter" ? 1.5 : 0.8}
          />
          <text x={241} y={201} fill="#D4A853" fontSize="5.5" fontWeight="bold" textAnchor="middle">Ti 게터</text>
          {/* Getter glow when hovered */}
          {hovered === "getter" && (
            <circle cx={241} cy={198} r={12} fill="#D4A853" opacity={0.08} />
          )}
        </g>

        {/* ====== HEAT GUN (above tube) ====== */}
        <g
          onMouseEnter={() => setHovered("heatgun")}
          onMouseLeave={() => setHovered(null)}
          style={{ cursor: "pointer" }}
        >
          {/* Heat gun body */}
          <rect x={340} y={45} width={70} height={30} rx={5}
            fill={hovered === "heatgun" ? "#C17B5E28" : "#C17B5E12"}
            stroke={hovered === "heatgun" ? "#C17B5E" : "#C17B5E70"}
            strokeWidth={hovered === "heatgun" ? 2 : 1}
          />
          {/* Nozzle */}
          <path d="M 340 53 L 320 50 L 320 68 L 340 65"
            fill="#C17B5E15" stroke="#C17B5E55" strokeWidth={0.8} />
          {/* Handle */}
          <rect x={380} y={75} width={14} height={25} rx={3}
            fill="#C17B5E15" stroke="#C17B5E45" strokeWidth={0.6} />

          <text x={375} y={63} fill="#C17B5E" fontSize="6" fontWeight="bold" textAnchor="middle">히트건</text>
          <text x={375} y={72} fill="#C17B5E" fontSize="4" textAnchor="middle" opacity={0.6}>200°C</text>

          {/* Heat waves toward tube */}
          {[0, 1, 2].map((i) => {
            const waveOffset = ((vacPhase + i * 8) % 24) / 24;
            return (
              <path
                key={`heat-${i}`}
                d={`M ${316 - waveOffset * 30} ${55 + i * 5} Q ${306 - waveOffset * 30} ${52 + i * 5} ${296 - waveOffset * 30} ${55 + i * 5}`}
                fill="none" stroke="#C17B5E" strokeWidth={0.8}
                opacity={0.15 + waveOffset * 0.2}
              />
            );
          })}
        </g>

        {/* ====== Ne+Ar GAS CYLINDER (right) ====== */}
        <g
          onMouseEnter={() => setHovered("gas")}
          onMouseLeave={() => setHovered(null)}
          style={{ cursor: "pointer" }}
        >
          {/* Cylinder body */}
          <rect x={440} y={95} width={50} height={105} rx={12}
            fill={hovered === "gas" ? "#6BA36835" : "#6BA36818"}
            stroke={hovered === "gas" ? "#6BA368" : "#6BA36870"}
            strokeWidth={hovered === "gas" ? 2 : 1}
          />
          {/* Valve top */}
          <rect x={455} y={83} width={20} height={16} rx={3}
            fill="#6BA36825" stroke="#6BA36860" strokeWidth={0.7} />
          <circle cx={465} cy={89} r={4} fill="#6BA36815" stroke="#6BA36850" strokeWidth={0.5} />

          <text x={465} y={138} fill="#6BA368" fontSize="9" fontWeight="bold" textAnchor="middle">Ne</text>
          <text x={465} y={150} fill="#6BA368" fontSize="5" textAnchor="middle" opacity={0.7}>+Ar</text>
          <text x={465} y={162} fill="#6BA368" fontSize="4.5" textAnchor="middle" opacity={0.5}>15-20 Torr</text>
          <text x={465} y={195} fill="#6BA368" fontSize="5" textAnchor="middle" opacity={0.6}>가스 실린더</text>
        </g>

        {/* Gas line from cylinder to tube */}
        <path d="M 440 140 L 380 140 L 315 115" fill="none"
          stroke="#6BA36860" strokeWidth={1.5} strokeDasharray="4 3" />
        <text x={395} y={133} fill="#6BA368" fontSize="5" opacity={0.7}>가스 라인</text>

        {/* Animated gas particles */}
        {gasParticles.map((p, i) => (
          <circle key={`gas-${i}`} cx={p.x} cy={p.y} r={2}
            fill="#6BA368" opacity={p.opacity} />
        ))}

        {/* ====== ARDUINO MONITOR (bottom right) ====== */}
        <g
          onMouseEnter={() => setHovered("arduino")}
          onMouseLeave={() => setHovered(null)}
          style={{ cursor: "pointer" }}
        >
          <rect x={420} y={218} width={100} height={50} rx={5}
            fill={hovered === "arduino" ? "#B8A9C928" : "#B8A9C912"}
            stroke={hovered === "arduino" ? "#B8A9C9" : "#B8A9C970"}
            strokeWidth={hovered === "arduino" ? 2 : 1}
          />
          {/* Screen */}
          <rect x={430} y={225} width={45} height={20} rx={2}
            fill="#B8A9C910" stroke="#B8A9C940" strokeWidth={0.5} />
          {/* Pressure reading */}
          <text x={452} y={237} fill="#6BA368" fontSize="6" fontWeight="bold" textAnchor="middle">
            {(15 + Math.sin(vacPhase * 0.1) * 2).toFixed(1)}
          </text>
          <text x={452} y={244} fill="#B8A9C9" fontSize="3.5" textAnchor="middle" opacity={0.6}>Torr</text>
          {/* Status LED */}
          <circle cx={490} cy={232} r={3} fill="#6BA368" opacity={vacPhase % 20 < 10 ? 0.7 : 0.2} />
          <text x={470} y={258} fill="#B8A9C9" fontSize="6" fontWeight="bold" textAnchor="middle">Arduino</text>
          <text x={470} y={266} fill="#B8A9C9" fontSize="4" textAnchor="middle" opacity={0.6}>피라니 게이지</text>

          {/* Wire from Arduino to gas line area */}
          <path d="M 455 218 L 455 175 L 430 155" fill="none"
            stroke="#B8A9C950" strokeWidth={0.8} strokeDasharray="3 2" />
          <text x={448} y={190} fill="#B8A9C9" fontSize="3.5" opacity={0.5}>압력 센싱</text>
        </g>

        {/* ====== 7-STEP PROCESS (bottom bar) ====== */}
        <rect x={15} y={280} width={530} height={34} rx={4}
          fill="#ffffff04" stroke="#ffffff10" strokeWidth={0.5} />

        {STEPS.map((step, i) => (
          <g key={step.num}>
            {/* Numbered circle */}
            <circle cx={step.x} cy={step.y} r={8}
              fill={`${PARTS[Math.min(i, PARTS.length - 1)]?.color || "#888"}22`}
              stroke={`${PARTS[Math.min(i, PARTS.length - 1)]?.color || "#888"}70`}
              strokeWidth={0.8}
            />
            <text x={step.x} y={step.y + 3} fill="#e8e8e8" fontSize="7" fontWeight="bold" textAnchor="middle">
              {step.num}
            </text>
            {/* Label below circle */}
            <text x={step.x} y={step.y + 16} fill="#999" fontSize="5" textAnchor="middle">
              {step.label}
            </text>
            {/* Arrow between steps */}
            {i < STEPS.length - 1 && (
              <>
                <line
                  x1={step.x + 11} y1={step.y}
                  x2={STEPS[i + 1].x - 11} y2={STEPS[i + 1].y}
                  stroke="#ffffff20" strokeWidth={0.6}
                />
                <polygon
                  points={`${STEPS[i + 1].x - 13},${STEPS[i + 1].y - 2} ${STEPS[i + 1].x - 11},${STEPS[i + 1].y} ${STEPS[i + 1].x - 13},${STEPS[i + 1].y + 2}`}
                  fill="#ffffff30"
                />
              </>
            )}
          </g>
        ))}
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
          각 장비를 호버하여 상세 확인. 진공 배기 → 가스 충전 → 게터 활성화 → 팁오프의 통합 공정.
        </figcaption>
      )}
    </figure>
  );
}
