"use client";

import { useState } from "react";

/*
 * RippabilityMeter — Article II visual.
 * Each of the 28 features has a tc_script and a rippable_check.
 * Meter shows current "still needed" vs "absorbed upstream" counts
 * for a given CC semver + model combo. User toggles an imagined
 * future CC version and watches the bar shift.
 */

type Scenario = {
  id: string;
  label: string;
  hint: string;
  stillNeeded: number;
  absorbed: number;
  borderline: number;
};

const SCENARIOS: Scenario[] = [
  {
    id: "now",
    label: "CC 2.x · today",
    hint: "All 28 features mechanically still needed.",
    stillNeeded: 28,
    absorbed: 0,
    borderline: 0,
  },
  {
    id: "plus6",
    label: "CC 2.x + 6mo",
    hint: "Projected — several inner primitives begin overlapping with CC-native features.",
    stillNeeded: 22,
    absorbed: 4,
    borderline: 2,
  },
  {
    id: "cc3",
    label: "CC 3.x — hypothetical",
    hint: "Many inner-phase features likely absorbed; outer phase mostly intact.",
    stillNeeded: 14,
    absorbed: 10,
    borderline: 4,
  },
];

export default function RippabilityMeter() {
  const [idx, setIdx] = useState(0);
  const s = SCENARIOS[idx];
  const total = s.stillNeeded + s.absorbed + s.borderline;
  const pctStill = (s.stillNeeded / total) * 100;
  const pctAbs = (s.absorbed / total) * 100;
  const pctBord = (s.borderline / total) * 100;

  return (
    <div className="my-6 rounded-xl border border-stone-800 bg-[#0f0d0a] p-4 not-prose">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div>
          <div className="text-xs uppercase tracking-wider text-stone-400">Rippability (Article II)</div>
          <div className="text-sm text-stone-200 font-mono">{s.label}</div>
        </div>
        <div className="flex gap-1">
          {SCENARIOS.map((sc, i) => (
            <button
              key={sc.id}
              onClick={() => setIdx(i)}
              className={`px-2 py-1 text-[11px] font-mono rounded border transition ${
                i === idx
                  ? "border-[#D4A853] text-[#D4A853] bg-[#D4A853]/10"
                  : "border-stone-700 text-stone-400 hover:border-stone-500"
              }`}
            >
              {sc.id}
            </button>
          ))}
        </div>
      </div>

      <svg viewBox="0 0 500 70" className="w-full" aria-label="rippability bar">
        <defs>
          <linearGradient id="rm-still" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#6BA368" />
            <stop offset="100%" stopColor="#4a7a4a" />
          </linearGradient>
          <linearGradient id="rm-bord" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#D4A853" />
            <stop offset="100%" stopColor="#9a7a2f" />
          </linearGradient>
          <linearGradient id="rm-abs" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#6a5f48" />
            <stop offset="100%" stopColor="#3a3020" />
          </linearGradient>
        </defs>
        <rect x="0" y="18" width="500" height="28" rx="4" fill="#1a1510" stroke="#2a2418" />
        <rect x="0" y="18" width={(pctStill / 100) * 500} height="28" rx="4" fill="url(#rm-still)" />
        <rect x={(pctStill / 100) * 500} y="18" width={(pctBord / 100) * 500} height="28" fill="url(#rm-bord)" />
        <rect
          x={((pctStill + pctBord) / 100) * 500}
          y="18"
          width={(pctAbs / 100) * 500}
          height="28"
          rx="4"
          fill="url(#rm-abs)"
        />
        <text x="8" y="14" fontSize="9" fontFamily="ui-monospace,monospace" fill="#6BA368">
          still-needed {s.stillNeeded}
        </text>
        <text x={((pctStill) / 100) * 500 + 8} y="14" fontSize="9" fontFamily="ui-monospace,monospace" fill="#D4A853">
          borderline {s.borderline}
        </text>
        <text
          x={((pctStill + pctBord) / 100) * 500 + 8}
          y="14"
          fontSize="9"
          fontFamily="ui-monospace,monospace"
          fill="#8a7a58"
        >
          absorbed {s.absorbed}
        </text>
        <text x="8" y="62" fontSize="9" fontFamily="ui-monospace,monospace" fill="#6a5f48">
          {s.hint}
        </text>
      </svg>
    </div>
  );
}
