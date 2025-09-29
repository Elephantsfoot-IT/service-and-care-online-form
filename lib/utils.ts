import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  GetServicesReturnTyped,
  ServiceByType,
  ServiceType,
  Site,
} from "./interface";
import { formatInTimeZone } from "date-fns-tz";

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
  const frequencyValue =getFrequencyValue(frequency)
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

export const getServiceAnualCost = (services: ServiceByType<ServiceType>[], frequency: string | null) => {
  if (!frequency) return 0;
  const frequencyValue =
    frequency === "yearly" ? 1 : frequency === "six-monthly" ? 2 : 4;
  return services.reduce((acc, service) => acc + getNumber(service.price) * frequencyValue, 0);
};

export const getFrequencyValue = (frequency: string | null) => {
  if (!frequency) return 0;
  return frequency === "yearly" ? 1 : frequency === "six-monthly" ? 2 : 4;
};

export function formatFullAddress(
  street?: string,
  city?: string,
  state?: string,
  postcode?: string,
  country?: string
) {
  if (!street || !city || !state || !postcode || !country) return null;
  return `${street}, ${city} ${state} ${postcode}, ${country}`;
}

export const normalizeQty = (raw: string) => {
  const digitsOnly = raw.replace(/\D+/g, "");
  if (digitsOnly === "") return "";           // allow empty
  const stripped = digitsOnly.replace(/^0+/, "");
  return stripped;                            // "05" -> "5", "000" -> "" (empty)
};

/** Parse input into a valid Date. Accepts ISO-like strings or dd/MM/yyyy. */
function toDate(input: string | Date | undefined | null): Date | null {
  if (!input) return null;
  if (input instanceof Date) return isNaN(input.getTime()) ? null : input;

  // dd/MM/yyyy support
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(input);
  if (m) {
    const [, dd, mm, yyyy] = m;
    const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
    return isNaN(d.getTime()) ? null : d;
  }

  // Fallback: ISO / other parseable strings
  const d = new Date(input);
  return isNaN(d.getTime()) ? null : d;
}

/** AU-local calendar date as YYYY-MM-DD (Australia/Sydney). */
export function ausYMD(input: string | Date | undefined | null): string | null {
  const d = toDate(input);
  if (!d) return null;
  return formatInTimeZone(d, "Australia/Sydney", "yyyy-MM-dd HH:mm:ss");
}

export function currentDate(input: string | Date | undefined | null): string | null {
  const d = toDate(input);
  if (!d) return null;
  return formatInTimeZone(d, "Australia/Sydney", "dd-mm-yyyy");
}
export function ausDate(input: string | Date | undefined | null): string | null {
  const d = toDate(input);
  if (!d) return null;
  return formatInTimeZone(d, "Australia/Sydney", "HH:mm, dd MMM yyyy");
}