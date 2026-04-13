"use client";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

export default function CadBlueprint({
  src,
  alt,
  label,
  className = "",
}: {
  src: string;
  alt: string;
  label?: string;
  className?: string;
}) {
  const resolvedSrc = src.startsWith("/") ? `${BASE}${src}` : src;
  return (
    <div
      className={`relative rounded-lg border border-cyan-900/30 overflow-hidden ${className}`}
      style={{
        background: "linear-gradient(135deg, #0a1628 0%, #0d1117 100%)",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(100,200,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(100,200,255,0.5) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />
      <img
        src={resolvedSrc}
        alt={alt}
        className="w-full h-auto relative z-10 p-3"
        style={{ filter: "brightness(1.1) drop-shadow(0 0 2px rgba(68,170,255,0.15))" }}
      />
      {label && (
        <div className="absolute bottom-1.5 right-2 text-[9px] text-cyan-700/60 font-mono tracking-wide uppercase z-20">
          {label}
        </div>
      )}
    </div>
  );
}
