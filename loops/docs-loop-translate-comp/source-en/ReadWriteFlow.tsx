"use client";

import { useState } from "react";

/* ReadWriteFlow — two-column SessionStart (read) / post-loop (write)
 * flow, matching harness/UX.md §7 "Reading from" / "Writing to" and
 * harness/research/harness-llm-wiki.md §"Loading mechanic" /
 * §"Write mechanic". */

type Step = {
  id: string;
  label: string;
  detail: string;
  cite: string;
};

const READ_STEPS: Step[] = [
  {
    id: "r1",
    label: "SessionStart hook fires",
    detail: "wiki-surface SKILL.md reads the operator's initial message + last N lines of transcript.",
    cite: ".claude/skills/wiki-surface/SKILL.md",
  },
  {
    id: "r2",
    label: "Tokenize + lowercase",
    detail: "split on non-alphanum; discard ≤1-char tokens; preserve kebab-case hyphens.",
    cite: "scripts/harness/wiki_match.sh",
  },
  {
    id: "r3",
    label: "Score every entry",
    detail: "count trigger overlap per harness/wiki/*.md entry.",
    cite: "feature harness-llm-wiki",
  },
  {
    id: "r4",
    label: "Cap top-3, inject <system-reminder>",
    detail: "stale entries still surface, tagged restale-due.",
    cite: "Article VII",
  },
  {
    id: "r5",
    label: "Log usage",
    detail: "gcli-agent-run-telemetry records which entries the agent cited during the loop.",
    cite: "feature gcli-agent-run-telemetry",
  },
];

const WRITE_STEPS: Step[] = [
  {
    id: "w1",
    label: "Post-loop reporter prompt",
    detail: "cc-post-loop-slash asks: 'What should the wiki remember from this loop?'",
    cite: "feature cc-post-loop-slash",
  },
  {
    id: "w2",
    label: "Agent drafts candidate entries",
    detail: "0-N entries with slug, triggers, body, proposed half_life_days.",
    cite: "/harness:wiki-add",
  },
  {
    id: "w3",
    label: "Operator review",
    detail: "approve / edit / reject each candidate interactively (pre-/post-loop HITL is allowed — Article III).",
    cite: "Article III",
  },
  {
    id: "w4",
    label: "Commit",
    detail: "accepted entries committed to harness/wiki/<slug>.md; iteration logged to results.tsv.",
    cite: "Article VIII (git-is-memory)",
  },
  {
    id: "w5",
    label: "Lineage log",
    detail: "loops/NNN-<slug>/wiki-refs.md records what this loop read AND wrote.",
    cite: "UX §6",
  },
];

export default function ReadWriteFlow() {
  const [mode, setMode] = useState<"read" | "write">("read");
  const steps = mode === "read" ? READ_STEPS : WRITE_STEPS;

  return (
    <figure className="my-8 rounded-2xl border border-stone-800 bg-stone-950/60 p-5">
      <div className="mb-4 flex items-center justify-between gap-3 flex-wrap">
        <div className="text-xs font-mono uppercase tracking-wider text-stone-400">
          read / write flow
        </div>
        <div
          className="inline-flex rounded-lg border border-stone-700 bg-stone-900/70 p-0.5"
          role="tablist"
        >
          <button
            role="tab"
            aria-selected={mode === "read"}
            onClick={() => setMode("read")}
            className={`px-3 py-1 text-[11px] font-mono rounded transition ${
              mode === "read"
                ? "bg-emerald-500/20 text-emerald-200"
                : "text-stone-400 hover:text-stone-200"
            }`}
          >
            ← read (pre-loop)
          </button>
          <button
            role="tab"
            aria-selected={mode === "write"}
            onClick={() => setMode("write")}
            className={`px-3 py-1 text-[11px] font-mono rounded transition ${
              mode === "write"
                ? "bg-amber-500/20 text-amber-200"
                : "text-stone-400 hover:text-stone-200"
            }`}
          >
            write (post-loop) →
          </button>
        </div>
      </div>

      <ol className="grid gap-2">
        {steps.map((s, i) => {
          const isLast = i === steps.length - 1;
          const accent = mode === "read" ? "#10b981" : "#f59e0b";
          return (
            <li key={s.id} className="relative grid grid-cols-[auto_1fr] gap-3">
              <div className="flex flex-col items-center">
                <div
                  className="flex items-center justify-center rounded-full w-7 h-7 text-[11px] font-mono font-bold"
                  style={{
                    background: accent + "22",
                    color: accent,
                    border: `1px solid ${accent}88`,
                  }}
                >
                  {i + 1}
                </div>
                {!isLast && (
                  <div
                    className="flex-1 w-px my-1"
                    style={{ background: accent + "55" }}
                  />
                )}
              </div>
              <div className="pb-3">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-stone-100">
                    {s.label}
                  </span>
                  <code className="text-[10px] font-mono text-stone-500">
                    {s.cite}
                  </code>
                </div>
                <p className="mt-0.5 text-[12px] text-stone-400 leading-snug">
                  {s.detail}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      <figcaption className="mt-2 text-[11px] text-stone-500">
        Switch the tab to see the inverse flow. Both sides are HITL-bracketed
        (pre- and post-loop only &mdash; Article III forbids in-loop{" "}
        <code>AskUserQuestion</code>).
      </figcaption>
    </figure>
  );
}
