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
  { name: "loops/NNN-<slug>/", kind: "dir", detail: "루프당 디렉터리 하나, harness-loop-scaffold가 단조 증가 번호 부여.", article: "VIII" },
  { name: "spec.md", kind: "file", detail: "Goal / Scope / Metric / direction / baseline. 조항 참조 블록을 선언.", article: "I" },
  { name: "clarifications.md", kind: "file", detail: "/harness:clarify 의 운영자 Q/A 기록. 암묵적 선택은 [ASSUMPTION] 마커.", article: "V" },
  { name: "plan.md", kind: "file", detail: "/autoresearch:plan 의 승인된 계획. 진입은 ExitPlanMode 필요.", article: "III" },
  { name: "results.tsv", kind: "file", detail: "이터레이션 로그: iter, score, delta, verdict, commit. Gitignored (재구성 가능).", article: "VIII" },
  { name: "checkpoints/", kind: "dir", detail: "harness-pause-resume이 작성하는 일시 정지/재개용 JSON 스냅샷.", article: "III" },
  { name: "  <ts>.json", kind: "file", detail: "체크포인트 경계의 구조화된 상태; /harness:resume <run_id> 로 재개 가능.", article: "III" },
  { name: "report.mdx", kind: "file", detail: "cc-post-loop-slash가 렌더하는 서사형 인계. 템플릿 결속 절.", article: "VIII" },
  { name: "wiki-refs.md", kind: "file", detail: "이 루프가 읽은 위키 항목과 작성한 위키 항목 — 지식 계보를 양방향으로 추적.", article: "VII" },
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
                    조항 {n.article}
                  </span>
                )}
              </div>
            );
          })}
        </div>
        <aside className="rounded-xl border border-white/10 bg-stone-900/60 p-5 text-sm">
          <div className="uppercase tracking-widest text-[10px] text-amber-400 mb-2">
            {node.kind === "dir" ? "디렉터리" : "파일"}
            {node.article ? ` · 조항 ${node.article}` : ""}
          </div>
          <div className="text-base font-semibold text-amber-200 mb-3 font-mono break-all">
            {node.name.trim()}
          </div>
          <p className="text-xs text-stone-400 leading-relaxed">{node.detail}</p>
        </aside>
      </div>
      <figcaption className="text-xs text-stone-500 text-center mt-3">
        산출물 트리 · <code className="text-amber-200">harness/UX.md §6</code>.
      </figcaption>
    </figure>
  );
}
