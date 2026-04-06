"use client";

import { useState } from "react";

const STAGES = [
  { label: "상온", temp: 25, time: 0, detail: "프릿 페이스트 도포 완료. 듀멧 와이어 배치.", color: "#999" },
  { label: "승온", temp: 350, time: 30, detail: "분당 5°C 승온. 급격한 온도 변화는 크랙 유발.", color: "#D4A853" },
  { label: "바인더 번아웃", temp: 350, time: 60, detail: "터피네올 바인더가 연소 제거. 이 단계에서 유리관은 개방 상태.", color: "#C17B5E" },
  { label: "승온 2", temp: 450, time: 70, detail: "350°C→450°C 추가 승온. 프릿 연화 시작.", color: "#D4A853" },
  { label: "프릿 융착", temp: 450, time: 100, detail: "Bi₂O₃ 프릿이 용융하여 유리-유리, 유리-금속 접합. 핵심 단계.", color: "#ef4444" },
  { label: "서냉", temp: 25, time: 250, detail: "분당 2°C 이하로 서냉. 열응력 최소화. 급냉 시 실링 파괴.", color: "#7B9EB8" },
];

export default function FiringProfile() {
  const [hovered, setHovered] = useState<number | null>(null);

  const svgW = 500;
  const svgH = 220;
  const padL = 50;
  const padR = 20;
  const padT = 30;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const maxTime = 260;
  const maxTemp = 500;

  const toX = (t: number) => padL + (t / maxTime) * plotW;
  const toY = (temp: number) => padT + plotH - (temp / maxTemp) * plotH;

  const pathD = STAGES.map((s, i) => {
    const x = toX(s.time);
    const y = toY(s.temp);
    return `${i === 0 ? "M" : "L"} ${x} ${y}`;
  }).join(" ");

  const activeStage = hovered !== null ? STAGES[hovered] : null;

  return (
    <figure className="my-8">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-xl mx-auto" xmlns="http://www.w3.org/2000/svg">
        <rect width={svgW} height={svgH} fill="#0D0D0D" rx="8" />

        {/* Title */}
        <text x={svgW / 2} y="18" fill="#e8e8e8" fontSize="11" fontWeight="bold" textAnchor="middle">
          프릿 실링 소성 프로파일
        </text>

        {/* Y axis */}
        {[0, 100, 200, 300, 400, 500].map((temp) => (
          <g key={temp}>
            <line x1={padL} y1={toY(temp)} x2={padL + plotW} y2={toY(temp)} stroke="#333" strokeWidth="0.5" />
            <text x={padL - 5} y={toY(temp) + 3} fill="#666" fontSize="8" textAnchor="end">
              {temp}°C
            </text>
          </g>
        ))}

        {/* X axis */}
        {[0, 60, 120, 180, 240].map((t) => (
          <g key={t}>
            <text x={toX(t)} y={svgH - 10} fill="#666" fontSize="8" textAnchor="middle">
              {t}min
            </text>
          </g>
        ))}

        {/* Fill area under curve */}
        <path
          d={`${pathD} L ${toX(STAGES[STAGES.length - 1].time)} ${toY(0)} L ${toX(0)} ${toY(0)} Z`}
          fill="url(#tempGrad)"
          opacity="0.15"
        />
        <defs>
          <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#0D0D0D" />
          </linearGradient>
        </defs>

        {/* Temperature curve */}
        <path d={pathD} fill="none" stroke="#D4A853" strokeWidth="2" />

        {/* Stage markers */}
        {STAGES.map((s, i) => {
          const x = toX(s.time);
          const y = toY(s.temp);
          const isActive = hovered === i;

          return (
            <g
              key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "pointer" }}
            >
              <circle cx={x} cy={y} r={isActive ? 8 : 5} fill="#0D0D0D" stroke={s.color} strokeWidth={isActive ? 2.5 : 1.5} />
              <circle cx={x} cy={y} r={isActive ? 3 : 2} fill={s.color} />
              {isActive && (
                <text x={x} y={y - 14} fill={s.color} fontSize="8" fontWeight="bold" textAnchor="middle">
                  {s.label}
                </text>
              )}
            </g>
          );
        })}

        {/* Key temperature lines */}
        <line x1={padL} y1={toY(350)} x2={toX(60)} y2={toY(350)} stroke="#C17B5E" strokeWidth="0.5" strokeDasharray="3 2" opacity="0.5" />
        <line x1={padL} y1={toY(450)} x2={toX(100)} y2={toY(450)} stroke="#ef4444" strokeWidth="0.5" strokeDasharray="3 2" opacity="0.5" />
      </svg>

      {/* Info panel */}
      {activeStage ? (
        <div
          className="max-w-xl mx-auto mt-2 rounded-lg border p-3 transition-all duration-200"
          style={{ borderColor: activeStage.color + "40", backgroundColor: activeStage.color + "08" }}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium" style={{ color: activeStage.color }}>{activeStage.label}</span>
            <span className="text-xs text-stone-500">{activeStage.temp}°C @ {STAGES[hovered!].time}min</span>
          </div>
          <p className="text-xs text-stone-400 mt-1">{activeStage.detail}</p>
        </div>
      ) : (
        <figcaption className="text-center text-stone-500 text-xs mt-2">
          소성 온도 프로파일의 각 단계를 호버하여 상세 확인. 전통 봉착(800°C) 대비 450°C로 55% 절감.
        </figcaption>
      )}
    </figure>
  );
}
