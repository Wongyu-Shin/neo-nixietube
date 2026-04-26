"use client";

import { useState } from "react";

/**
 * Per-loop artifact tree with hover annotations.
 * Source: `harness/UX.md` §6.
 */

type Node = {
  name: string;
  kind: "dir" | "file";
  detail: string;
  article?: string;
};

const NODES: Node[] = [
  { name: "loops/NNN-<slug>/", kind: "dir", detail: "One directory per loop, numbered monotonically by harness-loop-scaffold.", article: "VIII" },
  { name: "spec.md", kind: "file", detail: "Goal / Scope / Metric / direction / baseline. Declares Article references block.", article: "I" },
  { name: "clarifications.md", kind: "file", detail: "Operator Q/A record from /harness:clarify. [ASSUMPTION] markers for implicit choices.", article: "V" },
  { name: "plan.md", kind: "file", detail: "Approved plan from /autoresearch:plan. Entry requires ExitPlanMode.", article: "III" },
  { name: "results.tsv", kind: "file", detail: "Per-iteration log: iter, score, delta, verdict, commit. Gitignored (reconstructable).", article: "VIII" },
  { name: "checkpoints/", kind: "dir", detail: "Pause-resume JSON snapshots written by harness-pause-resume.", article: "III" },
  { name: "  <ts>.json", kind: "file", detail: "Structured state at a checkpoint boundary; resumable via /harness:resume <run_id>.", article: "III" },
  { name: "report.mdx", kind: "file", detail: "Narrative handback rendered by cc-post-loop-slash. Template-bound sections.", article: "VIII" },
  { name: "wiki-refs.md", kind: "file", detail: "Which wiki entries this loop read AND wrote — traces knowledge lineage forward/backward.", article: "VII" },
];

export default function ArtifactTree() {
  const [active, setActive] = useState<string>("spec.md");
  const node = NODES.find((n) => n.name === active)!;

  return (
    <figure className="my-8">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-4">
        <div className="rounded-xl border border-white/10 bg-stone-950 font-mono text-sm p-5">
          {NODES.map((n) => {
            const isActive = active === n.name;
            const isDir = n.kind === "dir";
            return (
              <div
                key={n.name}
                onMouseEnter={() => setActive(n.name)}
                className={`flex items-center gap-2 py-1 px-2 rounded cursor-default transition-colors ${
                  isActive ? "bg-amber-400/10" : "hover:bg-stone-900"
                }`}
              >
                <span
                  className="w-4 text-center"
                  style={{ color: isDir ? "#D4A853" : "#7B9EB8" }}
                >
                  {isDir ? "▸" : "·"}
                </span>
                <span className={isActive ? "text-amber-200" : "text-stone-300"}>
                  {n.name}
                </span>
                {n.article && (
                  <span className="ml-auto text-[10px] text-stone-600">
                    Art. {n.article}
                  </span>
                )}
              </div>
            );
          })}
        </div>
        <aside className="rounded-xl border border-white/10 bg-stone-900/60 p-5 text-sm">
          <div className="uppercase tracking-widest text-[10px] text-amber-400 mb-2">
            {node.kind === "dir" ? "directory" : "file"}
            {node.article ? ` · Article ${node.article}` : ""}
          </div>
          <div className="text-base font-semibold text-amber-200 mb-3 font-mono break-all">
            {node.name.trim()}
          </div>
          <p className="text-xs text-stone-400 leading-relaxed">{node.detail}</p>
        </aside>
      </div>
      <figcaption className="text-xs text-stone-500 text-center mt-3">
        Artifact tree · <code className="text-amber-200">harness/UX.md §6</code>.
      </figcaption>
    </figure>
  );
}
