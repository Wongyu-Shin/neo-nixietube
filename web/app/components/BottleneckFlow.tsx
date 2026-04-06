/**
 * Visual flow diagram showing 4 bottlenecks and their modern solutions.
 */
export default function BottleneckFlow() {
  const items = [
    {
      bottleneck: "유리-금속 실링",
      traditional: "토치 800°C",
      solutions: [
        { label: "프릿 실링", temp: "450°C", color: "#D4A853", source: "PDP" },
        { label: "부틸 봉착", temp: "상온", color: "#6BA368", source: "IGU" },
      ],
    },
    {
      bottleneck: "전극 제조",
      traditional: "수작업 커팅",
      solutions: [
        { label: "AAO 나노구조", temp: "DIY", color: "#D4A853", source: "Nano" },
        { label: "졸-겔 코팅", temp: "200°C", color: "#6BA368", source: "Chem" },
      ],
    },
    {
      bottleneck: "진공/가스",
      traditional: "10⁻⁵ Torr 펌프",
      solutions: [
        { label: "마이크로 격벽", temp: "고압", color: "#D4A853", source: "MEMS" },
        { label: "MAP 플러싱", temp: "상온", color: "#6BA368", source: "Food" },
      ],
    },
    {
      bottleneck: "핀 관통",
      traditional: "유리-금속 수작업",
      solutions: [
        { label: "TO-8 헤더", temp: "구매", color: "#D4A853", source: "Semi" },
        { label: "MIL-spec", temp: "구매", color: "#6BA368", source: "Space" },
      ],
    },
  ]

  return (
    <figure className="my-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((item, i) => (
          <div key={i} className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
            <div className="text-xs text-stone-500 mb-1">Bottleneck #{i + 1}</div>
            <div className="font-semibold text-stone-200 mb-2">{item.bottleneck}</div>
            <div className="text-xs text-stone-500 mb-3 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-red-400/60" />
              <span className="line-through">{item.traditional}</span>
            </div>
            <div className="space-y-2">
              {item.solutions.map((sol, j) => (
                <div key={j} className="flex items-center gap-2">
                  <span className="text-lg">→</span>
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border"
                    style={{
                      backgroundColor: `${sol.color}0a`,
                      borderColor: `${sol.color}25`,
                      color: sol.color,
                    }}
                  >
                    {sol.label}
                    <span className="opacity-60">({sol.temp})</span>
                  </span>
                  <span className="text-[10px] text-stone-600">{sol.source}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <figcaption className="text-center text-stone-500 text-sm mt-3">
        4대 병목과 각각 2개의 현대 해법 — 경로 1 (gold) / 경로 2 (green)
      </figcaption>
    </figure>
  )
}
