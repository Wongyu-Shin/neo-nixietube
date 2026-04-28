"use client";

import { useState, useMemo } from "react";

/*
 * CatalogMatrix — gold-tier interactive 2×3 axis classifier.
 * Article I (Axis Classification) is the rippability boundary (axis1)
 * and the HITL boundary (axis2). Every one of the 28 catalog features
 * lands in exactly one cell.
 */

type Axis1 = "inner" | "outer";
type Axis2 = "pre-loop" | "in-loop" | "post-loop";

type Feature = {
  slug: string;
  short: string;
  axis1: Axis1;
  axis2: Axis2;
  article: string;
  blurb: string;
};

const FEATURES: Feature[] = [
  // pre-loop × inner (5)
  { slug: "harness-clarify-gate", short: "clarify-gate", axis1: "inner", axis2: "pre-loop", article: "V", blurb: "7차원 모호성 패스 → clarifications.md. 미해결 [ASSUMPTION] 시 루프 진입 차단." },
  { slug: "harness-constitution", short: "constitution", axis1: "inner", axis2: "pre-loop", article: "IX", blurb: "로드 타임 불변 조건. 9개 조항이 모든 루프 spec에 결속된다." },
  { slug: "harness-loop-scaffold", short: "loop-scaffold", axis1: "inner", axis2: "pre-loop", article: "VIII", blurb: "/harness:new-loop이 spec/clarif/plan/report/wiki-refs와 함께 loops/NNN-<slug>/ 를 스캐폴드." },
  { slug: "plan-mode-discipline", short: "plan-discipline", axis1: "inner", axis2: "pre-loop", article: "III", blurb: "ExitPlanMode이 루프 내부 실행 진입을 위한 유일한 합법 HITL 경계." },
  { slug: "swe-agent-aci", short: "swe-aci", axis1: "inner", axis2: "pre-loop", article: "I", blurb: "에이전트-컴퓨터 인터페이스 프리미티브 — CC에 내장된 구조화된 도구 표면." },

  // pre-loop × outer (6)
  { slug: "adas-meta-agent-search", short: "adas", axis1: "outer", axis2: "pre-loop", article: "IV", blurb: "메타 에이전트가 에이전트 공간을 탐색 — 외부 스크립트, 콘텐츠 도메인 평가기." },
  { slug: "alignment-free-self-improvement", short: "align-free", axis1: "outer", axis2: "pre-loop", article: "IV", blurb: "평가 스킬과 자기 수정 스킬을 분리. DGM 스타일 정렬은 여기서 실패한다." },
  { slug: "fpt-hyperagent-multirole", short: "fpt-hyper", axis1: "outer", axis2: "pre-loop", article: "IV", blurb: "다중 역할 하이퍼에이전트 플래너 (Meta FPT) — 루프 진입 전 역할 합성 프리미티브." },
  { slug: "gcli-skill-pack-distribution", short: "skill-pack", axis1: "outer", axis2: "pre-loop", article: "VII", blurb: "gcli를 통한 스킬 팩 출하 — 하네스 스킬의 레포 횡단 배포." },
  { slug: "harness-llm-wiki", short: "llm-wiki", axis1: "outer", axis2: "pre-loop", article: "VII", blurb: "키워드 트리거, 프로젝트 범위, 커밋 가능 지식 — 4번째 영속 계층." },
  { slug: "voyager-skill-library", short: "voyager", axis1: "outer", axis2: "pre-loop", article: "VII", blurb: "스킬 라이브러리 기반 — 위키 표면화에 공급되는 Voyager 스타일 커리큘럼." },

  // in-loop × inner (3)
  { slug: "cc-hook-guardrail", short: "cc-hook", axis1: "inner", axis2: "in-loop", article: "III", blurb: "PreToolUse 훅이 도구 호출 전에 범위 밖 작업을 거부. L2 예외 트리거." },
  { slug: "harness-graduated-confirm", short: "graduated", axis1: "inner", axis2: "in-loop", article: "III", blurb: "L0 침묵 / L1 30초 자동 / L2 차단. 루프 내부에서 허용되는 유일한 HITL." },
  { slug: "harness-pause-resume", short: "pause-resume", axis1: "inner", axis2: "in-loop", article: "III", blurb: "/harness:pause가 원자 경계에서 체크포인트 작성. /harness:resume이 복원." },

  // in-loop × outer (10)
  { slug: "dgm-h-archive-parent-selection", short: "dgm-h", axis1: "outer", axis2: "in-loop", article: "VIII", blurb: "Darwin-Gödel 아카이브 부모 선택 — 유지된 조상에서만 분기한다." },
  { slug: "gcli-agent-run-telemetry", short: "telemetry", axis1: "outer", axis2: "in-loop", article: "VI", blurb: "런 수준 텔레메트리 — wiki-surface 히트, 도구 호출, 가드 결과." },
  { slug: "harness-progress-cadence", short: "cadence", axis1: "outer", axis2: "in-loop", article: "VI", blurb: "이터레이션 행 + 5회마다 마일스톤 블록 + 상태 줄. 종료 시 전체 요약." },
  { slug: "harness-rip-test", short: "rip-test", axis1: "outer", axis2: "in-loop", article: "II", blurb: "현재 CC+모델 조합에서 피처 tc_script 실행. 통과=여전히 필요." },
  { slug: "meta-hyperagents-metacognitive", short: "meta-hyper", axis1: "outer", axis2: "in-loop", article: "IV", blurb: "메타인지 감독자 — 하네스가 잘못된 문제를 풀고 있음을 알아챈다." },
  { slug: "noise-aware-ratchet", short: "ratchet", axis1: "outer", axis2: "in-loop", article: "VI", blurb: "LLM 저지의 ±10 σ 노이즈. MAX 래칫 사용; 앵커는 절대 약화 금지." },
  { slug: "plateau-detection", short: "plateau", axis1: "outer", axis2: "in-loop", article: "VI", blurb: "Ratchet-patience와 trend-slope가 둘 다 평탄 → 정지 또는 급진 분기 발동." },
  { slug: "reflexion", short: "reflexion", axis1: "outer", axis2: "in-loop", article: "VIII", blurb: "언어적 자기 비평을 reflexion 항목으로 추가, Phase 1에서 다시 읽는다." },
  { slug: "sandboxed-open-ended-exploration", short: "sandbox", axis1: "outer", axis2: "in-loop", article: "III", blurb: "워크트리 격리 + 샌드박스 셸 — L2 작업이 버블을 빠져나갈 수 없다." },
  { slug: "statistical-tc-runner", short: "stat-tc", axis1: "outer", axis2: "in-loop", article: "VI", blurb: "신뢰 구간이 있는 다중 시드 TC. 노이즈 통제 통과/실패." },

  // post-loop × inner (1)
  { slug: "cc-post-loop-slash", short: "post-slash", axis1: "inner", axis2: "post-loop", article: "VIII", blurb: "/harness:report이 results.tsv + wiki-refs + 조항 결속으로 report.mdx를 합성." },

  // post-loop × outer (3)
  { slug: "cross-domain-transfer-metric", short: "transfer", axis1: "outer", axis2: "post-loop", article: "II", blurb: "루프의 verify를 짝 보류 도메인에서 실행 — TC 과적합을 잡아낸다." },
  { slug: "gcli-eval-compare-primitive", short: "eval-cmp", axis1: "outer", axis2: "post-loop", article: "VI", blurb: "baseline 참조에 대한 짝 A/B — verify 출력을 통계적 비교로 전환." },
  { slug: "llm-as-judge-audit", short: "judge-audit", axis1: "outer", axis2: "post-loop", article: "IV", blurb: "자기 강화 편향 통제와 함께 루브릭 채점 (저지 모델 ≠ 후보 모델)." },
];

const PHASES: { key: Axis2; label: string; hint: string }[] = [
  { key: "pre-loop", label: "루프 진입 전", hint: "HITL 허용" },
  { key: "in-loop", label: "루프 내부", hint: "HITL 금지 (조항 III)" },
  { key: "post-loop", label: "루프 종료 후", hint: "HITL 허용" },
];

const TIERS: { key: Axis1; label: string; hint: string; color: string }[] = [
  { key: "inner", label: "내부", hint: "CC 내부에 산다 (.claude/)", color: "#7B9EB8" },
  { key: "outer", label: "외부", hint: "CC 바깥에 산다 (셸 / MCP)", color: "#D4A853" },
];

/* SVG layout constants */
const VB_W = 1100;
const VB_H = 620;
const PAD_L = 130;
const PAD_T = 80;
const CELL_W = (VB_W - PAD_L - 40) / 3; // 3 phases
const CELL_H = (VB_H - PAD_T - 70) / 2; // 2 tiers

function cellBox(a1: Axis1, a2: Axis2) {
  const col = PHASES.findIndex((p) => p.key === a2);
  const row = TIERS.findIndex((t) => t.key === a1);
  return {
    x: PAD_L + col * CELL_W,
    y: PAD_T + row * CELL_H,
    w: CELL_W,
    h: CELL_H,
  };
}

/* Deterministic, collision-avoidant node placement within a cell. */
function layoutCell(a1: Axis1, a2: Axis2, n: number) {
  const { x, y, w, h } = cellBox(a1, a2);
  const pad = 26;
  const innerW = w - pad * 2;
  const innerH = h - pad * 2;
  const cols = Math.min(4, Math.max(2, Math.ceil(Math.sqrt(n))));
  const rows = Math.ceil(n / cols);
  const pts: { cx: number; cy: number }[] = [];
  for (let i = 0; i < n; i++) {
    const c = i % cols;
    const r = Math.floor(i / cols);
    const dx = cols === 1 ? innerW / 2 : (innerW / (cols - 1)) * c;
    const dy = rows === 1 ? innerH / 2 : (innerH / (rows - 1)) * r;
    pts.push({ cx: x + pad + dx, cy: y + pad + dy });
  }
  return pts;
}

export default function CatalogMatrix() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const [tierFilter, setTierFilter] = useState<Axis1 | "all">("all");

  const active = pinned ?? hovered;
  const activeF = FEATURES.find((f) => f.slug === active) ?? null;

  const nodes = useMemo(() => {
    const out: (Feature & { cx: number; cy: number })[] = [];
    for (const a1 of ["inner", "outer"] as Axis1[]) {
      for (const a2 of ["pre-loop", "in-loop", "post-loop"] as Axis2[]) {
        const bucket = FEATURES.filter((f) => f.axis1 === a1 && f.axis2 === a2);
        const pts = layoutCell(a1, a2, bucket.length);
        bucket.forEach((f, i) => out.push({ ...f, cx: pts[i].cx, cy: pts[i].cy }));
      }
    }
    return out;
  }, []);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const f of FEATURES) {
      const k = `${f.axis1}|${f.axis2}`;
      c[k] = (c[k] ?? 0) + 1;
    }
    return c;
  }, []);

  const dimmed = (f: Feature) => {
    if (tierFilter !== "all" && f.axis1 !== tierFilter) return true;
    if (!active) return false;
    return f.slug !== active;
  };

  return (
    <figure className="my-8 not-prose">
      <div className="mb-3 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-wider text-stone-400">
        <span className="mr-1">tier filter:</span>
        {(["all", "inner", "outer"] as const).map((k) => (
          <button
            key={k}
            onClick={() => setTierFilter(k)}
            className={`px-2 py-0.5 rounded-full border transition ${
              tierFilter === k
                ? "border-[#D4A853] text-[#D4A853] bg-[#D4A853]/10"
                : "border-stone-700 text-stone-400 hover:border-stone-500"
            }`}
          >
            {k}
          </button>
        ))}
        <span className="ml-3 text-stone-500 normal-case tracking-normal">
          Article I — every feature declares axis1 × axis2. Hover a node; click to pin.
        </span>
      </div>

      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        className="w-full rounded-xl border border-stone-800 bg-[#0f0d0a]"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="28개 하네스 피처를 axis1 (내부/외부) × axis2 (루프 진입 전/내부/종료 후) 로 배치"
      >
        <defs>
          <radialGradient id="cm-bg" cx="50%" cy="0%" r="95%">
            <stop offset="0%" stopColor="#1a1510" />
            <stop offset="100%" stopColor="#0b0906" />
          </radialGradient>
          <linearGradient id="cm-inner-band" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7B9EB8" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#7B9EB8" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="cm-outer-band" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D4A853" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#D4A853" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="cm-preloop" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6BA368" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#6BA368" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="cm-inloop" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ef8f44" stopOpacity="0.0" />
            <stop offset="50%" stopColor="#ef8f44" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#ef8f44" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="cm-postloop" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#B8A9C9" stopOpacity="0.0" />
            <stop offset="100%" stopColor="#B8A9C9" stopOpacity="0.05" />
          </linearGradient>
          <radialGradient id="cm-node-inner" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#BFD9E8" />
            <stop offset="70%" stopColor="#7B9EB8" />
            <stop offset="100%" stopColor="#2b4050" />
          </radialGradient>
          <radialGradient id="cm-node-outer" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#F3D991" />
            <stop offset="70%" stopColor="#D4A853" />
            <stop offset="100%" stopColor="#4a3a18" />
          </radialGradient>
          <filter id="cm-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="cm-soft" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="1.5" />
          </filter>
          <pattern id="cm-grid" x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse">
            <path d="M 22 0 L 0 0 0 22" fill="none" stroke="#2a2418" strokeWidth="0.4" />
          </pattern>
        </defs>

        {/* Background */}
        <rect width={VB_W} height={VB_H} fill="url(#cm-bg)" />
        <rect width={VB_W} height={VB_H} fill="url(#cm-grid)" opacity="0.4" />

        {/* Row bands (tier colouring) */}
        <rect
          x={PAD_L}
          y={PAD_T}
          width={CELL_W * 3}
          height={CELL_H}
          fill="url(#cm-inner-band)"
        />
        <rect
          x={PAD_L}
          y={PAD_T + CELL_H}
          width={CELL_W * 3}
          height={CELL_H}
          fill="url(#cm-outer-band)"
        />

        {/* Column bands (phase colouring) */}
        <rect x={PAD_L} y={PAD_T} width={CELL_W} height={CELL_H * 2} fill="url(#cm-preloop)" />
        <rect x={PAD_L + CELL_W} y={PAD_T} width={CELL_W} height={CELL_H * 2} fill="url(#cm-inloop)" />
        <rect x={PAD_L + CELL_W * 2} y={PAD_T} width={CELL_W} height={CELL_H * 2} fill="url(#cm-postloop)" />

        {/* HITL-forbidden band marker (Article III) */}
        <rect
          x={PAD_L + CELL_W}
          y={PAD_T - 14}
          width={CELL_W}
          height={6}
          fill="#ef8f44"
          opacity="0.55"
        />
        <text
          x={PAD_L + CELL_W + CELL_W / 2}
          y={PAD_T - 20}
          textAnchor="middle"
          fontSize="10"
          fill="#ef8f44"
          fontFamily="ui-monospace, monospace"
          opacity="0.85"
        >
          Article III — HITL forbidden inside this column
        </text>

        {/* Axis frame */}
        <rect
          x={PAD_L}
          y={PAD_T}
          width={CELL_W * 3}
          height={CELL_H * 2}
          fill="none"
          stroke="#3a3020"
          strokeWidth="1.2"
        />

        {/* Cell dividers */}
        <line x1={PAD_L + CELL_W} y1={PAD_T} x2={PAD_L + CELL_W} y2={PAD_T + CELL_H * 2} stroke="#3a3020" strokeWidth="0.8" strokeDasharray="3 4" />
        <line x1={PAD_L + CELL_W * 2} y1={PAD_T} x2={PAD_L + CELL_W * 2} y2={PAD_T + CELL_H * 2} stroke="#3a3020" strokeWidth="0.8" strokeDasharray="3 4" />
        <line x1={PAD_L} y1={PAD_T + CELL_H} x2={PAD_L + CELL_W * 3} y2={PAD_T + CELL_H} stroke="#3a3020" strokeWidth="0.8" strokeDasharray="3 4" />

        {/* Column headers */}
        {PHASES.map((p, i) => (
          <g key={p.key}>
            <text
              x={PAD_L + i * CELL_W + CELL_W / 2}
              y={PAD_T - 40}
              textAnchor="middle"
              fontSize="18"
              fontFamily="ui-monospace, monospace"
              fill="#e8dfc8"
              fontWeight="600"
            >
              {p.label}
            </text>
            <text
              x={PAD_L + i * CELL_W + CELL_W / 2}
              y={PAD_T - 24}
              textAnchor="middle"
              fontSize="10"
              fill="#8a7a58"
              fontFamily="ui-monospace, monospace"
            >
              {p.hint}
            </text>
          </g>
        ))}

        {/* Row headers */}
        {TIERS.map((t, i) => (
          <g key={t.key}>
            <text
              x={PAD_L - 22}
              y={PAD_T + i * CELL_H + CELL_H / 2 - 6}
              textAnchor="end"
              fontSize="16"
              fontFamily="ui-monospace, monospace"
              fill={t.color}
              fontWeight="600"
            >
              {t.label}
            </text>
            <text
              x={PAD_L - 22}
              y={PAD_T + i * CELL_H + CELL_H / 2 + 10}
              textAnchor="end"
              fontSize="9"
              fill="#8a7a58"
              fontFamily="ui-monospace, monospace"
            >
              {t.hint}
            </text>
            <rect
              x={PAD_L - 14}
              y={PAD_T + i * CELL_H + 8}
              width={5}
              height={CELL_H - 16}
              fill={t.color}
              opacity="0.5"
              rx="2"
            />
          </g>
        ))}

        {/* Cell count badges */}
        {TIERS.map((t, ri) =>
          PHASES.map((p, ci) => {
            const n = counts[`${t.key}|${p.key}`] ?? 0;
            return (
              <g key={`${t.key}-${p.key}`}>
                <rect
                  x={PAD_L + ci * CELL_W + 10}
                  y={PAD_T + ri * CELL_H + 10}
                  width={44}
                  height={18}
                  rx="9"
                  fill="#000"
                  opacity="0.55"
                />
                <text
                  x={PAD_L + ci * CELL_W + 32}
                  y={PAD_T + ri * CELL_H + 22}
                  textAnchor="middle"
                  fontSize="10"
                  fill={t.color}
                  fontFamily="ui-monospace, monospace"
                >
                  n={n}
                </text>
              </g>
            );
          })
        )}

        {/* Feature nodes */}
        {nodes.map((f) => {
          const isActive = f.slug === active;
          const isDim = dimmed(f);
          const r = isActive ? 14 : 9;
          return (
            <g
              key={f.slug}
              style={{ cursor: "pointer", transition: "opacity 0.25s" }}
              opacity={isDim ? 0.18 : 1}
              onMouseEnter={() => setHovered(f.slug)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setPinned(pinned === f.slug ? null : f.slug)}
            >
              {isActive && (
                <circle
                  cx={f.cx}
                  cy={f.cy}
                  r={22}
                  fill={f.axis1 === "inner" ? "#7B9EB8" : "#D4A853"}
                  opacity="0.25"
                  filter="url(#cm-glow)"
                />
              )}
              <circle
                cx={f.cx}
                cy={f.cy}
                r={r}
                fill={`url(#cm-node-${f.axis1})`}
                stroke={isActive ? "#ffffff" : f.axis1 === "inner" ? "#9BB8CC" : "#E8C878"}
                strokeWidth={isActive ? 1.8 : 0.8}
              />
              <circle
                cx={f.cx - r * 0.3}
                cy={f.cy - r * 0.35}
                r={r * 0.32}
                fill="#ffffff"
                opacity="0.35"
                filter="url(#cm-soft)"
              />
              <text
                x={f.cx}
                y={f.cy + r + 14}
                textAnchor="middle"
                fontSize="9.5"
                fill={isActive ? "#ffffff" : "#c8bfa0"}
                fontFamily="ui-monospace, monospace"
                style={{ pointerEvents: "none" }}
              >
                {f.short}
              </text>
              <text
                x={f.cx}
                y={f.cy + 3}
                textAnchor="middle"
                fontSize="8"
                fill="#000"
                opacity="0.7"
                fontFamily="ui-monospace, monospace"
                style={{ pointerEvents: "none" }}
              >
                {f.article}
              </text>
            </g>
          );
        })}

        {/* Detail pane (bottom) */}
        <g transform={`translate(${PAD_L}, ${VB_H - 60})`}>
          <rect
            x={0}
            y={0}
            width={CELL_W * 3}
            height={52}
            rx="8"
            fill="#120f0a"
            stroke="#2a2418"
            strokeWidth="1"
          />
          {activeF ? (
            <>
              <circle
                cx={22}
                cy={26}
                r={8}
                fill={`url(#cm-node-${activeF.axis1})`}
                stroke={activeF.axis1 === "inner" ? "#9BB8CC" : "#E8C878"}
              />
              <text x={42} y={22} fontSize="12" fontFamily="ui-monospace, monospace" fill="#e8dfc8" fontWeight="600">
                {activeF.slug}
              </text>
              <text x={42} y={22} fontSize="10" fontFamily="ui-monospace, monospace" fill="#8a7a58" textAnchor="start" dx={activeF.slug.length * 7.3 + 10}>
                조항 {activeF.article} · {activeF.axis1} · {activeF.axis2}
              </text>
              <text x={42} y={40} fontSize="10.5" fontFamily="ui-monospace, monospace" fill="#c8bfa0">
                {activeF.blurb.length > 110 ? activeF.blurb.slice(0, 108) + "…" : activeF.blurb}
              </text>
            </>
          ) : (
            <text x={22} y={30} fontSize="11" fontFamily="ui-monospace, monospace" fill="#6a5f48">
              노드 위에 호버 — 28개 피처 · axis1 ∈ {"{inner, outer}"} · axis2 ∈ {"{pre-loop, in-loop, post-loop}"} · 조항 I
            </text>
          )}
        </g>
      </svg>

      <figcaption className="mt-2 text-xs text-stone-500 text-center">
        카탈로그 매트릭스 — 28개 피처, 조항 I 축 분류. 내부 셀은 CC 네이티브
        (<span className="text-[#7B9EB8]">파랑</span>); 외부 셀은 셸/MCP
        (<span className="text-[#D4A853]">금색</span>). 중앙 열 (루프 내부) 은 단계적 확인과
        Ctrl+C를 제외하면 조항 III에 따라 HITL 금지.
      </figcaption>
    </figure>
  );
}
