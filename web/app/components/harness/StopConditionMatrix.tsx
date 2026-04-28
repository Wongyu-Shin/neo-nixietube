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
    name: "유한 N",
    trigger: "iter == Iterations N, 여전히 개선 중이어도 정지",
    feature: "harness-progress-cadence",
    article: "VIII",
    lossy: false,
  },
  {
    kind: "auto",
    name: "목표 달성",
    trigger: "메트릭이 타깃 도달 (autoresearch:fix 모드)",
    feature: "noise-aware-ratchet",
    article: "VI",
    lossy: false,
  },
  {
    kind: "auto",
    name: "플래토",
    trigger: "ratchet-patience와 trend-slope가 둘 다 σ 아래 평탄",
    feature: "plateau-detection",
    article: "VI",
    lossy: false,
  },
  {
    kind: "manual",
    name: "포기",
    trigger: "/harness:abandon <run_id> — 루프 종료 후 리포트 실행",
    feature: "cc-post-loop-slash",
    article: "III",
    lossy: false,
  },
  {
    kind: "manual",
    name: "일시 정지",
    trigger: "/harness:pause — 원자 단계 마치고 체크포인트 기록 후 정지",
    feature: "harness-pause-resume",
    article: "III",
    lossy: false,
  },
  {
    kind: "manual",
    name: "비상 (Ctrl+C)",
    trigger: "러너가 죽기 전에 크래시 체크포인트 시도",
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
          <div className="px-3 py-2">종류</div>
          <div className="px-3 py-2">이름</div>
          <div className="px-3 py-2">트리거</div>
          <div className="px-3 py-2">피처</div>
          <div className="px-3 py-2">조항</div>
          <div className="px-3 py-2">손실?</div>
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
                  <span className="text-[#C1563E]">예</span>
                ) : (
                  <span className="text-stone-500">아니오</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <figcaption className="text-xs text-stone-500 text-center mt-3">
        정지 조건 · <code className="text-amber-200">harness/UX.md §5</code>.
      </figcaption>
    </figure>
  );
}
