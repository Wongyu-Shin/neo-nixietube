"use client";

import { useState, useEffect } from "react";

type Step = {
  id: string;
  label: string;
  day: string;
  duration: string;
  color: string;
};

export default function StickyProcessNav({ steps, title }: { steps: Step[]; title: string }) {
  const [activeStep, setActiveStep] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first visible step
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveStep(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    steps.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [steps]);

  return (
    <div className="sticky top-[52px] z-40 bg-[#0D0D0D]/95 backdrop-blur-md border-b border-white/[0.06] -mx-4 px-4 py-2">
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        <span className="text-[10px] text-stone-500 whitespace-nowrap mr-2">{title}</span>
        {steps.map((step, i) => {
          const isActive = activeStep === step.id;
          return (
            <a
              key={step.id}
              href={`#${step.id}`}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] whitespace-nowrap transition-all"
              style={{
                backgroundColor: isActive ? step.color + "18" : "transparent",
                borderColor: isActive ? step.color + "40" : "transparent",
                border: `1px solid ${isActive ? step.color + "40" : "transparent"}`,
                color: isActive ? step.color : "#888",
              }}
            >
              <span
                className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0"
                style={{
                  backgroundColor: isActive ? step.color + "30" : "#ffffff08",
                  color: isActive ? step.color : "#666",
                }}
              >
                {i + 1}
              </span>
              <span className="hidden sm:inline">{step.label}</span>
              <span className="sm:hidden">{step.label.split(" ")[0]}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}

export function StepHeader({ id, step, day, duration, color, children }: {
  id: string;
  step: number;
  day: string;
  duration: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div id={id} className="scroll-mt-28 pt-8 pb-4">
      <div className="flex items-center gap-3 mb-4">
        <span
          className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shrink-0"
          style={{ backgroundColor: color + "20", color, border: `2px solid ${color}40` }}
        >
          {step}
        </span>
        <div>
          <h3 className="text-xl font-bold" style={{ color }}>{children}</h3>
          <div className="flex gap-3 text-xs text-stone-500">
            <span>{day}</span>
            <span>•</span>
            <span>{duration}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function GoNoGo({ criteria }: { criteria: { check: string; pass: string; fail: string }[] }) {
  return (
    <div className="rounded-lg border border-amber-400/20 bg-amber-400/[0.04] p-4 my-4">
      <div className="text-xs font-bold text-amber-300 mb-2">Go/No-Go 판정 기준</div>
      <div className="space-y-2">
        {criteria.map((c, i) => (
          <div key={i} className="text-xs">
            <div className="text-stone-300 font-medium">{c.check}</div>
            <div className="flex gap-4 mt-0.5">
              <span className="text-green-400">PASS: {c.pass}</span>
              <span className="text-red-400">FAIL: {c.fail}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ToolList({ tools }: { tools: { name: string; spec: string; source: string }[] }) {
  return (
    <div className="rounded-lg bg-white/[0.02] border border-white/[0.06] p-4 my-4">
      <div className="text-xs font-bold text-stone-400 mb-2">필요 도구</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
        {tools.map((t, i) => (
          <div key={i} className="flex items-baseline gap-2 text-[11px]">
            <span className="text-stone-300">{t.name}</span>
            <span className="text-stone-500 text-[10px]">{t.spec}</span>
            <span className="text-stone-600 text-[10px] ml-auto">{t.source}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Reference({ items }: { items: string[] }) {
  return (
    <div className="rounded-lg bg-white/[0.02] border border-white/[0.06] p-3 my-4">
      <div className="text-[10px] text-stone-500 font-medium mb-1">참고 문헌</div>
      {items.map((item, i) => (
        <div key={i} className="text-[10px] text-stone-500 flex items-start gap-1.5">
          <span className="text-stone-600">[{i + 1}]</span>
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
}

export function FailureRecovery({ failures }: { failures: { mode: string; cause: string; recovery: string }[] }) {
  return (
    <div className="rounded-lg border border-red-400/10 bg-red-400/[0.02] p-4 my-4">
      <div className="text-xs font-bold text-red-400/80 mb-2">실패 모드와 복구</div>
      <div className="space-y-2">
        {failures.map((f, i) => (
          <div key={i} className="text-[11px]">
            <div className="text-stone-300">
              <span className="text-red-400/70 font-medium">실패:</span> {f.mode}
            </div>
            <div className="text-stone-500">원인: {f.cause}</div>
            <div className="text-stone-400">복구: {f.recovery}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SafetyWarning({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-red-500/30 bg-red-500/[0.06] px-4 py-3 my-4 text-xs text-stone-300">
      <span className="text-red-400 font-bold text-sm mr-1">⚠</span>{children}
    </div>
  );
}
