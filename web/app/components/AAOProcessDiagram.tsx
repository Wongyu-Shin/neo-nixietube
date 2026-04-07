"use client";

import { useState } from "react";

const STEPS = [
  {
    id: 1,
    label: "전해연마",
    sub: "H₃PO₄ + EtOH, 20V",
    detail: "알루미늄 표면의 미세 요철을 제거하여 경면화. 균일한 나노채널 형성의 전제조건.",
    color: "#7B9EB8",
    illustration: "polish",
  },
  {
    id: 2,
    label: "1차 양극산화",
    sub: "옥살산 0.3M, 40V, 12h",
    detail: "알루미늄 표면에 비정렬 산화알루미늄(AAO) 나노채널 형성. 5-15°C 저온 유지 (아이스박스).",
    color: "#D4A853",
    illustration: "anodize1",
  },
  {
    id: 3,
    label: "산화막 제거",
    sub: "인산 에칭, 60°C, 2h",
    detail: "1차 산화막을 완전 제거. 바닥에 정렬된 오목 패턴(dimple)만 남김 — 2차 양극산화의 핵 역할.",
    color: "#C17B5E",
    illustration: "etch",
  },
  {
    id: 4,
    label: "2차 양극산화",
    sub: "동일 조건, 4h",
    detail: "오목 패턴을 따라 고도로 정렬된 나노채널 성장. 채널 직경 ~50nm, 간격 ~100nm.",
    color: "#6BA368",
    illustration: "anodize2",
  },
  {
    id: 5,
    label: "채널 확대",
    sub: "인산 5%, 30°C, 30min",
    detail: "나노채널 직경을 50nm → 70-80nm로 확대. 이후 니켈 도금이 채널 내부에 침투 가능.",
    color: "#B8A9C9",
    illustration: "widen",
  },
  {
    id: 6,
    label: "Ni 전해도금",
    sub: "Watts bath, 2-5V",
    detail: "나노채널 바닥부터 니켈이 성장하여 나노팁(nanotip) 어레이 형성. 전계 집중으로 항복전압 저감.",
    color: "#D4A853",
    illustration: "deposit",
  },
  {
    id: 7,
    label: "Al 기판 에칭",
    sub: "CuCl₂ 용액",
    detail: "배면 알루미늄 기판을 선택적 에칭. 자립형(free-standing) Ni 나노팁 어레이 음극 완성.",
    color: "#ef8f44",
    illustration: "release",
  },
];

function StepIllustration({ step, isActive }: { step: typeof STEPS[0]; isActive: boolean }) {
  const c = step.color;
  const baseOpacity = isActive ? 1 : 0.5;

  // Common: Al substrate base
  const alColor = "#B8A9C9";

  switch (step.illustration) {
    case "polish":
      return (
        <g>
          {/* Rough Al surface → smooth */}
          <rect x={0} y={20} width={60} height={25} fill={alColor + "35"} stroke={alColor + "65"} strokeWidth={0.8} rx={1} />
          {/* Rough top edge */}
          <path d="M 0 20 L 5 18 L 10 22 L 15 17 L 20 21 L 25 18 L 30 22 L 35 17 L 40 21 L 45 18 L 50 22 L 55 19 L 60 20"
            fill="none" stroke={c} strokeWidth={1} opacity={baseOpacity * 0.8} />
          {/* Arrow down = smooth */}
          <text x={30} y={14} fill={c} fontSize="5" textAnchor="middle" opacity={baseOpacity * 0.7}>거친 표면</text>
        </g>
      );
    case "anodize1":
      return (
        <g>
          {/* Al base */}
          <rect x={0} y={30} width={60} height={15} fill={alColor + "35"} stroke={alColor + "55"} strokeWidth={0.5} />
          {/* Disordered AAO channels */}
          {[5, 12, 18, 26, 32, 40, 47, 54].map((cx, i) => (
            <rect key={i} x={cx} y={8 + (i % 3) * 2} width={3} height={22 - (i % 3) * 2}
              fill={c + "35"} stroke={c + "65"} strokeWidth={0.5} rx={0.5} />
          ))}
          <text x={30} y={7} fill={c} fontSize="5" textAnchor="middle" opacity={baseOpacity * 0.7}>비정렬 채널</text>
        </g>
      );
    case "etch":
      return (
        <g>
          {/* Al base with dimples */}
          <rect x={0} y={30} width={60} height={15} fill={alColor + "35"} stroke={alColor + "55"} strokeWidth={0.5} />
          {/* Regular dimple pattern */}
          {[7, 15, 23, 31, 39, 47, 55].map((cx, i) => (
            <path key={i} d={`M ${cx - 2} 30 Q ${cx} 34 ${cx + 2} 30`}
              fill="none" stroke={c} strokeWidth={1} opacity={baseOpacity * 0.8} />
          ))}
          <text x={30} y={24} fill={c} fontSize="5" textAnchor="middle" opacity={baseOpacity * 0.7}>정렬 오목</text>
        </g>
      );
    case "anodize2":
      return (
        <g>
          {/* Al base */}
          <rect x={0} y={30} width={60} height={15} fill={alColor + "30"} stroke={alColor + "45"} strokeWidth={0.5} />
          {/* Ordered AAO channels */}
          {[7, 15, 23, 31, 39, 47, 55].map((cx, i) => (
            <rect key={i} x={cx - 1.5} y={5} width={3} height={25}
              fill={c + "40"} stroke={c + "78"} strokeWidth={0.6} rx={0.5} />
          ))}
          <text x={30} y={3} fill={c} fontSize="5" textAnchor="middle" opacity={baseOpacity * 0.7}>정렬 나노채널</text>
        </g>
      );
    case "widen":
      return (
        <g>
          {/* Al base */}
          <rect x={0} y={30} width={60} height={15} fill={alColor + "30"} stroke={alColor + "45"} strokeWidth={0.5} />
          {/* Widened channels */}
          {[7, 15, 23, 31, 39, 47, 55].map((cx, i) => (
            <rect key={i} x={cx - 2.5} y={5} width={5} height={25}
              fill={c + "35"} stroke={c + "78"} strokeWidth={0.6} rx={1} />
          ))}
          {/* Width annotation */}
          <line x1={4.5} y1={2} x2={9.5} y2={2} stroke={c} strokeWidth={0.5} />
          <text x={7} y={0} fill={c} fontSize="4" textAnchor="middle" opacity={baseOpacity * 0.7}>80nm</text>
        </g>
      );
    case "deposit":
      return (
        <g>
          {/* Al base */}
          <rect x={0} y={30} width={60} height={15} fill={alColor + "30"} stroke={alColor + "45"} strokeWidth={0.5} />
          {/* Channels with Ni deposited from bottom */}
          {[7, 15, 23, 31, 39, 47, 55].map((cx, i) => (
            <g key={i}>
              <rect x={cx - 2.5} y={5} width={5} height={25}
                fill={alColor + "22"} stroke={alColor + "45"} strokeWidth={0.4} rx={1} />
              {/* Ni fill from bottom */}
              <rect x={cx - 2} y={18} width={4} height={12}
                fill={c + "55"} stroke={c + "80"} strokeWidth={0.5} rx={0.5} />
              {/* Nanotip */}
              <circle cx={cx} cy={17} r={1.5} fill={c} opacity={baseOpacity * 0.8} />
            </g>
          ))}
          <text x={30} y={3} fill={c} fontSize="5" textAnchor="middle" opacity={baseOpacity * 0.7}>Ni 나노팁</text>
        </g>
      );
    case "release":
      return (
        <g>
          {/* No Al base - it's etched away */}
          {/* Free-standing Ni nanotip array */}
          {[7, 15, 23, 31, 39, 47, 55].map((cx, i) => (
            <g key={i}>
              {/* Ni rod */}
              <rect x={cx - 1.5} y={15} width={3} height={20}
                fill={c + "55"} stroke={c + "80"} strokeWidth={0.6} rx={0.5} />
              {/* Nanotip */}
              <circle cx={cx} cy={14} r={2} fill={c} opacity={baseOpacity * 0.9} />
            </g>
          ))}
          {/* Base plate (thin) */}
          <rect x={0} y={35} width={60} height={5} fill={c + "40"} stroke={c + "78"} strokeWidth={0.5} rx={1} />
          <text x={30} y={10} fill={c} fontSize="5" textAnchor="middle" fontWeight="bold" opacity={baseOpacity}>자립형 어레이</text>
        </g>
      );
    default:
      return null;
  }
}

export default function AAOProcessDiagram() {
  const [active, setActive] = useState(0);

  const svgW = 580;
  const svgH = 210;
  const stepW = 70;
  const gap = 10;
  const totalW = stepW * 7 + gap * 6;
  const startX = (svgW - totalW) / 2;

  return (
    <figure className="my-8">
      <svg
        viewBox={`0 0 ${svgW} ${svgH}`}
        className="w-full max-w-2xl mx-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width={svgW} height={svgH} fill="#111116" rx="8" stroke="#ffffff10" strokeWidth="0.5" />

        <text x={svgW / 2} y={18} fill="#e8e8e8" fontSize="11" fontWeight="bold" textAnchor="middle">
          AAO 나노구조 전극 7단계 공정
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
              {/* Background card */}
              <rect
                x={x} y={28} width={stepW} height={150} rx={5}
                fill={isActive ? c + "22" : c + "05"}
                stroke={isActive ? c + "65" : c + "18"}
                strokeWidth={isActive ? 1.2 : 0.6}
              />

              {/* Step number */}
              <circle cx={x + 12} cy={40} r={7} fill={c + "35"} stroke={c + "55"} strokeWidth={0.8} />
              <text x={x + 12} y={43} fill={c} fontSize="8" fontWeight="bold" textAnchor="middle">
                {step.id}
              </text>

              {/* Label */}
              <text x={x + stepW / 2} y={42} fill={isActive ? c : "#888"} fontSize="7" fontWeight="bold" textAnchor="middle" dx={8}>
                {step.label}
              </text>

              {/* Illustration */}
              <g transform={`translate(${x + 5}, ${55}) scale(1.3)`}>
                <StepIllustration step={step} isActive={isActive} />
              </g>

              {/* Sub label */}
              <text x={x + stepW / 2} y={140} fill={c + "80"} fontSize="5" textAnchor="middle">
                {step.sub}
              </text>

              {/* Arrow */}
              {i < 6 && (
                <g>
                  <line x1={x + stepW + 1} y1={90} x2={x + stepW + gap - 1} y2={90}
                    stroke="#555" strokeWidth={0.8} />
                  <polygon points={`${x + stepW + gap - 1},88 ${x + stepW + gap + 2},90 ${x + stepW + gap - 1},92`}
                    fill="#555" />
                </g>
              )}
            </g>
          );
        })}

        <text x={svgW / 2} y={svgH - 6} fill="#666" fontSize="7" textAnchor="middle">
          대학 화학과 실험실에서 수행 (화학 후드 필수). Al → 나노다공성 AAO → Ni 나노팁 어레이.
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
            {STEPS[active].id}
          </span>
          <span className="text-sm font-medium" style={{ color: STEPS[active].color }}>
            {STEPS[active].label}
          </span>
          <span className="text-[10px] text-stone-500">{STEPS[active].sub}</span>
        </div>
        <p className="text-xs text-stone-400 mt-1">{STEPS[active].detail}</p>
      </div>
    </figure>
  );
}
