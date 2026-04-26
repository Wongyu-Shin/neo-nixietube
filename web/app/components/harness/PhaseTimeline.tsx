/*
 * PhaseTimeline — the UX flow distilled to a single horizontal bar.
 * Entry (pre-loop) → Iteration Phases 1-7 (in-loop) → Handback (post-loop).
 * Matches harness/UX.md Flow at a glance.
 */

type Stop = {
  id: string;
  label: string;
  caption: string;
  kind: "pre" | "in" | "post";
  cmd?: string;
};

const STOPS: Stop[] = [
  { id: "new", label: "new-loop", caption: "scaffold NNN-<slug>/", kind: "pre", cmd: "/harness:new-loop" },
  { id: "clarify", label: "clarify", caption: "7-dim [ASSUMPTION] pass", kind: "pre", cmd: "/harness:clarify" },
  { id: "plan", label: "plan", caption: "wizard + baseline", kind: "pre", cmd: "/autoresearch:plan" },
  { id: "exit", label: "ExitPlanMode", caption: "operator approval", kind: "pre" },
  { id: "review", label: "Ph1 review", caption: "CONSTITUTION + wiki + reflexion", kind: "in" },
  { id: "ideate", label: "Ph2-5 modify", caption: "commit before verify", kind: "in" },
  { id: "decide", label: "Ph6 decide", caption: "composite-guard gates", kind: "in" },
  { id: "log", label: "Ph7 log", caption: "per-iter + milestone block", kind: "in" },
  { id: "report", label: "report", caption: "report.mdx handback", kind: "post", cmd: "/harness:report" },
  { id: "wiki", label: "wiki-add", caption: "durable entries approved", kind: "post", cmd: "/harness:wiki-add" },
];

const KIND_COLOR: Record<Stop["kind"], string> = {
  pre: "#6BA368",
  in: "#ef8f44",
  post: "#B8A9C9",
};

const KIND_LABEL: Record<Stop["kind"], string> = {
  pre: "PRE-LOOP",
  in: "IN-LOOP",
  post: "POST-LOOP",
};

export default function PhaseTimeline() {
  const W = 1000;
  const H = 180;
  const margin = 40;
  const stepX = (W - margin * 2) / (STOPS.length - 1);

  return (
    <figure className="my-6 not-prose">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-lg border border-stone-800 bg-[#0f0d0a]">
        <defs>
          <linearGradient id="pt-track" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#6BA368" stopOpacity="0.55" />
            <stop offset="45%" stopColor="#ef8f44" stopOpacity="0.55" />
            <stop offset="90%" stopColor="#B8A9C9" stopOpacity="0.55" />
          </linearGradient>
        </defs>

        {/* Phase bands */}
        {(["pre", "in", "post"] as const).map((kind, i) => {
          const group = STOPS.filter((s) => s.kind === kind);
          const firstIdx = STOPS.findIndex((s) => s.id === group[0].id);
          const lastIdx = STOPS.findIndex((s) => s.id === group[group.length - 1].id);
          const x0 = margin + firstIdx * stepX - 18;
          const x1 = margin + lastIdx * stepX + 18;
          return (
            <g key={kind}>
              <rect
                x={x0}
                y={28}
                width={x1 - x0}
                height={28}
                rx="14"
                fill={KIND_COLOR[kind]}
                opacity="0.1"
                stroke={KIND_COLOR[kind]}
                strokeOpacity="0.3"
              />
              <text
                x={(x0 + x1) / 2}
                y={22}
                textAnchor="middle"
                fontSize="10"
                fontFamily="ui-monospace,monospace"
                fill={KIND_COLOR[kind]}
                opacity="0.85"
              >
                {KIND_LABEL[kind]}
              </text>
              {i < 2 && (
                <polygon
                  points={`${x1 + 2},36 ${x1 + 12},42 ${x1 + 2},48`}
                  fill={KIND_COLOR[kind]}
                  opacity="0.55"
                />
              )}
            </g>
          );
        })}

        {/* Main track line */}
        <line
          x1={margin}
          y1={42}
          x2={W - margin}
          y2={42}
          stroke="url(#pt-track)"
          strokeWidth="2"
        />

        {/* Stops */}
        {STOPS.map((s, i) => {
          const cx = margin + i * stepX;
          return (
            <g key={s.id}>
              <circle cx={cx} cy={42} r={7} fill={KIND_COLOR[s.kind]} stroke="#0f0d0a" strokeWidth="2" />
              <circle cx={cx} cy={42} r={2.5} fill="#0f0d0a" />
              <text
                x={cx}
                y={74}
                textAnchor="middle"
                fontSize="11"
                fontFamily="ui-monospace,monospace"
                fill="#e8dfc8"
              >
                {s.label}
              </text>
              <text
                x={cx}
                y={90}
                textAnchor="middle"
                fontSize="9"
                fontFamily="ui-monospace,monospace"
                fill="#8a7a58"
              >
                {s.caption}
              </text>
              {s.cmd && (
                <text
                  x={cx}
                  y={108}
                  textAnchor="middle"
                  fontSize="9"
                  fontFamily="ui-monospace,monospace"
                  fill={KIND_COLOR[s.kind]}
                  opacity="0.8"
                >
                  {s.cmd}
                </text>
              )}
            </g>
          );
        })}

        {/* HITL marker */}
        <g>
          <line
            x1={margin + 3 * stepX}
            y1={120}
            x2={margin + 7 * stepX}
            y2={120}
            stroke="#ef8f44"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            opacity="0.75"
          />
          <text
            x={margin + 5 * stepX}
            y={136}
            textAnchor="middle"
            fontSize="10"
            fontFamily="ui-monospace,monospace"
            fill="#ef8f44"
            opacity="0.85"
          >
            Article III — no HITL here except graduated-confirm L2 + Ctrl+C
          </text>
          <text
            x={margin + 5 * stepX}
            y={152}
            textAnchor="middle"
            fontSize="9"
            fontFamily="ui-monospace,monospace"
            fill="#6a5f48"
          >
            /harness:pause and /harness:send bracket the loop without breaking Article III
          </text>
        </g>
      </svg>
      <figcaption className="mt-2 text-xs text-stone-500 text-center">
        Entry→completion flow — consolidates harness/UX.md section “Flow at a glance”.
      </figcaption>
    </figure>
  );
}
