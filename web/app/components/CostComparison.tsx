/**
 * Visual cost comparison bar chart for the 3 approaches.
 */
export default function CostComparison() {
  const data = [
    { label: "Traditional", cost: 2500000, color: "#ef4444", weeks: "24-48w", equipment: "Torch + Furnace + Vacuum" },
    { label: "Path 1: Frit", cost: 1200000, color: "#D4A853", weeks: "12w", equipment: "Furnace + Vacuum" },
    { label: "Path 2: Room-Temp", cost: 185000, color: "#6BA368", weeks: "4w", equipment: "None" },
  ]
  const maxCost = Math.max(...data.map(d => d.cost))

  return (
    <figure className="my-8">
      <div className="space-y-4">
        {data.map((item, i) => (
          <div key={i} className="space-y-1">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-medium" style={{ color: item.color }}>{item.label}</span>
              <span className="text-sm text-stone-400">
                ₩{(item.cost / 10000).toFixed(0)}만 · {item.weeks}
              </span>
            </div>
            <div className="h-8 rounded-lg bg-white/[0.04] overflow-hidden relative">
              <div
                className="h-full rounded-lg transition-all duration-1000 flex items-center px-3"
                style={{
                  width: `${(item.cost / maxCost) * 100}%`,
                  backgroundColor: `${item.color}20`,
                  borderLeft: `3px solid ${item.color}`,
                }}
              >
                <span className="text-xs text-stone-400 whitespace-nowrap">{item.equipment}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <figcaption className="text-center text-stone-500 text-sm mt-3">
        비용 비교 — 상온 경로는 전통 방식의 7%
      </figcaption>
    </figure>
  )
}
