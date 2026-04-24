"use client";

/**
 * Matrix of automatic vs. manual stop conditions.
 * Source: `harness/UX.md` §5.
 */

type Row = {
  kind: "auto" | "manual";
  name: string;
  trigger: string;
  feature: string;
  article: string;
  lossy: boolean;
};

const ROWS: Row[] = [
  {
    kind: "auto",
    name: "Bounded N",
    trigger: "iter == Iterations N, even if still improving",
    feature: "harness-progress-cadence",
    article: "VIII",
    lossy: false,
  },
  {
    kind: "auto",
    name: "Goal-achieved",
    trigger: "metric hits target (autoresearch:fix mode)",
    feature: "noise-aware-ratchet",
    article: "VI",
    lossy: false,
  },
  {
    kind: "auto",
    name: "Plateau",
    trigger: "ratchet-patience AND trend-slope both flat under σ",
    feature: "plateau-detection",
    article: "VI",
    lossy: false,
  },
  {
    kind: "manual",
    name: "Abandon",
    trigger: "/harness:abandon <run_id> — runs post-loop report",
    feature: "cc-post-loop-slash",
    article: "III",
    lossy: false,
  },
  {
    kind: "manual",
    name: "Pause",
    trigger: "/harness:pause — finish atomic step, write checkpoint, stop",
    feature: "harness-pause-resume",
    article: "III",
    lossy: false,
  },
  {
    kind: "manual",
    name: "Emergency (Ctrl+C)",
    trigger: "runner attempts crash-checkpoint before dying",
    feature: "harness-pause-resume",
    article: "III",
    lossy: true,
  },
];

export default function StopConditionMatrix() {
  return (
    <figure className="my-8">
      <div className="rounded-xl border border-white/10 bg-stone-950 overflow-hidden">
        <div className="grid grid-cols-[88px_minmax(130px,1fr)_2fr_minmax(140px,1fr)_80px_60px] text-[10px] uppercase tracking-widest text-stone-500 bg-stone-900 border-b border-white/10">
          <div className="px-3 py-2">kind</div>
          <div className="px-3 py-2">name</div>
          <div className="px-3 py-2">trigger</div>
          <div className="px-3 py-2">feature</div>
          <div className="px-3 py-2">article</div>
          <div className="px-3 py-2">lossy?</div>
        </div>
        {ROWS.map((r) => {
          const kindColor = r.kind === "auto" ? "#6BA368" : "#D4A853";
          return (
            <div
              key={r.name}
              className="grid grid-cols-[88px_minmax(130px,1fr)_2fr_minmax(140px,1fr)_80px_60px] text-sm border-b border-white/5 last:border-b-0"
            >
              <div className="px-3 py-2 flex items-center">
                <span
                  className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded"
                  style={{
                    background: kindColor + "22",
                    color: kindColor,
                    border: `1px solid ${kindColor}55`,
                  }}
                >
                  {r.kind}
                </span>
              </div>
              <div className="px-3 py-2 text-amber-200 text-xs font-semibold">
                {r.name}
              </div>
              <div className="px-3 py-2 text-xs text-stone-400">{r.trigger}</div>
              <div className="px-3 py-2 text-xs">
                <code className="text-stone-400">{r.feature}</code>
              </div>
              <div className="px-3 py-2 text-xs text-stone-300">{r.article}</div>
              <div className="px-3 py-2 text-xs">
                {r.lossy ? (
                  <span className="text-[#C1563E]">yes</span>
                ) : (
                  <span className="text-stone-500">no</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <figcaption className="text-xs text-stone-500 text-center mt-3">
        Stop conditions · <code className="text-amber-200">harness/UX.md §5</code>.
      </figcaption>
    </figure>
  );
}
