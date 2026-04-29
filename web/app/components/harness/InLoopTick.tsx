"use client";

import { useState, useMemo } from "react";

/*
 * InLoopTick — gold-tier interactive radial diagram of ONE iteration tick.
 *
 * PhaseTimeline shows the whole loop (scaffold → report, phases 0..9).
 * This component zooms into the *in-loop block only* — what happens between
 * one commit and the next. Eight wedges, eight gates, arranged as a clock
 * face so the reader sees the cyclic structure at a glance.
 *
 * Interaction: hover a wedge → highlight wedge + surface the feature slugs,
 * Article refs, and failure mode in the side panel. Click to pin.
 */

type HitlPolicy = "forbidden" | "carve-out" | "allowed";

type Gate = {
  id: string;
  idx: number; // 0-based position around the clock (0 = 12 o'clock)
  title: string;
  short: string;
  detail: string;
  features: string[];
  articles: string[];
  hitl: HitlPolicy;
  failure: string; // what goes wrong if this gate is skipped
  color: string;
  category: "read" | "write" | "check" | "decide" | "log";
};

const GATES: Gate[] = [
  {
    id: "review",
    idx: 0,
    title: "1 · 리뷰",
    short: "상태 로드",
    detail:
      "git log, TSV, reflexion 트레이스, 위키 키워드 표면화를 가져온다. 헌법은 이미 고정되어 있다.",
    features: ["harness-llm-wiki", "reflexion", "harness-constitution"],
    articles: ["I", "VII"],
    hitl: "forbidden",
    failure: "리뷰 생략 → 발상이 직전 이터레이션의 교훈 원장을 잃는다",
    color: "#7B9EB8",
    category: "read",
  },
  {
    id: "ideate",
    idx: 1,
    title: "2 · 발상",
    short: "변경 제안",
    detail:
      "에이전트가 원자적인 변경 하나를 작성한다. 부수 효과는 아직 없다. 방향은 운영자가 아닌 spec이 정한다.",
    features: ["adas-meta-agent-search", "dgm-h-archive-parent-selection"],
    articles: ["IV", "V"],
    hitl: "forbidden",
    failure: "범위 없는 발상 → 방향에서 표류, 후속 단계에서 폐기",
    color: "#B8A9C9",
    category: "write",
  },
  {
    id: "modify",
    idx: 2,
    title: "3 · 수정",
    short: "파일 편집",
    detail:
      "L0 작업 침묵 · L1 작업 30초 자동 승인 알림 · L2 작업 일시 정지. 훅 가드레일이 범위 밖 Bash를 거부한다.",
    features: ["harness-graduated-confirm", "cc-hook-guardrail", "sandboxed-open-ended-exploration"],
    articles: ["III"],
    hitl: "carve-out",
    failure: "샌드박스 없는 수정 → L2 누락 시 비가역 피해",
    color: "#D4A853",
    category: "write",
  },
  {
    id: "commit",
    idx: 3,
    title: "4 · 커밋",
    short: "git commit",
    detail:
      "모든 후보는 verify 전에 커밋된다 — 폐기는 git reset이 아니라 git revert로 (조항 VIII). 실패는 히스토리에 남는 교훈이다.",
    features: ["harness-loop-scaffold"],
    articles: ["VIII"],
    hitl: "forbidden",
    failure: "폐기 시 reset --hard → 교훈 소실, 감사 불가능한 히스토리",
    color: "#C17B5E",
    category: "write",
  },
  {
    id: "verify",
    idx: 4,
    title: "5 · 검증",
    short: "n회 시행",
    detail:
      "N회 이상 시행하는 통계적 러너; 노이즈 인지. composite-guard.sh가 스키마 + crosscheck 11/11을 통과해야 한다.",
    features: ["statistical-tc-runner", "harness-rip-test"],
    articles: ["VI"],
    hitl: "forbidden",
    failure: "단일 시행 verify → 노이즈를 신호로 오인, 거짓 keep",
    color: "#6BA368",
    category: "check",
  },
  {
    id: "decide",
    idx: 5,
    title: "6 · 결정",
    short: "keep / discard",
    detail:
      "σ 허용과 함께 MAX 래칫 — 노이즈로 앵커를 약화시키지 않는다. 통과하는 후보가 없으면 부모 선택이 아카이브에서 끌어온다.",
    features: ["noise-aware-ratchet", "dgm-h-archive-parent-selection", "plateau-detection"],
    articles: ["VI"],
    hitl: "forbidden",
    failure: "MEAN 래칫 → 운이 나쁜 이터레이션에서 래칫이 뒤로 걷는다",
    color: "#8FA376",
    category: "decide",
  },
  {
    id: "log",
    idx: 6,
    title: "7 · 로그",
    short: "텔레메트리 틱",
    detail:
      "이터레이션당 한 줄, 5회마다 마일스톤 블록, 상태 줄 갱신, 텔레메트리 이벤트. 운영자 프롬프트 없음.",
    features: ["harness-progress-cadence", "gcli-agent-run-telemetry"],
    articles: ["III", "VIII"],
    hitl: "forbidden",
    failure: "조용한 루프 → 운영자가 한눈에 모니터링 불가; 감시 사망",
    color: "#7B9EB8",
    category: "log",
  },
  {
    id: "reflect",
    idx: 7,
    title: "8 · 성찰",
    short: "비평 → 위키",
    detail:
      "reflexion 항목 추가. 플래토 검사 (patience AND slope). 어느 한 쪽이라도 발화하면 루프 종료; 아니면 리뷰로 복귀.",
    features: ["reflexion", "plateau-detection", "meta-hyperagents-metacognitive"],
    articles: ["IV", "VII"],
    hitl: "forbidden",
    failure: "reflexion 없음 → 다음 이터레이션이 같은 막다른 길을 반복",
    color: "#D4A853",
    category: "check",
  },
];

const HITL_COLOR: Record<HitlPolicy, string> = {
  forbidden: "#C17B5E",
  "carve-out": "#D4A853",
  allowed: "#6BA368",
};

const HITL_LABEL: Record<HitlPolicy, string> = {
  forbidden: "HITL 금지",
  "carve-out": "HITL 예외",
  allowed: "HITL 허용",
};

const CATEGORY_LABEL: Record<Gate["category"], string> = {
  read: "읽기",
  write: "쓰기",
  check: "검사",
  decide: "결정",
  log: "로그",
};

/* polar → cartesian around (cx, cy) */
function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

/* build an SVG annular-wedge path */
function wedgePath(
  cx: number,
  cy: number,
  rInner: number,
  rOuter: number,
  startDeg: number,
  endDeg: number,
) {
  const p1 = polar(cx, cy, rOuter, startDeg);
  const p2 = polar(cx, cy, rOuter, endDeg);
  const p3 = polar(cx, cy, rInner, endDeg);
  const p4 = polar(cx, cy, rInner, startDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return [
    `M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`,
    `A ${rOuter} ${rOuter} 0 ${large} 1 ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`,
    `L ${p3.x.toFixed(2)} ${p3.y.toFixed(2)}`,
    `A ${rInner} ${rInner} 0 ${large} 0 ${p4.x.toFixed(2)} ${p4.y.toFixed(2)}`,
    "Z",
  ].join(" ");
}

export default function InLoopTick() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>("verify");

  const activeId = hovered ?? pinned;
  const active = useMemo(
    () => (activeId ? GATES.find((g) => g.id === activeId) ?? null : null),
    [activeId],
  );

  const W = 720;
  const H = 520;
  const CX = 260;
  const CY = 260;
  const R_OUTER = 210;
  const R_INNER = 100;
  const R_LABEL = 240;
  const R_CATEGORY = 75;
  const N = GATES.length;
  const SLICE = 360 / N;
  const GAP = 2.2; // visual gap between wedges (deg)

  return (
    <figure className="my-8">
      <div className="max-w-5xl mx-auto rounded-xl border border-stone-800 bg-stone-950/50 p-4">
        <div className="grid md:grid-cols-[minmax(0,1fr)_280px] gap-4 items-start">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="루프 내부 한 이터레이션 틱의 8개 웨지 방사 다이어그램"
          >
            <defs>
              <radialGradient id="tick-bg" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#1a1a1a" />
                <stop offset="100%" stopColor="#0b0b0b" />
              </radialGradient>
              <filter id="tick-glow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="3.2" />
              </filter>
            </defs>

            <rect x="0" y="0" width={W} height={H} fill="#0b0b0b" />

            {/* faint guide rings */}
            <circle cx={CX} cy={CY} r={R_OUTER} fill="none" stroke="#1d1d1d" />
            <circle cx={CX} cy={CY} r={R_INNER} fill="none" stroke="#1d1d1d" />
            <circle cx={CX} cy={CY} r={(R_OUTER + R_INNER) / 2} fill="none" stroke="#1d1d1d" strokeDasharray="2 3" />

            {/* center disc */}
            <circle cx={CX} cy={CY} r={R_INNER - 6} fill="url(#tick-bg)" stroke="#2a2a2a" />
            <text
              x={CX}
              y={CY - 18}
              textAnchor="middle"
              fill="#666"
              fontSize="12"
              fontFamily="ui-monospace, monospace"
              letterSpacing="2"
            >
              루프 내부 틱
            </text>
            <text
              x={CX}
              y={CY + 2}
              textAnchor="middle"
              fill="#D4A853"
              fontSize="26"
              fontFamily="ui-monospace, monospace"
              fontWeight="700"
            >
              8
            </text>
            <text
              x={CX}
              y={CY + 22}
              textAnchor="middle"
              fill="#888"
              fontSize="12"
              fontFamily="ui-monospace, monospace"
            >
              게이트 / 이터
            </text>
            <text
              x={CX}
              y={CY + 42}
              textAnchor="middle"
              fill="#6BA368"
              fontSize="12"
              fontFamily="ui-monospace, monospace"
              opacity="0.8"
            >
              조항 III, VI, VIII
            </text>

            {/* wedges */}
            {GATES.map((g) => {
              const startDeg = g.idx * SLICE + GAP / 2;
              const endDeg = (g.idx + 1) * SLICE - GAP / 2;
              const midDeg = (startDeg + endDeg) / 2;
              const isActive = activeId === g.id;
              const path = wedgePath(CX, CY, R_INNER, R_OUTER, startDeg, endDeg);
              const labelPt = polar(CX, CY, R_LABEL, midDeg);
              const catPt = polar(CX, CY, R_CATEGORY + 20, midDeg);
              const hitlPt = polar(CX, CY, R_OUTER - 14, midDeg);
              const titlePt = polar(CX, CY, (R_OUTER + R_INNER) / 2 + 2, midDeg);
              const subPt = polar(CX, CY, (R_OUTER + R_INNER) / 2 - 18, midDeg);
              return (
                <g
                  key={g.id}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => setHovered(g.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => setPinned(g.id)}
                >
                  {isActive && (
                    <path
                      d={path}
                      fill={g.color}
                      fillOpacity="0.35"
                      filter="url(#tick-glow)"
                    />
                  )}
                  <path
                    d={path}
                    fill={g.color}
                    fillOpacity={isActive ? 0.28 : 0.11}
                    stroke={g.color}
                    strokeOpacity={isActive ? 0.95 : 0.55}
                    strokeWidth={isActive ? 1.8 : 1}
                  />
                  {/* HITL dot near outer edge */}
                  <circle
                    cx={hitlPt.x}
                    cy={hitlPt.y}
                    r={4}
                    fill={HITL_COLOR[g.hitl]}
                    fillOpacity={isActive ? 1 : 0.6}
                  />
                  {/* wedge title */}
                  <text
                    x={titlePt.x}
                    y={titlePt.y}
                    textAnchor="middle"
                    fill={isActive ? "#fff" : "#d4d4d4"}
                    fontSize="12"
                    fontFamily="ui-monospace, monospace"
                    fontWeight="600"
                    style={{ pointerEvents: "none" }}
                  >
                    {g.title}
                  </text>
                  <text
                    x={subPt.x}
                    y={subPt.y}
                    textAnchor="middle"
                    fill={g.color}
                    fillOpacity="0.85"
                    fontSize="12"
                    fontFamily="ui-monospace, monospace"
                    style={{ pointerEvents: "none" }}
                  >
                    {g.short}
                  </text>
                  {/* outer label (category) */}
                  <text
                    x={labelPt.x}
                    y={labelPt.y}
                    textAnchor="middle"
                    fill="#666"
                    fontSize="12"
                    fontFamily="ui-monospace, monospace"
                    letterSpacing="1"
                    style={{ pointerEvents: "none" }}
                  >
                    {CATEGORY_LABEL[g.category]}
                  </text>
                  {/* inner category dot */}
                  <circle
                    cx={catPt.x}
                    cy={catPt.y}
                    r={2.5}
                    fill={g.color}
                    fillOpacity="0.8"
                  />
                </g>
              );
            })}

            {/* direction arrow (clockwise) */}
            <g transform={`translate(${CX}, ${CY})`} opacity="0.45">
              <path
                d="M -40 -60 A 72 72 0 0 1 40 -60"
                fill="none"
                stroke="#D4A853"
                strokeWidth="1.2"
                strokeDasharray="3 3"
              />
              <path d="M 40 -60 L 34 -66 L 34 -54 Z" fill="#D4A853" />
            </g>

            {/* legend (HITL dots) */}
            <g transform={`translate(${W - 210}, 30)`}>
              <text
                x="0"
                y="0"
                fill="#777"
                fontSize="12"
                fontFamily="ui-monospace, monospace"
                letterSpacing="1"
              >
                HITL 점 (조항 III)
              </text>
              <circle cx="6" cy="22" r="4" fill={HITL_COLOR.forbidden} />
              <text x="18" y="26" fill="#aaa" fontSize="12" fontFamily="ui-monospace, monospace">
                금지
              </text>
              <circle cx="6" cy="42" r="4" fill={HITL_COLOR["carve-out"]} />
              <text x="18" y="46" fill="#aaa" fontSize="12" fontFamily="ui-monospace, monospace">
                예외 (L2)
              </text>
              <circle cx="6" cy="62" r="4" fill={HITL_COLOR.allowed} />
              <text x="18" y="66" fill="#aaa" fontSize="12" fontFamily="ui-monospace, monospace">
                허용
              </text>
            </g>

            {/* ring annotation */}
            <g transform={`translate(${W - 210}, 110)`}>
              <text
                x="0"
                y="0"
                fill="#777"
                fontSize="12"
                fontFamily="ui-monospace, monospace"
                letterSpacing="1"
              >
                게이트 카테고리
              </text>
              {(["read", "write", "check", "decide", "log"] as Gate["category"][]).map(
                (cat, i) => (
                  <g key={cat} transform={`translate(0, ${18 + i * 14})`}>
                    <rect x="0" y="-7" width="10" height="10" fill="#333" />
                    <text
                      x="18"
                      y="2"
                      fill="#9a9a9a"
                      fontSize="12"
                      fontFamily="ui-monospace, monospace"
                    >
                      {CATEGORY_LABEL[cat]}
                    </text>
                  </g>
                ),
              )}
            </g>

            {/* arrow out of 8 → back to 1 */}
            <g opacity="0.55">
              <path
                d={`M ${polar(CX, CY, R_OUTER + 8, -SLICE / 2 + 4).x} ${
                  polar(CX, CY, R_OUTER + 8, -SLICE / 2 + 4).y
                } A ${R_OUTER + 8} ${R_OUTER + 8} 0 0 1 ${
                  polar(CX, CY, R_OUTER + 8, SLICE / 2 - 4).x
                } ${polar(CX, CY, R_OUTER + 8, SLICE / 2 - 4).y}`}
                fill="none"
                stroke="#D4A853"
                strokeWidth="1.5"
              />
              <text
                x={CX}
                y={CY - (R_OUTER + 28)}
                textAnchor="middle"
                fill="#D4A853"
                fontSize="12"
                fontFamily="ui-monospace, monospace"
                letterSpacing="1"
              >
                루프 복귀
              </text>
            </g>
          </svg>

          <aside className="min-h-[440px] rounded-lg border border-stone-800 bg-stone-950/70 p-4 text-sm">
            {active ? (
              <>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span
                    className="text-xs font-mono px-1.5 py-0.5 rounded"
                    style={{ color: active.color, borderColor: active.color, border: "1px solid" }}
                  >
                    {CATEGORY_LABEL[active.category]}
                  </span>
                  <span className="text-base font-semibold text-stone-100">{active.title}</span>
                </div>
                <div
                  className="mt-2 text-xs uppercase tracking-wide"
                  style={{ color: HITL_COLOR[active.hitl] }}
                >
                  {HITL_LABEL[active.hitl]}
                </div>
                <p className="mt-3 text-stone-300 leading-relaxed text-[13px]">
                  {active.detail}
                </p>

                <div className="mt-4">
                  <div className="text-[12px] uppercase tracking-wide text-stone-500">
                    피처
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {active.features.map((f) => (
                      <code
                        key={f}
                        className="text-[12px] px-1.5 py-0.5 rounded bg-stone-900 text-stone-400 border border-stone-800"
                      >
                        {f}
                      </code>
                    ))}
                  </div>
                </div>

                <div className="mt-3">
                  <div className="text-[12px] uppercase tracking-wide text-stone-500">
                    조항
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {active.articles.map((a) => (
                      <span
                        key={a}
                        className="text-[12px] px-1.5 py-0.5 rounded bg-[#D4A853]/10 border border-[#D4A853]/30 text-[#D4A853] font-mono"
                      >
                        조항 {a}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 rounded border border-[#C17B5E]/30 bg-[#C17B5E]/[0.06] p-2.5">
                  <div className="text-[12px] uppercase tracking-wide text-[#C17B5E]">
                    실패 모드
                  </div>
                  <div className="mt-1 text-[12px] text-stone-300 leading-snug">
                    {active.failure}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-stone-500 italic text-[13px]">
                웨지 위에 호버하거나 클릭한다. 8개 게이트가 이터레이션마다 시계방향으로
                고정된 순서로 발화한다 — 7개는 HITL 금지, 하나 (수정) 만 L2 단계적
                확인을 예외로 둔다. 바퀴는 <em>순환적</em>이다: 플래토나 목표 달성이
                발화하지 않는 한 성찰은 리뷰로 되돌아간다.
              </div>
            )}
          </aside>
        </div>

        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-[12px]">
          <div className="rounded border border-stone-800 bg-stone-900/40 p-2.5">
            <div className="text-stone-600 uppercase tracking-wide text-[12px]">
              커밋 후 검증
            </div>
            <div className="mt-1 text-stone-300">
              모든 후보가 히스토리에 산다 (조항 VIII); 폐기 = git revert.
            </div>
          </div>
          <div className="rounded border border-stone-800 bg-stone-900/40 p-2.5">
            <div className="text-stone-600 uppercase tracking-wide text-[12px]">
              래칫 = MAX, MEAN 아님
            </div>
            <div className="mt-1 text-stone-300">
              저지 노이즈 (σ≈10) 가 앵커를 뒤로 못 끈다 (조항 VI).
            </div>
          </div>
          <div className="rounded border border-stone-800 bg-stone-900/40 p-2.5">
            <div className="text-stone-600 uppercase tracking-wide text-[12px]">
              8개 중 7개 침묵
            </div>
            <div className="mt-1 text-stone-300">
              수정만 일시 정지 가능; 가시성은 상태 줄에서 (조항 III).
            </div>
          </div>
          <div className="rounded border border-stone-800 bg-stone-900/40 p-2.5">
            <div className="text-stone-600 uppercase tracking-wide text-[12px]">
              인밴드 reflexion
            </div>
            <div className="mt-1 text-stone-300">
              8번 게이트가 다음 틱의 1번 게이트가 읽을 교훈을 작성 (조항 VII).
            </div>
          </div>
        </div>
      </div>
    </figure>
  );
}
