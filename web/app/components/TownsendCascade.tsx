"use client";

import { useState, useEffect } from "react";

export default function TownsendCascade() {
  const [step, setStep] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!auto) return;
    const t = setInterval(() => setStep(s => (s + 1) % 5), 1200);
    return () => clearInterval(t);
  }, [auto]);

  const svgW = 400;
  const svgH = 160;

  const stages = [
    { label: "초기 전자", desc: "우주선 또는 자연 방사선으로 가스 원자에서 자유 전자 1개 발생", electrons: [[100, 50]], ions: [] },
    { label: "1차 충돌", desc: "전자가 전기장에서 가속 → 가스 원자와 충돌 → 이온화 → 전자 2개", electrons: [[140, 40], [140, 60]], ions: [[130, 50]] },
    { label: "2차 충돌", desc: "2개의 전자가 각각 충돌 → 4개의 전자 + 추가 이온 생성", electrons: [[180, 30], [180, 45], [180, 55], [180, 70]], ions: [[130, 50], [165, 42], [165, 58]] },
    { label: "전자사태", desc: "기하급수적 증가 → 전자사태(electron avalanche). 1개 → 2 → 4 → 8 → ...", electrons: [[220, 25], [220, 35], [220, 42], [220, 50], [220, 58], [220, 65], [220, 72], [220, 80]], ions: [[130, 50], [165, 42], [165, 58], [200, 30], [200, 48], [200, 62], [200, 75]] },
    { label: "자속 방전", desc: "이온이 음극 충돌 → 2차 전자 방출(γ) → 새로운 전자사태 시작 → 자속(self-sustaining) 방전", electrons: [[100, 50], [220, 25], [220, 35], [220, 50], [220, 65], [220, 80]], ions: [[130, 50], [165, 42], [165, 58], [200, 30], [200, 62]], feedback: true },
  ];

  const current = stages[step];
  const eColor = "#7B9EB8";
  const ionColor = "#ef8f44";

  return (
    <figure className="my-8">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-lg mx-auto" xmlns="http://www.w3.org/2000/svg">
        <rect width={svgW} height={svgH} fill="#111116" rx="8" stroke="#ffffff10" strokeWidth="0.5" />

        <text x={svgW / 2} y={16} fill="#e8e8e8" fontSize="10" fontWeight="bold" textAnchor="middle">
          타운센드 전자사태 메커니즘
        </text>

        {/* Cathode */}
        <rect x={50} y={22} width={8} height={76} rx={2} fill="#ef8f4430" stroke="#ef8f4470" strokeWidth={1} />
        <text x={54} y={110} fill="#ef8f44" fontSize="6" textAnchor="middle">음극 (-)</text>

        {/* Anode */}
        <rect x={290} y={22} width={8} height={76} rx={2} fill="#6BA36830" stroke="#6BA36870" strokeWidth={1} />
        <text x={294} y={110} fill="#6BA368" fontSize="6" textAnchor="middle">양극 (+)</text>

        {/* E-field arrows */}
        {[100, 150, 200, 250].map((ax, i) => (
          <g key={i}>
            <line x1={ax} y1={95} x2={ax + 30} y2={95} stroke="#ffffff15" strokeWidth={0.5} />
            <polygon points={`${ax + 28},93 ${ax + 33},95 ${ax + 28},97`} fill="#ffffff20" />
          </g>
        ))}
        <text x={svgW / 2} y={105} fill="#555" fontSize="5" textAnchor="middle">전기장 방향 →</text>

        {/* Electrons */}
        {current.electrons.map(([ex, ey], i) => (
          <g key={`e${i}`}>
            <circle cx={ex} cy={ey} r={4} fill={eColor + "50"} stroke={eColor} strokeWidth={1} />
            <text x={ex} y={ey + 2.5} fill={eColor} fontSize="5" fontWeight="bold" textAnchor="middle">e⁻</text>
          </g>
        ))}

        {/* Ions */}
        {current.ions.map(([ix, iy], i) => (
          <g key={`i${i}`}>
            <circle cx={ix} cy={iy} r={5} fill={ionColor + "30"} stroke={ionColor + "80"} strokeWidth={0.8} />
            <text x={ix} y={iy + 3} fill={ionColor + "cc"} fontSize="5" fontWeight="bold" textAnchor="middle">+</text>
          </g>
        ))}

        {/* Feedback arrow (step 5) */}
        {current.feedback && (
          <g>
            <path d="M 130 55 Q 90 90 60 60" fill="none" stroke="#ef8f44" strokeWidth={1} strokeDasharray="3 2" />
            <polygon points="62,56 56,60 62,64" fill="#ef8f44" />
            <text x={80} y={88} fill="#ef8f44" fontSize="5" textAnchor="middle" fontWeight="bold">γ 방출</text>
          </g>
        )}

        {/* Step indicator */}
        <g>
          {stages.map((_, i) => (
            <circle key={i} cx={340 + i * 12} cy={30} r={4}
              fill={i === step ? "#D4A853" : "#333"}
              stroke={i === step ? "#D4A853" : "#555"} strokeWidth={0.8}
              onClick={() => { setAuto(false); setStep(i); }}
              style={{ cursor: "pointer" }} />
          ))}
          <text x={370} y={44} fill="#888" fontSize="5" textAnchor="middle">{step + 1}/5</text>
        </g>

        {/* Legend */}
        <g>
          <circle cx={330} cy={60} r={3} fill={eColor + "50"} stroke={eColor} strokeWidth={0.5} />
          <text x={338} y={63} fill={eColor} fontSize="5">전자</text>
          <circle cx={330} cy={73} r={3.5} fill={ionColor + "30"} stroke={ionColor + "80"} strokeWidth={0.5} />
          <text x={338} y={76} fill={ionColor} fontSize="5">이온</text>
        </g>

        <text x={svgW / 2} y={svgH - 4} fill="#666" fontSize="6" textAnchor="middle">
          단계 {step + 1}: {current.label} — 자동 재생 중 (원 클릭으로 단계 선택)
        </text>
      </svg>

      <div className="max-w-lg mx-auto mt-2 rounded-lg border p-3 transition-all"
        style={{ borderColor: "#D4A85355", backgroundColor: "#D4A85315" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[#D4A853]">{current.label}</span>
          <span className="text-[10px] text-stone-500">Step {step + 1}/5</span>
        </div>
        <p className="text-xs text-stone-400 mt-1">{current.desc}</p>
      </div>
    </figure>
  );
}
