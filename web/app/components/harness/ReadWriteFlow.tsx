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
    label: "SessionStart 훅 발동",
    detail: "wiki-surface SKILL.md가 운영자의 첫 메시지 + 트랜스크립트 마지막 N줄을 읽는다.",
    cite: ".claude/skills/wiki-surface/SKILL.md",
  },
  {
    id: "r2",
    label: "토큰화 + 소문자화",
    detail: "비영숫자에서 분리; 1자 이하 토큰 폐기; kebab-case 하이픈은 보존.",
    cite: "scripts/harness/wiki_match.sh",
  },
  {
    id: "r3",
    label: "모든 항목 점수화",
    detail: "harness/wiki/*.md 항목별로 트리거 겹침 카운트.",
    cite: "피처 harness-llm-wiki",
  },
  {
    id: "r4",
    label: "상위 3개 제한, <system-reminder> 주입",
    detail: "노후 항목도 표면화되며 restale-due 태그가 붙는다.",
    cite: "조항 VII",
  },
  {
    id: "r5",
    label: "사용 로그",
    detail: "gcli-agent-run-telemetry가 루프 도중 에이전트가 인용한 항목을 기록.",
    cite: "피처 gcli-agent-run-telemetry",
  },
];

const WRITE_STEPS: Step[] = [
  {
    id: "w1",
    label: "루프 종료 후 리포터 프롬프트",
    detail: "cc-post-loop-slash가 묻는다: '이 루프에서 위키가 기억할 만한 것은?'",
    cite: "피처 cc-post-loop-slash",
  },
  {
    id: "w2",
    label: "에이전트가 후보 항목 작성",
    detail: "슬러그, 트리거, 본문, 제안 half_life_days를 가진 0–N개 항목.",
    cite: "/harness:wiki-add",
  },
  {
    id: "w3",
    label: "운영자 리뷰",
    detail: "각 후보를 인터랙티브하게 승인/편집/거부 (루프 진입 전/종료 후 HITL은 허용 — 조항 III).",
    cite: "조항 III",
  },
  {
    id: "w4",
    label: "커밋",
    detail: "수락된 항목을 harness/wiki/<slug>.md 에 커밋; 이터레이션은 results.tsv 에 로깅.",
    cite: "조항 VIII (git이 곧 메모리)",
  },
  {
    id: "w5",
    label: "계보 로그",
    detail: "loops/NNN-<slug>/wiki-refs.md가 이 루프가 읽은 것과 쓴 것을 기록한다.",
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
          읽기 / 쓰기 플로우
        </div>
        <div
          className="inline-flex rounded-lg border border-stone-700 bg-stone-900/70 p-0.5"
          role="tablist"
        >
          <button
            role="tab"
            aria-selected={mode === "read"}
            onClick={() => setMode("read")}
            className={`px-3 py-1 text-[12px] font-mono rounded transition ${
              mode === "read"
                ? "bg-emerald-500/20 text-emerald-200"
                : "text-stone-400 hover:text-stone-200"
            }`}
          >
            ← 읽기 (루프 진입 전)
          </button>
          <button
            role="tab"
            aria-selected={mode === "write"}
            onClick={() => setMode("write")}
            className={`px-3 py-1 text-[12px] font-mono rounded transition ${
              mode === "write"
                ? "bg-amber-500/20 text-amber-200"
                : "text-stone-400 hover:text-stone-200"
            }`}
          >
            쓰기 (루프 종료 후) →
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
                  className="flex items-center justify-center rounded-full w-7 h-7 text-[12px] font-mono font-bold"
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
                  <code className="text-[12px] font-mono text-stone-500">
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

      <figcaption className="mt-2 text-[12px] text-stone-500">
        탭을 전환하면 반대 플로우가 보인다. 양쪽 모두 HITL 괄호 안에 있다
        (루프 진입 전/종료 후만 &mdash; 조항 III가 루프 내부의{" "}
        <code>AskUserQuestion</code> 을 금지).
      </figcaption>
    </figure>
  );
}
