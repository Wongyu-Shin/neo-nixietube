"use client";

import { useState } from "react";

/**
 * Interactive Paschen curve visualization.
 * Users can hover over bridge operating zones to see details.
 */

// Simplified Paschen data points for Ne (from simulator, MAPE 1.79%)
const NE_DATA = [
  [0.5, 230], [1, 180], [1.5, 170], [2, 170], [3, 175], [4, 185],
  [5, 195], [7, 215], [10, 245], [15, 290], [20, 330], [30, 400],
  [50, 520], [70, 630], [100, 790],
];

const BRIDGES = [
  { id: "b1", label: "Bridge 1\nFrit + Bulk Ni", pd: 3.5, vb: 180, color: "#D4A853", desc: "Ne 18 Torr, 2mm gap" },
  { id: "b2", label: "Bridge 2\nFrit + AAO", pd: 1.6, vb: 170, color: "#C17B5E", desc: "Ne 10 Torr, 1.5mm gap" },
  { id: "b3", label: "Bridge 3\nMicro-barrier", pd: 23, vb: 350, color: "#7B9EB8", desc: "Ne 230 Torr, 1mm gap" },
  { id: "ar", label: "Argon\nAlternative", pd: 2.1, vb: 207, color: "#6BA368", desc: "Ar 11 Torr, 1.9mm gap" },
];

// Chart dimensions
const W = 600, H = 360, PAD = { t: 30, r: 30, b: 50, l: 60 };
const plotW = W - PAD.l - PAD.r;
const plotH = H - PAD.t - PAD.b;

function logScale(val: number, min: number, max: number, pixels: number) {
  const logMin = Math.log10(min);
  const logMax = Math.log10(max);
  return ((Math.log10(val) - logMin) / (logMax - logMin)) * pixels;
}

function toX(pd: number) { return PAD.l + logScale(pd, 0.3, 150, plotW); }
function toY(vb: number) { return PAD.t + plotH - logScale(vb, 100, 1000, plotH); }

export default function PaschenChart() {
  const [hover, setHover] = useState<string | null>(null);
  const hovered = BRIDGES.find(b => b.id === hover);

  // Curve path
  const path = NE_DATA
    .map((p, i) => `${i === 0 ? "M" : "L"} ${toX(p[0]).toFixed(1)} ${toY(p[1]).toFixed(1)}`)
    .join(" ");

  return (
    <figure className="my-8">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl mx-auto" xmlns="http://www.w3.org/2000/svg">
        <rect width={W} height={H} fill="#0D0D0D" rx="8" />

        {/* Grid */}
        {[0.5, 1, 2, 5, 10, 20, 50, 100].map(pd => (
          <g key={`gx${pd}`}>
            <line x1={toX(pd)} y1={PAD.t} x2={toX(pd)} y2={PAD.t + plotH} stroke="white" strokeWidth="0.3" opacity="0.1" />
            <text x={toX(pd)} y={PAD.t + plotH + 15} fill="#666" fontSize="9" textAnchor="middle">{pd}</text>
          </g>
        ))}
        {[100, 200, 300, 500, 800].map(vb => (
          <g key={`gy${vb}`}>
            <line x1={PAD.l} y1={toY(vb)} x2={PAD.l + plotW} y2={toY(vb)} stroke="white" strokeWidth="0.3" opacity="0.1" />
            <text x={PAD.l - 8} y={toY(vb) + 3} fill="#666" fontSize="9" textAnchor="end">{vb}V</text>
          </g>
        ))}

        {/* Axis labels */}
        <text x={PAD.l + plotW / 2} y={H - 5} fill="#888" fontSize="11" textAnchor="middle">p·d (Torr·cm)</text>
        <text x={15} y={PAD.t + plotH / 2} fill="#888" fontSize="11" textAnchor="middle" transform={`rotate(-90, 15, ${PAD.t + plotH / 2})`}>Vb (V)</text>

        {/* Ne curve */}
        <path d={path} fill="none" stroke="#FF8C42" strokeWidth="2.5" opacity="0.8" />

        {/* NIST data points */}
        {NE_DATA.map((p, i) => (
          <circle key={i} cx={toX(p[0])} cy={toY(p[1])} r="3" fill="#FF8C42" stroke="#0D0D0D" strokeWidth="1" />
        ))}

        {/* Bridge markers */}
        {BRIDGES.map(b => {
          const x = toX(b.pd);
          const y = toY(b.vb);
          const isHovered = hover === b.id;
          return (
            <g key={b.id}
               onMouseEnter={() => setHover(b.id)}
               onMouseLeave={() => setHover(null)}
               style={{ cursor: "pointer" }}
            >
              {/* Pulse ring */}
              <circle cx={x} cy={y} r={isHovered ? 18 : 12} fill={`${b.color}15`} stroke={b.color} strokeWidth={isHovered ? 2 : 1} opacity={isHovered ? 1 : 0.6}>
                {!isHovered && <animate attributeName="r" values="10;14;10" dur="2s" repeatCount="indefinite" />}
              </circle>
              <circle cx={x} cy={y} r="4" fill={b.color} />

              {/* Label */}
              {b.pd < 5 ? (
                <text x={x - 15} y={y - 18} fill={b.color} fontSize="8" textAnchor="end" fontWeight={isHovered ? "bold" : "normal"}>
                  {b.label.split("\n").map((line, li) => (
                    <tspan key={li} x={x - 15} dy={li === 0 ? 0 : 10}>{line}</tspan>
                  ))}
                </text>
              ) : (
                <text x={x + 15} y={y - 8} fill={b.color} fontSize="8" fontWeight={isHovered ? "bold" : "normal"}>
                  {b.label.split("\n").map((line, li) => (
                    <tspan key={li} x={x + 15} dy={li === 0 ? 0 : 10}>{line}</tspan>
                  ))}
                </text>
              )}
            </g>
          );
        })}

        {/* Title */}
        <text x={W / 2} y={18} fill="#e8e8e8" fontSize="12" fontWeight="bold" textAnchor="middle">
          Paschen Curve (Ne) — LOOCV MAPE 1.79%
        </text>
      </svg>

      {/* Hover tooltip */}
      {hovered && (
        <div className="mx-auto max-w-2xl mt-2 p-3 rounded-lg border text-sm"
             style={{ backgroundColor: `${hovered.color}0a`, borderColor: `${hovered.color}30` }}>
          <span className="font-semibold" style={{ color: hovered.color }}>{hovered.label.replace("\n", " ")}</span>
          <span className="text-stone-400 ml-2">— {hovered.desc}, Vb={hovered.vb}V, p·d={hovered.pd} Torr·cm</span>
        </div>
      )}

      <figcaption className="text-center text-stone-500 text-sm mt-2">
        네온 파셴 곡선 + 4개 브릿지 동작점 — 마커에 마우스를 올려보세요
      </figcaption>
    </figure>
  );
}
