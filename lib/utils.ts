import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Site } from "./interface";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const scrollToTop = (el?: Element | null) => {
  const target =
    (el as HTMLElement) ??
    document.scrollingElement ??
    document.documentElement;

  // hard jump first (prevents any focus/paint re-scroll), then smooth
  target.scrollTop = 0;
  requestAnimationFrame(() => {
    target.scrollTo({ top: 0, behavior: "smooth" });
  });
};

export function getServices(sites: Site[], type: string) {
  if (!Array.isArray(sites)) return [];

  const items = sites.flatMap((site) =>
    (site.buildings ?? []).flatMap((b) =>
      (b.services ?? [])
        .filter((s) => s.type === type)
        .map((s) => ({
          site_name: site.site_name,
          site_id: site.simpro_site_id, // optional, handy to keep
          building_id: b.id,
          building_name: b.name || null,
          ...s,
        }))
    )
  );
  return {
    type: type,
    items: items,
  };
}


// utils/fastScroll.ts
export function fastScrollToEl(
  el: HTMLElement,
  { offset = 0, duration = 180, container }: // duration in ms (short = faster)
  { offset?: number; duration?: number; container?: HTMLElement | Window } = {}
) {
  const isWin = !container || container === window;
  const start = isWin ? window.scrollY : (container as HTMLElement).scrollTop;
  const target = isWin
    ? window.scrollY + el.getBoundingClientRect().top - offset
    : (el as HTMLElement).offsetTop - offset;

  const dist = target - start;
  let startTime: number | undefined;

  // easeInOutCubic
  const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  const step = (ts: number) => {
    if (startTime === undefined) startTime = ts;
    const elapsed = ts - startTime;
    const p = Math.min(1, elapsed / duration);
    const y = start + dist * ease(p);
    if (isWin) window.scrollTo(0, y);
    else (container as HTMLElement).scrollTo(0, y);
    if (elapsed < duration) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}
