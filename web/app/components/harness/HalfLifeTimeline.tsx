"use client";

import { useState } from "react";

/* HalfLifeTimeline — interactive age slider showing the four zones:
 * fresh (0-50%) · warming (50-100%) · restale-due (100-150%) · purge
 * candidate (>150%, operator-decision). Matches the half-life protocol
 * in harness/research/harness-llm-wiki.md §"Minimal viable implementation"
 * step 5 and Article VII's "revisable knowledge" clause. */

const W = 600;
const H = 160;
const PAD_L = 32;
const PAD_R = 24;
const BAR_Y = 80;
const BAR_H = 14;

const ZONES = [
  { from: 0, to: 0.5, color: "#6BA368", label: "신선" },
  { from: 0.5, to: 1.0, color: "#D4A853", label: "데워짐" },
  { from: 1.0, to: 1.5, color: "#C17B5E", label: "재검증 필요" },
  { from: 1.5, to: 2.0, color: "#8b1f1f", label: "폐기 후보" },
];

export default function HalfLifeTimeline() {
  const [pct, setPct] = useState(0.72);
  const halfLifeDays = 30;
  const ageDays = Math.round(pct * halfLifeDays);

  const zone = ZONES.find((z) => pct >= z.from && pct < z.to) || ZONES[3];
  const innerW = W - PAD_L - PAD_R;
  const markerX = PAD_L + Math.min(pct, 2) * 0.5 * innerW;

  return (
    <figure className="my-8 rounded-2xl border border-stone-800 bg-stone-950/60 p-4 sm:p-5">
      <div className="mb-3 flex items-baseline justify-between gap-3 flex-wrap">
        <div className="text-xs font-mono uppercase tracking-wider text-stone-400">
          반감기 타임라인
        </div>
        <div className="text-[12px] font-mono text-stone-500">
          조항 VII · half_life_days = {halfLifeDays}
        </div>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        role="img"
        aria-label="드래그 가능한 나이 마커가 있는 반감기 영역"
      >
        <defs>
          <linearGradient id="hlt-fresh" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6BA368" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#4a7247" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="hlt-warm" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D4A853" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#9a7a3a" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="hlt-stale" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C17B5E" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#8a4a33" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="hlt-purge" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b1f1f" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#4a0f0f" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* Zone segments */}
        {ZONES.map((z, i) => {
          const x0 = PAD_L + (z.from / 2) * innerW;
          const x1 = PAD_L + (z.to / 2) * innerW;
          const fillId =
            i === 0 ? "hlt-fresh" : i === 1 ? "hlt-warm" : i === 2 ? "hlt-stale" : "hlt-purge";
          return (
            <g key={z.label}>
              <rect
                x={x0}
                y={BAR_Y}
                width={x1 - x0}
                height={BAR_H}
                fill={`url(#${fillId})`}
                opacity="0.85"
              />
              <text
                x={(x0 + x1) / 2}
                y={BAR_Y - 6}
                textAnchor="middle"
                fontSize="12"
                fontFamily="ui-monospace, monospace"
                fill={z.color}
              >
                {z.label}
              </text>
            </g>
          );
        })}

        {/* Tick marks 0×, 1×, 2× half-life */}
        {[0, 0.5, 1.0, 1.5, 2.0].map((t) => {
          const tx = PAD_L + (t / 2) * innerW;
          return (
            <g key={t}>
              <line
                x1={tx}
                y1={BAR_Y + BAR_H}
                x2={tx}
                y2={BAR_Y + BAR_H + 4}
                stroke="#78716c"
                strokeWidth="0.8"
              />
              <text
                x={tx}
                y={BAR_Y + BAR_H + 16}
                textAnchor="middle"
                fontSize="12"
                fontFamily="ui-monospace, monospace"
                fill="#78716c"
              >
                {t.toFixed(1)}× hl
              </text>
              <text
                x={tx}
                y={BAR_Y + BAR_H + 28}
                textAnchor="middle"
                fontSize="12"
                fontFamily="ui-monospace, monospace"
                fill="#57534e"
              >
                {Math.round(t * halfLifeDays)}d
              </text>
            </g>
          );
        })}

        {/* Draggable marker */}
        <g transform={`translate(${markerX} 0)`}>
          <line
            x1="0"
            y1={BAR_Y - 18}
            x2="0"
            y2={BAR_Y + BAR_H + 6}
            stroke="#fafaf9"
            strokeWidth="1"
            strokeDasharray="2 2"
            opacity="0.7"
          />
          <polygon
            points={`0,${BAR_Y - 20} -5,${BAR_Y - 28} 5,${BAR_Y - 28}`}
            fill="#fafaf9"
          />
          <circle
            cx="0"
            cy={BAR_Y + BAR_H / 2}
            r="8"
            fill="#0c0a09"
            stroke={zone.color}
            strokeWidth="2"
          />
          <circle cx="0" cy={BAR_Y + BAR_H / 2} r="3" fill={zone.color} />
        </g>

        {/* Bottom readout */}
        <text
          x={PAD_L}
          y={H - 10}
          fontSize="12"
          fontFamily="ui-monospace, monospace"
          fill="#a8a29e"
        >
          last_verified + {ageDays}d
        </text>
        <text
          x={W - PAD_R}
          y={H - 10}
          textAnchor="end"
          fontSize="12"
          fontFamily="ui-monospace, monospace"
          fill={zone.color}
        >
          영역: {zone.label}
        </text>

        {/* Title row */}
        <text
          x={PAD_L}
          y="22"
          fontSize="12"
          fontFamily="ui-monospace, monospace"
          fill="#d6d3d1"
        >
          항목 나이 (× half_life_days)
        </text>
      </svg>

      <input
        type="range"
        min={0}
        max={2}
        step={0.01}
        value={pct}
        onChange={(e) => setPct(parseFloat(e.target.value))}
        className="mt-1 w-full accent-emerald-500 cursor-pointer"
        aria-label="항목 나이 슬라이더"
      />

      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12px] text-stone-400 leading-relaxed">
        <div>
          <strong className="text-stone-200">신선 → 데워짐</strong> 50% 지점:
          항목은 여전히 권위가 있으며, 운영자 조치는 필요 없다.
        </div>
        <div>
          <strong className="text-stone-200">재검증 필요</strong> 100% 지점:
          여전히 표면화되지만, 노후 표시를 단{" "}
          <code>&lt;system-reminder&gt;</code> 래퍼와 함께 표면화된다. 운영자가
          재검증하거나 (<code>last_verified</code> 갱신) 편집한다.
        </div>
        <div className="sm:col-span-2 text-stone-500">
          노후 항목은 절대 자동 삭제되지 않는다 &mdash; 삭제는 운영자가
          <code>/harness:wiki-add --cull</code> 로 결정한다. 폐기 템플릿은
          조항 IX (개정 절차) 다.
        </div>
      </div>
    </figure>
  );
}
