"use client";

import { useState } from "react";

const ZONES = [
  { id: "atm", label: "대기압", pressure: "760 Torr", x: 0, w: 60, color: "#ef4444", detail: "해수면 기준. 관 내부를 이 압력에서 시작하여 배기." },
  { id: "rough", label: "거친 진공", pressure: "1~10⁻³ Torr", x: 60, w: 90, color: "#D4A853", detail: "로터리 펌프 도달 범위. 닉시관 배기의 1차 목표. MAP 플러싱 경로는 이 단계를 건너뜀." },
  { id: "high", label: "고진공", pressure: "10⁻³~10⁻⁶ Torr", x: 150, w: 80, color: "#7B9EB8", detail: "확산펌프/터보펌프 필요. 상업 닉시관 품질. PoC에서는 10⁻⁴ Torr면 충분." },
  { id: "uhv", label: "초고진공", pressure: "<10⁻⁶ Torr", x: 230, w: 60, color: "#B8A9C9", detail: "이온펌프/게터펌프. 반도체/입자물리. 닉시관에는 불필요." },
];

const PUMPS = [
  { label: "로터리 펌프", range: [60, 155], color: "#D4A853", y: 105, note: "₩200-400K (중고) / 네온사인 업체/대학에서 접근" },
  { label: "확산펌프", range: [130, 240], color: "#7B9EB8", y: 120, note: "₩500K+ / 대학 실험실에서 접근 가능" },
  { label: "MAP 플러싱 (진공 불필요!)", range: [0, 60], color: "#6BA368", y: 135, note: "₩0 장비비 / 네온 가스로 공기 치환" },
];

const MARKERS = [
  { label: "PoC 목표", x: 145, color: "#6BA368" },
  { label: "상업 품질", x: 195, color: "#7B9EB8" },
  { label: "Ne 충전 압력\n(15-20 Torr)", x: 80, color: "#D4A853" },
];

export default function VacuumScaleDiagram() {
  const [hovered, setHovered] = useState<string | null>(null);
  const active = ZONES.find(z => z.id === hovered) || PUMPS.find(p => p.label === hovered);

  const svgW = 340;
  const svgH = 180;

  return (
    <figure className="my-8">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-xl mx-auto" xmlns="http://www.w3.org/2000/svg">
        <rect width={svgW} height={svgH} fill="#111116" rx="8" stroke="#ffffff10" strokeWidth="0.5" />

        <text x={svgW / 2} y={16} fill="#e8e8e8" fontSize="10" fontWeight="bold" textAnchor="middle">
          진공 압력 스케일과 장비 범위
        </text>

        {/* Pressure scale bar */}
        <rect x={25} y={30} width={290} height={30} rx={4} fill="#ffffff06" stroke="#ffffff15" strokeWidth={0.5} />

        {/* Zones */}
        {ZONES.map((z) => {
          const isActive = hovered === z.id;
          return (
            <g key={z.id}
              onMouseEnter={() => setHovered(z.id)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "pointer" }}>
              <rect x={25 + z.x} y={30} width={z.w} height={30} rx={z.x === 0 ? 4 : 0}
                fill={isActive ? z.color + "40" : z.color + "20"}
                stroke={isActive ? z.color : "transparent"} strokeWidth={1} />
              <text x={25 + z.x + z.w / 2} y={43} fill={isActive ? z.color : z.color + "cc"}
                fontSize="6" fontWeight="bold" textAnchor="middle">{z.label}</text>
              <text x={25 + z.x + z.w / 2} y={54} fill={z.color + "88"} fontSize="5" textAnchor="middle">{z.pressure}</text>
            </g>
          );
        })}

        {/* Logarithmic scale labels */}
        {["760", "1", "10⁻³", "10⁻⁶", "10⁻⁹"].map((label, i) => {
          const x = 25 + i * 72.5;
          return (
            <g key={i}>
              <line x1={x} y1={60} x2={x} y2={68} stroke="#ffffff30" strokeWidth={0.5} />
              <text x={x} y={76} fill="#666" fontSize="5" textAnchor="middle">{label} Torr</text>
            </g>
          );
        })}

        {/* Arrow: higher vacuum → */}
        <line x1={30} y1={85} x2={310} y2={85} stroke="#ffffff15" strokeWidth={0.5} />
        <polygon points="308,83 314,85 308,87" fill="#ffffff30" />
        <text x={312} y={93} fill="#555" fontSize="4" textAnchor="end">higher vacuum →</text>

        {/* Pump ranges */}
        {PUMPS.map((p) => {
          const isActive = hovered === p.label;
          return (
            <g key={p.label}
              onMouseEnter={() => setHovered(p.label)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "pointer" }}>
              <line x1={25 + p.range[0]} y1={p.y} x2={25 + p.range[1]} y2={p.y}
                stroke={isActive ? p.color : p.color + "80"} strokeWidth={isActive ? 3 : 2} strokeLinecap="round" />
              {/* End caps */}
              <circle cx={25 + p.range[0]} cy={p.y} r={2} fill={p.color + "80"} />
              <circle cx={25 + p.range[1]} cy={p.y} r={2} fill={p.color + "80"} />
              <text x={25 + (p.range[0] + p.range[1]) / 2} y={p.y - 5}
                fill={isActive ? p.color : p.color + "aa"} fontSize="5" fontWeight="bold" textAnchor="middle">
                {p.label}
              </text>
            </g>
          );
        })}

        {/* Markers */}
        {MARKERS.map((m, i) => (
          <g key={i}>
            <line x1={25 + m.x} y1={28} x2={25 + m.x} y2={62} stroke={m.color + "60"} strokeWidth={0.8} strokeDasharray="2 2" />
            {m.label.includes("\n") ? (
              m.label.split("\n").map((line, li) => (
                <text key={li} x={25 + m.x} y={22 - (1 - li) * 8} fill={m.color + "90"} fontSize="4" textAnchor="middle">{line}</text>
              ))
            ) : (
              <text x={25 + m.x} y={25} fill={m.color + "90"} fontSize="4" textAnchor="middle">{m.label}</text>
            )}
          </g>
        ))}

        <text x={svgW / 2} y={svgH - 4} fill="#666" fontSize="6" textAnchor="middle">
          대수 스케일. MAP 플러싱(경로 2)은 진공 펌프 자체를 불필요하게 만듦.
        </text>
      </svg>

      {active && "detail" in active ? (
        <div className="max-w-xl mx-auto mt-2 rounded-lg border p-3 transition-all"
          style={{ borderColor: active.color + "55", backgroundColor: active.color + "15" }}>
          <div className="text-sm font-medium" style={{ color: active.color }}>{"label" in active ? active.label : ""}</div>
          <p className="text-xs text-stone-400 mt-1">{active.detail}</p>
        </div>
      ) : active && "note" in active ? (
        <div className="max-w-xl mx-auto mt-2 rounded-lg border p-3 transition-all"
          style={{ borderColor: active.color + "55", backgroundColor: active.color + "15" }}>
          <div className="text-sm font-medium" style={{ color: active.color }}>{"label" in active ? active.label : ""}</div>
          <p className="text-xs text-stone-400 mt-1">{active.note}</p>
        </div>
      ) : (
        <figcaption className="text-center text-stone-500 text-xs mt-2">
          각 압력 영역과 장비 범위를 호버. MAP 플러싱은 진공 펌프 없이 가스 치환.
        </figcaption>
      )}
    </figure>
  );
}
