import ArticleBadge from "./ArticleBadge";

type Art = "I" | "II" | "III" | "IV" | "V" | "VI" | "VII" | "VIII" | "IX";

type Props = {
  slug: string;
  axis1: "inner" | "outer";
  axis2: "pre-loop" | "in-loop" | "post-loop";
  article: Art;
  title: string;
  rippable: string;
  children?: React.ReactNode;
};

const AXIS1_COLOR: Record<Props["axis1"], string> = {
  inner: "#7B9EB8",
  outer: "#D4A853",
};

const AXIS2_COLOR: Record<Props["axis2"], string> = {
  "pre-loop": "#6BA368",
  "in-loop": "#ef8f44",
  "post-loop": "#B8A9C9",
};

export default function FeatureCard({ slug, axis1, axis2, article, title, rippable, children }: Props) {
  const c1 = AXIS1_COLOR[axis1];
  const c2 = AXIS2_COLOR[axis2];
  return (
    <div className="my-5 rounded-xl border border-stone-800 bg-[#0f0d0a] overflow-hidden not-prose">
      <div className="flex items-stretch">
        <div
          className="w-1.5"
          style={{ background: `linear-gradient(180deg, ${c1}, ${c2})` }}
        />
        <div className="flex-1 p-4">
          <div className="flex items-center flex-wrap gap-2 mb-1.5">
            <code className="text-[13px] text-stone-100 font-mono">{slug}</code>
            <span
              className="px-1.5 py-0.5 rounded text-[10px] font-mono"
              style={{ color: c1, backgroundColor: `${c1}18`, border: `1px solid ${c1}40` }}
            >
              {axis1}
            </span>
            <span
              className="px-1.5 py-0.5 rounded text-[10px] font-mono"
              style={{ color: c2, backgroundColor: `${c2}18`, border: `1px solid ${c2}40` }}
            >
              {axis2}
            </span>
            <ArticleBadge n={article} />
          </div>
          <div className="text-[13px] text-stone-300 leading-relaxed mb-2">{title}</div>
          {children ? (
            <div className="text-[12px] text-stone-400 leading-relaxed mb-2">{children}</div>
          ) : null}
          <div className="text-[11px] text-stone-500 border-t border-stone-800 pt-2 mt-2">
            <span className="text-stone-400 font-mono">rippable_check:</span>{" "}
            <span className="italic">{rippable}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
