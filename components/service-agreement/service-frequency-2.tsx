import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { MaybeOption, Option } from "@/lib/interface";

interface Props {
  value?: MaybeOption;
  onChange?: (v: MaybeOption) => void;
  options: {
    label: string;
    value: Option;
    subtext: string;
    recommended?: boolean;
  }[];
}

function ServiceFrequency2({ value, onChange, options }: Props) {

  const handleChange = (v: MaybeOption) => {
    if (v === value) {
      onChange?.(null);
    } else {
      onChange?.(v);
    }
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {options.map((option) => {
        const isSelected = value === option.value;
        const isHighTier = option.value !== "yearly"; // only these get yellow

        const selectedClasses = isSelected
          ? isHighTier
            ? "bg-efg-yellow/5 border-efg-yellow ring-1 ring-efg-yellow"
            : "bg-neutral-75 border-neutral-400 ring-1 ring-neutral-300"
          : "";

        const checkboxClasses = cn(
          "absolute top-4 right-4 cursor-pointer focus-visible:ring-1 focus-visible:ring-efg-yellow focus-visible:border-efg-yellow shadow-none",
          // when selected, tint checkbox by tier
          isSelected &&
            (isHighTier
              ? "efg-checkbox"
              : "data-[state=checked]:bg-neutral-300 data-[state=checked]:border-neutral-300 data-[state=checked]:text-neutral-800")
        );

        return (
          <div
            key={option.value}
            className={cn(
              "flex-1 border border-input h-[100px] rounded-lg relative p-4 text-left transition-colors cursor-pointer shadow-xs",

              selectedClasses
            )}
            onClick={() => handleChange(option.value as MaybeOption)}
          >
            <Checkbox className={checkboxClasses} checked={isSelected} />

            <div className="flex flex-col pr-8">
              <span className="text-base font-medium">{option.label}</span>
              <span className="text-sm text-neutral-500">{option.subtext}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ServiceFrequency2;
