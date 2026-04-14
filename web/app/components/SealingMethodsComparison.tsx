"use client";

import { useState } from "react";

const METHODS = [
  {
    id: "traditional",
    label: "전통 토치 봉착",
    temp: "800-1000°C",
    skill: "매우 높음",
    cost: "₩2,500K+",
    equipment: "토치 + 전기로 + 펌프",
    lifetime: "10,000h+",
    color: "#ef4444",
    difficulty: 95,
    sections: [
      { label: "유리관", color: "#7B9EB8", h: 35 },
      { label: "유리 용융부", color: "#ef4444", h: 8, dashed: false },
      { label: "금속 핀", color: "#C17B5E", h: 10, isPins: true },
    ],
    desc: "유리를 직접 토치로 녹여 금속 핀 주변에 봉착. Dalibor Farny도 마스터에 2년+. 아마추어 최대 병목.",
  },
  {
    id: "frit",
    label: "프릿 실링 (PDP)",
    temp: "450°C",
    skill: "중간",
    cost: "₩387-462K",
    equipment: "미니가마+Arduino (자택)",
    lifetime: "10,000h+",
    color: "#D4A853",
    difficulty: 50,
    sections: [
      { label: "유리관", color: "#7B9EB8", h: 35 },
      { label: "프릿 유리층", color: "#D4A853", h: 8, dashed: false },
      { label: "듀멧 와이어", color: "#C17B5E", h: 10, isPins: true },
    ],
    desc: "Bi₂O₃ 저융점 프릿을 450°C에서 용융. 토치 불필요. PDP 산업에서 20년간 검증. 듀멧 와이어 매립 봉착.",
  },
  {
    id: "butyl",
    label: "부틸 상온 봉착 (IGU)",
    temp: "상온~200°C",
    skill: "낮음",
    cost: "₩185K",
    equipment: "없음",
    lifetime: "~2,400h",
    color: "#6BA368",
    difficulty: 15,
    sections: [
      { label: "유리 돔", color: "#7B9EB8", h: 35 },
      { label: "부틸 + Torr Seal", color: "#6BA368", h: 10, dashed: false },
      { label: "커스텀 12핀 기밀 헤더", color: "#B8A9C9", h: 12, isPins: true },
    ],
    desc: "부틸 내층(CTE 흡수 + 가스차단) + Torr Seal 외층(UHV 가스 차단) 복합 실링. 장비 불필요. 즉시 시작 가능.",
  },
];

export default function SealingMethodsComparison() {
  const [active, setActive] = useState<number>(1);

  const svgW = 520;
  const svgH = 200;
  const colW = 150;
  const gap = 20;
  const startX = (svgW - (colW * 3 + gap * 2)) / 2;

  return (
    <figure className="my-8">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-2xl mx-auto" xmlns="http://www.w3.org/2000/svg">
        <rect width={svgW} height={svgH} fill="#111116" rx="8" stroke="#ffffff10" strokeWidth="0.5" />

        <text x={svgW / 2} y={16} fill="#e8e8e8" fontSize="10" fontWeight="bold" textAnchor="middle">
          3가지 봉착 방식 비교
        </text>

        {METHODS.map((m, i) => {
          const x = startX + i * (colW + gap);
          const isActive = active === i;
          const c = m.color;

          return (
            <g key={m.id} onMouseEnter={() => setActive(i)} style={{ cursor: "pointer" }}>
              {/* Column background */}
              <rect x={x} y={25} width={colW} height={160} rx={6}
                fill={isActive ? c + "12" : c + "08"}
                stroke={isActive ? c + "60" : c + "25"}
                strokeWidth={isActive ? 1.5 : 0.6} />

              {/* Title */}
              <text x={x + colW / 2} y={40} fill={isActive ? c : c + "cc"} fontSize="7" fontWeight="bold" textAnchor="middle">
                {m.label}
              </text>

              {/* Cross-section illustration */}
              {(() => {
                let cy = 50;
                return m.sections.map((s, si) => {
                  const el = (
                    <g key={si}>
                      {s.isPins ? (
                        // Pins / header
                        <g>
                          <rect x={x + 15} y={cy} width={colW - 30} height={s.h} rx={2}
                            fill={s.color + "25"} stroke={s.color + "60"} strokeWidth={0.8} />
                          {[0, 1, 2, 3, 4].map((pi) => (
                            <line key={pi} x1={x + 30 + pi * 22} y1={cy} x2={x + 30 + pi * 22} y2={cy + s.h + 8}
                              stroke={s.color + "70"} strokeWidth={1} />
                          ))}
                          <text x={x + colW / 2} y={cy + s.h / 2 + 3} fill={s.color + "90"} fontSize="5" textAnchor="middle">
                            {s.label}
                          </text>
                        </g>
                      ) : (
                        // Seal layer
                        <g>
                          <rect x={x + 15} y={cy} width={colW - 30} height={s.h} rx={s.h > 20 ? 4 : 1}
                            fill={s.color + (s.h > 20 ? "18" : "35")}
                            stroke={s.color + "70"} strokeWidth={s.dashed === false ? 1 : 0.5}
                            strokeDasharray={s.dashed ? "3 2" : "none"} />
                          <text x={x + colW / 2} y={cy + s.h / 2 + (s.h > 20 ? 3 : 3)} fill={s.color + "aa"} fontSize="5" textAnchor="middle">
                            {s.label}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                  cy += s.h + 3;
                  return el;
                });
              })()}

              {/* Temperature badge */}
              <rect x={x + 10} y={110} width={colW - 20} height={16} rx={3}
                fill={c + "15"} stroke={c + "35"} strokeWidth={0.5} />
              <text x={x + colW / 2} y={121} fill={c} fontSize="8" fontWeight="bold" textAnchor="middle">
                {m.temp}
              </text>

              {/* Difficulty bar */}
              <rect x={x + 15} y={133} width={colW - 30} height={4} rx={2} fill="#ffffff08" />
              <rect x={x + 15} y={133} width={(colW - 30) * m.difficulty / 100} height={4} rx={2} fill={c + "60"} />
              <text x={x + colW / 2} y={146} fill="#888" fontSize="5" textAnchor="middle">
                난이도 {m.difficulty}%
              </text>

              {/* Cost */}
              <text x={x + colW / 2} y={160} fill={c + "cc"} fontSize="7" fontWeight="bold" textAnchor="middle">
                {m.cost}
              </text>

              {/* Equipment */}
              <text x={x + colW / 2} y={172} fill="#666" fontSize="5" textAnchor="middle">
                {m.equipment}
              </text>

              {/* Lifetime */}
              <text x={x + colW / 2} y={182} fill="#555" fontSize="5" textAnchor="middle">
                수명: {m.lifetime}
              </text>
            </g>
          );
        })}
      </svg>

      <div
        className="max-w-2xl mx-auto mt-2 rounded-lg border p-3 transition-all"
        style={{ borderColor: METHODS[active].color + "55", backgroundColor: METHODS[active].color + "15" }}
      >
        <div className="text-sm font-medium" style={{ color: METHODS[active].color }}>{METHODS[active].label}</div>
        <p className="text-xs text-stone-400 mt-1">{METHODS[active].desc}</p>
      </div>
    </figure>
  );
}
