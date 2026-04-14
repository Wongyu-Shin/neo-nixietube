"use client";

import { useState } from "react";

type Experiment = {
  id: string;
  label: string;
  goal: string;
  pass: string;
  location: string;
  color: string;
};

const EXPERIMENTS: Experiment[] = [
  { id: "a", label: "실험 A: 부틸 기밀 테스트", goal: "부틸+Torr Seal 복합 봉착의 기밀 유지 확인",
    pass: "24h 후 시각적 변화 없음", location: "자택", color: "#6BA368" },
  { id: "b", label: "실험 B: 프릿 기밀 테스트", goal: "프릿 봉착 + 듀멧 매립의 기밀 확인",
    pass: "압력 변화 < 1 Torr/h", location: "자택 (미니가마) + 대학 (펌프)", color: "#D4A853" },
  { id: "c", label: "실험 C: 네온 플러싱 순도", goal: "MAP 방식으로 O₂ < 0.5% 달성",
    pass: "O₂ < 0.5% (3회 사이클)", location: "자택", color: "#7B9EB8" },
];

function SetupIllustration({ exp, w, h }: { exp: Experiment; w: number; h: number }) {
  const c = exp.color;
  const cx = w / 2;

  switch (exp.id) {
    case "a":
      return (
        <g>
          {/* Glass tube */}
          <rect x={cx - 25} y={20} width={50} height={60} rx={4}
            fill="#7B9EB820" stroke="#7B9EB870" strokeWidth={1} />
          <text x={cx} y={55} fill="#7B9EB8" fontSize="6" textAnchor="middle">유리관</text>
          {/* Top disc with butyl */}
          <rect x={cx - 28} y={14} width={56} height={8} rx={2}
            fill={c + "40"} stroke={c} strokeWidth={0.8} />
          <text x={cx} y={11} fill={c} fontSize="5" textAnchor="middle">부틸 봉착</text>
          {/* Bottom disc with butyl */}
          <rect x={cx - 28} y={80} width={56} height={8} rx={2}
            fill={c + "40"} stroke={c} strokeWidth={0.8} />
          {/* Exhaust tube + syringe */}
          <rect x={cx + 28} y={40} width={25} height={6} rx={1}
            fill="#ffffff10" stroke="#ffffff30" strokeWidth={0.5} />
          <rect x={cx + 55} y={35} width={15} height={16} rx={2}
            fill="#ffffff10" stroke="#ffffff30" strokeWidth={0.5} />
          <text x={cx + 62} y={30} fill="#888" fontSize="5" textAnchor="middle">주사기</text>
          {/* 24h clock */}
          <circle cx={30} cy={55} r={12} fill={c + "15"} stroke={c + "50"} strokeWidth={0.8} />
          <text x={30} y={58} fill={c} fontSize="7" fontWeight="bold" textAnchor="middle">24h</text>
          <text x={30} y={75} fill="#888" fontSize="5" textAnchor="middle">대기</text>
          {/* Pass indicator */}
          <rect x={cx - 35} y={h - 18} width={70} height={14} rx={3} fill={c + "20"} stroke={c + "50"} strokeWidth={0.5} />
          <text x={cx} y={h - 9} fill={c} fontSize="5" fontWeight="bold" textAnchor="middle">PASS: 변화 없음</text>
        </g>
      );
    case "b":
      return (
        <g>
          {/* Sealed tube (with frit) */}
          <rect x={cx - 20} y={15} width={40} height={50} rx={3}
            fill="#7B9EB820" stroke="#7B9EB870" strokeWidth={0.8} />
          {/* Frit seal line */}
          <rect x={cx - 22} y={13} width={44} height={5} rx={1}
            fill={c + "45"} stroke={c} strokeWidth={0.8} />
          <text x={cx} y={40} fill="#7B9EB8" fontSize="5" textAnchor="middle">프릿 관</text>
          {/* Vacuum hose to pump */}
          <line x1={cx + 20} y1={35} x2={cx + 50} y2={35} stroke={c + "60"} strokeWidth={2} />
          {/* Pump */}
          <rect x={cx + 50} y={25} width={30} height={22} rx={3}
            fill={c + "25"} stroke={c + "70"} strokeWidth={0.8} />
          <text x={cx + 65} y={38} fill={c} fontSize="5" fontWeight="bold" textAnchor="middle">펌프</text>
          <text x={cx + 65} y={55} fill="#888" fontSize="4" textAnchor="middle">10⁻² Torr</text>
          {/* Gauge */}
          <circle cx={35} cy={35} r={14} fill={c + "15"} stroke={c + "50"} strokeWidth={0.8} />
          <text x={35} y={33} fill={c} fontSize="5" fontWeight="bold" textAnchor="middle">P</text>
          <text x={35} y={41} fill={c + "80"} fontSize="4" textAnchor="middle">게이지</text>
          <line x1={49} y1={35} x2={cx - 20} y2={35} stroke={c + "40"} strokeWidth={1.5} />
          {/* 1h wait */}
          <text x={cx} y={78} fill="#888" fontSize="5" textAnchor="middle">펌프 차단 후 1h 유지</text>
          {/* Pass */}
          <rect x={cx - 35} y={h - 18} width={70} height={14} rx={3} fill={c + "20"} stroke={c + "50"} strokeWidth={0.5} />
          <text x={cx} y={h - 9} fill={c} fontSize="5" fontWeight="bold" textAnchor="middle">{"PASS: ΔP < 1 Torr"}</text>
        </g>
      );
    case "c":
      return (
        <g>
          {/* Open tube */}
          <rect x={cx - 20} y={15} width={40} height={45} rx={3}
            fill="#7B9EB820" stroke="#7B9EB870" strokeWidth={0.8} />
          {/* Ne in (top) */}
          <line x1={cx} y1={5} x2={cx} y2={15} stroke="#6BA368" strokeWidth={2} />
          <polygon points={`${cx - 3},8 ${cx},14 ${cx + 3},8`} fill="#6BA368" />
          <text x={cx} y={4} fill="#6BA368" fontSize="5" fontWeight="bold" textAnchor="middle">Ne</text>
          {/* Air out (bottom) */}
          <line x1={cx} y1={60} x2={cx} y2={72} stroke="#ef444480" strokeWidth={1.5} />
          <polygon points={`${cx - 2},68 ${cx},74 ${cx + 2},68`} fill="#ef444480" />
          <text x={cx} y={80} fill="#ef4444" fontSize="4" textAnchor="middle" opacity={0.7}>공기 out</text>
          {/* O2 sensor */}
          <rect x={cx + 25} y={55} width={40} height={20} rx={3}
            fill="#ef444420" stroke="#ef444460" strokeWidth={0.8} />
          <text x={cx + 45} y={65} fill="#ef4444" fontSize="5" fontWeight="bold" textAnchor="middle">O₂</text>
          <text x={cx + 45} y={72} fill="#6BA368" fontSize="6" fontWeight="bold" textAnchor="middle">0.3%</text>
          <line x1={cx + 20} y1={65} x2={cx + 25} y2={65} stroke="#ef444440" strokeWidth={1} strokeDasharray="2 1" />
          {/* 3 cycles */}
          <text x={25} y={40} fill={c} fontSize="5" textAnchor="middle">3회</text>
          <text x={25} y={50} fill={c + "80"} fontSize="4" textAnchor="middle">사이클</text>
          {/* Pass */}
          <rect x={cx - 35} y={h - 18} width={70} height={14} rx={3} fill={c + "20"} stroke={c + "50"} strokeWidth={0.5} />
          <text x={cx} y={h - 9} fill={c} fontSize="5" fontWeight="bold" textAnchor="middle">{"PASS: O₂ < 0.5%"}</text>
        </g>
      );
    default:
      return null;
  }
}

export default function ExperimentSetup() {
  const [active, setActive] = useState(0);

  return (
    <figure className="my-8">
      <div className="grid grid-cols-3 gap-3 max-w-2xl mx-auto">
        {EXPERIMENTS.map((exp, i) => {
          const isActive = active === i;
          return (
            <div
              key={exp.id}
              className="cursor-pointer rounded-lg border transition-all p-2"
              style={{
                borderColor: isActive ? exp.color + "60" : exp.color + "20",
                backgroundColor: isActive ? exp.color + "08" : "transparent",
              }}
              onMouseEnter={() => setActive(i)}
            >
              <svg viewBox="0 0 140 110" className="w-full" xmlns="http://www.w3.org/2000/svg">
                <rect width="140" height="110" fill="#111116" rx="6" stroke={isActive ? exp.color + "30" : "#ffffff08"} strokeWidth="0.5" />
                <SetupIllustration exp={exp} w={140} h={110} />
              </svg>
              <div className="text-[10px] font-medium text-center mt-1" style={{ color: exp.color }}>
                {exp.label.split(": ")[1]}
              </div>
              <div className="text-[9px] text-stone-500 text-center">{exp.location}</div>
            </div>
          );
        })}
      </div>

      <div className="max-w-2xl mx-auto mt-2 rounded-lg border p-3 transition-all"
        style={{ borderColor: EXPERIMENTS[active].color + "40", backgroundColor: EXPERIMENTS[active].color + "10" }}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium" style={{ color: EXPERIMENTS[active].color }}>{EXPERIMENTS[active].label}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: EXPERIMENTS[active].color + "20", color: EXPERIMENTS[active].color }}>
            {EXPERIMENTS[active].location}
          </span>
        </div>
        <p className="text-xs text-stone-400">{EXPERIMENTS[active].goal}</p>
        <p className="text-xs text-stone-500 mt-1">통과 기준: {EXPERIMENTS[active].pass}</p>
      </div>
    </figure>
  );
}
