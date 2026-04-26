"use client";

import { useState } from "react";

/**
 * L0/L1/L2 graduated-confirm ladder, per `harness-graduated-confirm`
 * and the Article III carve-out for irreversible operations.
 */

type Tier = {
  id: "L0" | "L1" | "L2";
  label: string;
  color: string;
  behavior: string;
  examples: string[];
  hitl: string;
};

const TIERS: Tier[] = [
  {
    id: "L0",
    label: "Silent",
    color: "#6BA368",
    behavior: "No interrupt, no log line. Assumes reversibility by construction.",
    examples: ["Read file", "Edit inside Scope", "git log / git diff", "Run Verify"],
    hitl: "none",
  },
  {
    id: "L1",
    label: "Notify + 30s",
    color: "#D4A853",
    behavior:
      "Statusline ping; loop blocks 30s for operator veto, then auto-approves and continues.",
    examples: [
      "rm of scope-owned files",
      "Package install",
      "Rename directory within scope",
      "Create new branch",
    ],
    hitl: "advisory",
  },
  {
    id: "L2",
    label: "Pause + keystroke",
    color: "#C1563E",
    behavior:
      "Loop pauses. Requires explicit operator keystroke. Logged to report.mdx. One of the two Article III in-loop carve-outs.",
    examples: [
      "git push --force",
      "rm outside Scope",
      "sudo / release publish",
      "Amend / delete a signed commit",
    ],
    hitl: "blocking",
  },
];

export default function SafetyTierLadder() {
  const [selected, setSelected] = useState<Tier["id"]>("L2");
  const active = TIERS.find((t) => t.id === selected)!;

  return (
    <figure className="my-8">
      <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-4">
        <svg
          viewBox="0 0 320 260"
          className="w-full rounded-xl border border-white/10 bg-stone-950"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="L0/L1/L2 safety tier ladder"
        >
          <defs>
            <linearGradient id="tl-bg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1a140c" />
              <stop offset="100%" stopColor="#0b0906" />
            </linearGradient>
          </defs>
          <rect width="320" height="260" fill="url(#tl-bg)" rx="12" />

          {/* Vertical rail */}
          <line x1="58" y1="36" x2="58" y2="226" stroke="#3a2e1e" strokeWidth="2" />
          <circle cx="58" cy="36" r="4" fill="#8a7a58" />
          <circle cx="58" cy="226" r="4" fill="#8a7a58" />
          <text x="58" y="22" fill="#8a7a58" fontSize="10" textAnchor="middle">
            safe
          </text>
          <text x="58" y="246" fill="#8a7a58" fontSize="10" textAnchor="middle">
            irreversible
          </text>

          {TIERS.map((t, i) => {
            const y = 56 + i * 68;
            const isActive = selected === t.id;
            return (
              <g
                key={t.id}
                style={{ cursor: "pointer", transition: "opacity 0.25s" }}
                onClick={() => setSelected(t.id)}
                opacity={isActive ? 1 : 0.55}
              >
                <circle
                  cx="58"
                  cy={y}
                  r={isActive ? 18 : 14}
                  fill={t.color}
                  fillOpacity={isActive ? 0.42 : 0.2}
                  stroke={t.color}
                  strokeWidth={isActive ? 2.4 : 1.4}
                />
                <text
                  x="58"
                  y={y + 4}
                  fill="#eaeaea"
                  fontSize="11"
                  fontWeight="700"
                  textAnchor="middle"
                >
                  {t.id}
                </text>
                <rect
                  x="92"
                  y={y - 16}
                  width="210"
                  height="32"
                  rx="6"
                  fill="#120d08"
                  stroke={t.color}
                  strokeOpacity={isActive ? 0.7 : 0.3}
                />
                <text
                  x="104"
                  y={y - 2}
                  fill={t.color}
                  fontSize="11"
                  fontWeight="600"
                >
                  {t.label}
                </text>
                <text x="104" y={y + 11} fill="#9a8660" fontSize="9">
                  HITL: {t.hitl}
                </text>
              </g>
            );
          })}
        </svg>

        <aside className="rounded-xl border border-white/10 bg-stone-900/60 p-5 text-sm">
          <div
            className="uppercase tracking-widest text-[10px] mb-1"
            style={{ color: active.color }}
          >
            tier {active.id}
          </div>
          <div className="text-lg font-semibold text-amber-200 mb-2">
            {active.label}
          </div>
          <p className="text-xs text-stone-400 leading-relaxed mb-3">
            {active.behavior}
          </p>
          <div className="text-xs text-stone-500 mb-1">examples</div>
          <ul className="text-xs text-stone-300 space-y-1">
            {active.examples.map((ex) => (
              <li key={ex} className="flex gap-2">
                <span className="text-stone-600">·</span>
                <span>{ex}</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
      <figcaption className="text-xs text-stone-500 text-center mt-3">
        Feature: <code className="text-amber-200">harness-graduated-confirm</code>
        {" · "}
        Article III in-loop HITL carve-out.
      </figcaption>
    </figure>
  );
}
