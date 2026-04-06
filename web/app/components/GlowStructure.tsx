"use client";

import { useState } from "react";

/**
 * Interactive glow discharge structure diagram.
 * Slider to change pressure and see how glow regions change.
 */

export default function GlowStructure() {
  const [pressure, setPressure] = useState(15); // Torr

  // Model: dc = 0.375 * (1 + (p/134)^0.83) / p (cm) → μm
  const dcCm = 0.375 * (1 + Math.pow(pressure / 134, 0.83)) / pressure;
  const dcUm = Math.round(dcCm * 10000);
  const glowUm = Math.round(dcUm * 0.7);
  const gap = 1500; // 1.5mm fixed gap in μm
  const ratio = Math.min(1, (dcUm + glowUm) / gap);

  // SVG scale: 1px = 5μm
  const scale = 0.25;
  const svgW = 500;
  const svgH = 200;
  const gapPx = gap * scale;
  const dcPx = Math.max(2, dcUm * scale);
  const glowPx = Math.max(2, glowUm * scale);

  const cathodeX = 80;
  const anodeX = cathodeX + Math.min(gapPx, svgW - 160);

  return (
    <figure className="my-8">
      <div className="mb-4 flex items-center gap-4">
        <label className="text-xs text-stone-400">Pressure:</label>
        <input
          type="range"
          min="5"
          max="500"
          value={pressure}
          onChange={(e) => setPressure(Number(e.target.value))}
          className="flex-1 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer
                     [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4
                     [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full
                     [&::-webkit-slider-thumb]:bg-amber-400"
        />
        <span className="text-sm font-mono text-amber-400 w-20 text-right">{pressure} Torr</span>
      </div>

      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-xl mx-auto" xmlns="http://www.w3.org/2000/svg">
        <rect width={svgW} height={svgH} fill="#0D0D0D" rx="6" />

        {/* Cathode (left) */}
        <rect x={cathodeX - 3} y={40} width={6} height={120} fill="#999" rx="1" />
        <text x={cathodeX} y={30} fill="#999" fontSize="9" textAnchor="middle">Cathode</text>

        {/* Anode (right) */}
        <rect x={anodeX - 2} y={40} width={4} height={120} fill="#7B9EB8" rx="1" />
        <text x={anodeX} y={30} fill="#7B9EB8" fontSize="9" textAnchor="middle">Anode</text>

        {/* Cathode dark space */}
        <rect x={cathodeX + 3} y={45} width={Math.min(dcPx, anodeX - cathodeX - 10)} height={110}
              fill="#33000050" stroke="#FF4500" strokeWidth="0.5" strokeDasharray="2 2" rx="2" />
        <text x={cathodeX + 6} y={175} fill="#FF4500" fontSize="8" opacity="0.8">
          Dark Space ({dcUm}μm)
        </text>

        {/* Cathode glow (negative glow) */}
        {dcPx + glowPx < anodeX - cathodeX - 5 && (
          <>
            <rect x={cathodeX + 3 + dcPx} y={45} width={Math.min(glowPx, anodeX - cathodeX - dcPx - 10)} height={110}
                  fill="#FF8C4230" rx="2" />
            {/* Glow animation */}
            <rect x={cathodeX + 3 + dcPx} y={48} width={Math.min(glowPx, anodeX - cathodeX - dcPx - 10)} height={104}
                  fill="#FF8C42" opacity="0.15" rx="2">
              <animate attributeName="opacity" values="0.1;0.25;0.1" dur="1.5s" repeatCount="indefinite" />
            </rect>
            <text x={cathodeX + dcPx + glowPx / 2 + 3} y={175} fill="#FF8C42" fontSize="8" textAnchor="middle">
              Glow ({glowUm}μm)
            </text>
          </>
        )}

        {/* Positive column (if space remains) */}
        {dcPx + glowPx + 20 < anodeX - cathodeX && (
          <rect x={cathodeX + 3 + dcPx + glowPx + 5} y={55}
                width={anodeX - cathodeX - dcPx - glowPx - 20} height={90}
                fill="#FF8C4208" rx="2" />
        )}

        {/* Gap dimension line */}
        <line x1={cathodeX} y1={190} x2={anodeX} y2={190} stroke="#666" strokeWidth="0.5" />
        <line x1={cathodeX} y1={185} x2={cathodeX} y2={195} stroke="#666" strokeWidth="0.5" />
        <line x1={anodeX} y1={185} x2={anodeX} y2={195} stroke="#666" strokeWidth="0.5" />
        <text x={(cathodeX + anodeX) / 2} y={198} fill="#666" fontSize="8" textAnchor="middle">
          Gap: 1.5mm
        </text>
      </svg>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 max-w-xl mx-auto mt-3">
        <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-3 text-center">
          <div className="text-xs text-stone-500">Glow/Gap Ratio</div>
          <div className="text-lg font-bold" style={{ color: ratio > 0.25 ? "#6BA368" : ratio > 0.1 ? "#D4A853" : "#ef4444" }}>
            {(ratio * 100).toFixed(0)}%
          </div>
        </div>
        <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-3 text-center">
          <div className="text-xs text-stone-500">Dark Space</div>
          <div className="text-lg font-bold text-red-400/80">{dcUm}μm</div>
        </div>
        <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-3 text-center">
          <div className="text-xs text-stone-500">Cathode Glow</div>
          <div className="text-lg font-bold text-amber-400">{glowUm}μm</div>
        </div>
      </div>

      <figcaption className="text-center text-stone-500 text-xs mt-3">
        슬라이더로 압력을 변경하면 글로우 영역이 어떻게 변하는지 확인 — 고압에서 글로우가 얇아짐
      </figcaption>
    </figure>
  );
}
