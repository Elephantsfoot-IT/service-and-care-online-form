"use client";
import React from "react";

type Props = {
  /** Final rendered height in pixels (width keeps original aspect ratio 130:180). */
  height?: number;
  /** Optional explicit width (if you want to override aspect ratio logic). */
  width?: number;
  /** Fill color. If omitted, inherits from `currentColor` (e.g., via className). */
  color?: string;
  /** Animation duration in ms. */
  durationMs?: number;
  /** Optional start delay in ms. */
  delayMs?: number;
  /** Loop animation forever. */
  loop?: boolean;
  /** Extra className for positioning (e.g., `absolute bottom-0 right-0`). */
  className?: string;
  /**
   * Fill (reveal) angle in degrees.
   * 0 = bottom→top, 90 = left→right, 180 = top→bottom, 270 = right→left
   */
  fillAngleDeg?: number;
};

const VB_W = 130;
const VB_H = 180;

/** Your exact shape path */
const SHAPE_D =
  "M129.5 0.5C50.5 20 0.112198 89.7734 0.999757 180L43.5 180C42 110 79 66.5 129 48.5L129.5 0.5Z";

export default function BrandCornerShape({
  height = 180,
  width,
  color,
  durationMs = 1200,
  delayMs = 0,
  loop = false,
  className,
  fillAngleDeg = 0,
}: Props) {
  const computedWidth = width ?? Math.round((height * VB_W) / VB_H);

  // Unique IDs so multiple instances don't clash
  const maskId = React.useId();
  const clipId = React.useId();

  // Oversize the wiping rect so it fully covers at any rotation
  const diag = Math.ceil(Math.hypot(VB_W, VB_H));
  const cx = VB_W / 2;
  const cy = VB_H / 2;

  return (
    <div
      aria-hidden
      className={["pointer-events-none", className ?? ""].join(" ")}
      style={{ lineHeight: 0 }}
    >
      <svg
        width={computedWidth}
        height={height}
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Brand corner shape"
      >
        <defs>
          {/* Reveal mask with angle control via rotation */}
          <mask id={maskId} maskUnits="userSpaceOnUse">
            {/* Start fully hidden */}
            <rect width={VB_W} height={VB_H} fill="black" />
            {/* Rotate the wiping rect around the SVG center, then scaleY from bottom */}
            <g transform={`rotate(${fillAngleDeg} ${cx} ${cy})`}>
              <rect
                className="wipe-rect"
                width={diag}
                height={diag}
                x={cx - diag / 2}
                y={cy - diag / 2}
                fill="white"
                style={{
                  transform: "scaleY(0)",
                  transformOrigin: "bottom center",
                  transformBox: "fill-box",
                  animation: `brand-wipe ${durationMs}ms linear ${delayMs}ms ${
                    loop ? "infinite" : "forwards"
                  }`,
                }}
              />
            </g>
          </mask>

          {/* (Optional) clipPath to keep everything inside canvas */}
          <clipPath id={clipId}>
            <rect width={VB_W} height={VB_H} />
          </clipPath>
        </defs>

        <g clipPath={`url(#${clipId})`}>
          {/* Fill with your color (or inherit `currentColor`) and apply mask */}
          <path d={SHAPE_D} fill={color ?? "currentColor"} mask={`url(#${maskId})`} />
        </g>

        <style jsx>{`
          @keyframes brand-wipe {
            from {
              transform: scaleY(0);
            }
            to {
              transform: scaleY(1);
            }
          }
          .wipe-rect {
            transform-box: fill-box;
            transform-origin: bottom center;
          }
          @media (prefers-reduced-motion: reduce) {
            .wipe-rect {
              animation: none !important;
              transform: scaleY(1) !important;
            }
          }
        `}</style>
      </svg>
    </div>
  );
}
