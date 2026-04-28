"use client";

import { useMemo, useState } from "react";

/* --------------------------------------------------------------------
 * KeywordMatcher — gold-tier interactive demo for harness-llm-wiki.
 *
 * Live input box → tokenize → score 6 prebuilt wiki entries by trigger
 * overlap → surface top-3 as <system-reminder>-styled cards.
 *
 * Implements the SessionStart loading mechanic described in
 * harness/research/harness-llm-wiki.md §"Loading mechanic" and
 * Article VII (LLM-Wiki Persistence) of harness/CONSTITUTION.md.
 * ------------------------------------------------------------------ */

type Entry = {
  slug: string;
  triggers: string[];
  created: string;
  last_verified: string;
  half_life_days: number;
  sources: string[];
  oneliner: string;
  color: string;
};

const TODAY = "2026-04-24";

/* Prebuilt wiki corpus used for the live demo. Faithful to the names
 * listed in research/harness-llm-wiki.md §Layout. */
const CORPUS: Entry[] = [
  {
    slug: "cad-path-2-room-temp",
    triggers: ["nixie", "cad", "path-2", "seal", "butyl", "torr-seal", "room-temp"],
    created: "2026-01-14",
    last_verified: "2026-04-10",
    half_life_days: 30,
    sources: ["features/harness-llm-wiki", "cad/path2"],
    oneliner: "경로 2 CAD는 부틸 + Torr-Seal 복합재 사용, 100시간 목표.",
    color: "#6BA368",
  },
  {
    slug: "paschen-curve-fitting",
    triggers: ["paschen", "glow", "simulation", "neon", "breakdown"],
    created: "2026-02-03",
    last_verified: "2026-03-28",
    half_life_days: 30,
    sources: ["sim/paschen", "research/noise-aware-ratchet"],
    oneliner: "15 Torr Ne의 Paschen 곡선, pd≈5 Torr·cm에서 최소 V≈135V.",
    color: "#FF8C42",
  },
  {
    slug: "ratchet-anchor-discipline",
    triggers: ["ratchet", "anchor", "noise", "sum", "judge", "gan"],
    created: "2026-02-18",
    last_verified: "2026-04-22",
    half_life_days: 30,
    sources: ["features/noise-aware-ratchet", "features/llm-as-judge-audit"],
    oneliner: "앵커 약화 절대 금지; 최근 N개에 MAX 사용; 저지 노이즈 ±10.",
    color: "#7B9EB8",
  },
  {
    slug: "hyperagents-vocabulary",
    triggers: [
      "hyperagent",
      "dgm",
      "metacog",
      "meta-hyperagents",
      "fpt-hyperagent",
      "zhang",
      "phan",
    ],
    created: "2026-03-02",
    last_verified: "2026-04-18",
    half_life_days: 60,
    sources: ["features/meta-hyperagents-metacognitive", "features/fpt-hyperagent-multirole"],
    oneliner: "별개의 'HyperAgent' 계보 둘 — Meta (Zhang 2026) vs FPT (Phan 2024).",
    color: "#B8A9C9",
  },
  {
    slug: "autoresearch-loop-vocabulary",
    triggers: ["autoresearch", "verify", "guard", "ratchet", "plateau", "loop"],
    created: "2026-01-28",
    last_verified: "2026-02-20",
    half_life_days: 30,
    sources: ["features/plateau-detection", "features/harness-loop-scaffold"],
    oneliner: "수정→검증→유지/폐기; 가드 = composite-guard.sh.",
    color: "#D4A853",
  },
  {
    slug: "rippable-probe-pattern",
    triggers: ["rippable", "rip", "absorb", "upstream", "tc_script"],
    created: "2026-03-20",
    last_verified: "2026-04-15",
    half_life_days: 45,
    sources: ["features/harness-rip-test", "CONSTITUTION Article II"],
    oneliner: "프로브: 항목 하나를 CC 네이티브로 이전; 표면화되면 폐기.",
    color: "#C17B5E",
  },
];

/* Days between two YYYY-MM-DD strings. */
function daysBetween(a: string, b: string) {
  const A = new Date(a + "T00:00:00Z").getTime();
  const B = new Date(b + "T00:00:00Z").getTime();
  return Math.round((B - A) / 86400000);
}

function tokenize(raw: string) {
  return raw
    .toLowerCase()
    .split(/[^a-z0-9-]+/)
    .filter((t) => t.length > 1);
}

type Scored = {
  entry: Entry;
  score: number;
  hits: string[];
  staleness: number; // 0..1 (>1 = expired)
};

function scoreEntry(entry: Entry, tokens: string[]): Scored {
  const hits = entry.triggers.filter((t) => tokens.includes(t));
  const age = daysBetween(entry.last_verified, TODAY);
  const staleness = age / entry.half_life_days;
  return { entry, score: hits.length, hits, staleness };
}

export default function KeywordMatcher() {
  const [query, setQuery] = useState(
    "working on nixie cad path-2 butyl seal; ratchet looks noisy"
  );
  const [revealAll, setRevealAll] = useState(false);

  const tokens = useMemo(() => tokenize(query), [query]);

  const scored = useMemo(() => {
    const all = CORPUS.map((e) => scoreEntry(e, tokens)).filter((s) => s.score > 0);
    all.sort((a, b) => b.score - a.score || a.entry.slug.localeCompare(b.entry.slug));
    return all;
  }, [tokens]);

  const surfaced = revealAll ? scored : scored.slice(0, 3);
  const suppressed = revealAll ? [] : scored.slice(3);

  return (
    <figure className="my-8 rounded-2xl border border-stone-700/50 bg-stone-950/60 p-4 sm:p-6">
      <div className="mb-3 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 text-xs font-mono text-stone-400">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          SessionStart 훅 — 라이브 키워드 매처
        </div>
        <div className="text-[10px] font-mono uppercase tracking-wider text-stone-500">
          조항 VII · harness-llm-wiki
        </div>
      </div>

      {/* Corpus constellation SVG ---------------------------------- */}
      <CorpusConstellation tokens={tokens} scored={scored} />

      {/* Input row ------------------------------------------------ */}
      <label className="block">
        <span className="sr-only">사용자 메시지 (위키 트리거와 매칭되는 토큰)</span>
        <div className="relative">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows={2}
            className="w-full resize-none rounded-lg bg-stone-900/70 border border-stone-700/60 px-3 py-2 font-mono text-sm text-stone-100 placeholder-stone-500 focus:border-emerald-500/50 focus:outline-none"
            placeholder="트리거 키워드를 포함하는 사용자 메시지를 입력하세요…"
          />
          <div className="absolute right-2 bottom-2 text-[10px] font-mono text-stone-500">
            토큰 {tokens.length}개
          </div>
        </div>
      </label>

      {/* Token pills ---------------------------------------------- */}
      <div className="mt-3 flex flex-wrap gap-1.5 min-h-[22px]">
        {tokens.length === 0 && (
          <span className="text-xs font-mono text-stone-500">추출된 토큰 없음</span>
        )}
        {tokens.map((t, i) => {
          const isHit = CORPUS.some((e) => e.triggers.includes(t));
          return (
            <span
              key={t + i}
              className={`rounded-md px-1.5 py-0.5 text-[10px] font-mono border ${
                isHit
                  ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300"
                  : "border-stone-700/60 bg-stone-900/50 text-stone-500"
              }`}
              title={isHit ? "최소 한 트리거 매치" : "트리거 매치 없음"}
            >
              {t}
            </span>
          );
        })}
      </div>

      {/* Scored results ------------------------------------------- */}
      <div className="mt-5 grid gap-3">
        {surfaced.length === 0 && (
          <div className="rounded-lg border border-stone-800 bg-stone-900/40 p-4 text-sm text-stone-400 font-mono">
            이 메시지에 대해 표면화된 위키 항목이 없습니다.
          </div>
        )}

        {surfaced.map((s, rank) => (
          <EntryCard key={s.entry.slug} scored={s} rank={rank + 1} tokens={tokens} />
        ))}

        {suppressed.length > 0 && (
          <button
            onClick={() => setRevealAll(true)}
            className="mt-1 rounded-md border border-dashed border-stone-700/60 bg-stone-900/30 px-3 py-2 text-[11px] font-mono text-stone-500 hover:text-stone-300 hover:border-stone-600 transition-colors"
          >
            + {suppressed.length}개 억제됨 (상한=3, 로딩 메커니즘 4단계에 따라)
          </button>
        )}
        {revealAll && scored.length > 3 && (
          <button
            onClick={() => setRevealAll(false)}
            className="mt-1 rounded-md border border-dashed border-stone-700/60 bg-stone-900/30 px-3 py-2 text-[11px] font-mono text-stone-500 hover:text-stone-300 hover:border-stone-600 transition-colors"
          >
            상위 3개로 다시 접기
          </button>
        )}
      </div>

      {/* Legend --------------------------------------------------- */}
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono text-stone-400">
        <LegendSwatch color="#6BA368" label="신선 · 나이 ≤ 반감기의 50%" />
        <LegendSwatch color="#D4A853" label="데워짐 · 50–100%" />
        <LegendSwatch color="#C17B5E" label="노후 · 100% 초과, 여전히 표면화" />
        <LegendSwatch color="#7B9EB8" label="메시지의 트리거 히트" />
      </div>

      <figcaption className="mt-4 text-[11px] text-stone-500 leading-relaxed">
        <code className="text-stone-300">scripts/harness/wiki_match.sh</code> 의 데모 (피처{" "}
        <em>harness-llm-wiki</em>). 토큰은 소문자화되어 비영숫자에서 분리되고, 각 항목의{" "}
        <code>triggers</code> 필드에 매칭된다. 히트 수 기준 상위 3개가 SessionStart에서{" "}
        <code>&lt;system-reminder&gt;</code> 블록으로 주입된다. 노후 항목도 표시된 채로
        표면화된다 (조항 VII는 개정 가능한 지식을 허용).
      </figcaption>
    </figure>
  );
}

/* --------------------------------------------------------------------
 * EntryCard — single surfaced entry with inline SVG staleness ring,
 * trigger-hit chip row, and provenance line.
 * ------------------------------------------------------------------ */

function EntryCard({
  scored,
  rank,
  tokens,
}: {
  scored: Scored;
  rank: number;
  tokens: string[];
}) {
  const { entry, score, hits, staleness } = scored;
  const age = daysBetween(entry.last_verified, TODAY);
  const stale = staleness > 1;
  const warming = staleness > 0.5 && staleness <= 1;

  // Ring shows how much of the half-life has been consumed.
  const R = 18;
  const C = 2 * Math.PI * R;
  const consumed = Math.min(staleness, 1.25);
  const dash = Math.min(consumed, 1) * C;

  const ringColor = stale ? "#C17B5E" : warming ? "#D4A853" : "#6BA368";

  return (
    <article
      className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-stone-900/80 to-stone-900/40 p-4"
      style={{ borderColor: entry.color + "55" }}
    >
      {/* Rank badge ------------------------------------------------ */}
      <div
        className="absolute top-0 left-0 px-2 py-0.5 text-[10px] font-mono font-bold text-stone-950 rounded-br-md"
        style={{ background: entry.color }}
      >
        #{rank}
      </div>

      <div className="flex items-start gap-4">
        {/* Staleness ring SVG ------------------------------------- */}
        <svg
          width="56"
          height="56"
          viewBox="0 0 48 48"
          className="flex-shrink-0"
          aria-label={`반감기 고리, ${Math.round(staleness * 100)}% 소모됨`}
        >
          <defs>
            <radialGradient id={`ring-bg-${entry.slug}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={entry.color} stopOpacity="0.35" />
              <stop offset="100%" stopColor={entry.color} stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="24" cy="24" r="22" fill={`url(#ring-bg-${entry.slug})`} />
          <circle
            cx="24"
            cy="24"
            r={R}
            fill="none"
            stroke="#44403c"
            strokeWidth="3"
            opacity="0.5"
          />
          <circle
            cx="24"
            cy="24"
            r={R}
            fill="none"
            stroke={ringColor}
            strokeWidth="3"
            strokeDasharray={`${dash} ${C}`}
            strokeDashoffset={C * 0.25}
            transform="rotate(-90 24 24)"
            strokeLinecap="round"
          />
          <text
            x="24"
            y="27"
            textAnchor="middle"
            fontSize="10"
            fontFamily="ui-monospace, monospace"
            fill="#e7e5e4"
            fontWeight="600"
          >
            {score}
          </text>
          {stale && (
            <g>
              <circle cx="38" cy="10" r="5" fill="#C17B5E" />
              <text
                x="38"
                y="13"
                textAnchor="middle"
                fontSize="8"
                fontWeight="700"
                fill="#1c1917"
              >
                !
              </text>
            </g>
          )}
        </svg>

        {/* Body --------------------------------------------------- */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <code className="text-sm font-mono font-semibold text-stone-100">
              harness/wiki/{entry.slug}.md
            </code>
            {stale && (
              <span className="rounded px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-wider bg-[#C17B5E]/20 text-[#C17B5E] border border-[#C17B5E]/40">
                restale-due
              </span>
            )}
            {warming && (
              <span className="rounded px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-wider bg-[#D4A853]/20 text-[#D4A853] border border-[#D4A853]/40">
                데워짐
              </span>
            )}
            {!stale && !warming && (
              <span className="rounded px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-wider bg-[#6BA368]/20 text-[#6BA368] border border-[#6BA368]/40">
                신선
              </span>
            )}
          </div>

          <p className="mt-1 text-sm text-stone-300 leading-snug">{entry.oneliner}</p>

          {/* Trigger chips (hits vs non-hits) --------------------- */}
          <div className="mt-2 flex flex-wrap gap-1">
            {entry.triggers.map((t) => {
              const isHit = tokens.includes(t);
              return (
                <span
                  key={t}
                  className={`rounded px-1.5 py-0.5 text-[10px] font-mono border ${
                    isHit
                      ? "border-emerald-400/60 bg-emerald-400/15 text-emerald-200"
                      : "border-stone-700/40 bg-stone-800/30 text-stone-500"
                  }`}
                >
                  {isHit ? "●" : "○"} {t}
                </span>
              );
            })}
          </div>

          {/* Meta line -------------------------------------------- */}
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-mono text-stone-500">
            <span>
              생성 <span className="text-stone-400">{entry.created}</span>
            </span>
            <span>
              최근 검증 <span className="text-stone-400">{entry.last_verified}</span>
            </span>
            <span>
              나이 <span className="text-stone-400">{age}d</span> / 반감기{" "}
              <span className="text-stone-400">{entry.half_life_days}d</span>
            </span>
            <span>
              출처{" "}
              <span className="text-stone-400">
                [{entry.sources.map((s) => s.split("/").pop()).join(", ")}]
              </span>
            </span>
          </div>

          {/* Hits summary ----------------------------------------- */}
          <div className="mt-2 text-[10px] font-mono text-stone-500">
            매치{score === 1 ? "" : ""}:{" "}
            {hits.map((h, i) => (
              <span key={h}>
                <span className="text-emerald-300">{h}</span>
                {i < hits.length - 1 ? ", " : ""}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

/* --------------------------------------------------------------------
 * CorpusConstellation — radial map of the 6 wiki entries, with rays
 * drawn from the center (query) to any entry whose triggers match an
 * input token. Purely presentational; reinforces the "top-3 surfaced"
 * mental model visually.
 * ------------------------------------------------------------------ */

function CorpusConstellation({
  tokens,
  scored,
}: {
  tokens: string[];
  scored: Scored[];
}) {
  const W = 560;
  const H = 190;
  const cx = W / 2;
  const cy = H / 2 + 6;
  const ringR = 72;

  const matched = new Set(scored.map((s) => s.entry.slug));
  const scoreBySlug = Object.fromEntries(scored.map((s) => [s.entry.slug, s.score]));

  return (
    <div className="mb-4 overflow-hidden rounded-xl border border-stone-800 bg-[#0c0a09]">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="위키 코퍼스 별자리"
      >
        <defs>
          <radialGradient id="km-center" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.55" />
            <stop offset="60%" stopColor="#10b981" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="km-bg" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#1c1917" />
            <stop offset="100%" stopColor="#0c0a09" />
          </radialGradient>
          <linearGradient id="km-ray" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0.1" />
          </linearGradient>
          <filter id="km-node-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect x="0" y="0" width={W} height={H} fill="url(#km-bg)" />

        {/* Soft radial backdrop */}
        <circle cx={cx} cy={cy} r={ringR + 40} fill="url(#km-center)" />

        {/* Orbit guide ring */}
        <circle
          cx={cx}
          cy={cy}
          r={ringR}
          fill="none"
          stroke="#44403c"
          strokeWidth="0.6"
          strokeDasharray="2 4"
          opacity="0.55"
        />
        <circle
          cx={cx}
          cy={cy}
          r={ringR + 22}
          fill="none"
          stroke="#292524"
          strokeWidth="0.4"
          strokeDasharray="1 3"
          opacity="0.5"
        />

        {/* Rays (query → matched nodes) */}
        {CORPUS.map((e, i) => {
          const angle = (i / CORPUS.length) * Math.PI * 2 - Math.PI / 2;
          const nx = cx + Math.cos(angle) * ringR;
          const ny = cy + Math.sin(angle) * ringR;
          const hit = matched.has(e.slug);
          const score = scoreBySlug[e.slug] || 0;
          if (!hit) return null;
          return (
            <g key={"ray-" + e.slug}>
              <line
                x1={cx}
                y1={cy}
                x2={nx}
                y2={ny}
                stroke={e.color}
                strokeWidth={1 + Math.min(score, 4) * 0.5}
                strokeLinecap="round"
                opacity="0.85"
              />
              <line
                x1={cx}
                y1={cy}
                x2={nx}
                y2={ny}
                stroke="url(#km-ray)"
                strokeWidth="0.6"
                opacity="0.6"
              />
            </g>
          );
        })}

        {/* Nodes */}
        {CORPUS.map((e, i) => {
          const angle = (i / CORPUS.length) * Math.PI * 2 - Math.PI / 2;
          const nx = cx + Math.cos(angle) * ringR;
          const ny = cy + Math.sin(angle) * ringR;
          const hit = matched.has(e.slug);
          const score = scoreBySlug[e.slug] || 0;
          const labelSide = nx < cx ? "end" : "start";
          const lx = nx + (nx < cx ? -8 : 8);
          return (
            <g key={"node-" + e.slug}>
              {hit && (
                <circle
                  cx={nx}
                  cy={ny}
                  r={9 + score * 1.2}
                  fill={e.color}
                  opacity="0.22"
                  filter="url(#km-node-glow)"
                />
              )}
              <circle
                cx={nx}
                cy={ny}
                r={5}
                fill={hit ? e.color : "#3f3f46"}
                stroke={hit ? "#fafaf9" : "#57534e"}
                strokeWidth={hit ? 1.2 : 0.6}
              />
              {hit && (
                <circle
                  cx={nx}
                  cy={ny}
                  r={2}
                  fill="#fafaf9"
                />
              )}
              <text
                x={lx}
                y={ny + 3}
                textAnchor={labelSide}
                fontSize="8.5"
                fontFamily="ui-monospace, monospace"
                fill={hit ? "#e7e5e4" : "#78716c"}
              >
                {e.slug}
              </text>
              {hit && score > 0 && (
                <text
                  x={lx}
                  y={ny + 13}
                  textAnchor={labelSide}
                  fontSize="7"
                  fontFamily="ui-monospace, monospace"
                  fill={e.color}
                >
                  +{score}
                </text>
              )}
            </g>
          );
        })}

        {/* Center "query" node */}
        <g>
          <circle cx={cx} cy={cy} r={13} fill="#052e2b" stroke="#10b981" strokeWidth="1.2" />
          <circle cx={cx} cy={cy} r={7} fill="#10b981" opacity="0.4" />
          <circle cx={cx} cy={cy} r={3} fill="#d1fae5" />
          <text
            x={cx}
            y={cy + 26}
            textAnchor="middle"
            fontSize="8"
            fontFamily="ui-monospace, monospace"
            fill="#10b981"
          >
            쿼리 · 토큰 {tokens.length}
          </text>
        </g>

        {/* Corner labels */}
        <text
          x="10"
          y="14"
          fontSize="8"
          fontFamily="ui-monospace, monospace"
          fill="#78716c"
        >
          harness/wiki/ · 코퍼스 n={CORPUS.length}
        </text>
        <text
          x={W - 10}
          y="14"
          textAnchor="end"
          fontSize="8"
          fontFamily="ui-monospace, monospace"
          fill="#78716c"
        >
          표면화 {Math.min(scored.length, 3)} / {scored.length}
        </text>
      </svg>
    </div>
  );
}

function LegendSwatch({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className="inline-block h-2 w-2 rounded-full flex-shrink-0"
        style={{ background: color }}
      />
      <span>{label}</span>
    </div>
  );
}
