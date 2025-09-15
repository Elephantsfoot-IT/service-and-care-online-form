import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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