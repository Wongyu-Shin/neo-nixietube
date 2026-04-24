"use client";

import { useState } from "react";

/**
 * Interactive slash-command cheat sheet. Filter by phase.
 * Content sourced from `harness/UX.md` section 8.
 */

type Cmd = {
  cmd: string;
  phase: "pre" | "in" | "post";
  purpose: string;
  feature: string;
};

const COMMANDS: Cmd[] = [
  { cmd: "/harness:new-loop <slug>", phase: "pre", purpose: "Scaffold loops/NNN-<slug>/", feature: "harness-loop-scaffold" },
  { cmd: "/harness:clarify", phase: "pre", purpose: "7-dim ambiguity pass → clarifications.md", feature: "harness-clarify-gate" },
  { cmd: "/autoresearch:plan", phase: "pre", purpose: "Interactive wizard + baseline dry-run", feature: "plan-mode-discipline" },
  { cmd: "ExitPlanMode", phase: "pre", purpose: "Sole HITL gate into in-loop", feature: "plan-mode-discipline" },
  { cmd: "/harness:pause", phase: "in", purpose: "Checkpoint + stop at next iter boundary", feature: "harness-pause-resume" },
  { cmd: '/harness:send "<msg>"', phase: "in", purpose: "Inject mid-flight hint without pausing", feature: "harness-pause-resume" },
  { cmd: "/harness:status", phase: "in", purpose: "Show active loops + progress", feature: "harness-progress-cadence" },
  { cmd: "Ctrl+C", phase: "in", purpose: "Emergency stop (lossy; writes crash-checkpoint)", feature: "harness-pause-resume" },
  { cmd: "/harness:report", phase: "post", purpose: "Render report.mdx", feature: "cc-post-loop-slash" },
  { cmd: "/harness:wiki-add", phase: "post", purpose: "Propose keyword-triggered wiki entries", feature: "harness-llm-wiki" },
  { cmd: "/harness:abandon <run_id>", phase: "post", purpose: "Graceful terminate + report", feature: "cc-post-loop-slash" },
  { cmd: "/harness:resume <run_id>", phase: "post", purpose: "Continue a paused loop", feature: "harness-pause-resume" },
];

const PHASE_COLOR: Record<Cmd["phase"], string> = {
  pre: "#6BA368",
  in: "#D4A853",
  post: "#B8A9C9",
};

export default function CommandCheatsheet() {
  const [filter, setFilter] = useState<"all" | Cmd["phase"]>("all");
  const visible = filter === "all" ? COMMANDS : COMMANDS.filter((c) => c.phase === filter);

  const pills: Array<{ id: "all" | Cmd["phase"]; label: string }> = [
    { id: "all", label: "all" },
    { id: "pre", label: "pre-loop" },
    { id: "in", label: "in-loop" },
    { id: "post", label: "post-loop" },
  ];

  return (
    <figure className="my-8">
      <div className="flex flex-wrap gap-2 mb-4">
        {pills.map((p) => {
          const isActive = filter === p.id;
          const color = p.id === "all" ? "#D4A853" : PHASE_COLOR[p.id as Cmd["phase"]];
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setFilter(p.id)}
              className="text-xs px-3 py-1.5 rounded-full border transition-colors"
              style={{
                background: isActive ? color + "33" : "transparent",
                borderColor: isActive ? color : "#3a2e1e",
                color: isActive ? color : "#9a8660",
              }}
            >
              {p.label}
            </button>
          );
        })}
      </div>
      <div className="rounded-xl border border-white/10 bg-stone-950 overflow-hidden">
        <div className="grid grid-cols-[minmax(200px,1.2fr)_2fr_minmax(140px,1fr)] text-[10px] uppercase tracking-widest text-stone-500 bg-stone-900 border-b border-white/10">
          <div className="px-4 py-2">command</div>
          <div className="px-4 py-2">purpose</div>
          <div className="px-4 py-2">feature</div>
        </div>
        {visible.map((c) => (
          <div
            key={c.cmd}
            className="grid grid-cols-[minmax(200px,1.2fr)_2fr_minmax(140px,1fr)] text-sm border-b border-white/5 last:border-b-0 hover:bg-stone-900/40 transition-colors"
          >
            <div className="px-4 py-2 flex items-center gap-2">
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: PHASE_COLOR[c.phase] }}
              />
              <code className="text-amber-300 text-xs">{c.cmd}</code>
            </div>
            <div className="px-4 py-2 text-xs text-stone-400">{c.purpose}</div>
            <div className="px-4 py-2 text-xs">
              <code className="text-stone-400">{c.feature}</code>
            </div>
          </div>
        ))}
      </div>
      <figcaption className="text-xs text-stone-500 text-center mt-3">
        Source: <code className="text-amber-200">harness/UX.md</code> §8.
      </figcaption>
    </figure>
  );
}
