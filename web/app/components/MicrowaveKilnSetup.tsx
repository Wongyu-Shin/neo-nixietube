"use client";

import { useState, useEffect } from "react";

const PARTS = [
  { id: "microwave", label: "전자레인지", detail: "700W+ 다이얼식. 중고 ₩0~30K. SSR이 전원 on/off 제어.", color: "#7B9EB8" },
  { id: "kiln", label: "미니가마 (SiC 서셉터)", detail: "내부 ∅110mm × 45mm. SiC가 마이크로파 흡수 → 열로 변환. 최대 900°C.", color: "#ef8f44" },
  { id: "tube", label: "닉시관 (프릿 봉착 대상)", detail: "유리관 OD 25-30mm + 프릿 페이스트 + 듀멧 와이어. 가마 내부에 배치.", color: "#D4A853" },
  { id: "thermocouple", label: "K-type 열전대", detail: "차폐형. 가마 뚜껑 관통 → 관 표면 온도 측정. MAX6675으로 디지털 변환.", color: "#6BA368" },
  { id: "arduino", label: "Arduino PID 컨트롤러", detail: "MAX6675 → 온도 읽기 → PID 계산 → SSR 제어. 소성 프로파일 프로그래밍.", color: "#B8A9C9" },
  { id: "ssr", label: "SSR (Solid State Relay)", detail: "25A. Arduino 신호로 전자레인지 전원 on/off. PID 듀티 사이클 제어.", color: "#C17B5E" },
];

export default function MicrowaveKilnSetup() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [temp, setTemp] = useState(25);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPhase(p => (p + 1) % 100);
    }, 150);
    return () => clearInterval(timer);
  }, []);

  // Simulate temperature profile
  const profileTemp = phase < 25 ? 25 + (phase / 25) * 325 // ramp to 350
    : phase < 45 ? 350 // hold at 350
    : phase < 55 ? 350 + ((phase - 45) / 10) * 100 // ramp to 450
    : phase < 75 ? 450 // hold at 450
    : 450 - ((phase - 75) / 25) * 425; // cool down

  const activePart = PARTS.find(p => p.id === hovered);
  const svgW = 480;
  const svgH = 280;

  return (
    <figure className="my-8">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-xl mx-auto" xmlns="http://www.w3.org/2000/svg">
        <rect width={svgW} height={svgH} fill="#111116" rx="8" stroke="#ffffff10" strokeWidth="0.5" />

        <text x={svgW / 2} y={18} fill="#e8e8e8" fontSize="10" fontWeight="bold" textAnchor="middle">
          전자레인지 미니가마 + Arduino PID 셋업
        </text>

        {/* === Microwave box === */}
        <g onMouseEnter={() => setHovered("microwave")} onMouseLeave={() => setHovered(null)} style={{ cursor: "pointer" }}>
          <rect x={30} y={40} width={200} height={140} rx={8}
            fill={hovered === "microwave" ? "#7B9EB818" : "#7B9EB810"}
            stroke={hovered === "microwave" ? "#7B9EB8" : "#7B9EB860"} strokeWidth={1.2} />
          {/* Door window */}
          <rect x={40} y={50} width={120} height={100} rx={4}
            fill="#ffffff06" stroke="#ffffff15" strokeWidth={0.5} />
          {/* Controls */}
          <rect x={170} y={60} width={50} height={20} rx={3}
            fill="#7B9EB815" stroke="#7B9EB840" strokeWidth={0.5} />
          <text x={195} y={73} fill="#7B9EB8" fontSize="6" textAnchor="middle">POWER</text>
          <circle cx={195} cy={95} r={10} fill="#7B9EB810" stroke="#7B9EB850" strokeWidth={0.5} />
          <text x={195} y={98} fill="#7B9EB8" fontSize="7" textAnchor="middle">다이얼</text>
          <text x={130} y={190} fill="#7B9EB8" fontSize="7" textAnchor="middle" opacity={0.8}>전자레인지</text>
        </g>

        {/* === Mini Kiln inside microwave === */}
        <g onMouseEnter={() => setHovered("kiln")} onMouseLeave={() => setHovered(null)} style={{ cursor: "pointer" }}>
          {/* Kiln body (dome shape) */}
          <path d="M 70 140 L 70 90 Q 70 70 100 70 Q 130 70 130 90 L 130 140"
            fill={hovered === "kiln" ? "#ef8f4425" : "#ef8f4415"}
            stroke={hovered === "kiln" ? "#ef8f44" : "#ef8f4480"} strokeWidth={1.2} />
          {/* Kiln base */}
          <rect x={65} y={140} width={70} height={8} rx={2}
            fill="#ef8f4420" stroke="#ef8f4460" strokeWidth={0.8} />
          {/* SiC label */}
          <text x={100} y={85} fill="#ef8f44" fontSize="7" fontWeight="bold" textAnchor="middle">SiC</text>
          {/* Heat glow (animated) */}
          {profileTemp > 200 && (
            <circle cx={100} cy={115} r={15 + (profileTemp / 100)} fill="#ef8f44"
              opacity={Math.min(0.15, profileTemp / 3000)} />
          )}
        </g>

        {/* === Tube inside kiln === */}
        <g onMouseEnter={() => setHovered("tube")} onMouseLeave={() => setHovered(null)} style={{ cursor: "pointer" }}>
          <rect x={88} y={105} width={24} height={30} rx={3}
            fill={hovered === "tube" ? "#D4A85340" : "#D4A85320"}
            stroke={hovered === "tube" ? "#D4A853" : "#D4A85370"} strokeWidth={0.8} />
          <text x={100} y={124} fill="#D4A853" fontSize="7" textAnchor="middle">관</text>
        </g>

        {/* === Thermocouple wire === */}
        <g onMouseEnter={() => setHovered("thermocouple")} onMouseLeave={() => setHovered(null)} style={{ cursor: "pointer" }}>
          <path d="M 100 70 L 100 60 L 140 50 L 240 50"
            fill="none" stroke={hovered === "thermocouple" ? "#6BA368" : "#6BA36880"}
            strokeWidth={1.5} strokeDasharray="4 2" />
          <circle cx={100} cy={70} r={3} fill="#6BA368" />
          <text x={155} y={45} fill="#6BA368" fontSize="7" textAnchor="middle">K-type 열전대</text>
        </g>

        {/* === Arduino board === */}
        <g onMouseEnter={() => setHovered("arduino")} onMouseLeave={() => setHovered(null)} style={{ cursor: "pointer" }}>
          <rect x={280} y={35} width={80} height={50} rx={4}
            fill={hovered === "arduino" ? "#B8A9C925" : "#B8A9C912"}
            stroke={hovered === "arduino" ? "#B8A9C9" : "#B8A9C970"} strokeWidth={1} />
          <text x={320} y={55} fill="#B8A9C9" fontSize="7" fontWeight="bold" textAnchor="middle">Arduino</text>
          <text x={320} y={67} fill="#B8A9C9" fontSize="7" textAnchor="middle" opacity={0.8}>PID Control</text>
          {/* MAX6675 */}
          <rect x={255} y={42} width={22} height={12} rx={2}
            fill="#6BA36815" stroke="#6BA36850" strokeWidth={0.5} />
          <text x={266} y={51} fill="#6BA368" fontSize="6" textAnchor="middle">MAX</text>
          {/* Wire from thermocouple to MAX */}
          <line x1={240} y1={50} x2={255} y2={48} stroke="#6BA36860" strokeWidth={1} />
        </g>

        {/* === SSR === */}
        <g onMouseEnter={() => setHovered("ssr")} onMouseLeave={() => setHovered(null)} style={{ cursor: "pointer" }}>
          <rect x={300} y={110} width={60} height={30} rx={4}
            fill={hovered === "ssr" ? "#C17B5E25" : "#C17B5E12"}
            stroke={hovered === "ssr" ? "#C17B5E" : "#C17B5E70"} strokeWidth={1} />
          <text x={330} y={128} fill="#C17B5E" fontSize="6" fontWeight="bold" textAnchor="middle">SSR</text>
          <text x={330} y={137} fill="#C17B5E" fontSize="6" textAnchor="middle" opacity={0.7}>25A</text>
          {/* Wire from Arduino to SSR */}
          <line x1={320} y1={85} x2={320} y2={110} stroke="#B8A9C960" strokeWidth={1} />
          <text x={312} y={100} fill="#B8A9C9" fontSize="6" textAnchor="end">PID →</text>
          {/* Wire from SSR to microwave power */}
          <path d="M 300 125 L 230 125 L 230 140" fill="none" stroke="#C17B5E60" strokeWidth={1.5} />
          <text x={260} y={120} fill="#C17B5E" fontSize="6" textAnchor="middle">전원 on/off</text>
        </g>

        {/* === Temperature profile (bottom) === */}
        <g>
          <rect x={30} y={200} width={420} height={65} rx={4} fill="#ffffff04" stroke="#ffffff10" strokeWidth={0.5} />
          <text x={40} y={215} fill="#e8e8e8" fontSize="6" fontWeight="bold">소성 프로파일 (실시간)</text>

          {/* Profile line */}
          <polyline
            points="50,255 110,235 170,235 200,225 260,225 340,255"
            fill="none" stroke="#D4A85360" strokeWidth={1} />

          {/* Phase labels */}
          <text x={80} y={248} fill="#D4A853" fontSize="6" textAnchor="middle">승온</text>
          <text x={140} y={230} fill="#C17B5E" fontSize="6" textAnchor="middle">350°C 유지</text>
          <text x={185} y={221} fill="#D4A853" fontSize="6" textAnchor="middle">승온</text>
          <text x={230} y={220} fill="#ef4444" fontSize="6" textAnchor="middle" fontWeight="bold">450°C 유지</text>
          <text x={310} y={240} fill="#7B9EB8" fontSize="6" textAnchor="middle">서냉</text>

          {/* Current temp indicator */}
          {(() => {
            const px = 50 + (phase / 100) * 290;
            const py = 255 - ((profileTemp - 25) / 450) * 35;
            return (
              <g>
                <circle cx={px} cy={py} r={3} fill="#ef8f44" />
                <text x={px} y={py - 7} fill="#ef8f44" fontSize="6" fontWeight="bold" textAnchor="middle">
                  {Math.round(profileTemp)}°C
                </text>
              </g>
            );
          })()}

          {/* Y axis */}
          <text x={45} y={225} fill="#666" fontSize="6" textAnchor="end">450</text>
          <text x={45} y={235} fill="#666" fontSize="6" textAnchor="end">350</text>
          <text x={45} y={255} fill="#666" fontSize="6" textAnchor="end">25</text>
        </g>

        {/* Cost badge */}
        <rect x={380} y={165} width={80} height={28} rx={4} fill="#6BA36815" stroke="#6BA36840" strokeWidth={0.5} />
        <text x={420} y={178} fill="#6BA368" fontSize="7" fontWeight="bold" textAnchor="middle">₩71K</text>
        <text x={420} y={188} fill="#6BA368" fontSize="6" textAnchor="middle" opacity={0.7}>전체 비용</text>
      </svg>

      {activePart ? (
        <div className="max-w-xl mx-auto mt-2 rounded-lg border p-3 transition-all"
          style={{ borderColor: activePart.color + "55", backgroundColor: activePart.color + "15" }}>
          <div className="text-sm font-medium" style={{ color: activePart.color }}>{activePart.label}</div>
          <p className="text-xs text-stone-400 mt-1">{activePart.detail}</p>
        </div>
      ) : (
        <figcaption className="text-center text-stone-500 text-xs mt-2">
          각 부품을 호버하여 역할 확인. Arduino PID가 전자레인지 전원을 제어하여 정밀 소성 프로파일 구현.
        </figcaption>
      )}
    </figure>
  );
}
