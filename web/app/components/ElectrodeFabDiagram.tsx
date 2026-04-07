"use client";

import { useState } from "react";

const STEPS = [
  {
    id: "foil",
    label: "니켈 포일",
    detail: "전해 니켈 포일 0.2mm, 99.5%+. 10×10cm 시트에서 여러 전극 커팅 가능.",
    color: "#B8A9C9",
  },
  {
    id: "mask",
    label: "마스킹",
    detail: "레이저 프린터로 숫자 패턴 출력 → 포일에 전사. 또는 네일 폴리시로 직접 마스킹.",
    color: "#D4A853",
  },
  {
    id: "cut",
    label: "커팅/에칭",
    detail: "옵션 A: 메이커스페이스 레이저 커터 (정밀). 옵션 B: FeCl₃ 화학 에칭 (자택 가능).",
    color: "#ef8f44",
  },
  {
    id: "finish",
    label: "완성 전극",
    detail: "디버링(#1000 사포) → IPA 세척 → 건조. 리드선 납땜 후 TO-8 헤더에 장착.",
    color: "#6BA368",
  },
];

export default function ElectrodeFabDiagram() {
  const [active, setActive] = useState<number>(0);

  const svgW = 560;
  const svgH = 200;
  const stepW = 120;
  const gap = 16;
  const startX = (svgW - (stepW * 4 + gap * 3)) / 2;

  return (
    <figure className="my-8">
      <svg
        viewBox={`0 0 ${svgW} ${svgH}`}
        className="w-full max-w-2xl mx-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width={svgW} height={svgH} fill="#111116" rx="8" stroke="#ffffff10" strokeWidth="0.5" />

        <text x={svgW / 2} y={20} fill="#e8e8e8" fontSize="11" fontWeight="bold" textAnchor="middle">
          전극 제작 공정
        </text>

        {STEPS.map((step, i) => {
          const x = startX + i * (stepW + gap);
          const isActive = active === i;
          const c = step.color;

          return (
            <g
              key={step.id}
              onMouseEnter={() => setActive(i)}
              style={{ cursor: "pointer" }}
            >
              {/* Card background */}
              <rect
                x={x} y={35} width={stepW} height={130}
                rx={6}
                fill={isActive ? c + "25" : c + "18"}
                stroke={isActive ? c + "78" : c + "40"}
                strokeWidth={isActive ? 1.5 : 0.8}
              />

              {/* Step number */}
              <circle cx={x + 16} cy={50} r={9} fill={c + "40"} stroke={c + "65"} strokeWidth={1} />
              <text x={x + 16} y={54} fill={c} fontSize="9" fontWeight="bold" textAnchor="middle">
                {i + 1}
              </text>

              {/* Step label */}
              <text x={x + stepW / 2} y={52} fill={isActive ? c : "#aaa"} fontSize="9" fontWeight="bold" textAnchor="middle" dx={12}>
                {step.label}
              </text>

              {/* Illustration area */}
              {step.id === "foil" && (
                <g>
                  {/* Flat nickel sheet */}
                  <rect x={x + 20} y={70} width={80} height={50} rx={2}
                    fill={c + "40"} stroke={c} strokeWidth={1.2} />
                  <text x={x + 60} y={96} fill={c} fontSize="8" fontWeight="bold" textAnchor="middle">Ni 99.5%</text>
                  <text x={x + 60} y={108} fill={c} fontSize="7" textAnchor="middle" opacity={0.8}>0.2mm</text>
                  {/* Grain texture lines */}
                  {[75, 82, 89, 96, 103, 110].map((ly, j) => (
                    <line key={j} x1={x + 22} y1={ly} x2={x + 98} y2={ly} stroke={c + "35"} strokeWidth={0.6} />
                  ))}
                </g>
              )}

              {step.id === "mask" && (
                <g>
                  {/* Nickel with number "8" mask */}
                  <rect x={x + 20} y={70} width={80} height={50} rx={2}
                    fill="#B8A9C922" stroke="#B8A9C945" strokeWidth={0.8} />
                  {/* Number "8" pattern */}
                  <text x={x + 60} y={104} fill={c} fontSize="28" fontWeight="bold" textAnchor="middle" opacity={0.9}>
                    8
                  </text>
                  {/* Mask overlay indicator */}
                  <rect x={x + 30} y={73} width={60} height={44} rx={1}
                    fill="none" stroke={c + "78"} strokeWidth={0.8} strokeDasharray="3 2" />
                  <text x={x + 60} y={132} fill={c + "80"} fontSize="6" textAnchor="middle">패턴 마스크</text>
                </g>
              )}

              {step.id === "cut" && (
                <g>
                  {/* Laser beam or etch */}
                  <rect x={x + 20} y={70} width={80} height={50} rx={2}
                    fill="#B8A9C918" stroke="#B8A9C935" strokeWidth={0.5} />
                  {/* Number "8" being cut - with glow */}
                  <text x={x + 60} y={104} fill={c} fontSize="28" fontWeight="bold" textAnchor="middle" opacity={0.9}>
                    8
                  </text>
                  {/* Cut lines / sparks */}
                  <line x1={x + 42} y1={66} x2={x + 48} y2={78} stroke={c} strokeWidth={1.5} opacity={0.8} />
                  <line x1={x + 44} y1={67} x2={x + 50} y2={76} stroke="#fff" strokeWidth={0.5} opacity={0.8} />
                  {/* Removed material (faded background) */}
                  {[75, 82, 89, 96, 103, 110].map((ly, j) => (
                    <line key={j} x1={x + 22} y1={ly} x2={x + 38} y2={ly} stroke={c + "30"} strokeWidth={0.5} />
                  ))}
                  <text x={x + 60} y={132} fill={c + "80"} fontSize="6" textAnchor="middle">레이저/FeCl₃</text>
                </g>
              )}

              {step.id === "finish" && (
                <g>
                  {/* Finished electrode with lead wire */}
                  <text x={x + 60} y={100} fill={c} fontSize="30" fontWeight="bold" textAnchor="middle" opacity={0.9}>
                    8
                  </text>
                  {/* Glow effect */}
                  <text x={x + 60} y={100} fill={c} fontSize="30" fontWeight="bold" textAnchor="middle" opacity={0.6} filter="url(#glow)">
                    8
                  </text>
                  {/* Lead wire */}
                  <line x1={x + 60} y1={110} x2={x + 60} y2={145} stroke={c + "80"} strokeWidth={1.5} />
                  <circle cx={x + 60} cy={147} r={2} fill={c + "78"} />
                  <text x={x + 60} y={160} fill={c + "78"} fontSize="6" textAnchor="middle">리드선</text>
                </g>
              )}

              {/* Arrow between steps */}
              {i < 3 && (
                <g>
                  <line
                    x1={x + stepW + 2} y1={100} x2={x + stepW + gap - 2} y2={100}
                    stroke="#555" strokeWidth={1}
                  />
                  <polygon
                    points={`${x + stepW + gap - 2},96 ${x + stepW + gap + 2},100 ${x + stepW + gap - 2},104`}
                    fill="#555"
                  />
                </g>
              )}
            </g>
          );
        })}

        {/* Glow filter */}
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
          </filter>
        </defs>

        <text x={svgW / 2} y={svgH - 8} fill="#666" fontSize="8" textAnchor="middle">
          소요 시간: ~2시간 | 장소: 메이커스페이스(레이저) 또는 자택(에칭)
        </text>
      </svg>

      {/* Info panel */}
      <div
        className="max-w-2xl mx-auto mt-2 rounded-lg border p-3 transition-all duration-200"
        style={{
          borderColor: STEPS[active].color + "55",
          backgroundColor: STEPS[active].color + "18",
        }}
      >
        <div className="flex items-center gap-2">
          <span
            className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
            style={{ backgroundColor: STEPS[active].color + "40", color: STEPS[active].color }}
          >
            {active + 1}
          </span>
          <span className="text-sm font-medium" style={{ color: STEPS[active].color }}>
            {STEPS[active].label}
          </span>
        </div>
        <p className="text-xs text-stone-400 mt-1">{STEPS[active].detail}</p>
      </div>
    </figure>
  );
}
