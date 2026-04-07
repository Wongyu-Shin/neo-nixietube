"use client";

import { useState } from "react";

type BridgeProps = {
  color: string;
  title: string;
  sourceTag: string;
  cost: string;
  children: React.ReactNode;
  diagram: React.ReactNode;
};

export default function BridgeSection({ color, title, sourceTag, cost, children, diagram }: BridgeProps) {
  const [diagramExpanded, setDiagramExpanded] = useState(true);

  return (
    <section className="my-10 rounded-2xl border overflow-hidden" style={{ borderColor: color + "30" }}>
      {/* Header bar */}
      <div className="px-6 py-4 flex items-center gap-3 flex-wrap" style={{ backgroundColor: color + "0a" }}>
        <h3 className="text-lg font-bold flex-1 min-w-0" style={{ color }}>{title}</h3>
        <span className="text-[10px] px-2 py-1 rounded-full border whitespace-nowrap" style={{ borderColor: color + "30", color: color + "cc" }}>
          {sourceTag}
        </span>
        <span className="text-[10px] px-2 py-1 rounded-full font-mono whitespace-nowrap" style={{ backgroundColor: color + "18", color }}>
          {cost}
        </span>
      </div>

      {/* Large diagram area */}
      <div
        className="px-6 py-4 cursor-pointer transition-all"
        style={{ backgroundColor: color + "05" }}
        onClick={() => setDiagramExpanded(!diagramExpanded)}
      >
        <div className={diagramExpanded ? "" : "max-h-24 overflow-hidden"}>
          {diagram}
        </div>
      </div>

      {/* Rich content */}
      <div className="px-6 py-5 space-y-4 text-sm text-stone-300 leading-relaxed">
        {children}
      </div>
    </section>
  );
}

export function InfoGrid({ items }: { items: { label: string; value: string; color?: string }[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {items.map((item, i) => (
        <div key={i} className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-2.5">
          <div className="text-[10px] text-stone-500">{item.label}</div>
          <div className="text-xs font-medium" style={{ color: item.color || "#e8e8e8" }}>{item.value}</div>
        </div>
      ))}
    </div>
  );
}

export function Caution({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-red-400/20 bg-red-400/[0.04] px-4 py-3 text-xs text-stone-400">
      <span className="text-red-400 font-bold mr-1">주의:</span>{children}
    </div>
  );
}

export function WhyNeeded({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-amber-400/20 bg-amber-400/[0.04] px-4 py-3 text-xs text-stone-300">
      <span className="text-amber-300 font-bold mr-1">왜 필요한가:</span>{children}
    </div>
  );
}

export function Expectation({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div className="space-y-1">
      <div className="text-[10px] text-stone-500 font-medium">예상 기대치</div>
      {items.map((item, i) => (
        <div key={i} className="flex items-baseline gap-2 text-xs">
          <span className="text-stone-500 w-24 shrink-0">{item.label}</span>
          <span className="text-stone-300">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

export function ProcessSteps({ steps }: { steps: { step: string; why: string }[] }) {
  return (
    <div className="space-y-2">
      <div className="text-[10px] text-stone-500 font-medium">공정 단계와 이유</div>
      {steps.map((s, i) => (
        <div key={i} className="flex gap-3 text-xs">
          <span className="w-5 h-5 rounded-full bg-white/[0.06] flex items-center justify-center text-[10px] text-stone-400 shrink-0 mt-0.5">
            {i + 1}
          </span>
          <div>
            <div className="text-stone-200">{s.step}</div>
            <div className="text-stone-500 text-[11px]">{s.why}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function Evidence({ items }: { items: string[] }) {
  return (
    <div className="rounded-lg bg-white/[0.02] border border-white/[0.06] px-4 py-3">
      <div className="text-[10px] text-stone-500 font-medium mb-1">근거 및 출처</div>
      {items.map((item, i) => (
        <div key={i} className="text-[11px] text-stone-400 flex items-start gap-1.5">
          <span className="text-stone-600 mt-0.5">•</span>
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
}
