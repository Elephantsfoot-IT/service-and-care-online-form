import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  GetServicesReturnTyped,
  ServiceByType,
  ServiceType,
  Site,
} from "./interface";

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

// usage (recommended):
export function getServices<T extends ServiceType>(
  sites: Site[],
  type: T
): GetServicesReturnTyped<T> {
  const items = sites.flatMap((site) =>
    (site.buildings ?? []).flatMap((b) =>
      (b.services ?? [])
        .filter((s): s is ServiceByType<T> => s.type === type)
        .map((s) => ({
          site_name: site.site_name,
          site_id: site.simpro_site_id,
          building_id: b.id,
          building_name: b.name || null,
          ...s,
        }))
    )
  ) as GetServicesReturnTyped<T>["items"];

  return { type, items };
}

export function getNumber(n: string) {
  return Number(n.replace(/[^0-9.]/g, ""));
}

export function getServicesValue(subtotal: number, frequency: string | null) {
  if (!frequency) return 0;
  const frequencyValue =
    frequency === "yearly" ? 1 : frequency === "six-monthly" ? 2 : 4;
  return subtotal * frequencyValue;
}

export function getDiscount(serviceCount: number) {
  if (serviceCount < 3) return 0;
  if (serviceCount >= 4 && serviceCount < 6) return 5;
  if (serviceCount >= 6) return 10;
  return 0;
}

export function formatMoney(n: number) {
  return n.toLocaleString("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 2,
  });
}

// utils/fastScroll.ts
export function fastScrollToEl(
  el: HTMLElement,
  {
    offset = 0,
    duration = 180,
    container,
  }: // duration in ms (short = faster)
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
  const ease = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

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
