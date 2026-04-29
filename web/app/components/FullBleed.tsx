import type { ReactNode } from "react";

/**
 * FullBleed — break a child out of the page's max-w-4xl prose container
 * and re-constrain to a wider, viewport-bounded box. Keeps prose narrow
 * while letting interactive SVG visuals use the available viewport.
 *
 * Trick: `margin-left: 50%` jumps to parent center, then `translateX(-50%)`
 * pulls back to center the wider box on the viewport. Width is bounded by
 * both a max (72rem ≈ 1152px) and the viewport itself (`100vw - 2rem`).
 */
export default function FullBleed({
  children,
  max = "min(72rem, 100vw - 2rem)",
}: {
  children: ReactNode;
  max?: string;
}) {
  return (
    <div
      className="my-6"
      style={{
        width: max,
        marginLeft: "50%",
        transform: "translateX(-50%)",
      }}
    >
      {children}
    </div>
  );
}
