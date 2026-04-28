"use client";

/* FeatureCrossRef — integration map around harness-llm-wiki.
 * Non-interactive SVG showing the cross-reference graph described
 * in harness/features/harness-llm-wiki.md §"Integrates with". */

type Node = {
  id: string;
  label: string;
  role: string;
  angle: number; // degrees
  color: string;
};

const CENTER = { id: "harness-llm-wiki", label: "harness-llm-wiki", role: "Article VII" };

const LINKS: Node[] = [
  {
    id: "cc-post-loop-slash",
    label: "cc-post-loop-slash",
    role: "write-mechanic host",
    angle: -90,
    color: "#6BA368",
  },
  {
    id: "gcli-agent-run-telemetry",
    label: "gcli-agent-run-telemetry",
    role: "citation audit",
    angle: -25,
    color: "#7B9EB8",
  },
  {
    id: "harness-constitution",
    label: "harness-constitution",
    role: "Article VII mandate",
    angle: 40,
    color: "#D4A853",
  },
  {
    id: "voyager-skill-library",
    label: "voyager-skill-library",
    role: "non-overlap (skills ≠ facts)",
    angle: 110,
    color: "#B8A9C9",
  },
  {
    id: "harness-rip-test",
    label: "harness-rip-test",
    role: "rippable probe runner",
    angle: 180,
    color: "#C17B5E",
  },
  {
    id: "harness-progress-cadence",
    label: "harness-progress-cadence",
    role: "surfaces wiki-hits inline",
    angle: -155,
    color: "#FF8C42",
  },
];

const W = 640;
const H = 360;
const cx = W / 2;
const cy = H / 2;
const R = 130;

function polar(angleDeg: number, r: number) {
  const a = (angleDeg * Math.PI) / 180;
  return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r };
}

export default function FeatureCrossRef() {
  return (
    <figure className="my-8 rounded-2xl border border-stone-800 bg-stone-950/60 p-4 sm:p-5">
      <div className="mb-2 flex items-baseline justify-between gap-3 flex-wrap">
        <div className="text-xs font-mono uppercase tracking-wider text-stone-400">
          cross-reference graph
        </div>
        <div className="text-[10px] font-mono text-stone-500">
          features/harness-llm-wiki.md §Integrates-with
        </div>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        role="img"
        aria-label="harness-llm-wiki integration graph"
      >
        <defs>
          <radialGradient id="fcr-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
            <stop offset="70%" stopColor="#10b981" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="fcr-edge" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {/* Halo behind center */}
        <circle cx={cx} cy={cy} r={R + 40} fill="url(#fcr-halo)" />

        {/* Orbit rings */}
        <circle
          cx={cx}
          cy={cy}
          r={R}
          fill="none"
          stroke="#44403c"
          strokeDasharray="2 4"
          strokeWidth="0.6"
          opacity="0.6"
        />

        {/* Edges */}
        {LINKS.map((n) => {
          const p = polar(n.angle, R);
          return (
            <line
              key={"edge-" + n.id}
              x1={cx}
              y1={cy}
              x2={p.x}
              y2={p.y}
              stroke={n.color}
              strokeWidth="1.2"
              opacity="0.75"
            />
          );
        })}

        {/* Peripheral nodes */}
        {LINKS.map((n) => {
          const p = polar(n.angle, R);
          const labelSide = p.x < cx ? "end" : "start";
          const lx = p.x + (p.x < cx ? -12 : 12);
          return (
            <g key={"node-" + n.id}>
              <circle
                cx={p.x}
                cy={p.y}
                r="14"
                fill={n.color}
                opacity="0.18"
              />
              <circle
                cx={p.x}
                cy={p.y}
                r="7"
                fill="#1c1917"
                stroke={n.color}
                strokeWidth="1.6"
              />
              <circle cx={p.x} cy={p.y} r="2.5" fill={n.color} />
              <text
                x={lx}
                y={p.y - 2}
                textAnchor={labelSide}
                fontSize="11"
                fontFamily="ui-monospace, monospace"
                fill="#e7e5e4"
                fontWeight="600"
              >
                {n.label}
              </text>
              <text
                x={lx}
                y={p.y + 11}
                textAnchor={labelSide}
                fontSize="9"
                fontFamily="ui-monospace, monospace"
                fill={n.color}
              >
                {n.role}
              </text>
            </g>
          );
        })}

        {/* Center node */}
        <g>
          <circle cx={cx} cy={cy} r="28" fill="#052e2b" stroke="#10b981" strokeWidth="1.5" />
          <circle cx={cx} cy={cy} r="18" fill="#10b981" opacity="0.32" />
          <circle cx={cx} cy={cy} r="8" fill="#d1fae5" />
          <text
            x={cx}
            y={cy + 44}
            textAnchor="middle"
            fontSize="11"
            fontFamily="ui-monospace, monospace"
            fontWeight="700"
            fill="#d1fae5"
          >
            {CENTER.label}
          </text>
          <text
            x={cx}
            y={cy + 57}
            textAnchor="middle"
            fontSize="9"
            fontFamily="ui-monospace, monospace"
            fill="#10b981"
          >
            {CENTER.role}
          </text>
        </g>
      </svg>

      <figcaption className="mt-2 text-[11px] text-stone-500 leading-relaxed">
        Edges are named integrations declared in the feature frontmatter and
        in the <code>Contrast</code> section of the research note.{" "}
        <em>voyager-skill-library</em> is deliberately a non-overlap link —
        skills ≠ facts.
      </figcaption>
    </figure>
  );
}
