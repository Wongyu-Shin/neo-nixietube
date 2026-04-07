"use client";

import { useState } from "react";

const REGIONS = [
  { id: "cathode", x: 30, w: 20, label: "음극", sublabel: "(숫자 전극)", color: "#ef8f44", detail: "니켈 숫자 형상 전극. 음전압(-) 인가. 이온 충돌로 2차 전자 방출." },
  { id: "aston", x: 50, w: 15, label: "애스턴\n암부", color: "#333", detail: "극도로 얇은 어두운 영역. 전자가 아직 충분한 에너지를 얻지 못한 구간." },
  { id: "cathode-glow", x: 65, w: 40, label: "음극 글로우", color: "#D4A853", detail: "닉시관의 '숫자가 빛나는' 영역. 전자가 가스 원자를 여기(excitation)시켜 발광. 전극 형상을 따라 빛남.", glow: true },
  { id: "dark-space", x: 105, w: 35, label: "음극 암부", sublabel: "(Crookes)", color: "#222", detail: "전압 강하의 대부분이 여기서 발생. 강한 전기장이 이온을 음극으로 가속. 닉시관 설계의 핵심 파라미터." },
  { id: "negative-glow", x: 140, w: 30, label: "음극측\n글로우", color: "#7B9EB8", detail: "음극 암부를 통과한 전자가 가스를 여기. 약한 발광. 네온의 경우 연한 오렌지." },
  { id: "faraday", x: 170, w: 20, label: "패러데이\n암부", color: "#1a1a1a", detail: "전자 에너지가 소진된 어두운 전이 영역." },
  { id: "positive-column", x: 190, w: 70, label: "양광주", sublabel: "(네온사인 빛)", color: "#6BA368", detail: "양극-음극 사이의 긴 발광 영역. 네온사인의 빛은 이것. 닉시관에서는 전극 간격이 좁아 짧거나 없음." },
  { id: "anode", x: 270, w: 20, label: "양극", sublabel: "(메쉬)", color: "#B8A9C9", detail: "양전압(+) 인가. 니켈 메쉬 형태. 전자 수집." },
];

export default function GlowDischargeDiagram() {
  const [hovered, setHovered] = useState<string | null>(null);
  const active = REGIONS.find(r => r.id === hovered);

  const svgW = 340;
  const svgH = 180;

  return (
    <figure className="my-8">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-xl mx-auto" xmlns="http://www.w3.org/2000/svg">
        <rect width={svgW} height={svgH} fill="#111116" rx="8" stroke="#ffffff10" strokeWidth="0.5" />

        <text x={svgW / 2} y={16} fill="#e8e8e8" fontSize="10" fontWeight="bold" textAnchor="middle">
          글로우 방전의 공간 구조
        </text>

        {/* Tube outline */}
        <rect x={25} y={30} width={270} height={70} rx={6} fill="none" stroke="#7B9EB840" strokeWidth={1} />

        {/* Regions */}
        {REGIONS.map((r) => {
          const isActive = hovered === r.id;
          const isGlow = r.id === "cathode-glow";
          return (
            <g
              key={r.id}
              onMouseEnter={() => setHovered(r.id)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "pointer" }}
            >
              <rect
                x={r.x} y={32} width={r.w} height={66} rx={1}
                fill={isActive ? r.color + "50" : (r.color.startsWith("#1") || r.color.startsWith("#2") || r.color.startsWith("#3")) ? r.color + "30" : r.color + "25"}
                stroke={isActive ? r.color : "transparent"}
                strokeWidth={isActive ? 1.5 : 0}
              />
              {/* Glow effect for cathode glow */}
              {isGlow && (
                <rect x={r.x} y={32} width={r.w} height={66} rx={1}
                  fill={r.color + "15"} filter="url(#glowDischarge)" />
              )}
              {/* Label */}
              {r.label.includes("\n") ? (
                r.label.split("\n").map((line, li) => (
                  <text key={li} x={r.x + r.w / 2} y={60 + li * 10} fill={isActive ? r.color : r.color + "bb"}
                    fontSize="6" fontWeight="bold" textAnchor="middle">{line}</text>
                ))
              ) : (
                <text x={r.x + r.w / 2} y={r.sublabel ? 60 : 65} fill={isActive ? r.color : r.color + "bb"}
                  fontSize={r.w > 30 ? "7" : "6"} fontWeight="bold" textAnchor="middle">{r.label}</text>
              )}
              {r.sublabel && !r.label.includes("\n") && (
                <text x={r.x + r.w / 2} y={72} fill={r.color + "80"} fontSize="5" textAnchor="middle">{r.sublabel}</text>
              )}
            </g>
          );
        })}

        {/* Voltage gradient arrow */}
        <defs>
          <linearGradient id="voltGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#6BA368" />
          </linearGradient>
          <filter id="glowDischarge" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>
        <line x1={40} y1={115} x2={280} y2={115} stroke="url(#voltGrad)" strokeWidth={2} />
        <polygon points="278,112 284,115 278,118" fill="#6BA368" />
        <text x={40} y={130} fill="#ef4444" fontSize="6" textAnchor="middle">- (음극)</text>
        <text x={280} y={130} fill="#6BA368" fontSize="6" textAnchor="middle">+ (양극)</text>
        <text x={160} y={128} fill="#666" fontSize="5" textAnchor="middle">전압 강하 방향</text>

        {/* Brightness curve (simplified) */}
        <path d="M 40 160 L 55 160 L 65 145 Q 80 138 95 142 L 105 160 L 140 148 L 160 158 L 180 155 Q 220 148 260 152 L 280 158"
          fill="none" stroke="#D4A85380" strokeWidth={1.2} />
        <text x={20} y={155} fill="#D4A853" fontSize="5" textAnchor="end">밝기</text>

        <text x={svgW / 2} y={svgH - 4} fill="#666" fontSize="6" textAnchor="middle">
          닉시관: 음극 글로우(오렌지)가 숫자 형상을 따라 발광. 전극 간격이 좁아 양광주는 짧음.
        </text>
      </svg>

      {active ? (
        <div className="max-w-xl mx-auto mt-2 rounded-lg border p-3 transition-all" style={{ borderColor: active.color + "55", backgroundColor: active.color + "15" }}>
          <div className="text-sm font-medium" style={{ color: active.color }}>{active.label.replace("\n", " ")}</div>
          <p className="text-xs text-stone-400 mt-1">{active.detail}</p>
        </div>
      ) : (
        <figcaption className="text-center text-stone-500 text-xs mt-2">
          각 영역을 호버하여 역할 확인. 음극 글로우 = 닉시관의 발광 원리.
        </figcaption>
      )}
    </figure>
  );
}
