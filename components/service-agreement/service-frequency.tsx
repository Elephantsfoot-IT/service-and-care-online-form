import * as React from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

type Option = "quarterly" | "six-monthly" | "yearly";
type MaybeOption = Option | null;

interface Props {
  serviceKey?: string;
  value?: MaybeOption; // controlled value (optional)
  onChange?: (v: MaybeOption) => void; // called when selection changes
  className?: string;
}

const STYLES: Record<
  Option,
  {
    border: string; // border color when selected
    solid: string; // header background when selected
    tint: string; // card background tint when selected
    divide: string; // divider color when selected
    color: string; // header text when selected
    // retained for compatibility (not used now that we use a button)
    checkbox: string;
    subtext1Color: string;
    subtext1SelectedColor: string;
    subtext2Color: string;
    subtext2SelectedColor: string;
  }
> = {
  yearly: {
    border: "border-neutral-300",
    solid: "bg-neutral-300",
    tint: "bg-neutral-300/20",
    divide: "divide-neutral-300",
    color: "text-neutral-800",
    subtext1Color: "text-neutral-600",
    subtext1SelectedColor: "text-neutral-600",
    subtext2Color: "text-neutral-600",
    subtext2SelectedColor: "text-neutral-800",
    checkbox:
      "data-[state=checked]:bg-transparent data-[state=checked]:border-transparent data-[state=checked]:text-neutral-800 shadow-none",
  },
  "six-monthly": {
    border: "border-[#ffdb01]",
    solid: "bg-[#ffdb01]",
    tint: "bg-[#ffdb01]/20",
    divide: "divide-[#ffdb01]",
    color: "text-neutral-800",
    subtext1Color: "text-neutral-600",
    subtext1SelectedColor: "black",
    subtext2Color: "text-neutral-800",
    subtext2SelectedColor: "text-neutral-800",
    checkbox:
      "data-[state=checked]:bg-transparent data-[state=checked]:border-transparent data-[state=checked]:text-neutral-800 shadow-none",
  },
  quarterly: {
    border: "border-efg-blue",
    solid: "bg-efg-blue",
    tint: "bg-efg-blue/10",
    divide: "divide-efg-blue",
    color: "text-white",
    subtext1Color: "text-efg-blue",
    subtext1SelectedColor: "text-white",
    subtext2Color: "text-neutral-800",
    subtext2SelectedColor: "text-neutral-800",
    checkbox:
      "data-[state=checked]:bg-transparent data-[state=checked]:border-transparent data-[state=checked]:text-white shadow-none",
  },
};

// Per-option styles for the "Select" button (replaces checkbox)
const SELECT_BTN: Record<Option, { base: string; selected: string }> = {
  yearly: {
    // neutral outline when unselected
    base: "border border-neutral-300 text-neutral-800 hover:bg-neutral-100",
    // subtle fill when selected
    selected: "bg-neutral-300 text-neutral-900 border-neutral-300",
  },
  "six-monthly": {
    // secondary outline (accented) when unselected
    base: "border border-neutral-300 text-neutral-800 hover:bg-neutral-100",
    // filled when selected
    selected: "bg-[#ffdb01] text-neutral-800 border-[#ffdb01]",
  },
  quarterly: {
    // primary: filled even when unselected (drives selection)
    base: "border border-neutral-300 text-neutral-800 hover:bg-neutral-100",
    // filled when selected (same family, slightly darker is fine)
    selected: "bg-efg-blue text-white border-efg-blue",
  },
};

export function ServiceFrequency({
  value,
  onChange,
  className = "",
  serviceKey,
}: Props) {
  const [internal, setInternal] = React.useState<MaybeOption>(null);
  const selected = value !== undefined ? value : internal;

  const setSelected = (v: MaybeOption) => {
    if (value === undefined) setInternal(v);
    onChange?.(v);
  };

  // 1) Extend your options with subtext3 (optional)
  const options: Array<{
    label: string;
    val: Option;
    subtext1: string;
    subtext2: string;
    subtext3?: string; // NEW
    recommended?: boolean;
  }> = [
    {
      label: "Yearly",
      val: "yearly",
      subtext1: "Annual Service: 1",
      subtext2: "Essential annual maintenance",
      subtext3:
        "Regular scheduled servicing helps prevent build-up and odours and reduces unplanned call-outs. A yearly visit suits low-use sites.",
    },
    {
      label: "6-Monthly",
      val: "six-monthly",
      subtext1: "Annual Service: 2",
      subtext2: "Reliable, scheduled upkeep",
      subtext3:
        "More frequent servicing keeps results steadier across the year and helps issues be addressed before they escalate.",
    },
    {
      label: "Quarterly",
      val: "quarterly",
      subtext1: "Annual Service: 4 | Recommended",
      subtext2: "Proactive care & maximum protection",
      subtext3:
        "Quarterly spreads the work evenly across the year for the most consistent results and the least risk of build-up.",
    },
  ];

  return (
    <div
      className={cn("grid grid-cols-1 sm:grid-cols-3 gap-5 w-full", className)}
    >
      {options.map(({ label, val, subtext1, subtext2, subtext3 }) => {
        const id = `service-frequency-${val}-${serviceKey}`;
        const isChecked = selected === val;
        const s = STYLES[val];

        return (
          <div key={val} className="relative">
            <Label
              htmlFor={id}
              className={cn(
                "col-span-1 flex flex-col cursor-pointer border transition-shadow overflow-hidden rounded-lg h-full", // keep your square look if desired
                "hover:shadow-sm",
                isChecked && `${s.border} ${s.tint}`
              )}
            >
              <div
                className={cn(
                  "w-full divide-y",
                  isChecked ? s.divide : "divide-neutral-200"
                )}
              >
                {/* Header */}
                <div
                  className={cn(
                    "flex items-center justify-between p-3",
                    isChecked && `${s.solid} ${s.border} tier-header`
                  )}
                >
                  <div>
                    <p
                      className={cn(
                        "text-base font-medium leading-none",
                        isChecked && s.color
                      )}
                    >
                      {label}
                    </p>
                    <p
                      className={cn(
                        "text-xs mt-1 font-medium",
                        isChecked ? s.subtext1SelectedColor : s.subtext1Color
                      )}
                    >
                      {subtext1}
                    </p>
                  </div>

                  {/* Select / Selected button (CTA) */}
                  <button
                    type="button"
                    id={id}
                    aria-pressed={isChecked}
                    aria-label={
                      isChecked ? `Selected ${label}` : `Select ${label}`
                    }
                    onClick={() => setSelected(isChecked ? null : val)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-sm font-medium transition-colors cursor-pointer text-xs",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-neutral-300",
                      isChecked
                        ? SELECT_BTN[val].selected
                        : SELECT_BTN[val].base
                    )}
                  >
                    {isChecked ? (
                      <>
                        <Check className="h-4 w-4" aria-hidden />
                      </>
                    ) : (
                      <>Select</>
                    )}
                  </button>
                </div>

                {/* Body */}
                <div className="p-3">
                  <p className={cn("text-sm text-neutral-600")}>{subtext2}</p>

                  {/* <p className={cn("text-xs mt-1 text-neutral-600")}>
                    {subtext3}
                  </p> */}
                </div>
              </div>
            </Label>
          </div>
        );
      })}
    </div>
  );
}
